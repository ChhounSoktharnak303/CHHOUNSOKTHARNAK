"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { skillCategories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LanguagesChamber } from "./chambers/LanguagesChamber";
import { DatabaseChamber } from "./chambers/DatabaseChamber";
import { FrontendChamber } from "./chambers/FrontendChamber";
import { BackendChamber } from "./chambers/BackendChamber";
import { MobileChamber } from "./chambers/MobileChamber";
import { CyberChamber } from "./chambers/CyberChamber";
import { OfficeChamber } from "./chambers/OfficeChamber";
import { DesignChamber } from "./chambers/DesignChamber";
import { HardwareChamber } from "./chambers/HardwareChamber";

const CHAMBERS: Record<string, () => React.JSX.Element> = {
  languages: LanguagesChamber,
  database: DatabaseChamber,
  frontend: FrontendChamber,
  backend: BackendChamber,
  mobile: MobileChamber,
  cyber: CyberChamber,
  microsoft: OfficeChamber,
  design: DesignChamber,
  hardware: HardwareChamber,
};

export function Skills() {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const activeCategory =
    skillCategories.find((c) => c.id === activeId) ?? skillCategories[0];
  const ActiveChamber = CHAMBERS[activeId] ?? LanguagesChamber;

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-deep py-28 md:py-36"
      aria-label="Technology matrix"
    >
      <div className="pointer-events-none absolute left-1/2 top-24 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-blue-primary/[0.07] blur-[130px]" />
      <div className="bg-grid-fine absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.04"
          code="MATRIX"
          title="TECHNOLOGY MATRIX"
          align="center"
          className="mb-8"
          description="Select a node on the core to open its chamber. Every discipline has its own visualization."
        />

        <div
          className="relative mx-auto hidden h-[430px] w-full max-w-xl select-none md:block lg:h-[470px]"
          aria-label="Technology category selector"
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            {skillCategories.map((cat, i) => {
              const angle = ((i * (360 / skillCategories.length) - 90) * Math.PI) / 180;
              const x = 50 + 43 * Math.cos(angle);
              const y = 50 + 43 * Math.sin(angle);
              return (
                <line
                  key={cat.id}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={cat.id === activeId ? "rgba(34,211,238,0.75)" : "rgba(148,163,184,0.14)"}
                  strokeWidth={cat.id === activeId ? 1.4 : 0.7}
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke 0.4s" }}
                />
              );
            })}
          </svg>

          {[0, 1, 2].map((ring) => (
            <span
              key={ring}
              aria-hidden="true"
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                ring === 2 ? "border-dashed border-neon/15 animate-spin-slower" : "border-white/[0.06]"
              }`}
              style={{
                width: `${26 + ring * 13}%`,
                height: `${52 + ring * 26}%`,
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => {
              const idx = skillCategories.findIndex((c) => c.id === activeId);
              setActiveId(skillCategories[(idx + 1) % skillCategories.length].id);
            }}
            aria-label="Cycle to next technology category"
            data-cursor="scan"
            className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-neon/50 bg-deep shadow-[0_0_50px_rgba(34,211,238,0.3)]"
          >
            <span className="absolute inset-0 animate-ping rounded-full border border-neon/25 [animation-duration:2.6s]" />
            <span className="font-mono text-[8px] tracking-[0.35em] text-muted">SYSTEM</span>
            <span className="mt-1 font-mono text-xs font-bold tracking-[0.22em] text-frost text-glow-cyan">
              CORE
            </span>
            <span className="mt-1.5 h-1 w-1 animate-pulse-dot rounded-full bg-emerald-400" />
          </button>

          {skillCategories.map((cat, i) => {
            const angle = (i * (360 / skillCategories.length) - 90) * (Math.PI / 180);
            const x = 50 + 43 * Math.cos(angle);
            const y = 50 + 43 * Math.sin(angle);
            const isActive = cat.id === activeId;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: "backOut" }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={isActive}
                data-cursor="scan"
                className={`absolute z-10 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border font-mono transition-colors duration-300 ${
                  isActive
                    ? "border-neon bg-neon/[0.12] text-neon shadow-[0_0_34px_rgba(34,211,238,0.45)]"
                    : "border-white/[0.14] bg-panel text-muted hover:border-electric/60 hover:text-frost"
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="text-[10px] font-bold tracking-[0.18em]">{cat.code}</span>
                <span className="mt-1 text-[7px] tracking-[0.14em] opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="mb-10 grid grid-cols-3 gap-2 md:hidden" role="tablist" aria-label="Technology categories">
          {skillCategories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(cat.id)}
                className={`flex flex-col items-center gap-1 rounded-md border px-1 py-2.5 font-mono transition-colors ${
                  isActive
                    ? "border-neon/70 bg-neon/10 text-neon"
                    : "border-white/[0.1] bg-panel text-muted"
                }`}
              >
                <span className="text-[10px] font-bold tracking-[0.12em]">{cat.code}</span>
                <span className="text-[7px] tracking-[0.08em] opacity-60">
                  {cat.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-14 md:mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveChamber />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 font-mono text-[9px] tracking-[0.3em] text-muted/60">
          <span className="h-px w-10 bg-white/10" />
          ACTIVE NODE: {activeCategory.label}
          <span className="h-px w-10 bg-white/10" />
        </div>
      </div>
    </section>
  );
}
