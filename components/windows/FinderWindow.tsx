"use client";

import React, { useState } from "react";
import { Folder, User, FileText, Trash2, Globe, Image as ImageIcon, Search, Award, Briefcase } from "lucide-react";
import { WindowId } from "@/lib/windowStore";

interface FinderWindowProps {
  onOpenWindow?: (id: WindowId) => void;
}

export default function FinderWindow({ onOpenWindow }: FinderWindowProps) {
  const [activeFolder, setActiveFolder] = useState<string>("Work");

  const filesByFolder: Record<
    string,
    Array<{ name: string; type: "web" | "txt" | "fig" | "img"; action?: () => void }>
  > = {
    Work: [
      {
        name: "clinicos-platform.com",
        type: "web",
        action: () => onOpenWindow?.("projects"),
      },
      {
        name: "ClinicOS_Overview.txt",
        type: "txt",
        action: () => onOpenWindow?.("projects"),
      },
      {
        name: "MoxSend_AI_Outreach.txt",
        type: "txt",
        action: () => onOpenWindow?.("projects"),
      },
      {
        name: "EduCore_ERP.fig",
        type: "fig",
        action: () => onOpenWindow?.("projects"),
      },
      {
        name: "architecture_diagram.png",
        type: "img",
        action: () => onOpenWindow?.("projects"),
      },
    ],
    Experience: [
      {
        name: "BUILD_AI_ENGINE_Role.txt",
        type: "txt",
        action: () => onOpenWindow?.("experience"),
      },
      {
        name: "EaseHawk_FullStack.txt",
        type: "txt",
        action: () => onOpenWindow?.("experience"),
      },
      {
        name: "mytripgoals_Architect.txt",
        type: "txt",
        action: () => onOpenWindow?.("experience"),
      },
      {
        name: "MP_Police_CyberSecurity.txt",
        type: "txt",
        action: () => onOpenWindow?.("experience"),
      },
      {
        name: "GSoC_2024_Contribution.txt",
        type: "txt",
        action: () => onOpenWindow?.("experience"),
      },
    ],
    Certifications: [
      {
        name: "AWS_Certified_Solutions_Architect.png",
        type: "img",
        action: () => onOpenWindow?.("certifications"),
      },
      {
        name: "Research_Paper_IJFMR.pdf",
        type: "txt",
        action: () => onOpenWindow?.("certifications"),
      },
      {
        name: "Cyber_Security_Certificate.png",
        type: "img",
        action: () => onOpenWindow?.("certifications"),
      },
    ],
    "About me": [
      {
        name: "Harsh_Srivastava_Bio.txt",
        type: "txt",
        action: () => onOpenWindow?.("contact"),
      },
      {
        name: "Profile_Photo.png",
        type: "img",
        action: () => onOpenWindow?.("contact"),
      },
    ],
    Resume: [
      {
        name: "Harsh_Srivastava_Resume.pdf",
        type: "txt",
        action: () => onOpenWindow?.("resume"),
      },
      {
        name: "LeetCode_150_Days.txt",
        type: "txt",
        action: () => onOpenWindow?.("resume"),
      },
    ],
    Trash: [
      {
        name: "old_portfolio_v1.zip",
        type: "txt",
        action: () => onOpenWindow?.("trash"),
      },
    ],
  };

  const currentFiles = filesByFolder[activeFolder] || filesByFolder["Work"];

  return (
    <div className="flex h-full w-full bg-transparent text-white text-xs select-none">
      {/* Left Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-3 flex flex-col gap-4 backdrop-blur-2xl">
        {/* Favorites Section */}
        <div>
          <div className="text-[11px] font-semibold text-white/40 mb-1.5 px-2 tracking-wider">
            Favorites
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setActiveFolder("Work")}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-left transition-colors ${
                activeFolder === "Work" ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Folder className="w-4 h-4 text-blue-400" />
              <span>Work</span>
            </button>
            <button
              onClick={() => {
                setActiveFolder("Experience");
                onOpenWindow?.("experience");
              }}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-left transition-colors ${
                activeFolder === "Experience" ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Briefcase className="w-4 h-4 text-sky-400" />
              <span>Experience</span>
            </button>
            <button
              onClick={() => {
                setActiveFolder("Certifications");
                onOpenWindow?.("certifications");
              }}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-left transition-colors ${
                activeFolder === "Certifications" ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certifications</span>
            </button>
            <button
              onClick={() => setActiveFolder("About me")}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-left transition-colors ${
                activeFolder === "About me" ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>About me</span>
            </button>
            <button
              onClick={() => setActiveFolder("Resume")}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-left transition-colors ${
                activeFolder === "Resume" ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Resume</span>
            </button>
            <button
              onClick={() => {
                setActiveFolder("Trash");
                onOpenWindow?.("trash");
              }}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-left transition-colors ${
                activeFolder === "Trash" ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Trash</span>
            </button>
          </div>
        </div>

        {/* Work Sub-Folders */}
        <div>
          <div className="text-[11px] font-semibold text-white/40 mb-1.5 px-2 tracking-wider">
            Projects
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => {
                setActiveFolder("Work");
                onOpenWindow?.("projects");
              }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-white/70 hover:bg-white/10 text-left"
            >
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">ClinicOS</span>
            </button>
            <button
              onClick={() => {
                setActiveFolder("Work");
                onOpenWindow?.("projects");
              }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-white/70 hover:bg-white/10 text-left"
            >
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">MoxSend</span>
            </button>
            <button
              onClick={() => {
                setActiveFolder("Work");
                onOpenWindow?.("projects");
              }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md font-medium text-white/70 hover:bg-white/10 text-left"
            >
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">EduCore ERP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-transparent p-6 flex flex-col justify-between backdrop-blur-2xl">
        <div>
          {/* Top Bar inside Finder */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="text-sm font-semibold text-white/90">{activeFolder}</div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-md text-white/70 text-xs">
              <Search className="w-3.5 h-3.5" />
              <span>Search {activeFolder}...</span>
            </div>
          </div>

          {/* Grid of File Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {currentFiles.map((file, idx) => (
              <div
                key={idx}
                onClick={file.action}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/15 cursor-pointer transition-all border border-transparent hover:border-white/20 shadow-sm"
              >
                {/* Icon Rendering */}
                {file.type === "web" && (
                  <div className="w-14 h-14 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <Globe className="w-8 h-8" />
                  </div>
                )}
                {file.type === "txt" && (
                  <div className="w-14 h-14 rounded-xl bg-slate-500/20 border border-slate-400/30 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
                {file.type === "fig" && (
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <span className="font-bold text-lg">F</span>
                  </div>
                )}
                {file.type === "img" && (
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}

                <span className="text-center font-medium text-white/90 group-hover:text-white line-clamp-2 break-all">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer status bar */}
        <div className="pt-4 border-t border-white/10 text-white/50 text-[11px] flex justify-between">
          <span>{currentFiles.length} items</span>
          <span>Available: 420.5 GB</span>
        </div>
      </div>
    </div>
  );
}
