from typing import List
from constants import CATEGORY_MAPPING
from db import mongo_client
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, BeforeValidator
import time
import os
from models import AbstractRanker, ExtractFactDescriptor, FactDescriptor, ClientType, TitleRanker
import instructor
from openai import OpenAI

from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import tempfile
from llama_parse import LlamaParse
import httpx
from llama_index.core.node_parser import MarkdownNodeParser



import arxiv
from pydantic import BaseModel
from datetime import datetime

class PaperMetadata(BaseModel):
    title: str
    summary: str
    published: datetime
    updated: datetime
    primary_category: str





    
def extract_paper_metadata(pdf_url:str) -> PaperMetadata:
    paper_id = pdf_url.split('/')[-1].split('.pdf')[0]
    search = arxiv.Search(id_list=[paper_id])
    paper = next(search.results())
    
    
     # Extract the title and authors from the arXiv metadata
    title = paper.title
    authors = ' '.join([author.name for author in paper.authors])

    # Query the Semantic Scholar API to get the citation count
    url = f"https://api.semanticscholar.org/graph/v1/paper/search?query={title} {authors}"
    response = requests.get(url)
    data = response.json()

    if 'total' in data and data['total'] > 0:
        paper_id = data['data'][0]['paperId']
        citation_count = data['data'][0]['citationCount']
        # return citation_count
    # else:
        # return None

    import pdb; pdb.set_trace()
    

        
    paper_metadata = PaperMetadata(
        title=paper.title, 
        summary=paper.summary, 
        published=paper.published, 
        updated=paper.updated, 
        primary_category=CATEGORY_MAPPING.get(paper.primary_category, 'Other')
    )
    return paper_metadata

client = instructor.patch(OpenAI())
def extract_title(title_candidates: List[str]):
    try:
        qa: TitleRanker = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_retries=2,
            response_model=TitleRanker,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at identifying the most likely title for research papers from a list of sentences. Select the sentence that is most likely to be the title.",
                },
                {
                    "role": "user",
                    "content": f"Here are the title candidates: {title_candidates}\n\n Rank each candidate by how likely it's the title of the paper.",
                },
            ],
        )
    except Exception as e:
        print(e)
    highest_confidence_title = max(qa.ranked_candidates, key=lambda x: x.confidence)
    return highest_confidence_title.candidate

def extract_abstract(abstract_candidates: List[str]):
    try:
        qa: AbstractRanker = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_retries=2,
            response_model=AbstractRanker,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at identifying the most likely abstract for research papers from a list of candidate text. A research paper abstract is usually prefaced by ABSTRACT. If it\s not prefaced by ABSTRACT it is unlikely to be the abstract. It should briefly summarize the paper\'s purpose, research problem, methodology, major findings, conclusions, and implications. The candidate text can also not be relevant at all to the abstract. Select candidate that is most likely to be the abstract.",
                },
                {
                    "role": "user",
                    "content": f"Here are the abstract candidates: {abstract_candidates}\n\n Rank each candidate by how likely it's the title of the paper.",
                },
            ],
        )
    except Exception as e:
        print(e)
    highest_confidence_abstract = max(qa.ranked_candidates, key=lambda x: x.confidence)
    return highest_confidence_abstract.candidate


def chat(text_chunk, metadata, abstract, response_model):
    try:
        resp = client.chat.completions.create(
                model="gpt-3.5-turbo",
                max_tokens=1024,
                max_retries=3,
                response_model=response_model,
                messages=[
                     {
                        "role": "system",
                        "content": f"You are an expert at coming up with facts and questions to help beginners understand a field of research when reading research papers. Ask questions that will help you understand the provided TEXT_CHUNK and SOURCE_LOCATION better based on PROVIDED_ABSTRACT to guide your questions. PROVIDED_ABSTRACT=\"\"\"{abstract}\"\"\""
                    }, 
                    {
                        "role": "user",
                        "content": f"TEXT_CHUNK=\"\"\"{text_chunk}\"\"\" SOURCE_LOCATION=\"\"\"{metadata}\"\"\""
                    }, 
                ]
            )
    except Exception as e:
        print(f"An error occurred while generating chat completions: {e}")
        resp = None
    return resp


async def parse_pdf(pdf_url):
    # Use httpx.AsyncClient for asynchronous HTTP requests
    async with httpx.AsyncClient() as client:
        response = await client.get(pdf_url)
        
    if not response.headers["Content-Type"] == "application/pdf":
        raise HTTPException(status_code=400, detail="The provided URL does not point to a PDF document.")
    
    try:
        # Assuming you have a temporary file setup as before
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(response.content)
            temp_pdf_path = temp_file.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create a temporary PDF file: {str(e)}")

    # Correctly await the asynchronous call to LlamaParse.aload_data
    documents = await LlamaParse(result_type="markdown").aload_data(file_path=temp_pdf_path)
    print(documents[0].text[:1000] + '...')
    
    parser = MarkdownNodeParser()

    nodes = parser.get_nodes_from_documents(documents)

    with ThreadPoolExecutor() as executor:
        try:
            
            paper_metadata:PaperMetadata =extract_paper_metadata(pdf_url)
            title=paper_metadata.title 
            abstract=paper_metadata.summary
            published=paper_metadata.published
            updated=paper_metadata.updated
            primary_category=paper_metadata.primary_category
            
        
            futures = [executor.submit(chat, node.text, node.metadata, abstract, ExtractFactDescriptor) for node in nodes]
            parsing = [future.result() for future in as_completed(futures)]

            facts = [parsing_item.fact_descriptors for parsing_item in parsing]
            facts_serialized = [fact_descriptor.dict() for fact in facts for fact_descriptor in fact]
            
            sections = [{'text': node.text, 'metadata': node.metadata} for node in nodes]
            
            with mongo_client(db_name='paper', collection_name='ParsedPapers') as db: 
                filter_query = {"source": pdf_url}
                update_data = {"$set": {"title": title, "abstract": abstract, "facts": facts_serialized, 'sections': sections, 'primary_category': primary_category, 'published': published, 'updated': updated}}
                result = db.update_one(filter_query, update_data, upsert=True)
            
            # TODO: embed in CHROMA 
        except Exception as e:
            print(f"An error occurred during parsing or database update: {e}")
            # Optionally, handle the error, e.g., by setting response_id to None or re-raising the exception
            response_id = None
            
    # Check if the document was inserted
    if result.upserted_id is not None:
        mongo_id = str(result.upserted_id)
        print(f"Document inserted with id {mongo_id}.")
    else:
        # The document was updated, find it to get the ID
        with mongo_client(db_name='paper', collection_name='ParsedPapers') as db: 
            updated_document = db.find_one(filter_query)
        if updated_document:
            mongo_id = str(updated_document['_id'])
            print(f"Document updated. ID: {mongo_id}")
        else:
            print("Document not found after update.")
            mongo_id = None
    
    
    response = {"source": pdf_url, 'sections': sections, 'facts': facts_serialized, 'title': title, "abstract": abstract, "mongo_id": mongo_id }
    return response
    
app = FastAPI()

class PDFRequest(BaseModel):
    pdf_url: str

@app.post("/process_pdf")
async def process_pdf(request: PDFRequest):
    try:
        # Assuming preprocess_pdf is a function that processes the PDF and returns a result                
        start_time = time.time()
        result = await parse_pdf(request.pdf_url)
        end_time = time.time()

        print(f"PDF parsing took {end_time - start_time} seconds.")
        return {"message": "PDF processed successfully", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF. {e}")


@app.post("/fetch_papers")
async def fetch_paper(request: PDFRequest):
    try:
        extract_info = extract_paper_metadata(request.pdf_url)
        return {"message": "Arxiv Fetch successfully", "data": extract_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF. {e}")
    
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pdf_parser_server:app", host="0.0.0.0", port=3001, reload=True)
