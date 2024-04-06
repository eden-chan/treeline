import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";

import { api } from "@src/trpc/server";
import { PDFHighlightsWithProfile } from "./ui";

import dynamic from "next/dynamic";
import { ObjectId } from "mongodb";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { AnnotatedPdf, AnnotatedPdfHighlights } from "@prisma/client";
import { SignIn } from '@clerk/nextjs';
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
  ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {
  const headersList = headers();
  const header_url = headersList.get("x-url") || "";

  const urlParams = new URLSearchParams(header_url.split("?")[1]);
  const defaultPdfURL = "https://arxiv.org/pdf/1706.03762.pdf";
  const pdfUrl = urlParams.get("url") || defaultPdfURL;


  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <SignIn />
      </div>
    );
  }
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";


  let newUserData: AnnotatedPdf = {
    id: new ObjectId().toString(),
    highlights: [],
    source: pdfUrl,
    userId: userEmail,
  };

  let { id, highlights, source, userId } = newUserData;
  let currentHighlight: AnnotatedPdfHighlights | undefined = undefined;
  try {
    const data = await api.annotatedPdf.fetchAnnotatedPdf({
      userId: userEmail,
      source: pdfUrl,
    });

    if (data) {
      id = data.id;
      highlights = data.highlights;
      source = data.source;
      userId = data.userId;
    }


  } catch (error) {
    console.error("Error fetching user highlights:", error);
  }

  const users = await clerkClient.users.getUserList();
  const userEmails = users.map(
    (user) => user.emailAddresses[0]?.emailAddress ?? "",
  );
  const emailToPicture = users.map((user) => {
    return {
      email: user!.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: user!.imageUrl,
      firstName: user!.firstName,
      lastName: user!.lastName,
    };
  });

  const allHighlights = await api.annotatedPdf.fetchAllAnnotatedPdfs({
    source: pdfUrl,
    userList: userEmails,
  });

  const parsedPaper = await api.parsedPapers.fetchParsedPdf({
    source: pdfUrl,
  });

  const allHighlightsWithProfile = allHighlights
    ? allHighlights.map((pdfHighlight) => {
      return {
        ...pdfHighlight,
        userProfilePicture: emailToPicture.find(
          (user) => user.email === pdfHighlight.userId,
        )?.imageUrl,
        firstName: emailToPicture.find(
          (user) => user.email === pdfHighlight.userId,
        )?.firstName,
        lastName: emailToPicture.find(
          (user) => user.email === pdfHighlight.userId,
        )?.lastName,
      } as PDFHighlightsWithProfile;
    })
    : [];

  return (
    <TRPCReactProvider>
      <PDFViewer
        parsedPaper={parsedPaper}
        annotatedPdfId={id}
        loadedSource={source}
        userId={userId}
        userHighlights={highlights}
        allHighlights={allHighlightsWithProfile}
      />
    </TRPCReactProvider>
  );
}
