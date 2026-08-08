"use client";

import React from "react";
import {
  Bell,
  Award,
  Flame,
  Code2,
  Cloud,
  Stethoscope,
  Trophy,
  Download,
  Folder,
  Sparkles,
} from "lucide-react";
import { WindowId } from "@/lib/windowStore";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  onOpenWindow,
}: NotificationCenterProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      icon: <Award className="w-4 h-4 text-amber-400" />,
      title: "AWS Solutions Architect Score Updated",
      subtitle: "Passed with 953/1000 — Cloud & Infrastructure Mastery",
      time: "2h ago",
    },
    {
      icon: <Flame className="w-4 h-4 text-orange-400" />,
      title: "LeetCode Streak Reached 150 Days",
      subtitle: "150 consecutive days of algorithmic problem solving",
      time: "Today",
    },
    {
      icon: <Code2 className="w-4 h-4 text-sky-400" />,
      title: "850+ DSA Problems Solved Successfully",
      subtitle: "Advanced proficiency in DP, Graphs, and Trees",
      time: "This week",
    },
    {
      icon: <Cloud className="w-4 h-4 text-purple-400" />,
      title: "MoxSend Engine Deployed on AWS ECS",
      subtitle: "Containerized multi-agent cold email outreach service",
      time: "Yesterday",
    },
    {
      icon: <Stethoscope className="w-4 h-4 text-emerald-400" />,
      title: "ClinicOS AI Receptionist Processed Patient Workflow",
      subtitle: "Automated healthcare scheduling & EHR database sync",
      time: "1 day ago",
    },
    {
      icon: <Trophy className="w-4 h-4 text-rose-400" />,
      title: "6+ National Hackathons Completed",
      subtitle: "5× Top Winner & Finalist across India",
      time: "Recent",
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999985] bg-transparent select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-9 right-4 w-96 sm:w-[410px] apple-glass-panel rounded-[32px] p-5 text-white flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200"
      >
        {/* Recruiter Header Greeting */}
        <div className="pb-3 border-b border-white/15 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Welcome, recruiter</span>
              <span className="text-lg">👋</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-blue-200 font-semibold border border-white/20">
              Verified
            </span>
          </div>
          <p className="text-xs text-white/70">
            Here&apos;s a quick snapshot of my engineering journey & impact.
          </p>
        </div>

        {/* Live Stats Section */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20 flex flex-col gap-3 shadow-md backdrop-blur-2xl">
          <div className="text-[11px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Live Engineering Impact Metrics
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-[10px] text-white/60">Projects Built</div>
              <div className="text-base font-bold text-white mt-0.5">12+</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-[10px] text-white/60">Active Users Served</div>
              <div className="text-base font-bold text-emerald-300 mt-0.5">4,000+</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-[10px] text-white/60">Freelance Revenue</div>
              <div className="text-base font-bold text-amber-300 mt-0.5">₹60k–70k/mo</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-[10px] text-white/60">Cloud Deployments</div>
              <div className="text-base font-bold text-purple-300 mt-0.5">25+</div>
            </div>
          </div>

          {/* Tech Stack Bar */}
          <div className="text-[11px] text-white/80 pt-1.5 border-t border-white/10 flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-white">Stack:</span>
            <span className="text-white/70">React · Next.js · Node.js · FastAPI · AWS</span>
          </div>
        </div>

        {/* Notifications List (Liquid Glass Cards) */}
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Bell className="w-3.5 h-3.5 text-rose-400" /> Recent Accomplishments
          </div>

          {notifications.map((n, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/10 border border-white/20 hover:border-white/35 hover:-translate-y-0.5 hover:bg-white/15 transition-all duration-200 cursor-pointer group shadow-sm backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 truncate">
                  <div className="p-1.5 rounded-xl bg-white/15 shrink-0 mt-0.5">
                    {n.icon}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                      {n.title}
                    </div>
                    <div className="text-[11px] text-white/70 truncate mt-0.5">
                      {n.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-white/50 shrink-0 font-mono">{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlighted Availability Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-400/35 flex items-center gap-3 backdrop-blur-2xl">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="text-xs font-semibold text-emerald-200 leading-snug">
            Currently available for SDE / Full Stack / AI Engineering opportunities.
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              onOpenWindow("resume");
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors border border-blue-400/30"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume</span>
          </button>

          <button
            onClick={() => {
              onOpenWindow("projects");
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
          >
            <Folder className="w-4 h-4 text-blue-400" />
            <span>View Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
}
