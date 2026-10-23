// Bildarchiv (ADR-085, F-20, F-21): je Bild eine feste Bildnummer (B-0001 …), Merkmale (Sprache, Rollen, Sparten, Märkte,
// Release, Reiter), Versionen – eine neue Fassung ersetzt das Bild überall, das Original bleibt abrufbar – und
// Platzhalterbilder mit reservierter Nummer. Prüfregeln je Bild und Bildabdeckung je Kapitel.
import { audit, type Ctx, type User } from '../context.js';
import { json, now, parseJson, type Row } from '../db.js';
import { imageRefs } from '../domain/media.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { storeMedia } from './media.js';
import { suggestOutline } from '../domain/outlineSuggest.js';
import { outlineProfiles } from './metadataOutline.js';

const ROLES = ['dealer', 'market', 'mo', 'hq', 'all'];
const DIVISIONS = ['car', 'van', 'all']; // nur Pkw und Van (Entscheidung 23.10.2026)
const LANG_RE = /^[a-z]{2}$/;
const MARKET_RE = /^[A-Z]{2}$/;
// Prüfregeln (F-20)
const MIN_WIDTH = 600;          // Screenshots darunter sind im Druck kaum lesbar
const MAX_BYTES = 2 * 1024 * 1024;
const LATEST = `v.status <> 'superseded' AND NOT EXISTS (
  SELECT 1 FROM generated_chapter_versions v2 WHERE v2.chapter_id = v.chapter_id AND v2.status <> 'superseded' AND v2.version_no > v.version_no)`;

export const imageNumber = (n: number) => `B-${String(n).padStart(4, '0')}`;

export type ImageCheck = { rule: string; severity: 'error' | 'warning' | 'info'; message: string };

/** Basis-Bilder: alle Bilder außer späteren Fassungen und PNG-Fassungen von SVG */
async function bases(ctx: Ctx) {
  return ctx.db.all(
    `SELECT m.* FROM media_assets m WHERE m.project_id = ?
       AND NOT EXISTS (SELECT 1 FROM media_versions v WHERE v.project_id = m.project_id AND v.sha = m.sha256 AND v.version_no > 1)
       AND NOT EXISTS (SELECT 1 FROM media_assets p WHERE p.project_id = m.project_id AND p.png_sha = m.sha256)
     ORDER BY m.created_at, m.sha256`, ctx.projectId,
  );
}

/** Feste Bildnummern vergeben – in der Reihenfolge, in der die Bilder ins Projekt kamen */
async function ensureNumbers(ctx: Ctx, rows: Row[], actor = 'system') {
  const have = new Set((await ctx.db.all('SELECT base_sha FROM media_meta WHERE project_id = ?', ctx.projectId)).map((r) => r.base_sha));
  const missing = rows.filter((r) => !have.has(r.sha256));
  if (!missing.length) return;
  await ctx.db.tx(async () => {
    let next = Number((await ctx.db.get<{ n: number }>('SELECT MAX(image_no) AS n FROM media_meta WHERE project_id = ?', ctx.projectId))?.n ?? 0);
    for (const r of missing) {
      await ctx.db.run(
        'INSERT INTO media_meta (project_id, base_sha, image_no, updated_by, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (project_id, base_sha) DO NOTHING',
        ctx.projectId, r.sha256, ++next, actor, now(),
      );
    }
  });
}

async function baseOf(ctx: Ctx, sha: string) {
  if (!/^[a-f0-9]{64}$/.test(sha)) throw notFound(`Bild ${sha}`);
  const v = await ctx.db.get('SELECT base_sha FROM media_versions WHERE project_id = ? AND sha = ?', ctx.projectId, sha);
  const base = (v?.base_sha as string | undefined) ?? sha;
  const r = await ctx.db.get('SELECT * FROM media_assets WHERE project_id = ? AND sha256 = ?', ctx.projectId, base);
  if (!r) throw notFound(`Bild ${sha}`);
  return r;
}

/** Verwendung je Fassung in den neuesten Kapitelversionen und in Quellen, mit Alternativtext je Vorkommen */
async function usage(ctx: Ctx, shas: string[]) {
  const like = shas.map(() => 'b.text LIKE ?').join(' OR ');
  const blocks = shas.length ? await ctx.db.all(
    `SELECT b.id, b.text, b.section_code, c.id AS chapter_id, c.title, v.status FROM content_blocks b
     JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND b.deleted_at IS NULL AND ${LATEST} AND (${like})`,
    ctx.projectId, ...shas.map((s) => `%media:${s}%`),
  ) : [];
  const snippets = shas.length ? Number((await ctx.db.get(
    `SELECT COUNT(*) AS n FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL AND (${shas.map(() => 's.text LIKE ?').join(' OR ')})`,
    ctx.projectId, ...shas.map((s) => `%media:${s}%`),
  ))?.n ?? 0) : 0;
  const set = new Set(shas);
  const refs = blocks.flatMap((b) => imageRefs(b.text).filter((x) => x.sha && set.has(x.sha)).map((x) => ({ ...x, b })));
  const chapters = [...new Map(blocks.map((b) => [b.chapter_id, { chapterId: b.chapter_id, title: b.title, status: b.status }])).values()];
  return { chapters, snippets, refs };
}

function checksFor(cur: Row, meta: Row, use: Awaited<ReturnType<typeof usage>>, title: string | null): ImageCheck[] {
  const out: ImageCheck[] = [];
  const placeholder = !!Number(meta.placeholder);
  if (use.refs.some((r) => !r.alt?.trim())) out.push({ rule: 'alt_missing', severity: 'error', message: 'In mindestens einem Absatz fehlt der Alternativtext (Pflicht, ADR-029).' });
  if (placeholder && use.chapters.some((c) => c.status === 'approved')) out.push({ rule: 'placeholder_approved', severity: 'error', message: 'Platzhalter in einem freigegebenen Kapitel – echte Fassung hochladen.' });
  else if (placeholder && use.chapters.length) out.push({ rule: 'placeholder_used', severity: 'warning', message: 'Platzhalter wird verwendet – echte Fassung fehlt noch.' });
  if (!title?.trim()) out.push({ rule: 'caption_missing', severity: 'warning', message: 'Bildunterschrift (Titel) fehlt – sie erscheint im Bildverzeichnis.' });
  if (!placeholder && cur.mime !== 'image/svg+xml' && cur.width && cur.width < MIN_WIDTH) out.push({ rule: 'low_resolution', severity: 'warning', message: `Breite ${cur.width} px – unter ${MIN_WIDTH} px im Druck schwer lesbar.` });
  if (Number(cur.byte_size) > MAX_BYTES) out.push({ rule: 'too_large', severity: 'warning', message: `Datei ${(Number(cur.byte_size) / 1048576).toFixed(1)} MB – über 2 MB verlangsamt Exporte.` });
  if (!meta.language) out.push({ rule: 'language_missing', severity: 'info', message: 'Sprache der Oberfläche im Bild ist nicht angegeben.' });
  if (!parseJson<string[]>(meta.roles, []).length || !parseJson<string[]>(meta.divisions, []).length) out.push({ rule: 'scope_missing', severity: 'info', message: 'Rollen oder Sparten sind nicht angegeben.' });
  if (!use.chapters.length && !use.snippets) out.push({ rule: 'unused', severity: 'info', message: 'Das Bild wird nirgends verwendet.' });
  return out;
}

async function item(ctx: Ctx, base: Row, nav: Map<string, Row>) {
  const meta = await ctx.db.get('SELECT * FROM media_meta WHERE project_id = ? AND base_sha = ?', ctx.projectId, base.sha256);
  const versions = await ctx.db.all('SELECT * FROM media_versions WHERE project_id = ? AND base_sha = ? ORDER BY version_no', ctx.projectId, base.sha256);
  const current = versions.length ? versions[versions.length - 1].sha : base.sha256;
  const cur = (current === base.sha256 ? base : await ctx.db.get('SELECT * FROM media_assets WHERE project_id = ? AND sha256 = ?', ctx.projectId, current)) ?? base;
  const shas = versions.length ? versions.map((v) => v.sha as string) : [base.sha256 as string];
  const use = await usage(ctx, shas);
  const n = nav.get(meta?.nav_label_id);
  // Herkunft aus einer Folie mit Gliederungs-Vorschlag (F-25) und übernommener Gliederungspunkt
  const src = await ctx.db.get('SELECT * FROM media_context WHERE project_id = ? AND sha = ?', ctx.projectId, base.sha256);
  const ol = meta?.outline_label_id ? await ctx.db.get('SELECT id, code, name_de FROM metadata_labels WHERE id = ?', meta.outline_label_id) : null;
  return {
    sha: base.sha256, imageNo: imageNumber(Number(meta?.image_no ?? 0)), title: base.title ?? null, mime: cur.mime, width: cur.width ?? null, height: cur.height ?? null, byteSize: Number(cur.byte_size),
    currentSha: current, url: `/api/v1/media/${current}`, placeholder: !!Number(meta?.placeholder ?? 0),
    language: meta?.language ?? null, roles: parseJson<string[]>(meta?.roles, []), divisions: parseJson<string[]>(meta?.divisions, []), markets: parseJson<string[]>(meta?.markets, []),
    release: meta?.release ?? null, navigation: n ? { id: n.id, nameDe: n.name_de, nameEn: n.name_en } : null,
    outline: ol ? { id: ol.id, code: ol.code, nameDe: ol.name_de } : null,
    source: src ? { path: src.source_path, slide: src.slide == null ? null : Number(src.slide), slideTitle: src.slide_title ?? null, suggestions: parseJson<any[]>(src.suggestions, []) } : null,
    versions: (versions.length ? versions : [{ sha: base.sha256, version_no: 1, note: null, created_by: null, created_at: base.created_at }])
      .map((v) => ({ sha: v.sha, versionNo: Number(v.version_no), note: v.note ?? null, createdBy: v.created_by ?? null, createdAt: v.created_at, url: `/api/v1/media/${v.sha}?original=1` })),
    usedIn: use.chapters, sourceUses: use.snippets,
    checks: checksFor(cur, meta ?? { placeholder: 0 }, use, base.title ?? null),
    createdAt: base.created_at,
  };
}

export async function listImageArchive(ctx: Ctx, opts: { q?: string } = {}) {
  const rows = await bases(ctx);
  await ensureNumbers(ctx, rows);
  const nav = new Map((await ctx.db.all("SELECT id, name_de, name_en FROM metadata_labels WHERE project_id = ? AND label_group = 'navigation'", ctx.projectId)).map((r) => [r.id, r]));
  let items = await Promise.all(rows.map((r) => item(ctx, r, nav)));
  if (opts.q?.trim()) {
    const q = opts.q.trim().toLowerCase();
    items = items.filter((i) => `${i.imageNo} ${i.title ?? ''} ${i.navigation?.nameDe ?? ''} ${i.release ?? ''}`.toLowerCase().includes(q));
  }
  items.sort((a, b) => a.imageNo.localeCompare(b.imageNo));
  const count = (sev: string) => items.filter((i) => i.checks.some((c) => c.severity === sev)).length;
  return { items, summary: { images: items.length, placeholders: items.filter((i) => i.placeholder).length, withErrors: count('error'), withWarnings: count('warning'), versioned: items.filter((i) => i.versions.length > 1).length } };
}

async function getItem(ctx: Ctx, baseSha: string) {
  const nav = new Map((await ctx.db.all("SELECT id, name_de, name_en FROM metadata_labels WHERE project_id = ? AND label_group = 'navigation'", ctx.projectId)).map((r) => [r.id, r]));
  const base = await baseOf(ctx, baseSha);
  await ensureNumbers(ctx, [base]);
  return item(ctx, base, nav);
}

const cleanList = (v: unknown, ok: (x: string) => boolean, field: string) => {
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !ok(x))) throw badRequest(`${field} ist ungültig.`);
  return [...new Set(v as string[])];
};

/** Merkmale und Bildunterschrift ändern (Bearbeitungsrecht) */
export async function updateImageMeta(ctx: Ctx, sha: string, input: any, user: User) {
  const base = await baseOf(ctx, sha);
  await ensureNumbers(ctx, [base]);
  const sets: string[] = [];
  const vals: unknown[] = [];
  const set = (col: string, v: unknown) => (sets.push(`${col} = ?`), vals.push(v));
  if (input.language !== undefined) {
    if (input.language !== null && !LANG_RE.test(String(input.language))) throw badRequest('language ist ein Sprachcode mit zwei Buchstaben (z. B. de, en).');
    set('language', input.language);
  }
  if (input.roles !== undefined) set('roles', json(cleanList(input.roles, (x) => ROLES.includes(x), `roles (${ROLES.join(', ')})`)));
  if (input.divisions !== undefined) set('divisions', json(cleanList(input.divisions, (x) => DIVISIONS.includes(x), `divisions (${DIVISIONS.join(', ')})`)));
  if (input.markets !== undefined) set('markets', json(cleanList(input.markets, (x) => MARKET_RE.test(x), 'markets (Ländercodes wie DE)')));
  if (input.release !== undefined) set('release', input.release === null ? null : String(input.release).trim().slice(0, 60) || null);
  if (input.navLabelId !== undefined) {
    if (input.navLabelId !== null && !(await ctx.db.get("SELECT 1 FROM metadata_labels WHERE id = ? AND project_id = ? AND label_group = 'navigation'", input.navLabelId, ctx.projectId))) throw badRequest('navLabelId ist kein Menüpunkt dieses Projekts.');
    set('nav_label_id', input.navLabelId);
  }
  if (input.outlineLabelId !== undefined) {
    if (input.outlineLabelId !== null && !(await ctx.db.get("SELECT 1 FROM metadata_labels WHERE id = ? AND project_id = ? AND label_group = 'outline'", input.outlineLabelId, ctx.projectId))) throw badRequest('outlineLabelId ist kein Punkt der Gesamtgliederung dieses Projekts.');
    set('outline_label_id', input.outlineLabelId);
  }
  const title = input.title === undefined ? undefined : input.title === null ? null : String(input.title).trim().slice(0, 300) || null;
  await ctx.db.tx(async () => {
    if (sets.length) await ctx.db.run(`UPDATE media_meta SET ${sets.join(', ')}, updated_by = ?, updated_at = ? WHERE project_id = ? AND base_sha = ?`, ...vals, user.id, now(), ctx.projectId, base.sha256);
    if (title !== undefined) await ctx.db.run('UPDATE media_assets SET title = ? WHERE project_id = ? AND sha256 = ?', title, ctx.projectId, base.sha256);
    await audit(ctx, user.id, 'image.meta_updated', 'media', base.sha256, { ...input });
  });
  return getItem(ctx, base.sha256);
}

/** Neue Fassung (F-21): ersetzt das Bild überall, frühere Fassungen bleiben über ?original=1 abrufbar */
export async function addImageVersion(ctx: Ctx, sha: string, data: Buffer, fileName: string | null, note: string | null, user: User) {
  const base = await baseOf(ctx, sha);
  await ensureNumbers(ctx, [base]);
  const m = await storeMedia(ctx, data, fileName);
  const existing = await ctx.db.get('SELECT base_sha FROM media_versions WHERE project_id = ? AND sha = ?', ctx.projectId, m.sha);
  if (m.sha === base.sha256 || existing) throw conflict('Diese Datei ist bereits eine Fassung dieses oder eines anderen Bildes.');
  if (await ctx.db.get('SELECT 1 FROM media_meta WHERE project_id = ? AND base_sha = ?', ctx.projectId, m.sha)) {
    // die Datei war schon als eigenes Bild im Archiv – nicht doppelt führen
    throw conflict(`Diese Datei ist bereits als eigenes Bild im Archiv. Laden Sie eine andere Fassung hoch.`);
  }
  await ctx.db.tx(async () => {
    const max = Number((await ctx.db.get<{ n: number }>('SELECT MAX(version_no) AS n FROM media_versions WHERE project_id = ? AND base_sha = ?', ctx.projectId, base.sha256))?.n ?? 0);
    if (!max) await ctx.db.run('INSERT INTO media_versions (project_id, sha, base_sha, version_no, note, created_by, created_at) VALUES (?, ?, ?, 1, NULL, ?, ?)', ctx.projectId, base.sha256, base.sha256, base.import_id ? 'import' : 'system', base.created_at);
    await ctx.db.run('INSERT INTO media_versions (project_id, sha, base_sha, version_no, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', ctx.projectId, m.sha, base.sha256, Math.max(max, 1) + 1, note?.trim().slice(0, 300) || null, user.id, now());
    await ctx.db.run('UPDATE media_meta SET placeholder = 0, updated_by = ?, updated_at = ? WHERE project_id = ? AND base_sha = ?', user.id, now(), ctx.projectId, base.sha256);
    await audit(ctx, user.id, 'image.version_added', 'media', base.sha256, { sha: m.sha, note });
  });
  return getItem(ctx, base.sha256);
}

const esc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!);

/** Platzhalterbild (F-21): reserviert die nächste Bildnummer, wird später durch eine echte Fassung ersetzt */
export async function createPlaceholder(ctx: Ctx, input: any, user: User) {
  const title = String(input.title ?? '').trim();
  if (title.length < 3 || title.length > 200) throw badRequest('title braucht 3 bis 200 Zeichen.');
  const no = Number((await ctx.db.get<{ n: number }>('SELECT MAX(image_no) AS n FROM media_meta WHERE project_id = ?', ctx.projectId))?.n ?? 0) + 1;
  const label = `${imageNumber(no)} · Platzhalter`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#eef2f7" stroke="#94a3b8" stroke-width="6" stroke-dasharray="24 16"/><text x="600" y="300" font-family="Arial, sans-serif" font-size="54" font-weight="bold" fill="#334155" text-anchor="middle">${esc(label)}</text><text x="600" y="380" font-family="Arial, sans-serif" font-size="34" fill="#475569" text-anchor="middle">${esc(title.slice(0, 70))}</text><text x="600" y="450" font-family="Arial, sans-serif" font-size="26" fill="#64748b" text-anchor="middle">Screenshot folgt</text></svg>`;
  const m = await storeMedia(ctx, Buffer.from(svg, 'utf8'), `platzhalter-${imageNumber(no)}.svg`);
  if (await ctx.db.get('SELECT 1 FROM media_meta WHERE project_id = ? AND base_sha = ?', ctx.projectId, m.sha)) throw conflict('Platzhalter existiert bereits.');
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO media_meta (project_id, base_sha, image_no, placeholder, updated_by, updated_at) VALUES (?, ?, ?, 1, ?, ?)', ctx.projectId, m.sha, no, user.id, now());
    await ctx.db.run('UPDATE media_assets SET title = ? WHERE project_id = ? AND sha256 = ?', title, ctx.projectId, m.sha);
    await audit(ctx, user.id, 'image.placeholder_created', 'media', m.sha, { imageNo: imageNumber(no), title });
  });
  const it = await updateImageMeta(ctx, m.sha, { roles: input.roles, divisions: input.divisions, navLabelId: input.navLabelId, release: input.release, language: input.language }, user);
  return { ...it, markdown: `![${title}](media:${m.sha})` };
}

/** Bildabdeckung je Kapitel (F-20): Bilder, Platzhalter und Schritte mit bzw. ohne Bild in der neuesten Version */
export async function imageCoverage(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT c.id AS chapter_id, c.title, c.position, v.id AS version_id, v.status, b.section_code, b.kind, b.text FROM chapters c
     JOIN generated_chapter_versions v ON v.chapter_id = c.id AND ${LATEST}
     LEFT JOIN content_blocks b ON b.chapter_version_id = v.id AND b.deleted_at IS NULL
     WHERE c.project_id = ? AND c.key <> '__none__' ORDER BY c.position, c.title`, ctx.projectId,
  );
  const placeholders = new Set((await ctx.db.all(
    `SELECT v.sha FROM media_meta m JOIN media_versions v ON v.project_id = m.project_id AND v.base_sha = m.base_sha WHERE m.project_id = ? AND m.placeholder = 1
     UNION SELECT base_sha AS sha FROM media_meta WHERE project_id = ? AND placeholder = 1`, ctx.projectId, ctx.projectId,
  )).map((r) => r.sha));
  const by = new Map<string, any>();
  for (const r of rows) {
    const c = by.get(r.chapter_id) ?? { chapterId: r.chapter_id, title: r.title, status: r.status, images: new Set<string>(), placeholders: new Set<string>(), steps: 0, stepsWithImage: 0, missingAlt: 0 };
    by.set(r.chapter_id, c);
    if (!r.text) continue;
    const refs = imageRefs(r.text).filter((x) => x.sha);
    for (const x of refs) {
      c.images.add(x.sha);
      if (placeholders.has(x.sha!)) c.placeholders.add(x.sha);
      if (!x.alt?.trim()) c.missingAlt++;
    }
    if (r.section_code === 'steps') {
      c.steps++;
      if (refs.length) c.stepsWithImage++;
    }
  }
  const items = [...by.values()].map((c) => ({
    chapterId: c.chapterId, title: c.title, status: c.status, images: c.images.size, placeholders: c.placeholders.size, missingAlt: c.missingAlt,
    stepBlocks: c.steps, stepBlocksWithImage: c.stepsWithImage,
    // Abdeckung = Schrittabsätze mit Bild; Kapitel ohne Schritte zählen über „hat mindestens ein Bild“
    coverage: c.steps ? Math.round((c.stepsWithImage / c.steps) * 100) : c.images.size ? 100 : 0,
  }));
  return { items, summary: { chapters: items.length, withoutImages: items.filter((i) => !i.images).length, withPlaceholders: items.filter((i) => i.placeholders).length } };
}

/**
 * F-25: Bilder aus einer Folie bekommen einen Gliederungs-Vorschlag aus dem Text ihrer Folie und – falls noch keine
 * Bildunterschrift gepflegt ist – den Folientitel als Bildunterschrift. Übernommen wird der Vorschlag nur von Hand.
 */
export async function suggestImageOutline(ctx: Ctx, images: { sha: string; slide: number; title: string; text: string }[], sourcePath: string) {
  const profiles = await outlineProfiles(ctx);
  for (const im of images) {
    const suggestions = profiles.length ? suggestOutline(profiles, { text: im.text, headings: [im.title], labelIds: [] }) : [];
    await ctx.db.run(
      `INSERT INTO media_context (project_id, sha, source_path, slide, slide_title, suggestions, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (project_id, sha) DO UPDATE SET source_path = excluded.source_path, slide = excluded.slide, slide_title = excluded.slide_title, suggestions = excluded.suggestions, updated_at = excluded.updated_at`,
      ctx.projectId, im.sha, sourcePath, im.slide, im.title.slice(0, 300), json(suggestions), now(),
    );
    await ctx.db.run("UPDATE media_assets SET title = ? WHERE project_id = ? AND sha256 = ? AND (title IS NULL OR title = '')", im.title.slice(0, 300), ctx.projectId, im.sha);
  }
}
