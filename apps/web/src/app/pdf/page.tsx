import React, { Suspense } from "react";

import { User, clerkClient, currentUser } from "@clerk/nextjs/server";
import { AnnotatedPdf } from "@prisma/client";
import { RedirectToSignIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { api } from "@src/trpc/server";
import { AskHighlightProvider } from "@src/context/ask-highlight-context";
import {
	AnnotatedPdfWithProfile,
	HighlightWithRelations,
	UserProfile,
} from "@src/lib/types";

const PDFViewer = dynamic(() => import("@src/app/pdf/ui/components/Viewer"), {
	ssr: false, // Disable server-side rendering for this component
});

// Removes box shadow
import "./ui/style/pdf_viewer.css";


export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 60


const CORS_PROTECTED_BASE_URL = ["https://arxiv.org/pdf/", "https://github.com"]

export default async function Page() {
	const headersList = headers();
	const header_url = headersList.get("x-url") || "";

	const urlParams = new URLSearchParams(header_url.split("?")[1]);
	const defaultPdfURL = 'https://arxiv.org/pdf/1706.03762'
	let pdfUrl: URL;
	let pdfBytes: number[] = [];

	try {
		// get the uploaded PDF id
		pdfUrl = new URL(urlParams.get("url") || defaultPdfURL);

		const result = await api.source.createSource({
			source: pdfUrl.href,
		});

		// only fetch pdf bytes serverside if it is cors-protected like arxiv 
		// otherwise load in clientside
		if (CORS_PROTECTED_BASE_URL.some(url => pdfUrl.href.startsWith(url))) {
			const response = await fetch(pdfUrl.href);
			const pdfBytes_ = await response.arrayBuffer();
			pdfBytes = Array.from(new Uint8Array(pdfBytes_));
		} else {
			const response = await fetch(pdfUrl.href);
			const pdfBytes_ = await response.arrayBuffer();
			pdfBytes = Array.from(new Uint8Array(pdfBytes_));
		}

	} catch (error) {
		console.error(error);
		return <div>Not a valid URL</div>
	}

	const user: User | null = await currentUser();
	const userEmail: string | undefined = user?.emailAddresses[0]?.emailAddress;

	if (!user || !userEmail) {
		return <RedirectToSignIn redirectUrl={`/pdf?url=${pdfUrl.href}`} />;
	}


	// Get current user highlights, or mark user attempt to annotate PDF
	let newUserData: AnnotatedPdf & { highlights: HighlightWithRelations[] } = {
		id: new ObjectId().toString(),
		highlights: [],
		source: pdfUrl.href,
		userId: userEmail,
	};

	let { id: annotatedPdfId, highlights: loggedInUserHighlights, source, userId } = newUserData;
	try {
		const data = await api.annotatedPdf.fetchAnnotatedPdf({
			userId: userEmail,
			source: pdfUrl.href,
		});

		if (data) {
			annotatedPdfId = data.id;
			loggedInUserHighlights = data.highlights;
			source = data.source;
			userId = data.userId;
		} else if (userEmail) {
			await api.annotatedPdf.upsertAnnotatedPdf({
				id: annotatedPdfId,
				highlights: loggedInUserHighlights,
				source,
				userId: userEmail,
			});
		}
	} catch (error) {
		console.error("Error fetching user highlights:", error);
	}

	const users = await clerkClient.users.getUserList();
	const userEmails = users.map(
		(user) => user.emailAddresses[0]?.emailAddress ?? "",
	);
	const userProfiles: UserProfile[] = users.map((user) => {
		return {
			email: user.emailAddresses[0]?.emailAddress ?? "",
			imageUrl: user.imageUrl,
			firstName: user.firstName ?? "",
			lastName: user.lastName ?? "",
		};
	});

	const userAnnotations = await api.annotatedPdf.fetchAllAnnotatedPdfs({
		source: pdfUrl.href,
		userList: userEmails,
	});

	const annotatedPdfsWithProfile: AnnotatedPdfWithProfile[] = userAnnotations ? userAnnotations.map((annotation) => {
		return {
			...annotation,
			userProfilePicture: userProfiles.find((user) => user.email === annotation.userId)?.imageUrl ?? "",
			firstName: userProfiles.find((user) => user.email === annotation.userId)?.firstName ?? "",
			lastName: userProfiles.find((user) => user.email === annotation.userId)?.lastName ?? "",
		};
	}) : [];


	let otherUserHighlights: HighlightWithRelations[] = [];

	// Separate logged-in user highlights from other user highlights
	if (userAnnotations) {
		for (let annotation of userAnnotations) {
			if (annotation.source !== pdfUrl.href) continue;

			const userProfile = userProfiles.find(
				(user) => user.email === annotation.userId
			);

			if (!userProfile) continue;

			if (annotation.userId === userEmail) {
				loggedInUserHighlights = annotation.highlights;
			} else if (annotation.userId !== userEmail) {
				otherUserHighlights.push(
					...annotation.highlights,
				);
			}
		}
	}

	const parsedPaper =
		(await api.parsedPaper.fetchParsedPdf({
			source: pdfUrl.href,
		})) ?? null;

	return (
		<AskHighlightProvider
			annotatedPdfId={annotatedPdfId}
			userId={userId}
			loadedSource={source}
			parsedPaper={parsedPaper}
		>
			<Suspense fallback={<div>Loading...</div>}>
				<PDFViewer
					annotatedPdfId={annotatedPdfId}
					loadedSource={source}
					loggedInUserId={userId}
					loggedInUserHighlights={loggedInUserHighlights}
					annotatedPdfsWithProfile={annotatedPdfsWithProfile}
					otherUserHighlights={otherUserHighlights}
					pdfBytes={pdfBytes}
					userProfiles={userProfiles}
				/>
			</Suspense>

		</AskHighlightProvider>
	);
}
