"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Briefcase,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Search,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/tailwind";
import { haptic } from "@/lib/haptics";
import { useFeature } from "@/components/providers/app-mode-provider";

export type PortalRole = "student" | "company" | "corps";

type Tab = { label: string; href: string; icon: ReactNode; match?: string[] };

// Four or five tabs, no more - past that the labels truncate on a 360px
// screen and the targets drop under the 44px minimum. Anything that doesn't
// fit stays in the existing header/sidenav, which is untouched.
const TABS: Record<PortalRole, Tab[]> = {
  student: [
    {
      label: "Find",
      href: "/portal/find-it-space",
      icon: <Search size={22} />,
    },
    {
      label: "My Space",
      href: "/portal/my-it-space",
      icon: <Briefcase size={22} />,
    },
    {
      label: "Applications",
      href: "/portal/my-application",
      icon: <ClipboardList size={22} />,
    },
    {
      label: "Saved",
      href: "/portal/saved-applications",
      icon: <Heart size={22} />,
    },
    { label: "Profile", href: "/portal/profile", icon: <User size={22} /> },
  ],
  corps: [
    { label: "Find", href: "/portal/find-ppa", icon: <Search size={22} /> },
    {
      label: "My PPA",
      href: "/portal/my-ppa-space",
      icon: <Briefcase size={22} />,
    },
    {
      label: "Applications",
      href: "/portal/my-applications",
      icon: <ClipboardList size={22} />,
    },
    {
      label: "Alerts",
      href: "/portal/notifications",
      icon: <Bell size={22} />,
    },
    { label: "Profile", href: "/portal/profile", icon: <User size={22} /> },
  ],
  company: [
    {
      label: "Dashboard",
      href: "/portal/dashboard",
      icon: <LayoutDashboard size={22} />,
    },
    {
      label: "Opportunities",
      href: "/portal/opportunities",
      icon: <Briefcase size={22} />,
    },
    {
      label: "Candidates",
      href: "/portal/candidates",
      icon: <ClipboardList size={22} />,
    },
    { label: "Profile", href: "/portal/profile", icon: <User size={22} /> },
  ],
};

function isActive(pathname: string, tab: Tab) {
  if (pathname === tab.href) return true;
  if (pathname.startsWith(tab.href + "/")) return true;
  return tab.match?.some((m) => pathname.startsWith(m)) ?? false;
}

// APP-EXCLUSIVE (scope: `bottomTabBar` in config/app-features.ts).
//
// The single strongest structural signal that something is an app rather
// than a site. Mounted inside <AppOnly>, so the website keeps its existing
// header nav and nothing about the desktop layout changes.
//
// Hidden while the soft keyboard is open (see .keyboard-open in globals.css)
// - otherwise it sits on top of the keyboard on Android.
export function AppTabBar({ role }: { role: PortalRole }) {
  const pathname = usePathname();
  const enabled = useFeature("bottomTabBar");
  const tabs = TABS[role];

  if (!enabled || !tabs) return null;

  return (
    <nav
      aria-label="Primary"
      data-app-tabbar
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
        "flex items-stretch justify-around",
        "border-t border-border bg-background",
        "pb-[env(safe-area-inset-bottom)]"
        // Hidden while the keyboard is open - see html.keyboard-open in
        // globals.css, which also owns the body padding that keeps content
        // clear of this bar.
      )}
    >
      {tabs.map((tab) => {
        const active = isActive(pathname, tab);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            onClick={() => haptic("select")}
            className={cn(
              "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 pb-1",
              "text-[10px] font-medium leading-none transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span className={active ? "opacity-100" : "opacity-70"}>
              {tab.icon}
            </span>
            <span className="w-full truncate text-center">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
