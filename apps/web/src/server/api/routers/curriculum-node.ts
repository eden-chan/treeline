import { z } from "zod";
import { Highlight, CurriculumNode } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { ICurriculumNodeSchema } from "@src/app/pdf/ui/types";

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
      }),
    )
    .mutation<CurriculumNodeWithMaybeRelations | null>(
      async ({ ctx, input }) => {
        let res: CurriculumNodeWithMaybeRelations;

        try {
          res = await db.curriculumNode.update({
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
          });
        } catch (error) {
          console.error("Failed to update curriculum node", error);
          return null;
        }
        return res;
      },
    ),
});
