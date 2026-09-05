"use server";

import { cookies } from "next/headers";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function logout() {
  const store = await cookies();

  store.delete("session-token");
  store.delete("role");
  store.delete("skip-student-onboarding");
  store.delete("skip-company-onboarding");

  store.set("session-token", "", { ...options, maxAge: 0 });
  store.set("role", "", { ...options, maxAge: 0 });
  store.set("skip-student-onboarding", "", { ...options, maxAge: 0 });
  store.set("skip-company-onboarding", "", { ...options, maxAge: 0 });
}
