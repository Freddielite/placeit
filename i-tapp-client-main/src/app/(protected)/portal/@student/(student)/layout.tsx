import StudentLayout from "@/components/layouts/protected/student";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <StudentLayout>{children}</StudentLayout>;
}
