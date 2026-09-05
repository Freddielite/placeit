import { logout } from "@/actions";
import { useCompanyStore, useStudentStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  return async () => {
    await logout();
    useStudentStore.getState().setStudent(null);
    useCompanyStore.getState().setCompany(null);

    router.replace("/signin");
  };
};
