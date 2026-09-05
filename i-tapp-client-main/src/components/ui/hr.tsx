import { cn } from "@/utils/tailwind";

export default function Hr({ className = "", ...rest }) {
  return <hr className={cn("border-gray-300 my-4", className)} {...rest} />;
}
