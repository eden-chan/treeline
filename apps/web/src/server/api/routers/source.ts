import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { db } from "@src/lib/db";
import { Source } from '@prisma/client';

export const sourceRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				source: z.string(),
			}),
		)
		.mutation<Source| null>(async ({ input }) => {
			// make sure the source doesn't exist already
            let res: Source;
			try {
				res = await db.source.upsert({
					where: { source: input.source },
					update: { uploadedAt: new Date() },
					create: { source: input.source, uploadedAt: new Date() },
				});
			} catch (error) {
				console.error("Failed to create source:", error);
				return null;
			}
			return res;
		}),
    fetchAll: publicProcedure
        .query<Source[]>(async () => {
            return await db.source.findMany();
        }),
});
