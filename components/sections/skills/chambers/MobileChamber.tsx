"use client";

import { motion } from "framer-motion";
import { Smartphone, Layers, Code2, Wrench } from "lucide-react";
import { skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";

const NODE_ICONS = [Layers, Code2, Wrench];

export function MobileChamber() {
  const category = skillCategories[4];
  return (
    <ChamberShell
      code={category.code}
      title="MOBILE DEVELOPMENT"
      blurb="// TECHNOLOGIES UPLINKING TO THE DEVICE"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative mx-auto flex h-[360px] w-full max-w-sm items-center justify-center">
          <div className="pointer-events-none absolute h-56 w-56 rounded-full bg-cyan-primary/15 blur-[70px]" />

          <svg
            viewBox="0 0 300 300"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            {[
              { x1: 150, y1: 150, x2: 52, y2: 62 },
              { x1: 150, y1: 150, x2: 248, y2: 78 },
              { x1: 150, y1: 150, x2: 150, y2: 258 },
            ].map((l, i) => (
              <g key={i}>
                <line
                  {...l}
                  stroke="rgba(34,211,238,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  className="animate-dash-flow"
                />
              </g>
            ))}
          </svg>

          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(34,211,238,1)]"
              style={{
                left: ["17%", "83%", "50%"][i],
                top: ["21%", "26%", "86%"][i],
              }}
              animate={{ scale: [1, 1.9, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            data-cursor="scan"
            className="relative z-10 h-[240px] w-[124px] rounded-[22px] border border-neon/40 bg-deep p-2 shadow-[0_0_44px_rgba(34,211,238,0.28)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-white/20" />
            <div className="relative h-[calc(100%-14px)] overflow-hidden rounded-xl border border-white/10 bg-panel">
              <div className="bg-grid-dense absolute inset-0" />
              <div className="grid grid-cols-3 gap-1.5 p-2 pt-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="aspect-square rounded-md border border-neon/20 bg-neon/[0.06]"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: i * 0.18,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-x-0 h-6 animate-scan-y bg-gradient-to-b from-transparent via-neon/20 to-transparent" />
            </div>
          </motion.div>

          {category.items.map((item, i) => {
            const Icon = NODE_ICONS[i % NODE_ICONS.length];
            const pos = [
              "left-0 top-[13%]",
              "right-0 top-[19%]",
              "left-1/2 -translate-x-1/2 bottom-[2%]",
            ][i];
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                className={`absolute z-10 ${pos}`}
              >
                <div
                  data-cursor="scan"
                  className="flex items-center gap-2 border border-white/[0.12] bg-panel/95 px-3 py-2 shadow-[0_0_16px_rgba(59,130,246,0.2)] transition-colors hover:border-neon/60"
                >
                  <Icon size={12} className="text-neon" />
                  <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.14em] text-frost">
                    {item.name.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          {category.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className="group flex items-center gap-4 border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-cyan-primary/40 hover:bg-cyan-primary/[0.04]"
            >
              <Smartphone
                size={16}
                className="shrink-0 text-muted/40 transition-colors group-hover:text-neon"
              />
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-semibold tracking-wide text-frost">
                    {item.name}
                  </h4>
                  <span className="font-mono text-[10px] text-neon">
                    {item.level}%
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-muted">
                  {item.meta}
                </p>
                <div className="mt-2.5 h-0.5 overflow-hidden rounded bg-white/[0.06]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-electric to-neon"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ChamberShell>
  );
}
