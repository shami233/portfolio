"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: the cards are visible by default, so skip the reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Stagger reveal for skill cards
      const cards = gridRef.current?.querySelectorAll(".skill-card");
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotateX: 15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Background glow
      gsap.fromTo(
        ".skills-glow",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse tilt for skill cards (pointer devices only — on touch the tilt
  // sticks after the finger lifts)
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = gridRef.current?.querySelectorAll(".skill-card");
    if (!cards) return;

    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${
        y * -10
      }deg) rotateY(${x * 10}deg)`;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = "";
    };

    cards.forEach((card) => {
      (card as HTMLElement).addEventListener("mousemove", handleMouseMove);
      (card as HTMLElement).addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cards.forEach((card) => {
        (card as HTMLElement).removeEventListener("mousemove", handleMouseMove);
        (card as HTMLElement).removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // Category labels
  const categories: { value: string; label: string }[] = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "ai", label: "AI & ML" },
    { value: "iot", label: "IoT & Networking" },
    { value: "devops", label: "DevOps & Tools" },
  ];

  return (
    <section id="skills" ref={sectionRef} className="section">
      {/* Ambient glow */}
      <div className="skills-glow pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[150px]" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="My Skills"
          title="Technologies I"
          highlight="Master"
          description="A comprehensive toolkit spanning frontend, backend, AI, IoT, and infrastructure — everything needed to build complete, intelligent systems."
        />

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap gap-2 sm:mb-10 sm:gap-3">
          {categories.map((cat) => (
            <span
              key={cat.value}
              className="glass glass-hover cursor-default rounded-full px-3.5 py-2 text-xs text-gray-400 transition-all duration-300 hover:text-white"
            >
              {cat.label}
            </span>
          ))}
        </div>

        {/* Skill cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6"
          style={{ perspective: "1200px" }}
        >
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={cn(
                "group skill-card glass glass-hover relative flex min-h-[6.5rem] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl p-3 text-center sm:min-h-[7.75rem] sm:gap-3 sm:p-5"
              )}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
                style={{
                  background: `${skill.color}15`,
                  border: `1px solid ${skill.color}30`,
                  boxShadow: `0 0 20px ${skill.color}10`,
                }}
              >
                <skill.icon
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{ color: skill.color }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-[11px] leading-snug font-medium text-white/90 sm:text-xs md:text-sm">
                {skill.name}
              </p>

              {/* Hover glow — `group-hover`, because this layer is
                  pointer-events-none and can never be hovered directly. It also
                  needs the card to be `relative` or it escapes to the section. */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 40px ${skill.color}20`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}