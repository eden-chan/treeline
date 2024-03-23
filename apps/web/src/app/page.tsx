import React from "react";
import Tree from "~/components/tree";
import PDFViewer from "~/components/pdf-viewer";
import { api } from "~/trpc/server";

export default async function Page() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const user = await api.post.fetchUserHighlights({ user: "admin" });
  const source = await api.post.fetchUserHighlights({ source: "https://arxiv.org/pdf/1708.08021.pdf" });
  const user_and_source = await api.post.fetchUserHighlights({ user: "admin", source: "https://arxiv.org/pdf/1708.08021.pdf" });
  return (
    <main className="h-screen w-screen grid grid-cols-2 gap-0">
      <h1>{hello.greeting}</h1>
      <pre className="text-red-500">{JSON.stringify(user, null, 2)}</pre>
      <pre className="text-green-500">{JSON.stringify(source, null, 2)}</pre>
      <pre className="text-blue-500">{JSON.stringify(user_and_source, null, 2)}</pre>
      {/* <PDFViewer /> */}
      {/* <Tree /> */}
    </main>
  );
}
