import React from "react";

import FindITSpace from "./_molecules";

export const metadata = {
  title: "Find IT Spaces",
  description: "Explore and apply for IT opportunities tailored for students.",
};

export default async function page() {
  // const searchParams = await props.searchParams;
  return <FindITSpace />;
}

// searchParams = { searchParams };
