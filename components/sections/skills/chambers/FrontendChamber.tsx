"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";

const ORBITS = [
  { items: ["Vue.js", "ReactJS", "Vite / JSX"], radius: 13, duration: 24, reverse: false },
  { items: ["Angular", "Next.js"], radius: 8.5, duration: 15, reverse: true },
];

export function FrontendChamber() {
  const category = skillCategories[2];
  return (
    <ChamberShell
      code={category.code}
      title="FRONT-END CONSTELLATION"
      blurb="// FRAMEWORKS IN ORBIT AROUND THE UI CORE"
    >
      <div className="relative mx-auto flex h-[380px] w-full max-w-xl origin-center scale-[0.68] items-center justify-center sm:scale-90 md:h-[420px] md:scale-100">
        <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-blue-primary/15 blur-[70px]" />

        {[26, 17].map((size, i) => (
          <div
            key={size}
            aria-hidden="true"
            className={`absolute rounded-full border border-dashed ${
              i === 0 ? "border-electric/25" : "border-neon/20"
            }`}
            style={{ width: `${size}rem`, height: `${size}rem` }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-neon/50 bg-deep shadow-[0_0_50px_rgba(34,211,238,0.3)]"
        >
          <span className="absolute inset-0 animate-ping rounded-full border border-neon/20" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-muted">CORE</span>
          <span className="mt-1 text-sm font-bold tracking-[0.2em] text-frost text-glow-cyan">
            UI CORE
          </span>
        </motion.div>

        {ORBITS.map((orbit, oi) => (
          <div
            key={oi}
            className="absolute"
            style={{
              width: `${orbit.radius * 2}rem`,
              height: `${orbit.radius * 2}rem`,
              animation: `spin ${orbit.duration}s linear infinite${
                orbit.reverse ? " reverse" : ""
              }`,
            }}
          >
            {orbit.items.map((name, i) => {
              const angle = (i / orbit.items.length) * 360;
              return (
                <div
                  key={name}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-${orbit.radius}rem)`,
                  }}
                >
                  <div
                    style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}
                  >
                    <div
                      style={{
                        animation: `spin ${orbit.duration}s linear infinite${
                          orbit.reverse ? "" : " reverse"
                        }`,
                      }}
                    >
                      <div
                        data-cursor="scan"
                        className="whitespace-nowrap border border-white/[0.12] bg-panel px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-frost shadow-[0_0_18px_rgba(59,130,246,0.25)] transition-colors hover:border-neon/60 hover:text-neon"
                      >
                        {name.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-5">
        {category.items.map((item) => (
          <div
            key={item.name}
            className="border border-white/[0.07] bg-white/[0.02] px-2 py-2 text-center font-mono text-[9px] tracking-[0.12em] text-muted"
          >
            {item.name.toUpperCase()}
          </div>
        ))}
      </div>
    </ChamberShell>
  );
}
