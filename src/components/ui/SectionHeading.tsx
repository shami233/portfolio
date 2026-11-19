"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: this heading starts visible, so skip GSAP entirely rather
    // than animating it in.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".section-eyebrow",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".section-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".section-desc",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="section-head">
      <p className="section-eyebrow text-eyebrow mb-4 flex items-center gap-3 text-[#c9a96e]">
        <span
          className="inline-block h-px w-6 shrink-0 bg-[#c9a96e]/60 sm:w-8"
          aria-hidden="true"
        />
        {eyebrow}
      </p>
      <h2 className="section-title text-h2 mb-4">
        {title}{" "}
        {highlight && (
          <span className="text-gradient-gold">{highlight}</span>
        )}
      </h2>
      {description && <p className="section-desc text-lede">{description}</p>}
    </div>
  );
}