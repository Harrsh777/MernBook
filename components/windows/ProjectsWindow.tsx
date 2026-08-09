"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsWindow() {
  const projects = [
    {
      title: "ClinicOS",
      tagline: "AI-Powered Healthcare & Practice Growth Platform",
      description:
        "AI-powered clinic growth platform with WhatsApp receptionist, teleconsultation, billing, reminders, and automated patient management.",
      tech: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "WhatsApp API", "OpenAI"],
      img: "/clinicos.png",
      demoUrl: "https://www.harshsrivastava.in",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "MoxSend",
      tagline: "Autonomous AI Cold Email Outreach Platform",
      description:
        "AI cold email outreach platform featuring automated inbox warm-up, dynamic AI email personalization, campaign analytics, and deliverability optimization.",
      tech: ["Next.js", "FastAPI", "Redis", "Docker", "LangChain", "MongoDB"],
      img: "/moxsend.png",
      demoUrl: "https://www.harshsrivastava.in",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "EduCore ERP",
      tagline: "Multi-Tenant Educational Institution OS",
      description:
        "Multi-tenant school ERP with automated timetable generation, real-time student attendance tracking, fee management, and executive analytics dashboards.",
      tech: ["Next.js", "PostgreSQL", "AWS", "Express.js", "Tailwind CSS"],
      img: "/educore.png",
      demoUrl: "https://www.educorerp.in/",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "SafeSurf Jr",
      tagline: "AI Cybersecurity & Child Safety Platform",
      description:
        "AI-powered child safety platform catching online threats and offensive content before children encounter them.",
      tech: ["React", "Node.js", "Machine Learning", "Cybersecurity", "Python"],
      img: "/safesu.png",
      demoUrl: "https://github.com/Harrsh777/SafeSurfJr",
      githubUrl: "https://github.com/Harrsh777/SafeSurfJr",
    },
    {
      title: "SDPL Supply Chain",
      tagline: "Enterprise Distribution & Logistics System",
      description:
        "Comprehensive supply chain platform moving enterprise distribution firms off legacy spreadsheets onto one live management system.",
      tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      img: "/sdpl.png",
      demoUrl: "https://sdpl.vercel.app/",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "TrekkinGods",
      tagline: "Travel & Outdoor Booking Engine",
      description:
        "High-performance trek and travel booking marketplace handling tour discovery, scheduling, and payment confirmation in one unified flow.",
      tech: ["Next.js", "REST APIs", "Payments", "Node.js", "Tailwind CSS"],
      img: "/trek.png",
      demoUrl: "https://trekkingGods.com/",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "Plotify",
      tagline: "Premium Real Estate Marketplace",
      description:
        "Interactive property marketplace with immersive listings, map integration, and agent-buyer communication portals.",
      tech: ["Next.js", "Supabase", "Tailwind CSS", "PostgreSQL"],
      img: "/plotify.png",
      demoUrl: "https://www.theplotify.com",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "DeployX",
      tagline: "Automated CI/CD & Deployment Engine",
      description:
        "Push code and let automated pipelines handle container builds, deployments, zero-downtime rollouts, and server monitoring.",
      tech: ["Docker", "Kubernetes", "Node.js", "AWS", "CI/CD"],
      img: "/deployx.png",
      demoUrl: "https://github.com/Harrsh777/DeployX",
      githubUrl: "https://github.com/Harrsh777/DeployX",
    },
    {
      title: "MERN Club",
      tagline: "Hackathon & Tech Community Ecosystem",
      description:
        "Community-driven event and hackathon management platform connecting developers, sponsors, and judges across the circuit.",
      tech: ["MongoDB", "Express", "React", "Node.js", "Authentication"],
      img: "/mernmatrix.png",
      demoUrl: "https://mernclubvitb.com/",
      githubUrl: "https://github.com/Harrsh777",
    },
    {
      title: "Discovery Drift",
      tagline: "Cloud Infrastructure & AI SaaS",
      description:
        "Cloud infrastructure management SaaS with native AI diagnostics and cloud resource optimization.",
      tech: ["Next.js", "AWS", "OpenAI API", "Docker", "TypeScript"],
      img: "/discovery.png",
      demoUrl: "https://discovery-drift.vercel.app/",
      githubUrl: "https://github.com/Harrsh777",
    },
  ];

  return (
    <div className="h-full w-full bg-transparent p-6 text-white overflow-y-auto select-text backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Featured Projects</h2>
          <p className="text-xs text-white/60 mt-1">
            Production full-stack applications & AI architectures
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">
          {projects.length} Active Apps
        </span>
      </div>

      {/* Grid of Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="apple-glass-card rounded-2xl p-4 flex flex-col justify-between hover:border-white/35 transition-all group shadow-md"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/10">
                <Image
                  src={proj.img}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 font-bold text-lg text-white">
                  {proj.title}
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="text-xs font-semibold text-blue-300 mb-1.5">{proj.tagline}</div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">{proj.description}</p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {proj.tech.map((t, tid) => (
                  <span
                    key={tid}
                    className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-md border border-white/10 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <a
                href={proj.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <span>View Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg transition-colors border border-white/10"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
