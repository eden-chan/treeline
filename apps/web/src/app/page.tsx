import React from "react";
import { api } from "@src/trpc/server";
import { SearchTab } from "./pdf/ui/components/SearchTab";
import Timeline from "./pdf/ui/components/Timeline";
import { SignIn, currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";

export default async function Page() {
  const _loggedInUser = await currentUser();
  const loggedInUserEmail = _loggedInUser?.emailAddresses[0]?.emailAddress;
  const loggedInUser = await api.user.fetchUser({
    email: loggedInUserEmail,
  });

  if (!_loggedInUser || !loggedInUser) {
    //  Get logged in user friends
    return (
      <div>
        <SignIn />
      </div>
    );
  }

  const followedUsers =
    (await api.user.fetchUsers({
      userEmailList: loggedInUser?.follows ?? [],
    })) ?? [];
  // Populate timeline with highlights of user and follows.
  const timeline =
    (await api.annotatedPdf.fetchAllHighlights({
      userList: [loggedInUser.email, ...(loggedInUser?.follows ?? [])],
    })) ?? [];

  return (
    <main className="h-screen w-screen gap-0">
      <div className="max-w-4xl mx-auto py-8 px-4 text-black">
        <Navbar users={followedUsers} loggedInUser={loggedInUser} />
        <SearchTab />
        <Timeline articles={timeline} />
      </div>
    </main>
  );
}
