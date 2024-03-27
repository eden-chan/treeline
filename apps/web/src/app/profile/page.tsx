import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";

import { api } from "@src/trpc/server";
import { Account, IHighlight, PDFHighlights, PDFHighlightsWithProfile } from "../pdf/ui/types";

import dynamic from "next/dynamic";
import { ObjectId } from "mongodb";
import { auth, clerkClient, currentUser as getCurrentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { UserButton } from '@clerk/nextjs';
import ExplorePage from '../pdf/ui/components/ExplorePage';
import Profile from '../pdf/ui/components/ProfilePage';
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
    ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {

    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";
    const urlParams = new URLSearchParams(header_url.split('?')[1]);



    const loggedInUser = await getCurrentUser();
    const loggedInUserEmail = loggedInUser?.emailAddresses?.[0]?.emailAddress || '';

    const loggedInAccount = await api.user.fetchUser({
        email: loggedInUserEmail
    }) as Account


    const handle = urlParams.get('user') || loggedInAccount!.handle;

    let userProfile: AccountProfile;
    if (handle === loggedInAccount!.handle) {
        userProfile = loggedInAccount
    } else {
        userProfile = await api.user.fetchUser({
            handle
        }) as Account
    }

    if (!userProfile) {
        return <div className="h-screen w-screen gap-0 text-black">Profile {handle} does not exist</div>
    }

    const allUserHighlights = await api.post.fetchAllHighlights({
        userList: [userProfile!.email]
    }) as PDFHighlights[];


    console.log({ profileUser: userProfile, handle })
    // console.log({ getCurrentAccount: loggedInAccount })
    return (
        <main className="h-screen w-screen gap-0 text-black">
            <Profile timeline={allUserHighlights} userProfile={userProfile} />
        </main>
    );
}
