"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Harrsh777" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harrshh" },
  { label: "X", href: "https://twitter.com/harrshh" },
  { label: "Instagram", href: "https://instagram.com/Harrsh077" },
  { label: "LeetCode", href: "https://leetcode.com/u/Harrshh077/" },
];
export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from(".contact-line .rvv", {
        yPercent: 110, stagger: 0.12, duration: 1.3, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      gsap.from(".contact-actions, .contact-socials", {
        y: 30, opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out", delay: 0.4,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      gsap.fromTo(".footer-rule", { scaleX: 0 }, {
        scaleX: 1, transformOrigin: "left", duration: 1.4, ease: "power4.inOut",
        scrollTrigger: { trigger: ".cfooter", start: "top 95%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="contact" className="contact scene--ink cursor-light" aria-label="Contact">
      <div className="contact-aurora" aria-hidden />

      <h2 className="contact-line">
        <span className="rv-mask"><span className="rvv">Let&rsquo;s build something</span></span>
        <span className="rv-mask"><span className="rvv serif-it">worth remembering.</span></span>
      </h2>

      <div className="contact-actions">
        <Magnetic strength={0.3}>
          <a className="btn btn--paper" href="/contact" data-cursor="hover" data-cursor-label="Form">
            <span className="btn-fill" aria-hidden />
            <span className="btn-label">Message me</span>
          </a>
        </Magnetic>
        <Magnetic strength={0.3}>
          <a className="btn btn--paper" href="mailto:hello@harshsrivastava.in" data-cursor="hover" data-cursor-label="Email">
            <span className="btn-fill" aria-hidden />
            <span className="btn-label">hello@harshsrivastava.in</span>
          </a>
        </Magnetic>
        <Magnetic strength={0.3}>
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

      <ul className="contact-socials">
        {SOCIALS.map((s) => (
          <li key={s.label}>
            <Magnetic strength={0.25}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                {s.label} <span aria-hidden>↗</span>
              </a>
            </Magnetic>
          </li>
        ))}
      </ul>

      <footer className="cfooter">
        <span className="footer-rule" aria-hidden />
        <div className="cfooter-row">
          <span className="serif-it">Building products. Writing ideas. Chasing horizons.</span>
          <span>© {new Date().getFullYear()} Harsh Srivastava</span>
          <a href="#hero" onClick={toTop} data-cursor="hover">Back to top ↑</a>
        </div>
      </footer>
    </section>
  );
}
