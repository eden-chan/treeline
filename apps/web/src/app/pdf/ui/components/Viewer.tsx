'use client'
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import DisplayNotesSidebarExample from '@/components/pdf/DisplayNotesSidebarExample';
import { useAskHighlight } from '@src/context/ask-highlight-context';

export default function PDFViewer2() {

    const {
        currentHighlight,
        selectHighlight,
        createAskHighlight,
        clearSelectedHighlight,
    } = useAskHighlight();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <DisplayNotesSidebarExample fileUrl="https://treeline.s3.us-east-2.amazonaws.com/1706.03762v7.pdf" />;
        </Worker>)
}

