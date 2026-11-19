"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, FolderOpen } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { socialLinks } from "@/lib/data";
import { getLenis } from "@/lib/utils";

/* Client-only, so three.js never enters the initial bundle on the server or
   before we know whether the phone can render it. */
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

const roles = [
  "AI Developer",
  "Full Stack Developer",
  "Networking Engineer",
  "Machine Learning Enthusiast",
  "IoT System Developer",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState("");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -20 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Typing animation
  useEffect(() => {
    let currentRole = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const fullText = roles[currentRole];
      if (!isDeleting) {
        setTypedText(fullText.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === fullText.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
        timeout = setTimeout(type, 60 + Math.random() * 60);
      } else {
        setTypedText(fullText.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          currentRole = (currentRole + 1) % roles.length;
          timeout = setTimeout(type, 300);
          return;
        }
        timeout = setTimeout(type, 40);
      }
    };

    timeout = setTimeout(type, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // GSAP entrance animations - sequential fade in
  useEffect(() => {
    // Honour the OS "reduce motion" setting: land on the final state instead of
    // animating (the markup starts at opacity-0, so this also guarantees the
    // hero is never left invisible).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(
        [
          ".hero-tag",
          ".hero-title",
          ".hero-roles",
          ".hero-subtitle",
          ".hero-social",
          ".hero-scroll-indicator",
        ],
        { opacity: 1, y: 0 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Tag reveal
      gsap.fromTo(
        ".hero-tag",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.8 }
      );

      // Title reveal
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 1.1 }
      );

      // Subtitle reveal
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 1.5 }
      );

      // Typing roles reveal
      gsap.fromTo(
        ".hero-roles",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 1.8 }
      );

      // Social links reveal
      gsap.fromTo(
        ".hero-social",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 2.1 }
      );

      // Scroll indicator
      gsap.fromTo(
        ".hero-scroll-indicator",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          delay: 2.6,
        }
      );

      // ScrollTrigger refresh
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-0 lg:pb-0"
    >
      <div className="container-page relative z-10 grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Mobile / tablet: the model is a real block in the flow here — the
            fixed StickyScene overlay is desktop-only (see HeroScene.tsx). The
            size lives on this CSS-only wrapper so the server render already
            reserves the space and the hero never jumps when the canvas mounts.
            Kept deliberately short on phones so the headline and the CTAs still
            reach the first screen. */}
        <div className="order-1 h-[34svh] max-h-[320px] min-h-[200px] sm:h-[38svh] sm:max-h-[420px] sm:min-h-[240px] lg:hidden">
          <HeroScene />
        </div>

        {/* Text content */}
        <div className="order-2 flex flex-col gap-5 sm:gap-7 lg:order-1">
          {/* Hero text — the fluid scale lives in .text-h1/.text-eyebrow
              (globals.css) so hero + section headings share one hierarchy. */}
          <div>
            <p className="hero-tag text-eyebrow opacity-0 mb-4 text-[#c9a96e]">
              ✦ Welcome to my portfolio
            </p>

            <h1 className="hero-title text-h1 opacity-0 mb-5">
              Crafting Digital
              <br />
              <span className="text-gradient-gold">Experiences</span>
            </h1>

            {/* Typing role ticker (previously computed but never rendered) */}
            <p className="hero-roles opacity-0 mb-3 min-h-[1.75rem] text-base text-gray-400 sm:text-lg md:text-xl">
              <span className="text-gray-500">I&apos;m a&nbsp;</span>
              <span className="font-semibold text-[#c9a96e]">{typedText}</span>
              <span className="cursor-blink text-white/70">|</span>
            </p>

            <div className="hero-subtitle opacity-0 space-y-2 text-sm text-gray-300 sm:text-base md:text-lg">
              <p>
                <strong className="font-semibold text-white">
                  Where innovation meets implementation.
                </strong>
              </p>
              <p>
                <strong className="font-semibold text-white">
                  Building solutions since February 2021.
                </strong>
              </p>
            </div>
          </div>

          {/* Calls to action + socials, deliberately grouped as ONE block.
              As bare floating chips the social buttons read as a detached
              widget, so they now share the CTA row's language: hairline rule +
              label, and a single glass capsule that ties them to the buttons. */}
          <div className="hero-social opacity-0 flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <MagneticButton
                onClick={() => scrollTo("projects")}
                variant="primary"
                className="tap w-full justify-center sm:w-auto"
              >
                <FolderOpen className="h-4 w-4" />
                View Projects
              </MagneticButton>
              <MagneticButton
                onClick={() => window.open("/resume.pdf", "_blank")}
                variant="secondary"
                className="tap w-full justify-center sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </MagneticButton>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-eyebrow flex items-center gap-3 text-gray-500">
                <span
                  className="h-px w-6 bg-white/15 sm:w-8"
                  aria-hidden="true"
                />
                Connect
              </span>

              <div className="glass flex items-center gap-1 rounded-full p-1">
                {[
                  { icon: GithubIcon, href: socialLinks.github, label: "GitHub" },
                  {
                    icon: LinkedinIcon,
                    href: socialLinks.linkedin,
                    label: "LinkedIn",
                  },
                  {
                    icon: WhatsappIcon,
                    href: socialLinks.whatsapp,
                    label: "WhatsApp",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="tap flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-[#c9a96e] active:scale-95"
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: the empty column that the fixed StickyScene overlay lines
            up with (the model itself is rendered by StickyScene). */}
        <div
          className="order-2 hidden min-h-[60vh] lg:block"
          aria-hidden="true"
        />
      </div>

      {/* Scroll indicator — hidden on very short screens where it would collide
          with the CTAs. */}
      <div className="hero-scroll-indicator absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-0 sm:bottom-8 sm:flex">
        <span className="text-eyebrow text-gray-500">Scroll</span>
        <div className="relative h-12 w-px overflow-hidden bg-gradient-to-b from-white/50 to-transparent">
          <div
            className="absolute top-0 left-0 h-3 w-full bg-white/80"
            style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}