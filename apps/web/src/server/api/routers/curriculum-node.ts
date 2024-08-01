import { z } from "zod";
import { Highlight, CurriculumNode } from "@prisma/client";
import { CurriculumNodeSchemaBase } from "@/components/pdf/types";
import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";

export type CurriculumNodeWithMaybeRelations = CurriculumNode & {
	children?: CurriculumNodeWithMaybeRelations[];
};

export type NewHighlightWithRelationsInput = Omit<
	Highlight & {
		node?: Omit<CurriculumNode, "id" | "parentId"> | null;
	},
	"id" | "nodeId"
>;

type ICurriculumNodeSchemaType = z.infer<typeof CurriculumNodeSchemaBase> & {
	id: string;
	children?: ICurriculumNodeSchemaType[];
};

const ICurriculumNodeSchema: z.ZodType<ICurriculumNodeSchemaType> =
	CurriculumNodeSchemaBase.extend({
		id: z.string(),
		children: z.lazy(() => ICurriculumNodeSchema.array()),
	});

export const curriculumNodeRouter = createTRPCRouter({
	updateNode: publicProcedure
		.input(
			z.object({
				curriculumNode: ICurriculumNodeSchema,
			}),
		)
		.mutation<CurriculumNodeWithMaybeRelations | null>(async ({ input }) => {
			let res: CurriculumNodeWithMaybeRelations;

			const updateNodeParams: Parameters<typeof db.curriculumNode.update> = [
				{
					where: {
						id: input.curriculumNode.id,
					},
					data: {
						prompt: input.curriculumNode.prompt,
						response: input.curriculumNode.response,
						timestamp: input.curriculumNode.timestamp,
					},
					include: {
						children: true,
					},
				},
			];

			if (
				input.curriculumNode?.children &&
				input.curriculumNode.children.length > 0
			) {
				updateNodeParams[0].data.children = {
					createMany: {
						data: input.curriculumNode.children.map((child) => ({
							prompt: child.prompt,
							response: child.response,
							timestamp: child.timestamp,
						})),
					},
				};
			}

			try {
				res = await db.curriculumNode.update(...updateNodeParams);
			} catch (error) {
				console.error("Failed to update curriculum node", error);
				return null;
			}
			return res;
		}),
});
