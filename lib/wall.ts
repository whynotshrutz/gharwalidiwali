"use client";
import { useSyncExternalStore } from "react";

export type WallKind = "wish" | "feedback";

export interface WallPost {
  id: string;
  owner: string;
  name: string;
  text: string;
  kind: WallKind;
  image?: string;
  createdAt: number;
  hidden?: boolean;
}

const KEY = "gwd:wall:v1";
const OWNER_KEY = "gwd:wall:owner";
const LIMIT = 20;
const EMPTY: WallPost[] = [];

let cache: WallPost[] | null = null;
let ownerCache: string | null = null;
const listeners = new Set<() => void>();
let sharedLoaded = false;

function read(): WallPost[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((p): p is WallPost => !!p && typeof p.id === "string" && typeof p.createdAt === "number") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: WallPost[]) {
  if (typeof window === "undefined") return { ok: true as const };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "This browser's storage is full. Remove a photo post to make room." };
  }
}

function emit() { for (const l of listeners) l(); }

async function loadShared() {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/wall", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (data.shared && Array.isArray(data.posts)) {
      const shared = data.posts.filter((p: unknown): p is WallPost => !!p && typeof (p as WallPost).id === "string" && typeof (p as WallPost).createdAt === "number");
      const local = read();
      const byId = new Map<string, WallPost>();
      for (const p of shared) byId.set(p.id, p);
      for (const p of local) if (!byId.has(p.id)) byId.set(p.id, p);
      cache = [...byId.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, LIMIT);
      if (cache) write(cache);
      emit();
      sharedLoaded = true;
    }
  } catch { /* keep local */ }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!sharedLoaded) { void loadShared(); }
  const onStorage = () => { cache = null; ownerCache = null; emit(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function useWallPosts() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

function readOwner(): string {
  if (typeof window === "undefined") return "";
  if (ownerCache) return ownerCache;
  try {
    let v = localStorage.getItem(OWNER_KEY);
    if (!v) {
      v = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(OWNER_KEY, v);
    }
    ownerCache = v;
    return v;
  } catch {
    ownerCache = "anonymous";
    return ownerCache;
  }
}

const noopSubscribe = () => () => {};

export function useWallOwner() {
  return useSyncExternalStore(noopSubscribe, readOwner, () => "");
}

export function addPost(input: { name: string; text: string; kind: WallKind; image?: string }) {
  const owner = readOwner();
  const post: WallPost = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    owner,
    name: input.name,
    text: input.text,
    kind: input.kind,
    image: input.image,
    createdAt: Date.now(),
  };
  const next = [post, ...read()].slice(0, LIMIT);
  cache = next;
  const result = write(next);
  emit();
  void fetch("/api/wall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", post }) })
    .then(() => loadShared())
    .catch(() => {});
  return result;
}

export function removePost(id: string) {
  const next = read().filter((p) => p.id !== id);
  cache = next;
  const result = write(next);
  emit();
  void fetch("/api/wall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove", id }) })
    .then(() => loadShared())
    .catch(() => {});
  return result;
}

export function setPostHidden(id: string, hidden: boolean) {
  const next = read().map((p) => (p.id === id ? { ...p, hidden } : p));
  cache = next;
  const result = write(next);
  emit();
  void fetch("/api/wall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hide", id, hidden }) })
    .then(() => loadShared())
    .catch(() => {});
  return result;
}

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) { reject(new Error("Please choose an image file.")); return; }
    if (file.size > 20 * 1024 * 1024) { reject(new Error("That photo is larger than 20 MB.")); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const max = 800;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        const g = c.getContext("2d");
        if (!g) throw new Error("no canvas");
        g.fillStyle = "#0d1329";
        g.fillRect(0, 0, c.width, c.height);
        g.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.6));
      } catch {
        reject(new Error("That photo couldn't be prepared."));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That photo couldn't be opened. Try a JPG or PNG.")); };
    img.src = url;
  });
}
