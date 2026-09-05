import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tailwind";

const inputDescriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      error: "text-danger",
      default: "text-grey-4",
      warning: "text-warning",
      success: "text-success",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputDescriptionProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof inputDescriptionVariants> {
  text?: string;
}

const InputDescription = React.forwardRef<
  HTMLSpanElement,
  InputDescriptionProps
>(({ className, variant, children, text, ...props }, ref) => (
  <>
    {(text || children) && (
      <span
        className={cn(inputDescriptionVariants({ className, variant }))}
        {...props}
      >
        {text || children}
      </span>
    )}
  </>
));
InputDescription.displayName = InputDescription.displayName;

export { InputDescription };
