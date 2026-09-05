"use server";

import { cookies } from "next/headers";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  path: "/",
};

export async function setAuthCookies(token: string, role: string) {
  const store = await cookies();

  store.set("session-token", token, options);
  store.set("role", role, options);
}
