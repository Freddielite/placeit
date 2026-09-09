import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonWithLoader } from "@/components/button-with-loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/input";
import { studentSignup } from "@/actions";
import { studentSignupSchema } from "@/schemas";
import { SignupSuccessModal } from "@/components/signup-success-modal";
import { FormErrorSummary } from "@/components/form-error-summary";

const LABELS = {
  email: "Email",
  phone: "Phone Number",
  password: "Password",
  confirmPassword: "Confirm Password",
};

type Login = {
  email: string;
  password: string;
};

export function SignupInfo({
  formIndex,
  setForm,
  studentData,
}: {
  formIndex: number;
  setForm: Dispatch<SetStateAction<number>>;
  studentData: any;
}) {
  const form = useForm<z.infer<typeof studentSignupSchema>>({
    mode: "all",
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: studentData?.data?.data?.phone ?? studentData?.data?.phone ?? "",
    },
  });

  const { isDirty, isValid, errors, isSubmitted } = form.formState;
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    execute: signupAction,
    hasErrored,
    result,
    isExecuting,
  } = useAction(studentSignup, {
    onSuccess() {
      // Modal shows the message and handles the redirect.
      setShowSuccess(true);
    },
    onError(error) {
      toast.error(error?.error?.serverError ?? "Error signing up. Please try again.");
    },
  });

  const handleSignup = (data: Login) => {
    const old = studentData.data;
    const payLoad = { ...old, ...data };
    signupAction(payLoad);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {showSuccess && (
        <SignupSuccessModal
          message="Your student account has been created. Kindly log in to continue."
          redirectTo="/signin"
        />
      )}

      <FormErrorSummary errors={errors} submitted={isSubmitted} labels={LABELS} />

      {hasErrored && result?.serverError && (
        <span className="text-red-500 text-sm font-medium">{result.serverError}</span>
      )}
      <Form {...form}>
        <form
          className="my-4 flex flex-col gap-2"
          onSubmit={form.handleSubmit(handleSignup)}
        >
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., +234 801 234 5678" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Confirm password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <ButtonWithLoader
            type="submit"
            isPending={isExecuting}
            disabled={isExecuting}
            className="w-full"
          >
            Sign up
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
}
