import { z } from "zod";
import { Comment } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { db } from "@src/lib/db";

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
						...input,
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
