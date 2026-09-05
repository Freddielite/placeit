import { FileUploadThing } from "@/components/file-upload-thing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DocumentSchema, documentStepSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const label = "text-[11px] font-semibold uppercase tracking-wide text-gray-400";

export default function DocumentStep({
  onBack,
  onNext,
}: {
  onNext: (values: DocumentSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<DocumentSchema>({
    resolver: zodResolver(documentStepSchema),
    mode: "onChange",
    defaultValues: {
      itLetter: undefined,
      cv: undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onNext(values))}
        className="space-y-8"
        id="document-step-form"
      >
        <div className="border-l-4 border-blue-400 bg-blue-50 px-4 py-3 text-xs text-blue-700 leading-relaxed">
          Your IT letter is required to apply to placements. Your CV helps companies learn more about you.
        </div>

        <FormField
          control={form.control}
          name="itLetter"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel className={label}>IT Letter <span className="text-red-500 ml-0.5">*</span></FormLabel>
              </div>
              <FormControl>
                <FileUploadThing
                  title="Upload IT letter"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {fieldState.error.message}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel className={label}>CV / Resume</FormLabel>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Optional
                </span>
              </div>
              <FormControl>
                <FileUploadThing
                  title="Upload CV"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
