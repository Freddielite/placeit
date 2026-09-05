"use client";

import { signinAdmin } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminSigninInput, adminSigninSchema } from "@/schemas/admin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AdminAuth() {
  const router = useRouter();
  const f = useForm<AdminSigninInput>({
    resolver: zodResolver(adminSigninSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "all",
  });
  const { execute, isExecuting, hasErrored, result } = useAction(signinAdmin, {
    onSuccess: (data) => {
      toast.success("Welcome back, Admin!");
      router.replace("/admin");
    },
    onError: (error) => {
      toast.error("There was an error signing in.");
    },
  });

  // bg - gray - 50;
  return (
    <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md">
      <h3 className="text-2xl text-center font-semibold mb-2">Admin Login</h3>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Welcome back! Please enter your details.
      </p>

      <Form {...f}>
        <form
          onSubmit={f.handleSubmit((data) => execute(data))}
          className="flex flex-col w-full gap-4"
        >
          <FormField
            control={f.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black">Email Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={f.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="********" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-center justify-between text-sm gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                name="remember"
                checked={f.getValues("remember")}
                onCheckedChange={(checked) =>
                  f.setValue("remember", checked === true)
                }
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {hasErrored && (
            <p className="text-red-500 text-xs">{result?.serverError}</p>
          )}

          <Button type="submit" disabled={!f.formState.isValid || isExecuting}>
            {isExecuting ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
        <p>For authorized personnel only.</p>
        <p>&copy; 2025 i-Tapp. All rights reserved.</p>
      </div>
    </div>
  );
}
