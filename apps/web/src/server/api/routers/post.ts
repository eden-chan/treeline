import { z } from "zod";
import { db } from "~/lib/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HighlightSchema } from "~/types/post";

export const highlightsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        highlights: z.array(HighlightSchema),
        user: z.string(),
        source: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      return db.highlights.create({
        data: {
          user: input.user,
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
      z.object({ user: z.string().optional(), source: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
      console.log(
        "Fetching user highlights with input:",
        input,
        "and ctx:",
        ctx
      );
      const whereClause: Record<string, any> = {};
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
        result = await db.highlights.findMany({
          where: whereClause,
        });
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        throw new Error("Error fetching highlights");
      }
      console.log("Fetched highlights:", result);
      return result;
    }),
});
