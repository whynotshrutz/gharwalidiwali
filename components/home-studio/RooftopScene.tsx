"use client";

function Diya({ x, top, size = 26, delay = 0 }: { x: number; top: number; size?: number; delay?: number }) {
  return <div className="absolute" style={{ left: `${x}%`, top: `${top}%`, transform: "translate(-50%,-100%)" }}>
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full blur-[6px]" style={{ width: size * 2.1, height: size * 1.5, background: "radial-gradient(circle, rgba(255,190,90,.55), rgba(255,150,50,0) 70%)" }}/>
      <svg viewBox="0 0 40 40" className="flame relative h-full w-full" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="20" cy="32" rx="12" ry="4" fill="#5e2f0e"/>
        <path d="M7 27 Q20 37 33 27 L30 33 Q20 38 10 33 Z" fill="#a95d1c"/>
        <path d="M8 27 Q20 30 32 27 Q20 34 8 27 Z" fill="#c47a2c"/>
        <path d="M20 9 C24 15 27 18 25 23 C24 27 16 27 15 22 C14 17 18 14 20 9 Z" fill="#ffcf6a"/>
        <path d="M20 15 C22 18 23 20 22 23 C21 25 18 25 18 22 C17 20 19 18 20 15 Z" fill="#fff4cf"/>
      </svg>
    </div>
  </div>;
}

function Candle({ x, top, h = 22, delay = 0 }: { x: number; top: number; h?: number; delay?: number }) {
  return <div className="absolute" style={{ left: `${x}%`, top: `${top}%`, transform: "translate(-50%,-100%)" }}>
    <div className="relative flex flex-col items-center">
      <div className="absolute -top-2 rounded-full blur-[5px]" style={{ width: 18, height: 22, background: "radial-gradient(circle, rgba(255,205,120,.7), rgba(255,170,60,0) 70%)" }}/>
      <span className="flame relative block rounded-full" style={{ width: 5, height: 9, background: "linear-gradient(180deg,#fff4cf,#ffcf6a)", animationDelay: `${delay}s`, boxShadow: "0 0 6px rgba(255,210,120,.8)" }}/>
      <span className="mt-0.5 block rounded-sm" style={{ width: 9, height: h, background: "linear-gradient(180deg,#f1e3c4,#cdb488)" }}/>
    </div>
  </div>;
}

function StringLights() {
  const bulbs = Array.from({ length: 19 }, (_, i) => i / 18);
  return <div className="pointer-events-none absolute inset-x-0" style={{ top: "5%", height: "clamp(70px,12vh,130px)" }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <path d="M0 8 Q25 55 50 12 Q75 55 100 8" fill="none" stroke="rgba(18,12,10,.9)" strokeWidth="1.1" vectorEffect="non-scaling-stroke"/>
    </svg>
    {bulbs.map((t, i) => {
      const y = 9 + Math.sin(t * Math.PI) * 25;
      const warm = i % 3 !== 0;
      return <span key={i} className="jhalar-bulb absolute h-1.5 w-1.5 rounded-full" style={{
        left: `${t * 100}%`, top: `${y}%`,
        background: warm ? "#ffe3a0" : "#ffd977",
        boxShadow: "0 0 6px 2px rgba(255,210,120,.5), 0 0 16px 5px rgba(255,190,90,.22)",
        animationDelay: `${(i % 5) * 0.3}s`,
      }}/>;
    })}
  </div>;
}

function Marigold() {
  const flowers = Array.from({ length: 16 }, (_, i) => i / 15);
  return <div className="pointer-events-none absolute inset-x-0" style={{ top: "62%" }} aria-hidden="true">
    {flowers.map((t, i) => {
      if (t < 0.06 || t > 0.56) return null;
      const y = Math.sin(((t - 0.06) / 0.5) * Math.PI) * 1.8;
      return <span key={i} className="absolute h-1.5 w-1.5 rounded-full" style={{
        left: `${t * 100}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
        background: i % 2 ? "#f5c04a" : "#e8873a",
        boxShadow: "0 0 4px 1px rgba(255,180,90,.35)",
      }}/>;
    })}
  </div>;
}

function Kandeel({ left, top, size = 46 }: { left: string; top: string; size?: number }) {
  return <div className="pointer-events-none absolute" style={{ left, top, width: size }} aria-hidden="true">
    <div className="mx-auto h-7 w-px" style={{ background: "linear-gradient(180deg, rgba(201,164,92,0), rgba(201,164,92,.55))" }}/>
    <div className="relative mx-auto" style={{ width: size, height: size * 1.2 }}>
      <div className="jhalar-bulb absolute inset-0 rounded-full blur-md" style={{ background: "radial-gradient(circle, rgba(255,205,120,.55), rgba(255,170,60,0) 70%)" }}/>
      <svg viewBox="0 0 40 48" className="relative h-full w-full">
        <line x1="20" y1="0" x2="20" y2="5" stroke="#c9a45c" strokeWidth="1"/>
        <path d="M20 5 L33 18 L20 43 L7 18 Z" fill="#a83232"/>
        <path d="M20 8 L30 18 L20 39 L10 18 Z" fill="#e05a4a" opacity=".9"/>
        <path d="M20 13 L26 18 L20 33 L14 18 Z" fill="#ffcf6a" opacity=".95"/>
        <path d="M20 5 L33 18 L20 43 L7 18 Z" fill="none" stroke="#7a1f1f" strokeWidth=".8"/>
        <line x1="20" y1="43" x2="20" y2="48" stroke="#c9a45c" strokeWidth="1"/>
      </svg>
    </div>
  </div>;
}

function Mumty() {
  return <div className="pointer-events-none absolute" style={{ left: "34%", bottom: "26%", width: "clamp(110px,15vw,190px)" }} aria-hidden="true">
    <svg viewBox="0 0 160 170" className="w-full">
      <defs>
        <linearGradient id="mumty-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe3a0"/>
          <stop offset="55%" stopColor="#f5b74e"/>
          <stop offset="100%" stopColor="#c9791f"/>
        </linearGradient>
        <radialGradient id="mumty-glow">
          <stop offset="0%" stopColor="#ffd27a" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#ffb84a" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x="12" y="52" width="136" height="118" rx="3" fill="#241820" stroke="#0e0a0f" strokeWidth="2"/>
      <rect x="18" y="58" width="124" height="106" fill="#2f2028"/>
      <g stroke="#3a2a30" strokeWidth="1" opacity=".6">
        {Array.from({ length: 5 }, (_, i) => <line key={i} x1="18" y1={72 + i * 16} x2="142" y2={72 + i * 16}/>)}
      </g>
      <rect x="4" y="44" width="152" height="12" rx="2" fill="#3a2a30" stroke="#0e0a0f" strokeWidth="2"/>
      <rect x="4" y="44" width="152" height="3" fill="#c9a45c" opacity=".5"/>
      <ellipse cx="80" cy="128" rx="52" ry="46" fill="url(#mumty-glow)"/>
      <path d="M62 170 L62 112 Q80 96 98 112 L98 170 Z" fill="url(#mumty-door)"/>
      <path d="M66 170 L66 114 Q80 101 94 114 L94 170 Z" fill="#ffe8b0" opacity=".45"/>
      <circle cx="90" cy="140" r="1.6" fill="#6b3a10"/>
      <rect x="26" y="76" width="22" height="18" rx="2" fill="#ffcf6a" opacity=".7"/>
      <rect x="26" y="76" width="22" height="18" rx="2" fill="none" stroke="#0e0a0f" strokeWidth="2"/>
      <path d="M58 106 Q80 116 102 106" fill="none" stroke="#3e5c45" strokeWidth="2"/>
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = 58 + t * 44;
        const y = 106 + Math.sin(t * Math.PI) * 8;
        return <g key={i}>
          <circle cx={x} cy={y} r="3.2" fill={i % 2 ? "#f5c04a" : "#e8873a"}/>
          <ellipse cx={x} cy={y + 5} rx="1.4" ry="3" fill="#3e5c45"/>
        </g>;
      })}
    </svg>
  </div>;
}

function Rangoli() {
  return <div className="pointer-events-none absolute" style={{ left: "48%", bottom: "0.5%", width: "clamp(130px,20vw,250px)", transform: "translateX(-50%) scaleY(.62)", transformOrigin: "50% 100%" }} aria-hidden="true">
    <svg viewBox="0 0 200 200" className="w-full">
      <defs>
        <radialGradient id="rangoli-glow">
          <stop offset="0%" stopColor="#ffcf6a" stopOpacity=".35"/>
          <stop offset="100%" stopColor="#ffcf6a" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#rangoli-glow)"/>
      <g fill="none" stroke="#e8b45a" strokeWidth="1.2" opacity=".8">
        <circle cx="100" cy="100" r="86"/>
        <circle cx="100" cy="100" r="62"/>
        <circle cx="100" cy="100" r="38"/>
        <circle cx="100" cy="100" r="16"/>
      </g>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x = 100 + Math.cos(a) * 74;
        const y = 100 + Math.sin(a) * 74;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI})`}>
          <ellipse cx="0" cy="-8" rx="6" ry="12" fill={i % 2 ? "#f5c04a" : "#e8873a"} opacity=".85"/>
          <circle cx="0" cy="-8" r="2.4" fill="#fff1c9"/>
        </g>;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const cx = 100 + Math.cos(a) * 38;
        const cy = 100 + Math.sin(a) * 38;
        return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="5" transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`} fill={i % 2 ? "#2a9d8f" : "#e63946"} opacity=".7"/>;
      })}
      <circle cx="100" cy="100" r="9" fill="#ffcf6a"/>
      <circle cx="100" cy="100" r="4" fill="#fff4cf"/>
    </svg>
  </div>;
}

function Chowki() {
  const laddoos: [number, number][] = [[42, 44], [56, 42], [70, 44], [49, 38], [63, 38]];
  return <div className="pointer-events-none absolute" style={{ left: "64%", bottom: "2%", width: "clamp(84px,10vw,130px)", transform: "translateX(-50%)" }} aria-hidden="true">
    <svg viewBox="0 0 120 100" className="w-full">
      <ellipse cx="60" cy="92" rx="44" ry="6" fill="#000" opacity=".35"/>
      <g stroke="#3a2418" strokeWidth="4" strokeLinecap="round">
        <line x1="26" y1="62" x2="22" y2="92"/>
        <line x1="94" y1="62" x2="98" y2="92"/>
        <line x1="40" y1="66" x2="38" y2="90"/>
        <line x1="80" y1="66" x2="82" y2="90"/>
      </g>
      <rect x="14" y="52" width="92" height="12" rx="4" fill="#6b3f24" stroke="#3a2418" strokeWidth="2"/>
      <rect x="18" y="50" width="84" height="6" rx="3" fill="#8a5230"/>
      <ellipse cx="60" cy="48" rx="30" ry="7" fill="#c9a45c" opacity=".55"/>
      {laddoos.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill={i % 2 ? "#e8a33a" : "#f5c04a"} stroke="#b4762a" strokeWidth=".8"/>)}
      <ellipse cx="30" cy="46" rx="7" ry="3" fill="#8a4b16"/>
      <ellipse cx="90" cy="46" rx="7" ry="3" fill="#8a4b16"/>
      <path d="M30 44 C32 41 33 40 31 38 C30 37 28 37 28 39 C27 41 29 42 30 44Z" fill="#ffcf6a"/>
      <path d="M90 44 C92 41 93 40 91 38 C90 37 88 37 88 39 C87 41 89 42 90 44Z" fill="#ffcf6a"/>
    </svg>
  </div>;
}

function CrackerStash() {
  return <div className="pointer-events-none absolute" style={{ right: "20%", bottom: "2%", width: "clamp(76px,9vw,126px)" }} aria-hidden="true">
    <svg viewBox="0 0 150 120" className="w-full">
      <g>
        <path d="M18 114 L18 76 Q18 66 27 64 L27 52 L35 52 L35 64 Q44 66 44 76 L44 114 Z" fill="#2f6b4f" stroke="#173a2a" strokeWidth="2"/>
        <rect x="25" y="48" width="12" height="8" rx="2" fill="#3f8a63"/>
        <g stroke="#d9c7a0" strokeWidth="3" strokeLinecap="round">
          <line x1="27" y1="50" x2="21" y2="12"/>
          <line x1="31" y1="50" x2="31" y2="6"/>
          <line x1="35" y1="50" x2="41" y2="14"/>
        </g>
        <path d="M21 12 L17 18 L25 18 Z" fill="#e05a4a"/>
        <path d="M31 6 L26 13 L36 13 Z" fill="#f5c04a"/>
        <path d="M41 14 L37 20 L45 20 Z" fill="#e05a4a"/>
      </g>
      <g>
        <rect x="58" y="76" width="82" height="38" rx="4" fill="#a83232" stroke="#5e1a1a" strokeWidth="2"/>
        <rect x="58" y="70" width="82" height="10" rx="3" fill="#c9483a"/>
        <rect x="66" y="88" width="66" height="18" rx="2" fill="#f5c04a" opacity=".9"/>
        <path d="M99 104 C103 99 105 97 102 94 C100 92 97 93 96 95 C95 98 98 100 99 104 Z" fill="#b4762a"/>
        <g stroke="#d9c7a0" strokeWidth="2.4" strokeLinecap="round">
          <line x1="72" y1="70" x2="66" y2="54"/>
          <line x1="88" y1="70" x2="86" y2="50"/>
          <line x1="106" y1="70" x2="110" y2="52"/>
          <line x1="122" y1="70" x2="126" y2="56"/>
        </g>
        <circle cx="66" cy="54" r="2.4" fill="#e05a4a"/>
        <circle cx="86" cy="50" r="2.4" fill="#f5c04a"/>
        <circle cx="110" cy="52" r="2.4" fill="#e05a4a"/>
        <circle cx="126" cy="56" r="2.4" fill="#f5c04a"/>
      </g>
    </svg>
  </div>;
}

function Chakri() {
  return <div className="pointer-events-none absolute" style={{ left: "36%", bottom: "1.5%", width: "clamp(44px,5.5vw,74px)", transform: "translateX(-50%)" }} aria-hidden="true">
    <svg viewBox="0 0 80 40" className="w-full">
      <ellipse cx="40" cy="31" rx="30" ry="7" fill="#000" opacity=".3"/>
      <ellipse cx="40" cy="24" rx="27" ry="9" fill="#b4762a" stroke="#6b3a10" strokeWidth="2"/>
      <ellipse cx="40" cy="22" rx="19" ry="6" fill="#8a4b16"/>
      <path d="M40 22 m-14 0 a14 6 0 1 0 28 0 a14 6 0 1 0 -28 0" fill="none" stroke="#f5c04a" strokeWidth="1.5" opacity=".8"/>
      <path d="M40 22 m-8 0 a8 4 0 1 0 16 0 a8 4 0 1 0 -16 0" fill="none" stroke="#e8873a" strokeWidth="1.2" opacity=".8"/>
      <circle cx="40" cy="21" r="2" fill="#ffcf6a"/>
    </svg>
  </div>;
}

export default function RooftopScene() {
  return <div className="rooftop-scene absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#04060f 0%,#0a0f24 30%,#171a38 52%,#33243c 63%,#201521 74%,#120d12 100%)" }}/>
    <div className="absolute inset-x-0" style={{ top: "44%", height: "22%", background: "radial-gradient(ellipse at 50% 100%, rgba(217,164,65,.24) 0%, rgba(217,164,65,0) 70%)" }}/>

    <div className="absolute" style={{
      right: "13%", top: "9%", width: "clamp(30px,5vw,58px)", aspectRatio: "1", borderRadius: "9999px",
      background: "radial-gradient(circle at 36% 34%, #fff8e6, #f2dda8 55%, #c9a45c 100%)",
      boxShadow: "0 0 50px 16px rgba(255,236,190,.22), 0 0 140px 54px rgba(255,220,160,.10)",
    }}/>

    <svg className="absolute inset-x-0" style={{ top: "39%", height: "24%" }} viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice">
      <g fill="#0b1024">
        <rect x="-20" y="150" width="140" height="110"/>
        <rect x="130" y="112" width="86" height="148"/>
        <rect x="228" y="158" width="132" height="102"/>
        <rect x="372" y="96" width="74" height="164"/>
        <rect x="446" y="168" width="150" height="92"/>
        <rect x="608" y="126" width="92" height="134"/>
        <rect x="712" y="150" width="118" height="110"/>
        <rect x="842" y="104" width="78" height="156"/>
        <rect x="930" y="162" width="152" height="98"/>
        <rect x="1094" y="128" width="126" height="132"/>
        <path d="M372 96 L409 58 L446 96 Z"/>
        <path d="M905 104 L910 84 L915 104 Z"/>
        <rect x="158" y="90" width="46" height="26" rx="4"/>
        <rect x="642" y="104" width="38" height="24" rx="4"/>
        <rect x="1122" y="106" width="44" height="24" rx="4"/>
        <line x1="500" y1="168" x2="500" y2="122" stroke="#0b1024" strokeWidth="3"/>
        <line x1="488" y1="132" x2="512" y2="132" stroke="#0b1024" strokeWidth="2"/>
        <line x1="488" y1="142" x2="512" y2="142" stroke="#0b1024" strokeWidth="2"/>
        <circle cx="80" cy="150" r="26"/>
        <circle cx="106" cy="160" r="18"/>
        <circle cx="566" cy="168" r="22"/>
        <circle cx="590" cy="176" r="15"/>
      </g>
      <g fill="#f5c04a" opacity=".5">
        <rect x="146" y="126" width="4" height="6"/><rect x="168" y="140" width="4" height="6"/><rect x="150" y="158" width="4" height="6"/>
        <rect x="248" y="174" width="4" height="6"/><rect x="272" y="188" width="4" height="6"/><rect x="300" y="172" width="4" height="6"/>
        <rect x="392" y="118" width="4" height="6"/><rect x="414" y="132" width="4" height="6"/><rect x="392" y="148" width="4" height="6"/>
        <rect x="470" y="184" width="4" height="6"/><rect x="500" y="196" width="4" height="6"/><rect x="540" y="182" width="4" height="6"/>
        <rect x="628" y="144" width="4" height="6"/><rect x="652" y="160" width="4" height="6"/><rect x="628" y="178" width="4" height="6"/>
        <rect x="862" y="122" width="4" height="6"/><rect x="884" y="140" width="4" height="6"/><rect x="862" y="158" width="4" height="6"/>
        <rect x="960" y="178" width="4" height="6"/><rect x="990" y="192" width="4" height="6"/><rect x="1026" y="176" width="4" height="6"/>
        <rect x="1120" y="144" width="4" height="6"/><rect x="1150" y="160" width="4" height="6"/><rect x="1120" y="178" width="4" height="6"/>
      </g>
    </svg>

    <svg className="absolute" style={{ right: "5%", top: "44%", width: "clamp(78px,10vw,128px)" }} viewBox="0 0 120 170">
      <g fill="#0c1126">
        <rect x="14" y="168" width="7" height="30" transform="translate(0,-30)"/>
        <rect x="98" y="168" width="7" height="30" transform="translate(0,-30)"/>
        <rect x="18" y="38" width="82" height="102" rx="10"/>
        <path d="M18 40 Q59 4 100 40 Z"/>
        <rect x="54" y="140" width="10" height="26"/>
        <line x1="72" y1="72" x2="72" y2="132" stroke="#0c1126" strokeWidth="3"/>
        <line x1="66" y1="78" x2="78" y2="78" stroke="#0c1126" strokeWidth="2"/>
        <line x1="66" y1="92" x2="78" y2="92" stroke="#0c1126" strokeWidth="2"/>
        <line x1="66" y1="106" x2="78" y2="106" stroke="#0c1126" strokeWidth="2"/>
        <line x1="66" y1="120" x2="78" y2="120" stroke="#0c1126" strokeWidth="2"/>
      </g>
      <path d="M18 45 Q59 10 100 45" fill="none" stroke="#b98a5e" strokeWidth="1.2" opacity=".35"/>
      <rect x="92" y="120" width="3" height="4" fill="#f5c04a" opacity=".6"/>
    </svg>

    <div className="absolute inset-x-0" style={{ top: "62%", height: "11%" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#33263a 0%,#241a2b 52%,#170f19 100%)" }}/>
      <div className="absolute inset-x-0 top-0" style={{ height: "18%", background: "linear-gradient(180deg,#5a4550,#33273a)", boxShadow: "0 2px 6px rgba(0,0,0,.45), inset 0 1px 0 rgba(232,207,143,.20)" }}/>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(232,207,143,.7) 1px, transparent 1.5px)", backgroundSize: "26px 22px" }}/>
      <div className="absolute inset-x-0 bottom-0" style={{ height: "18%", background: "linear-gradient(180deg,#170f19,#0c080d)" }}/>
    </div>

    <div className="absolute inset-x-0 bottom-0" style={{ height: "27%", background: "linear-gradient(180deg,#1a1118 0%,#120d12 60%,#0b080d 100%)" }}>
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(201,164,92,.20) 0 1px, transparent 1px 92px), repeating-linear-gradient(0deg, rgba(201,164,92,.12) 0 1px, transparent 1px 54px)" }}/>
      <div className="absolute" style={{ left: "12%", top: "6%", width: "55%", height: "84%", background: "radial-gradient(ellipse at 50% 50%, rgba(255,190,90,.14), transparent 70%)" }}/>
    </div>

    <StringLights/>
    <Marigold/>
    <Kandeel left="7%" top="5%" size={44}/>
    <Kandeel left="62%" top="3%" size={52}/>
    <Mumty/>
    <Rangoli/>
    <Chowki/>
    <CrackerStash/>
    <Chakri/>

    <Charpai/>

    <svg className="absolute" style={{ right: "7%", bottom: "3%", width: "clamp(58px,8vw,96px)" }} viewBox="0 0 100 140">
      <g>
        <path d="M31 86 L69 86 L63 132 L37 132 Z" fill="#6b3722"/>
        <rect x="27" y="80" width="46" height="9" rx="3" fill="#8a4b2c"/>
        <path d="M27 86 Q50 96 73 86" fill="none" stroke="#c9a45c" strokeWidth="1" opacity=".4"/>
        <g fill="#2f4a38">
          <ellipse cx="50" cy="52" rx="8" ry="22"/>
          <ellipse cx="38" cy="58" rx="7" ry="18" transform="rotate(-28 38 58)"/>
          <ellipse cx="62" cy="58" rx="7" ry="18" transform="rotate(28 62 58)"/>
          <ellipse cx="50" cy="44" rx="6" ry="14"/>
          <ellipse cx="33" cy="70" rx="6" ry="14" transform="rotate(-52 33 70)"/>
          <ellipse cx="67" cy="70" rx="6" ry="14" transform="rotate(52 67 70)"/>
        </g>
        <g fill="#3e5c45" opacity=".8">
          <ellipse cx="50" cy="50" rx="4" ry="12"/>
          <ellipse cx="40" cy="60" rx="3.4" ry="10" transform="rotate(-28 40 60)"/>
          <ellipse cx="60" cy="60" rx="3.4" ry="10" transform="rotate(28 60 60)"/>
        </g>
      </g>
    </svg>

    {[{ x: 7, s: 26, d: 0 }, { x: 19, s: 22, d: .6 }, { x: 31, s: 30, d: 1.1 }, { x: 45, s: 24, d: .3 }, { x: 57, s: 28, d: .9 }, { x: 69, s: 22, d: 1.5 }, { x: 82, s: 27, d: .4 }, { x: 93, s: 23, d: 1.2 }].map((o, i) => <Diya key={i} x={o.x} top={62} size={o.s} delay={o.d}/>)}
    <Diya x={25} top={82} size={24} delay={.7}/>
    <Diya x={31} top={86} size={19} delay={1.3}/>
    <Diya x={42} top={91} size={22} delay={.5}/>
    <Diya x={55} top={93} size={18} delay={1}/>
    <Diya x={77} top={89} size={26} delay={.2}/>
    <Candle x={63} top={90} h={20} delay={.4}/>
    <Candle x={67} top={92} h={14} delay={1.1}/>
    <Candle x={86} top={82} h={18} delay={.8}/>
    <Candle x={89} top={84} h={12} delay={.2}/>
  </div>;
}

function Charpai() {
  const warp = Array.from({ length: 34 }, (_, i) => i);
  const weft = Array.from({ length: 12 }, (_, i) => i);
  return <div className="absolute" style={{ left: "3%", bottom: "-4%", width: "clamp(180px,30vw,340px)" }}>
    <svg viewBox="0 0 320 180" className="w-full">
      <defs>
        <clipPath id="cot-top">
          <polygon points="42,64 252,44 286,92 74,116"/>
        </clipPath>
      </defs>
      <ellipse cx="165" cy="160" rx="150" ry="17" fill="#000" opacity=".3"/>
      <g stroke="#241812" strokeWidth="7" strokeLinecap="round">
        <line x1="48" y1="66" x2="42" y2="146"/>
        <line x1="248" y1="48" x2="244" y2="128"/>
      </g>
      <polygon points="42,64 252,44 286,92 74,116" fill="#3a271e" stroke="#20140f" strokeWidth="5" strokeLinejoin="round"/>
      <g clipPath="url(#cot-top)">
        <rect x="36" y="40" width="256" height="84" fill="#4a3326"/>
        <g stroke="#6d4c35" strokeWidth="1.4" opacity=".75">
          {warp.map(i => <line key={`v${i}`} x1={42 + i * 7} y1="40" x2={60 + i * 7} y2="124"/>)}
          {weft.map(i => <line key={`h${i}`} x1="36" y1={52 + i * 6} x2="292" y2={40 + i * 6}/>)}
        </g>
      </g>
      <polyline points="42,64 252,44 286,92" fill="none" stroke="#b98a5e" strokeWidth="1.4" opacity=".5"/>
      <g stroke="#2e1e16" strokeWidth="8" strokeLinecap="round">
        <line x1="80" y1="112" x2="72" y2="172"/>
        <line x1="280" y1="92" x2="288" y2="158"/>
      </g>
      <g transform="rotate(-8 120 60)">
        <rect x="78" y="46" width="88" height="24" rx="12" fill="#5c2a30" stroke="#3a1a20" strokeWidth="1.5"/>
        <line x1="86" y1="58" x2="158" y2="58" stroke="#c9a45c" strokeWidth="1.2" opacity=".55"/>
      </g>
      <path d="M198 52 L248 47 L252 68 L204 74 Z" fill="#d8c39a" opacity=".5"/>
    </svg>
  </div>;
}
