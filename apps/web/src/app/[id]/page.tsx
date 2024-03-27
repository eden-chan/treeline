import React from "react";
import { api } from "@src/trpc/server";
import dynamic from "next/dynamic";
import { User, auth, clerkClient, currentUser as getCurrentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { UserButton } from '@clerk/nextjs';
import { SearchTab, UserHeader } from '../pdf/ui/components/ExplorePage';

import Timeline from '../pdf/ui/components/Timeline';
import { highlights, users } from '@prisma/client';


export default async function Page() {

    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";
    const urlParams = new URLSearchParams(header_url.split('?')[1]);

    // Check which user we should load
    const loggedInUser = await getCurrentUser();
    const loggedInUserEmail = loggedInUser?.emailAddresses?.[0]?.emailAddress || '';

    const loggedInAccount = await api.user.fetchUser({
        email: loggedInUserEmail
    }) as users


    const handle = urlParams.get('user') || loggedInAccount!.handle;

    let userProfile: users;
    if (handle === loggedInAccount!.handle) {
        userProfile = loggedInAccount
    } else {
        userProfile = await api.user.fetchUser({
            handle
        }) as users
    }

    if (!userProfile) {
        return <div className="h-screen w-screen gap-0 text-black">Profile {handle} does not exist</div>
    }

    // If these filters are included, the response will contain only users that own any of these emails and/or phone numbers.
    const clerkUsers = await clerkClient.users.getUserList() as User[];

    let userEmails = [];
    for (let i = 0; i < clerkUsers.length; i++) {
        if (clerkUsers[i]?.emailAddresses?.[0]?.emailAddress) {
            userEmails.push(clerkUsers[i]?.emailAddresses?.[0]?.emailAddress as string);
        }
    }
    const users = await api.user.fetchUsers({ userEmailList: userEmails }) as users[]

    const timeline = await api.post.fetchAllHighlights({
        userList: userEmails
    }) as highlights[]


    return (
        <main className="h-screen w-screen gap-0 bg-[#E9E5DD]">
            <div className="max-w-4xl mx-auto py-8 px-4 text-black">
                <UserHeader users={users} />
                <SearchTab />
                <Timeline articles={timeline} />
            </div>
        </main>
    );

}