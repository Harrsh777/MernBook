"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Folder, Briefcase, Award, Sparkles, Terminal, FileText, ArrowRight } from "lucide-react";
import { WindowId } from "@/lib/windowStore";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

interface SearchResult {
  title: string;
  category: string;
  icon: React.ReactNode;
  windowId: WindowId;
  description: string;
}

export default function SpotlightSearch({ isOpen, onClose, onOpenWindow }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: SearchResult[] = [
    {
      title: "ClinicOS Healthcare Platform",
      category: "Featured Project",
      icon: <Folder className="w-4 h-4 text-blue-400" />,
      windowId: "projects",
      description: "AI-driven clinic practice management and automated patient scheduling system",
    },
    {
      title: "MoxSend Cold Email SaaS",
      category: "Featured Project",
      icon: <Folder className="w-4 h-4 text-blue-400" />,
      windowId: "projects",
      description: "Autonomous multi-agent outreach platform built with Next.js 15 & LangChain",
    },
    {
      title: "AWS Certified Solutions Architect",
      category: "Certification",
      icon: <Award className="w-4 h-4 text-amber-400" />,
      windowId: "certifications",
      description: "Official AWS Associate Accreditation (Score 953/1000)",
    },
    {
      title: "BUILD AI ENGINE — Full Stack & AI Intern",
      category: "Work Experience",
      icon: <Briefcase className="w-4 h-4 text-sky-400" />,
      windowId: "experience",
      description: "Architecting autonomous AI receptionist and cold email microservices",
    },
    {
      title: "MP Police Cyber Security Division",
      category: "Work Experience",
      icon: <Briefcase className="w-4 h-4 text-rose-400" />,
      windowId: "experience",
      description: "Digital forensic threat analysis and Python security automation",
    },
    {
      title: "Google Summer of Code (GSoC 2024)",
      category: "Work Experience",
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      windowId: "experience",
      description: "Open-source developer infrastructure contributor",
    },
    {
      title: "Top 10 AI & Fullstack Engineering Blogs",
      category: "Safari Articles",
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      windowId: "safari",
      description: "Curated architecture breakdowns and AI agent guides",
    },
    {
      title: "Tech Stack Shell (zsh)",
      category: "Terminal CLI",
      icon: <Terminal className="w-4 h-4 text-green-400" />,
      windowId: "terminal",
      description: "Interactive command line interface with custom bash scripts",
    },
    {
      title: "Harsh Srivastava Resume (PDF)",
      category: "Document",
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      windowId: "resume",
      description: "Official 1-page software engineer resume & achievements",
    },
  ];

  const filtered = query.trim() === ""
    ? items
    : items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === " ") {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpenWindow("finder");
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        onOpenWindow(filtered[selectedIndex].windowId);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onOpenWindow]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999990] bg-black/30 backdrop-blur-xs flex items-start justify-center pt-[15vh] px-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl apple-glass-panel rounded-2xl overflow-hidden text-white flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Spotlight Search Bar */}
        <div className="p-4 border-b border-white/15 flex items-center gap-3">
          <Search className="w-5 h-5 text-white/70 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Spotlight Search (Cmd + Space)..."
            className="w-full bg-transparent text-lg font-medium text-white placeholder-white/50 focus:outline-none"
          />
        </div>

        {/* Search Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2.5 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-white/50">
              No Spotlight results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onOpenWindow(item.windowId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    isSelected ? "bg-white/25 text-white shadow-md border border-white/30" : "hover:bg-white/10 text-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2 rounded-lg bg-white/15 shrink-0">{item.icon}</div>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{item.title}</div>
                      <div
                        className={`text-[11px] truncate ${
                          isSelected ? "text-white/90" : "text-white/50"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        isSelected ? "bg-white/30 text-white" : "bg-white/10 text-white/60"
                      }`}
                    >
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 bg-white/10 border-t border-white/15 text-[11px] text-white/60 flex justify-between items-center">
          <span>Navigation: ↑ ↓ Arrow Keys</span>
          <span>Select: Enter ↵</span>
        </div>
      </div>
    </div>
  );
}
