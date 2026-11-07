"use client";
import { useState } from "react";
import { Coins, Rocket, Sparkles, X, Zap } from "lucide-react";
import type { CrackerType } from "@/lib/fireworks";
import { useCrackers, spendCoins, ownCracker, isOwned } from "@/lib/crackers";

const MARKET: { id: CrackerType; label: string; price: number; blurb: string; icon: typeof Zap }[] = [
  { id: "laddi", label: "Laddi", price: 25, blurb: "A garland of crackers that races up and pops in a bright line.", icon: Zap },
  { id: "shots10", label: "10-in-1 Shots", price: 50, blurb: "Ten colorful rockets launch in quick succession across the sky.", icon: Rocket },
  { id: "sutli", label: "Sutli Bomb", price: 35, blurb: "A string of ground crackers popping left to right with small bangs.", icon: Sparkles },
];

export default function BuyCrackersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { coins } = useCrackers();
  const [bought, setBought] = useState<string | null>(null);
  if (!open) return null;

  const buy = (id: CrackerType) => {
    const item = MARKET.find((m) => m.id === id);
    if (!item || isOwned(id)) return;
    const spent = spendCoins(item.price);
    if (spent.ok) {
      ownCracker(id);
      setBought(id);
      setTimeout(() => setBought(null), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="market-title">
      <button aria-label="Close market" onClick={onClose} className="absolute inset-0 bg-[#050814]/75 backdrop-blur-md" tabIndex={-1} />

      <div className="glass relative flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-3xl shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="eyebrow">Buy Firecrackers Market</p>
            <h2 id="market-title" className="title-serif mt-1 text-2xl font-semibold">Spend your Diwali coins</h2>
          </div>
          <button onClick={onClose} aria-label="Close market" className="flex h-9 w-9 flex-none items-center justify-center rounded-full hover:bg-white/10"><X size={17} /></button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-2 mb-6">
            <Coins size={18} className="text-[var(--gold)]" />
            <span className="text-sm font-semibold">Coins: <span className="text-[var(--gold-soft)]">{coins}</span></span>
          </div>

          <p className="text-sm text-[var(--cream-dim)] mb-4">Exclusive crackers — buy once, light anytime.</p>

          <div className="grid gap-3">
            {MARKET.map((item) => {
              const purchased = isOwned(item.id);
              const affordable = coins >= item.price;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 transition ${purchased
                    ? "border-[var(--gold)]/50 bg-[var(--gold)]/10"
                    : affordable
                      ? "border-[var(--line)] hover:border-[var(--gold)]/50 hover:bg-[#1b2447]"
                      : "border-[var(--line)]/40 opacity-70 bg-[#111833]"
                  }`}
                >
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold)]"><item.icon size={20} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{item.label}</span>
                      <span className="text-xs font-semibold">{purchased ? "Owned" : `${item.price} coins`}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--cream-dim)]/80">{item.blurb}</p>
                  </div>
                  <button
                    onClick={() => buy(item.id)}
                    disabled={purchased || !affordable}
                    className={`ml-3 flex-none rounded-full px-3 py-1.5 text-xs font-semibold transition ${purchased
                      ? "bg-[#111833] text-[var(--cream-dim)]/50"
                      : affordable
                        ? "bg-[var(--gold)] text-[#16121b] hover:bg-[var(--gold-soft)]"
                        : "bg-white/10 text-[var(--cream-dim)]/40"
                    }`}
                  >
                    {bought === item.id ? "Bought!" : purchased ? "Owned" : affordable ? "Buy" : "Too few coins"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
