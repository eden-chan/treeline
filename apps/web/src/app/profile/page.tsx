import React from "react";
import { TRPCReactProvider } from "@src/trpc/react";

import { api } from "@src/trpc/server";
import { IHighlight, PDFHighlights, PDFHighlightsWithProfile } from "../pdf/ui/types";

import dynamic from "next/dynamic";
import { ObjectId } from "mongodb";
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { UserButton } from '@clerk/nextjs';
import DiscoverHighlights from '../pdf/ui/components/DiscoverHighlights';
import Profile from '../pdf/ui/components/ReviewHighlights';
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
    ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {
    // const arxivId = params.id
    // const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;

    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";
    const userIdParams = new URLSearchParams(header_url.split('?')[1]);


    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

    const allUserHighlights = await api.post.fetchAllHighlights({
        userList: [userEmail]
    }) as PDFHighlights[];





    return (
        <main className="h-screen w-screen gap-0 text-black">
            <Profile timeline={allUserHighlights} />
        </main>
    );
}
