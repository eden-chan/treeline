import os
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
            response = create_message_with_text(user_text=src, client_type=client_type)
            end_time = time.time()
            print(f"Message creation took {end_time - start_time} seconds.")    
            
            data = {"url": pdf_url,"text": src, "fact": response.fact, "relevance": response.relevance, "nextSource": response.nextSource, "expectedInfo": response.expectedInfo}
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
    # preprocess_pdf(pdf_url, client_type)
    
    import json 
    client = anthropic.Anthropic()
    MODEL_NAME = "claude-3-opus-20240229"
    
    example = """
    Each of these additional dictionaries should be put in separate <fact_descriptor> tags.
    
    Example:
    <fact>
    {
        "fact1": "The concept of attention mechanisms in neural networks allows models to focus on specific parts of the input for making decisions."
    }   
    </fact>
    <fact_descriptor>
    {
    "fact": "The concept of attention mechanisms in neural networks allows models to focus on specific parts of the input for making decisions.",
    "relevance": "Explains the core concept behind the paper's methodology.",
    "nextSource": "Section 3.1",
    "expectedInfo": "Detailed explanation of the attention mechanism used in the model."
    }
    </fact_descriptor>
    """
    
    CORPUS_DATA = """The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder.
The best performing models also connect the encoder and decoder through an attention mechanism.
We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.
Our model achieves 28.4 BLEU on the WMT 2014 Englishto-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU.
On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.
We show that the Transformer generalizes well to other tasks by applying it successfully to English constituency parsing both with large and limited training data.
∗Equal contribution.""" 

    message_content = f"""
    CORPUS_DATA={CORPUS_DATA}
    
    Give me a JSON dict with facts.
    Facts provide information directly relevant to the question (or where to find more information in the text) - either supplementary data, facts, or where the answer might be located, like pages and sections. Add definitions and other context from the page into the fact, so it's self-explanatory.
    Put this dictionary in <fact> tags.

    Then, for each fact, output an additional JSON dictionary according to the following schema:
    relevance: How is this fact relevant to the answer?
    nextSource: a page number, a section name, or other descriptors of where to look for more information.
    expectedInfo: What information is expected to be found at the next source?

    {example}
    """


    message = client.messages.create(
        model=MODEL_NAME,
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": message_content
            },
            {
                "role": "assistant",
                "content": "Here is the JSON requested:"
            }
        ],
    ).content[0].text
    print(message)



    facts_dict = json.loads(extract_between_tags("fact", message)[0])
    facts_descriptor_dicts = [
        json.loads(d)
        for d in extract_between_tags("fact_descriptor", message)
    ]
    






