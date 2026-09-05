import Image from "next/image";
import sam from "@/assets/images/samuel.jpeg";
import dee from "@/assets/images/dee.jpg";
import egbe from "@/assets/images/egbe.png";
import jutin from "@/assets/images/jutin.png";
import jerry from "@/assets/images/jerry.png";
import joy from "@/assets/images/jjoy.jpeg";

const team = [
  {
    name: "Samuel Foluwasho Oluwafemi",
    role: "Founder & CEO",
    bio: "Visionary behind PlaceIT. Identified the placement gap in Nigeria's education system and built the platform to close it.",
    image: sam,
    position: "center 15%",
  },
  {
    name: "Egbe Oghenemarho Andrew",
    role: "Co-Founder",
    bio: "Shapes the strategic direction of PlaceIT and ensures the platform stays true to its mission across every iteration.",
    image: egbe,
    position: "center center",
  },
  {
    name: "Moses Glory Chidimma",
    role: "Lead, Product Growth",
    bio: "Drives user acquisition and retention — connecting students, corps members, and companies to the platform at scale.",
    image: dee,
    position: "center center",
  },
  {
    name: "Jeremiah Argin",
    role: "Product Manager",
    bio: "Owns the product roadmap. Translates user pain points into features that make PlaceIT faster and easier to use.",
    image: jerry,
    position: "center center",
  },
  {
    name: "Jutin Dikonu",
    role: "Chief Technology Officer",
    bio: "Architects and leads the engineering behind PlaceIT — from backend infrastructure to the interfaces students and companies use daily.",
    image: jutin,
    position: "center center",
  },
  {
    name: "Joy Efurhieme",
    role: "Social Media and Content Strategist",
    bio: "Building the PlaceIT community, designs and executes strategies across platforms to elevate brand presence, drive engagement, and communal growth.",
    image: joy,
    position: "center center",
  },
];

export default function Team() {
  return (
    <section className="bg-[#f7f8fc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            The people
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-950 leading-tight tracking-tight">
            Meet the team
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            A small, focused team on a big mission — transforming how
            Nigeria&apos;s students and corps members find placements.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: member.position }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="p-4 sm:p-6 flex flex-col gap-1.5 sm:gap-2">
                <div>
                  <h3 className="text-xs sm:text-base font-black text-gray-900 leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-bold text-primary mt-0.5">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed hidden sm:block">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
