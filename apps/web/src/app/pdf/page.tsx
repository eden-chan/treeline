import React from "react";

import { User, clerkClient, currentUser } from "@clerk/nextjs/server";
import { AnnotatedPdf, Highlight } from "@prisma/client";
import { RedirectToSignIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { api } from "@src/trpc/server";
import { AskHighlightProvider } from "@src/context/ask-highlight-context";
import { AnnotatedPdfWithProfile } from "@src/lib/types";

const PDFViewer = dynamic(() => import("@src/app/pdf/ui/components/Viewer"), {
	ssr: false, // Disable server-side rendering for this component
});

const S3_BASE_URL = "https://treeline.s3.us-east-2.amazonaws.com";

export default async function Page() {
	const headersList = headers();
	const header_url = headersList.get("x-url") || "";

	const urlParams = new URLSearchParams(header_url.split("?")[1]);
	const defaultPdfURL = `${S3_BASE_URL}/1706.03762.pdf`;
	let arxivPdfUrl: URL;
	let s3PdfUrl: URL;

	try {
		// get the uploaded PDF id
		arxivPdfUrl = new URL(urlParams.get("url") || defaultPdfURL);
		const key = arxivPdfUrl.href.substring(
			arxivPdfUrl.href.lastIndexOf("/") + 1,
		); // Extract the PDF ID from the URL
		s3PdfUrl = new URL(`${S3_BASE_URL}/${key}`);
	} catch (error) {
		console.error(error);
		return <div>Not a valid URL</div>;
	}

	const user: User | null = await currentUser();
	const userEmail: string | undefined = user?.emailAddresses[0]?.emailAddress;

	if (!user || !userEmail) {
		return <RedirectToSignIn redirectUrl={`/pdf?url=${arxivPdfUrl.href}`} />;
	}

	let newUserData: AnnotatedPdf & { highlights: Highlight[] } = {
		id: new ObjectId().toString(),
		highlights: [],
		source: s3PdfUrl.href,
		userId: userEmail,
	};

	let { id, highlights, source, userId } = newUserData;
	try {
		const data = await api.annotatedPdf.fetchAnnotatedPdf({
			userId: userEmail,
			source: s3PdfUrl.href,
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
		source: s3PdfUrl.href,
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
			source: arxivPdfUrl.href,
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
			/>
		</AskHighlightProvider>
	);
}
