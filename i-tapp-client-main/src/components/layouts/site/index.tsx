import React from "react";
import { Footer } from "./_molecules/footer";
import { Header } from "./_molecules/header";

export function SiteLayoutUi({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
