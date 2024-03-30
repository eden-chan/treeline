import { z } from "zod";
import { AnnotatedPdf } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { IHighlightSchema } from "@src/app/pdf/ui/types";

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
    .mutation<AnnotatedPdf | undefined>(async ({ ctx, input }) => {
      let res: AnnotatedPdf;
      try {
        res = await db.annotatedPdf.upsert({
          where: {
            id: input.id,
          },
          update: {
            highlights: input.highlights,
          },
          create: {
            userId: input.userId,
            source: input.source,
            highlights: input.highlights,
          },
        });
      } catch (error) {
        console.error("Failed to upsert highlights:", error);
        return undefined;
      }
      return res;
    }),
  fetchAnnotatedPdf: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        source: z.string().optional(),
      }),
    )
    .query<AnnotatedPdf | undefined>(async ({ ctx, input }) => {
      const whereClause: Record<string, string> = {};
      if (input.userId) {
        console.log("Filtering by user:", input.userId);
        whereClause["userId"] = input.userId;
      }
      if (input.source) {
        console.log("Filtering by source:", input.source);
        whereClause["source"] = input.source;
      }
      let result;
      try {
        const start = Date.now();
        result = await db.annotatedPdf.findFirst({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
        if (!result) {
          return undefined;
        }
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        return undefined;
      }
      console.log("Fetched single highlights:", result);
      return result;
    }),
  fetchAllAnnotatedPdfs: publicProcedure
    .input(
      z.object({
        source: z.string().optional(),
        userList: z.array(z.string()),
      }),
    )
    .query<AnnotatedPdf[] | undefined>(async ({ ctx, input }) => {
      const whereClause: Record<string, any> = {};

      whereClause["userId"] = { in: input.userList };

      if (input.source) {
        whereClause["source"] = input.source;
      }
      let result;
      try {
        const start = Date.now();
        result = await db.annotatedPdf.findMany({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        return undefined;
      }

      return result;
    }),
});
