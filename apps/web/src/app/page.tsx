import React from "react";
import { api } from "@src/trpc/server";
import Timeline from "./pdf/ui/components/Timeline";
import { RedirectToSignIn, SignIn, currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";
import { BentoGridThirdDemo } from '@src/components/paper-card';


export default async function Page() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <RedirectToSignIn />
    );
  }
  // TODO: Map Clerk userid to mongodb id
  const clerkUserEmail = clerkUser?.emailAddresses[0]?.emailAddress;
  const user = await api.user.fetchUser({
    email: clerkUserEmail,
  });

  if (!user) {
    return (
      <RedirectToSignIn />
    );
  }
  const followedUsers =
    (await api.user.fetchUsers({
      userEmailList: user?.follows ?? [],
    })) ?? [];
  // Populate timeline with highlights of user and follows.
  const timeline =
    (await api.annotatedPdf.fetchAllAnnotatedPdfs({
      userList: [user.email, ...(user?.follows ?? [])],
    })) ?? [];

  const parsedPapers = await api.parsedPapers.fetchAllParsedPapers() ?? []


  return (
    <main className="h-screen w-screen gap-0 p-4 text-black">
      <Navbar users={followedUsers} loggedInUser={user} />
      <Timeline articles={timeline} parsedPapers={parsedPapers} />
    </main>
  );
}
