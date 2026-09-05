import React from "react";
import { SiteLayoutUi } from "@/components/layouts/site";
import { PersonaProvider } from "./_context/persona";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersonaProvider>
      <SiteLayoutUi>{children}</SiteLayoutUi>
    </PersonaProvider>
  );
}
