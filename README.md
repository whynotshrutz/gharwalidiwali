# Ghar Wali Diwali

A premium Diwali web experience: a cinematic ghat scene, a "My Home" jhalar decoration studio, a community Diwali Wall, and simple solo games.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- GSAP, Canvas 2D, SVG, Lucide React
- html-to-image (export), WebAudio (synthesized sound effects)

## Run locally

```bash
npm install
echo "GITHUB_TOKEN=your_token" > .env.local
npm run dev
```

Open http://localhost:3000. The Diwali Wall uses a shared store backed by a GitHub repo; set `GITHUB_TOKEN` (repo scope) in `.env.local` (local) or in Vercel env vars (deploy). Without it, the wall falls back to per-device storage.

## Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## How it works

- The app has three main screens you can switch between: Ghat, My Home, and Diwali Wall, plus a Games popup. You can also turn sound on/off and change volume.
- **Ghat** is the main scene. It shows a river ghat at night with water, diyas, stars and moon. Pick a firecracker from the tray at the bottom and tap the screen to light it; fireworks animate on a canvas. Crackers: rocket, anaar, chakri, phuljhadi (sparkler), bomb, and more.
- **My Home** lets you upload a photo and decorate it with fairy lights (jhalar). You can undo/redo, preview and download the result. In Celebrate mode the photo is replaced by a rooftop scene with crackers firing above it.
- **Diwali Wall** is a small community board where you can post a photo, wish or feedback, shared across visitors. Feedback is emailed to the host. There is also a panel with decoration, food, gifting and staying-back ideas.
- **Games** (Diya Match, Tic Tac Toe, Diya Sequence, Tap the Diya) open from the Ghat scene.
- Sounds are generated in the browser, with real audio files used for rocket, bomb, phuljhadi and sutli. The sparkler's glow lasts as long as its sound (about 3.5 seconds).

## Deploy

Import the repo in Vercel; it builds with `npm run build`.
