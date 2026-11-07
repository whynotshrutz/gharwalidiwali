"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { Gamepad2, Volume2, VolumeX, Sparkles, ShoppingCart } from "lucide-react";
import GhatScene, { type GhatController } from "@/components/ghat/GhatScene";
import CrackerTray from "@/components/ghat/CrackerTray";
import HomeScene from "@/components/home-studio/HomeScene";
import SceneSwitcher from "@/components/controls/SceneSwitcher";
import IntroTitle from "@/components/intro/IntroTitle";
import GamesModal from "@/components/games/GamesModal";
import BuyCrackersModal from "@/components/wall/BuyCrackersModal";
import DiwaliWall from "@/components/wall/DiwaliWall";
import { useAudio } from "@/hooks/useAudio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { diwaliLine } from "@/lib/diwali";
import type { CrackerType } from "@/lib/fireworks";
import type { SceneId } from "@/types";

export default function Page(){
  const [scene,setScene]=useState<SceneId>("ghat"); const [entered,setEntered]=useState(false); const [fireworks,setFireworks]=useState(true);
  const [cracker,setCracker]=useState<CrackerType>("rocket"); const [gameOpen,setGameOpen]=useState(false);
  const [buyOpen,setBuyOpen]=useState(false);
  const audio=useAudio(); const reduced=useReducedMotion(); const ghat=useRef<GhatController|null>(null);
  const countdown=useSyncExternalStore(()=>()=>{}, ()=>diwaliLine(), ()=>"Shubh Deepawali");

  const pickCracker=(t:CrackerType)=>{ setCracker(t); ghat.current?.ignite(t); audio.crackle(t); };

  return <main className="relative h-[100dvh] w-full overflow-hidden bg-[var(--midnight)]" aria-label="Ghar Wali Diwali">
    {scene==="ghat" ? <div className="absolute inset-0"><GhatScene fireworksOn={fireworks} cracker={cracker} interactive={entered&&!gameOpen} onIgnite={audio.crackle} controllerRef={ghat}/>{!entered && <IntroTitle onEnter={()=>setEntered(true)}/>}</div>
      : scene==="home" ? <div className="absolute inset-0"><HomeScene onCrackle={audio.crackle}/></div>
      : <DiwaliWall onGoHome={()=>setScene("home")} onGoGhat={()=>setScene("ghat")}/>}
    <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
      <SceneSwitcher scene={scene} onChange={s=>{ setScene(s); setEntered(true); }}/>
      <div className="glass flex items-center gap-1.5 rounded-full p-1.5">
        <button onClick={audio.toggle} aria-label={audio.enabled?"Mute sound":"Enable sound"} aria-pressed={audio.enabled} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">{audio.enabled?<Volume2 size={17}/>:<VolumeX size={17}/>}</button>
        {scene==="ghat" && <>
          <button onClick={()=>setGameOpen(true)} aria-label="Open Diwali games" className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs hover:bg-white/10"><Gamepad2 size={15}/><span className="hidden sm:inline">Games</span></button>
          <button onClick={()=>setBuyOpen(true)} aria-label="Open the cracker bazaar" className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs hover:bg-white/10"><ShoppingCart size={14}/><span className="hidden sm:inline">Cracker Bazaar</span></button>
          <button onClick={()=>setFireworks(f=>!f)} aria-label="Toggle fireworks" aria-pressed={fireworks} className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs ${fireworks?"bg-[var(--gold)] font-semibold text-black":"hover:bg-white/10"}`}><Sparkles size={14}/> Fireworks</button>
        </>}
        {audio.enabled && <input type="range" min={0} max={1} step={.05} value={audio.volume} onChange={e=>audio.setVolume(+e.target.value)} aria-label="Volume" className="hidden w-20 accent-[var(--gold)] sm:block"/>}
      </div>
    </div>
    {entered && scene==="ghat" && !gameOpen && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <p className="text-center text-[11px] text-[var(--cream-dim)]">{countdown} · Pick a cracker, tap the sky, and act pleasantly surprised</p>
      <div className="pointer-events-auto max-w-full"><CrackerTray value={cracker} onChange={pickCracker}/></div>
    </div>}
    <p className="pointer-events-none absolute bottom-3 right-3 z-10 hidden text-[10px] tracking-widest text-[var(--cream-dim)] sm:block">{reduced?"Taking it slow (reduced motion)":""}</p>
    <GamesModal open={gameOpen} onClose={()=>setGameOpen(false)}/>
    <BuyCrackersModal open={buyOpen} onClose={()=>setBuyOpen(false)}/>
  </main>;
}
