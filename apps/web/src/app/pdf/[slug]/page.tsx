import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('@src/components/pdf-viewer'), {
    ssr: false, // Disable server-side rendering for this component
}); import { api } from '@src/trpc/server';
import { TRPCReactProvider } from '@src/trpc/react';
import { PDFHighlights } from '../ui';
export default async function Page({ params }: { params: { slug: string } }) {

    const arxivId = params.slug
    const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    const user_and_source = await api.post.fetchUserHighlights({ user: "admin", source: pdfUrl }) as PDFHighlights;
    const { highlights, source, id } = user_and_source ?? {}

    return <TRPCReactProvider>
        <PDFViewer loadedHighlights={highlights} loadedSource={source} loadedUserHighlightsId={id} />
    </TRPCReactProvider>
}



// export async function generateStaticParams() {
//     const posts = await fetch('https://.../posts').then((res) => res.json())

//     return posts.map((post) => ({
//         slug: post.slug,
//     }))
// }
