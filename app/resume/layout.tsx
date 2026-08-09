import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Resume & Credentials | Harsh Srivastava",
  description: "Official interactive resume of Harsh Srivastava — Serious Software Developer, Entrepreneur (7+ Projects Sold), AWS Certified Solutions Architect, GSoC '24 Participant, 5x Hackathon Winner.",
  keywords: "Harsh Srivastava resume, Harsh Srivastava CV, Harsh Srivastava developer resume, AWS Certified Solutions Architect, Full Stack Developer, MERN Stack",
  alternates: {
    canonical: "https://www.harshsrivastava.in/resume",
  },
  openGraph: {
    title: "Interactive Resume & Credentials | Harsh Srivastava",
    description: "Official resume of Harsh Srivastava - Serious Developer & Entrepreneur.",
    url: "https://www.harshsrivastava.in/resume",
    siteName: "Harsh Srivastava",
    images: [{ url: "/profile.jpg", width: 1200, height: 630, alt: "Harsh Srivastava Resume" }],
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
