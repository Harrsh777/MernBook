"use client";

import React, { useState, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleFSChange = () => {
      const isFS = Boolean(document.fullscreenElement);
      setIsFullscreen(isFS);
      if (isFS) {
        setShowToast(true);
        const timer = setTimeout(() => setShowToast(false), 4000);
        return () => clearTimeout(timer);
      } else {
        setShowToast(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return { isFullscreen, toggleFullscreen, showToast, setShowToast };
}

export default function FullscreenToast({ show }: { show: boolean; onClose?: () => void }) {
  if (!show) return null;

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none select-none">
      <div className="bg-[#1c1c1e]/90 border border-white/20 rounded-full px-5 py-2 backdrop-blur-2xl shadow-2xl text-white text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-[10px]">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-[10px]">⎋</kbd> to exit fullscreen</span>
      </div>
    </div>
  );
}
