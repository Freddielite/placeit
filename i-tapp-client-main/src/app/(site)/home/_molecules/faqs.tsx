"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePersona } from "@/app/(site)/_context/persona";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

const faqData = {
  default: [
    { question: "What is PlaceIT?", answer: "PlaceIT is Nigeria's placement marketplace connecting SIWES students and NYSC corps members to verified companies for IT and PPA placements — all from one platform." },
    { question: "Who can use PlaceIT?", answer: "Students looking for SIWES / IT placements, NYSC corps members seeking PPA opportunities, and companies wanting to list placement slots for either or both groups." },
    { question: "Is PlaceIT free to use?", answer: "PlaceIT uses a freemium model. Basic applications are free. BulkApply and cold-email outreach are available as premium add-ons." },
    { question: "Are companies on PlaceIT verified?", answer: "Yes. Every company is verified with CAC registration before they can post opportunities. Verified companies display a badge on their profile and listings." },
    { question: "How can I contact PlaceIT support?", answer: "Reach our support team at support@getplaceit.com. We respond to every message personally and aim to get back to you within 24 hours." },
  ],
  student: [
    { question: "What is SIWES and how does PlaceIT help?", answer: "SIWES (Student Industrial Work Experience Scheme) requires students in technical courses to undergo industrial training. PlaceIT helps you find, apply for, and track SIWES placements at verified companies — without cold emails or walk-ins." },
    { question: "How do I apply for a SIWES placement?", answer: "Create an account, build your profile with your field of study and skills, then browse available SIWES opportunities and apply directly. Track your application status in real time from your dashboard." },
    { question: "Is PlaceIT free for students?", answer: "Yes. Students can apply to placements for free. A freemium limit applies — after a certain number of applications, a small fee unlocks unlimited access to our full company database." },
    { question: "How do I know a company is legitimate?", answer: "Every company on PlaceIT goes through CAC verification before listing. Verified companies display a badge on their profile and all their listings." },
    { question: "Can I track my applications?", answer: "Yes. Your dashboard shows every application you've submitted, with real-time status updates — from submitted to accepted or declined." },
  ],
  corps: [
    { question: "What is a PPA and how does PlaceIT help?", answer: "A PPA (Place of Primary Attachment) is the organization where a corps member serves during their NYSC service year. PlaceIT helps you find verified PPA opportunities matched to your posted state — so you don't have to rely on WhatsApp groups or cold emails." },
    { question: "How does state-code matching work?", answer: "When you sign up, enter your NYSC state code (e.g. LA/24B/1234). We parse your state and show only PPA listings available in that state — so you never see irrelevant opportunities." },
    { question: "What is BulkApply?", answer: "BulkApply is a premium feature where you upload your resume and set your skills. We then cold-email matching companies and PPA hosts on your behalf — giving you a much better chance of securing a PPA, even from within camp." },
    { question: "Can I switch my current PPA using PlaceIT?", answer: "Yes. If you're already at a PPA and want to switch, simply browse new listings and apply fresh. Your current PPA status won't block you from applying elsewhere." },
    { question: "What is camp mode?", answer: "Camp mode is a filter you enable when you're in your 3-week orientation camp. It shows only immediately-available PPA listings — companies actively accepting new corps members right now." },
  ],
  company: [
    { question: "Who can list opportunities on PlaceIT?", answer: "Any CAC-registered company can sign up and list opportunities. The PlaceIT admin team can also list on your behalf — just reach out if you'd prefer a managed service." },
    { question: "Can I list both SIWES and NYSC PPA slots?", answer: "Yes. When creating a listing, you can designate it as SIWES, PPA, or both. This lets you reach students and corps members from a single opportunity post." },
    { question: "How do I verify my company?", answer: "During signup, you'll be asked to provide your CAC registration number and basic company details. Our admin team reviews and verifies within 24–48 hours. Verified companies receive a badge on all listings." },
    { question: "Is it free to list opportunities?", answer: "Yes. Listing opportunities on PlaceIT is free. Premium features like promoted listings and admin-managed listings are available for companies with higher volume needs." },
    { question: "What happens after I list an opportunity?", answer: "Your listing goes live immediately after verification. Students and corps members can discover and apply directly. You'll receive applications on your dashboard and can shortlist or accept candidates from there." },
  ],
};

const ctaLinks = {
  default: { href: "/welcome", label: "Get started free" },
  student: { href: "/welcome", label: "Find my placement" },
  corps: { href: "/corps/signup", label: "Find my PPA" },
  company: { href: "/company/signup", label: "List an opportunity" },
};

export function Faqs() {
  const { persona } = usePersona();
  const key = persona ?? "default";
  const faqs = faqData[key];
  const cta = ctaLinks[key];

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24 lg:py-28">

        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight tracking-tight">
            Questions? <span className="text-primary">Answered.</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base leading-relaxed">
            Everything you need to know before you sign up. Still not sure?{" "}
            <a href="mailto:support@getplaceit.com" className="text-primary hover:underline font-semibold">
              Email us
            </a>
            {" "}— we reply fast.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/40 data-[state=open]:bg-white data-[state=open]:border-primary/20 data-[state=open]:shadow-[0_4px_24px_rgba(71,125,192,0.08)] transition-all duration-200"
              >
                <AccordionTrigger className="px-6 py-5 text-sm sm:text-base font-semibold text-gray-900 hover:no-underline text-left hover:text-primary transition-colors data-[state=open]:text-primary [&>svg]:text-gray-400 [&>svg]:data-[state=open]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10 px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Decorative circle */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/8 pointer-events-none" />
          <div className="absolute -bottom-8 right-24 w-24 h-24 rounded-full bg-primary/5 pointer-events-none" />

          <div className="relative flex-1">
            <p className="text-xl sm:text-2xl font-black text-gray-950 leading-snug">
              Still have questions?<br />
              <span className="text-primary">Let&apos;s talk.</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Or just dive in — it&apos;s free to get started, no credit card needed.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm shadow-primary/30 justify-center"
            >
              {cta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:support@getplaceit.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-primary/30 hover:text-primary transition-colors justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Contact support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
