//@ts-nocheck
"use client";
import React, {
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import { useChat, Message } from "ai/react";
import { ragQuery } from '@src/app/actions';
import { v4 as uuidv4 } from "uuid";

import { Highlight, ParsedPapers } from "@prisma/client";
import { clientApi } from "@src/trpc/react";
import { generateSystemPrompt } from "@src/utils/constants";
import {
  NewHighlightWithRelationsInput,
  HighlightWithRelations,
} from "@src/server/api/routers/highlight";


export type ContextProps = {
  currentHighlight: Highlight | null;
  setCurrentHighlight: (
    highlight: Highlight | null,
    forceRerender?: boolean,
  ) => void;
  createAskHighlight: (
    highlight: NewHighlightWithRelationsInput,
  ) => Promise<Highlight | undefined>;
} & ReturnType<typeof useChat>;

export const useAskHighlight = () => {
  return useContext(AskHighlightContext);
};

// @ts-ignore: too many default values for useChat to include
export const AskHighlightContext = React.createContext<ContextProps>({
  currentHighlight: null,
  setCurrentHighlight: () => null,
});

export const AskHighlightProvider: FC<{
  annotatedPdfId: string;
  userId: string;
  loadedSource: string;
  parsedPaper: ParsedPapers,
  children: ReactNode;
}> = ({ annotatedPdfId, userId, loadedSource, parsedPaper, children }) => {
  const [_, setForceRerender] = useState<Boolean>(false);
  const currentHighlightRef = useRef<HighlightWithRelations | null>(null);
  const setCurrentHighlight = (
    highlight: HighlightWithRelations | null,
    forceRerender = true,
  ) => {
    currentHighlightRef.current = highlight;
    if (forceRerender) {
      setForceRerender((prev) => !prev);
    }
  };

  const onFinish = (message: Message) => {
    // Update DB once entire response is received
    if (!currentHighlightRef.current) {
      console.debug("No current highlight reference found.");
      return;
    }

    if (!currentHighlightRef.current.node) {
      console.debug("No current highlight node found.");
      return;
    }

    const newHighlight = {
      ...currentHighlightRef.current,
      node: {
        ...currentHighlightRef.current.node,
        response: message.content,
      },
    };

    setCurrentHighlight(newHighlight, false);

    updateCurriculumNodeMutation.mutate({
      curriculumNode: newHighlight.node,
    });

    setMessages([]);
  };

  // fetch paper text and field from db
  const concatenatedText = useMemo(() => parsedPaper.sections.map(section => section.text).join(" "), [parsedPaper.sections]);
  const systemPrompt = useMemo(() => generateSystemPrompt(concatenatedText, parsedPaper.primary_category), [concatenatedText, parsedPaper.primary_category]);

  const initialMessages: Message[] = [{
    role: 'system',
    content: systemPrompt,
  }]

  const { messages, setMessages, append, isLoading, ...chat } = useChat({
    initialMessages,
    onFinish,
  });


  const utils = clientApi.useUtils();
  // const updateHighlightMutation = clientApi.highlight.updateHighlight.useMutation();
  const createHighlightMutation =
    clientApi.highlight.createHighlight.useMutation({
      onMutate: async (newData) => {
        await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
          userId: userId,
          source: loadedSource,
        });

        const previousData = utils.annotatedPdf.fetchAnnotatedPdf.getData({
          userId: userId,
          source: loadedSource,
        });

        utils.annotatedPdf.fetchAnnotatedPdf.setData(
          {
            userId: userId,
            source: loadedSource,
          },
          (oldData) => {
            if (!oldData) return oldData;

            const highlightId = uuidv4();
            const newNode = newData.highlight.node
              ? {
                ...newData.highlight.node,
                id: uuidv4(),
                parentId: null,
                highlightId,
                children: [],
              }
              : null;
            const newHighlight = {
              ...newData.highlight,
              id: highlightId,
              node: newNode,
              annotatedPdfId,
            };

            return {
              ...oldData,
              highlights: [newHighlight, ...oldData.highlights],
            };
          },
        );

        return { previousData };
      },
      onSuccess: (input) => {
        utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
          userId: userId,
          source: loadedSource,
        });

        // Todo: address potential race condition where onFinish callback for useChat executes before
        // setting the new id values
        if (!input?.node || !currentHighlightRef.current?.node) return;
        currentHighlightRef.current.id = input.id;
        currentHighlightRef.current.node.id = input.node.id;
        currentHighlightRef.current.node.highlightId = input.node.highlightId;
      },
    });
  const updateCurriculumNodeMutation =
    clientApi.curriculum.updateNode.useMutation();

  const createAskHighlight = async (
    highlight: NewHighlightWithRelationsInput,
  ): Promise<Highlight | undefined> => {
    if (!highlight.node?.prompt) return;


    // Walking RAG - Cyclical Generation
    // Fetch most relevant chunks (descriptors)
    // fetch fact - descriptors for pdf.use chroma to embed the descriptors and store the embeddings
    // vector search on user query over all descriptors for the pdf.
    // retrieve relevant facts to inject into context

    const collectionName = 'ParsedPapers'
    const source = loadedSource
    const query = highlight.node.prompt
    let ragContext = ''
    try {

      const results = await ragQuery(collectionName, source, query)
      const { documents } = results;


      if (documents && documents.length > 0) {
        const relevantChunks = documents.flat().join(' ')
        ragContext = relevantChunks
        console.debug('retrieved ragContext: ', ragContext)
      }
    } catch (e) {
      console.debug('Error fetching RAG context. Continuing gracefully without rag context: ', e)
    }

    const promptWithContext = `<question>${highlight.node.prompt}</question>
${highlight.content?.text ? `<context>
${highlight.content.text}
${ragContext}</context>` : ''}`;
    // Query AI for response
    append(
      {
        role: "user",
        content: promptWithContext,
        createdAt: new Date(),
      },
      {},
    );

    // Add node to DB
    createHighlightMutation.mutate({
      highlight,
    });

    const highlightId = uuidv4();
    const tempHighlight = {
      ...highlight,
      id: highlightId,
      node: {
        ...highlight.node,
        id: uuidv4(),
        highlightId,
        parentId: null,
        children: [],
      },
    };

    setCurrentHighlight(tempHighlight, false);

    return tempHighlight;
  };

  // Update the highlight as the AI response streams in
  // TODO: Update API so we don't rely on useEffect anymore. Just work off of callbacks once the response is done streaming
  useEffect(() => {
    if (messages.length < 2 || !currentHighlightRef.current?.node?.prompt)
      return;
    if (messages[messages.length - 1]?.role === "user") return;

    const question = messages[messages.length - 2]?.content;
    const response = messages[messages.length - 1]?.content;

    if (!question || !response) return;

    const newHighlight = {
      ...currentHighlightRef.current,
      node: {
        ...currentHighlightRef.current.node,
        response,
      },
    };

    setCurrentHighlight(newHighlight, false);

    // Update highlight as messages stream in
    setCurrentHighlight(newHighlight, false);
  }, [messages, isLoading]);

  const value = {
    currentHighlight: currentHighlightRef.current,
    setCurrentHighlight,
    messages,
    setMessages,
    createAskHighlight,
    append,
    isLoading,
    ...chat,
  };

  return (
    <AskHighlightContext.Provider value={value}>
      {children}
    </AskHighlightContext.Provider>
  );
};
