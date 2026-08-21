"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { bootLines, personalData } from "@/lib/data";

type BootPhase = "idle" | "sequence" | "online" | "done";

const SEQUENCE_MS = 800;

export function BootScreen() {
  const [phase, setPhase] = useState<BootPhase>("sequence");
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase("done");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    try {
      sessionStorage.setItem("sk-booted", "1");
    } catch {}
    window.dispatchEvent(new Event("sk:booted"));
  }, []);

  useEffect(() => {
    let skip = false;
    try {
      skip = sessionStorage.getItem("sk-booted") === "1";
    } catch {}

    if (
      skip ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPhase("done");
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    const lineStep = 110;
    bootLines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), 200 + i * lineStep)
      );
    });

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SEQUENCE_MS);
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase("online");
    };
    raf = requestAnimationFrame(tick);

    const onKey = () => finish();
    window.addEventListener("keydown", onKey);

    const safety = setTimeout(finish, 2500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(safety);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [finish]);

  useEffect(() => {
    if (phase !== "online") return;
    const t = setTimeout(finish, 400);
    return () => clearTimeout(t);
  }, [phase, finish]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-deep"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          role="status"
          aria-label="System booting"
        >
          <div className="bg-grid-dense absolute inset-0 opacity-40" />
          <div className="scanlines-overlay absolute inset-0" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/10 blur-[90px]" />

          <motion.div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon shadow-[0_0_30px_rgba(34,211,238,1)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 3.5, 1], opacity: [0, 1, 0.85] }}
            transition={{ duration: 0.9, times: [0, 0.4, 1] }}
          />

          <div className="relative w-[min(420px,86vw)] font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-6 flex items-center justify-between text-[10px] tracking-[0.3em] text-neon/70"
            >
              <span>INITIALIZING SYSTEM...</span>
              <span className="animate-blink text-frost">▮</span>
            </motion.div>

            <div className="mb-6 space-y-1.5 text-[10px] md:text-xs tracking-[0.18em] text-muted">
              {bootLines.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  animate={
                    i < visibleLines
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -12 }
                  }
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-neon">›</span>
                  {line}
                  {i < visibleLines - 1 && (
                    <span className="ml-auto text-emerald-400">OK</span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mb-2 h-3 w-full border border-white/15 p-[2px]">
              <div
                className="h-full bg-gradient-to-r from-blue-primary via-cyan-primary to-neon shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mb-8 flex justify-between text-[10px] tracking-[0.25em] text-muted">
              <span>CORE SYSTEMS</span>
              <span className="text-neon">{progress}%</span>
            </div>

            <AnimatePresence>
              {phase === "online" && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="mb-3 flex items-center justify-center gap-2 text-[10px] tracking-[0.4em] text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                    SYSTEM ONLINE
                  </div>
                  <div className="text-[10px] tracking-[0.5em] text-muted">
                    WELCOME
                  </div>
                  <div className="mt-2 text-lg md:text-xl font-bold tracking-[0.28em] text-frost text-glow-cyan">
                    {personalData.name}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.35em] text-muted/50">
            CLICK OR PRESS ANY KEY TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
