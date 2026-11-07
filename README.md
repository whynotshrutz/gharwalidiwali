# Ghar Wali Diwali

A premium Diwali web experience: a cinematic Banaras Ghat scene, a "My Home" jhalar decoration studio, a community Diwali Wall, and simple solo games.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- GSAP, Canvas 2D, SVG, Lucide React
- html-to-image (export), WebAudio (synthesized sound effects)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## How it works

- `app/page.tsx` orchestrates three scenes (Banaras Ghat, My Home, Diwali Wall) via `SceneSwitcher`, plus audio toggle/volume and a Games modal.
- **Banaras Ghat** (`components/ghat/BanarasScene.tsx`): procedural canvas water, diyas, stars, moon, backdrop; `FireworkEngine` (`lib/fireworks.ts`) renders fireworks; `CrackerTray` selects a cracker (rocket, anaar, chakri, phuljhadi, bomb, laddi, shots10, sutli) to ignite on tap.
- **My Home** (`components/home-studio/HomeScene.tsx`): upload a photo, decorate with jhalar (`components/jhalar-editor/`), undo/redo/preview/download; Celebrate mode renders `RooftopScene` with `CelebrationSky` fireworks on top.
- **Diwali Wall** (`components/wall/DiwaliWall.tsx`): post photo/wish/feedback, stored device-locally in `localStorage` (`lib/wall.ts`); `TrendingPanel` shows ideas.
- **Games** (`components/games/`): Diya Match, Tic Tac Toe, Diya Sequence, Tap the Diya, opened from the ghat scene.
- Audio (`hooks/useAudio.ts`) uses WebAudio plus files in `public/audio/` for rocket, bomb, phuljhadi, and sutli.
- Firework glow durations are tuned to match sound durations (e.g. phuljhadi glows ~3.5s).

## Deploy

Import the repo in Vercel; it builds with `npm run build`.
