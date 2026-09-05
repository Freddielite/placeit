"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ButtonWithLoader } from "@/components/button-with-loader";

import { toast } from "react-toastify";

import { useStudentStore } from "@/lib/store/student";
import Input from "@/components/input";
import { signin } from "@/actions";
import { signinSchema } from "@/schemas";

const ROLE_REDIRECTS: Record<string, string> = {
  student: "/portal/find-it-space",
  company: "/portal/dashboard",
  corps: "/portal/find-ppa",
  admin: "/admin",
};

export function StudentSignIn() {
  const router = useRouter();
  const setStudent = useStudentStore((s) => s.setStudent);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const { execute, isExecuting, hasErrored, result } = useAction(signin, {
    onSuccess(data) {
      const user = data?.data?.user;
      const profile = data?.data?.profile;
      if (user?.role === "student") setStudent({ ...user, ...profile });
      toast.success("Welcome back!");
      const dest = ROLE_REDIRECTS[user?.role] ?? "/portal";
      router.replace(
        user?.role === "student" && !profile?.isOnboarded ? "/portal/onboarding" : dest,
      );
    },
    onError(error) {
      toast.error(error?.error?.serverError ?? "Login failed. Try again.");
    },
  });

  return (
    <div className="w-full max-w-[350px] m-auto flex flex-col">
      <div className="flex flex-col  items-center mb-6">
        <h1 className="text-xl font-bold">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to your account to continue
        </p>
      </div>

      {hasErrored && (
        <p className="text-red-500 text-sm font-medium mb-2 text-center">
          {result?.serverError ?? "Something went wrong. Please try again."}
        </p>
      )}

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((values) => execute(values))}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black">Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="name@example.com" />
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
                <FormLabel className="text-xs font-black">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between text-sm">
            <div className="flex flex-row justify-center gap-1">
              <input type="checkbox" title="checkbox" />
              Remember me
            </div>

            <Link href={"/account/forgot-password"} className="text-primary">
              Forgot Password?
            </Link>
          </div>

          <ButtonWithLoader
            type="submit"
            disabled={!form.formState.isValid}
            isPending={isExecuting}
            className="w-full h-11.5 text-white"
          >
            Sign In
          </ButtonWithLoader>
        </form>
      </Form>

      <p className="text-sm text-center mt-6">
        Don’t have an account yet?{" "}
        <Link href="/welcome" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
