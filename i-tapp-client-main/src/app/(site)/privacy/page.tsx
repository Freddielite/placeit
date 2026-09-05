import { Wrapper } from "@/components/wrapper";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the PlaceIT privacy policy to understand how we collect, use, and protect your information.",
};

export default function Privacy() {
  return (
    <Wrapper className="sm:py-10 py-10 text-sm lg:text-base flex flex-col gap-3">
      <div>
        <h2 className="text-md font-bold">Introduction</h2>
        <p>
          We are committed to protecting the privacy and personal information of
          users of i-Tapp, a platform designed to facilitate SIWES applications
          and recruitment processes in Nigeria. This Privacy Policy outlines how
          we collect, use, store, and protect your personal data.{" "}
        </p>
      </div>
      <div>
        <h2 className="text-md font-bold">Information We Collect</h2>
        We may collect the following types of information:
        <ul className="space-y-2">
          <li>
            <strong> Personal Information</strong>: Full name, email address,
            phone number, date of birth, gender, and address.
          </li>
          <li>
            <strong> Educational Information</strong>: Institution name, course
            of study, matriculation number, and SIWES-related documents (e.g.,
            application letters, logbooks).
          </li>
          <li>
            <strong>Employment-Related Information</strong>: CVs, cover letters,
            certifications, and job preferences (for recruitment purposes).{" "}
          </li>
          <li>
            <strong>Technical Data</strong>: IP address, browser type, device
            information, and usage data collected via cookies or similar
            technologies.
          </li>
          <li>
            <strong> Other Submissions</strong>: Any additional information or
            files (e.g., PDFs, images) you upload during the application
            process.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-md font-bold flex flex-col gap-y-4">
          {" "}
          How We Collect Your Information
        </h2>
        <p>
          Directly from you when you register, submit applications, or interact
          with the website.
        </p>
        <p>
          Automatically through cookies, analytics tools, or server logs as you
          browse the site.
        </p>
        <p>
          From third parties, such as educational institutions or employers,
          where permitted by law.
        </p>
      </div>

      <div>
        <h2 className=" font-bold text-md"> Purpose of Data Collection</h2>
        <ul className="space-y-2">
          <li>
            We use your information to: Process SIWES applications and
            placements.
          </li>
          <li>
            Facilitate recruitment opportunities between students and employers.
          </li>

          <li>
            Verify your identity and eligibility for SIWES or job opportunities.
          </li>
          <li>
            Communicate updates, notifications, or feedback regarding your
            application.
          </li>
          <li> Improve our services and website functionality.</li>
          <li> Comply with legal obligations under Nigerian law.</li>
        </ul>
      </div>
      <div>
        <h2 className=" font-bold text-md"> Data Sharing and Disclosure</h2>
        <p>Your personal information may be shared with:</p>
        <ul className="space-y-2">
          <li>
            SIWES coordinators, educational institutions, or employers for
            placement and recruitment purposes.
          </li>
          <li>
            Service providers (e.g., cloud storage, payment processors) acting
            on our behalf.
          </li>
          <li>
            Regulatory authorities when required by law (e.g., NDPC – Nigeria
            Data Protection Commission).
          </li>
          <li>
            We will not sell or lease your personal data to third parties for
            marketing purposes without your explicit consent.
          </li>
        </ul>
      </div>
      <div>
        <h2 className=" font-bold text-md"> Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures (e.g.,
          encryption, access controls) to protect your data from unauthorized
          access, loss, or misuse.
        </p>
        <p>
          However, no system is entirely secure, and we cannot guarantee
          absolute security of data transmitted online.
        </p>
      </div>
      <div>
        <h2 className=" font-bold text-md"> Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to
          fulfill the purposes outlined (e.g., duration of your SIWES program or
          recruitment process) or as required by law.
        </p>
        <p>
          Inactive accounts or data no longer needed will be securely deleted or
          anonymized after a year, unless otherwise mandated.
        </p>
      </div>
      <div>
        <h2 className=" font-bold text-md"> Your Rights</h2>
        <ul className="space-y-2">
          <li>
            Under the NDPR, you have the right to: Access the personal data we
            hold about you.
          </li>
          <li>
            Inactive accounts or data no longer needed will be securely deleted
            or anonymized after a year, unless otherwise mandated.
          </li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your data (subject to legal exceptions).</li>
          <li>Withdraw consent for data processing where applicable. </li>
          <li>
            Lodge a complaint with the Nigeria Data Protection Commission if you
            believe your privacy rights have been violated.
          </li>
          <li>To exercise these rights, contact us at support@getplaceit.com </li>
        </ul>
      </div>
      <div>
        <h2 className=" font-bold text-md">
          Cookies and Tracking Technologies
        </h2>
        <p>
          We use cookies to enhance user experience, analyze traffic, and
          personalize content.
        </p>
        <p>
          You can manage cookie preferences through your browser settings,
          though disabling them may limit website functionality.{" "}
        </p>
        <p>
          Third-Party Links Our website may contain links to external sites
          (e.g., partner institutions, employers). We are not responsible for
          the privacy practices or content of these third-party sites.
        </p>
      </div>
      <div>
        <h2 className=" font-bold text-md">International Data Transfers</h2>
        <p>
          If your data is transferred outside Nigeria (e.g., to cloud servers),
          we ensure it is protected in accordance with NDPR requirements and
          only transferred to countries or entities with adequate data
          protection standards.
        </p>
      </div>

      <div>
        <h2 className=" font-bold text-md">Children’s Privacy</h2>
        <p>
          Our services are not intended for individuals under 18 years of age.
          We do not knowingly collect data from minors without parental consent.
          We may update this policy from time to time. Contact Us For questions,
          complaints, or requests regarding your privacy, please reach out to:
          Email: support@getplaceit.com Address: Center for entrepreneurship
          development in the Federal University of Petroleum Resources.
        </p>
      </div>

      <div>
        <h2 className=" font-bold text-md"> Changes to This Privacy Policy</h2>
        <p>
          Any changes will be posted on this page with an updated effective
          date. Continued use of the website after changes implies acceptance of
          the revised terms.
        </p>
      </div>
      <div>
        <h2 className=" font-bold text-md"> Contact Us</h2>
        <p>
          For questions, complaints, or requests regarding your privacy, please
          reach out to: Email: support@getplaceit.com
        </p>
        <p>
          Address: Center for entrepreneurship development in the Federal
          University of Petroleum Resources.
        </p>
      </div>
    </Wrapper>
  );
}
