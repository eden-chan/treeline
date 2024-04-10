import React from "react";

import { api } from "@src/trpc/server";
import { PDFHighlightsWithProfile } from "./ui";

import dynamic from "next/dynamic";
import { ObjectId } from "mongodb";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { AnnotatedPdf, Highlight } from "@prisma/client";
import { Providers } from "@src/context/providers";
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
  ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {
  const headersList = headers();
  const header_url = headersList.get("x-url") || "";

  const urlParams = new URLSearchParams(header_url.split("?")[1]);
  const defaultPdfURL = "https://arxiv.org/pdf/1706.03762.pdf";
  const defaultUserId = "admin";
  const pdfUrl = urlParams.get("url") || defaultPdfURL;

  let userEmail = defaultUserId;

  let newUserData: AnnotatedPdf & { highlights: Highlight[] } = {
    id: new ObjectId().toString(),
    highlights: [],
    source: pdfUrl,
    userId: userEmail,
  };

  const user = await currentUser();
  userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  let { id, highlights, source, userId } = newUserData;
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
    } else if (userEmail) {
      await api.annotatedPdf.upsertAnnotatedPdf({
        id,
        highlights,
        source,
        userId: userEmail,
      });
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
    <Providers annotatedPdfId={id} userId={userId} loadedSource={source}>
      <PDFViewer
        annotatedPdfId={id}
        loadedSource={source}
        userId={userId}
        userHighlights={highlights}
        allHighlights={allHighlightsWithProfile}
      />
    </Providers>
  );
}
