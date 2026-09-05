"use client";

import { quickCreateCompany } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  industries,
  OnboardingData,
  onboardingSchema,
  studyFields,
} from "@/schemas/site.schema";
import { OpportunityMode } from "@/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, User, Users } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CompanyOnboarding() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companyName: "",
      address: "",
      industry: "",
      industryOther: "",
      acceptingStudents: "Yes",
      internshipTitle: "",
      stipend: "stipend provided",
      location: "",
      duration: "3",
      mode: undefined,

      preferredFieldsOfStudy: [],

      contact: {
        name: "",
        position: "",
        phone: "",
        email: "",
      },
    },
  });

  const industry = form.watch("industry");

  const { execute, isExecuting } = useAction(quickCreateCompany, {
    onSuccess() {
      setSubmitted(true);
    },
    onError() {
      toast.error("Failed to submit form. Please try again.");
    },
  });

  const OpportunityModeLabels = {
    [OpportunityMode.ONSITE]: "onsite",
    [OpportunityMode.REMOTE]: "remote",
    [OpportunityMode.HYBRID]: "hybrid",
    [OpportunityMode.FLEXIBLE]: "flexible",
  } as const;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-6 max-w-md mx-auto py-16">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Submission Received!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thank you for registering with PlaceIT. Our team will review your
            submission and reach out to you via the contact details provided.
          </p>
        </div>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit another response
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col  ">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Join PlaceIT</h1>
        <p className="text-sm text-muted-foreground">
          Connect your organization with high-potential students. Complete the
          Onboarding form and start engaging with next generation of Talent.
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col space-y-6 mt-8"
          onSubmit={form.handleSubmit(
            (values) => {
              execute(values);
            },
            (errors) => {
            },
          )}
        >
          {/* Company Information */}
          <Card
            title="Company Details"
            icon={<Building2 className="h-4 w-4" />}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g PlaceIT" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Office Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g 123 Main St, City, State"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-black text-xs">
                        Industry
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded-md px-3 py-2"
                        >
                          <option value="">Select industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                          <option value="other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {industry === "other" && (
                  <FormField
                    control={form.control}
                    name="industryOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase font-black text-xs">
                          Specify Industry
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Specify industry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-black text-xs">
                        Company Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="company@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>
          </Card>

          {/* Internship Preferences */}
          <Card
            title="Internship Preferences"
            icon={<Users className="h-4 w-4" />}
          >
            <FormField
              control={form.control}
              name="acceptingStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-black text-xs">
                    Are you currently open to accepting student interns?
                  </FormLabel>

                  <FormControl>
                    <div className="flex gap-6 flex-wrap">
                      {["Yes", "No", "Soon"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            value={option}
                            checked={field.value === option}
                            onChange={() => field.onChange(option)}
                            className="h-4 w-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internshipTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-black text-xs">
                    Internship Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g Frontend Developer Intern"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Lagos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      What category of student can you accept?
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded-md px-3 py-2"
                      >
                        <option value="">Duration</option>
                        <option value="4">0 - 4 Months</option>
                        <option value="4">4 - 6 Months</option>
                        <option value="6">6 - 12 Months</option>
                        {/* <option value="12">
                          Polytechnics, Monotechnics, Colleges of Technology
                          (12Months)
                        </option> */}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stipend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-black text-xs">
                    Stipend
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select stipend option</option>
                      <option value="stipend provided">Stipend Provided</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="depends">Depends</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredFieldsOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-black text-xs">
                    Preferred Fields of Study
                  </FormLabel>

                  <FormControl>
                    <div className="space-y-2">
                      {studyFields.map((fieldOfStudy) => {
                        const checked = field.value?.includes(fieldOfStudy);

                        return (
                          <label
                            key={fieldOfStudy}
                            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const current = field.value ?? [];

                                if (e.target.checked) {
                                  field.onChange([...current, fieldOfStudy]);
                                } else {
                                  field.onChange(
                                    current.filter((v) => v !== fieldOfStudy),
                                    // field.onChange(
                                    //   current.filter((v) => v !== fieldOfStudy),
                                    // ),
                                  );
                                }
                              }}
                            />
                            <span>{fieldOfStudy}</span>
                          </label>
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
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-black text-xs">
                    Internship Mode
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Internship Mode</option>
                      {Object.entries(OpportunityModeLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          {/* Contact Person */}
          <Card title="Contact Person" icon={<User className="h-4 w-4" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Position / Role
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="HR Manager" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+234..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-black text-xs">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email@company.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Button disabled={isExecuting} type="submit">
            {isExecuting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function Card({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-4 p-6  rounded-xl bg-white shadow">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-secondary rounded text-primary flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
