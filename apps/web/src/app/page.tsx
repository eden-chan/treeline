import React from "react";
import { api } from "@src/trpc/server";
import { SearchTab } from "./pdf/ui/components/SearchTab";
import Timeline from "./pdf/ui/components/Timeline";
import { SignIn, currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";
import LearningActivityCalendar from '@src/components/activity-calendar';


export default async function Page() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <div>
        <SignIn />
      </div>
    );
  }
  // TODO: Map Clerk userid to mongodb id
  const clerkUserEmail = clerkUser?.emailAddresses[0]?.emailAddress;
  const user = await api.user.fetchUser({
    email: clerkUserEmail,
  });

  const followedUsers =
    (await api.user.fetchUsers({
      userEmailList: user?.follows ?? [],
    })) ?? [];
  // Populate timeline with highlights of user and follows.
  const timeline =
    (await api.annotatedPdf.fetchAllAnnotatedPdfs({
      userList: [user.email, ...(user?.follows ?? [])],
    })) ?? [];


  return (
    <main className="h-screen w-screen gap-0">
      <div className="max-w-4xl mx-auto py-8 px-4 text-black">
        <LearningActivityCalendar />
        <Navbar users={followedUsers} loggedInUser={user} />
        <SearchTab />
        <Timeline articles={timeline} />
      </div>
    </main>
  );
}
