# Ghar Wali Diwali — Project Context

Premium Next.js Diwali web experience with a cinematic Banaras Ghat scene, a "My Home" jhalar decoration studio with photo upload/export, a community Diwali Wall, and simple solo games.

## Stack & Rules
- Next.js 16.4.5 App Router, TypeScript, Tailwind v4, GSAP, Canvas 2D, SVG, Lucide React, html-to-image.
- NO Three.js / Redux / Zustand / backend.
- Start every session with: `npx tsc --noEmit`, `npm run lint`, `npm run build`. All must pass.
- Accepted lint warning only: `` in `JhalarCanvas.tsx`.
- Palette (`app/globals.css`): `--gold`, `--cream`, `--cream-dim`, `--line`, `--gold-soft`, `--midnight`, `--indigo`, `--deep`, `--maroon`, `--glass`.
- Fonts: Playfair Display (`.title-serif`), Instrument Sans.
- Audio is WebAudio-generated (no files) via `hooks/useAudio.ts` → `audio.crackle(type)`.
- Wall persistence is device-local (`localStorage` key `gwd:wall:v1`) because no backend exists.
- No comments in code unless asked.

## Verification Commands
```
npx tsc --noEmit
npm run lint
npm run build
```

## What Has Been Done
### Scenes (`types/index.ts` — `SceneId`: `'ghat' | 'home' | 'wall'`)
1. **Banaras Ghat** (`components/ghat/BanarasScene.tsx`)
   - Procedural canvas water, diyas, stars, moon, backdrop.
   - `FireworkEngine` from `lib/fireworks.ts`; `GhatController` ref; `CrackerTray` (rocket/anaar/chakri/phuljhadi/laad).
   - Interactive tap-to-light crackers.
   - Redesigned backdrop: 4 buildings (shikhara/dome/flat mix) with gaps between them, back temple spires, arched ground-floor windows, balconies, chhatris, light curtains hanging down from shikhara flags, thinner divider pillars, prominent stepped ghat band with treads/risers/landings/diyas, parapet lamps, boats on water, reflections.
   - **Removed auto-lighting** — crackers now only ignite manually via CrackerTray (deleted the `nextAuto` auto-ignite block).

2. **My Home Studio** (`components/home-studio/HomeScene.tsx`)
   - Photo upload (drag-drop anywhere + centered "Choose a photo" card; file input only).
   - Tone/luminance sampling removed; image transform (cover/contain/zoom) via `JhalarCanvas`.
   - Jhalar editor: undo/redo/reset/preview/download (`html-to-image`), mobile bottom-sheet tools.
   - **Removed top-left upload button and duplicate jhalar options** — jhalars/celebration only enabled after a photo is uploaded.
   - Celebrate mode now renders `RooftopScene` (new Indian rooftop backdrop: starry sky, moon, ghat skyline, water tank, parapet, charpai, plants, string lights, marigold garland, diyas/candles) with `CelebrationSky` crackers on top. Photo-zoom framing removed for celebrate mode.
   - Added `.flame` animation keyframes to `app/globals.css`.

3. **Diwali Wall** (`components/wall/DiwaliWall.tsx`, `TrendingPanel.tsx`, `lib/wall.ts`)
   - Post photo/wish/feedback; hide/restore/delete; Manage mode.
   - `localStorage`-based store (`useWallPosts`, `useWallOwner`, `addPost`, `removePost`, `setPostHidden`, `compressImage`).
   - TrendingPanel with Decor/Food/Gifting/Staying-back ideas.

4. **Games Hub** (`components/games/GamesModal.tsx`, `DiyaMatch.tsx`, `TicTacToe.tsx`, `DiyaSequence.tsx`, `TapTheDiya.tsx`)
   - Opened from the "Games" button on the ghat scene.
   - Diya Match (6 pairs, 12 cards), Tic Tac Toe vs simple AI (win/block/center/corner AI), Diya Sequence (Simon-style memory), Tap the Diya (20s reflex).
   - Modal chrome handles body lock, Escape (back to picker / close), focus on close button.

### Page Orchestration (`app/page.tsx`)
- Scene switcher (Banaras Ghat / My Home / Diwali Wall), countdown via `useSyncExternalStore`, audio toggle, volume slider, Diya Match modal, CrackerTray at bottom when ghat is active.

## File Structure (key files)
```
app/
  page.tsx            — scene orchestrator
  globals.css         — design system + .flame animation
  layout.tsx
components/
  ghat/
    BanarasScene.tsx
    CrackerTray.tsx
    FireworksEngine → lib/fireworks.ts
  home-studio/
    HomeScene.tsx
    RooftopScene.tsx
    CelebrationSky.tsx
  jhalar-editor/
    Jhalar.tsx, JhalarCanvas.tsx, JhalarToolbar.tsx
  games/
    GamesModal.tsx, DiyaMatch.tsx, TicTacToe.tsx, DiyaSequence.tsx, TapTheDiya.tsx
  wall/
    DiwaliWall.tsx, TrendingPanel.tsx
  intro/IntroTitle.tsx
  controls/SceneSwitcher.tsx
lib/
  fireworks.ts        — FireworkEngine + CrackerType ("rocket" | "anaar" | "chakri" | "phuljhadi" | "bomb").
  diwall.ts           — diwaliLine countdown
  wall.ts             — localStorage wall store
hooks/
  useAudio.ts, useReducedMotion.ts
types/
  index.ts            — SceneId, JhalarItem, ImageTransform, ColorPresetId, etc.
```

## Future Plans / Pending Work
- Backend/shared DB for Diwali Wall (e.g., Supabase + admin passphrase) instead of localStorage.
- Sound effects for games (currently visual-only taps).
- Mobile responsiveness polish across scenes.
- Performance tuning for Canvas backdrop on low-end devices.
- More games (e.g., Diwali quiz).
- Save/share exported jhalar photos to the Diwali Wall.

## Notes
- The intro title (`IntroTitle.tsx`) overlays the ghat scene with a transparent background; clicking "Enter the Celebration" enters the scene.
- `app/page.tsx` renders all three scenes; scene switching via `SceneSwitcher.tsx`.
- Last verified state: `tsc`, `lint`, `build` all pass (only accepted `` warning remains).
- Cracker sounds are WebAudio-synthesized in `hooks/useAudio.ts` (`crackle`): rocket = ascending whistle sawtooth + bang; anaar = rapid highpass crackle pops + sizzle tail; chakri = spinning square-wave hum + whoosh + crackle pops; phuljhadi = soft high-frequency fizzing pops; bomb = loud lowpass boom + thump.