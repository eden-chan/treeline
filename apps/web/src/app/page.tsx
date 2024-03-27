import React from "react";
import { api } from "@src/trpc/server";
import { SearchTab, UserHeader } from './pdf/ui/components/ExplorePage';
import { clerkClient } from '@clerk/nextjs/server';
import Timeline from './pdf/ui/components/Timeline';
import { highlights, users } from '@prisma/client';
import { currentUser } from '@clerk/nextjs';

export default async function Page() {
  // Populate search bar for users
  const clerkUsers = await clerkClient.users.getUserList();

  let userEmails = [];
  for (let i = 0; i < clerkUsers.length; i++) {
    if (clerkUsers[i]?.emailAddresses?.[0]?.emailAddress) {
      userEmails.push(clerkUsers[i]?.emailAddresses?.[0]?.emailAddress as string);
    }
  }
  const users = await api.user.fetchUsers({ userEmailList: userEmails }) as users[]

  // Populate timeline with highlights of all users. TODO: filter by followed users
  const timeline = await api.post.fetchAllHighlights({
    userList: userEmails
  }) as highlights[];


  const _loggedInUser = await currentUser()
  const loggedInUserEmail = _loggedInUser?.emailAddresses[0]?.emailAddress as string
  const loggedInUser = await api.user.fetchUser({ email: loggedInUserEmail }) as users




  return (
    <main className="h-screen w-screen gap-0">
      <div className="max-w-4xl mx-auto py-8 px-4 text-black">
        <UserHeader users={users} loggedInUser={loggedInUser} />
        <SearchTab />
        <Timeline articles={timeline} />
      </div>
    </main>
  );
}

