from uuid import uuid4
from db import mongo_client

from utils import DATABASE_NAME, COLLECTION_NAME, get_embedding
import chromadb


def add_documents_to_choma():
    with mongo_client(db_name=DATABASE_NAME, collection_name=COLLECTION_NAME) as db: 
        docs = [x for x in db.find({})]
    
    documents = []
    embeddings = []
    metadatas = []
    ids = []

    for doc in docs:
        for fact in doc['facts']:
            documents.append(fact['fact'])
            embeddings.append(fact['descriptor_embedding'])
            metadatas.append({
                "source": doc['url'],
                "relevance": fact['relevance'],
                "nextSource": fact['nextSource'],
                "expectedInfo": fact['expectedInfo']
            })
            ids.append(str(uuid4()))
    chroma_client = chromadb.Client()

    collection = chroma_client.create_collection(name="my_collection")

    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

def similarity_search(query, n_results=3):
    chroma_client = chromadb.Client()
    collection = chroma_client.get_collection("my_collection")
    query_texts=[query]
    query_embedding = [get_embedding(text) for text in query_texts]

    results = collection.query(
        query_embeddings=[*query_embedding],
        n_results=n_results
    )
    return results 
