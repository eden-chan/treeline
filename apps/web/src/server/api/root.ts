import { parsedPapersRouter } from "./routers/parsed-pdf";
import { annotatedPdfRouter } from "@src/server/api/routers/annotated-pdf";
import { userRouter } from "@src/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@src/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  annotatedPdf: annotatedPdfRouter,
  user: userRouter,
  parsedPapers: parsedPapersRouter,
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
