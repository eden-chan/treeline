"use client";
import { Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import ReadingViewer from "@/components/pdf/ReadingViewer";
import {
	AnnotatedPdfWithProfile,
	HighlightWithRelations,
} from "@src/lib/types";

export default function PDFViewer({
	annotatedPdfId,
	loadedSource,
	userId,
	userHighlights,
	annotatedPdfsWithProfile,
}: {
	annotatedPdfId: string;
	loadedSource: string;
	userId: string;
	userHighlights: HighlightWithRelations[];
	annotatedPdfsWithProfile: AnnotatedPdfWithProfile[];
}) {
	return (
		<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
			<ReadingViewer
				annotatedPdfId={annotatedPdfId}
				loadedSource={loadedSource}
				userId={userId}
				userHighlights={userHighlights}
				annotatedPdfsWithProfile={annotatedPdfsWithProfile}
			/>
		</Worker>
	);
}
