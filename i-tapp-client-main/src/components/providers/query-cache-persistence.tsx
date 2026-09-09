"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  restorePersistedCache,
  startCachePersistence,
} from "@/lib/query-persist";
import { useFeature } from "./app-mode-provider";

// APP-EXCLUSIVE (scope: `offlineCache` in config/app-features.ts).
//
// Restores the last cache snapshot on boot, then keeps writing it. App-only
// deliberately: a browser tab has no cold-start problem worth solving here,
// and writing user data to localStorage on a machine someone might not own
// is a worse trade on the web than it is on a personal phone.
export function QueryCachePersistence() {
  const enabled = useFeature("offlineCache");
  const queryClient = useQueryClient();
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!enabled || restored) return;

    // Restore before subscribing, or the first write overwrites the snapshot
    // with an empty cache.
    restorePersistedCache(queryClient);
    setRestored(true);

    return startCachePersistence(queryClient);
  }, [enabled, restored, queryClient]);

  return null;
}
