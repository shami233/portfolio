"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { projects } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const projectImages = [
  "/projects/irrigation.jpg",
  "/projects/portfolio.jpg",
  "/projects/analytics.jpg",
  "/projects/smarthome.jpg",
  "/projects/network.jpg",
  "/projects/chatbot.jpg",
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: cards are visible by default, skip the reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".project-card");
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 80,
            rotateY: 10,
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt on hover (pointer devices only — on touch it sticks after tapping)
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = gridRef.current?.querySelectorAll(".project-card");
    if (!cards) return;

    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `translateY(-10px) scale(1.02) rotateX(${
        y * -8
      }deg) rotateY(${x * 8}deg)`;

      // Image zoom via inner element
      const img = card.querySelector(".project-image");
      if (img) {
        (img as HTMLElement).style.transform = `scale(1.1) translate(${
          x * -5
        }px, ${y * -5}px)`;
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = "";

      const img = card.querySelector(".project-image");
      if (img) {
        (img as HTMLElement).style.transform = "";
      }
    };

    cards.forEach((card) => {
      (card as HTMLElement).addEventListener("mousemove", handleMouseMove);
      (card as HTMLElement).addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cards.forEach((card) => {
        (card as HTMLElement).removeEventListener("mousemove", handleMouseMove);
        (card as HTMLElement).removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      });
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="My Work"
          title="Featured"
          highlight="Projects"
          description="A selection of projects where I've combined intelligent systems, beautiful design, and cutting-edge technology."
        />

        <div
          ref={gridRef}
          className="grid gap-5 md:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="project-card group glass relative flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] text-white backdrop-blur-xl">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Featured
                </div>
              )}

              {/* Project image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={projectImages[i % projectImages.length]}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="project-image object-cover transition-transform duration-700 ease-out"
                  onError={(e) => {
                    // Placeholder fallback
                    const target = e.currentTarget;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'%3EProject%3C/text%3E%3C/svg%3E";
                  }}
                />
                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              {/* Content — normal flow now (the old -mt-16 hack pulled the copy
                  64px up over the image on narrow screens). */}
              <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-h3 mb-2">
                  {project.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-400">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
                  >
                    <GithubIcon className="h-4 w-4" aria-hidden="true" />
                    GitHub
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold tap inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
