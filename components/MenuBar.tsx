"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaApple } from "react-icons/fa6";
import { WindowId } from "@/lib/windowStore";
import { Wifi, Search, SlidersHorizontal, BatteryMedium, Bell, Maximize2, Minimize2, RotateCcw, Settings, Info } from "lucide-react";

interface MenuBarProps {
  onOpenWindow: (id: WindowId) => void;
  onToggleSpotlight: () => void;
  onToggleControlCenter: () => void;
  onToggleWidgets: () => void;
  onToggleNotifications: () => void;
  onToggleFullscreen: () => void;
  onTriggerReboot?: () => void;
  isFullscreen?: boolean;
}

export default function MenuBar({
  onOpenWindow,
  onToggleSpotlight,
  onToggleControlCenter,
  onToggleWidgets,
  onToggleNotifications,
  onToggleFullscreen,
  onTriggerReboot,
  isFullscreen = false,
}: MenuBarProps) {
  const [timeString, setTimeString] = useState<string>("");
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      setTimeString(formatted.replace(",", ""));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAppleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[30px] px-3 md:px-4 flex items-center justify-between backdrop-blur-md bg-black/35 border-b border-white/10 text-white/90 text-[13px] select-none">
      {/* Left Menu Items */}
      <div className="flex items-center gap-4 md:gap-5 relative">
        {/* Apple Logo Dropdown Menu Trigger */}
        <div ref={menuRef} className="relative">
          <button
            aria-label="Apple logo menu"
            onClick={() => setIsAppleMenuOpen(!isAppleMenuOpen)}
            className="hover:opacity-80 transition-opacity flex items-center justify-center cursor-pointer p-1 rounded hover:bg-white/10"
          >
            <FaApple className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Apple Menu Dropdown Panel */}
          {isAppleMenuOpen && (
            <div className="absolute left-0 top-8 w-56 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl p-1.5 z-50 text-xs flex flex-col gap-1 text-white/90">
              <button
                onClick={() => {
                  setIsAppleMenuOpen(false);
                  onOpenWindow("settings");
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors cursor-pointer text-left"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About This Mac</span>
              </button>
              <button
                onClick={() => {
                  setIsAppleMenuOpen(false);
                  onOpenWindow("settings");
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors cursor-pointer text-left"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>System Settings...</span>
              </button>
              <div className="h-[1px] bg-white/10 my-0.5" />
              <button
                onClick={() => {
                  setIsAppleMenuOpen(false);
                  if (onTriggerReboot) onTriggerReboot();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-amber-600 hover:text-white transition-colors cursor-pointer text-left font-medium text-amber-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart macOS... (Play Boot Screen)</span>
              </button>
            </div>
          )}
        </div>

        {/* Name / Title */}
        <span className="font-semibold tracking-tight cursor-default text-white">
          Harsh Srivastava
        </span>

        {/* Menu Items */}
        <button
          onClick={() => onOpenWindow("projects")}
          className="hidden sm:block hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          Projects
        </button>
        <button
          onClick={() => onOpenWindow("experience")}
          className="hidden sm:block hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          Experience
        </button>
        <button
          onClick={() => onOpenWindow("contact")}
          className="hidden sm:block hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          Contact
        </button>
        <button
          onClick={() => onOpenWindow("resume")}
          className="hidden sm:block hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          Resume
        </button>
      </div>

      {/* Center Authentic MacBook Camera Notch */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-40 md:w-44 h-[28px] bg-black rounded-b-2xl border-x border-b border-white/10 flex items-center justify-center shadow-lg pointer-events-none z-50">
        <div className="w-3 h-3 rounded-full bg-[#111115] border border-white/20" />
      </div>

      {/* Right Menu Status Icons & Clock */}
      <div className="flex items-center gap-3 md:gap-4 font-normal">
        {/* Fullscreen API Toggle Button */}
        <button
          aria-label="Toggle Fullscreen"
          onClick={onToggleFullscreen}
          className="hover:opacity-80 transition-opacity cursor-pointer p-0.5"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 stroke-[2.2] text-emerald-400" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 stroke-[2.2]" />
          )}
        </button>

        {/* Notification Bell with Red Glow Dot */}
        <button
          aria-label="Notification Center"
          onClick={onToggleNotifications}
          className="relative hover:opacity-80 transition-opacity cursor-pointer p-0.5"
        >
          <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
        </button>

        <button
          aria-label="Wi-Fi status"
          onClick={onToggleControlCenter}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
        <button
          aria-label="Spotlight Search"
          onClick={onToggleSpotlight}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
        <button
          aria-label="Control Center"
          onClick={onToggleControlCenter}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
        <button
          aria-label="Battery Status"
          onClick={onToggleControlCenter}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        >
          <BatteryMedium className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Live Clock / Widgets Trigger */}
        <button
          onClick={onToggleWidgets}
          className="cursor-pointer hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors text-[13px] font-normal tracking-wide text-white/95 whitespace-nowrap"
        >
          {timeString || "Sun Aug 9 1:37 AM"}
        </button>
      </div>
    </header>
  );
}
