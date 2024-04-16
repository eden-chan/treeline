import { z } from "zod";
import { ParsedPapers } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";

export interface TitleSourcePair {
  title: string;
  source: string;
}

export const parsedPapersRouter = createTRPCRouter({
  fetchParsedPdf: publicProcedure
    .input(
      z.object({
        source: z.string(),
      }),
    )
    .query<ParsedPapers | null>(async ({ input }) => {
      const whereClause: Record<string, string> = {};
      whereClause["source"] = input.source;
      let result: ParsedPapers | null;
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
  fetchAllParsedPapers: publicProcedure.query<ParsedPapers[]>(async () => {
    let result: ParsedPapers[];
    try {
      result = await db.parsedPapers.findMany();
    } catch (error) {
      console.error("Failed to fetch parsed paper:", error);
      return [];
    }
    return result;
  }),
  fetchAllParsedSources: publicProcedure.query<TitleSourcePair[]>(async () => {
    let result: TitleSourcePair[];
    try {
      let resp = await db.parsedPapers.findMany({
        select: { source: true, title: true },
      });
      result = resp
        .filter((paper) => paper.source !== undefined)
        .map((paper) => {
          return { source: paper.source, title: paper.title };
        });
    } catch (error) {
      console.error("Failed to fetch parsed paper:", error);
      return [];
    }
    return result;
  }),
});
