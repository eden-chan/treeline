import { TRPCReactProvider } from '~/trpc/react';
import PDFViewer from "../../components/pdf-viewer";

export default function Page() {
  return (
    <TRPCReactProvider>
      <PDFViewer />
    </TRPCReactProvider>
  );
}

