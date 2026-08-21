"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Send,
  Facebook,
  Instagram,
  MessageCircle,
  Check,
  Copy,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socialLinks } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Typewriter } from "@/components/ui/Typewriter";
import { useClipboard } from "@/hooks/useClipboard";
import { useIsMobile } from "@/hooks/useDevice";
import { Scene3D } from "@/components/3d/Scene3D";

const ApolloGalaxyScene = dynamic(
  () => import("@/components/3d/ApolloGalaxyScene"),
  { ssr: false }
);
import {
  fadeUp,
  staggerParent,
  viewportOnce,
} from "@/components/animations/variants";
import { TerminatorGuardian } from "./TerminatorGuardian";

const TERMINAL_LINES = [
  { text: "> COMMUNICATION SYSTEM", className: "text-neon", pauseAfter: 300 },
  { text: "", className: "" },
  { text: "GUARDIAN    : SK-T800 ONLINE", className: "text-red-400", pauseAfter: 350 },
  { text: "STATUS      : ONLINE", className: "text-frost/90" },
  { text: "LOCATION    : CAMBODIA", className: "text-frost/90" },
  { text: "DEVELOPER   : CHHOUN SOKTHARNAK", className: "text-frost/90", pauseAfter: 400 },
  { text: "", className: "" },
  { text: "AVAILABLE CHANNELS ↓", className: "text-electric", pauseAfter: 500 },
];

function ChannelShell({
  children,
  label,
  index,
}: {
  children: React.ReactNode;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ delay: index * 0.1, duration: 0.55 }}
      className="group relative flex flex-col overflow-hidden border border-white/[0.09] bg-panel/80 p-5 transition-colors duration-400 hover:border-neon/40"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted">
          {label}
        </span>
        <span className="font-mono text-[9px] text-muted/40">
          CH-{String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function TelegramChannel({ handle, href }: { handle: string; href: string }) {
  return (
    <>
      <div className="relative flex h-14 items-center">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sky-400/40 bg-sky-400/[0.08]">
          <span className="absolute inset-0 bg-gradient-to-br from-sky-400/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <Send
            size={17}
            className="text-sky-300 transition-all duration-500 group-hover:-translate-y-5 group-hover:translate-x-6 group-hover:opacity-0"
          />
          <Send
            size={17}
            className="absolute -translate-x-5 translate-y-4 text-sky-300 opacity-0 transition-all delay-100 duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          />
        </span>
        <span className="ml-4 flex min-w-0 flex-col">
          <span className="truncate font-mono text-sm tracking-wider text-frost">
            {handle}
          </span>
          <span className="mt-1 flex items-center gap-1 font-mono text-[8px] tracking-[0.25em] text-sky-300/70">
            TYPING
            <span className="flex items-end gap-[3px]">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1 w-1 rounded-full bg-sky-300"
                  animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                />
              ))}
            </span>
          </span>
        </span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        aria-label={`Message ${handle} on Telegram`}
        className="mt-auto inline-flex w-fit items-center gap-2 border border-sky-400/50 bg-sky-400/10 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-sky-300 transition-all duration-300 hover:bg-sky-400/20 hover:shadow-[0_0_22px_rgba(56,189,248,0.35)]"
      >
        MESSAGE ME <ArrowUpRight size={11} />
      </a>
    </>
  );
}

function FacebookChannel({ handle, href }: { handle: string; href: string }) {
  return (
    <>
      <div className="relative flex h-14 items-center">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-md border border-blue-primary/50 bg-blue-primary/[0.1]">
          <Facebook size={17} className="text-electric transition-transform duration-300 group-hover:scale-110" />
        </span>
        <span className="ml-4 flex flex-col">
          <span className="text-sm font-medium tracking-wide text-frost">{handle}</span>
          <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.25em] text-muted/60">
            SIGNAL
            <span className="flex items-end gap-[2px]">
              {[3, 5, 7, 9].map((h, i) => (
                <motion.span
                  key={h}
                  className="w-[2px] bg-electric/70"
                  animate={{ height: [h - 2, h, h - 2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  style={{ height: h }}
                />
              ))}
            </span>
          </span>
        </span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className="mt-auto inline-flex w-fit items-center gap-2 border border-blue-primary/50 bg-blue-primary/10 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-electric transition-all duration-300 hover:bg-blue-primary/25 hover:shadow-[0_0_22px_rgba(59,130,246,0.35)]"
      >
        VISIT FACEBOOK <ArrowUpRight size={11} />
      </a>
    </>
  );
}

function InstagramChannel({ handle, href }: { handle: string; href: string }) {
  return (
    <>
      <div className="relative flex h-14 items-center">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/[0.12] to-amber-400/[0.08]">
          <span
            aria-hidden="true"
            className="absolute inset-1 rounded-[6px] border border-fuchsia-300/30 transition-transform duration-700 group-hover:rotate-90"
          />
          <Instagram size={16} className="text-fuchsia-300 transition-transform duration-500 group-hover:scale-110" />
        </span>
        <span className="ml-4 font-mono text-sm tracking-wider text-frost">{handle}</span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className="mt-auto inline-flex w-fit items-center gap-2 border border-fuchsia-400/40 bg-fuchsia-400/10 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-fuchsia-200 transition-all duration-300 hover:bg-fuchsia-400/20 hover:shadow-[0_0_22px_rgba(232,121,249,0.3)]"
      >
        VISIT INSTAGRAM <ArrowUpRight size={11} />
      </a>
    </>
  );
}

function WeChatChannel({ handle }: { handle: string }) {
  const { copied, copy } = useClipboard();
  return (
    <>
      <div className="flex h-14 items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-primary/40 bg-cyan-primary/[0.08]">
          <MessageCircle size={17} className="text-neon transition-transform duration-500 group-hover:-translate-y-0.5" />
        </span>
        <span className="ml-4 truncate font-mono text-[13px] tracking-wider text-frost">
          {handle}
        </span>
      </div>
      <button
        type="button"
        onClick={() => copy(handle)}
        data-cursor="button"
        aria-live="polite"
        className={`mt-auto inline-flex w-fit items-center gap-2 border px-4 py-2 font-mono text-[10px] tracking-[0.25em] transition-all duration-300 ${
          copied
            ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.35)]"
            : "border-cyan-primary/50 bg-cyan-primary/10 text-neon hover:bg-cyan-primary/20 hover:shadow-[0_0_22px_rgba(34,211,238,0.35)]"
        }`}
      >
        {copied ? (
          <>
            WECHAT ID COPIED ✓
            <Check size={11} />
          </>
        ) : (
          <>
            COPY WECHAT ID
            <Copy size={11} />
          </>
        )}
      </button>
    </>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile(true);
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

  const channelNodes = [
    <TelegramChannel key="tg" handle="@NAKKKKKKL" href="https://t.me/NAKKKKKKL" />,
    <FacebookChannel key="fb" handle="Chhoun Soktharnak" href="https://www.facebook.com/chhoun.soktharnak/" />,
    <InstagramChannel key="ig" handle="@at_ke_r" href="https://www.instagram.com/at_ke_r" />,
    <WeChatChannel key="wc" handle="wxid_1atj0sg8memv12" />,
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-deep py-28 md:py-36"
      aria-label="Contact communication terminal"
    >
      {isMobile ? (
        <div className="scene-fallback absolute inset-0" />
      ) : (
        <Scene3D
          className="absolute inset-0"
          fallback={<div className="scene-fallback absolute inset-0" />}
          mountOnVisible
        >
          <ApolloGalaxyScene active={sceneActive} mobile={isMobile} />
        </Scene3D>
      )}
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-primary/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          index="SEC.06"
          code="UPLINK"
          title="ESTABLISH CONNECTION"
          align="center"
        />

        <motion.div
          variants={staggerParent(0.16)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <motion.div variants={fadeUp} className="min-h-[420px] lg:min-h-0">
            <TerminatorGuardian />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="overflow-hidden rounded-lg border border-white/[0.12] bg-[#040814]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-[9px] tracking-[0.28em] text-muted">
                  COMMS-TERMINAL v3.1
                </span>
              </div>
              <span className="hidden items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-emerald-400 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                SECURE LINE
              </span>
            </div>

            <Typewriter
              lines={TERMINAL_LINES}
              speed={16}
              startDelay={400}
              showCaret={false}
              className="px-5 pt-5 font-mono text-[11px] leading-relaxed md:text-xs"
            />

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {socialLinks.map((link, i) => (
                <ChannelShell key={link.id} label={link.label} index={i}>
                  {channelNodes[i]}
                </ChannelShell>
              ))}
            </div>

            <div className="border-t border-white/[0.08] px-5 py-3.5 font-mono text-[10px] tracking-[0.3em] text-emerald-400">
              &gt; READY FOR CONNECTION<span className="animate-blink">▊</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
