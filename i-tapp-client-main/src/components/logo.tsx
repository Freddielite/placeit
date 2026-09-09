import Image from "next/image";
import { cn } from "@/utils/tailwind";

// The wordmark is dark navy artwork, so it vanishes against a dark header.
// `dark:brightness-0 dark:invert` flattens it to white.
//
// NOTE: this fires EVERYWHERE now. THEMEABLE_ROUTE_PREFIXES is `["/"]`, so
// the dark class is no longer portal-only (the older comment here said it
// was). The consequence: any header this sits in must have a themed
// background. A hardcoded `bg-white` or `bg-white/80` bar stays white in dark
// mode and the logo turns white inside it - which is exactly what happened on
// /get-started. Use `bg-background`.
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
