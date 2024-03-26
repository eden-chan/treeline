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
  const { userId } = auth();
  let data: PDFHighlights | {} = {};
  if (userId) {
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
    console.log({ user });
    try {
      data = await api.post.fetchUserHighlights({
        user: userEmail,
        source: "https://arxiv.org/pdf/1706.03762.pdf",
      }) as PDFHighlights;
    } catch (error) {
      console.error("Error fetching user highlights:", error);
    }
  }
  const { highlights = [], source = "https://arxiv.org/pdf/1706.03762.pdf", id = new ObjectId().toString() } = data ?? {};

  return (
    <TRPCReactProvider>
      <PDFViewer loadedHighlights={highlights} loadedSource={source} loadedUserHighlightsId={id} />
    </TRPCReactProvider>
  );
}
