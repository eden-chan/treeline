import "server-only";

import { cookies, headers } from "next/headers";
import { cache } from "react";

import { createCaller } from "@src/server/api/root";
import { createTRPCContext } from "@src/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  return createTRPCContext({
    headers: new Headers({
      cookie: cookies().toString(),
      "x-trpc-source": "rsc",
    }),
    auth: getAuth(
      new NextRequest("https://notused.com", { headers: headers() })
    ),
  });
});

export const api = createCaller(createContext);
