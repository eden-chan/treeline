"use client";
import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";

import { AnnotatedPdf, Highlight, CurriculumNode } from "@prisma/client";
import { clientApi } from "@src/trpc/react";
import { FOLLOW_UP_PROMPT } from "@src/utils/constants";
import { HighlightWithRelations } from "@src/server/api/routers/highlight";

export type ContextProps = {
  currentHighlight: Highlight | null;
  setCurrentHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
  createAskHighlight: (
    light: HighlightWithRelations,
  ) => Promise<Highlight | undefined>;
} & ReturnType<typeof useChat>;

enum LoadingState {
  LOADING_ASK,
  LOADING_FOLLOWUP,
}

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
  const [currentHighlight, setCurrentHighlight] = useState<Highlight | null>(
    null,
  );
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.LOADING_ASK,
  );
  const { messages, setMessages, append, isLoading, ...chat } = useChat();

  const highlights = clientApi.annotatedPdf.fetchAnnotatedPdf.useQuery({
    userId: userId,
    source: loadedSource,
  }).data?.highlights;
  const utils = clientApi.useUtils();
  const mutation = clientApi.annotatedPdf.upsertAnnotatedPdf.useMutation({
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
        newData,
        (oldData) => newData as AnnotatedPdf,
      );

      return { previousData };
    },
    onSuccess: (input) => {
      utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
        userId: input?.userId,
        source: input?.source,
      });
    },
  });

  const createAskHighlight = async (
    highlight: HighlightWithRelations,
  ): Promise<Highlight | undefined> => {
    if (!highlight.node?.prompt) return;

    const promptWithContext = highlight.content?.text
      ? `${highlight.node.prompt}
Answer this question with the following context:
${highlight.content.text}`
      : highlight.node.prompt;

    if (currentHighlight) {
      // Construct message history
    }

    // Query AI for response
    // append(
    //   {
    //     role: "user",
    //     content: promptWithContext,
    //     createdAt: new Date(),
    //   },
    //   {},
    // );
    //
    // // Add node to DB
    // const id = uuidv4();
    // mutation.mutate({
    //   userId: userId,
    //   highlights: [{ ...highlight, id }, ...(highlights ?? [])],
    //   source: loadedSource,
    //   id: annotatedPdfId,
    // });
    //
    // setCurrentHighlight({ ...highlight, id });

    // return { ...highlight, id };
  };

  // Update the highlight as the AI response streams in
  // TODO: Update API so we don't rely on useEffect anymore. Just work off of callbacks once the response is done streaming
  useEffect(() => {
    if (messages.length < 2 || !currentHighlight?.prompt) return;
    if (messages[messages.length - 1]?.role === "user") return;

    const question = messages[messages.length - 2]?.content;
    const response = messages[messages.length - 1]?.content;

    if (!question || !response) return;

    if (loadingState === LoadingState.LOADING_ASK) {
      const newHighlight = {
        ...currentHighlight,
        response: response,
      };

      // Update highlight as messages stream in
      setCurrentHighlight(newHighlight);

      if (!isLoading) {
        // Update DB once entire response is received
        mutation.mutate({
          userId: userId,
          highlights: [
            newHighlight,
            ...(highlights
              ? highlights.filter((h) => h.id !== currentHighlight.id)
              : []),
          ],
          source: loadedSource,
          id: annotatedPdfId,
        });

        append(
          {
            role: "user",
            content: FOLLOW_UP_PROMPT,
            createdAt: new Date(),
          },
          {},
        );

        setLoadingState(LoadingState.LOADING_FOLLOWUP);
      }
    } else if (loadingState === LoadingState.LOADING_FOLLOWUP) {
      if (!isLoading) {
        const followUpNodes: CurriculumNode[] = response
          .split("?")
          .map((response) => ({
            id: uuidv4(),
            prompt: "",
            response,
            timestamp: new Date(),
            comments: [],
          }));

        const newHighlight = {
          ...currentHighlight,
          nodes: followUpNodes,
        };

        setCurrentHighlight(newHighlight);

        mutation.mutate({
          userId: userId,
          highlights: [
            newHighlight,
            ...(highlights
              ? highlights.filter((h) => h.id !== currentHighlight.id)
              : []),
          ],
          source: loadedSource,
          id: annotatedPdfId,
        });

        setMessages([]);
        setLoadingState(LoadingState.LOADING_ASK);
      }
    }
  }, [messages, isLoading]);

  const value = {
    currentHighlight,
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
