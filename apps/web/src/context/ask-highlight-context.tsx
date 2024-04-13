"use client";
import React, {
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChat, Message } from "ai/react";
import { v4 as uuidv4 } from "uuid";

import { AnnotatedPdf, Highlight, CurriculumNode } from "@prisma/client";
import { clientApi } from "@src/trpc/react";
import { FOLLOW_UP_PROMPT } from "@src/utils/constants";
import {
  NewHighlightWithRelationsInput,
  HighlightWithRelations,
} from "@src/server/api/routers/highlight";
import { CurriculumNodeWithRelations } from "@src/server/api/routers/annotated-pdf";

export type ContextProps = {
  currentHighlight: Highlight | null;
  setCurrentHighlight: (
    highlight: Highlight | null,
    forceRerender?: boolean,
  ) => void;
  createAskHighlight: (
    highlight: NewHighlightWithRelationsInput,
  ) => Promise<Highlight | undefined>;
  clearSelectedHighlight: () => void;
  selectHighlight: (h: HighlightWithRelations) => void;
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
  // Refs are required so that their values are not cached in callback functions
  const currentHighlightRef = useRef<HighlightWithRelations | null>(null);
  const currentNodeRef = useRef<CurriculumNodeWithRelations | null>(null);
  const setCurrentHighlight = (
    highlight: HighlightWithRelations | null,
    forceRerender = true,
  ) => {
    currentHighlightRef.current = highlight;
    if (forceRerender) {
      setForceRerender((prev) => !prev);
    }
  };
  const setCurrentNode = (
    node: CurriculumNodeWithRelations | null,
    forceRerender = true,
  ) => {
    currentNodeRef.current = node;
    if (forceRerender) {
      setForceRerender((prev) => !prev);
    }
  };
  const isGeneratingFollowUpsRef = useRef<Boolean>(false);

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

    /**
     * Case 1: Finished generating the response to the question being asked
     * Case 2: Finished generating followup questions for the previous response
     */
    if (!isGeneratingFollowUpsRef.current) {
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

      setCurrentNode(newHighlight.node, false);

      // Timeout is required since useChat may cause a socket connection error if opening a new connection with append as the old connection is closing
      setTimeout(() => {
        append({
          role: "user",
          content: FOLLOW_UP_PROMPT,
          createdAt: new Date(),
        });
        isGeneratingFollowUpsRef.current = true;
      }, 500);
    } else if (isGeneratingFollowUpsRef.current && currentNodeRef.current) {
      console.log("message.content:", message.content);
      const newPrompts = [...message.content.split("\n")];
      console.log("new prompts:", newPrompts);
      const newChildren = newPrompts.map((prompt) => {
        return {
          id: uuidv4(),
          parentId: currentNodeRef.current?.id ?? null,
          highlightId: null,
          comments: [],
          prompt,
          response: "",
          children: [],
          timestamp: new Date(),
        };
      });
      const newNode = {
        ...currentNodeRef.current,
        children: newChildren,
      };

      updateCurriculumNodeMutation.mutate({
        curriculumNode: newNode,
      });

      setCurrentNode(newNode, false);
      isGeneratingFollowUpsRef.current = false;
    }
  };

  const { messages, setMessages, append, ...chat } = useChat({
    onFinish,
    onError: (error) => console.error("Error occured in useChat:", error),
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

    const promptWithContext = highlight.content?.text
      ? `${highlight.node.prompt}
Answer this question with the following context:
${highlight.content.text}`
      : highlight.node.prompt;

    // Query AI for response
    append({
      role: "user",
      content: promptWithContext,
      createdAt: new Date(),
    });

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
    if (isGeneratingFollowUpsRef.current) return;
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
  }, [messages, isGeneratingFollowUpsRef]);

  const selectHighlight = (highlight: HighlightWithRelations) => {
    setCurrentHighlight(highlight);
    // Todo: Construct message history
  };

  const clearSelectedHighlight = () => {
    setCurrentHighlight(null);
    setCurrentNode(null, false);
    isGeneratingFollowUpsRef.current = false;
  };

  const value = {
    currentHighlight: currentHighlightRef.current,
    setCurrentHighlight,
    messages,
    setMessages,
    createAskHighlight,
    selectHighlight,
    clearSelectedHighlight,
    append,
    ...chat,
  };

  return (
    <AskHighlightContext.Provider value={value}>
      {children}
    </AskHighlightContext.Provider>
  );
};
