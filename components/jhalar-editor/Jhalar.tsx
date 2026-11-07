"use client";
import { PRESETS, type JhalarItem } from "@/types";

export function bulbColors(item: JhalarItem) {
  return item.preset === "custom" ? [item.customColor, item.customColor, item.customColor] : PRESETS[item.preset].colors;
}

const LEAF = "#5c7a4b";

export default function Jhalar({ item, selected, onPointerDown }: { item: JhalarItem; selected: boolean; onPointerDown: (e: React.PointerEvent, id: string) => void }) {
  const cols = bulbColors(item);
  const flat = item.shape === "flat";
  const isDiya = item.shape === "diya";
  const bulge = item.shape === "curved" ? item.sag * 46 : 0;
  const vbH = isDiya ? 60 : flat ? 26 : Math.max(18, bulge + 18);
  const height = isDiya ? (item.width * vbH) / 100 : Math.max(flat ? 26 : 18, (item.width * vbH) / 100);
  const glowId = `diya-glow-${item.id}`;
  const anim = (i: number) => item.animation === "twinkle"
    ? "twinkleA 1.8s ease-in-out infinite"
    : item.animation === "chase"
      ? `chaseA 1.6s ease-in-out ${(i % 3) * 0.35}s infinite`
      : undefined;

  const lights = Array.from({ length: 16 }, (_, i) => {
    const t = i / 15;
    return { x: t * 100, y: flat ? 8 + Math.sin(t * Math.PI) * 2.4 : Math.sin(t * Math.PI) * bulge };
  });
  const flowers = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    return { x: 3 + t * 94, y: 9 + Math.sin(t * Math.PI) * 2.6, leaf: i % 2 === 0 };
  });
  const stringPath = item.shape === "curved" ? `M 0 0 Q 50 ${bulge * 1.7} 100 0` : "M 0 0 L 100 0";

  return <div data-jhalar onPointerDown={e => { e.stopPropagation(); onPointerDown(e, item.id); }}
    className="absolute cursor-grab active:cursor-grabbing touch-none"
    style={{ left: item.x, top: item.y, width: item.width, transform: `translate(-50%,-50%) rotate(${item.rotation}deg)`, filter: `drop-shadow(0 0 ${selected ? 6 : 2}px rgba(255,210,110,.35))` }}
    role="button" aria-label={`${isDiya ? `Diya ${item.lit ? "lit" : "unlit"}` : flat ? "Flower garland" : item.shape} decoration, ${PRESETS[item.preset as keyof typeof PRESETS]?.label ?? "custom"}, width ${Math.round(item.width)} pixels`} tabIndex={0}>
    <svg viewBox={`0 0 100 ${vbH}`} className="w-full overflow-visible" style={{ height }}>
      {!flat && !isDiya && <path d={stringPath} fill="none" stroke="rgba(20,16,8,.85)" strokeWidth="1.1" vectorEffect="non-scaling-stroke"/>}

      {isDiya
        ? <>
            <defs>
              <radialGradient id={glowId}>
                <stop offset="0%" stopColor="#ffe6a8" stopOpacity=".9"/>
                <stop offset="55%" stopColor="#ffbf55" stopOpacity=".3"/>
                <stop offset="100%" stopColor="#ffb84a" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {item.lit && <ellipse cx="50" cy="33" rx="38" ry="30" fill={`url(#${glowId})`} opacity={Math.min(1, item.brightness)}/>}
            <ellipse cx="50" cy="52" rx="28" ry="6" fill="#4a240b" opacity=".85"/>
            <path d="M19 38 Q50 61 81 38 L73 49 Q50 63 27 49 Z" fill="#8a4b16"/>
            <path d="M21 38 Q50 45 79 38 Q50 56 21 38 Z" fill="#b4762a"/>
            <path d="M28 41 Q50 49 72 41" fill="none" stroke="#e8b45a" strokeWidth="1.2" opacity=".55" vectorEffect="non-scaling-stroke"/>
            {item.lit
              ? <g className="flame">
                  <path d="M50 9 C58 19 63 25 58 33 C55 40 45 40 42 33 C37 25 42 19 50 9 Z" fill="#ffcf6a"/>
                  <path d="M50 18 C54 24 55 28 53 32 C51 36 47 36 46 32 C45 28 47 24 50 18 Z" fill="#fff4cf"/>
                </g>
              : <line x1="50" y1="38" x2="50" y2="31" stroke="#3a2410" strokeWidth="1.4" strokeLinecap="round"/>}
          </>
        : flat
        ? <>
            <path d="M 0 7.5 Q 50 12 100 7.5" fill="none" stroke="rgba(50,58,34,.6)" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
            {flowers.map((f, i) => {
              const c = cols[i % cols.length];
              return <g key={i} transform={`translate(${f.x} ${f.y})`} className="jhalar-bulb" style={{ animation: anim(i), animationDelay: `${(i % 5) * 0.24}s`, opacity: Math.min(1, item.brightness) }}>
                {f.leaf && <ellipse cx="2.9" cy="1.5" rx="2.5" ry="0.95" transform="rotate(24)" fill={LEAF} opacity=".8"/>}
                {f.leaf && <ellipse cx="-2.9" cy="1.5" rx="2.5" ry="0.95" transform="rotate(-24)" fill={LEAF} opacity=".8"/>}
                {Array.from({ length: 8 }, (_, p) => {
                  const a = (p * Math.PI) / 4;
                  return <ellipse key={p} cx={Math.cos(a) * 1.9} cy={Math.sin(a) * 1.9} rx="1.55" ry="1.1"
                    transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 1.9} ${Math.sin(a) * 1.9})`} fill={c}/>;
                })}
                <circle r="1.55" fill={c}/>
                <circle r="0.85" fill="#fff6dc" opacity=".9"/>
              </g>;
            })}
          </>
        : lights.map((p, i) => {
            const c = cols[i % cols.length];
            const h = flat ? 2 : 6.5;
            return <g key={i} className="jhalar-bulb" style={{ animation: anim(i), animationDelay: `${(i % 5) * 0.28}s` }}>
              <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 4} stroke="#241a0c" strokeWidth="1"/>
              <circle cx={p.x} cy={p.y + h} r="3.1" fill={c} opacity={Math.min(1, item.brightness)}/>
              <circle cx={p.x} cy={p.y + h} r="5.2" fill={c} opacity={.22 * Math.min(1.2, item.brightness)}/>
              <circle cx={p.x - .9} cy={p.y + h - 1.1} r="1" fill="#fff" opacity=".85"/>
            </g>;
          })}
    </svg>
    {selected && <div className="pointer-events-none absolute -inset-2 rounded-full border border-dashed border-[var(--gold)]/80" style={{ height: "100%" }}/>}
  </div>;
}
