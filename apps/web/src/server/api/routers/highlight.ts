import { z } from "zod";
import { Highlight, CurriculumNode } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { HighlightWithCurriculumNodeSchema } from "@src/app/pdf/ui/types";
import { HighlightWithRelations } from "@src/lib/types";

export type NewHighlightWithRelationsInput = Omit<
	Highlight & {
		node?: Omit<CurriculumNode, "id" | "parentId" | "highlightId"> | null;
	},
	"id"
>;

export const highlightRouter = createTRPCRouter({
	createHighlight: publicProcedure
		.input(
			z.object({
				highlight: HighlightWithCurriculumNodeSchema,
			}),
		)
		.mutation<HighlightWithRelations | null>(async ({ input }) => {
			let res: HighlightWithRelations;

			const createHighlightParams: Parameters<typeof db.highlight.create> = [
				{
					data: {
						...input.highlight,
						annotatedPdfId: undefined,
						node: undefined,
						annotatedPdf: {
							connect: {
								id: input.highlight.annotatedPdfId,
							},
						},
					},
					include: {
						node: true,
					},
				},
			];

			if (input.highlight.node) {
				createHighlightParams[0].data["node"] = {
					create: {
						...input.highlight.node,
						children: undefined,
					},
				};
			}

			try {
				res = await db.highlight.create(...createHighlightParams);
			} catch (error) {
				console.error("Failed to create highlights:", error);
				return null;
			}
			return res;
		}),
	updateHighlightComment: publicProcedure
		.input(
			z.object({
				highlightId: z.string(),
				text: z.string(),
			}),
		)
		.mutation<HighlightWithRelations | null>(async ({ input }) => {
			let updatedHighlight: HighlightWithRelations;

			try {
				const res = await db.highlight.findFirst({
					where: {
						id: input.highlightId,
					},
				});

				if (!res?.comment) {
					throw Error("Cannot find comment to be updated");
				}

				const { emoji, userId } = res.comment;

				updatedHighlight = await db.highlight.update({
					where: {
						id: input.highlightId,
					},
					data: {
						comment: {
							text: input.text,
							emoji: emoji,
							timestamp: new Date(),
							userId: userId,
						},
					},
					include: {
						node: true,
					},
				});
			} catch (error) {
				console.error("Failed to update highlight comment:", error);
				return null;
			}
			return updatedHighlight;
		}),
});
