import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type AppNotification = {
  id: string;
  userId: string;
  type: "OFFER_SENT" | "OFFER_ACCEPTED" | "OFFER_DECLINED" | "APPLICATION_RECEIVED" | "APPLICATION_STATUS_CHANGED" | "ONBOARDING_APPROVED" | "ONBOARDING_REJECTED" | string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await query("/notifications?sortBy=createdAt&sortOrder=DESC");
      return (Array.isArray(response) ? response : response?.data ?? []) as AppNotification[];
    },
  });
};

export const useFetchUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const response = await query("/notifications/unread-count");
      return (response?.count ?? 0) as number;
    },
    refetchInterval: 30000,
  });
};

export const useFetchMyApplicationStatus = (opportunityId?: string) => {
  return useQuery({
    queryKey: ["my-application-status", opportunityId],
    queryFn: async () => {
      const response = await query(`/a/${opportunityId}/my-application-status`);
      return response;
    },
    enabled: Boolean(opportunityId),
    staleTime: 0,
  });
};

export const useFetchSavedOpportunities = () => {
  return useQuery({
    queryKey: ["saved-opportunities"],
    queryFn: async () => {
      const response = await query("/o/saved/me");
      return response;
    },
  });
};
