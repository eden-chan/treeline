import { z } from "zod";
import { Comment } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { db } from "@src/lib/db";
import { ObjectId } from "mongodb";

export const commentRouter = createTRPCRouter({
	upsertComment: publicProcedure
		.input(
			z.object({
				id: z.string().optional(),
				text: z.string(),
				highlightId: z.string(),
				userId: z.string(),
			}),
		)
		.mutation<Comment | null>(async ({ input }) => {
			let res: Comment;
			console.log("before", input.id);
			input.id =
				input.id && input.id.trim() !== ""
					? input.id
					: new ObjectId().toString(); // Handle empty string, null, or undefined id by creating a new ObjectId

			console.log("after", input.id);
			const upsertCommentParams: Parameters<typeof db.comment.upsert> = [
				{
					where: {
						id: input.id,
					},
					create: {
						...input,
						timestamp: new Date(),
					},
					update: {
						...Object.fromEntries(
							Object.entries(input).filter(([key]) => key !== "id"),
						),
						timestamp: new Date(),
					},
				},
			];
			try {
				res = await db.comment.upsert(...upsertCommentParams);
				console.log("updateCommentUpsert response", res);
			} catch (error) {
				console.error("Failed to upsert comment:", error);
				return null;
			}
			return res;
		}),
});
