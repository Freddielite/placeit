import Input from "@/components/input";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { preferencesSchema, PreferencesSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Laptop, Building, ArrowRightLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { cn } from "@/utils/tailwind";

const label = "text-[11px] font-semibold uppercase tracking-wide text-gray-400";

const workLocations = [
  { value: "remote", label: "Remote", icon: Laptop, desc: "Work from anywhere" },
  { value: "onsite", label: "On-site", icon: Building, desc: "At company premises" },
  { value: "hybrid", label: "Hybrid", icon: ArrowRightLeft, desc: "Mix of both" },
] as const;

export default function PreferencesStep({
  onBack,
  onNext,
}: {
  onNext: (data?: any) => void;
  onBack: () => void;
}) {
  const [industryRaw, setIndustryRaw] = useState("");

  const form = useForm<PreferencesSchema>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredIndustry: [],
      availableStartDate: "",
      internshipDuration: undefined,
      preferredWorkMode: undefined,
    },
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit((data) => onNext(data))}
        id="preferences-step-form"
      >
        <FormField
          control={form.control}
          name="preferredWorkMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={label}>Preferred Work Mode</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {workLocations.map((loc) => {
                    const Icon = loc.icon;
                    const selected = field.value === loc.value;
                    return (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => field.onChange(loc.value)}
                        className={cn(
                          "cursor-pointer flex flex-col items-center gap-2 border p-3 sm:p-4 text-center transition-all",
                          selected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", selected ? "text-primary" : "text-gray-400")} />
                        <span className="text-xs font-semibold">{loc.label}</span>
                        <span className="text-[10px] text-gray-400 hidden sm:block">{loc.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredIndustry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={label}>Industry Interests</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Software, Marketing, Finance"
                  value={industryRaw}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setIndustryRaw(raw);
                    field.onChange(raw.split(",").map((v) => v.trim()).filter(Boolean));
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <p className="text-xs text-gray-400 mt-1">Separate multiple industries with a comma.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="internshipDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={label}>Duration</FormLabel>
                <FormControl>
                  <select
                    className="cursor-pointer w-full h-10 rounded-none border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...field}
                    value={field.value ?? ""}
                  >
                    <option value="" disabled>Select duration</option>
                    <option value="1-3 months">1 – 3 months</option>
                    <option value="3-6 months">3 – 6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={label}>Available From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
