"use client";

import React, { useState, useRef, useEffect } from "react";

interface CommandLog {
  cmd: string;
  output: React.ReactNode;
}

export default function TerminalWindow() {
  const [inputVal, setInputVal] = useState("");
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
            { category: "Frontend", techs: "React, Next.js 15, TypeScript, WebGL (OGL)" },
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
          <div className="text-white/40 text-[11px]">Type &apos;help&apos; to see all interactive terminal commands.</div>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    const lowerCmd = rawCmd.toLowerCase();
    let out: React.ReactNode = null;

    if (lowerCmd === "help") {
      out = (
        <div className="flex flex-col gap-1 text-white/80 my-1">
          <div>Available commands:</div>
          <div><span className="text-emerald-400">skills</span> - Display full stack skills</div>
          <div><span className="text-emerald-400">projects</span> - List top production projects</div>
          <div><span className="text-emerald-400">cat resume</span> - Print resume summary</div>
          <div><span className="text-emerald-400">whoami</span> - Print user bio & credentials</div>
          <div><span className="text-emerald-400">sudo hire_harsh</span> - Execute hiring authorization</div>
          <div><span className="text-emerald-400">clear</span> - Clear terminal output</div>
        </div>
      );
    } else if (lowerCmd === "skills") {
      out = (
        <div className="text-sky-300 my-1">
          TypeScript • Next.js 15 • React 19 • FastAPI • PostgreSQL • Redis • Docker • AWS • LangChain • Tailwind CSS
        </div>
      );
    } else if (lowerCmd === "projects") {
      out = (
        <div className="flex flex-col gap-1 text-white/90 my-1">
          <div>1. <span className="text-blue-400 font-bold">ClinicOS</span> — Healthcare Practice Management</div>
          <div>2. <span className="text-blue-400 font-bold">MoxSend</span> — Autonomous Cold Email AI Platform</div>
          <div>3. <span className="text-blue-400 font-bold">EduCore ERP</span> — University Resource Planning</div>
        </div>
      );
    } else if (lowerCmd === "cat resume" || lowerCmd === "cat resume.txt") {
      out = (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white/90 my-1">
          <div><span className="font-bold text-emerald-400">Harsh Srivastava</span> — AWS Certified Solutions Architect</div>
          <div className="text-white/70">VIT&apos;27 CSE • GSoC&apos;24 Contributor • 5× Hackathon Winner</div>
          <div className="text-white/60 text-[11px] mt-1">Email: Harrshh077@gmail.com • Web: harshsrivastava.in</div>
        </div>
      );
    } else if (lowerCmd === "whoami") {
      out = (
        <div className="text-emerald-400 my-1">
          harsh_srivastava (AWS Certified Solutions Architect & Full Stack Developer)
        </div>
      );
    } else if (lowerCmd.includes("sudo hire_harsh") || lowerCmd.includes("hire")) {
      out = (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 my-1 font-bold">
          [SUCCESS] Access Granted! Harsh Srivastava is available for Full Stack & AI Engineering roles. Contact: Harrshh077@gmail.com
        </div>
      );
    } else if (lowerCmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else {
      out = (
        <div className="text-rose-400 my-1">
          zsh: command not found: {rawCmd}. Type &apos;help&apos; for available commands.
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
          Last login: Sun Aug 9 02:40:00 on ttys001 • zsh 5.9
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
          placeholder="type 'help'..."
          className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder-white/30"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
