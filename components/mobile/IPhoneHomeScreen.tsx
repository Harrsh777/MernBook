"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Folder,
  Briefcase,
  Award,
  FileText,
  Terminal,
  Compass,
  Music2,
  Calculator,
  MessageCircle,
  Settings,
  Camera,
  Image as ImageIcon,
  Wifi,
  Github,
  Linkedin,
  Twitter,
  Code2,
  Send,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { iosHaptics } from "@/lib/iosHaptics";

export type AppId =
  | "projects"
  | "experience"
  | "resume"
  | "certs"
  | "terminal"
  | "safari"
  | "music"
  | "calculator"
  | "messages"
  | "settings"
  | "camera"
  | "photos";

interface IPhoneHomeScreenProps {
  onOpenApp: (appId: AppId) => void;
  onOpenControlCenter: () => void;
  wallpaperSrc?: string;
}

export default function IPhoneHomeScreen({
  onOpenApp,
  onOpenControlCenter,
  wallpaperSrc = "/ios-clean-wallpaper.jpg",
}: IPhoneHomeScreenProps) {
  const [activePage, setActivePage] = useState<0 | 1>(0);
  const [timeStr, setTimeStr] = useState("9:41");
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setTimeStr(`${formattedHours}:${formattedMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40 && activePage === 0) {
      iosHaptics.tap();
      setActivePage(1);
    } else if (info.offset.x > 40 && activePage === 1) {
      iosHaptics.tap();
      setActivePage(0);
    }
  };

  const handleAppClick = (appId: AppId) => {
    iosHaptics.tap();
    onOpenApp(appId);
  };

  // Primary page apps
  const pageOneApps: Array<{
    id: AppId;
    label: string;
    icon: React.ReactNode;
    bg: string;
  }> = [
    {
      id: "projects",
      label: "Projects",
      icon: <Folder className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-sky-400 to-blue-600",
    },
    {
      id: "resume",
      label: "Resume",
      icon: <FileText className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      id: "certs",
      label: "Certificates",
      icon: <Award className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-amber-400 to-orange-600",
    },
    {
      id: "terminal",
      label: "Terminal",
      icon: <Terminal className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-gray-800 to-black",
    },
    {
      id: "safari",
      label: "Safari",
      icon: <Compass className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-cyan-400 to-blue-500",
    },
    {
      id: "music",
      label: "Music",
      icon: <Music2 className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-rose-500 to-red-600",
    },
    {
      id: "calculator",
      label: "Calculator",
      icon: <Calculator className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-neutral-700 to-neutral-900",
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-emerald-400 to-green-600",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-slate-400 to-slate-600",
    },
    {
      id: "camera",
      label: "Camera",
      icon: <Camera className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-zinc-700 to-zinc-900",
    },
    {
      id: "photos",
      label: "Photos",
      icon: <ImageIcon className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500",
    },
  ];

  // Secondary page social and external apps
  const pageTwoItems = [
    {
      label: "GitHub",
      desc: "@Harrsh777",
      url: "https://github.com/Harrsh777",
      icon: <Github className="w-7 h-7 text-white" />,
      bg: "bg-[#24292e]",
    },
    {
      label: "LinkedIn",
      desc: "@harrshh",
      url: "https://www.linkedin.com/in/harrshh",
      icon: <Linkedin className="w-7 h-7 text-white" />,
      bg: "bg-[#0077b5]",
    },
    {
      label: "Twitter / X",
      desc: "@harrshh",
      url: "https://twitter.com/harrshh",
      icon: <Twitter className="w-7 h-7 text-white" />,
      bg: "bg-black",
    },
    {
      label: "LeetCode",
      desc: "150-Day Streak",
      url: "https://leetcode.com",
      icon: <Code2 className="w-7 h-7 text-white" />,
      bg: "bg-amber-600",
    },
    {
      label: "ClinicOS",
      desc: "Live Healthcare App",
      url: "https://www.harshsrivastava.in",
      icon: <Sparkles className="w-7 h-7 text-white" />,
      bg: "bg-emerald-600",
    },
    {
      label: "MoxSend",
      desc: "Cold Email AI",
      url: "https://www.harshsrivastava.in",
      icon: <Zap className="w-7 h-7 text-white" />,
      bg: "bg-purple-600",
    },
    {
      label: "EduCore ERP",
      desc: "School ERP",
      url: "https://www.educorerp.in/",
      icon: <Folder className="w-7 h-7 text-white" />,
      bg: "bg-blue-600",
    },
    {
      label: "Email Harsh",
      desc: "Harrshh077@gmail.com",
      url: "mailto:Harrshh077@gmail.com",
      icon: <Send className="w-7 h-7 text-white" />,
      bg: "bg-rose-600",
    },
  ];

  // Dock items
  const dockApps: Array<{ id: AppId; icon: React.ReactNode; bg: string }> = [
    {
      id: "messages",
      icon: <MessageCircle className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-emerald-400 to-green-600",
    },
    {
      id: "safari",
      icon: <Compass className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-cyan-400 to-blue-500",
    },
    {
      id: "music",
      icon: <Music2 className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-rose-500 to-red-600",
    },
    {
      id: "terminal",
      icon: <Terminal className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-br from-gray-800 to-black",
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Wallpaper Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={wallpaperSrc}
          alt="Wallpaper"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* 2. Top iOS Status Bar with Dynamic Island */}
      <div className="relative z-30 pt-2 px-6 flex items-center justify-between text-xs text-white">
        {/* Time */}
        <span className="font-semibold drop-shadow-sm w-16" suppressHydrationWarning>
          {timeStr}
        </span>

        {/* Dynamic Island (Interactive!) */}
        <div
          onClick={() => {
            iosHaptics.tap();
            setIsIslandExpanded(!isIslandExpanded);
          }}
          className="cursor-pointer transition-all duration-300"
        >
          <motion.div
            layout
            className={`bg-black rounded-full shadow-2xl flex items-center justify-between border border-white/10 px-3 ${
              isIslandExpanded ? "w-[240px] h-[48px]" : "w-[110px] h-[30px]"
            }`}
          >
            {isIslandExpanded ? (
              <div className="w-full flex items-center justify-between text-[11px] text-white">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                    <Music2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="leading-tight text-left">
                    <p className="font-bold truncate max-w-[90px]">Lo-Fi Chill</p>
                    <p className="text-[9px] text-white/50">Harsh Beats</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pr-1">
                  <span className="w-1 h-3 bg-green-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-green-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-2 bg-green-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
              </>
            )}
          </motion.div>
        </div>

        {/* Right Status Controls (Tapping opens Control Center) */}
        <div
          onClick={() => {
            iosHaptics.tap();
            onOpenControlCenter();
          }}
          className="w-16 flex items-center justify-end gap-1.5 cursor-pointer text-white drop-shadow-sm"
          title="Open Control Center"
        >
          {/* Signal */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-1 bg-white rounded-full" />
            <span className="w-0.5 h-1.5 bg-white rounded-full" />
            <span className="w-0.5 h-2 bg-white rounded-full" />
            <span className="w-0.5 h-2.5 bg-white rounded-full" />
          </div>
          <Wifi className="w-3.5 h-3.5" />
          <div className="w-6 h-3 border border-white/80 rounded-xs p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-xs" />
          </div>
        </div>
      </div>

      {/* 3. Multi-Page Swipeable App Carousel (Left / Right Swipe) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        className="relative z-10 flex-1 flex flex-col justify-between px-5 pt-3 pb-2 touch-pan-y"
      >
        <AnimatePresence mode="wait">
          {activePage === 0 ? (
            <motion.div
              key="page-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* iOS Top Hero Widget: Harsh Srivastava Profile & AWS Credential */}
              <div
                onClick={() => handleAppClick("resume")}
                className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl cursor-pointer hover:bg-black/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-13 h-13 rounded-2xl overflow-hidden border-2 border-white/30 shadow-md shrink-0">
                    <Image src="/profile.jpg" alt="Harsh" fill className="object-cover" priority />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span>Harsh Srivastava</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    </h2>
                    <p className="text-[11px] font-semibold text-amber-300 mt-0.5">AWS Certified Solutions Architect</p>
                    <p className="text-[10px] text-white/60">VIT &apos;27 • 150-day LeetCode • 6+ Wins</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>

              {/* 4x3 iOS App Grid */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 py-2">
                {pageOneApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-[22%] ${app.bg} flex items-center justify-center shadow-lg border border-white/20 group-hover:brightness-110 transition-all`}
                      style={{
                        boxShadow: "0 8px 18px -4px rgba(0, 0, 0, 0.35)",
                      }}
                    >
                      {app.icon}
                    </div>
                    <span className="text-[11px] font-medium text-white tracking-tight drop-shadow-md truncate max-w-[64px]">
                      {app.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="page-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Page 2 Header Banner */}
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Developer Ecosystem & Socials
                </h3>
                <p className="text-[11px] text-white/60 mt-0.5">
                  Connect, view source repositories, and live applications.
                </p>
              </div>

              {/* 4x2 App Grid for Socials & Projects */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 py-2">
                {pageTwoItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => iosHaptics.tap()}
                    className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-[22%] ${item.bg} flex items-center justify-center shadow-lg border border-white/20 group-hover:brightness-110 transition-all`}
                      style={{
                        boxShadow: "0 8px 18px -4px rgba(0, 0, 0, 0.35)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-medium text-white tracking-tight drop-shadow-md truncate max-w-[64px]">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Dots Indicator (Swipe left & right) */}
        <div className="flex items-center justify-center gap-2.5 py-1 z-30 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              iosHaptics.tap();
              setActivePage(0);
            }}
            aria-label="Page 1"
            className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
              activePage === 0 ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              iosHaptics.tap();
              setActivePage(1);
            }}
            aria-label="Page 2"
            className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
              activePage === 1 ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        </div>
      </motion.div>

      {/* 4. Bottom iOS Dock */}
      <div className="relative z-20 px-4 pb-4">
        <div className="bg-white/20 backdrop-blur-2xl border border-white/25 rounded-[32px] p-3 flex items-center justify-around shadow-2xl">
          {dockApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="active:scale-90 transition-transform cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-[22%] ${app.bg} flex items-center justify-center shadow-lg border border-white/20 hover:brightness-110 transition-all`}
                style={{
                  boxShadow: "0 8px 18px -4px rgba(0, 0, 0, 0.35)",
                }}
              >
                {app.icon}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
