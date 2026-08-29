"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Github,
  Award,
  Briefcase,
  Folder,
  FileText,
  Terminal as TerminalIcon,
  Music,
  Calculator,
  MessageCircle,
  Settings,
  Camera,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Send,
  Check,
  Copy,
  ChevronRight,
  Download,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Search,
  Globe,
  Sliders,
  Bell,
  Smartphone,
  Info,
} from "lucide-react";
import { iosHaptics } from "@/lib/iosHaptics";

// ==========================================
// 1. PROJECTS APP
// ==========================================
export function ProjectsApp() {
  const [selectedTag, setSelectedTag] = useState("All");

  const projects = [
    {
      title: "ClinicOS",
      tagline: "AI-Powered Healthcare & Practice Growth Platform",
      description:
        "AI-powered clinic growth platform with WhatsApp receptionist, teleconsultation, billing, reminders, and automated patient management.",
      tech: ["Next.js", "TypeScript", "PostgreSQL", "WhatsApp API", "OpenAI"],
      img: "/clinicos.png",
      demoUrl: "https://www.harshsrivastava.in",
      githubUrl: "https://github.com/Harrsh777",
      category: "AI",
    },
    {
      title: "MoxSend",
      tagline: "Autonomous AI Cold Email Outreach Platform",
      description:
        "AI cold email outreach platform featuring automated inbox warm-up, dynamic AI email personalization, campaign analytics, and deliverability optimization.",
      tech: ["Next.js", "FastAPI", "Redis", "Docker", "LangChain", "MongoDB"],
      img: "/moxsend.png",
      demoUrl: "https://www.harshsrivastava.in",
      githubUrl: "https://github.com/Harrsh777",
      category: "AI",
    },
    {
      title: "EduCore ERP",
      tagline: "Multi-Tenant Educational Institution OS",
      description:
        "Multi-tenant school ERP with automated timetable generation, real-time student attendance tracking, fee management, and executive analytics dashboards.",
      tech: ["Next.js", "PostgreSQL", "AWS", "Express.js", "Tailwind CSS"],
      img: "/educore.png",
      demoUrl: "https://www.educorerp.in/",
      githubUrl: "https://github.com/Harrsh777",
      category: "Full Stack",
    },
    {
      title: "SafeSurf Jr",
      tagline: "AI Cybersecurity & Child Safety Platform",
      description:
        "AI-powered child safety platform catching online threats and offensive content before children encounter them.",
      tech: ["React", "Node.js", "Machine Learning", "Cybersecurity", "Python"],
      img: "/safesu.png",
      demoUrl: "https://github.com/Harrsh777/SafeSurfJr",
      githubUrl: "https://github.com/Harrsh777/SafeSurfJr",
      category: "Security",
    },
    {
      title: "SDPL Supply Chain",
      tagline: "Enterprise Distribution & Logistics System",
      description:
        "Comprehensive supply chain platform moving enterprise distribution firms off legacy spreadsheets onto one live management system.",
      tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      img: "/sdpl.png",
      demoUrl: "https://sdpl.vercel.app/",
      githubUrl: "https://github.com/Harrsh777",
      category: "Full Stack",
    },
  ];

  const tags = ["All", "AI", "Full Stack", "Security"];
  const filtered = selectedTag === "All" ? projects : projects.filter((p) => p.category === selectedTag);

  return (
    <div className="p-4 space-y-4 pb-20 text-white font-sans">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              iosHaptics.tap();
              setSelectedTag(tag);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === tag
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white/10 text-white/70 hover:bg-white/15"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {filtered.map((proj, idx) => (
          <div
            key={idx}
            className="bg-[#1c1c1e] border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-white/20 transition-all"
          >
            {proj.img && (
              <div className="relative w-full h-36 bg-black/40">
                <Image src={proj.img} alt={proj.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent" />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-blue-400 border border-white/10">
                  {proj.category}
                </span>
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-base font-bold text-white">{proj.title}</h3>
              <p className="text-xs text-blue-400 font-medium">{proj.tagline}</p>
              <p className="text-xs text-white/70 leading-relaxed">{proj.description}</p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-white/60 border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-3">
                <a
                  href={proj.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. EXPERIENCE APP
// ==========================================
export function ExperienceApp() {
  const experiences = [
    {
      role: "Lead Full Stack & AI Architect",
      company: "ClinicOS Healthcare Platform",
      period: "2024 - Present",
      location: "Bangalore / Remote",
      highlights: [
        "Architected scalable AI-powered WhatsApp receptionist and patient record system serving 50+ clinics.",
        "Built HIPAA-compliant telehealth microservices using Next.js 15, PostgreSQL, and Node.js.",
      ],
      badge: "Current",
    },
    {
      role: "AI Systems & Backend Engineer",
      company: "MoxSend Platform",
      period: "2024",
      location: "Remote",
      highlights: [
        "Built distributed warm-up queue managing thousands of mailboxes with Redis & FastAPI.",
        "Reduced cold email bounce rates by 40% with AI deliverability heuristics.",
      ],
    },
    {
      role: "Full Stack Engineer Intern",
      company: "SolvIT Systems",
      period: "2023 - 2024",
      location: "Vellore",
      highlights: [
        "Developed responsive full-stack portals and authentication systems with React, Node, and Tailwind.",
        "Automated deployment workflows with GitHub Actions & AWS S3/CloudFront.",
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-20 text-white font-sans">
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/10 p-4 rounded-2xl border border-blue-500/20">
        <h2 className="text-sm font-bold text-white">Career Progression</h2>
        <p className="text-xs text-white/70 mt-1">
          Full Stack architectures, production AI applications, and cloud-native backends.
        </p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-white/10">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-[#161618] ring-4 ring-blue-500/20" />

            <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400">{exp.period}</span>
                {exp.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    {exp.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white">{exp.role}</h3>
              <p className="text-xs text-white/80 font-medium">{exp.company} • {exp.location}</p>
              <ul className="space-y-1 pt-1">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. RESUME APP
// ==========================================
export function ResumeApp() {
  return (
    <div className="p-4 space-y-4 pb-20 text-white font-sans">
      {/* Top Banner with Download Action */}
      <div className="bg-gradient-to-br from-indigo-600/30 via-blue-600/20 to-purple-600/20 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Harsh Srivastava</h2>
            <p className="text-xs text-blue-400 font-medium">AWS Solutions Architect • Full Stack</p>
          </div>
          <a
            href="/Harsh_Resume.pdf"
            download="Harsh_Srivastava_Resume.pdf"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-blue-500/30 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </a>
        </div>
        <p className="text-xs text-white/70">
          Vellore Institute of Technology (VIT &apos;27) • Computer Science & Engineering
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 space-y-2">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Summary</h3>
        <p className="text-xs text-white/80 leading-relaxed">
          AWS Certified Solutions Architect & Full-Stack Engineer with experience building high-scale distributed systems, autonomous AI agents, and enterprise ERP applications. 150-day LeetCode streak and 6+ hackathon victories.
        </p>
      </div>

      {/* Skills Matrix */}
      <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Technical Arsenal</h3>
        
        <div>
          <span className="text-[11px] font-semibold text-blue-400">Frontend & Mobile:</span>
          <p className="text-xs text-white/80 mt-0.5">Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Redux, GSAP</p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-purple-400">Backend & APIs:</span>
          <p className="text-xs text-white/80 mt-0.5">Node.js, Express, FastAPI, Python, RESTful APIs, GraphQL, WebSockets</p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-emerald-400">Cloud & DevOps:</span>
          <p className="text-xs text-white/80 mt-0.5">AWS (EC2, S3, RDS, Lambda, CloudFront), Docker, CI/CD, Redis, PostgreSQL, MongoDB</p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-amber-400">AI & LLMs:</span>
          <p className="text-xs text-white/80 mt-0.5">LangChain, OpenAI API, Anthropic Claude, Vector Embeddings, Autonomous Agents</p>
        </div>
      </div>

      {/* Education */}
      <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 space-y-2">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Education</h3>
        <p className="text-xs font-bold text-white">B.Tech in Computer Science and Engineering</p>
        <p className="text-xs text-white/70">Vellore Institute of Technology • 2023 - 2027</p>
      </div>
    </div>
  );
}

// ==========================================
// 4. CERTIFICATIONS APP (Apple Wallet Style)
// ==========================================
export function CertificationsApp() {
  const certs = [
    {
      title: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services (AWS)",
      code: "SAA-C03",
      gradient: "from-amber-600 via-orange-600 to-amber-700",
      pdf: "/AWS Certified Solutions Architect - Associate certificate.pdf",
    },
    {
      title: "Cisco Cybersecurity Essentials",
      issuer: "Cisco Networking Academy",
      code: "CISCO-SEC",
      gradient: "from-blue-600 via-cyan-600 to-teal-700",
      pdf: "/Research Paper Certificate.pdf",
    },
    {
      title: "DevNet Associate - Network Automation",
      issuer: "Cisco",
      code: "DEVNET",
      gradient: "from-purple-600 via-indigo-600 to-blue-700",
      pdf: null,
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-20 text-white font-sans">
      <div className="text-center pb-2">
        <h2 className="text-base font-bold text-white">Verified Credentials</h2>
        <p className="text-xs text-white/60">Official industry certifications & accreditations</p>
      </div>

      <div className="space-y-4">
        {certs.map((c, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-xl relative overflow-hidden border border-white/20`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="w-7 h-7 text-white drop-shadow-md" />
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                {c.code}
              </span>
            </div>

            <h3 className="text-base font-bold drop-shadow-sm leading-snug">{c.title}</h3>
            <p className="text-xs text-white/90 mt-1 font-medium">{c.issuer}</p>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-[11px] text-white/80 font-mono">ID: VERIFIED</span>
              {c.pdf && (
                <a
                  href={c.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg backdrop-blur-md transition-colors flex items-center gap-1"
                >
                  <span>View Doc</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. TERMINAL APP (Interactive Mobile Shell)
// ==========================================
export function TerminalApp() {
  const [history, setHistory] = useState<Array<{ cmd: string; out: string | React.ReactNode }>>([
    { cmd: "whoami", out: "Harsh Srivastava (AWS Certified Solutions Architect, Full Stack Developer)" },
    { cmd: "help", out: "Available: whoami, projects, skills, certs, contact, clear" },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    let response: React.ReactNode = "";

    if (trimmed === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (trimmed === "help") {
      response = "Commands: whoami, projects, skills, certs, contact, clear, date";
    } else if (trimmed === "whoami") {
      response = "Harsh Srivastava • Full Stack & AI Developer • VIT'27";
    } else if (trimmed === "projects") {
      response = "• ClinicOS (AI Clinic Growth)\n• MoxSend (Cold Email AI)\n• EduCore ERP (School Management)\n• SafeSurf Jr (Cybersecurity)";
    } else if (trimmed === "skills") {
      response = "TypeScript, React, Next.js, Node.js, AWS, Python, PostgreSQL, Docker, Redis";
    } else if (trimmed === "certs") {
      response = "AWS Certified Solutions Architect - Associate (SAA-C03), Cisco Cybersecurity";
    } else if (trimmed === "contact") {
      response = "Email: Harrshh077@gmail.com | GitHub: @Harrsh777 | LinkedIn: @harrshh";
    } else if (trimmed === "date") {
      response = new Date().toString();
    } else {
      response = `Command not found: ${trimmed}. Type 'help' for options.`;
    }

    setHistory((prev) => [...prev, { cmd: cmdStr, out: response }]);
    setInputVal("");
  };

  return (
    <div className="p-4 flex flex-col h-full bg-[#0a0a0c] text-emerald-400 font-mono text-xs pb-20 select-text">
      {/* Terminal Title Bar */}
      <div className="text-white/40 pb-2 border-b border-white/10 text-[11px]">
        HarshOS Terminal v18.0 (zsh)
      </div>

      {/* Quick Action Pills */}
      <div className="flex gap-2 overflow-x-auto py-2 border-b border-white/10 scrollbar-none">
        {["help", "projects", "skills", "certs", "contact", "clear"].map((c) => (
          <button
            key={c}
            onClick={() => {
              iosHaptics.tap();
              handleCommand(c);
            }}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white/80 text-[10px] font-mono whitespace-nowrap"
          >
            {c}
          </button>
        ))}
      </div>

      {/* History Output */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="text-blue-400">harsh@iphone:~$</span>
              <span className="text-white font-semibold">{h.cmd}</span>
            </div>
            <div className="text-emerald-400 whitespace-pre-wrap pl-3">{h.out}</div>
          </div>
        ))}
      </div>

      {/* Input Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputVal.trim()) handleCommand(inputVal);
        }}
        className="flex items-center gap-2 pt-2 border-t border-white/10"
      >
        <span className="text-blue-400 font-bold shrink-0">harsh:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type a command..."
          className="flex-1 bg-transparent text-white outline-hidden font-mono text-xs"
          autoFocus
        />
        <button
          type="submit"
          className="px-2.5 py-1 rounded bg-emerald-600 text-black font-bold text-[10px]"
        >
          RUN
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 6. MUSIC APP (Apple Music Style)
// ==========================================
export function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [progress, setProgress] = useState(30);

  const playlist = [
    {
      title: "Lo-Fi Midnight Chill",
      artist: "Lo-Fi Beats • Harsh Srivastava",
      cover: "/a.jpg",
      duration: "2:45",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
    {
      title: "AWS Cloud Ambient Synth",
      artist: "Chillwave Tech",
      cover: "/a.jpg",
      duration: "3:12",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
    },
  ];

  const current = playlist[currentTrackIdx];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    iosHaptics.tap();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    iosHaptics.tap();
    setCurrentTrackIdx((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    iosHaptics.tap();
    setCurrentTrackIdx((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  return (
    <div className="p-6 flex flex-col items-center justify-between h-full bg-gradient-to-b from-[#241a2e] to-[#121214] text-white pb-20 select-none">
      <audio
        ref={audioRef}
        src={current.audioUrl}
        onEnded={nextTrack}
        autoPlay={isPlaying}
      />

      <div className="w-full flex items-center justify-between text-xs text-white/60">
        <span>PLAYING FROM PLAYLIST</span>
        <span className="font-semibold text-purple-400">Harsh Lofi</span>
      </div>

      {/* Big Album Art */}
      <div className="relative w-56 h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 my-4">
        <Image src={current.cover} alt={current.title} fill className="object-cover" />
      </div>

      {/* Track Info */}
      <div className="w-full text-left space-y-1">
        <h2 className="text-lg font-bold text-white truncate">{current.title}</h2>
        <p className="text-xs text-white/60 truncate">{current.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-1 my-2">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/40 font-mono">
          <span>1:12</span>
          <span>{current.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 w-full">
        <button onClick={prevTrack} className="text-white/70 hover:text-white transition-colors">
          <SkipBack className="w-7 h-7" />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl active:scale-95 transition-all"
        >
          {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
        </button>
        <button onClick={nextTrack} className="text-white/70 hover:text-white transition-colors">
          <SkipForward className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 7. MESSAGES / CONTACT APP (iMessage UI)
// ==========================================
export function MessagesApp() {
  const [messages, setMessages] = useState([
    {
      sender: "Harsh",
      text: "Hey! Welcome to my iOS portfolio. How can I help you build something awesome today?",
      time: "9:41 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);

  const email = "Harrshh077@gmail.com";

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    iosHaptics.tap();

    const userMsg = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: userMsg, time: "Just now" },
    ]);
    setInputText("");

    // Simulated quick reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "Harsh",
          text: `Thanks for writing! Feel free to email me directly at ${email} or connect on LinkedIn (@harrshh)!`,
          time: "Just now",
        },
      ]);
      iosHaptics.tap();
    }, 800);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    iosHaptics.tap();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white pb-20 font-sans">
      {/* iMessage Header */}
      <div className="p-3 bg-[#161618] border-b border-white/10 flex flex-col items-center">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-sm">
          <Image src="/profile.jpg" alt="Harsh" fill className="object-cover" />
        </div>
        <span className="text-xs font-bold text-white mt-1">Harsh Srivastava</span>
        <span className="text-[10px] text-white/50">iMessage</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 select-text">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-md ${
                m.sender === "You"
                  ? "bg-blue-500 text-white rounded-br-xs"
                  : "bg-[#2c2c2e] text-white/90 rounded-bl-xs"
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-white/40 mt-1 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      {/* Email Quick Copy Banner */}
      <div className="mx-4 mb-2 p-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
        <span className="text-xs text-white/80 truncate">{email}</span>
        <button
          onClick={copyEmail}
          className="px-2 py-1 rounded bg-white/10 text-[10px] font-semibold text-blue-400 flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* iMessage Input Bar */}
      <form
        onSubmit={sendMessage}
        className="p-3 bg-[#161618] border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="iMessage"
          className="flex-1 bg-[#2c2c2e] text-white rounded-full px-4 py-2 text-xs outline-hidden border border-white/10 placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-full bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 8. CALCULATOR APP
// ==========================================
export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [clearNext, setClearNext] = useState(false);

  const handleDigit = (digit: string) => {
    iosHaptics.tap();
    if (display === "0" || clearNext) {
      setDisplay(digit);
      setClearNext(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOp = (op: string) => {
    iosHaptics.tap();
    setPrevVal(parseFloat(display));
    setOperation(op);
    setClearNext(true);
  };

  const handleEquals = () => {
    iosHaptics.tap();
    if (prevVal === null || operation === null) return;
    const current = parseFloat(display);
    let res = 0;
    if (operation === "+") res = prevVal + current;
    if (operation === "-") res = prevVal - current;
    if (operation === "×") res = prevVal * current;
    if (operation === "÷") res = current !== 0 ? prevVal / current : 0;

    setDisplay(String(Number(res.toFixed(6))));
    setPrevVal(null);
    setOperation(null);
    setClearNext(true);
  };

  const handleClear = () => {
    iosHaptics.tap();
    setDisplay("0");
    setPrevVal(null);
    setOperation(null);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 justify-end pb-20 select-none font-sans">
      {/* Display */}
      <div className="text-right text-5xl font-light tracking-tight text-white mb-4 pr-2 font-mono truncate">
        {display}
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-3">
        <button onClick={handleClear} className="h-16 rounded-full bg-[#a5a5a5] text-black text-xl font-medium">AC</button>
        <button onClick={() => setDisplay(String(-parseFloat(display)))} className="h-16 rounded-full bg-[#a5a5a5] text-black text-xl font-medium">±</button>
        <button onClick={() => setDisplay(String(parseFloat(display) / 100))} className="h-16 rounded-full bg-[#a5a5a5] text-black text-xl font-medium">%</button>
        <button onClick={() => handleOp("÷")} className="h-16 rounded-full bg-[#ff9f0a] text-white text-2xl font-medium">÷</button>

        <button onClick={() => handleDigit("7")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">7</button>
        <button onClick={() => handleDigit("8")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">8</button>
        <button onClick={() => handleDigit("9")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">9</button>
        <button onClick={() => handleOp("×")} className="h-16 rounded-full bg-[#ff9f0a] text-white text-2xl font-medium">×</button>

        <button onClick={() => handleDigit("4")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">4</button>
        <button onClick={() => handleDigit("5")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">5</button>
        <button onClick={() => handleDigit("6")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">6</button>
        <button onClick={() => handleOp("-")} className="h-16 rounded-full bg-[#ff9f0a] text-white text-2xl font-medium">-</button>

        <button onClick={() => handleDigit("1")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">1</button>
        <button onClick={() => handleDigit("2")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">2</button>
        <button onClick={() => handleDigit("3")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">3</button>
        <button onClick={() => handleOp("+")} className="h-16 rounded-full bg-[#ff9f0a] text-white text-2xl font-medium">+</button>

        <button onClick={() => handleDigit("0")} className="col-span-2 h-16 rounded-full bg-[#333] text-white text-2xl font-medium text-left pl-7">0</button>
        <button onClick={() => handleDigit(".")} className="h-16 rounded-full bg-[#333] text-white text-2xl font-medium">.</button>
        <button onClick={handleEquals} className="h-16 rounded-full bg-[#ff9f0a] text-white text-2xl font-medium">=</button>
      </div>
    </div>
  );
}

// ==========================================
// 9. SETTINGS APP
// ==========================================
export function SettingsApp({
  currentWallpaper,
  onSelectWallpaper,
}: {
  currentWallpaper: string;
  onSelectWallpaper: (wp: string) => void;
}) {
  const wallpapers = [
    { name: "Fluid Cyan Glass (iOS 18)", path: "/ios-clean-wallpaper.jpg" },
    { name: "macOS Sequoia", path: "/wallpaper.jpg" },
    { name: "Sonoma Dark", path: "/wallpap.jpg" },
  ];

  return (
    <div className="p-4 space-y-4 pb-20 text-white font-sans">
      {/* Profile Card in Settings */}
      <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/50">
          <Image src="/profile.jpg" alt="Harsh" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Harsh Srivastava</h2>
          <p className="text-xs text-white/50">Apple ID, iCloud+, Media & Purchases</p>
        </div>
      </div>

      {/* Wallpaper Switcher Section */}
      <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Wallpaper</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {wallpapers.map((wp) => (
            <button
              key={wp.path}
              onClick={() => {
                iosHaptics.tap();
                onSelectWallpaper(wp.path);
              }}
              className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all ${
                currentWallpaper === wp.path
                  ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="relative w-full h-24 rounded-lg overflow-hidden">
                <Image src={wp.path} alt={wp.name} fill className="object-cover" />
              </div>
              <span className="text-[10px] font-medium text-white/80 truncate w-full text-center">
                {wp.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-[#1c1c1e] rounded-2xl border border-white/10 divide-y divide-white/5">
        <div className="p-3.5 flex justify-between items-center text-xs">
          <span className="text-white/70">Device Model</span>
          <span className="text-white font-medium">iPhone 16 Pro Max</span>
        </div>
        <div className="p-3.5 flex justify-between items-center text-xs">
          <span className="text-white/70">Software Version</span>
          <span className="text-white font-medium">iOS 18.2 (HarshOS)</span>
        </div>
        <div className="p-3.5 flex justify-between items-center text-xs">
          <span className="text-white/70">Battery Health</span>
          <span className="text-emerald-400 font-medium">100% Maximum Capacity</span>
        </div>
        <div className="p-3.5 flex justify-between items-center text-xs">
          <span className="text-white/70">Processor</span>
          <span className="text-white font-medium">A18 Pro (Bionic)</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. CAMERA APP
// ==========================================
export function CameraApp() {
  const [flash, setFlash] = useState(false);
  const [snapping, setSnapping] = useState(false);

  const takePhoto = () => {
    iosHaptics.shutter();
    setSnapping(true);
    setTimeout(() => setSnapping(false), 200);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white justify-between pb-20 select-none">
      {/* White Flash Snap Overlay */}
      {snapping && <div className="absolute inset-0 z-50 bg-white" />}

      {/* Top Options Bar */}
      <div className="p-4 flex items-center justify-between text-xs text-white/80 z-10">
        <button
          onClick={() => setFlash(!flash)}
          className={`p-2 rounded-full ${flash ? "bg-amber-400 text-black" : "bg-white/10 text-white"}`}
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <span className="font-semibold text-xs tracking-widest uppercase">PHOTO</span>
        <button className="p-2 rounded-full bg-white/10 text-white">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Viewfinder Frame */}
      <div className="flex-1 relative mx-4 rounded-3xl overflow-hidden border border-white/20 bg-neutral-900 flex items-center justify-center">
        <Image
          src="/profile.jpg"
          alt="Subject"
          fill
          className="object-cover opacity-80"
        />
        {/* Focusing Box */}
        <div className="w-24 h-24 border border-amber-400/80 rounded-lg animate-pulse" />
        <span className="absolute bottom-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white">
          1x • 24mm • f/1.78
        </span>
      </div>

      {/* Shutter Controls */}
      <div className="p-6 flex items-center justify-around z-10">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 relative">
          <Image src="/a.jpg" alt="Gallery" fill className="object-cover" />
        </div>
        <button
          onClick={takePhoto}
          className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-white active:bg-neutral-300 transition-colors" />
        </button>
        <button onClick={() => iosHaptics.tap()} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 11. SAFARI / BLOG APP
// ==========================================
export function SafariApp() {
  const blogs = [
    {
      title: "Building Production Multi-Tenant Architectures with Next.js 15",
      reads: "5.2k reads",
      date: "Feb 2025",
      link: "https://www.harshsrivastava.in",
    },
    {
      title: "How I Built an Autonomous Cold Outreach Engine with FastAPI & Redis",
      reads: "3.8k reads",
      date: "Jan 2025",
      link: "https://www.harshsrivastava.in",
    },
    {
      title: "Designing ClinicOS: WhatsApp Automations for Modern Healthcare",
      reads: "4.1k reads",
      date: "Dec 2024",
      link: "https://www.harshsrivastava.in",
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-20 text-white font-sans">
      <div className="bg-[#1c1c1e] p-3 rounded-2xl border border-white/10 flex items-center gap-2 text-xs text-white/80">
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="truncate">https://harshsrivastava.in/blog</span>
      </div>

      <div className="space-y-3">
        {blogs.map((b, idx) => (
          <a
            key={idx}
            href={b.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-2xl bg-[#1c1c1e] border border-white/10 hover:border-blue-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
              <span>{b.date}</span>
              <span className="text-blue-400 font-medium">{b.reads}</span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              {b.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-blue-400 font-semibold mt-3">
              <span>Read article</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
