import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { query } from "@/lib/api";
import OpportunitiesBrowse from "./_molecules/browse";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Browse available SIWES industrial training and NYSC PPA placement opportunities across verified companies in Nigeria.",
  alternates: { canonical: "/opportunities" },
};

export default async function OpportunitiesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["public-opportunities", 1],
    queryFn: () => query("/o/browse?page=1&limit=10"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OpportunitiesBrowse />
    </HydrationBoundary>
  );
}
