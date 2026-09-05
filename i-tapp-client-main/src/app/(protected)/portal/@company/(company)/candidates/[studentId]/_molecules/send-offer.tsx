"use client";
import { useState } from "react";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OfferFormData, offerSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadThing } from "@/components/file-upload-thing";

interface OfferModalProps {
  onClose: () => void;
  offerFormOpen: boolean;
  onCreate: (data: OfferFormData) => void; // <-- accept OfferFormData
}

export default function OfferModal({
  onClose,
  offerFormOpen,
  onCreate,
}: OfferModalProps) {
  const form = useForm({
    resolver: zodResolver(offerSchema),
    mode: "onChange",
  });

  return (
    <Modal open={offerFormOpen} onClose={onClose}>
      <div className="rounded-2xl mx-auto shadow-lg bg-white px-6 py-5 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Send Placement Offer
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreate)}
            className="flex flex-col gap-4"
          >
            {/* Dates */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs font-black">
                      Start Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs font-black">
                      End Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stipend */}

            <FormField
              control={form.control}
              name="stipend"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs font-black">
                    Stipend{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="e.g. ₦150,000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offerLetter"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs font-black">
                    Upload Offer Letter{" "}
                  </FormLabel>
                  <FormControl>
                    <FileUploadThing
                      title="Upload Offer Letter"
                      value={field.value} // current value (url/key/etc)
                      onChange={field.onChange} // set value into RHF
                      onBlur={field.onBlur}
                      description="Max 10MB. PDF/JPG/PNG/WEBP."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              className="w-full text-white font-medium mt-2 py-3"
              type="submit"
            >
              Send Offer
            </Button>

            {/* <FileUpload /> */}
          </form>
        </Form>
      </div>
    </Modal>
  );
}
