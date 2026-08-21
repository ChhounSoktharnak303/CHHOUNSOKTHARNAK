"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type MeteorState = {
  active: boolean;
  t: number;
  wait: number;
  duration: number;
  start: THREE.Vector3;
  dir: THREE.Vector3;
};

export function ShootingStar({
  index,
  area = { minX: -30, maxX: 30, minY: 6, maxY: 18, minZ: -45, maxZ: -25 },
}: {
  index: number;
  area?: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const st = useRef<MeteorState>({
    active: false,
    t: 0,
    wait: 2 + index * 3.1 + Math.random() * 4,
    duration: 1.4 + Math.random(),
    start: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  });

  const xAxis = useMemo(() => new THREE.Vector3(1, 0, 0), []);

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const s = st.current;
    if (!s.active) {
      s.wait -= dt;
      if (s.wait <= 0) {
        s.active = true;
        s.t = 0;
        s.duration = 1.2 + Math.random() * 1.2;
        s.start.set(
          area.minX + Math.random() * (area.maxX - area.minX),
          area.minY + Math.random() * (area.maxY - area.minY),
          area.minZ + Math.random() * (area.maxZ - area.minZ)
        );
        s.dir.set(-0.7 - Math.random() * 0.6, -0.35 - Math.random() * 0.3, 0);
        s.dir.normalize();
      }
      return;
    }
    s.t += dt;
    const p = s.t / s.duration;
    if (p >= 1) {
      s.active = false;
      s.wait = 3 + Math.random() * 8;
      if (matRef.current) matRef.current.opacity = 0;
      return;
    }
    const speed = 26;
    m.position.copy(s.start).addScaledVector(s.dir, s.t * speed);
    m.quaternion.setFromUnitVectors(xAxis, s.dir);
    if (matRef.current) {
      matRef.current.opacity = Math.sin(Math.PI * p) * 0.9;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[3.2, 0.05]} />
      <meshBasicMaterial
        ref={matRef}
        color="#bae6fd"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
