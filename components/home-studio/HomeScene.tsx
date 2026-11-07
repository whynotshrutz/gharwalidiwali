"use client";
import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Download, Home, X, SlidersHorizontal, Pencil } from "lucide-react";
import { toPng } from "html-to-image";
import JhalarCanvas from "@/components/jhalar-editor/JhalarCanvas";
import JhalarToolbar from "@/components/jhalar-editor/JhalarToolbar";
import CrackerTray from "@/components/ghat/CrackerTray";
import CelebrationSky, { type SkyController } from "@/components/home-studio/CelebrationSky";
import RooftopScene from "@/components/home-studio/RooftopScene";
import type { CrackerType } from "@/lib/fireworks";
import type { JhalarItem, ImageTransform, ColorPresetId, JhalarAnimation, JhalarShape } from "@/types";

const uid = () => Math.random().toString(36).slice(2, 9);

export default function HomeScene({ onCrackle }: { onCrackle?: (type: CrackerType) => void }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [cracker, setCracker] = useState<CrackerType>("rocket");
  const [transform, setTransform] = useState<ImageTransform>({ x: 0, y: 0, scale: 1, fit: "cover" });
  const [jhalars, setJhalars] = useState<JhalarItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ past: JhalarItem[][]; future: JhalarItem[][] }>({ past: [], future: [] });
  const [previewing, setPreviewing] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const sky = useRef<SkyController | null>(null);
  const welcomed = useRef(false);
  const sel = jhalars.find(j => j.id === selectedId);

  useEffect(() => {
    if (!celebrate) { welcomed.current = false; return; }
    if (welcomed.current) return;
    welcomed.current = true;
    const t = setTimeout(() => sky.current?.ignite("rocket"), 700);
    return () => clearTimeout(t);
  }, [celebrate]);

  const push = (next: JhalarItem[]) => { setHistory(h => ({ past: [...h.past.slice(-29), jhalars], future: [] })); setJhalars(next); };
  const update = (id: string, patch: Partial<JhalarItem>) => setJhalars(bs => bs.map(b => b.id === id ? { ...b, ...patch } : b));
  const openPicker = () => fileRef.current?.click();

  const handleFile = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("That is not quite a photo. Try a JPG, PNG or WebP?"); return; }
    if (f.size > 15 * 1024 * 1024) { setError("That photo is a little too heavy (over 15 MB). Try a lighter one?"); return; }
    const url = URL.createObjectURL(f);
    const probe = new Image();
    probe.onload = () => {
      setError("");
      setTransform({ x: 0, y: 0, scale: 1, fit: "cover" });
      setImgUrl(url);
      setToolsOpen(false);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError("That photo refused to open. A JPG, PNG or WebP should behave.");
    };
    probe.src = url;
  };

  useEffect(() => () => { if (imgUrl) URL.revokeObjectURL(imgUrl); }, [imgUrl]);

  const download = async () => {
    if (!exportRef.current) return;
    try {
      const data = await toPng(exportRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.download = "ghar-wali-diwali.png";
      a.href = data;
      a.click();
    } catch {
      setError("The export got shy in this browser. Try a smaller photo?");
    }
  };

  const addItem = (shape: JhalarShape, lit = false) => {
    const diya = shape === "diya";
    const n: JhalarItem = {
      id: uid(), x: innerWidth / 2, y: 150 + jhalars.length * 24,
      width: diya ? 120 : 320, rotation: 0, preset: "golden" as ColorPresetId,
      customColor: "#ff5a5a", brightness: 1, animation: "twinkle" as JhalarAnimation,
      sag: .55, shape, lit,
    };
    push([...jhalars, n]);
    setSelectedId(n.id);
    setToolsOpen(true);
  };

  const enterCelebrate = () => {
    setSelectedId(null);
    setPreviewing(false);
    setToolsOpen(false);
    setCelebrate(true);
  };
  const exitCelebrate = () => setCelebrate(false);
  const pickCracker = (t: CrackerType) => { setCracker(t); sky.current?.ignite(t); onCrackle?.(t); };

  return <div
    className="relative h-full w-full"
    onDragOver={e => { e.preventDefault(); if (!celebrate) setDragOver(true); }}
    onDragLeave={() => setDragOver(false)}
    onDrop={e => { e.preventDefault(); setDragOver(false); if (!celebrate) handleFile(e.dataTransfer.files?.[0]); }}
  >
    <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload home photograph" onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ""; }}/>

    {celebrate && <div className="absolute inset-0 z-0">
      <RooftopScene/>
      <CelebrationSky cracker={cracker} light={false} controllerRef={sky} onIgnite={onCrackle}/>
    </div>}

    {!celebrate && <div className="absolute inset-0 z-10">
      <div ref={exportRef} className="absolute inset-0">
        <JhalarCanvas imgUrl={imgUrl} transform={transform} jhalars={jhalars} selectedId={previewing ? null : selectedId} previewing={previewing} onSelect={setSelectedId} onMove={(id, x, y) => update(id, { x, y })} onResize={(id, width) => update(id, { width })} onRotate={(id, rotation) => update(id, { rotation })} onImageMove={setTransform}/>
        {previewing && <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full glass px-4 py-1.5 text-xs">Preview — your ghar, all lit up</div>}
      </div>
    </div>}

    {!celebrate && !imgUrl && <div className="absolute inset-0 z-10 grid place-items-center p-4">
      <div className="glass pointer-events-auto mx-auto max-w-md rounded-3xl p-6 text-center">
        <ImageIcon className="mx-auto mb-3 text-[var(--gold)]" size={30}/>
        <h2 className="title-serif text-2xl font-semibold">Bring Your Ghar to Diwali</h2>
        <p className="mt-2 text-sm text-[var(--cream-dim)]">Upload a photo of your home, drape it in jhalars, add a diya or two, and let it glow. Everything stays on your device — no uploads, no snooping.</p>
        <p className="mt-3 rounded-xl bg-[var(--gold)]/10 px-3 py-2 text-xs text-[var(--gold-soft)]">Pro tip: an evening or night photo glows the prettiest. Golden hour works too.</p>
        <button onClick={openPicker} className="mt-4 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]">Choose a photo</button>
        <p className="mt-2 text-[11px] text-[var(--cream-dim)]">or just drag a photo anywhere — we will not judge the mess</p>
        <p className="mt-2 text-xs text-[var(--gold-soft)]">JPG · PNG · WebP up to 15 MB</p>
      </div>
    </div>}

    {dragOver && <div className="pointer-events-none absolute inset-4 z-30 grid place-items-center rounded-3xl border-2 border-dashed border-[var(--gold)] bg-[#0a1024]/60 text-sm text-[var(--gold-soft)]">Drop it right here — let us make it glow</div>}

    {!celebrate && imgUrl && !previewing && <div className={`absolute right-3 top-[4.75rem] z-30 w-[min(264px,86vw)] sm:right-4 max-md:inset-x-3 max-md:bottom-[max(12px,env(safe-area-inset-bottom))] max-md:top-auto max-md:w-auto ${toolsOpen ? "" : "max-md:hidden"}`}>
      <div className="mb-2 flex items-center justify-between pl-1 md:hidden">
        <span className="eyebrow">Dress it up</span>
        <button onClick={() => setToolsOpen(false)} aria-label="Hide decoration tools" className="glass flex h-8 w-8 items-center justify-center rounded-full"><X size={15}/></button>
      </div>
      <JhalarToolbar selected={!!sel} preset={sel?.preset ?? "golden"} custom={sel?.customColor ?? "#ff5a5a"} brightness={sel?.brightness ?? 1} animation={sel?.animation ?? "steady"} shape={sel?.shape ?? "curved"} sag={sel?.sag ?? .55} lit={sel?.lit ?? false} canUndo={history.past.length > 0} canRedo={history.future.length > 0}
        onAdd={() => addItem("curved")} onAddDiya={() => addItem("diya")} onCelebrate={enterCelebrate}
        onPreset={p => sel && update(sel.id, { preset: p })} onCustom={c => sel && update(sel.id, { customColor: c, preset: "custom" })} onBrightness={v => sel && update(sel.id, { brightness: v })} onAnimation={a => sel && update(sel.id, { animation: a })} onShape={s => sel && update(sel.id, { shape: s })} onSag={v => sel && update(sel.id, { sag: v })} onLit={v => sel && update(sel.id, { lit: v })}
        onDelete={() => { if (!sel) return; push(jhalars.filter(j => j.id !== sel.id)); setSelectedId(null); }}
        onUndo={() => { const prev = history.past[history.past.length - 1]; if (!prev) return; setHistory(h => ({ past: h.past.slice(0, -1), future: [jhalars, ...h.future] })); setJhalars(prev); }}
        onRedo={() => { const nxt = history.future[0]; if (!nxt) return; setHistory(h => ({ past: [...h.past, jhalars], future: h.future.slice(1) })); setJhalars(nxt); }}
        onReset={() => { push([]); setSelectedId(null); setTransform({ x: 0, y: 0, scale: 1, fit: "cover" }); }}
        onDownload={download} previewing={previewing} onPreview={setPreviewing}/>
    </div>}

    {!celebrate && !toolsOpen && !previewing && imgUrl && <button onClick={() => setToolsOpen(true)} className="absolute bottom-[max(16px,env(safe-area-inset-bottom))] right-3 z-30 flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[#16121b] md:hidden"><SlidersHorizontal size={15}/> Decorate</button>}

    {previewing && <button onClick={() => setPreviewing(false)} className="glass absolute bottom-4 right-3 z-30 flex items-center gap-2 rounded-full px-4 py-2 text-sm"><Home size={15}/> Back to decorating</button>}

    {!celebrate && imgUrl && <button onClick={download} className="absolute bottom-4 left-3 z-30 flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)] md:hidden"><Download size={16}/> Save this glow</button>}

    {celebrate && <>
      <div className="absolute left-3 top-[4.75rem] z-30 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 sm:left-4">
        <button onClick={exitCelebrate} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Pencil size={14}/> Back to decorating</button>
        <span className="glass rounded-full px-3 py-1.5 text-xs text-[var(--gold-soft)]">Rooftop, but make it Diwali</span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <p className="text-center text-[11px] text-[var(--cream-dim)]">Pick a cracker, tap the rooftop sky, and act pleasantly surprised</p>
        <div className="pointer-events-auto max-w-full"><CrackerTray value={cracker} onChange={pickCracker} allUnlocked/></div>
      </div>
    </>}

    {error && <p role="alert" className="absolute bottom-24 left-1/2 z-40 w-[min(420px,90vw)] -translate-x-1/2 rounded-full bg-red-900/85 px-4 py-2 text-center text-sm">{error}</p>}
  </div>;
}
