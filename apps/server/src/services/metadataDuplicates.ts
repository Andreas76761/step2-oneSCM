// Dubletten über alle Formate je Abschnitt (ADR-088, M4). Nach jedem Import werden nur die geänderten Dateien neu
// in Abschnitte zerlegt und gegen den Bestand verglichen: exakt (normalisierter Hash) und ähnlich (TF-IDF-Kosinus
// ≥ 0,85, M-07). Entscheidungen (führende Fassung, kein Duplikat) hängen am Inhalt und überleben erneutes Einlesen.
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { NO_CHAPTER_TITLE } from '../domain/markdown.js';
import { NEAR_THRESHOLD, normalizeSection, SECTION_MIN_CHARS, wordDiff } from '../domain/sectionDupes.js';
import { clusterPairs, sha256, TfidfEngine } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';
import { CHUNK_FROM, formatOf } from './metadata.js';

const pathOf = (r: Row) => [r.chapter_title, r.subchapter_title, ...parseJson<string[]>(r.heading_path, [])].filter((x) => x && x !== NO_CHAPTER_TITLE) as string[];

/** Abschnitte einer Datei aus ihren aktuellen Chunks (Reihenfolge der Datei) */
async function buildSections(ctx: Ctx, documentId: string) {
  const rows = await ctx.db.all(
    `SELECT s.id, s.text, s.heading_path, s.locator, s.position, r.id AS revision_id, r.source_format, d.path, c.title AS chapter_title, sc.title AS subchapter_title
     ${CHUNK_FROM} WHERE d.project_id = ? AND d.id = ? AND r.is_current = 1 AND d.removed_at IS NULL ORDER BY s.position, s.id`,
    ctx.projectId, documentId,
  );
  const out: { revisionId: string; title: string; headingPath: string[]; locator: unknown; format: string; chunkIds: string[]; texts: string[] }[] = [];
  let key = '\u0000';
  for (const r of rows) {
    const p = pathOf(r);
    const k = p.join('\u0000');
    if (k !== key || !out.length) {
      out.push({ revisionId: r.revision_id, title: p[p.length - 1] ?? '(ohne Überschrift)', headingPath: p, locator: parseJson(r.locator, null), format: formatOf(r.source_format, r.path), chunkIds: [], texts: [] });
      key = k;
    }
    out[out.length - 1].chunkIds.push(r.id);
    out[out.length - 1].texts.push(r.text);
  }
  return out.map((s) => ({ ...s, text: normalizeSection(s.texts) })).filter((s) => s.text.length >= SECTION_MIN_CHARS);
}

/**
 * Abschnitte der geänderten Dateien neu bilden und ihre Paare neu berechnen; Paare zwischen unveränderten Dateien
 * bleiben stehen. Ohne Angabe (oder beim ersten Aufruf) wird der ganze Bestand berechnet.
 */
export async function refreshDuplicates(ctx: Ctx, documentIds?: string[]) {
  const all = !documentIds;
  const docs = all
    ? (await ctx.db.all('SELECT id FROM source_documents WHERE project_id = ?', ctx.projectId)).map((r) => r.id as string)
    : [...new Set(documentIds)];
  if (!docs.length) return { sections: 0, pairs: 0 };
  const changed = new Set<string>();
  await ctx.db.tx(async () => {
    if (all) {
      await ctx.db.run('DELETE FROM metadata_duplicates WHERE project_id = ?', ctx.projectId);
      await ctx.db.run('DELETE FROM metadata_sections WHERE project_id = ?', ctx.projectId);
    }
    for (const d of docs) {
      if (!all) {
        await ctx.db.run(
          'DELETE FROM metadata_duplicates WHERE project_id = ? AND (a_section_id IN (SELECT id FROM metadata_sections WHERE document_id = ?) OR b_section_id IN (SELECT id FROM metadata_sections WHERE document_id = ?))',
          ctx.projectId, d, d,
        );
        await ctx.db.run('DELETE FROM metadata_sections WHERE project_id = ? AND document_id = ?', ctx.projectId, d);
      }
      for (const [i, s] of (await buildSections(ctx, d)).entries()) {
        const id = newId('sec');
        changed.add(id);
        await ctx.db.run(
          'INSERT INTO metadata_sections (id, project_id, document_id, revision_id, position, title, heading_path, locator, format, chunk_ids, text, norm_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          id, ctx.projectId, d, s.revisionId, i, s.title.slice(0, 500), json(s.headingPath), s.locator ? json(s.locator) : null, s.format, json(s.chunkIds), s.text, sha256(s.text), now(),
        );
      }
    }
  });
  if (!changed.size) return { sections: 0, pairs: 0 };
  // Vergleich über den ganzen Bestand, gespeichert werden nur Paare mit mindestens einem geänderten Abschnitt
  const sections = await ctx.db.all('SELECT id, document_id, format, text, norm_hash FROM metadata_sections WHERE project_id = ?', ctx.projectId);
  const byId = new Map(sections.map((s) => [s.id as string, s]));
  const pairs = new Map<string, { a: string; b: string; score: number; kind: 'exact' | 'near'; shared: string[] }>();
  const add = (x: string, y: string, score: number, kind: 'exact' | 'near', shared: string[]) => {
    if (!changed.has(x) && !changed.has(y)) return;
    const [a, b] = x < y ? [x, y] : [y, x];
    const k = `${a}|${b}`;
    if (!pairs.has(k) || kind === 'exact') pairs.set(k, { a, b, score, kind, shared });
  };
  const byHash = new Map<string, string[]>();
  for (const s of sections) byHash.set(s.norm_hash, [...(byHash.get(s.norm_hash) ?? []), s.id]);
  for (const ids of byHash.values()) for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) add(ids[i], ids[j], 1, 'exact', []);
  for (const p of new TfidfEngine().pairs(sections.map((s) => ({ id: s.id, text: s.text })), NEAR_THRESHOLD)) {
    if (byId.get(p.a)!.norm_hash !== byId.get(p.b)!.norm_hash) add(p.a, p.b, p.score, 'near', p.sharedTerms);
  }
  await ctx.db.tx(async () => {
    for (const p of pairs.values()) {
      await ctx.db.run(
        'INSERT INTO metadata_duplicates (id, project_id, a_section_id, b_section_id, score, kind, cross_format, shared, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (project_id, a_section_id, b_section_id) DO NOTHING',
        newId('dup'), ctx.projectId, p.a, p.b, p.score, p.kind, byId.get(p.a)!.format !== byId.get(p.b)!.format ? 1 : 0, json(p.shared), now(),
      );
    }
  });
  return { sections: changed.size, pairs: pairs.size };
}

/** Beim ersten Aufruf eines Projekts (Bestand von vor Etappe 36) einmal alles berechnen */
async function ensureBuilt(ctx: Ctx) {
  const has = await ctx.db.get('SELECT 1 FROM metadata_sections WHERE project_id = ? LIMIT 1', ctx.projectId);
  if (!has && (await ctx.db.get('SELECT 1 FROM source_documents WHERE project_id = ? AND removed_at IS NULL LIMIT 1', ctx.projectId))) await refreshDuplicates(ctx);
}

const sectionDto = (s: Row, prefix: string) => ({
  sectionId: s[`${prefix}id`], documentId: s[`${prefix}document_id`], path: s[`${prefix}path`], format: s[`${prefix}format`], title: s[`${prefix}title`],
  headingPath: parseJson<string[]>(s[`${prefix}heading_path`], []), locator: parseJson(s[`${prefix}locator`], null),
  chunkIds: parseJson<string[]>(s[`${prefix}chunk_ids`], []), chars: String(s[`${prefix}text`]).length, hash: s[`${prefix}norm_hash`],
});

const PAIR_SQL = `SELECT p.*, ${['id', 'document_id', 'format', 'title', 'heading_path', 'locator', 'chunk_ids', 'text', 'norm_hash'].flatMap((c) => [`a.${c} AS a_${c}`, `b.${c} AS b_${c}`]).join(', ')},
  da.path AS a_path, db.path AS b_path
  FROM metadata_duplicates p
  JOIN metadata_sections a ON a.id = p.a_section_id JOIN metadata_sections b ON b.id = p.b_section_id
  JOIN source_documents da ON da.id = a.document_id JOIN source_documents db ON db.id = b.document_id
  WHERE p.project_id = ?`;

/**
 * Schlüssel einer Seite für die Entscheidung: der Inhalt (normalisierter Hash); bei exakt gleichen Abschnitten
 * zusätzlich die Datei – sonst wären beide Seiten nicht zu unterscheiden. Beides bleibt bei erneutem Einlesen gleich.
 */
const sideKeys = (r: Row) => (r.a_norm_hash === r.b_norm_hash ? [`${r.a_norm_hash}@${r.a_path}`, `${r.b_norm_hash}@${r.b_path}`] : [r.a_norm_hash as string, r.b_norm_hash as string]);
const pairKey = (r: Row) => [...sideKeys(r)].sort().join('|');

async function decisions(ctx: Ctx) {
  return new Map((await ctx.db.all('SELECT * FROM metadata_duplicate_decisions WHERE project_id = ?', ctx.projectId)).map((d) => [`${d.hash_a}|${d.hash_b}`, d]));
}

function pairDto(r: Row, dec: Map<string, Row>) {
  const a = sectionDto(r, 'a_');
  const b = sectionDto(r, 'b_');
  const [ka, kb] = sideKeys(r);
  const x = dec.get(pairKey(r));
  const leading = x?.decision === 'leading' ? (x.leading_hash === ka ? 'a' : x.leading_hash === kb ? 'b' : null) : null;
  return {
    id: r.id, score: Number(r.score), kind: r.kind, crossFormat: !!Number(r.cross_format), shared: parseJson<string[]>(r.shared, []), a, b,
    decision: x ? { decision: x.decision, leading, note: x.note ?? null, decidedBy: x.decided_by, decidedAt: x.decided_at } : null,
  };
}

export async function listDuplicates(ctx: Ctx, opts: { crossFormat?: boolean; status?: string; minScore?: number; q?: string; limit?: number; offset?: number } = {}) {
  await ensureBuilt(ctx);
  const status = opts.status ?? 'open';
  if (!['open', 'decided', 'all'].includes(status)) throw badRequest('status muss open, decided oder all sein.');
  const dec = await decisions(ctx);
  const rows = (await ctx.db.all(`${PAIR_SQL} ORDER BY p.cross_format DESC, p.score DESC, p.id`, ctx.projectId)).map((r) => pairDto(r, dec));
  const q = opts.q?.trim().toLowerCase();
  const filtered = rows.filter((p) => (!opts.crossFormat || p.crossFormat) && p.score >= (opts.minScore ?? 0)
    && (status === 'all' || (status === 'open' ? !p.decision : !!p.decision))
    && (!q || `${p.a.path} ${p.a.title} ${p.b.path} ${p.b.title}`.toLowerCase().includes(q)));
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 25), 1), 100);
  const offset = Math.max(Math.trunc(opts.offset ?? 0), 0);
  const open = rows.filter((p) => !p.decision);
  return {
    total: filtered.length, limit, offset, items: filtered.slice(offset, offset + limit),
    summary: {
      sections: Number((await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM metadata_sections WHERE project_id = ?', ctx.projectId))?.n ?? 0),
      pairs: rows.length, exact: rows.filter((p) => p.kind === 'exact').length, near: rows.filter((p) => p.kind === 'near').length,
      crossFormat: rows.filter((p) => p.crossFormat).length, open: open.length, decided: rows.length - open.length,
      groups: clusterPairs([...new Set(open.flatMap((p) => [p.a.sectionId, p.b.sectionId]))], open.map((p) => ({ a: p.a.sectionId, b: p.b.sectionId, score: p.score, sharedTerms: [] }))).length,
    },
  };
}

/** Gruppen offener Dubletten: Abschnitte, die über Paare zusammenhängen (z. B. dieselbe Folie in PPTX, PDF und Word) */
export async function duplicateGroups(ctx: Ctx, opts: { crossFormat?: boolean } = {}) {
  await ensureBuilt(ctx);
  const dec = await decisions(ctx);
  const open = (await ctx.db.all(`${PAIR_SQL} ORDER BY p.score DESC`, ctx.projectId)).map((r) => pairDto(r, dec)).filter((p) => !p.decision && (!opts.crossFormat || p.crossFormat));
  const sections = new Map<string, ReturnType<typeof sectionDto>>();
  for (const p of open) (sections.set(p.a.sectionId, p.a), sections.set(p.b.sectionId, p.b));
  return clusterPairs([...sections.keys()], open.map((p) => ({ a: p.a.sectionId, b: p.b.sectionId, score: p.score, sharedTerms: [] })))
    .map((ids) => {
      const inGroup = open.filter((p) => ids.includes(p.a.sectionId));
      return { sections: ids.map((id) => sections.get(id)!), formats: [...new Set(ids.map((id) => sections.get(id)!.format))], pairs: inGroup.map((p) => p.id), maxScore: Math.max(...inGroup.map((p) => p.score)) };
    })
    .sort((x, y) => y.sections.length - x.sections.length || y.maxScore - x.maxScore);
}

async function pairRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get(`${PAIR_SQL} AND p.id = ?`, ctx.projectId, id);
  if (!r) throw notFound(`Dublette ${id}`);
  return r;
}

/** Paar nebeneinander mit wortweise markierten Unterschieden und den Chunks beider Seiten */
export async function getDuplicate(ctx: Ctx, id: string) {
  const r = await pairRow(ctx, id);
  const p = pairDto(r, await decisions(ctx));
  const chunks = async (ids: string[]) => ids.length ? ctx.db.all(`SELECT id, seq, text, locator FROM text_snippets WHERE id IN (${ids.map(() => '?').join(',')}) ORDER BY position`, ...ids) : [];
  return {
    ...p, textA: r.a_text, textB: r.b_text, diff: wordDiff(r.a_text, r.b_text),
    chunksA: (await chunks(p.a.chunkIds)).map((c) => ({ id: c.id, seq: Number(c.seq), text: c.text, locator: parseJson(c.locator, null) })),
    chunksB: (await chunks(p.b.chunkIds)).map((c) => ({ id: c.id, seq: Number(c.seq), text: c.text, locator: parseJson(c.locator, null) })),
  };
}

/** Entscheidung: führende Fassung (a | b), kein Duplikat oder zurücksetzen (open) */
export async function decideDuplicate(ctx: Ctx, id: string, input: any, user: User) {
  const r = await pairRow(ctx, id);
  const decision = String(input.decision ?? '');
  if (!['leading', 'not_duplicate', 'open'].includes(decision)) throw badRequest('decision muss leading, not_duplicate oder open sein.');
  if (decision === 'leading' && !['a', 'b'].includes(input.leading)) throw badRequest('leading muss a oder b sein.');
  const [ka, kb] = sideKeys(r);
  const [ha, hb] = [ka, kb].sort();
  const note = input.note == null ? null : String(input.note).trim().slice(0, 500) || null;
  await ctx.db.tx(async () => {
    if (decision === 'open') await ctx.db.run('DELETE FROM metadata_duplicate_decisions WHERE project_id = ? AND hash_a = ? AND hash_b = ?', ctx.projectId, ha, hb);
    else {
      await ctx.db.run(
        `INSERT INTO metadata_duplicate_decisions (project_id, hash_a, hash_b, decision, leading_hash, note, decided_by, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (project_id, hash_a, hash_b) DO UPDATE SET decision = excluded.decision, leading_hash = excluded.leading_hash, note = excluded.note, decided_by = excluded.decided_by, decided_at = excluded.decided_at`,
        ctx.projectId, ha, hb, decision, decision === 'leading' ? (input.leading === 'a' ? ka : kb) : null, note, user.id, now(),
      );
    }
    await audit(ctx, user.id, 'metadata.duplicate_decided', 'metadata_duplicate', id, { decision, leading: input.leading ?? null, note });
  });
  return getDuplicate(ctx, id);
}
