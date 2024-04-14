"use server";

import { ParsedPapers, User } from "@prisma/client";
import { api } from "@src/trpc/server";

// Check if user1 is currently following user2 by looking for user2's email in user1's follows list.
export const followAction = async (searchedUser: User, loggedInUser: User) => {
  console.log("follow action");
  try {
    const updatedFollowStatus = await api.user.updateFollowStatus({
      user1: loggedInUser,
      user2: searchedUser,
    });
    return updatedFollowStatus;
  } catch (error) {
    console.error("Failed to update follow status:", error);
    throw new Error("Failed to update follow status.");
  }
};

export const getParsedPaperAction = async (
  pdfUrl: string
): Promise<ParsedPapers | null> => {
  try {
    const parsedPaper = await api.parsedPapers.fetchParsedPdf({
      source: pdfUrl,
    });
    return parsedPaper;
  } catch (error) {
    throw new Error(`Failed to get parsed paper by url: ${pdfUrl}`);
  }
};
export const getAllParsedPaperAction = async (): Promise<string[]> => {
  try {
    const parsedPapers = await api.parsedPapers.fetchAllParsedPdfSources();
    return parsedPapers;
  } catch (error) {
    throw new Error(`Failed to get parsed papers: ${error}`);
  }
};

import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

// ESM
const client = new ChromaClient({ path: "http://0.0.0.0:8000" });

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY as string,
});

export const countItemsInCollection = async (collectionName: string) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
  return await collection.count();
};

export const addItemToCollection = async (
  collectionName: string,
  item: any
) => {
  item = JSON.parse(item);
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
  return await collection.add(item);
};

export const upsertItemInCollection = async (
  collectionName: string,
  item: any
) => {
  // await collection.upsert({
  //   ids: ["id1", "id2", "id3"],
  //   embeddings: [
  //     [1.1, 2.3, 3.2],
  //     [4.5, 6.9, 4.4],
  //     [1.1, 2.3, 3.2],
  //   ],
  //   metadatas: [
  //     { chapter: "3", verse: "16" },
  //     { chapter: "3", verse: "5" },
  //     { chapter: "29", verse: "11" },
  //   ],
  //   documents: ["doc1", "doc2", "doc3"],
  // });
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
  return await collection.upsert(item);
};

export const getItemsFromCollection = async (collectionName: string) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  const response = await collection.add({
    ids: [crypto.randomUUID(), crypto.randomUUID()],
    metadatas: [{ style: "style1" }, { style: "style2" }],
    documents: ["This is a document!", "that is a document!"],
  });
  console.log("get ersponse", response);
  return await collection.get();
};

export const peekItemsFromCollection = async (
  collectionName: string,
  limit: number = 5
) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
  return await collection.peek({ limit });
};

export const queryItemsInCollection = async (
  collectionName: string,
  queryParams: any
) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
  return await collection.query(queryParams);
};

export const deleteItemsFromCollection = async (collectionName: string) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
  return await collection.delete();
};

export const listAllCollections = async () => {
  return await client.listCollections();
};

export const makeNewCollection = async (
  collectionName: string = "ParsedPapers"
) => {
  return await client.createCollection({ name: collectionName });
};

export const getExistingCollection = async (collectionName: string) => {
  return await client.getCollection({ name: collectionName });
};

export const deleteCollection = async (collectionName: string) => {
  return await client.deleteCollection({ name: collectionName });
};

export const createDocsAction = async (formData: FormData) => {
  console.log("embedder", embedder);

  let response;
  try {
    let myCollection;
    try {
      myCollection = await client.getCollection({
        name: "ParsedPapers",
        embeddingFunction: embedder,
      });
    } catch (getCollectionError) {
      console.log("Collection does not exist, creating new one.");
      myCollection = await client.createCollection({
        name: "ParsedPapers",
        embeddingFunction: embedder,
      });
    }
    response = await myCollection.add({
      ids: ["1"],
      documents: [`${formData.get("content")}`],
      metadatas: [{ user: 1, title: `${formData.get("title")}` }],
    });
  } catch (error) {
    console.error("Error caught:", error);
  }

  return { message: `${response}` };
};
