"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { lerp } from "@/lib/utils";
import { ShootingStar } from "./ShootingStar";

/* ------------------------------------------------------------------ */
/* textures                                                            */
/* ------------------------------------------------------------------ */

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
  grad.addColorStop(0.3, `rgba(${rgb},0.35)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeMarsTexture() {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#8f3d1e");
  base.addColorStop(0.5, "#b0522a");
  base.addColorStop(1, "#6e2c13");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 16; i++) {
    const x = rand() * w;
    const y = h * 0.2 + rand() * h * 0.6;
    ctx.fillStyle = `rgba(${rand() > 0.5 ? "70,28,12" : "190,105,58"},${0.1 + rand() * 0.16})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 50 + rand() * 150, 24 + rand() * 70, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(40,14,6,0.32)";
  ctx.beginPath();
  ctx.ellipse(w * 0.32, h * 0.52, 210, 16, -0.06, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 85; i++) {
    const x = rand() * w;
    const y = h * 0.12 + rand() * h * 0.76;
    const r = 3 + rand() * 24;
    ctx.fillStyle = `rgba(60,22,10,${0.28 + rand() * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(235,160,110,${0.22 + rand() * 0.25})`;
    ctx.lineWidth = 1 + r * 0.06;
    ctx.beginPath();
    ctx.arc(x - r * 0.1, y - r * 0.1, r, Math.PI * 1.15, Math.PI * 1.95);
    ctx.stroke();
    if (r > 12) {
      ctx.fillStyle = `rgba(130,60,30,${0.35})`;
      ctx.beginPath();
      ctx.arc(x + r * 0.14, y + r * 0.14, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(245,248,252,0.94)";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, 6, 190, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(245,248,252,${0.5 + rand() * 0.4})`;
    ctx.beginPath();
    ctx.arc(w * 0.5 + (rand() - 0.5) * 380, 8 + rand() * 26, 2 + rand() * 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(240,244,250,0.8)";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h - 4, 120, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle =
      rand() > 0.5
        ? `rgba(255,205,165,${rand() * 0.1})`
        : `rgba(50,16,8,${rand() * 0.14})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2);
  }

  return new THREE.CanvasTexture(canvas);
}

function makeGroundTexture() {
  const w = 512;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  let seed = 91;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#7c3a1e");
  base.addColorStop(0.6, "#5c2712");
  base.addColorStop(1, "#3f1a0c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 22; i++) {
    const y = rand() * h;
    ctx.fillStyle = `rgba(${rand() > 0.5 ? "180,100,60" : "40,14,6"},${0.05 + rand() * 0.08})`;
    ctx.fillRect(0, y, w, 4 + rand() * 22);
  }

  for (let i = 0; i < 40; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 6 + rand() * 30;
    ctx.fillStyle = `rgba(30,10,4,${0.16 + rand() * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.55, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle =
      rand() > 0.5
        ? `rgba(230,150,100,${rand() * 0.12})`
        : `rgba(25,8,4,${rand() * 0.18})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2);
  }

  return new THREE.CanvasTexture(canvas);
}

function makeFlagTexture() {
  const w = 256;
  const h = 160;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#032ea1";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#e00025";
  ctx.fillRect(0, h * 0.25, w, h * 0.5);

  ctx.fillStyle = "#ffffff";
  const cx = w / 2;
  ctx.fillRect(cx - 34, h * 0.62, 68, 12);
  ctx.beginPath();
  ctx.moveTo(cx - 30, h * 0.62);
  ctx.lineTo(cx - 30, h * 0.3);
  ctx.lineTo(cx - 22, h * 0.22);
  ctx.lineTo(cx - 14, h * 0.3);
  ctx.lineTo(cx - 14, h * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 8, h * 0.62);
  ctx.lineTo(cx - 8, h * 0.24);
  ctx.lineTo(cx, h * 0.14);
  ctx.lineTo(cx + 8, h * 0.24);
  ctx.lineTo(cx + 8, h * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 14, h * 0.62);
  ctx.lineTo(cx + 14, h * 0.3);
  ctx.lineTo(cx + 22, h * 0.22);
  ctx.lineTo(cx + 30, h * 0.3);
  ctx.lineTo(cx + 30, h * 0.62);
  ctx.closePath();
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/* ------------------------------------------------------------------ */
/* constants                                                           */
/* ------------------------------------------------------------------ */

const GROUND_R = 26;
const GROUND_POS: [number, number, number] = [0, -27, -2];

function surfaceY(x: number, z: number) {
  const dx = x - GROUND_POS[0];
  const dz = z - GROUND_POS[2];
  return GROUND_POS[1] + Math.sqrt(GROUND_R * GROUND_R - dx * dx - dz * dz);
}

/* ------------------------------------------------------------------ */
/* mars planet                                                         */
/* ------------------------------------------------------------------ */

function MarsPlanet({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const surface = useMemo(() => makeMarsTexture(), []);
  const atmosphere = useMemo(() => makeGlowTexture("255,120,60"), []);

  useEffect(() => {
    return () => {
      surface.dispose();
      atmosphere.dispose();
    };
  }, [surface, atmosphere]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <group position={[7.2, 2.8, -20]}>
      <sprite scale={mobile ? 17 : 19}>
        <spriteMaterial
          map={atmosphere}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <mesh ref={ref}>
        <sphereGeometry args={[mobile ? 4.6 : 5.2, 48, 48]} />
        <meshStandardMaterial
          map={surface}
          roughness={0.92}
          metalness={0.02}
          emissive="#3a1206"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* apollo capsule orbit                                                */
/* ------------------------------------------------------------------ */

function ApolloCapsule({ mobile }: { mobile: boolean }) {
  const pivot = useRef<THREE.Group>(null);
  const ship = useRef<THREE.Group>(null);
  const engineMat = useRef<THREE.SpriteMaterial>(null);
  const engineGlow = useMemo(() => makeGlowTexture("255,170,80"), []);

  useEffect(() => () => engineGlow.dispose(), [engineGlow]);

  useFrame((state, dt) => {
    if (pivot.current) pivot.current.rotation.y += dt * 0.28;
    if (ship.current) ship.current.rotation.y += dt * 0.6;
    if (engineMat.current) {
      engineMat.current.opacity =
        0.5 + Math.sin(state.clock.elapsedTime * 17) * 0.12;
    }
  });

  return (
    <group position={[7.2, 2.8, -20]} rotation={[0.5, 0, 0.18]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7.6, 0.008, 8, 128]} />
        <meshBasicMaterial
          color="#ffb27a"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <group ref={pivot}>
        <group ref={ship} position={[7.6, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 14]} />
            <meshStandardMaterial color="#d8dde5" metalness={0.85} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <coneGeometry args={[0.095, 0.16, 14]} />
            <meshStandardMaterial color="#aab3bf" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.07, 0.05, 0.09, 12]} />
            <meshStandardMaterial color="#2a3040" metalness={0.7} roughness={0.4} />
          </mesh>
          <sprite position={[0, -0.24, 0]} scale={0.34}>
            <spriteMaterial
              ref={engineMat}
              map={engineGlow}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* martian moons                                                       */
/* ------------------------------------------------------------------ */

function Moonlet({
  radius,
  tilt,
  speed,
  size,
  color,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  size: number;
  color: string;
}) {
  const pivot = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (pivot.current) pivot.current.rotation.y += dt * speed;
  });
  return (
    <group position={[7.2, 2.8, -20]} rotation={tilt}>
      <group ref={pivot}>
        <mesh position={[radius, 0, 0]}>
          <dodecahedronGeometry args={[size, 0]} />
          <meshStandardMaterial color={color} roughness={1} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* astronaut                                                           */
/* ------------------------------------------------------------------ */

function Astronaut({ mobile = false }: { mobile?: boolean }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  const x = mobile ? -0.6 : -3.1;
  const z = mobile ? 2.4 : 2.6;
  const y = surfaceY(x, z);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.position.y = y + 0.02 + Math.sin(t * 1.1) * 0.015;
      root.current.rotation.z = Math.sin(t * 0.8) * 0.008;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.5) * 0.07;
      head.current.rotation.x = Math.sin(t * 0.63) * 0.04;
    }
    if (armL.current) armL.current.rotation.x = Math.sin(t * 1.3) * 0.05;
    if (armR.current) armR.current.rotation.x = -Math.sin(t * 1.3) * 0.05;
  });

  return (
    <group ref={root} position={[x, y, z]} rotation={[0, 0.35, 0]}>
      {/* legs */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.09, 0.13, 0]}>
          <mesh>
            <capsuleGeometry args={[0.048, 0.14, 4, 10]} />
            <meshStandardMaterial color="#dfe3ea" roughness={0.55} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.115, 0.02]}>
            <boxGeometry args={[0.09, 0.05, 0.13]} />
            <meshStandardMaterial color="#9aa2ad" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* torso */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.3, 0.34, 0.2]} />
        <meshStandardMaterial color="#e6eaf0" roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.47, 0.105]}>
        <boxGeometry args={[0.16, 0.12, 0.03]} />
        <meshStandardMaterial color="#232a38" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.045, 0.5, 0.125]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#ef4444" toneMapped={false} />
      </mesh>
      <mesh position={[-0.045, 0.5, 0.125]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>

      {/* backpack */}
      <mesh position={[0, 0.44, -0.145]}>
        <boxGeometry args={[0.26, 0.3, 0.12]} />
        <meshStandardMaterial color="#cdd3db" roughness={0.6} />
      </mesh>

      {/* arms */}
      {[-1, 1].map((s) => (
        <group key={s} ref={s === -1 ? armL : armR} position={[s * 0.2, 0.52, 0]} rotation={[0, 0, s * 0.22]}>
          <mesh position={[0, -0.11, 0]}>
            <capsuleGeometry args={[0.042, 0.14, 4, 10]} />
            <meshStandardMaterial color="#dfe3ea" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.21, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#b8bfc9" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* helmet */}
      <group ref={head} position={[0, 0.71, 0]}>
        <mesh>
          <sphereGeometry args={[0.155, 24, 24]} />
          <meshStandardMaterial color="#eef1f6" roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.132, 24, 24]} />
          <meshStandardMaterial
            color="#caa64a"
            metalness={1}
            roughness={0.12}
            emissive="#3a2c08"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
          <meshStandardMaterial color="#8b929c" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* flag                                                                */
/* ------------------------------------------------------------------ */

function Flag({ mobile = false }: { mobile?: boolean }) {
  const cloth = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => makeFlagTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);

  const x = mobile ? 0.35 : -2.25;
  const z = mobile ? 2.1 : 2.15;
  const y = surfaceY(x, z);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cloth.current) {
      cloth.current.rotation.y = Math.sin(t * 2.6) * 0.1;
      cloth.current.scale.x = 1 + Math.sin(t * 3.4) * 0.04;
      cloth.current.rotation.z = Math.sin(t * 1.8) * 0.02;
    }
  });

  return (
    <group position={[x, y, z]} rotation={[0, 0.5, 0]}>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.016, 0.02, 1.16, 10]} />
        <meshStandardMaterial color="#c7ccd4" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.17, 0]}>
        <sphereGeometry args={[0.026, 10, 10]} />
        <meshStandardMaterial color="#dfe3ea" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={cloth} position={[0.33, 0.98, 0]}>
        <planeGeometry args={[0.62, 0.38, 12, 6]} />
        <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* rocks                                                               */
/* ------------------------------------------------------------------ */

function Rocks() {
  const rocks = useMemo(
    () =>
      [
        { x: -4.4, z: 3.4, r: 0.13 },
        { x: -1.6, z: 4.2, r: 0.09 },
        { x: -5.6, z: 1.8, r: 0.16 },
        { x: 0.4, z: 3.8, r: 0.07 },
        { x: -6.8, z: 4.6, r: 0.12 },
        { x: 2.2, z: 4.6, r: 0.1 },
      ].map((rk) => ({ ...rk, y: surfaceY(rk.x, rk.z), ry: rk.x * 3.7 })),
    []
  );
  return (
    <group>
      {rocks.map((rk, i) => (
        <mesh key={i} position={[rk.x, rk.y + rk.r * 0.4, rk.z]} rotation={[rk.ry, rk.ry * 2, 0]}>
          <dodecahedronGeometry args={[rk.r, 0]} />
          <meshStandardMaterial color="#57240f" roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* camera                                                              */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((state, dt) => {
    const k = Math.min(1, dt * 1.8);
    const t = state.clock.elapsedTime;
    camera.position.x = lerp(camera.position.x, pointer.x * 0.55 + Math.sin(t * 0.07) * 0.2, k);
    camera.position.y = lerp(camera.position.y, 0.35 + pointer.y * 0.3, k);
    camera.lookAt(0, -0.55, -2);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export default function MarsScene({
  active = true,
  mobile = false,
}: {
  active?: boolean;
  mobile?: boolean;
}) {
  const nebulaTexA = useMemo(() => makeGlowTexture("255,120,70"), []);
  const nebulaTexB = useMemo(() => makeGlowTexture("37,99,235"), []);
  const sunTex = useMemo(() => makeGlowTexture("255,236,200"), []);
  const earthTex = useMemo(() => makeGlowTexture("120,170,255"), []);
  const groundTex = useMemo(() => makeGroundTexture(), []);

  useEffect(() => {
    return () =>
      [nebulaTexA, nebulaTexB, sunTex, earthTex, groundTex].forEach((t) =>
        t.dispose()
      );
  }, [nebulaTexA, nebulaTexB, sunTex, earthTex, groundTex]);

  return (
    <Canvas
      dpr={[1, mobile ? 1.2 : 1.7]}
      camera={{ position: [0, 0.35, 8.5], fov: 54, near: 0.1, far: 220 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#01040a"]} />

      <ambientLight intensity={0.32} />
      <directionalLight position={[12, 9, 7]} intensity={2.3} color="#ffd9b3" />
      <directionalLight position={[-10, 4, -6]} intensity={0.5} color="#7dd3fc" />

      <Stars
        radius={95}
        depth={55}
        count={mobile ? 1400 : 3200}
        factor={3}
        saturation={0.4}
        fade
        speed={0.4}
      />

      <sprite position={[-16, 4, -34]} scale={28}>
        <spriteMaterial map={nebulaTexA} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[15, -2, -40]} scale={34}>
        <spriteMaterial map={nebulaTexB} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[-13, 8.5, -42]} scale={11}>
        <spriteMaterial map={sunTex} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[-15, 6.5, -46]} scale={0.9}>
        <spriteMaterial map={earthTex} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      <MarsPlanet mobile={mobile} />
      {!mobile && <ApolloCapsule mobile={mobile} />}
      <Moonlet radius={5.9} tilt={[0.2, 0, -0.3]} speed={0.5} size={0.22} color="#6b6560" />
      <Moonlet radius={9.4} tilt={[-0.35, 0, 0.25]} speed={0.22} size={0.14} color="#7a736c" />

      {/* martian dust wind */}
      <Sparkles
        count={mobile ? 30 : 90}
        scale={[24, 3.2, 10]}
        position={[0, -0.5, 2]}
        size={1.7}
        speed={0.9}
        opacity={0.4}
        color="#e8a06a"
      />
      <Sparkles
        count={mobile ? 16 : 40}
        scale={[26, 9, 14]}
        position={[0, 2, -2]}
        size={1.4}
        speed={0.5}
        opacity={0.28}
        color="#c97b4a"
      />

      {/* curved martian terrain */}
      <mesh position={GROUND_POS}>
        <sphereGeometry args={[GROUND_R, 64, 64]} />
        <meshStandardMaterial map={groundTex} roughness={0.96} metalness={0.02} />
      </mesh>

      <Rocks />
      <Astronaut mobile={mobile} />
      <Flag mobile={mobile} />

      {!mobile &&
        [0, 1].map((i) => (
          <ShootingStar
            key={i}
            index={i + 7}
            area={{ minX: -24, maxX: 24, minY: 3, maxY: 11, minZ: -34, maxZ: -18 }}
          />
        ))}

      <CameraRig />
    </Canvas>
  );
}
