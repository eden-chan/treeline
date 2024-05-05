import React from "react";
import { api } from "@src/trpc/server";
import SearchCta from "./pdf/ui/components/SearchCta";
import Timeline from "./pdf/ui/components/Timeline";
import { currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";
import { BentoGridThirdDemo } from "@src/components/paper-card";
import { AnnotatedPdf } from "@prisma/client";

export default async function Page() {
	const clerkUser = await currentUser();
	const clerkUserEmail = clerkUser?.emailAddresses[0]?.emailAddress;
	const user = await api.user.fetchUser({
		email: clerkUserEmail,
	});

	const followedUsers =
		(await api.user.fetchUsers({
			userEmailList: user?.follows ?? [],
		})) ?? [];

	// Populate timeline with highlights of user and follows.
	let timeline: AnnotatedPdf[] = [];
	if (user) {
		const userList = [user.email, ...(user?.follows ?? [])];
		timeline =
			(await api.annotatedPdf.fetchAllAnnotatedPdfs({
				userList,
			})) ?? [];
	} else {
		timeline = (await api.annotatedPdf.fetchDefaultAnnotatedPdfs()) ?? [];
	}

	// Populate parsed papers
	const parsedPapers = (await api.parsedPapers.fetchAllParsedPapers()) ?? [];

	return (
		<main className="text-black flex flex-col gap-10">
			<section className="flex h-screen overflow-x-hidden flex-col">
				<Navbar users={followedUsers} loggedInUser={user} />
				<SearchCta />
			</section>
			{/* <BentoGridThirdDemo /> */}
			<Timeline articles={timeline} parsedPapers={parsedPapers} />
		</main>
	);
}
