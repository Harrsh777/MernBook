"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt if user hasn't dismissed before
      const dismissed = localStorage.getItem("pwa_prompt_dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 right-6 z-[999980] max-w-sm w-full select-none">
      <div className="bg-[#1c1c1e]/95 border border-white/20 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl text-white flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
              <Image src="/apple finder.png" alt="App Icon" fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Install macOS Portfolio App</h4>
              <p className="text-[11px] text-white/60 leading-snug">
                Open in a dedicated window without browser tabs or address bar.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 font-medium text-xs border border-white/10 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
