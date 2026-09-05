"use client";

import { ReactNode } from "react";
import { Header } from "../header";
import { studentNavLinks } from "@/constants";
import { OnboardingTour } from "@/components/onboarding-tour";

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header link={studentNavLinks} />
      <main className="h-screen bg-[#F0F0F5]">{children}</main>
      <OnboardingTour role="student" />
    </>
  );
};

export default StudentLayout;
