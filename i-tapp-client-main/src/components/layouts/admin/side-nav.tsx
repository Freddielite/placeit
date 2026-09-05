"use client";

import { cn } from "@/utils/tailwind";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SideNav({
  collapsed,
  isMobile,
  setCollapsed,
  menuItems,
  logout,
}: {
  collapsed: boolean;
  isMobile: boolean;
  setCollapsed: (v: boolean) => void;
  menuItems: { name: string; href: string; icon: React.ReactNode }[];
  logout: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  // Close drawer on route change (mobile)
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, collapsed]);

  const sidebarContent = (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out",
        isMobile ? "w-64" : collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
        <span
          className={cn(
            "font-bold text-xl text-indigo-600 overflow-hidden whitespace-nowrap transition-all duration-300",
            collapsed && !isMobile ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          Admin
        </span>

        {isMobile ? (
          <button
            title="close"
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={
              item.name === "Log out"
                ? (e) => {
                    e.preventDefault();
                    logout();
                  }
                : undefined
            }
            className={cn(
              "relative group flex items-center h-11 rounded-lg transition-colors",
              collapsed && !isMobile
                ? "px-0 justify-center"
                : "px-3 justify-start",
              isActive(item.href)
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600",
            )}
          >
            <span className="shrink-0">{item.icon}</span>

            <span
              className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300 origin-left text-sm font-medium",
                collapsed && !isMobile
                  ? "w-0 opacity-0 ml-0"
                  : "w-auto opacity-100 ml-3",
              )}
            >
              {item.name}
            </span>

            {/* Tooltip when collapsed (desktop only) */}
            {collapsed && !isMobile && (
              <div className="absolute left-full rounded-md px-2 py-1 ml-3 bg-gray-900 text-white text-xs invisible opacity-0 -translate-x-1 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap pointer-events-none">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {!collapsed && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setCollapsed(true)}
          />
        )}
        {/* Drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
            collapsed ? "-translate-x-full" : "translate-x-0",
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
}
