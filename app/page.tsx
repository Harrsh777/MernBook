// app/page.tsx
"use client";

import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";

import "./cinematic.css";

import SmoothScroll from "./components/cinematic/SmoothScroll";
import Cursor from "./components/cinematic/Cursor";
import Atmosphere from "./components/cinematic/Atmosphere";
import Nav from "./components/cinematic/Nav";
import Hero from "./components/cinematic/Hero";
import Manifesto from "./components/cinematic/Manifesto";
import Freelance from "./components/cinematic/Freelance";
import Projects from "./components/cinematic/Projects";
import Writing from "./components/cinematic/Writing";
import Timeline from "./components/cinematic/Timeline";
import Contact from "./components/cinematic/Contact";

/* Type system — display / body / serif-accent (exposed as CSS vars) */
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const serif = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", weight: "400", style: ["normal", "italic"] });

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Harsh Srivastava",
    jobTitle: "Full Stack Developer",
    description:
      "Developer, writer, bodybuilder, traveler. Freelance full-stack developer — 10+ products delivered to enterprise-level clients.",
    url: "https://www.harshsrivastava.in/",
    email: "hello@harshsrivastava.in",
    sameAs: [
      "https://github.com/Harrsh777",
      "https://www.linkedin.com/in/harrshh",
      "https://twitter.com/harrshh",
      "https://instagram.com/Harrsh077",
    ],
    award: [
      "5× Hackathon Winner",
      "AWS Certified Solutions Architect",
      "Google Summer of Code 2024",
    ],
  };

  return (
    <div className={`cinematic ${display.variable} ${body.variable} ${serif.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SmoothScroll>
        <Cursor />
        <Atmosphere />
        <Nav />

        <main>
          <Hero />
          <Manifesto />
          <Projects />
          <Writing />
          <Timeline />
          <Freelance />
          <Contact />
        </main>
      </SmoothScroll>
    </div>
  );
}
