import { Wrapper } from "@/components/wrapper";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Partner with Us",
  description:
    "Partner with PlaceIT (ITAPP) to connect your company with Nigerian students seeking SIWES and industrial training opportunities.",
};

const benefits = [
  {
    title: "Access Top Talent",
    description:
      "Connect with thousands of motivated Nigerian students and corps members ready to contribute to your organisation.",
  },
  {
    title: "Streamlined Placement",
    description:
      "Our platform handles applications, screening, and onboarding paperwork — so your team focuses on what matters.",
  },
  {
    title: "Verified Profiles",
    description:
      "Every student and corps member on ITAPP goes through institutional verification before they reach your listing.",
  },
  {
    title: "Nationwide Reach",
    description:
      "Post opportunities visible to applicants across all 36 states, with state-level filtering built in.",
  },
  {
    title: "SIWES & NYSC Ready",
    description:
      "Purpose-built for Nigeria's industrial training and national service programmes — we speak your language.",
  },
  {
    title: "Dedicated Support",
    description:
      "A partnership manager is assigned to every institutional or corporate partner to ensure a smooth experience.",
  },
];

const partners = [
  { name: "FUPRE", logo: "/FUPRE-Logo.png" },
];

const partnerTypes = [
  {
    type: "Universities & Polytechnics",
    description:
      "Integrate ITAPP into your SIWES and industrial training workflow. Give your students direct access to vetted placements.",
  },
  {
    type: "Corporate Organisations",
    description:
      "Post internship, SIWES, and PPA listings. Build a pipeline of emerging talent from Nigeria's top institutions.",
  },
  {
    type: "Government Agencies",
    description:
      "Collaborate on national workforce development initiatives and streamline corps member placement at scale.",
  },
];

export default function Partnership() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-100">
        <Wrapper className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Partnerships
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Grow together with ITAPP
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            We partner with universities, companies, and government bodies to
            bridge the gap between Nigerian students and meaningful industrial
            training opportunities.
          </p>
          <a
            href="mailto:partnerships@itapp.ng"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition text-sm"
          >
            Become a Partner
          </a>
        </Wrapper>
      </section>

      {/* Partner types */}
      <Wrapper>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
          Who we partner with
        </h2>
        <p className="text-gray-500 text-sm text-center mb-10 max-w-lg mx-auto">
          ITAPP partnerships are built for institutions and organisations that
          share our mission of purposeful placement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {partnerTypes.map((p) => (
            <div
              key={p.type}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{p.type}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </Wrapper>

      {/* Benefits */}
      <section className="bg-gray-50 border-y border-gray-100">
        <Wrapper>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
            Why partner with us?
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10 max-w-lg mx-auto">
            Everything your organisation needs to run a successful placement
            programme — in one place.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="mt-1 w-8 h-8 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* Current partners */}
      <Wrapper>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
          Our partners
        </h2>
        <p className="text-gray-500 text-sm text-center mb-10 max-w-lg mx-auto">
          Institutions already working with ITAPP to place students and corps
          members.
        </p>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-2xl hover:shadow-sm transition min-w-[140px]"
            >
              <Image src={p.logo} width={80} height={60} alt={p.name} className="object-contain" />
              <span className="text-xs font-medium text-gray-500">{p.name}</span>
            </div>
          ))}
          {/* Placeholder slots */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-6 border border-dashed border-gray-200 rounded-2xl min-w-[140px] opacity-40"
            >
              <div className="w-20 h-14 bg-gray-100 rounded-lg" />
              <span className="text-xs text-gray-400">Coming soon</span>
            </div>
          ))}
        </div>
      </Wrapper>

      {/* CTA */}
      <section className="bg-primary">
        <Wrapper className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to partner with us?
          </h2>
          <p className="text-primary-foreground/80 text-sm mb-8 max-w-md mx-auto">
            Reach out to our partnerships team and we'll get you set up within
            48 hours.
          </p>
          <a
            href="mailto:partnerships@itapp.ng"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Contact Partnerships Team
          </a>
        </Wrapper>
      </section>
    </div>
  );
}
