from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import argparse
import hashlib
import pickle
import os
from llmsherpa.readers import LayoutPDFReader



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
    
    return_text = {}
    # assume first section.title is the name of the paper
    for section in doc.sections():
        if any(title in section.title for title in ['References']):
            break
        # extract the abstract. TODO: clean up abstract and use abstract as context for parsing other sections
        src = section.to_text(include_children=True, recurse=False)
        if 'abstract' in src.lower():
            src = src.lower().split('abstract')[-1] # start the text after abstract. TODO: clean up abstract
            start_time = time.time()
            return_text['abstract'] = src   
            
        print(section.title)
        titles_to_print = ['introduction', 'background', 'results']
        
        for chunk in section.chunks():
            source = chunk.to_text()
            if section.title.lower() in return_text:
                return_text[section.title.lower()] += " " + source
            else:
                return_text[section.title.lower()] = source
        
    outline = [section.title for section in doc.sections()]
    return_text['outline'] = outline

    return return_text

    
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
