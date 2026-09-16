import { Wrapper } from "@/components/wrapper";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Your Account",
  description:
    "How to request deletion of your PlaceIT account and data, what gets removed, and what to expect.",
};

const faqs = [
  {
    q: "How do I request account deletion?",
    a: (
      <>
        Send an email to <strong>support@getplaceit.com</strong> from the
        email address linked to your account, with the subject line
        &ldquo;Account Deletion Request.&rdquo; Let us know it&apos;s your
        account you want closed, and our team will take it from there. We ask
        that the request come from your registered email so we can confirm
        it&apos;s really you asking.
      </>
    ),
  },
  {
    q: "How long does it take?",
    a: "We process deletion requests within 24 to 48 hours of receiving your email. You'll get a confirmation once it's done.",
  },
  {
    q: "What happens to my information?",
    a: "Once your account is deleted, we don't retain any of your information. Your profile, CV, application history, listings, and any other data tied to your account are removed from PlaceIT permanently.",
  },
  {
    q: "Is this reversible?",
    a: "No. Once deletion is processed, there's no way for us to recover your account or the information in it, so make sure it's what you want before you send the request. If you're not sure, reach out to us first and we're happy to talk it through.",
  },
  {
    q: "What happens to applications I've already sent, or opportunities I'm mid-process on?",
    a: "Those go away along with everything else in your account. If a company you applied to already downloaded your CV or reached out to you directly outside PlaceIT, that's between you and them — we don't control information once it's left our platform.",
  },
  {
    q: "I'm a company. What happens to my listings?",
    a: "Same as any other account. Once deletion is processed, your listings come down and any applicant data tied to your company profile is removed from our systems. If you're in the middle of reviewing candidates for a role, it's worth wrapping that up before requesting deletion.",
  },
  {
    q: "Can someone else request deletion on my behalf?",
    a: "Not through email alone. We need the request to come from the email address on the account, so we know it's genuinely you. If that's not possible for some reason, contact us and we'll figure out a way to verify you.",
  },
  {
    q: "I changed my mind after sending the request",
    a: (
      <>
        Email us right away at <strong>support@getplaceit.com</strong>. If we
        haven&apos;t processed it yet, we can cancel the request. Once
        it&apos;s done, though, there&apos;s no undoing it.
      </>
    ),
  },
];

export default function DeleteAccount() {
  return (
    <Wrapper className="sm:py-10 py-10 text-sm lg:text-base flex flex-col gap-3">
      <div>
        <h1 className="text-lg font-bold mb-1">
          How to delete your PlaceIT account
        </h1>
        <p>
          Whether you&apos;re a student, an NYSC Corps Member, or a company,
          you can close your PlaceIT account at any time. Here&apos;s how it
          works and what to expect.
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-muted/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">
            To request deletion, email
          </p>
          <a
            href="mailto:support@getplaceit.com?subject=Account%20Deletion%20Request"
            className="font-semibold text-primary"
          >
            support@getplaceit.com
          </a>
        </div>
        <span className="text-xs text-muted-foreground border rounded-full px-3 py-1 w-fit">
          Processed in 24&ndash;48 hours
        </span>
      </div>

      {faqs.map((item) => (
        <div key={item.q}>
          <h2 className="text-md font-bold">{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
    </Wrapper>
  );
}
