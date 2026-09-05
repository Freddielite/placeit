"use client";

import Input from "@/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { corpsInfoSchema, CorpsInfoSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 10 + i);
const BATCH_YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 2 + i);

const selectClass =
  "w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary";

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {!required && (
      <span className="ml-1.5 text-[10px] normal-case font-normal tracking-normal text-gray-300">
        optional
      </span>
    )}
  </label>
);

export default function CorpsNyscInfoStep({
  onNext,
}: {
  onNext: (data: CorpsInfoSchema) => void;
  onBack: () => void;
}) {
  const form = useForm<CorpsInfoSchema>({
    resolver: zodResolver(corpsInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      stateOfDeployment: "",
      stateCode: "",
      nyscRegNumber: "",
      batchYear: "",
      stream: undefined,
      courseOfStudy: "",
      degreeType: undefined,
      school: "",
      graduationYear: "",
      gpa: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="flex flex-col gap-5"
        id="corps-nysc-info-form"
      >
        {/* NYSC Section */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
          NYSC Details
        </p>

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="stateOfDeployment"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label required>State of Deployment</Label>
                <FormControl>
                  <select
                    className={selectClass}
                    {...field}
                    value={field.value ?? ""}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stateCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label>State Code</Label>
                <FormControl>
                  <Input
                    placeholder="e.g. LG/24A/1234"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nyscRegNumber"
          render={({ field }) => (
            <FormItem>
              <Label required>NYSC Callup Number</Label>
              <FormControl>
                <Input placeholder="e.g. LG/24A/1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="batchYear"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label required>Batch Year</Label>
                <FormControl>
                  <select
                    className={selectClass}
                    {...field}
                    value={field.value ?? ""}
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    {BATCH_YEARS.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stream"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label required>Stream</Label>
                <FormControl>
                  <select
                    className={selectClass}
                    {...field}
                    value={field.value ?? ""}
                  >
                    <option value="" disabled>
                      Select stream
                    </option>
                    <option value="stream_i">Stream I</option>
                    <option value="stream_ii">Stream II</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Academic Section */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-4 mt-3">
            Academic Background
          </p>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <Label required>Institution</Label>
                  <FormControl>
                    <Input placeholder="e.g. University of Lagos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseOfStudy"
              render={({ field }) => (
                <FormItem>
                  <Label required>Course of Study</Label>
                  <FormControl>
                    <Input placeholder="e.g. Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="degreeType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label required>Degree Type</Label>
                    <FormControl>
                      <select
                        className={selectClass}
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        <option value="OND">OND</option>
                        <option value="HND">HND</option>
                        <option value="BSC">B.Sc</option>
                        <option value="BTECH">B.Tech</option>
                        <option value="BEng">B.Eng</option>
                        <option value="BA">B.A</option>
                        <option value="MSC">M.Sc</option>
                        <option value="PGDIP">PG Diploma</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label required>Graduation Year</Label>
                    <FormControl>
                      <select
                        className={selectClass}
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value="" disabled>
                          Select year
                        </option>
                        {GRAD_YEARS.map((y) => (
                          <option key={y} value={String(y)}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label>CGPA</Label>
                    <FormControl>
                      <Input
                        placeholder="e.g. 3.8"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
