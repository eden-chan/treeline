import { z } from "zod";
import { db } from "~/lib/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const highlightsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
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
      console.log("Fetching user highlights with input:", input);
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
