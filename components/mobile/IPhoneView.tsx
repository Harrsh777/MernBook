"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share2, MoreHorizontal } from "lucide-react";
import { iosHaptics } from "@/lib/iosHaptics";

import IPhoneLockScreen from "./IPhoneLockScreen";
import IPhoneHomeScreen, { AppId } from "./IPhoneHomeScreen";
import IPhoneControlCenter from "./IPhoneControlCenter";
import {
  ProjectsApp,
  ExperienceApp,
  ResumeApp,
  CertificationsApp,
  TerminalApp,
  MusicApp,
  MessagesApp,
  CalculatorApp,
  SettingsApp,
  CameraApp,
  SafariApp,
} from "./apps/IPhoneApps";

export default function IPhoneView() {
  const [isLocked, setIsLocked] = useState(true);
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState<string>("/ios-clean-wallpaper.jpg");
  const [brightness, setBrightness] = useState<number>(100);
  const [volume, setVolume] = useState<number>(80);

  // App titles mapping
  const appTitles: Record<AppId, string> = {
    projects: "Projects",
    experience: "Experience",
    resume: "Resume & CV",
    certs: "Certificates",
    terminal: "Terminal",
    safari: "Safari Blogs",
    music: "Apple Music",
    calculator: "Calculator",
    messages: "Messages",
    settings: "Settings",
    camera: "Camera",
    photos: "Projects Gallery",
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLock = () => {
    iosHaptics.lock();
    setOpenApp(null);
    setIsControlCenterOpen(false);
    setIsLocked(true);
  };

  const handleOpenApp = (appId: AppId) => {
    setOpenApp(appId);
  };

  const handleCloseApp = () => {
    iosHaptics.tap();
    setOpenApp(null);
  };

  return (
    <div
      style={{ filter: `brightness(${brightness}%)` }}
      className="md:hidden fixed inset-0 z-50 w-screen h-[100dvh] bg-black overflow-hidden select-none font-sans"
    >
      {/* 1. iOS Lock Screen Overlay */}
      <AnimatePresence>
        {isLocked && (
          <IPhoneLockScreen
            onUnlock={handleUnlock}
            onOpenCamera={() => {
              setIsLocked(false);
              setOpenApp("camera");
            }}
            wallpaperSrc={wallpaper}
          />
        )}
      </AnimatePresence>

      {/* 2. iOS Home Screen */}
      {!isLocked && (
        <div className="relative w-full h-full">
          <IPhoneHomeScreen
            onOpenApp={handleOpenApp}
            onOpenControlCenter={() => setIsControlCenterOpen(true)}
            wallpaperSrc={wallpaper}
          />

          {/* 3. Open App Modal with iOS Spring Open / Close Transition */}
          <AnimatePresence>
            {openApp && (
              <motion.div
                key={openApp}
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 40 }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                className="absolute inset-0 z-40 bg-[#161618] text-white flex flex-col justify-between overflow-hidden"
              >
                {/* App Top Navigation Bar */}
                <div className="pt-2 px-4 pb-2 bg-[#1c1c1e] border-b border-white/10 flex items-center justify-between shrink-0">
                  <button
                    onClick={handleCloseApp}
                    className="flex items-center gap-1 text-blue-400 text-sm font-medium active:opacity-60"
                  >
                    <ChevronLeft className="w-5 h-5 -ml-1" />
                    <span>Home</span>
                  </button>

                  <h1 className="text-xs font-bold text-white tracking-tight">
                    {appTitles[openApp]}
                  </h1>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLock()}
                      className="text-xs text-white/50 hover:text-white"
                      title="Lock Device"
                    >
                      Lock
                    </button>
                  </div>
                </div>

                {/* App Content Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {openApp === "projects" && <ProjectsApp />}
                  {openApp === "experience" && <ExperienceApp />}
                  {openApp === "resume" && <ResumeApp />}
                  {openApp === "certs" && <CertificationsApp />}
                  {openApp === "terminal" && <TerminalApp />}
                  {openApp === "safari" && <SafariApp />}
                  {openApp === "music" && <MusicApp />}
                  {openApp === "calculator" && <CalculatorApp />}
                  {openApp === "messages" && <MessagesApp />}
                  {openApp === "camera" && <CameraApp />}
                  {openApp === "photos" && <ProjectsApp />}
                  {openApp === "settings" && (
                    <SettingsApp
                      currentWallpaper={wallpaper}
                      onSelectWallpaper={(wp) => setWallpaper(wp)}
                    />
                  )}
                </div>

                {/* iOS Bottom Swipe-Up Home Bar (Tapping or swiping closes app to home) */}
                <div
                  onClick={handleCloseApp}
                  onPointerUp={handleCloseApp}
                  className="h-10 bg-[#1c1c1e] border-t border-white/5 flex items-center justify-center cursor-pointer shrink-0 z-50 active:opacity-60 transition-opacity py-2"
                >
                  <div className="w-36 h-1.5 bg-white/80 rounded-full hover:bg-white transition-colors pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. iOS Control Center Overlay */}
          <IPhoneControlCenter
            isOpen={isControlCenterOpen}
            onClose={() => setIsControlCenterOpen(false)}
            onLockScreen={handleLock}
            onOpenCamera={() => {
              setIsControlCenterOpen(false);
              setOpenApp("camera");
            }}
            brightness={brightness}
            setBrightness={setBrightness}
            volume={volume}
            setVolume={setVolume}
          />
        </div>
      )}
    </div>
  );
}
