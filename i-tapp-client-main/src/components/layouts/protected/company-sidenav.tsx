import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function SideNav({
  collapsed,
  isMobile,
  setCollapsed,
  links,
  isActive,
}: {
  collapsed: boolean;
  isMobile: boolean;
  setCollapsed: (collapsed: boolean) => void;
  links: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
  isActive: (href: string) => boolean;
}) {
  return (
    <>
      {/* Backdrop (mobile only) */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-50",

          // Desktop behavior
          !isMobile && (collapsed ? "w-16" : "w-64"),

          // Mobile overlay behavior
          isMobile && "fixed inset-y-0 left-0 w-64 transform",
          isMobile && collapsed ? "-translate-x-full" : "translate-x-0",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/portal" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Mobile close button */}
          {isMobile ? (
            <Button
              variant="ghost"
              onClick={() => setCollapsed(true)}
              className="p-1.5"
            >
              <X size={18} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-gray-50"
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </Button>
          )}
        </div>

        {/* Links */}
        <div className="p-2">
          {links.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className={cn(
                "relative group flex items-center rounded-md my-1 px-3 py-3 text-sm text-black/70 hover:bg-gray-100 hover:text-primary",
                isActive(item.href) &&
                  "bg-secondary font-semibold text-primary",
              )}
            >
              <span className="shrink-0">{item.icon}</span>

              {!collapsed && (
                <span className="ml-3 whitespace-nowrap">{item.label}</span>
              )}

              {/* Tooltip (desktop collapsed only) */}
              {!isMobile && collapsed && (
                <div
                  className="
                  absolute left-16 top-1/2 -translate-y-1/2
                  bg-indigo-900 text-white
                  px-2 py-1 text-xs rounded
                  opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  transition-all duration-200
                  whitespace-nowrap z-50
                "
                >
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
