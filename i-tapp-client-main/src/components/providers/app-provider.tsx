"use client";

import { NativeAppDetector } from "./native-app-detector";
import { AppSplash } from "./app-splash";
import { PullToRefresh } from "./pull-to-refresh";
import { OfflineScreen } from "./offline-screen";
import { PageTransition } from "./page-transition";

// No top loading bar (removed per request) - page transitions are now
// fast enough (~140ms) that a progress indicator isn't needed for
// navigation. Pages with real data-fetching delays (dashboard,
// opportunities, etc.) should use route-level loading.tsx skeletons
// instead of a global bar.
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NativeAppDetector />
      <AppSplash />
      <OfflineScreen />
      <PullToRefresh>
        <PageTransition>{children}</PageTransition>
      </PullToRefresh>
    </>
  );
}
