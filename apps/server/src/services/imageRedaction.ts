// Datenschutz im Bild (ADR-095): Namen, User-IDs, Adressen, FIN und weitere personenbezogene Daten in Screenshots
// erkennen (lokale Texterkennung mit Wortpositionen) und verpixeln. Das Original bleibt unverändert; ausgeliefert und
// exportiert wird bei eingeschalteter Unkenntlichmachung die verpixelte Kopie. Ausschalten macht es rückgängig.
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { audit, privacyNames, type Ctx, type User } from '../context.js';
import { json, now, parseJson } from '../db.js';
import { cleanRegion, findRegions, pixelBlock, type RedactionRegion } from '../domain/imageRedaction.js';
import { badRequest, notFound } from '../problem.js';
import { ocrBoxesCommand, ocrWords } from './mediaTools.js';
import { storeMedia } from './media.js';

const RASTER = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX_REGIONS = 200;

async function asset(ctx: Ctx, sha: string) {
  if (!/^[a-f0-9]{64}$/.test(sha)) throw notFound(`Bild ${sha}`);
  const r = await ctx.db.get('SELECT * FROM media_assets WHERE project_id = ? AND sha256 = ?', ctx.projectId, sha);
  if (!r) throw notFound(`Bild ${sha}`);
  return r;
}

const rowOf = (ctx: Ctx, sha: string) => ctx.db.get('SELECT * FROM media_redactions WHERE project_id = ? AND sha = ?', ctx.projectId, sha);

/** Verpixelte Kopie, die statt dieser Fassung ausgeliefert wird; null = Original ausliefern */
export async function redactedShaOf(ctx: Ctx, sha: string): Promise<string | null> {
  const r = await ctx.db.get('SELECT redacted_sha FROM media_redactions WHERE project_id = ? AND sha = ? AND enabled = 1', ctx.projectId, sha);
  return (r?.redacted_sha as string | undefined) ?? null;
}

export function redactionDto(r: any, sha: string, available: boolean) {
  const regions = parseJson<RedactionRegion[]>(r?.regions, []);
  return {
    sha,
    available,
    status: (r?.ocr_status as string | undefined) ?? 'none',
    error: r?.ocr_error ?? null,
    enabled: r ? !!Number(r.enabled) : false,
    regions,
    active: regions.filter((x) => x.active).length,
    redactedSha: r?.redacted_sha ?? null,
    detectedAt: r?.detected_at ?? null,
    updatedBy: r?.updated_by ?? null,
    updatedAt: r?.updated_at ?? null,
  };
}

export async function getRedaction(ctx: Ctx, sha: string) {
  const a = await asset(ctx, sha);
  return redactionDto(await rowOf(ctx, sha), sha, RASTER.includes(a.mime) && !!ocrBoxesCommand(ctx.config.mediaTools));
}

/** Aktive Stellen verpixeln und als PNG ablegen */
async function render(ctx: Ctx, a: any, regions: RedactionRegion[]): Promise<string> {
  const img = await loadImage(await ctx.store.get(a.storage_key));
  const W = img.width;
  const H = img.height;
  const canvas = createCanvas(W, H);
  const g = canvas.getContext('2d');
  g.drawImage(img, 0, 0);
  for (const r of regions) {
    const x = Math.floor(r.x * W);
    const y = Math.floor(r.y * H);
    const w = Math.max(1, Math.ceil(r.w * W));
    const h = Math.max(1, Math.ceil(r.h * H));
    // Mittelwert je Block (nicht nur ein Bildpunkt je Block) – dünne Schrift bleibt so nicht als Einzelpunkte stehen
    const block = pixelBlock(h);
    const data = g.getImageData(x, y, Math.min(w, W - x), Math.min(h, H - y));
    const d = data.data;
    for (let by = 0; by < data.height; by += block) {
      for (let bx = 0; bx < data.width; bx += block) {
        const sum = [0, 0, 0, 0];
        let n = 0;
        for (let yy = by; yy < Math.min(by + block, data.height); yy++) {
          for (let xx = bx; xx < Math.min(bx + block, data.width); xx++) {
            const i = (yy * data.width + xx) * 4;
            for (let k = 0; k < 4; k++) sum[k] += d[i + k];
            n++;
          }
        }
        for (let yy = by; yy < Math.min(by + block, data.height); yy++) {
          for (let xx = bx; xx < Math.min(bx + block, data.width); xx++) {
            const i = (yy * data.width + xx) * 4;
            for (let k = 0; k < 4; k++) d[i + k] = Math.round(sum[k] / n);
          }
        }
      }
    }
    g.putImageData(data, x, y);
  }
  const m = await storeMedia(ctx, Buffer.from(await canvas.encode('png')), `${a.sha256.slice(0, 12)}-unkenntlich.png`);
  return m.sha;
}

/** Speichern und Kopie neu erzeugen (bzw. entfernen, wenn ausgeschaltet oder keine aktive Stelle) */
async function save(ctx: Ctx, a: any, patch: { regions: RedactionRegion[]; enabled: boolean; ocrStatus?: string; ocrError?: string | null; detected?: boolean }, actor: string) {
  const prev = await rowOf(ctx, a.sha256);
  const active = patch.regions.filter((r) => r.active);
  const redacted = patch.enabled && active.length ? await render(ctx, a, active) : null;
  const status = patch.ocrStatus ?? prev?.ocr_status ?? 'none';
  const error = patch.ocrError !== undefined ? patch.ocrError : prev?.ocr_error ?? null;
  const detectedAt = patch.detected ? now() : prev?.detected_at ?? null;
  await ctx.db.run(
    `INSERT INTO media_redactions (project_id, sha, regions, enabled, redacted_sha, ocr_status, ocr_error, detected_at, updated_by, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (project_id, sha) DO UPDATE SET regions = excluded.regions, enabled = excluded.enabled, redacted_sha = excluded.redacted_sha,
       ocr_status = excluded.ocr_status, ocr_error = excluded.ocr_error, detected_at = excluded.detected_at, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    ctx.projectId, a.sha256, json(patch.regions), patch.enabled ? 1 : 0, redacted, status, error, detectedAt, actor, now(),
  );
}

/** Manuelle Stellen und Schalter der Vorfassung übernehmen (neue Fassung derselben Maske) */
async function inherited(ctx: Ctx, sha: string) {
  const prev = await ctx.db.get(
    `SELECT r.* FROM media_versions v JOIN media_versions p ON p.project_id = v.project_id AND p.base_sha = v.base_sha AND p.version_no < v.version_no
     JOIN media_redactions r ON r.project_id = p.project_id AND r.sha = p.sha
     WHERE v.project_id = ? AND v.sha = ? ORDER BY p.version_no DESC LIMIT 1`, ctx.projectId, sha,
  );
  if (!prev) return null;
  return { enabled: !!Number(prev.enabled), manual: parseJson<RedactionRegion[]>(prev.regions, []).filter((r) => r.source === 'manual') };
}

/**
 * Erkennung (neu) ausführen: Stellen aus der Texterkennung ersetzen, manuelle Stellen bleiben. Beim ersten Mal ist die
 * Unkenntlichmachung eingeschaltet, sobald etwas gefunden wurde; danach bleibt der Schalter, wie er gesetzt ist.
 */
export async function detectRedaction(ctx: Ctx, sha: string, actor: string) {
  const a = await asset(ctx, sha);
  if (!RASTER.includes(a.mime)) throw badRequest('Unkenntlichmachen gibt es nur für Rasterbilder (PNG, JPEG, WebP, GIF).');
  const prev = await rowOf(ctx, sha);
  const inh = prev ? null : await inherited(ctx, sha);
  const manual = prev ? parseJson<RedactionRegion[]>(prev.regions, []).filter((r) => r.source === 'manual') : inh?.manual ?? [];
  let found: RedactionRegion[] = [];
  let status = 'done';
  let error: string | null = null;
  try {
    const data = await ctx.store.get(a.storage_key);
    const words = await ocrWords(ctx.config.mediaTools, data, EXT[a.mime]);
    if (words === null) status = 'unavailable';
    else {
      // Maße aus dem Upload fehlen bei manchen JPEG/WebP – dann aus dem Bild selbst (sonst Stellen mit NaN, nichts unkenntlich)
      let [w, h] = [Number(a.width), Number(a.height)];
      if (!(w > 0 && h > 0)) ({ width: w, height: h } = await loadImage(data));
      found = findRegions(words, w, h, { names: await privacyNames(ctx.db) });
    }
  } catch (e) {
    status = 'failed';
    error = (e as Error).message.slice(0, 500);
  }
  const regions = renumber([...found, ...manual]).slice(0, MAX_REGIONS);
  const enabled = prev ? !!Number(prev.enabled) : inh ? inh.enabled : true;
  await save(ctx, a, { regions, enabled, ocrStatus: status, ocrError: error, detected: status === 'done' }, actor);
  await audit(ctx, actor, 'image.redaction_detected', 'media', sha, { status, found: found.length, manual: manual.length, kinds: [...new Set(found.map((r) => r.kind))] });
  return getRedaction(ctx, sha);
}

const renumber = (rs: RedactionRegion[]) => rs.map((r, i) => ({ ...r, id: `r${i + 1}` }));

/**
 * Änderungen: enabled (alles an/aus), regions [{ id, active }] (einzelne Stellen an/aus), add [{ x, y, w, h }]
 * (manuell gezogene Stellen), remove [id] (nur manuelle Stellen).
 */
export async function updateRedaction(ctx: Ctx, sha: string, input: any, user: User) {
  const a = await asset(ctx, sha);
  if (!RASTER.includes(a.mime)) throw badRequest('Unkenntlichmachen gibt es nur für Rasterbilder (PNG, JPEG, WebP, GIF).');
  const prev = await rowOf(ctx, sha);
  let regions = parseJson<RedactionRegion[]>(prev?.regions, []);
  const byId = new Map(regions.map((r) => [r.id, r]));
  if (input.regions !== undefined) {
    if (!Array.isArray(input.regions)) throw badRequest('regions ist eine Liste aus { id, active }.');
    for (const x of input.regions) {
      const r = byId.get(String(x?.id));
      if (!r) throw badRequest(`Stelle ${x?.id} gibt es nicht.`);
      if (typeof x.active !== 'boolean') throw badRequest('active ist true oder false.');
      r.active = x.active;
    }
  }
  if (input.remove !== undefined) {
    if (!Array.isArray(input.remove)) throw badRequest('remove ist eine Liste von Stellen-IDs.');
    const drop = new Set(input.remove.map(String));
    for (const id of drop) if (byId.get(id as string)?.source !== 'manual') throw badRequest(`Stelle ${id} ist keine manuelle Stelle – erkannte Stellen schalten Sie aus.`);
    regions = regions.filter((r) => !drop.has(r.id));
  }
  if (input.add !== undefined) {
    if (!Array.isArray(input.add)) throw badRequest('add ist eine Liste aus { x, y, w, h } (relativ 0–1).');
    for (const x of input.add) {
      const c = cleanRegion(x);
      if (!c) throw badRequest('Stelle ungültig: x, y, w, h relativ zum Bild (0–1), mindestens 0,5 % groß.');
      regions.push({ id: '', ...c, kind: 'manual', label: 'manuell', source: 'manual', active: true });
    }
  }
  if (regions.length > MAX_REGIONS) throw badRequest(`Höchstens ${MAX_REGIONS} Stellen je Bild.`);
  if (input.enabled !== undefined && typeof input.enabled !== 'boolean') throw badRequest('enabled ist true oder false.');
  const enabled = input.enabled ?? (prev ? !!Number(prev.enabled) : true);
  await save(ctx, a, { regions: renumber(regions), enabled }, user.id);
  await audit(ctx, user.id, input.enabled === false ? 'image.redaction_undone' : 'image.redaction_updated', 'media', sha, {
    enabled, regions: regions.length, added: Array.isArray(input.add) ? input.add.length : 0, removed: Array.isArray(input.remove) ? input.remove.length : 0,
  });
  return getRedaction(ctx, sha);
}

/** Nach dem Ablegen eines Screenshots die Erkennung im Hintergrund anstoßen (nur mit eingerichteter Texterkennung) */
export async function queueRedaction(ctx: Ctx, sha: string, mime: string) {
  if (!RASTER.includes(mime) || !ocrBoxesCommand(ctx.config.mediaTools)) return;
  if (await rowOf(ctx, sha)) return;
  await ctx.jobs.enqueue('image-redact', { projectId: ctx.projectId, sha });
}

/** Job: Erkennung für ein Bild, sofern noch nicht geschehen */
export async function runRedactionJob(ctx: Ctx, sha: string) {
  if (await rowOf(ctx, sha)) return;
  if (!(await ctx.db.get('SELECT 1 FROM media_assets WHERE project_id = ? AND sha256 = ?', ctx.projectId, sha))) return;
  await detectRedaction(ctx, sha, 'system');
}
