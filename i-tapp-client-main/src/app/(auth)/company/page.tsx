import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  // cookies() is async now
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  if (!token) return redirect("/company/signin");

  return redirect("/company/signin");
}
