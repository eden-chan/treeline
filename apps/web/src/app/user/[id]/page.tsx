import React from "react";
import { api } from "@src/trpc/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

import Profile from "@src/app/pdf/ui/components/ProfilePage";
import Navbar from "@src/app/pdf/ui/components/Navbar";
import { RedirectToSignIn } from "@clerk/nextjs";

export default async function Page({ params }: { params: { id: string } }) {
  // TODO: handle edgecase of multiple hyphen in names
  const handle = params.id;
  const searchedUser = await api.user.fetchUser({ handle });
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return <RedirectToSignIn />;
  }

  if (!searchedUser) {
    return (
      <div className="h-screen w-screen gap-0 text-black">
        Profile {handle} does not exist
      </div>
    );
  }

  // Get searched user profile picture from Clerk
  const [searchedUserClerk] = await clerkClient.users.getUserList({
    emailAddress: [searchedUser.email],
  });

  if (!searchedUserClerk) {
    return <h1>User not found</h1>;
  }

  // Get all users to populate search bar and timeline
  const clerkUsers = await clerkClient.users.getUserList();

  const userEmails = [];
  for (let i = 0; i < clerkUsers.length; i++) {
    const emailAddress = clerkUsers[i]?.emailAddresses?.[0]?.emailAddress;
    if (emailAddress) {
      userEmails.push(emailAddress);
    }
  }

  const users = await api.user.fetchUsers({ userEmailList: userEmails });
  const timeline =
    (await api.annotatedPdf.fetchAllAnnotatedPdfs({
      userList: userEmails,
    })) ?? [];

  const _loggedInUser = await currentUser();
  const loggedInUserEmail = _loggedInUser?.emailAddresses[0]?.emailAddress;
  const loggedInUser = await api.user.fetchUser({ email: loggedInUserEmail });

  if (!users || !loggedInUser) {
    console.error("Failed to fetch users or loggedInUser");
    return null;
  }

  const parsedPapers = (await api.parsedPapers.fetchAllParsedPapers()) ?? [];

  return (
    <main className="h-screen w-screen gap-0 bg-[##f8f7f6] py-8 px-4">
      <Navbar users={users} loggedInUser={loggedInUser} />
      <Profile
        users={users}
        timeline={timeline}
        searchedUser={searchedUser}
        searchedUserImageUrl={searchedUserClerk.imageUrl}
        loggedInUser={loggedInUser}
        parsedPapers={parsedPapers}
      />
    </main>
  );
}
