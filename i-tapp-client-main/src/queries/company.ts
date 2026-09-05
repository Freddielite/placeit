import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchApplicationsCount = () => {
  return useQuery({
    queryKey: ["application-count"],
    queryFn: async () => {
      const response = await query("/a/applications-count/");
      return response;
    },
  });
};
