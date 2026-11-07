"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Flame, Grid3X3, Play, Timer, Waves, X, type LucideIcon } from "lucide-react";
import DiyaMatch from "@/components/games/DiyaMatch";
import TicTacToe from "@/components/games/TicTacToe";
import DiyaSequence from "@/components/games/DiyaSequence";
import TapTheDiya from "@/components/games/TapTheDiya";

const GAMES: { id: "match" | "tictactoe" | "sequence" | "tap"; title: string; blurb: string; tag: string; icon: LucideIcon }[] = [
  { id: "match", title: "Diya Match", blurb: "Flip the cards and pair all six glowing diyas.", tag: "Memory · 6 pairs", icon: Flame },
  { id: "tictactoe", title: "Tic Tac Toe", blurb: "Line up three diyas before the friendly star does.", tag: "Strategy · vs computer", icon: Grid3X3 },
  { id: "sequence", title: "Diya Sequence", blurb: "Watch the lamps light up, then repeat the order.", tag: "Memory · Simon-style", icon: Waves },
  { id: "tap", title: "Tap the Diya", blurb: "Light as many diyas as you can in twenty seconds.", tag: "Reflex · 20 seconds", icon: Timer },
];

type GameId = (typeof GAMES)[number]["id"];

function GameBody({ id }: { id: GameId }) {
  switch (id) {
    case "match": return <DiyaMatch />;
    case "tictactoe": return <TicTacToe />;
    case "sequence": return <DiyaSequence />;
    case "tap": return <TapTheDiya />;
  }
}

export default function GamesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <GamesLayer onClose={onClose} />;
}

function GamesLayer({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<GameId | null>(null);
  const activeRef = useRef<GameId | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = GAMES.find((g) => g.id === active);

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (activeRef.current) setActive(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    const focus = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      clearTimeout(focus);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="games-title">
      <button aria-label="Close games" onClick={onClose} className="absolute inset-0 bg-[#050814]/75 backdrop-blur-md" tabIndex={-1} />

      <div className="glass relative flex max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-3xl shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="eyebrow">The Diwali games corner</p>
            <h2 id="games-title" className="title-serif mt-1 text-2xl font-semibold">{current?.title ?? "Games"}</h2>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close games" className="flex h-9 w-9 flex-none items-center justify-center rounded-full hover:bg-white/10"><X size={17} /></button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {active ? (
            <>
              <button onClick={() => setActive(null)} className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs hover:bg-white/5">
                <ArrowLeft size={13} /> All games
              </button>
              <GameBody id={active} />
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--cream-dim)]">Quick single-player games to keep the rooftop glowing.</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {GAMES.map((game) => {
                  const Icon = game.icon;
                  return (
                    <button
                      key={game.id}
                      onClick={() => setActive(game.id)}
                      className="group flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[#111833]/60 p-3 text-left transition hover:border-[var(--gold)]/50 hover:bg-[#1b2447]"
                    >
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold)]"><Icon size={20} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{game.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-[var(--cream-dim)]">{game.blurb}</span>
                        <span className="mt-1.5 block text-[10px] uppercase tracking-[0.16em] text-[var(--gold-soft)]/80">{game.tag}</span>
                      </span>
                      <Play size={13} className="mt-1 flex-none text-[var(--gold)] opacity-0 transition group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
