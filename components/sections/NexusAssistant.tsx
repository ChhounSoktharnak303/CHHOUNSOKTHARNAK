"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/data";

const GREETING =
  "NEXUS online. Select a destination and I will navigate you there.";

export function NexusAssistant() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navigate = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close NEXUS assistant" : "Open NEXUS assistant"}
        data-cursor="button"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.4, duration: 0.5, ease: "backOut" }}
        className="group fixed bottom-6 right-6 z-[78] flex h-14 w-14 items-center justify-center rounded-full border border-neon/50 bg-deep shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-shadow duration-300 hover:shadow-[0_0_44px_rgba(34,211,238,0.55)]"
      >
        <span className="absolute inset-0 animate-ping rounded-full border border-neon/25 [animation-duration:3s]" />
        {open ? (
          <X size={20} className="text-neon" />
        ) : (
          <Bot size={22} className="text-neon transition-transform duration-300 group-hover:-translate-y-0.5" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="NEXUS navigation assistant"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel hud-frame fixed bottom-24 right-6 z-[78] w-[min(320px,calc(100vw-3rem))] overflow-hidden rounded-lg"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
              <Terminal size={13} className="text-neon" />
              <span className="font-mono text-[10px] tracking-[0.35em] text-frost">
                NEXUS
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[8px] tracking-[0.25em] text-emerald-400">
                <span className="h-1 w-1 animate-pulse-dot rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>

            <div className="border-b border-white/[0.06] px-4 py-3 font-mono text-[10px] leading-relaxed text-muted">
              <span className="text-neon">&gt;</span> {GREETING}
            </div>

            <div className="grid grid-cols-2 gap-2 p-3">
              {navLinks
                .filter((l) => l.id !== "hero")
                .map((link, i) => (
                  <motion.button
                    key={link.id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    onClick={() => navigate(link.id)}
                    data-cursor="button"
                    className="flex items-center gap-2 border border-white/[0.09] bg-white/[0.02] px-3 py-2.5 font-mono text-[9px] tracking-[0.2em] text-muted transition-all duration-300 hover:border-neon/50 hover:bg-neon/[0.07] hover:text-neon"
                  >
                    <span className="text-neon/60">▸</span>
                    {link.label}
                  </motion.button>
                ))}
            </div>

            <div className="border-t border-white/[0.06] px-4 py-2.5 font-mono text-[8px] tracking-[0.28em] text-muted/50">
              NAVIGATION PROTOCOL · FRONTEND UNIT
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
