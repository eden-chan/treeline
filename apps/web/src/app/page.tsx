import React from "react";
import { api } from "@src/trpc/server";
import { SearchTab, UserHeader } from './pdf/ui/components/ExplorePage';
import { clerkClient } from '@clerk/nextjs/server';
import Timeline from './pdf/ui/components/Timeline';
import { highlights, users } from '@prisma/client';

export default async function Page() {
  // If these filters are included, the response will contain only users that own any of these emails and/or phone numbers.
  const clerkUsers = await clerkClient.users.getUserList();

  let userEmails = [];
  for (let i = 0; i < clerkUsers.length; i++) {
    if (clerkUsers[i]?.emailAddresses?.[0]?.emailAddress) {
      userEmails.push(clerkUsers[i]?.emailAddresses?.[0]?.emailAddress as string);
    }
  }
  const users = await api.user.fetchUsers({ userEmailList: userEmails }) as users[]

  const timeline = await api.post.fetchAllHighlights({
    userList: userEmails
  }) as highlights[];


  return (
    <main className="h-screen w-screen gap-0">
      <div className="max-w-4xl mx-auto py-8 px-4 text-black">
        <UserHeader users={users} />
        <SearchTab />
        <Timeline articles={timeline} />
      </div>
    </main>
  );
}

