import React from "react";
import { api } from "@src/trpc/server";
import { SearchTab } from './pdf/ui/components/SearchTab';
import { clerkClient } from '@clerk/nextjs/server';
import Timeline from './pdf/ui/components/Timeline';
import { highlights, users } from '@prisma/client';
import { currentUser } from '@clerk/nextjs';
import Navbar from './pdf/ui/components/Navbar';

export default async function Page() {
  // Get logged in user

  const _loggedInUser = await currentUser()
  const loggedInUserEmail = _loggedInUser?.emailAddresses[0]?.emailAddress as string
  const loggedInUser = await api.user.fetchUser({ email: loggedInUserEmail }) as users

  //  Get logged in user friends
  const followedUsers = await api.user.fetchUsers({ userEmailList: loggedInUser.follows }) as users[]
  // Populate timeline with highlights of user and follows.
  const timeline = await api.post.fetchAllHighlights({
    userList: [loggedInUser.email, ...loggedInUser.follows]
  }) as highlights[];


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

