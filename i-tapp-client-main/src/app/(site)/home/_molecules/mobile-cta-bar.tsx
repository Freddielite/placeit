"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Shield, Building2 } from "lucide-react";
import { usePersona } from "@/app/(site)/_context/persona";
import { useEffect, useState } from "react";

const ctas = {
  default: {
    label: "Get started free",
    href: "/welcome",
    icon: <ArrowRight className="w-4 h-4" />,
  },
  student: {
    label: "Find my placement",
    href: "/welcome",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  corps: {
    label: "Find my PPA",
    href: "/corps/signup",
    icon: <Shield className="w-4 h-4" />,
  },
  company: {
    label: "List opportunities",
    href: "/company/signup",
    icon: <Building2 className="w-4 h-4" />,
  },
};

export function MobileCtaBar() {
  const { persona } = usePersona();
  const cta = ctas[persona ?? "default"];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Fade above bar */}
      <div className="h-8 pointer-events-none" />
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 pb-safe">
        <Link
          href={cta.href}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded bg-primary text-white text-sm font-black shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          {/* {cta.icon} */}
          {cta.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
