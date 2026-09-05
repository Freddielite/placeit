import React from "react";
import { Metadata } from "next";

import { CompanySignIn } from "./_molecules";

export const metadata: Metadata = {
  title: "Login",
  description: "",
};

export default function SigninPage() {
  return <CompanySignIn />;
}
