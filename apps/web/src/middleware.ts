import { authMiddleware } from "@clerk/nextjs";
import { redirectToSignIn } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
import { NextResponse } from "next/server";

// export function middleware(request: Request) {
//   // Store current request url in a custom header, which you can read later
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-url", request.url);

//   return NextResponse.next({
//     request: {
//       // Apply new request headers
//       headers: requestHeaders,
//     },
//   });
// }

export default authMiddleware({
  // Allow signed out users to access the specified routes:
  publicRoutes: ["/api/webhooks(.*)"],
  // Prevent the specified routes from accessing
  // authentication information:
  // ignoredRoutes: ['/no-auth-in-this-route'],
  afterAuth(auth, req, evt) {
    // Store current request url in a custom header, which you can read later
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);

    if (!auth.userId && !auth.isPublicRoute) {
      console.log("redirect to sign in", req.url);
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // Redirect signed in users to organization selection page if they are not active in an organization
    // if (
    //   auth.userId &&
    //   !auth.orgId &&
    //   req.nextUrl.pathname !== "/org-selection"
    // ) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next({
        request: {
          // Apply new request headers
          headers: requestHeaders,
        },
      });
    }

    // Allow users visiting public routes to access them
    return NextResponse.next({
      request: {
        // Apply new request headers
        headers: requestHeaders,
      },
    });
  },
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
