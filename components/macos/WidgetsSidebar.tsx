"use client";

import React from "react";
import { Sun, Award, Flame, Calendar as CalIcon, ShieldCheck, Cpu, Code2 } from "lucide-react";

interface WidgetsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WidgetsSidebar({ isOpen, onClose }: WidgetsSidebarProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999970] bg-transparent select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-8 right-0 bottom-0 w-80 sm:w-96 apple-glass-panel border-l p-5 overflow-y-auto text-white flex flex-col gap-4 animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/15">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>macOS Widgets & System Info</span>
          </h3>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/10 text-white/70">
            Today
          </span>
        </div>

        {/* 1. Live Weather Widget (Goa, India) */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20 shadow-md backdrop-blur-2xl hover:border-white/35 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-white">Goa, India</div>
              <div className="text-[10px] text-sky-200">Sunny / Clear Skies</div>
            </div>
            <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">28°C</div>
          <div className="text-[10px] text-white/70 mt-1">H: 31° • L: 24° • Humidity 62%</div>
        </div>

        {/* 2. LeetCode 150-Day Streak Widget */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20 shadow-md backdrop-blur-2xl hover:border-white/35 transition-all">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-bold text-white">LeetCode Active Streak</span>
            </div>
            <span className="text-[10px] bg-orange-500/30 text-orange-200 px-2 py-0.5 rounded-full font-semibold border border-orange-500/30">
              150 Days
            </span>
          </div>
          <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
            150+ Consecutive Days of Problem Solving in Data Structures, Dynamic Programming & Algorithms.
          </p>
        </div>

        {/* 3. AWS Certified Badge Widget */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20 shadow-md backdrop-blur-2xl hover:border-white/35 transition-all flex items-center gap-3">
          <Award className="w-10 h-10 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">AWS Solutions Architect</div>
            <div className="text-[11px] text-amber-300 font-medium">Associate (Score 953/1000)</div>
            <div className="text-[10px] text-white/60 mt-0.5">Verified Cloud Accreditation</div>
          </div>
        </div>

        {/* 4. MP Police Cyber Security Badge Widget */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20 shadow-md backdrop-blur-2xl hover:border-white/35 transition-all flex items-center gap-3">
          <ShieldCheck className="w-9 h-9 text-rose-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">Cyber Security Intern</div>
            <div className="text-[11px] text-rose-300 font-medium">MP Police Cyber Unit</div>
            <div className="text-[10px] text-white/60 mt-0.5">Forensic threat tooling & audit</div>
          </div>
        </div>

        {/* 5. System Tech Badge Widget */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20 shadow-md backdrop-blur-2xl hover:border-white/35 transition-all flex flex-col gap-2">
          <div className="font-semibold text-white flex items-center gap-2 text-xs">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Tech Stack Summary</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Next.js 15", "TypeScript", "React 19", "FastAPI", "Docker", "PostgreSQL", "AWS"].map((t, i) => (
              <span key={i} className="text-[10px] bg-white/15 text-white/90 px-2 py-0.5 rounded-md border border-white/10 font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Calendar Footer */}
        <div className="pt-2 text-center text-[11px] text-white/50 flex items-center justify-center gap-1.5">
          <CalIcon className="w-3.5 h-3.5" />
          <span>macOS Sonoma 14.5 • Harsh Srivastava Portfolio</span>
        </div>
      </div>
    </div>
  );
}
