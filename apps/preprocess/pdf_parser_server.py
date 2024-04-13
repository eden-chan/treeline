from db import mongo_client
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import os
from models import ExtractFactDescriptor, FactDescriptor, ClientType
import instructor
from openai import OpenAI

from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import tempfile
from llama_parse import LlamaParse
import httpx
from llama_index.core.node_parser import MarkdownNodeParser



client = instructor.patch(OpenAI())



def chat(user_text, response_model):
    try:
        resp = client.chat.completions.create(
                model="gpt-3.5-turbo",
                max_tokens=1024,
                max_retries=3,
                response_model=response_model,
                messages=[
                    {
                        "role": "user",
                        "content": user_text
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

    # Assuming you have a temporary file setup as before
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(response.content)
        temp_pdf_path = temp_file.name

    # Correctly await the asynchronous call to LlamaParse.aload_data
    documents = await LlamaParse(result_type="markdown").aload_data(file_path=temp_pdf_path)
    print(documents[0].text[:1000] + '...')
    
    parser = MarkdownNodeParser()

    nodes = parser.get_nodes_from_documents(documents)

    with ThreadPoolExecutor() as executor:
        try:
            futures = [executor.submit(chat, node.text, ExtractFactDescriptor) for node in nodes]
            parsing = [future.result() for future in as_completed(futures)]
            # Ensure proper serialization of the facts
            # import pdb; pdb.set_trace()
            facts = [parsing_item.fact_descriptors for parsing_item in parsing]
            facts_serialized = [fact_descriptor.dict() for fact in facts for fact_descriptor in fact]
            title = nodes[0].text.split('\n')[0]
            
            sections = [{'text': node.text, 'metadata': node.metadata} for node in nodes]
            
            with mongo_client(db_name='paper', collection_name='ParsedPapers') as db: 
                filter_query = {"source": pdf_url}
                update_data = {"$set": {"title": title, "facts": facts_serialized, 'sections': sections}}
                result = db.update_one(filter_query, update_data, upsert=True)
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
    
    
    response = {"source": pdf_url, 'sections': sections, 'facts': facts_serialized, 'title': title, "mongo_id": mongo_id }
    return response
    
app = FastAPI()

class PDFRequest(BaseModel):
    pdf_url: str

@app.post("/process_pdf/")
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



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
