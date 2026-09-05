import { cn } from "@/utils/tailwind";

function FormField({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full flex flex-col gap-2", className)} {...props} />
  );
}

export { FormField };
