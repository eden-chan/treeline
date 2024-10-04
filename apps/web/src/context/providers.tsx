"use client";
import React, { FC, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "@src/trpc/react";

export const Providers: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <TRPCReactProvider>
      <ClerkProvider>{children}</ClerkProvider>
    </TRPCReactProvider>
  );
};
