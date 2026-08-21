"use client";

import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* WebGL detection runs once per session; result is cached module-level.
   three.js r175+ requires WebGL2, which many phone browsers lack —
   without this guard the Canvas throws and kills the whole page. */
let webglSupported: boolean | null = null;

function detectWebGL(): boolean {
  if (webglSupported !== null) return webglSupported;
  try {
    if (typeof window === "undefined" || !window.WebGLRenderingContext) {
      webglSupported = false;
      return webglSupported;
    }
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    webglSupported = !!gl;
    if (gl) {
      (gl as WebGLRenderingContext)
        .getExtension("WEBGL_lose_context")
        ?.loseContext();
    }
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

type BoundaryProps = { children: ReactNode; fallback?: ReactNode };
type BoundaryState = { failed: boolean };

/* Keeps a crashing 3D scene from unmounting the rest of the app. */
class SceneErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    /* scene failure is non-fatal — page continues without it */
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export function Scene3D({
  children,
  fallback,
  className,
  mountOnVisible = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  mountOnVisible?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [shouldMount, setShouldMount] = useState(!mountOnVisible);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  /* Below-fold scenes only create their WebGL context when scrolled near,
     so phones never hold five live contexts at once. */
  useEffect(() => {
    if (!mountOnVisible || shouldMount || !ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          obs.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [mountOnVisible, shouldMount]);

  if (supported === false) {
    return (
      <div className={className} aria-hidden="true">
        {fallback ?? null}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <SceneErrorBoundary fallback={fallback}>
        {supported === null || !shouldMount ? fallback ?? null : children}
      </SceneErrorBoundary>
    </div>
  );
}
