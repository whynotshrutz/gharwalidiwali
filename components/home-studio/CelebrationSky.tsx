"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FireworkEngine, type CrackerType } from "@/lib/fireworks";

export type SkyController = { ignite: (type: CrackerType, x?: number, y?: number) => void };

interface Ember { x: number; y: number; r: number; vy: number; vx: number; p: number; }

export default function CelebrationSky({ cracker, light, controllerRef, onIgnite }: {
  cracker: CrackerType;
  light: boolean;
  controllerRef: React.MutableRefObject<SkyController | null>;
  onIgnite?: (type: CrackerType) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ cracker, light, onIgnite });
  useEffect(() => { live.current = { cracker, light, onIgnite }; }, [cracker, light, onIgnite]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, W = 0, H = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const engine = new FireworkEngine();
    let embers: Ember[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.setSize(W, H);
      engine.setQuality(W < 640 ? 0.55 : 1);
      embers = Array.from({ length: W < 640 ? 14 : 26 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: rnd(0.6, 2.1), vy: -rnd(0.05, 0.28), vx: rnd(-0.06, 0.06), p: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      const base = live.current.light ? "120,78,52" : "255,205,120";
      for (const e of embers) {
        if (!reduced) { e.x += e.vx; e.y += e.vy; }
        if (e.y < -10) { e.y = H + 10; e.x = Math.random() * W; }
        if (e.x < -10) e.x = W + 10;
        if (e.x > W + 10) e.x = -10;
        const a = (live.current.light ? 0.10 : 0.16) + 0.10 * Math.abs(Math.sin(t * 0.001 + e.p));
        ctx.fillStyle = `rgba(${base},${a})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      engine.update();
      engine.draw(ctx);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    controllerRef.current = { ignite: (type, x, y) => engine.ignite(type, x ?? rnd(W * 0.18, W * 0.82), y ?? rnd(H * 0.12, H * 0.42)) };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      engine.ignite(live.current.cracker, e.clientX - r.left, e.clientY - r.top);
      live.current.onIgnite?.(live.current.cracker);
    };
    canvas.addEventListener("pointerdown", onPointer);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointer);
      controllerRef.current = null;
    };
  }, [controllerRef, reduced]);

  return <canvas ref={ref} className="absolute inset-0 z-20 h-full w-full cursor-crosshair touch-manipulation" aria-hidden="true" />;
}
