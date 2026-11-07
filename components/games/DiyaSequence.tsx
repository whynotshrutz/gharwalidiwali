"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";
import { addCoins } from "@/lib/crackers";

const PADS = [
  { color: "#f5c04a", glow: "#fff0bd" },
  { color: "#e8735a", glow: "#ffc9ad" },
  { color: "#7be0d4", glow: "#ccfff8" },
  { color: "#c9a0ff", glow: "#eeddff" },
];

type Phase = "idle" | "showing" | "input" | "over";

const randomPad = () => Math.floor(Math.random() * PADS.length);

export default function DiyaSequence() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const flash = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelAwarded = useRef(false);

  const start = useCallback(() => {
    if (flash.current) clearTimeout(flash.current);
    setSequence([randomPad()]);
    setStep(0);
    setActive(null);
    setPhase("showing");
  }, []);

  useEffect(() => {
    if (phase !== "showing" || sequence.length === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    sequence.forEach((pad, i) => {
      timers.push(setTimeout(() => setActive(pad), i * 600));
      timers.push(setTimeout(() => setActive(null), i * 600 + 380));
    });
    timers.push(setTimeout(() => {
      setActive(null);
      setStep(0);
      setPhase("input");
    }, sequence.length * 600 + 180));
    return () => timers.forEach(clearTimeout);
  }, [phase, sequence]);

  useEffect(() => () => { if (flash.current) clearTimeout(flash.current); }, []);

  useEffect(() => {
    if (sequence.length >= 5 && !levelAwarded.current) {
      levelAwarded.current = true;
      addCoins(25);
    }
    if (sequence.length < 5) levelAwarded.current = false;
  }, [sequence.length]);

  const tap = (pad: number) => {
    if (phase !== "input") return;
    if (flash.current) clearTimeout(flash.current);
    setActive(pad);
    flash.current = setTimeout(() => setActive(null), 170);

    if (sequence[step] !== pad) {
      setBest((b) => Math.max(b, sequence.length - 1));
      setPhase("over");
      return;
    }

    if (step + 1 >= sequence.length) {
      if (flash.current) clearTimeout(flash.current);
      setBest((b) => Math.max(b, sequence.length));
      setStep(0);
      setSequence((s) => [...s, randomPad()]);
      setPhase("showing");
    } else {
      setStep((s) => s + 1);
    }
  };

  const status =
    phase === "idle"
      ? "Watch the lamps light up, then repeat the order."
      : phase === "showing"
        ? `Watch closely — ${sequence.length} lamp${sequence.length === 1 ? "" : "s"} to remember.`
        : phase === "input"
          ? "Your turn — repeat the glow."
          : `The lamps slipped away. You remembered ${best} in a row.`;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--cream-dim)]">Remember the glow · One player</p>

      <div className="mx-auto mt-4 grid max-w-[300px] grid-cols-2 gap-3">
        {PADS.map((pad, i) => {
          const lit = active === i;
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={phase !== "input"}
              aria-label={`Lamp ${i + 1}${lit ? ", lit" : ""}`}
              className="relative grid aspect-square place-items-center rounded-2xl border border-white/10 transition-all duration-150 disabled:cursor-default"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${pad.glow}, ${pad.color})`,
                opacity: lit ? 1 : phase === "input" ? 0.85 : 0.4,
                transform: lit ? "scale(1.05)" : "scale(1)",
                boxShadow: lit ? `0 0 36px 8px ${pad.color}88, inset 0 0 22px ${pad.glow}` : "inset 0 0 0 1px rgba(255,255,255,.06)",
              }}
            >
              <Flame size={30} className="text-white/80" style={{ filter: lit ? "drop-shadow(0 0 10px #fff)" : "none" }} />
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className={`mt-4 text-center text-sm ${phase === "over" ? "text-[var(--gold-soft)]" : "text-[var(--cream-dim)]"}`}>{status}</p>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-white/5 px-3 py-1">Level {sequence.length || 1}</span>
        <span className="rounded-full bg-white/5 px-3 py-1">Best {best}</span>
      </div>

      <button onClick={start} className="mt-4 w-full rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]">
        {phase === "idle" ? "Start sequence" : "Restart"}
      </button>
    </div>
  );
}
