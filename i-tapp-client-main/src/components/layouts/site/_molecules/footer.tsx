"use client";

import Link from "next/link";
import Image from "next/image";
import instagram from "@/assets/icons/instagram.svg";
import twitter from "@/assets/icons/twitter.svg";
import linkedin from "@/assets/icons/linkedin.svg";
import { Logo } from "@/components/logo";

const nav = {
  Platform: [
    { href: "/opportunities", label: "Browse Opportunities" },
    { href: "/get-started", label: "Sign Up Free" },
    { href: "/signin", label: "Sign In" },
  ],
  Company: [
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" },
    { href: "/partnership", label: "Partnership" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ],
};

const socials = [
  {
    href: "https://instagram.com/itapp.tech",
    label: "Instagram",
    icon: instagram,
  },
  {
    href: "https://linkedin.com/company/i-tapp",
    label: "LinkedIn",
    icon: linkedin,
  },
  { href: "https://twitter.com/i-tapp", label: "Twitter / X", icon: twitter },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0d1117] text-white overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 ">
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-6  pl-5">
            <div className="z-999 mt-[-80px] lg:mt-[-120px] ">
              <Logo className="w-45 lg:w-80 lg:ml-[-80px]" />
            </div>
            <div className="lg:mt-[-100px] mt-[-70px]">
              <p className="text-sm text-white/45 leading-relaxed max-w-65">
                Nigeria&apos;s placement marketplace connecting SIWES students
                and NYSC corps members with verified companies.
              </p>
              <div className="flex gap-6 lg:mt-4">
                {[
                  { value: "50+", label: "Companies" },
                  { value: "12+", label: "States" },
                  { value: "2", label: "Programs" },
                ].map((s) => (
                  <div key={s.label} className="space-y-2">
                    <p className="text-xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/12 hover:border-white/20 flex items-center justify-center transition-all duration-200"
                  >
                    <Image
                      src={s.icon}
                      alt={s.label}
                      className="w-4 h-4 brightness-0 invert opacity-60"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(nav).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-4 pl-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                {section}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-150 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mb-25 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} PlaceIT — Bringing opportunities
            closer.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>Built for Nigerian students</span>
            <span className="w-px h-3 bg-white/15" />
            <a
              href="mailto:support@getplaceit.com"
              className="hover:text-white/60 transition-colors"
            >
              support@getplaceit.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
