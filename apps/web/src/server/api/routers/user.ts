import { z } from "zod";
import { User } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { UserSchema } from "@src/app/pdf/ui/types";

export const userRouter = createTRPCRouter({
	updateFollowStatus: publicProcedure
		.input(z.object({ loggedInUser: UserSchema, searchedUser: UserSchema }))
		.mutation(async ({ input }) => {
			// Check if loggedInUser is currently following searchedUser by looking for searchedUser's email in loggedInUser's follows list.
			const isloggedInUserFollowingsearchedUser =
				input.loggedInUser.follows.includes(input.searchedUser.email);

			if (isloggedInUserFollowingsearchedUser) {
				// If loggedInUser is following searchedUser, remove searchedUser from loggedInUser's follows list.
				await db.user.update({
					where: { id: input.loggedInUser.id },
					data: {
						follows: {
							set: input.loggedInUser.follows.filter(
								(email) => email !== input.searchedUser.email,
							),
						},
					},
				});
				console.debug(
					`loggedInUser ${input.loggedInUser.email}  unfollowed ${input.searchedUser.email}`,
				);
				// Remove loggedInUser from searchedUser's followers list.
				await db.user.update({
					where: { id: input.searchedUser.id },
					data: {
						followers: {
							set: input.searchedUser.followers.filter(
								(email) => email !== input.loggedInUser.email,
							),
						},
					},
				});
				console.debug(
					`${input.searchedUser.email} lost follower ${input.loggedInUser.email}`,
				);
			} else {
				// If loggedInUser is not following searchedUser, add searchedUser to loggedInUser's follows list.
				await db.user.update({
					where: { id: input.loggedInUser.id },
					data: {
						follows: {
							set: [...input.loggedInUser.follows, input.searchedUser.email],
						},
					},
				});
				console.debug(
					`loggedInUser ${input.loggedInUser.email} followed ${input.searchedUser.email}`,
				);
				// Add loggedInUser to searchedUser's followers list.
				await db.user.update({
					where: { id: input.searchedUser.id },
					data: {
						followers: {
							set: [...input.searchedUser.followers, input.loggedInUser.email],
						},
					},
				});
				console.debug(
					`${input.searchedUser.email} gained follower ${input.loggedInUser.email}`,
				);
			}
		}),
	fetchUser: publicProcedure
		.input(
			z.object({ email: z.string().optional(), handle: z.string().optional() }),
		)
		.query<User | undefined>(async ({ ctx, input }) => {
			const whereClause: Record<string, string> = {};
			if (input.email) {
				whereClause["email"] = input.email;
			}
			if (input.handle) {
				whereClause["handle"] = input.handle;
			}

			let result;
			try {
				result = await db.user.findFirst({
					where: whereClause,
				});
				if (!result) {
					return undefined;
				}
			} catch (error) {
				console.error("Failed to fetch user:", error);
				return undefined;
			}
			return result;
		}),
	fetchUsersByEmails: publicProcedure
		.input(z.object({ userEmailList: z.array(z.string()) }))
		.query<User[] | undefined>(async ({ input }) => {
			const whereClause: Record<string, any> = {};
			if (input.userEmailList) {
				whereClause["email"] = { in: input.userEmailList };
			}

			let result;
			try {
				result = await db.user.findMany({
					where: whereClause,
				});
			} catch (error) {
				console.error("Failed to fetch highlights:", error);
				return undefined;
			}
			return result;
		}),
});
