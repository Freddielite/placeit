"use client";

import { requestPasswordReset } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { execute, isExecuting, hasErrored } = useAction(requestPasswordReset, {
    onSuccess: () => {
      setMessage(
        "If an account with that email exists, a reset link has been sent.",
      );
    },
    onError: (error) => {
      setMessage(
        error?.error?.serverError ||
          error?.error?.validationErrors?.email?._errors?.[0] ||
          "Failed to send reset link. Try again.",
      );
    },
  });
  return (
    <div className="flex flex-col">
      <h1 className="font-black text-center text-xl">Forgot Password</h1>
      <p className="text-center text-sm text-muted-foreground ">
        Enter your email address to reset your password.
      </p>

      <div className="mt-4">
        <label className="mt-4 mb-2 font-black text-sm" htmlFor="email">
          Email
        </label>
        <Input
          placeholder="Enter your email address"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && (
          <p
            className={`mt-2 text-sm ${
              hasErrored ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <Button
          className="w-full mt-6"
          disabled={!email || isExecuting}
          onClick={() => {
            setMessage("");
            execute({ email });
          }}
        >
          {isExecuting ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button variant="link" className="w-full mt-2">
          <Link href="/admin/login">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
