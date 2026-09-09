import { Header } from "@/components/layouts/protected/header";
import { corpsNavLinks } from "@/constants";
import { OnboardingTour } from "@/components/onboarding-tour";
import { AppOnly } from "@/components/providers/app-mode-provider";
import { AppTabBar } from "@/components/layouts/protected/app-tab-bar";
import React, { ReactNode } from "react";

export default function CorpsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header link={corpsNavLinks} />
      <main className="h-screen bg-muted dark:bg-background">{children}</main>
      <OnboardingTour role="corps" />
      <AppOnly>
        <AppTabBar role="corps" />
      </AppOnly>
    </>
  );
}
