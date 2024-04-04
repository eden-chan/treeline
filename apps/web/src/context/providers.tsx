"use client";
import React, { FC, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "@src/trpc/react";
import { AskHighlightProvider } from "./ask-highlight-context";

export const Providers: FC<{
  annotatedPdfId: string;
  userId: string;
  loadedSource: string;
  children: ReactNode;
}> = ({ annotatedPdfId, userId, loadedSource, children }) => {
  return (
    <TRPCReactProvider>
      <ClerkProvider>
        <AskHighlightProvider
          annotatedPdfId={annotatedPdfId}
          userId={userId}
          loadedSource={loadedSource}
        >
          {children}
        </AskHighlightProvider>
      </ClerkProvider>
    </TRPCReactProvider>
  );
};
