"use client";

import React, { useState } from "react";
import {
  Wifi,
  Bluetooth,
  Radio,
  Sun,
  Volume2,
  Moon,
  Palette,
  Check,
  SkipBack,
  Play,
  SkipForward,
  Cast,
  LayoutGrid,
  Calculator,
  Timer,
  Camera,
} from "lucide-react";

export type WallpaperId = "wallpaper" | "wallpap" | "img" | "dark";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: WallpaperId;
  onSelectWallpaper: (id: WallpaperId) => void;
}

export default function ControlCenter({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper,
}: ControlCenterProps) {
  const [wifiActive, setWifiActive] = useState(true);
  const [btActive, setBtActive] = useState(true);
  const [airDropActive, setAirDropActive] = useState(true);
  const [focusActive, setFocusActive] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);

  if (!isOpen) return null;

  const wallpapers: Array<{ id: WallpaperId; name: string }> = [
    { id: "wallpaper", name: "Sonoma Blue" },
    { id: "wallpap", name: "Ventura Abstract" },
    { id: "img", name: "Sequoia Dusk" },
    { id: "dark", name: "Dark Minimalist" },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999980] bg-transparent select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-9 right-4 w-[340px] apple-glass-panel rounded-[32px] p-4 text-white flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top 2 Columns: Toggles + Media Box */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column Toggles */}
          <div className="flex flex-col gap-2.5">
            {/* Wi-Fi Pill */}
            <button
              onClick={() => setWifiActive(!wifiActive)}
              className={`p-2.5 rounded-[22px] border transition-all flex items-center gap-3 text-left ${
                wifiActive
                  ? "bg-white/20 border-white/30 text-white shadow-sm"
                  : "bg-white/10 border-white/10 text-white/50"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#1d4ed8] flex items-center justify-center shrink-0 shadow-md">
                <Wifi className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold leading-tight">Wi-Fi</div>
                <div className="text-[10px] text-white/70 truncate">
                  {wifiActive ? "Harsh_5G" : "Off"}
                </div>
              </div>
            </button>

            {/* Bluetooth & AirDrop White Circles */}
            <div className="flex items-center gap-2.5">
              {/* Bluetooth Circle */}
              <button
                onClick={() => setBtActive(!btActive)}
                className={`w-12 h-12 rounded-full border transition-all flex items-center justify-center shrink-0 shadow-md ${
                  btActive
                    ? "bg-white text-[#1d4ed8] border-white"
                    : "bg-white/15 text-white/50 border-white/10"
                }`}
              >
                <Bluetooth className="w-5 h-5" />
              </button>

              {/* AirDrop Circle */}
              <button
                onClick={() => setAirDropActive(!airDropActive)}
                className={`w-12 h-12 rounded-full border transition-all flex items-center justify-center shrink-0 shadow-md ${
                  airDropActive
                    ? "bg-white text-[#1d4ed8] border-white"
                    : "bg-white/15 text-white/50 border-white/10"
                }`}
              >
                <Radio className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Media Player Box */}
          <div className="bg-white/15 border border-white/20 rounded-[24px] p-3.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">Besties</div>
                <div className="text-[10px] text-white/60 truncate">Black Country, New Road</div>
              </div>
            </div>

            <div className="flex items-center justify-around text-white/90 pt-2">
              <SkipBack className="w-4 h-4 cursor-pointer hover:text-white" />
              <Play className="w-4 h-4 cursor-pointer hover:text-white fill-current" />
              <SkipForward className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>

        {/* Middle Row: Focus Pill + Stage Manager + Screen Mirroring */}
        <div className="flex items-center gap-2.5">
          {/* Focus Pill */}
          <button
            onClick={() => setFocusActive(!focusActive)}
            className={`flex-1 p-2.5 rounded-[22px] border transition-all flex items-center gap-2.5 text-left ${
              focusActive
                ? "bg-white/20 border-white/30 text-white shadow-sm"
                : "bg-white/10 border-white/10 text-white/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4 fill-current" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold leading-tight">Focus</div>
              <div className="text-[10px] text-white/70">On</div>
            </div>
          </button>

          {/* Stage Manager Circle */}
          <button className="w-12 h-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center shrink-0 shadow-sm transition-all">
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* Screen Mirroring Circle */}
          <button className="w-12 h-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center shrink-0 shadow-sm transition-all">
            <Cast className="w-5 h-5" />
          </button>
        </div>

        {/* Display Brightness Slider */}
        <div className="bg-[#1d4ed8]/60 border border-white/25 rounded-[22px] p-3.5 flex flex-col gap-1.5 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span>Display</span>
            <span className="text-[10px] text-white/80">{brightness}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-white/70 shrink-0" />
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5 bg-white/30 rounded-lg"
            />
            <Sun className="w-5 h-5 text-white shrink-0" />
          </div>
        </div>

        {/* Sound Volume Slider */}
        <div className="bg-[#2563eb]/60 border border-white/25 rounded-[22px] p-3.5 flex flex-col gap-1.5 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span>Sound</span>
            <span className="text-[10px] text-white/80">{volume}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-white/70 shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5 bg-white/30 rounded-lg"
            />
            <Cast className="w-4 h-4 text-white/80 shrink-0" />
          </div>
        </div>

        {/* Bottom Quick Utilities Circle Row */}
        <div className="flex items-center justify-around pt-0.5">
          <button className="w-12 h-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center shadow-sm">
            <Moon className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center shadow-sm">
            <Timer className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center shadow-sm">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Wallpaper Switcher Pills */}
        <div className="bg-white/10 border border-white/20 rounded-[22px] p-3 flex flex-col gap-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-300" /> macOS Wallpaper Theme
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {wallpapers.map((wp) => {
              const isSelected = currentWallpaper === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => onSelectWallpaper(wp.id)}
                  className={`p-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-white text-[#1d4ed8] font-bold shadow-md"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <span className="truncate">{wp.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Edit Controls Pill */}
        <div className="flex justify-center pt-1">
          <button className="px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs text-white/90 font-medium hover:bg-white/25 transition-colors">
            Edit Controls
          </button>
        </div>
      </div>
    </div>
  );
}
