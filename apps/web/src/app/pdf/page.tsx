import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";

import { api } from "@src/trpc/server";
import { PDFHighlights } from "./ui";

import dynamic from 'next/dynamic';
import { ObjectId } from 'mongodb';
const PDFViewer = dynamic(() => import('@src/components/pdf-viewer'), {
  ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {
  const user_and_source = await api.post.fetchUserHighlights({
    user: "admin",
    source: "https://arxiv.org/pdf/1706.03762.pdf",
  }) as PDFHighlights

  const { highlights = [], source = "https://arxiv.org/pdf/1706.03762.pdf", id = new ObjectId().toString() } = user_and_source ?? {}

  return (
    <TRPCReactProvider>
      {/* <pre className="text-blue-500">{JSON.stringify(user_and_source, null, 2)}</pre> */}
      <PDFViewer loadedHighlights={highlights} loadedSource={source} loadedUserHighlightsId={id} />
    </TRPCReactProvider>
  );
}
