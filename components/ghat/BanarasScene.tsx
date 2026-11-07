"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FireworkEngine, type CrackerType } from "@/lib/fireworks";

export type GhatController = { ignite: (type: CrackerType, x?: number, y?: number) => void };

interface Diya { x: number; y: number; s: number; spd: number; phase: number; }
interface Person { kind: "walk" | "light"; tier: "top" | "steps"; x: number; lane: number; dir: 1 | -1; speed: number; phase: number; carry: boolean; }

export default function BanarasScene({ fireworksOn, cracker, interactive, onIgnite, controllerRef }: {
  fireworksOn: boolean;
  cracker: CrackerType;
  interactive: boolean;
  onIgnite?: (type: CrackerType) => void;
  controllerRef?: React.MutableRefObject<GhatController | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const live = useRef({ fireworksOn, cracker, interactive, onIgnite });
  useEffect(() => { live.current = { fireworksOn, cracker, interactive, onIgnite }; }, [fireworksOn, cracker, interactive, onIgnite]);

  useEffect(() => {
    const canvas = canvasRef.current!, wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, W = 0, H = 0, backdrop: HTMLCanvasElement | null = null, lastT = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const engine = new FireworkEngine();
    const isMobile = () => W < 640;
    engine.setQuality(isMobile() ? 0.55 : 1);

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const buildBackdrop = () => {
      const off = document.createElement("canvas");
      off.width = Math.max(1, W * dpr);
      off.height = Math.max(1, H * dpr);
      const g = off.getContext("2d")!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const skyH = H * 0.66;
      const ghatBand = Math.min(skyH * 0.3, H * 0.18);
      const terraceY = skyH - ghatBand;
      const warm = (a: number) => `rgba(255,198,104,${a})`;

      const sky = g.createLinearGradient(0, 0, 0, skyH);
      sky.addColorStop(0, "#060a1a");
      sky.addColorStop(0.45, "#101733");
      sky.addColorStop(0.8, "#2a2143");
      sky.addColorStop(1, "#4a2c48");
      g.fillStyle = sky;
      g.fillRect(0, 0, W, skyH);

      for (let i = 0; i < (isMobile() ? 80 : 140); i++) {
        const sx = (i * 97.3) % W;
        const sy = (i * 53.7) % (skyH * 0.5);
        const big = i % 11 === 0;
        g.fillStyle = `rgba(243,233,210,${0.1 + 0.38 * Math.abs(Math.sin(i * 1.7))})`;
        g.fillRect(sx, sy, big ? 1.8 : 1, big ? 1.8 : 1);
      }

      const glow = g.createRadialGradient(W * 0.5, skyH, 8, W * 0.5, skyH, W * 0.68);
      glow.addColorStop(0, "rgba(217,164,65,.30)");
      glow.addColorStop(0.4, "rgba(140,80,95,.14)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = glow;
      g.fillRect(0, skyH - W * 0.45, W, W * 0.45);

      const moon = g.createRadialGradient(W * 0.82, H * 0.12, 2, W * 0.82, H * 0.12, 70);
      moon.addColorStop(0, "rgba(255,244,214,.85)");
      moon.addColorStop(0.25, "rgba(255,232,180,.35)");
      moon.addColorStop(1, "rgba(255,232,180,0)");
      g.fillStyle = moon;
      g.beginPath();
      g.arc(W * 0.82, H * 0.12, 70, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "rgba(255,247,225,.9)";
      g.beginPath();
      g.arc(W * 0.82, H * 0.12, 6.5, 0, Math.PI * 2);
      g.fill();

      const drawStringLights = (x1: number, y1: number, x2: number, sag: number, bulbs: number) => {
        const mx = (x1 + x2) / 2;
        const my = y1 + sag;
        g.strokeStyle = "rgba(15,10,8,.55)";
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(x1, y1);
        g.quadraticCurveTo(mx, my, x2, y1);
        g.stroke();
        for (let i = 1; i < bulbs; i++) {
          const t = i / bulbs;
          const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
          const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y1;
          g.fillStyle = "rgba(255,196,96,.14)";
          g.beginPath(); g.arc(px, py, 3.2, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(255,214,130,.75)";
          g.beginPath(); g.arc(px, py, 1.15, 0, Math.PI * 2); g.fill();
        }
      };

      const drawLightCurtain = (x0: number, x1: number, topY: number, bottomY: number, strands: number, bulbs: number) => {
        for (let s = 0; s < strands; s++) {
          const t = s / Math.max(1, strands - 1);
          const x = x0 + (x1 - x0) * t;
          g.strokeStyle = "rgba(15,10,8,.4)";
          g.lineWidth = 1;
          g.beginPath(); g.moveTo(x, topY); g.lineTo(x, bottomY); g.stroke();
          const step = (bottomY - topY) / bulbs;
          for (let b = 0; b < bulbs; b++) {
            const yy = topY + b * step;
            const xx = x;
            g.fillStyle = "rgba(255,196,96,.24)";
            g.beginPath(); g.arc(xx, yy, 2, 0, Math.PI * 2); g.fill();
            g.fillStyle = "rgba(255,214,130,.9)";
            g.beginPath(); g.arc(xx, yy, 0.9, 0, Math.PI * 2); g.fill();
          }
        }
      };

      const drawKandeel = (cx: number, cy: number, size: number) => {
        const glow = g.createRadialGradient(cx, cy, 0, cx, cy, size * 3.4);
        glow.addColorStop(0, "rgba(255,214,130,.42)");
        glow.addColorStop(1, "rgba(255,170,60,0)");
        g.fillStyle = glow;
        g.beginPath(); g.arc(cx, cy, size * 3.4, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "rgba(232,207,143,.22)";
        g.lineWidth = 1;
        g.beginPath(); g.moveTo(cx - size * 2.6, cy - size * 2.1); g.lineTo(cx + size * 2.6, cy - size * 2.1); g.stroke();
        g.beginPath(); g.moveTo(cx, cy - size * 2.1); g.lineTo(cx, cy - size); g.stroke();
        g.fillStyle = "#8a2f2f";
        g.beginPath();
        g.moveTo(cx, cy - size);
        g.lineTo(cx + size * 0.72, cy - size * 0.35);
        g.lineTo(cx + size * 0.58, cy + size * 0.55);
        g.lineTo(cx, cy + size * 0.9);
        g.lineTo(cx - size * 0.58, cy + size * 0.55);
        g.lineTo(cx - size * 0.72, cy - size * 0.35);
        g.closePath();
        g.fill();
        g.fillStyle = "rgba(255,214,130,.9)";
        g.beginPath(); g.arc(cx, cy, size * 0.3, 0, Math.PI * 2); g.fill();
      };

      const drawShikhara = (cx: number, baseY: number, width: number, height: number, color = "#151b3a", detail = true) => {
        g.fillStyle = color;
        g.beginPath();
        g.moveTo(cx - width / 2, baseY);
        g.bezierCurveTo(cx - width * 0.44, baseY - height * 0.45, cx - width * 0.3, baseY - height * 0.74, cx - width * 0.07, baseY - height);
        g.lineTo(cx + width * 0.07, baseY - height);
        g.bezierCurveTo(cx + width * 0.3, baseY - height * 0.74, cx + width * 0.44, baseY - height * 0.45, cx + width / 2, baseY);
        g.closePath();
        g.fill();
        g.fillRect(cx - width * 0.55, baseY - height * 0.06, width * 1.1, height * 0.06);
        if (!detail) return;
        g.strokeStyle = "rgba(201,164,92,.1)";
        g.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
          const t = i / 4;
          const half = (width / 2) * (1 - t * 0.8);
          const yy = baseY - height * t;
          g.beginPath(); g.moveTo(cx - half, yy); g.lineTo(cx + half, yy); g.stroke();
        }
        g.fillStyle = "#1b2244";
        g.beginPath(); g.ellipse(cx, baseY - height - width * 0.04, width * 0.2, width * 0.07, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgba(232,207,143,.5)";
        g.fillRect(cx - 1, baseY - height - width * 0.16, 2, width * 0.12);
        g.fillStyle = "rgba(214,104,70,.55)";
        g.beginPath();
        g.moveTo(cx + 1, baseY - height - width * 0.16);
        g.lineTo(cx + width * 0.2, baseY - height - width * 0.12);
        g.lineTo(cx + 1, baseY - height - width * 0.08);
        g.closePath();
        g.fill();
        g.strokeStyle = "rgba(255,198,104,.2)";
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(cx - width / 2, baseY);
        g.bezierCurveTo(cx - width * 0.44, baseY - height * 0.45, cx - width * 0.3, baseY - height * 0.74, cx - width * 0.07, baseY - height);
        g.stroke();
      };

      const drawChhatri = (cx: number, baseY: number, size: number) => {
        const r = size * 0.5;
        const colH = size * 0.5;
        g.fillStyle = "#101633";
        g.fillRect(cx - r * 0.78, baseY - colH, Math.max(2, r * 0.16), colH);
        g.fillRect(cx + r * 0.62, baseY - colH, Math.max(2, r * 0.16), colH);
        g.fillRect(cx - r, baseY - 4, size, 4);
        g.beginPath();
        g.ellipse(cx, baseY - colH, r, size * 0.42, 0, Math.PI, 0);
        g.closePath();
        g.fill();
        g.fillStyle = "rgba(232,207,143,.5)";
        g.fillRect(cx - 0.8, baseY - colH - size * 0.42 - 4, 1.6, 5);
      };

      const drawDome = (cx: number, baseY: number, size: number) => {
        const w = size;
        const h = size * 0.72;
        g.fillStyle = "#151b3a";
        g.beginPath();
        g.moveTo(cx - w / 2, baseY);
        g.bezierCurveTo(cx - w * 0.56, baseY - h * 0.5, cx - w * 0.18, baseY - h * 0.9, cx, baseY - h);
        g.bezierCurveTo(cx + w * 0.18, baseY - h * 0.9, cx + w * 0.56, baseY - h * 0.5, cx + w / 2, baseY);
        g.closePath();
        g.fill();
        g.fillRect(cx - w * 0.06, baseY - h - w * 0.14, w * 0.12, w * 0.16);
        g.fillStyle = "rgba(232,207,143,.55)";
        g.beginPath(); g.arc(cx, baseY - h - w * 0.18, Math.max(1.4, w * 0.035), 0, Math.PI * 2); g.fill();
        g.strokeStyle = "rgba(255,198,104,.2)";
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(cx - w / 2, baseY);
        g.bezierCurveTo(cx - w * 0.56, baseY - h * 0.5, cx - w * 0.18, baseY - h * 0.9, cx, baseY - h);
        g.stroke();
      };

      const drawBuilding = (bx: number, bw: number, bh: number, roof: "shikhara" | "dome" | "flat", seed: number) => {
        const x = bx * W;
        const w = bw * W;
        const h = skyH * bh;
        const y = terraceY - h;

        g.fillStyle = "#1a2350";
        g.fillRect(x, y, w, h);

        const shade = g.createLinearGradient(x, 0, x + w, 0);
        shade.addColorStop(0, "rgba(255,214,150,.06)");
        shade.addColorStop(0.55, "rgba(0,0,0,0)");
        shade.addColorStop(1, "rgba(0,0,0,.22)");
        g.fillStyle = shade;
        g.fillRect(x, y, w, h);

        const baseGlow = g.createLinearGradient(0, y + h * 0.55, 0, y + h);
        baseGlow.addColorStop(0, "rgba(255,198,104,0)");
        baseGlow.addColorStop(1, "rgba(255,198,104,.18)");
        g.fillStyle = baseGlow;
        g.fillRect(x, y + h * 0.55, w, h * 0.45);

        g.fillStyle = "rgba(201,164,92,.16)";
        g.fillRect(x, y + h * 0.16, w, 1);
        g.fillRect(x, y + h * 0.58, w, 1);

        const groundH = h * 0.34;
        const bays = Math.max(2, Math.round(w / (W * 0.07)));
        const bayW = w / bays;
        for (let c = 0; c < bays; c++) {
          const aw = bayW * 0.6;
          const ah = groundH * 0.7;
          const ax = x + c * bayW + (bayW - aw) / 2;
          const ay = y + h - ah;
          const lit = (c + seed) % 4 !== 0;
          g.fillStyle = lit ? warm(0.5 + (c % 2) * 0.16) : "rgba(7,10,22,.9)";
          g.beginPath();
          g.moveTo(ax, ay + ah);
          g.lineTo(ax, ay + aw * 0.5);
          g.arc(ax + aw * 0.5, ay + aw * 0.5, aw * 0.5, Math.PI, 0);
          g.lineTo(ax + aw, ay + ah);
          g.closePath();
          g.fill();
        }

        const upperTop = y + h * 0.14;
        const upperH = Math.max(h * 0.1, h - groundH - h * 0.2);
        const cols = Math.max(2, Math.round(w / (W * 0.026)));
        const rows = Math.max(1, Math.min(3, Math.round(upperH / (skyH * 0.055))));
        const padX = w * 0.12;
        const cellW = (w - padX * 2) / cols;
        const cellH = upperH / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ww = Math.min(cellW * 0.42, W * 0.014);
            const wh = Math.min(cellH * 0.6, ww * 1.25);
            const wx = x + padX + c * cellW + (cellW - ww) / 2;
            const wy = upperTop + r * cellH + (cellH - wh) / 2;
            const lit = (seed + r * 2 + c) % 3 !== 0;
            g.fillStyle = lit ? warm(0.44 + ((seed + r * 2 + c) % 3) * 0.12) : "rgba(8,11,24,.85)";
            g.beginPath();
            g.moveTo(wx, wy + wh);
            g.lineTo(wx, wy + ww * 0.5);
            g.arc(wx + ww * 0.5, wy + ww * 0.5, ww * 0.5, Math.PI, 0);
            g.lineTo(wx + ww, wy + wh);
            g.closePath();
            g.fill();
          }
        }

        g.fillStyle = "#0b1026";
        g.fillRect(x + 2, y + h - groundH - 3, w - 4, 4);
        g.fillStyle = "rgba(232,207,143,.2)";
        g.fillRect(x + 2, y + h - groundH - 3, w - 4, 1);
        g.strokeStyle = "rgba(201,164,92,.28)";
        g.lineWidth = 1;
        const rails = Math.max(3, Math.round(w / (W * 0.018)));
        for (let i = 0; i < rails; i++) {
          const rx = x + 4 + ((i + 0.5) * (w - 8)) / rails;
          g.beginPath(); g.moveTo(rx, y + h - groundH - 8); g.lineTo(rx, y + h - groundH - 4); g.stroke();
        }

        drawStringLights(x + 4, y + h * 0.16, x + w - 4, 4, Math.max(3, Math.round(w / (W * 0.03))));

        g.fillStyle = "#0d1229";
        g.fillRect(x - 2, y - 5, w + 4, 6);
        g.fillStyle = "rgba(232,207,143,.16)";
        g.fillRect(x - 2, y - 5, w + 4, 1);

        if (roof === "shikhara") {
          const shWidth = Math.min(w * 0.34, W * 0.06);
          const shHeight = Math.min(w * 0.9, skyH * 0.22);
          drawChhatri(x + w * 0.14, y - 4, w * 0.17);
          drawChhatri(x + w * 0.86, y - 4, w * 0.17);
          drawShikhara(x + w * 0.5, y - 4, shWidth, shHeight);
          const curtainTop = y + h * 0.1;
          const curtainStrands = Math.max(7, Math.round(w / (W * 0.013)));
          drawLightCurtain(x + 2, x + w - 2, curtainTop, terraceY - 4, curtainStrands, 12);
        } else if (roof === "dome") {
          drawChhatri(x + w * 0.14, y - 4, w * 0.16);
          drawDome(x + w * 0.5, y - 4, Math.min(w * 0.52, W * 0.08));
        } else {
          drawChhatri(x + w * 0.5, y - 4, Math.min(w * 0.24, W * 0.05));
          if (w > W * 0.13) {
            drawChhatri(x + w * 0.18, y - 4, w * 0.15);
            drawChhatri(x + w * 0.82, y - 4, w * 0.15);
          }
        }
      };

      const blocks: { x: number; w: number; h: number; roof: "shikhara" | "dome" | "flat"; seed: number }[] = [
        { x: 0.00, w: 0.15, h: 0.15, roof: "shikhara", seed: 1 },
        { x: 0.17, w: 0.11, h: 0.14, roof: "flat", seed: 5 },
        { x: 0.30, w: 0.12, h: 0.13, roof: "dome", seed: 2 },
        { x: 0.55, w: 0.15, h: 0.17, roof: "shikhara", seed: 3 },
        { x: 0.78, w: 0.10, h: 0.11, roof: "dome", seed: 4 },
      ];
      blocks.forEach((b) => drawBuilding(b.x, b.w, b.h, b.roof, b.seed));

      const kandeelSize = Math.max(2.6, W * 0.0055);
      [0.485, 0.74, 0.94].forEach((fx) => drawKandeel(fx * W, terraceY - skyH * 0.16, kandeelSize));

      const count = Math.max(8, Math.min(14, Math.round(ghatBand / 13)));
      const stepH = ghatBand / count;
      const joints = isMobile() ? 7 : 12;
      for (let i = 0; i < count; i++) {
        const y = terraceY + i * stepH;
        const t = i / count;
        const landing = i % 5 === 0 && i > 0;
        const tread = stepH * (landing ? 0.68 : 0.55);
        g.fillStyle = landing ? `hsl(32, 10%, ${30 - t * 7}%)` : `hsl(240, 8%, ${26 - t * 8}%)`;
        g.fillRect(0, y, W, tread + 0.4);
        g.fillStyle = `hsl(258, 18%, ${8 - t * 2}%)`;
        g.fillRect(0, y + tread, W, stepH - tread + 0.4);
        g.fillStyle = `rgba(244,200,125,${(landing ? 0.5 : 0.38) - t * 0.18})`;
        g.fillRect(0, y, W, landing ? 1.8 : 1.2);
        g.fillStyle = "rgba(0,0,0,.22)";
        g.fillRect(0, y + tread - 1, W, 1);
        g.strokeStyle = "rgba(0,0,0,.25)";
        g.lineWidth = 1;
        for (let j = 1; j < joints; j++) {
          const jx = (W / joints) * j + (i % 2) * (W / joints) * 0.5;
          g.beginPath(); g.moveTo(jx, y + tread); g.lineTo(jx, y + stepH); g.stroke();
        }
        if (i % 3 === 1) {
          const dots = isMobile() ? 5 : 9;
          for (let d = 0; d < dots; d++) {
            const dx = ((d + 0.5) / dots) * W + Math.sin(i * 2.3 + d) * 4;
            g.fillStyle = `rgba(255,198,104,${0.35 + 0.25 * Math.abs(Math.sin(d + i))})`;
            g.beginPath(); g.arc(dx, y + tread * 0.5, 1.1, 0, Math.PI * 2); g.fill();
          }
        }
      }

      [0.17, 0.46, 0.74].forEach((fx) => {
        const dx = fx * W;
        const dw = Math.max(6, W * 0.008);
        const grad = g.createLinearGradient(dx - dw / 2, 0, dx + dw / 2, 0);
        grad.addColorStop(0, "#1a1526");
        grad.addColorStop(0.5, "#3a2e3a");
        grad.addColorStop(1, "#151020");
        g.fillStyle = grad;
        g.fillRect(dx - dw / 2, terraceY, dw, ghatBand);
        g.fillStyle = "rgba(244,200,125,.3)";
        g.fillRect(dx - dw / 2, terraceY, dw, 1.5);
        g.fillStyle = warm(0.7);
        g.beginPath(); g.arc(dx, terraceY - 4, 1.6, 0, Math.PI * 2); g.fill();
      });

      g.fillStyle = "rgba(244,200,125,.16)";
      g.fillRect(0, skyH - 2, W, 2);

      drawStringLights(0, terraceY - 17, W, 6, Math.max(4, Math.round(W / (W * 0.035))));

      const haze = g.createLinearGradient(0, skyH - 44, 0, skyH);
      haze.addColorStop(0, "rgba(232,180,100,0)");
      haze.addColorStop(1, "rgba(232,180,100,.14)");
      g.fillStyle = haze;
      g.fillRect(0, skyH - 44, W, 44);
      return off;
    };

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.setSize(W, H);
      engine.setQuality(isMobile() ? 0.55 : 1);
      backdrop = buildBackdrop();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const diyas: Diya[] = Array.from({ length: reduced ? 10 : isMobile() ? 20 : 34 }, () => ({
      x: Math.random(), y: 0.68 + Math.random() * 0.3,
      s: 0.55 + Math.random() * 0.9,
      spd: (0.006 + Math.random() * 0.014) * (Math.random() < 0.5 ? -1 : 1),
      phase: Math.random() * Math.PI * 2,
    }));

    const boats = isMobile()
      ? [{ x: 0.16, y: 0.78, s: 0.9, p: 0.4 }, { x: 0.72, y: 0.86, s: 0.72, p: 2.2 }]
      : [{ x: 0.11, y: 0.77, s: 0.95, p: 0.4 }, { x: 0.7, y: 0.84, s: 0.75, p: 2.2 }, { x: 0.48, y: 0.93, s: 0.6, p: 4.1 }];

    const lighters = isMobile() ? 2 : 3;
    const topWalkers = isMobile() ? 2 : 3;
    const people: Person[] = Array.from({ length: isMobile() ? 6 : 11 }, (_, i) => {
      const light = i < lighters;
      const top = !light && i < lighters + topWalkers;
      return {
        kind: light ? "light" : "walk",
        tier: top ? "top" : "steps",
        x: light ? 0.12 + (i / Math.max(1, lighters - 1)) * 0.72 + rnd(-0.05, 0.05) : rnd(0.02, 0.98),
        lane: rnd(0.05, 0.95),
        dir: (Math.random() < 0.5 ? -1 : 1) as 1 | -1,
        speed: rnd(0.012, 0.024),
        phase: rnd(0, Math.PI * 2),
        carry: !light && Math.random() < 0.5,
      };
    });

    const drawBoat = (boat: { x: number; y: number; s: number; p: number }, t: number) => {
      const x = boat.x * W;
      const y = boat.y * H + Math.sin(t * 0.0004 + boat.p) * 2;
      const s = boat.s * Math.min(W / 1440, 1.2) + 0.3;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.fillStyle = "rgba(6,8,18,.9)";
      ctx.beginPath();
      ctx.moveTo(-46, 0);
      ctx.quadraticCurveTo(0, 20, 46, 0);
      ctx.quadraticCurveTo(0, 9, -46, 0);
      ctx.fill();
      ctx.fillStyle = "rgba(9,11,24,.95)";
      ctx.beginPath();
      ctx.moveTo(-20, -2);
      ctx.lineTo(20, -2);
      ctx.lineTo(13, -20);
      ctx.lineTo(-13, -20);
      ctx.closePath();
      ctx.fill();
      const lg = ctx.createRadialGradient(0, -10, 0, 0, -10, 34);
      lg.addColorStop(0, "rgba(255,220,140,.45)");
      lg.addColorStop(1, "rgba(255,200,100,0)");
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.arc(0, -10, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,206,120,.85)";
      ctx.beginPath(); ctx.arc(0, -12, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const drawDiya = (d: Diya, t: number) => {
      const x = d.x * W + Math.sin(t * 0.0002 + d.phase) * 10;
      const y = d.y * H + Math.sin(t * 0.0009 + d.phase) * 3;
      const s = 9 * d.s;
      const flick = 0.82 + Math.sin(t * 0.012 + d.phase * 3) * 0.18;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(232,180,70,${0.16 * flick})`;
      ctx.beginPath(); ctx.ellipse(0, s * 0.55, s * 1.7, s * 0.55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,214,120,.55)";
      ctx.beginPath(); ctx.ellipse(0, s * 0.35, s * 1.1, s * 0.32, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8a4b16";
      ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.52, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#b4762a";
      ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s * 0.92, s * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createRadialGradient(0, -s * 0.5, 0, 0, -s * 0.5, s * 1.15);
      g.addColorStop(0, `rgba(255,236,160,${0.95 * flick})`);
      g.addColorStop(0.4, `rgba(255,180,60,${0.75 * flick})`);
      g.addColorStop(1, "rgba(255,120,20,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(0, -s * 0.55, s * 0.42, s * 0.85, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const drawFlame = (x: number, y: number, t: number, phase: number, k: number) => {
      const fl = 0.85 + Math.sin(t * 0.01 + phase) * 0.15;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 2.6 * k);
      glow.addColorStop(0, `rgba(255,230,150,${0.85 * fl})`);
      glow.addColorStop(0.4, `rgba(255,170,60,${0.5 * fl})`);
      glow.addColorStop(1, "rgba(255,120,20,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x, y, 2.6 * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,244,200,${0.9 * fl})`;
      ctx.beginPath(); ctx.ellipse(x, y - 0.12, 0.22, 0.5, 0, 0, Math.PI * 2); ctx.fill();
    };

    const drawPerson = (p: Person, t: number) => {
      const backSky = H * 0.66;
      const ghatBand = Math.min(backSky * 0.3, H * 0.18);
      const terraceY = backSky - ghatBand;
      const stepTop = terraceY + ghatBand * 0.18;
      const stepBottom = H * 0.62 - ghatBand * 0.12;
      const isTop = p.tier === "top";
      const laneY = isTop
        ? terraceY + ghatBand * (0.03 + p.lane * 0.1)
        : stepTop + (stepBottom - stepTop) * p.lane;
      const s = isTop
        ? (H * 0.0062) * (0.9 + p.lane * 0.25)
        : (H * 0.0075) * (0.85 + p.lane * 0.5);
      const walking = p.kind === "walk";
      const swing = walking ? Math.sin(t * 0.004 + p.phase) : 0;
      const bob = walking ? Math.abs(Math.sin(t * 0.004 + p.phase)) * 0.18 : Math.sin(t * 0.0016 + p.phase) * 0.08;
      const body = "#0f0b14";
      const rim = "rgba(255,196,104,.24)";

      ctx.save();
      ctx.translate(p.x * W, laneY);
      ctx.scale(p.dir * s, s);
      ctx.translate(0, -bob);

      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.beginPath(); ctx.ellipse(0, 0.1, 2.6, 0.55, 0, 0, Math.PI * 2); ctx.fill();

      if (walking) {
        ctx.strokeStyle = body; ctx.lineWidth = 0.95; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-0.35, -1.7); ctx.lineTo(-0.45 - swing * 0.85, 0);
        ctx.moveTo(0.35, -1.7); ctx.lineTo(0.45 + swing * 0.85, 0);
        ctx.stroke();
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.moveTo(-0.95, -4.15);
        ctx.quadraticCurveTo(-1.15, -2.8, -0.75, -1.6);
        ctx.lineTo(0.75, -1.6);
        ctx.quadraticCurveTo(1.15, -2.8, 0.95, -4.15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = body; ctx.lineWidth = 0.8;
        const armSwing = -swing * 0.6;
        ctx.beginPath();
        ctx.moveTo(-0.8, -3.95); ctx.lineTo(-1.05 - armSwing, -2.15);
        ctx.moveTo(0.8, -3.95); ctx.lineTo(1.05 + armSwing, -2.15);
        ctx.stroke();
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.arc(0, -5.1, 1.02, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = rim; ctx.lineWidth = 0.28;
        ctx.beginPath(); ctx.arc(0, -5.1, 1.02, Math.PI * 0.95, Math.PI * 1.9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-0.9, -4.1); ctx.quadraticCurveTo(-0.5, -4.6, 0.1, -4.55); ctx.stroke();
        if (p.carry) drawFlame(1.25 + armSwing * 0.2, -2.15, t, p.phase, 1);
      } else {
        ctx.strokeStyle = body; ctx.lineWidth = 1; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-0.55, -1.55); ctx.lineTo(-0.9, -0.15); ctx.lineTo(-0.2, -0.05);
        ctx.stroke();
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.moveTo(-0.55, -1.55);
        ctx.quadraticCurveTo(-0.7, -3.1, -0.15, -4.1);
        ctx.quadraticCurveTo(0.6, -4.35, 0.85, -3.4);
        ctx.quadraticCurveTo(1, -2.5, 0.55, -1.55);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = body; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0.55, -3.3); ctx.lineTo(1.7, -1.5); ctx.stroke();
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.arc(0.25, -4.7, 1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = rim; ctx.lineWidth = 0.28;
        ctx.beginPath(); ctx.arc(0.25, -4.7, 1, Math.PI * 0.9, Math.PI * 1.85); ctx.stroke();
        ctx.fillStyle = "#8a4b16";
        ctx.beginPath(); ctx.ellipse(2.15, -0.15, 0.85, 0.38, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#b4762a";
        ctx.beginPath(); ctx.ellipse(2.15, -0.28, 0.72, 0.3, 0, 0, Math.PI * 2); ctx.fill();
        drawFlame(2.15, -0.55, t, p.phase, 1.05);
      }
      ctx.restore();
    };

    const waveY = (x: number, t: number, base: number) =>
      base + Math.sin(x * 0.012 + t * 0.0011) * 4 + Math.sin(x * 0.03 - t * 0.0017) * 2;

    const frame = (t: number) => {
      const skyH = H * 0.62;
      const dt = lastT ? Math.min(64, t - lastT) : 16;
      lastT = t;
      if (backdrop) ctx.drawImage(backdrop, 0, 0, W, H);

      const starCount = isMobile() ? 30 : 60;
      ctx.fillStyle = "rgba(243,233,210,.75)";
      for (let i = 0; i < starCount; i++) {
        const sx = (i * 97.3) % W;
        const sy = (i * 53.7) % (skyH * 0.24);
        ctx.globalAlpha = 0.25 + 0.55 * Math.abs(Math.sin(t * 0.0006 + i));
        ctx.fillRect(sx, sy, 1.3, 1.3);
      }
      ctx.globalAlpha = 1;

      const water = ctx.createLinearGradient(0, skyH, 0, H);
      water.addColorStop(0, "#141d3a");
      water.addColorStop(0.45, "#0d1530");
      water.addColorStop(1, "#070c1f");
      ctx.fillStyle = water;
      ctx.fillRect(0, skyH, W, H - skyH);

      const reflect = ctx.createLinearGradient(0, skyH, 0, skyH + (H - skyH) * 0.3);
      reflect.addColorStop(0, "rgba(232,180,90,.2)");
      reflect.addColorStop(1, "rgba(232,180,90,0)");
      ctx.fillStyle = reflect;
      ctx.fillRect(0, skyH, W, (H - skyH) * 0.3);

      for (let i = 0; i < 14; i++) {
        const x = ((i + 0.5) / 14) * W + Math.sin(t * 0.0006 + i) * 6;
        const len = (H - skyH) * (0.05 + ((i * 7) % 5) * 0.012);
        ctx.fillStyle = `rgba(255,198,104,${0.05 + 0.05 * Math.abs(Math.sin(t * 0.001 + i * 1.3))})`;
        ctx.fillRect(x, skyH + 2, 2, len);
      }

      ctx.strokeStyle = "rgba(232,207,143,.10)";
      ctx.lineWidth = 1;
      for (let y = skyH + 8; y < H; y += 13) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 18) ctx.lineTo(x, waveY(x, t, y));
        ctx.stroke();
      }

      for (let i = 0; i < 28; i++) {
        const rx = (i * 137) % W;
        const ry = skyH + 6 + ((i * 89) % Math.max(1, H - skyH - 16));
        ctx.fillStyle = `rgba(232,180,90,${0.1 + 0.12 * Math.abs(Math.sin(t * 0.001 + i))})`;
        ctx.fillRect(rx + Math.sin(t * 0.001 + i) * 6, ry, 26 + ((i * 7) % 30), 1.4);
      }

      ctx.strokeStyle = "rgba(232,207,143,.08)";
      ctx.lineWidth = 1;
      const edgeW = W * 0.1;
      for (let i = 0; i < 4; i++) {
        const ey = skyH + 22 + i * 24 + Math.sin(t * 0.001 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(0, ey);
        ctx.quadraticCurveTo(edgeW * 0.5, ey - 4 - i, edgeW, ey);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W, ey + 7);
        ctx.quadraticCurveTo(W - edgeW * 0.5, ey + 3 - i, W - edgeW, ey + 7);
        ctx.stroke();
      }

      people.forEach((p) => {
        if (p.kind === "walk") {
          p.x += p.dir * p.speed * dt / 1000;
          if (p.x < -0.07) p.x = 1.07;
          if (p.x > 1.07) p.x = -0.07;
        }
        drawPerson(p, t);
      });

      boats.forEach((b) => drawBoat(b, t));

      diyas.forEach((d) => {
        d.x += d.spd / 1000;
        if (d.x < -0.05) d.x = 1.05;
        if (d.x > 1.05) d.x = -0.05;
        drawDiya(d, t);
      });

      engine.update();
      engine.draw(ctx);

      const vignette = ctx.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.3, W / 2, H * 0.5, Math.max(W, H) * 0.75);
      vignette.addColorStop(0, "rgba(5,8,20,0)");
      vignette.addColorStop(1, "rgba(5,8,20,.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    if (controllerRef) {
      controllerRef.current = {
        ignite: (type, x, y) => engine.ignite(type, x ?? rnd(W * 0.2, W * 0.8), y ?? rnd(H * 0.14, H * 0.36)),
      };
    }

    const onPointer = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      engine.ignite(live.current.cracker, x, y);
      live.current.onIgnite?.(live.current.cracker);
    };
    canvas.addEventListener("pointerdown", onPointer);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointer);
      if (controllerRef) controllerRef.current = null;
    };
  }, [reduced, controllerRef]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full cursor-crosshair touch-manipulation" aria-hidden="true" />
    </div>
  );
}
