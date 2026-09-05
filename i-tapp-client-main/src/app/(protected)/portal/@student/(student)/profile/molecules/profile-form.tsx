"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { Student } from "@/types";
import { Phone, MapPin, Calendar, Briefcase, Code, Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import Input from "@/components/input";
import { useQueryClient } from "@tanstack/react-query";
import { StudentProfileSchema, updateStudentProfile } from "@/actions";
import { StudentProfileFormData } from "@/schemas";
import { TagInput } from "@/components/tag-input";
import { cn } from "@/utils/tailwind";

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-primary">{icon}</span>
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</p>
      <span className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

const fieldWrapperClass = "border-gray-200 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all";
const labelClass = "text-xs font-semibold text-gray-500 mb-1.5 block";
const selectClass = "w-full h-10 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none appearance-none";

export default function ProfileForm({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<StudentProfileFormData>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      phone: "",
      bio: "",
      softSkills: [],
      techSkills: [],
      preferredIndustry: "",
      address: "",
      dob: "",
    },
  });

  const { execute: updateProfileAction, isExecuting } = useAction(updateStudentProfile, {
    onSuccess() {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      onClose();
    },
    onError() {
      toast.error("Profile update failed");
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        phone: student.phone || "",
        bio: student.bio || "",
        techSkills: student.techSkills || [],
        softSkills: student.softSkills || [],
        preferredIndustry: student.preferredIndustry || "",
        dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
        address: student.address || "",
      });
    }
  }, [student, form]);

  const onSubmit = (data: StudentProfileFormData) => {
    updateProfileAction(data);
  };

  return (
    <Form {...form}>
      <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">

        {/* Contact */}
        <div>
          <SectionHeading icon={<Phone size={13} />} label="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+234 800 000 0000"
                      {...field}
                      wrapperClassName={fieldWrapperClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      wrapperClassName={fieldWrapperClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className={labelClass}>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St, City, State"
                      {...field}
                      wrapperClassName={fieldWrapperClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Career */}
        <div>
          <SectionHeading icon={<Briefcase size={13} />} label="Career" />
          <FormField
            control={form.control}
            name="preferredIndustry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Preferred Industry</FormLabel>
                <FormControl>
                  <div className="flex h-10 items-center rounded border border-gray-200 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden">
                    <select {...field} className={selectClass}>
                      <option value="">Select an industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Media & Communications">Media & Communications</option>
                    </select>
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>

        {/* Skills */}
        <div>
          <SectionHeading icon={<Code size={13} />} label="Skills" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="techSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Technical Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      placeholder="e.g JavaScript, React…"
                      color="blue"
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="softSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Soft Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      placeholder="e.g Communication, Teamwork…"
                      color="purple"
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <SectionHeading icon={<Heart size={13} />} label="About You" />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Bio & Work Experience</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Tell us about your background, projects, and experience…"
                    {...field}
                    className="w-full resize-none rounded border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit inside form so the modal footer button works via form="profile-form" */}
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Form>
  );
}
