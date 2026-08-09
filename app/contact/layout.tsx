import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Hire Harsh Srivastava | Enterprise Software & Consultations",
  description: "Get in touch with Harsh Srivastava — Serious Software Developer and Entrepreneur for custom enterprise software development, SaaS systems, AI integrations, or 1-on-1 consultations.",
  keywords: "Contact Harsh Srivastava, Hire Harsh Srivastava, Harsh Srivastava developer, Harsh Srivastava enterprise client software, SaaS consultant",
  alternates: {
    canonical: "https://www.harshsrivastava.in/contact",
  },
  openGraph: {
    title: "Contact & Hire Harsh Srivastava | Enterprise Software & Consultations",
    description: "Connect with Harsh Srivastava for custom software engineering and enterprise consulting.",
    url: "https://www.harshsrivastava.in/contact",
    siteName: "Harsh Srivastava",
    images: [{ url: "/profile.jpg", width: 1200, height: 630, alt: "Contact Harsh Srivastava" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
