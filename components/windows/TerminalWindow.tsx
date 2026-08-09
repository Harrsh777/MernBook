"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWindowStore, WindowId } from "@/lib/windowStore";

interface CommandLog {
  cmd: string;
  output: React.ReactNode;
}

export default function TerminalWindow() {
  const { openWindow } = useWindowStore();
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>(["show tech stack"]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [history, setHistory] = useState<CommandLog[]>([
    {
      cmd: "show tech stack",
      output: (
        <div className="flex flex-col gap-2 my-2">
          <div className="grid grid-cols-12 border-b border-white/10 pb-1 text-white/50 font-semibold">
            <div className="col-span-1 text-center"></div>
            <div className="col-span-3 text-left">Category</div>
            <div className="col-span-8 text-left font-medium">Technologies</div>
          </div>
          {[
            { category: "Frontend", techs: "React 19, Next.js 15, TypeScript, WebGL (OGL)" },
            { category: "Styling", techs: "Tailwind CSS, Vanilla CSS, Framer Motion" },
            { category: "Backend", techs: "Node.js, Express, FastAPI, Python" },
            { category: "Database", techs: "PostgreSQL, Redis, MongoDB, Vector DBs" },
            { category: "Cloud & DevOps", techs: "AWS (Solutions Architect), Docker, Kubernetes, CI/CD" },
          ].map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 items-center py-0.5">
              <div className="col-span-1 text-center text-emerald-400 font-bold">✓</div>
              <div className="col-span-3 text-emerald-400 font-medium">{row.category}</div>
              <div className="col-span-8 text-white/90">{row.techs}</div>
            </div>
          ))}
          <div className="text-emerald-400 font-medium mt-2">✓ 5 of 5 stacks loaded successfully (100%)</div>
          <div className="text-white/40 text-[11px]">
            Type &apos;help&apos; for available commands. Try &apos;open projects&apos; or press Tab to auto-complete.
          </div>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableCmds = [
    "help",
    "skills",
    "projects",
    "cat resume",
    "whoami",
    "sudo hire_harsh",
    "open projects",
    "open safari",
    "open contact",
    "open music",
    "open resume",
    "open certifications",
    "open experience",
    "open calculator",
    "open settings",
    "open trash",
    "open finder",
    "open siri",
    "ls",
    "pwd",
    "date",
    "clear",
    "history",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!inputVal.trim()) return;
      const match = availableCmds.find((c) => c.startsWith(inputVal.toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    setCmdHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const lowerCmd = rawCmd.toLowerCase();
    let out: React.ReactNode = null;

    if (lowerCmd === "help") {
      out = (
        <div className="flex flex-col gap-1 text-white/80 my-1">
          <div className="font-semibold text-emerald-300">Available commands:</div>
          <div><span className="text-emerald-400 font-bold">skills</span> — Display full stack skills</div>
          <div><span className="text-emerald-400 font-bold">projects</span> — List top production projects</div>
          <div><span className="text-emerald-400 font-bold">cat resume</span> — Print resume summary</div>
          <div><span className="text-emerald-400 font-bold">whoami</span> — Print user bio & credentials</div>
          <div><span className="text-emerald-400 font-bold">open &lt;app&gt;</span> — Open app window (e.g. open projects, open music, open contact)</div>
          <div><span className="text-emerald-400 font-bold">ls / pwd / date</span> — Standard Unix shell utils</div>
          <div><span className="text-emerald-400 font-bold">sudo hire_harsh</span> — Execute hiring authorization</div>
          <div><span className="text-emerald-400 font-bold">clear</span> — Clear terminal output</div>
        </div>
      );
    } else if (lowerCmd === "skills") {
      out = (
        <div className="text-sky-300 my-1 leading-relaxed">
          TypeScript • Next.js 15 • React 19 • FastAPI • Node.js • PostgreSQL • Redis • Docker • AWS Solutions Architect • LangChain • Tailwind CSS
        </div>
      );
    } else if (lowerCmd === "projects") {
      out = (
        <div className="flex flex-col gap-1 text-white/90 my-1">
          <div>1. <span className="text-blue-400 font-bold">ClinicOS</span> — AI Healthcare Practice Management</div>
          <div>2. <span className="text-blue-400 font-bold">MoxSend</span> — Autonomous Cold Email Outreach Platform</div>
          <div>3. <span className="text-blue-400 font-bold">EduCore ERP</span> — Multi-Tenant Institution OS</div>
          <div>4. <span className="text-blue-400 font-bold">SafeSurf Jr</span> — AI Cybersecurity & Child Safety</div>
          <div className="text-white/50 text-[11px] mt-1">Tip: Type &apos;open projects&apos; to view full interactive grid.</div>
        </div>
      );
    } else if (lowerCmd === "cat resume" || lowerCmd === "cat resume.txt") {
      out = (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white/90 my-1">
          <div><span className="font-bold text-emerald-400">Harsh Srivastava</span> — AWS Certified Solutions Architect (Score 953)</div>
          <div className="text-white/70">VIT&apos;27 CSE • GSoC&apos;24 Contributor • 5× Hackathon Winner</div>
          <div className="text-white/60 text-[11px] mt-1">Email: Harrshh077@gmail.com • Web: harshsrivastava.in</div>
        </div>
      );
    } else if (lowerCmd === "whoami") {
      out = (
        <div className="text-emerald-400 my-1">
          harsh_srivastava (AWS Certified Solutions Architect & Full Stack Engineer)
        </div>
      );
    } else if (lowerCmd.startsWith("open ")) {
      const targetApp = lowerCmd.replace("open ", "").trim();
      const validWindows: Record<string, WindowId> = {
        projects: "projects",
        safari: "safari",
        contact: "contact",
        music: "music",
        resume: "resume",
        certifications: "certifications",
        certs: "certifications",
        experience: "experience",
        calculator: "calculator",
        settings: "settings",
        trash: "trash",
        finder: "finder",
        siri: "siri",
        terminal: "terminal",
      };

      const wId = validWindows[targetApp];
      if (wId) {
        openWindow(wId);
        out = (
          <div className="text-emerald-400 my-1">
            [SUCCESS] Launching &apos;{targetApp}&apos; window on desktop...
          </div>
        );
      } else {
        out = (
          <div className="text-rose-400 my-1">
            zsh: app not found: &apos;{targetApp}&apos;. Available: projects, safari, contact, music, resume, certifications, experience, calculator, settings.
          </div>
        );
      }
    } else if (lowerCmd === "ls") {
      out = (
        <div className="grid grid-cols-4 gap-2 text-sky-300 my-1 font-mono">
          <span>Projects/</span>
          <span>Experience/</span>
          <span>Certifications/</span>
          <span>Resume.pdf</span>
          <span>ClinicOS/</span>
          <span>MoxSend/</span>
          <span>TechStack.json</span>
          <span>Contact.info</span>
        </div>
      );
    } else if (lowerCmd === "pwd") {
      out = <div className="text-white/80 my-1">/Users/harshsrivastava/portfolio</div>;
    } else if (lowerCmd === "date") {
      out = <div className="text-white/80 my-1">{new Date().toString()}</div>;
    } else if (lowerCmd === "history") {
      out = (
        <div className="flex flex-col gap-0.5 text-white/70 my-1 font-mono">
          {cmdHistory.map((cmd, i) => (
            <div key={i}>
              <span className="text-white/40 w-8 inline-block">{i + 1}</span> {cmd}
            </div>
          ))}
        </div>
      );
    } else if (lowerCmd.includes("sudo hire_harsh") || lowerCmd.includes("hire")) {
      out = (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 my-1 font-bold">
          [SUCCESS] Authorization Granted! Harsh Srivastava is ready for SDE, Full Stack & AI Engineering roles. Contact: Harrshh077@gmail.com
        </div>
      );
    } else if (lowerCmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else {
      out = (
        <div className="text-rose-400 my-1">
          zsh: command not found: {rawCmd}. Type &apos;help&apos; or press Tab for suggestions.
        </div>
      );
    }

    setHistory((prev) => [...prev, { cmd: rawCmd, output: out }]);
    setInputVal("");
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full w-full bg-transparent p-5 font-mono text-xs text-white/90 select-text overflow-y-auto leading-relaxed flex flex-col justify-between backdrop-blur-2xl"
    >
      <div>
        {/* Terminal Header */}
        <div className="text-white/40 text-[11px] mb-4">
          Last login: {new Date().toLocaleDateString()} on ttys001 • zsh 5.9
        </div>

        {/* Command Output Logs */}
        {history.map((item, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 font-bold">harsh %</span>
              <span className="text-white">{item.cmd}</span>
            </div>
            {item.output}
          </div>
        ))}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-4 pt-2 border-t border-white/10">
        <span className="text-emerald-400 font-bold">harsh %</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help' or 'open projects'..."
          className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder-white/30"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
