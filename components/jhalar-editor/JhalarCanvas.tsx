"use client";
import { useRef } from "react";
import Jhalar from "./Jhalar";
import type { JhalarItem, ImageTransform } from "@/types";

export default function JhalarCanvas({ imgUrl, transform, jhalars, selectedId, previewing, onSelect, onMove, onResize, onRotate, onImageMove, children }:{ imgUrl:string|null; transform:ImageTransform; jhalars:JhalarItem[]; selectedId:string|null; previewing:boolean; onSelect:(id:string|null)=>void; onMove:(id:string,x:number,y:number)=>void; onResize:(id:string,w:number)=>void; onRotate:(id:string,r:number)=>void; onImageMove:(t:ImageTransform)=>void; children?:React.ReactNode }){
  const ref=useRef<HTMLDivElement>(null); const drag=useRef<{kind:"jhalar"|"image"|"resize"|"rotate"; id:string; startX:number; startY:number; item?:JhalarItem; startW?:number; startRot?:number; startImg?:ImageTransform}|null>(null);
  const pos=(e:React.PointerEvent)=>{ const r=ref.current!.getBoundingClientRect(); return { x:e.clientX-r.left, y:e.clientY-r.top, cx:r.width/2, cy:r.height/2 }; };
  const onDown=(e:React.PointerEvent)=>{ drag.current={kind:"image",id:"",startX:e.clientX,startY:e.clientY,startImg:{...transform}}; };
  const onJhalarDown=(e:React.PointerEvent,id:string)=>{ const item=jhalars.find(j=>j.id===id)!; onSelect(id); drag.current={kind:"jhalar",id,startX:e.clientX,startY:e.clientY,item}; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); };
  const onMoveEv=(e:React.PointerEvent)=>{ const d=drag.current; if(!d) return; const dx=e.clientX-d.startX, dy=e.clientY-d.startY;
    if(d.kind==="jhalar"&&d.item) onMove(d.id,d.item.x+dx,d.item.y+dy);
    if(d.kind==="image"&&d.startImg) onImageMove({...d.startImg,x:d.startImg.x+dx,y:d.startImg.y+dy});
    if(d.kind==="resize"&&d.startW) onResize(d.id,Math.max(90,Math.min(900,d.startW+dx)));
    if(d.kind==="rotate"&&d.startRot!==undefined){ const p=pos(e); const item=jhalars.find(j=>j.id===d.id); if(item){ const ang=Math.atan2(p.y-item.y,p.x-item.x)*180/Math.PI; onRotate(d.id,Math.round(ang)); } }
  };
  const up=()=>{ drag.current=null; };
  const sel=jhalars.find(j=>j.id===selectedId);
  return <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#0d1329]" onPointerDown={onDown} onPointerMove={onMoveEv} onPointerUp={up} onPointerLeave={up} role="application" aria-label="Photo and jhalar canvas">
    {imgUrl && <img src={imgUrl} alt="Your home photograph" draggable={false} className="absolute inset-0 h-full w-full select-none" style={{ objectFit:transform.fit, transform:`translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`, transformOrigin:"center" }}/>}
    {!imgUrl && <div className="absolute inset-0 grid place-items-center text-center text-sm text-[var(--cream-dim)]"><p>No photograph yet — jhalars you add will preview here.</p></div>}
    {jhalars.map(j=><Jhalar key={j.id} item={j} selected={j.id===selectedId&&!previewing} onPointerDown={onJhalarDown}/>)}
    {sel && !previewing && <>
      <button aria-label="Resize jhalar" className="absolute z-10 h-5 w-5 rounded-full border border-black bg-[var(--gold)] touch-none" style={{left:sel.x+sel.width/2,top:sel.y,transform:"translate(-50%,-50%)"}} onPointerDown={e=>{e.stopPropagation(); drag.current={kind:"resize",id:sel.id,startX:e.clientX,startY:e.clientY,startW:sel.width};}}/>
      <button aria-label="Rotate jhalar" className="absolute z-10 h-5 w-5 rounded-full border border-black bg-white touch-none" style={{left:sel.x,top:sel.y-sel.width*.16,transform:"translate(-50%,-50%)"}} onPointerDown={e=>{e.stopPropagation(); drag.current={kind:"rotate",id:sel.id,startX:e.clientX,startY:e.clientY,startRot:sel.rotation};}}/>
    </>}
    {children}
  </div>;
}
