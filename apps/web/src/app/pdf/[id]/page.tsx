import dynamic from 'next/dynamic';

// export const dynamic = "force-static";

// const dynamic = 'force-dynamic'
const PDFViewer = dynamic(() => import('@src/components/pdf-viewer'), {
    ssr: false, // Disable server-side rendering for this component
}); import { api } from '@src/trpc/server';
import { TRPCReactProvider } from '@src/trpc/react';
import { PDFHighlights } from '../ui';
import { ObjectId } from 'mongodb';
import { auth, currentUser } from '@clerk/nextjs/server';



export function generateStaticParams() {
    return [{ id: '' }, { id: '2' }, { id: '3' }]
}


export default async function Page({ params }: { params: { id: string } }) {

    const arxivId = params.id
    const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;

    // const { userId } = auth();
    // let data: PDFHighlights | {} = {}
    // if (userId) {
    //     const user = await currentUser();
    //     const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
    //     console.log({ user });
    //     try {
    //         data = await api.post.fetchUserHighlights({
    //             user: userEmail,
    //             source: pdfUrl,
    //         }) as PDFHighlights;
    //     } catch (error) {
    //         console.error("Error fetching user highlights:", error);
    //     }
    // }
    // const { highlights = [], source = pdfUrl, id = new ObjectId().toString() } = data ?? {};

    // ClerkProvider makes every child route into a dynamic-route (which doesn't have access to middleware)
    // https://github.com/orgs/clerk/discussions/1764#discussioncomment-7589090
    const highlights = [] // fetches the data at client-side
    const source = pdfUrl
    const id = new ObjectId().toString()
    return <TRPCReactProvider>
        <PDFViewer loadedHighlights={highlights} loadedSource={source} loadedUserHighlightsId={id} />
    </TRPCReactProvider>
}


