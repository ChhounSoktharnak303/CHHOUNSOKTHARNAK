"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Fingerprint, Lock, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { personalData } from "@/lib/data";
import {
  fadeUp,
  slideFromLeft,
  slideFromRight,
  staggerParent,
  viewportOnce,
} from "@/components/animations/variants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Typewriter } from "@/components/ui/Typewriter";
import { useIsMobile } from "@/hooks/useDevice";

const GothamScene = dynamic(() => import("@/components/3d/GothamScene"), {
  ssr: false,
});

const QUERY_LINES = [
  { text: "> QUERY: SELECT * FROM identity", className: "text-neon" },
  { text: "> WHERE subject = 'NAK-2001';", className: "text-neon" },
  { text: "EXECUTING RETRIEVAL...", className: "text-muted", pauseAfter: 500 },
  { text: "7 RECORDS FOUND — DECRYPTED", className: "text-emerald-400" },
];

type Field = { label: string; value: string[] };

const FIELDS: Field[] = [
  { label: "NAME", value: [personalData.name] },
  { label: "SEX", value: [personalData.sex] },
  { label: "DATE OF BIRTH", value: [personalData.birthDate] },
  { label: "PLACE OF BIRTH", value: [personalData.placeOfBirth] },
  { label: "NATIONALITY", value: [personalData.nationality] },
  { label: "MARITAL STATUS", value: [personalData.maritalStatus] },
  { label: "ADDRESS", value: [...personalData.address] },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [sceneActive, setSceneActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-deep py-28 md:py-36"
      aria-label="Identity database"
    >
      <div className="absolute inset-0">
        <GothamScene active={sceneActive} mobile={isMobile} />
      </div>
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-[0.14]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-primary/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-primary/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.01"
          code="IDENTITY"
          title="IDENTITY DATABASE"
          description="Personal records retrieved from the encrypted core. Every field verified by the system."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.aside
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="glass-panel hud-frame scanlines-overlay relative rounded-lg p-6"
          >
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-neon">
                <Fingerprint size={14} />
                QUERY CONSOLE
              </span>
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/70" />
                <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
              </span>
            </div>
            <Typewriter lines={QUERY_LINES} speed={16} className="space-y-2 text-[11px] md:text-xs leading-relaxed" />
            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-[9px] tracking-[0.25em] text-muted/60">
              <Lock size={11} className="text-emerald-400" />
              AES-256 ENCRYPTED CHANNEL
            </div>

            <motion.div
              className="absolute -right-4 -top-4 flex h-9 w-9 items-center justify-center rounded-full border border-neon/40 bg-deep"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={13} className="text-neon" />
            </motion.div>
          </motion.aside>

          <motion.div
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-3 rounded-xl border border-electric/15" />
            <motion.ol
              variants={staggerParent(0.09)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="divide-y divide-white/[0.07]"
            >
              {FIELDS.map((field, i) => (
                <motion.li
                  key={field.label}
                  variants={fadeUp}
                  custom={i * 0.05}
                  className="group relative flex flex-col gap-1 px-4 py-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <span className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-gradient-to-b from-neon to-blue-primary transition-transform duration-500 group-hover:scale-y-100" />
                  <span className="w-14 shrink-0 font-mono text-[10px] text-muted/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-44 shrink-0 font-mono text-[10px] md:text-[11px] tracking-[0.28em] text-neon/80">
                    {field.label}
                  </span>
                  <span className="text-sm md:text-[15px] font-medium tracking-wide text-frost/95">
                    {field.value.map((v, vi) => (
                      <span key={vi} className="block leading-relaxed">
                        {v}
                      </span>
                    ))}
                  </span>
                </motion.li>
              ))}
            </motion.ol>

            <motion.div
              className="absolute -right-2 -top-5 hidden font-mono text-[9px] tracking-[0.3em] text-neon/70 md:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ▚ DATA STREAM ACTIVE
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
