"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerParent, viewportOnce } from "./variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "span" | "li" | "article";
};

export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
}: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Comp>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
  custom,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  custom?: number;
}) {
  return (
    <motion.div className={className} variants={variants} custom={custom}>
      {children}
    </motion.div>
  );
}
