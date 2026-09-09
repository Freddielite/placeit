import { QueryClient } from "@tanstack/react-query";

// Hoisted out of ReactQueryProvider's useState so non-React code (the cache
// persister, logout) can reach the same instance. Still one client per
// browser session; on the server a fresh one is made per request so requests
// never share a cache.
let browserClient: QueryClient | null = null;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cached data has to outlive a cold start for offline mode to be
        // worth anything. gcTime is how long an inactive query survives in
        // memory; the persister writes whatever is still here.
        gcTime: 1000 * 60 * 60 * 24, // 24h
        staleTime: 1000 * 30,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return createQueryClient();
  if (!browserClient) browserClient = createQueryClient();
  return browserClient;
}
