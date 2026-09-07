"use client";

import { useState } from "react";
import StudentLayout from "@/components/layouts/protected/student";
import { CompanyLayout } from "@/components/layouts/protected/company";
import { Header } from "@/components/layouts/protected/header";
import { corpsNavLinks } from "@/constants";
import { OnboardingTour, replayOnboardingTour } from "@/components/onboarding-tour";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type Role = "student" | "corps" | "company";

const welcomeCopy: Record<Role, { name: string; blurb: string }> = {
  student: {
    name: "Welcome back, Samuel",
    blurb: "This is a preview dashboard used to demo the in-app tutorial — no live data here.",
  },
  corps: {
    name: "Welcome back, Chiamaka",
    blurb: "This is a preview dashboard used to demo the in-app tutorial — no live data here.",
  },
  company: {
    name: "Welcome back, Acme Technologies",
    blurb: "This is a preview dashboard used to demo the in-app tutorial — no live data here.",
  },
};

function DummyContent({ role }: { role: Role }) {
  const copy = welcomeCopy[role];
  return (
    <div className="pt-20 md:pt-28 px-6 pb-24 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{copy.name}</h1>
      <p className="text-gray-500 mb-8">{copy.blurb}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-gray-100 bg-white shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

export default function TourDemoPage() {
  const [role, setRole] = useState<Role>("student");

  return (
    <div className="min-h-screen bg-[#F0F0F5]">
      {/* Demo control bar — this bar itself is NOT part of the real app,
          it only exists on this preview page so you can switch roles
          and re-trigger the tour on demand. */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-xl rounded-full px-3 py-2 flex items-center gap-2 border border-gray-200">
        {(["student", "corps", "company"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              role === r
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {r}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <Button
          size="sm"
          className="rounded-full h-8 text-xs gap-1.5"
          onClick={() => replayOnboardingTour(role)}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Start Tutorial
        </Button>
      </div>

      {role === "student" && (
        <StudentLayout>
          <DummyContent role="student" />
        </StudentLayout>
      )}

      {role === "corps" && (
        <>
          <Header link={corpsNavLinks} />
          <main className="min-h-screen bg-[#F0F0F5]">
            <DummyContent role="corps" />
          </main>
          <OnboardingTour role="corps" />
        </>
      )}

      {role === "company" && (
        <CompanyLayout>
          <DummyContent role="company" />
        </CompanyLayout>
      )}
    </div>
  );
}
