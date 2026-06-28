import { useEffect, useRef, useCallback } from "react";

/* ─── Palette ─────────────────────────────────────────────────── */
const LIGHT_PALETTE: [number, number, number][] = [
  [30, 120, 220],
  [0, 160, 200],
  [20, 180, 150],
  [60, 100, 200],
];

const DARK_PALETTE: [number, number, number][] = [
  [0, 200, 255],
  [0, 240, 200],
  [40, 160, 255],
  [0, 255, 180],
];

type RGB = [number, number, number];
const isDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

/* ─── Types ───────────────────────────────────────────────────── */
interface TechNode {
  x: number; y: number;
  vx: number; vy: number;
  color: RGB;
  pulse: number; pulseSpeed: number;
  radius: number;
}

interface DataStream {
  progress: number;
  speed: number;
  edgeIdx: number;
  color: RGB;
}

interface GridPulse {
  x: number; y: number;
  maxR: number;
  r: number;
  speed: number;
  color: RGB;
  alpha: number;
}

const rgb = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const darkRef = useRef(isDark());

  const build = useCallback((W: number, H: number) => {
    const dark = darkRef.current;
    const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
    const rand = () => palette[Math.floor(Math.random() * palette.length)];

    /* ── Tech nodes — reduced from 126 to 56 ── */
    const COLS = 8, ROWS = 7;
    const nodes: TechNode[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        nodes.push({
          x: (c + 0.5 + (Math.random() - 0.5) * 0.6) / COLS,
          y: (r + 0.5 + (Math.random() - 0.5) * 0.6) / ROWS,
          vx: (Math.random() - 0.5) * 0.00005,
          vy: (Math.random() - 0.5) * 0.00004,
          color: rand(),
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.4 + Math.random() * 0.8,
          radius: 2 + Math.random() * 2,
        });
      }
    }

    const edges: [number, number][] = [];
    const MAX_D = 0.18;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < MAX_D) edges.push([i, j]);
      }
    }

    /* ── Data streams — reduced from 40 to 16 ── */
    const streams: DataStream[] = Array.from({ length: 16 }, () => ({
      progress: Math.random(),
      speed: 0.001 + Math.random() * 0.002,
      edgeIdx: Math.floor(Math.random() * Math.max(edges.length, 1)),
      color: rand(),
    }));

    /* ── Ripple pulses — reduced from 6 to 4 ── */
    const pulses: GridPulse[] = Array.from({ length: 4 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      maxR: 80 + Math.random() * 120,
      r: Math.random() * 150,
      speed: 0.5 + Math.random() * 0.5,
      color: rand(),
      alpha: dark ? 0.1 : 0.05,
    }));

    return { nodes, edges, streams, pulses };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    let W = 0, H = 0;
    let sceneData = build(0, 0);

    // Pre-render static background to an offscreen canvas
    let bgCanvas: HTMLCanvasElement | null = null;

    const buildBg = () => {
      const dark = darkRef.current;
      bgCanvas = document.createElement("canvas");
      bgCanvas.width = W;
      bgCanvas.height = H;
      const bCtx = bgCanvas.getContext("2d")!;

      if (dark) {
        bCtx.fillStyle = "#020c14";
        bCtx.fillRect(0, 0, W, H);
        const g1 = bCtx.createRadialGradient(W * 0.15, H * 0.1, 0, W * 0.15, H * 0.1, H * 0.65);
        g1.addColorStop(0, "rgba(0,40,80,0.55)");
        g1.addColorStop(1, "rgba(0,0,0,0)");
        bCtx.fillStyle = g1;
        bCtx.fillRect(0, 0, W, H);
        const g2 = bCtx.createRadialGradient(W * 0.88, H * 0.85, 0, W * 0.88, H * 0.85, H * 0.55);
        g2.addColorStop(0, "rgba(0,60,50,0.4)");
        g2.addColorStop(1, "rgba(0,0,0,0)");
        bCtx.fillStyle = g2;
        bCtx.fillRect(0, 0, W, H);
      } else {
        const lg = bCtx.createLinearGradient(0, 0, W * 0.6, H);
        lg.addColorStop(0, "#f0f6ff");
        lg.addColorStop(0.5, "#eaf2fb");
        lg.addColorStop(1, "#e4eef8");
        bCtx.fillStyle = lg;
        bCtx.fillRect(0, 0, W, H);
      }

      // Dashed grid — static, draw once
      bCtx.save();
      bCtx.globalAlpha = dark ? 0.025 : 0.02;
      bCtx.strokeStyle = dark ? "rgba(0,200,255,1)" : "rgba(0,100,200,1)";
      bCtx.lineWidth = 0.5;
      bCtx.setLineDash([4, 16]);
      const GRID = 100;
      for (let x = 0; x < W; x += GRID) {
        bCtx.beginPath(); bCtx.moveTo(x, 0); bCtx.lineTo(x, H); bCtx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        bCtx.beginPath(); bCtx.moveTo(0, y); bCtx.lineTo(W, y); bCtx.stroke();
      }
      bCtx.restore();
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      sceneData = build(W, H);
      buildBg();
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      darkRef.current = isDark();
      sceneData = build(W, H);
      buildBg();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    /* ── Draw edges ── */
    const drawEdges = (nodes: TechNode[], edges: [number, number][]) => {
      const dark = darkRef.current;
      ctx.lineWidth = 0.6;
      ctx.setLineDash([]);
      edges.forEach(([i, j]) => {
        const ni = nodes[i], nj = nodes[j];
        const dx = ni.x - nj.x, dy = ni.y - nj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = (1 - dist / 0.18) * (dark ? 0.15 : 0.08);
        if (alpha <= 0) return;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = rgb(ni.color);
        ctx.beginPath();
        ctx.moveTo(ni.x * W, ni.y * H);
        ctx.lineTo(nj.x * W, nj.y * H);
        ctx.stroke();
      });
    };

    /* ── Draw nodes ── */
    const drawNodes = (nodes: TechNode[], t: number) => {
      const dark = darkRef.current;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;

        const pulse = 0.5 + 0.5 * Math.sin(t * n.pulseSpeed + n.pulse);
        const a = (dark ? 0.5 : 0.3) * pulse + (dark ? 0.1 : 0.05);
        const cx = n.x * W, cy = n.y * H;

        ctx.globalAlpha = a;
        ctx.fillStyle = rgb(n.color);
        ctx.beginPath();
        ctx.arc(cx, cy, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    /* ── Data streams (no per-frame gradient) ── */
    const drawStreams = (nodes: TechNode[], edges: [number, number][], streams: DataStream[]) => {
      const dark = darkRef.current;
      ctx.lineWidth = dark ? 1.4 : 1;
      streams.forEach(s => {
        if (!edges.length || s.edgeIdx >= edges.length) return;
        s.progress += s.speed;
        if (s.progress > 1) {
          s.progress = 0;
          s.edgeIdx = Math.floor(Math.random() * edges.length);
        }
        const [ia, ib] = edges[s.edgeIdx];
        const na = nodes[ia], nb = nodes[ib];
        const x = (na.x + (nb.x - na.x) * s.progress) * W;
        const y = (na.y + (nb.y - na.y) * s.progress) * H;

        // Head dot only — no per-frame gradient creation
        ctx.globalAlpha = dark ? 0.8 : 0.55;
        ctx.fillStyle = rgb(s.color);
        ctx.beginPath();
        ctx.arc(x, y, dark ? 2.2 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    /* ── Ripple pulses ── */
    const drawPulses = (pulses: GridPulse[]) => {
      ctx.lineWidth = 0.7;
      pulses.forEach(p => {
        p.r += p.speed;
        if (p.r > p.maxR) {
          p.r = 0;
          p.x = Math.random() * W;
          p.y = Math.random() * H;
        }
        const fade = 1 - p.r / p.maxR;
        ctx.globalAlpha = p.alpha * fade;
        ctx.strokeStyle = rgb(p.color);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    /* ── Frame loop — throttle to ~40fps on slow devices ── */
    let lastTs = 0;
    const FRAME_MS = 1000 / 50; // cap at 50fps to reduce CPU load
    const frame = (ts: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const dt = ts - lastTs;
      if (dt < FRAME_MS) return;
      lastTs = ts - (dt % FRAME_MS);

      const t = ts * 0.001;
      const { nodes, edges, streams, pulses } = sceneData;

      // Draw pre-baked static background
      if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0);

      ctx.save();
      drawEdges(nodes, edges);
      drawNodes(nodes, t);
      drawStreams(nodes, edges, streams);
      drawPulses(pulses);
      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [build]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full z-0"
      style={{ willChange: "auto" }}
    />
  );
}
