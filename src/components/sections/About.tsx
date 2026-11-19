"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { stats } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

function Counter({
  value,
  suffix = "",
  label,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      onUpdate: () => {
        setCount(Math.round(obj.val));
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration]);

  return (
    <div
      ref={ref}
      className="glass glass-hover rounded-2xl p-5 text-center sm:p-6"
    >
      <p className="font-display text-gradient-silver mb-2 text-3xl font-bold tabular-nums sm:text-4xl md:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="text-xs text-gray-400 sm:text-sm">{label}</p>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Reduced motion: leave both columns in their final, visible state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-text",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".about-image",
        { opacity: 0, scale: 0.85, rotateY: -15 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section">
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="About Me"
          title="Multidisciplinary"
          highlight="Developer"
          description="A passionate developer combining AI, full-stack development, networking, and IoT to build the future."
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left - Personal image */}
          <div className="about-image relative" style={{ perspective: "1000px" }}>
            <div className="glass glow-silver relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <div className="relative aspect-[4/5] max-h-[380px] w-full sm:max-h-[520px]">
                <Image
                  src="/profile.png"
                  alt="Shami Mukasa portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Details overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-lg text-white font-medium">Shami Mukasa</p>
                <p className="text-sm text-gray-300">AI & Full Stack Developer</p>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-white/5 blur-2xl animate-pulse-glow" />
          </div>

          {/* Right - Story + Stats */}
          <div className="about-text">
            <p className="mb-5 text-sm leading-relaxed text-gray-400 sm:mb-6 sm:text-base">
              I&apos;m a multidisciplinary developer with a passion for building
              intelligent systems that bridge the physical and digital worlds.
              My journey spans artificial intelligence, full-stack development,
              network engineering, and IoT, allowing me to see technology from
              every angle.
            </p>
            <p className="mb-8 text-sm leading-relaxed text-gray-400 sm:mb-10 sm:text-base">
              From machine learning models that optimize agriculture to immersive
              3D web experiences, I believe technology should be both powerful
              and beautiful. I craft solutions that don&apos;t just work — they
              inspire.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Counter value={stats.experience} suffix="+" label="Years Experience" />
              <Counter value={stats.projects} suffix="+" label="Projects Completed" />
              <Counter value={stats.certificates} suffix="+" label="Certificates" />
              <Counter value={stats.clients} suffix="+" label="Happy Clients" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}