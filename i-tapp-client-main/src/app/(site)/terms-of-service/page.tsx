import { Wrapper } from "@/components/wrapper";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms of service governing the use of the PlaceIT platform and services.",
};

export default function page() {
  return (
    <Wrapper className="py-8 sm:py-10 text-sm lg:text-base ">
      <h2 className="font-bold">Terms of Service for i-Tapp </h2>
      <p className="text-gray-400 text-sm"> Last Updated: March 10, 2025</p>
      <p className="mt-3">
        Welcome to i-Tapp, a platform designed to facilitate applications and
        recruitment for the Student Industrial Work Experience Scheme (SIWES) in
        Nigeria. By accessing or using our website, you agree to be bound by the
        following Terms of Service (&quot;Terms&quot;). Please read them
        carefully. If you do not agree with these Terms, you may not use our
        services
      </p>
      <ol className=" list-decimal flex flex-col gap-3 my-4 px-4">
        <li>
          Acceptance of Terms: By creating an account, submitting an
          application, or otherwise using i-Tapp you agree to these Terms and
          any updates posted on this page. We reserve the right to modify these
          Terms at any time. Continued use of the website after changes
          constitutes acceptance of the updated Terms.
        </li>
        <li>
          Eligibility: Users must be at least 18 years old or have legal consent
          from a guardian to use this platform. You must be a student enrolled
          in a Nigerian tertiary institution participating in the SIWES program,
          an employer registered in Nigeria, or an authorized SIWES coordinator
          to use specific features of the platform. Providing false information
          during registration or application may result in account suspension or
          termination.
        </li>
        <li>
          Account Registration and Security: You are responsible for providing
          accurate and complete information during registration. You must
          maintain the confidentiality of your account login credentials (e.g.,
          username and password). You agree to notify us immediately of any
          unauthorized use of your account via support@getplaceit.com. <br />
          i-Tapp is not liable for losses resulting from unauthorized access due
          to your failure to secure your account.
        </li>
        <li>
          Use of the Platform: The platform may only be used for lawful purposes
          related to SIWES applications, recruitment, and coordination. You
          agree not to: Upload or share false, offensive, or illegal content.
          Use automated systems (e.g., bots) to access or scrape the website.
          Attempt to hack, disrupt, or overload the platform’s systems.
          Impersonate any person or entity.
        </li>
        <li>
          Application and Recruitment Process: Students may apply for SIWES
          placements through the platform by submitting required documents
          (e.g., CVs, letters, forms). Employers may post opportunities, review
          applications, and select candidates based on their discretion. i-Tapp
          does not guarantee placement or employment and is not responsible for
          decisions made by employers or SIWES coordinators. All uploaded
          documents must be authentic. Submission of forged documents may lead
          to account termination and legal action.
        </li>
        <li>
          Privacy and Data Protection: Your personal information will be
          collected, stored, and processed in accordance with our Privacy Policy
          and the Nigerian Data Protection Regulation (NDPR). We may share your
          data with employers, SIWES coordinators, or institutions for the
          purpose of facilitating placements, with your consent where required.
          You have the right to request access, correction, or deletion of your
          data by contacting support@getplaceit.com
        </li>
        <li>
          Intellectual Property: All content on i-Tapp, including text, logos,
          and design, is the property of i-Tapp or its licensors and is
          protected by copyright laws. Users retain ownership of content they
          upload (e.g., CVs, cover letters) but grant i-Tapp a non-exclusive,
          royalty-free license to use, store, and display such content for the
          purpose of providing services.
        </li>
        <li>
          Third-Party Links and Content: The platform may contain links to
          external websites (e.g., employer sites). i-Tapp is not responsible
          for the content, accuracy, or practices of third-party sites.
          Interaction with third parties through the platform is at your own
          risk.
        </li>
        <li>
          Termination of Access: We reserve the right to suspend or terminate
          your account at our discretion, including for violations of these
          Terms, fraudulent activity, or misuse of the platform. You may
          terminate your account at any time by contacting support@getplaceit.com.
        </li>
        <li>
          Limitation of Liability: i-Tapp provides the platform &quot;as
          is&quot; and does not guarantee uninterrupted or error-free service.
          We are not liable for any damages, losses, or disputes arising from
          the use of the platform, including but not limited to placement
          rejections or employer-student conflicts. Our liability is limited to
          the fullest extent permitted by Nigerian law.
        </li>
        <li>
          Indemnity: You agree to indemnify and hold i-Tapp, its affiliates, and
          employees harmless from any claims, damages, or losses arising from
          your use of the platform or violation of these Terms.
        </li>
        <li>
          Governing Law: These Terms are governed by the laws of the Federal
          Republic of Nigeria. Any disputes arising from the use of i-Tapp will
          be resolved in a competent court in Nigeria
        </li>
      </ol>
      Contact Information For questions, complaints, or support, please contact
      us at support@getplaceit.com or +2348081047072
    </Wrapper>
  );
}
