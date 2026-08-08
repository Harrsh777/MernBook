"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Work", href: "#work" },
  { label: "Words", href: "#words" },
  { label: "Path", href: "#path" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    const nav = navRef.current!;
    let last = 0;

    const onScroll = () => {
      const y = window.scrollY;
      gsap.to(nav, {
        yPercent: y > last && y > 140 ? -160 : 0,
        duration: 0.5,
        ease: "power3.out",
      });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => obs.observe(s!));

    return () => {
      window.removeEventListener("scroll", onScroll);
      st.kill();
      obs.disconnect();
    };
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav ref={navRef} className="cnav" aria-label="Primary">
      <span className="cnav-progress"><span ref={barRef} /></span>
      <a href="#hero" onClick={(e) => go(e, "#hero")} className="cnav-mark" data-cursor="hover">
        H<span className="serif-it">S</span>
      </a>
      <ul>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Magnetic strength={0.25}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-cursor="hover"
                className={active === l.href ? "is-active" : ""}
              >
                {l.label}
              </a>
            </Magnetic>
          </li>
        ))}
      </ul>
      <Magnetic strength={0.3}>
        <a className="cnav-cta" href="/contact" data-cursor="hover">
          Message me
        </a>
      </Magnetic>
    </nav>
  );
}
