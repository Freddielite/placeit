import Image from "next/image";
import AboutImg from "@/assets/images/about-us.jpg";
import { Target, Lightbulb, ShieldCheck } from "lucide-react";

const values = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Access for all",
    description: "Every Nigerian student and corps member deserves a fair shot at a quality placement — regardless of school, network, or location.",
    accent: "bg-primary/8 text-primary border-primary/15",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Trust first",
    description: "CAC-verified companies, verified student profiles. We vet both sides so every connection on PlaceIT is worth your time.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Built for Nigeria",
    description: "SIWES, NYSC, state-code matching, camp mode — we built around real Nigerian systems, not generic job-board templates.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

export function Details() {
  return (
    <>
      {/* Story section */}
      <section className="bg-[#f7f8fc] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* Image */}
            <div className="w-full lg:w-[480px] shrink-0">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-[0_8px_40px_rgba(0,0,0,0.10)]">
                <Image
                  src={AboutImg}
                  alt="PlaceIT team at work"
                  fill
                  className="object-cover"
                  quality={90}
                  priority
                />
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">CAC Verified Platform</p>
                    <p className="text-[10px] text-gray-400">Trusted across Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-6 flex-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Why we built this</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 leading-tight tracking-tight">
                  The old way was broken.<br />
                  <span className="text-primary">We fixed it.</span>
                </h2>
              </div>
              <div className="flex flex-col gap-4 text-gray-500 text-base leading-relaxed">
                <p>
                  The usual approach — printing CVs, cold-emailing HR departments, walking into reception desks, scrolling through outdated WhatsApp groups — was inefficient, humiliating, and often simply didn&apos;t work.
                </p>
                <p>
                  PlaceIT was created to fix this. We digitize the entire placement process: discovery, application, tracking, and acceptance — all from one platform built specifically for Nigeria&apos;s SIWES and NYSC systems.
                </p>
                <p>
                  We verify every company before they list. We match students to opportunities by field and location. For corps members, we match by state code. And for companies, we bring verified, placement-ready talent directly to their dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">What drives us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 leading-tight tracking-tight">
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${v.accent}`}>
                  {v.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-gray-900">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
