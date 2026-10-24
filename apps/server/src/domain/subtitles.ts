// Untertitel (WebVTT, SRT) → Markdown mit Zeitmarke je Absatz (ADR-090, M6). Abschnitte je Kapitelmarke bzw.
// Zeitblock von 2 Minuten, Absätze aus aufeinanderfolgenden Einblendungen (bis ~30 s oder Satzende).
// Standbilder (F-26) werden an ihrer Zeit in den passenden Abschnitt eingefügt.
import { escapeAlt } from './media.js';
import { finalize, marker, type LocatedMarkdown } from './pptx.js';

export interface Cue { start: number; end: number; text: string }
export interface Still { time: number; sha: string; alt: string; /** Zwischenbild eines kurzen Zustands (ADR-106, W-10) */ kind?: 'transient' }

const BLOCK_SECONDS = 120;
const PARA_SECONDS = 30;
const PARA_CHARS = 600;

/** „01:02:03.456“, „02:03,456“ → Sekunden */
function seconds(t: string): number {
  const p = t.trim().replace(',', '.').split(':').map(Number);
  if (p.some((x) => Number.isNaN(x))) return NaN;
  return p.reduce((a, b) => a * 60 + b, 0);
}

export const timeLabel = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  const h = Math.floor(t / 3600);
  const mm = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/** Einblendungen aus VTT oder SRT; Formatierungen (<i>, <c.x>, {\an8}) und Sprecherkennungen <v Name> entfallen */
export function parseSubtitles(text: string): { cues: Cue[]; chapters: Cue[] } {
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const cues: Cue[] = [];
  const chapters: Cue[] = [];
  for (const block of src.split(/\n{2,}/)) {
    const lines = block.split('\n').filter((l) => l.trim());
    const ti = lines.findIndex((l) => l.includes('-->'));
    if (ti < 0) continue;
    const [a, b] = lines[ti].split('-->');
    const start = seconds(a);
    const end = seconds(b.trim().split(/\s+/)[0]);
    if (Number.isNaN(start) || Number.isNaN(end)) continue;
    const body = lines.slice(ti + 1).join(' ')
      .replace(/<v\s+[^>]*>/gi, '').replace(/<[^>]+>/g, '').replace(/\{\\[^}]*\}/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (!body) continue;
    // Kapitelmarke als Kennung „Kapitel: …“ bzw. Kennungszeile vor der Zeitangabe („chapter-1“ mit Text)
    const id = ti > 0 ? lines[ti - 1].trim() : '';
    if (/^(kapitel|chapter)\b/i.test(id)) chapters.push({ start, end, text: body });
    else cues.push({ start, end, text: body });
  }
  cues.sort((x, y) => x.start - y.start);
  return { cues, chapters };
}

/** Markdown mit Abschnitten je Kapitelmarke bzw. 2-Minuten-Block und Fundstelle {time} je Absatz */
export function subtitlesToMarkdown(text: string, title: string, stills: Still[] = []): LocatedMarkdown {
  const { cues, chapters } = parseSubtitles(text);
  const warnings: string[] = [];
  if (!cues.length) return { markdown: '', warnings, locators: [], skip: 'Untertitel ohne Text – übersprungen' };
  const out: string[] = [`# ${title.replace(/^#+\s*/, '')}`, ''];
  const sections = chapters.length
    ? chapters.map((c, i) => ({ start: c.start, end: chapters[i + 1]?.start ?? Infinity, title: c.text }))
    : Array.from({ length: Math.ceil((cues[cues.length - 1].end + 0.001) / BLOCK_SECONDS) }, (_, i) => ({ start: i * BLOCK_SECONDS, end: (i + 1) * BLOCK_SECONDS, title: '' }));
  const rest = [...stills].sort((a, b) => a.time - b.time);
  for (const s of sections) {
    const inSec = cues.filter((c) => c.start >= s.start && c.start < s.end);
    const pics = rest.filter((p) => p.time >= s.start && p.time < s.end);
    if (!inSec.length && !pics.length) continue;
    const head = s.title || `${timeLabel(s.start)}–${timeLabel(Math.min(s.end, cues[cues.length - 1].end))}`;
    out.push(marker({ time: timeLabel(inSec[0]?.start ?? s.start) }), `## ${head}`, '');
    // Absätze: bis ~30 s bzw. 600 Zeichen, bevorzugt am Satzende
    let para: Cue[] = [];
    const flush = () => {
      if (!para.length) return;
      // Standbilder vor dem Absatz, der nach ihnen beginnt
      for (const p of pics.filter((x) => x.time < para[0].start && !(x as any).done)) {
        out.push(marker({ time: timeLabel(p.time) }), `![${escapeAlt(p.alt)}](media:${p.sha})`, '');
        (p as any).done = true;
      }
      out.push(marker({ time: timeLabel(para[0].start) }), para.map((c) => c.text).join(' ').replace(/\s+/g, ' '), '');
      para = [];
    };
    for (const c of inSec) {
      const len = para.reduce((n, x) => n + x.text.length, 0);
      if (para.length && (c.start - para[0].start >= PARA_SECONDS || len + c.text.length > PARA_CHARS) && /[.!?…]$/.test(para[para.length - 1].text)) flush();
      else if (para.length && (c.start - para[0].start >= PARA_SECONDS * 2 || len + c.text.length > PARA_CHARS * 1.5)) flush();
      para.push(c);
    }
    flush();
    for (const p of pics.filter((x) => !(x as any).done)) out.push(marker({ time: timeLabel(p.time) }), `![${escapeAlt(p.alt)}](media:${p.sha})`, '');
  }
  return { ...finalize(out), warnings };
}
