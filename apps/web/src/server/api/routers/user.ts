import { z } from "zod";
import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";

export const accountsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  fetchUser: publicProcedure
    .input(
      z.object({ email: z.string().optional(), handle: z.string().optional() })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: Record<string, string> = {};
      if (input.email) {
        whereClause["email"] = input.email;
      }
      if (input.handle) {
        whereClause["handle"] = input.handle;
      }

      let result;
      try {
        const start = Date.now();
        console.log({ whereClause });
        result = await db.users.findFirst({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return {};
      }
      console.log("Fetched user:", result);
      return result;
    }),
  fetchUsers: publicProcedure
    .input(z.object({ userEmailList: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const whereClause: Record<string, any> = {};
      if (input.userEmailList) {
        whereClause["email"] = { in: input.userEmailList };
      }

      let result;
      try {
        const start = Date.now();
        result = await db.users.findMany({
          where: whereClause,
        });
        const end = Date.now();
        console.log(`Query took ${end - start}ms`);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        return {};
      }
      console.log("Fetched user:", result);
      return result;
    }),
});
