"use client";

import { motion } from "framer-motion";
import { Server, Globe, Cpu, Database, ArrowDownUp } from "lucide-react";
import { skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";

const STAGES = [
  { label: "CLIENT", icon: Globe, note: "REQUEST" },
  { label: "API", icon: ArrowDownUp, note: "ROUTE / VALIDATE" },
  { label: "SERVER", icon: Server, note: "BUSINESS LOGIC" },
  { label: "DATABASE", icon: Cpu, note: "PERSIST" },
];

export function BackendChamber() {
  const category = skillCategories[3];
  return (
    <ChamberShell
      code={category.code}
      title="BACK-END PIPELINE"
      blurb="// REQUEST LIFECYCLE — LIVE DATA FLOW"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel hud-frame relative overflow-hidden rounded-lg p-6">
          <div className="bg-grid-dense absolute inset-0 opacity-50" />
          <div className="relative flex flex-col items-stretch">
            {STAGES.map((stage, i) => (
              <div key={stage.label}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.14, duration: 0.5 }}
                  className={`flex items-center gap-4 border px-4 py-3.5 ${
                    i === STAGES.length - 1
                      ? "border-cyan-primary/40 bg-cyan-primary/[0.06]"
                      : "border-white/[0.09] bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
                      i === STAGES.length - 1
                        ? "border-cyan-primary/50 text-neon"
                        : "border-electric/40 text-electric"
                    }`}
                  >
                    <stage.icon size={15} />
                  </span>
                  <div className="flex-1">
                    <div className="font-mono text-xs font-bold tracking-[0.28em] text-frost">
                      {stage.label}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.2em] text-muted/70">
                      {stage.note}
                    </div>
                  </div>
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1 w-1 animate-pulse-dot rounded-full bg-emerald-400"
                        style={{ animationDelay: `${(i * 3 + d) * 0.3}s` }}
                      />
                    ))}
                  </span>
                </motion.div>

                {i < STAGES.length - 1 && (
                  <div className="relative mx-auto h-9 w-px bg-gradient-to-b from-electric/60 to-cyan-primary/60">
                    <motion.span
                      className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_10px_rgba(34,211,238,1)]"
                      animate={{ top: ["-4%", "96%"], opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "linear",
                        times: [0, 0.12, 0.88, 1],
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {category.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                data-cursor="scan"
                className="group relative overflow-hidden border border-white/[0.08] bg-panel/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-electric/50 hover:shadow-[0_6px_28px_rgba(59,130,246,0.18)]"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold tracking-wide text-frost">
                    {item.name}
                  </h4>
                  <Database
                    size={13}
                    className="text-muted/40 transition-colors group-hover:text-electric"
                  />
                </div>
                <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-muted">
                  {item.meta}
                </p>
                <div className="mt-3 h-0.5 w-full overflow-hidden rounded bg-white/[0.06]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-primary to-neon"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 border border-dashed border-white/[0.12] p-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted/80">
            <span className="text-neon">$</span> php artisan serve --host=0.0.0.0
            <br />
            <span className="text-neon">$</span> python manage.py runserver
            <br />
            <span className="text-emerald-400">
              ✓ 5 frameworks · 1 pipeline · zero downtime
            </span>
          </div>
        </div>
      </div>
    </ChamberShell>
  );
}
