"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 14, mass: 0.4 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      mx.set(relX * strength);
      my.set(relY * strength);
    },
    [mx, my, strength]
  );

  const reset = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

type BurstParticle = { id: number; angle: number };

type SystemButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

export function SystemButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  external,
  ariaLabel,
}: SystemButtonProps) {
  const [bursts, setBursts] = useState<BurstParticle[]>([]);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const idRef = useRef(0);

  const spawnBurst = useCallback(() => {
    const particles: BurstParticle[] = Array.from({ length: 10 }, (_, i) => ({
      id: idRef.current++,
      angle: (i / 10) * Math.PI * 2 + Math.random() * 0.5,
    }));
    setBursts(particles);
    setTimeout(() => setBursts([]), 700);
  }, []);

  const spawnRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = idRef.current++;
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
  }, []);

  const base =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden px-7 py-3.5 font-mono text-[11px] md:text-xs tracking-[0.22em] uppercase transition-colors duration-300 select-none";
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-primary to-cyan-primary text-white shadow-[0_0_28px_rgba(34,211,238,0.35)] hover:shadow-[0_0_44px_rgba(34,211,238,0.6)]",
    outline:
      "border border-neon/40 text-neon bg-neon/5 hover:bg-neon/15 hover:border-neon/80",
    ghost: "border border-white/15 text-muted hover:text-frost hover:border-white/40",
  };

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <AnimatePresence>
        {bursts.map((p) => (
          <motion.span
            key={p.id}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-1 w-1 rounded-full bg-neon"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(p.angle) * 52,
              y: Math.sin(p.angle) * 34,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute z-0 rounded-full bg-white/25"
          style={{ left: r.x, top: r.y }}
          initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 0.6 }}
          animate={{ width: 320, height: 320, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}
    </>
  );

  const sharedProps = {
    className: cn(base, variants[variant], className),
    "data-cursor": "button",
    onMouseEnter: spawnBurst,
    onClick: spawnRipple,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a
        href={href}
        {...sharedProps}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" {...sharedProps} onClick={(e) => { spawnRipple(e); onClick?.(); }}>
      {inner}
    </button>
  );
}
