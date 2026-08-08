"use client";

import React, { useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { WindowId, WindowState } from "@/lib/windowStore";
import { useGenie } from "@/lib/useGenie";

interface WindowProps {
  id: WindowId;
  title: string;
  windowState: WindowState;
  onClose: (id: WindowId) => void;
  onMinimize?: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  children: React.ReactNode;
  initialPos?: { x: number; y: number };
  width?: string;
  height?: string;
}

export default function Window({
  id,
  title,
  windowState,
  onClose,
  onMinimize,
  onFocus,
  children,
  initialPos = { x: 0, y: 0 },
  width = "max-w-4xl w-[92vw] md:w-[780px]",
  height = "h-[540px] md:h-[580px]",
}: WindowProps) {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);
  const { minimizeWindow, saveWindowRect } = useGenie();

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const handleGenieClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      const savedRect = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
      saveWindowRect(id, savedRect);

      const dockEl = document.querySelector(`[data-dock-id="${id}"]`) as HTMLElement;

      minimizeWindow({
        windowId: id,
        windowRef,
        dockRef: { current: dockEl },
        onComplete: () => {
          if (onMinimize) onMinimize(id);
          else onClose(id);
        },
      });
    } else {
      if (onMinimize) onMinimize(id);
      else onClose(id);
    }
  };

  return (
    <motion.div
      ref={windowRef}
      data-window-id={id}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{
        opacity: 0,
        scaleX: 0.15,
        scaleY: 0.05,
        y: 360,
        skewX: 12,
        borderRadius: "60px",
        x: initialPos.x,
      }}
      animate={{
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        y: initialPos.y,
        skewX: 0,
        borderRadius: "18px",
        x: initialPos.x,
      }}
      exit={{
        opacity: 0,
        scaleX: 0.12,
        scaleY: 0.03,
        y: 380,
        skewX: -16,
        borderRadius: "60px",
      }}
      transition={{
        duration: 0.42,
        ease: [0.25, 1, 0.5, 1], // Native macOS Genie fluid cubic bezier
      }}
      style={{
        zIndex: windowState.zIndex,
        transformOrigin: "50% 120%", // Anchored towards the dock icon
      }}
      onPointerDown={() => onFocus(id)}
      className={`fixed top-[8%] left-[4%] md:left-[15%] lg:left-[22%] ${width} ${height} max-h-[85vh] apple-glass-panel text-white rounded-[24px] flex flex-col overflow-hidden select-none`}
    >
      {/* Title Bar (Height: 44px) */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="h-[44px] min-h-[44px] apple-glass-card border-b border-white/15 px-4 flex items-center justify-between cursor-move select-none"
      >
        {/* Left Traffic Light Buttons */}
        <div className="flex items-center gap-2 group">
          {/* Close Button (Red) */}
          <button
            onClick={handleGenieClose}
            aria-label="Close window"
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/70 leading-none">
              ✕
            </span>
          </button>
          {/* Minimize Button (Yellow Genie Effect) */}
          <button
            onClick={handleGenieClose}
            aria-label="Minimize window"
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffcc00] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/70 leading-none">
              –
            </span>
          </button>
          {/* Expand / Zoom Button (Green) */}
          <button
            aria-label="Zoom window"
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#34c759] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 leading-none">
              +
            </span>
          </button>
        </div>

        {/* Center Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-white/80 tracking-wide pointer-events-none truncate max-w-[240px]">
          {title}
        </div>

        {/* Right Spacer for balance */}
        <div className="w-12" />
      </div>

      {/* Window Body Content */}
      <div className="flex-1 overflow-auto select-text font-sans bg-[#121c2b]/70 backdrop-blur-3xl">
        {children}
      </div>
    </motion.div>
  );
}
