"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { app } from "@/config/app";
import { Logo } from "@/components/logo";
import { Wrapper } from "@/components/wrapper";
import { MobileNav } from "./mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ChevronDown, GraduationCap, Shield, Building2, X, ArrowRight } from "lucide-react";
import { usePersona, type Persona } from "@/app/(site)/_context/persona";
import { useState, useRef, useEffect } from "react";

const personas = [
  {
    value: "student" as Persona,
    label: "I'm a Student",
    sub: "SIWES / IT placement",
    icon: <GraduationCap className="w-4 h-4" />,
    color: "text-primary bg-primary/8 border-primary/15",
  },
  {
    value: "corps" as Persona,
    label: "I'm a Corps Member",
    sub: "NYSC PPA placement",
    icon: <Shield className="w-4 h-4" />,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    value: "company" as Persona,
    label: "I'm a Company",
    sub: "List & hire talent",
    icon: <Building2 className="w-4 h-4" />,
    color: "text-violet-600 bg-violet-50 border-violet-100",
  },
];

function PersonaDropdown({ className }: { className?: string }) {
  const { persona, setPersona } = usePersona();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = personas.find((p) => p.value === persona);

  return (
    <div className={cn("relative", className)} ref={ref}>
      {active ? (
        <div className="inline-flex items-center rounded-xl border overflow-hidden">
          <button
            aria-label={`Current persona: ${active.label}. Click to change.`}
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 transition-all duration-200 border-0",
              active.color,
            )}
          >
            <span aria-hidden="true">{active.icon}</span>
            {active.label}
          </button>
          <button
            aria-label="Clear persona selection"
            onClick={() => {
              setPersona(null);
              setOpen(false);
            }}
            className={cn(
              "flex items-center justify-center px-2 py-2 border-l transition-colors hover:opacity-80 border-0",
              active.color,
            )}
          >
            <X className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          aria-label="Select who you are"
          aria-expanded={open ? "true" : "false"}
          aria-haspopup="listbox"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl border transition-all duration-200 text-gray-600 bg-gray-50 border-gray-200 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
        >
          I am a...
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-gray-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Who are you?
            </p>
          </div>
          {personas.map((p) => (
            <button
              key={p.value}
              onClick={() => {
                setPersona(p.value);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50",
                persona === p.value && "bg-gray-50",
              )}
            >
              <span
                className={cn(
                  "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0",
                  p.color,
                )}
                aria-hidden="true"
              >
                {p.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                <p className="text-[11px] text-gray-400">{p.sub}</p>
              </div>
              {persona === p.value && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "w-full fixed top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-sm shadow-gray-100/60"
          : "border-b border-gray-100/80 bg-white/80 backdrop-blur-md"
      )}
    >
      <Wrapper
        className={cn(
          "flex items-center justify-between py-0! transition-all duration-300",
          scrolled ? "h-14" : "h-16"
        )}
      >
        <Logo className="mix-blend-multiply w-55 lg:w-70" />

        <nav className="items-center gap-8 hidden md:flex">
          {app.nav_links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              title={link.title}
              className={cn(
                "relative text-sm font-medium transition-colors group",
                pathname === link.href ? "text-primary" : "text-gray-600 hover:text-primary"
              )}
            >
              {link.text}
              {/* Active dot indicator */}
              <span
                className={cn(
                  "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-200",
                  pathname === link.href ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <PersonaDropdown />
          <Link
            href={app.links.signin}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-gray-200 text-gray-700 hover:border-primary/30 hover:text-primary rounded-lg text-sm font-medium"
            )}
          >
            Sign In
          </Link>
          <Link
            href={app.links.signup}
            className={cn(
              buttonVariants({ size: "sm" }),
              "relative overflow-hidden rounded-lg text-sm font-bold gap-1.5 group",
              "bg-primary text-white shadow-sm shadow-primary/30",
              "hover:shadow-md hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            )}
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              aria-hidden="true"
            />
            Get Started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
          </Link>
        </div>

        <MobileNav />
      </Wrapper>
    </header>
  );
}
