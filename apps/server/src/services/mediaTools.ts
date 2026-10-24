// Lokale Werkzeuge für Video und Texterkennung (ADR-090, M6): Transkription (z. B. whisper.cpp), Standbilder mit
// Änderungserkennung (ffmpeg, F-26) und Texterkennung (z. B. Tesseract). Befehle kommen aus der Umgebung des Betriebs,
// laufen ohne Shell mit eigenem Arbeitsverzeichnis und Zeitlimit; Daten verlassen den Rechner nicht.
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import type { MediaToolsConfig } from '../config.js';
import { selectChanges, selectTransients, toGray } from '../domain/frames.js';
import { parseOcrTsv, type OcrWord } from '../domain/imageRedaction.js';
import { timeLabel, type Still } from '../domain/subtitles.js';

/** Befehl in Argumente zerlegen (Anführungszeichen erlaubt), Platzhalter je Argument ersetzen */
export function commandArgs(template: string, vars: Record<string, string>): string[] {
  const args = [...template.matchAll(/"((?:\\"|[^"])*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
  return args.map((a) => a.replace(/\{(\w+)\}/g, (all, k) => (k in vars ? vars[k] : all)));
}

function run(cmd: string, args: string[], opts: { cwd: string; timeoutMs: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { cwd: opts.cwd, timeout: opts.timeoutMs, maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, stdout, stderr) => {
      if (err) reject(new Error(`${path.basename(cmd)}: ${(stderr || err.message).toString().trim().split('\n').slice(-3).join(' ')}`));
      else resolve(stdout.toString());
    });
  });
}

async function withTemp<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'onescm-media-'));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

/**
 * Befehl für Texterkennung mit Wortpositionen (ADR-095): OCR_BOXES_CMD, sonst aus OCR_CMD abgeleitet, wenn das Tesseract
 * ist (Konfiguration „tsv“ am Ende liefert je Wort Position und Größe).
 */
export function ocrBoxesCommand(cfg: MediaToolsConfig): string | null {
  if (cfg.ocrBoxesCmd) return cfg.ocrBoxesCmd;
  if (cfg.ocrCmd && /tesseract/i.test(cfg.ocrCmd) && /\bstdout\b/.test(cfg.ocrCmd)) return `${cfg.ocrCmd.replace(/\s+(txt|tsv|hocr)\s*$/i, '')} tsv`;
  return null;
}

export const toolStatus = (cfg: MediaToolsConfig) => ({ transcribe: !!cfg.transcribeCmd, ocr: !!cfg.ocrCmd, stills: !!cfg.ffmpeg, redact: !!ocrBoxesCommand(cfg) });

/** Transkription eines Videos als WebVTT; null, wenn nicht eingerichtet */
export async function transcribe(cfg: MediaToolsConfig, video: Buffer, lang = 'de'): Promise<string | null> {
  if (!cfg.transcribeCmd) return null;
  return withTemp(async (dir) => {
    const input = path.join(dir, 'video.mp4');
    const output = path.join(dir, 'transkript');
    await fs.writeFile(input, video);
    const [cmd, ...args] = commandArgs(cfg.transcribeCmd!, { input, output, lang });
    const stdout = await run(cmd, args, { cwd: dir, timeoutMs: cfg.timeoutMs });
    for (const f of [`${output}.vtt`, output, `${output}.srt`]) {
      const text = await fs.readFile(f, 'utf8').catch(() => null);
      if (text?.includes('-->')) return text;
    }
    if (stdout.includes('-->')) return stdout;
    throw new Error('Transkription lieferte keine Untertitel (VTT/SRT).');
  });
}

const SAMPLE_SECONDS = 2;
const MAX_FRAMES = 600;
/** Zwischenbilder (ADR-106, W-10): zweiter Durchgang mit 2 Bildern je Sekunde, Zustände bis 2 s */
const FINE_SECONDS = 0.5;
const FINE_MAX_FRAMES = 2400;
const TRANSIENT_MAX_FRAMES = 4;

type Frame = { img: Awaited<ReturnType<typeof loadImage>>; gray: ReturnType<typeof toGray> };

async function sampleFrames(cfg: MediaToolsConfig, input: string, dir: string, seconds: number, max: number): Promise<Frame[]> {
  await fs.mkdir(dir, { recursive: true });
  await run(cfg.ffmpeg!, ['-hide_banner', '-loglevel', 'error', '-i', input, '-vf', `fps=1/${seconds},scale=1280:-2`, '-frames:v', String(max), path.join(dir, 'f%05d.png')], { cwd: dir, timeoutMs: cfg.timeoutMs });
  const files = (await fs.readdir(dir)).filter((f) => /^f\d+\.png$/.test(f)).sort();
  const small = createCanvas(64, 36);
  const sctx = small.getContext('2d');
  const frames: Frame[] = [];
  for (const f of files) {
    const img = await loadImage(await fs.readFile(path.join(dir, f)));
    sctx.drawImage(img, 0, 0, 64, 36);
    frames.push({ img, gray: toGray(sctx.getImageData(0, 0, 64, 36).data, 64, 36) });
  }
  return frames;
}

/** Bild als PNG mit rotem Rahmen um den geänderten Bereich (mit etwas Rand) */
async function framed(img: Frame['img'], box: { x: number; y: number; w: number; h: number } | null) {
  const canvas = createCanvas(img.width, img.height);
  const g = canvas.getContext('2d');
  g.drawImage(img, 0, 0);
  if (box) {
    const pad = 0.015;
    const x = Math.max(0, box.x - pad) * img.width;
    const y = Math.max(0, box.y - pad) * img.height;
    g.strokeStyle = '#e00000';
    g.lineWidth = Math.max(3, Math.round(img.width / 300));
    g.strokeRect(x, y, Math.min(img.width - x, (box.w + 2 * pad) * img.width), Math.min(img.height - y, (box.h + 2 * pad) * img.height));
  }
  return Buffer.from(await canvas.encode('png'));
}

/**
 * Standbilder (F-26): alle 2 s ein Bild, behalten werden Bilder mit sichtbarer Änderung; der geänderte Bereich wird
 * rot umrahmt. Zwischenbilder (W-10): ein zweiter Durchgang mit 2 Bildern je Sekunde findet kurze Zustände (Menü,
 * Dialog), die nach höchstens 2 s wieder verschwinden und zwischen zwei Standbildern liegen. `store` legt das PNG ab und
 * liefert den SHA-256. Ohne ffmpeg: keine Standbilder.
 */
export async function extractStills(cfg: MediaToolsConfig, video: Buffer, store: (png: Buffer, name: string) => Promise<string>): Promise<Still[]> {
  if (!cfg.ffmpeg) return [];
  return withTemp(async (dir) => {
    const input = path.join(dir, 'video.mp4');
    await fs.writeFile(input, video);
    const images = await sampleFrames(cfg, input, path.join(dir, 'a'), SAMPLE_SECONDS, MAX_FRAMES);
    const out: Still[] = [];
    for (const c of selectChanges(images.map((i) => i.gray))) {
      const time = c.index * SAMPLE_SECONDS;
      const sha = await store(await framed(images[c.index].img, c.box), `standbild-${timeLabel(time).replace(/:/g, '-')}.png`);
      out.push({ time, sha, alt: `Standbild bei ${timeLabel(time)}${c.box ? ' – Änderung rot markiert' : ''}` });
    }
    if (cfg.transientStills !== false) {
      const fine = await sampleFrames(cfg, input, path.join(dir, 'b'), FINE_SECONDS, FINE_MAX_FRAMES);
      for (const t of selectTransients(fine.map((i) => i.gray), { maxFrames: TRANSIENT_MAX_FRAMES })) {
        const time = Math.round(t.index * FINE_SECONDS * 10) / 10;
        // schon als Standbild erfasst
        if (out.some((s) => Math.abs(s.time - time) < FINE_SECONDS)) continue;
        const sha = await store(await framed(fine[t.index].img, t.box), `zwischenbild-${timeLabel(time).replace(/:/g, '-')}.png`);
        out.push({ time, sha, alt: `Zwischenbild bei ${timeLabel(time)} – kurz sichtbar (Menü oder Dialog)${t.box ? ', rot markiert' : ''}`, kind: 'transient' });
      }
      out.sort((a, b) => a.time - b.time);
    }
    return out;
  });
}

/** Texterkennung eines Bildes (PNG); null, wenn nicht eingerichtet */
export async function ocrImage(cfg: MediaToolsConfig, png: Buffer, lang = 'deu+eng'): Promise<string | null> {
  if (!cfg.ocrCmd) return null;
  return withTemp(async (dir) => {
    const input = path.join(dir, 'seite.png');
    await fs.writeFile(input, png);
    const [cmd, ...args] = commandArgs(cfg.ocrCmd!, { input, output: path.join(dir, 'text'), lang });
    const stdout = await run(cmd, args, { cwd: dir, timeoutMs: cfg.timeoutMs });
    return stdout.trim() || ((await fs.readFile(path.join(dir, 'text.txt'), 'utf8').catch(() => '')).trim());
  });
}

/** Wörter mit Position (Pixel) aus einem Bild; null, wenn keine Texterkennung mit Wortpositionen eingerichtet ist */
export async function ocrWords(cfg: MediaToolsConfig, image: Buffer, ext = 'png', lang = 'deu+eng'): Promise<OcrWord[] | null> {
  const template = ocrBoxesCommand(cfg);
  if (!template) return null;
  return withTemp(async (dir) => {
    const input = path.join(dir, `bild.${ext}`);
    await fs.writeFile(input, image);
    const [cmd, ...args] = commandArgs(template, { input, output: path.join(dir, 'text'), lang });
    const stdout = await run(cmd, args, { cwd: dir, timeoutMs: cfg.timeoutMs });
    const tsv = stdout.includes('\t') ? stdout : await fs.readFile(path.join(dir, 'text.tsv'), 'utf8').catch(() => '');
    return parseOcrTsv(tsv);
  });
}
