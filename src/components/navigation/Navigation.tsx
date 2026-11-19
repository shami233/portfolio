"use client";

import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/data";
import { cn, getLenis } from "@/lib/utils";
import { FileText } from "lucide-react";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Update active section
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      let current = "home";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          current = section.id;
        }
      }
      setActiveSection(current);

      // Add background when scrolled
      setScrolled(scrollY > 50);

      // Hide on scroll down, show on scroll up
      if (scrollY > lastScrollY.current && scrollY > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock the page while the mobile menu is open, and let Escape close it.
  useEffect(() => {
    const lenis = getLenis();
    if (mobileOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: -20 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500",
          hidden && !mobileOpen && "-translate-y-full"
        )}
        aria-label="Main navigation"
      >
        {/* The gutter lives on this wrapper, so the inner surface never
            touches the screen edges ("stuck to the edges"). Row padding is
            tuned so the logo lines up with .container-page in every state. */}
        <div className="w-full px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6 lg:pt-5">
          <div
            className={cn(
              "mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl transition-all duration-500",
              scrolled || mobileOpen
                ? "glass-strong px-3 py-2.5 sm:px-4"
                : "px-1.5 py-2 sm:px-2 lg:px-6"
            )}
          >
            {/* Logo */}
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="flex shrink-0 items-center gap-2 transition-opacity duration-300 hover:opacity-80"
              aria-label="Go to home"
            >
              <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
                SHAMI
              </span>
              <span className="font-display text-base font-light tracking-tight text-gray-500 sm:text-lg">
                MUKASA
              </span>
            </button>

            {/* Nav items — desktop / large tablet only */}
            <div className="hidden items-center gap-3 lg:flex xl:gap-7">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={activeSection === item.id ? "true" : undefined}
                  className={cn(
                    "nav-link text-[13px] font-medium tracking-wide xl:text-sm",
                    activeSection === item.id && "active"
                  )}
                >
                  {item.label}
                </button>
              ))}

              {/* Resume button */}
              <button
                type="button"
                onClick={() => window.open("/resume.pdf", "_blank")}
                className="btn-gold-glass tap ml-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium xl:px-5 xl:text-sm"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Resume
              </button>
            </div>

            {/* Mobile / tablet menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="glass tap flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "h-px w-5 bg-white transition-all duration-300",
                    mobileOpen && "translate-y-[3.5px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "h-px w-5 bg-white transition-all duration-300",
                    mobileOpen && "-translate-y-[3.5px] -rotate-45"
                  )}
                />
              </div>
            </button>
          </div>

          {/* Mobile / tablet menu — separated rows with 44px tap targets,
              scrollable so it can never clip on small/short screens. */}
          <div
            id="mobile-menu"
            className={cn(
              "glass-strong mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl transition-all duration-500 lg:hidden",
              mobileOpen
                ? "max-h-[70svh] translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
            )}
          >
            <div className="flex max-h-[70svh] flex-col gap-1 overflow-y-auto p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-active={activeSection === item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="nav-item"
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.open("/resume.pdf", "_blank");
                }}
                className="btn-gold-glass nav-item mt-1 justify-center font-medium"
              >
                <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                Resume
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}