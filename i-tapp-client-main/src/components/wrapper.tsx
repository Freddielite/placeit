import { cn } from "@/utils/tailwind";
import { ClassValue } from "clsx";

export function Wrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: ClassValue;
}) {
  return (
    <section
      className={cn(
        // Base (mobile): tighter padding
        "w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 m-auto py-12 sm:py-16 md:py-20 lg:py-24",
        className
      )}
    >
      {children}
    </section>
  );
}
// max-w-[1440px]
