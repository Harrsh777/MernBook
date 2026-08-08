"use client";

import React from "react";
import DepthCarousel from "../DepthCarousel";

export default function CertificationsWindow() {
  const items = [
    {
      image: "/aws.png",
      alt: "AWS Certified Solutions Architect",
      title: "AWS Certified Solutions Architect (Score: 953/1000)",
    },
    {
      image: "/microsoft.png",
      alt: "Microsoft Certified Specialist",
      title: "Microsoft Certified Systems & Cloud Specialist",
    },
    {
      image: "/cisco.jpeg",
      alt: "Cisco Networking & Security",
      title: "Cisco Network Security & Infrastructure Engineer",
    },
    {
      image: "/mongo.png",
      alt: "MongoDB Certified Developer",
      title: "MongoDB Certified Database Developer",
    },
    {
      image: "/linux.png",
      alt: "Linux System Administration",
      title: "Linux System Administration & Kernel Security",
    },
    {
      image: "/gcp.jpeg",
      alt: "Google Cloud Platform",
      title: "Google Cloud Platform (GCP) Associate Engineer",
    },
    {
      image: "/cyber.png",
      alt: "Cyber Security Specialist",
      title: "Cyber Security & Forensic Analyst (MP Police Intern)",
    },
    {
      image: "/devops.png",
      alt: "Cloud Native DevOps",
      title: "Cloud Native DevOps, Docker & Kubernetes",
    },
    {
      image: "/ml.png",
      alt: "Machine Learning & AI",
      title: "Machine Learning & Autonomous AI Engineering",
    },
    {
      image: "/javascript.jpeg",
      alt: "JavaScript & Node.js",
      title: "Modern JavaScript, TypeScript & Node.js Specialist",
    },
    {
      image: "/sql.jpeg",
      alt: "SQL & Database Design",
      title: "Relational Database Systems & SQL Optimization",
    },
    {
      image: "/solvit.jpeg",
      alt: "SolvIT Winner",
      title: "SolvIT Technical Competition Award Winner",
    },
    {
      image: "/ui.jpeg",
      alt: "UI/UX Engineering",
      title: "Modern UI/UX Design System Certification",
    },
    {
      image: "/prob.jpeg",
      alt: "DSA & Problem Solving",
      title: "Data Structures & Algorithms Mastery (850+ Solved)",
    },
    {
      image: "/ijfmr.png",
      alt: "Research Publication",
      title: "IJFMR Published International Research Paper",
    },
    {
      image: "/hack.png",
      alt: "Hackathon Winner",
      title: "5× National Level Hackathon Winner & Finalist",
    },
    {
      image: "/1.png",
      alt: "System Architecture",
      title: "Enterprise Systems Architecture & Microservices",
    },
    {
      image: "/2.png",
      alt: "Cloud Security",
      title: "Cloud Threat Analysis & Security Compliance",
    },
    {
      image: "/devops.jpeg",
      alt: "CI/CD Automation",
      title: "Automated CI/CD Pipelines & Containerization",
    },
    {
      image: "/author.jpeg",
      alt: "Technical Author",
      title: "Published Technical Author & Engineering Lead",
    },
  ];

  return (
    <div className="h-full w-full bg-transparent p-6 text-white flex flex-col justify-between select-none backdrop-blur-2xl">
      {/* Window Header */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Certifications & Accreditations</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Verified Cloud, Cybersecurity, Big Tech & Research Credentials
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
          {items.length} Verified Certificates
        </span>
      </div>

      {/* 3D Depth Carousel Container with generous width */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center overflow-hidden">
        <DepthCarousel
          items={items}
          depth={240}
          spread={110}
          tilt={20}
          tiltDirection="right"
          perspective={1400}
          visibleCards={5}
          falloff={0.18}
          blur={5}
          autoplay={false}
          loop
          cardWidth={440}
          cardHeight={300}
          radius={16}
          tint="#05060a"
          duration={700}
          ease="power3.out"
          autoplayDelay={3200}
          showControls
          showIndicators
        />
      </div>

      {/* Window Footer */}
      <div className="pt-3 border-t border-white/10 text-center text-xs text-white/50 flex items-center justify-between">
        <span>Showing {items.length} Industry Certifications</span>
        <span>Use arrow controls or drag to browse</span>
      </div>
    </div>
  );
}
