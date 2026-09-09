"use client";

import { useEffect, useState } from "react";
import { Notification, Briefcase, Element } from "iconsax-reactjs";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { OnboardingTour, replayOnboardingTour } from "@/components/onboarding-tour";
import { studentNavLinks, corpsNavLinks } from "@/constants";
import { cn } from "@/utils/tailwind";
import { Sparkles, User } from "lucide-react";

type Role = "student" | "corps" | "company";

/** Everything below is inert demo markup: no real routing, no API calls.
 * It only exists to give the coach-marks tour real elements to point at,
 * without needing a backend or a logged-in session. */

function NoNav({
  className,
  dataTour,
  children,
}: {
  className?: string;
  dataTour: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-tour={dataTour}
      onClick={(e) => e.preventDefault()}
      className={className}
    >
      {children}
    </button>
  );
}

function DemoHeader({
  navLinks,
}: {
  navLinks: { text: string; href: string }[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setMobileOpen(true);
    const onClose = () => setMobileOpen(false);
    window.addEventListener("placeit:mobilenav:open", onOpen);
    window.addEventListener("placeit:mobilenav:close", onClose);
    return () => {
      window.removeEventListener("placeit:mobilenav:open", onOpen);
      window.removeEventListener("placeit:mobilenav:close", onClose);
    };
  }, []);

  const slug = (href: string) => href.split("/").filter(Boolean).pop();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex items-center justify-between px-6 h-[55px] border-b border-grey-5">
        <div data-tour="logo">
          <Logo />
        </div>

        <nav className="gap-16 hidden md:flex h-full">
          {navLinks.map((link, i) => (
            <NoNav
              key={i}
              dataTour={`nav-${slug(link.href)}`}
              className="flex items-center h-[55px] text-sm text-primary transition-colors"
            >
              {link.text}
            </NoNav>
          ))}
        </nav>

        <div className="hidden md:flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="relative cursor-pointer" data-tour="notifications">
                <Notification size={35} className="border border-[#C9C9DA] rounded-full p-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-72" align="end">
              <div className="px-4 py-3 border-b">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Notifications</p>
              </div>
              <p className="px-6 py-4 text-sm text-gray-400">No notifications yet.</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="rounded-full h-10 w-10 cursor-pointer bg-gray-100 flex items-center justify-center"
                data-tour="avatar-menu"
              >
                <User className="w-5 h-5 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-1.5 w-44" align="end">
              <p className="px-3 py-2 text-sm text-gray-400">Demo only</p>
            </PopoverContent>
          </Popover>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              data-tour="hamburger-trigger"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-[320px] bg-white p-0 md:hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <p className="text-sm font-semibold">Menu</p>
            </div>
            <div className="flex h-full flex-col px-4 py-5 gap-6">
              <div className="flex items-center gap-3" data-tour="mnav-profile">
                <div className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Demo User</p>
                  <p className="text-xs text-muted-foreground">Preview profile</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NoNav
                    key={link.text}
                    dataTour={`mnav-${slug(link.href)}`}
                    className="rounded-lg px-3 py-2 text-sm text-left text-muted-foreground hover:bg-gray-100"
                  >
                    {link.text}
                  </NoNav>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function DemoCompanyShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mirrors the real useIsResponsive hook: 768px breakpoint, force-collapse on mobile.
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onOpen = () => setCollapsed(false);
    const onClose = () => setCollapsed(true);
    window.addEventListener("placeit:sidenav:open", onOpen);
    window.addEventListener("placeit:sidenav:close", onClose);
    return () => {
      window.removeEventListener("placeit:sidenav:open", onOpen);
      window.removeEventListener("placeit:sidenav:close", onClose);
    };
  }, []);

  const links = [
    { label: "Dashboard", href: "/portal/dashboard", icon: <Element size={22} /> },
    { label: "Opportunities", href: "/portal/opportunities", icon: <Briefcase size={22} /> },
  ];
  const slug = (href: string) => href.split("/").filter(Boolean).pop();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isMobile && !collapsed && (
        <div onClick={() => setCollapsed(true)} className="fixed inset-0 bg-black/40 z-40" />
      )}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-50",
          !isMobile && (collapsed ? "w-16" : "w-64"),
          isMobile && "fixed inset-y-0 left-0 w-64 transform",
          isMobile && collapsed ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-2" data-tour="logo">
            <Logo />
          </div>
          <Button
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-gray-50"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        <div className="p-2">
          {links.map((item, i) => (
            <NoNav
              key={i}
              dataTour={`nav-${slug(item.href)}`}
              className="w-full flex items-center rounded-md my-1 px-3 py-3 text-sm text-black/70 hover:bg-gray-100 hover:text-primary"
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
            </NoNav>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => setCollapsed(!collapsed)} className="p-2 -ml-2 text-gray-600">
                {collapsed ? <Menu size={24} /> : <X size={24} />}
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>
          <button
            type="button"
            data-tour="avatar-menu"
            onClick={(e) => e.preventDefault()}
            className="rounded-full h-10 w-10 bg-gray-100 flex items-center justify-center"
          >
            <User className="w-5 h-5 text-gray-400" />
          </button>
        </header>
        <main className="flex-1 overflow-auto px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6 xl:px-8 xl:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const welcomeCopy: Record<Role, { name: string; blurb: string }> = {
  student: {
    name: "Welcome back, Samuel",
    blurb: "This is a preview dashboard used to demo the in-app tutorial. No live data here.",
  },
  corps: {
    name: "Welcome back, Chiamaka",
    blurb: "This is a preview dashboard used to demo the in-app tutorial. No live data here.",
  },
  company: {
    name: "Welcome back, Acme Technologies",
    blurb: "This is a preview dashboard used to demo the in-app tutorial. No live data here.",
  },
};

function DummyContent({ role, withTopPad = true }: { role: Role; withTopPad?: boolean }) {
  const copy = welcomeCopy[role];
  return (
    <div className={cn("px-6 pb-24 max-w-4xl mx-auto", withTopPad && "pt-20 md:pt-28")}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{copy.name}</h1>
      <p className="text-gray-500 mb-8">{copy.blurb}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-gray-100 bg-white shadow-sm" />
        ))}
      </div>
    </div>
  );
}

export default function TourDemoPage() {
  const [role, setRole] = useState<Role>("student");

  return (
    <div className="min-h-screen bg-[var(--surface-neutral)]">
      {/* Demo control bar — not part of the real app, only exists on this
          preview page so you can switch roles and re-trigger the tour. */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-xl rounded-full px-3 py-2 flex items-center gap-2 border border-gray-200">
        {(["student", "corps", "company"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              role === r ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {r}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <Button
          size="sm"
          className="rounded-full h-8 text-xs gap-1.5"
          onClick={() => replayOnboardingTour(role)}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Start Tutorial
        </Button>
      </div>

      {role === "student" && (
        <>
          <DemoHeader navLinks={studentNavLinks} />
          <main className="min-h-screen bg-[var(--surface-neutral)]">
            <DummyContent role="student" />
          </main>
          <OnboardingTour role="student" />
        </>
      )}

      {role === "corps" && (
        <>
          <DemoHeader navLinks={corpsNavLinks} />
          <main className="min-h-screen bg-[var(--surface-neutral)]">
            <DummyContent role="corps" />
          </main>
          <OnboardingTour role="corps" />
        </>
      )}

      {role === "company" && (
        <>
          <DemoCompanyShell>
            <DummyContent role="company" withTopPad={false} />
          </DemoCompanyShell>
          <OnboardingTour role="company" />
        </>
      )}
    </div>
  );
}
