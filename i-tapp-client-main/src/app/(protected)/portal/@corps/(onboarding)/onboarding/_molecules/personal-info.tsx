"use client";

import Input from "@/components/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { corpsPersonalInfoSchema, CorpsPersonalInfoSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const selectClass = "w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {!required && <span className="ml-1.5 text-[10px] normal-case font-normal tracking-normal text-gray-300">optional</span>}
  </label>
);

export default function CorpsPersonalInfoStep({
  onNext,
}: {
  onNext: (data: CorpsPersonalInfoSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsPersonalInfoSchema>({
    resolver: zodResolver(corpsPersonalInfoSchema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", phone: "", gender: undefined, location: "" },
  });

  const phone = form.watch("phone");
  const phoneOk = /^(\+?234|0)[789]\d{9}$/.test(phone ?? "");
  const phoneTouched = form.formState.touchedFields.phone;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-5" id="corps-personal-info-form">

        {/* Name */}
        <div className="flex gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem className="flex-1">
              <Label required>First Name</Label>
              <FormControl><Input placeholder="e.g. Amaka" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem className="flex-1">
              <Label required>Last Name</Label>
              <FormControl><Input placeholder="e.g. Okonkwo" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Phone */}
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem className="max-w-sm">
            <Label required>Phone Number</Label>
            <FormControl>
              <Input
                placeholder="e.g. 08012345678"
                {...field}
                className={
                  phoneTouched
                    ? phoneOk
                      ? "border-emerald-400 focus:ring-emerald-400"
                      : "border-red-400 focus:ring-red-400"
                    : ""
                }
              />
            </FormControl>
            {phoneTouched && !phoneOk && phone && (
              <p className="text-[11px] text-red-500 mt-1">Enter a valid Nigerian number (e.g. 08012345678)</p>
            )}
            {phoneTouched && phoneOk && (
              <p className="text-[11px] text-emerald-600 mt-1">Looks good</p>
            )}
            <FormMessage />
          </FormItem>
        )} />

        {/* Divider */}
        <div className="pt-1 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-4 mt-3">Additional Details</p>

          <div className="flex gap-4">
            <FormField control={form.control} name="gender" render={({ field }) => (
              <FormItem className="flex-1">
                <Label required>Gender</Label>
                <FormControl>
                  <select className={selectClass} {...field} value={field.value ?? ""}>
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem className="flex-1">
                <Label>Home Location</Label>
                <FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

      </form>
    </Form>
  );
}
