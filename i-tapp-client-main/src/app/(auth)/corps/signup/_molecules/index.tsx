"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { corpsSignup } from "@/actions";
import { corpsSignupSchema, CorpsSignupInput } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/input";
import { SignupSuccessModal } from "@/components/signup-success-modal";
import { FormErrorSummary } from "@/components/form-error-summary";

const LABELS = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone Number",
  password: "Password",
};

export default function CorpsSignup() {
  const [showSuccess, setShowSuccess] = useState(false);
  const form = useForm<CorpsSignupInput>({
    resolver: zodResolver(corpsSignupSchema),
    mode: "all",
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const { execute, isExecuting, hasErrored, result } = useAction(corpsSignup, {
    onSuccess: () => {
      // The modal carries this message and does the redirect itself.
      setShowSuccess(true);
    },
    onError: (error) => {
      toast.error(
        error?.error?.serverError ?? "Sign up failed. Please try again.",
      );
    },
  });

  return (
    <div className="w-full max-w-xl bg-white p-8 border-gray-100">
      {showSuccess && (
        <SignupSuccessModal
          message="Your corps member account has been created. Check your email to verify it, then log in to continue."
          redirectTo="/signin"
        />
      )}

      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">
            Corps Member Sign Up
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find your NYSC Place of Primary Assignment
          </p>
        </div>
      </div>

      <FormErrorSummary
        errors={form.formState.errors}
        submitted={form.formState.isSubmitted}
        labels={LABELS}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => execute(data))}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Chukwuemeka" className="placeholder:text-muted-foreground/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Obi" className="placeholder:text-muted-foreground/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="e.g. you@email.com" className="placeholder:text-muted-foreground/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. +234 801 234 5678" className="placeholder:text-muted-foreground/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Min. 6 characters"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasErrored && (
            <p className="text-red-500 text-xs">{result?.serverError}</p>
          )}

          <Button
            type="submit"
            disabled={isExecuting}
            className="w-full mt-2 cursor-pointer"
          >
            {isExecuting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-primary font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-500">
        Looking for SIWES?{" "}
        <Link
          href="/welcome"
          className="text-primary font-semibold hover:underline"
        >
          Student sign up
        </Link>
      </p>
    </div>
  );
}
