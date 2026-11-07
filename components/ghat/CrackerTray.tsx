"use client";
import { useState } from "react";
import { Bomb, Disc3, FlaskConical, Link, Rocket, Sparkles, Sun, Zap, type LucideIcon } from "lucide-react";
import type { CrackerType } from "@/lib/fireworks";
import { useCrackers, BUYABLE, isOwned, spendCoins, ownCracker } from "@/lib/crackers";

const FREE: { id: CrackerType; label: string; icon: LucideIcon }[] = [
  { id: "rocket", label: "Rocket", icon: Rocket },
  { id: "anaar", label: "Anaar", icon: FlaskConical },
  { id: "chakri", label: "Chakri", icon: Disc3 },
  { id: "phuljhadi", label: "Phuljhadi", icon: Sparkles },
  { id: "bomb", label: "Bomb", icon: Bomb },
];

const BUY_ICONS: Record<CrackerType, LucideIcon> = {
  rocket: Rocket, anaar: FlaskConical, chakri: Disc3, phuljhadi: Sparkles, bomb: Bomb,
  laddi: Zap, shots10: Sun, sutli: Link,
};

export default function CrackerTray({ value, onChange, allUnlocked = false }: { value: CrackerType; onChange: (t: CrackerType) => void; allUnlocked?: boolean }) {
  const { coins } = useCrackers();
  const [buying, setBuying] = useState<CrackerType | null>(null);

  const buy = (id: CrackerType) => {
    const item = BUYABLE.find((b) => b.id === id);
    if (!item) return;
    setBuying(id);
    const spent = spendCoins(item.price);
    if (spent.ok) {
      ownCracker(id);
      onChange(id);
    }
    setBuying(null);
  };

  const group = (title: string, items: { id: CrackerType; label: string; icon: LucideIcon }[]) => (
    <>
      <p className="mx-2 mb-1 text-[10px] uppercase tracking-[0.18em] text-[var(--cream-dim)]/70">{title}</p>
      <div className="flex gap-1">
        {items.map(({ id, label, icon: Icon }) => {
          const active = value === id;
          const owned = allUnlocked || isOwned(id);
          const item = BUYABLE.find((b) => b.id === id);
          const price = item ? item.price : 0;
          const affordable = coins >= price;
          const purchasable = !owned && item;
          return (
            <button
              key={id}
              onClick={owned || !purchasable ? () => onChange(id) : () => buy(id)}
              aria-pressed={active}
              aria-label={purchasable && !owned ? `Buy ${label} for ${price} coins` : `Light ${label}`}
              className={`flex flex-none items-center gap-1.5 rounded-full px-3 py-2 text-xs transition ${active
                ? "bg-[var(--gold)] font-semibold text-[#16121b]"
                : purchasing(id)
                  ? "bg-white/10"
                  : "hover:bg-white/10"
              } ${!owned && purchasable && !affordable ? "opacity-60" : ""}`}
              disabled={!owned && purchasable && !affordable}
            >
              <Icon size={14} />
              {purchasable && !owned ? (
                <span className="text-[10px] font-semibold">{price}</span>
              ) : (
                <span className="hidden sm:inline">{label}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );

  const purchasing = (id: CrackerType) => buying === id;

  return (
    <div className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Choose a cracker">
      {group("Firecrackers", FREE)}
      {group(allUnlocked ? "Special Firecrackers" : "Buy Firecrackers", BUYABLE.map(({ id, label }) => ({ id, label, icon: BUY_ICONS[id] })))}
    </div>
  );
}
