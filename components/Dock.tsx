"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WindowId, WindowState } from "@/lib/windowStore";
import { useGenie } from "@/lib/useGenie";
import { Music } from "lucide-react";

interface DockProps {
  windows: Record<WindowId, WindowState>;
  onToggleWindow: (id: WindowId) => void;
  bouncingDockId?: WindowId | null;
}

interface DockItemData {
  id: WindowId;
  label: string;
  windowId: WindowId;
  icon: React.ReactNode;
}

export default function Dock({ windows, onToggleWindow, bouncingDockId }: DockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { minimizeWindow, saveWindowRect } = useGenie();

  const handleDockItemClick = (item: DockItemData) => {
    const wState = windows[item.windowId];

    if (wState?.isOpen && !wState?.isMinimized) {
      const winEl = document.querySelector(`[data-window-id="${item.windowId}"]`) as HTMLElement;
      const dockEl = document.querySelector(`[data-dock-id="${item.windowId}"]`) as HTMLElement;

      if (winEl) {
        const rect = winEl.getBoundingClientRect();
        saveWindowRect(item.windowId, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });

        minimizeWindow({
          windowId: item.windowId,
          windowRef: { current: winEl },
          dockRef: { current: dockEl },
          onComplete: () => {
            onToggleWindow(item.windowId);
          },
        });
      } else {
        onToggleWindow(item.windowId);
      }
    } else {
      onToggleWindow(item.windowId);
    }
  };

  const getFisheyeScale = (index: number) => {
    if (hoveredIdx === null) return 1;
    const distance = Math.abs(hoveredIdx - index);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.18;
    if (distance === 2) return 1.06;
    return 1;
  };

  const getFisheyeY = (index: number) => {
    if (hoveredIdx === null) return 0;
    const distance = Math.abs(hoveredIdx - index);
    if (distance === 0) return -12;
    if (distance === 1) return -6;
    return 0;
  };

  const dockItems: DockItemData[] = [
    {
      id: "finder",
      label: "Finder",
      windowId: "finder",
      icon: (
        <div className="w-11 h-11 relative rounded-2xl overflow-hidden drop-shadow-md">
          <Image
            src="/apple finder.png"
            alt="Finder"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      ),
    },
    {
      id: "safari",
      label: "Safari",
      windowId: "safari",
      icon: (
        <div className="w-11 h-11 relative rounded-2xl overflow-hidden drop-shadow-md">
          <Image
            src="/safari.jpg"
            alt="Safari"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      ),
    },
    {
      id: "projects",
      label: "Photos",
      windowId: "projects",
      icon: (
        <div className="w-11 h-11 relative rounded-2xl overflow-hidden drop-shadow-md">
          <Image
            src="/apple_photos.jpg"
            alt="Photos"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      ),
    },
    {
      id: "music",
      label: "Music",
      windowId: "music",
      icon: (
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-md">
          <Music className="w-6 h-6 text-white" />
        </div>
      ),
    },
    {
      id: "siri",
      label: "Siri AI",
      windowId: "siri",
      icon: (
        <div className="w-11 h-11 relative rounded-2xl overflow-hidden drop-shadow-md">
          <Image
            src="/siri.png"
            alt="Siri"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      ),
    },
    {
      id: "calculator",
      label: "Calculator",
      windowId: "calculator",
      icon: (
        <div className="w-11 h-11 relative rounded-2xl overflow-hidden drop-shadow-md">
          <Image
            src="/calculator.webp"
            alt="Calculator"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      ),
    },
    {
      id: "contact",
      label: "Contacts",
      windowId: "contact",
      icon: (
        <div className="w-11 h-11 relative rounded-2xl overflow-hidden drop-shadow-md">
          <Image
            src="/contact.jpg"
            alt="Contacts"
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </div>
      ),
    },
    {
      id: "terminal",
      label: "Terminal",
      windowId: "terminal",
      icon: (
        <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 100 100">
          <rect width="100" height="100" rx="22" fill="#18181b" stroke="#52525b" strokeWidth="2.5" />
          <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#27272a" strokeWidth="2" />
          <text x="18" y="58" fontFamily="monospace" fontSize="32" fontWeight="bold" fill="#ffffff">
            &gt;_
          </text>
        </svg>
      ),
    },
    {
      id: "trash",
      label: "Trash",
      windowId: "trash",
      icon: (
        <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 100 100">
          <rect width="100" height="100" rx="22" fill="#64748b" opacity="0.2" />
          <ellipse cx="50" cy="30" rx="26" ry="10" fill="#cbd5e1" />
          <path d="M 32 26 L 38 18 L 48 24 L 56 16 L 68 28 Z" fill="#e2e8f0" />
          <circle cx="42" cy="24" r="5" fill="#94a3b8" />
          <circle cx="58" cy="22" r="4" fill="#64748b" />
          <path
            d="M 24 30 L 30 88 H 70 L 76 30 Z"
            fill="url(#trashGradDock)"
            opacity="0.85"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <line x1="38" y1="36" x2="40" y2="82" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          <line x1="50" y1="36" x2="50" y2="82" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          <line x1="62" y1="36" x2="60" y2="82" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          <defs>
            <linearGradient id="trashGradDock" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#94a3b8" stopOpacity="0.8" />
              <stop offset="1" stopColor="#475569" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center items-end px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2.5 md:gap-3 apple-glass-dock rounded-[28px] px-4 py-2.5 md:px-5 md:py-3 transition-all">
        {dockItems.map((item, index) => {
          const isWindowOpen = windows[item.windowId]?.isOpen ?? false;
          const isHovered = hoveredIdx === index;
          const isBouncing = bouncingDockId === item.windowId;

          const targetScale = getFisheyeScale(index);
          const targetY = getFisheyeY(index);

          return (
            <div
              key={item.id}
              data-dock-id={item.windowId}
              className="relative flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleDockItemClick(item)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: -48, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-0 px-3 py-1 rounded-md bg-zinc-900/90 text-white text-[12px] font-medium backdrop-blur-md border border-white/10 shadow-lg whitespace-nowrap pointer-events-none z-50"
                  >
                    {item.label}
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900/90 rotate-45 border-r border-b border-white/10" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon Container with macOS Fisheye Hover Magnification & Bounce */}
              <motion.div
                animate={
                  isBouncing
                    ? { y: [0, -22, 0, -10, 0], scale: [1, 1.2, 1, 1.08, 1] }
                    : { y: targetY, scale: targetScale }
                }
                transition={
                  isBouncing
                    ? { duration: 0.45, ease: "easeInOut" }
                    : { type: "spring", stiffness: 350, damping: 22 }
                }
                className="relative"
              >
                {item.icon}
              </motion.div>

              {/* Active White Dot Indicator */}
              <div className="h-1.5 flex items-center justify-center mt-1">
                {isWindowOpen && (
                  <motion.div
                    layoutId={`active-dot-${item.id}`}
                    className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
