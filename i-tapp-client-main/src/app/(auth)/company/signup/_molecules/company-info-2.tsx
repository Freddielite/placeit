// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   companySignupSchema,
//   fullCompanySignupSchema,
// } from "@/lib/validations/auth";
// import { ButtonWithLoader } from "@/components/button-with-loader";
// import { useAction } from "next-safe-action/hooks";
// import { toast } from "react-toastify";

// import SignupSuccessModal from "./success";
// import { z } from "zod";
// import { companySignup } from "@/actions/auth";
// import Input from "@/components/input";

// type CompanySignupSchema = z.infer<typeof companySignupSchema>;
// type FullFormData = z.infer<typeof fullCompanySignupSchema>;

// interface CompanyInfo2Props {
//   formData: Partial<FullFormData>;
// }

// export function CompanyInfo2({ formData }: CompanyInfo2Props) {
//   const [isSignupSuccess, setSignupSuccess] = useState(false);
//   const form = useForm<CompanySignupSchema>({
//     mode: "onChange",
//     resolver: zodResolver(companySignupSchema),
//     defaultValues: {
//       rc_number: "",
//       year_founded: "",
//       student_capacity: "",
//       it_duration: "",
//       // companyId: "",
//     },
//   });

//   const { execute, isExecuting, result, hasErrored } = useAction(
//     companySignup,
//     {
//       onSuccess(data) {
//         if (data) {
//           toast.success("Company signup successful!");
//           setSignupSuccess(true);
//         }
//       },
//       onError(error) {
//         toast.error(
//           "Error signing up, please check your credentials and try again.",
//         );
//         console.error(error);
//       },
//     },
//   );
//   const handleSignup = (data: CompanySignupSchema) => {
//     // e.preventDefault();

//     const payload: FullFormData = {
//       ...formData,
//       ...data,
//       company_name: formData.company_name || "",
//       email: formData.email || "",
//       address: formData.address || "",
//       password: formData.password || "",
//     };
//     execute(payload);
//   };

//   return (
//     <>
//       {/* {hasErrored && (
//         <span className="text-danger font-semi-bold ">
//           {result.serverError?.message}
//         </span>
//       )} */}
//       <Form {...form}>
//         <form
//           className="flex flex-col gap-3"
//           onSubmit={form.handleSubmit(handleSignup)}
//         >
//           <FormField
//             control={form.control}
//             name="rc_number"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>RC number</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder="Enter RC number e.g 123456" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="year_founded"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Year Founded</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder="Enter year founded e.g 1988" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="student_capacity"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Student Capacity</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="Enter student capacity e.g 300"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="it_duration"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>IT Duration</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder="Enter duration e.g 6" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* <FormField
//           control={form.control}
//           name="companyId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Company ID</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         /> */}
//           <div className="m-auto my-2">
//             <ButtonWithLoader
//               // disabled={!isDirty || !isValid}
//               type="submit"
//               isPending={isExecuting}
//             >
//               Sign up
//             </ButtonWithLoader>
//           </div>
//         </form>
//         {isSignupSuccess && <SignupSuccessModal />}
//       </Form>
//     </>
//   );
// }
