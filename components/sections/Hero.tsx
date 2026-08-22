"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, MapPin, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { personalData } from "@/lib/data";
import { Magnetic, SystemButton } from "@/components/animations/Magnetic";
import { ProfilePortal } from "./ProfilePortal";
import { useIsMobile } from "@/hooks/useDevice";
import { Scene3D } from "@/components/3d/Scene3D";

const GalaxyScene = dynamic(() => import("@/components/3d/GalaxyScene"), {
  ssr: false,
});

const NAME_LINES = ["CHHOUN", "SOKTHARNAK"];

function AssembleName() {
  return (
    <h1
      aria-label={personalData.name}
      className="font-display text-[13vw] font-bold leading-[0.95] tracking-tight text-frost sm:text-6xl md:text-7xl xl:text-[5.2rem]"
    >
      {NAME_LINES.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const [sceneActive, setSceneActive] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { threshold: 0.02 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden"
      aria-label="Introduction"
    >
      <Scene3D
        className="absolute inset-0"
        fallback={<div className="scene-fallback absolute inset-0" />}
      >
        <GalaxyScene active={sceneActive} mobile={isMobile} />
      </Scene3D>
      <div className="vignette pointer-events-none absolute inset-0" />

      <motion.div
        style={{ opacity: contentOpacity, scale: contentScale, y: contentY }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pb-24 pt-28 lg:px-10"
      >
        <div className="grid items-center gap-16 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] md:text-xs tracking-[0.3em]">
              <span className="flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/5 px-3 py-1.5 text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                SYSTEM ONLINE
              </span>
              <span className="flex items-center gap-1.5 border border-white/10 bg-white/[0.03] px-3 py-1.5 text-muted">
                <MapPin size={11} className="text-neon" />
                {personalData.location}
              </span>
            </div>

            <AssembleName />

            <p className="mt-7 font-mono text-sm md:text-lg tracking-[0.32em] text-neon text-glow-cyan">
              {personalData.role}
            </p>

            <p className="mt-3 font-mono text-[11px] md:text-xs tracking-[0.22em] text-muted">
              {personalData.roles.join("  •  ")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <SystemButton onClick={() => scrollTo("about")}>
                  ENTER MY WORLD
                </SystemButton>
              </Magnetic>
              <Magnetic>
                <SystemButton variant="outline" onClick={() => scrollTo("skills")}>
                  EXPLORE TECHNOLOGY
                </SystemButton>
              </Magnetic>
              <Magnetic>
                <SystemButton
                  variant="ghost"
                  href="https://github.com/ChhounSoktharnak303"
                  external
                  ariaLabel="GitHub profile"
                >
                  <Github size={14} />
                  GITHUB
                </SystemButton>
              </Magnetic>
            </div>
          </div>

          <div className="relative">
            <ProfilePortal />
          </div>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => scrollTo("about")}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[9px] tracking-[0.4em] text-muted transition-colors hover:text-neon"
        aria-label="Scroll to about section"
        data-cursor="button"
      >
        SCROLL TO EXPLORE
        <ChevronDown size={16} className="animate-bounce text-neon" />
      </button>
    </section>
  );
}
