"use client";
import { Moon, Home, LayoutGrid } from "lucide-react";
import type { SceneId } from "@/types";
const SCENES: { id: SceneId; label: string; icon: typeof Moon }[] = [
  { id: "ghat", label: "Ghat Nights", icon: Moon },
  { id: "home", label: "My Ghar", icon: Home },
  { id: "wall", label: "Diwali Wall", icon: LayoutGrid },
];
export default function SceneSwitcher({ scene, onChange }:{ scene:SceneId; onChange:(s:SceneId)=>void }){
  return <nav aria-label="Scene" className="glass flex rounded-full p-1">
    {SCENES.map(({ id, label, icon: Icon }) => {
      const active = scene === id;
      return <button key={id} onClick={() => onChange(id)} aria-pressed={active} title={label} aria-label={label}
        className={`flex items-center gap-2 rounded-full px-2.5 py-2 text-xs sm:px-3.5 sm:text-sm ${active ? "bg-[var(--gold)] font-semibold text-[#16121b]" : "hover:bg-white/10"}`}>
        <Icon size={15}/><span className="hidden md:inline">{label}</span>
      </button>;
    })}
  </nav>;
}
