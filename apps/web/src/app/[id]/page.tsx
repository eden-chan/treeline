import React from "react";
import { api } from "@src/trpc/server";
import dynamic from "next/dynamic";
import { EmailAddress, User, auth, clerkClient, currentUser as getCurrentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { UserButton } from '@clerk/nextjs';
import { SearchTab, UserHeader } from '../pdf/ui/components/ExplorePage';

import Timeline from '../pdf/ui/components/Timeline';
import { highlights, users } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default async function Page({ params }: { params: { id: string } }) {

    // TODO: handle edgecase of multiple hypthen in names
    const handle = params.id
    const user = await api.user.fetchUser({ handle }) as users

    if (!user) {
        return <div className="h-screen w-screen gap-0 text-black">Profile {handle} does not exist</div>
    }

    const [searchedUser] = await clerkClient.users.getUserList({ emailAddress: [user.email] }) as User[]
    // Get all users to populate search bar and timeline
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
                <div>
                    <Avatar>
                        <AvatarImage src={searchedUser?.imageUrl} />
                        <AvatarFallback>{searchedUser?.firstName}</AvatarFallback>
                    </Avatar>                <SearchTab />
                </div>
                <Timeline articles={timeline} />
            </div>
        </main>
    );

}