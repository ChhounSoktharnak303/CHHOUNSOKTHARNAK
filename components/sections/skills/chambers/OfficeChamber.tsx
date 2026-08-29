"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";
import { Counter } from "@/components/ui/Counter";

const APP_META: Record<string, { color: string; tag: string; letter: string }> = {
  Word: { color: "#2b579a", tag: "DOC", letter: "W" },
  Excel: { color: "#217346", tag: "XLS", letter: "X" },
  PowerPoint: { color: "#d24726", tag: "PPT", letter: "P" },
  Outlook: { color: "#0f6cbd", tag: "MSG", letter: "O" },
  Access: { color: "#a4373a", tag: "DB", letter: "A" },
};

function OfficeTile({
  letter,
  color,
  className,
}: {
  letter: string;
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect width="48" height="48" rx="9" fill={color} />
      <rect x="5" y="5" width="38" height="38" rx="3" fill="#ffffff" />
      <path d="M5 31 L19 17 L24 22 L14 43 H5 Z" fill="#e4ecf6" />
      <path d="M5 36 L24 17 L31 21 L27 43 H5 Z" fill="#cfdcea" opacity="0.7" />
      <text
        x="24"
        y="33"
        textAnchor="middle"
        fontFamily="'Segoe UI', Segoe, Arial, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill={color}
      >
        {letter}
      </text>
    </svg>
  );
}

export function OfficeChamber() {
  const category = skillCategories[6];
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    setStamp(personalDateStamp());
  }, []);

  return (
    <ChamberShell
      code={category.code}
      title="PRODUCTIVITY DASHBOARD"
      blurb="// MICROSOFT OFFICE SUITE — EFFICIENCY METRICS"
    >
      <div className="overflow-hidden rounded-lg border border-white/[0.1] bg-panel/70">
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-frost">
              DASHBOARD v2.0
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted">
            SYNCED{stamp ? ` · ${stamp}` : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5">
          {category.items.map((item, i) => {
            const meta = APP_META[item.name] ?? {
              color: "#22d3ee",
              tag: "APP",
              letter: item.name[0] ?? "?",
            };
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.5 }}
                data-cursor="scan"
                className="group relative bg-panel p-5 transition-colors hover:bg-deep"
              >
                <span
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: meta.color }}
                />
                <div className="flex items-start justify-between">
                  <span
                    className="block transition-transform duration-400 group-hover:-rotate-6 group-hover:scale-110"
                    style={{ filter: `drop-shadow(0 6px 12px ${meta.color}55)` }}
                  >
                    <OfficeTile
                      letter={meta.letter}
                      color={meta.color}
                      className="h-12 w-12"
                    />
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-muted/50">
                    .{meta.tag}
                  </span>
                </div>
                <h4 className="mt-4 text-sm font-semibold tracking-wide text-frost">
                  {item.name}
                </h4>
                <p className="mt-0.5 font-mono text-[9px] tracking-[0.16em] text-muted">
                  {item.meta}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <Counter
                    to={item.level ?? 80}
                    suffix="%"
                    className="text-2xl font-bold tabular-nums text-frost"
                  />
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: meta.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.25 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-5 py-3 font-mono text-[9px] tracking-[0.22em] text-muted/70">
          <span>STATUS: ALL MODULES OPERATIONAL</span>
          <span className="text-emerald-400">● LICENSE ACTIVE</span>
        </div>
      </div>
    </ChamberShell>
  );
}

function personalDateStamp() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}
