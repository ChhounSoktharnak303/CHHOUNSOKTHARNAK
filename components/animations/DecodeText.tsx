"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\[]{}=+*#%$@";

type DecodeTextProps = {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
};

export function DecodeText({
  text,
  className,
  speed = 28,
  startDelay = 0,
}: DecodeTextProps) {
  const [output, setOutput] = useState(text.replace(/[^\s]/g, " "));
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    const run = () => {
      let frame = 0;
      const totalFrames = text.length + 8;
      interval = setInterval(() => {
        frame += 1;
        const revealed = Math.floor((frame / totalFrames) * text.length * 1.4);
        let next = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " ") {
            next += " ";
          } else if (i < revealed) {
            next += ch;
          } else {
            next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setOutput(next);
        if (frame >= totalFrames) {
          setOutput(text);
          if (interval) clearInterval(interval);
        }
      }, speed);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          timeout = setTimeout(run, startDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={text}>
      {output}
    </span>
  );
}
