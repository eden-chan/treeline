import React from "react";
import Tree from "~/components/tree";
import PDFViewer from "~/components/pdf-viewer";
import { api } from "~/trpc/server";

export default async function Page() {
  const hello = await api.post.hello({ text: "from tRPC" });
  return (
    <main className="h-screen w-screen grid grid-cols-2 gap-0">
      <h1>{hello.greeting}</h1>
      {/* <PDFViewer /> */}
      {/* <Tree /> */}
    </main>
  );
}
