import { z } from "zod";
import { ParsedPapers } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";

export const parsedPapersRouter = createTRPCRouter({
  fetchParsedPdf: publicProcedure
    .input(
      z.object({
        source: z.string(),
      }),
    )
    .query<ParsedPapers | null>(async ({ ctx, input }) => {
      const whereClause: Record<string, string> = {};
      whereClause["source"] = input.source;
      let result;
      try {
        result = await db.parsedPapers.findFirst({
          where: whereClause,
        });
      } catch (error) {
        console.error("Failed to fetch parsed paper:", error);
        return null;
      }

      return result;
    }),
});
