"use client";

import { ReactNode, useState, useRef } from "react";
import {
  Home,
  Users,
  Menu,
  Settings,
  Briefcase,
  LogOut,
  UserCheck,
  BadgeCheck,
  ClipboardList,
  Building,
  Mail,
  Trash2,
  AlertTriangle,
  BarChart2,
  ScrollText,
  Search,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/use-logout";
import useIsResponsive from "@/utils/responsive";
import SideNav from "@/components/layouts/admin/side-nav";
import { useFetchPendingApprovals } from "@/queries/admin";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { name: "Home", href: "/admin", icon: <Home size={20} /> },
  { name: "Pending Approvals", href: "/admin/pending", icon: <AlertTriangle size={20} /> },
  { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
  { name: "Students", href: "/admin/student", icon: <Users size={20} /> },
  { name: "Corps Members", href: "/admin/corps", icon: <BadgeCheck size={20} /> },
  { name: "Companies", href: "/admin/company", icon: <Building size={20} /> },
  { name: "Opportunities", href: "/admin/opportunities", icon: <Briefcase size={20} /> },
  { name: "PPA Listings", href: "/admin/ppa", icon: <MapPin size={20} /> },
  { name: "Applications", href: "/admin/applications", icon: <ClipboardList size={20} /> },
  { name: "Placements", href: "/admin/placements", icon: <UserCheck size={20} /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart2 size={20} /> },
  { name: "Audit Log", href: "/admin/audit", icon: <ScrollText size={20} /> },
  { name: "Email", href: "/admin/email", icon: <Mail size={20} /> },
  { name: "Deleted Records", href: "/admin/deleted", icon: <Trash2 size={20} /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  { name: "Log out", href: "#", icon: <LogOut size={20} /> },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { collapsed, setCollapsed, isMobile } = useIsResponsive();
  const logout = useLogout();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: pending } = useFetchPendingApprovals();

  const pendingCount = (pending?.students?.length ?? 0) + (pending?.corps?.length ?? 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length >= 2) {
      router.push(`/admin/search?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideNav
        collapsed={collapsed}
        isMobile={isMobile}
        setCollapsed={setCollapsed}
        menuItems={menuItems}
        logout={logout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          {isMobile && (
            <button title="close" onClick={() => setCollapsed(!collapsed)} className="p-2 -ml-2 text-gray-600">
              <Menu size={24} />
            </button>
          )}

          {/* Global search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, corps, companies…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 ml-auto">
            {pendingCount > 0 && (
              <Link
                href="/admin/pending"
                className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {pendingCount} pending
              </Link>
            )}
            <Link href="/admin/profile">
              <div className="rounded-full border w-10 h-10 bg-gray-100" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
