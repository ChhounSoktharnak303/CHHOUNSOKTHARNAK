"use client";

import { useEffect, useState } from "react";

export function useBooted() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const onBooted = () => setBooted(true);
    if (typeof window === "undefined") return;
    try {
      const skipped = sessionStorage.getItem("sk-booted") === "1";
      if (skipped) {
        setBooted(true);
        return;
      }
    } catch {}
    window.addEventListener("sk:booted", onBooted);
    return () => window.removeEventListener("sk:booted", onBooted);
  }, []);

  return booted;
}
