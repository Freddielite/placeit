"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "iconsax-reactjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { app } from "@/config/app";
import { cn } from "@/utils/tailwind";
import { usePathname } from "next/navigation";
import Hr from "@/components/ui/hr";
import { GraduationCap, Shield, Building2, X, ArrowRight } from "lucide-react";
import { usePersona, type Persona } from "@/app/(site)/_context/persona";

const personas = [
  {
    value: "student" as Persona,
    label: "Student",
    sub: "SIWES placement",
    icon: <GraduationCap className="w-4 h-4" />,
    color: "text-primary bg-primary/8 border-primary/20",
  },
  {
    value: "corps" as Persona,
    label: "Corps Member",
    sub: "NYSC PPA",
    icon: <Shield className="w-4 h-4" />,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    value: "company" as Persona,
    label: "Company",
    sub: "List opportunities",
    icon: <Building2 className="w-4 h-4" />,
    color: "text-violet-600 bg-violet-50 border-violet-100",
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { persona, setPersona } = usePersona();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden" aria-label="Open mobile navigation menu">
        <Menu size={26} className="text-primary" />
      </SheetTrigger>

      <SheetContent
        className={cn(
          "w-full max-w-[300px] flex flex-col gap-0 py-0 px-0 md:hidden",
          "bg-white shadow-lg overflow-y-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
          <span className="text-sm font-bold text-gray-900">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-8 h-8" aria-hidden="true" />
          </button>
        </div>

        {/* Persona picker */}
        <div className="px-4 pt-5 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">I am a...</p>
          <div className="grid grid-cols-3 gap-2">
            {personas.map((p) => (
              <button
                key={p.value}
                aria-current={persona === p.value ? "true" : undefined}
                onClick={() => setPersona(persona === p.value ? null : p.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all duration-200",
                  persona === p.value
                    ? cn(p.color, "shadow-sm")
                    : "text-gray-500 border-gray-200 bg-gray-50 hover:border-gray-300"
                )}
              >
                <span aria-hidden="true">{p.icon}</span>
                <span className="text-[11px] font-semibold leading-tight">{p.label}</span>
              </button>
            ))}
          </div>
          {persona && (
            <button
              onClick={() => setPersona(null)}
              className="mt-2 w-full text-[11px] text-gray-400 hover:text-gray-600 transition-colors text-center py-1"
            >
              Clear selection
            </button>
          )}
        </div>

        <Hr className="mx-4" />

        {/* Nav links */}
        <nav className="flex flex-col px-4 py-3 gap-1">
          {app.nav_links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              title={link.title}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary bg-primary/6 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              )}
            >
              {pathname === link.href && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
              )}
              {link.text}
            </Link>
          ))}
        </nav>

        <Hr className="mx-4" />

        {/* CTAs */}
        <div className="flex flex-col gap-3 px-4 py-5 mt-auto">
          <Link
            href={app.links.signin}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-center")}
            onClick={() => setOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href={app.links.signup}
            className={cn(
              buttonVariants({ size: "sm" }),
              "w-full justify-center gap-2 font-bold bg-primary text-white shadow-sm shadow-primary/20"
            )}
            onClick={() => setOpen(false)}
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
