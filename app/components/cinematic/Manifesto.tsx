"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const STATS: { value: string; count?: number; suffix?: string; label: string }[] = [
  { value: "10", count: 10, suffix: "+", label: "Products delivered" },
  { value: "Enterprise", label: "Clients served" },
  { value: "21", count: 21, label: "Years old" },
  { value: "4", count: 4, label: "Disciplines" },
  { value: "5", count: 5, suffix: "+", label: "Published research papers" },
  { value: "2", count: 2, label: "Books written" },
  { value: "Many", label: "Articles & short stories" },
];

/**
 * "Built, not assembled." — the story begins.
 * Seven figures, each launched like a product: clip-wipe → rise → count-up.
 */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      const items = gsap.utils.toArray<HTMLElement>(".m-stat");
      items.forEach((item, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
          delay: (i % 4) * 0.14,
        });
        tl.fromTo(item, { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.inOut" })
          .from(item.querySelector(".m-stat-value"),
            { yPercent: 60, opacity: 0, duration: 0.8, ease: "power4.out" }, "-=0.45");

        const n = item.querySelector<HTMLElement>("[data-count]");
        if (n) {
          const target = Number(n.dataset.count);
          const obj = { v: 0 };
          tl.to(obj, {
            v: target, duration: 1.2, ease: "power3.out",
            onUpdate: () => { n.textContent = String(Math.round(obj.v)); },
          }, "-=0.6");
        }
      });

      gsap.from(".m-body p", {
        y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: ".m-body", start: "top 82%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="story" className="manifesto scene--ink cursor-light" aria-label="About">
      <div className="scene-head">
        <span className="scene-index">01</span>
        <span className="scene-title">The story</span>
      </div>

      <h2 className="m-title">
        <Reveal as="span" className="m-title-line">Built,</Reveal>
        <Reveal as="span" className="m-title-line serif-it" delay={0.12}>not assembled.</Reveal>
      </h2>

      <div className="m-body">
        <p className="m-lead">
          Twenty-one years old. Full-stack developer focused on building
          products that people actually use.
        </p>
        <div>
          <p>
            I partner with founders, startups, and enterprise businesses to
            transform ambitious ideas into production-ready software.
          </p>
          <p className="m-aside">
            Outside development you&rsquo;ll usually find me writing, training,
            or exploring new places. Four disciplines — one obsession.
          </p>
        </div>
      </div>

      <div className="m-stats" role="list">
        {STATS.map((s) => (
          <div className="m-stat" role="listitem" key={s.label}>
            <span className={`m-stat-value ${s.count ? "" : "m-stat-value--word"}`}>
              {s.count ? <span data-count={s.count}>0</span> : s.value}
              {s.suffix && <span className="m-stat-suffix serif-it">{s.suffix}</span>}
            </span>
            <span className="m-stat-label">{s.label}</span>
          </div>
        ))}
        <div className="m-stat m-stat--inf" role="listitem" aria-hidden>
          <span className="m-stat-value serif-it">∞</span>
          <span className="m-stat-label">Ideas ahead</span>
        </div>
      </div>
    </section>
  );
}
