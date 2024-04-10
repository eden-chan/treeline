import { z } from "zod";
import { Highlight, CurriculumNode } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { HighlightWithCurriculumNodeSchema } from "@src/app/pdf/ui/types";

export type HighlightWithRelations = Omit<
  Highlight & {
    node?: Omit<CurriculumNode, "id" | "parentId"> | null;
  },
  "id" | "nodeId"
>;

export const highlightRouter = createTRPCRouter({
  createHighlight: publicProcedure
    .input(
      z.object({
        highlight: HighlightWithCurriculumNodeSchema,
      }),
    )
    .mutation<HighlightWithRelations | null>(async ({ ctx, input }) => {
      let res: HighlightWithRelations;

      const createHighlightParams: Parameters<typeof db.highlight.create> = [
        {
          data: {
            ...input.highlight,
            annotatedPdfId: undefined,
            annotatedPdf: {
              connect: {
                id: input.highlight.annotatedPdfId,
              },
            },
            node: undefined,
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
        console.error("Failed to upsert highlights:", error);
        return null;
      }
      return res;
    }),
});
