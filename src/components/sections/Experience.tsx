"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: show every card in place — no scrub, no reveals.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".timeline-item", { opacity: 1, x: 0, scale: 1 });
      gsap.set(".timeline-icon", { opacity: 1, scale: 1, rotate: 0 });
      return;
    }

    // On phones/tablets the rail sits on the left, so cards only nudge a little
    // — a 60px slide would push them outside the viewport mid-animation.
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const ctx = gsap.context(() => {
      // Timeline progress indicator
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.5,
            },
          }
        );
      }

      // Timeline items reveal
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (items) {
        items.forEach((item, index) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              x: isDesktop ? (index % 2 === 0 ? -60 : 60) : 24,
              scale: 0.9,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
              },
            }
          );

          // Icon pulse
          const icon = item.querySelector(".timeline-icon");
          if (icon) {
            gsap.fromTo(
              icon,
              { scale: 0, rotate: -180 },
              {
                scale: 1,
                rotate: 0,
                duration: 0.8,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: item,
                  start: "top 80%",
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="section">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/3 right-0 h-[320px] w-[320px] rounded-full bg-white/5 blur-[100px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />

      <div className="container-narrow relative z-10">
        <SectionHeading
          eyebrow="My Journey"
          title="Professional"
          highlight="Experience"
          description="A timeline of my growth across AI, full-stack development, networking, and IoT."
        />

        <div ref={timelineRef} className="relative">
          {/* Base line */}
          <div className="timeline-line" aria-hidden="true" />

          {/* Progress line */}
          <div
            ref={progressRef}
            className="timeline-progress"
            style={{ height: "0%" }}
            aria-hidden="true"
          />

          <div className="space-y-10 lg:space-y-16">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={exp.title}
                  className="timeline-item relative pl-10 sm:pl-12 lg:pl-0"
                  style={{ opacity: 0 }}
                >
                  {/* Timeline dot — sits on the left rail on phones/tablets and
                      on the centre rail from lg up. */}
                  <div className="absolute top-7 left-[0.95rem] z-10 -translate-x-1/2 lg:top-10 lg:left-1/2">
                    <div className="animate-pulse h-3.5 w-3.5 rounded-full border-4 border-[#050505] bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] lg:h-4 lg:w-4" />
                  </div>

                  {/* Card — capped at half width from lg up. On phones the rail
                      indent replaces the old `w-full ml-10` combo, which pushed
                      the card 40px past the right edge of the screen. */}
                  <div
                    className={`glass glass-hover relative w-full rounded-2xl p-5 sm:p-6 lg:w-[calc(50%-3rem)] lg:p-8 ${
                      isLeft ? "lg:mr-auto" : "lg:ml-auto"
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-3 sm:gap-4">
                      <div
                        className="timeline-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white sm:h-12 sm:w-12"
                        style={{ opacity: 0 }}
                      >
                        <exp.icon
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-h3">{exp.title}</h3>
                        <p className="text-sm text-gray-400">{exp.company}</p>
                      </div>
                    </div>

                    <p className="mb-3 text-xs font-medium tracking-wider text-gray-300">
                      {exp.period}
                    </p>

                    <p className="mb-4 text-sm leading-relaxed text-gray-400">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}