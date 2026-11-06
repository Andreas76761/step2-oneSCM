// Icons der Designvorlagen für Word und PowerPoint (ADR-115, ADR-116): Lucide-SVG in der Farbe der Stelle, dazu PNG
// (64 px, für Programme ohne SVG bzw. für PowerPoint) – einmal je Icon und Farbe berechnet.
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { DESIGN_ICONS, type DesignIcon } from '../domain/designIcons.js';

const cache = new Map<string, { svg: Buffer; png: Buffer }>();

export async function iconImage(name: DesignIcon, color: string): Promise<{ svg: Buffer; png: Buffer }> {
  const hex = color.replace('#', '').toUpperCase();
  const key = `${name}:${hex}`;
  if (!cache.has(key)) {
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#${hex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${DESIGN_ICONS[name]}</svg>`);
    const canvas = createCanvas(64, 64);
    canvas.getContext('2d').drawImage(await loadImage(svg), 0, 0, 64, 64);
    cache.set(key, { svg, png: canvas.toBuffer('image/png') });
  }
  return cache.get(key)!;
}
