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

import { ChromaClient, IncludeEnum, OpenAIEmbeddingFunction } from "chromadb";

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

export const getItemsFromCollection = async (
  collectionName: string,
  source: string
) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  const response = await collection.get({
    // ids: ["id1", "id2"],
    where: { source },
    limit: 10,
    offset: 0,
    include: [
      IncludeEnum.Embeddings,
      IncludeEnum.Metadatas,
      IncludeEnum.Documents,
    ],
    // whereDocument: { $contains: "value" },
  });

  return response;
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
  source: string,
  query: string,
  limit: number = 5
) => {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  const response = await collection.query({
    // ids: ["id1", "id2"],
    queryTexts: [query],
    where: { source: { $eq: source } },
    nResults: limit,

    include: [
      IncludeEnum.Embeddings,
      IncludeEnum.Metadatas,
      IncludeEnum.Documents,
    ],
    // whereDocument: { $contains: "value" },
  });
  return response;
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
  return await client.createCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
};

export const getExistingCollection = async (collectionName: string) => {
  return await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });
};

export const deleteCollection = async (collectionName: string) => {
  return await client.deleteCollection({ name: collectionName });
};
