"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wifi,
  Bluetooth,
  Globe,
  Palette,
  Monitor,
  Volume2,
  Lock,
  Cpu,
  HardDrive,
  Cloud,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function SystemSettingsWindow() {
  const [activeTab, setActiveTab] = useState<"about" | "appearance" | "network" | "sound">("about");
  const [accentColor, setAccentColor] = useState("blue");

  const sidebarNav = [
    { id: "about", label: "About This Mac", icon: <Cpu className="w-4 h-4 text-blue-400" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4 text-purple-400" /> },
    { id: "network", label: "Network & Wi-Fi", icon: <Wifi className="w-4 h-4 text-sky-400" /> },
    { id: "sound", label: "Sound & Volume", icon: <Volume2 className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="h-full w-full bg-transparent text-white flex select-none overflow-hidden font-sans">
      {/* 1. Left Sidebar Navigation */}
      <div className="w-56 bg-white/5 p-3 border-r border-white/10 flex flex-col justify-between text-xs text-white/80 shrink-0 backdrop-blur-2xl">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* User Profile Card */}
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
              <Image src="/profile.jpg" alt="Profile" fill className="object-cover" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">Harsh Srivastava</div>
              <div className="text-[10px] text-white/60 truncate">Apple ID & Cloud</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-0.5">
            {sidebarNav.map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as "about" | "appearance" | "network" | "sound")}
                className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 font-medium transition-all ${
                  activeTab === nav.id
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "hover:bg-white/10 text-white/80"
                }`}
              >
                {nav.icon}
                <span>{nav.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-white/50 text-center pt-2 border-t border-white/10">
          macOS Sonoma 14.5 (23F79)
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 bg-transparent p-6 overflow-y-auto backdrop-blur-2xl">
        {activeTab === "about" && (
          <div className="flex flex-col gap-6">
            {/* Top Mac Overview Header */}
            <div className="apple-glass-card rounded-2xl p-6 border border-white/20 flex items-center gap-6 shadow-lg">
              <div className="relative w-24 h-24 shrink-0">
                <Image src="/apple finder.png" alt="MacBook Pro" fill className="object-contain" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">MacBook Pro (16-inch, 2024)</h1>
                <p className="text-xs text-blue-300 font-semibold mt-0.5">Apple M3 Max Chip</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full border border-white/10 text-white/90">
                    macOS Sonoma 14.5
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                    Fully Optimized
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="apple-glass-card p-4 rounded-2xl border border-white/20 flex flex-col justify-between shadow-md">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                  <Cpu className="w-4 h-4" /> Chip Architecture
                </div>
                <div className="text-sm font-bold text-white mt-3">Apple M3 Max</div>
                <div className="text-[11px] text-white/60 mt-0.5">16-core CPU • 40-core GPU</div>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl border border-white/20 flex flex-col justify-between shadow-md">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" /> Unified Memory
                </div>
                <div className="text-sm font-bold text-white mt-3">36 GB Unified RAM</div>
                <div className="text-[11px] text-white/60 mt-0.5">High Bandwidth Memory (300GB/s)</div>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl border border-white/20 flex flex-col justify-between shadow-md">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <HardDrive className="w-4 h-4" /> System Storage
                </div>
                <div className="text-sm font-bold text-white mt-3">1 TB Macintosh HD</div>
                <div className="text-[11px] text-white/60 mt-0.5">450 GB Available</div>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl border border-white/20 flex flex-col justify-between shadow-md">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Cloud className="w-4 h-4" /> AWS Cloud Engine
                </div>
                <div className="text-sm font-bold text-white mt-3">Solutions Architect Status</div>
                <div className="text-[11px] text-white/60 mt-0.5">Score 953/1000 Verified</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-white">System Appearance</h2>
            <div className="apple-glass-card rounded-2xl p-4 border border-white/20 flex flex-col gap-3 shadow-md">
              <div className="text-xs font-semibold text-white/70">Accent Color</div>
              <div className="flex items-center gap-3">
                {["blue", "purple", "rose", "amber", "emerald"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setAccentColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      c === "blue" ? "bg-blue-500" : ""
                    } ${c === "purple" ? "bg-purple-500" : ""} ${c === "rose" ? "bg-rose-500" : ""} ${
                      c === "amber" ? "bg-amber-500" : ""
                    } ${c === "emerald" ? "bg-emerald-500" : ""} ${
                      accentColor === c ? "border-white scale-110 shadow-md" : "border-transparent"
                    }`}
                  >
                    {accentColor === c && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "network" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Network & Wi-Fi</h2>
            <div className="apple-glass-card p-4 rounded-2xl border border-white/20 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Wifi className="w-6 h-6 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-white">Harsh_5G (Connected)</div>
                  <div className="text-[11px] text-white/60">Speed: 850 Mbps • IP: 192.168.1.45</div>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        )}

        {activeTab === "sound" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Sound Output</h2>
            <div className="apple-glass-card p-4 rounded-2xl border border-white/20 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">MacBook Pro Speakers (Built-in)</div>
                  <div className="text-[11px] text-white/60">Dolby Atmos Spatial Audio Enabled</div>
                </div>
              </div>
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
