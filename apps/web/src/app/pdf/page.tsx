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
const PDFViewer = dynamic(() => import("@src/components/pdf-viewer"), {
	ssr: false, // Disable server-side rendering for this component
});

export default async function Page() {
	const headersList = headers();
	const header_url = headersList.get("x-url") || "";

	const urlParams = new URLSearchParams(header_url.split("?")[1]);
	const defaultPdfURL = "https://arxiv.org/pdf/1706.03762.pdf";
	let pdfUrl: URL;

	try {
		pdfUrl = new URL(urlParams.get("url") || defaultPdfURL);
	} catch (error) {
		console.error(error);
		return <div>Not a valid URL</div>;
	}

	const user: User | null = await currentUser();
	const userEmail: string | undefined = user?.emailAddresses[0]?.emailAddress;

	if (!user || !userEmail) {
		return <RedirectToSignIn redirectUrl={`/pdf?url=${pdfUrl.href}`} />;
	}

	let newUserData: AnnotatedPdf & { highlights: Highlight[] } = {
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
		(await api.parsedPapers.fetchParsedPdf({
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
			/>
		</AskHighlightProvider>
	);
}
