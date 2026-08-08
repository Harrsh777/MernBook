"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const GROUPS = [
  {
    name: "Interface",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP"],
  },
  {
    name: "Systems",
    items: ["Node.js", "Spring Boot", "REST", "Microservices", "PostgreSQL", "MongoDB"],
  },
  {
    name: "Infrastructure",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform"],
  },
  {
    name: "Intelligence",
    items: ["MLOps", "Model serving", "Python", "Monitoring", "Vector search"],
  },
];

/**
 * Ink-field scene. Glass cards with animated gradient borders;
 * a soft light follows the cursor across the whole section
 * (via the global --mx/--my variables set by <Cursor/>).
 */
export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from(".skill-card", {
        y: 70, opacity: 0, rotateX: -8, transformOrigin: "50% 100%",
        stagger: 0.1, duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: ".skills-grid", start: "top 82%", once: true },
      });
      // chips float in per card
      el.querySelectorAll(".skill-card").forEach((card) => {
        gsap.from(card.querySelectorAll("li"), {
          y: 14, opacity: 0, stagger: 0.05, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="craft" className="skills scene--ink cursor-light" aria-label="Skills">
      <div className="scene-head">
        <span className="scene-index">Scene 03</span>
        <span className="scene-title">Craft</span>
      </div>

      <Reveal as="h2" className="skills-title">
        Tools are chosen, never collected.
      </Reveal>

      <div className="skills-grid">
        {GROUPS.map((g) => (
          <article className="skill-card" key={g.name} data-cursor="hover">
            <h3>
              {g.name} <span className="serif-it skill-count">{g.items.length}</span>
            </h3>
            <ul>
              {g.items.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
