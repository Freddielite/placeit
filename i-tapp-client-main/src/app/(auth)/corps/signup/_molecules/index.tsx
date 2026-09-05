"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

export default function CorpsSignup() {
  const router = useRouter();
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
      toast.success("Account created! Please check your email to verify.");
      router.replace("/signin");
    },
    onError: (error) => {
      toast.error(
        error?.error?.serverError ?? "Sign up failed. Please try again.",
      );
    },
  });

  return (
    <div className="w-full max-w-xl bg-white p-8 border-gray-100">
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
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Chukwuemeka" />
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
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Obi" />
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
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="you@email.com" />
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
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+234 801 234 5678" />
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
                <FormLabel>Password</FormLabel>
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
            disabled={!form.formState.isValid || isExecuting}
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
