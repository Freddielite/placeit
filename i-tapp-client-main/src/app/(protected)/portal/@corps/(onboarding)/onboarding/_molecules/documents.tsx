"use client";

import { FileUploadThing } from "@/components/file-upload-thing";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { corpsDocumentStepSchema, CorpsDocumentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {!required && <span className="ml-1.5 text-[10px] normal-case font-normal tracking-normal text-gray-300">optional</span>}
  </label>
);

export default function CorpsDocumentStep({
  onNext,
}: {
  onNext: (data: CorpsDocumentSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsDocumentSchema>({
    resolver: zodResolver(corpsDocumentStepSchema),
    mode: "onChange",
    defaultValues: { callUpLetter: undefined, cv: undefined, relocationLetter: undefined },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-6" id="corps-documents-form">

        {/* Info callout */}
        <div className="border-l-4 border-blue-400 bg-blue-50 px-4 py-3">
          <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-1">Before you upload</p>
          <p className="text-xs text-blue-600 leading-relaxed">
            Upload clear, readable PDF or image files. Your call-up letter is required to verify your NYSC status.
          </p>
        </div>

        {/* Call-up letter */}
        <FormField control={form.control} name="callUpLetter" render={({ field, fieldState }) => (
          <FormItem>
            <Label required>Call-Up Letter</Label>
            <FormControl>
              <FileUploadThing title="Upload Call-Up Letter" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            </FormControl>
            {fieldState.error?.message && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{fieldState.error.message}</p>
            )}
            <FormMessage />
          </FormItem>
        )} />

        {/* CV */}
        <FormField control={form.control} name="cv" render={({ field }) => (
          <FormItem>
            <Label>CV / Resume</Label>
            <FormControl>
              <FileUploadThing title="Upload CV" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Relocation letter */}
        <FormField control={form.control} name="relocationLetter" render={({ field }) => (
          <FormItem>
            <Label>Relocation Letter</Label>
            <FormControl>
              <FileUploadThing title="Upload Relocation Letter" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
            </FormControl>
            <p className="text-[11px] text-gray-400 mt-1">Only required if you've been issued a relocation letter by NYSC.</p>
            <FormMessage />
          </FormItem>
        )} />

      </form>
    </Form>
  );
}
