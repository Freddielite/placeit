// "use client";
// import { inviteCompany } from "@/actions";
// import Input from "@/components/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useAction } from "next-safe-action/hooks";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import {
//   createCompanySchema,
//   type CreateCompanyInput,
// } from "@/schemas/company.schema";
// import * as z from "zod";

// export default function AddCompany() {
//   const form = useForm<CreateCompanyInput>({
//     resolver: zodResolver(createCompanySchema),
//     mode: "all",
//     defaultValues: {
//       name: "",
//       email: "",
//       industry: "",
//       phone: "",
//       website: "",
//     },
//   });

//   const isSubmitting = form.formState.isSubmitting;
//   const isValid = form.formState.isValid;

//   const { execute, isExecuting } = useAction(inviteCompany, {
//     onSuccess: (data) => {
//       toast.success("Company invite sent successfully");
//       form.reset();
//       console.log("Company invite sent successfully");
//     },
//     onError: (error) => {
//       toast.error("Failed to send company invite");
//       console.error("Error sending company invite;", error);
//     },
//   });

//   return (
//     <div className="w-full max-w-xl px-6 py-6">
//       {/* Header */}
//       <div className="mb-5">
//         <h1 className="text-xl font-semibold">Invite company</h1>
//         <p className="text-sm text-muted-foreground">
//           Create a company profile and send an activation invite to the contact
//           email.
//         </p>
//       </div>

//       {/* Card */}
//       <div className="rounded-xl border bg-white shadow-sm">
//         <div className="p-5">
//           <Form {...form}>
//             <form
//               className="flex flex-col gap-4"
//               onSubmit={form.handleSubmit((values) => execute(values))}
//               id="add-company-form"
//             >
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Company name</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="Acme Technologies Ltd" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Company email</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="email"
//                         placeholder="hr@acme.com"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="industry"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Industry</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="Fintech / Software / FMCG"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone (optional)</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder="+234 801 234 5678" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="website"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Website (optional)</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="https://acme.com" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </form>
//           </Form>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-5 py-4">
//           <p className="text-xs text-muted-foreground">
//             The invite link will be sent to the company email to set a password
//             and activate.
//           </p>

//           <div className="flex items-center gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => form.reset()}
//               disabled={isSubmitting}
//             >
//               Clear
//             </Button>

//             <Button
//               type="submit"
//               form="add-company-form"
//               disabled={!isValid || isExecuting}
//             >
//               {isExecuting ? "Creating..." : "Create & send invite"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { inviteCompany } from "@/actions";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // ← Add this if you want navigation
import {
  createCompanySchema,
  type CreateCompanyInput,
} from "@/schemas/company.schema";

export default function AddCompany() {
  const router = useRouter(); // ← Add this if you want navigation

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      phone: "",
      website: "",
    },
  });

  const { execute, isExecuting } = useAction(inviteCompany, {
    onSuccess: (data) => {
      toast.success("Company invite sent successfully");
      form.reset();

      // OPTIONAL: Navigate back to companies list after success
      // Uncomment if you want to redirect after creating:
      // setTimeout(() => {
      //   router.push("/admin/company");
      // }, 1500);
    },
    onError: (error) => {
      toast.error("Failed to send company invite");
    },
  });

  return (
    <div className="w-full max-w-xl px-6 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold">Invite company</h1>
        <p className="text-sm text-muted-foreground">
          Create a company profile and send an activation invite to the contact
          email.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-5">
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit((values) => execute(values))}
              id="add-company-form"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Acme Technologies Ltd" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="hr@acme.com"
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
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Fintech / Software / FMCG"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+234 801 234 5678" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://acme.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-5 py-4">
          <p className="text-xs text-muted-foreground">
            The invite link will be sent to the company email to set a password
            and activate.
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isExecuting}
            >
              Clear
            </Button>

            <Button
              type="submit"
              form="add-company-form"
              disabled={isExecuting}
            >
              {isExecuting ? "Creating..." : "Create & send invite"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
