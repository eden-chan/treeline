import { z } from "zod";
import { Highlight, CurriculumNode } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { HighlightWithCurriculumNodeSchema } from "@src/app/pdf/ui/types";
import {
	CurriculumNodeWithRelations,
	HighlightWithRelations,
} from "@src/lib/types";

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
	updateHighlightContent: publicProcedure
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

				if (!res?.content) {
					throw Error("Cannot find comment to be updated");
				}

				updatedHighlight = await db.highlight.update({
					where: {
						id: input.highlightId,
					},
					data: {
						content: input.text,
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
	deleteHighlight: publicProcedure
		.input(
			z.object({
				highlightId: z.string(),
			}),
		)
		.mutation<boolean | null>(async ({ input }) => {
			const nodeIds: Record<string, string>[] = [];

			try {
				const addNodeIdsDfs = (node: CurriculumNodeWithRelations) => {
					if (node.children) {
						for (const child of node.children) {
							addNodeIdsDfs(child);
						}
					}
					nodeIds.push({ $oid: node.id });
				};

				const highlight = await db.highlight.findFirst({
					where: {
						id: input.highlightId,
					},
					select: {
						node: {
							include: {
								children: true,
							},
						},
					},
				});

				if (!highlight) {
					return false;
				}

				if (highlight.node) {
					addNodeIdsDfs(highlight.node);
				}

				await db.$transaction([
					db.$runCommandRaw({
						delete: "CurriculumNode",
						bypassDocumentValidation: true,
						// References: https://github.com/prisma/prisma/issues/11830
						deletes: [
							{
								q: { _id: { $in: nodeIds } },
								limit: 0,
							},
						],
					}),
					db.highlight.delete({
						where: { id: input.highlightId },
					}),
				]);

				return true;
			} catch (error) {
				console.error("Failed to delete highlight:", error);
				return null;
			}
		}),
});
