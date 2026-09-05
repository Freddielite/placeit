"use client";

import { useEffect, useState } from "react";

const facts = [
  "Over 60% of companies hire interns to evaluate potential full-time employees.",
  "Students with real project experience are 3x more likely to be hired.",
  "Most companies spend less than 30 seconds reviewing a student application.",
  "Clear role descriptions increase student application quality by over 40%.",
  "Early engagement with students improves long-term retention.",
  "Soft skills are among the top 3 hiring criteria for student placements.",
  "Structured internship programs lead to better performance outcomes.",
  "Companies that provide mentorship attract higher-quality applicants.",
  "Students prefer companies with clear learning objectives.",
  "Faster response times significantly improve applicant trust.",
];

export default function Facts() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 6000); // 60 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <blockquote className="border-primary mt-40 bg-gray-200 py-2 px-4 text-sm rounded-xl h-20 text-[#333] italic flex items-center">
      “{facts[factIndex]}”
    </blockquote>
  );
}
