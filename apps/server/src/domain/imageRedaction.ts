// Datenschutz im Bild (ADR-095): Wörter mit Position aus der Texterkennung (TSV wie Tesseract) → Zeilentext →
// Datenschutzprüfung (Namen, User-IDs, Adressen, FIN …) → Rechtecke über den betroffenen Wörtern (relativ 0–1).
import { privacySpans, type PrivacyKind, type PrivacyOptions } from './privacy.js';

export interface OcrWord { text: string; x: number; y: number; w: number; h: number; line: string; conf: number }

export interface RedactionRegion {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: PrivacyKind | 'manual';
  /** maskierter Treffer (nie der Klartext) */
  label: string;
  source: 'ocr' | 'manual';
  active: boolean;
}

export const KIND_LABELS: Record<RedactionRegion['kind'], string> = {
  email: 'E-Mail', phone: 'Telefon', iban: 'IBAN', vin: 'FIN', plate: 'Kennzeichen', user_id: 'User-ID', address: 'Adresse', name: 'Name', manual: 'manuell',
};

/** Tesseract-TSV: level page block par line word left top width height conf text – Wörter (level 5) mit Text */
export function parseOcrTsv(tsv: string): OcrWord[] {
  const out: OcrWord[] = [];
  for (const line of tsv.split(/\r?\n/)) {
    const c = line.split('\t');
    if (c.length < 12 || c[0] !== '5') continue;
    const text = c.slice(11).join('\t').trim();
    const [x, y, w, h] = c.slice(6, 10).map(Number);
    if (!text || ![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) continue;
    out.push({ text, x, y, w, h, line: `${c[1]}.${c[2]}.${c[3]}.${c[4]}`, conf: Number(c[10]) });
  }
  return out;
}

const PAD = 0.25; // Rand um die Wörter, relativ zur Zeilenhöhe

/**
 * Stellen mit personenbezogenen Daten: je Zeile den Text aus den Wörtern zusammensetzen, die Datenschutzprüfung
 * anwenden und die Rechtecke der getroffenen Wörter vereinigen (mit Rand). Feldbezeichnungen wie „User-ID:“ bleiben
 * lesbar, unkenntlich wird nur der Wert.
 */
export function findRegions(words: OcrWord[], width: number, height: number, opts: PrivacyOptions = {}): RedactionRegion[] {
  const lines = new Map<string, OcrWord[]>();
  for (const w of words) lines.set(w.line, [...(lines.get(w.line) ?? []), w]);
  const out: RedactionRegion[] = [];
  for (const ws of lines.values()) {
    ws.sort((a, b) => a.x - b.x);
    let text = '';
    const pos: { start: number; end: number; w: OcrWord }[] = [];
    for (const w of ws) {
      if (text) text += ' ';
      pos.push({ start: text.length, end: text.length + w.text.length, w });
      text += w.text;
    }
    for (const s of privacySpans(text, opts)) {
      const hit = pos.filter((p) => p.start < s.end && p.end > s.start).map((p) => p.w);
      if (!hit.length) continue;
      const lh = Math.max(...hit.map((w) => w.h));
      const pad = lh * PAD;
      const x1 = Math.max(0, Math.min(...hit.map((w) => w.x)) - pad);
      const y1 = Math.max(0, Math.min(...hit.map((w) => w.y)) - pad);
      const x2 = Math.min(width, Math.max(...hit.map((w) => w.x + w.w)) + pad);
      const y2 = Math.min(height, Math.max(...hit.map((w) => w.y + w.h)) + pad);
      out.push({ id: `r${out.length + 1}`, ...rel(x1, y1, x2 - x1, y2 - y1, width, height), kind: s.kind, label: s.match, source: 'ocr', active: true });
    }
  }
  return out;
}

const r4 = (n: number) => Math.round(n * 10000) / 10000;
const rel = (x: number, y: number, w: number, h: number, W: number, H: number) => ({ x: r4(x / W), y: r4(y / H), w: r4(w / W), h: r4(h / H) });

/** Manuell gezogene Stelle prüfen und auf das Bild begrenzen (relativ 0–1, mindestens 0,5 % groß) */
export function cleanRegion(v: any): { x: number; y: number; w: number; h: number } | null {
  const n = ['x', 'y', 'w', 'h'].map((k) => Number(v?.[k]));
  if (!n.every(Number.isFinite)) return null;
  const x = Math.min(Math.max(n[0], 0), 1);
  const y = Math.min(Math.max(n[1], 0), 1);
  const w = Math.min(n[2], 1 - x);
  const h = Math.min(n[3], 1 - y);
  if (w < 0.005 || h < 0.005) return null;
  return { x: r4(x), y: r4(y), w: r4(w), h: r4(h) };
}

/** Kantenlänge der Pixelblöcke: grob genug, dass Text nicht rekonstruierbar ist */
export const pixelBlock = (regionHeightPx: number) => Math.max(8, Math.round(regionHeightPx / 2));

/** Überdeckung zweier Stellen (Schnitt durch Vereinigung, 0…1) */
const overlap = (a: RedactionRegion, b: RedactionRegion) => {
  const w = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const h = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const inter = w * h;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
};

/**
 * Erneute Erkennung: von Hand ausgeschaltete Stellen bleiben aus, wenn die neue Erkennung dieselbe Stelle (gleiche Art,
 * Überdeckung ab 50 %) wieder findet – sonst würde etwa eine bewusst lesbare Feldbezeichnung erneut unkenntlich.
 */
export function carryInactive(found: RedactionRegion[], previous: RedactionRegion[]): RedactionRegion[] {
  const off = previous.filter((p) => p.source === 'ocr' && !p.active);
  return found.map((f) => (off.some((p) => p.kind === f.kind && overlap(p, f) >= 0.5) ? { ...f, active: false } : f));
}
