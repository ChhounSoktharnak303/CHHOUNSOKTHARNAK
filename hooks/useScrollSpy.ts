"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: readonly string[], offset = 0.4) {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      {
        rootMargin: `-${Math.round(offset * 100)}% 0px -${Math.round(
          (1 - offset) * 100 - 10
        )}% 0px`,
        threshold: 0,
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return active;
}
