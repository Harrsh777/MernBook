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
  title: "Harsh Srivastava | AWS Certified Solutions Architect | VIT'27 | GSoC'24 | 5× Hackathon Winner | Full Stack Developer",
  description: "Harsh Srivastava is an AWS Certified Solutions Architect, VIT'27 Computer Science student, Google Summer of Code'24 participant, 5× Hackathon Winner, and Full-Stack Developer. Specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, and System Design. Currently working as Cyber Security Intern at MP Police and Full Stack Developer at BUILD AI ENGINE.",
  keywords: "Harsh Srivastava, harsh srivastava, AWS Certified Solutions Architect, VIT University, VIT Chennai, GSoC 2024, Google Summer of Code, Hackathon Winner, MERN Stack Developer, TypeScript Developer, Spring Boot Developer, REST API Developer, Microservices Developer, Docker Expert, Kubernetes Expert, DevOps Engineer, System Design Expert, Full Stack Developer, Cyber Security Intern, MP Police, BUILD AI ENGINE, SafeSurf Jr, AI Models, Software Engineer, Computer Science Student, VIT'27, Portfolio, Resume",
  authors: [{ name: "Harsh Srivastava", url: "https://www.harshsrivastava.in" }],
  creator: "Harsh Srivastava",
  publisher: "Harsh Srivastava",
  applicationName: "Harsh Srivastava Portfolio",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.harshsrivastava.in'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.harshsrivastava.in/',
    title: 'Harsh Srivastava | AWS Certified Solutions Architect | VIT\'27 | GSoC\'24 | 5× Hackathon Winner',
    description: 'Harsh Srivastava is an AWS Certified Solutions Architect, VIT\'27 Computer Science student, Google Summer of Code\'24 participant, 5× Hackathon Winner, and Full-Stack Developer specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, and System Design.',
    siteName: 'Harsh Srivastava Portfolio',
    countryName: 'India',
    images: [
      {
        url: '/profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Harsh Srivastava - AWS Certified Solutions Architect and Full Stack Developer',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@harshsrivastava',
    creator: '@harrshh',
    title: 'Harsh Srivastava | AWS Certified Solutions Architect | VIT\'27 | GSoC\'24 | 5× Hackathon Winner',
    description: 'Harsh Srivastava is an AWS Certified Solutions Architect, VIT\'27 Computer Science student, Google Summer of Code\'24 participant, 5× Hackathon Winner, and Full-Stack Developer.',
    images: ['/profile.jpg'],
  },
  alternates: {
    canonical: 'https://www.harshsrivastava.in/',
    languages: {
      'en-US': 'https://www.harshsrivastava.in/',
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
    yandex: 'your-yandex-verification-code', // Add if you have one
    yahoo: 'your-yahoo-verification-code', // Add if you have one
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harsh Srivastava',
    alternateName: 'Harsh Srivastava',
    url: 'https://www.harshsrivastava.in',
    image: 'https://www.harshsrivastava.in/profile.jpg',
    sameAs: [
      'https://github.com/harrshh',
      'https://linkedin.com/in/harsh-srivastava',
      'https://twitter.com/harrshh',
      'https://instagram.com/harsh.srivastava'
    ],
    jobTitle: 'AWS Certified Solutions Architect',
    worksFor: {
      '@type': 'Organization',
      name: 'VIT University'
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'VIT University Chennai',
      url: 'https://vit.ac.in'
    },
    description: 'AWS Certified Solutions Architect, VIT\'27 Computer Science student, Google Summer of Code\'24 participant, 5× Hackathon Winner, and Full-Stack Developer specializing in MERN Stack, TypeScript, Spring Boot, REST APIs, Microservices, Docker, Kubernetes, CI/CD, and System Design.',
    knowsAbout: [
      'MERN Stack',
      'TypeScript',
      'Spring Boot',
      'REST APIs',
      'Microservices',
      'Docker',
      'Kubernetes',
      'AWS',
      'System Design',
      'DevOps',
      'CI/CD',
      'Full Stack Development'
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AWS Certified Solutions Architect',
        credentialCategory: 'professional certification'
      }
    ],
    award: [
      '5× Hackathon Winner',
      'Google Summer of Code 2024 Participant'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'Tamil Nadu',
      addressLocality: 'Chennai'
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
