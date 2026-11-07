"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";
export default function IntroTitle({ onEnter }:{ onEnter:()=>void }){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{ const ctx=gsap.context(()=>{ gsap.fromTo(".intro-el",{y:24,opacity:0},{y:0,opacity:1,duration:1.1,stagger:.14,ease:"power3.out",delay:.3}); },root); return ()=>ctx.revert(); },[]);
  return <div ref={root} className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
    <p className="intro-el eyebrow mb-4 flex items-center gap-2"><Sparkles size={13}/> A little ghar, a lot of Diwali</p>
    <h1 className="intro-el title-serif text-[clamp(2.6rem,8vw,6.5rem)] font-semibold leading-[1.02] tracking-tight">Ghar Wali<br/><span className="italic text-[var(--gold-soft)]">Diwali</span></h1>
    <p className="intro-el mt-5 max-w-md text-base text-[var(--cream-dim)] sm:text-lg">The ghats are lit, the diyas are floating, and somewhere the mithai is already missing. Come in.</p>
    <button onClick={onEnter} className="intro-el pointer-events-auto group mt-9 flex items-center gap-3 rounded-full border border-[var(--gold)]/60 px-7 py-3 text-sm tracking-wide hover:bg-[var(--gold)] hover:text-[#16121b] transition"><span className="font-medium">Come, sit by the diya</span><ArrowRight size={16} className="transition group-hover:translate-x-1"/></button>
    <p className="intro-el mt-4 text-[11px] text-[var(--cream-dim)]">Ghats · floating diyas · a home that glows back</p>
  </div>;
}
