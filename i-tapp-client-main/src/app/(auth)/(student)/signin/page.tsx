import React from "react";
import { Metadata } from "next";

import { StudentSignIn } from "./_molecules";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your PlaceIT (ITAPP) account to manage applications and track SIWES or industrial training placements.",
};

export default function SigninPage() {
  return <StudentSignIn />;
}
