import { authMiddleware } from "@clerk/nextjs/server";
// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware

export default authMiddleware({
  // Allow signed out users to access the specified routes:
  // publicRoutes: ['/anyone-can-visit-this-route'],
  // Prevent the specified routes from accessing
  // authentication information:
  // ignoredRoutes: ['/no-auth-in-this-route'],
  publicRoutes: [
    "/api/webhooks(.*)",
    "/pdf",
    "/",
    "/landing",
    "/pdf(.*)",
    "/pdf/[id]", // Allow access to /pdf/[id] dynamic route
  ],
  ignoredRoutes: ["/((?!api|trpc))(_next.*|.+.[w]+$)"],
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.

    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)",
  ],
};
