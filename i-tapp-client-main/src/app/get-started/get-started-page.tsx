"use client";

import Link from "next/link";
import { GraduationCap, Building2, Shield, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";

// The three roles are the same three personas the marketing site colour-codes
// — student blue, corps green, company violet — so they read from the shared
// `--accent-*` tokens rather than repeating the hexes. That's also what makes
// this page themeable: the tokens already have dark values.
//
// Two variants per persona, for the reason documented in globals.css: `color`
// is the SOLID FILL (hover CTA) and keeps its brand value so white text on it
// still reads; `colorText` is the TYPE colour and lifts in dark mode.
//
// The tints are built with `rgba(var(--*-rgb), a)` rather than pastel hexes.
// A low-alpha wash sits correctly on a white card or a dark one, where
// `#EFF6FF` only ever works on the first.
const roles = [
  {
    num: "01",
    key: "student",
    title: "Student",
    label: "SIWES / IT Placement",
    description: "Browse verified companies accepting students for industrial training. Apply, track, and get placed — all in one place.",
    features: ["Browse curated SIWES listings", "Apply instantly", "Track your applications", "Get your IT letter accepted"],
    href: "/welcome",
    cta: "Continue as Student",
    icon: GraduationCap,
    color: "var(--accent-blue)",
    colorText: "var(--accent-blue-text)",
    colorLight: "rgba(var(--accent-blue-rgb), 0.10)",
    colorBorder: "rgba(var(--accent-blue-rgb), 0.28)",
    colorShadow: "rgba(var(--accent-blue-rgb), 0.19)",
  },
  {
    num: "02",
    key: "corps",
    title: "Corps Member",
    label: "NYSC / PPA Placement",
    description: "Get matched to a Place of Primary Attachment in your deployment state. No cold emails, no walk-ins.",
    features: ["Matched to your state", "Verified PPA listings", "Apply with your call-up letter", "Track PPA status"],
    href: "/corps/signup",
    cta: "Continue as Corps Member",
    icon: Shield,
    color: "var(--accent-green)",
    colorText: "var(--accent-green-text)",
    colorLight: "rgba(var(--accent-green-rgb), 0.10)",
    colorBorder: "rgba(var(--accent-green-rgb), 0.28)",
    colorShadow: "rgba(var(--accent-green-rgb), 0.19)",
  },
  {
    num: "03",
    key: "company",
    title: "Company",
    label: "Post Placement Opportunities",
    description: "Post SIWES or PPA positions and connect with verified, qualified candidates from across Nigeria.",
    features: ["Post SIWES & PPA slots", "Access verified talent", "Manage applications easily", "CAC-verified listing badge"],
    href: "/company/signup",
    cta: "Continue as Company",
    icon: Building2,
    color: "var(--accent-violet)",
    colorText: "var(--accent-violet-text)",
    colorLight: "rgba(var(--accent-violet-rgb), 0.10)",
    colorBorder: "rgba(var(--accent-violet-rgb), 0.28)",
    colorShadow: "rgba(var(--accent-violet-rgb), 0.19)",
  },
];

export default function GetStartedPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        /* Surfaces come from tokens, not hexes. This page used to hardcode
           #F8F9FC / #fff / #E5E8EF, which meant the backgrounds stayed light
           in dark mode while the Tailwind text utilities on top inverted to
           near-white — the whole page washed out. */
        .gs-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface-blue);

          /* Ghost numeral outline. Ink on a light page, light on a dark one. */
          --gs-num-stroke: rgba(0,0,0,0.04);
        }
        .dark .gs-root { --gs-num-stroke: rgba(255,255,255,0.055); }

        .gs-serif { font-family: 'Instrument Serif', Georgia, serif; }

        @keyframes gs-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gs-hero  { animation: gs-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .gs-card1 { animation: gs-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .gs-card2 { animation: gs-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.20s both; }
        .gs-card3 { animation: gs-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.28s both; }

        .gs-card {
          position: relative;
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          overflow: hidden;
        }
        .gs-card:hover {
          transform: translateY(-3px);
          border-color: var(--card-border);
          box-shadow: 0 8px 40px -8px var(--card-shadow), 0 2px 8px -2px rgba(0,0,0,0.06);
        }
        .gs-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--card-color);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .gs-card:hover::after { opacity: 1; }

        .gs-num {
          position: absolute;
          right: -0.05em;
          bottom: -0.2em;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(6rem, 16vw, 8rem);
          font-weight: 400;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--gs-num-stroke);
          pointer-events: none;
          user-select: none;
        }

        @media (max-width: 639px) {
          .gs-card { padding: 20px 18px; }
          .gs-card-grid { display: flex; flex-direction: column; gap: 10px; }
        }
        @media (min-width: 640px) {
          .gs-card { padding: 28px; }
          .gs-card-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        }

        .gs-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: var(--card-light);
          border: 1px solid var(--card-border);
          shrink: 0;
        }

        .gs-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          /* Type colour, so the lifted variant. The fill value
             (--card-color) is too dark to read on a dark card. */
          color: var(--card-text);
          transition: background 0.15s;
        }
        @media (max-width: 639px) {
          .gs-cta { padding: 0; background: none; border: none; }
          .gs-cta-arrow { display: none; }
        }
        @media (min-width: 640px) {
          .gs-cta {
            padding: 11px 15px;
            background: var(--card-light);
            border: 1px solid var(--card-border);
          }
          .gs-card:hover .gs-cta { background: var(--card-color); color: #fff; border-color: transparent; }
          .gs-cta-arrow { transition: transform 0.2s; }
          .gs-card:hover .gs-cta-arrow { transform: translate(2px, -2px); }
        }

        .gs-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 99px;
          background: rgba(var(--accent-blue-rgb), 0.10);
          border: 1px solid rgba(var(--accent-blue-rgb), 0.28);
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--accent-blue-text);
        }

        .gs-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent);
          margin: 8px 0;
        }
      `}</style>

      <div className="gs-root min-h-screen flex flex-col">
        {/* Header */}
        {/* `bg-background`, not `bg-white/80`. The white utilities are pinned
            to real white in dark mode (they're mostly glows and labels), so a
            translucent-white bar stayed white — and the logo, which inverts to
            white in dark mode, disappeared into it. */}
        <header className="px-5 sm:px-10 pt-5 pb-3 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm">
          <Link href="/">
            <Logo className="h-9 w-auto" />
          </Link>
          <Link href="/signin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <span className="hidden sm:inline">Have an account? </span>
            <span className="text-gray-700 font-semibold">Sign in →</span>
          </Link>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-10 sm:py-14">
          <div className="w-full max-w-5xl mx-auto space-y-8 sm:space-y-10">

            {/* Hero */}
            <div className="gs-hero space-y-3">
              <div className="gs-pill">✦ Free to get started</div>
              <h1 className="gs-serif text-[2.8rem] sm:text-6xl lg:text-[4.5rem] font-normal text-gray-900 leading-[1.1] tracking-tight">
                Who are <em style={{ color: "var(--accent-blue-text)" }}>you</em>
                {/* gray-400, not gray-300: the ramp inverts, and 300 lands on
                    a near-background value in dark mode. 400 keeps the "?"
                    ghosted in both themes instead of vanishing in one. */}
                <span className="text-gray-400">?</span>
              </h1>
              <p className="text-gray-500 text-sm sm:text-base max-w-sm leading-relaxed">
                Pick your role and we&apos;ll get you set up in minutes.
              </p>
            </div>

            {/* Cards */}
            <div className="gs-card-grid">
              {roles.map((role, i) => {
                const Icon = role.icon;
                const animClass = ["gs-card1", "gs-card2", "gs-card3"][i];
                return (
                  <Link
                    key={role.key}
                    href={role.href}
                    className={`gs-card ${animClass} block`}
                    style={{
                      "--card-color": role.color,
                      "--card-text": role.colorText,
                      // Was `role.color + "30"`. Hex-alpha concatenation can't
                      // work now the accent is a var(), so the shadow carries
                      // its own pre-mixed rgba — same fix as the site pages.
                      "--card-shadow": role.colorShadow,
                      "--card-border": role.colorBorder,
                      "--card-light": role.colorLight,
                    } as React.CSSProperties}
                  >
                    <span className="gs-num" aria-hidden="true">{role.num}</span>

                    <div className="relative z-10 flex flex-col gap-4 h-full">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="gs-icon-wrap shrink-0">
                          <Icon style={{ color: role.colorText }} className="w-5 h-5" />
                        </div>
                        <ArrowUpRight className="sm:hidden w-4 h-4 text-gray-400 mt-1 shrink-0" />
                      </div>

                      {/* Label + Title */}
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: role.colorText }}>
                          {role.label}
                        </p>
                        <h2 className="gs-serif text-2xl sm:text-[1.75rem] font-normal text-gray-900 leading-tight">
                          {role.title}
                        </h2>
                      </div>

                      {/* Description. gray-500 rather than 400 — the ramp is
                          mirrored, so 400 lands at roughly 2.5:1 on the card
                          in BOTH themes. 500 clears 5:1 either way. */}
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                        {role.description}
                      </p>

                      {/* Features — desktop only */}
                      <ul className="hidden sm:flex flex-col gap-2">
                        {role.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: role.colorBorder }} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="mt-auto pt-2 sm:pt-0">
                        <div className="gs-cta">
                          {role.cta}
                          <ArrowUpRight className="gs-cta-arrow w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-gray-400">
              By signing up, you agree to our{" "}
              <Link href="/terms-of-service" className="underline hover:text-gray-500 transition-colors">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-gray-500 transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
