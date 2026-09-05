import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchCorpsPPA = (filter?: any, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["corps-ppa", filter ?? {}, page, limit],
    staleTime: 0,
    queryFn: async () => {
      const params: Record<string, any> = { page, limit };
      if (filter?.state) params.state = filter.state;
      if (filter?.industry) params.industry = filter.industry;
      if (filter?.duration) params.duration = filter.duration;
      if (filter?.search?.trim()) params.search = filter.search.trim();
      const qs = new URLSearchParams(params).toString();
      const response = await query(`/corps/ppa${qs ? `?${qs}` : ""}`);
      return response;
    },
  });
};

export const useFetchCorpsPPADetail = (id?: string) => {
  return useQuery({
    queryKey: ["corps-ppa-detail", id],
    queryFn: async () => {
      const response = await query(`/corps/ppa/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchCorpsPPAApplicationStatus = (id?: string) => {
  return useQuery({
    queryKey: ["corps-ppa-status", id],
    queryFn: async () => {
      const response = await query(`/corps/ppa/${id}/application-status`);
      return response;
    },
    enabled: !!id,
  });
};

export const useFetchCorpsSavedPPA = () => {
  return useQuery({
    queryKey: ["corps-ppa-saved"],
    queryFn: async () => {
      const response = await query("/corps/ppa/saved");
      return response;
    },
  });
};

export const useFetchCorpsApplications = (status?: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["corps-applications", status, page, limit],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit };
      if (status && status !== "all") params.status = status;
      const qs = new URLSearchParams(params).toString();
      const response = await query(`/corps/applications${qs ? `?${qs}` : ""}`);
      return response;
    },
  });
};

export const useFetchCorpsOffers = () => {
  return useQuery({
    queryKey: ["corps-offers"],
    queryFn: async () => {
      const response = await query("/corps/offers");
      return response;
    },
  });
};

export const useFetchCorpsOfferDetail = (id?: string) => {
  return useQuery({
    queryKey: ["corps-offer-detail", id],
    queryFn: async () => {
      const response = await query(`/corps/offers/${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useFetchCorpsProfile = () => {
  return useQuery({
    queryKey: ["corps-profile"],
    queryFn: async () => {
      const response = await query("/corps/profile");
      return response;
    },
  });
};

export const useFetchPaymentStatus = (reference?: string) => {
  return useQuery({
    queryKey: ["payment-status", reference],
    queryFn: async () => {
      const response = await query(`/payments/${reference}/status`);
      return response as { status: "pending" | "success" | "failed"; reference: string };
    },
    enabled: !!reference,
    refetchInterval: (data: any) =>
      data?.status === "pending" ? 3000 : false,
  });
};
