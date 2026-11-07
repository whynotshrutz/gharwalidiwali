"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Candy, Flame, Flower2, PartyPopper, Sparkles, Star, type LucideIcon } from "lucide-react";
import { addCoins } from "@/lib/crackers";

const PAIRS: { key: string; icon: LucideIcon; color: string }[] = [
  { key: "diya", icon: Flame, color: "#f5c04a" },
  { key: "star", icon: Star, color: "#ffe9b0" },
  { key: "lotus", icon: Flower2, color: "#f08a9a" },
  { key: "spark", icon: Sparkles, color: "#7be0d4" },
  { key: "sweet", icon: Candy, color: "#d9b3ff" },
  { key: "cracker", icon: PartyPopper, color: "#ff9f6b" },
];

interface Card { id: number; pair: string; }

function buildDeck(): Card[] {
  const deck: Card[] = [];
  PAIRS.forEach((p) => {
    deck.push({ id: deck.length, pair: p.key });
    deck.push({ id: deck.length, pair: p.key });
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function DiyaMatch() {
  const [deck, setDeck] = useState<Card[]>(buildDeck);
  const [up, setUp] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matchAwarded = useRef(false);

  const newGame = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setDeck(buildDeck());
    setUp([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const won = matched.length === 12;

  useEffect(() => {
    if (won && !matchAwarded.current) {
      matchAwarded.current = true;
      addCoins(25);
    }
    if (!won) matchAwarded.current = false;
  }, [won]);

  const flip = (index: number) => {
    if (locked || up.includes(index) || matched.includes(index)) return;
    if (up.length === 0) { setUp([index]); return; }
    const first = up[0];
    setUp([first, index]);
    setMoves((m) => m + 1);
    if (deck[first].pair === deck[index].pair) {
      setMatched((m) => [...m, first, index]);
      setUp([]);
    } else {
      setLocked(true);
      timer.current = setTimeout(() => { setUp([]); setLocked(false); }, 720);
    }
  };

  const status = useMemo(() => {
    if (won) return `All six pairs matched in ${moves} moves. Shubh Deepawali!`;
    if (matched.length) return `${matched.length / 2} of 6 pairs matched. ${moves} moves.`;
    return "Find all six pairs of diyas.";
  }, [won, moves, matched.length]);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--cream-dim)]">Six pairs · 12 cards</p>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-2.5" role="grid" aria-label="Diya match board">
        {deck.map((card, i) => {
          const pair = PAIRS.find((p) => p.key === card.pair)!;
          const Icon = pair.icon;
          const faceUp = up.includes(i) || matched.includes(i);
          const isMatched = matched.includes(i);
          return (
            <button
              key={card.id}
              onClick={() => flip(i)}
              disabled={isMatched}
              aria-label={faceUp ? `Card ${i + 1}, ${pair.key}${isMatched ? ", matched" : ""}` : `Card ${i + 1}, face down`}
              className={`group relative grid aspect-square place-items-center rounded-xl border transition-all duration-300 ${
                isMatched
                  ? "border-[var(--gold)]/50 bg-[var(--gold)]/10"
                  : faceUp
                    ? "border-[var(--line)] bg-[#1b2447]"
                    : "border-[var(--line)] bg-[#111833] hover:border-[var(--gold)]/60"
              }`}
            >
              {faceUp ? (
                <span className="flex flex-col items-center gap-1" style={{ color: pair.color, filter: `drop-shadow(0 0 ${isMatched ? 10 : 5}px ${pair.color}66)`, opacity: isMatched ? 1 : 0.95 }}>
                  <Icon size={26} strokeWidth={1.6} />
                </span>
              ) : (
                <span className="relative flex h-full w-full items-center justify-center">
                  <span className="absolute inset-2 rounded-lg border border-[var(--gold)]/15" />
                  <Flame size={16} className="text-[var(--gold)]/40" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p aria-live="polite" className={`text-sm ${won ? "text-[var(--gold-soft)]" : "text-[var(--cream-dim)]"}`}>{status}</p>
        <span className="flex-none rounded-full bg-white/5 px-3 py-1 text-xs">{moves} moves</span>
      </div>

      <button onClick={newGame} className="mt-4 w-full rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]">New game</button>
    </div>
  );
}
