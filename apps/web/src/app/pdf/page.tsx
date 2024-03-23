import { TRPCReactProvider } from '~/trpc/react';
import PDFViewer from "../../components/pdf-viewer";
import { api } from '~/trpc/server';

export default async function Page() {

  const user_and_source = await api.post.fetchUserHighlights({ user: "admin", source: "https://arxiv.org/pdf/1708.08021.pdf" });
  const highlights = user_and_source[0]?.highlights
  const source = user_and_source[0]?.source

  return (
    <TRPCReactProvider>
      {/* <pre className="text-blue-500">{JSON.stringify(user_and_source, null, 2)}</pre> */}
      <PDFViewer loadedHighlights={highlights} loadedSource={source} />
    </TRPCReactProvider>
  );
}

