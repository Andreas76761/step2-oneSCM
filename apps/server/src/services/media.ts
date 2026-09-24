// Bilder & Medien (ADR-029): inhaltsadressierte Ablage je Projekt, Auslieferung und Einbettung in Exporte.
import type { Ctx } from '../context.js';
import { newId, now } from '../db.js';
import { imageRefs, mediaShas, sniffImage } from '../domain/media.js';
import { looksLikeSvg, sanitizeSvg, SvgRejected } from '../domain/svg.js';
import { sha256 } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';

export interface MediaFile {
  sha: string;
  mime: string;
  data: Buffer;
  width: number | null;
  height: number | null;
}

/** Bild ablegen (idempotent). Rasterbilder mit gültiger Signatur; SVG wird bereinigt neu geschrieben (ADR-036). */
export async function storeMedia(ctx: Ctx, input: Buffer, originalName: string | null, importId: string | null = null) {
  let data = input;
  let info = sniffImage(data);
  if (!info && looksLikeSvg(data)) {
    try {
      const clean = sanitizeSvg(new TextDecoder('utf-8', { fatal: true }).decode(data));
      data = Buffer.from(clean.svg, 'utf8');
      info = { mime: 'image/svg+xml', width: clean.width, height: clean.height };
    } catch (e) {
      throw badRequest(`${originalName ?? 'Datei'}: SVG abgelehnt – ${e instanceof SvgRejected ? e.message : 'keine gültige UTF-8-Datei.'}`);
    }
  }
  if (!info) throw badRequest(`${originalName ?? 'Datei'}: kein unterstütztes Bildformat (PNG, JPEG, GIF, WebP, SVG).`);
  const sha = sha256(data);
  const key = `media/${sha}`;
  await ctx.store.put(key, data);
  await ctx.db.run(
    `INSERT INTO media_assets (id, project_id, sha256, mime, byte_size, width, height, storage_key, original_name, import_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (project_id, sha256) DO NOTHING`,
    newId('med'), ctx.projectId, sha, info.mime, data.length, info.width, info.height, key, originalName?.slice(0, 300) ?? null, importId, now(),
  );
  return { sha, ...info };
}

export async function getMedia(ctx: Ctx, sha: string): Promise<MediaFile> {
  if (!/^[a-f0-9]{64}$/.test(sha)) throw notFound(`Bild ${sha}`);
  const r = await ctx.db.get('SELECT * FROM media_assets WHERE project_id = ? AND sha256 = ?', ctx.projectId, sha);
  if (!r) throw notFound(`Bild ${sha}`);
  return { sha, mime: r.mime, data: await ctx.store.get(r.storage_key), width: r.width ?? null, height: r.height ?? null };
}

/** Bilder, auf die die Texte verweisen (nur aus dem eigenen Projekt; unbekannte werden ausgelassen) */
export async function loadMedia(ctx: Ctx, texts: string[]): Promise<Map<string, MediaFile>> {
  const out = new Map<string, MediaFile>();
  for (const sha of mediaShas(texts)) {
    try {
      out.set(sha, await getMedia(ctx, sha));
    } catch {
      /* fehlendes Bild: Darstellung fällt auf den Alternativtext zurück */
    }
  }
  return out;
}

export const dataUri = (m: Pick<MediaFile, 'mime' | 'data'>) => `data:${m.mime};base64,${m.data.toString('base64')}`;

/** Markdown mit eingebetteten Bildern (data:-URIs) – für den eigenständigen Markdown-Export */
export function inlineMedia(md: string, media: Map<string, MediaFile>) {
  if (!imageRefs(md).some((r) => r.sha)) return md;
  return md.replace(/\]\(media:([a-f0-9]{64})\)/g, (all, sha: string) => (media.has(sha) ? `](${dataUri(media.get(sha)!)})` : all));
}

export async function listMedia(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT * FROM media_assets WHERE project_id = ? ORDER BY created_at DESC LIMIT 500', ctx.projectId);
  return rows.map((r) => ({
    sha256: r.sha256, mime: r.mime, byteSize: r.byte_size, width: r.width ?? null, height: r.height ?? null,
    originalName: r.original_name ?? null, importId: r.import_id ?? null, createdAt: r.created_at, url: `/api/v1/media/${r.sha256}`,
  }));
}
