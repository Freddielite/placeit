"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import Input from "@/components/input";
import { ButtonWithLoader } from "@/components/button-with-loader";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { companySignup } from "@/actions";
import { companySignupSchema } from "@/schemas";

type CompanySignupSchema = z.infer<typeof companySignupSchema>;

export function CompanyInfo1() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const claim = searchParams.get("claim");
    if (claim) sessionStorage.setItem("listingClaimToken", claim);
  }, [searchParams]);

  const form = useForm<CompanySignupSchema>({
    mode: "onChange",
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cacNumber: "",
    },
  });

  const { execute, isExecuting, result, hasErrored } = useAction(
    companySignup,
    {
      onSuccess() {
        sessionStorage.removeItem("listingClaimToken");
        toast.success("Company signup successful!");
        router.push("/company/signin");
      },
      onError(error) {
        toast.error(error?.error?.serverError ?? "Sign up failed. Please try again.");
      },
    },
  );

  const onSubmit = (data: CompanySignupSchema) => {
    const claimToken = sessionStorage.getItem("listingClaimToken") ?? undefined;
    execute({ ...data, claimToken });
  };

  return (
    <div className="w-full">
      {hasErrored && (
        <p className="text-red-500 text-sm font-medium mb-2 ">
          {result?.serverError ?? "Something went wrong. Please try again."}
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Company name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@company.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Registration Number e.g 123456789"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="cacNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAC Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. RC 1210548 or BN 373466" />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">RC or BN number as registered with CAC.</p>
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
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ButtonWithLoader
            type="submit"
            className="w-full my-3"
            isPending={isExecuting}
            disabled={!form.formState.isValid || isExecuting}
          >
            Sign up
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
}
