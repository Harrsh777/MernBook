"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const COUNTS = [
  { n: "5+", label: "Published research papers" },
  { n: "2", label: "Books" },
  { n: "∞", label: "Articles & short stories" },
];

/**
 * "Words Matter." — paper scene.
 * Three "sheets" sit stacked like a closed manuscript; as the section
 * enters they fan open (page-turn) into an offset spread.
 */
export default function Writing() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // sheets fan open like pages
      const sheets = gsap.utils.toArray<HTMLElement>(".wr-sheet");
      gsap.set(sheets, { rotate: 0, x: 0, y: (i) => i * -8, transformOrigin: "12% 96%" });
      gsap.to(sheets, {
        rotate: (i) => [-5, 0.5, 5][i],
        x: (i) => [-26, 0, 26][i],
        y: 0,
        stagger: 0.08,
        ease: "power4.out",
        duration: 1.4,
        scrollTrigger: { trigger: ".wr-sheets", start: "top 72%", once: true },
      });
      // gentle scrub drift afterwards — pages breathing
      gsap.to(".wr-sheets", {
        yPercent: -6, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });

      gsap.from(".wr-count", {
        y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: ".wr-counts", start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="words" className="writing scene--paper" aria-label="Writing">
      <div className="scene-head">
        <span className="scene-index">03</span>
        <span className="scene-title">Writing</span>
      </div>

      <h2 className="wr-title">
        <Reveal as="span" className="wr-title-line">Words matter.</Reveal>
        <Reveal as="span" className="wr-title-sub serif-it" delay={0.15}>
          Before software is written, ideas are.
        </Reveal>
      </h2>

      <div className="wr-layout">
        <div className="wr-sheets" aria-label="Selected writing">
          <article className="wr-sheet wr-sheet--book" data-cursor="hover">
            <a href="/book" className="wr-sheet-link">
              <div className="wr-sheet-media">
                <MediaSlot src="/1.png" alt="The MERN Stack Alchemist book cover" />
              </div>
              <h3>The MERN Stack Alchemist</h3>
              <p>Master MERN to crack FAANG — a project-first book, in print.</p>
              <span className="wr-sheet-tag">Book · 2025</span>
            </a>
          </article>

          <article className="wr-sheet" data-cursor="hover">
            <div className="wr-sheet-media wr-sheet-media--small">
              <MediaSlot src="/ijfmr.png" alt="AI in Production research paper certificate" />
            </div>
            <h3>AI in Production</h3>
            <p>Kubernetes for LLM deployment — published research, IJFMR.</p>
            <span className="wr-sheet-tag">Research paper · 2025</span>
          </article>

          <article className="wr-sheet" data-cursor="hover">
            <h3>Notes &amp; short stories</h3>
            <p>Essays on engineering, discipline and the road — written between builds.</p>
            <span className="wr-sheet-tag">Ongoing</span>
            <span className="wr-sheet-lines" aria-hidden><i/><i/><i/><i/><i/><i/></span>
          </article>
        </div>

        <div className="wr-counts" role="list">
          {COUNTS.map((c) => (
            <div className="wr-count" role="listitem" key={c.label}>
              <span className="wr-count-n">{c.n}</span>
              <span className="wr-count-label">{c.label}</span>
            </div>
          ))}
          <p className="wr-count-note serif-it">A second book is on its way —</p>
        </div>
      </div>
    </section>
  );
}
