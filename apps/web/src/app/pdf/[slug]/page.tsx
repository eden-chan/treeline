import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('@src/components/pdf-viewer'), {
    ssr: false, // Disable server-side rendering for this component
}); import { api } from '@src/trpc/server';
import { TRPCReactProvider } from '@src/trpc/react';
export default async function Page({ params }: { params: { slug: string } }) {

    const arxivId = params.slug
    const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    const user_and_source = await api.post.fetchUserHighlights({ user: "eden", source: pdfUrl });
    const highlights = user_and_source[0]?.highlights ?? []
    const source = user_and_source[0]?.source ?? pdfUrl
    const loadedUserHighlightsId = user_and_source[0]?.id ?? null

    return <TRPCReactProvider>
        <PDFViewer loadedHighlights={highlights} loadedSource={source} loadedUserHighlightsId={loadedUserHighlightsId} />
    </TRPCReactProvider>
}



// export async function generateStaticParams() {
//     const posts = await fetch('https://.../posts').then((res) => res.json())

//     return posts.map((post) => ({
//         slug: post.slug,
//     }))
// }
