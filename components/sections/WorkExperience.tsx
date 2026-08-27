"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Radio, Terminal, ChevronRight, Cpu, Zap } from "lucide-react";
import { workExperience } from "@/lib/data";
import type { WorkExperienceEntry } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* ---------- background effects ---------- */

function MatrixRain() {
  const cols = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${(i * 3.4) % 100}%`,
        delay: i * 0.4,
        duration: 6 + (i % 5) * 1.8,
        chars: Array.from(
          { length: 8 },
          () => ["0", "1", "█", "▓", "░", "▒", "╬", "╫", "╠", "╩"][Math.floor(Math.random() * 10)]
        ).join("\n"),
        opacity: 0.03 + (i % 4) * 0.015,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {cols.map((c) => (
        <pre
          key={c.id}
          className="absolute top-0 font-mono text-[7px] leading-[10px] text-neon"
          style={{
            left: c.left,
            opacity: c.opacity,
            animation: `data-fall ${c.duration}s linear ${c.delay}s infinite`,
          }}
        >
          {c.chars}
        </pre>
      ))}
    </div>
  );
}

function FloatingHex() {
  const hexes = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${(i * 26 + 8) % 92 + 4}%`,
        top: `${(i * 19 + 12) % 85 + 5}%`,
        size: 14 + (i % 4) * 8,
        delay: i * 1.4,
        dur: 12 + (i % 3) * 4,
      })),
    []
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {hexes.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: h.left,
            top: h.top,
            width: h.size,
            height: h.size,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background:
              "linear-gradient(135deg, rgba(34,211,238,0.07), rgba(59,130,246,0.04))",
            animation: `hex-float ${h.dur}s ease-in-out ${h.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function OrbitRings() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width: 280,
          height: 280,
          top: "8%",
          right: "-6%",
          borderColor: "rgba(34,211,238,0.05)",
          animation: "spin 36s linear infinite",
        }}
      />
      <div
        className="absolute rounded-full border"
        style={{
          width: 180,
          height: 180,
          bottom: "12%",
          left: "-4%",
          borderColor: "rgba(59,130,246,0.04)",
          animation: "spin-reverse 28s linear infinite",
        }}
      />
    </div>
  );
}

/* ---------- horizontal timeline ---------- */

function HorizontalTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative mb-12 md:mb-16" aria-hidden="true">
      {/* track bg */}
      <div className="relative mx-auto h-px max-w-4xl bg-white/[0.06]">
        {/* animated glow overlay */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 right-0 origin-left bg-gradient-to-r from-neon/60 via-cyan-primary/50 to-blue-primary/60 shadow-[0_0_18px_rgba(34,211,238,0.4)]"
        />

        {/* traveling pulse */}
        <motion.div
          initial={{ left: "0%" }}
          animate={inView ? { left: "100%" } : {}}
          transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_16px_rgba(34,211,238,0.8)]"
        />

        {/* nodes */}
        {workExperience.map((entry, i) => {
          const isActive = entry.status === "ACTIVE";
          const pct = (i / (workExperience.length - 1)) * 100;
          return (
            <div
              key={entry.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {/* outer rings for active */}
              {isActive && (
                <>
                  <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20 animate-[energy-pulse_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
                  <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/15 animate-[energy-pulse_2.4s_cubic-bezier(0.4,0,0.2,1)_0.8s_infinite]" />
                </>
              )}
              {/* node */}
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.2,
                  type: "spring",
                  stiffness: 250,
                  damping: 15,
                }}
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isActive
                    ? "border-emerald-400/70 bg-deep shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                    : "border-neon/60 bg-deep shadow-[0_0_14px_rgba(34,211,238,0.35)]"
                }`}
              >
                <span className="font-mono text-[10px] font-bold text-frost">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
              {/* label below */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.2 }}
                className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-center"
              >
                <span className="block font-mono text-[8px] tracking-[0.25em] text-neon/50">
                  {entry.period}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- sub-components ---------- */

function TypingLine({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(iv);
      }, 20);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, text, delay]);

  return (
    <span ref={ref} className="font-mono text-[10px] tracking-[0.16em] text-neon/55">
      <span className="text-neon/25">&gt; </span>
      {displayed}
      {displayed.length < text.length && inView && (
        <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 bg-neon/60" />
      )}
    </span>
  );
}

function GlitchDecode({ text, trigger }: { text: string; trigger: boolean }) {
  const [phase, setPhase] = useState<"idle" | "scramble" | "done">("idle");
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    setPhase("scramble");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let frame = 0;
    const totalFrames = text.length * 2;
    const iv = setInterval(() => {
      frame++;
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (i < frame / 2) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (frame >= totalFrames) {
        clearInterval(iv);
        setDisplay(text);
        setPhase("done");
      }
    }, 30);
    return () => clearInterval(iv);
  }, [trigger, text]);

  return (
    <h3 className="text-lg font-bold tracking-wide text-frost md:text-xl">
      {display}
    </h3>
  );
}

function DurationArc({ entry, delay }: { entry: WorkExperienceEntry; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const start = parseInt(entry.startYear);
  const end = entry.endYear === "NOW" ? 2026 : parseInt(entry.endYear);
  const total = 2026 - 2019;
  const dur = end - start;
  const pct = Math.min((dur / total) * 100, 100);

  const r = 18;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;

  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="2.5" />
          <motion.circle
            cx="21"
            cy="21"
            r={r}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: off } : {}}
            transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-neon/70">
          {dur}y
        </span>
      </div>
      <span className="font-mono text-[9px] tracking-[0.2em] text-muted/40">
        {entry.startYear} — {entry.endYear}
      </span>
    </div>
  );
}

function HighlightItem({
  text,
  index,
  cardIndex,
}: {
  text: string;
  index: number;
  cardIndex: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.45,
        delay: cardIndex * 0.15 + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex items-start gap-2 text-[12px] leading-relaxed text-muted"
    >
      <ChevronRight size={11} className="mt-1 shrink-0 text-neon/40" />
      <span>{text}</span>
    </motion.li>
  );
}

/* ---------- the main card ---------- */

function RowCard({
  entry,
  index,
}: {
  entry: WorkExperienceEntry;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -8,
      y: ((e.clientX - r.left) / r.width - 0.5) * 8,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const isActive = entry.status === "ACTIVE";
  const offsets = [0, 24, 8];
  const delays = [0, 0.15, 0.3];

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        y: 50 + offsets[index],
        rotateX: 10,
        scale: 0.92,
        filter: "blur(14px)",
      }}
      animate={
        inView
          ? { opacity: 1, y: offsets[index], rotateX: 0, scale: 1, filter: "blur(0px)" }
          : {}
      }
      transition={{
        duration: 0.9,
        delay: delays[index],
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 900, transformStyle: "preserve-3d" }}
      className="relative"
    >
      {/* vertical connector beam from timeline */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 hidden md:block"
        aria-hidden="true"
      >
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={inView ? { height: 48, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: delays[index] + 0.2 }}
          className="w-px bg-gradient-to-b from-neon/50 to-transparent"
        />
      </div>

      <div
        className={`dossier-card dossier-glow dossier-scanlines glass-panel group relative overflow-hidden p-5 transition-all duration-300 ${
          isActive ? "border border-emerald-500/20" : ""
        }`}
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.1s ease-out",
          ...(isActive ? { animation: "breathe-glow 4s ease-in-out infinite" } : {}),
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* top ribbon for active */}
        {isActive && <div className="holo-ribbon" />}

        {/* classified stamp */}
        <span
          className={`absolute top-3 right-4 z-5 font-mono text-[8px] font-bold tracking-[0.2em] px-2 py-0.5 border-2 transform -rotate-6 pointer-events-none ${
            isActive
              ? "border-emerald-400/60 text-emerald-300/80 shadow-[0_0_10px_rgba(52,211,153,0.2)] animate-[neon-flicker_3s_ease-in-out_infinite]"
              : "border-neon/40 text-neon/60 opacity-60"
          }`}
        >
          {isActive ? "ACTIVE" : "CLOSED"}
        </span>

        {/* header row */}
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-neon/60">
          <Cpu size={11} className="text-neon/40" />
          <span>{entry.type}</span>
          <span className="text-muted/25">|</span>
          <span>FILE#{String(index + 1).padStart(2, "0")}</span>
        </div>

        {/* role title with glitch decode */}
        <div className="mt-3">
          <GlitchDecode text={entry.role} trigger={inView} />
        </div>

        {/* company badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 border border-blue-primary/30 bg-blue-primary/[0.07] px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-electric">
          <Radio size={9} className="text-blue-primary/50" />
          {entry.company}
        </div>

        {/* period typing */}
        <div className="mt-2">
          <TypingLine text={entry.period} delay={index * 300 + 600} />
        </div>

        {/* duration arc */}
        <div className="mt-3 border-t border-white/[0.05] pt-3">
          <DurationArc entry={entry} delay={0.4 + index * 0.15} />
        </div>

        {/* highlights */}
        <ul className="mt-3 space-y-1.5">
          {entry.highlights.map((h, hi) => (
            <HighlightItem key={hi} text={h} index={hi} cardIndex={index} />
          ))}
        </ul>

        {/* bottom accent line */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon/15 to-transparent" />
      </div>
    </motion.div>
  );
}

/* ---------- main export ---------- */

export function WorkExperience() {
  return (
    <section
      id="work"
      className="relative overflow-hidden py-28 md:py-36"
      aria-label="Professional experience"
    >
      <MatrixRain />
      <FloatingHex />
      <OrbitRings />

      <div className="pointer-events-none absolute left-[-10%] top-[12%] h-[24rem] w-[24rem] rounded-full border border-white/[0.03]" />
      <div className="pointer-events-none absolute right-[-8%] bottom-[10%] h-[18rem] w-[18rem] rounded-full border border-dashed border-neon/[0.04] animate-spin-slower" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.03"
          code="EXPERIENCE"
          title="FIELD OPERATIONS DOSSIER"
          description="Active and completed professional deployments — a classified record of operational roles, responsibilities and mission-critical contributions across organizations."
          align="center"
        />

        <HorizontalTimeline />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {workExperience.map((entry, i) => (
            <RowCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
