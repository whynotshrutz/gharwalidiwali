"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";

const DURATION = 20;

type Target = { key: number; x: number; y: number };

export default function TapTheDiya() {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [targets, setTargets] = useState<Target[]>([]);
  const nextKey = useRef(0);
  const scoreRef = useRef(0);
  const leftRef = useRef(DURATION);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  const spawn = useCallback((): Target => ({
    key: nextKey.current++,
    x: 10 + Math.random() * 80,
    y: 14 + Math.random() * 72,
  }), []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearInterval);
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setTargets([]);
    setBest((b) => Math.max(b, scoreRef.current));
    setPhase("over");
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    scoreRef.current = 0;
    leftRef.current = DURATION;
    setScore(0);
    setLeft(DURATION);
    setPhase("playing");
    setTargets([spawn()]);
    timers.current.push(setInterval(() => setTargets((ts) => [...ts.slice(-2), spawn()]), 850));
    timers.current.push(setInterval(() => {
      leftRef.current = Math.max(0, leftRef.current - 1);
      setLeft(leftRef.current);
      if (leftRef.current === 0) finish();
    }, 1000));
  }, [clearTimers, finish, spawn]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const hit = (key: number) => {
    if (phase !== "playing") return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setTargets((ts) => [...ts.filter((t) => t.key !== key).slice(-2), spawn()]);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--cream-dim)]">20 seconds · Tap the glowing diyas</p>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0b1024]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle, rgba(232,207,143,.5) 1px, transparent 1.4px)", backgroundSize: "34px 30px" }} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(217,164,65,.18),transparent_70%)]" aria-hidden="true" />

        {targets.map((t) => (
          <button
            key={t.key}
            onClick={() => hit(t.key)}
            aria-label="Light the diya"
            className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-95"
            style={{ left: `${t.x}%`, top: `${t.y}%`, background: "radial-gradient(circle at 40% 35%, #fff0bd, #f5c04a 60%, #c9843a)", boxShadow: "0 0 22px 6px rgba(245,192,74,.45)" }}
          >
            <Flame size={20} className="text-[#5a2f0a]" />
          </button>
        ))}

        {phase !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-[#050814]/55 backdrop-blur-[2px]">
            <div className="px-4 text-center">
              <Flame size={26} className="mx-auto mb-2 text-[var(--gold)]" />
              <p className="text-sm text-[var(--cream-dim)]">
                {phase === "idle" ? "Tap the diyas as fast as they appear." : `You lit ${score} diyas!`}
              </p>
              {phase === "over" && <p className="mt-1 text-xs text-[var(--gold-soft)]">Best this visit: {Math.max(best, score)}</p>}
              <button onClick={start} className="mt-3 rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]">
                {phase === "idle" ? "Play" : "Play again"}
              </button>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2.5 text-xs">
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-[var(--gold-soft)]">Diya {score}</span>
          <span className="rounded-full bg-black/40 px-2.5 py-1">{left}s</span>
        </div>
      </div>

      <p aria-live="polite" className="mt-3 text-center text-sm text-[var(--cream-dim)]">
        {phase === "playing" ? `${left} seconds left — tap the glow!` : "Every tap keeps the rooftop bright."}
      </p>
    </div>
  );
}
