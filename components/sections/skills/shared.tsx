"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Meter({
  value,
  className,
  tone = "cyan",
}: {
  value: number;
  className?: string;
  tone?: "cyan" | "blue" | "green";
}) {
  const gradients = {
    cyan: "from-cyan-primary to-neon",
    blue: "from-blue-primary to-electric",
    green: "from-emerald-500 to-emerald-300",
  };
  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-white/[0.07] ${className ?? ""}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${gradients[tone]}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      />
    </div>
  );
}

export function ChamberShell({
  code,
  title,
  blurb,
  children,
}: {
  code: string;
  title: string;
  blurb?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-[10px] tracking-[0.35em] text-neon">
          [{code}]
        </span>
        <h3 className="text-xl font-bold tracking-wide text-frost md:text-2xl">
          {title}
        </h3>
        {blurb && (
          <span className="w-full font-mono text-[11px] tracking-[0.14em] text-muted">
            {blurb}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function TechCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-cursor="scan"
      className={`group relative overflow-hidden border border-white/[0.08] bg-panel/80 p-5 transition-all duration-400 hover:-translate-y-1 hover:border-neon/40 hover:shadow-[0_8px_36px_rgba(34,211,238,0.14)] ${className ?? ""}`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-neon/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </div>
  );
}
