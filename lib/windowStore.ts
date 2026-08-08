"use client";

import { useState, useCallback, useEffect } from "react";

export type WindowId =
  | "finder"
  | "safari"
  | "terminal"
  | "contact"
  | "projects"
  | "resume"
  | "certifications"
  | "experience"
  | "trash"
  | "music"
  | "calculator"
  | "siri"
  | "settings";

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface DesktopItem {
  id: string;
  windowId: WindowId;
  label: string;
  iconType: "folder" | "file";
  isTrashed?: boolean;
}

const INITIAL_DESKTOP_ITEMS: DesktopItem[] = [
  { id: "projects-icon", windowId: "projects", label: "Projects", iconType: "folder" },
  { id: "experience-icon", windowId: "experience", label: "Experience", iconType: "folder" },
  { id: "certifications-icon", windowId: "certifications", label: "Certifications", iconType: "folder" },
  { id: "resume-icon", windowId: "resume", label: "Resume.pdf", iconType: "file" },
];

export function useWindowStore() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    finder: { isOpen: false, isMinimized: false, zIndex: 10 },
    safari: { isOpen: false, isMinimized: false, zIndex: 10 },
    terminal: { isOpen: false, isMinimized: false, zIndex: 10 },
    contact: { isOpen: false, isMinimized: false, zIndex: 10 },
    projects: { isOpen: false, isMinimized: false, zIndex: 10 },
    resume: { isOpen: false, isMinimized: false, zIndex: 10 },
    certifications: { isOpen: false, isMinimized: false, zIndex: 10 },
    experience: { isOpen: false, isMinimized: false, zIndex: 10 },
    trash: { isOpen: false, isMinimized: false, zIndex: 10 },
    music: { isOpen: false, isMinimized: false, zIndex: 10 },
    calculator: { isOpen: false, isMinimized: false, zIndex: 10 },
    siri: { isOpen: false, isMinimized: false, zIndex: 10 },
    settings: { isOpen: false, isMinimized: false, zIndex: 10 },
  });

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(INITIAL_DESKTOP_ITEMS);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [bouncingDockId, setBouncingDockId] = useState<WindowId | null>(null);
  const [, setMaxZIndex] = useState<number>(20);

  const triggerDockBounce = useCallback((id: WindowId) => {
    setBouncingDockId(id);
    setTimeout(() => {
      setBouncingDockId((curr) => (curr === id ? null : curr));
    }, 500);
  }, []);

  const openWindow = useCallback(
    (id: WindowId) => {
      triggerDockBounce(id);
      setMaxZIndex((prev) => {
        const nextZ = prev + 1;
        setWindows((w) => ({
          ...w,
          [id]: {
            ...w[id],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          },
        }));
        return nextZ;
      });
      setActiveWindow(id);
    },
    [triggerDockBounce]
  );

  const closeWindow = useCallback(
    (id: WindowId) => {
      triggerDockBounce(id);
      setWindows((w) => ({
        ...w,
        [id]: {
          ...w[id],
          isOpen: false,
          isMinimized: false,
        },
      }));
      setActiveWindow((current) => (current === id ? null : current));
    },
    [triggerDockBounce]
  );

  const minimizeWindow = useCallback(
    (id: WindowId) => {
      triggerDockBounce(id);
      setWindows((w) => ({
        ...w,
        [id]: {
          ...w[id],
          isMinimized: true,
          isOpen: false,
        },
      }));
      setActiveWindow((current) => (current === id ? null : current));
    },
    [triggerDockBounce]
  );

  const focusWindow = useCallback((id: WindowId) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: {
          ...w[id],
          zIndex: nextZ,
          isMinimized: false,
        },
      }));
      return nextZ;
    });
    setActiveWindow(id);
  }, []);

  const toggleWindow = useCallback(
    (id: WindowId) => {
      setWindows((w) => {
        const target = w[id];
        if (!target.isOpen) {
          openWindow(id);
          return w;
        } else {
          closeWindow(id);
          return w;
        }
      });
    },
    [openWindow, closeWindow]
  );

  const moveToTrash = useCallback((itemId: string) => {
    setDesktopItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, isTrashed: true } : item))
    );
  }, []);

  const restoreFromTrash = useCallback((itemId: string) => {
    setDesktopItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, isTrashed: false } : item))
    );
  }, []);

  const emptyTrash = useCallback(() => {
    setDesktopItems((items) => items.filter((item) => !item.isTrashed));
  }, []);

  // Handle ESC key to close active top window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeWindow) {
        closeWindow(activeWindow);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWindow, closeWindow]);

  return {
    windows,
    desktopItems,
    activeWindow,
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
  };
}
