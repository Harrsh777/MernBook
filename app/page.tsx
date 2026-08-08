"use client";

import Desktop from "@/components/Desktop";
import { GenieProvider } from "@/lib/useGenie";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Harsh Srivastava",
    jobTitle: "Full Stack & AI Developer",
    description:
      "AWS Certified Solutions Architect, VIT'27 CSE, 150-day LeetCode streak, 6+ hackathon wins. Creator of ClinicOS, MoxSend, and EduCore ERP.",
    url: "https://www.harshsrivastava.in/",
    email: "hello@harshsrivastava.in",
    sameAs: [
      "https://github.com/Harrsh777",
      "https://www.linkedin.com/in/harrshh",
      "https://twitter.com/harrshh",
    ],
  };

  return (
    <main className="w-full h-full min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GenieProvider>
        <Desktop />
      </GenieProvider>
    </main>
  );
}
