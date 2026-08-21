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
  grad.addColorStop(0.25, `rgba(${rgb},0.38)`);
  grad.addColorStop(0.55, `rgba(${rgb},0.12)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeRayTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;

  ctx.translate(c, c);
  ctx.globalCompositeOperation = "lighter";
  const rays = 16;
  for (let i = 0; i < rays; i++) {
    const len = c * (0.55 + Math.random() * 0.45);
    const wide = 1.5 + Math.random() * 3.5;
    ctx.save();
    ctx.rotate((i / rays) * Math.PI * 2 + Math.random() * 0.2);
    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, "rgba(255,236,200,0.55)");
    g.addColorStop(0.35, "rgba(255,214,150,0.22)");
    g.addColorStop(1, "rgba(255,190,110,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -wide);
    ctx.lineTo(len, -wide * 0.15);
    ctx.lineTo(len, wide * 0.15);
    ctx.lineTo(0, wide);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const core = ctx.createRadialGradient(c, c, 0, c, c, c * 0.32);
  core.addColorStop(0, "rgba(255,248,232,0.9)");
  core.addColorStop(0.5, "rgba(255,222,160,0.28)");
  core.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = core;
  ctx.fillRect(-c, -c, size, size);

  return new THREE.CanvasTexture(canvas);
}

function makeStreakTexture() {
  const w = 512;
  const h = 64;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const gx = ctx.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, "rgba(255,225,170,0)");
  gx.addColorStop(0.5, "rgba(255,240,215,0.9)");
  gx.addColorStop(1, "rgba(255,225,170,0)");
  ctx.fillStyle = gx;
  ctx.fillRect(0, 0, w, h);
  const fade = ctx.createLinearGradient(0, 0, 0, h);
  fade.addColorStop(0, "rgba(0,0,0,1)");
  fade.addColorStop(0.5, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(canvas);
}

/* ------------------------------------------------------------------ */
/* particle galaxy                                                     */
/* ------------------------------------------------------------------ */

const GALAXY_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute vec3 aRandomness;

  varying vec3 vColor;

  void main() {
    vec3 modelPosition = position;

    float angle = atan(modelPosition.x, modelPosition.z);
    float dist = max(length(modelPosition.xz), 0.0001);
    angle += (1.0 / dist) * uTime * 0.22;
    modelPosition.x = cos(angle) * dist;
    modelPosition.z = sin(angle) * dist;
    modelPosition += aRandomness;

    vec4 mvPosition = modelViewMatrix * vec4(modelPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -mvPosition.z);

    vColor = color;
  }
`;

const GALAXY_FRAGMENT = /* glsl */ `
  varying vec3 vColor;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = clamp(1.0 - d * 2.0, 0.0, 1.0);
    strength = pow(strength, 5.0);
    gl_FragColor = vec4(vColor * strength, strength);
  }
`;

function ParticleGalaxy({ mobile }: { mobile: boolean }) {
  const { geometry, material } = useMemo(() => {
    const count = mobile ? 14000 : 42000;
    const radius = 9.6;
    const branches = 5;
    const spin = 1.3;
    const randomness = 0.42;
    const randomnessPower = 2.9;

    const positions = new Float32Array(count * 3);
    const randomnessArr = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const inside = new THREE.Color("#ffe6b8");
    const mid = new THREE.Color("#a78bfa");
    const outside = new THREE.Color("#2563eb");
    const mixed = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() * radius;
      const branchAngle =
        ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r;

      const spread = randomness * (0.45 + r * 0.11);
      const rx = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const ry = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spread * 0.55;
      const rz = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spread;
      randomnessArr[i3] = rx;
      randomnessArr[i3 + 1] = ry;
      randomnessArr[i3 + 2] = rz;

      const t = r / radius;
      if (t < 0.42) mixed.copy(inside).lerp(mid, t / 0.42);
      else mixed.copy(mid).lerp(outside, (t - 0.42) / 0.58);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;

      scales[i] =
        Math.random() < 0.035
          ? 2.4 + Math.random() * 2.2
          : 0.35 + Math.pow(Math.random(), 2.2) * 1.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomnessArr, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: GALAXY_VERTEX,
      fragmentShader: GALAXY_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: mobile ? 24 : 30 },
        uPixelRatio: { value: 1 },
      },
    });

    return { geometry, material };
  }, [mobile]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* apollo sun core                                                     */
/* ------------------------------------------------------------------ */

function ApolloCore() {
  const group = useRef<THREE.Group>(null);
  const rayA = useRef<THREE.SpriteMaterial>(null);
  const rayB = useRef<THREE.SpriteMaterial>(null);
  const halo = useRef<THREE.SpriteMaterial>(null);

  const textures = useMemo(
    () => ({
      soft: makeGlowTexture("255,236,200"),
      hot: makeGlowTexture("255,246,228"),
      ray: makeRayTexture(),
      streak: makeStreakTexture(),
    }),
    []
  );

  useEffect(() => {
    return () => Object.values(textures).forEach((t) => t.dispose());
  }, [textures]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const pulse = 1 + Math.sin(t * 1.35) * 0.045 + Math.sin(t * 4.1) * 0.015;
      group.current.scale.setScalar(pulse);
    }
    if (rayA.current) {
      rayA.current.rotation += dt * 0.06;
      rayA.current.opacity = 0.5 + Math.sin(t * 0.9) * 0.14;
    }
    if (rayB.current) {
      rayB.current.rotation -= dt * 0.042;
      rayB.current.opacity = 0.34 + Math.sin(t * 0.7 + 2.1) * 0.12;
    }
    if (halo.current) {
      halo.current.opacity = 0.62 + Math.sin(t * 1.35) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <sprite scale={13}>
        <spriteMaterial
          map={textures.soft}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={6.4}>
        <spriteMaterial
          map={textures.hot}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={17}>
        <spriteMaterial
          ref={halo}
          map={textures.soft}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={19}>
        <spriteMaterial
          ref={rayA}
          map={textures.ray}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={13}>
        <spriteMaterial
          ref={rayB}
          map={textures.ray}
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={[30, 1.1, 1]}>
        <spriteMaterial
          map={textures.streak}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite scale={[1.1, 30, 1]}>
        <spriteMaterial
          map={textures.streak}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* orbit rings                                                         */
/* ------------------------------------------------------------------ */

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.014, 8, 160]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* nebulae                                                             */
/* ------------------------------------------------------------------ */

function Nebulae() {
  const group = useRef<THREE.Group>(null);
  const layers = useMemo(
    () => [
      { rgb: "255,196,110", pos: [-9, 4, -8] as const, scale: 26, op: 0.3 },
      { rgb: "139,92,246", pos: [10, -3, -10] as const, scale: 30, op: 0.26 },
      { rgb: "34,211,238", pos: [1, 6, -14] as const, scale: 34, op: 0.2 },
      { rgb: "37,99,235", pos: [-11, -5, -12] as const, scale: 28, op: 0.24 },
    ],
    []
  );

  const textures = useMemo(
    () => layers.map((l) => makeGlowTexture(l.rgb)),
    [layers]
  );

  useEffect(() => {
    return () => textures.forEach((t) => t.dispose());
  }, [textures]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.03) * 0.05;
    group.current.position.y = Math.sin(t * 0.05) * 0.4;
  });

  return (
    <group ref={group}>
      {layers.map((l, i) => (
        <sprite key={i} position={[l.pos[0], l.pos[1], l.pos[2]]} scale={l.scale}>
          <spriteMaterial
            map={textures[i]}
            transparent
            opacity={l.op}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* camera rig                                                          */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((state, dt) => {
    const k = Math.min(1, dt * 1.8);
    const t = state.clock.elapsedTime;
    camera.position.x = lerp(camera.position.x, pointer.x * 0.9, k);
    camera.position.y = lerp(
      camera.position.y,
      2.4 + pointer.y * 0.5 + Math.sin(t * 0.1) * 0.15,
      k
    );
    camera.lookAt(0, 0.4, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export default function ApolloGalaxyScene({
  active = true,
  mobile = false,
}: {
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.25 : 1.75]}
      camera={{ position: [0, 2.4, 11], fov: 55, near: 0.1, far: 220 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#020617"]} />

      <Stars
        radius={85}
        depth={45}
        count={mobile ? 1500 : 3600}
        factor={3}
        saturation={0.3}
        fade
        speed={0.4}
      />

      <Sparkles
        count={mobile ? 26 : 70}
        scale={[24, 12, 16]}
        size={2.4}
        speed={0.2}
        opacity={0.5}
        color="#ffd9a8"
      />
      <Sparkles
        count={mobile ? 20 : 50}
        scale={[20, 10, 14]}
        size={1.8}
        speed={0.16}
        opacity={0.4}
        color="#67e8f9"
      />

      <Nebulae />

      <group position={[0, -0.4, -2]} rotation={[-0.95, 0, 0.16]}>
        <GalaxyWobble>
          <ParticleGalaxy mobile={mobile} />
          <OrbitRing
            radius={2.7}
            tilt={[1.25, 0, 0]}
            speed={0.12}
            color="#67e8f9"
            opacity={0.4}
          />
          <OrbitRing
            radius={3.6}
            tilt={[1.05, 0.3, 0]}
            speed={-0.08}
            color="#a78bfa"
            opacity={0.28}
          />
          <OrbitRing
            radius={4.8}
            tilt={[1.35, -0.25, 0]}
            speed={0.05}
            color="#ffc47a"
            opacity={0.22}
          />
          <ApolloCore />
        </GalaxyWobble>
      </group>

      {!mobile &&
        [0, 1].map((i) => (
          <ShootingStar
            key={i}
            index={i + 4}
            area={{ minX: -24, maxX: 24, minY: 5, maxY: 14, minZ: -36, maxZ: -20 }}
          />
        ))}

      <CameraRig />
    </Canvas>
  );
}

function GalaxyWobble({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.05) * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.07) * 0.03;
  });
  return <group ref={ref}>{children}</group>;
}
