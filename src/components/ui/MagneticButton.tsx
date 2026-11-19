"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export default function MagneticButton({
  children,
  onClick,
  variant = "primary",
  className,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    // Clear inline transform so CSS hover/active scale animations work again
    btn.style.transform = "";
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Create ripple
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    }
    onClick?.();
  };

  const variants = {
    primary:
      "bg-[linear-gradient(135deg,#c9a96e_0%,#a8894a_100%)] hover:bg-[linear-gradient(135deg,#d4b87a_0%,#b8944e_100%)] text-black border border-[#c9a96e]/50 shadow-[0_4px_20px_rgba(201,169,110,0.2)] hover:shadow-[0_8px_40px_rgba(201,169,110,0.45)] font-semibold",
    secondary:
      "bg-[rgba(201,169,110,0.08)] hover:bg-[rgba(201,169,110,0.16)] text-white border border-[#c9a96e]/30 hover:border-[#c9a96e]/60 hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] [&_svg]:text-[#c9a96e]",
    ghost:
      "bg-transparent hover:bg-white/5 text-white/80 hover:text-white border border-white/10",
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "magnetic-btn ripple-container inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}