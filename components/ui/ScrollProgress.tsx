"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const [pct, setPct] = useState(0);
  const reduced = useReduced();

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      <span className="font-mono text-[9px] tracking-[0.3em] text-neon/70 [writing-mode:vertical-rl]">
        READOUT
      </span>
      <div className="relative h-40 w-px bg-white/[0.08]">
        <motion.div
          style={{ scaleY: smooth }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-blue-primary via-cyan-primary to-neon shadow-[0_0_10px_rgba(34,211,238,0.7)]"
        />
      </div>
      <span className="min-w-9 text-center font-mono text-[10px] font-bold tabular-nums text-frost">
        {String(pct).padStart(3, "0")}
      </span>
      <span className="font-mono text-[8px] tracking-[0.2em] text-muted/60">%</span>
    </div>
  );
}
