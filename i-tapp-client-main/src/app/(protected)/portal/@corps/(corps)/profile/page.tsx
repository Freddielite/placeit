"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { z } from "zod";
import { useFetchCorpsProfile } from "@/queries";
import { updateCorpsProfile } from "@/actions";
import { Wrapper } from "@/components/wrapper";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import Input from "@/components/input";
import { NIGERIAN_STATES } from "@/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, GraduationCap, Shield, MapPin, BadgeCheck } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
  stateOfDeployment: z.string().optional(),
  nyscRegNumber: z.string().optional(),
  batchYear: z.string().optional(),
  stream: z.enum(["A", "B"]).optional(),
  school: z.string().optional(),
  graduationYear: z.string().optional(),
  gender: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const selectClass =
  "w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-ring transition-colors";

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export default function CorpsProfilePage() {
  const { data, isLoading } = useFetchCorpsProfile();
  const corps = data?.corps ?? data;

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: corps?.firstName ?? "",
      lastName: corps?.lastName ?? "",
      phone: corps?.phone ?? "",
      stateOfDeployment: corps?.stateOfDeployment ?? "",
      nyscRegNumber: corps?.nyscRegNumber ?? "",
      batchYear: corps?.batchYear ?? "",
      stream: corps?.stream ?? undefined,
      school: corps?.school ?? "",
      graduationYear: corps?.graduationYear ?? "",
      gender: corps?.gender ?? "",
    },
  });

  const { execute, isExecuting } = useAction(updateCorpsProfile, {
    onSuccess: () => toast.success("Profile updated"),
    onError: (e) =>
      toast.error(e?.error?.serverError ?? "Failed to update profile"),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );

  const fullName =
    `${corps?.firstName ?? ""} ${corps?.lastName ?? ""}`.trim() || "Corps Member";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen pt-10 lg:pt-0">
      <Wrapper className="py-10 max-w-6xl">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your personal and NYSC information
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left sidebar — identity card */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-3">
                {initials}
              </div>
              <p className="font-semibold text-gray-900 text-base">{fullName}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full">
                <BadgeCheck className="w-3 h-3" /> Corps Member
              </span>

              {(corps?.nyscRegNumber || corps?.stateOfDeployment) && (
                <div className="mt-4 w-full space-y-2 text-left">
                  {corps?.nyscRegNumber && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{corps.nyscRegNumber}</span>
                    </div>
                  )}
                  {corps?.stateOfDeployment && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      <span>{corps.stateOfDeployment}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick info pills */}
            {(corps?.batchYear || corps?.stream || corps?.school) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Quick Info
                </p>
                {corps?.batchYear && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Batch</span>
                    <span className="font-medium text-gray-900">{corps.batchYear}</span>
                  </div>
                )}
                {corps?.stream && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stream</span>
                    <span className="font-medium text-gray-900">Stream {corps.stream === "A" || corps.stream === "B" ? corps.stream : corps.stream?.replace(/stream_?/i, "").toUpperCase()}</span>
                  </div>
                )}
                {corps?.school && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Institution</span>
                    <span className="font-medium text-gray-900 text-right max-w-[140px] truncate">
                      {corps.school}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="flex-1 min-w-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => execute(v))}>
                {/* Top row: Personal + NYSC side by side on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                  <SectionCard
                    icon={<User className="w-4 h-4" />}
                    title="Personal Information"
                    description="Your basic contact details"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl><Input {...field} placeholder="+234..." /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <select {...field} className={selectClass}>
                                  <option value="">Select</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    icon={<Shield className="w-4 h-4" />}
                    title="NYSC Information"
                    description="Your service details and deployment"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nyscRegNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NYSC Reg. Number</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g. LC/23A/1234" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="batchYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Batch Year</FormLabel>
                              <FormControl><Input {...field} placeholder="e.g. 2024" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="stream"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stream</FormLabel>
                              <FormControl>
                                <select {...field} className={selectClass}>
                                  <option value="">Select</option>
                                  <option value="A">Stream A</option>
                                  <option value="B">Stream B</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="stateOfDeployment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State of Deployment</FormLabel>
                            <FormControl>
                              <select {...field} className={selectClass}>
                                <option value="">Select state</option>
                                {NIGERIAN_STATES.map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </SectionCard>
                </div>

                {/* Bottom row: Academic full width */}
                <SectionCard
                  icon={<GraduationCap className="w-4 h-4" />}
                  title="Academic Information"
                  description="Your educational background"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="University / Polytechnic name" />
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
                          <FormLabel>Graduation Year</FormLabel>
                          <FormControl><Input {...field} placeholder="e.g. 2023" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionCard>

                <Button type="submit" disabled={isExecuting} className="w-full h-11 mt-4">
                  {isExecuting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
