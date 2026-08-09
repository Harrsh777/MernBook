import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Harsh Srivastava | Serious Software Developer & Entrepreneur | Enterprise Architect",
  description: "Harsh Srivastava is a serious software developer, entrepreneur, and AWS Certified Solutions Architect who has built & sold 7+ software projects and creates enterprise-level solutions for major clients. Specialized in MERN Stack, Next.js, Spring Boot, Microservices, Cloud Infrastructure, and AI Engines.",
  keywords: "Harsh Srivastava, harsh srivastava, Harsh Srivastava developer, Harsh Srivastava entrepreneur, sold 7 projects, sold software startups, enterprise software developer, AWS Certified Solutions Architect, Full Stack Developer, ClinicOS, MoxSend, EduCore ERP, VIT University, GSoC 2024, Google Summer of Code, Hackathon Winner, MERN Stack Developer, TypeScript Developer, Spring Boot, Microservices, Docker, Kubernetes, DevOps Engineer, System Design, Enterprise Client Software",
  authors: [{ name: "Harsh Srivastava", url: "https://www.harshsrivastava.in" }],
  creator: "Harsh Srivastava",
  publisher: "Harsh Srivastava",
  applicationName: "Harsh Srivastava | Serious Developer & Entrepreneur",
  generator: "Next.js",
  manifest: "/manifest.json",
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
    title: 'Harsh Srivastava | Serious Software Developer & Entrepreneur | Enterprise Architect',
    description: 'Harsh Srivastava is a serious software developer, entrepreneur, and AWS Certified Solutions Architect who has built & sold 7+ software projects and creates enterprise-grade applications for major clients.',
    siteName: 'Harsh Srivastava Portfolio & Enterprise Solutions',
    countryName: 'India',
    images: [
      {
        url: '/profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Harsh Srivastava - Serious Software Developer & Entrepreneur',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@harshsrivastava',
    creator: '@harrshh',
    title: 'Harsh Srivastava | Serious Software Developer & Entrepreneur | Enterprise Architect',
    description: 'Harsh Srivastava is a serious software developer, entrepreneur, and AWS Certified Solutions Architect who has built & sold 7+ software projects and crafts enterprise client solutions.',
    images: ['/profile.jpg'],
  },
  alternates: {
    canonical: 'https://www.harshsrivastava.in/',
    languages: {
      'en-US': 'https://www.harshsrivastava.in/',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || '',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harsh Srivastava',
    alternateName: ['Harsh Srivastava', 'Harrsh', 'Harsh Srivastava Developer'],
    url: 'https://www.harshsrivastava.in',
    image: 'https://www.harshsrivastava.in/profile.jpg',
    sameAs: [
      'https://github.com/Harrsh777',
      'https://www.linkedin.com/in/harrshh/',
      'https://twitter.com/harrshh',
      'https://www.instagram.com/harsh.srivastava'
    ],
    jobTitle: [
      'Serious Software Developer',
      'Software Entrepreneur',
      'AWS Certified Solutions Architect',
      'Enterprise Systems Engineer'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'BUILD AI ENGINE & Independent Enterprise Consultancy'
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'VIT University',
      url: 'https://vit.ac.in'
    },
    description: 'Harsh Srivastava is a serious software developer, entrepreneur, and AWS Certified Solutions Architect who has built and sold over 7 software projects and crafts enterprise-level solutions for major clients. Specialized in MERN Stack, Next.js, TypeScript, Spring Boot, Microservices, Docker, Kubernetes, CI/CD, System Design, and AI integration.',
    knowsAbout: [
      'Software Entrepreneurship',
      'Enterprise Software Architecture',
      'MERN Stack',
      'TypeScript',
      'Spring Boot',
      'REST APIs',
      'Microservices',
      'Docker',
      'Kubernetes',
      'AWS Solutions Architecture',
      'System Design',
      'DevOps & CI/CD',
      'AI Engines & Full Stack Development'
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AWS Certified Solutions Architect - Associate',
        credentialCategory: 'professional certification'
      }
    ],
    award: [
      'Sold 7+ Software Projects',
      'Built Software for Enterprise Clients',
      'AWS Certified Solutions Architect',
      'Google Summer of Code 2024 Participant',
      '5× Hackathon Winner'
    ],
    founderOf: [
      { '@type': 'Organization', name: 'ClinicOS', url: 'https://www.harshsrivastava.in' },
      { '@type': 'Organization', name: 'MoxSend', url: 'https://www.harshsrivastava.in' },
      { '@type': 'Organization', name: 'EduCore ERP', url: 'https://www.educorerp.in/' }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'Tamil Nadu',
      addressLocality: 'Chennai'
    }
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Harsh Srivastava | Serious Developer & Entrepreneur',
    url: 'https://www.harshsrivastava.in',
    description: 'Official portfolio and enterprise services portal of Harsh Srivastava - Serious Developer, Tech Entrepreneur (7+ Projects Sold), AWS Solutions Architect.',
    author: {
      '@type': 'Person',
      name: 'Harsh Srivastava'
    },
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'About Harsh Srivastava',
        description: 'Learn about Harsh Srivastava, serious developer and entrepreneur who has sold 7+ projects and builds enterprise client software.',
        url: 'https://www.harshsrivastava.in/about'
      },
      {
        '@type': 'WebPage',
        name: 'Projects & Sold Products',
        description: 'Explore 7+ sold software products and enterprise client systems engineered by Harsh Srivastava.',
        url: 'https://www.harshsrivastava.in/projects'
      },
      {
        '@type': 'WebPage',
        name: 'Enterprise Services',
        description: 'Custom SaaS development, enterprise microservices, cloud infrastructure, and AI engineering services.',
        url: 'https://www.harshsrivastava.in/services'
      },
      {
        '@type': 'WebPage',
        name: 'Interactive Resume',
        description: 'View credentials, experience, certifications, and technical mastery of Harsh Srivastava.',
        url: 'https://www.harshsrivastava.in/resume'
      },
      {
        '@type': 'WebPage',
        name: 'Contact & Hire',
        description: 'Get in touch with Harsh Srivastava for enterprise engineering, software projects, or consultations.',
        url: 'https://www.harshsrivastava.in/contact'
      },
      {
        '@type': 'WebPage',
        name: 'Book a Consultation',
        description: 'Book a 1-on-1 strategy or technical execution session with Harsh Srivastava.',
        url: 'https://www.harshsrivastava.in/book'
      },
      {
        '@type': 'WebPage',
        name: 'Live Dashboard',
        description: 'Real-time project analytics and systems dashboard.',
        url: 'https://www.harshsrivastava.in/dashboard'
      }
    ]
  };

  const jsonLdProfilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Person',
      name: 'Harsh Srivastava',
      jobTitle: 'Serious Software Developer & Entrepreneur',
      description: 'Serious software developer and entrepreneur who has built & sold 7+ software projects and creates enterprise-level solutions for major clients.'
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProfilePage) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Semantic Header Navigation for Google Search Crawler Sitelinks */}
        <header className="sr-only">
          <h1>Harsh Srivastava - Serious Software Developer & Entrepreneur</h1>
          <p>Harsh Srivastava is an AWS Certified Solutions Architect and entrepreneur who has built & sold 7+ software projects and crafts enterprise solutions for major clients.</p>
          <nav aria-label="Main Navigation">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Harsh Srivastava</Link></li>
              <li><Link href="/projects">Projects &amp; Sold Startups</Link></li>
              <li><Link href="/services">Enterprise Software Services</Link></li>
              <li><Link href="/resume">Interactive Resume</Link></li>
              <li><Link href="/contact">Contact &amp; Hire</Link></li>
              <li><Link href="/book">Book 1-on-1 Session</Link></li>
              <li><Link href="/dashboard">Live Systems Dashboard</Link></li>
              <li><a href="https://github.com/Harrsh777" target="_blank" rel="noopener noreferrer">GitHub Profile</a></li>
              <li><a href="https://www.linkedin.com/in/harrshh/" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></li>
            </ul>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
