from typing import List
import uuid
from constants import CATEGORY_MAPPING
from db import mongo_client
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, BeforeValidator
import time
import os
from models import EMBEDDING_TYPE, AbstractRanker, ExtractFactDescriptor, FactDescriptor, ClientType, TitleRanker
import instructor
from openai import OpenAI

from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import tempfile
from llama_parse import LlamaParse
from llama_index.core.node_parser import MarkdownNodeParser
import arxiv
from datetime import datetime
import httpx
import pysqlite3
import sys
sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")
import chromadb
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction
from starlette.middleware.cors import CORSMiddleware


embedding_function = OpenAIEmbeddingFunction(api_key=os.environ.get('OPENAI_API_KEY'))
app = FastAPI()
origins = [
    "http://localhost:3000", 
    "https://ourslash.company",# Adjust if your Next.js app runs on a different port
]

# Add CORSMiddleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

client = instructor.patch(OpenAI())
chroma_client = chromadb.HttpClient(host=os.environ.get('CHROMA_URL'))

class PaperMetadata(BaseModel):
    title: str
    summary: str
    published: datetime
    updated: datetime
    primary_category: str


def semantic_scholar_extract(pdf_url:str):
    paper_id = pdf_url.split('/')[-1].split('.pdf')[0]
    paper_id=f'ARXIV:{paper_id}'
    response = requests.get(f'https://api.semanticscholar.org/graph/v1/paper/{paper_id}', params={'fields': 'authors,influentialCitationCount,tldr,referenceCount,citationCount,title,references,citations'})
    response_json = response.json()
    return response_json
    
    
def extract_paper_metadata(pdf_url:str) -> PaperMetadata:
    paper_id = pdf_url.split('/')[-1].split('.pdf')[0]
    search = arxiv.Search(id_list=[paper_id])
    paper = next(search.results())
    
     # Extract the title and authors from the arXiv metadata
    title = paper.title
    authors = ' '.join([author.name for author in paper.authors])
    paper_metadata = PaperMetadata(
        title=paper.title, 
        summary=paper.summary, 
        published=paper.published, 
        updated=paper.updated, 
        primary_category=CATEGORY_MAPPING.get(paper.primary_category, 'Other')
    )
    return paper_metadata


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
    try: 
        print('attempt to parse', pdf_url)

        response =  requests.get(pdf_url)
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
        paper_metadata:PaperMetadata =extract_paper_metadata(pdf_url)
        title=paper_metadata.title 
        abstract=paper_metadata.summary
        published=paper_metadata.published
        updated=paper_metadata.updated
        primary_category=paper_metadata.primary_category
        with mongo_client(db_name='paper', collection_name='ParsedPaper') as db: 
            filter_query = {"source": pdf_url}
            update_data = {"$set": {"title": title, "abstract": abstract, 'primary_category': primary_category, 'published': published, 'updated': updated}}
            result = db.update_one(filter_query, update_data, upsert=True)
        
        
        return title
    except Exception as e:
        print('exception', e)
    

class PDFRequest(BaseModel):
    pdf_url: str

@app.post("/process_pdf")
async def process_pdf(request: PDFRequest):
    try:
        # Assuming preprocess_pdf is a function that processes the PDF and returns a result                
        start_time = time.time()
        result = parse_pdf(request.pdf_url)
        end_time = time.time()

        print(f"PDF parsing took {end_time - start_time} seconds.")
        return {"message": "PDF processed successfully", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF. {e}")


@app.post("/fetch_paper")
async def fetch_paper(request: PDFRequest):
    try:
        extract_info = extract_paper_metadata(request.pdf_url)
        return {"message": "Arxiv Fetch successfully", "data": extract_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF. {e}")

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pdf_parser_server:app", host="0.0.0.0", port=3001, reload=True)
    
     




    
    """
    SEMBANTIC scholar resources
    [''_abstract', '_authors', '_citationCount', '_citationStyles', '_citations', 
    '_corpusId', '_data', '_embedding', '_externalIds', '_fieldsOfStudy',
    '_influentialCitationCount', '_init_attributes', '_isOpenAccess',
    '_journal', '_openAccessPdf', '_paperId', '_publicationDate', 
    '_publicationTypes', '_publicationVenue', '_referenceCount', '_references', 
    '_s2FieldsOfStudy', '_title', '_tldr', '_url', '_venue', '_year', 'abstract',
    'authors', 'citationCount', 'citationStyles', 'citations', 'corpusId', 'embedding',
    'externalIds', 'fieldsOfStudy', 'influentialCitationCount', 'isOpenAccess', 'journal', 
    'keys', 'openAccessPdf', 'paperId', 'publicationDate', 'publicationTypes', 'publicationVenue',
    'raw_data', 'referenceCount', 'references', 's2FieldsOfStudy', 'title', 'tldr', 'url', 
    'venue', 'year']
    """