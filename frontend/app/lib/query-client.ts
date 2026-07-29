import { QueryClient } from "@tanstack/react-query";

/** Singleton — reused across the app (not a function, to avoid recreation) */
let client: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always fresh instance per request
    return makeQueryClient();
  }
  // Browser: reuse singleton
  if (!client) client = makeQueryClient();
  return client;
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,          // 1 minute default
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
