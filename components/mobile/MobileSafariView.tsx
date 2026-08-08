"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Lock,
  RotateCw,
  Briefcase,
  Folder,
  Award,
  User,
  Sparkles,
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";

import ProjectsWindow from "../windows/ProjectsWindow";
import ExperienceWindow from "../windows/ExperienceWindow";
import CertificationsWindow from "../windows/CertificationsWindow";
import SafariWindow from "../windows/SafariWindow";

export default function MobileSafariView() {
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "experience" | "certs" | "blogs">("home");
  const [copied, setCopied] = useState(false);
  const [timeStr, setTimeStr] = useState("9:41");

  const email = "Harrshh077@gmail.com";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      setTimeStr(now.toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-[#000000] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. iOS Top Status Bar */}
      <div className="h-11 bg-[#161618] px-5 flex items-center justify-between text-xs text-white/90 font-medium shrink-0 pt-2 border-b border-white/5">
        <span className="font-semibold">{timeStr}</span>
        <div className="flex items-center gap-2">
          {/* Signal */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-1 h-1 bg-white rounded-xs" />
            <span className="w-1 h-1.5 bg-white rounded-xs" />
            <span className="w-1 h-2 bg-white rounded-xs" />
            <span className="w-1 h-2.5 bg-white rounded-xs" />
          </div>
          {/* WiFi */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9.4 2.07-12.56 5.43l2.45 2.45c2.58-2.75 6.22-4.44 10.11-4.44s7.53 1.69 10.11 4.44l2.45-2.45c-3.16-3.36-7.59-5.43-12.56-5.43zm0 5c-3.62 0-6.85 1.51-9.15 3.96l2.45 2.45c1.72-1.84 4.14-2.97 6.7-2.97s4.98 1.13 6.7 2.97l2.45-2.45c-2.3-2.45-5.53-3.96-9.15-3.96zm0 5c-2.27 0-4.3.95-5.74 2.49l5.74 5.74 5.74-5.74c-1.44-1.54-3.47-2.49-5.74-2.49z" />
          </svg>
          {/* Battery */}
          <div className="w-6 h-3 border border-white/80 rounded-xs p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-xs" />
          </div>
        </div>
      </div>

      {/* 2. Mobile Safari Address Bar */}
      <div className="bg-[#1c1c1e] px-4 py-2 flex items-center justify-between border-b border-white/10 shrink-0 gap-2">
        <div className="flex-1 bg-[#2c2c2e] border border-white/10 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 text-xs text-white/90">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate font-medium text-white/90">
            harshsrivastava.in/{activeTab}
          </span>
        </div>
        <button
          onClick={() => setActiveTab("home")}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 bg-[#141416] overflow-y-auto p-4 select-text">
        {activeTab === "home" && (
          <div className="flex flex-col gap-6 pb-20">
            {/* Hero Profile Card */}
            <div className="bg-gradient-to-br from-[#252528] to-[#1c1c1e] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-md shrink-0">
                  <Image src="/profile.jpg" alt="Harsh Srivastava" fill className="object-cover" priority />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Harsh Srivastava</h1>
                  <p className="text-xs text-sky-400 font-medium mt-0.5">AWS Certified Solutions Architect</p>
                  <p className="text-[11px] text-white/50">Full Stack & AI Engineer • VIT&apos;27</p>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Hey, I&apos;m Harsh! Welcome to my mobile portfolio. I build production full-stack web architectures, autonomous AI agents, and high-performance microservices.
              </p>

              {/* Email Card */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <a href={`mailto:${email}`} className="text-xs font-semibold text-white hover:text-purple-300 truncate">
                    {email}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-medium text-white shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div>
              <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-1">
                Explore Sections
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab("projects")}
                  className="bg-[#252528] p-4 rounded-2xl border border-white/10 flex flex-col justify-between h-28 text-left hover:border-blue-500/50 transition-colors"
                >
                  <Folder className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Projects</div>
                    <div className="text-[11px] text-white/50">Full Stack & AI Apps</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("experience")}
                  className="bg-[#252528] p-4 rounded-2xl border border-white/10 flex flex-col justify-between h-28 text-left hover:border-sky-500/50 transition-colors"
                >
                  <Briefcase className="w-6 h-6 text-sky-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Experience</div>
                    <div className="text-[11px] text-white/50">5 Professional Roles</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("certs")}
                  className="bg-[#252528] p-4 rounded-2xl border border-white/10 flex flex-col justify-between h-28 text-left hover:border-amber-500/50 transition-colors"
                >
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Certifications</div>
                    <div className="text-[11px] text-white/50">AWS Architect & Security</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("blogs")}
                  className="bg-[#252528] p-4 rounded-2xl border border-white/10 flex flex-col justify-between h-28 text-left hover:border-emerald-500/50 transition-colors"
                >
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Tech Blogs</div>
                    <div className="text-[11px] text-white/50">Top 10 AI Articles</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-1">
                Social Profiles
              </h2>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href="https://github.com/Harrsh777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f43f5e] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-center"
                >
                  <Github className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-semibold text-white">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/harrshh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0ea5e9] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-center"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-semibold text-white">LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/harrshh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ff6b4a] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-center"
                >
                  <Twitter className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-semibold text-white">Twitter</span>
                </a>
                <a
                  href="https://www.harshsrivastava.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#22c55e] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-center"
                >
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-semibold text-white">Website</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="pb-20">
            <ProjectsWindow />
          </div>
        )}

        {activeTab === "experience" && (
          <div className="pb-20">
            <ExperienceWindow />
          </div>
        )}

        {activeTab === "certs" && (
          <div className="pb-20">
            <CertificationsWindow />
          </div>
        )}

        {activeTab === "blogs" && (
          <div className="pb-20">
            <SafariWindow />
          </div>
        )}
      </div>

      {/* 4. iOS Bottom Mobile Safari Tab Bar */}
      <div className="h-16 bg-[#1c1c1e] border-t border-white/10 px-4 flex items-center justify-around shrink-0 text-white/60">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "home" ? "text-blue-400 font-semibold" : "hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "projects" ? "text-blue-400 font-semibold" : "hover:text-white"
          }`}
        >
          <Folder className="w-5 h-5" />
          <span className="text-[10px]">Projects</span>
        </button>

        <button
          onClick={() => setActiveTab("experience")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "experience" ? "text-blue-400 font-semibold" : "hover:text-white"
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px]">Experience</span>
        </button>

        <button
          onClick={() => setActiveTab("certs")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "certs" ? "text-blue-400 font-semibold" : "hover:text-white"
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">Certs</span>
        </button>

        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "blogs" ? "text-blue-400 font-semibold" : "hover:text-white"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Blogs</span>
        </button>
      </div>
    </div>
  );
}
