"use client";
import { useSyncExternalStore } from "react";

export type CrackerId = "rocket" | "anaar" | "chakri" | "phuljhadi" | "bomb" | "laddi" | "shots10" | "sutli";

const FREE: CrackerId[] = ["rocket", "anaar", "chakri", "phuljhadi", "bomb"];

export const BUYABLE: { id: CrackerId; label: string; price: number }[] = [
  { id: "laddi", label: "Laddi", price: 25 },
  { id: "shots10", label: "10-in-1 Shots", price: 50 },
  { id: "sutli", label: "Sutli Bomb", price: 35 },
];

const KEY = "gwd:crackers:v1";

interface State { coins: number; owned: CrackerId[]; }

const EMPTY: State = { coins: 0, owned: [] };

let cache: State | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const s = parsed as Partial<State>;
    const coins = typeof s.coins === "number" && Number.isFinite(s.coins) ? s.coins : 0;
    const owned = Array.isArray(s.owned) ? s.owned.filter((id): id is CrackerId => FREE.includes(id as CrackerId) || BUYABLE.some((b) => b.id === id)) : [];
    cache = { coins, owned: [...new Set(owned)] };
  } catch {
    cache = { coins: 0, owned: [] };
  }
  return cache;
}

function write(next: State) {
  if (typeof window === "undefined") return { ok: true as const };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "This browser's storage is full." };
  }
}

function emit() { for (const l of listeners) l(); }

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => { cache = null; emit(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function useCrackers() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function getCrackers(): State { return read(); }

export function addCoins(amount: number) {
  const cur = read();
  const next: State = { coins: Math.max(0, cur.coins + amount), owned: [...cur.owned] };
  cache = next;
  const result = write(next);
  emit();
  return { ok: result.ok, coins: next.coins };
}

export function spendCoins(amount: number) {
  const cur = read();
  if (cur.coins < amount) return { ok: false, coins: cur.coins };
  const next: State = { coins: cur.coins - amount, owned: [...cur.owned] };
  cache = next;
  const result = write(next);
  emit();
  return { ok: result.ok, coins: next.coins };
}

export function ownCracker(id: CrackerId) {
  if (FREE.includes(id)) return { ok: true as const };
  const cur = read();
  if (cur.owned.includes(id)) return { ok: true as const };
  const next: State = { coins: cur.coins, owned: [...cur.owned, id] };
  cache = next;
  const result = write(next);
  emit();
  return { ok: result.ok };
}

export function isOwned(id: CrackerId) {
  if (FREE.includes(id)) return true;
  return read().owned.includes(id);
}
