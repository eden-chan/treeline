"use client";
import React, { FC, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { AskHighlightProvider } from "./ask-highlight-context";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider>
      <AskHighlightProvider>{children}</AskHighlightProvider>
    </ClerkProvider>
  );
};
