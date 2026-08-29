"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
  cursor?: string;
};

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glowColor = "rgba(34,211,238,0.14)",
  cursor = "button",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-maxTilt * 1.3, maxTilt * 1.3]), {
    stiffness: 220,
    damping: 20,
  });
  const gx = useTransform(mx, (v) => Math.round(v * 100));
  const gy = useTransform(my, (v) => Math.round(v * 100));
  const glow = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, ${glowColor}, transparent 60%)`;

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className="h-full perspective-800">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        data-cursor={cursor}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative h-full"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <div className={cn("group relative h-full", className)}>{children}</div>
      </motion.div>
    </div>
  );
}
