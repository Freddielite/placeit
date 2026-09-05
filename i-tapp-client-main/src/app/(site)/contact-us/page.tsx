import { Metadata } from "next";
import { ContactUs } from "./_molecules";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PlaceIT (ITAPP) for support, partnerships, or inquiries about SIWES and industrial training placements in Nigeria.",
};

export default function ContactUsPage() {
  return <ContactUs />;
}
