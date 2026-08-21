"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Star, GitBranch, ArrowRight } from "lucide-react";
import { githubProfile, personalData } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Magnetic } from "@/components/animations/Magnetic";
import { slideFromLeft, slideFromRight, viewportOnce } from "@/components/animations/variants";

export function GitHubPortal() {
  return (
    <section
      id="github"
      className="relative overflow-hidden bg-deep py-28 md:py-36"
      aria-label="Source code portal"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-primary/[0.08] blur-[130px]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.05"
          code="SOURCE"
          title="SOURCE CODE PORTAL"
          align="center"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-80 md:w-80"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full opacity-80 blur-md"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(34,211,238,0.7) 12%, transparent 26%, transparent 50%, rgba(37,99,235,0.8) 64%, transparent 78%)",
                animation: "spin 5s linear infinite",
              }}
            />
            <span className="absolute inset-[3px] rounded-full border border-neon/30 bg-deep" />
            <span
              aria-hidden="true"
              className="absolute inset-[3px] animate-ping rounded-full border border-electric/20 [animation-duration:3s]"
            />

            <a
              href={githubProfile.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              aria-label={`Open GitHub profile ${githubProfile.username}`}
              className="group relative z-10 flex h-44 w-44 flex-col items-center justify-center gap-3 rounded-full border border-white/10 bg-panel/90 transition-colors duration-500 hover:border-neon/60 md:h-52 md:w-52"
            >
              <Github
                size={40}
                strokeWidth={1.4}
                className="text-frost transition-all duration-500 group-hover:scale-110 group-hover:text-neon"
              />
              <span className="font-mono text-[9px] tracking-[0.35em] text-muted transition-colors group-hover:text-neon">
                OPEN PORTAL
              </span>
            </a>

            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute h-2 w-2 rounded-full bg-neon shadow-[0_0_10px_rgba(34,211,238,1)]"
                style={{
                  left: `${50 + 48 * Math.cos((i * 2.1))}%`,
                  top: `${50 + 48 * Math.sin((i * 2.1))}%`,
                  animation: `float ${5 + i}s ease-in-out ${i * 0.8}s infinite`,
                }}
              />
            ))}
          </motion.div>

          <motion.div
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="glass-panel hud-frame relative overflow-hidden rounded-lg p-7"
          >
            <div className="flex items-center gap-5">
              <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-full border border-neon/40 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
                <Image
                  src={githubProfile.avatar}
                  alt={`${personalData.name} — profile photo`}
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />
              </span>
              <div>
                <div className="font-mono text-[9px] tracking-[0.3em] text-muted">
                  GITHUB OPERATOR
                </div>
                <div className="mt-1 text-lg font-bold tracking-wide text-frost">
                  {githubProfile.username}
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                  REPOSITORIES PUBLIC
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="border border-white/[0.08] bg-white/[0.02] p-3.5">
                <Star size={13} className="text-neon" />
                <div className="mt-2 font-mono text-[9px] tracking-[0.22em] text-muted">
                  COMMITS · PULLS · REVIEWS
                </div>
                <div className="mt-1 text-xs tracking-wide text-frost">
                  Continuous activity feed
                </div>
              </div>
              <div className="border border-white/[0.08] bg-white/[0.02] p-3.5">
                <GitBranch size={13} className="text-electric" />
                <div className="mt-2 font-mono text-[9px] tracking-[0.22em] text-muted">
                  BRANCH STRATEGY
                </div>
                <div className="mt-1 text-xs tracking-wide text-frost">
                  Feature-flow workflow
                </div>
              </div>
            </div>

            <Magnetic className="mt-7 w-full" strength={0.2}>
              <a
                href={githubProfile.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden border border-neon/50 bg-neon/[0.07] px-6 py-4 font-mono text-xs tracking-[0.28em] text-neon transition-all duration-400 hover:bg-neon/15 hover:shadow-[0_0_36px_rgba(34,211,238,0.35)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-neon/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                EXPLORE MY CODE
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
