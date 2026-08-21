"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { lerp } from "@/lib/utils";
import { ShootingStar } from "./ShootingStar";

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
  grad.addColorStop(0, `rgba(${rgb},0.5)`);
  grad.addColorStop(0.45, `rgba(${rgb},0.16)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeUranusTexture() {
  const w = 512;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bands = [
    { stop: 0, color: "#8fe3df" },
    { stop: 0.14, color: "#a9ece7" },
    { stop: 0.26, color: "#79d6d2" },
    { stop: 0.38, color: "#93e2dc" },
    { stop: 0.5, color: "#6fcac8" },
    { stop: 0.62, color: "#8ce0da" },
    { stop: 0.74, color: "#74cfcd" },
    { stop: 0.88, color: "#9de9e3" },
    { stop: 1, color: "#82d8d4" },
  ];

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  for (const b of bands) grad.addColorStop(b.stop, b.color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let i = 0; i < 90; i++) {
    const y = rand() * h;
    const bh = 1 + rand() * 3;
    ctx.fillStyle = `rgba(255,255,255,${0.03 + rand() * 0.06})`;
    ctx.fillRect(0, y, w, bh);
  }
  for (let i = 0; i < 60; i++) {
    const y = rand() * h;
    const bh = 1 + rand() * 2;
    ctx.fillStyle = `rgba(20,90,95,${0.04 + rand() * 0.07})`;
    ctx.fillRect(0, y, w, bh);
  }
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rand() * 0.05})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1);
  }

  const poleGlow = ctx.createRadialGradient(w / 2, 10, 5, w / 2, 10, 120);
  poleGlow.addColorStop(0, "rgba(220,255,252,0.28)");
  poleGlow.addColorStop(1, "rgba(220,255,252,0)");
  ctx.fillStyle = poleGlow;
  ctx.fillRect(0, 0, w, 140);

  return new THREE.CanvasTexture(canvas);
}

type MoonConfig = {
  radius: number;
  speed: number;
  incline: number;
  phase: number;
  size: number;
  color: string;
};

function Uranus({ mobile = false }: { mobile?: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const moonRefs = useRef<(THREE.Mesh | null)[]>([]);

  const surface = useMemo(() => makeUranusTexture(), []);
  const glow = useMemo(() => makeGlowTexture("125,225,222"), []);

  const moons: MoonConfig[] = useMemo(
    () => [
      { radius: 3.4, speed: 0.32, incline: 1.35, phase: 0.4, size: 0.09, color: "#cbd5e1" },
      { radius: 4.1, speed: 0.22, incline: 1.45, phase: 2.4, size: 0.12, color: "#94a3b8" },
      { radius: 4.9, speed: 0.15, incline: 1.28, phase: 4.6, size: 0.08, color: "#e2e8f0" },
    ],
    []
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (planet.current) planet.current.rotation.y += dt * 0.06;
    if (outer.current) {
      outer.current.position.y =
        (mobile ? -0.4 : 0.15) + Math.sin(t * 0.24) * 0.18;
    }
    moonRefs.current.forEach((m, i) => {
      if (!m) return;
      const cfg = moons[i];
      const a = t * cfg.speed + cfg.phase;
      m.position.set(
        Math.cos(a) * cfg.radius,
        Math.sin(a) * cfg.radius * Math.sin(cfg.incline),
        Math.sin(a) * cfg.radius * Math.cos(cfg.incline)
      );
    });
  });

  return (
    <group
      ref={outer}
      position={[mobile ? 0 : 2.4, 0.15, mobile ? -7 : -4]}
      scale={mobile ? 0.72 : 1}
    >
      <group rotation={[0, 0, Math.PI / 2.04]}>
        <mesh ref={planet}>
          <sphereGeometry args={[2.05, 48, 48]} />
          <meshStandardMaterial
            map={surface}
            roughness={0.92}
            metalness={0.04}
            emissive="#134e4a"
            emissiveIntensity={0.22}
          />
        </mesh>

        {(
          [
            [1.55, 0.012, 0.3],
            [1.78, 0.007, 0.2],
            [2.02, 0.009, 0.26],
            [2.38, 0.016, 0.55],
            [2.58, 0.006, 0.16],
          ] as const
        ).map(([r, tube, opacity], i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, tube, 2, 160]} />
            <meshBasicMaterial
              color={i === 3 ? "#b5f0ee" : "#8fd8dc"}
              transparent
              opacity={opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      <sprite scale={9.5}>
        <spriteMaterial
          map={glow}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {moons.map((cfg, i) => (
        <mesh
          key={i}
          ref={(el) => {
            moonRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[cfg.size, 12, 12]} />
          <meshStandardMaterial color={cfg.color} roughness={0.9} emissive="#334155" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function NebulaLayer() {
  const layers = useMemo(
    () => [
      { rgb: "14,116,144", pos: [-20, 8, -40] as const, scale: 50, rot: 0.3 },
      { rgb: "37,99,235", pos: [24, -6, -46] as const, scale: 56, rot: -0.4 },
      { rgb: "45,212,191", pos: [-4, -12, -52] as const, scale: 44, rot: 0.1 },
    ],
    []
  );

  return (
    <group>
      {layers.map((l, i) => (
        <sprite
          key={i}
          position={[l.pos[0], l.pos[1], l.pos[2]]}
          rotation={[0, 0, l.rot]}
          scale={l.scale}
        >
          <spriteMaterial
            map={makeGlowTexture(l.rgb)}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    const k = Math.min(1, dt * 2);
    camera.position.x = lerp(camera.position.x, pointer.x * 0.5, k);
    camera.position.y = lerp(camera.position.y, pointer.y * 0.3, k);
    camera.lookAt(0.6, 0, -4);
  });
  return null;
}

export default function UranusScene({
  active = true,
  mobile = false,
}: {
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.2 : 1.6]}
      camera={{ position: [0, 0, 7], fov: 52, near: 0.1, far: 200 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#020617", 30, 110]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[-8, 6, 6]} intensity={1.4} color="#e0fffe" />
      <pointLight position={[6, -4, 2]} intensity={10} color="#0ea5e9" distance={30} />

      <Stars
        radius={80}
        depth={45}
        count={mobile ? 1400 : 3800}
        factor={3}
        saturation={0.3}
        fade
        speed={0.4}
      />

      <Sparkles
        count={mobile ? 30 : 70}
        scale={[18, 10, 14]}
        size={2}
        speed={0.2}
        opacity={0.5}
        color="#99f6e4"
      />

      <NebulaLayer />

      {!mobile &&
        Array.from({ length: 2 }, (_, i) => (
          <ShootingStar key={i} index={i + 4} />
        ))}

      <Uranus mobile={mobile} />

      <CameraRig />
    </Canvas>
  );
}
