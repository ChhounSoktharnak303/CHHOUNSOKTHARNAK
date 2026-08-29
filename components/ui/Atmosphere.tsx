"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: (i * 7.31) % 100,
        top: (i * 13.7) % 100,
        size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
        dur: 14 + (i % 9) * 2.4,
        delay: -(i % 12) * 1.7,
        drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 6),
        opacity: 0.25 + (i % 4) * 0.1,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan-primary/80"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: "0 0 8px rgba(34,211,238,0.7)",
            animation: `aurora-drift ${p.dur}s ease-in-out ${p.delay}s infinite`,
            ["--drift-x" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-1/4 top-[-10%] h-[60vh] w-[70vw] opacity-30 blur-[110px]"
        style={{
          background:
            "radial-gradient(60% 60% at 40% 40%, rgba(37,99,235,0.55), transparent 70%)",
          animation: "aurora-sway 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-15%] top-[25%] h-[55vh] w-[60vw] opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(60% 60% at 60% 40%, rgba(34,211,238,0.5), transparent 70%)",
          animation: "aurora-sway 24s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[10%] h-[50vh] w-[60vw] opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(79,70,229,0.5), transparent 70%)",
          animation: "aurora-sway 30s ease-in-out 4s infinite",
        }}
      />
    </div>
  );
}

export function Atmosphere() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tick = () => {
      if (ref.current) {
        ref.current.style.setProperty("--px", mx.toFixed(3));
        ref.current.style.setProperty("--py", my.toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ transform: "translate3d(var(--px,0), var(--py,0), 0)" }}
    >
      <Aurora />
      <ParticleField />
    </div>
  );
}
