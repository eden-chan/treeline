import React from 'react';
import { TRPCReactProvider } from '@src/trpc/react';
import PDFViewer from "../../components/pdf-viewer";

export default function Page() {
  return (
    <TRPCReactProvider>
      <PDFViewer />
    </TRPCReactProvider>
  );
}

