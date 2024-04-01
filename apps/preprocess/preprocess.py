import os
from extract_fact_descriptor import extract_fact_descriptor
from utils import extract_between_tags
from db import mongo_client, save_to_db
from models import FactDescriptor, ClientType

from llmsherpa.readers import LayoutPDFReader
import anthropic
import instructor
from openai import OpenAI
import time


def get_client(client_type: ClientType):
    if client_type == ClientType.ANTHROPIC:
        return instructor.patch(create=anthropic.Anthropic().messages.create, mode=instructor.Mode.ANTHROPIC_TOOLS)
    elif client_type == ClientType.OPENAI:
        return instructor.patch(OpenAI())
    else:
        raise ValueError("Unsupported client type")

# Extract structured data from natural language

def create_message_with_text(user_text, client_type: ClientType):
    client = get_client(client_type)
    
    if client_type == ClientType.OPENAI:
        # NOTE: OPEN AI IS SIGNIFICANTLY MORE RELIABLE FOR JSON FORMING IN INSTRUCTOR
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_tokens=1024,
            max_retries=3,
            response_model=FactDescriptor, 
            messages=[
                {
                    "role": "user",
                    "content": user_text
                }, 
            ]
        )
    elif client_type == ClientType.ANTHROPIC:
        resp = client(
            model="claude-3-opus-20240229",
            max_tokens=1024,
            max_retries=5,
            messages=[
                {
                    "role": "user",
                    "content": user_text
                }, 
            ],
            response_model=FactDescriptor,
        )
    else:
        raise ValueError("Unsupported client type")
    
    return resp 



COLLECTION_NAME="PreprocessedPdf"
DATABASE_NAME = "paper"
import argparse
def parse_arguments():
    parser = argparse.ArgumentParser(description="Process PDFs and extract structured data.")
    parser.add_argument("--pdf_url", type=str, required=True, help="URL of the PDF to process")
    parser.add_argument("--client_type", type=str, choices=["openai", "anthropic"], required=True, help="Client type to use for processing: 'openai' or 'anthropic'")
    args = parser.parse_args()
    return args.pdf_url, args.client_type.upper()


def preprocess_pdf(pdf_url, client_type):
    llmsherpa_api_url = "https://readers.llmsherpa.com/api/document/developer/parseDocument?renderFormat=all"
    start_time = time.time()
    pdf_reader = LayoutPDFReader(llmsherpa_api_url)
    doc = pdf_reader.read_pdf(pdf_url)
    end_time = time.time()
    print(f"PDF reading took {end_time - start_time} seconds.")
    
    # assume first section.title is the name of the paper
    for section in doc.sections():
        if any(title in section.title for title in ['References']):
            break
        # extract the abstract. TODO: clean up abstract and use abstract as context for parsing other sections
        src = section.to_text(include_children=True, recurse=False)
        if 'Abstract' in src:
            src = src.split('Abstract')[-1] # start the text after Abstract
            # lines = src.split('\n')
            # cleaned_lines = [line for line in lines if not line.startswith(('†', '*'))]
            # src = '\n'.join(cleaned_lines)
            start_time = time.time()
            # response = create_message_with_text(user_text=src, client_type=client_type)
            response = extract_fact_descriptor(src)
            print(response)
            # import pdb; pdb.set_trace()
            
            end_time = time.time()
            print(f"Message creation took {end_time - start_time} seconds.") 
            
            data = {"url": pdf_url,"text": src, "response": response}
            with mongo_client(db_name=DATABASE_NAME, collection_name=COLLECTION_NAME) as collection: 
                result = collection.insert_one(data)
            
        # print(section.title)
        titles_to_print = ['Introduction', 'Background','Results']
        if any(title in section.title for title in titles_to_print):
            for chunk in section.chunks():
                source = chunk.to_text()
                # TODO: generate descriptors and facts
                # TODO: embed descriptors, and store in mongo

# NOTE: openai is a lot more reliable with json forming. 
if __name__ == "__main__":
    pdf_url, client_type_str = parse_arguments()
    client_type = ClientType[client_type_str]
    preprocess_pdf(pdf_url, client_type)
    

    
    






