import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor:
 *  - Rotating gradient "aperture" diamond (4-blade) at the tip
 *  - Soft glow halo following with delay
 *  - 6-particle comet trail in brand colors
 *  - On hover: aperture opens into a circle and pulses
 */
export function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const tipX = useSpring(x, { damping: 32, stiffness: 700, mass: 0.2 });
  const tipY = useSpring(y, { damping: 32, stiffness: 700, mass: 0.2 });

  const haloX = useSpring(x, { damping: 22, stiffness: 130, mass: 0.7 });
  const haloY = useSpring(y, { damping: 22, stiffness: 130, mass: 0.7 });

  const t0x = useSpring(x, { damping: 30, stiffness: 220, mass: 0.40 });
  const t0y = useSpring(y, { damping: 30, stiffness: 220, mass: 0.40 });
  const t1x = useSpring(x, { damping: 28, stiffness: 194, mass: 0.52 });
  const t1y = useSpring(y, { damping: 28, stiffness: 194, mass: 0.52 });
  const t2x = useSpring(x, { damping: 26, stiffness: 168, mass: 0.64 });
  const t2y = useSpring(y, { damping: 26, stiffness: 168, mass: 0.64 });
  const t3x = useSpring(x, { damping: 24, stiffness: 142, mass: 0.76 });
  const t3y = useSpring(y, { damping: 24, stiffness: 142, mass: 0.76 });
  const t4x = useSpring(x, { damping: 22, stiffness: 116, mass: 0.88 });
  const t4y = useSpring(y, { damping: 22, stiffness: 116, mass: 0.88 });
  const t5x = useSpring(x, { damping: 20, stiffness: 90,  mass: 1.00 });
  const t5y = useSpring(y, { damping: 20, stiffness: 90,  mass: 1.00 });

  const trail = [
    { x: t0x, y: t0y },
    { x: t1x, y: t1y },
    { x: t2x, y: t2y },
    { x: t3x, y: t3y },
    { x: t4x, y: t4y },
    { x: t5x, y: t5y },
  ];

  const colors = ["#ff3d8b", "#c026d3", "#8b5cf6", "#3b82f6", "#22d3ee", "#a3e635"];

  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, input, textarea, select, [data-cursor='hover']"));
    };
    const down = () => setClick(true);
    const up = () => setClick(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  return (
    <>
      {/* Particle trail */}
      {trail.map((t, i) => (
        <motion.div
          key={i}
          className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9990]"
          style={{ x: t.x, y: t.y }}
        >
          <div
            className="-translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${10 - i * 1.2}px`,
              height: `${10 - i * 1.2}px`,
              background: colors[i],
              opacity: 0.55 - i * 0.07,
              filter: `blur(${i * 0.6}px)`,
              boxShadow: `0 0 ${14 - i}px ${colors[i]}`,
            }}
          />
        </motion.div>
      ))}

      {/* Soft glow halo */}
      <motion.div
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9996]"
        style={{ x: haloX, y: haloY }}
      >
        <motion.div
          animate={{ scale: hover ? 2.2 : 1, opacity: hover ? 0.9 : 0.5 }}
          transition={{ type: "spring", damping: 18 }}
          className="-translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(192,38,211,0.55) 0%, rgba(255,61,139,0.25) 40%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      {/* Aperture cursor — 4 rotating blades */}
      <motion.div
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x: tipX, y: tipY }}
      >
        <motion.div
          animate={{
            rotate: hover ? 0 : 360,
            scale: click ? 0.7 : hover ? 1.6 : 1,
          }}
          transition={{
            rotate: { duration: 6, ease: "linear", repeat: Infinity },
            scale: { type: "spring", damping: 18 },
          }}
          className="-translate-x-1/2 -translate-y-1/2"
          style={{ width: 28, height: 28 }}
        >
          <svg viewBox="0 0 32 32" width="28" height="28" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="cursorGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff3d8b" />
                <stop offset="50%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="cursorGlow">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* outer ring */}
            <motion.circle
              cx="16"
              cy="16"
              r={hover ? 13 : 10}
              fill="none"
              stroke="url(#cursorGrad)"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              filter="url(#cursorGlow)"
            />

            {/* 4 aperture blades */}
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 16 16)`}>
                <path
                  d={hover ? "M16 16 L24 8" : "M16 16 L22 16"}
                  stroke="url(#cursorGrad)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  filter="url(#cursorGlow)"
                />
              </g>
            ))}

            {/* center dot */}
            <circle cx="16" cy="16" r={hover ? 3 : 1.6} fill="url(#cursorGrad)" filter="url(#cursorGlow)" />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}
