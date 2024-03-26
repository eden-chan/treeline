import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";

import { api } from "@src/trpc/server";
import { IHighlight, PDFHighlights } from "./ui";

import dynamic from "next/dynamic";
import { ObjectId } from "mongodb";
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
  ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {
  // const arxivId = params.id
  // const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;

  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get('x-url') || "";

  const urlParams = new URLSearchParams(header_url.split('?')[1]);
  const defaultPdfURL = "https://arxiv.org/pdf/1706.03762.pdf"
  const defaultUserId = 'admin'
  const pdfUrl = urlParams.get('url') || defaultPdfURL;

  let userEmail = defaultUserId

  let data: PDFHighlights | {} = {}

  const user = await currentUser();
  userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  try {
    data = await api.post.fetchUserHighlights({
      userId: userEmail,
      source: pdfUrl,
    }) as PDFHighlights;
  } catch (error) {
    console.error("Error fetching user highlights:", error);
  }

  // If highlights aren't found, use the default pdf and logged in user email
  const { highlights = [], source = pdfUrl, id = new ObjectId().toString(), userId = userEmail } = data ?? {};
  console.log({ header_url, pdfUrl, source, user })


  const users = await clerkClient.users.getUserList();
  const userEmails = users.map(user => user!.emailAddresses[0].emailAddress);



  const allHighlights = await api.post.fetchAllHighlights({
    source: pdfUrl, userList: [...userEmails]
  }) as PDFHighlights;
  const mergedHighlights: IHighlight[] = allHighlights.reduce((acc, pdfHighlight) => {
    return [...acc, ...pdfHighlight.highlights];
  }, []);

  return (
    <TRPCReactProvider>
      {/* <pre className="text-blue-500">{JSON.stringify(user_and_source, null, 2)}</pre> */}
      <PDFViewer
        loadedHighlights={highlights}
        loadedSource={source}
        loadedUserHighlightsId={id}
        userId={userId}
        allHighlights={mergedHighlights}
      />
    </TRPCReactProvider>
  );
}
