"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Github, Globe, Linkedin, Twitter, Mail, Copy, Check, Send, Sparkles } from "lucide-react";

export default function ContactWindow() {
  const [copied, setCopied] = useState(false);
  const email = "Harrshh077@gmail.com";

  // Form state
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !senderEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSentSuccess(true);
      setSenderName("");
      setSenderEmail("");
      setMessage("");
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1000);
  };

  const cards = [
    {
      name: "Email Me",
      bg: "bg-[#8b5cf6] hover:bg-[#7c3aed]",
      icon: <Mail className="w-5 h-5 text-white" />,
      url: `mailto:${email}`,
    },
    {
      name: "Github",
      bg: "bg-[#f43f5e] hover:bg-[#e11d48]",
      icon: <Github className="w-5 h-5 text-white" />,
      url: "https://github.com/Harrsh777",
    },
    {
      name: "Platform",
      bg: "bg-[#22c55e] hover:bg-[#16a34a]",
      icon: <Globe className="w-5 h-5 text-white" />,
      url: "https://www.harshsrivastava.in",
    },
    {
      name: "Twitter/X",
      bg: "bg-[#ff6b4a] hover:bg-[#ea580c]",
      icon: <Twitter className="w-5 h-5 text-white" />,
      url: "https://twitter.com/harrshh",
    },
    {
      name: "LinkedIn",
      bg: "bg-[#0ea5e9] hover:bg-[#0284c7]",
      icon: <Linkedin className="w-5 h-5 text-white" />,
      url: "https://www.linkedin.com/in/harrshh",
    },
  ];

  return (
    <div className="h-full w-full bg-transparent p-5 md:p-7 flex flex-col justify-between select-none overflow-y-auto backdrop-blur-2xl">
      <div className="flex flex-col gap-5">
        {/* Upper Header Profile */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
            <Image
              src="/profile.jpg"
              alt="Harsh Srivastava"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Let&apos;s Connect
            </h2>
            <p className="text-xs text-white/70 font-normal">
              Got an opportunity, project, or technical query? Write to Harsh directly.
            </p>
          </div>
        </div>

        {/* Email & Social Copy Section */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-3">
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
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Quick Note Form */}
        <form onSubmit={handleSendMessage} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" /> Direct Message / Recruiter Note
            </span>
            <span className="text-[10px] text-white/40 font-normal">Instant Dispatch</span>
          </div>

          {sentSuccess ? (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>Thank you! Your message has been dispatched to Harsh. He will reply shortly.</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Your Email *"
                  className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />
              </div>

              <textarea
                required
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your note or role description..."
                className="bg-white/10 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting || !message.trim() || !senderEmail.trim()}
                className="self-end px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Sending..." : "Send Note"}</span>
              </button>
            </>
          )}
        </form>
      </div>

      {/* 5 Colored Social & Contact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
        {cards.map((card) => (
          <a
            key={card.name}
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${card.bg} h-20 p-3 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-md cursor-pointer group`}
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
