"use client";

import { useFormStatus } from "react-dom";

import { Button, ButtonProps } from "./ui/button";
import { Loader } from "./ui/loader";

export function ButtonWithLoader({
  children,
  isPending,
  loaderClassName,
  ...props
}: ButtonProps & {
  loaderClassName?: string;
  isPending?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props}>
      {pending || isPending ? <Loader className={loaderClassName} /> : children}
    </Button>
  );
}
