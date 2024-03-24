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
        user: z.string(),
        source: z.string(),
        id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        return db.highlights.update({
          where: {
            id: input.id,
          },
          data: {
            highlights: input.highlights,
          },
        });
      } else {
        return db.highlights.create({
          data: {
            user: input.user,
            source: input.source,
            highlights: input.highlights,
          },
        });
      }
    }),
  /**
   * Fetches user highlights based on optional user and source filters.
   * It attempts to retrieve highlights from the database and handles any errors that might occur during the fetch.
   * @param {Object} input - Contains optional user and source strings to filter the highlights.
   * @returns {Promise<Array>} - The fetched highlights based on the applied filters.
   */
  fetchUserHighlights: publicProcedure
    .input(
      z.object({ user: z.string().optional(), source: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: Record<string, string> = {};
      if (input.user) {
        console.log("Filtering by user:", input.user);
        whereClause["user"] = input.user;
      }
      if (input.source) {
        console.log("Filtering by source:", input.source);
        whereClause["source"] = input.source;
      }
      let result;
      try {
        const start = Date.now();
        console.log("where clause", whereClause);
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
});
