"use client";

import { AppModeProvider } from "./app-mode-provider";
import { AppShellEffects } from "./app-shell-effects";
import { AppSplash } from "./app-splash";
import { PullToRefresh } from "./pull-to-refresh";
import { OfflineScreen } from "./offline-screen";
import { PageTransition } from "./page-transition";
import { BackButtonHandler } from "./back-button-handler";
import { KeyboardHandler } from "./keyboard-handler";
import { QueryCachePersistence } from "./query-cache-persistence";

// AppModeProvider must be the outermost wrapper - everything below it asks
// it whether we're running as the installed app or as the public website.
// What each piece does in each mode lives in src/config/app-features.ts;
// none of these components decide for themselves.
//
// QueryCachePersistence has to sit above PullToRefresh: both use the React
// Query client, and the cache must be restored before anything can refetch
// against it.
//
// The tree shape is identical in both modes on purpose. The app-only bits
// switch themselves off internally rather than being conditionally mounted,
// so `children` is never unmounted and remounted when the mode resolves.
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppModeProvider>
      <AppShellEffects />
      <QueryCachePersistence />
      <BackButtonHandler />
      <KeyboardHandler />
      <AppSplash />
      <OfflineScreen />
      <PullToRefresh>
        <PageTransition>{children}</PageTransition>
      </PullToRefresh>
    </AppModeProvider>
  );
}
