"use client";

import { updateCompanyLogo } from "@/actions";
import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UploadThing from "@/components/upload-thing";
import { OnboardingData, onBoardCompanySchema } from "@/schemas";
import { cn } from "@/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function OnboardingForm({
  onSubmit,
}: {
  onSubmit: (data: OnboardingData) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onBoardCompanySchema),
    mode: "all",
    defaultValues: {
      industry: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      description: "",
      website: "",
      registrationNumber: "",
    },
  });

  const { execute: uploadLogo } = useAction(updateCompanyLogo, {
    onSuccess: () => toast.success("Company logo updated!"),
    onError: () => {},
  });

  return (
    <Form {...form}>
      <form
        id="onboarding-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col"
      >
        {/* ── Required fields ── */}
        <SectionHeader title="Required Information" />

        <FieldRow>
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FieldLabel label="Industry" required />
                <FormControl>
                  <Input
                    placeholder="e.g., Technology, Finance"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldRow>

        <FieldRow>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FieldLabel label="Contact Phone Number" required />
                <FormControl>
                  <Input placeholder="e.g., +234 801 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldRow>

        <FieldRow>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FieldLabel label="Full Address" required />
                <FormControl>
                  <Textarea
                    placeholder="Street, area, landmark"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldRow>

        <FieldRow>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel label="City" required />
                  <FormControl>
                    <Input placeholder="e.g., Lagos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel label="State" required />
                  <FormControl>
                    <Input placeholder="e.g., Lagos State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FieldRow>

        <FieldRow>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FieldLabel label="Company Bio" required />
                <FormControl>
                  <Textarea
                    placeholder="Tell students what your company does..."
                    className="h-28 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldRow>
        <SectionHeader title="Optional Information" className="mt-4" />

        <FieldRow>
          <div className="flex flex-col gap-1">
            <FieldLabel label="Company Logo" />
            <UploadThing
              onSelect={(file) => {
                setSelectedFile(file);
                uploadLogo({ logo: file! });
              }}
            >
              <LogoPreview selectedFile={selectedFile} />
            </UploadThing>
          </div>
        </FieldRow>

        <FieldRow>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FieldLabel label="Website" />
                <FormControl>
                  <Input placeholder="https://www.example.com" {...field} />
                </FormControl>
                {form.formState.errors.website ? (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.website.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must start with http:// or https://
                  </p>
                )}
              </FormItem>
            )}
          />
        </FieldRow>

        <FieldRow last>
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FieldLabel label="RC / Business Registration Number" />
                <FormControl>
                  <Input placeholder="e.g., RC 1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldRow>

      </form>
    </Form>
  );
}

function SectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("pt-2 pb-1", className)}>
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
        {title}
      </h2>
      <div className="mt-1 border-t" />
    </div>
  );
}

function FieldRow({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return <div className={cn("py-4", !last && "border-b")}>{children}</div>;
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <FormLabel className="flex items-center gap-2 mb-1">
      {label}
      {required ? (
        <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5 leading-none">
          Required
        </span>
      ) : (
        <span className="text-[10px] font-medium bg-muted text-muted-foreground rounded px-1.5 py-0.5 leading-none">
          Optional
        </span>
      )}
    </FormLabel>
  );
}

function LogoPreview({ selectedFile }: { selectedFile: File | null }) {
  return (
    <div className="flex flex-row gap-3 items-center">
      <div className="border-2 border-dashed rounded-xl w-20 h-20 flex items-center justify-center cursor-pointer shrink-0">
        {selectedFile ? (
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-xl"
          />
        ) : (
          <CameraIcon className="text-gray-400" size={20} />
        )}
      </div>
      <div>
        <p className="text-primary font-semibold text-sm">Upload Logo</p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, GIF up to 5MB (400×400 recommended)
        </p>
      </div>
    </div>
  );
}
