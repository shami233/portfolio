"use client";

import { useEffect, useRef } from "react";

export default function Background() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    // Fewer particles on touch devices — they are pure decoration and every one
    // of them is an animated layer the GPU has to composite.
    const isTouch = window.matchMedia("(hover: none)").matches;
    const particleCount = isTouch
      ? Math.min(16, window.innerWidth / 45)
      : Math.min(50, window.innerWidth / 25);
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      const size = Math.random() * 2 + 0.5;
      particle.style.width = `${size}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = "50%";
      particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = "0";
      particle.style.pointerEvents = "none";
      particle.style.transition = "opacity 3s ease";
      particle.style.filter = "blur(0.5px)";
      bg.appendChild(particle);
      particles.push(particle);

      // Animate particle
      const animate = () => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 25 + 20;
        particle.style.transition = `all ${duration}s linear`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        setTimeout(animate, duration * 1000);
      };

      setTimeout(() => {
        particle.style.opacity = "1";
        animate();
      }, Math.random() * 5000);
    }

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      bg.style.setProperty("--mouse-x", `${x}px`);
      bg.style.setProperty("--mouse-y", `${y}px`);
    };

    if (!isTouch) window.addEventListener("mousemove", handleMouseMove);

    return () => {
      particles.forEach((p) => p.remove());
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Base gradient - subtle depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0a0a0a 0%, #050505 60%, #030303 100%)",
        }}
      />

      {/* Volumetric fog layers - barely visible */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.04] animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          top: "5%",
          left: "10%",
          transform: "translate(var(--mouse-x, 0), var(--mouse-y, 0))",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.03] animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, #d4d4d4 0%, transparent 70%)",
          bottom: "10%",
          right: "5%",
          animationDelay: "2s",
          transform: "translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.02] animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, #a0a0a0 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          animationDelay: "4s",
          transform: "translate(calc(var(--mouse-x, 0) * -0.5), calc(var(--mouse-y, 0) * -0.5))",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Subtle grid overlay - barely visible */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
}