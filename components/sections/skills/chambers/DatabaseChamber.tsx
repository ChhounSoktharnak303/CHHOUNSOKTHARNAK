"use client";

import { motion } from "framer-motion";
import { Database, Terminal } from "lucide-react";
import { skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";

export function DatabaseChamber() {
  const category = skillCategories[1];
  return (
    <ChamberShell
      code={category.code}
      title="DATABASE SYSTEMS"
      blurb="// CONNECTION STATUS — LIVE MONITOR"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel hud-frame scanlines-overlay relative overflow-hidden rounded-lg p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-neon">
              <Database size={13} />
              DATABASE CONNECTION
            </span>
            <span className="font-mono text-[9px] text-muted/60">PORT 3306</span>
          </div>

          <ul className="space-y-3">
            {category.items.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-neon/30"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-muted/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium tracking-wide text-frost">
                    {item.name.toUpperCase()}
                  </span>
                </span>
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-emerald-400">
                  <span
                    className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  ONLINE
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-6">
            <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[0.28em] text-muted">
              <span>QUERY ENGINE</span>
              <span className="text-neon">ACTIVE</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-sm border border-neon/20 bg-deep p-[2px]">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-primary via-cyan-primary to-neon"
                animate={{ width: ["12%", "96%", "12%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-lg p-6">
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-electric">
            <Terminal size={13} />
            SQL CONSOLE
          </div>
          <div className="space-y-2 font-mono text-[11px] leading-relaxed">
            <p className="text-muted">
              <span className="text-neon">SELECT</span> skill, level
            </p>
            <p className="text-muted">
              <span className="text-neon">FROM</span> database_engineering
            </p>
            <p className="text-muted">
              <span className="text-neon">ORDER BY</span> level{" "}
              <span className="text-neon">DESC</span>;
            </p>
            <p className="pt-2 text-emerald-400">
              → {category.items.length} rows returned in 0.0042s
            </p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {["ACID", "JOIN", "INDEX", "VIEW", "TRIGGER", "NORMALIZE"].map(
              (tag) => (
                <span
                  key={tag}
                  className="border border-white/[0.08] bg-white/[0.02] px-2 py-1.5 text-center font-mono text-[9px] tracking-[0.15em] text-muted transition-colors hover:border-cyan-primary/40 hover:text-neon"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </ChamberShell>
  );
}
