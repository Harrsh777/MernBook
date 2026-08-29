"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Flashlight,
  Camera,
  Lock,
  Unlock,
  ChevronUp,
  Wifi,
  Sparkles,
} from "lucide-react";
import { iosHaptics } from "@/lib/iosHaptics";

interface IPhoneLockScreenProps {
  onUnlock: () => void;
  onOpenCamera: () => void;
  wallpaperSrc?: string;
}

export default function IPhoneLockScreen({
  onUnlock,
  onOpenCamera,
  wallpaperSrc = "/ios-clean-wallpaper.jpg",
}: IPhoneLockScreenProps) {
  const [timeStr, setTimeStr] = useState("9:41");
  const [dateStr, setDateStr] = useState("Tue Apr 1");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isFaceIdUnlocked, setIsFaceIdUnlocked] = useState(false);

  // Motion values for smooth drag-to-unlock gesture
  const dragY = useMotionValue(0);
  const lockOpacity = useTransform(dragY, [-200, 0], [0, 1]);
  const lockScale = useTransform(dragY, [-200, 0], [0.95, 1]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setTimeStr(`${formattedHours}:${formattedMinutes}`);

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      setDateStr(`${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    // Keyboard & wheel unlock support for accessibility and testing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        triggerUnlock();
      }
    };
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < -20 || e.deltaY > 20) {
        triggerUnlock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // If dragged upward more than 35px or upward velocity
    if (info.offset.y < -35 || info.velocity.y < -80) {
      triggerUnlock();
    }
  };

  const triggerUnlock = () => {
    setIsFaceIdUnlocked(true);
    iosHaptics.unlock();
    setTimeout(() => {
      onUnlock();
    }, 180);
  };

  const toggleTorch = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    iosHaptics.tap();
    setIsTorchOn((prev) => !prev);
  };

  const handleCameraClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    iosHaptics.tap();
    onOpenCamera();
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.8, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ y: dragY, opacity: lockOpacity, scale: lockScale }}
      className="absolute inset-0 z-50 flex flex-col justify-between select-none overflow-hidden touch-none"
    >
      {/* 1. High Resolution Realistic Wallpaper */}
      <div className="absolute inset-0 z-0">
        <Image
          src={wallpaperSrc}
          alt="iOS Lock Screen Wallpaper"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Screen Torch Overlay when Flashlight is active */}
      {isTorchOn && (
        <div className="absolute inset-0 z-40 bg-white/70 backdrop-blur-xs pointer-events-none transition-opacity duration-300" />
      )}

      {/* 2. Top Header: Status Bar & Dynamic Island */}
      <div className="relative z-20 w-full pt-2 px-6 flex items-center justify-between">
        {/* Left: Carrier / Empty placeholder for alignment */}
        <div className="w-16 flex items-center text-xs font-semibold text-white/90 drop-shadow-sm">
          <span>5G</span>
        </div>

        {/* Center: Dynamic Island */}
        <div className="flex flex-col items-center">
          <div className="w-[110px] h-[32px] bg-black rounded-full shadow-lg flex items-center justify-between px-3 relative border border-white/5">
            {/* Front Camera Lens Reflection */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222] relative overflow-hidden">
              <div className="w-1 h-1 bg-blue-900/60 rounded-full absolute top-0.5 left-0.5" />
            </div>

            {/* Face ID Lock Icon */}
            <div className="flex items-center justify-center">
              {isFaceIdUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-white/80" />
              )}
            </div>

            {/* Sensor */}
            <div className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
          </div>
        </div>

        {/* Right: Cellular, Wi-Fi, Battery */}
        <div className="w-16 flex items-center justify-end gap-1.5 text-white drop-shadow-md">
          {/* Signal Bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-1 bg-white rounded-full" />
            <span className="w-0.5 h-1.5 bg-white rounded-full" />
            <span className="w-0.5 h-2 bg-white rounded-full" />
            <span className="w-0.5 h-2.5 bg-white rounded-full" />
          </div>

          {/* Wi-Fi Icon */}
          <Wifi className="w-3.5 h-3.5" />

          {/* Battery */}
          <div className="w-6 h-3 border border-white/80 rounded-xs p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-xs" />
          </div>
        </div>
      </div>

      {/* 3. Lock Screen Main Typography (Date & Frosted Glass Clock) */}
      <div className="relative z-20 flex flex-col items-center mt-3 tracking-tight">
        {/* Date Display */}
        <div className="text-white/90 text-sm md:text-base font-medium tracking-wide drop-shadow-md flex items-center gap-1.5 mb-1">
          <span>{dateStr}</span>
        </div>

        {/* Giant Frosted Glass Clock Typography */}
        <div className="relative select-none text-center">
          <h1
            className="text-[86px] sm:text-[98px] leading-none font-bold tracking-tight text-white/85"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
              textShadow:
                "0 4px 30px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(255, 255, 255, 0.4)",
              filter: "drop-shadow(0 2px 12px rgba(255, 255, 255, 0.15))",
            }}
          >
            {timeStr}
          </h1>
        </div>

        {/* Live Notification / Interactive Pill */}
        <div
          onClick={triggerUnlock}
          onPointerUp={triggerUnlock}
          className="mt-4 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/25 shadow-xl flex items-center gap-2.5 max-w-[85%] cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-left leading-tight truncate">
            <p className="text-[11px] font-semibold text-white">Harsh Srivastava</p>
            <p className="text-[10px] text-white/80 truncate">Full Stack & AI Engineer • Tap or swipe up</p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Controls: Flashlight, Camera & Home Bar */}
      <div className="relative z-20 pb-4 px-8 flex flex-col items-center gap-5">
        {/* Quick Action Buttons: Flashlight & Camera */}
        <div className="w-full flex items-center justify-between">
          {/* Flashlight Button */}
          <button
            onClick={toggleTorch}
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-2xl border shadow-xl active:scale-95 ${
              isTorchOn
                ? "bg-white text-black border-white ring-4 ring-white/30"
                : "bg-black/30 hover:bg-black/40 text-white border-white/20"
            }`}
            title="Toggle Flashlight"
          >
            <Flashlight className="w-5 h-5 fill-current" />
          </button>

          {/* Camera Button */}
          <button
            onClick={handleCameraClick}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/40 text-white border border-white/20 flex items-center justify-center backdrop-blur-2xl shadow-xl transition-all active:scale-95"
            title="Open Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe up to unlock text & Home Bar */}
        <div
          onClick={triggerUnlock}
          onPointerUp={triggerUnlock}
          className="cursor-pointer flex flex-col items-center gap-1.5 group select-none w-full max-w-xs py-2 active:opacity-60 transition-opacity"
        >
          <div className="flex items-center gap-1 text-[11px] font-medium text-white/75 tracking-wider animate-pulse">
            <ChevronUp className="w-3.5 h-3.5 -mb-0.5" />
            <span>SWIPE UP TO UNLOCK</span>
          </div>

          {/* iOS White Rounded Home Indicator Bar */}
          <div className="w-36 h-1 bg-white rounded-full shadow-md group-hover:scale-105 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
