"use client";
import React, {
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChat, Message, CreateMessage } from "ai/react";
import { v4 as uuidv4 } from "uuid";

import { AnnotatedPdf, Highlight, CurriculumNode, ParsedPapers } from "@prisma/client";
import { clientApi } from "@src/trpc/react";
import { FOLLOW_UP_PROMPT } from "@src/utils/constants";
import {
  NewHighlightWithRelationsInput,
  HighlightWithRelations,
} from "@src/server/api/routers/highlight";
import { getParsedPaperAction, queryFacts, ragQuery, search } from '@src/app/actions';

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
  children: ReactNode;
}> = ({ annotatedPdfId, userId, loadedSource, children }) => {
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

  // #TODO: fetch paper text and field from db
  const [prompt, setPrompt] = useState<string>('')


  useEffect(() => {
    const fetchParsedPaper = async () => {
      const parsedPaper = await getParsedPaperAction(loadedSource);
      if (parsedPaper && parsedPaper.sections) {
        const concatenatedText = parsedPaper.sections.map(section => section.text).join(" ");
        const systemPrompt = generateSystemPrompt(concatenatedText, parsedPaper.primary_category)
        setPrompt(systemPrompt)
      }
    };
    fetchParsedPaper();
  }, [loadedSource]);

  const generateSystemPrompt = (paperText: string, field: string) => `
    Variables:

{'$PAPER_TEXT', '$CONTEXT', '$QUESTION'}

************************

Prompt:
You are an expert educator helping me cultivate intuition in the field of ${field}. I will provide you
with a paper text related to this field. Your task is to carefully read the paper, identify key
sections, and use the information to help me ask smarter, more insightful questions about the topic.

Here is the paper text:
<paper>
${paperText}
</paper>

After reading the paper, I will ask you a question and provide additional context that I think is
relevant to my question. The context will usually be specific sections from the paper.

<question>MY_QUESTION</question>
<context>My_CONTEXT</context>

Using the provided context, identify the most relevant sections in the paper that can help address
the question. Think critically about the information in these sections and how it relates to the
question.

<thinking>
In this section, brainstorm ideas and connections between the question, context, and relevant
sections of the paper. Consider how the information in the paper can help deepen understanding of
the topic and lead to more insightful questions.
</thinking>

Based on your analysis, provide suggestions for asking smarter, more insightful questions related to
the topic. Your suggestions should demonstrate a deep understanding of the field and the specific
information in the paper.

<suggestions>
Write your suggested questions here, focusing on questions that show critical thinking and a desire
to gain a deeper understanding of the topic.
</suggestions>

Remember, your goal is to help me cultivate intuition in this field by guiding me to ask better
questions. Use your expertise and the information in the paper to provide valuable insights and
suggestions.`

  const initialMessages = [{
    role: 'system',
    content: prompt,
  }] as Message[]

  const { messages, setMessages, append, isLoading, ...chat } = useChat({
    initialMessages,
    onFinish,
  });

  console.log({ messages })
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
    const results = await ragQuery(collectionName, source, query)
    console.log('query: ', { source, query, collectionName, results })

    let ragContext = ''
    if (results && results.length > 0) {
      const relevantChunks = results.flat().map(chunk => chunk?.text).join(' ')
      ragContext = relevantChunks
    }


    const promptWithContext = highlight.content?.text
      ? `${highlight.node.prompt}
Answer this question with the following context:
${highlight.content.text}
${ragContext}`
      : highlight.node.prompt;

    console.log(promptWithContext)

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
