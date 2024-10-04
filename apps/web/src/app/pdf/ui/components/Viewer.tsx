"use client";
import { Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import ReadingViewer from "@/components/pdf/ReadingViewer";
import {
	AnnotatedPdfWithProfile,
	HighlightWithRelations,
	UserProfile,
} from "@src/lib/types";

type Props = {
	annotatedPdfId: string;
	loadedSource: string;
	loggedInUserId: string;
	loggedInUserHighlights: HighlightWithRelations[];
	otherUserHighlights: HighlightWithRelations[];
	annotatedPdfsWithProfile: AnnotatedPdfWithProfile[];
	pdfBytes: number[];
	userProfiles: UserProfile[];
}

export default function PDFViewer({
	annotatedPdfId,
	loadedSource,
	loggedInUserId,
	loggedInUserHighlights,
	annotatedPdfsWithProfile,
	pdfBytes,
	userProfiles,
	otherUserHighlights
}: Props) {

	return (
		<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
			<ReadingViewer
				pdfBytes={pdfBytes}
				annotatedPdfId={annotatedPdfId}
				loadedSource={loadedSource}
				loggedInUserId={loggedInUserId}
				loggedInUserHighlights={loggedInUserHighlights}
				otherUserHighlights={otherUserHighlights}
				annotatedPdfsWithProfile={annotatedPdfsWithProfile}
				userProfiles={userProfiles}
			/>

		</Worker>
	);
}
