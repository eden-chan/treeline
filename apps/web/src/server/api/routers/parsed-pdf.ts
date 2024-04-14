import { boolean, z } from "zod";
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
    .query<ParsedPapers | null>(async ({ input }) => {
      const whereClause: Record<string, string> = {};
      whereClause["source"] = input.source;
      let result: ParsedPapers | null;
      try {
        const start = Date.now();
        result = await db.parsedPapers.findFirst({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch parsed paper:", error);
        return null;
      }

      return result;
    }),
  fetchAllParsedPapers: publicProcedure.query<ParsedPapers[]>(async () => {
    let result: ParsedPapers[];
    try {
      const start = Date.now();
      result = await db.parsedPapers.findMany();
      const end = Date.now();
      console.log(`Query took ${end - start}ms`);
    } catch (error) {
      console.error("Failed to fetch parsed paper:", error);
      return [];
    }
    return result;
  }),
  fetchAllParsedSources: publicProcedure.query<string[]>(async () => {
    let result: string[];
    try {
      const start = Date.now();
      let resp = await db.parsedPapers.findMany({ select: { source: true } });
      result = resp
        .filter((paper) => paper.source !== undefined)
        .map((paper) => paper.source);
      const end = Date.now();
      console.log(`Query took ${end - start}ms`);
    } catch (error) {
      console.error("Failed to fetch parsed paper:", error);
      return [];
    }
    return result;
  }),
});
