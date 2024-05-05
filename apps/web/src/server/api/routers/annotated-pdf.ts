import { z } from "zod";
import { AnnotatedPdf } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { IHighlightSchema } from "@src/app/pdf/ui/types";
import {
	AnnotatedPdfWithRelations,
	CurriculumNodeWithRelations,
} from "@src/lib/types";

export const annotatedPdfRouter = createTRPCRouter({
	// Create new highlight object if doesn't exist
	// Otherwise, update the highlight objects
	upsertAnnotatedPdf: publicProcedure
		.input(
			z.object({
				// todo: fix zod schema compatibility with complex prisma types
				highlights: z.array(IHighlightSchema),
				userId: z.string(),
				source: z.string(),
				id: z.string(), // mongo id is provided ahead of time for new documents
			}),
		)
		.mutation<AnnotatedPdf | null>(async ({ ctx, input }) => {
			let res: AnnotatedPdf;
			try {
				res = await db.annotatedPdf.upsert({
					where: {
						id: input.id,
					},
					update: {
						highlights: {
							create: input.highlights,
						},
					},
					create: {
						userId: input.userId,
						source: input.source,
						highlights: {
							create: input.highlights,
						},
					},
				});
			} catch (error) {
				console.error("Failed to upsert highlights:", error);
				return null;
			}
			return res;
		}),
	fetchAnnotatedPdf: publicProcedure
		.input(
			z.object({
				userId: z.string(),
				source: z.string(),
			}),
		)
		.query<AnnotatedPdfWithRelations | null>(async ({ ctx, input }) => {
			let result: AnnotatedPdfWithRelations | null;

			// Currently Prism does not support nested include queries
			// Github: https://github.com/prisma/prisma/issues/3725
			// TODO: add bark for recursive tree structure quieries: https://prisma-extension-bark.gitbook.io/docs/getting-started
			const findFirstAnnotatedPdfParams: Parameters<
				typeof db.annotatedPdf.findFirst
			> = [
				{
					where: input,
					include: {
						highlights: {
							include: {
								node: {
									include: {
										children: true,
									},
								},
							},
						},
					},
				},
			];

			// Recursive query to fetch all children
			let currentChildPointer =
				// @ts-ignore
				findFirstAnnotatedPdfParams[0].include.highlights.include.node.include;
			for (let i = 0; i < 20; i++) {
				currentChildPointer.children = {
					include: {
						children: true,
					},
				};
				currentChildPointer = currentChildPointer.children.include;
			}

			try {
				result = (await db.annotatedPdf.findFirst(
					...findFirstAnnotatedPdfParams,
				)) as AnnotatedPdfWithRelations | null;
			} catch (error) {
				console.error("Failed to fetch annotated pdf:", error);
				return null;
			}
			return result;
		}),
	fetchAllAnnotatedPdfs: publicProcedure
		.input(
			z.object({
				source: z.string().optional(),
				userList: z.array(z.string()),
			}),
		)
		.query<AnnotatedPdfWithRelations[] | null>(async ({ ctx, input }) => {
			const whereClause: Record<string, any> = {};

			whereClause["userId"] = { in: input.userList };

			if (input.source) {
				whereClause["source"] = input.source;
			}
			let result: AnnotatedPdfWithRelations[];
			try {
				result = await db.annotatedPdf.findMany({
					where: whereClause,
					include: {
						highlights: {
							include: {
								node: {
									include: {
										children: true,
									},
								},
							},
						},
					},
				});
			} catch (error) {
				console.error("Failed to fetch fetch annotated pdfs:", error);
				return null;
			}

			return result;
		}),

	fetchDefaultAnnotatedPdfs: publicProcedure.query<AnnotatedPdf[] | null>(
		async () => {
			let result: AnnotatedPdf[];
			try {
				result = await db.annotatedPdf.findMany({
					where: {
						userId: "default",
					},
				});
			} catch (error) {
				console.error("Failed to fetch fetch annotated pdfs:", error);
				return null;
			}

			return result;
		},
	),
	resetHighlights: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation<boolean>(async ({ ctx, input }) => {
			// Jank implementation is due to the fact that deleting self-related documents is not supported in Prisma.
			// NoAction in onDelete and onUpdate in Prisma effectively works as restrict.
			// source: https://github.com/prisma/prisma/issues/17649#issuecomment-1491003365
			const annotatedPdf = await db.annotatedPdf.findFirst({
				where: input,
				include: {
					highlights: {
						include: {
							node: {
								include: {
									children: true,
								},
							},
						},
					},
				},
			});

			if (!annotatedPdf) {
				console.error("failed to find annotated pdf:", input);
				return false;
			}

			const nodeIds: Record<string, string>[] = [];

			const addNodeIdsDfs = (node: CurriculumNodeWithRelations) => {
				if (node.children) {
					for (const child of node.children) {
						addNodeIdsDfs(child);
					}
				}
				nodeIds.push({ $oid: node.id });
			};

			for (const highlight of annotatedPdf.highlights) {
				if (highlight.node) {
					addNodeIdsDfs(highlight.node);
				}
			}

			try {
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
					db.annotatedPdf.update({
						where: input,
						data: {
							highlights: {
								deleteMany: {},
							},
						},
					}),
				]);
			} catch (err) {
				console.error("Failed to reset highlights:", err);
				return false;
			}
			return true;
		}),
});
