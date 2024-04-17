//@ts-nocheck
import { z } from "zod";
import { Highlight, CurriculumNode } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { CurriculumNodeSchemaBase } from "@src/app/pdf/ui/types";

type ICurriculumNodeSchemaType = z.infer<typeof CurriculumNodeSchemaBase> & {
  id: string;
  children: ICurriculumNodeSchemaType[];
};

export const ICurriculumNodeSchema: z.ZodType<ICurriculumNodeSchemaType> =
  CurriculumNodeSchemaBase.extend({
    id: z.string(),
    children: z.lazy(() => ICurriculumNodeSchema.array()),
  });

export type CurriculumNodeWithMaybeRelations = CurriculumNode & {
  children?: CurriculumNodeWithMaybeRelations[];
};

export type NewHighlightWithRelationsInput = Omit<
  Highlight & {
    node?: Omit<CurriculumNode, "id" | "parentId"> | null;
  },
  "id" | "nodeId"
>;

export const curriculumNodeRouter = createTRPCRouter({
  updateNode: publicProcedure
    .input(
      z.object({
        curriculumNode: ICurriculumNodeSchema,
      })
    )
    .mutation<CurriculumNodeWithMaybeRelations | null>(
      async ({ ctx, input }) => {
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
              comments: input.curriculumNode.comments,
            },
            include: {
              children: true,
            },
          },
        ];

        if (input.curriculumNode.children.length) {
          updateNodeParams[0].data.children = {
            createMany: {
              data: input.curriculumNode.children.map((child) => ({
                prompt: child.prompt,
                response: child.response,
                timestamp: child.timestamp,
                comments: child.comments,
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
      }
    ),
});
