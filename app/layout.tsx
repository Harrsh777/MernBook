import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harsh Srivastava - AWS Certified Solutions Architect | VIT'27 | GSoC'24 | 5× Hackathon Winner | MERN Stack Developer",
  description: "Harsh Srivastava - AWS Certified Solutions Architect, VIT'27, GSoC'24, 5× Hackathon Winner, Full-Stack Developer specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, Jenkins, Git, System Design. Cyber Security Intern at MP Police, Full Stack Developer at BUILD AI ENGINE.",
  keywords: "Harsh Srivastava, AWS Certified Solutions Architect, VIT, GSoC, Hackathon Winner, MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, Jenkins, Git, System Design, Full Stack Developer, Cyber Security, MP Police, BUILD AI ENGINE, SafeSurf Jr, AI Models, DevOps",
  authors: [{ name: "Harsh Srivastava" }],
  creator: "Harsh Srivastava",
  publisher: "Harsh Srivastava",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.harshsrivastava.in/',
    title: 'Harsh Srivastava - AWS Certified Solutions Architect | VIT\'27 | GSoC\'24 | 5× Hackathon Winner',
    description: 'AWS Certified Solutions Architect, VIT\'27, GSoC\'24, 5× Hackathon Winner, Full-Stack Developer specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, Jenkins, Git, System Design.',
    siteName: 'Harsh Srivastava Portfolio',
    images: [
      {
        url: '/profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Harsh Srivastava - AWS Certified Solutions Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harsh Srivastava - AWS Certified Solutions Architect | VIT\'27 | GSoC\'24 | 5× Hackathon Winner',
    description: 'AWS Certified Solutions Architect, VIT\'27, GSoC\'24, 5× Hackathon Winner, Full-Stack Developer specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, Jenkins, Git, System Design.',
    images: ['/profile.jpg'],
    creator: '@harrshh',
  },
  alternates: {
    canonical: 'https://www.harshsrivastava.in/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
