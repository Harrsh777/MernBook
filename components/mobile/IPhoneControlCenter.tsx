"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Bluetooth,
  Radio,
  Sun,
  Volume2,
  Lock,
  Moon,
  Flashlight,
  Calculator,
  Camera,
  X,
} from "lucide-react";
import { iosHaptics } from "@/lib/iosHaptics";

interface IPhoneControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onLockScreen: () => void;
  onOpenCamera: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
}

export default function IPhoneControlCenter({
  isOpen,
  onClose,
  onLockScreen,
  onOpenCamera,
  brightness,
  setBrightness,
  volume,
  setVolume,
}: IPhoneControlCenterProps) {
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  const [airdropOn, setAirdropOn] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [focusOn, setFocusOn] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-0 z-50 bg-black/50 backdrop-blur-2xl p-5 pt-12 flex flex-col justify-between select-none text-white font-sans"
      >
        {/* Top Dismiss Button */}
        <div className="flex justify-between items-center px-1 mb-2">
          <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">Control Center</span>
          <button
            onClick={() => {
              iosHaptics.tap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Connectivity 2x2 Pod */}
          <div className="p-3.5 bg-neutral-900/80 border border-white/10 rounded-3xl grid grid-cols-2 gap-3 shadow-xl">
            <button
              onClick={() => {
                iosHaptics.tap();
                setWifiOn(!wifiOn);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                wifiOn ? "bg-blue-500 text-white" : "bg-white/15 text-white/60"
              }`}
            >
              <Wifi className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                iosHaptics.tap();
                setBtOn(!btOn);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                btOn ? "bg-blue-500 text-white" : "bg-white/15 text-white/60"
              }`}
            >
              <Bluetooth className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                iosHaptics.tap();
                setAirdropOn(!airdropOn);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                airdropOn ? "bg-blue-500 text-white" : "bg-white/15 text-white/60"
              }`}
            >
              <Radio className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                iosHaptics.tap();
                setFocusOn(!focusOn);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                focusOn ? "bg-purple-500 text-white" : "bg-white/15 text-white/60"
              }`}
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>

          {/* Now Playing Widget Pod */}
          <div className="p-3.5 bg-neutral-900/80 border border-white/10 rounded-3xl flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[11px] font-semibold text-white/40 uppercase">Audio</span>
              <p className="text-xs font-bold text-white mt-1 truncate">Lo-Fi Midnight Chill</p>
              <p className="text-[10px] text-white/60 truncate">Harsh Srivastava</p>
            </div>
            <div className="flex items-center justify-between text-white/80 pt-2">
              <span className="text-[10px] text-blue-400 font-medium">HarshOS Beats</span>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            </div>
          </div>

          {/* Brightness Vertical Slider */}
          <div className="p-3.5 bg-neutral-900/80 border border-white/10 rounded-3xl flex items-center justify-between shadow-xl">
            <Sun className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              type="range"
              min="20"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-28 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Volume Vertical Slider */}
          <div className="p-3.5 bg-neutral-900/80 border border-white/10 rounded-3xl flex items-center justify-between shadow-xl">
            <Volume2 className="w-5 h-5 text-blue-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-28 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Bottom Quick Utilities */}
        <div className="grid grid-cols-4 gap-3 pt-2">
          {/* Torch */}
          <button
            onClick={() => {
              iosHaptics.tap();
              setTorchOn(!torchOn);
            }}
            className={`h-16 rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/10 ${
              torchOn ? "bg-white text-black" : "bg-neutral-900/80 text-white"
            }`}
          >
            <Flashlight className="w-5 h-5" />
            <span className="text-[10px] font-medium">Torch</span>
          </button>

          {/* Camera */}
          <button
            onClick={() => {
              iosHaptics.tap();
              onClose();
              onOpenCamera();
            }}
            className="h-16 rounded-2xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center gap-1 text-white hover:bg-neutral-800"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-medium">Camera</span>
          </button>

          {/* Lock Screen Trigger */}
          <button
            onClick={() => {
              iosHaptics.lock();
              onClose();
              onLockScreen();
            }}
            className="h-16 rounded-2xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center gap-1 text-amber-400 hover:bg-neutral-800"
          >
            <Lock className="w-5 h-5" />
            <span className="text-[10px] font-medium">Lock</span>
          </button>

          {/* Close */}
          <button
            onClick={() => {
              iosHaptics.tap();
              onClose();
            }}
            className="h-16 rounded-2xl bg-neutral-900/80 border border-white/10 flex flex-col items-center justify-center gap-1 text-white/70 hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
            <span className="text-[10px] font-medium">Done</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
