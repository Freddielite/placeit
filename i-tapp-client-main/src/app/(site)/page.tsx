import type { Metadata } from "next";
import Home from "./home";

export const metadata: Metadata = {
  title: "PlaceIT - Find SIWES & NYSC PPA Placements in Nigeria",
  description:
    "PlaceIT connects Nigerian students and corps members with verified SIWES industrial training and NYSC PPA placements. Browse opportunities, apply, and get placed fast.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <Home />;
}
