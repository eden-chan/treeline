import { z } from "zod";
import { Comment } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { db } from "@src/lib/db";
import { ObjectId } from "mongodb";

export const commentRouter = createTRPCRouter({
  deleteComment: publicProcedure
    .input(z.object({ commentId: z.string() }))
		.mutation<boolean>(async ({ input }) => {
			try {
				await db.comment.delete({
					where: { id: input.commentId },
				});
        return true;
			} catch (error) {
				console.error("Failed to delete comment:", error);
				return false;
			}
		}),
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

			input.id =
				input.id && input.id.trim() !== ""
					? input.id
					: new ObjectId().toString(); // Handle empty string, null, or undefined id by creating a new ObjectId

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
			} catch (error) {
				console.error("Failed to upsert comment:", error);
				return null;
			}
			return res;
		}),
});
