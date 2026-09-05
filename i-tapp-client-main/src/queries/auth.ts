import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchVerifyEmail = (token?: string) => {
  return useQuery({
    queryKey: ["verify-email"],
    queryFn: async () => {
      const response = await query(
        `/auth/verify?token=${encodeURIComponent(token!)}`,
      );
      return response;
    },
    enabled: !!token,
    staleTime: 0,
  });
};
