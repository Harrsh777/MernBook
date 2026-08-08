"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Github, Globe, Linkedin, Twitter, Mail, Copy, Check } from "lucide-react";

export default function ContactWindow() {
  const [copied, setCopied] = useState(false);
  const email = "Harrshh077@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cards = [
    {
      name: "Email Me",
      bg: "bg-[#8b5cf6] hover:bg-[#7c3aed]",
      icon: <Mail className="w-6 h-6 text-white" />,
      url: `mailto:${email}`,
    },
    {
      name: "Github",
      bg: "bg-[#f43f5e] hover:bg-[#e11d48]",
      icon: <Github className="w-6 h-6 text-white" />,
      url: "https://github.com/Harrsh777",
    },
    {
      name: "Platform",
      bg: "bg-[#22c55e] hover:bg-[#16a34a]",
      icon: <Globe className="w-6 h-6 text-white" />,
      url: "https://www.harshsrivastava.in",
    },
    {
      name: "Twitter/X",
      bg: "bg-[#ff6b4a] hover:bg-[#ea580c]",
      icon: <Twitter className="w-6 h-6 text-white" />,
      url: "https://twitter.com/harrshh",
    },
    {
      name: "LinkedIn",
      bg: "bg-[#0ea5e9] hover:bg-[#0284c7]",
      icon: <Linkedin className="w-6 h-6 text-white" />,
      url: "https://www.linkedin.com/in/harrshh",
    },
  ];

  return (
    <div className="h-full w-full bg-transparent p-6 md:p-8 flex flex-col justify-between select-none overflow-y-auto backdrop-blur-2xl">
      {/* Upper Content */}
      <div className="flex flex-col gap-4">
        {/* Profile Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
          <Image
            src="/profile.jpg"
            alt="Harsh Srivastava"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Let&apos;s Connect
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-white/70 max-w-md font-normal leading-relaxed">
          Got an idea? A bug to squash? Or just wanna talk tech? I&apos;m in.
        </p>

        {/* Dedicated Email Display Card */}
        <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-3 max-w-md">
          <div className="flex items-center gap-2.5 truncate">
            <Mail className="w-4 h-4 text-purple-400 shrink-0" />
            <a
              href={`mailto:${email}`}
              className="text-xs font-semibold text-white hover:text-purple-300 transition-colors truncate"
            >
              {email}
            </a>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Colored Social & Contact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
        {cards.map((card) => (
          <a
            key={card.name}
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${card.bg} h-24 p-3 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-md cursor-pointer group`}
          >
            <div>{card.icon}</div>
            <div className="text-xs font-semibold text-white tracking-wide truncate">
              {card.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
