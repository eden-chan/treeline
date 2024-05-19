"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { followAction } from "@src/app/actions";
import { useState, useTransition } from "react";

export default function FollowButton({
	loggedInUser,
	searchedUser,
}: {
	loggedInUser: User;
	searchedUser: User;
}) {

	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState(null);


	// Check if user1 is currently following user2 by looking for user2's email in user1's follows list.
	const [isFollowing, setIsFollowing] = useState(
		loggedInUser.follows.includes(searchedUser.email),
	);

	const handleFollow = async () => {
		setError(null);
		try {
			startTransition(async () => {
				await followAction(loggedInUser, searchedUser);
			});
		} catch (error) {
			// setError(error.message);
		}

		setIsFollowing((isFollowing) => !isFollowing);
	};

	return (
		<>
			<Button onClick={handleFollow} disabled={isPending}>
				{isFollowing ? "Following" : "Follow"}
			</Button>
			{error && <p>{error}</p>}
		</>
	);
}
