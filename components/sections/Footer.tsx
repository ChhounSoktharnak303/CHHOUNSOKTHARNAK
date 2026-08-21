"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUp, Power } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { personalData, navLinks } from "@/lib/data";
import { DecodeText } from "@/components/animations/DecodeText";
import { useIsMobile } from "@/hooks/useDevice";

const MarsScene = dynamic(() => import("@/components/3d/MarsScene"), {
  ssr: false,
});

function TelemetryCorners() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-8 hidden font-mono text-[9px] leading-relaxed tracking-[0.25em] text-muted/50 md:block xl:left-16"
      >
        <p className="flex items-center gap-1.5">
          <span className="h-1 w-1 animate-pulse-dot rounded-full bg-orange-400" />
          MARS OUTPOST // SEC.07
        </p>
        <p className="mt-1">SIGNAL 99.2% · SOL 1520</p>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-6 hidden text-right font-mono text-[9px] leading-relaxed tracking-[0.25em] text-muted/40 md:block xl:right-16"
      >
        <p>APOLLO PROGRAM // ARCHIVE</p>
        <p className="mt-1">18.44°N · 77.36°E · EARTH DIST 0.78 AU</p>
      </div>
    </>
  );
}

export function Footer() {
  const year = 2020;
  const footerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [sceneActive, setSceneActive] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-white/[0.07] bg-void py-20 md:py-24"
    >
      <div className="absolute inset-0">
        <MarsScene active={sceneActive} mobile={isMobile} />
      </div>
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[40rem] -translate-x-1/2 rounded-full bg-orange-500/[0.05] blur-[110px]" />

      <TelemetryCorners />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 font-mono text-[9px] tracking-[0.4em] text-muted/70"
          >
            <Power size={11} className="text-neon/70" />
            SYSTEM SHUTDOWN SEQUENCE
          </motion.div>

          <h2 className="mt-5 font-display text-2xl font-bold tracking-[0.14em] text-frost text-glow-cyan md:text-3xl">
            <DecodeText text={personalData.name} speed={30} />
          </h2>

          <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-neon/90">
            FULL-STACK DEVELOPER · IT SPECIALIST · CAMBODIA
          </p>

          <nav
            aria-label="Footer navigation"
            className="glass-panel mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-lg border border-white/[0.09] px-6 py-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                data-cursor="link"
                className="font-mono text-[10px] tracking-[0.25em] text-muted transition-colors hover:text-neon"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor="button"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3 font-mono text-[10px] tracking-[0.3em] text-muted backdrop-blur-sm transition-all duration-400 hover:border-neon/60 hover:text-neon hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]"
          >
            <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-1" />
            REBOOT SYSTEM
          </button>

          <div className="gradient-line mt-12 w-full max-w-md" />

          <p
            className="mt-6 font-mono text-[9px] leading-relaxed tracking-[0.25em] text-muted/60"
            suppressHydrationWarning
          >
            © {year} {personalData.name} — ALL SYSTEMS NOMINAL
          </p>
        </div>
      </div>
    </footer>
  );
}
