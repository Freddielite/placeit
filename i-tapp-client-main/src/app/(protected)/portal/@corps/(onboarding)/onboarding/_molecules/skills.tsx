"use client";

import Input from "@/components/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { corpsSkillsSchema, CorpsSkillsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const selectClass = "w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {!required && <span className="ml-1.5 text-[10px] normal-case font-normal tracking-normal text-gray-300">optional</span>}
  </label>
);

/* Raw-string input that feeds a string[] field — fixes the space-eating bug */
function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [raw, setRaw] = useState(() => (value ?? []).join(", "));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setRaw(text);
    onChange(text.split(",").map((v) => v.trim()).filter(Boolean));
  };

  return <Input value={raw} onChange={handleChange} placeholder={placeholder} />;
}

export default function CorpsSkillsStep({
  onNext,
}: {
  onNext: (data: CorpsSkillsSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsSkillsSchema>({
    resolver: zodResolver(corpsSkillsSchema),
    mode: "onSubmit",
    defaultValues: {
      techSkills: [], softSkills: [], bio: "",
      preferredIndustry: [], internshipDuration: "", availableStartDate: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-5" id="corps-skills-form">

        {/* Bio */}
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem>
            <Label>Short Bio</Label>
            <FormControl>
              <textarea
                className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                placeholder="Tell employers a bit about yourself — your background, interests, and what you bring to the table."
                rows={3}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Divider */}
        <div className="border-t border-gray-100 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-4 mt-3">Skills</p>

          <div className="flex flex-col gap-4">
            <FormField control={form.control} name="techSkills" render={({ field }) => (
              <FormItem>
                <Label>Technical Skills</Label>
                <FormControl>
                  <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. React, Python, AutoCAD, Excel" />
                </FormControl>
                <p className="text-[11px] text-gray-400 mt-1">Separate with commas.</p>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="softSkills" render={({ field }) => (
              <FormItem>
                <Label>Soft Skills</Label>
                <FormControl>
                  <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. Communication, Teamwork, Leadership" />
                </FormControl>
                <p className="text-[11px] text-gray-400 mt-1">Separate with commas.</p>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-4 mt-3">Placement Preferences</p>

          <div className="flex flex-col gap-4">
            <FormField control={form.control} name="preferredIndustry" render={({ field }) => (
              <FormItem>
                <Label required>Industry Interests</Label>
                <FormControl>
                  <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="e.g. Technology, Finance, Healthcare" />
                </FormControl>
                <p className="text-[11px] text-gray-400 mt-1">Industries you'd like your PPA to be in. Separate with commas.</p>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-4">
              <FormField control={form.control} name="internshipDuration" render={({ field }) => (
                <FormItem className="flex-1">
                  <Label required>Preferred Duration</Label>
                  <FormControl>
                    <select className={selectClass} {...field} value={field.value ?? ""}>
                      <option value="" disabled>Select duration</option>
                      <option value="1-3 months">1–3 months</option>
                      <option value="3-6 months">3–6 months</option>
                      <option value="6+ months">6+ months</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="availableStartDate" render={({ field }) => (
                <FormItem className="flex-1">
                  <Label required>Available Start Date</Label>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} className="rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </div>

      </form>
    </Form>
  );
}
