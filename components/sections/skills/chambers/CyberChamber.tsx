"use client";

import { motion } from "framer-motion";
import {
  MonitorSmartphone,
  Router,
  Network,
  Server,
  Database,
  ShieldCheck,
  Biohazard,
  Bug,
  Fish,
  Lock,
  Zap,
  Users,
  Bomb,
  ArrowLeftRight,
  Globe,
  Cpu,
} from "lucide-react";
import { attackVectors, skillCategories } from "@/lib/data";
import { ChamberShell } from "@/components/sections/skills/shared";
import { Typewriter } from "@/components/ui/Typewriter";

const VECTOR_ICONS = [Bug, Fish, Lock, Zap, Users, Bomb, ArrowLeftRight, Database, Globe, Cpu];

const TOPOLOGY = [
  { label: "CLIENT", sub: "192.168.1.10", icon: MonitorSmartphone },
  { label: "ROUTER", sub: "GW 10.0.0.1", icon: Router },
  { label: "SWITCH", sub: "VLAN TRUNK", icon: Network },
  { label: "SERVER", sub: "10.0.1.20", icon: Server },
  { label: "DATABASE", sub: "10.0.2.30", icon: Database },
];

const TERMINAL_LOOP = [
  { text: "root@nexus:~$ ping database01", className: "text-frost", pauseAfter: 350 },
  { text: "64 bytes from 10.0.2.30: icmp_seq=1 ttl=64 time=0.82 ms", className: "text-muted" },
  { text: "64 bytes from 10.0.2.30: icmp_seq=2 ttl=64 time=0.76 ms", className: "text-muted", pauseAfter: 400 },
  { text: "root@nexus:~$ traceroute switch-core", className: "text-frost", pauseAfter: 350 },
  { text: " 1  gateway (10.0.0.1)  0.411 ms", className: "text-muted" },
  { text: " 2  switch-core (10.0.0.2)  0.588 ms", className: "text-muted", pauseAfter: 400 },
  { text: "root@nexus:~$ systemctl status firewall", className: "text-frost", pauseAfter: 350 },
  { text: "● active (running) — UPTIME 99.98%", className: "text-emerald-400", pauseAfter: 400 },
  { text: "root@nexus:~$ threat-db --sync", className: "text-frost", pauseAfter: 350 },
  { text: "✓ 10 attack vectors catalogued — signature match 100%", className: "text-red-400", pauseAfter: 900 },
];

export function CyberChamber() {
  const category = skillCategories[5];
  const osItems = category.items.slice(0, 2);
  const netItems = category.items.slice(2);

  return (
    <ChamberShell
      code={category.code}
      title="CYBERSECURITY & NETWORKING"
      blurb="// PACKET-FLOW TOPOLOGY — GNS3 STYLE LAB"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-panel hud-frame scanlines-overlay relative overflow-hidden rounded-lg p-6"
        >
          <div className="bg-grid-dense absolute inset-0 opacity-60" />
          <div className="relative mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-neon">
              <ShieldCheck size={13} />
              TOPOLOGY // LAB-01
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-400">
              ● LINK UP
            </span>
          </div>

          <div className="relative mx-auto flex max-w-sm flex-col">
            {TOPOLOGY.map((node, i) => (
              <div key={node.label}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.45 }}
                  data-cursor="scan"
                  className="group relative flex items-center gap-4 border border-white/[0.1] bg-deep/90 px-4 py-3 transition-all duration-300 hover:border-neon/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-cyan-primary/40 bg-cyan-primary/[0.07] text-neon">
                    <node.icon size={15} />
                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                  </span>
                  <div className="flex-1">
                    <div className="font-mono text-xs font-bold tracking-[0.26em] text-frost">
                      {node.label}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.16em] text-muted/70">
                      {node.sub}
                    </div>
                  </div>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-muted/40 transition-colors group-hover:text-neon">
                    NODE-{String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>

                {i < TOPOLOGY.length - 1 && (
                  <div className="relative mx-auto h-8 w-px bg-gradient-to-b from-cyan-primary/60 to-electric/50">
                    {[0, 1].map((p) => (
                      <motion.span
                        key={p}
                        className={`absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                          p === 0 ? "bg-neon" : "bg-electric"
                        }`}
                        style={{
                          boxShadow:
                            p === 0
                              ? "0 0 8px rgba(34,211,238,1)"
                              : "0 0 8px rgba(59,130,246,1)",
                        }}
                        animate={{ top: p === 0 ? ["-10%", "100%"] : ["100%", "-10%"] }}
                        transition={{
                          duration: 1.3,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.35 + p * 0.65,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-lg border border-white/[0.12] bg-[#050a14]"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-[9px] tracking-[0.25em] text-muted">
                nexus@ops: ~/network-lab
              </span>
            </div>
            <Typewriter
              lines={TERMINAL_LOOP}
              speed={13}
              loop
              loopPause={2600}
              startDelay={600}
              className="h-[188px] space-y-1.5 overflow-hidden p-4 text-[10.5px] leading-relaxed md:text-xs"
            />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="mb-3 font-mono text-[9px] tracking-[0.3em] text-neon">
                OPERATING SYSTEMS
              </div>
              <ul className="space-y-2.5">
                {osItems.map((item) => (
                  <li key={item.name}>
                    <div className="flex justify-between text-xs text-frost/90">
                      <span>{item.name}</span>
                      <span className="font-mono text-[9px] text-muted">{item.level}%</span>
                    </div>
                    <div className="mt-1 h-0.5 overflow-hidden rounded bg-white/[0.06]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-neon"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.25 }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="mb-3 font-mono text-[9px] tracking-[0.3em] text-electric">
                NETWORKING
              </div>
              <div className="flex flex-wrap gap-1.5">
                {netItems.map((item, i) => (
                  <motion.span
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    data-cursor="scan"
                    className="border border-white/[0.1] bg-deep px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-muted transition-colors hover:border-electric/50 hover:text-frost"
                  >
                    {item.name.toUpperCase()}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="scanlines-overlay relative mt-6 overflow-hidden rounded-lg border border-red-500/25 bg-gradient-to-b from-red-950/[0.16] to-transparent p-6"
      >
        <div className="bg-grid-dense absolute inset-0 opacity-40" />
        <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-red-400">
            <Biohazard size={14} />
            THREAT DATABASE // ATTACK VECTORS
          </span>
          <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-muted">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-red-500" />
            10 SIGNATURES · KNOW YOUR ENEMY
          </span>
        </div>

        <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {attackVectors.map((vector, i) => {
            const Icon = VECTOR_ICONS[i % VECTOR_ICONS.length];
            return (
              <motion.div
                key={vector.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.45 }}
                data-cursor="scan"
                className="group relative overflow-hidden border border-white/[0.09] bg-deep/85 p-3.5 transition-all duration-300 hover:border-red-500/60 hover:shadow-[0_0_26px_rgba(239,68,68,0.18)]"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="flex h-8 w-8 items-center justify-center border border-red-500/35 bg-red-500/[0.08] text-red-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={14} />
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-muted/50">
                    {vector.id}
                  </span>
                </div>
                <div className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-frost">
                  {vector.name}
                </div>
                <div className="mt-0.5 font-mono text-[8px] tracking-[0.18em] text-muted/70">
                  {vector.meta}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-0.5 flex-1 overflow-hidden rounded bg-white/[0.07]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${vector.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.05 }}
                    />
                  </div>
                  <span className="font-mono text-[8px] tabular-nums text-red-400/90">
                    {vector.level}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="relative mt-4 text-right font-mono text-[8px] tracking-[0.3em] text-muted/50">
          DEFENSE STARTS WITH UNDERSTANDING THE OFFENSE
        </p>
      </motion.div>
    </ChamberShell>
  );
}
