import { parsedPaperRouter } from "src/server/api/routers/parsed-pdf";
import { annotatedPdfRouter } from "@src/server/api/routers/annotated-pdf";
import { commentRouter } from "@src/server/api/routers/comment";
import { highlightRouter } from "@src/server/api/routers/highlight";
import { userRouter } from "@src/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@src/server/api/trpc";
import { curriculumNodeRouter } from "@src/server/api/routers/curriculum-node";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	annotatedPdf: annotatedPdfRouter,
	curriculum: curriculumNodeRouter,
	highlight: highlightRouter,
	comment: commentRouter,
	parsedPaper: parsedPaperRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
