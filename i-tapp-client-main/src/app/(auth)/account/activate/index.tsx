"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { claimAccount } from "@/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPasswordSchema } from "@/schemas";

export default function ClaimAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      npassword: "",
      cpassword: "",
    },
    mode: "onChange",
  });

  const { execute, isExecuting, hasErrored, result } = useAction(claimAccount, {
    onSuccess: () => {
      toast.success("Account activated successfully! You can now sign in.");
      router.replace("/signin");
    },
    onError: (error) => {
      toast.error(
        error?.error?.serverError ||
          "There was an Error activating your account",
      );
    },
  });

  if (!token) {
    return (
      <div className="w-full max-w-[350px] m-auto flex flex-col gap-5">
        <div className="text-center space-y-1">
          <p className="font-semibold text-red-600">Missing token</p>
          <p className="text-sm text-muted-foreground">
            Please open the invite link from your email again.
          </p>
        </div>
        <Link
          href="/signin"
          className="text-center text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[350px] m-auto flex flex-col gap-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="font-semibold">Activate your account</p>
          <p className="text-sm text-muted-foreground">
            Set a password to complete activation.
          </p>
        </div>

        {hasErrored && (
          <p className="text-red-500 text-sm font-medium text-center">
            {result?.serverError ?? "Activation failed. Try again."}
          </p>
        )}

        {/* Form */}
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) =>
              execute({
                ...values,
                token,
              }),
            )}
          >
            <FormField
              control={form.control}
              name="npassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="**********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="**********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isExecuting}>
              {isExecuting ? "Activating..." : "Activate account"}
            </Button>
          </form>
        </Form>
        <Link
          href="/signin"
          className="block text-center text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to sign in
        </Link>
      </div>
  );
}
