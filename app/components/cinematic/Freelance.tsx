"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Available to build." — the invitation, placed right before the
 * closing statement. Paper scene, one hairline, one button.
 */
export default function Freelance() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(".fl-rule", { scaleX: 0 }, {
        scaleX: 1, transformOrigin: "left", duration: 1.4, ease: "power4.inOut",
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });
      gsap.from(".fl-copy p, .fl-cta", {
        y: 36, opacity: 0, stagger: 0.12, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: ".fl-copy", start: "top 82%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="build" className="freelance scene--paper" aria-label="Freelance">
      <div className="scene-head">
        <span className="scene-index">07</span>
        <span className="scene-title">The invitation</span>
        <span className="scene-hint fl-avail"><i aria-hidden />Taking on projects</span>
      </div>

      <h2 className="fl-title">
        <Reveal as="span" className="fl-title-line">Available</Reveal>
        <Reveal as="span" className="fl-title-line serif-it" delay={0.12}>to build.</Reveal>
      </h2>

      <span className="fl-rule" aria-hidden />

      <div className="fl-grid">
        <div className="fl-copy">
          <p className="fl-lead">
            I work with founders, startups, and enterprise businesses to design,
            develop, and launch production-ready digital products.
          </p>
          <p>
            From MVPs to enterprise platforms, I build software that scales —
            10+ products already in production for clients who needed it done
            right the first time.
          </p>
          <div className="fl-cta">
            <Magnetic>
              <a className="btn btn--ink" href="/contact" data-cursor="hover" data-cursor-label="Go">
                <span className="btn-fill" aria-hidden />
                <span className="btn-label">Message me</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className="btn btn--ghost"
                href="/Harsh_Resume.pdf"
                download="Harsh_Srivastava_Resume.pdf"
                data-cursor="hover"
                data-cursor-label="PDF"
              >
                <span className="btn-fill" aria-hidden />
                <span className="btn-label">Download resume</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <ul className="fl-list" aria-label="What I take on">
          <li><span className="serif-it">a</span> MVPs, shipped in weeks</li>
          <li><span className="serif-it">b</span> Enterprise platforms &amp; ERPs</li>
          <li><span className="serif-it">c</span> AI products, end to end</li>
          <li><span className="serif-it">d</span> Cloud, DevOps &amp; scale</li>
        </ul>
      </div>
    </section>
  );
}
