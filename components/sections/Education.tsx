"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { useRef } from "react";
import { education } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  slideFromLeft,
  slideFromRight,
  viewportOnce,
} from "@/components/animations/variants";

function TimelineParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    offset: ((i * 13) % 9) - 4,
    delay: i * 1.1,
    duration: 3.6 + (i % 3),
    size: i % 2 ? 3 : 2,
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 md:left-1/2">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full bg-neon"
          style={{
            left: p.offset,
            width: p.size,
            height: p.size,
            animation: `rise-particle ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: "0 0 8px rgba(34,211,238,0.9)",
          }}
        />
      ))}
    </div>
  );
}

export function Education() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="education"
      className="relative overflow-hidden py-28 md:py-36"
      aria-label="Education timeline"
    >
      <div className="pointer-events-none absolute right-[-10%] top-[10%] h-[28rem] w-[28rem] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute left-[-12%] bottom-[5%] h-[22rem] w-[22rem] rounded-full border border-white/[0.05]" />
      <div className="pointer-events-none absolute right-[8%] top-[16%] h-[18rem] w-[18rem] rounded-full border border-dashed border-neon/[0.08] animate-spin-slower" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.02"
          code="EDUCATION"
          title="TIMELINE OF DEVELOPMENT"
          description="Three stages of formation — foundation, specialization, and a master's mission still in progress. Rendered as a single continuous signal."
        />

        <div ref={trackRef} className="relative pb-4">
          <div className="absolute inset-y-0 left-4 w-px bg-white/[0.08] md:left-1/2" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute inset-y-0 left-4 w-px origin-top bg-gradient-to-b from-neon via-cyan-primary to-blue-primary shadow-[0_0_14px_rgba(34,211,238,0.7)] md:left-1/2"
          />
          <TimelineParticles />

          <ol className="space-y-20 md:space-y-28">
            {education.map((entry, i) => {
              const leftSide = i % 2 === 0;
              return (
                <li
                  key={`${entry.school}-${entry.startYear}`}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-neon/60 bg-deep shadow-[0_0_18px_rgba(34,211,238,0.45)] md:left-1/2"
                  >
                    <GraduationCap size={15} className="text-neon" />
                  </span>

                  <div className="grid gap-6 pl-12 md:grid-cols-2 md:gap-0 md:pl-0">
                    <motion.div
                      variants={leftSide ? slideFromLeft : slideFromRight}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportOnce}
                      className={
                        leftSide
                          ? "md:col-start-1 md:pr-14 md:text-right"
                          : "md:col-start-2 md:pl-14"
                      }
                    >
                      <article className="glass-panel hud-frame group relative overflow-hidden rounded-lg p-6 transition-transform duration-500 hover:-translate-y-1">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div
                          className={`flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-neon ${
                            leftSide ? "md:justify-end" : ""
                          }`}
                        >
                          <span className="text-lg font-bold leading-none text-frost">
                            {entry.startYear}
                          </span>
                          <span className="text-muted/60">|</span>
                          <span>{entry.period}</span>
                          {entry.ongoing && (
                            <span className="inline-flex items-center gap-1.5 border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-emerald-300">
                              <span className="h-1 w-1 animate-pulse-dot rounded-full bg-emerald-400" />
                              IN PROGRESS
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-bold tracking-wide text-frost md:text-xl">
                          {entry.school}
                        </h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 border border-blue-primary/40 bg-blue-primary/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] text-electric">
                          <Award size={11} />
                          {entry.field.toUpperCase()}
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-muted">
                          {entry.description}
                        </p>
                      </article>
                    </motion.div>
                    <div aria-hidden="true" className="hidden md:block" />
                  </div>

                  <span
                    aria-hidden="true"
                    className={`absolute top-24 hidden h-px w-10 bg-gradient-to-r from-neon/60 to-transparent md:block ${
                      leftSide
                        ? "left-1/2 -translate-x-full"
                        : "left-1/2 bg-gradient-to-l"
                    }`}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
