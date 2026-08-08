"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";
import Magnetic from "./Magnetic";


gsap.registerPlugin(ScrollTrigger);

const LINES: [string, string][] = [
  ["Building", "products."],
  ["Writing", "ideas."],
  ["Chasing", "horizons."],
];

const MARQUEE = "Developer — Writer — Bodybuilder — Traveler — one obsession: building — ";

/**
 * The opening shot. Magazine cover, not a landing page.
 *
 * - Three mantra lines, huge, left-anchored. The portrait lives in its
 *   own premium composition area at the right — it never touches the type.
 *   Ships with an abstract duotone placeholder (/media/portrait-placeholder.svg)
 *   until the real photo lands.
 * - Floating editorial margin notes instead of CTA buttons:
 *   availability, location, since-2021, open worldwide.
 * - Supporting copy in micro-editorial type under the mantra.
 *
 * Scroll = camera push: the whole stage scales slightly forward while
 * layers separate (lines drift, portrait rises slower, notes lift away),
 * and the scene exposure fades toward the ink of the next chapter.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      /* entrance */
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-portrait",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" }, 0.15)
        .fromTo(".hero-portrait .media-slot",
          { scale: 1.22 }, { scale: 1, duration: 2.8, ease: "power3.out" }, 0.15)
        .fromTo(".hero-line .hw",
          { yPercent: 115, filter: "blur(10px)", opacity: 0 },
          { yPercent: 0, filter: "blur(0px)", opacity: 1, stagger: 0.11, duration: 1.25 }, 0.5)
        .fromTo(".hero-sub, .hero-ctas, .hero-marquee",
          { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.9 }, 1.25)
        .fromTo(".hnote",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 1 }, 1.35);

      /* ambient — notes float forever, softly */
      gsap.utils.toArray<HTMLElement>(".hnote").forEach((n, i) => {
        gsap.to(n, {
          y: i % 2 ? 8 : -8, duration: 4 + i, yoyo: true, repeat: -1, ease: "sine.inOut",
        });
      });

      /* mouse — layered depth */
      if (window.matchMedia("(pointer: fine)").matches) {
        const layers: [string, number][] = [
          [".hero-lines", -12],
          [".hero-portrait", 18],
          [".hero-notes", 28],
        ];
        const movers = layers.map(([sel, d]) => ({
          x: gsap.quickTo(sel, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(sel, "y", { duration: 1.2, ease: "power3.out" }),
          d,
        }));
        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => { m.x(nx * m.d); m.y(ny * m.d * 0.55); });
        };
        el.addEventListener("mousemove", onMove);
      }

      /* scroll — camera pushes forward, layers separate */
      gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
        defaults: { ease: "none" },
      })
        .to(".hero-stage", { scale: 1.06, transformOrigin: "50% 45%" }, 0)
        .to(".hero-line--0", { xPercent: -6 }, 0)
        .to(".hero-line--1", { xPercent: 4 }, 0)
        .to(".hero-line--2", { xPercent: -3 }, 0)
        .to(".hero-portrait", { yPercent: -12, rotate: -1.2 }, 0)
        .to(".hero-notes", { yPercent: -30, opacity: 0 }, 0)
        .to(".hero-sub", { y: -40, opacity: 0 }, 0.1)
        .to(el, { backgroundColor: "#0B0B0B" }, 0.55);

      /* portrait idle drift */
      gsap.to(".hero-portrait-inner", {
        y: 12, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="hero" className="hero cursor-light" aria-label="Intro">
      {/* floating editorial notes — no buttons, just margin notes */}
      <div className="hero-notes" aria-hidden>
        <span className="hnote hnote--tl"><i className="hnote-pulse" />Currently available for freelance</span>
        <span className="hnote hnote--tr">Based in India · Open worldwide</span>
        <span className="hnote hnote--bl">Building since 2021</span>
        <span className="hnote hnote--br serif-it">fig. 01 — the builder</span>
      </div>

      <div className="hero-stage">
        <div className="hero-left">
          <p className="hero-kicker">Harsh Srivastava</p>

          <h1 className="hero-lines">
            {LINES.map(([verb, noun], i) => (
              <span className={`hero-line hero-line--${i}`} key={noun}>
                <span className="hero-mask">
                  <span className="hw">
                    {verb}&nbsp;<em className="serif-it">{noun}</em>
                  </span>
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-sub">
            <p>
              Twenty-one years old. Full-stack developer building digital
              products that people actually use — currently focused on
              freelance work.
            </p>
            <p className="hero-sub-micro">
              10+ production-ready products delivered for startups and
              enterprise clients, from idea to deployment.
            </p>
          </div>

          <div className="hero-ctas">
            <Magnetic strength={0.3}>
              <a
                className="btn btn--ink"
                href="/contact"
                data-cursor="hover"
                data-cursor-label="Say hi"
              >
                <span className="btn-fill" aria-hidden />
                <span className="btn-label">Message me</span>
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
        </div>

        <div className="hero-portrait">
          <div className="hero-portrait-inner">
            <MediaSlot
              src="/author.jpeg"
              alt="Harsh Srivastava"
              priority
            />
          </div>
        </div>
      </div>

      <div className="hero-foot">
        <span className="hero-scroll-hint" aria-hidden>
          <span className="hero-scroll-line" />Scroll to begin
        </span>
      </div>

      <div className="hero-marquee" aria-hidden>
        <div className="hero-marquee-track">
          <span>{MARQUEE}</span><span>{MARQUEE}</span>
        </div>
      </div>
    </section>
  );
}
