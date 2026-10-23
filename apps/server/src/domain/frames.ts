// Standbilder aus Videos (ADR-090, F-26): aus regelmäßig entnommenen Bildern nur die mit sichtbarer Änderung behalten
// und den geänderten Bereich bestimmen (für den roten Rahmen). Arbeitet auf verkleinerten Graustufenbildern.

export interface Gray { width: number; height: number; data: Uint8Array }
export interface Box { x: number; y: number; w: number; h: number }

/** RGBA → Graustufen */
export function toGray(rgba: Uint8ClampedArray | Uint8Array, width: number, height: number): Gray {
  const data = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) data[i] = Math.round(0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2]);
  return { width, height, data };
}

/** Anteil geänderter Pixel (Schwelle je Pixel) und umschließendes Rechteck der Änderung (relativ 0–1) */
export function changeOf(a: Gray, b: Gray, pixelThreshold = 24): { ratio: number; box: Box | null } {
  let n = 0;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = y * a.width + x;
      if (Math.abs(a.data[i] - b.data[i]) > pixelThreshold) {
        n++;
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    }
  }
  const ratio = n / (a.width * a.height);
  return { ratio, box: n ? { x: x0 / a.width, y: y0 / a.height, w: (x1 - x0 + 1) / a.width, h: (y1 - y0 + 1) / a.height } : null };
}

/**
 * Bilder mit Änderung gegenüber dem zuletzt behaltenen: das erste immer, danach ab `minRatio` geänderter Fläche.
 * Bei einem kompletten Szenenwechsel (≥ 60 %) kein Rahmen, sonst der geänderte Bereich.
 */
export function selectChanges(frames: Gray[], minRatio = 0.02): { index: number; box: Box | null; ratio: number }[] {
  if (!frames.length) return [];
  const out: { index: number; box: Box | null; ratio: number }[] = [{ index: 0, box: null, ratio: 1 }];
  let last = frames[0];
  for (let i = 1; i < frames.length; i++) {
    const c = changeOf(last, frames[i]);
    if (c.ratio >= minRatio) {
      out.push({ index: i, box: c.ratio >= 0.6 ? null : c.box, ratio: c.ratio });
      last = frames[i];
    }
  }
  return out;
}
