import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

// ---------- Data ----------

type City = { name: string; lat: number; lng: number; home?: boolean };

const CITIES: City[] = [
  { name: "Rio de Janeiro", lat: -22.9, lng: -43.2, home: true },
  { name: "São Paulo", lat: -23.5, lng: -46.6 },
  { name: "Buenos Aires", lat: -34.6, lng: -58.4 },
  { name: "Santiago", lat: -33.4, lng: -70.6 },
  { name: "Lima", lat: -12.0, lng: -77.0 },
  { name: "Bogotá", lat: 4.7, lng: -74.0 },
  { name: "Mexico City", lat: 19.4, lng: -99.1 },
  { name: "Miami", lat: 25.7, lng: -80.2 },
  { name: "New York", lat: 40.7, lng: -74.0 },
  { name: "Toronto", lat: 43.6, lng: -79.3 },
  { name: "Chicago", lat: 41.8, lng: -87.6 },
  { name: "San Francisco", lat: 37.7, lng: -122.4 },
  { name: "Los Angeles", lat: 34.0, lng: -118.2 },
  { name: "Vancouver", lat: 49.2, lng: -123.1 },
  { name: "London", lat: 51.5, lng: -0.1 },
  { name: "Dublin", lat: 53.3, lng: -6.2 },
  { name: "Paris", lat: 48.8, lng: 2.3 },
  { name: "Madrid", lat: 40.4, lng: -3.7 },
  { name: "Lisbon", lat: 38.7, lng: -9.1 },
  { name: "Berlin", lat: 52.5, lng: 13.4 },
  { name: "Amsterdam", lat: 52.4, lng: 4.9 },
  { name: "Stockholm", lat: 59.3, lng: 18.1 },
  { name: "Rome", lat: 41.9, lng: 12.5 },
  { name: "Istanbul", lat: 41.0, lng: 28.9 },
  { name: "Moscow", lat: 55.8, lng: 37.6 },
  { name: "Dubai", lat: 25.3, lng: 55.3 },
  { name: "Cairo", lat: 30.0, lng: 31.2 },
  { name: "Lagos", lat: 6.5, lng: 3.4 },
  { name: "Cape Town", lat: -33.9, lng: 18.4 },
  { name: "Nairobi", lat: -1.3, lng: 36.8 },
  { name: "Mumbai", lat: 19.1, lng: 72.9 },
  { name: "Delhi", lat: 28.7, lng: 77.1 },
  { name: "Bangkok", lat: 13.8, lng: 100.5 },
  { name: "Singapore", lat: 1.4, lng: 103.8 },
  { name: "Hong Kong", lat: 22.3, lng: 114.2 },
  { name: "Shanghai", lat: 31.2, lng: 121.5 },
  { name: "Beijing", lat: 39.9, lng: 116.4 },
  { name: "Tokyo", lat: 35.7, lng: 139.7 },
  { name: "Seoul", lat: 37.6, lng: 127.0 },
  { name: "Jakarta", lat: -6.2, lng: 106.8 },
  { name: "Sydney", lat: -33.9, lng: 151.2 },
  { name: "Auckland", lat: -36.8, lng: 174.8 },
];

const idx = (name: string) => CITIES.findIndex((c) => c.name === name);

// 25 connections — many starting in Rio (the home base)
const ARC_PAIRS: [number, number][] = [
  ["Rio de Janeiro", "New York"],
  ["Rio de Janeiro", "Lisbon"],
  ["Rio de Janeiro", "London"],
  ["Rio de Janeiro", "Tokyo"],
  ["Rio de Janeiro", "Sydney"],
  ["Rio de Janeiro", "Lagos"],
  ["Rio de Janeiro", "Dubai"],
  ["Rio de Janeiro", "Mexico City"],
  ["Rio de Janeiro", "São Paulo"],
  ["Rio de Janeiro", "Buenos Aires"],
  ["São Paulo", "Miami"],
  ["New York", "London"],
  ["London", "Berlin"],
  ["Paris", "Madrid"],
  ["Dubai", "Mumbai"],
  ["Mumbai", "Singapore"],
  ["Singapore", "Tokyo"],
  ["Tokyo", "Seoul"],
  ["Hong Kong", "Sydney"],
  ["San Francisco", "Tokyo"],
  ["Los Angeles", "Auckland"],
  ["Cape Town", "Lagos"],
  ["Nairobi", "Mumbai"],
  ["Vancouver", "Seoul"],
  ["Stockholm", "Moscow"],
].map(([a, b]) => [idx(a), idx(b)] as [number, number]);

// ---------- Math ----------

type Vec3 = { x: number; y: number; z: number };

function toVec(lat: number, lng: number): Vec3 {
  const φ = (lat * Math.PI) / 180;
  const λ = (lng * Math.PI) / 180;
  return {
    x: Math.cos(φ) * Math.sin(λ),
    y: Math.sin(φ),
    z: Math.cos(φ) * Math.cos(λ),
  };
}

function rotateY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
}
function rotateX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const Ω = Math.acos(dot);
  if (Ω < 1e-4) return a;
  const sΩ = Math.sin(Ω);
  const k0 = Math.sin((1 - t) * Ω) / sΩ;
  const k1 = Math.sin(t * Ω) / sΩ;
  return {
    x: a.x * k0 + b.x * k1,
    y: a.y * k0 + b.y * k1,
    z: a.z * k0 + b.z * k1,
  };
}

// ---------- Component ----------

export type GlobeAnchor = {
  cityIndex: number;
  /** screen-space target in normalized [0..1] of the canvas */
  target: { x: number; y: number };
  active: boolean;
};

type Props = {
  /** 0 → 1 scroll progress across the whole stage */
  progress: MotionValue<number>;
  /** 4 service anchors that "emerge" from the network in the final chapter */
  anchors?: GlobeAnchor[];
};

export function Globe({ progress, anchors }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const anchorsRef = useRef<GlobeAnchor[]>(anchors ?? []);

  useEffect(() => {
    anchorsRef.current = anchors ?? [];
  }, [anchors]);

  useEffect(() => {
    const unsub = progress.on("change", (v) => (progressRef.current = v));
    return unsub;
  }, [progress]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const SIGNAL = "244, 184, 96"; // warm amber
    const BONE = "245, 240, 225";
    const TILT = -0.4; // ~ -23°

    const draw = (now: number) => {
      const p = progressRef.current;
      const t = now / 1000;

      // ----- camera / size -----
      const isSmall = w < 720;
      const R = Math.min(w, h) * (isSmall ? 0.38 : 0.34);
      const cx = w * (isSmall ? 0.5 : 0.62);
      const cy = h * 0.5;

      // rotation: continuous slow drift + scroll-driven turn
      const rotY = t * 0.07 + p * Math.PI * 2.2;

      ctx.clearRect(0, 0, w, h);

      // ----- atmospheric glow -----
      const glow = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.7);
      glow.addColorStop(0, `rgba(${SIGNAL}, ${0.07 + p * 0.05})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // ----- inner sphere shading (faint) -----
      const shade = ctx.createRadialGradient(
        cx - R * 0.3,
        cy - R * 0.3,
        R * 0.1,
        cx,
        cy,
        R,
      );
      shade.addColorStop(0, `rgba(${BONE}, 0.025)`);
      shade.addColorStop(1, `rgba(${BONE}, 0)`);
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // ----- wireframe sphere -----
      const wireAlpha = Math.min(1, p / 0.08); // appear in the first 8% of scroll
      drawWireframe(ctx, cx, cy, R, rotY, TILT, wireAlpha, BONE);

      // ----- layer rings around equator (chapter 4: infrastructure layers) -----
      const layersAlpha = smoothstep(0.45, 0.6, p) * (1 - smoothstep(0.95, 1, p));
      if (layersAlpha > 0.01) drawLayerRings(ctx, cx, cy, R, layersAlpha, SIGNAL);

      // ----- arcs (data flows) -----
      const arcAlpha = smoothstep(0.18, 0.4, p);
      const arcCount = Math.floor(arcAlpha * ARC_PAIRS.length);
      drawArcs(ctx, cx, cy, R, rotY, TILT, ARC_PAIRS.slice(0, arcCount), t, SIGNAL, BONE);

      // ----- cities -----
      const cityAlpha = smoothstep(0.04, 0.18, p);
      drawCities(ctx, cx, cy, R, rotY, TILT, cityAlpha, t, SIGNAL, BONE);

      // ----- anchored service leaders (chapter 5) -----
      const anchAlpha = smoothstep(0.7, 0.86, p);
      if (anchAlpha > 0.01 && anchorsRef.current.length) {
        for (const a of anchorsRef.current) {
          if (!a.active) continue;
          const c = CITIES[a.cityIndex];
          if (!c) continue;
          let v = toVec(c.lat, c.lng);
          v = rotateY(v, rotY);
          v = rotateX(v, TILT);
          if (v.z < 0) continue;
          const sx = cx + v.x * R;
          const sy = cy - v.y * R;
          const tx = a.target.x * w;
          const ty = a.target.y * h;
          ctx.strokeStyle = `rgba(${SIGNAL}, ${anchAlpha * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          // gentle curve
          const mx = (sx + tx) / 2;
          const my = (sy + ty) / 2 - 30;
          ctx.quadraticCurveTo(mx, my, tx, ty);
          ctx.stroke();
          ctx.fillStyle = `rgba(${SIGNAL}, ${anchAlpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();
          // pulsing ring
          const pulse = (Math.sin(t * 3) + 1) / 2;
          ctx.strokeStyle = `rgba(${SIGNAL}, ${anchAlpha * (1 - pulse) * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx, sy, 4 + pulse * 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

// ---------- Drawing helpers ----------

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function drawWireframe(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  rotY: number,
  tilt: number,
  alpha: number,
  BONE: string,
) {
  ctx.lineWidth = 0.5;
  // meridians
  const meridianStep = 15;
  for (let lng = -180; lng < 180; lng += meridianStep) {
    ctx.beginPath();
    let started = false;
    for (let lat = -90; lat <= 90; lat += 4) {
      let v = toVec(lat, lng);
      v = rotateY(v, rotY);
      v = rotateX(v, tilt);
      if (v.z < -0.02) {
        started = false;
        continue;
      }
      const x = cx + v.x * R;
      const y = cy - v.y * R;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${BONE}, ${alpha * 0.07})`;
    ctx.stroke();
  }
  // parallels
  for (let lat = -75; lat <= 75; lat += 15) {
    ctx.beginPath();
    let started = false;
    for (let lng = -180; lng <= 180; lng += 4) {
      let v = toVec(lat, lng);
      v = rotateY(v, rotY);
      v = rotateX(v, tilt);
      if (v.z < -0.02) {
        started = false;
        continue;
      }
      const x = cx + v.x * R;
      const y = cy - v.y * R;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    const isEquator = lat === 0;
    ctx.strokeStyle = `rgba(${BONE}, ${alpha * (isEquator ? 0.14 : 0.07)})`;
    ctx.stroke();
  }
  // limb circle
  ctx.strokeStyle = `rgba(${BONE}, ${alpha * 0.18})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCities(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  rotY: number,
  tilt: number,
  alpha: number,
  t: number,
  SIGNAL: string,
  BONE: string,
) {
  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    let v = toVec(c.lat, c.lng);
    v = rotateY(v, rotY);
    v = rotateX(v, tilt);
    if (v.z < 0) continue;
    const x = cx + v.x * R;
    const y = cy - v.y * R;
    const depth = (v.z + 1) / 2; // 0.5..1 visible
    const a = alpha * (0.35 + depth * 0.65);

    if (c.home) {
      const pulse = (Math.sin(t * 2 + i) + 1) / 2;
      ctx.fillStyle = `rgba(${SIGNAL}, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${SIGNAL}, ${a * (1 - pulse) * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 3 + pulse * 12, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(${BONE}, ${a * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.1 + depth * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawArcs(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  rotY: number,
  tilt: number,
  pairs: [number, number][],
  t: number,
  SIGNAL: string,
  BONE: string,
) {
  const STEPS = 60;
  for (let i = 0; i < pairs.length; i++) {
    const [ai, bi] = pairs[i];
    const ca = CITIES[ai];
    const cb = CITIES[bi];
    if (!ca || !cb) continue;
    const va0 = toVec(ca.lat, ca.lng);
    const vb0 = toVec(cb.lat, cb.lng);

    ctx.lineWidth = 0.7;
    ctx.beginPath();
    let started = false;
    let lastVisible = false;
    const projected: Array<{ x: number; y: number; vis: boolean }> = [];
    for (let s = 0; s <= STEPS; s++) {
      const u = s / STEPS;
      const p = slerp(va0, vb0, u);
      // lift the arc slightly above the surface for a great-circle ribbon look
      const lift = 1 + 0.18 * Math.sin(u * Math.PI);
      let v: Vec3 = { x: p.x * lift, y: p.y * lift, z: p.z * lift };
      v = rotateY(v, rotY);
      v = rotateX(v, tilt);
      const vis = v.z > -0.05;
      const x = cx + v.x * R;
      const y = cy - v.y * R;
      projected.push({ x, y, vis });
      if (!vis) {
        started = false;
        lastVisible = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else if (lastVisible) {
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
      }
      lastVisible = true;
    }
    ctx.strokeStyle = `rgba(${BONE}, 0.25)`;
    ctx.stroke();

    // travelling data packet
    const speed = 0.18 + (i % 5) * 0.03;
    const u = (t * speed + i * 0.137) % 1;
    const k = Math.floor(u * STEPS);
    const pt = projected[k];
    if (pt && pt.vis) {
      ctx.fillStyle = `rgba(${SIGNAL}, 0.95)`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // halo
      ctx.fillStyle = `rgba(${SIGNAL}, 0.18)`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fill();
      // trail
      for (let tr = 1; tr <= 6; tr++) {
        const j = (k - tr + STEPS) % STEPS;
        const q = projected[j];
        if (!q || !q.vis) break;
        ctx.fillStyle = `rgba(${SIGNAL}, ${0.9 - tr * 0.14})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 1.4 - tr * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawLayerRings(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  alpha: number,
  SIGNAL: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  // squash to suggest perspective of equatorial ring
  ctx.scale(1, 0.32);
  for (let i = 0; i < 4; i++) {
    const r = R * (1.08 + i * 0.06);
    ctx.strokeStyle = `rgba(${SIGNAL}, ${alpha * (0.35 - i * 0.07)})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Useful for chapters to reference cities by name
export const GLOBE_CITIES = CITIES;
export const cityIdx = idx;