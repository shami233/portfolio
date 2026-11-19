"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Download, X, Award } from "lucide-react";
import { certificates } from "@/lib/data";
import { getLenis } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const certImages = [
  "/certificates/ml.jpg",
  "/certificates/fullstack.jpg",
  "/certificates/ccna.jpg",
  "/certificates/aws.jpg",
  "/certificates/iot.jpg",
  "/certificates/tensorflow.jpg",
];

export default function Certificates() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    // Reduced motion: cards are visible by default, skip the reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".cert-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
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

  // Lock scroll when modal is open
  useEffect(() => {
    const lenis = getLenis();
    if (selected !== null) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [selected]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section id="certificates" ref={sectionRef} className="section">
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Credentials"
          title="Certificates &"
          highlight="Achievements"
          description="Professional certifications that validate my expertise across AI, development, networking, and cloud."
        />

        <div
          ref={gridRef}
          className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {certificates.map((cert, i) => (
            <button
              key={cert.title}
              type="button"
              onClick={() => setSelected(i)}
              className="cert-card group glass relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
            >
              {/* Certificate image */}
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                <Image
                  src={certImages[i % certImages.length]}
                  alt={cert.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'%3ECertificate%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Award icon */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-h3 mb-1">{cert.title}</h3>
                <p className="mb-2 text-sm text-gray-400">{cert.issuer}</p>
                <p className="mt-auto text-xs text-gray-300">{cert.year}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overscroll-contain p-4 md:p-8"
          onClick={() => setSelected(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal content — capped to the small-viewport height with its own
              scroll, so it can never be clipped on a landscape phone. */}
          <div
            className="glass-strong relative max-h-[88svh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={certificates[selected].title}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="tap absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/20"
              aria-label="Close certificate"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Image */}
            <div className="relative w-full aspect-video">
              <Image
                src={certImages[selected % certImages.length]}
                alt={certificates[selected].title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'%3ECertificate%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Details */}
            <div className="p-5 sm:p-6 md:p-8">
              <h3 className="text-h3 mb-2">
                {certificates[selected].title}
              </h3>
              <p className="text-gray-300 text-sm mb-2">
                {certificates[selected].issuer} • {certificates[selected].year}
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                {certificates[selected].description}
              </p>

              <button
                onClick={() => {
                  // Download certificate
                  const link = document.createElement("a");
                  link.href = certImages[selected % certImages.length];
                  link.download = `${certificates[selected].title}.jpg`;
                  link.click();
                }}
                className="btn-gold tap inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition-all duration-300"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}