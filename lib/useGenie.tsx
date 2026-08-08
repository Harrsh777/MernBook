"use client";

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  left?: number;
  top?: number;
}

export interface MinimizeParams {
  windowId: string;
  windowRef: React.RefObject<HTMLElement | null>;
  dockRef?: React.RefObject<HTMLElement | null>;
  dockRect?: Rect;
  onComplete?: () => void;
}

export interface RestoreParams {
  windowId: string;
  dockRef?: React.RefObject<HTMLElement | null>;
  dockRect?: Rect;
  targetRect: Rect;
  onComplete?: () => void;
}

interface GenieContextType {
  minimizeWindow: (params: MinimizeParams) => void;
  restoreWindow: (params: RestoreParams) => void;
  saveWindowRect: (id: string, rect: Rect) => void;
  getSavedRect: (id: string) => Rect | null;
}

const GenieContext = createContext<GenieContextType | null>(null);

// Cubic Bezier curve evaluator for (0.2, 0.8, 0.2, 1)
function genieEase(t: number): number {
  const cx = 3 * 0.2;
  const bx = 3 * (0.2 - 0.2) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * 0.8;
  const by = 3 * (1.0 - 0.8) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(time: number) {
    return ((ax * time + bx) * time + cx) * time;
  }
  function sampleCurveY(time: number) {
    return ((ay * time + by) * time + cy) * time;
  }
  function solveCurveX(x: number) {
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < 1e-4) return t2;
      const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
      if (Math.abs(d2) < 1e-4) break;
      t2 = t2 - x2 / d2;
    }
    return t2;
  }
  return sampleCurveY(solveCurveX(t));
}

// Quadratic Bezier interpolation
function quadBezier(p0: number, p1: number, p2: number, t: number): number {
  const oneMinusT = 1 - t;
  return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
}

export function GenieProvider({ children }: { children: React.ReactNode }) {
  const portalRootRef = useRef<HTMLDivElement | null>(null);
  const savedRects = useRef<Record<string, Rect>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saveWindowRect = useCallback((id: string, rect: Rect) => {
    savedRects.current[id] = rect;
  }, []);

  const getSavedRect = useCallback((id: string): Rect | null => {
    return savedRects.current[id] || null;
  }, []);

  const minimizeWindow = useCallback(({ windowRef, dockRef, dockRect, onComplete }: MinimizeParams) => {
    const el = windowRef.current;
    if (!el) {
      onComplete?.();
      return;
    }

    const rect = el.getBoundingClientRect();
    const rawDockRect = dockRef?.current
      ? dockRef.current.getBoundingClientRect()
      : dockRect || {
          left: window.innerWidth / 2 - 25,
          top: window.innerHeight - 50,
          x: window.innerWidth / 2 - 25,
          y: window.innerHeight - 50,
          width: 50,
          height: 50,
        };

    const dockLeft = rawDockRect.left ?? rawDockRect.x;
    const dockTop = rawDockRect.top ?? rawDockRect.y;

    const startX = rect.left;
    const startY = rect.top;
    const startW = rect.width;
    const startH = rect.height;

    const targetX = dockLeft + rawDockRect.width / 2;
    const targetY = dockTop + rawDockRect.height / 2;

    const controlX = (startX + targetX) / 2;
    const controlY = Math.max(startY, targetY) + 140;

    // Create ghost clone for portal rendering
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.margin = "0";
    clone.style.pointerEvents = "none";
    clone.style.transformOrigin = "center top";
    clone.style.position = "absolute";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.width = `${startW}px`;
    clone.style.height = `${startH}px`;
    clone.style.willChange = "transform, opacity, clip-path";

    const ghostContainer = document.createElement("div");
    ghostContainer.style.position = "fixed";
    ghostContainer.style.left = "0";
    ghostContainer.style.top = "0";
    ghostContainer.style.width = `${startW}px`;
    ghostContainer.style.height = `${startH}px`;
    ghostContainer.style.pointerEvents = "none";
    ghostContainer.style.zIndex = "999999";
    ghostContainer.style.willChange = "transform, opacity, clip-path";
    ghostContainer.appendChild(clone);

    if (portalRootRef.current) {
      portalRootRef.current.appendChild(ghostContainer);
    }

    // Hide original window node
    el.style.opacity = "0";

    // Dock Icon Glow / Scale Effect
    if (dockRef?.current) {
      dockRef.current.style.transition = "transform 200ms ease, box-shadow 200ms ease";
      dockRef.current.style.transform = "scale(1.18)";
      dockRef.current.style.boxShadow = "0 0 24px rgba(255, 255, 255, 0.45)";
      setTimeout(() => {
        if (dockRef.current) {
          dockRef.current.style.transform = "scale(1)";
          dockRef.current.style.boxShadow = "none";
        }
      }, 350);
    }

    const duration = 420; // 420ms
    const startTime = performance.now();

    function animateFrame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedT = genieEase(progress);

      // Trajectory calculation via Quadratic Bezier
      const currX = quadBezier(startX, controlX, targetX - startW / 2, easedT);
      const currY = quadBezier(startY, controlY, targetY - startH / 2, easedT);

      // Stage 1 (0 to 120ms): Top Compression
      // Stage 2 (120 to 300ms): Funnel Distortion
      // Stage 3 (300 to 420ms): Dock Absorption
      let scaleY = 1;
      let scaleX = 1;
      let opacity = 1;
      let borderRadius = 18;
      let polygonStr = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
      let skewX = 0;

      if (elapsed < 120) {
        const p1 = elapsed / 120;
        scaleY = 1 - p1 * 0.18; // 1 -> 0.82
        borderRadius = 18 + p1 * 10; // 18px -> 28px
      } else if (elapsed < 300) {
        const p2 = (elapsed - 120) / 180;
        scaleY = 0.82 - p2 * 0.45;
        scaleX = 1 - p2 * 0.55;
        borderRadius = 28 + p2 * 12;

        // Clip path funnel: bottom narrows inward
        const bottomInset = p2 * 28; // 0% -> 28%
        polygonStr = `polygon(0% 0%, 100% 0%, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`;

        // Skew towards dock direction
        const dir = targetX > startX ? 1 : -1;
        skewX = dir * p2 * 12;
      } else {
        const p3 = (elapsed - 300) / 120;
        scaleY = 0.37 * (1 - p3);
        scaleX = 0.45 * (1 - p3 * 0.73); // down to ~0.12
        opacity = 1 - p3;
        borderRadius = 40;

        const bottomInset = 28 + p3 * 18; // narrows further
        polygonStr = `polygon(0% 0%, 100% 0%, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`;
      }

      ghostContainer.style.transform = `translate3d(${currX}px, ${currY}px, 0px) scale(${scaleX}, ${scaleY}) skewX(${skewX}deg)`;
      ghostContainer.style.opacity = `${opacity}`;
      ghostContainer.style.borderRadius = `${borderRadius}px`;
      ghostContainer.style.clipPath = polygonStr;

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        // Complete minimize
        if (ghostContainer.parentNode) {
          ghostContainer.parentNode.removeChild(ghostContainer);
        }
        onComplete?.();
      }
    }

    requestAnimationFrame(animateFrame);
  }, []);

  const restoreWindow = useCallback(({ dockRef, dockRect, targetRect, onComplete }: RestoreParams) => {
    const rawDockRect = dockRef?.current
      ? dockRef.current.getBoundingClientRect()
      : dockRect || {
          left: window.innerWidth / 2 - 25,
          top: window.innerHeight - 50,
          x: window.innerWidth / 2 - 25,
          y: window.innerHeight - 50,
          width: 50,
          height: 50,
        };

    const dockLeft = rawDockRect.left ?? rawDockRect.x;
    const dockTop = rawDockRect.top ?? rawDockRect.y;

    const targetX = targetRect.x;
    const targetY = targetRect.y;
    const targetW = targetRect.width;
    const targetH = targetRect.height;

    const startX = dockLeft + rawDockRect.width / 2;
    const startY = dockTop + rawDockRect.height / 2;

    const controlX = (startX + targetX) / 2;
    const controlY = Math.max(startY, targetY) + 140;

    // Create ghost container for restoring clone
    const ghostContainer = document.createElement("div");
    ghostContainer.style.position = "fixed";
    ghostContainer.style.left = "0";
    ghostContainer.style.top = "0";
    ghostContainer.style.width = `${targetW}px`;
    ghostContainer.style.height = `${targetH}px`;
    ghostContainer.style.pointerEvents = "none";
    ghostContainer.style.zIndex = "999999";
    ghostContainer.style.background = "#1c1c1e";
    ghostContainer.style.borderRadius = "18px";
    ghostContainer.style.border = "1px solid rgba(255, 255, 255, 0.15)";
    ghostContainer.style.boxShadow = "0 20px 50px rgba(0,0,0,0.8)";
    ghostContainer.style.willChange = "transform, opacity, clip-path";

    if (portalRootRef.current) {
      portalRootRef.current.appendChild(ghostContainer);
    }

    // Dock Icon bounce during restore
    if (dockRef?.current) {
      dockRef.current.style.transition = "transform 150ms ease";
      dockRef.current.style.transform = "scale(1.08)";
      setTimeout(() => {
        if (dockRef.current) dockRef.current.style.transform = "scale(1)";
      }, 250);
    }

    const duration = 460; // 460ms
    const startTime = performance.now();

    function animateFrame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedT = genieEase(progress);

      // Trajectory calculation (Reverse of Minimize)
      const currX = quadBezier(startX - targetW / 2, controlX, targetX, easedT);
      const currY = quadBezier(startY - targetH / 2, controlY, targetY, easedT);

      // Reverse stage transformation: emerge from dock -> expand -> unclip -> settle
      const revProgress = 1 - easedT;
      const scaleX = 0.12 + (1 - 0.12) * easedT;
      const scaleY = 0.05 + (1 - 0.05) * easedT;
      const opacity = Math.min(1, easedT * 2);
      const borderRadius = 40 - (40 - 18) * easedT;

      const bottomInset = Math.max(0, 35 * revProgress);
      const polygonStr = `polygon(0% 0%, 100% 0%, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`;

      const dir = targetX > startX ? -1 : 1;
      const skewX = dir * revProgress * 10;

      ghostContainer.style.transform = `translate3d(${currX}px, ${currY}px, 0px) scale(${scaleX}, ${scaleY}) skewX(${skewX}deg)`;
      ghostContainer.style.opacity = `${opacity}`;
      ghostContainer.style.borderRadius = `${borderRadius}px`;
      ghostContainer.style.clipPath = polygonStr;

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        if (ghostContainer.parentNode) {
          ghostContainer.parentNode.removeChild(ghostContainer);
        }
        onComplete?.();
      }
    }

    requestAnimationFrame(animateFrame);
  }, []);

  return (
    <GenieContext.Provider
      value={{
        minimizeWindow,
        restoreWindow,
        saveWindowRect,
        getSavedRect,
      }}
    >
      {children}
      {mounted &&
        createPortal(
          <div
            ref={portalRootRef}
            id="genie-portal-root"
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 999999,
              overflow: "visible",
            }}
          />,
          document.body
        )}
    </GenieContext.Provider>
  );
}

export function useGenie() {
  const context = useContext(GenieContext);
  if (!context) {
    throw new Error("useGenie must be used within a GenieProvider");
  }
  return context;
}
