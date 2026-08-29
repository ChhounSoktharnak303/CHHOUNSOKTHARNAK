"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "button" | "scan" | "target" | "link";

const MODE_LABELS: Record<CursorMode, string> = {
  default: "",
  button: "",
  scan: "SCAN",
  target: "LOCK ON",
  link: "",
};

const TRAIL_COLORS = ["#22d3ee", "#3b82f6", "#67e8f9", "#f8fafc"];

type Trail = { id: number; x: number; y: number; color: string; size: number };

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const [trail, setTrail] = useState<Trail[]>([]);
  const trailId = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.06, ease: "power2.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.06, ease: "power2.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.28, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.28, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      if (!document.documentElement.classList.contains("has-custom-cursor")) {
        document.documentElement.classList.add("has-custom-cursor");
      }
      setVisible(true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const now = performance.now();
      if (now - lastSpawn.current > 46) {
        lastSpawn.current = now;
        const id = trailId.current++;
        const t: Trail = {
          id,
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          color: TRAIL_COLORS[id % TRAIL_COLORS.length],
          size: 1.5 + Math.random() * 2.5,
        };
        setTrail((prev) => [...prev.slice(-26), t]);
        setTimeout(() => {
          setTrail((prev) => prev.filter((p) => p.id !== id));
        }, 900);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.("[data-cursor]");
      if (target) {
        setMode((target.getAttribute("data-cursor") as CursorMode) || "default");
        return;
      }
      const interactive = (e.target as HTMLElement).closest?.(
        "a, button, [role='button'], input, textarea"
      );
      setMode(interactive ? "button" : "default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      gsap.killTweensOf([dotRef.current, ringRef.current]);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {trail.map((t) => (
        <span
          key={t.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            left: t.x,
            top: t.y,
            width: t.size,
            height: t.size,
            background: t.color,
            boxShadow: `0 0 10px ${t.color}`,
            opacity: 1,
            animation: "trail-fade 0.9s ease-out forwards",
          }}
        />
      ))}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(34,211,238,0.9)]"
      />
      <div ref={ringRef} className="fixed left-0 top-0">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div
            className={`relative flex items-center justify-center rounded-full border transition-all duration-300 ease-out ${
              mode === "default"
                ? "h-9 w-9 border-white/30 bg-white/[0.03]"
                : mode === "button"
                  ? "h-16 w-16 border-neon/70 bg-neon/10 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                  : mode === "scan"
                    ? "h-14 w-14 border-cyan-primary/80 bg-cyan-primary/5"
                    : mode === "target"
                      ? "h-20 w-20 border-transparent bg-transparent"
                      : "h-12 w-12 border-electric/60 bg-electric/10"
            }`}
          >
            {mode === "target" && (
              <>
                <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-neon" />
                <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-neon" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-neon" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-neon" />
                <span className="absolute h-px w-6 bg-neon/80" />
                <span className="absolute h-6 w-px bg-neon/80" />
                <span className="absolute -bottom-6 font-mono text-[8px] tracking-[0.25em] text-neon">
                  {MODE_LABELS.target}
                </span>
              </>
            )}
            {mode === "scan" && (
              <>
                <span className="absolute inset-x-1 top-1/2 h-px animate-pulse bg-neon" />
                <span className="absolute inset-y-1 left-1/2 w-px animate-pulse bg-neon/60" />
                <span className="absolute -bottom-5 whitespace-nowrap font-mono text-[8px] tracking-[0.25em] text-neon">
                  {MODE_LABELS.scan}
                </span>
              </>
            )}
            {mode === "link" && (
              <span className="font-mono text-sm text-electric">→</span>
            )}
            {mode === "button" && (
              <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-neon/40" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
