export type CrackerType = "rocket" | "anaar" | "chakri" | "phuljhadi" | "bomb" | "laddi" | "shots10" | "sutli";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; color: string; size: number; gravity: number;
}
interface Emitter {
  kind: CrackerType;
  x: number; y: number; ty: number;
  life: number; max: number; angle: number;
  sway?: number;
  shots?: number;
  shotIndex?: number;
  nextShot?: number;
  sx?: number;
  sy?: number;
}

const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const PALETTE = ["#ffb627", "#ffd977", "#ff8a5c", "#ff6b8a", "#7be0d4", "#b58cff", "#fff1d6", "#ff5a5a", "#2ecc71"];

export class FireworkEngine {
  private w = 0;
  private h = 0;
  private quality = 1;
  particles: Particle[] = [];
  emitters: Emitter[] = [];
  flash = 0;

  setSize(w: number, h: number) { this.w = w; this.h = h; }
  setQuality(q: number) { this.quality = q; }

  ignite(type: CrackerType, x: number, y: number) {
    const q = this.quality;
    const px = Math.max(8, Math.min(this.w - 8, x));
    const py = Math.max(12, Math.min(this.h - 8, y));
    if (type === "bomb") {
      this.burst(px, py, Math.round(150 * q), 8.2);
      this.flash = 0.8;
      return;
    }
    if (type === "rocket") {
      this.emitters.push({ kind: "rocket", x: px, y: this.h + 4, ty: py, life: 0, max: 1e6, angle: 0 });
      return;
    }
    if (type === "laddi") {
      this.emitters.push({ kind: "laddi", x: px, y: this.h + 4, ty: py, life: 0, max: 1e6, angle: 0 });
      return;
    }
    if (type === "shots10") {
      this.emitters.push({ kind: "shots10", x: px, y: py, ty: py, life: 0, max: 1e6, angle: 0, shots: 10, shotIndex: 0, nextShot: 0 });
      return;
    }
    if (type === "sutli") {
      this.emitters.push({ kind: "sutli", x: px - this.w * 0.18, y: py, ty: px + this.w * 0.18, life: 0, max: 1e6, angle: 0, sx: px - this.w * 0.18, sy: py });
      return;
    }
    const max = type === "phuljhadi" ? 210 : type === "anaar" ? 135 : type === "chakri" ? 160 : 95;
    this.emitters.push({ kind: type, x: px, y: py, ty: py, life: 0, max, angle: 0 });
  }

  private add(p: Particle) {
    if (this.particles.length < 1100) this.particles.push(p);
  }

  private burst(x: number, y: number, count: number, speed: number) {
    const a = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const b = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    for (let i = 0; i < count; i++) {
      const ang = rnd(0, TAU);
      const v = speed * rnd(0.35, 1);
      this.add({
        x, y,
        vx: Math.cos(ang) * v,
        vy: Math.sin(ang) * v,
        life: rnd(45, 85), max: 85,
        color: i % 3 === 0 ? "#fff1d6" : i % 3 === 1 ? a : b,
        size: rnd(1.4, 2.6),
        gravity: 0.055,
      });
    }
  }

  private smallPop(x: number, y: number, count: number, speed: number) {
    const a = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    for (let i = 0; i < count; i++) {
      const ang = rnd(0, TAU);
      const v = speed * rnd(0.4, 1);
      this.add({
        x, y,
        vx: Math.cos(ang) * v,
        vy: Math.sin(ang) * v,
        life: rnd(25, 45), max: 45,
        color: i % 2 === 0 ? "#fff1d6" : a,
        size: rnd(1.0, 2.0),
        gravity: 0.07,
      });
    }
  }

  update() {
    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const e = this.emitters[i];
      const q = this.quality;
      if (e.kind === "rocket") {
        e.sway = (e.sway || 0) + 0.09;
        e.y -= 9.5;
        e.x += Math.sin(e.sway) * 1.1;
        this.add({
          x: e.x + rnd(-1.2, 1.2), y: e.y,
          vx: rnd(-0.3, 0.3), vy: rnd(0.4, 1.4),
          life: 20, max: 20, color: "#ffd47a", size: 1.5, gravity: 0.02,
        });
        if (e.y <= e.ty) {
          this.burst(e.x, e.y, Math.round(90 * q), rnd(4.5, 6.2));
          this.flash = Math.max(this.flash, 0.12);
          this.emitters.splice(i, 1);
        }
        continue;
      }
      if (e.kind === "laddi") {
        e.sway = (e.sway || 0) + 0.07;
        e.y -= 6.5;
        e.x += Math.sin(e.sway) * 0.8;
        this.add({
          x: e.x + rnd(-1.5, 1.5), y: e.y,
          vx: rnd(-0.4, 0.4), vy: rnd(0.6, 1.6),
          life: 24, max: 24, color: "#ffd47a", size: 1.6, gravity: 0.02,
        });
        if (e.y <= e.ty) {
          const cx = e.x;
          for (let k = 0; k < 20; k++) {
            const t = k / 20;
            const ang = -Math.PI / 2 + (t * Math.PI);
            const v = rnd(2.2, 5.0);
            this.add({
              x: cx, y: e.y,
              vx: Math.cos(ang) * v, vy: Math.sin(ang) * v,
              life: rnd(30, 50), max: 50,
              color: PALETTE[k % PALETTE.length],
              size: rnd(1.2, 2.2),
              gravity: 0.06,
            });
          }
          this.flash = Math.max(this.flash, 0.1);
          this.emitters.splice(i, 1);
        }
        continue;
      }
      if (e.kind === "shots10") {
        e.nextShot = (e.nextShot || 0) + 1;
        const gap = Math.max(6, Math.round(14 / q));
        if (e.nextShot >= gap && (e.shotIndex || 0) < (e.shots || 10)) {
          const rx = e.x + rnd(-this.w * 0.12, this.w * 0.12);
          const ry = Math.max(this.h * 0.12, this.h * 0.35 + rnd(0, this.h * 0.25));
          this.emitters.push({ kind: "rocket", x: rx, y: this.h + 4, ty: ry, life: 0, max: 1e6, angle: 0 });
          e.shotIndex = ((e.shotIndex || 0) + 1);
          e.nextShot = 0;
        }
        if (((e.shotIndex || 0) >= (e.shots || 10)) && e.life > 60) {
          this.emitters.splice(i, 1);
        } else {
          e.life++;
          if (e.life >= 1e6) e.life = 0;
        }
        continue;
      }
      if (e.kind === "sutli") {
        e.life++;
        const sx = e.sx ?? e.x;
        const sy = e.sy ?? e.y;
        if (e.life % Math.max(4, Math.round(10 / q)) === 0) {
          this.smallPop(sx, sy, 10, rnd(1.6, 3.0));
          this.flash = Math.max(this.flash, 0.06);
          e.sx = sx + this.w * 0.025;
        }
        if ((e.sx ?? 0) > e.ty) {
          this.emitters.splice(i, 1);
        }
        continue;
      }
      e.life++;
      if (e.kind === "anaar") {
        for (let k = 0; k < Math.max(2, Math.round(4 * q)); k++) {
          this.add({
            x: e.x + rnd(-2, 2), y: e.y,
            vx: rnd(-1.5, 1.5), vy: -rnd(4.2, 8.5),
            life: rnd(38, 70), max: 70,
            color: Math.random() < 0.55 ? "#ffb627" : "#ff8a5c",
            size: rnd(1.5, 2.4), gravity: 0.13,
          });
        }
      } else if (e.kind === "chakri") {
        e.angle += 0.42;
        for (let k = 0; k < Math.max(2, Math.round(3 * q)); k++) {
          const a = e.angle + k * (TAU / 3);
          const r = 13;
          this.add({
            x: e.x + Math.cos(a) * r, y: e.y + Math.sin(a) * r,
            vx: -Math.sin(a) * 4.6 + Math.cos(a) * 1.4,
            vy: Math.cos(a) * 4.6 + Math.sin(a) * 1.4,
            life: rnd(20, 34), max: 34,
            color: k % 2 ? "#7be0d4" : "#ffb627",
            size: 2, gravity: 0.02,
          });
        }
      } else {
        for (let k = 0; k < Math.max(3, Math.round(5 * q)); k++) {
          const a = rnd(0, TAU), v = rnd(0.7, 3.4);
          this.add({
            x: e.x, y: e.y,
            vx: Math.cos(a) * v, vy: Math.sin(a) * v,
            life: rnd(12, 30), max: 30,
            color: Math.random() < 0.3 ? "#ffffff" : "#ffd47a",
            size: rnd(1.1, 1.9), gravity: 0.06,
          });
        }
      }
      if (e.life >= e.max) this.emitters.splice(i, 1);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.life--;
      if (p.life <= 0 || p.x < -30 || p.x > this.w + 30 || p.y > this.h + 40) this.particles.splice(i, 1);
    }
    if (this.flash > 0) this.flash = Math.max(0, this.flash - 0.045);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of this.particles) {
      const a = Math.max(0, p.life / p.max);
      ctx.globalAlpha = a * 0.18;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.6, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TAU);
      ctx.fill();
    }
    if (this.flash > 0) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(255,241,214,${this.flash})`;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    ctx.restore();
  }
}
