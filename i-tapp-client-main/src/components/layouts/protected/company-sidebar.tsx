import React from "react";
import Link from "next/link";
import { AddCircle, Element, Briefcase } from "iconsax-reactjs";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind";

const sideNavLinks: {
  [key: string]: {
    icon?: React.ReactNode;
    text: string;
    href: string;
  }[];
} = {
  overview: [
    {
      icon: <Element />,
      text: "Dashboard",
      href: "/portal/overview/dashboard",
    },
    // {
    //   icon: <Profile2User />,
    //   text: "Applicants",
    //   href: "/portal/overview/applicants",
    // },
    {
      icon: <Briefcase />,
      text: "Opportunities",
      href: "/portal/overview/opportunities",
    },
  ],
  // candidates: [
  //   {
  //     text: "Accepted",
  //     href: "/portal/candidates/accepted",
  //   },
  //   {
  //     text: "Shortlisted",
  //     href: "/portal/candidates/shortlisted",
  //   },
  //   {
  //     text: "Saved",
  //     href: "/portal/candidates/saved",
  //   },
  // ],
};

export function Nav() {
  const pathname = usePathname();
  const parentRoute = pathname.split("/")[2];

  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {sideNavLinks[parentRoute]?.map((link, index) => {
          // const isActive = pathname === link.href;
          const isActive = pathname.startsWith(link.href);

          return (
            <li key={index}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-4 pl-5 pr-8 py-3 text-base w-[270px] rounded-sm transition-colors",
                  "text-black/70 hover:text-primary",
                  isActive &&
                    "bg-secondary border-l-4 border-primary text-primary font-semibold"
                )}
              >
                {link.icon} {link.text}
              </Link>
            </li>
          );
        })}

        {/* Space Section */}
        {parentRoute === "space" && (
          <li
            className={cn(
              "text-black text-opacity-70 pl-5 w-[270px] pr-8 py-3 font-bold flex gap-6 text-base items-center",
              pathname === "/portal/space/create-space" &&
                "text-primary bg-secondary border-l-4 border-primary text-opacity-100"
            )}
          >
            <AddCircle />
            <Link href="/portal/space/create-space">Create Space</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
