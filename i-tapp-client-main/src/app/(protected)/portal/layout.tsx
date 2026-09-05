import React from "react";
import { headers } from "next/headers";

type UserRole = "company" | "student" | "corps";
interface PortalLayoutProps {
  company: React.ReactNode;
  student: React.ReactNode;
  corps: React.ReactNode;
}

export default async function PortalLayout({ company, student, corps }: PortalLayoutProps) {
  const headersList = await headers();
  const role = headersList.get("x-user-role")?.toLowerCase() as UserRole | null;

  if (role === "student") return <>{student}</>;
  if (role === "company") return <>{company}</>;
  if (role === "corps") return <>{corps}</>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-muted-foreground">Please sign in to access this area.</p>
      </div>
    </div>
  );
}
