import { Header } from "@/components/layouts/protected/header";
import { corpsNavLinks } from "@/constants";
import React, { ReactNode } from "react";

export default function CorpsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header link={corpsNavLinks} />
      <main className="h-screen bg-[#F0F0F5]">{children}</main>
    </>
  );
}
