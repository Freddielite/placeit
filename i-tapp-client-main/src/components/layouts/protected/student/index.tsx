"use client";

import { ReactNode } from "react";
import { Header } from "../header";
import { studentNavLinks } from "@/constants";
import { OnboardingTour } from "@/components/onboarding-tour";
import { AppOnly } from "@/components/providers/app-mode-provider";
import { AppTabBar } from "../app-tab-bar";

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header link={studentNavLinks} />
      <main className="h-screen bg-muted dark:bg-background">{children}</main>
      <OnboardingTour role="student" />
      <AppOnly>
        <AppTabBar role="student" />
      </AppOnly>
    </>
  );
};

export default StudentLayout;
