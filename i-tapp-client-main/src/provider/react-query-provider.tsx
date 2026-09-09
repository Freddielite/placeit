"use client";

import React, { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // getQueryClient() memoises per browser session; the useState keeps the
  // reference stable across re-renders and gives each SSR pass its own.
  const [client] = useState(getQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
