"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { asset, lerp } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* textures                                                            */
/* ------------------------------------------------------------------ */

function mulberry(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSkyTexture() {
  const w = 16;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#04060d");
  grad.addColorStop(0.45, "#070d1b");
  grad.addColorStop(0.75, "#0e1729");
  grad.addColorStop(0.92, "#182338");
  grad.addColorStop(1, "#272a3a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(canvas);
}

function makeBeamTexture() {
  const w = 128;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  /* vertical fade — hot at the source, dissolving into the sky */
  const vgrad = ctx.createLinearGradient(0, h, 0, 0);
  vgrad.addColorStop(0, "rgba(255,238,198,0.95)");
  vgrad.addColorStop(0.3, "rgba(255,232,185,0.5)");
  vgrad.addColorStop(0.65, "rgba(255,230,180,0.16)");
  vgrad.addColorStop(1, "rgba(255,230,180,0)");
  ctx.fillStyle = vgrad;
  ctx.fillRect(0, 0, w, h);

  /* soft horizontal falloff so the shaft has no visible edges */
  ctx.globalCompositeOperation = "destination-in";
  const hgrad = ctx.createLinearGradient(0, 0, w, 0);
  hgrad.addColorStop(0, "rgba(0,0,0,0)");
  hgrad.addColorStop(0.22, "rgba(0,0,0,0.55)");
  hgrad.addColorStop(0.5, "rgba(0,0,0,1)");
  hgrad.addColorStop(0.78, "rgba(0,0,0,0.55)");
  hgrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hgrad;
  ctx.fillRect(0, 0, w, h);

  /* grainy gaps — mimics light scattering through humid air */
  ctx.globalCompositeOperation = "destination-out";
  const rand = mulberry(77);
  for (let i = 0; i < 110; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.05 + rand() * 0.2})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 3, 5 + rand() * 30);
  }
  ctx.globalCompositeOperation = "source-over";

  return new THREE.CanvasTexture(canvas);
}

/* loads /assets/batmanlogo.jpg and auto-cuts the background away so
   only the logo itself glows inside the clouds */
function useSignalLogo() {
  const [logo, setLogo] = useState<{
    tex: THREE.CanvasTexture;
    aspect: number;
  } | null>(null);

  useEffect(() => {
    let disposed = false;
    const img = new Image();
    img.src = asset("/assets/batmanlogo.jpg");
    img.onload = () => {
      if (disposed) return;
      const w = 512;
      const h = Math.max(1, Math.round((img.height * w) / img.width));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      const d = data.data;

      /* detect whether the border of the image is dark or light */
      let sum = 0;
      let n = 0;
      for (let x = 0; x < w; x += 4) {
        for (const y of [0, 1, h - 2, h - 1]) {
          const i = (y * w + x) * 4;
          sum += Math.max(d[i], d[i + 1], d[i + 2]);
          n++;
        }
      }
      for (let y = 0; y < h; y += 4) {
        for (const x of [0, 1, w - 2, w - 1]) {
          const i = (y * w + x) * 4;
          sum += Math.max(d[i], d[i + 1], d[i + 2]);
          n++;
        }
      }
      const darkBg = n > 0 && sum / n < 128;

      for (let i = 0; i < d.length; i += 4) {
        const lum = Math.max(d[i], d[i + 1], d[i + 2]) / 255;
        if (darkBg) {
          d[i + 3] = Math.min(255, lum * 420);
        } else {
          d[i + 3] = Math.max(0, Math.min(255, (1 - lum) * 420));
        }
        d[i] = Math.min(255, d[i] * 1.3);
        d[i + 1] = Math.min(255, d[i + 1] * 1.25);
        d[i + 2] = Math.min(255, d[i + 2] * 1.2);
      }
      ctx.putImageData(data, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      setLogo({ tex, aspect: w / h });
    };
    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    return () => logo?.tex.dispose();
  }, [logo]);

  return logo;
}

function makeCloudPuffTexture(seed: number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry(seed);
  for (let i = 0; i < 11; i++) {
    const x = size / 2 + (rand() - 0.5) * size * 0.55;
    const y = size / 2 + (rand() - 0.5) * size * 0.32;
    const r = size * (0.13 + rand() * 0.17);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const lum = 150 + Math.floor(rand() * 55);
    g.addColorStop(0, `rgba(${lum},${lum + 8},${lum + 22},0.5)`);
    g.addColorStop(1, `rgba(${lum},${lum + 8},${lum + 22},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function makeGlowTexture(rgb: string) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, `rgba(${rgb},0.85)`);
  grad.addColorStop(0.3, `rgba(${rgb},0.32)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/* warm halo around the emblem — built from dozens of offset puffs so its
   silhouette is ragged like real light caught in storm clouds, never a
   perfect circle (which reads as a fake glowing ball) */
function makeSignalHaloTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry(404);

  const base = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  base.addColorStop(0, "rgba(255,240,205,0.5)");
  base.addColorStop(0.45, "rgba(255,236,195,0.2)");
  base.addColorStop(1, "rgba(255,232,185,0)");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 28; i++) {
    const a = rand() * Math.PI * 2;
    const d = rand() * size * 0.17;
    const x = size / 2 + Math.cos(a) * d;
    const y = size / 2 + Math.sin(a) * d * 0.72;
    const r = size * (0.09 + rand() * 0.17);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,244,214,${0.1 + rand() * 0.16})`);
    g.addColorStop(1, "rgba(255,240,205,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function makeRainStreakTexture() {
  const w = 16;
  const h = 64;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(175,195,220,0)");
  grad.addColorStop(0.5, "rgba(175,195,220,0.9)");
  grad.addColorStop(1, "rgba(175,195,220,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(w / 2 - 1, 0, 2, h);
  return new THREE.CanvasTexture(canvas);
}

/* ------------------------------------------------------------------ */
/* bat-signal — THE LIGHT SHOW (left side)                             */
/* ------------------------------------------------------------------ */

const _wp = new THREE.Vector3();

/* a light shaft that always faces the camera (cylindrical billboard).
   flat soft-textured planes read far more photographic than solid
   cylinder geometry, which shows hard silhouette edges. */
function BeamBillboard({
  tex,
  width,
  height,
  opacity,
}: {
  tex: THREE.Texture;
  width: number;
  height: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => {
    const m = ref.current;
    if (!m) return;
    m.getWorldPosition(_wp);
    m.rotation.y = Math.atan2(camera.position.x - _wp.x, camera.position.z - _wp.z);
  });
  return (
    <mesh ref={ref} position={[0, height / 2 - 0.4, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function BatSignal({ mobile }: { mobile: boolean }) {
  const beams = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.SpriteMaterial>(null);
  const haloMat = useRef<THREE.SpriteMaterial>(null);

  const beamTex = useMemo(() => makeBeamTexture(), []);
  const logo = useSignalLogo();
  const warmGlow = useMemo(() => makeGlowTexture("255,240,205"), []);
  const haloTex = useMemo(() => makeSignalHaloTexture(), []);
  const puffA = useMemo(() => makeCloudPuffTexture(31), []);
  const puffB = useMemo(() => makeCloudPuffTexture(57), []);

  useEffect(() => {
    return () =>
      [beamTex, warmGlow, haloTex, puffA, puffB].forEach((t) => t.dispose());
  }, [beamTex, warmGlow, haloTex, puffA, puffB]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beams.current) {
      beams.current.rotation.z = Math.sin(t * 0.16) * 0.055;
      beams.current.children.forEach((c, i) => {
        c.rotation.z = Math.sin(t * (0.1 + i * 0.05)) * 0.03;
      });
    }
    if (coreMat.current) {
      coreMat.current.opacity = 0.68 + Math.sin(t * 0.8) * 0.07;
    }
    if (haloMat.current) {
      haloMat.current.opacity = 0.42 + Math.sin(t * 0.62 + 1) * 0.08;
    }
  });

  return (
    <group position={[-6, -2, -24]}>
      {/* base glare where the beam leaves the ground */}
      <sprite position={[0, 0.4, 2]} scale={[9, 2.4, 1]}>
        <spriteMaterial
          ref={haloMat}
          map={warmGlow}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* layered volumetric shafts — soft-edged, camera-facing */}
      <group ref={beams}>
        <BeamBillboard tex={beamTex} width={10} height={20} opacity={0.14} />
        <BeamBillboard tex={beamTex} width={5.6} height={20} opacity={0.22} />
        {!mobile && (
          <BeamBillboard tex={beamTex} width={3} height={19} opacity={0.32} />
        )}
      </group>

      {/* glowing cloud core + user's batman logo */}
      <sprite position={[0, 21, 0]} scale={20}>
        <spriteMaterial
          ref={coreMat}
          map={haloTex}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {logo && (
        <sprite
          position={[0, 21, 0.6]}
          scale={[8.8, 8.8 / logo.aspect, 1]}
        >
          <spriteMaterial
            map={logo.tex}
            transparent
            opacity={0.95}
            depthWrite={false}
            fog={false}
          />
        </sprite>
      )}

      {/* drifting storm clouds around the emblem */}
      {(mobile ? [0, 1, 2] : [0, 1, 2, 3, 4]).map((i) => (
        <DriftingCloud
          key={i}
          index={i}
          tex={i % 2 === 0 ? puffA : puffB}
          baseY={20 + ((i * 37) % 5)}
          baseZ={-2 - i * 1.3}
        />
      ))}

      {/* ragged cloud wisps directly under the emblem, lit warm from below */}
      {(mobile ? [0, 1] : [0, 1, 2]).map((i) => (
        <LitWisp
          key={`wisp-${i}`}
          index={i}
          tex={i % 2 === 0 ? puffA : puffB}
        />
      ))}
    </group>
  );
}

function DriftingCloud({
  index,
  tex,
  baseY,
  baseZ,
}: {
  index: number;
  tex: THREE.Texture;
  baseY: number;
  baseZ: number;
}) {
  const ref = useRef<THREE.Sprite>(null);
  const cfg = useMemo(() => {
    const rand = mulberry(500 + index * 29);
    return {
      x0: (rand() - 0.5) * 34,
      speed: 0.25 + rand() * 0.45,
      scale: 13 + rand() * 10,
      phase: rand() * Math.PI * 2,
    };
  }, [index]);
  const wrapped = useRef(cfg.x0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (!ref.current || !(ref.current.material instanceof THREE.SpriteMaterial))
      return;
    wrapped.current += cfg.speed * dt;
    if (wrapped.current > 26) wrapped.current = -26;
    ref.current.position.x = wrapped.current;
    ref.current.position.y =
      baseY + Math.sin(t * 0.2 + cfg.phase) * 0.7;
    ref.current.material.opacity =
      0.2 + Math.abs(Math.sin(t * 0.13 + cfg.phase)) * 0.1;
  });

  return (
    <sprite ref={ref} position={[cfg.x0, baseY, baseZ]} scale={cfg.scale}>
      <spriteMaterial map={tex} transparent opacity={0.22} depthWrite={false} />
    </sprite>
  );
}

/* small cloud puffs hugging the underside of the emblem. same puff shapes as
   the storm clouds but multiplied warm — reads as cloud matter lit by the
   signal instead of a floating glow ball */
function LitWisp({ index, tex }: { index: number; tex: THREE.Texture }) {
  const ref = useRef<THREE.Sprite>(null);
  const cfg = useMemo(() => {
    const rand = mulberry(800 + index * 13);
    return {
      x: -3 + rand() * 6,
      y: 14.6 + rand() * 3,
      z: 0.8 + rand() * 1.5,
      scale: 7 + rand() * 5,
      phase: rand() * Math.PI * 2,
      speed: 0.35 + rand() * 0.3,
      drift: 0.4 + rand() * 0.8,
      baseO: 0.16 + rand() * 0.12,
    };
  }, [index]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mat = ref.current?.material as THREE.SpriteMaterial | null;
    if (!mat || !ref.current) return;
    ref.current.position.x =
      cfg.x + Math.sin(t * cfg.speed + cfg.phase) * cfg.drift;
    ref.current.position.y =
      cfg.y + Math.sin(t * 0.23 + cfg.phase) * 0.35;
    mat.opacity =
      cfg.baseO + Math.sin(t * 0.9 + cfg.phase) * 0.05;
  });

  return (
    <sprite ref={ref} position={[cfg.x, cfg.y, cfg.z]} scale={cfg.scale}>
      <spriteMaterial
        map={tex}
        color="#ffcf96"
        transparent
        opacity={cfg.baseO}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

/* ------------------------------------------------------------------ */
/* lightning storm — real bolts                                        */
/* ------------------------------------------------------------------ */

type BoltSet = {
  main: THREE.Mesh;
  mainHalo: THREE.Mesh;
  branch1: THREE.Mesh;
  branch1Halo: THREE.Mesh;
  branch2: THREE.Mesh;
  branch2Halo: THREE.Mesh;
};

/* every channel is drawn twice: a hair-thin incandescent core plus a wide
   faint halo — that pairing is what makes real lightning look soft-edged */
function buildBoltGeometries(rand: () => number) {
  /* main channel: jagged path top→bottom */
  const pts: THREE.Vector3[] = [];
  const x0 = -14 + rand() * 28;
  const z0 = -34 - rand() * 8;
  const topY = 17 + rand() * 5;
  const segs = 16;
  let x = x0;
  let z = z0;
  for (let i = 0; i <= segs; i++) {
    const y = topY - (topY + 3) * (i / segs);
    pts.push(new THREE.Vector3(x, y, z));
    x += (rand() - 0.5) * 2.6;
    z += (rand() - 0.5) * 1.2;
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const mainGeo = new THREE.TubeGeometry(curve, 48, 0.05, 5, false);
  const mainHaloGeo = new THREE.TubeGeometry(curve, 48, 0.3, 5, false);

  /* two branches splitting off mid-channel */
  const mkBranch = (startIdx: number, radius: number) => {
    const bpts: THREE.Vector3[] = [];
    const start = pts[startIdx].clone();
    let bx = start.x;
    let by = start.y;
    let bz = start.z;
    const dir = rand() > 0.5 ? 1 : -1;
    const n = 5 + Math.floor(rand() * 3);
    for (let i = 0; i <= n; i++) {
      bpts.push(new THREE.Vector3(bx, by, bz));
      by -= 1.4 + rand();
      bx += dir * (0.8 + rand() * 1.4);
      bz += (rand() - 0.5) * 0.9;
    }
    const bc = new THREE.CatmullRomCurve3(bpts);
    return {
      core: new THREE.TubeGeometry(bc, 20, radius, 4, false),
      halo: new THREE.TubeGeometry(bc, 20, radius * 4.5, 4, false),
    };
  };

  const b1Start = 4 + Math.floor(rand() * 4);
  const b2Start = 8 + Math.floor(rand() * 4);
  const b1 = mkBranch(b1Start, 0.032);
  const b2 = mkBranch(b2Start, 0.026);

  return {
    mainGeo,
    mainHaloGeo,
    b1Geo: b1.core,
    b1HaloGeo: b1.halo,
    b2Geo: b2.core,
    b2HaloGeo: b2.halo,
    impact: pts[segs].clone(),
    origin: pts[0].clone(),
  };
}

function LightningStorm({
  mobile,
  lightRef,
  flashMatRef,
}: {
  mobile: boolean;
  lightRef: React.MutableRefObject<THREE.DirectionalLight | null>;
  flashMatRef: React.MutableRefObject<THREE.SpriteMaterial | null>;
}) {
  const mainRef = useRef<THREE.Mesh>(null);
  const mainHaloRef = useRef<THREE.Mesh>(null);
  const b1Ref = useRef<THREE.Mesh>(null);
  const b1HaloRef = useRef<THREE.Mesh>(null);
  const b2Ref = useRef<THREE.Mesh>(null);
  const b2HaloRef = useRef<THREE.Mesh>(null);
  const impactRef = useRef<THREE.Sprite>(null);
  const originRef = useRef<THREE.Sprite>(null);

  const st = useRef({
    next: 2.2,
    activeT: -1,
    double: false,
    secondAt: 0,
    firedSecond: true,
  });

  const impactTex = useMemo(() => makeGlowTexture("205,222,255"), []);
  useEffect(() => () => impactTex.dispose(), [impactTex]);

  const setBolt = useMemo(() => {
    const rand = mulberry(mobile ? 900 : 901);
    let current: BoltSet | null = null;
    return (
      m: THREE.Mesh | null,
      mh: THREE.Mesh | null,
      b1: THREE.Mesh | null,
      h1: THREE.Mesh | null,
      b2: THREE.Mesh | null,
      h2: THREE.Mesh | null
    ) => {
      if (!m || !mh || !b1 || !h1 || !b2 || !h2) return;
      if (current) {
        current.main.geometry.dispose();
        current.mainHalo.geometry.dispose();
        current.branch1.geometry.dispose();
        current.branch1Halo.geometry.dispose();
        current.branch2.geometry.dispose();
        current.branch2Halo.geometry.dispose();
      }
      const g = buildBoltGeometries(rand);
      m.geometry = g.mainGeo;
      mh.geometry = g.mainHaloGeo;
      b1.geometry = g.b1Geo;
      h1.geometry = g.b1HaloGeo;
      b2.geometry = g.b2Geo;
      h2.geometry = g.b2HaloGeo;
      if (impactRef.current) impactRef.current.position.copy(g.impact);
      if (originRef.current) originRef.current.position.copy(g.origin);
      current = {
        main: m,
        mainHalo: mh,
        branch1: b1,
        branch1Halo: h1,
        branch2: b2,
        branch2Halo: h2,
      };
    };
  }, [mobile]);

  useFrame((state, dt) => {
    const m = st.current;
    const t = state.clock.elapsedTime;

    /* scheduler */
    let I = 0;
    if (m.activeT < 0 && t > m.next) {
      m.activeT = 0;
      m.double = Math.random() < 0.55;
      m.secondAt = 0.35 + Math.random() * 0.25;
      m.firedSecond = !m.double;
      setBolt(
        mainRef.current,
        mainHaloRef.current,
        b1Ref.current,
        b1HaloRef.current,
        b2Ref.current,
        b2HaloRef.current
      );
    }

    let boltVis = 0;
    if (m.activeT >= 0) {
      m.activeT += dt;
      const p = m.activeT / 0.34;
      if (p >= 1) {
        if (!m.firedSecond) {
          m.firedSecond = true;
          m.activeT = 0;
          setBolt(
            mainRef.current,
            mainHaloRef.current,
            b1Ref.current,
            b1HaloRef.current,
            b2Ref.current,
            b2HaloRef.current
          );
        } else {
          m.activeT = -1;
          m.next = t + 2.8 + Math.random() * 4.6;
        }
      } else {
        /* real bolts strobe violently and die fast */
        boltVis = Math.random() > 0.28 ? 1 : 0.12;
        I = Math.max(0, 1 - p) * (Math.random() > 0.22 ? 1 : 0.3);
      }
    }

    const apply = (
      mesh: THREE.Mesh | null,
      coreOpacity: number,
      haloMesh: THREE.Mesh | null,
      haloOpacity: number
    ) => {
      const coreMat = mesh?.material as THREE.MeshBasicMaterial | undefined;
      if (coreMat && mesh) {
        coreMat.opacity = coreOpacity;
        mesh.visible = coreOpacity > 0.02;
      }
      const hMat = haloMesh?.material as THREE.MeshBasicMaterial | undefined;
      if (hMat && haloMesh) {
        hMat.opacity = haloOpacity;
        haloMesh.visible = haloOpacity > 0.02;
      }
    };

    apply(mainRef.current, boltVis, mainHaloRef.current, boltVis * 0.34);
    apply(b1Ref.current, boltVis * 0.85, b1HaloRef.current, boltVis * 0.26);
    apply(b2Ref.current, boltVis * 0.75, b2HaloRef.current, boltVis * 0.22);

    if (impactRef.current && originRef.current) {
      (impactRef.current.material as THREE.SpriteMaterial).opacity =
        boltVis * 0.6;
      (originRef.current.material as THREE.SpriteMaterial).opacity =
        boltVis * 0.42;
      impactRef.current.visible = boltVis > 0.01;
      originRef.current.visible = boltVis > 0.01;
    }
    if (lightRef.current) lightRef.current.intensity = 0.65 + I * 7;
    if (flashMatRef.current) flashMatRef.current.opacity = I * 0.36;
  });

  return (
    <group>
      <mesh ref={mainRef} visible={false}>
        <meshBasicMaterial
          color="#eef5ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={mainHaloRef} visible={false}>
        <meshBasicMaterial
          color="#7fa8e6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={b1Ref} visible={false}>
        <meshBasicMaterial
          color="#dbe8ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={b1HaloRef} visible={false}>
        <meshBasicMaterial
          color="#7fa8e6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={b2Ref} visible={false}>
        <meshBasicMaterial
          color="#dbe8ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={b2HaloRef} visible={false}>
        <meshBasicMaterial
          color="#7fa8e6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <sprite ref={originRef} visible={false} scale={7}>
        <spriteMaterial
          map={impactTex}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </sprite>
      <sprite ref={impactRef} visible={false} scale={4.5}>
        <spriteMaterial
          map={impactTex}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </sprite>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* flying bats                                                         */
/* ------------------------------------------------------------------ */

function Bat({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Mesh>(null);
  const wingR = useRef<THREE.Mesh>(null);

  const cfg = useMemo(() => {
    const rand = mulberry(300 + index * 17);
    return {
      cx: -6 + (rand() - 0.5) * 14,
      cy: 6 + rand() * 8,
      cz: -18 - rand() * 12,
      rx: 3.5 + rand() * 5,
      rz: 1.5 + rand() * 2.5,
      speed: 0.18 + rand() * 0.26,
      offset: rand() * Math.PI * 2,
      flap: 9 + rand() * 4,
      scale: 0.9 + rand() * 0.9,
    };
  }, [index]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = t * cfg.speed + cfg.offset;
    if (group.current) {
      group.current.position.set(
        cfg.cx + Math.cos(a) * cfg.rx,
        cfg.cy + Math.sin(t * 0.9 + cfg.offset) * 0.6,
        cfg.cz + Math.sin(a) * cfg.rz
      );
      group.current.rotation.y = -a;
    }
    const flap = Math.sin(t * cfg.flap + cfg.offset) * 0.65;
    if (wingL.current) wingL.current.rotation.z = flap;
    if (wingR.current) wingR.current.rotation.z = -flap;
  });

  return (
    <group ref={group} scale={cfg.scale}>
      <mesh>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#05070b" />
      </mesh>
      <mesh ref={wingL} position={[0.1, 0.02, 0]}>
        <planeGeometry args={[0.26, 0.12]} />
        <meshBasicMaterial color="#05070b" side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wingR} position={[-0.1, 0.02, 0]}>
        <planeGeometry args={[0.26, 0.12]} />
        <meshBasicMaterial color="#05070b" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* rain                                                                */
/* ------------------------------------------------------------------ */

function Rain({ mobile }: { mobile: boolean }) {
  const count = mobile ? 420 : 1300;
  const tex = useMemo(() => makeRainStreakTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);

  const { positions, speeds } = useMemo(() => {
    const rand = mulberry(mobile ? 21 : 20);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -16 + rand() * 32;
      positions[i * 3 + 1] = rand() * 17;
      positions[i * 3 + 2] = -26 + rand() * 34;
      speeds[i] = 9 + rand() * 7;
    }
    return { positions, speeds };
  }, [count, mobile]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, dt) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= speeds[i] * dt;
      arr[i * 3] -= dt * 1.1;
      if (arr[i * 3 + 1] < -2) {
        arr[i * 3 + 1] += 19;
        arr[i * 3] = -16 + Math.random() * 32;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.13}
        sizeAttenuation
        transparent
        opacity={0.25}
        color="#9fb6cf"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* camera                                                              */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((state, dt) => {
    const k = Math.min(1, dt * 1.6);
    const t = state.clock.elapsedTime;
    camera.position.x = lerp(
      camera.position.x,
      0.6 + pointer.x * 0.6 + Math.sin(t * 0.08) * 0.3,
      k
    );
    camera.position.y = lerp(
      camera.position.y,
      1.7 + pointer.y * 0.4 + Math.sin(t * 0.12) * 0.1,
      k
    );
    camera.lookAt(-2.4, 4.6, -12);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export default function GothamScene({
  active = true,
  mobile = false,
}: {
  active?: boolean;
  mobile?: boolean;
}) {
  const lightningLight = useRef<THREE.DirectionalLight>(null);
  const flashMat = useRef<THREE.SpriteMaterial>(null);

  const skyTex = useMemo(() => makeSkyTexture(), []);
  const moonTex = useMemo(() => makeGlowTexture("215,222,238"), []);
  const flashTex = useMemo(() => makeGlowTexture("185,200,235"), []);
  const mistTex = useMemo(() => makeGlowTexture("120,135,160"), []);

  useEffect(() => {
    return () =>
      [skyTex, moonTex, flashTex, mistTex].forEach((t) => t.dispose());
  }, [skyTex, moonTex, flashTex, mistTex]);

  return (
    <Canvas
      dpr={[1, mobile ? 1.2 : 1.7]}
      camera={{ position: [0.6, 1.7, 9], fov: 55, near: 0.1, far: 260 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#05070f"]} />
      <fog attach="fog" args={["#070b14", 14, 64]} />

      <mesh scale={130}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial map={skyTex} side={THREE.BackSide} fog={false} />
      </mesh>

      <ambientLight intensity={0.35} />
      <directionalLight
        ref={lightningLight}
        position={[-4, 10, -12]}
        intensity={0.85}
        color="#9db8dd"
      />
      {/* warm wash from the signal side */}
      <pointLight position={[-6, 4, -10]} intensity={32} color="#ffd9a8" distance={22} decay={2} />

      <Stars
        radius={100}
        depth={50}
        count={mobile ? 700 : 1800}
        factor={2.6}
        saturation={0.2}
        fade
        speed={0.35}
      />

      {/* moon sits right, balancing the left signal */}
      <sprite position={[10, 12, -36]} scale={9}>
        <spriteMaterial map={moonTex} transparent opacity={0.6} depthWrite={false} fog={false} />
      </sprite>

      {/* whole-sky flash panel */}
      <sprite position={[-2, 12, -52]} scale={90}>
        <spriteMaterial
          ref={flashMat}
          map={flashTex}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </sprite>

      <BatSignal mobile={mobile} />

      {(mobile ? [0, 1, 2] : [0, 1, 2, 3, 4, 5, 6]).map((i) => (
        <Bat key={i} index={i} />
      ))}

      {/* floating embers */}
      <Sparkles
        count={mobile ? 26 : 64}
        scale={[14, 8, 12]}
        position={[-1, 3, -5]}
        size={2}
        speed={0.3}
        opacity={0.35}
        color="#9fb6cf"
      />
      <Sparkles
        count={mobile ? 16 : 40}
        scale={[12, 7, 10]}
        position={[-3, 2, -6]}
        size={2.6}
        speed={0.25}
        opacity={0.32}
        color="#ffd9a8"
      />

      <Rain mobile={mobile} />

      {/* rolling low mist */}
      {[0, 1, 2].map((i) => (
        <GroundMist key={i} index={i} tex={mistTex} />
      ))}

      <LightningStorm mobile={mobile} lightRef={lightningLight} flashMatRef={flashMat} />
      <CameraRig />
    </Canvas>
  );
}

function GroundMist({ index, tex }: { index: number; tex: THREE.Texture }) {
  const ref = useRef<THREE.Sprite>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current || !(ref.current.material instanceof THREE.SpriteMaterial))
      return;
    ref.current.position.x = Math.sin(t * 0.05 + index * 2.2) * 7 + (index - 1) * 4;
    ref.current.material.opacity =
      0.06 + Math.abs(Math.sin(t * 0.11 + index)) * 0.05;
  });
  return (
    <sprite ref={ref} position={[0, 0.4, -4 - index * 4]} scale={[16, 3.4, 1]}>
      <spriteMaterial
        map={tex}
        transparent
        opacity={0.07}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}
