"use client";

import { useEffect, useState } from "react";

function matches(query: string) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string, defaultValue = false) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setState(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return state;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTouch() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}
