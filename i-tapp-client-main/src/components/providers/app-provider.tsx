"use client";

import { Next13ProgressBar } from "next13-progressbar";
import { Suspense } from "react";
import { NativeAppDetector } from "./native-app-detector";
import { AppSplash } from "./app-splash";
import { PullToRefresh } from "./pull-to-refresh";
import { OfflineScreen } from "./offline-screen";
import { PageTransition } from "./page-transition";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NativeAppDetector />
      <AppSplash />
      <PullToRefresh />
      <OfflineScreen />
      <PageTransition>{children}</PageTransition>
      <Suspense>
        <Next13ProgressBar
          height="4px"
          color="#477DC0"
          options={{ showSpinner: false }}
          showOnShallow
        />
      </Suspense>
    </>
  );
}
