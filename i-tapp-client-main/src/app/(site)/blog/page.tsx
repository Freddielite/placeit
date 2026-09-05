import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and updates on SIWES placements, NYSC PPA, and industrial training in Nigeria.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <div>
      <h1> Blog page</h1>
    </div>
  );
}
