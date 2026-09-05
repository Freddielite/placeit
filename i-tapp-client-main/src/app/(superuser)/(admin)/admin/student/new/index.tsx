"use client";

import { createStudent } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  school: z.string().min(1, "School is required"),
  courseOfStudy: z.string().min(1, "Course of study is required"),
  matriculationNumber: z.string().min(1, "Matriculation number is required"),
  preferredLocation: z.string().min(1, "Preferred IT location is required"),
});

type CreateStudentInput = z.infer<typeof createStudentSchema>;

export default function AddStudent() {
  const form = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    mode: "all",
    defaultValues: {
      courseOfStudy: "",
      email: "",
      firstName: "",
      lastName: "",
      school: "",
      matriculationNumber: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const { execute, isExecuting, hasErrored, result } = useAction(
    createStudent,
    {
      onSuccess: (data) => {
        toast.success("Student account created successfully");
        form.reset();
      },
      onError: (error) => {
        toast.error("Failed to create student account");
      },
    },
  );

  return (
    <div className="w-full max-w-xl px-6 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold">Add student</h1>
        <p className="text-sm text-muted-foreground">
          Create a student profile. An invite can be sent after creation.
        </p>
        {hasErrored && (
          <p className="text-red-500 mt-4 text-sm font-medium mb-2 text-left">
            {result?.serverError ?? "Something went wrong. Please try again."}
          </p>
        )}
      </div>

      {/* Card */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-5">
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit((values) => execute(values))}
              id="create-student-form"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="samueladebayo@email.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Samuel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Adebayo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Kaduna State University"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matriculationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matric number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="KASU/CSC/21/0456" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="courseOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course of study</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Computer Science" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Ensure email is correct — invites are sent to this address.
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Clear
            </Button>

            <Button
              type="submit"
              disabled={!isValid || isExecuting}
              form="create-student-form"
            >
              {isExecuting ? "Creating..." : "Create student"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
