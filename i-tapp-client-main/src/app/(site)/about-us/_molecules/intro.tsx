import Link from "next/link";
import { ArrowRight, GraduationCap, Shield, Building2 } from "lucide-react";

const stats = [
  { value: "3,200+", label: "Students & corps members" },
  { value: "50+", label: "Verified companies" },
  { value: "36", label: "States & FCT" },
  { value: "2023", label: "Founded" },
];

export function Intro() {
  return (
    <section className="bg-white relative overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #9ba8d4 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 95% 90% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(71,125,192,0.1)_0%,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 pb-16 sm:pt-36 sm:pb-24">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Our Story
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black text-gray-950 leading-tight tracking-tight text-center max-w-4xl mx-auto">
          We built the platform<br />
          <span className="text-primary">we wished existed</span>
        </h1>

        <p className="mt-6 text-gray-500 text-base sm:text-lg leading-relaxed text-center max-w-2xl mx-auto">
          PlaceIT was born from frustration — cold emails ignored, walk-ins turned away, WhatsApp groups with outdated links. We decided Nigeria&apos;s students and corps members deserved better.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/welcome"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm shadow-primary/30"
          >
            <GraduationCap className="w-4 h-4" />
            Join as Student
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/corps/signup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:border-primary/30 hover:text-primary bg-white transition-colors duration-200"
          >
            <Shield className="w-4 h-4" />
            Join as Corps Member
          </Link>
          <Link
            href="/company/signup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:border-primary/30 hover:text-primary bg-white transition-colors duration-200"
          >
            <Building2 className="w-4 h-4" />
            List as Company
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-6 text-center">
              <p className="text-2xl sm:text-3xl font-black text-gray-950">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
