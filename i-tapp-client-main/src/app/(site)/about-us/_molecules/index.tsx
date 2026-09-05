import { Intro } from "./intro";
import { Details } from "./details";
import Team from "./team";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutUs() {
  return (
    <>
      <Intro />
      <Details />
      <Team />

      {/* Bottom CTA */}
      <section className="bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            Free to get started
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-2xl mx-auto">
            Be part of the solution.<br />Join PlaceIT today.
          </h2>
          <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Whether you&apos;re a student looking for placement, a corps member needing a PPA, or a company wanting verified talent — your spot is ready.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/welcome"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary text-base font-black hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/20"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
            >
              Browse opportunities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
