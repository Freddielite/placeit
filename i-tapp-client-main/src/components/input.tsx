import * as React from "react";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { Button } from "./ui/button";
import { cn } from "@/utils/tailwind";

interface InputProps extends React.ComponentProps<"input"> {
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, wrapperClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";
    const actualType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div
        className={cn(
          "flex h-10 items-center gap-1 rounded border border-gray-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50",
          wrapperClassName,
        )}
      >
        <input
          ref={ref}
          type={actualType}
          className={cn(
            "flex-1 h-9 w-full bg-transparent px-3 py-1 text-base shadow-0 transition-colors placeholder:text-muted-foreground",
            "border-none outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          {...props}
        />

        {isPasswordType && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="p-0 hover:bg-transparent"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeSlash className="w-4 h-4 text-gray-500 cursor-pointer" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500 cursor-pointer" />
            )}
          </Button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
