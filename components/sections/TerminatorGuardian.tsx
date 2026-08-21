"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/utils";

export function TerminatorGuardian() {
  const ref = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotY = useSpring(useTransform(mx, [-1, 1], [10, -10]), {
    stiffness: 105,
    damping: 14,
  });
  const rotX = useSpring(useTransform(my, [-1, 1], [-7, 7]), {
    stiffness: 105,
    damping: 14,
  });

  useEffect(() => {
    let release: ReturnType<typeof setTimeout>;
    const cycle = setInterval(() => {
      setLocked(true);
      release = setTimeout(() => setLocked(false), 1700);
    }, 7000);
    return () => {
      clearInterval(cycle);
      clearTimeout(release);
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(
      Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1))
    );
    my.set(
      Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1))
    );
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor="target"
      animate={{
        boxShadow: locked
          ? "0 0 80px rgba(239,68,68,0.32)"
          : "0 0 0 rgba(0,0,0,0)",
        borderColor: locked
          ? "rgba(239,68,68,0.6)"
          : "rgba(148,163,184,0.14)",
      }}
      transition={{ duration: 0.4 }}
      className="glass-panel relative flex h-full flex-col overflow-hidden rounded-lg border"
      aria-label="Guardian unit terminator endoskeleton"
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.28em] text-muted">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-red-500" />
          SKULL CAM // LIVE FEED
        </span>
        <span className="font-mono text-[9px] tracking-[0.28em] text-red-400/80">
          UNIT : SK-T800
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="bg-grid-dense absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(127,29,29,0.28),transparent_68%)]" />

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center p-4"
          style={{ perspective: 650 }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{
              rotateX: rotX,
              rotateY: rotY,
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={asset("/assets/the-terminator-skeleton-stephen-humphries.jpg")}
              alt="T-800 terminator endoskeleton on live feed"
              width={900}
              height={713}
              priority
              className="absolute inset-0 m-auto h-full max-h-[380px] w-auto max-w-full object-contain"
              style={{
                mixBlendMode: "screen",
                filter:
                  "contrast(1.12) saturate(1.22) drop-shadow(0 18px 42px rgba(0,0,0,0.75))",
              }}
              data-cursor="target"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] top-[8%] bottom-[10%] rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 62%, rgba(239,68,68,0.16) 100%)",
              }}
            />
          </motion.div>
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-12"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(239,68,68,0.26), transparent)",
            animation: "t-scan 3s linear infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-4 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(239,68,68,0.14), transparent)",
            animation: "t-scan 5.2s linear 1.4s infinite",
          }}
        />

        {locked && (
          <>
            {[
              "left-4 top-4 border-l-2 border-t-2",
              "right-4 top-4 border-r-2 border-t-2",
              "left-4 bottom-4 border-l-2 border-b-2",
              "right-4 bottom-4 border-r-2 border-b-2",
            ].map((cls, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 1.25 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className={`pointer-events-none absolute h-7 w-7 border-red-500 ${cls}`}
              />
            ))}
            <motion.span
              initial={{ scaleX: 0, scaleY: 0 }}
              animate={{ scaleX: 1, scaleY: 1 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-red-500/50"
            />
            <motion.span
              initial={{ scaleX: 0, scaleY: 0 }}
              animate={{ scaleX: 1, scaleY: 1 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 bg-red-500/50"
            />
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute inset-x-0 top-5 text-center font-mono text-[10px] font-bold tracking-[0.4em] text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            >
              TARGET ACQUIRED
            </motion.p>
          </>
        )}
      </div>

      <div className="space-y-1.5 border-t border-white/[0.08] px-4 py-3 font-mono text-[9px] tracking-[0.22em]">
        <p className="flex justify-between">
          <span className="text-muted">THREAT LEVEL</span>
          <span className="text-emerald-400">BUGS ONLY</span>
        </p>
        <p className="flex justify-between">
          <span className="text-muted">DIRECTIVE</span>
          <span className="text-neon">ESTABLISH CONNECTION</span>
        </p>
        <p className="flex justify-between">
          <span className="text-muted">OPTICS</span>
          <motion.span
            key={String(locked)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={locked ? "font-bold text-red-400" : "text-amber-300"}
          >
            {locked ? "TARGET LOCKED" : "TRACKING CURSOR"}
          </motion.span>
        </p>
      </div>

      <style>{`@keyframes t-scan { 0% { top: -12%; } 100% { top: 108%; } }`}</style>
    </motion.div>
  );
}
