import { CompanyLayout } from "@/components/layouts/protected/company";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CompanyLayout>{children}</CompanyLayout>;
}
