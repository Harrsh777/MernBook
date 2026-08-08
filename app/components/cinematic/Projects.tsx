"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

type Scene = {
  index: string;
  title: string;
  year: string;
  tag: string;
  sentence: string;
  stack: string;
  href: string;
  src: string;
};

const SCENES: Scene[] = [
  {
    index: "01",
    title: "SafeSurf Jr",
    year: "2025",
    tag: "Cybersecurity",
    sentence: "AI-powered child safety — threats caught before kids ever see them.",
    stack: "React · Node · ML",
    href: "https://github.com/Harrsh777/SafeSurfJr",
    src: "/safesu.png",
  },
  {
    index: "02",
    title: "EduCore ERP",
    year: "2024",
    tag: "Full Stack",
    sentence: "A full school runs on this — admissions, attendance, and fees.",
    stack: "Next.js · PostgreSQL · AWS",
    href: "https://www.educorerp.in/",
    src: "/educore.png",
  },
  {
    index: "03",
    title: "SDPL Supply Chain",
    year: "2024",
    tag: "Web Platform",
    sentence: "Distribution firms, finally off spreadsheets and onto one live system.",
    stack: "React · Node · MongoDB",
    href: "https://sdpl.vercel.app/",
    src: "/sdpl.png",
  },
  {
    index: "04",
    title: "TrekkinGods",
    year: "2024",
    tag: "Travel Tech",
    sentence: "Trek and travel booking — from discovery to confirmation in one flow.",
    stack: "Next.js · REST · Payments",
    href: "https://trekkingGods.com/",
    src: "/trek.png",
  },
  {
    index: "05",
    title: "Moksha Classes",
    year: "2024",
    tag: "EdTech",
    sentence: "All-in-one online yoga — classes, schedules, and payments in one place.",
    stack: "React · Node · Stripe",
    href: "https://trekkingGods.com/",
    src: "/moksha.png",
  },
  {
    index: "06",
    title: "Plotify",
    year: "2024",
    tag: "Marketplace",
    sentence: "Real estate listings that feel as premium as the properties.",
    stack: "Next.js · Supabase · Tailwind",
    href: "https://www.theplotify.com",
    src: "/plotify.png",
  },
  {
    index: "07",
    title: "DeployX",
    year: "2024",
    tag: "DevOps",
    sentence: "Push code. Pipelines, deploys, and rollbacks — automated.",
    stack: "Docker · Kubernetes · Node",
    href: "https://github.com/Harrsh777/DeployX",
    src: "/deployx.png",
  },
  {
    index: "08",
    title: "MERN Club",
    year: "2024",
    tag: "Community",
    sentence: "Hackathons and competitions — one platform for the entire circuit.",
    stack: "MERN · Auth · Events",
    href: "https://mernclubvitb.com/",
    src: "/mernmatrix.png",
  },
  {
    index: "09",
    title: "Discovery Drift",
    year: "2024",
    tag: "Cloud & AI",
    sentence: "Cloud infrastructure SaaS with AI solutions baked in from day one.",
    stack: "Next.js · AWS · AI APIs",
    href: "https://discovery-drift.vercel.app/",
    src: "/discovery.png",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const reelWrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap = reelWrapRef.current;
    const rail = railRef.current;
    if (!section || !wrap || !rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      const getScroll = () => Math.max(rail.scrollWidth - window.innerWidth, 0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${getScroll() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              SCENES.length - 1,
              Math.round(self.progress * (SCENES.length - 1))
            );
            setActive(idx);
            if (progressRef.current) {
              progressRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(SCENES.length).padStart(2, "0")}`;
            }
          },
        },
      });

      tl.to(rail, { x: () => -getScroll(), ease: "none" });

      rail.querySelectorAll<HTMLElement>(".pjs-card").forEach((card) => {
        const img = card.querySelector(".pjs-card-media-inner");
        if (!img) return;

        gsap.fromTo(
          img,
          { scale: 1.18, xPercent: 4 },
          {
            scale: 1,
            xPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });

      gsap.from(".pjs-intro-copy", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="pjscenes scene--ink" aria-label="Projects">
      <div className="scene-head">
        <span className="scene-index">02</span>
        <span className="scene-title">Work</span>
        <span className="scene-hint">{SCENES.length} projects · scroll the reel →</span>
      </div>

      <div className="pjs-intro">
        <h2 className="pjs-heading">
          <Reveal as="span" className="pjs-heading-line">
            The best ideas rarely arrive
          </Reveal>
          <Reveal as="span" className="pjs-heading-line serif-it" delay={0.12}>
            at the same desk.
          </Reveal>
        </h2>
        <p className="pjs-intro-copy">
          Every build started somewhere new — client platforms, SaaS products,
          and tools shipped to production.
        </p>
      </div>

      <div className="pjs-reel-wrap" ref={reelWrapRef}>
        <div className="pjs-reel-stage">
          <div className="pjs-reel-bars" aria-hidden>
            <span /><span />
          </div>

          <div className="pjs-reel-rail" ref={railRef}>
            {SCENES.map((s, i) => (
              <article
                className={`pjs-card${active === i ? " is-active" : ""}`}
                key={s.index}
              >
                <a
                  className="pjs-card-media"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  data-cursor-label="Visit"
                >
                  <div className="pjs-card-media-inner">
                    <MediaSlot src={s.src} alt={`${s.title} screenshot`} />
                  </div>
                  <div className="pjs-card-vignette" aria-hidden />
                  <div className="pjs-card-grain" aria-hidden />
                </a>

                <div className="pjs-card-copy">
                  <span className="pjs-card-index serif-it" aria-hidden>
                    {s.index}
                  </span>
                  <span className="pjs-card-tag">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <p className="pjs-card-sentence serif-it">{s.sentence}</p>
                  <div className="pjs-card-foot">
                    <span className="pjs-card-year serif-it">{s.year}</span>
                    <span className="pjs-card-stack">{s.stack}</span>
                    <a
                      className="pjs-card-link"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                    >
                      View project <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pjs-reel-ui" aria-hidden>
            <span className="pjs-reel-label">Now playing</span>
            <span className="pjs-reel-progress serif-it" ref={progressRef}>
              01 / 09
            </span>
          </div>
        </div>
      </div>

      <p className="pjs-more">
        <a
          href="https://github.com/Harrsh777"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
        >
          More on GitHub <span aria-hidden>↗</span>
        </a>
      </p>
    </section>
  );
}
