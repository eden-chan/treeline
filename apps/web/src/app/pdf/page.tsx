import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";

import { api } from "@src/trpc/server";
import { IHighlight, PDFHighlights, PDFHighlightsWithProfile } from "./ui";

import dynamic from "next/dynamic";
import { ObjectId } from "mongodb";
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { highlights } from '@prisma/client'
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
  ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {

  const headersList = headers();
  const header_url = headersList.get('x-url') || "";

  const urlParams = new URLSearchParams(header_url.split('?')[1]);
  const defaultPdfURL = "https://arxiv.org/pdf/1706.03762.pdf"
  const defaultUserId = 'admin'
  const pdfUrl = urlParams.get('url') || defaultPdfURL;

  let userEmail = defaultUserId

  let data: highlights | {} = {}

  const user = await currentUser();
  userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  try {
    data = await api.post.fetchUserHighlights({
      userId: userEmail,
      source: pdfUrl,
    }) as highlights;
  } catch (error) {
    console.error("Error fetching user highlights:", error);
  }

  // If highlights aren't found, use the default pdf and logged in user email
  const { highlights = [], source = pdfUrl, id = new ObjectId().toString(), userId = userEmail } = data ?? {};
  console.log({ header_url, pdfUrl, source, user })


  const users = await clerkClient.users.getUserList();
  const userEmails = users.map(user => user!.emailAddresses[0].emailAddress);
  const emailToPicture = users.map(user => { return { email: user!.emailAddresses[0]?.emailAddress ?? '', imageUrl: user!.imageUrl, firstName: user!.firstName, lastName: user!.lastName } });

  const allHighlights = await api.post.fetchAllHighlights({
    source: pdfUrl, userList: [...userEmails]
  }) as highlights[];


  const allHighlightsWithProfile = allHighlights.map((pdfHighlight) => {
    return {
      ...pdfHighlight,
      userProfilePicture: emailToPicture.find((user) => user.email === pdfHighlight.userId)?.imageUrl,
      firstName: emailToPicture.find((user) => user.email === pdfHighlight.userId)?.firstName,
      lastName: emailToPicture.find((user) => user.email === pdfHighlight.userId)?.lastName,
    }
  }) as PDFHighlightsWithProfile[]




  return (
    <TRPCReactProvider>

      <PDFViewer
        loadedHighlights={highlights}
        loadedSource={source}
        loadedUserHighlightsId={id}
        userId={userId}
        allHighlights={allHighlightsWithProfile}
      />
    </TRPCReactProvider>
  );
}
