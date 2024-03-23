import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";
import PDFViewer from "@src/components/pdf-viewer";
import { api } from "@src/trpc/server";
import { IHighlight } from "./ui";

export default async function Page() {
  const user_and_source = await api.post.fetchUserHighlights({
    user: "admin",
    source: "https://arxiv.org/pdf/1708.08021.pdf",
  });
  const highlights = user_and_source[0]?.highlights ?? [];
  const source =
    user_and_source[0]?.source ?? "https://arxiv.org/pdf/1708.08021.pdf";
  const id = user_and_source[0]?.id ?? null;
  return (
    <TRPCReactProvider>
      {/* <pre className="text-blue-500">{JSON.stringify(user_and_source, null, 2)}</pre> */}
      <PDFViewer loadedHighlights={highlights} loadedSource={source} id={id} />
    </TRPCReactProvider>
  );
}
