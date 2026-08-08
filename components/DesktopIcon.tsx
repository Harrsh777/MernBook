"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { WindowId } from "@/lib/windowStore";
import { Trash2 } from "lucide-react";

interface DesktopIconProps {
  itemId: string;
  windowId: WindowId;
  label: string;
  iconType?: "folder" | "file";
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: WindowId) => void;
  onMoveToTrash: (itemId: string) => void;
}

export default function DesktopIcon({
  itemId,
  windowId,
  label,
  iconType = "folder",
  isSelected,
  onSelect,
  onOpen,
  onMoveToTrash,
}: DesktopIconProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu(false);
    onSelect(itemId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu(false);
    onOpen(windowId);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(itemId);
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      className="group relative flex flex-col items-center justify-center w-24 p-1 rounded-md cursor-grab active:cursor-grabbing select-none transition-all duration-150 z-20"
    >
      {/* Icon Graphic */}
      <div className="relative w-16 h-14 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:brightness-110">
        {iconType === "folder" ? (
          // Vibrant macOS Blue Folder SVG
          <svg className="w-14 h-14 drop-shadow-md" viewBox="0 0 100 80" fill="none">
            <path
              d="M6 16C6 11.5817 9.58172 8 14 8H35.5858C37.7071 8 39.7417 8.84285 41.2426 10.3431L46.7574 15.8579C48.2583 17.3581 50.2929 18.2 52.4142 18.2H86C90.4183 18.2 94 21.7817 94 26.2V64C94 68.4183 90.4183 72 86 72H14C9.58172 72 6 68.4183 6 64V16Z"
              fill="url(#folderGrad)"
            />
            <path
              d="M10 24C10 20.6863 12.6863 18 16 18H84C87.3137 18 90 20.6863 90 24V64C90 67.3137 87.3137 70 84 70H16C12.6863 70 10 67.3137 10 64V24Z"
              fill="url(#folderFrontGrad)"
            />
            <defs>
              <linearGradient id="folderGrad" x1="6" y1="8" x2="94" y2="72" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="folderFrontGrad" x1="10" y1="18" x2="90" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          // File SVG
          <svg className="w-12 h-14 drop-shadow-md" viewBox="0 0 70 90" fill="none">
            <path
              d="M5 10C5 6.68629 7.68629 4 11 4H45L65 24V80C65 83.3137 62.3137 86 59 86H11C7.68629 86 5 83.3137 5 80V10Z"
              fill="#F8FAFC"
            />
            <path d="M45 4L65 24H45V4Z" fill="#CBD5E1" />
          </svg>
        )}
      </div>

      {/* Label */}
      <div
        className={`mt-1 px-2 py-0.5 rounded text-xs font-normal text-center leading-tight max-w-[96px] truncate transition-colors ${
          isSelected
            ? "bg-blue-600/80 text-white shadow-sm ring-1 ring-blue-400/50"
            : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover:bg-white/10"
        }`}
      >
        {label}
      </div>

      {/* macOS Right Click Context Menu */}
      {showContextMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowContextMenu(false);
            }}
          />
          <div
            style={{ top: menuPos.y, left: menuPos.x }}
            className="fixed z-50 w-44 bg-[#28282a]/95 backdrop-blur-xl border border-white/15 rounded-lg p-1.5 shadow-2xl text-xs text-white"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowContextMenu(false);
                onOpen(windowId);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-600 font-medium"
            >
              Open
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowContextMenu(false);
                onMoveToTrash(itemId);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-600 text-rose-300 hover:text-white font-medium flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Move to Trash</span>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
