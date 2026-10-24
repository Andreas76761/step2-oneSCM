// Vorher/Nachher-Belege (ADR-106, W-05): zwei Bilder mit Anlass, Änderung und Wirkung; Anzeige mit Schieberegler in der
// Oberfläche und auf Wunsch als Gegenüberstellung (PNG) im Bildarchiv, die sich wie jedes Bild in Kapitel einfügen lässt.
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { audit, type Ctx, type User } from '../context.js';
import { newId, now } from '../db.js';
import { sha256 } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';
import { ensureFont, lines } from './clickpaths.js';
import { addImageVersion, updateImageMeta } from './imageArchive.js';
import { getMedia, storeMedia } from './media.js';

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) || null : null);

async function baseOf(ctx: Ctx, sha: string) {
  return ((await ctx.db.get('SELECT base_sha FROM media_versions WHERE project_id = ? AND sha = ?', ctx.projectId, sha))?.base_sha as string | undefined) ?? sha;
}

async function version(ctx: Ctx, sha: string) {
  const v = await ctx.db.get('SELECT version_no, note, created_at FROM media_versions WHERE project_id = ? AND sha = ?', ctx.projectId, sha);
  return v ? { versionNo: Number(v.version_no), note: v.note ?? null, createdAt: v.created_at } : { versionNo: 1, note: null, createdAt: null };
}

async function dto(ctx: Ctx, r: Record<string, any>) {
  return {
    id: r.id as string, title: r.title as string, beforeSha: r.before_sha as string, afterSha: r.after_sha as string, baseSha: r.base_sha ?? null,
    before: { sha: r.before_sha, url: `/api/v1/media/${r.before_sha}?original=1`, ...(await version(ctx, r.before_sha)) },
    after: { sha: r.after_sha, url: `/api/v1/media/${r.after_sha}?original=1`, ...(await version(ctx, r.after_sha)) },
    reason: r.reason ?? null, change: r.change_text ?? null, effect: r.effect ?? null, ticket: r.ticket ?? null,
    renderedSha: r.rendered_sha ?? null, markdown: r.rendered_sha ? `![Vorher/Nachher: ${String(r.title).replace(/[[\]]/g, '')}](media:${r.rendered_sha})` : null,
    createdBy: r.created_by as string, createdAt: r.created_at as string, updatedBy: r.updated_by as string, updatedAt: r.updated_at as string,
  };
}

async function row(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM media_comparisons WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Vorher/Nachher-Beleg ${id}`);
  return r;
}

export async function listComparisons(ctx: Ctx, q: { sha?: string } = {}) {
  const base = q.sha ? await baseOf(ctx, q.sha) : null;
  const rows = base
    ? await ctx.db.all('SELECT * FROM media_comparisons WHERE project_id = ? AND (base_sha = ? OR before_sha = ? OR after_sha = ?) ORDER BY updated_at DESC', ctx.projectId, base, q.sha, q.sha)
    : await ctx.db.all('SELECT * FROM media_comparisons WHERE project_id = ? ORDER BY updated_at DESC LIMIT 200', ctx.projectId);
  return Promise.all(rows.map((r) => dto(ctx, r)));
}

export async function getComparison(ctx: Ctx, id: string) {
  return dto(ctx, await row(ctx, id));
}

/** Beleg anlegen: Vorher und Nachher müssen Bilder des Projekts sein und sich unterscheiden */
export async function createComparison(ctx: Ctx, input: Record<string, unknown>, user: User) {
  const before = String(input.beforeSha ?? '');
  const after = String(input.afterSha ?? '');
  if (!/^[a-f0-9]{64}$/.test(before) || !/^[a-f0-9]{64}$/.test(after)) throw badRequest('beforeSha und afterSha (SHA-256) sind Pflicht.');
  if (before === after) throw badRequest('Vorher und Nachher sind dasselbe Bild.');
  for (const sha of [before, after]) await getMedia(ctx, sha, { exact: true });
  const [bb, ab] = [await baseOf(ctx, before), await baseOf(ctx, after)];
  const title = text(input.title, 120) ?? ((await ctx.db.get('SELECT title FROM media_meta WHERE project_id = ? AND base_sha = ?', ctx.projectId, ab))?.title as string | undefined) ?? 'Vorher/Nachher';
  const id = newId('cmp');
  await ctx.db.run(
    'INSERT INTO media_comparisons (id, project_id, title, before_sha, after_sha, base_sha, reason, change_text, effect, ticket, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, ctx.projectId, title, before, after, bb === ab ? ab : null, text(input.reason, 500), text(input.change, 500), text(input.effect, 500), text(input.ticket, 40), user.id, now(), user.id, now(),
  );
  await audit(ctx, user.id, 'image.comparison_created', 'media', after, { id, before });
  return getComparison(ctx, id);
}

export async function updateComparison(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const r = await row(ctx, id);
  const set = (k: string, col: string, max: number) => (input[k] !== undefined ? text(input[k], max) : r[col]);
  await ctx.db.run('UPDATE media_comparisons SET title = ?, reason = ?, change_text = ?, effect = ?, ticket = ?, updated_by = ?, updated_at = ? WHERE id = ?',
    set('title', 'title', 120) ?? r.title, set('reason', 'reason', 500), set('change', 'change_text', 500), set('effect', 'effect', 500), set('ticket', 'ticket', 40), user.id, now(), id);
  await audit(ctx, user.id, 'image.comparison_updated', 'media_comparison', id, {});
  return getComparison(ctx, id);
}

export async function deleteComparison(ctx: Ctx, id: string, user: User) {
  await row(ctx, id);
  await ctx.db.run('DELETE FROM media_comparisons WHERE id = ?', id);
  await audit(ctx, user.id, 'image.comparison_deleted', 'media_comparison', id, {});
}

const SIDE = 640;
const MARGIN = 28;

/** Gegenüberstellung: links „Vorher“, rechts „Nachher“, darunter Anlass, Änderung und Wirkung */
export async function renderComparisonPng(ctx: Ctx, c: Awaited<ReturnType<typeof getComparison>>) {
  ensureFont();
  const imgs = await Promise.all([c.beforeSha, c.afterSha].map(async (sha) => loadImage((await getMedia(ctx, sha, { exact: true })).data)));
  const scaled = imgs.map((img) => {
    const s = Math.min(SIDE / img.width, 480 / img.height, 1);
    return { img, w: Math.round(img.width * s), h: Math.round(img.height * s) };
  });
  const imgH = Math.max(...scaled.map((x) => x.h));
  const facts = [['Anlass', c.reason], ['Änderung', c.change], ['Wirkung', c.effect]].filter((f): f is [string, string] => !!f[1]);
  const width = MARGIN * 3 + SIDE * 2;
  const probe = createCanvas(10, 10).getContext('2d');
  probe.font = '16px Roboto, sans-serif';
  const factLines = facts.map(([k, v]) => lines(probe, `${k}: ${v}`, width - 2 * MARGIN, 3));
  const height = 64 + 30 + imgH + 24 + factLines.reduce((n, l) => n + l.length * 22 + 6, 0) + MARGIN;
  const canvas = createCanvas(width, height);
  const g = canvas.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, width, height);
  g.fillStyle = '#0f172a';
  g.font = '22px "Roboto Medium", Roboto, sans-serif';
  g.fillText(`Vorher/Nachher: ${c.title}${c.ticket ? ` (${c.ticket})` : ''}`.slice(0, 100), MARGIN, 40);
  ['Vorher', 'Nachher'].forEach((label, i) => {
    const x = MARGIN + i * (SIDE + MARGIN);
    g.fillStyle = i ? '#15803d' : '#64748b';
    g.font = '18px "Roboto Medium", Roboto, sans-serif';
    g.fillText(label, x, 84);
    const s = scaled[i];
    const ix = x + (SIDE - s.w) / 2;
    g.drawImage(s.img, ix, 94, s.w, s.h);
    g.strokeStyle = i ? '#15803d' : '#cbd5e1';
    g.lineWidth = 3;
    g.strokeRect(ix - 1.5, 94 - 1.5, s.w + 3, s.h + 3);
  });
  let y = 94 + imgH + 36;
  g.fillStyle = '#0f172a';
  g.font = '16px Roboto, sans-serif';
  for (const l of factLines) {
    for (const t of l) {
      g.fillText(t, MARGIN, y);
      y += 22;
    }
    y += 6;
  }
  return Buffer.from(await canvas.encode('png'));
}

/** Gegenüberstellung im Archiv ablegen (erneut: neue Fassung desselben Bildes) */
export async function renderComparison(ctx: Ctx, id: string, user: User) {
  const c = await getComparison(ctx, id);
  const png = await renderComparisonPng(ctx, c);
  let sha = c.renderedSha;
  if (!sha) {
    const m = await storeMedia(ctx, png, `vorher-nachher-${id}.png`);
    sha = m.sha;
  } else {
    const latest = (await ctx.db.get('SELECT sha FROM media_versions WHERE project_id = ? AND base_sha = ? ORDER BY version_no DESC LIMIT 1', ctx.projectId, sha))?.sha ?? sha;
    if (sha256(png) !== latest) await addImageVersion(ctx, sha, png, `vorher-nachher-${id}.png`, 'Vorher/Nachher neu erzeugt', user);
  }
  await updateImageMeta(ctx, sha, { title: `Vorher/Nachher: ${c.title}` }, user);
  await ctx.db.run('UPDATE media_comparisons SET rendered_sha = ?, updated_by = ?, updated_at = ? WHERE id = ?', sha, user.id, now(), id);
  await audit(ctx, user.id, 'image.comparison_rendered', 'media', sha, { id });
  return getComparison(ctx, id);
}
