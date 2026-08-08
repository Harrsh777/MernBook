"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function ScreenSaver() {
  const [isActive, setIsActive] = useState(false);
  const [timeStr, setTimeStr] = useState("9:41");
  const [dateStr, setDateStr] = useState("Sunday, August 9");

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (isActive) setIsActive(false);
      clearTimeout(idleTimer);
      // Trigger screensaver after 60 seconds of inactivity
      idleTimer = setTimeout(() => {
        setIsActive(true);
      }, 60000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isActive]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isActive) return null;

  return (
    <div
      onClick={() => setIsActive(false)}
      className="fixed inset-0 z-[999999] bg-black select-none cursor-pointer flex flex-col justify-between p-12 overflow-hidden animate-in fade-in duration-500"
    >
      {/* Background Sonoma Motion Background */}
      <div className="absolute inset-0 z-0 opacity-80 scale-105 animate-pulse">
        <Image
          src="/wallpaper.jpg"
          alt="Sonoma Aerial Screen Saver"
          fill
          priority
          className="object-cover object-center filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
      </div>

      {/* Top Apple Digital Clock */}
      <div className="relative z-10 text-center pt-16 flex flex-col items-center">
        <div className="text-8xl md:text-9xl font-extralight text-white tracking-tight drop-shadow-2xl font-sans">
          {timeStr}
        </div>
        <div className="text-lg md:text-xl font-medium text-white/80 mt-2 tracking-wide font-sans">
          {dateStr}
        </div>
      </div>

      {/* Bottom Lock Screen Prompt */}
      <div className="relative z-10 text-center pb-8 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl">
          <Image src="/profile.jpg" alt="Harsh" fill className="object-cover" />
        </div>
        <div className="text-sm font-semibold text-white">Harsh Srivastava</div>
        <div className="text-xs text-white/60 font-medium px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 animate-bounce">
          Click or press any key to unlock
        </div>
      </div>
    </div>
  );
}
