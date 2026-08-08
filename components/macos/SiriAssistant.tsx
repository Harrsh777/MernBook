"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MessageSquare, ArrowRight, Sparkles, Send, Mic } from "lucide-react";

interface SiriAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SiriAssistant({ isOpen, onClose }: SiriAssistantProps) {
  const [response, setResponse] = useState<string>(
    "Hi, I'm Siri — Harsh's AI Portfolio Assistant. Ask me anything about his projects, AWS certifications, experience, or skills!"
  );
  const [isThinking, setIsThinking] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  if (!isOpen) return null;

  const prompts = [
    {
      q: "Who is Harsh Srivastava?",
      a: "Harsh Srivastava is an AWS Certified Solutions Architect, Full-Stack & AI Engineer, Computer Science student at VIT ('27), GSoC '24 contributor, and 5× Hackathon Winner specializing in Next.js 15, FastAPI, Docker, and Autonomous AI Agents.",
    },
    {
      q: "What are his top featured projects?",
      a: "His top production platforms include ClinicOS (AI-driven healthcare practice management & automated patient scheduling), MoxSend (autonomous multi-agent cold email SaaS), and EduCore ERP (university resource planning).",
    },
    {
      q: "Tell me about his AWS Certification score",
      a: "Harsh achieved the official AWS Certified Solutions Architect - Associate accreditation with an outstanding score of 953/1000, mastering cloud architecture, ECS Fargate, IAM security, and auto-scaling microservices.",
    },
    {
      q: "How can I contact or hire Harsh?",
      a: "You can email him directly at Harrshh077@gmail.com, view his resume PDF in the portfolio, or connect via GitHub (@Harrsh777) and LinkedIn (@harrshh). He is currently open for SDE and Full Stack engineering roles!",
    },
  ];

  const handleSelectQuestion = (q: string, answer: string) => {
    if (isThinking) return;
    setActiveQuestion(q);
    setIsThinking(true);

    setTimeout(() => {
      setResponse(answer);
      setIsThinking(false);
      setActiveQuestion(null);
    }, 4000); // Exact 4-second processing delay requested by user
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isThinking) return;

    const query = customInput.trim();
    setCustomInput("");
    setActiveQuestion(query);
    setIsThinking(true);

    // Find best match or default answer
    const matched = prompts.find(
      (p) =>
        p.q.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(p.q.toLowerCase())
    );

    const targetAnswer = matched
      ? matched.a
      : `Based on Harsh's records: Harsh Srivastava is a Full-Stack & AI Engineer specializing in Next.js 15, FastAPI, and AWS Cloud Architecture. Contact him directly at Harrshh077@gmail.com!`;

    setTimeout(() => {
      setResponse(targetAnswer);
      setIsThinking(false);
      setActiveQuestion(null);
    }, 4000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999995] bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg apple-glass-panel rounded-[32px] p-6 text-white flex flex-col gap-4 animate-in zoom-in-95 duration-200"
      >
        {/* Siri Header with Glowing Waveform */}
        <div className="flex items-center justify-between pb-3 border-b border-white/15">
          <div className="flex items-center gap-3">
            {/* Glowing Siri Orb Container */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden p-0.5 shadow-lg shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 animate-spin-slow rounded-full" />
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image src="/siri.png" alt="Siri" fill className="object-cover" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Siri AI Portfolio Assistant</span>
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </h3>
              <p className="text-[11px] text-white/60">
                {isThinking ? "Thinking & querying engineering database..." : "Ask Siri about Harsh Srivastava"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Answer Bubble or 4-Second Processing State */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl text-xs text-white/90 leading-relaxed min-h-[110px] flex flex-col justify-center relative overflow-hidden shadow-inner">
          {isThinking ? (
            <div className="flex flex-col items-center justify-center py-2 gap-3 animate-in fade-in duration-300">
              {/* Sound Wave Equalizer Spectrum */}
              <div className="flex items-end gap-1.5 h-6">
                {[60, 100, 45, 90, 70, 100, 50, 85].map((h, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${h}%` }}
                    className="w-1 bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full animate-pulse"
                  />
                ))}
              </div>

              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 animate-bounce" />
                <span>Siri is analyzing: &ldquo;{activeQuestion}&rdquo;...</span>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Siri Response
              </div>
              <p className="text-xs text-white/90 leading-relaxed">{response}</p>
            </div>
          )}
        </div>

        {/* Custom Input Search Form */}
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isThinking}
            placeholder="Ask Siri a question..."
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-white/40 backdrop-blur-md transition-colors"
          />
          <button
            type="submit"
            disabled={isThinking || !customInput.trim()}
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Question Prompts */}
        <div>
          <div className="text-[11px] font-semibold text-white/60 mb-2 uppercase tracking-wider px-1">
            Suggested Questions
          </div>
          <div className="flex flex-col gap-1.5">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                disabled={isThinking}
                onClick={() => handleSelectQuestion(p.q, p.a)}
                className={`w-full p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs text-white/90 hover:text-white flex items-center justify-between transition-all backdrop-blur-md group ${
                  isThinking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span className="truncate">{p.q}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-300 shrink-0 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
