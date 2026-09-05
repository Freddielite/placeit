"use client";

import { changePassword } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { resetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");

  const npassword = watch("npassword");
  const cpassword = watch("cpassword");

  const { execute, isExecuting, hasErrored } = useAction(changePassword, {
    onSuccess: () => {
      setMessage("Password has been reset successfully.");
    },
    onError: (error) => {
      setMessage(
        error?.error?.serverError || "Failed to send reset link. Try again.",
      );
    },
  });

  const onSubmit = () => {
    // e.preventDefault();
    setMessage("");
    execute({
      npassword: npassword,
      cpassword: cpassword,
      token: token || "",
    });
  };
  return (
    <div className="flex flex-col">
      <h1 className="font-black text-center text-xl">Change Password</h1>
      <p className="text-center text-sm text-muted-foreground ">
        Create a new, strong password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <label className="mt-4 mb-2 font-black text-sm" htmlFor="email">
          New Password
        </label>
        <Input
          placeholder="**********"
          //   value={form.npassword}
          type="password"
          {...register("npassword")}
          //   onChange={(e) => setForm({ ...form, npassword: e.target.value })}
        />
        {errors.npassword && (
          <p className="text-red-500 mt-2 text-sm">
            {errors.npassword.message}
          </p>
        )}
        <div className="my-4" />
        <label className="mt-10 mb-2 font-black text-sm" htmlFor="email">
          Confirm New Password
        </label>
        <Input
          placeholder="**********"
          //   value={form.cpassword}
          type="password"
          {...register("cpassword")}
          //   onChange={(e) => setForm({ ...form, cpassword: e.target.value })}
        />
        {errors.cpassword && (
          <p className="text-red-500 text-sm mt-2">
            {errors.cpassword.message}
          </p>
        )}
        {message && (
          <p
            className={`mt-2 text-sm ${
              hasErrored ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <Button className="w-full mt-6" disabled={isExecuting}>
          {isExecuting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
      <Button variant="link" className="w-full mt-2">
        Back to Sign In
      </Button>
    </div>
  );
}
