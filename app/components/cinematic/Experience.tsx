"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  {
    period: "2025 —",
    org: "MP Police",
    role: "Cyber Security Intern",
    detail: "Digital forensics tooling and threat triage for an active cyber-crime unit.",
    tags: ["Security", "Forensics", "Tooling"],
  },
  {
    period: "2024",
    org: "BUILD AI ENGINE",
    role: "Full-stack Developer Intern",
    detail: "Shipped customer-facing product surfaces and the pipelines behind them.",
    tags: ["Next.js", "FastAPI", "Docker"],
  },
  {
    period: "2024",
    org: "Google Summer of Code",
    role: "Contributor",
    detail: "Open-source contribution at scale — code review culture, real users.",
    tags: ["Open source", "Collaboration"],
  },
  {
    period: "2023",
    org: "MyTripGoal",
    role: "Software Engineer Intern",
    detail: "Built booking and itinerary features across the MERN stack.",
    tags: ["React", "Node", "MongoDB"],
  },
];

/**
 * Sticky year column + entries. As each entry crosses the middle
 * of the viewport it becomes "active": expands, brightens, and the
 * hairline spine fills to its position.
 */
export default function Experience() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // spine fill
      gsap.fromTo(".xp-spine-fill", { scaleY: 0 }, {
        scaleY: 1, transformOrigin: "top", ease: "none",
        scrollTrigger: { trigger: ".xp-list", start: "top 60%", end: "bottom 60%", scrub: true },
      });

      el.querySelectorAll<HTMLElement>(".xp-item").forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 45%",
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
    <section ref={ref} id="path" className="xp scene--paper" aria-label="Experience">
      <div className="scene-head">
        <span className="scene-index">Scene 04</span>
        <span className="scene-title">Path</span>
      </div>

      <div className="xp-layout">
        <aside className="xp-sticky">
          <h2>
            Where the work<br /><span className="serif-it">happened.</span>
          </h2>
          <p>Every role below shipped something real.</p>
        </aside>

        <div className="xp-list">
          <span className="xp-spine" aria-hidden><span className="xp-spine-fill" /></span>
          {ROLES.map((r) => (
            <article className="xp-item" key={r.org}>
              <span className="xp-period serif-it">{r.period}</span>
              <div className="xp-card" data-cursor="hover">
                <header>
                  <h3>{r.org}</h3>
                  <span>{r.role}</span>
                </header>
                <p>{r.detail}</p>
                <ul>{r.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
