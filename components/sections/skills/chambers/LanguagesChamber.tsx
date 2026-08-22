"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiPhp,
  SiPython,
  SiOpenjdk,
  SiCplusplus,
  SiSharp,
} from "react-icons/si";
import { skillCategories } from "@/lib/data";
import {
  ChamberShell,
  Meter,
  TechCard,
} from "@/components/sections/skills/shared";
import { staggerParent, fadeUp, viewportOnce } from "@/components/animations/variants";

const COLORS: Record<string, string> = {
  HTML: "#e34f26",
  CSS: "#38bdf8",
  JavaScript: "#f7df1e",
  PHP: "#8b8fc6",
  Python: "#4b8bbe",
  Java: "#f89820",
  "C++": "#00599c",
  "C#": "#7c3aed",
};

const ICONS: Record<string, IconType> = {
  HTML: SiHtml5,
  CSS: SiCss,
  JavaScript: SiJavascript,
  PHP: SiPhp,
  Python: SiPython,
  Java: SiOpenjdk,
  "C++": SiCplusplus,
  "C#": SiSharp,
};

export function LanguagesChamber() {
  const category = skillCategories[0];
  return (
    <ChamberShell
      code={category.code}
      title="PROGRAMMING LANGUAGES"
      blurb="// CORE SYNTAX ARSENAL — HOVER TO SCAN"
    >
      <motion.div
        variants={staggerParent(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {category.items.map((item) => {
          const Icon = ICONS[item.name];
          return (
          <motion.div key={item.name} variants={fadeUp}>
            <TechCard>
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-md border transition-transform duration-400 group-hover:scale-110"
                  style={{
                    color: COLORS[item.name] ?? "#22d3ee",
                    borderColor: `${COLORS[item.name] ?? "#22d3ee"}55`,
                    background: `${COLORS[item.name] ?? "#22d3ee"}14`,
                  }}
                >
                  {Icon ? <Icon size={24} /> : null}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-muted/50">
                  {String(category.items.indexOf(item) + 1).padStart(2, "0")}
                </span>
              </div>
              <h4 className="mt-4 font-semibold tracking-wide text-frost">
                {item.name}
              </h4>
              <p className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-muted">
                {item.meta}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Meter value={item.level ?? 70} />
                <span className="font-mono text-[9px] text-neon">
                  {item.level}%
                </span>
              </div>
            </TechCard>
          </motion.div>
          );
        })}
      </motion.div>
    </ChamberShell>
  );
}
