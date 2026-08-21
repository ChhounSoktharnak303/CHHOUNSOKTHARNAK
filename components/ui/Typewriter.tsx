"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TypeLine = {
  text: string;
  className?: string;
  pauseAfter?: number;
};

type TypewriterProps = {
  lines: TypeLine[];
  speed?: number;
  startDelay?: number;
  loop?: boolean;
  loopPause?: number;
  className?: string;
  showCaret?: boolean;
};

export function Typewriter({
  lines,
  speed = 20,
  startDelay = 300,
  loop = false,
  loopPause = 4000,
  className,
  showCaret = true,
}: TypewriterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const current = lines[lineIdx];
    if (!current) return;

    let timeout: ReturnType<typeof setTimeout>;
    if (charIdx < current.text.length) {
      timeout = setTimeout(
        () => setCharIdx((c) => c + 1),
        speed + Math.random() * speed
      );
    } else if (lineIdx < lines.length - 1) {
      timeout = setTimeout(
        () => {
          setLineIdx((l) => l + 1);
          setCharIdx(0);
        },
        current.pauseAfter ?? 120
      );
    } else if (loop) {
      timeout = setTimeout(() => {
        setLineIdx(0);
        setCharIdx(0);
        setCycle((c) => c + 1);
      }, loopPause);
    }
    return () => clearTimeout(timeout);
  }, [started, lineIdx, charIdx, lines, speed, loop, loopPause]);

  return (
    <div ref={ref} className={cn("font-mono", className)} aria-live="polite">
      {lines.slice(0, lineIdx).map((l, i) => (
        <div key={`${cycle}-${i}`} className={cn("whitespace-pre-wrap", l.className)}>
          {l.text}
        </div>
      ))}
      {started && lines[lineIdx] && (
        <div className={cn("whitespace-pre-wrap", lines[lineIdx].className)}>
          {lines[lineIdx].text.slice(0, charIdx)}
          {showCaret && (
            <span className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-blink bg-neon" />
          )}
        </div>
      )}
    </div>
  );
}
