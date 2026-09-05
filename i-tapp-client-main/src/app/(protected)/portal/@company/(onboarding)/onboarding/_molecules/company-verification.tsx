import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { kycFormSchema, KycFormValues } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function CompanyKyc({
  onNext,
  onBack,
}: {
  onNext: (values: KycFormValues) => void;
  onBack?: () => void;
}) {
  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      registrationNumber: "",
    },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        id="kyc-form"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => onNext(values))}
      >
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RC Number <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g., RC 1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
