"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { personalData } from "@/lib/data";
import { asset } from "@/lib/utils";

export function ProfilePortal() {
  return (
    <motion.div
      className="group relative mx-auto w-[240px] sm:w-[280px] lg:w-[320px] select-none"
      initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="target"
    >
      <div className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16),transparent_65%)] blur-xl" />

      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-[-14%] h-[128%] w-[128%] animate-spin-slower text-neon/50"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="2 4"
        />
        <circle cx="50" cy="2" r="1.4" fill="currentColor" />
        <circle cx="98" cy="50" r="1" fill="currentColor" opacity="0.6" />
      </svg>

      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%] animate-spin-reverse text-electric/40"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="14 10"
        />
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="1"
            x2="50"
            y2="5"
            stroke="currentColor"
            strokeWidth="0.7"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </svg>

      <div className="absolute inset-[-3%] rounded-[28px] bg-gradient-to-br from-neon/60 via-blue-primary/30 to-transparent opacity-70 blur-[2px]" />

      <div className="hud-frame relative aspect-square overflow-hidden rounded-3xl border border-neon/25 bg-panel">
        <Image
          src={asset("/assets/nak.jpg")}
          alt={`${personalData.name} — profile portrait`}
          fill
          priority
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
          className="object-cover object-top contrast-[1.06] saturate-[0.92] transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/20" />
        <div className="scanlines-overlay pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 h-10 animate-scan-y bg-gradient-to-b from-transparent via-neon/25 to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-neon/90">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
          REC ● LIVE
        </div>
        <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] tracking-[0.2em] text-muted">
          ID_01
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-deep via-deep/95 to-transparent p-4 pt-8 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <div className="font-mono text-[9px] tracking-[0.35em] text-neon">
            IDENTITY SCAN
          </div>
          <div className="mt-1 text-sm font-bold tracking-[0.15em] text-frost">
            {personalData.name}
          </div>
          <div className="mt-1 font-mono text-[9px] tracking-[0.25em] text-emerald-400">
            STATUS: ONLINE
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-9 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-neon shadow-[0_0_12px_rgba(34,211,238,1)] md:block">
        <span className="absolute inset-0 animate-ping rounded-full bg-neon/50" />
      </div>
      <div className="pointer-events-none absolute -right-9 top-1/3 hidden h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_10px_rgba(59,130,246,1)] md:block" />

      <div className="mt-6 flex items-center justify-center gap-3 font-mono text-[9px] md:text-[10px] tracking-[0.3em]">
        <span className="text-emerald-400">IDENTITY VERIFIED</span>
        <span className="text-muted/50">//</span>
        <span className="text-muted">SYSTEM ONLINE</span>
      </div>
    </motion.div>
  );
}
