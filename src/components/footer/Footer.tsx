"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { socialLinks, navItems } from "@/lib/data";
import { cn, getLenis } from "@/lib/utils";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -20 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socials = [
    { icon: GithubIcon, href: socialLinks.github, label: "GitHub" },
    { icon: LinkedinIcon, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: WhatsappIcon, href: socialLinks.whatsapp, label: "WhatsApp" },
  ];

  return (
    <>
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "scroll-top-btn tap glass-strong glow-silver flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110",
          showScrollTop && "visible"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <footer className="safe-bottom relative border-t border-white/5 pt-12">
        {/* Glowing line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-7 md:flex-row sm:gap-8">
            {/* Logo + availability badge */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-3 group"
                aria-label="Back to top"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <span className="text-white font-display font-bold text-sm">
                    S
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-white">
                    Shami Mukasa
                  </p>
                  <p className="text-xs text-gray-500">
                    AI & Full Stack Developer
                  </p>
                </div>
              </button>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-gray-400">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse"
                  aria-hidden="true"
                />
                Open to new opportunities
              </span>
            </div>

            {/* Footer nav */}
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="tap inline-flex items-center px-1 text-sm text-gray-500 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Social icons + copyright */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="tap glass flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 transition-all duration-300 hover:scale-110 hover:text-white"
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-gray-500 sm:text-sm">
                <span>© {new Date().getFullYear()}</span>
                <span>Made with</span>
                <Heart
                  className="h-3.5 w-3.5 animate-pulse fill-white/50 text-white/50"
                  aria-hidden="true"
                />
                <span>React + Three.js</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}