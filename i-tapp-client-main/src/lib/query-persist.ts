// ---------------------------------------------------------------------------
// React Query cache persistence, built on the dehydrate/hydrate primitives
// already in @tanstack/react-query - deliberately no
// @tanstack/query-sync-storage-persister dependency, so this ships without
// touching the lockfile.
//
// Purpose: on a poor or dropped connection the app shows the data you last
// saw instead of a blocking error. Nigeria-network reality, not a nicety.
//
// PRIVACY: this writes API responses (profiles, applications, employer
// details) to localStorage in plaintext, where they survive logout and are
// readable by anything with DOM access. Two mitigations below - the key
// denylist and clearPersistedCache() on logout. If a query returns anything
// you wouldn't want left on a shared phone, add it to DO_NOT_PERSIST.
// ---------------------------------------------------------------------------

import { dehydrate, hydrate, type QueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "placeit:query-cache:v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24h - older than this is misleading
const WRITE_DEBOUNCE_MS = 1200;

/**
 * Query-key prefixes that must never be written to disk. Match on the first
 * element of the query key.
 */
const DO_NOT_PERSIST = ["auth", "session", "token", "otp", "password"];

type Persisted = {
  savedAt: number;
  buildId: string;
  state: ReturnType<typeof dehydrate>;
};

/**
 * Cached data from an older deploy can have a shape the current code doesn't
 * understand, which surfaces as a render crash rather than a nice error.
 * Tie the cache to the build.
 */
function buildId(): string {
  return process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";
}

function shouldPersist(queryKey: readonly unknown[]): boolean {
  const head = queryKey[0];
  if (typeof head !== "string") return true;
  const lowered = head.toLowerCase();
  return !DO_NOT_PERSIST.some((blocked) => lowered.includes(blocked));
}

export function restorePersistedCache(client: QueryClient): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as Persisted;
    if (parsed.buildId !== buildId()) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }

    hydrate(client, parsed.state);
    return true;
  } catch {
    // Corrupt or quota-cleared entry - start clean rather than crash.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return false;
  }
}

export function persistCache(client: QueryClient) {
  try {
    const state = dehydrate(client, {
      shouldDehydrateQuery: (query) =>
        query.state.status === "success" && shouldPersist(query.queryKey),
    });

    const payload: Persisted = {
      savedAt: Date.now(),
      buildId: buildId(),
      state,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // QuotaExceededError is the likely one. Drop the cache rather than
    // retrying forever against a full store.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}

/** True if there's a usable snapshot on disk - drives the offline UI. */
export function hasPersistedCache(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

/** Call on logout. Cached data must not outlive the session that fetched it. */
export function clearPersistedCache() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Subscribes to cache changes and writes a debounced snapshot. Returns an
 * unsubscribe function.
 */
export function startCachePersistence(client: QueryClient): () => void {
  let timer: number | undefined;

  const schedule = () => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => persistCache(client), WRITE_DEBOUNCE_MS);
  };

  const unsubscribe = client.getQueryCache().subscribe(schedule);

  // Backgrounding the app is the moment most likely to be followed by the
  // process being killed - flush synchronously rather than waiting out the
  // debounce.
  const flush = () => {
    if (document.visibilityState === "hidden") persistCache(client);
  };
  document.addEventListener("visibilitychange", flush);

  return () => {
    if (timer) window.clearTimeout(timer);
    unsubscribe();
    document.removeEventListener("visibilitychange", flush);
  };
}
