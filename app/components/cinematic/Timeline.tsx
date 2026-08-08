"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    period: "2026 —",
    org: "EaseHawk Technologies",
    role: "Full Stack Developer Intern",
    detail: "Enterprise product work, end to end — the current chapter.",
  },
  {
    period: "2025 – 26",
    org: "MyTripGoal",
    role: "Software Engineer Intern",
    detail: "Eleven months shipping booking flows and itinerary features in travel tech.",
  },
  {
    period: "2025",
    org: "BUILD AI ENGINE",
    role: "Full Stack Developer Intern",
    detail: "AI orchestration features across React, Node and cloud infra.",
  },
  {
    period: "2024 – 25",
    org: "MP Police",
    role: "Cyber Security Intern",
    detail: "Security tooling and threat analysis inside an active cybercrime unit.",
  },
  {
    period: "2024",
    org: "Google Summer of Code",
    role: "Open Source Contributor",
    detail: "Production features for a global OSS project over a 12-week fellowship.",
  },
  {
    period: "2023 – 24",
    org: "Hackathon circuit",
    role: "5× Winner",
    detail: "Idea to working demo in 24–48 hours, five times over.",
  },
];

/**
 * "How I Got Here." — documentary timeline on ink.
 * A spine fills as you scroll; the chapter in the middle of the
 * viewport expands and brightens like the active frame of a reel.
 */
export default function Timeline() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(".tl-spine-fill", { scaleY: 0 }, {
        scaleY: 1, transformOrigin: "top", ease: "none",
        scrollTrigger: { trigger: ".tl-list", start: "top 60%", end: "bottom 60%", scrub: true },
      });

      el.querySelectorAll<HTMLElement>(".tl-item").forEach((item) => {
        ScrollTrigger.create({
          trigger: item, start: "top 62%", end: "bottom 45%",
          onToggle: (self) => item.classList.toggle("is-active", self.isActive),
        });
        if (!reduced) {
          gsap.from(item, {
            y: 60, opacity: 0, duration: 1, ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
        }
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="path" className="tl scene--ink" aria-label="How I got here">
      <div className="scene-head">
        <span className="scene-index">06</span>
        <span className="scene-title">The record</span>
      </div>

      <div className="tl-layout">
        <aside className="tl-sticky">
          <h2>
            <Reveal as="span" className="tl-h-line">How I</Reveal>
            <Reveal as="span" className="tl-h-line serif-it" delay={0.12}>got here.</Reveal>
          </h2>
          <p>Every chapter shipped something real.</p>
        </aside>

        <div className="tl-list">
          <span className="tl-spine" aria-hidden><span className="tl-spine-fill" /></span>
          {CHAPTERS.map((c) => (
            <article className="tl-item" key={c.org}>
              <span className="tl-period serif-it">{c.period}</span>
              <div className="tl-card" data-cursor="hover">
                <header>
                  <h3>{c.org}</h3>
                  <span>{c.role}</span>
                </header>
                <p>{c.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
