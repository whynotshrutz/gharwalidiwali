"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CrackerType } from "@/lib/fireworks";

const FILES: Record<CrackerType, string> = {
  rocket: "/audio/rocket.mp3",
  bomb: "/audio/bomb.mp3",
  phuljhadi: "/audio/phuljhadi.mp3",
  anaar: "", chakri: "", laddi: "", shots10: "", sutli: "/audio/sutli.mp3",
};

export function useAudio(){
  const [enabled,setEnabled]=useState(false); const [volume,setVolume]=useState(.5);
  const ctx=useRef<AudioContext|null>(null); const master=useRef<GainNode|null>(null); const amb=useRef<OscillatorNode[]>([]); const ambNoise=useRef<AudioScheduledSourceNode[]>([]);
  const fileRefs=useRef<Map<string, HTMLAudioElement>>(new Map());
  const ensure=useCallback(()=>{ if(!ctx.current){ const AC=window.AudioContext||(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext; ctx.current=new AC(); master.current=ctx.current.createGain(); master.current.gain.value=volume; master.current.connect(ctx.current.destination);} if(ctx.current.state==="suspended") void ctx.current.resume(); return ctx.current; },[volume]);
  useEffect(()=>{ if(master.current&&ctx.current) master.current.gain.setTargetAtTime(enabled?volume:0, ctx.current.currentTime, .1); },[enabled,volume]);
  const startAmbience=useCallback(()=>{
    const c=ensure(); if(amb.current.length) return;
    [110,164.8,220].forEach((f,i)=>{ const o=c.createOscillator(); const g=c.createGain(); o.type="sine"; o.frequency.value=f; g.gain.value=i===0?.012:.004; o.connect(g); g.connect(master.current!); o.start(); amb.current.push(o); });
    const water=(pan:number,rate:number,vol:number)=>{
      const len=Math.max(1, Math.floor(c.sampleRate*3));
      const buf=c.createBuffer(1,len,c.sampleRate); const d=buf.getChannelData(0);
      let last=0;
      for(let i=0;i<len;i++){ const white=Math.random()*2-1; last=last*0.985+white*0.015; d[i]=last*3.2; }
      const src=c.createBufferSource(); src.buffer=buf; src.loop=true;
      const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=520; lp.Q.value=0.5;
      const g=c.createGain(); g.gain.value=vol;
      const lfo=c.createOscillator(); lfo.type="sine"; lfo.frequency.value=rate;
      const lfoGain=c.createGain(); lfoGain.gain.value=vol*0.55;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      let tail:AudioNode=g;
      if(typeof c.createStereoPanner==="function"){ const p=c.createStereoPanner(); p.pan.value=pan; g.connect(p); tail=p; }
      src.connect(lp); lp.connect(g); tail.connect(master.current!);
      src.start(); lfo.start();
      ambNoise.current.push(src); amb.current.push(lfo);
    };
    water(-0.32,0.07,0.008);
    water(0.32,0.09,0.007);
  },[ensure]);
  useEffect(()=>{ if(enabled) startAmbience(); },[enabled,startAmbience]);

  const playFile=useCallback((path:string)=>{
    if(!enabled) return;
    let el=fileRefs.current.get(path);
    if(!el){ el=new Audio(path); el.volume=volume; fileRefs.current.set(path, el); }
    el.volume=volume;
    el.currentTime=0;
    el.play().catch(()=>{});
  },[enabled,volume]);

  const noise=useCallback((t:number,dur:number,vol:number,type:BiquadFilterType,freq:number,decay:number)=>{
    const c=ctx.current!, m=master.current!; if(!c||!m) return;
    const n=Math.max(1,Math.floor(c.sampleRate*dur));
    const buf=c.createBuffer(1,n,c.sampleRate); const d=buf.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay);
    const src=c.createBufferSource(); const f=c.createBiquadFilter(); const g=c.createGain();
    f.type=type; f.frequency.value=freq; g.gain.value=vol;
    src.buffer=buf; src.connect(f); f.connect(g); g.connect(m);
    src.start(t);
  },[]);

  const bang=useCallback((t:number,vol:number,freq:number,dur:number)=>{
    const c=ctx.current!, m=master.current!; if(!c||!m) return;
    const o=c.createOscillator(), g=c.createGain();
    o.type="sawtooth"; o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(m); o.start(t); o.stop(t+dur);
    noise(t,dur,vol*0.85,"lowpass",freq*1.4,2.0);
  },[noise]);

  const crackle=useCallback((kind:CrackerType)=>{
    if(!enabled||!master.current||!ctx.current) return;
    const path=FILES[kind];
    if(path){ playFile(path); return; }
    const c=ctx.current!, m=master.current!, t=c.currentTime+.01;
    if(kind==="anaar"){
      for(let i=0;i<16;i++){
        noise(t+i*0.03,0.07,0.15+Math.random()*0.12,"highpass",3200+Math.random()*2400,1.6);
      }
      noise(t+0.42,0.85,0.045,"highpass",6800,1.3);
    } else if(kind==="chakri"){
      const o=c.createOscillator(), g=c.createGain();
      o.type="square"; o.frequency.setValueAtTime(170,t);
      o.frequency.exponentialRampToValueAtTime(95,t+1.0);
      g.gain.setValueAtTime(0.05,t); g.gain.exponentialRampToValueAtTime(0.0001,t+1.0);
      o.connect(g); g.connect(m); o.start(t); o.stop(t+1.0);
      noise(t,0.95,0.04,"bandpass",560,1.0);
      for(let i=0;i<7;i++) noise(t+i*0.13,0.05,0.11,"highpass",4500,1.7);
    } else if(kind==="laddi"){
      for(let i=0;i<14;i++){
        noise(t+i*0.045,0.06,0.12+Math.random()*0.08,"highpass",3000+Math.random()*2000,1.5);
      }
      bang(t+0.6,0.7,90,0.3);
    } else if(kind==="shots10"){
      for(let i=0;i<10;i++){
        const o=c.createOscillator(), g=c.createGain();
        o.type="sawtooth"; o.frequency.setValueAtTime(150,t+i*0.15);
        o.frequency.exponentialRampToValueAtTime(1200,t+i*0.15+0.4);
        g.gain.setValueAtTime(0.05,t+i*0.15); g.gain.exponentialRampToValueAtTime(0.0001,t+i*0.15+0.45);
        o.connect(g); g.connect(m); o.start(t+i*0.15); o.stop(t+i*0.15+0.45);
      }
      bang(t+1.6,0.9,100,0.5);
    } else if(kind==="sutli"){
      for(let i=0;i<10;i++){
        bang(t+i*0.11,0.45,70,0.22);
      }
    } else {
      for(let i=0;i<11;i++){
        noise(t+i*0.085,0.05,0.045+Math.random()*0.035,"highpass",7200+Math.random()*2600,1.8);
      }
    }
  },[enabled,noise,bang,playFile]);

  const toggle=useCallback(()=>{ setEnabled(e=>{ if(!e) startAmbience(); return !e; }); },[startAmbience]);
  useEffect(()=>()=>{ amb.current.forEach(o=>{try{o.stop()}catch{}}); ambNoise.current.forEach(s=>{try{s.stop()}catch{}}); void ctx.current?.close(); },[]);
  return { enabled, volume, setVolume, toggle, setEnabled, crackle };
}
