"use client";

import { cn } from "@/lib/utils";
import { DecodeText } from "@/components/animations/DecodeText";
import { Reveal } from "@/components/animations/Reveal";

type SectionHeadingProps = {
  index: string;
  code: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  index,
  code,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-14 md:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      <Reveal>
        <div
          className={cn(
            "mb-4 flex items-center gap-3 font-mono text-[10px] md:text-xs tracking-[0.35em] text-neon/80",
            align === "center" && "justify-center"
          )}
        >
          <span className="inline-block h-px w-8 bg-neon/50" />
          <span>
            {index} // {code}
          </span>
          {align === "center" && (
            <span className="inline-block h-px w-8 bg-neon/50" />
          )}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-3xl font-bold tracking-tight text-frost sm:text-4xl lg:text-5xl">
          <DecodeText text={title} speed={24} />
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function StatusDot({
  label,
  tone = "online",
  className,
}: {
  label: string;
  tone?: "online" | "warn" | "idle";
  className?: string;
}) {
  const colors = {
    online: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
    warn: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]",
    idle: "bg-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted",
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full animate-pulse-dot", colors[tone])}
      />
      {label}
    </span>
  );
}
