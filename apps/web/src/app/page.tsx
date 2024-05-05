import React from "react";
import { api } from "@src/trpc/server";
import SearchCta from "./pdf/ui/components/SearchCta";
import Timeline from "./pdf/ui/components/Timeline";
import { RedirectToSignIn, currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";
import { BentoGridThirdDemo } from "@src/components/paper-card";

export default async function Page() {
	const clerkUser = await currentUser();

	if (!clerkUser) {
		return <RedirectToSignIn />;
	}
	// TODO: Map Clerk userid to mongodb id
	const clerkUserEmail = clerkUser?.emailAddresses[0]?.emailAddress;
	const user = await api.user.fetchUser({
		email: clerkUserEmail,
	});

	if (!user) {
		return <RedirectToSignIn />;
	}
	const followedUsers =
		(await api.user.fetchUsers({
			userEmailList: user?.follows ?? [],
		})) ?? [];
	// Populate timeline with highlights of user and follows.
	const timeline =
		(await api.annotatedPdf.fetchAllAnnotatedPdfs({
			userList: [user.email, ...(user?.follows ?? [])],
		})) ?? [];

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
