"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { Crosshair, ExternalLink, Lock, Satellite } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { viewportOnce, fadeUp, staggerParent } from "@/components/animations/variants";
import { useIsMobile } from "@/hooks/useDevice";

const UranusScene = dynamic(() => import("@/components/3d/UranusScene"), {
  ssr: false,
});

function statusTone(status: string) {
  if (status === "COMPLETED") return "text-emerald-400 border-emerald-400/40 bg-emerald-400/10";
  if (status === "IN DEVELOPMENT")
    return "text-amber-300 border-amber-300/40 bg-amber-300/10";
  return "text-muted border-white/15 bg-white/[0.04]";
}

function RadarSweep() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-6 top-28 hidden h-44 w-44 lg:block xl:right-16"
    >
      <div className="absolute inset-0 rounded-full border border-neon/20" />
      <div className="absolute inset-[14%] rounded-full border border-neon/10" />
      <div className="absolute inset-[30%] rounded-full border border-neon/10" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neon/10" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-neon/10" />

      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(34,211,238,0.4), transparent 70deg)",
          animation: "spin 4.5s linear infinite",
        }}
      />

      {[
        { left: "26%", top: "34%", delay: "0s" },
        { left: "68%", top: "58%", delay: "1.4s" },
      ].map((b, i) => (
        <span key={i} className="absolute" style={{ left: b.left, top: b.top }}>
          <span
            className="block h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(34,211,238,1)]"
            style={{ animation: `pulse-dot 3s ease-in-out ${b.delay} infinite` }}
          />
        </span>
      ))}

      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.35em] text-neon/60">
        DEEP SCAN
      </span>
    </div>
  );
}

function TelemetryReadouts() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-24 hidden font-mono text-[9px] leading-relaxed tracking-[0.25em] text-muted/60 md:block xl:left-16"
      >
        <p>DEEP SPACE NETWORK // LINK 07</p>
        <p className="mt-1 text-neon/70">OBJ : URANUS · VII</p>
        <p>RING SYSTEM : VERTICAL / 98° TILT</p>
        <p className="flex items-center gap-1.5 pt-1">
          <span className="h-1 w-1 animate-pulse-dot rounded-full bg-emerald-400" />
          TRACKING LOCK ACQUIRED
        </p>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-6 hidden font-mono text-[9px] leading-relaxed tracking-[0.25em] text-muted/40 md:block xl:left-16"
      >
        <p>DIST 2.871B KM</p>
        <p>SIG 98.7% · LAT 24.6N</p>
      </div>
    </>
  );
}

function OrbitDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-teal-400/[0.07] animate-spin-slower" />
      <div className="absolute left-1/2 top-1/2 h-[62rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      <div className="absolute left-1/2 top-1/2 h-[52rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-teal-400/[0.06]" />
    </div>
  );
}

function MissionCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const gx = useTransform(mx, (v) => Math.round(v * 100));
  const gy = useTransform(my, (v) => Math.round(v * 100));
  const glow = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(45,212,191,0.1), transparent 55%)`;

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
    <motion.div variants={fadeUp} custom={index} className="perspective-800">
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        data-cursor="scan"
        className="group relative h-full overflow-hidden rounded-lg border border-white/[0.09] bg-deep/75 p-6 backdrop-blur-md transition-shadow duration-500 hover:border-teal-400/50 hover:shadow-[0_24px_70px_rgba(19,78,74,0.35)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/70 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative flex items-start justify-between">
          <span className="font-mono text-[10px] tracking-[0.35em] text-teal-300">
            {project.code}
          </span>
          <Crosshair
            size={14}
            className="text-muted/40 transition-all duration-500 group-hover:rotate-90 group-hover:text-teal-300"
          />
        </div>

        <h3 className="relative mt-5 min-h-[3.4rem] text-lg font-bold leading-snug tracking-wide text-frost">
          {project.title}
        </h3>

        <div className="relative mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`border px-2.5 py-1 font-mono text-[9px] tracking-[0.22em] ${statusTone(project.status)}`}
          >
            STATUS: {project.status}
          </span>
        </div>

        <p className="relative mt-4 min-h-[3.6rem] text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="border border-teal-400/30 bg-teal-400/[0.06] px-2 py-1 font-mono text-[9px] tracking-[0.18em] text-teal-200"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="relative mt-6 border-t border-white/[0.07] pt-4">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-teal-300 transition-colors hover:text-frost"
            >
              [VIEW PROJECT] <ExternalLink size={11} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-muted/50">
              <Lock size={11} /> AWAITING CLEARANCE
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [sceneActive, setSceneActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden py-28 md:py-36"
      aria-label="Mission control projects"
    >
      <div className="absolute inset-0 bg-void">
        <UranusScene active={sceneActive} mobile={isMobile} />
      </div>
      <div className="vignette pointer-events-none absolute inset-0" />

      <OrbitDecorations />
      <RadarSweep />
      <TelemetryReadouts />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.04"
          code="MISSIONS"
          title="MISSION CONTROL"
          description="Operations monitored from the outer system — tracked live against the ringed giant. New deployments transmit as they clear."
        />

        <motion.div
          variants={staggerParent(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {[
            { label: "MISSIONS DEPLOYED", value: 6, suffix: "", tone: "text-frost" },
            { label: "MOONS IN ORBIT", value: 28, suffix: "", tone: "text-frost" },
            { label: "UPLINK STABILITY", value: 99, suffix: ".98%", tone: "text-teal-300" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="glass-panel flex items-center justify-between border border-white/[0.08] px-5 py-4"
            >
              <span className="font-mono text-[9px] tracking-[0.28em] text-muted">
                {stat.label}
              </span>
              <Counter
                to={stat.value}
                suffix={stat.suffix}
                className={`text-xl font-bold tabular-nums ${stat.tone}`}
              />
            </motion.div>
          ))}
        </motion.div>

        <svg
          aria-hidden="true"
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
          className="mb-12 h-8 w-full text-teal-400/40"
        >
          <path
            d="M0 20 H240 L260 6 H540 L560 20 H800"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 8"
            className="animate-dash-flow"
          />
          <circle cx="240" cy="20" r="2.5" fill="currentColor" />
          <circle cx="560" cy="20" r="2.5" fill="currentColor" />
        </svg>

        <motion.div
          variants={staggerParent(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p, i) => (
            <MissionCard key={p.id} project={p} index={i} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-2 text-center font-mono text-[9px] tracking-[0.35em] text-muted/50"
        >
          <Satellite size={11} className="text-teal-400/60" />
          MISSION LOG SYNCED WITH GITHUB REPOSITORY FEED
        </motion.p>
      </div>
    </section>
  );
}
