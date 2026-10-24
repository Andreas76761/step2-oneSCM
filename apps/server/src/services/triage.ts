// Agent TRIAGE (ADR-100): nach dem Einlesen und Zerlegen in Chunks ordnet TRIAGE jedem Chunk die Pflichtlabels zu
// (Version, Status, Domäne, Rolle, Sprache, Sparte, Markt, Detaillevel, zu prüfen) und schlägt Kapitel und Unterkapitel
// der aktuellen Gliederung vor – auch neue Unterkapitel mit der Kennung „neu“. Labels werden direkt gesetzt (Herkunft
// triage, menschliche Zuordnungen bleiben), Verschiebungen und neue Unterkapitel sind Vorschläge zum Übernehmen.
import { audit, getSettings, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { headingKey } from '../domain/markdown.js';
import { DEFAULT_DETAIL_LEVELS, DETAIL_LEVELS, REQUIRED_GROUPS, type RequiredGroup } from '../domain/metadataLabels.js';
import { stripNumber } from '../domain/outline.js';
import { analyzeQuery, buildIndex, coverage, type Lexicon } from '../domain/retrieval.js';
import {
  detectDetail, detectDivision, detectDomain, detectLanguage, detectMarkets, detectRoles, detectStatus, detectVersion, LANGUAGE_NAMES, REVIEW_BELOW,
  type DomainRef, type Pick, type TriageInput,
} from '../domain/triage.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { CHUNK_FROM } from './metadata.js';

const MAX_CHUNKS = 20000;
/** Mindestwert für einen Kapitel- bzw. Unterkapitelvorschlag (gewichtete Abdeckung des Titels im Chunk) */
export const PLACE_MIN = 0.6;
// Sammelkapitel ohne eigene Stelle in der Gliederung
const COLLECTOR_KEYS = new Set(['__none__', 'jira-tickets', 'wissensnotizen']);
export const GROUP_LABEL: Record<RequiredGroup, string> = {
  version: 'Version', status: 'Status', domain: 'Domäne', role: 'Rolle', language: 'Sprache', division: 'Sparte', market: 'Markt', detail: 'Detaillevel', review: 'zu prüfen',
};

interface ChunkRow {
  id: string; text: string; kind: string; headingPath: string[]; chapterId: string; chapterTitle: string; chapterKey: string; subchapterId: string | null; subchapterTitle: string | null;
  evidence: string; market: string | null; release: string | null; path: string; format: string | null; originalKey: string | null; normHash: string;
}

async function loadChunks(ctx: Ctx, scope: { importId?: string; snippetIds?: string[] }) {
  const where = ['d.project_id = ?', 'r.is_current = 1', 'd.removed_at IS NULL', 's.excluded_reason IS NULL'];
  const params: unknown[] = [ctx.projectId];
  if (scope.importId) (where.push('r.import_id = ?'), params.push(scope.importId));
  if (scope.snippetIds?.length) (where.push(`s.id IN (${scope.snippetIds.map(() => '?').join(',')})`), params.push(...scope.snippetIds));
  const rows = await ctx.db.all(
    `SELECT s.id, s.text, s.kind, s.heading_path, s.chapter_id, s.subchapter_id, s.evidence_status, s.market_code, s.release_code, s.norm_hash, d.path, r.source_format, r.original_key,
       c.title AS chapter_title, c.key AS chapter_key, sc.title AS subchapter_title
     ${CHUNK_FROM} WHERE ${where.join(' AND ')} ORDER BY d.path, s.position LIMIT ${MAX_CHUNKS}`, ...params,
  );
  // Überschriftenpfad mit dem Unterkapitel (H2), denn heading_path enthält nur H3–H6
  return rows.map((r): ChunkRow => ({
    id: r.id, text: r.text, kind: r.kind, headingPath: [...(r.subchapter_title ? [String(r.subchapter_title)] : []), ...parseJson<string[]>(r.heading_path, [])], chapterId: r.chapter_id, chapterTitle: r.chapter_title, chapterKey: r.chapter_key,
    subchapterId: r.subchapter_id ?? null, subchapterTitle: r.subchapter_title ?? null, evidence: r.evidence_status, market: r.market_code ?? null, release: r.release_code ?? null,
    path: r.path, format: r.source_format ?? null, originalKey: r.original_key ?? null, normHash: r.norm_hash,
  }));
}

/** Kennungen der Rollen und Sparten aus den Quellangaben (Front-Matter) */
async function scopeCodes(ctx: Ctx, ids: string[]) {
  const roles = new Map<string, string[]>();
  const divisions = new Map<string, string[]>();
  for (let i = 0; i < ids.length; i += 500) {
    const part = ids.slice(i, i + 500);
    const q = part.map(() => '?').join(',');
    for (const r of await ctx.db.all(`SELECT snippet_id, role_code FROM snippet_roles WHERE snippet_id IN (${q})`, ...part)) roles.set(r.snippet_id, [...(roles.get(r.snippet_id) ?? []), r.role_code]);
    for (const r of await ctx.db.all(`SELECT snippet_id, division_code FROM snippet_divisions WHERE snippet_id IN (${q})`, ...part)) divisions.set(r.snippet_id, [...(divisions.get(r.snippet_id) ?? []), r.division_code]);
  }
  return { roles, divisions };
}

/** Labels des Projekts nach Code; fehlende Versionen, Märkte und Sprachen legt TRIAGE an (Herkunft triage) */
async function labelIndex(ctx: Ctx) {
  const rows = await ctx.db.all("SELECT id, code, label_group, name_de, name_en, archived_at FROM metadata_labels WHERE project_id = ? AND origin <> 'deleted'", ctx.projectId);
  const byCode = new Map(rows.map((r) => [r.code as string, r]));
  const ensure = async (group: string, code: string, nameDe: string, nameEn: string): Promise<Row | null> => {
    const full = `${group}.${code}`;
    const have = byCode.get(full);
    if (have) return have.archived_at ? null : have;
    if (await ctx.db.get("SELECT 1 FROM metadata_labels WHERE project_id = ? AND code = ? AND origin = 'deleted'", ctx.projectId, full)) return null;
    const pos = Number((await ctx.db.get('SELECT MAX(position) AS n FROM metadata_labels WHERE project_id = ? AND label_group = ?', ctx.projectId, group))?.n ?? 0) + 1;
    const id = newId('lbl');
    await ctx.db.run(
      `INSERT INTO metadata_labels (id, project_id, code, label_group, name_de, name_en, description, position, origin, archived_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'von TRIAGE angelegt', ?, 'triage', NULL, 'triage', ?) ON CONFLICT (project_id, code) DO NOTHING`, id, ctx.projectId, full, group, nameDe, nameEn, pos, now(),
    );
    const r = await ctx.db.get('SELECT id, code, label_group, name_de, name_en, archived_at FROM metadata_labels WHERE project_id = ? AND code = ?', ctx.projectId, full);
    if (r) byCode.set(full, r);
    return r ?? null;
  };
  return { byCode, ensure };
}

/** Domänen mit Namen (Label und verbundene Menüpunkte) und Kapitel → Domäne über die Zuordnung (ADR-082) */
async function domainRefs(ctx: Ctx) {
  const labels = await ctx.db.all("SELECT id, code, label_group, name_de, name_en FROM metadata_labels WHERE project_id = ? AND archived_at IS NULL AND origin <> 'deleted' AND label_group IN ('domain', 'outline', 'navigation')", ctx.projectId);
  const byId = new Map(labels.map((l) => [l.id as string, l]));
  const links = await ctx.db.all('SELECT domain_label_id, target_label_id FROM metadata_label_links WHERE project_id = ? AND active = 1', ctx.projectId);
  const domains: DomainRef[] = labels.filter((l) => l.label_group === 'domain' && l.code !== 'domain.general').map((l) => ({
    code: String(l.code).replace(/^domain\./, ''),
    names: [l.name_de, l.name_en, ...links.filter((k) => k.domain_label_id === l.id).map((k) => byId.get(k.target_label_id)).filter((t) => t?.label_group === 'navigation').map((t) => String(t!.name_de).split('›').pop()!.trim())]
      .filter((n, i, a) => n && a.indexOf(n) === i),
  }));
  const norm = (t: string) => (stripNumber(t) || t).toLowerCase().replace(/[^a-z0-9äöüß]+/g, ' ').trim();
  const outlineDomain = new Map<string, string>();
  for (const k of links) {
    const target = byId.get(k.target_label_id);
    const dom = byId.get(k.domain_label_id);
    if (target?.label_group === 'outline' && dom && !outlineDomain.has(norm(target.name_de))) outlineDomain.set(norm(target.name_de), String(dom.code).replace(/^domain\./, ''));
  }
  return { domains, chapterDomain: (title: string | null) => (title ? outlineDomain.get(norm(title)) ?? null : null) };
}

async function lexiconOf(ctx: Ctx): Promise<Lexicon> {
  const groups: string[][] = [];
  for (const r of await ctx.db.all("SELECT preferred, avoid FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId)) groups.push([String(r.preferred), ...parseJson<string[]>(r.avoid, [])]);
  for (const r of await ctx.db.all('SELECT abbreviation, expansion FROM abbreviations WHERE project_id = ?', ctx.projectId)) groups.push([String(r.abbreviation), String(r.expansion)]);
  return { groups: groups.filter((g) => g.length > 1) };
}

/** Gliederung für die Zuordnung: nummerierte bzw. in der Kapitelsteuerung angelegte Kapitel (sonst alle außer Sammelkapiteln) */
async function placementOutline(ctx: Ctx) {
  const chapters = await ctx.db.all(
    'SELECT id, key, title, meta_updated_by FROM chapters WHERE project_id = ? AND outline_family_id IS NULL AND history_at IS NULL ORDER BY position, title', ctx.projectId,
  );
  const candidates = chapters.filter((c) => !COLLECTOR_KEYS.has(c.key));
  const numbered = candidates.filter((c) => /^\s*(?:kapitel\s+)?(?:\d+|[A-Z])[.\s]/i.test(c.title) || c.meta_updated_by);
  const outline = numbered.length ? numbered : candidates;
  const out: { id: string; title: string; subs: { id: string; title: string; isNew: boolean }[] }[] = [];
  for (const c of outline) {
    const subs = await ctx.db.all('SELECT id, title, triage_new FROM subchapters WHERE chapter_id = ? AND history_at IS NULL ORDER BY position, title', c.id);
    out.push({ id: c.id, title: c.title, subs: subs.map((s) => ({ id: s.id, title: s.title, isNew: !!Number(s.triage_new) })) });
  }
  return out;
}

const firstPick = (p: Pick) => p.codes[0];

/**
 * Lauf über alle Chunks („all“), nur Chunks ohne vollständige Pflichtlabels („missing“) oder die Chunks eines Imports.
 * Ergebnis je Chunk in triage_results; Labels gesetzt, Verschiebungen und neue Unterkapitel als Vorschlag.
 */
export async function runTriage(ctx: Ctx, input: { scope?: unknown; importId?: string }, actor: string) {
  const scope = input.importId ? `import:${input.importId}` : String(input.scope ?? 'missing');
  if (!input.importId && !['all', 'missing'].includes(scope)) throw badRequest('scope muss all oder missing sein.');
  const runId = newId('trg');
  await ctx.db.run("INSERT INTO triage_runs (id, project_id, scope, status, stats, started_by, started_at) VALUES (?, ?, ?, 'running', '{}', ?, ?)", runId, ctx.projectId, scope, actor, now());
  let chunks = await loadChunks(ctx, { importId: input.importId });
  const labels = await labelIndex(ctx);
  // vorhandene Zuordnungen je Chunk und Gruppe
  const assigned = new Map<string, { labelId: string; group: string; origin: string }[]>();
  for (let i = 0; i < chunks.length; i += 500) {
    const part = chunks.slice(i, i + 500).map((c) => c.id);
    for (const r of await ctx.db.all(
      `SELECT x.snippet_id, x.label_id, x.origin, l.label_group FROM metadata_chunk_labels x JOIN metadata_labels l ON l.id = x.label_id WHERE x.snippet_id IN (${part.map(() => '?').join(',')})`, ...part,
    )) assigned.set(r.snippet_id, [...(assigned.get(r.snippet_id) ?? []), { labelId: r.label_id, group: r.label_group, origin: r.origin }]);
  }
  if (scope === 'missing') chunks = chunks.filter((c) => REQUIRED_GROUPS.some((g) => !(assigned.get(c.id) ?? []).some((a) => a.group === g)));
  const { roles, divisions } = await scopeCodes(ctx, chunks.map((c) => c.id));
  const { domains, chapterDomain } = await domainRefs(ctx);
  const outline = await placementOutline(ctx);
  const outlineIds = new Set(outline.map((c) => c.id));
  // Zuordnung über die Suchmorphologie (ADR-099): Abdeckung des Kapitel- bzw. Unterkapiteltitels im Chunk
  const index = buildIndex(chunks.map((c) => ({ text: c.text, header: c.headingPath.slice(-2).join(' ') })));
  const lexicon = await lexiconOf(ctx);
  const qOf = (t: string) => analyzeQuery(stripNumber(t) || t, index, lexicon);
  const outlineQ = outline.map((c) => ({ ...c, q: qOf(c.title), subs: c.subs.map((s) => ({ ...s, q: qOf(s.title) })) }));
  // früher übernommene Zuordnung für gleichen Text (z. B. nach einem erneuten Import) wiederverwenden
  const remembered = new Map<string, { chapterId: string; subchapterId: string | null }>();
  for (const r of await ctx.db.all(
    `SELECT s.norm_hash, t.chapter_id, t.subchapter_id FROM triage_results t JOIN text_snippets s ON s.id = t.snippet_id
     WHERE t.project_id = ? AND t.status = 'accepted' AND t.chapter_id IS NOT NULL ORDER BY t.decided_at`, ctx.projectId,
  )) remembered.set(r.norm_hash, { chapterId: r.chapter_id, subchapterId: r.subchapter_id ?? null });
  const jiraStatus = new Map<string, string | null>();
  const stats = { chunks: chunks.length, labels: 0, keptManual: 0, kept: 0, move: 0, newSubchapter: 0, unassigned: 0, remembered: 0, review: 0, createdLabels: 0 };
  const at = now();
  const before = labels.byCode.size;

  await ctx.db.tx(async () => {
    // ältere offene Vorschläge derselben Chunks gelten nicht mehr
    for (let i = 0; i < chunks.length; i += 500) {
      const part = chunks.slice(i, i + 500).map((c) => c.id);
      await ctx.db.run(`UPDATE triage_results SET status = 'superseded' WHERE project_id = ? AND status = 'proposed' AND snippet_id IN (${part.map(() => '?').join(',')})`, ctx.projectId, ...part);
    }
    for (const [i, c] of chunks.entries()) {
      if (c.format === 'jira' && c.originalKey && !jiraStatus.has(c.originalKey)) {
        try {
          jiraStatus.set(c.originalKey, String(JSON.parse((await ctx.store.get(c.originalKey)).toString('utf8'))?.status ?? '') || null);
        } catch {
          jiraStatus.set(c.originalKey, null);
        }
      }
      const t: TriageInput = {
        text: c.text, kind: c.kind, headingPath: c.headingPath, path: c.path, sourceFormat: c.format, evidenceStatus: c.evidence, marketCode: c.market, releaseCode: c.release,
        roles: roles.get(c.id) ?? [], divisions: divisions.get(c.id) ?? [], jiraStatus: c.originalKey ? jiraStatus.get(c.originalKey) ?? null : null,
      };
      // Zuordnung
      let placement: 'kept' | 'move' | 'new_subchapter' | 'unassigned' = 'kept';
      let target: { chapterId: string | null; subchapterId: string | null; newTitle: string | null; confidence: number; reason: string } = {
        chapterId: c.chapterId, subchapterId: c.subchapterId, newTitle: null, confidence: 1, reason: 'Quelle gehört schon zu einem Kapitel der Gliederung',
      };
      const tokens = new Set([...index.docs[i].body, ...index.docs[i].head]);
      const headTokens = new Set(index.docs[i].head);
      const memo = remembered.get(c.normHash);
      if (memo && (memo.chapterId !== c.chapterId || memo.subchapterId !== c.subchapterId)) {
        placement = 'move';
        target = { ...memo, newTitle: null, confidence: 0.95, reason: 'wie bei gleichem Text zuvor übernommen' };
        stats.remembered++;
      } else if (!outlineIds.has(c.chapterId) && c.format !== 'jira') {
        let best: { chapterId: string; subchapterId: string | null; score: number; title: string; head: number } | null = null;
        let bestChapter: { chapterId: string; score: number; title: string } | null = null;
        for (const ch of outlineQ) {
          const cs = coverage(ch.q, tokens);
          if (!bestChapter || cs > bestChapter.score) bestChapter = { chapterId: ch.id, score: cs, title: ch.title };
          for (const s of ch.subs) {
            const score = 0.7 * coverage(s.q, tokens) + 0.3 * cs;
            if (!best || score > best.score) best = { chapterId: ch.id, subchapterId: s.id, score, title: `${ch.title} › ${s.title}`, head: coverage(s.q, headTokens) };
          }
        }
        const heading = c.headingPath[c.headingPath.length - 1];
        // eigenes Thema: die Überschrift des Chunks nennt das Unterkapitel nicht, das Kapitel passt → neues Unterkapitel
        const ownTopic = !!heading && (best?.head ?? 0) < 0.5 && (bestChapter?.score ?? 0) >= PLACE_MIN && headingKey(heading) !== headingKey(c.chapterTitle);
        if (best && best.score >= PLACE_MIN && !ownTopic) {
          placement = 'move';
          target = { chapterId: best.chapterId, subchapterId: best.subchapterId, newTitle: null, confidence: Math.min(1, best.score), reason: `passt zu „${best.title}“` };
        } else if (bestChapter && bestChapter.score >= PLACE_MIN && heading && headingKey(heading) !== headingKey(c.chapterTitle)) {
          placement = 'new_subchapter';
          target = { chapterId: bestChapter.chapterId, subchapterId: null, newTitle: stripNumber(heading) || heading, confidence: Math.min(1, bestChapter.score) * 0.9, reason: `Kapitel „${bestChapter.title}“ passt, kein Unterkapitel – neues Unterkapitel „${stripNumber(heading) || heading}“` };
        } else if (bestChapter && bestChapter.score >= PLACE_MIN) {
          placement = 'move';
          target = { chapterId: bestChapter.chapterId, subchapterId: null, newTitle: null, confidence: Math.min(1, bestChapter.score) * 0.9, reason: `passt zu Kapitel „${bestChapter.title}“` };
        } else {
          placement = 'unassigned';
          target = { chapterId: null, subchapterId: null, newTitle: null, confidence: Math.max(best?.score ?? 0, bestChapter?.score ?? 0), reason: 'kein Kapitel der Gliederung passt sicher' };
        }
      }
      // Labels je Pflichtgruppe
      const targetChapterTitle = target.chapterId ? (outline.find((o) => o.id === target.chapterId)?.title ?? c.chapterTitle) : c.chapterTitle;
      const picks: Partial<Record<RequiredGroup, Pick>> = {
        version: detectVersion(t), status: detectStatus(t), domain: detectDomain(t, domains, chapterDomain(targetChapterTitle)), role: detectRoles(t),
        language: detectLanguage(t.text), division: detectDivision(t), market: detectMarkets(t), detail: detectDetail(t),
      };
      const uncertain = Object.entries(picks).filter(([, p]) => p!.confidence < REVIEW_BELOW).map(([g]) => g as RequiredGroup);
      const review = uncertain.length > 0 || placement === 'unassigned' || placement === 'new_subchapter';
      picks.review = { codes: [review ? 'yes' : 'no'], confidence: 1, reason: review ? `unsicher: ${[...uncertain.map((g) => GROUP_LABEL[g]), ...(placement === 'unassigned' ? ['Kapitel'] : placement === 'new_subchapter' ? ['neues Unterkapitel'] : [])].join(', ')}` : 'alle Gruppen sicher' };
      const have = assigned.get(c.id) ?? [];
      const applied: { group: string; code: string; confidence: number; reason: string; kept?: boolean }[] = [];
      for (const g of REQUIRED_GROUPS) {
        const p = picks[g]!;
        if (have.some((a) => a.group === g && a.origin !== 'triage')) {
          applied.push({ group: g, code: '(manuell)', confidence: 1, reason: 'manuell gesetzt – bleibt', kept: true });
          stats.keptManual++;
          continue;
        }
        const ids: string[] = [];
        for (const code of p.codes) {
          const names = g === 'language' ? LANGUAGE_NAMES[code] ?? [code.toUpperCase(), code.toUpperCase()]
            : g === 'market' ? [code === 'all' ? 'alle Märkte' : code.toUpperCase(), code === 'all' ? 'All markets' : code.toUpperCase()]
              : g === 'version' ? [p.names?.[code] ?? code, p.names?.[code] ?? code] : [code, code];
          const l = await labels.ensure(g, code, names[0], names[1]);
          if (l) ids.push(l.id);
        }
        const old = have.filter((a) => a.group === g && a.origin === 'triage').map((a) => a.labelId);
        if (old.length) await ctx.db.run(`DELETE FROM metadata_chunk_labels WHERE snippet_id = ? AND label_id IN (${old.map(() => '?').join(',')})`, c.id, ...old);
        for (const id of ids) {
          await ctx.db.run(
            "INSERT INTO metadata_chunk_labels (snippet_id, label_id, project_id, assigned_by, assigned_at, origin, confidence) VALUES (?, ?, ?, 'triage', ?, 'triage', ?) ON CONFLICT (snippet_id, label_id) DO NOTHING",
            c.id, id, ctx.projectId, at, Math.round(p.confidence * 100) / 100,
          );
          stats.labels++;
        }
        applied.push({ group: g, code: p.codes.join(', '), confidence: Math.round(p.confidence * 100) / 100, reason: p.reason });
      }
      if (review) stats.review++;
      stats[placement === 'new_subchapter' ? 'newSubchapter' : placement]++;
      await ctx.db.run(
        `INSERT INTO triage_results (id, run_id, project_id, snippet_id, labels, chapter_before, subchapter_before, chapter_id, subchapter_id, new_subchapter_title, placement, confidence, review, reasons, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newId('trr'), runId, ctx.projectId, c.id, json(applied), c.chapterId, c.subchapterId, target.chapterId, target.subchapterId, target.newTitle, placement,
        Math.round(target.confidence * 100) / 100, review ? 1 : 0, json([target.reason]), placement === 'kept' || placement === 'unassigned' ? 'applied' : 'proposed', at,
      );
    }
    stats.createdLabels = labels.byCode.size - before;
    await ctx.db.run("UPDATE triage_runs SET status = 'finished', stats = ?, finished_at = ? WHERE id = ?", json(stats), now(), runId);
    await audit(ctx, actor, 'triage.finished', 'triage_run', runId, { scope, ...stats });
  });
  return getRun(ctx, runId);
}

/** Nach dem Import (Job): nur, wenn eingeschaltet und der Import neue Chunks brachte */
export async function runImportTriage(ctx: Ctx, importId: string) {
  if (!(await getSettings(ctx.db)).triage?.auto) return null;
  const n = Number((await ctx.db.get('SELECT COUNT(*) AS n FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE r.import_id = ?', importId))?.n ?? 0);
  if (!n) return null;
  return runTriage(ctx, { importId }, 'triage');
}

const runDto = (r: Row) => ({ id: r.id, scope: r.scope, status: r.status, stats: parseJson(r.stats, {}), startedBy: r.started_by, startedAt: r.started_at, finishedAt: r.finished_at ?? null });

export async function listRuns(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM triage_runs WHERE project_id = ? ORDER BY started_at DESC LIMIT 30', ctx.projectId)).map(runDto);
}

export async function getRun(ctx: Ctx, runId: string) {
  const r = await ctx.db.get('SELECT * FROM triage_runs WHERE id = ? AND project_id = ?', runId, ctx.projectId);
  if (!r) throw notFound(`Triage-Lauf ${runId}`);
  return runDto(r);
}

/** Ergebnisse eines Laufs (oder offene Vorschläge über alle Läufe) mit Text, Kapitel vorher/nachher */
export async function listResults(ctx: Ctx, opts: { runId?: string; status?: string; review?: boolean; placement?: string; limit?: number }) {
  const where = ['t.project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (opts.runId) (where.push('t.run_id = ?'), params.push(opts.runId));
  if (opts.status) (where.push('t.status = ?'), params.push(opts.status));
  if (opts.review) where.push('t.review = 1');
  if (opts.placement) (where.push('t.placement = ?'), params.push(opts.placement));
  if (!opts.runId && !opts.status) where.push("t.status <> 'superseded'");
  const limit = Math.min(500, Math.max(1, opts.limit ?? 200));
  const rows = await ctx.db.all(
    `SELECT t.*, s.text, s.heading_path, d.path, cb.title AS chapter_before_title, sb.title AS sub_before_title, ca.title AS chapter_title, sa.title AS sub_title
     FROM triage_results t JOIN text_snippets s ON s.id = t.snippet_id JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     LEFT JOIN chapters cb ON cb.id = t.chapter_before LEFT JOIN subchapters sb ON sb.id = t.subchapter_before
     LEFT JOIN chapters ca ON ca.id = t.chapter_id LEFT JOIN subchapters sa ON sa.id = t.subchapter_id
     WHERE ${where.join(' AND ')} ORDER BY t.created_at DESC, d.path LIMIT ${limit}`, ...params,
  );
  return rows.map((r) => ({
    id: r.id, runId: r.run_id, snippetId: r.snippet_id, text: r.text, path: r.path, headingPath: parseJson<string[]>(r.heading_path, []),
    labels: parseJson(r.labels, []), placement: r.placement, confidence: Number(r.confidence), review: !!Number(r.review), reasons: parseJson<string[]>(r.reasons, []), status: r.status,
    before: { chapterId: r.chapter_before, chapterTitle: r.chapter_before_title ?? null, subchapterId: r.subchapter_before, subchapterTitle: r.sub_before_title ?? null },
    target: { chapterId: r.chapter_id, chapterTitle: r.chapter_title ?? null, subchapterId: r.subchapter_id, subchapterTitle: r.sub_title ?? r.new_subchapter_title ?? null, newSubchapter: r.new_subchapter_title ?? null },
    decidedBy: r.decided_by ?? null, decidedAt: r.decided_at ?? null,
  }));
}

/** Unterkapitel im Kapitel finden oder neu anlegen – Kennung „neu“, bis ein Mensch es bestätigt */
async function newSubchapter(ctx: Ctx, chapterId: string, title: string, actor: string) {
  const key = headingKey(title) || title;
  const have = await ctx.db.get('SELECT id FROM subchapters WHERE chapter_id = ? AND key = ?', chapterId, key);
  if (have) return have.id as string;
  const max = Number((await ctx.db.get('SELECT MAX(position) AS m FROM subchapters WHERE chapter_id = ?', chapterId))?.m ?? 0);
  const id = newId('sub');
  await ctx.db.run('INSERT INTO subchapters (id, chapter_id, key, title, position, triage_new, triage_created_at, meta_updated_by, meta_updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)',
    id, chapterId, key, title.slice(0, 160), max + 1000, now(), actor, now());
  await audit(ctx, actor, 'subchapter.created', 'chapter', chapterId, { title, by: 'triage', new: true });
  return id;
}

async function applyResult(ctx: Ctx, r: Row, user: User) {
  if (r.status !== 'proposed') throw conflict('Der Vorschlag ist nicht mehr offen.');
  let subId = r.subchapter_id ?? null;
  if (r.placement === 'new_subchapter') subId = await newSubchapter(ctx, r.chapter_id, r.new_subchapter_title, user.id);
  await ctx.db.run('UPDATE text_snippets SET chapter_id = ?, subchapter_id = ? WHERE id = ?', r.chapter_id, subId, r.snippet_id);
  await ctx.db.run("UPDATE triage_results SET status = 'accepted', subchapter_id = ?, decided_by = ?, decided_at = ? WHERE id = ?", subId, user.id, now(), r.id);
}

export async function decideResult(ctx: Ctx, id: string, decision: unknown, user: User) {
  const r = await ctx.db.get('SELECT * FROM triage_results WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Triage-Ergebnis ${id}`);
  if (decision !== 'accept' && decision !== 'reject') throw badRequest('decision muss accept oder reject sein.');
  await ctx.db.tx(async () => {
    if (decision === 'accept') await applyResult(ctx, r, user);
    else {
      if (r.status !== 'proposed') throw conflict('Der Vorschlag ist nicht mehr offen.');
      await ctx.db.run("UPDATE triage_results SET status = 'rejected', decided_by = ?, decided_at = ? WHERE id = ?", user.id, now(), id);
    }
    await audit(ctx, user.id, `triage.${decision}ed`, 'triage_result', id, { snippetId: r.snippet_id, placement: r.placement });
  });
  return (await listResults(ctx, { runId: r.run_id, limit: 500 })).find((x) => x.id === id);
}

/** Alle offenen Vorschläge übernehmen (optional nur eines Laufs bzw. einer Art) */
export async function acceptAll(ctx: Ctx, input: { runId?: string; placement?: string }, user: User) {
  const where = ["project_id = ?", "status = 'proposed'"];
  const params: unknown[] = [ctx.projectId];
  if (input.runId) (where.push('run_id = ?'), params.push(input.runId));
  if (input.placement) {
    if (!['move', 'new_subchapter'].includes(input.placement)) throw badRequest('placement muss move oder new_subchapter sein.');
    (where.push('placement = ?'), params.push(input.placement));
  }
  const rows = await ctx.db.all(`SELECT * FROM triage_results WHERE ${where.join(' AND ')} ORDER BY created_at`, ...params);
  await ctx.db.tx(async () => {
    for (const r of rows) await applyResult(ctx, r, user);
    await audit(ctx, user.id, 'triage.accepted_all', 'project', ctx.projectId, { count: rows.length, runId: input.runId ?? null });
  });
  return { accepted: rows.length };
}

/** Unterkapitel „neu“ bestätigen (Kennung entfällt) */
export async function confirmNewSubchapter(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT s.id, s.title, s.chapter_id FROM subchapters s JOIN chapters c ON c.id = s.chapter_id WHERE s.id = ? AND c.project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Unterkapitel ${id}`);
  await ctx.db.run('UPDATE subchapters SET triage_new = 0, meta_updated_by = ?, meta_updated_at = ? WHERE id = ?', user.id, now(), id);
  await audit(ctx, user.id, 'subchapter.confirmed', 'chapter', r.chapter_id, { subchapterId: id, title: r.title });
  return { id, confirmed: true };
}

export async function newSubchapters(ctx: Ctx) {
  return (await ctx.db.all(
    `SELECT s.id, s.title, s.triage_created_at, c.id AS chapter_id, c.title AS chapter_title, (SELECT COUNT(*) FROM text_snippets x WHERE x.subchapter_id = s.id) AS chunks
     FROM subchapters s JOIN chapters c ON c.id = s.chapter_id WHERE c.project_id = ? AND s.triage_new = 1 ORDER BY c.position, s.position`, ctx.projectId,
  )).map((r) => ({ id: r.id, title: r.title, chapterId: r.chapter_id, chapterTitle: r.chapter_title, createdAt: r.triage_created_at, chunks: Number(r.chunks) }));
}

// ---------------------------------------------------------------- Dashboard

const words = (t: string) => (t.match(/\S+/g) ?? []).length;

/** Kennzahlen: Chunks, Wörter und Labels je Kapitel und je Domäne, Abdeckung der Pflichtgruppen, Detaillevel, zu prüfen */
export async function contentDashboard(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT s.id, s.text, c.id AS chapter_id, c.title AS chapter_title, c.position AS chapter_pos, c.outline_family_id FROM text_snippets s
     JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id JOIN chapters c ON c.id = s.chapter_id
     WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL AND s.excluded_reason IS NULL`, ctx.projectId,
  );
  const lbl = await ctx.db.all(
    `SELECT x.snippet_id, l.code, l.label_group, l.name_de, x.origin FROM metadata_chunk_labels x JOIN metadata_labels l ON l.id = x.label_id
     JOIN text_snippets s ON s.id = x.snippet_id JOIN source_revisions r ON r.id = s.revision_id WHERE x.project_id = ? AND r.is_current = 1`, ctx.projectId,
  );
  const bySnippet = new Map<string, { code: string; group: string; name: string; origin: string }[]>();
  for (const l of lbl) bySnippet.set(l.snippet_id, [...(bySnippet.get(l.snippet_id) ?? []), { code: l.code, group: l.label_group, name: l.name_de, origin: l.origin }]);
  const chapters = new Map<string, { chapterId: string; title: string; position: number; chunks: number; words: number; labels: number; review: number; detail: Record<string, number> }>();
  const domains = new Map<string, { code: string; name: string; chunks: number; words: number }>();
  const groupCover = Object.fromEntries(REQUIRED_GROUPS.map((g) => [g, 0])) as Record<RequiredGroup, number>;
  let total = 0;
  let totalWords = 0;
  let complete = 0;
  let review = 0;
  for (const r of rows) {
    const w = words(r.text);
    total++;
    totalWords += w;
    const ls = bySnippet.get(r.id) ?? [];
    const ch = chapters.get(r.chapter_id) ?? { chapterId: r.chapter_id, title: r.chapter_title, position: Number(r.chapter_pos), chunks: 0, words: 0, labels: 0, review: 0, detail: {} as Record<string, number> };
    ch.chunks++;
    ch.words += w;
    ch.labels += ls.length;
    const toReview = ls.some((l) => l.code === 'review.yes');
    if (toReview) (ch.review++, review++);
    for (const l of ls.filter((x) => x.group === 'detail')) ch.detail[l.code.replace(/^detail\./, '')] = (ch.detail[l.code.replace(/^detail\./, '')] ?? 0) + 1;
    chapters.set(r.chapter_id, ch);
    const doms = ls.filter((l) => l.group === 'domain');
    for (const d of doms.length ? doms : [{ code: '(ohne)', name: 'ohne Domäne', group: 'domain', origin: '' }]) {
      const e = domains.get(d.code) ?? { code: d.code, name: d.name, chunks: 0, words: 0 };
      e.chunks++;
      e.words += w;
      domains.set(d.code, e);
    }
    const groups = new Set(ls.map((l) => l.group));
    for (const g of REQUIRED_GROUPS) if (groups.has(g)) groupCover[g]++;
    if (REQUIRED_GROUPS.every((g) => groups.has(g))) complete++;
  }
  const distinctLabels = new Set(lbl.map((l) => l.code)).size;
  return {
    totals: { chunks: total, words: totalWords, labelAssignments: lbl.length, distinctLabels, complete, review, triageAssignments: lbl.filter((l) => l.origin === 'triage').length },
    requiredGroups: REQUIRED_GROUPS.map((g) => ({ group: g, label: GROUP_LABEL[g], chunks: groupCover[g], share: total ? Math.round((groupCover[g] / total) * 1000) / 1000 : 0 })),
    chapters: [...chapters.values()].sort((a, b) => a.position - b.position || a.title.localeCompare(b.title, 'de')),
    domains: [...domains.values()].sort((a, b) => b.chunks - a.chunks),
    detailLevels: DETAIL_LEVELS.map((d) => ({ code: d, chunks: [...chapters.values()].reduce((s, c) => s + (c.detail[d] ?? 0), 0), standard: DEFAULT_DETAIL_LEVELS.includes(d) })),
    newSubchapters: (await newSubchapters(ctx)).length,
    openProposals: Number((await ctx.db.get("SELECT COUNT(*) AS n FROM triage_results WHERE project_id = ? AND status = 'proposed'", ctx.projectId))?.n ?? 0),
  };
}
