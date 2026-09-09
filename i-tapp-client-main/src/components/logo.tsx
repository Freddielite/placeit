import Image from "next/image";
import { cn } from "@/utils/tailwind";

// The wordmark is dark navy artwork, so it vanishes against a dark header.
// `dark:invert` only applies inside the portal, which is the only place the
// dark class is ever set - the marketing header is unaffected.
//
// A proper light-on-dark logo asset would be better than a filter; this is
// the stopgap until one exists.
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/new-logo.svg"
      height={150}
      width={150}
      priority={true}
      alt="PlaceIT"
      className={cn("dark:brightness-0 dark:invert", className)}
    />
  );
}
