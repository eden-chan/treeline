import { z } from "zod";
import { User } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { UserSchema } from "@src/app/pdf/ui/types";

export const userRouter = createTRPCRouter({
  updateFollowStatus: publicProcedure
    .input(z.object({ user1: UserSchema, user2: UserSchema }))
    .mutation(async ({ ctx, input }) => {
      // Check if user1 is currently following user2 by looking for user2's email in user1's follows list.
      const isUser1FollowingUser2 = input.user1.follows.includes(
        input.user2.email,
      );

      if (isUser1FollowingUser2) {
        // If user1 is following user2, remove user2 from user1's follows list.
        await db.user.update({
          where: { id: input.user1.id },
          data: {
            follows: {
              set: input.user1.follows.filter(
                (email) => email !== input.user2.email,
              ),
            },
          },
        });
        // Remove user1 from user2's followers list.
        await db.user.update({
          where: { id: input.user2.id },
          data: {
            followers: {
              set: input.user2.followers.filter(
                (email) => email !== input.user1.email,
              ),
            },
          },
        });
      } else {
        // If user1 is not following user2, add user2 to user1's follows list.
        await db.user.update({
          where: { id: input.user1.id },
          data: {
            follows: {
              set: [...input.user1.follows, input.user2.email],
            },
          },
        });
        // Add user1 to user2's followers list.
        await db.user.update({
          where: { id: input.user2.id },
          data: {
            followers: {
              set: [...input.user2.followers, input.user1.email],
            },
          },
        });
      }
    }),
  fetchUser: publicProcedure
    .input(
      z.object({ email: z.string().optional(), handle: z.string().optional() }),
    )
    .query<User | undefined>(async ({ ctx, input }) => {
      const whereClause: Record<string, string> = {};
      if (input.email) {
        whereClause["email"] = input.email;
      }
      if (input.handle) {
        whereClause["handle"] = input.handle;
      }

      let result;
      try {
        result = await db.user.findFirst({
          where: whereClause,
        });
        if (!result) {
          return undefined;
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return undefined;
      }
      return result;
    }),
  fetchUsers: publicProcedure
    .input(z.object({ userEmailList: z.array(z.string()) }))
    .query<User[] | undefined>(async ({ ctx, input }) => {
      const whereClause: Record<string, any> = {};
      if (input.userEmailList) {
        whereClause["email"] = { in: input.userEmailList };
      }

      let result;
      try {
        result = await db.user.findMany({
          where: whereClause,
        });
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
        return undefined;
      }
      return result;
    }),
});
