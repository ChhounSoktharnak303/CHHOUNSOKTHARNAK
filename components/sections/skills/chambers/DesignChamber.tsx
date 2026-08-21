"use client";

import { motion } from "framer-motion";
import { Eye, Layers, MousePointer2, PenTool } from "lucide-react";
import { skillCategories } from "@/lib/data";
import { ChamberShell, Meter } from "@/components/sections/skills/shared";

const APP_META: Record<string, { mono: string; color: string }> = {
  Photoshop: { mono: "Ps", color: "#31a8ff" },
  "After Effects": { mono: "Ae", color: "#9999ff" },
  Illustrator: { mono: "Ai", color: "#ff9a00" },
  Canva: { mono: "Ca", color: "#00c4cc" },
};

const LAYER_ROWS = ["BACKGROUND", "VECTOR SKETCH", "TYPOGRAPHY", "FX / GLOW"];

export function DesignChamber() {
  const category = skillCategories.find((c) => c.id === "design")!;

  return (
    <ChamberShell
      code={category.code}
      title="DESIGN STUDIO"
      blurb="// CREATIVE SUITE — LIVE ARTBOARD SESSION"
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          data-cursor="scan"
          className="overflow-hidden rounded-lg border border-white/[0.12] bg-[#0b0f1a]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-3 font-mono text-[9px] tracking-[0.22em] text-muted">
                design-suite.psd
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-[0.18em] text-muted/60">
              66.67%
            </span>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="h-3 border-b border-white/[0.06]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(148,163,184,0.35) 0 1px, transparent 1px 12px)",
                backgroundSize: "100% 5px",
                backgroundPosition: "bottom",
                backgroundRepeat: "repeat-x",
              }}
            />

            <div className="relative h-64 bg-panel md:h-72">
              <div className="bg-grid-dense absolute inset-0 opacity-70" />

              <svg
                viewBox="0 0 320 200"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full p-4"
              >
                <motion.path
                  d="M 30 150 C 90 40, 140 190, 190 80 S 280 120, 295 55"
                  fill="none"
                  stroke="#31a8ff"
                  strokeWidth="1.6"
                  strokeDasharray="4 5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.circle
                  cx="30"
                  cy="150"
                  r="4"
                  fill="#9999ff"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                />
                <motion.circle
                  cx="295"
                  cy="55"
                  r="4"
                  fill="#ff9a00"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.4 }}
                />
              </svg>

              <motion.div
                className="absolute left-[16%] top-[22%] h-24 w-36 border border-neon/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
                  (pos) => (
                    <span
                      key={pos}
                      className={`absolute ${pos} h-2 w-2 border border-white bg-deep`}
                    />
                  )
                )}
                <span className="absolute -top-5 left-0 font-mono text-[8px] tracking-[0.2em] text-neon">
                  VECTOR_01
                </span>
              </motion.div>

              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {["#31a8ff", "#9999ff", "#ff9a00", "#00c4cc", "#f8fafc"].map((c) => (
                  <motion.span
                    key={c}
                    className="h-5 w-5 rounded-sm border border-white/20"
                    style={{ background: c }}
                    whileHover={{ scale: 1.25, rotate: -6 }}
                  />
                ))}
              </div>

              <MousePointer2
                size={14}
                className="absolute right-[22%] top-[38%] text-frost drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
              />
              <PenTool size={11} className="absolute left-[42%] top-[62%] text-electric" />

              <div className="pointer-events-none absolute inset-x-0 h-8 animate-scan-y bg-gradient-to-b from-transparent via-neon/[0.07] to-transparent" />
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2 font-mono text-[8px] tracking-[0.22em] text-muted/60">
              <span>RGB / 8-BIT · 1920×1080</span>
              <span className="text-emerald-400">● AUTOSAVED</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {category.items.map((item, i) => {
              const meta = APP_META[item.name] ?? { mono: "?", color: "#22d3ee" };
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.5 }}
                  data-cursor="scan"
                  className="group relative overflow-hidden border border-white/[0.09] bg-panel/80 p-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                >
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: meta.color }}
                  />
                  <span
                    className="pointer-events-none absolute -right-5 -top-5 h-14 w-14 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
                    style={{ background: meta.color }}
                  />
                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-md font-mono text-sm font-bold transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                      style={{
                        color: meta.color,
                        border: `1px solid ${meta.color}66`,
                        background: `${meta.color}14`,
                      }}
                    >
                      {meta.mono}
                    </span>
                    <span className="font-mono text-[9px] text-muted">{item.level}%</span>
                  </div>
                  <h4 className="mt-3 text-sm font-semibold tracking-wide text-frost">
                    {item.name}
                  </h4>
                  <p className="mt-0.5 font-mono text-[8px] tracking-[0.16em] text-muted">
                    {item.meta}
                  </p>
                  <Meter value={item.level ?? 75} className="mt-3" tone={i % 2 ? "blue" : "cyan"} />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="border border-white/[0.09] bg-white/[0.02] p-4"
          >
            <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-neon">
              <Layers size={12} />
              LAYERS
            </div>
            <ul className="space-y-1.5">
              {LAYER_ROWS.map((layer, i) => (
                <li
                  key={layer}
                  className="group flex cursor-default items-center justify-between border border-transparent px-2 py-1.5 transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]"
                >
                  <span className="font-mono text-[9px] tracking-[0.18em] text-muted transition-colors group-hover:text-frost">
                    <span className="mr-2 text-muted/40">{String(i + 1).padStart(2, "0")}</span>
                    {layer}
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0.35, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45 }}
                  >
                    <Eye size={11} className="text-neon/70" />
                  </motion.span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </ChamberShell>
  );
}
