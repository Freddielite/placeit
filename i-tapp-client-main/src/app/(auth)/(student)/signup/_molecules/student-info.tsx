import Input from "@/components/input";
import { FormField } from "@/components/ui/form-field";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface StudentData {
  data: {
    data: {
      firstName: string;
      lastName: string;
      course: string;
      matriculation: string;
      phone: string;
    };
  };
}

export function StudentInfo({ studentData }: { studentData: StudentData }) {
  // Extract the nested data
  const { firstName, lastName, course, matriculation, phone } =
    studentData?.data?.data;

  // Split the name into first and last name

  const fields = [
    { label: "First name", value: firstName },
    { label: "Last name", value: lastName },
    { label: "Alternative Email", value: "" },
    { label: "Matriculation Number", value: matriculation },
    { label: "Course", value: course },
    { label: "Department", value: "" },
    { label: "Faculty", value: "" },
    { label: "Phone Number", value: phone },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        {fields.map((field, index) => (
          <FormField key={index}>
            <Label className="font-regular">{field.label}</Label>
            <Input
              type={
                field.label.toLowerCase().includes("email") ? "email" : "text"
              }
              value={field.value}
              disabled
            />
          </FormField>
        ))}
      </div>
      <Link href="/signin" className="text-primary">
        Proceed to Sign In
      </Link>
    </div>
  );
}
