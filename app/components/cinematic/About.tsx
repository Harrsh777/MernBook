"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 4, suffix: "+", label: "Years writing code" },
  { value: 25, suffix: "+", label: "Projects shipped" },
  { value: 5, suffix: "×", label: "Hackathon wins" },
  { value: 3, suffix: "", label: "Internships" },
  { value: 6, suffix: "+", label: "Certifications" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // count-up stats
      el.querySelectorAll<HTMLElement>(".stat-n").forEach((n) => {
        const target = Number(n.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: reduced ? 0 : 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 85%", once: true },
          onUpdate: () => { n.textContent = String(Math.round(obj.v)); },
        });
      });

      if (!reduced) {
        // stat cards rise in
        gsap.from(".stat", {
          y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: ".about-stats", start: "top 85%", once: true },
        });
        // the floating margin note drifts slower than the page (parallax)
        gsap.to(".about-note", {
          yPercent: -35, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about" className="about scene--ink" aria-label="About">
      <div className="scene-head">
        <span className="scene-index">Scene 01</span>
        <span className="scene-title">About</span>
      </div>

      <blockquote className="about-quote">
        <Reveal as="p" className="about-quote-line">
          I build software the way films are made —
        </Reveal>
        <Reveal as="p" className="about-quote-line serif-it" delay={0.15}>
          every frame deliberate, nothing accidental.
        </Reveal>
      </blockquote>

      <div className="about-body">
        <p>
          Full-stack and MLOps engineer. I take products from a sketch on a
          whiteboard to systems running in production — React and Next.js on the
          surface, Spring Boot, Kubernetes and CI/CD underneath. AWS Certified
          Solutions Architect, Certified Kubernetes Administrator, GSoC &rsquo;24.
        </p>
        <p className="about-note serif-it">
          currently: cyber-security intern @ MP Police · previously BUILD AI
          ENGINE, MyTripGoal
        </p>
      </div>

      <div className="about-stats" role="list">
        {STATS.map((s) => (
          <div className="stat" role="listitem" key={s.label}>
            <span className="stat-value">
              <span className="stat-n" data-value={s.value}>0</span>
              <span className="stat-suffix">{s.suffix}</span>
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
