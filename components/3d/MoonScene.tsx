"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { lerp } from "@/lib/utils";

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

function makeMoonTexture() {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#8b8f96";
  ctx.fillRect(0, 0, w, h);

  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let i = 0; i < 26; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const rw = 40 + rand() * 130;
    const rh = rw * (0.5 + rand() * 0.4);
    ctx.fillStyle = `rgba(90,95,104,${0.25 + rand() * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 90; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 3 + rand() * 26;
    ctx.fillStyle = `rgba(62,67,74,${0.35 + rand() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(210,214,220,${0.28 + rand() * 0.22})`;
    ctx.lineWidth = 1 + r * 0.08;
    ctx.beginPath();
    ctx.arc(x - r * 0.12, y - r * 0.12, r, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    if (r > 14) {
      ctx.fillStyle = `rgba(140,145,152,${0.4})`;
      ctx.beginPath();
      ctx.arc(x + r * 0.15, y + r * 0.15, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(${rand() > 0.5 ? "230,233,238" : "70,75,82"},${rand() * 0.16})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2);
  }

  return new THREE.CanvasTexture(canvas);
}

function makeEarthTexture() {
  const w = 512;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const ocean = ctx.createLinearGradient(0, 0, 0, h);
  ocean.addColorStop(0, "#1d4ed8");
  ocean.addColorStop(0.5, "#2563eb");
  ocean.addColorStop(1, "#1e40af");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, w, h);

  let seed = 21;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const blob = (cx: number, cy: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 10) {
      const rr = r * (0.65 + rand() * 0.55);
      const px = cx + Math.cos(a) * rr * 1.5;
      const py = cy + Math.sin(a) * rr;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  blob(120, 90, 34, "#2d6a2f");
  blob(170, 130, 24, "#39702f");
  blob(330, 80, 30, "#2d6a2f");
  blob(380, 150, 38, "#356b2c");
  blob(430, 100, 20, "#2d6a2f");
  blob(60, 180, 22, "#3a6e33");

  ctx.fillStyle = "rgba(240,246,250,0.92)";
  ctx.fillRect(0, 0, w, 16);
  ctx.fillRect(0, h - 16, w, 16);

  for (let i = 0; i < 60; i++) {
    const x = rand() * w;
    const y = 20 + rand() * (h - 40);
    ctx.fillStyle = `rgba(255,255,255,${0.14 + rand() * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 18 + rand() * 46, 3 + rand() * 6, rand() * 0.6 - 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function Moon({ mobile = false }: { mobile?: boolean }) {
  const surface = useMemo(() => makeMoonTexture(), []);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.004;
  });

  return (
    <mesh
      ref={ref}
      position={mobile ? [0, -20, -13] : [7.5, -17.5, -13]}
      scale={mobile ? 0.78 : 1}
    >
      <sphereGeometry args={[14, 64, 64]} />
      <meshStandardMaterial map={surface} roughness={1} metalness={0} />
    </mesh>
  );
}

function Earthrise({ mobile = false }: { mobile?: boolean }) {
  const surface = useMemo(() => makeEarthTexture(), []);
  const glow = useMemo(() => makeGlowTexture("96,165,250"), []);
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y =
      (mobile ? 2.4 : 2.6) + Math.sin(t * 0.05) * 0.25;
    group.current.rotation.y += dt * 0.03;
  });

  return (
    <group
      ref={group}
      position={[(mobile ? -1.6 : -5.8), 2.6, mobile ? -24 : -22]}
    >
      <mesh>
        <sphereGeometry args={[mobile ? 1.3 : 1.7, 48, 48]} />
        <meshStandardMaterial
          map={surface}
          roughness={0.65}
          emissive="#1e3a8a"
          emissiveIntensity={0.32}
        />
      </mesh>
      <sprite scale={mobile ? 5 : 6.6}>
        <spriteMaterial
          map={glow}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    const k = Math.min(1, dt * 1.6);
    camera.position.x = lerp(camera.position.x, pointer.x * 0.35, k);
    camera.position.y = lerp(camera.position.y, pointer.y * 0.22, k);
    camera.lookAt(0, -1, -12);
  });
  return null;
}

export default function MoonScene({
  active = true,
  mobile = false,
}: {
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.2 : 1.6]}
      camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 200 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.09} />
      <directionalLight position={[-34, 10, 12]} intensity={2.4} color="#fff7ed" />

      <Stars
        radius={90}
        depth={50}
        count={mobile ? 1300 : 3200}
        factor={3.2}
        saturation={0.15}
        fade
        speed={0.3}
      />

      <Sparkles
        count={mobile ? 20 : 45}
        scale={[20, 10, 16]}
        size={1.6}
        speed={0.15}
        opacity={0.4}
        color="#dbeafe"
      />

      {!mobile &&
        [0, 1].map((i) => (
          <sprite key={i} position={i === 0 ? [-16, 9, -42] : [19, -4, -48]} scale={i === 0 ? 34 : 42}>
            <spriteMaterial
              map={makeGlowTexture(i === 0 ? "30,64,175" : "17,94,89")}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}

      <Moon mobile={mobile} />
      <Earthrise mobile={mobile} />

      <CameraRig />
    </Canvas>
  );
}
