import { Suspense } from "react";
import AdminPPAPage from "./index";

export default function Page() {
  return (
    <Suspense>
      <AdminPPAPage />
    </Suspense>
  );
}
