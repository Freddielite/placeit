"use client";

import { usePersona } from "@/app/(site)/_context/persona";
import { Quote } from "lucide-react";

const testimonials = {
  default: [
    {
      quote: "I spent two weeks cold-emailing companies with zero response. Signed up on PlaceIT, got matched to three SIWES listings by the next morning. Accepted one that same week.",
      name: "Adaeze Okonkwo",
      role: "Computer Science · UniLag",
      tag: "SIWES placed",
      tagColor: "bg-primary/8 text-primary border-primary/15",
      initials: "AO",
      avatarBg: "bg-primary/10 text-primary",
    },
    {
      quote: "Camp was in its second week and I had nothing. I used PlaceIT to send my CV to multiple companies overnight. I had two responses by morning and confirmed my PPA before camp ended.",
      name: "Chukwuemeka Adeyemi",
      role: "Mechanical Eng. · FUTO",
      tag: "PPA secured in camp",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      initials: "CA",
      avatarBg: "bg-emerald-50 text-emerald-700",
    },
    {
      quote: "I thought finding IT placement meant printing CVs and walking into offices. PlaceIT changed that entirely — one profile, applied to five companies in twenty minutes.",
      name: "Tobiloba Fashola",
      role: "Electrical Eng. · OAU",
      tag: "Placed at Interswitch",
      tagColor: "bg-primary/8 text-primary border-primary/15",
      initials: "TF",
      avatarBg: "bg-primary/10 text-primary",
    },
  ],
  student: [
    {
      quote: "I spent two weeks cold-emailing companies with zero response. Signed up on PlaceIT, got matched to three SIWES listings by the next morning. Accepted one that same week.",
      name: "Adaeze Okonkwo",
      role: "Computer Science · UniLag",
      tag: "SIWES placed",
      tagColor: "bg-primary/8 text-primary border-primary/15",
      initials: "AO",
      avatarBg: "bg-primary/10 text-primary",
    },
    {
      quote: "I thought finding IT placement meant printing CVs and walking into offices. PlaceIT changed that entirely — one profile, applied to five companies in twenty minutes.",
      name: "Tobiloba Fashola",
      role: "Electrical Eng. · OAU",
      tag: "Placed at Interswitch",
      tagColor: "bg-primary/8 text-primary border-primary/15",
      initials: "TF",
      avatarBg: "bg-primary/10 text-primary",
    },
    {
      quote: "The dashboard is clean, the companies are real, and tracking my applications felt professional. Finally something built for students that actually works.",
      name: "Fatima Al-Hassan",
      role: "Software Eng. · ABU Zaria",
      tag: "Offer received",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      initials: "FA",
      avatarBg: "bg-emerald-50 text-emerald-700",
    },
  ],
  corps: [
    {
      quote: "Camp was in its second week and I had nothing. BulkApply sent my CV to 18 companies overnight. I had two responses by morning and confirmed my PPA before camp ended.",
      name: "Chukwuemeka Adeyemi",
      role: "Mechanical Eng. · FUTO",
      tag: "PPA secured in camp",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      initials: "CA",
      avatarBg: "bg-emerald-50 text-emerald-700",
    },
    {
      quote: "State-code matching is real. I entered my code, selected Lagos, and only saw Lagos PPAs. No scrolling through irrelevant listings. Applied to three, got one within 48 hours.",
      name: "Bello Abdulrahman",
      role: "Civil Eng. · BUK",
      tag: "PPA in 48 hours",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      initials: "BA",
      avatarBg: "bg-emerald-50 text-emerald-700",
    },
    {
      quote: "I was already redeployed once and didn't want it again. Found a PPA through PlaceIT in my new state within days. The platform literally saved my service year.",
      name: "Miracle Onyekachi",
      role: "Computer Sci. · UNICAL",
      tag: "PPA switch successful",
      tagColor: "bg-amber-50 text-amber-700 border-amber-100",
      initials: "MO",
      avatarBg: "bg-amber-50 text-amber-700",
    },
  ],
  company: [
    {
      quote: "We listed three intern slots on a Friday afternoon. By Monday we had 24 verified applications. Shortlisted six, accepted three. The fastest placement hiring we've done.",
      name: "Ngozi Eze",
      role: "HR Lead · Printivo",
      tag: "3 slots filled in 3 days",
      tagColor: "bg-violet-50 text-violet-700 border-violet-100",
      initials: "NE",
      avatarBg: "bg-violet-50 text-violet-700",
    },
    {
      quote: "The talent pool is properly verified. No fake CVs, no ghosts. Every applicant had a real profile with their field and state visible. Made shortlisting very fast.",
      name: "Emeka Okafor",
      role: "CTO · BrandHive Nigeria",
      tag: "12 applicants shortlisted",
      tagColor: "bg-violet-50 text-violet-700 border-violet-100",
      initials: "EO",
      avatarBg: "bg-violet-50 text-violet-700",
    },
    {
      quote: "Admin listed on our behalf and we just reviewed applications as they came in. Zero effort on our end and we still filled all four intern spots within the week.",
      name: "Amaka Nwosu",
      role: "Operations · Sterling Bank",
      tag: "4 interns onboarded",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      initials: "AN",
      avatarBg: "bg-emerald-50 text-emerald-700",
    },
  ],
};

export function Testimonials() {
  const { persona } = usePersona();
  const items = testimonials[persona ?? "default"];

  return (
    <section className="bg-[#f7f8fc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-28">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Real Stories</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight tracking-tight">
            Don&apos;t take our word for it
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Students, corps members, and companies — here&apos;s what they said.
          </p>
        </div>

        {/* Cards: first card large, two smaller */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured testimonial */}
          <div className="lg:col-span-2 relative bg-white rounded-3xl border border-gray-100 p-8 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
            <Quote className="w-8 h-8 text-primary/20 shrink-0" aria-hidden="true" />
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium flex-1">
              &ldquo;{items[0].quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${items[0].avatarBg}`}>
                {items[0].initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{items[0].name}</p>
                <p className="text-[11px] text-gray-400 truncate">{items[0].role}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${items[0].tagColor}`}>
                {items[0].tag}
              </span>
            </div>
          </div>

          {/* Two smaller stacked */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {items.slice(1).map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-primary/20 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{t.role}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${t.tagColor}`}>
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
