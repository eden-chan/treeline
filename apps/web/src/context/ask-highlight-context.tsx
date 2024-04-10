"use client";
import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useChat, Message, CreateMessage } from "ai/react";
import { v4 as uuidv4 } from "uuid";

import { AnnotatedPdf, AnnotatedPdfHighlight } from "@prisma/client";
import { clientApi } from "@src/trpc/react";

export type ContextProps = {
  currentHighlight: AnnotatedPdfHighlight | null;
  setCurrentHighlight: React.Dispatch<
    React.SetStateAction<AnnotatedPdfHighlight | null>
  >;
  createAskHighlight: (
    highlight: Omit<AnnotatedPdfHighlight, "id">
  ) => Promise<AnnotatedPdfHighlight | undefined>;
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
  const [currentHighlight, setCurrentHighlight] =
    React.useState<AnnotatedPdfHighlight | null>(null);
  const onFinish = (message: Message) => {
    // Update DB once entire response is received
    const newHighlight = {
      ...currentHighlight,
      response: message.content,
    };

    setCurrentHighlight(newHighlight);

    mutation.mutate({
      userId: userId,
      highlights: [
        newHighlight,
        ...(highlights
          ? highlights.filter((h) => h.id !== currentHighlightRef.current.id)
          : []),
      ],
      source: loadedSource,
      id: annotatedPdfId,
    });

    setMessages([]);
  };
  const { messages, setMessages, append, isLoading, ...chat } = useChat({
    onFinish: onFinish,
  });

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
        (oldData) => newData as AnnotatedPdf
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
    highlight: AnnotatedPdfHighlight
  ): Promise<AnnotatedPdfHighlight | undefined> => {
    if (!highlight.prompt) return;

    const promptWithContext = highlight.content?.text
      ? `${highlight.prompt}
Answer this question with the following context:
${highlight.content.text}`
      : highlight.prompt;

    if (currentHighlight) {
      // Construct message history
    }

    // Query AI for response
    append(
      {
        role: "user",
        content: promptWithContext,
        createdAt: new Date(),
      },
      {}
    );

    // Add node to DB
    const id = uuidv4();
    mutation.mutate({
      userId: userId,
      highlights: [{ ...highlight, id }, ...(highlights ?? [])],
      source: loadedSource,
      id: annotatedPdfId,
    });

    setCurrentHighlight({ ...highlight, id });

    return { ...highlight, id };
  };

  // Update the highlight as the AI response streams in
  useEffect(() => {
    if (messages.length < 2 || !currentHighlight?.prompt) return;
    if (messages[messages.length - 1]?.role === "user") return;

    const question = messages[messages.length - 2]?.content;
    const response = messages[messages.length - 1]?.content;

    if (!question || !response) return;

    const newHighlight = {
      ...currentHighlight,
      response: response,
    };

    // Update highlight as messages stream in
    setCurrentHighlight(newHighlight);
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
