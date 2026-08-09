"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaApple } from "react-icons/fa6";

interface MacOSBootScreenProps {
  onComplete: () => void;
  forceReboot?: boolean;
}

export default function MacOSBootScreen({ onComplete, forceReboot = false }: MacOSBootScreenProps) {
  const [phase, setPhase] = useState<"initial" | "logo" | "bar" | "filling" | "glow" | "fadeout" | "done">("initial");
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Check if boot sequence was already completed in this session
    if (!forceReboot && typeof window !== "undefined") {
      if (sessionStorage.getItem("portfolioBootCompleted") === "true") {
        setPhase("done");
        onComplete();
        return;
      }
    }

    // Lock scrolling during the boot sequence
    document.body.style.overflow = "hidden";

    // Full 4.0-Second (4000ms) Uninterrupted Sequence Timeline
    // 0 - 350ms: Pure black screen with vignette
    const t1 = setTimeout(() => setPhase("logo"), 350);

    // 350 - 1000ms: Apple logo softly fades in & scales 0.92 -> 1.0 with glow bloom
    const t2 = setTimeout(() => setPhase("bar"), 1000);

    // 1000 - 1600ms: Progress bar track appears
    const t3 = setTimeout(() => {
      setPhase("filling");
      setProgress(100); // 1600ms fill animation
    }, 1600);

    // 3200 - 3600ms: Progress reaches 100%, logo brightens by ~8%, ambient sky-blue glow
    const t4 = setTimeout(() => setPhase("glow"), 3200);

    // 3600 - 4000ms: Smooth crossfade transition into desktop wallpaper
    const t5 = setTimeout(() => setPhase("fadeout"), 3600);

    // Exactly 4000ms (4.0 sec): Complete boot
    const t6 = setTimeout(() => {
      setPhase("done");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("portfolioBootCompleted", "true");
      }
      document.body.style.overflow = "";
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      document.body.style.overflow = "";
    };
  }, [forceReboot, onComplete]);

  // Web Audio Startup Chime
  const playStartupChime = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
      setSoundEnabled(true);
    } catch {
      // Audio autoplay disabled or unpermitted
    }
  };

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="macOSBootScreen"
        initial={{ opacity: 1, filter: "blur(0px)" }}
        animate={{
          opacity: phase === "fadeout" ? 0 : 1,
          filter: phase === "fadeout" ? "blur(18px)" : "blur(0px)",
        }}
        exit={{ opacity: 0, filter: "blur(24px)" }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="fixed inset-0 z-[999999] bg-[#000000] flex flex-col items-center justify-center select-none pointer-events-auto overflow-hidden"
      >
        {/* Subtle Film Grain Texture & Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_rgba(0,0,0,0.85)_100%)]" />

        {/* Ambient Sky-Blue Bottom Glow (3200ms - 4000ms transition hint) */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0.5 }}
          animate={{
            opacity: phase === "glow" || phase === "fadeout" ? 0.35 : 0,
            scaleY: phase === "glow" || phase === "fadeout" ? 1 : 0.5,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 inset-x-0 h-64 z-0 pointer-events-none bg-gradient-to-t from-sky-500/30 via-indigo-500/10 to-transparent blur-3xl"
        />

        {/* Perfectly Centered Container: Logo & macOS Progress Bar */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-10">
          {/* Centered Apple Logo Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: phase === "initial" ? 0 : 1,
              scale: phase === "glow" ? 1.03 : phase === "initial" ? 0.92 : 1,
              filter:
                phase === "glow"
                  ? "brightness(1.1) drop-shadow(0 0 28px rgba(255, 255, 255, 0.75))"
                  : "brightness(1.0) drop-shadow(0 0 16px rgba(255, 255, 255, 0.35))",
            }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1], // Custom hardware ease-out curve
            }}
            className="relative cursor-pointer group flex items-center justify-center"
            onClick={playStartupChime}
            title={soundEnabled ? "Startup Chime Active" : "Click logo to test macOS Chime"}
          >
            {/* Pure White Apple Icon from react-icons/fa6 */}
            <FaApple className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.5)] transition-all duration-300" />
          </motion.div>

          {/* macOS Boot Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "initial" || phase === "logo" ? 0 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-[220px] sm:w-[250px] h-[3px] rounded-full bg-[rgba(255,255,255,0.12)] relative overflow-hidden shadow-inner"
          >
            {/* White Animated Progress Fill */}
            <div
              style={{
                width: `${progress}%`,
                transition: "width 1600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="h-full bg-white rounded-full relative shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            >
              {/* Subtle Moving Shimmer Highlight Line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent shimmer" />
            </div>
          </motion.div>
        </div>

        {/* Small Bottom Status Prompt */}
        <div className="absolute bottom-6 text-[11px] text-white/30 tracking-widest font-mono uppercase">
          macOS Sequoia 15.0 • Harsh Srivastava Portfolio
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
