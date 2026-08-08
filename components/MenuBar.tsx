"use client";

import React, { useState, useEffect } from "react";
import { WindowId } from "@/lib/windowStore";
import { Wifi, Search, SlidersHorizontal, BatteryMedium, Bell, Maximize2, Minimize2 } from "lucide-react";

interface MenuBarProps {
  onOpenWindow: (id: WindowId) => void;
  onToggleSpotlight: () => void;
  onToggleControlCenter: () => void;
  onToggleWidgets: () => void;
  onToggleNotifications: () => void;
  onToggleFullscreen: () => void;
  isFullscreen?: boolean;
}

export default function MenuBar({
  onOpenWindow,
  onToggleSpotlight,
  onToggleControlCenter,
  onToggleWidgets,
  onToggleNotifications,
  onToggleFullscreen,
  isFullscreen = false,
}: MenuBarProps) {
  const [timeString, setTimeString] = useState<string>("");

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
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[30px] px-3 md:px-4 flex items-center justify-between backdrop-blur-md bg-black/35 border-b border-white/10 text-white/90 text-[13px] select-none">
      {/* Left Menu Items */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* Apple Logo */}
        <button
          aria-label="Apple logo menu"
          onClick={() => onOpenWindow("finder")}
          className="hover:opacity-80 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.1-3.32-2.73-7.27-7.46-11.85-14.18-6.53-9.57-11.66-20.31-15.38-32.22-3.72-11.91-5.58-23.01-5.58-33.3 0-14.15 3.52-25.75 10.56-34.8 7.04-9.06 15.78-13.67 26.23-13.84 4.88 0 10.37 1.25 16.48 3.75 6.1 2.5 10.45 3.75 13.06 3.75 2.14 0 6.64-1.32 13.48-3.96 6.85-2.64 12.52-3.86 17.02-3.65 12.08.76 21.6 5.3 28.58 13.62-10.74 6.51-15.99 15.67-15.75 27.48.24 9.17 3.75 16.89 10.53 23.16 6.78 6.28 14.86 9.77 24.23 10.47-2.6 7.74-6.07 15.54-10.41 23.4zM119.22 31.84c0-7.39 2.65-14.38 7.95-20.97 5.3-6.59 11.96-10.5 20-11.73.11.98.17 1.94.17 2.88 0 7.29-2.75 14.38-8.25 21.28-5.5 6.9-12.18 10.74-20.04 11.52-.22-.98-.33-1.97-.33-2.98z" />
          </svg>
        </button>

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
