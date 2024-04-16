"use server";

import { ParsedPapers, ParsedPapersFacts, User } from "@prisma/client";
import { EMBEDDING_TYPE } from "@src/lib/types";
import { TitleSourcePair } from "@src/server/api/routers/parsed-pdf";
import { api } from "@src/trpc/server";

// Check if user1 is currently following user2 by looking for user2's email in user1's follows list.
export const followAction = async (searchedUser: User, loggedInUser: User) => {
  console.debug("follow action");
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
export const getAllParsedPaperAction = async (): Promise<TitleSourcePair[]> => {
  try {
    const parsedPapers = await api.parsedPapers.fetchAllParsedSources();
    return parsedPapers;
  } catch (error) {
    throw new Error(`Failed to get parsed papers: ${error}`);
  }
};

import { ChromaClient, IncludeEnum, OpenAIEmbeddingFunction } from "chromadb";

// ESM
const client = new ChromaClient({ path: process.env.CHROMA_URL });

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

export const queryFacts = async (
  collectionName: string,
  source: string,
  queryTexts: string[] = [],
  queryEmbeddings: number[] = [],
  limit: number = 1
) => {
  if (queryTexts.length > 0 && queryEmbeddings.length > 0) {
    throw new Error(
      "Queries can be made either by texts or embeddings, not both."
    );
  }
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  console.debug("chroma ", { collection });
  const relevantFactsDescriptors = await collection.query({
    where: {
      $and: [
        { source: { $eq: source } },
        { type: { $eq: EMBEDDING_TYPE.FactDescriptor } },
      ],
    },
    nResults: limit,
    include: [
      IncludeEnum.Embeddings,
      IncludeEnum.Metadatas,
      IncludeEnum.Documents,
    ],
    ...(queryTexts.length >= 1 && { queryTexts: queryTexts }),
    ...(queryEmbeddings.length >= 1 && { queryEmbeddings: queryEmbeddings }),
  });

  return relevantFactsDescriptors;
};

export const querySourceText = async (
  collectionName: string,
  source: string,
  queryTexts: string[] = [],
  queryEmbeddings: number[] = [],
  limit: number = 1
) => {
  if (queryTexts.length > 0 && queryEmbeddings.length > 0) {
    throw new Error(
      "Queries can be made either by texts or embeddings, not both."
    );
  }
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  const retrievedRelevantSourceText = await collection.query({
    where: {
      $and: [
        { source: { $eq: source } },
        { type: { $eq: EMBEDDING_TYPE.SourceText } },
      ],
    },
    nResults: limit,
    include: [
      IncludeEnum.Embeddings,
      IncludeEnum.Metadatas,
      IncludeEnum.Documents,
    ],
    ...(queryTexts.length >= 1 && { queryTexts: queryTexts }),
    ...(queryEmbeddings.length >= 1 && { queryEmbeddings: queryEmbeddings }),
  });

  return retrievedRelevantSourceText;
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

export const loadEmbeddings = async (formData: FormData) => {
  "use server";

  const pdfUrl = formData.get("source")!.toString();
  const collectionName = formData.get("collection")!.toString();
  const paper = await getParsedPaperAction(pdfUrl);

  if (paper) {
    const { abstract, title, facts, sections } = paper;
    // TODO: pass in relevant sections per each fact
    // idea: in metadata specify which section the fact was retrieved. this would be done in python
    const metadata = facts.map(({ fact, relevance }: ParsedPapersFacts) => ({
      fact,
      relevance,
      source: pdfUrl,
      type: EMBEDDING_TYPE.FactDescriptor,
    }));
    const documents = facts.map(
      ({ expectedInfo, nextSource }: ParsedPapersFacts) =>
        `${expectedInfo} ${nextSource}`
    );
    // We can embed the descriptors, and use them to search the document for new chunks of information that were missed by the previous round of retrieval.
    const minLengthFactDescriptors = Math.min(
      metadata.length,
      documents.length
    );

    const item = {
      ids: Array(minLengthFactDescriptors)
        .fill(null)
        .map(() => crypto.randomUUID()),
      metadatas: metadata.slice(0, minLengthFactDescriptors),
      documents: documents.slice(0, minLengthFactDescriptors),
    };
    console.debug(item);

    console.debug("upserting fact-descriptors...", metadata);
    let startTime = performance.now();
    await upsertItemInCollection(collectionName, item);

    let endTime = performance.now();
    console.debug(
      `Time taken to upsert fact descriptors in collection: ${endTime - startTime} milliseconds`
    );

    // Descriptors $`{expectedInfo + nextSource}` embedding semantic distance is close to Section Location, to get associated section source text
    const sectionSourceTextLocation = sections.map((section) => {
      const { metadata } = section;
      return `${metadata.Header_1 || ""} ${metadata.Header_2 || ""} ${metadata.Header_3 || ""} ${metadata.Header_4 || ""} ${metadata.Header_5 || ""}`.trim();
    });

    const sectionSourceTextContent = sections.map((section) => {
      const { text } = section;
      return {
        text: `${text}`.trim(),
        source: pdfUrl,
        type: EMBEDDING_TYPE.SourceText,
      };
    });

    const minLength = Math.min(
      sectionSourceTextContent.length,
      sectionSourceTextLocation.length
    );
    const sectionItem = {
      ids: Array(minLength)
        .fill(null)
        .map(() => crypto.randomUUID()),
      metadatas: sectionSourceTextContent.slice(0, minLength),
      documents: sectionSourceTextLocation.slice(0, minLength),
    };

    // console.debug(sectionItem);
    // Object.keys(sectionItem).forEach((key) =>
    //   console.debug(`${key}: ${sectionItem[key].length}`)
    // );

    console.debug("upserting section source text...");
    startTime = performance.now();
    await upsertItemInCollection(collectionName, sectionItem);
    endTime = performance.now();
    console.debug(
      `Time taken to upsert source text in collection: ${endTime - startTime} milliseconds`
    );
  }
};
export const ragQuery = async (
  collectionName: string,
  source: string,
  query: string
) => {
  if (collectionName && source) {
    const factResults = await queryFacts(
      collectionName,
      source,
      [query],
      [],
      2
    );

    const { metadatas: factMetadatas, documents: factDocuments } = factResults;

    if (factDocuments && factDocuments.length > 0) {
      const descriptors = factDocuments[0];
      const searchDescriptors: string[] = descriptors.filter(
        (doc): doc is string => doc !== null
      );
      const sourceTextResults = await querySourceText(
        collectionName,
        source,
        searchDescriptors
      );
      const { documents, metadatas } = sourceTextResults;

      return metadatas;
    }
    return [];
  }
};

export const search = async (formData: FormData) => {
  "use server";
  const query =
    formData.get("query")!.toString() || "what is this paper about?";
  const collectionName = formData.get("collection")!.toString();
  const source = formData.get("source")!.toString();
  console.debug("querying paper", query);
  if (collectionName && source) {
    const factResults = await queryFacts(
      collectionName,
      source,
      [query],
      [],
      3
    );
    const { metadatas: factMetadatas, documents: factDocuments } = factResults;
    console.debug("query facts ", factMetadatas, factDocuments);

    console.debug(factDocuments.filter((doc) => doc !== null)[0]);
    const descriptors = factDocuments[0];

    if (descriptors) {
      const searchDescriptors: string[] = descriptors.filter(
        (doc): doc is string => doc !== null
      );
      const sourceTextResults = await querySourceText(
        collectionName,
        source,
        searchDescriptors
      );
      const { documents, metadatas } = sourceTextResults;

      console.debug("source text items: ", metadatas);
    }
  }
};

export const handleDeleteCollection = async (formData: FormData) => {
  const collectionName = formData.get("collection")?.toString();
  const response = await deleteCollection(collectionName || "ParsedPapers");
  console.debug(`Deleted Collection ${collectionName}:`, { response });
};

export const handleMakeNewCollection = async (formData: FormData) => {
  try {
    const collectionName = formData.get("query")?.toString();
    const response = await makeNewCollection(collectionName || "ParsedPapers");
    console.debug("New Collection Created:", { response });
  } catch (error) {
    // console.error('Error creating new collection:', error);
  }
};

export const handleGetItemsFromCollection = async (formData: FormData) => {
  const collectionName = formData.get("collection")!.toString();
  const source = formData.get("source")!.toString();

  const response = await getItemsFromCollection(collectionName, source);
  console.debug(`getItemsFromCollection ${collectionName} by ${source}:`, {
    response,
  });
};
