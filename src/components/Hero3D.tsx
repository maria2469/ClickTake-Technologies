import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  Line,
  MeshTransmissionMaterial,
  Html,
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------------- THEME DETECTOR ---------------- */

const isDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

/* ---------------- BRAND ---------------- */

const BRAND = {
  pink: "#F472B6",
  magenta: "#A855F7",
  violet: "#7C3AED",
  blue: "#3B82F6",
  cyan: "#22D3EE",
  deep: "#070A12",
};

/* ---------------- CORE ---------------- */

function Core() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.6;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.05, 4]} />
      <MeshTransmissionMaterial
        transmission={1}
        thickness={0.8}
        roughness={0.12}
        ior={1.35}
        chromaticAberration={0.25}
        backside
        color={BRAND.violet}
        background={new THREE.Color(BRAND.deep)}
      />
    </mesh>
  );
}

/* ---------------- INNER CORE ---------------- */

function InnerCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = -s.clock.elapsedTime * 0.9;
    ref.current.rotation.z = s.clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.55, 1]} />
      <meshStandardMaterial
        color={BRAND.pink}
        emissive={BRAND.pink}
        emissiveIntensity={0.8}
        wireframe
      />
    </mesh>
  );
}

/* ---------------- NODE ---------------- */

function Node({
  position,
  color,
  label,
  size = 0.16,
}: {
  position: readonly [number, number, number];
  color: string;
  label: string;
  size?: number;
}) {
  const dark = isDark();

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1}>
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      <mesh position={position}>
        <sphereGeometry args={[size * 1.7, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>

      {/* FIXED LABEL (THEME ADAPTIVE) */}
      <Html position={position} center distanceFactor={8}>
        <div
          className="rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-md"
          style={{
            color: dark ? "white" : "black",
            borderColor: color,
            background: dark
              ? `linear-gradient(135deg, ${color}22, transparent)`
              : `linear-gradient(135deg, ${color}18, white)`,
            boxShadow: `0 0 12px ${color}40`,
            transform: "translateY(-24px)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </Html>
    </Float>
  );
}

/* ---------------- NETWORK ---------------- */

function Network() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () => [
      { pos: [2.6, 1.2, 0.4], color: BRAND.pink, label: "Web Dev" },
      { pos: [-2.7, 0.7, -0.2], color: BRAND.cyan, label: "AI Automations" },
      { pos: [2.0, -1.6, 0.6], color: BRAND.blue, label: "Mobile Apps" },
      { pos: [-1.9, -1.5, 0.8], color: BRAND.violet, label: "SEO & SEM" },
      { pos: [0.5, 2.3, -0.6], color: BRAND.magenta, label: "Branding" },
      { pos: [0.1, -2.4, 0.2], color: BRAND.cyan, label: "Marketing" },
    ] as const,
    []
  );

  useFrame((s) => {
    if (!group.current) return;
    group.current.rotation.y = s.clock.elapsedTime * 0.25;
    group.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <group key={i}>
          <Node position={n.pos} color={n.color} label={n.label} />

          <Line
            points={[[0, 0, 0], n.pos]}
            color={n.color}
            lineWidth={0.8}
            transparent
            opacity={0.25}
          />
        </group>
      ))}

      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.4, 0.007, 16, 128]} />
        <meshBasicMaterial
          color={BRAND.magenta}
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh rotation={[Math.PI / 1.6, Math.PI / 4, 0]}>
        <torusGeometry args={[2.7, 0.006, 16, 128]} />
        <meshBasicMaterial color={BRAND.cyan} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ---------------- DUST ---------------- */

function Dust({ count = 100 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3;
      const t = Math.random() * Math.PI * 2;
      const p = (Math.random() - 0.5) * Math.PI;

      arr[i * 3] = Math.cos(t) * Math.cos(p) * r;
      arr[i * 3 + 1] = Math.sin(p) * r;
      arr[i * 3 + 2] = Math.sin(t) * Math.cos(p) * r;
    }

    return arr;
  }, [count]);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        size={0.015}
        color={BRAND.cyan}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------------- HERO ---------------- */

export function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 42 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />

        <pointLight position={[3, 2, 3]} intensity={1.5} color={BRAND.pink} />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color={BRAND.blue} />
        <pointLight position={[0, 0, 4]} intensity={1} color={BRAND.cyan} />

        <Float speed={1} rotationIntensity={0.25} floatIntensity={0.7}>
          <Core />
          <InnerCore />
        </Float>

        <Network />
        <Dust />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}