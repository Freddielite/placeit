"use client";

import {
  ShieldCheck,
  MapPin,
  Zap,
  LayoutDashboard,
  GraduationCap,
  Clock,
  Send,
  Bell,
  BadgeCheck,
  Users,
  Star,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "CAC-verified companies only" },
  { icon: MapPin, text: "State-code matched PPAs" },
  { icon: GraduationCap, text: "SIWES placements" },
  { icon: Zap, text: "Instant application alerts" },
  { icon: LayoutDashboard, text: "Real-time application tracking" },
  { icon: Clock, text: "48h average verification" },
  { icon: Send, text: "One profile, many companies" },
  { icon: Bell, text: "Instant placement alerts" },
  { icon: BadgeCheck, text: "Free to get started" },
  { icon: Users, text: "SIWES + NYSC talent pool" },
  { icon: Star, text: "Admin-assisted listing" },
];

const doubled = [...features, ...features];

const colors = [
  "text-primary bg-primary/8",
  "text-emerald-600 bg-emerald-50",
  "text-violet-600 bg-violet-50",
  "text-amber-600 bg-amber-50",
  "text-sky-600 bg-sky-50",
  "text-rose-600 bg-rose-50",
];

export function Marquee() {
  return (
    <div className="bg-white border-t border-gray-100 py-8 sm:py-10 overflow-hidden">
      <style>{`
        @keyframes marquee-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-ltr 40s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex marquee-track">
          {doubled.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="inline-flex items-center gap-2.5 px-5 shrink-0 select-none"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors[i % colors.length]}`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                  {f.text}
                </span>
                <span
                  className="text-gray-200 text-lg leading-none ml-2"
                  aria-hidden="true"
                >
                  ·
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
