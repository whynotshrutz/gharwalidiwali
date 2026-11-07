export type SceneId = 'ghat' | 'home' | 'wall';
export type ColorPresetId = 'warm-white' | 'golden' | 'multicolour' | 'red-green' | 'blue-white' | 'custom';
export type JhalarAnimation = 'steady' | 'twinkle' | 'chase';
export type JhalarShape = 'curved' | 'straight' | 'flat' | 'diya';

export interface JhalarItem {
  id: string;
  x: number; y: number; width: number; rotation: number;
  preset: ColorPresetId; customColor: string; brightness: number; // 0.4..1.6
  animation: JhalarAnimation; sag: number; // 0..1
  shape: JhalarShape;
  lit?: boolean;
}

export interface ImageTransform { x: number; y: number; scale: number; fit: 'cover' | 'contain'; }

export const PRESETS: Record<Exclude<ColorPresetId,'custom'>, {label:string; colors:string[]; swatches:string[]}> = {
  'warm-white': { label: 'Warm white', colors: ['#fff3d6','#ffe9b0','#fff8e7'], swatches: ['#fff3d6'] },
  'golden': { label: 'Golden yellow', colors: ['#f5c04a','#e89b2e','#ffd977'], swatches: ['#f5c04a'] },
  'multicolour': { label: 'Multicolour', colors: ['#ff5a5a','#ffd23f','#4ade80','#4ab8ff','#c084fc'], swatches: ['#ff5a5a','#ffd23f','#4ade80','#4ab8ff'] },
  'red-green': { label: 'Red & green', colors: ['#e63946','#2a9d8f','#f1fa8c','#e63946','#2a9d8f'], swatches: ['#e63946','#2a9d8f'] },
  'blue-white': { label: 'Blue & white', colors: ['#7dd3fc','#ffffff','#38bdf8','#e0f2fe'], swatches: ['#38bdf8','#ffffff'] },
};
