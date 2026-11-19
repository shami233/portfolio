import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitText(text: string): string[] {
  return text.split("");
}

export function splitWords(text: string): string[] {
  return text.split(" ");
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/** Shape of the Lenis smooth-scroll instance exposed on `window.lenis`. */
export interface LenisInstance {
  scrollTo: (
    target: number | HTMLElement,
    options?: { offset?: number }
  ) => void;
  stop: () => void;
  start: () => void;
}

/** Returns the Lenis smooth-scroll instance registered by SmoothScroll.
 *  (The `lenis` package already augments `Window.lenis` with its own type,
 *  so we read it through a narrow cast instead of re-declaring the global.) */
export function getLenis(): LenisInstance | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { lenis?: LenisInstance }).lenis;
}

/** Registers (or clears, with `null`) the Lenis instance on `window.lenis`. */
export function setLenis(instance: LenisInstance | null): void {
  if (typeof window === "undefined") return;
  (window as unknown as { lenis?: LenisInstance }).lenis =
    instance ?? undefined;
}