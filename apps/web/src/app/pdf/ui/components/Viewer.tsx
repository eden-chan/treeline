'use client'
import { Worker } from '@react-pdf-viewer/core';

// Import the main component
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

// Your render function
export default function PDFViewer2() {
    return (<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl="https://looseleaf-app.s3.us-east-2.amazonaws.com/users/clv4q7jra003mle0fo7asmszw/ECE%20459%20Notes-c7e788e7-ce2d-4c9e-aea7-501503322e57.pdf" />;
    </Worker>)
}