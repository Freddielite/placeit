import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "next-safe-action/hooks";
import { ButtonWithLoader } from "@/components/button-with-loader";
import { toast } from "react-toastify";
import { db } from "../../../../../../db";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/input";
import { verifyStudentIdentity } from "@/actions";
import { verifyStudentIdentitySchema } from "@/schemas";

export function SchoolInfo({
  formIndex,
  setForm,
  setStudentData,
}: {
  formIndex: number;
  setForm: Dispatch<SetStateAction<number>>;
  setStudentData: Dispatch<SetStateAction<any>>;
}) {
  const form = useForm({
    mode: "all",
    resolver: zodResolver(verifyStudentIdentitySchema),
    defaultValues: {
      school: "",
      matNo: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, errors },
    getValues,
  } = form;

  const { execute, hasErrored, result, isExecuting } = useAction(
    verifyStudentIdentity,
    {
      onSuccess: (data) => {
        toast.success("Student info verified!");
        setTimeout(() => {
          setStudentData(data);
          setForm((prev) => prev + 1);
        }, 1000);
      },
      onError(error) {
        toast.error(error?.error?.serverError ?? "Student data not found. Check your school and matric number.");
      },
    },
  );

  const onSubmit = (values: any) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        {hasErrored && (
          <span className="text-danger font-semibold">
            {result?.serverError}
          </span>
        )}

        <div className="flex flex-col gap-5">
          {/* SCHOOL SELECT */}
          <FormField
            control={control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of school*</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border border-gray-300 outline-none shadow-none focus:ring-1 focus:ring-inset-1 focus:ring-primary/20  ">
                      <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent>
                      {db.schools.map((school) => (
                        <SelectItem key={school.name} value={school.name}>
                          {school.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MATRIC NUMBER INPUT */}
          <FormField
            control={control}
            name="matNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matriculation Number*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Matriculation Number" {...field} />
                </FormControl>
                <FormDescription>
                  This is your unique student ID assigned by your institution.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <ButtonWithLoader
            type="submit"
            isPending={isExecuting}
            disabled={!isValid || !isDirty || isExecuting}
            className="w-full"
          >
            Continue...
          </ButtonWithLoader>
        </div>
      </form>
    </Form>
  );
}
