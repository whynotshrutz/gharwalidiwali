"use client";
import { useEffect, useState } from "react";
export function useReducedMotion(){ const [v,setV]=useState(false); useEffect(()=>{ const m=window.matchMedia("(prefers-reduced-motion: reduce)"); const f=()=>setV(m.matches); f(); m.addEventListener("change",f); return ()=>m.removeEventListener("change",f); },[]); return v; }
