const service1 = require("@/assets/icons/services-1.svg");
const service2 = require("@/assets/icons/services-2.svg");
const service3 = require("@/assets/icons/services-3.svg");
const service4 = require("@/assets/icons/services-4.svg");

export const data: {
  services: { icon: any; title: string; description: string }[];
  how_it_works: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
} = {
  services: [
    {
      icon: service1,
      title: "Tailored Internship Experience",
      description:
        "Discover a tailored SIWES application, and unlock a personalized experience.",
    },
    {
      icon: service2,
      title: "Track Applications",
      description: "Effortlessly track and manage all SIWES applications.",
    },
    {
      icon: service3,
      title: "Maximize Your Reach",
      description:
        "Apply to various companies at a go, one profile, multiple company application",
    },
    {
      icon: service4,
      title: "Verified Companies",
      description:
        "Connect with companies that provide reliable, secure, and valuable student experince, essential for a successful industrial experience.",
    },
  ],
  how_it_works: [
    {
      title: "Get Started and get verified",
      description:
        "Click on the “Get started” button. Complete the onboarding process",
    },
    {
      title: "Complete your profile",
      description:
        "Your profile is the gateway to making meaningful connections. Create a  profile showcasing your field of study.",
    },
    {
      title: "Connect and thrive",
      description:
        "Apply to various comapnies of your choice, you are one-tapp away from your desired IT experience.",
    },
  ],
  faqs: [
    {
      question: "What is i-Tapp?",
      answer:
        "I-Tapp is a web-based platform where students can find, apply, and get industrial training placement in companies all from the comfort of their homes without having to move from one location to another.",
    },
    {
      question: "How does iTapp work?",
      answer:
        "I-Tapp as a platform allows students to register, search, find and apply to desired company for industrial training attachment using their mobile, tablet or laptop. It also allows companies to accept or approve applications and also managed applicants without going through rigorous process",
    },
    {
      question: "Is iTapp free to use?",
      answer:
        "I-Tapp uses a freemium based service were you're allowed to apply to a limited number of companies for free and when then limit is exhausted, you apply for an upgrade with a small fee after which you'll have access to all the companies on our database",
    },
    {
      question: "How can I contact I-TAPP support?",
      answer:
        "You can contact I-Tapp support using the email and WhatsApp phone number below support@getplaceit.com, +2348081047072",
    },
  ],
};
