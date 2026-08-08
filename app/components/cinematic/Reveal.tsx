"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits children text into words and reveals each one with a
 * mask + blur + rise as it enters the viewport.
 *
 *   <Reveal as="h2" className="...">Selected work</Reveal>
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  once = true,
  trigger = "top 85%",
}: {
  children: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
  trigger?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>(".rv-w");
      gsap.set(words, { yPercent: 110, filter: "blur(8px)", opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        filter: "blur(0px)",
        opacity: 1,
        stagger: 0.06,
        delay,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: trigger, once },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, once, trigger]);

  return (
    <Tag ref={ref} className={className} aria-label={children}>
      {children.split(" ").map((w, i) => (
        <span className="rv-mask" key={i} aria-hidden>
          <span className="rv-w">{w}</span>{" "}
        </span>
      ))}
    </Tag>
  );
}
