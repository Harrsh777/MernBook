"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom cursor: a small ink dot + a lagging ring.
 * - Grows over any [data-cursor="hover"] element
 * - Shows a label over [data-cursor-label="View"] elements
 * - Hidden automatically on touch devices / reduced motion
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
      // spotlight that follows the cursor (consumed by .cursor-light sections)
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (t) {
        const text = t.getAttribute("data-cursor-label") ?? "";
        label.textContent = text;
        gsap.to(ring, {
          scale: text ? 3.2 : 2.2,
          backgroundColor: text ? "rgba(11,11,11,0.92)" : "rgba(11,11,11,0.06)",
          duration: 0.35, ease: "power3.out",
        });
        gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 });
        gsap.to(dot, { scale: 0, duration: 0.25 });
      }
    };
    const out = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-cursor]");
      if (t) {
        gsap.to(ring, { scale: 1, backgroundColor: "rgba(11,11,11,0)", duration: 0.35, ease: "power3.out" });
        gsap.to(label, { opacity: 0, duration: 0.2 });
        gsap.to(dot, { scale: 1, duration: 0.25 });
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
