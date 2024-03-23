import { useRouter } from 'next/router';
import PDFViewer from '../../../components/pdf-viewer'; // Adjust the import path as necessary
import { api } from '~/trpc/server';
import { TRPCReactProvider } from '~/trpc/react';
export default async function Page({ params }: { params: { slug: string } }) {

    const arxivId = params.slug
    const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    const user_and_source = await api.post.fetchUserHighlights({ user: "eden", source: pdfUrl });
    const highlights = user_and_source[0]?.highlights ?? []
    const source = user_and_source[0]?.source ?? pdfUrl

    return <TRPCReactProvider>
        <PDFViewer loadedHighlights={highlights} loadedSource={source} />
    </TRPCReactProvider>
}



// export async function generateStaticParams() {
//     const posts = await fetch('https://.../posts').then((res) => res.json())

//     return posts.map((post) => ({
//         slug: post.slug,
//     }))
// }
