// Bilder im Browser rastern (ADR-042): PNG-Fassung zu SVG-Bildern für Word, ohne native Grafikbibliothek auf dem Server.
import { api, mediaUrl } from './api';

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
  img.src = src;
});

/** SVG-Text als PNG (data:-URL) in doppelter Auflösung, höchstens 2400 px breit, mit weißem Hintergrund */
export async function svgToPng(svg: string): Promise<string> {
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  const w = img.naturalWidth || 600;
  const h = img.naturalHeight || 400;
  const scale = Math.min(2, 2400 / w);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const g = canvas.getContext('2d');
  if (!g) throw new Error('Canvas nicht verfügbar.');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

/** PNG-Fassung erzeugen und am SVG-Bild hinterlegen */
export async function storeRendition(sha: string, svg: string) {
  return api<{ pngSha: string }>('PUT', `/media/${sha}/rendition`, { png: await svgToPng(svg) });
}

export const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** PNG-Fassung für ein bereits gespeichertes SVG-Bild nachholen (Bildverzeichnis) */
export async function createRenditionFor(sha: string) {
  const svg = await (await fetch(await mediaUrl(sha))).text();
  return storeRendition(sha, svg);
}
