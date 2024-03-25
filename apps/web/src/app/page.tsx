
import React from "react";
import Tree from "@src/components/tree";
import dynamic from 'next/dynamic';
const PdfViewer = dynamic(() => import('../components/pdf-viewer'), {
  ssr: false, // Disable server-side rendering for this component
});
import { api } from "@src/trpc/server";
import UserSettings from '@src/components/user-settings';
import { SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react';

export default async function Page() {
  const hello = await api.post.hello({ text: "from tRPC" });
  // const helloPrivate = await api.post.helloPrivate({ text: "from logged in tRPC" });

  return (
    <main className="">

      <h1 className="text-black">{hello.greeting}</h1>
      {/* <h1 className="text-black">{helloPrivate?.greeting}</h1> */}
      <UserSettings />
      {/* <PDFViewer /> */}
      {/* <Tree /> */}
    </main>
  );
}
