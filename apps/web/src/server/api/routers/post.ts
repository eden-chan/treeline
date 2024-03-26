import { z } from "zod";
import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { IHighlightSchema } from "@src/app/pdf/ui/types";

export const highlightsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Create new highlight object if doesn't exist
  // Otherwise, update the highlight objects
  addHighlight: publicProcedure
    .input(
      z.object({
        highlights: z.array(IHighlightSchema),
        userId: z.string(),
        source: z.string(),
        id: z.string(), // mongo id is provided ahead of time for new documents
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.highlights.upsert({
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
    }),
  /**
   * Fetches user highlights based on optional user and source filters.
   * It attempts to retrieve highlights from the database and handles any errors that might occur during the fetch.
   * @param {Object} input - Contains optional user and source strings to filter the highlights.
   * @returns {Promise<Array>} - The fetched highlights based on the applied filters.
   */
  fetchUserHighlights: publicProcedure
    .input(
      z.object({ userId: z.string().optional(), source: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
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
        result = await db.highlights.findFirst({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        return {};
      }
      console.log("Fetched single highlights:", result);
      return result;
    }),
  fetchAllHighlights: publicProcedure
    .input(
      z.object({ userId: z.string().optional(), source: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
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
        console.log("where clause", whereClause);
        result = await db.highlights.findMany({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        return {};
      }
      console.log("Fetched all highlights:", result);
      return result;
    }),
});
