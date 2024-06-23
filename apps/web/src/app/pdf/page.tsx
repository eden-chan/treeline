import React from "react";

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
} from "@src/lib/types";

const PDFViewer = dynamic(() => import("@src/app/pdf/ui/components/Viewer"), {
	ssr: false, // Disable server-side rendering for this component
});

// Removes box shadow
import "./ui/style/pdf_viewer.css";

const CORS_PROTECTED_BASE_URL = ["https://arxiv.org/pdf/"]

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
		await api.source.create({
			source: pdfUrl.href,
		});

		// only fetch pdf bytes serverside if it is cors-protected like arxiv 
		// otherwise load in clientside
		if (CORS_PROTECTED_BASE_URL.some(url => pdfUrl.href.startsWith(url))) {
			const response = await fetch(pdfUrl.href);
			const pdfBytes_ = await response.arrayBuffer();
			pdfBytes = Array.from(new Uint8Array(pdfBytes_));
		}

	} catch (error) {
		console.error(error);
		return <div>Not a valid URL</div>;
	}

	// Make a fetch to the /api/pdf route to get the PDF data


	const user: User | null = await currentUser();
	const userEmail: string | undefined = user?.emailAddresses[0]?.emailAddress;

	if (!user || !userEmail) {
		return <RedirectToSignIn redirectUrl={`/pdf?url=${pdfUrl.href}`} />;
	}

	let newUserData: AnnotatedPdf & { highlights: HighlightWithRelations[] } = {
		id: new ObjectId().toString(),
		highlights: [],
		source: pdfUrl.href,
		userId: userEmail,
	};

	let { id, highlights, source, userId } = newUserData;
	try {
		const data = await api.annotatedPdf.fetchAnnotatedPdf({
			userId: userEmail,
			source: pdfUrl.href,
		});

		if (data) {
			id = data.id;
			highlights = data.highlights;
			source = data.source;
			userId = data.userId;
		} else if (userEmail) {
			await api.annotatedPdf.upsertAnnotatedPdf({
				id,
				highlights,
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
	const userProfiles = users.map((user) => {
		return {
			email: user.emailAddresses[0]?.emailAddress ?? "",
			imageUrl: user.imageUrl,
			firstName: user.firstName,
			lastName: user.lastName,
		};
	});

	const annotatedPdfs = await api.annotatedPdf.fetchAllAnnotatedPdfs({
		source: pdfUrl.href,
		userList: userEmails,
	});

	let annotatedPdfsWithProfile: AnnotatedPdfWithProfile[] = [];
	if (annotatedPdfs) {
		for (let annotatedPdf of annotatedPdfs) {
			const userProfile = userProfiles.find(
				(user) => user.email === annotatedPdf.userId,
			);

			if (!userProfile) continue;

			annotatedPdfsWithProfile.push({
				...annotatedPdf,
				userProfilePicture: userProfile.imageUrl,
				firstName: userProfile.firstName || "",
				lastName: userProfile.lastName || "",
			});
		}
	}

	const parsedPaper =
		(await api.parsedPaper.fetchParsedPdf({
			source: pdfUrl.href,
		})) ?? null;

	return (
		<AskHighlightProvider
			annotatedPdfId={id}
			userId={userId}
			loadedSource={source}
			parsedPaper={parsedPaper}
		>
			<PDFViewer
				annotatedPdfId={id}
				loadedSource={source}
				userId={userId}
				userHighlights={highlights}
				annotatedPdfsWithProfile={annotatedPdfsWithProfile}
				pdfBytes={pdfBytes}
			/>
		</AskHighlightProvider>
	);
}
