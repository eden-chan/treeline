import React from "react";
import { api } from "@src/trpc/server";
import SearchCta from "./pdf/ui/components/SearchCta";
import Timeline from "./pdf/ui/components/Timeline";
import { currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";
import { AnnotatedPdf } from "@prisma/client";
import { clerkClient } from '@clerk/nextjs/server';


export default async function Page() {
	const clerkUser = await currentUser();
	const clerkUserEmail = clerkUser?.emailAddresses[0]?.emailAddress;
	const user = await api.user.fetchUser({
		email: clerkUserEmail,
	});

	const clerkUsers = await clerkClient.users.getUserList();
	const userEmails = [];
	for (let i = 0; i < clerkUsers.length; i++) {
		const emailAddress = clerkUsers[i]?.emailAddresses?.[0]?.emailAddress;
		if (emailAddress) {
			userEmails.push(emailAddress);
		}
	}

	const users = await api.user.fetchUsersByEmails({ userEmailList: userEmails }) ?? [];

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
	const parsedPapers = (await api.parsedPaper.fetchAllParsedPapers()) ?? [];

	return (
		<main className="text-black flex flex-col gap-10">
			<div className="flex h-screen overflow-x-hidden flex-col">
				<Navbar users={users} loggedInUser={user} />
				<SearchCta />
			</div>
			{/* <BentoGridThirdDemo /> */}
			<Timeline articles={timeline} parsedPapers={parsedPapers} />
		</main>
	);
}
