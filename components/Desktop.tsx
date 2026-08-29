"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/lib/windowStore";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import WarpText from "./WarpText";

import FinderWindow from "./windows/FinderWindow";
import SafariWindow from "./windows/SafariWindow";
import TerminalWindow from "./windows/TerminalWindow";
import ContactWindow from "./windows/ContactWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ResumeWindow from "./windows/ResumeWindow";
import CertificationsWindow from "./windows/CertificationsWindow";
import ExperienceWindow from "./windows/ExperienceWindow";
import TrashWindow from "./windows/TrashWindow";
import MusicWindow from "./windows/MusicWindow";
import CalculatorWindow from "./windows/CalculatorWindow";
import SystemSettingsWindow from "./windows/SystemSettingsWindow";
import SiriAssistant from "./macos/SiriAssistant";

import IPhoneView from "./mobile/IPhoneView";
import SpotlightSearch from "./macos/SpotlightSearch";
import ControlCenter, { WallpaperId } from "./macos/ControlCenter";
import WidgetsSidebar from "./macos/WidgetsSidebar";
import NotificationCenter from "./macos/NotificationCenter";
import ScreenSaver from "./macos/ScreenSaver";

import FullscreenToast, { useFullscreen } from "./macos/FullscreenManager";
import PWAInstaller from "./macos/PWAInstaller";
import MacOSBootScreen from "./macos/MacOSBootScreen";

export default function Desktop() {
  const {
    windows,
    desktopItems,
    selectedIcon,
    bouncingDockId,
    setSelectedIcon,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    toggleWindow,
    moveToTrash,
    restoreFromTrash,
    emptyTrash,
  } = useWindowStore();

  const { isFullscreen, toggleFullscreen, showToast, setShowToast } = useFullscreen();

  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperId>("wallpaper");
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(80);
  const [focusActive, setFocusActive] = useState(false);
  const [isBootCompleted, setIsBootCompleted] = useState(false);
  const [forceReboot, setForceReboot] = useState(false);

  const handleTriggerReboot = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("portfolioBootSeen");
      localStorage.removeItem("portfolioBootSeen");
    }
    setIsBootCompleted(false);
    setForceReboot(true);
    setTimeout(() => setForceReboot(false), 3600);
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Deselect desktop icon when clicking empty desktop area
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
      setIsControlCenterOpen(false);
      setIsWidgetsOpen(false);
      setIsNotificationCenterOpen(false);
    }
  };

  const visibleDesktopItems = desktopItems.filter((item) => !item.isTrashed);
  const trashedDesktopItems = desktopItems.filter((item) => item.isTrashed);

  const wallpaperPaths: Record<WallpaperId, string> = {
    wallpaper: "/wallpaper.jpg",
    wallpap: "/wallpap.jpg",
    img: "/img.png",
    dark: "/wallpaper.jpg",
  };

  return (
    <>
      {/* Real macOS Sequoia Hardware Boot Loading Screen */}
      <MacOSBootScreen
        forceReboot={forceReboot}
        onComplete={() => setIsBootCompleted(true)}
      />

      {/* Mobile Responsive Realistic iOS iPhone Application View (for screens < 768px) */}
      <IPhoneView />

      {/* macOS Sonoma Motion Screen Saver (triggers on 60s idle) */}
      <ScreenSaver />

      {/* Fullscreen API Toast Notification */}
      <FullscreenToast show={showToast} onClose={() => setShowToast(false)} />

      {/* PWA Standalone App Installer Notification Banner */}
      <PWAInstaller />

      {/* Desktop macOS Application View (for screens >= 768px) */}
      <div
        onClick={handleDesktopClick}
        style={{ filter: `brightness(${brightness}%)`, transition: "filter 150ms ease" }}
        className="hidden md:flex relative w-screen h-screen overflow-hidden bg-slate-950 select-none flex-col justify-between"
      >
        {/* 1. Wallpaper Background & Soft Blur Sharpness Transition */}
        <div
          className={`absolute inset-0 z-0 transition-all duration-500 ease-out ${isBootCompleted ? "blur-none opacity-100 scale-100" : "blur-xl opacity-40 scale-105"
            }`}
        >
          <Image
            src={wallpaperPaths[currentWallpaper]}
            alt="macOS Wallpaper"
            fill
            priority
            className="object-cover object-center transition-all duration-300"
          />
          <div
            className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${currentWallpaper === "dark" ? "bg-black/60 backdrop-blur-xs" : "bg-black/10"
              }`}
          />
        </div>

        {/* 2. Top Menu Bar */}
        <MenuBar
          onOpenWindow={openWindow}
          onToggleSpotlight={() => setIsSpotlightOpen(!isSpotlightOpen)}
          onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
          onToggleWidgets={() => setIsWidgetsOpen(!isWidgetsOpen)}
          onToggleNotifications={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
          onToggleFullscreen={toggleFullscreen}
          onTriggerReboot={handleTriggerReboot}
          isFullscreen={isFullscreen}
        />

        {/* 3. macOS Overlays (Control Center, Spotlight, Widgets Sidebar, Notification Center, Siri AI) */}
        <SpotlightSearch
          isOpen={isSpotlightOpen}
          onClose={() => setIsSpotlightOpen(false)}
          onOpenWindow={openWindow}
        />

        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
          currentWallpaper={currentWallpaper}
          onSelectWallpaper={(id) => setCurrentWallpaper(id)}
          brightness={brightness}
          setBrightness={setBrightness}
          volume={volume}
          setVolume={setVolume}
          focusActive={focusActive}
          setFocusActive={setFocusActive}
          onOpenWindow={openWindow}
        />

        <WidgetsSidebar
          isOpen={isWidgetsOpen}
          onClose={() => setIsWidgetsOpen(false)}
        />

        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          onOpenWindow={openWindow}
        />

        <SiriAssistant
          isOpen={windows.siri?.isOpen && !windows.siri?.isMinimized}
          onClose={() => closeWindow("siri")}
        />

        {/* 4. Hero Section (Positioned lower at Bottom Right Edge) */}
        <div className="absolute -bottom-10 right-4 md:-bottom-12 md:right-6 z-0 pointer-events-none text-right flex justify-end">
          <div className="w-80 sm:w-96 md:w-[420px] pointer-events-auto">
            <WarpText
              text={"Hey, I'm Harsh! welcome to my\nportfolio."}
              color="#ffffff"
              warpStrength={0.06}
              warpScale={1.4}
              speed={0.5}
              pointerInfluence={0.35}
              pointerStrength={0.3}
              refraction={0.015}
              ripple
              fontSize="clamp(1.1rem, 2.1vw, 2.1rem)"
              fontWeight={200}
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'San Francisco', 'Helvetica Neue', sans-serif"
              letterSpacing={-0.03}
              lineHeight={1.05}
              style={{ height: '110px', width: '100%' }}
            />
          </div>
        </div>

        {/* 5. Desktop Icons (Draggable & Droppable with 40ms stagger entrance) */}
        <div className="hidden md:flex flex-col gap-4 absolute top-14 left-6 z-20 pointer-events-none">
          {visibleDesktopItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{
                opacity: isBootCompleted ? 1 : 0,
                scale: isBootCompleted ? 1 : 0.9,
                y: isBootCompleted ? 0 : 8,
              }}
              transition={{
                duration: 0.2,
                delay: isBootCompleted ? 0.15 + idx * 0.04 : 0,
                ease: "easeOut",
              }}
              className="pointer-events-auto"
            >
              <DesktopIcon
                itemId={item.id}
                windowId={item.windowId}
                label={item.label}
                iconType={item.iconType}
                isSelected={selectedIcon === item.id}
                onSelect={(id) => setSelectedIcon(id)}
                onOpen={(wId) => openWindow(wId)}
                onMoveToTrash={(id) => moveToTrash(id)}
              />
            </motion.div>
          ))}
        </div>

        {/* 6. Windows Layer */}
        <AnimatePresence>
          {/* Finder Window */}
          <Window
            key="finder"
            id="finder"
            title="Portfolio — Finder"
            windowState={windows.finder}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 20, y: 0 }}
          >
            <FinderWindow onOpenWindow={openWindow} />
          </Window>

          {/* Safari Window (Top 10 AI & Fullstack Blogs) */}
          <Window
            key="safari"
            id="safari"
            title="Safari — Top 10 AI & Fullstack Articles"
            windowState={windows.safari}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 0, y: -10 }}
            width="max-w-5xl w-[94vw] md:w-[880px]"
            height="h-[580px] md:h-[620px]"
          >
            <SafariWindow />
          </Window>

          {/* Experience Window */}
          <Window
            key="experience"
            id="experience"
            title="Work Experience — Professional History"
            windowState={windows.experience}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: -20, y: -10 }}
            width="max-w-4xl w-[94vw] md:w-[840px]"
            height="h-[560px] md:h-[600px]"
          >
            <ExperienceWindow />
          </Window>

          {/* Certifications Window */}
          <Window
            key="certifications"
            id="certifications"
            title="Certifications & Accreditations — 3D Gallery"
            windowState={windows.certifications}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 0, y: 0 }}
            width="max-w-6xl w-[96vw] md:w-[940px]"
            height="h-[580px] md:h-[620px]"
          >
            <CertificationsWindow />
          </Window>

          {/* Terminal Window */}
          <Window
            key="terminal"
            id="terminal"
            title="Tech Stack — zsh"
            windowState={windows.terminal}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: -40, y: 15 }}
            width="max-w-2xl w-[92vw] md:w-[680px]"
            height="h-[460px] md:h-[500px]"
          >
            <TerminalWindow />
          </Window>

          {/* Contact Window */}
          <Window
            key="contact"
            id="contact"
            title="Contact Me"
            windowState={windows.contact}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 30, y: 25 }}
            width="max-w-2xl w-[92vw] md:w-[700px]"
            height="h-[480px] md:h-[520px]"
          >
            <ContactWindow />
          </Window>

          {/* Projects Window */}
          <Window
            key="projects"
            id="projects"
            title="Featured Projects"
            windowState={windows.projects}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: -10, y: -10 }}
            width="max-w-5xl w-[94vw] md:w-[860px]"
            height="h-[560px] md:h-[600px]"
          >
            <ProjectsWindow />
          </Window>

          {/* Resume Window */}
          <Window
            key="resume"
            id="resume"
            title="Harsh Srivastava — Resume"
            windowState={windows.resume}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 10, y: 10 }}
            width="max-w-4xl w-[92vw] md:w-[780px]"
            height="h-[540px] md:h-[580px]"
          >
            <ResumeWindow />
          </Window>

          {/* System Settings Window */}
          <Window
            key="settings"
            id="settings"
            title="System Settings — Hardware & Specs"
            windowState={windows.settings}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 15, y: -15 }}
            width="max-w-4xl w-[92vw] md:w-[820px]"
            height="h-[540px] md:h-[580px]"
          >
            <SystemSettingsWindow />
          </Window>

          {/* Music Window */}
          <Window
            key="music"
            id="music"
            title="Apple Music — Developer Lo-Fi Beats"
            windowState={windows.music}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: -30, y: 20 }}
            width="max-w-5xl w-[94vw] md:w-[860px]"
            height="h-[580px] md:h-[620px]"
          >
            <MusicWindow />
          </Window>

          {/* Calculator Window */}
          <Window
            key="calculator"
            id="calculator"
            title="Calculator"
            windowState={windows.calculator}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 35, y: 20 }}
            width="max-w-xs w-[85vw] md:w-[310px]"
            height="h-[490px] md:h-[510px]"
          >
            <CalculatorWindow />
          </Window>

          {/* Trash Window */}
          <Window
            key="trash"
            id="trash"
            title="Trash Bin"
            windowState={windows.trash}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            initialPos={{ x: 40, y: 30 }}
            width="max-w-2xl w-[92vw] md:w-[640px]"
            height="h-[460px] md:h-[500px]"
          >
            <TrashWindow
              trashedItems={trashedDesktopItems}
              onRestoreItem={restoreFromTrash}
              onEmptyTrash={emptyTrash}
            />
          </Window>
        </AnimatePresence>

        {/* 7. Bottom Floating Glass Dock (rises 12px & fades in over 220ms) */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{
            y: isBootCompleted ? 0 : 12,
            opacity: isBootCompleted ? 1 : 0,
          }}
          transition={{
            duration: 0.22,
            delay: 0.1,
            ease: "easeOut",
          }}
        >
          <Dock
            windows={windows}
            onToggleWindow={toggleWindow}
            bouncingDockId={bouncingDockId}
          />
        </motion.div>
      </div>
    </>
  );
}
