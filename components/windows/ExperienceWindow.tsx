"use client";

import React, { useState } from "react";
import { Briefcase, Calendar, ShieldCheck, Code, Cpu, Award, ChevronRight } from "lucide-react";

export default function ExperienceWindow() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const experiences = [
    {
      year: "2026",
      company: "EaseHawk Technologies",
      role: "Full Stack Developer Intern",
      icon: <Code className="w-4 h-4 text-sky-400" />,
      tagline: "High-performance Web Architecture & Client Applications",
      description:
        "Delivered production web architectures, responsive client dashboards, automated payment processing pipelines, and sub-100ms API response endpoints.",
      highlights: [
        "Architected scalable full-stack client dashboards with Next.js & React.",
        "Integrated payment milestone processing and automated client billing systems.",
        "Optimized microservice API latency to achieve sub-100ms execution speeds.",
      ],
      stack: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    },
    {
      year: "2025 – 26",
      company: "MyTripGoal",
      role: "Software Engineer Intern",
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      tagline: "End-to-End Travel & Outdoor Booking Platform",
      description:
        "Engineered full-stack booking infrastructure, real-time tour discovery, payment gateway integration, and high-performance search systems.",
      highlights: [
        "Built end-to-end trek and travel booking engine with live scheduling.",
        "Integrated Razorpay & Stripe payment gateways with instant booking confirmations.",
        "Achieved Lighthouse performance scores >90 through aggressive code splitting.",
      ],
      stack: ["Next.js", "TypeScript", "REST APIs", "Payments", "Node.js", "Tailwind CSS"],
    },
    {
      year: "2025",
      company: "BUILD AI ENGINE",
      role: "Full Stack Developer Intern",
      icon: <Briefcase className="w-4 h-4 text-purple-400" />,
      tagline: "Autonomous AI Agent Orchestrations & Enterprise Microservices",
      description:
        "Architecting autonomous AI cold email outreach platforms (MoxSend) and clinic practice growth systems (ClinicOS) using Next.js 15, FastAPI, Docker, and LangChain.",
      highlights: [
        "Designed autonomous multi-agent tool-calling orchestrations with LangChain & OpenAI.",
        "Built high-throughput backend microservices with FastAPI & PostgreSQL.",
        "Optimized Redis vector caching and Docker containerized deployments.",
      ],
      stack: ["Next.js 15", "TypeScript", "FastAPI", "Docker", "LangChain", "PostgreSQL", "AWS"],
    },
    {
      year: "2024 – 25",
      company: "MP Police",
      role: "Cyber Security Intern",
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      tagline: "Security tooling and threat analysis inside an active cybercrime unit.",
      description:
        "Conducted digital forensic evidence analysis, network traffic inspection, threat intelligence gathering, and security automation inside an active police cybercrime unit.",
      highlights: [
        "Built custom network packet analysis and vulnerability scanning scripts in Python.",
        "Assisted senior forensic officers in digital evidence extraction and crime investigation.",
        "Implemented security auditing tools following OWASP and zero-trust standards.",
      ],
      stack: ["Cybersecurity", "Digital Forensics", "Linux", "Python", "Wireshark", "Network Analysis"],
    },
    {
      year: "2024",
      company: "Google Summer of Code",
      role: "Open Source Contributor",
      icon: <Award className="w-4 h-4 text-amber-400" />,
      tagline: "Production features for a global OSS project over a 12-week fellowship.",
      description:
        "Selected as GSoC '24 contributor for global open-source developer infrastructure. Refactored core modules, optimized execution pipelines, and added comprehensive test suites.",
      highlights: [
        "Authored production features and core system refactoring over a 12-week fellowship.",
        "Collaborated with international maintainers via Git workflows and code reviews.",
        "Improved test coverage and CI/CD automation pipelines for open-source releases.",
      ],
      stack: ["Open Source", "TypeScript", "System Design", "Git", "CI/CD"],
    },
  ];

  const current = experiences[selectedIdx];

  return (
    <div className="h-full w-full bg-transparent text-white flex select-none overflow-hidden font-sans">
      {/* macOS Sidebar Navigation (Apple Settings Vibe) */}
      <div className="w-64 bg-white/5 border-r border-white/10 p-3 flex flex-col justify-between backdrop-blur-2xl">
        <div>
          <div className="text-[11px] font-semibold text-white/40 mb-3 px-2 tracking-wider uppercase">
            Experience Timeline
          </div>
          <div className="flex flex-col gap-1">
            {experiences.map((exp, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={isSelected ? "text-white" : "text-white/60"}>
                      {exp.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs truncate font-medium">{exp.company}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? "text-white/80" : "text-white/50"
                        }`}
                      >
                        {exp.year}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "opacity-100" : "opacity-30"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer badge */}
        <div className="p-2 bg-white/10 rounded-xl border border-white/10 text-[11px] text-white/60 text-center font-medium">
          5 Verified Experience Roles
        </div>
      </div>

      {/* Main Content Pane (Apple Detail View) */}
      <div className="flex-1 bg-transparent p-6 md:p-8 overflow-y-auto flex flex-col justify-between select-text backdrop-blur-2xl">
        <div>
          {/* Header Card */}
          <div className="apple-glass-card rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/15 border border-white/20">
                  {current.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{current.company}</h2>
                  <div className="text-xs font-semibold text-blue-300 mt-0.5">{current.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/15 px-3 py-1.5 rounded-full border border-white/15">
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                <span>{current.year}</span>
              </div>
            </div>

            <p className="text-xs text-white/80 italic leading-relaxed pt-2 border-t border-white/10 font-sans">
              &ldquo;{current.tagline}&rdquo;
            </p>
          </div>

          {/* Overview Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Role Overview
            </h3>
            <p className="text-xs text-white/90 leading-relaxed apple-glass-card p-4 rounded-xl">
              {current.description}
            </p>
          </div>

          {/* Key Achievements */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Key Contributions & Achievements
            </h3>
            <div className="flex flex-col gap-2">
              {current.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl apple-glass-card text-xs text-white/90"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Badges */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-[11px] font-semibold text-white/50 mb-2">Technologies Used</div>
          <div className="flex flex-wrap gap-1.5">
            {current.stack.map((tech, i) => (
              <span
                key={i}
                className="text-[11px] bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
