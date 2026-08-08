"use client";

import React from "react";
import { Download, Award, GraduationCap, Code2, CheckCircle2 } from "lucide-react";

export default function ResumeWindow() {
  return (
    <div className="h-full w-full bg-transparent p-6 md:p-8 text-white select-text overflow-y-auto backdrop-blur-2xl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Harsh Srivastava</h2>
          <p className="text-sm text-blue-300 font-medium mt-0.5">
            Full Stack & AI Developer | AWS Certified Solutions Architect
          </p>
          <p className="text-xs text-white/70 mt-1">
            VIT Bhopal University (B.Tech CSE Cyber Security, 2027)
          </p>
        </div>

        {/* Download PDF button */}
        <a
          href="/Harsh_Resume.pdf"
          download="Harsh_Srivastava_Resume.pdf"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download Resume PDF</span>
        </a>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Key Achievements */}
        <div className="apple-glass-card rounded-2xl p-5 border border-white/20 shadow-md">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-4">
            <Award className="w-5 h-5" />
            <span>Certifications & Metrics</span>
          </div>
          <ul className="flex flex-col gap-3 text-xs text-white/90">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">AWS Solutions Architect Associate (SAA):</strong> Score 953/1000
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Data Structures & Algorithms:</strong> 850+ problems solved across LeetCode & Codeforces
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">LeetCode Consistency:</strong> 150-day active problem-solving streak
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Hackathons:</strong> Winner & finalist in 6+ national level hackathons
              </span>
            </li>
          </ul>
        </div>

        {/* Education & Experience */}
        <div className="apple-glass-card rounded-2xl p-5 border border-white/20 shadow-md">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm mb-4">
            <GraduationCap className="w-5 h-5" />
            <span>Education & Focus</span>
          </div>
          <div className="flex flex-col gap-3 text-xs text-white/90">
            <div>
              <div className="text-white font-semibold text-sm">B.Tech Computer Science & Engineering</div>
              <div className="text-white/60">VIT Bhopal University • 2023 - 2027</div>
              <p className="mt-1 text-white/80 leading-relaxed">
                Specialization in Cyber Security, Microservices Architecture, Cloud Native Computing, and Distributed Systems.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Stack Breakdown */}
        <div className="md:col-span-2 apple-glass-card rounded-2xl p-5 border border-white/20 shadow-md">
          <div className="flex items-center gap-2.5 text-purple-400 font-bold text-sm mb-4">
            <Code2 className="w-5 h-5" />
            <span>Technical Capabilities</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <div className="text-blue-300 font-semibold mb-1">Frontend</div>
              <div className="text-white/90">React 19, Next.js 15, TypeScript, Tailwind CSS</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <div className="text-emerald-300 font-semibold mb-1">Backend</div>
              <div className="text-white/90">Node.js, Express, FastAPI, Spring Boot, REST APIs</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <div className="text-purple-300 font-semibold mb-1">Databases & Cloud</div>
              <div className="text-white/90">PostgreSQL, MongoDB, Redis, AWS, Docker, ECS</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <div className="text-amber-300 font-semibold mb-1">AI & Security</div>
              <div className="text-white/90">OpenAI API, LangChain, OAuth 2.0, Web Security</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
