// Klickstrecke aus Screenshots (ADR-093, F-24): Bilder aus dem Bildarchiv als nummerierte Stationen mit Pfeilen,
// parallele Wege als 3a/3b untereinander. Gezeichnet als PNG und im Bildarchiv abgelegt; jede Änderung wird eine neue
// Fassung desselben Bildes (F-21), damit alle Verweise in Kapiteln mitgehen.
import { createRequire } from 'node:module';
import path from 'node:path';
import { createCanvas, GlobalFonts, loadImage, type SKRSContext2D } from '@napi-rs/canvas';
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { clickpathAlt, normalizeStations, stationLabels, type ClickStation } from '../domain/clickpath.js';
import { sha256 } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';
import { addImageVersion, listImageArchive, updateImageMeta } from './imageArchive.js';
import { getMedia, storeMedia } from './media.js';

const THUMB_W = 360;
const THUMB_MAX_H = 220;
const CAPTION_H = 44;
const GAP = 18;
const COL_W = THUMB_W + 90;
const MARGIN = 40;
const COLOR = '#0b5cad';

let fonts = false;
/** Schrift für Beschriftungen: Roboto aus pdfmake – auch im Container ohne Systemschriften */
function ensureFont() {
  if (fonts) return;
  fonts = true;
  try {
    const dir = path.join(path.dirname(createRequire(import.meta.url).resolve('pdfmake/package.json')), 'fonts', 'Roboto');
    GlobalFonts.registerFromPath(path.join(dir, 'Roboto-Regular.ttf'), 'Roboto');
    GlobalFonts.registerFromPath(path.join(dir, 'Roboto-Medium.ttf'), 'Roboto Medium');
  } catch {
    /* ohne Schrift fehlen nur die Beschriftungen */
  }
}

function lines(g: SKRSContext2D, text: string, width: number, max = 2) {
  const out: string[] = [];
  let cur = '';
  for (const w of text.split(' ')) {
    const t = cur ? `${cur} ${w}` : w;
    if (g.measureText(t).width > width && cur) {
      out.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) out.push(cur);
  if (out.length > max) out.splice(max - 1, out.length, `${out.slice(max - 1).join(' ').slice(0, 40)}…`);
  return out;
}

function arrow(g: SKRSContext2D, pts: [number, number][]) {
  g.beginPath();
  g.moveTo(...pts[0]);
  for (const p of pts.slice(1)) g.lineTo(...p);
  g.stroke();
  const [x2, y2] = pts[pts.length - 1];
  const [x1, y1] = pts[pts.length - 2];
  const a = Math.atan2(y2 - y1, x2 - x1);
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - 12 * Math.cos(a - 0.45), y2 - 12 * Math.sin(a - 0.45));
  g.lineTo(x2 - 12 * Math.cos(a + 0.45), y2 - 12 * Math.sin(a + 0.45));
  g.closePath();
  g.fill();
}

/** Klickstrecke als PNG: Stationen von links nach rechts (Umbruch nach `perRow`), Alternativen untereinander */
export async function renderClickpath(ctx: Ctx, title: string, stations: ClickStation[], perRow: number, currentOf: (sha: string) => string) {
  ensureFont();
  const labels = stationLabels(stations);
  // Bilder laden und auf Vorschaugröße bringen
  const cells = await Promise.all(stations.map(async (s) => Promise.all(s.alternatives.map(async (a) => {
    try {
      const img = await loadImage((await getMedia(ctx, currentOf(a.sha))).data);
      const scale = Math.min(THUMB_W / img.width, THUMB_MAX_H / img.height);
      return { img, w: Math.round(img.width * scale), h: Math.round(img.height * scale), caption: a.caption };
    } catch {
      return { img: null, w: THUMB_W, h: Math.round(THUMB_W * 9 / 16), caption: a.caption };
    }
  }))));
  const colH = cells.map((alts) => alts.reduce((n, c) => n + c.h + CAPTION_H, 0) + GAP * (alts.length - 1));
  const rows: number[][] = [];
  stations.forEach((_, i) => (i % perRow === 0 ? rows.push([i]) : rows[rows.length - 1].push(i)));
  const rowH = rows.map((r) => Math.max(...r.map((i) => colH[i])));
  const ROW_GAP = 60;
  // bei Zeilenumbruch rechts Platz für den Pfeil nach unten
  const width = MARGIN * 2 + Math.min(stations.length, perRow) * COL_W - (COL_W - THUMB_W) + (stations.length > perRow ? (COL_W - THUMB_W) / 2 : 0);
  const height = 70 + rowH.reduce((n, h) => n + h, 0) + ROW_GAP * (rows.length - 1) + MARGIN;
  const canvas = createCanvas(width, height);
  const g = canvas.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, width, height);
  g.fillStyle = '#0f172a';
  g.font = '22px "Roboto Medium", Roboto, sans-serif';
  g.fillText(`Klickstrecke: ${title}`.slice(0, 90), MARGIN, 42);

  // Lage je Station: linke obere Ecke, Mittelpunkte der Bilder (für die Pfeile)
  const pos: { x: number; y: number; alts: { l: number; r: number; mid: number; bottom: number }[]; cy: number }[] = [];
  let y = 70;
  rows.forEach((r, ri) => {
    r.forEach((i, ci) => {
      const x = MARGIN + ci * COL_W;
      const top = y + (rowH[ri] - colH[i]) / 2;
      const alts: { l: number; r: number; mid: number; bottom: number }[] = [];
      let yy = top;
      cells[i].forEach((c, k) => {
        const ix = x + (THUMB_W - c.w) / 2;
        if (c.img) g.drawImage(c.img, ix, yy, c.w, c.h);
        else {
          g.fillStyle = '#e2e8f0';
          g.fillRect(ix, yy, c.w, c.h);
          g.fillStyle = '#475569';
          g.font = '15px Roboto, sans-serif';
          g.fillText('Bild fehlt', ix + 12, yy + 28);
        }
        g.strokeStyle = '#94a3b8';
        g.lineWidth = 1;
        g.strokeRect(ix + 0.5, yy + 0.5, c.w - 1, c.h - 1);
        // Nummer
        g.fillStyle = COLOR;
        g.beginPath();
        g.arc(ix + 4, yy + 4, 17, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#ffffff';
        g.font = '15px "Roboto Medium", Roboto, sans-serif';
        const lab = labels[i][k];
        g.fillText(lab, ix + 4 - g.measureText(lab).width / 2, yy + 9);
        // Beschriftung
        g.fillStyle = '#0f172a';
        g.font = '15px Roboto, sans-serif';
        lines(g, c.caption, Math.max(c.w, 200)).forEach((l, n) => g.fillText(l, ix, yy + c.h + 20 + n * 18));
        alts.push({ l: ix, r: ix + c.w, mid: yy + c.h / 2, bottom: yy + c.h + CAPTION_H });
        yy += c.h + CAPTION_H + GAP;
      });
      pos[i] = { x, y: top, alts, cy: y + rowH[ri] / 2 };
    });
    y += rowH[ri] + ROW_GAP;
  });

  // Pfeile: von jeder Alternative zu einem Knoten in der Mitte der Lücke, vom Knoten zu jeder Alternative der nächsten
  // Station; beim Zeilenumbruch unter der Zeile zurück nach links
  g.strokeStyle = COLOR;
  g.fillStyle = COLOR;
  g.lineWidth = 3;
  const line = (pts: [number, number][]) => {
    g.beginPath();
    g.moveTo(...pts[0]);
    for (const p of pts.slice(1)) g.lineTo(...p);
    g.stroke();
  };
  for (let i = 0; i < stations.length - 1; i++) {
    const a = pos[i];
    const b = pos[i + 1];
    const sameRow = Math.floor(i / perRow) === Math.floor((i + 1) / perRow);
    const outX = a.x + THUMB_W + (COL_W - THUMB_W) / 2;
    const outY = a.alts.length > 1 ? a.cy : a.alts[0].mid;
    for (const s2 of a.alts) line([[s2.r + 2, s2.mid], [outX, outY]]);
    if (sameRow) {
      const inY = b.alts.length > 1 ? b.cy : b.alts[0].mid;
      if (b.alts.length === 1) arrow(g, [[outX, outY], [outX, inY], [b.alts[0].l - 3, inY]]);
      else for (const t of b.alts) arrow(g, [[outX, outY], [t.l - 3, t.mid]]);
    } else {
      const turnY = Math.max(...a.alts.map((x) => x.bottom)) + 12 < b.y - 8 ? b.y - ROW_GAP / 2 : b.y - 8;
      const inX = MARGIN / 2;
      line([[outX, outY], [outX, turnY], [inX, turnY]]);
      for (const t of b.alts) arrow(g, [[inX, turnY], [inX, t.mid], [t.l - 3, t.mid]]);
    }
  }
  return Buffer.from(await canvas.encode('png'));
}

const dto = (r: any) => ({
  id: r.id, title: r.title, steps: parseJson<ClickStation[]>(r.steps, []), perRow: Number(r.per_row), baseSha: r.base_sha,
  createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at,
});

async function input(ctx: Ctx, body: any) {
  const title = String(body?.title ?? '').trim().slice(0, 120);
  if (title.length < 3) throw badRequest('title braucht mindestens 3 Zeichen.');
  let steps: ClickStation[];
  try {
    steps = normalizeStations(body?.steps);
  } catch (e) {
    throw badRequest((e as Error).message);
  }
  const perRow = body?.perRow === undefined ? 4 : Number(body.perRow);
  if (!Number.isInteger(perRow) || perRow < 2 || perRow > 6) throw badRequest('perRow muss 2 bis 6 sein.');
  // nur Bilder des Archivs; gezeichnet wird jeweils die aktuelle Fassung
  const { items } = await listImageArchive(ctx);
  const current = new Map(items.flatMap((i) => [[i.sha, i.currentSha], ...i.versions.map((v) => [v.sha, i.currentSha] as [string, string])]));
  for (const s of steps) for (const a of s.alternatives) if (!current.has(a.sha)) throw badRequest(`Bild ${a.sha.slice(0, 12)} ist nicht im Bildarchiv dieses Projekts.`);
  return { title, steps, perRow, currentOf: (sha: string) => current.get(sha) ?? sha };
}

export async function listClickpaths(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM media_clickpaths WHERE project_id = ? ORDER BY updated_at DESC', ctx.projectId)).map(dto);
}

async function row(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM media_clickpaths WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Klickstrecke ${id}`);
  return r;
}

async function withImage(ctx: Ctx, r: any) {
  const d = dto(r);
  const alt = clickpathAlt(d.title, d.steps);
  return { ...d, alt, markdown: `![${alt.replace(/[[\]]/g, '')}](media:${d.baseSha})`, url: `/api/v1/media/${d.baseSha}` };
}

export async function getClickpath(ctx: Ctx, id: string) {
  return withImage(ctx, await row(ctx, id));
}

/** Neue Klickstrecke: Bild zeichnen, im Archiv ablegen (Bildunterschrift = Titel), Definition speichern */
export async function createClickpath(ctx: Ctx, body: any, user: User) {
  const i = await input(ctx, body);
  const png = await renderClickpath(ctx, i.title, i.steps, i.perRow, i.currentOf);
  const m = await storeMedia(ctx, png, `klickstrecke-${i.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.png`);
  await updateImageMeta(ctx, m.sha, { title: `Klickstrecke: ${i.title}` }, user);
  const id = newId('clk');
  await ctx.db.run('INSERT INTO media_clickpaths (id, project_id, title, steps, per_row, base_sha, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, ctx.projectId, i.title, json(i.steps), i.perRow, m.sha, user.id, now(), user.id, now());
  await audit(ctx, user.id, 'image.clickpath_created', 'media', m.sha, { id, stations: i.steps.length });
  return getClickpath(ctx, id);
}

/** Klickstrecke ändern: neu zeichnen und als neue Fassung ablegen – Verweise in Kapiteln zeigen sofort die neue Fassung */
export async function updateClickpath(ctx: Ctx, id: string, body: any, user: User) {
  const r = await row(ctx, id);
  const i = await input(ctx, { title: r.title, perRow: r.per_row, steps: parseJson(r.steps, []), ...body });
  const png = await renderClickpath(ctx, i.title, i.steps, i.perRow, i.currentOf);
  const same = (await ctx.db.get('SELECT sha FROM media_versions WHERE project_id = ? AND base_sha = ? ORDER BY version_no DESC LIMIT 1', ctx.projectId, r.base_sha))?.sha ?? r.base_sha;
  if (sha256(png) !== same) await addImageVersion(ctx, r.base_sha, png, 'klickstrecke.png', 'Klickstrecke geändert', user);
  await updateImageMeta(ctx, r.base_sha, { title: `Klickstrecke: ${i.title}` }, user);
  await ctx.db.run('UPDATE media_clickpaths SET title = ?, steps = ?, per_row = ?, updated_by = ?, updated_at = ? WHERE id = ?', i.title, json(i.steps), i.perRow, user.id, now(), id);
  await audit(ctx, user.id, 'image.clickpath_updated', 'media', r.base_sha, { id, stations: i.steps.length });
  return getClickpath(ctx, id);
}

/** Definition löschen – das erzeugte Bild bleibt im Archiv (es kann in Kapiteln verwendet sein) */
export async function deleteClickpath(ctx: Ctx, id: string, user: User) {
  const r = await row(ctx, id);
  await ctx.db.run('DELETE FROM media_clickpaths WHERE id = ?', id);
  await audit(ctx, user.id, 'image.clickpath_deleted', 'media', r.base_sha, { id });
}
