import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFetchMyProfile } from "@/hooks/query";
import { schoolInfoSchema, SchoolInfoSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";

const label = "text-[11px] font-semibold uppercase tracking-wide text-gray-400";

export default function SchoolInfoStep({
  onBack,
  onNext,
}: {
  onNext: (data?: any) => void;
  onBack: () => void;
}) {
  const { data } = useFetchMyProfile();
  const form = useForm<SchoolInfoSchema>({
    resolver: zodResolver(schoolInfoSchema),
    mode: "onChange",
    values: {
      school: data?.student?.school ?? "",
      courseOfStudy: data?.student?.courseOfStudy ?? "",
      level: "",
      gpa: "",
      degreeType: "OND",
      graduationYear: "",
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-8"
        id="school-info-step-form"
      >
        {/* Academic */}
        <div className="space-y-4">
          <p className={label}>Academic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={label}>Institution</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly
                        placeholder="e.g. University of Benin"
                        {...field}
                        className="bg-gray-50 text-gray-500 cursor-not-allowed pr-9 rounded-none"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-400 mt-1">Set during registration.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={label}>Course of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="degreeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={label}>Degree</FormLabel>
                  <FormControl>
                    <select
                      className="cursor-pointer w-full h-10 rounded-none border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      {...field}
                      value={field.value ?? ""}
                    >
                      <option value="" disabled>Select</option>
                      <option value="OND">OND</option>
                      <option value="HND">HND</option>
                      <option value="BSC">B.Sc</option>
                      <option value="MSC">M.Sc</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={label}>Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={label}>CGPA</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="graduationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={label}>Grad. Year</FormLabel>
                  <FormControl>
                    <select
                      className="cursor-pointer w-full h-10 rounded-none border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      {...field}
                      value={field.value ?? ""}
                    >
                      <option value="" disabled>Year</option>
                      {Array.from({ length: 11 }, (_, i) => 2022 + i).map((yr) => (
                        <option key={yr} value={String(yr)}>{yr}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4 pt-2 border-t">
          <p className={label}>Contact</p>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <FormLabel className={label}>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+234 801 234 5678" {...field} />
                </FormControl>
                <p className="text-xs text-gray-400 mt-1">
                  A number companies can reach you on directly.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
