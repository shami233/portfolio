import { skills } from "@/lib/data";

/**
 * Scrolling tech-stack band used to break up sections and add motion.
 * Uses the `--animate-marquee` keyframes already defined in globals.css.
 */
export default function TechMarquee() {
  const strip = (
    <div className="flex items-center gap-8 pr-8 shrink-0">
      {skills.map((skill) => (
        <span
          key={skill.name}
          className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap"
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `${skill.color}15`,
              border: `1px solid ${skill.color}30`,
            }}
          >
            <skill.icon
              className="w-4 h-4"
              style={{ color: skill.color }}
              aria-hidden="true"
            />
          </span>
          {skill.name}
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="relative z-10 py-6 border-y border-white/[0.06] bg-white/[0.015] overflow-hidden sm:py-7 [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="flex w-max animate-marquee [animation-duration:45s] hover:[animation-play-state:paused]">
        {strip}
        {strip}
      </div>
    </div>
  );
}