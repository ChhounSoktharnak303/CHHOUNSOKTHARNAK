"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, personalData } from "@/lib/data";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTION_IDS = navLinks.map((l) => l.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-blue-primary via-cyan-primary to-neon"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <header
        className={`fixed inset-x-0 top-0 z-[75] transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.07] bg-void/85 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-[72px] lg:px-10">
          <button
            type="button"
            onClick={() => go("hero")}
            data-cursor="button"
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-neon/50 bg-neon/[0.06] font-mono text-[10px] font-bold text-neon transition-all duration-300 group-hover:bg-neon/15 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.4)]">
              SK
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.3em] text-muted transition-colors group-hover:text-frost sm:block">
              {personalData.shortName}.SYS
            </span>
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  data-cursor="button"
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-3.5 py-2 font-mono text-[10px] tracking-[0.22em] transition-colors duration-300 ${
                    isActive ? "text-neon" : "text-muted hover:text-frost"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-[1px] h-px bg-neon shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor="button"
            className="flex h-9 w-9 items-center justify-center border border-white/[0.12] text-muted transition-colors hover:border-neon/50 hover:text-neon lg:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[74] flex flex-col justify-center bg-deep/97 px-8 backdrop-blur-xl lg:hidden"
          >
            <div className="bg-grid-dense absolute inset-0 opacity-40" />
            <nav aria-label="Mobile" className="relative space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  type="button"
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  onClick={() => go(link.id)}
                  className={`flex w-full items-baseline gap-4 border-b border-white/[0.06] py-4 text-left ${
                    active === link.id ? "text-neon" : "text-frost"
                  }`}
                >
                  <span className="font-mono text-[9px] tracking-[0.3em] text-muted/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-2xl font-bold tracking-wide">
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </nav>
            <div className="relative mt-10 font-mono text-[9px] tracking-[0.35em] text-muted/50">
              ● SYSTEM ONLINE — {personalData.location}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
