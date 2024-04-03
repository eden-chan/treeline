import os
from typing import List


from llmsherpa.readers import LayoutPDFReader

import time
import argparse
import hashlib
import pickle
import os



def parse_arguments():
    parser = argparse.ArgumentParser(description="Process PDFs and extract structured data.")
    parser.add_argument("--pdf_url", type=str, required=True, help="URL of the PDF to process")
    # parser.add_argument("--client_type", type=str, choices=["openai", "anthropic"], required=True, help="Client type to use for processing: 'openai' or 'anthropic'")
    args = parser.parse_args()
    return args.pdf_url


def preprocess_pdf(pdf_url):
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
    
    import pdb; pdb.set_trace()
    
    # assume first section.title is the name of the paper
    for section in doc.sections():
        if any(title in section.title for title in ['References']):
            break
        # extract the abstract. TODO: clean up abstract and use abstract as context for parsing other sections
        src = section.to_text(include_children=True, recurse=False)
        if 'Abstract' in src:
            src = src.split('Abstract')[-1] # start the text after Abstract. TODO: clean up abstract
            start_time = time.time()
            import pdb; pdb.set_trace()
            print('')
            
            

            

            
            
        # print(section.title)
        titles_to_print = ['Introduction', 'Background','Results']
        if any(title in section.title for title in titles_to_print):
            for chunk in section.chunks():
                source = chunk.to_text()
                # TODO: generate descriptors and facts
                # TODO: embed descriptors, and store in mongo




if __name__ == "__main__":
    pdf_url= parse_arguments()
    preprocess_pdf(pdf_url)
    # client_type = ClientType[client_type_str]
    # query = "Details on the performance of the Transformer model"
    # load into memory
    # add_documents_to_choma()
    # results = similarity_search(query, n_results=3)    
    
    # relevant_facts = results['documents'][0]
    # relevant_metadata = results['metadatas'][0]
    # print(relevant_facts)
    
    


    