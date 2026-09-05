"use client";

import { resendEmailVerification } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

type Schema = z.infer<typeof schema>;

export default function ResendVerificationPage() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, isExecuting } = useAction(resendEmailVerification, {
    onSuccess() {
      form.reset();
      toast.success("Verification email resent successfully");
    },
    onError(error) {
      toast.error("Failed to resend verification email");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="font-semibold">Resend verification email</p>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a new verification link.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => execute(data))}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isExecuting} className="w-full">
              {isExecuting ? "Sending..." : "Resend verification"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
