"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "iconsax-reactjs";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCompanyStore } from "@/lib/store/company";
import { useStudentStore } from "@/lib/store";
import { useFetchCorpsProfile } from "@/queries/corps";
import { cn } from "@/utils/tailwind";
import { useLogout } from "@/hooks/use-logout";

interface MobileNavProps {
  links: { text: string; href: string }[];
}

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const company = useCompanyStore((s) => s.company);
  const student = useStudentStore((s) => s.student);
  const { data: corpsData } = useFetchCorpsProfile();
  const corps = corpsData?.corps ?? corpsData ?? null;
  const logout = useLogout();

  const user = useMemo(() => {
    if (company) {
      return {
        name: company.name,
        avatar: company.logoUrl ?? "/applicant.png",
        profileHref: "/portal/profile",
        meta: "Company",
      };
    }

    if (student) {
      return {
        name: student.firstName + " " + student.lastName,
        avatar: student.profileImage ?? "/applicant.png",
        profileHref: "/portal/profile",
        meta: "Student",
      };
    }

    if (corps) {
      return {
        name: `${corps.firstName ?? ""} ${corps.lastName ?? ""}`.trim() || "Corps Member",
        avatar: corps.profileImageUrl ?? "/applicant.png",
        profileHref: "/portal/profile",
        meta: "Corps Member",
      };
    }

    return {
      name: "Guest User",
      avatar: "/applicant.png",
      profileHref: null as string | null,
      meta: null as string | null,
    };
  }, [company, student, corps]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full max-w-[320px] bg-white p-0 md:hidden">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <p className="text-sm font-semibold">Menu</p>
          {/* <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button> */}
        </div>

        <div className="flex h-full flex-col px-4 py-5 gap-6">
          {/* Profile block */}
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border bg-gray-50">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>

              {user.profileHref ? (
                <Link
                  href={user.profileHref}
                  className="text-xs text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View profile
                </Link>
              ) : (
                <p className="text-xs text-muted-foreground">Not signed in</p>
              )}
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active = isActiveLink(pathname, link.href);

              return (
                <Link
                  key={link.text}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-gray-100",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.text}
                </Link>
              );
            })}
          </nav>

          {/* Footer actions */}
          <div className="mt-auto pb-15">
            <Button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
