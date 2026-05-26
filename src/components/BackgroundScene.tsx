import { useEffect, useRef, useCallback } from "react";

/* ─── Palette ─────────────────────────────────────────────────── */
const LIGHT_PALETTE: [number, number, number][] = [
  [30, 120, 220],
  [0, 160, 200],
  [20, 180, 150],
  [60, 100, 200],
  [0, 140, 180],
  [10, 100, 160],
];

const DARK_PALETTE: [number, number, number][] = [
  [0, 200, 255],
  [0, 240, 200],
  [40, 160, 255],
  [0, 255, 180],
  [80, 200, 255],
  [20, 220, 240],
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
  type: "square" | "diamond" | "dot" | "ring";
}

interface DataStream {
  progress: number;
  speed: number;
  edgeIdx: number;
  color: RGB;
  trailLength: number;
}

interface GridPulse {
  x: number; y: number;
  maxR: number;
  r: number;
  speed: number;
  color: RGB;
  alpha: number;
}

interface WaveformPoint {
  baseY: number;
  phase: number;
  freq: number;
  amp: number;
  color: RGB;
}

interface TerminalChar {
  x: number; y: number;
  char: string;
  alpha: number;
  speed: number;
  color: RGB;
  lifespan: number;
  age: number;
}

interface ScanBeam {
  angle: number; speed: number;
  cx: number; cy: number;
  radius: number;
  color: RGB; alpha: number;
}

interface HexCell {
  cx: number; cy: number;
  size: number;
  alpha: number;
  color: RGB;
  fillAlpha: number;
  lit: boolean;
  litTimer: number;
}

/* ─── Hex grid ────────────────────────────────────────────────── */
function buildHexGrid(W: number, H: number, palette: RGB[]): HexCell[] {
  const cells: HexCell[] = [];
  const size = 38;
  const w = size * 2;
  const h = Math.sqrt(3) * size;
  const cols = Math.ceil(W / (w * 0.75)) + 2;
  const rows = Math.ceil(H / h) + 2;

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const offset = c % 2 === 0 ? 0 : h / 2;
      const cx = c * w * 0.75;
      const cy = r * h + offset;
      if (Math.random() > 0.72) continue;
      cells.push({
        cx, cy, size,
        alpha: 0.03 + Math.random() * 0.05,
        color: palette[Math.floor(Math.random() * palette.length)],
        fillAlpha: 0,
        lit: false,
        litTimer: 0,
      });
    }
  }
  return cells;
}

/* ─── Waveform bands ──────────────────────────────────────────── */
function buildWaveforms(H: number, palette: RGB[]): WaveformPoint[][] {
  const bands: WaveformPoint[][] = [];
  const count = 4;
  for (let b = 0; b < count; b++) {
    const baseY = H * (0.2 + b * 0.2);
    const color = palette[b % palette.length];
    const pts: WaveformPoint[] = Array.from({ length: 120 }, (_, i) => ({
      baseY,
      phase: Math.random() * Math.PI * 2,
      freq: 0.008 + Math.random() * 0.012,
      amp: 8 + Math.random() * 18,
      color,
    }));
    bands.push(pts);
  }
  return bands;
}

/* ─── Terminal characters ─────────────────────────────────────── */
const TECH_CHARS = "01ABCDEF><{}[]()#%$@!?=+-*/\\|;:,.~^&";
function spawnTermChar(W: number, H: number, palette: RGB[]): TerminalChar {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    char: TECH_CHARS[Math.floor(Math.random() * TECH_CHARS.length)],
    alpha: 0,
    speed: 0.004 + Math.random() * 0.006,
    color: palette[Math.floor(Math.random() * palette.length)],
    lifespan: 60 + Math.random() * 120,
    age: 0,
  };
}

export function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const darkRef = useRef(isDark());

  const build = useCallback((W: number, H: number) => {
    const dark = darkRef.current;
    const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
    const rand = () => palette[Math.floor(Math.random() * palette.length)];

    /* ── Tech nodes (larger, shaped) ── */
    const COLS = 14, ROWS = 9;
    const nodeTypes: TechNode["type"][] = ["square", "diamond", "dot", "ring"];
    const nodes: TechNode[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        nodes.push({
          x: (c + 0.5 + (Math.random() - 0.5) * 0.6) / COLS,
          y: (r + 0.5 + (Math.random() - 0.5) * 0.6) / ROWS,
          vx: (Math.random() - 0.5) * 0.00006,
          vy: (Math.random() - 0.5) * 0.00005,
          color: rand(),
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.4 + Math.random() * 0.9,
          radius: 2 + Math.random() * 2.5,
          type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        });
      }
    }

    const edges: [number, number][] = [];
    const MAX_D = 0.16;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < MAX_D) edges.push([i, j]);
      }
    }

    /* ── Data streams (more, faster, with trails) ── */
    const streams: DataStream[] = Array.from({ length: 40 }, () => ({
      progress: Math.random(),
      speed: 0.0008 + Math.random() * 0.0018,
      edgeIdx: Math.floor(Math.random() * Math.max(edges.length, 1)),
      color: rand(),
      trailLength: 0.06 + Math.random() * 0.1,
    }));

    /* ── Ripple pulses ── */
    const pulses: GridPulse[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      maxR: 80 + Math.random() * 140,
      r: Math.random() * 200,
      speed: 0.4 + Math.random() * 0.6,
      color: rand(),
      alpha: dark ? 0.12 : 0.06,
    }));

    /* ── Waveform bands ── */
    const waveforms = buildWaveforms(H, palette);

    /* ── Hex grid background ── */
    const hexCells = buildHexGrid(W, H, palette);

    /* ── Terminal characters ── */
    const termChars: TerminalChar[] = Array.from({ length: 30 }, () =>
      spawnTermChar(W, H, palette)
    );

    /* ── Scan beams (radar-style) ── */
    const scanBeams: ScanBeam[] = Array.from({ length: 3 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0004,
      cx: (0.2 + Math.random() * 0.6) * W,
      cy: (0.2 + Math.random() * 0.6) * H,
      radius: 60 + Math.random() * 80,
      color: rand(),
      alpha: dark ? 0.18 : 0.08,
    }));

    return { nodes, edges, streams, pulses, waveforms, hexCells, termChars, scanBeams };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let sceneData = build(0, 0);
    let palette = darkRef.current ? DARK_PALETTE : LIGHT_PALETTE;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      palette = darkRef.current ? DARK_PALETTE : LIGHT_PALETTE;
      sceneData = build(W, H);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      darkRef.current = isDark();
      palette = darkRef.current ? DARK_PALETTE : LIGHT_PALETTE;
      sceneData = build(W, H);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    /* ── Helpers ── */
    const hexPath = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i === 0
          ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
          : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
    };

    const rgb = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    /* ── Background ── */
    const drawBackground = () => {
      const dark = darkRef.current;
      if (dark) {
        ctx.fillStyle = "#020c14";
        ctx.fillRect(0, 0, W, H);
        // Deep radial bloom top-left
        const g1 = ctx.createRadialGradient(W * 0.15, H * 0.1, 0, W * 0.15, H * 0.1, H * 0.65);
        g1.addColorStop(0, "rgba(0,40,80,0.55)");
        g1.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, W, H);
        // Bottom-right accent
        const g2 = ctx.createRadialGradient(W * 0.88, H * 0.85, 0, W * 0.88, H * 0.85, H * 0.55);
        g2.addColorStop(0, "rgba(0,60,50,0.4)");
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);
      } else {
        const lg = ctx.createLinearGradient(0, 0, W * 0.6, H);
        lg.addColorStop(0, "#f0f6ff");
        lg.addColorStop(0.5, "#eaf2fb");
        lg.addColorStop(1, "#e4eef8");
        ctx.fillStyle = lg;
        ctx.fillRect(0, 0, W, H);
        const bloom = ctx.createRadialGradient(W * 0.8, H * 0.08, 0, W * 0.8, H * 0.08, H * 0.75);
        bloom.addColorStop(0, "rgba(200,230,255,0.4)");
        bloom.addColorStop(1, "rgba(200,230,255,0)");
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, W, H);
      }
    };

    /* ── Hex grid ── */
    const drawHexGrid = (cells: HexCell[], t: number) => {
      ctx.save();
      cells.forEach(cell => {
        // Random cell lighting
        if (!cell.lit && Math.random() < 0.0003) {
          cell.lit = true;
          cell.litTimer = 80 + Math.random() * 120;
        }
        if (cell.lit) {
          cell.litTimer--;
          cell.fillAlpha = Math.min(cell.fillAlpha + 0.015, 0.07);
          if (cell.litTimer <= 0) {
            cell.lit = false;
            cell.fillAlpha = 0;
          }
        }

        hexPath(cell.cx, cell.cy, cell.size - 2);
        ctx.globalAlpha = cell.fillAlpha;
        ctx.fillStyle = rgb(cell.color);
        ctx.fill();
        ctx.globalAlpha = cell.alpha + (cell.lit ? 0.04 : 0);
        ctx.strokeStyle = rgb(cell.color);
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });
      ctx.restore();
    };

    /* ── Waveforms ── */
    const drawWaveforms = (bands: WaveformPoint[][], t: number) => {
      ctx.save();
      const dark = darkRef.current;
      const segW = W / 119;
      bands.forEach((pts, bi) => {
        const baseAlpha = dark ? 0.06 - bi * 0.008 : 0.035 - bi * 0.005;
        ctx.beginPath();
        pts.forEach((pt, i) => {
          const x = i * segW;
          const y = pt.baseY + Math.sin(t * pt.freq * 60 + i * 0.18 + pt.phase) * pt.amp;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.globalAlpha = baseAlpha;
        ctx.strokeStyle = rgb(pts[0].color);
        ctx.lineWidth = dark ? 1.2 : 0.8;
        ctx.stroke();
      });
      ctx.restore();
    };

    /* ── Ripple pulses ── */
    const drawPulses = (pulses: GridPulse[]) => {
      ctx.save();
      pulses.forEach(p => {
        p.r += p.speed;
        if (p.r > p.maxR) {
          p.r = 0;
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.maxR = 80 + Math.random() * 140;
        }
        const fade = 1 - p.r / p.maxR;
        ctx.globalAlpha = p.alpha * fade;
        ctx.strokeStyle = rgb(p.color);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        // inner ring
        if (p.r > 12) {
          ctx.globalAlpha = p.alpha * fade * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.restore();
    };

    /* ── Scan beams ── */
    const drawScanBeams = (beams: ScanBeam[]) => {
      ctx.save();
      const dark = darkRef.current;
      beams.forEach(b => {
        b.angle += b.speed;
        // Sweep gradient
        const sweepLen = Math.PI * 0.4;

        // Draw as a filled arc sector
        ctx.globalAlpha = b.alpha;
        const grd = ctx.createLinearGradient(
          b.cx + Math.cos(b.angle - sweepLen) * b.radius,
          b.cy + Math.sin(b.angle - sweepLen) * b.radius,
          b.cx + Math.cos(b.angle) * b.radius,
          b.cy + Math.sin(b.angle) * b.radius
        );
        grd.addColorStop(0, rgb(b.color, 0));
        grd.addColorStop(1, rgb(b.color, dark ? 0.22 : 0.1));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(b.cx, b.cy);
        ctx.arc(b.cx, b.cy, b.radius, b.angle - sweepLen, b.angle);
        ctx.closePath();
        ctx.fill();

        // Circle outline
        ctx.globalAlpha = b.alpha * 0.35;
        ctx.strokeStyle = rgb(b.color);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.arc(b.cx, b.cy, b.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair
        ctx.globalAlpha = b.alpha * 0.2;
        ctx.beginPath();
        ctx.moveTo(b.cx - b.radius, b.cy);
        ctx.lineTo(b.cx + b.radius, b.cy);
        ctx.moveTo(b.cx, b.cy - b.radius);
        ctx.lineTo(b.cx, b.cy + b.radius);
        ctx.stroke();
      });
      ctx.restore();
    };

    /* ── Terminal chars ── */
    const drawTermChars = (chars: TerminalChar[], dt: number) => {
      ctx.save();
      ctx.font = "11px 'Courier New', monospace";
      ctx.textAlign = "center";
      const dark = darkRef.current;
      chars.forEach((c, idx) => {
        c.age += dt * 0.016;
        const mid = c.lifespan * 0.5;
        const fadeIn = Math.min(c.age / (c.lifespan * 0.2), 1);
        const fadeOut = c.age > mid ? 1 - (c.age - mid) / (c.lifespan - mid) : 1;
        c.alpha = fadeIn * fadeOut * (dark ? 0.55 : 0.28);
        if (c.age >= c.lifespan) {
          chars[idx] = spawnTermChar(W, H, dark ? DARK_PALETTE : LIGHT_PALETTE);
          return;
        }
        ctx.globalAlpha = c.alpha;
        ctx.fillStyle = rgb(c.color);
        ctx.fillText(c.char, c.x, c.y);
      });
      ctx.restore();
    };

    /* ── Node network ── */
    const drawNodes = (nodes: TechNode[], edges: [number, number][], t: number) => {
      ctx.save();
      const dark = darkRef.current;

      // Edges
      edges.forEach(([i, j]) => {
        const ni = nodes[i], nj = nodes[j];
        const dx = ni.x - nj.x, dy = ni.y - nj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = (1 - dist / 0.16) * (dark ? 0.18 : 0.1);
        if (alpha <= 0) return;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = rgb(ni.color);
        ctx.lineWidth = 0.7;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(ni.x * W, ni.y * H);
        ctx.lineTo(nj.x * W, nj.y * H);
        ctx.stroke();
      });

      // Nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;

        const pulse = 0.5 + 0.5 * Math.sin(t * n.pulseSpeed + n.pulse);
        const baseA = dark ? 0.55 : 0.35;
        const a = baseA * pulse + (dark ? 0.12 : 0.06);
        const cx = n.x * W, cy = n.y * H, r = n.radius;

        ctx.globalAlpha = a;
        ctx.fillStyle = rgb(n.color);
        ctx.strokeStyle = rgb(n.color);
        ctx.lineWidth = 0.8;

        if (n.type === "dot") {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (n.type === "square") {
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        } else if (n.type === "diamond") {
          ctx.beginPath();
          ctx.moveTo(cx, cy - r * 1.3);
          ctx.lineTo(cx + r * 1.3, cy);
          ctx.lineTo(cx, cy + r * 1.3);
          ctx.lineTo(cx - r * 1.3, cy);
          ctx.closePath();
          ctx.fill();
        } else {
          // ring
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glow halo (dark mode)
        if (dark) {
          const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 5);
          halo.addColorStop(0, rgb(n.color, 0.15 * pulse));
          halo.addColorStop(1, rgb(n.color, 0));
          ctx.globalAlpha = 1;
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();
    };

    /* ── Data streams ── */
    const drawStreams = (nodes: TechNode[], edges: [number, number][], streams: DataStream[]) => {
      ctx.save();
      const dark = darkRef.current;
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

        // Trail
        const tp = Math.max(0, s.progress - s.trailLength);
        const tx = (na.x + (nb.x - na.x) * tp) * W;
        const ty = (na.y + (nb.y - na.y) * tp) * H;
        const trail = ctx.createLinearGradient(tx, ty, x, y);
        trail.addColorStop(0, rgb(s.color, 0));
        trail.addColorStop(1, rgb(s.color, dark ? 0.6 : 0.35));
        ctx.globalAlpha = 1;
        ctx.strokeStyle = trail;
        ctx.lineWidth = dark ? 1.6 : 1.2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Head dot
        ctx.globalAlpha = dark ? 0.9 : 0.65;
        ctx.fillStyle = rgb(s.color);
        ctx.beginPath();
        ctx.arc(x, y, dark ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        // Bright head flare (dark only)
        if (dark) {
          const flare = ctx.createRadialGradient(x, y, 0, x, y, 7);
          flare.addColorStop(0, rgb(s.color, 0.5));
          flare.addColorStop(1, rgb(s.color, 0));
          ctx.globalAlpha = 1;
          ctx.fillStyle = flare;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();
    };

    /* ── Dashed grid lines (very subtle) ── */
    const drawDashedGrid = () => {
      const dark = darkRef.current;
      ctx.save();
      ctx.globalAlpha = dark ? 0.03 : 0.025;
      ctx.strokeStyle = dark ? "rgba(0,200,255,1)" : "rgba(0,100,200,1)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 14]);
      const GRID = 80;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    };

    /* ── Frame loop ── */
    let lastTs = 0;
    const frame = (ts: number) => {
      const dt = Math.min(ts - lastTs, 32);
      lastTs = ts;
      const t = ts * 0.001;
      const { nodes, edges, streams, pulses, waveforms, hexCells, termChars, scanBeams } = sceneData;

      drawBackground();
      drawDashedGrid();
      drawHexGrid(hexCells, t);
      drawWaveforms(waveforms, t);
      drawPulses(pulses);
      drawScanBeams(scanBeams);
      drawNodes(nodes, edges, t);
      drawStreams(nodes, edges, streams);
      drawTermChars(termChars, dt);

      rafRef.current = requestAnimationFrame(frame);
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
    />
  );
}
