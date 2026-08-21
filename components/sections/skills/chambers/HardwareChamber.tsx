"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Cpu, MemoryStick, HardDrive, CircuitBoard, Plug, Printer, Check } from "lucide-react";
import { skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";

const COMPONENTS = [
  { id: "cpu", label: "CPU", icon: Cpu, detail: "Central processing — installed, cooled and stress-tested." },
  { id: "ram", label: "RAM", icon: MemoryStick, detail: "Memory modules — seated, dual-channel verified." },
  { id: "storage", label: "STORAGE", icon: HardDrive, detail: "Drives & partitions — formatted and optimized." },
  { id: "gpu", label: "GPU", icon: CircuitBoard, detail: "Graphics unit — drivers installed, output tested." },
  { id: "psu", label: "POWER", icon: Plug, detail: "PSU & cabling — stable rails, clean cable management." },
  { id: "printer", label: "PRINTER", icon: Printer, detail: "Peripherals — drivers, spooler and network printing configured." },
];

export function HardwareChamber() {
  const category = skillCategories[7];
  const [active, setActive] = useState(COMPONENTS[0].id);
  const activeComponent = COMPONENTS.find((c) => c.id === active)!;

  return (
    <ChamberShell
      code={category.code}
      title="HARDWARE / SOFTWARE LAB"
      blurb="// SELECT A COMPONENT TO INSPECT THE SYSTEM"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel hud-frame relative overflow-hidden rounded-lg p-6">
          <div className="bg-grid-dense absolute inset-0 opacity-40" />
          <div className="relative grid grid-cols-3 gap-3">
            {COMPONENTS.map((comp, i) => {
              const isActive = comp.id === active;
              return (
                <motion.button
                  key={comp.id}
                  type="button"
                  onClick={() => setActive(comp.id)}
                  onMouseEnter={() => setActive(comp.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  data-cursor="scan"
                  aria-pressed={isActive}
                  className={`group flex flex-col items-center gap-2 border px-3 py-5 transition-all duration-300 ${
                    isActive
                      ? "border-neon/60 bg-neon/[0.08] shadow-[0_0_26px_rgba(34,211,238,0.22)]"
                      : "border-white/[0.09] bg-deep/70 hover:border-electric/40"
                  }`}
                >
                  <comp.icon
                    size={20}
                    className={`transition-colors ${isActive ? "text-neon" : "text-muted group-hover:text-electric"}`}
                  />
                  <span
                    className={`font-mono text-[9px] tracking-[0.22em] ${
                      isActive ? "text-frost" : "text-muted"
                    }`}
                  >
                    {comp.label}
                  </span>
                  <span
                    className={`h-1 w-6 rounded-full transition-colors ${
                      isActive ? "bg-neon shadow-[0_0_8px_rgba(34,211,238,0.9)]" : "bg-white/10"
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeComponent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative mt-5 border border-dashed border-white/[0.14] bg-deep/80 p-4 font-mono text-[11px] leading-relaxed text-muted"
          >
            <span className="text-neon">&gt; INSPECT {activeComponent.label}:</span>{" "}
            {activeComponent.detail}
          </motion.div>
        </div>

        <div className="space-y-4">
          {category.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 border border-white/[0.08] bg-white/[0.02] px-4 py-3.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/10">
                <Check size={12} className="text-emerald-400" />
              </span>
              <div>
                <div className="text-sm font-medium tracking-wide text-frost">
                  {item.name}
                </div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-muted">
                  STATUS: OPERATIONAL
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ChamberShell>
  );
}
