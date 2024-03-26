import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";
import { api } from "@src/trpc/server";
import { PDFHighlights } from "./ui";
import { auth, currentUser } from "@clerk/nextjs";
import dynamic from 'next/dynamic';
import { ObjectId } from 'mongodb';

const PDFViewer = dynamic(() => import('@src/components/pdf-viewer'), {
  ssr: false,
});

export default async function Page() {

  return (
    <TRPCReactProvider>
      <PDFViewer pdfUrl="https://arxiv.org/pdf/1706.03762.pdf" />
    </TRPCReactProvider>
  );
}
