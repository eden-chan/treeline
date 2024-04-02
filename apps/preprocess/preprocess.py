import os
from typing import List
from similarity_search import add_documents_to_choma, similarity_search
from extract_fact_descriptor import extract_fact_descriptor
from utils import extract_between_tags, COLLECTION_NAME, DATABASE_NAME, get_embedding
from db import mongo_client, save_to_db
from models import ExtractFactDescriptor, FactDescriptor, ClientType

from llmsherpa.readers import LayoutPDFReader
import anthropic
import instructor
from openai import OpenAI
import time
import argparse
import hashlib
import pickle
import os




def get_client(client_type: ClientType):
    if client_type == ClientType.ANTHROPIC:
        return instructor.patch(create=anthropic.Anthropic().messages.create, mode=instructor.Mode.ANTHROPIC_TOOLS)
    elif client_type == ClientType.OPENAI:
        return instructor.patch(OpenAI())
    else:
        raise ValueError("Unsupported client type")


def chat(user_text, client_type: ClientType, response_model):
    client = get_client(client_type)
    
    if client_type == ClientType.OPENAI:
        # NOTE: OPEN AI IS SIGNIFICANTLY MORE RELIABLE FOR JSON FORMING IN INSTRUCTOR
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
    elif client_type == ClientType.ANTHROPIC:
        resp = client(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            max_retries=5,
            messages=[
                {
                    "role": "user",
                    "content": user_text
                }, 
            ],
            response_model=response_model,
        )
    else:
        raise ValueError("Unsupported client type")
    
    return resp 

def parse_arguments():
    parser = argparse.ArgumentParser(description="Process PDFs and extract structured data.")
    parser.add_argument("--pdf_url", type=str, required=True, help="URL of the PDF to process")
    parser.add_argument("--client_type", type=str, choices=["openai", "anthropic"], required=True, help="Client type to use for processing: 'openai' or 'anthropic'")
    args = parser.parse_args()
    return args.pdf_url, args.client_type.upper()


def preprocess_pdf(pdf_url, client_type):
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
    
    # assume first section.title is the name of the paper
    for section in doc.sections():
        if any(title in section.title for title in ['References']):
            break
        # extract the abstract. TODO: clean up abstract and use abstract as context for parsing other sections
        src = section.to_text(include_children=True, recurse=False)
        if 'Abstract' in src:
            src = src.split('Abstract')[-1] # start the text after Abstract. TODO: clean up abstract
            start_time = time.time()
            if client_type == ClientType.OPENAI:
                response = chat(user_text=src, client_type=client_type, response_model=ExtractFactDescriptor)
            # elif client_type == ClientType.ANTHROPIC: TODO: add support for Claude
            #     response = extract_fact_descriptor(src)
            #     for fact_obj in response: 
            #         # DO embeddings
            #         pass 
            else:
                raise ValueError("Unsupported client type")
            import pdb; pdb.set_trace()

            fact_descriptors = [{**x.dict(), 'descriptor_embedding': get_embedding(x.nextSource + x.expectedInfo)} for x in response.fact_descriptors]

            end_time = time.time()
            print(f"Message creation took {end_time - start_time} seconds.") 
            
            data = {"url": pdf_url,"text": src, "facts": fact_descriptors}
            with mongo_client(db_name=DATABASE_NAME, collection_name=COLLECTION_NAME) as collection: 
                result = collection.insert_one(data)
            
        # print(section.title)
        titles_to_print = ['Introduction', 'Background','Results']
        if any(title in section.title for title in titles_to_print):
            for chunk in section.chunks():
                source = chunk.to_text()
                # TODO: generate descriptors and facts
                # TODO: embed descriptors, and store in mongo




if __name__ == "__main__":
    pdf_url, client_type_str = parse_arguments()
    client_type = ClientType[client_type_str]
    query = "Details on the performance of the Transformer model"
    # load into memory
    add_documents_to_choma()
    results = similarity_search(query, n_results=3)    
    
    relevant_facts = results['documents'][0]
    relevant_metadata = results['metadatas'][0]
    print(relevant_facts)
    
    


    