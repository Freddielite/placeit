import { logout } from "@/actions";
import { useCompanyStore, useStudentStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearPersistedCache } from "@/lib/query-persist";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return async () => {
    await logout();
    useStudentStore.getState().setStudent(null);
    useCompanyStore.getState().setCompany(null);

    // The offline cache holds this user's API responses in localStorage.
    // Clear both it and the in-memory cache, or the next person to open the
    // app on this device sees the previous user's data.
    queryClient.clear();
    clearPersistedCache();

    router.replace("/signin");
  };
};
