"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  OpportunityMode,
  OpportunityStatus,
  OpportunityType,
} from "@/types/enums";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/input";
import { FormValues, opportunityFormSchema } from "@/schemas";
import ReactSelect from "react-select";
import { departments } from "@/types";
import { studyFields } from "@/schemas/site.schema";

type OpportunityFormProps = {
  initialData?: FormValues;
  onSubmit: (data: FormValues) => void;
  onClose?: () => void;
  isExecuting?: boolean;
};

export default function OpportunityForm({
  initialData,
  onSubmit,
  onClose,
  isExecuting,
}: OpportunityFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: initialData ?? {
      title: "",
      department: [],
      location: "",
      mode: OpportunityMode.REMOTE,
      type: OpportunityType.FULL_TIME,
      status: OpportunityStatus.DRAFT,
      duration: 1,
      description: "",
      maxApplicants: undefined,
      applicationDeadline: undefined,
      autoCloseOnDeadline: false,
      preferredFieldsOfStudy: [],
      programType: "siwes" as const,
      // skills: "",
    },

    mode: "onChange", // better UX: validates while typing
  });

  useEffect(() => form.reset(initialData), [initialData, form]);

  const handleSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      applicationDeadline: data.applicationDeadline
        ? new Date(data.applicationDeadline).toISOString()
        : undefined,
    };
    onSubmit(formattedData);
    // console.log("Form data:", formattedData);
    // console.log("Errors:", form.formState.errors);
  };

  const OpportunityTypeLabels = {
    [OpportunityType.FULL_TIME]: "Full-time",
    [OpportunityType.PART_TIME]: "Part-time",
    [OpportunityType.INTERNSHIP]: "Internship",
    [OpportunityType.CONTRACT]: "Contract",
  } as const;

  const OpportunityModeLabels = {
    [OpportunityMode.ONSITE]: "On-site",
    [OpportunityMode.REMOTE]: "Remote",
    [OpportunityMode.HYBRID]: "Hybrid",
    [OpportunityMode.FLEXIBLE]: "Flexible",
  } as const;

  const OpportunityStatusLabels = {
    [OpportunityStatus.OPEN]: "Open",
    [OpportunityStatus.CLOSED]: "Closed",
    [OpportunityStatus.DRAFT]: "Draft",
  } as const;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            (values) => handleSubmit(values),
            () => {},
          )}
          className="space-y-6"
        >
          {/* Opportunity Details Section */}
          <div className="border-2 border-primary/20 rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Opportunity Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry */}
              <FormField
                control={form.control}
                name="preferredFieldsOfStudy"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">
                      Preferred Fields of Study
                    </FormLabel>
                    <FormControl>
                      <ReactSelect
                        className=" text-sm"
                        isMulti
                        options={studyFields.map((dept) => ({
                          value: dept,
                          label: dept,
                        }))}
                        value={studyFields
                          .map((dept) => ({ value: dept, label: dept }))
                          .filter((opt) => field.value?.includes(opt.value))}
                        onChange={(selected) => {
                          field.onChange(selected.map((item) => item.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Department</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Engineering" {...field} /> */}
                      <ReactSelect
                        className=" text-sm"
                        isMulti
                        options={departments.map((dept) => ({
                          value: dept,
                          label: dept,
                        }))}
                        value={departments
                          .map((dept) => ({ value: dept, label: dept }))
                          .filter((opt) => field.value?.includes(opt.value))}
                        onChange={(selected) => {
                          field.onChange(selected.map((item) => item.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Lagos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mode */}
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Work Mode</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(OpportunityModeLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Opportunity Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(OpportunityTypeLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Program Type */}
              <FormField
                control={form.control}
                name="programType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Type <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => field.onChange(v || undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select program type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="siwes">SIWES — Student Industrial Training</SelectItem>
                          <SelectItem value="ppa">PPA — NYSC Place of Primary Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(OpportunityStatusLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="w-32">Duration (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="numer"
                        placeholder="e.g. 3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter job description..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Application Settings Section */}
          <div className="border-2 border-primary/20 rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Application Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Max Applicants */}
              <FormField
                control={form.control}
                name="maxApplicants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Applicants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty for unlimited applicants
                    </p>
                  </FormItem>
                )}
              />

              {/* Application Deadline */}
              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applications will not be accepted after this date
                    </p>
                  </FormItem>
                )}
              />

              {/* Auto-close Option */}
              <FormField
                control={form.control}
                name="autoCloseOnDeadline"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Auto-close when maximum applicants reached
                      </FormLabel>
                      <p className="text-xs text-muted-foreground mt-1">
                        The opportunity will automatically close when the
                        maximum number of applicants is reached
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Required Documents */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" className="gap-2 text-white">
              <Save size={18} />
              {isExecuting ? "Saing..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
