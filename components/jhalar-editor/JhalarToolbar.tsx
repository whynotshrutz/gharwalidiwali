"use client";
import { Plus, Sparkles, Trash2, Undo2, Redo2, RotateCcw, Download, Sun, Zap, Eye, Flame, Flower2 } from "lucide-react";
import { PRESETS, type ColorPresetId, type JhalarAnimation, type JhalarShape } from "@/types";

const SHAPES: { id: JhalarShape; label: string }[] = [
  { id: "curved", label: "Curved" },
  { id: "straight", label: "Straight" },
  { id: "flat", label: "Flowers" },
];

export default function JhalarToolbar(props:{ selected:boolean; preset:ColorPresetId; custom:string; brightness:number; animation:JhalarAnimation; shape:JhalarShape; sag:number; lit:boolean; canUndo:boolean; canRedo:boolean; onAdd:()=>void; onAddDiya:()=>void; onPreset:(p:ColorPresetId)=>void; onCustom:(c:string)=>void; onBrightness:(v:number)=>void; onAnimation:(a:JhalarAnimation)=>void; onShape:(s:JhalarShape)=>void; onSag:(v:number)=>void; onLit:(b:boolean)=>void; onDelete:()=>void; onUndo:()=>void; onRedo:()=>void; onReset:()=>void; onDownload:()=>void; onCelebrate:()=>void; previewing:boolean; onPreview:(b:boolean)=>void; }){
  return <div className="glass rounded-2xl p-3 shadow-2xl max-h-[68dvh] overflow-y-auto md:max-h-[86vh]" role="toolbar" aria-label="Jhalar editor">
    <div className="grid grid-cols-2 gap-2">
      <button onClick={props.onAdd} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-3 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]"><Plus size={16}/> Jhalar</button>
      <button onClick={props.onAddDiya} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gold)]/15 px-3 py-2.5 text-sm font-semibold text-[var(--gold-soft)] ring-1 ring-[var(--gold)]/45 hover:bg-[var(--gold)]/25"><Flame size={15}/> Diya</button>
    </div>
    <button onClick={props.onCelebrate} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--gold)]/55 px-4 py-2.5 text-sm text-[var(--gold-soft)] hover:bg-[var(--gold)]/10"><Sparkles size={15}/> Light the firecrackers</button>
    <div className={`mt-3 space-y-3 ${props.selected?"":"opacity-40 pointer-events-none"}`}>
      {props.shape === "diya" ? (
        <>
          <button onClick={()=>props.onLit(!props.lit)} aria-pressed={props.lit} className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${props.lit?"bg-[var(--gold)] text-black":"bg-white/5 text-[var(--gold-soft)] hover:bg-white/10"}`}><Flame size={14}/> {props.lit?"Diya is lit — blow it out":"Light the diya"}</button>
          <label className="block text-xs"><span className="flex items-center gap-1.5"><Sun size={13}/> Brightness</span><input type="range" min={.4} max={1.6} step={.05} value={props.brightness} onChange={e=>props.onBrightness(+e.target.value)} className="w-full accent-[var(--gold)]" aria-label="Brightness"/></label>
        </>
      ) : (
        <>
          <div>
            <p className="mb-1 text-xs text-[var(--cream-dim)]">Shape</p>
            <div className="grid grid-cols-3 gap-1" role="group" aria-label="Decoration shape">
              {SHAPES.map(s=>{
                const flower = s.id === "flat";
                const label = flower ? "Flowers" : s.label;
                return <button key={s.id} onClick={()=>props.onShape(s.id)} aria-pressed={props.shape===s.id} aria-label={label} title={label} className={`flex items-center justify-center rounded-lg px-1 py-1.5 text-[10px] ${props.shape===s.id?"bg-[var(--gold)] font-semibold text-black":"bg-white/5 hover:bg-white/10"}`}>{flower ? <Flower2 size={13}/> : s.label}</button>;
              })}
            </div>
          </div>
          {props.shape==="curved" && <label className="block text-xs"><span>Curve</span><input type="range" min={0} max={1} step={.05} value={props.sag} onChange={e=>props.onSag(+e.target.value)} className="w-full accent-[var(--gold)]" aria-label="Curve depth"/></label>}
          <div className="space-y-2">
            {([...(Object.keys(PRESETS) as (keyof typeof PRESETS)[]), "custom"] as ColorPresetId[]).map(p=>{
              const label=p==="custom"?"Custom":PRESETS[p as keyof typeof PRESETS].label; const sw=p==="custom"?[props.custom]:PRESETS[p as keyof typeof PRESETS].swatches; const active=props.preset===p;
              return <button key={p} onClick={()=>props.onPreset(p)} aria-pressed={active} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs ${active?"bg-white/10 ring-1 ring-[var(--gold)]":"hover:bg-white/5"}`}>
                <span className="flex -space-x-1">{sw.map((c,i)=><span key={i} className="h-4 w-4 rounded-full border border-black/30" style={{background:c}}/>)}</span><span className="flex-1">{label}</span>{active&&<span className="text-[var(--gold)]">●</span>}</button>; })}
            <label className="flex items-center gap-2 text-xs">Custom colour <input type="color" value={props.custom} onChange={e=>props.onCustom(e.target.value)} className="h-8 w-10 cursor-pointer rounded bg-transparent" aria-label="Custom bulb colour"/></label>
          </div>
          <label className="block text-xs"><span className="flex items-center gap-1.5"><Sun size={13}/> Brightness</span><input type="range" min={.4} max={1.6} step={.05} value={props.brightness} onChange={e=>props.onBrightness(+e.target.value)} className="w-full accent-[var(--gold)]" aria-label="Brightness"/></label>
          <div className="grid grid-cols-3 gap-1">{(["steady","twinkle","chase"] as JhalarAnimation[]).map(a=><button key={a} onClick={()=>props.onAnimation(a)} aria-pressed={props.animation===a} className={`rounded-lg px-2 py-1.5 text-[11px] capitalize ${props.animation===a?"bg-[var(--gold)] text-black font-semibold":"bg-white/5"}`}>{a}</button>)}</div>
        </>
      )}
      <button onClick={props.onDelete} className="flex w-full items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-200"><Trash2 size={14}/> Remove this one</button>
    </div>
    <div className="my-3 h-px bg-[var(--line)]"/>
    <div className="flex flex-wrap gap-1.5">
      <IconBtn label="Undo" icon={<Undo2 size={15}/>} onClick={props.onUndo} disabled={!props.canUndo}/><IconBtn label="Redo" icon={<Redo2 size={15}/>} onClick={props.onRedo} disabled={!props.canRedo}/><IconBtn label="Reset" icon={<RotateCcw size={15}/>} onClick={props.onReset}/><IconBtn label={props.previewing?"Edit":"Preview"} icon={<Eye size={15}/>} onClick={()=>props.onPreview(!props.previewing)}/><IconBtn label="Download" icon={<Download size={15}/>} onClick={props.onDownload} primary/>
    </div>
    <p className="mt-2 flex items-center gap-1 text-[10px] text-[var(--cream-dim)]"><Sparkles size={11}/> Drag to move · pull the edge to resize · twist the handle to rotate (touch-friendly)</p>
  </div>;
}
function IconBtn({label,icon,onClick,disabled,primary}:{label:string;icon:React.ReactNode;onClick:()=>void;disabled?:boolean;primary?:boolean}){ return <button onClick={onClick} disabled={disabled} aria-label={label} title={label} className={`flex h-9 w-9 items-center justify-center rounded-lg disabled:opacity-35 ${primary?"bg-[var(--gold)] text-black":"bg-white/5 hover:bg-white/10"}`}>{icon}</button>; }
export { Zap };
