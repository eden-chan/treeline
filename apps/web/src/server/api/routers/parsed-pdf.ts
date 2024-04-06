import { z } from "zod";
import { ParsedPapers } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";

export const parsedPapersRouter = createTRPCRouter({
  fetchParsedPdf: publicProcedure
    .input(
      z.object({
        source: z.string(),
      })
    )
    .query<ParsedPapers | undefined>(async ({ ctx, input }) => {
      const whereClause: Record<string, string> = {};
      whereClause["source"] = input.source;
      let result;
      try {
        const start = Date.now();
        result = await db.parsedPapers.findFirst({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch parsed paper:", error);
        return undefined;
      }

      return result ?? undefined;
    }),
});
