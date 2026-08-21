"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function NebulaLayer() {
  const layers = useMemo(
    () => [
      { rgb: "37,99,235", pos: [-16, 6, -34] as const, scale: 46, rot: 0.2 },
      { rgb: "8,145,178", pos: [20, -4, -42] as const, scale: 54, rot: -0.35 },
      { rgb: "79,70,229", pos: [2, 14, -50] as const, scale: 60, rot: 0.6 },
      { rgb: "6,182,212", pos: [-26, -10, -28] as const, scale: 30, rot: 0 },
    ],
    []
  );

  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.02) * 0.04;
  });

  return (
    <group ref={group}>
      {layers.map((l, i) => (
        <NebulaSprite key={i} {...l} />
      ))}
    </group>
  );
}

function NebulaSprite({
  rgb,
  pos,
  scale,
  rot,
}: {
  rgb: string;
  pos: readonly [number, number, number];
  scale: number;
  rot: number;
}) {
  const tex = useMemo(() => makeGlowTexture(rgb), [rgb]);
  return (
    <sprite position={[pos[0], pos[1], pos[2]]} rotation={[0, 0, rot]} scale={scale}>
      <spriteMaterial
        map={tex}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

function DistantPlanet({
  position,
  radius,
  color,
  hasRing,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  hasRing?: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.05;
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0.15}
          emissive="#0c2a4d"
          emissiveIntensity={0.35}
        />
      </mesh>
      {hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0.3, 0]}>
          <torusGeometry args={[radius * 1.7, radius * 0.09, 2, 64]} />
          <meshBasicMaterial
            color="#155e75"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    const k = Math.min(1, dt * 2.4);
    camera.position.x = lerp(camera.position.x, pointer.x * 0.7, k);
    camera.position.y = lerp(camera.position.y, 0.3 + pointer.y * 0.4, k);
    camera.lookAt(0, 0, -4);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* terminator hologram                                                 */
/* ------------------------------------------------------------------ */

function makeHoloAlphaMap() {
  const w = 256;
  const h = Math.round((256 * 713) / 900);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  const grad = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    w * 0.52
  );
  grad.addColorStop(0, "#fff");
  grad.addColorStop(0.62, "#fff");
  grad.addColorStop(0.85, "#666");
  grad.addColorStop(1, "#000");
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, h / w);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return new THREE.CanvasTexture(canvas);
}

function TerminatorHologram({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.SpriteMaterial>(null);
  const [loaded, setLoaded] = useState(false);

  const glowTex = useMemo(() => makeGlowTexture("34,211,238"), []);

  const texture = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const tex = new THREE.TextureLoader().load(
      `${base}/assets/the-terminator-skeleton-stephen-humphries.jpg`,
      () => setLoaded(true)
    );
    return tex;
  }, []);

  const alphaMap = useMemo(() => makeHoloAlphaMap(), []);

  useEffect(() => {
    return () => {
      texture.dispose();
      alphaMap.dispose();
      glowTex.dispose();
    };
  }, [texture, alphaMap, glowTex]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!mat.current) return;
    const flicker =
      0.82 +
      Math.sin(t * 21) * 0.04 +
      Math.sin(t * 47.3) * 0.03 +
      (Math.sin(t * 2.2) > 0.97 ? -0.25 : 0);
    mat.current.opacity = lerp(mat.current.opacity, flicker, 0.12);
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(t * 0.8) * 0.06;
      if (Math.sin(t * 1.7) > 0.995) {
        mesh.current.position.x = position[0] + (Math.random() - 0.5) * 0.05;
      } else {
        mesh.current.position.x = lerp(
          mesh.current.position.x,
          position[0],
          0.2
        );
      }
    }
    if (glowMat.current) {
      glowMat.current.opacity = 0.16 + Math.sin(t * 1.9) * 0.05;
    }
  });

  return (
    <group>
      <sprite position={[position[0], position[1], position[2] - 0.4]} scale={7.5}>
        <spriteMaterial
          ref={glowMat}
          map={glowTex}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <mesh
        ref={mesh}
        position={position}
        scale={scale}
        visible={loaded}
        renderOrder={2}
      >
        <planeGeometry args={[4.4, (4.4 * 713) / 900]} />
        <meshBasicMaterial
          ref={mat}
          map={texture}
          alphaMap={alphaMap}
          color="#cfeeff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function GalaxyScene({
  active = true,
  mobile = false,
}: {
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.25 : 1.75]}
      camera={{ position: [0, 0.3, 9], fov: 58, near: 0.1, far: 220 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 24, 90]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} color="#93c5fd" />
      <pointLight position={[-6, 2, 2]} intensity={18} color="#2563eb" distance={30} />
      <pointLight position={[4, -2, 3]} intensity={12} color="#06b6d4" distance={24} />

      <Stars
        radius={90}
        depth={50}
        count={mobile ? 2600 : 6500}
        factor={3.2}
        saturation={0.35}
        fade
        speed={0.5}
      />

      <Sparkles
        count={mobile ? 40 : 110}
        scale={[16, 9, 12]}
        size={2.2}
        speed={0.25}
        opacity={0.55}
        color="#67e8f9"
      />

      <NebulaLayer />

      <DistantPlanet position={[-17, 7, -36]} radius={2.1} color="#1e293b" hasRing />
      <DistantPlanet position={[21, -6, -44]} radius={1.4} color="#0f172a" />

      {!mobile &&
        Array.from({ length: 3 }, (_, i) => <ShootingStar key={i} index={i} />)}

      <Grid
        position={[0, -4.6, 0]}
        infiniteGrid
        cellSize={0.9}
        sectionSize={4.5}
        cellColor="#0b1c33"
        sectionColor="#0e7490"
        fadeDistance={42}
        fadeStrength={2.8}
        cellThickness={0.6}
        sectionThickness={1.1}
      />

      <TerminatorHologram
        position={mobile ? [0, -2.4, -5] : [3.1, -1.1, 0]}
        scale={mobile ? 0.72 : 1}
      />

      <CameraRig />
    </Canvas>
  );
}
