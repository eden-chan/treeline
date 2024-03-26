
import React from "react";
import Tree from "@src/components/tree";
import dynamic from 'next/dynamic';
const PdfViewer = dynamic(() => import('../components/pdf-viewer'), {
  ssr: false, // Disable server-side rendering for this component
});
import { api } from "@src/trpc/server";
import { CreateOrganization, OrganizationList, OrganizationProfile, OrganizationSwitcher, SignIn, UserButton, clerkClient } from '@clerk/nextjs';
import DiscoverHighlights from './pdf/ui/components/DiscoverHighlights';
import { PDFHighlights } from './pdf/ui/types';
import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  // If these filters are included, the response will contain only users that own any of these emails and/or phone numbers.
  const users = await clerkClient.users.getUserList();
  const userEmails = users.map(user => user!.emailAddresses[0].emailAddress);
  console.log({ userEmails })



  const user = await currentUser();
  const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress || '';


  const defaultPdfURL = "https://arxiv.org/pdf/1706.03762.pdf"

  const timeline = await api.post.fetchAllHighlights({
    userList: userEmails,
    // source: defaultPdfURL,
  }) as PDFHighlights[];


  return (
    <main className="h-screen w-screen gap-0">
      <DiscoverHighlights timeline={timeline} />
      {/* 
      <SignIn />
      <UserButton />
      <CreateOrganization />
      <OrganizationProfile />
      <OrganizationSwitcher />
      <OrganizationList /> */}
    </main>
  );
}
