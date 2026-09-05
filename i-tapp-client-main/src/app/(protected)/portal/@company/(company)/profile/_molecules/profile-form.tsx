"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAction } from "next-safe-action/hooks";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Input from "@/components/input";
import { Textarea } from "@/components/ui/textarea";
import UploadThing from "@/components/upload-thing";
import { FileUploadThing } from "@/components/file-upload-thing";
import { useFetchCompanyProfile } from "@/hooks/query";
import { Spinner } from "@/components/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { updateCompanyProfile } from "@/actions";
import { companyProfileSchema, ProfileFormData } from "@/schemas";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProfileForm({ onClose }: { onClose: () => void }) {
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const { data: companyProfile, isLoading } = useFetchCompanyProfile();

  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      industry: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      description: "",
      foundedYear: "",
      companySize: undefined,
      website: "",
      registrationNumber: "",
    },
  });

  const { execute: updateProfile, isExecuting } = useAction(
    updateCompanyProfile,
    {
      onSuccess() {
        toast.success("Profile updated.");
        queryClient.invalidateQueries({ queryKey: ["company-profile"] });
        onClose();
      },
      onError() {
        toast.error("Failed to update profile.");
      },
    },
  );

  useEffect(() => {
    if (companyProfile) {
      form.reset({
        industry: companyProfile.industry ?? "",
        phone: companyProfile.phone ?? "",
        address: companyProfile.address ?? "",
        city: companyProfile.city ?? "",
        state: companyProfile.state ?? "",
        description: companyProfile.description ?? "",
        foundedYear: companyProfile.foundedYear ?? "",
        companySize: (companyProfile.companySize as ProfileFormData["companySize"]) ?? undefined,
        website: companyProfile.website ?? "",
        registrationNumber: companyProfile.registrationNumber ?? "",
      });
    }
  }, [companyProfile, form]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile({ ...data });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form id="company-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Industry & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Technology, Finance" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., +234 801 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Input placeholder="Street, area, landmark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
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
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Lagos State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company Bio */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Tell students what your company does..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Founded Year & Company Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="foundedYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2018" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value ?? ""}
                    className="w-full border rounded-md px-3 py-2 text-sm h-10 bg-background"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51-200">51–200</option>
                    <option value="201-500">201–500</option>
                    <option value="501-1000">501–1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Website & RC Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.example.com" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Must start with http:// or https://
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RC / Business Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., RC 1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company Logo */}
        <FormField
          control={form.control}
          name="logoImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <UploadThing
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  onSelect={(file) => {
                    setSelectedLogo(file);
                    field.onChange(file);
                  }}
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div className="border-2 border-dashed rounded-xl w-20 h-20 flex items-center justify-center cursor-pointer shrink-0">
                      {selectedLogo ? (
                        <Image
                          src={URL.createObjectURL(selectedLogo)}
                          alt=""
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      ) : companyProfile?.logo ? (
                        <Image
                          src={companyProfile.logo}
                          alt="Current logo"
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      ) : (
                        <CameraIcon className="text-gray-400" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-primary font-semibold text-sm">
                        {selectedLogo ? selectedLogo.name : "Upload Logo"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 5MB (400×400 recommended)
                      </p>
                    </div>
                  </div>
                </UploadThing>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Documents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cacDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAC Document</FormLabel>
                <FormControl>
                  <FileUploadThing
                    title="Upload CAC document"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proofOfAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof of Address</FormLabel>
                <FormControl>
                  <FileUploadThing
                    title="Upload proof of address"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    description="Max 10MB. PDF/JPG/PNG/WEBP."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isExecuting}>
            {isExecuting ? "Updating..." : "Update Profile"}
          </Button>

          <Button type="button" variant="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
