import datetime
import json
import os
import re
import time
import uuid
from contextlib import contextmanager
from pymongo import MongoClient


@contextmanager
def mongo_client(db_name,  collection_name, **kwargs):
    """
    This function creates a context manager for MongoDB client, ensuring the mongo connection is closed. It now accepts additional keyword arguments to pass to the MongoClient.

    :param mongo_user: The MongoDB username.
    :param mongo_pw: The MongoDB password.
    :param base_url: The base URL for the MongoDB connection.
    :param db_name: The name of the database to connect to.
    :param collection_name: The name of the collection to connect to.
    :param kwargs: Additional keyword arguments to pass to MongoClient.
    :return: The MongoDB collection object.
    """

    mongo_user = os.getenv("MONGO_USERNAME")
    mongo_pw = os.getenv("MONGO_PW")
    base_url = os.getenv("MONGO_CONNECTION_URL")
    # db_name = db_name or os.getenv("MONGO_DB_NAME")

    connection_url = f"mongodb+srv://{mongo_user}:{mongo_pw}@{base_url}"

    # Clean the URL by removing quotes
    url = re.sub(r'"', '', connection_url)
    client = MongoClient(url, **kwargs)

    if collection_name:
        print(f"Connecting to Mongo database: {db_name}/{collection_name}")
    else:
        print(f"Connecting to Mongo database: {db_name}")
    try:
        if collection_name is None:
            yield client[db_name]
        else:
            yield client[db_name][collection_name]
    finally:
        client.close()
        
        
def get_collection_list():
    with mongo_client() as client:
        return client.list_collection_names()
 
 
def save_to_db(data: dict, collection_name):
    """
    This function saves a given data to a MongoDB collection.

    :param data: The data to be saved. It should be a dictionary.
    :param collection_name: The name of the collection where the data will be saved. Default is "tables".
    :return: The result of the insert operation.
    """
    with mongo_client(collection_name) as collection:
        # Get the current time
        current_time = datetime.datetime.utcnow()

        # Convert it to a Unix timestamp
        unix_timestamp = int(time.mktime(current_time.timetuple()))
        data["created_at"] = unix_timestamp
        result = collection.insert_one(data)

        print(f"saved result to {collection_name} db.", result, f"created at {unix_timestamp}")
        return result

def find_one(query: dict, collection_name):
    """
    This function finds one document in a MongoDB collection that matches the given query.

    :param query: The query to match. It should be a dictionary.
    :param collection_name: The name of the collection where the search will be performed. Default is "tables".
    :return: The document that matches the query. If no document matches, it returns None.
    """
    with mongo_client(collection_name) as collection:
        document = collection.find_one(query)
        return document
    
        