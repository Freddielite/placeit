import type { Metadata } from "next";
import Welcome from "./welcome";

export const metadata: Metadata = {
  title: "Get Started - Create Your Account",
  description: "Sign up as a student or corps member to find SIWES and NYSC PPA placements on PlaceIT.",
  alternates: { canonical: "/welcome" },
  robots: { index: false, follow: false },
};

export default function page() {
  return <Welcome />;
}
