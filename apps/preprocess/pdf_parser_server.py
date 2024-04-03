from db import mongo_client
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import argparse
import hashlib
import pickle
import os
from llmsherpa.readers import LayoutPDFReader
from models import ExtractFactDescriptor, FactDescriptor, ClientType
import instructor
from openai import OpenAI

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


from concurrent.futures import ThreadPoolExecutor, as_completed

async def parse_pdf(pdf_url):
    cache_dir = "cache"
    os.makedirs(cache_dir, exist_ok=True)
    cache_key = hashlib.md5(pdf_url.encode('utf-8')).hexdigest()
    cache_path = os.path.join(cache_dir, f"{cache_key}.pkl")

    start_time = time.time()
    
    if os.path.exists(cache_path):
        with open(cache_path, "rb") as cache_file:
            doc = pickle.load(cache_file)
    else:
        llmsherpa_api_url = "https://readers.llmsherpa.com/api/document/developer/parseDocument?renderFormat=all"
        pdf_reader = LayoutPDFReader(llmsherpa_api_url)
        doc = pdf_reader.read_pdf(pdf_url)
        with open(cache_path, "wb") as cache_file:
            pickle.dump(doc, cache_file)
    end_time = time.time()
    
    print(f"PDF reading took {end_time - start_time} seconds.")
    
    outline = [section.title for section in doc.sections()]
    title=doc.sections()[0].title    
    return_text = {'title':title,'outline':outline, 'sections':[]}
    tasks = []
    overall_start_time = time.time()  # Start timing the overall process
    with ThreadPoolExecutor(max_workers=5) as executor:
        # assume first section.title is the name of the paper
        for section in doc.sections():
            if any(title in section.title for title in ['References']):
                break
            tasks.append(executor.submit(process_section, section, pdf_url))

        for future in as_completed(tasks):
            parsed_section = future.result()
            return_text['sections'].append(parsed_section)


    data = {"url": pdf_url,"text": return_text, "title": title}
    try:
        with mongo_client(db_name='paper', collection_name='ParsedPapers') as collection: 
            result = collection.update_one({'url': pdf_url}, {'$set': data}, upsert=True)
    except Exception as e:
        print(f"An error occurred while updating the database: {e}")
    
    overall_end_time = time.time()  # End timing the overall process
    print(f"Overall processing took {overall_end_time - overall_start_time} seconds.")
    return return_text

def process_section(section, pdf_url):
    start_time = time.time()  # Start timing the process_section function
    return_content = {} # TODO: fix this BS

    src = section.to_text(include_children=True, recurse=False)
    # if 'abstract' in src.lower():
    #     src = src.lower().split('abstract')[-1]
        # response : ExtractFactDescriptor= chat(user_text=src, response_model=ExtractFactDescriptor)
        # abstract_section = {'name': 'abstract', 'text': src, 'page': section.page_idx, 'facts': [x.dict() for x in response.fact_descriptors] }
        # if response:
        #     abstract_section['facts'] = [x.dict() for x in response.fact_descriptors]
        #     section_data = {"url": pdf_url, "text": abstract_section, 'page': section.page_idx}
        # return_content.append(abstract_section)
    
    section_title_lower = section.title.lower()
    section_content = {'name': section_title_lower, 'text': '', 'page': section.page_idx, 'facts': [] }
    
    for chunk in section.chunks():
        source = chunk.to_text()
        section_content['text'] += " " + source if section_content['text'] else source
        # section_content['page'] = chunk.page_idx
            
    # if section_content['text']:
    src = section_content['text']
    response : ExtractFactDescriptor= chat(user_text=src, response_model=ExtractFactDescriptor)
    section_content['facts'] = [x.dict() for x in response.fact_descriptors]
    # return_text.append(section_content)

    end_time = time.time()  # End timing the process_section function
    print(f"Processing {section.title} took {end_time - start_time} seconds.")  # Print out how long it took

    return section_content

    
app = FastAPI()

class PDFRequest(BaseModel):
    pdf_url: str

@app.post("/process_pdf/")
async def process_pdf(request: PDFRequest):
    try:
        # Assuming preprocess_pdf is a function that processes the PDF and returns a result
        result = await parse_pdf(request.pdf_url)
        
        return {"message": "PDF processed successfully", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the PDF.")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
