// Qualitätsanalyse: Cluster, Dopplungen, Widersprüche, Lücken, Datenschutz, Terminologie, Lesbarkeit
// (US-005, US-006, US-007, US-012, P1 US-013/015/018).
import { audit, getSettings, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { detectContradictions, RULE_LABELS, type Statement } from '../domain/contradictions.js';
import { detectPrivacy } from '../domain/privacy.js';
import { DECISION_CODES, DECISIONS, SEVERITIES, type Severity } from '../domain/reference.js';
import { clusterPairs, TfidfEngine, type SimilarityPair } from '../domain/similarity.js';
import { badRequest, notFound, unprocessable } from '../problem.js';

interface NewFinding {
  type: string;
  subtype: string;
  severity: Severity;
  chapterId: string | null;
  a?: string | null;
  b?: string | null;
  score?: number | null;
  method: string;
  reason: string;
  details?: Record<string, unknown>;
}

const fingerprint = (f: NewFinding) => `${f.type}:${f.subtype}:${[f.a, f.b].filter(Boolean).sort().join('|') || f.chapterId}:${f.type === 'gap' ? f.reason : ''}`;
const maxSeverity = (list: Severity[]) => SEVERITIES.find((s) => list.includes(s)) ?? 'low';

export function startAnalysis(ctx: Ctx, actor: string) {
  const settings = getSettings(ctx.db).analysis;
  const id = newId('run');
  ctx.db.run(
    "INSERT INTO analysis_runs (id, project_id, status, method, settings, started_at) VALUES (?, ?, 'queued', ?, ?, ?)",
    id, ctx.projectId, 'tfidf-cosine-1.0 + rules-1.0', json(settings), now(),
  );
  audit(ctx.db, actor, 'analysis.started', 'analysis_run', id, settings);
  ctx.jobs.enqueue(`analysis:${id}`, async () => void runAnalysis(ctx, id));
  return getAnalysisRun(ctx, id);
}

export function getAnalysisRun(ctx: Ctx, id: string) {
  const r = ctx.db.get('SELECT * FROM analysis_runs WHERE id = ?', id);
  if (!r) throw notFound(`Analyselauf ${id}`);
  return { id: r.id, status: r.status, method: r.method, settings: parseJson(r.settings, {}), startedAt: r.started_at, finishedAt: r.finished_at, stats: parseJson(r.stats, {}) };
}

export function runAnalysis(ctx: Ctx, runId: string) {
  const { db } = ctx;
  const all = getSettings(db);
  const settings = all.analysis;
  db.run("UPDATE analysis_runs SET status = 'processing' WHERE id = ?", runId);

  const snippets = db.all(
    `SELECT s.*, r.revision_no, r.is_current, d.id AS document_id, d.path FROM text_snippets s
     JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND r.is_current = 1 AND s.kind <> 'code' ORDER BY s.seq`,
    ctx.projectId,
  );
  const byId = new Map(snippets.map((s) => [s.id as string, s]));
  const rolesOf = groupCodes(db.all('SELECT snippet_id, role_code AS code FROM snippet_roles'));
  const divsOf = groupCodes(db.all('SELECT snippet_id, division_code AS code FROM snippet_divisions'));
  const found: NewFinding[] = [];

  // Stufe 1: identischer Hash
  const hashGroups = new Map<string, Row[]>();
  for (const s of snippets) hashGroups.set(s.norm_hash, [...(hashGroups.get(s.norm_hash) ?? []), s]);
  const exactPairs = new Set<string>();
  for (const group of hashGroups.values()) {
    for (let i = 1; i < group.length; i++) {
      const [a, b] = [group[0], group[i]];
      exactPairs.add([a.id, b.id].sort().join('|'));
      found.push({
        type: 'duplicate', subtype: 'exact_hash', severity: 'low', chapterId: a.chapter_id, a: a.id, b: b.id, score: 1, method: 'sha256-normalized',
        reason: a.chapter_id === b.chapter_id ? 'Identischer Text (Stufe 1: Hash)' : 'Identischer Text in unterschiedlichen Kapiteln (Stufe 1: Hash)',
        details: { level: 1, crossChapter: a.chapter_id !== b.chapter_id },
      });
    }
  }

  // Semantische Paare
  const engine = new TfidfEngine();
  const minScore = Math.min(settings.clusterThreshold, settings.contradictionThreshold, settings.duplicateThreshold);
  let pairs: SimilarityPair[] = engine.pairs(snippets.map((s) => ({ id: s.id, text: s.text })), minScore);
  if (!settings.crossChapter) pairs = pairs.filter((p) => byId.get(p.a)!.chapter_id === byId.get(p.b)!.chapter_id);
  const method = `${engine.method}-${engine.version}`;

  const stmt = (s: Row): Statement => ({
    id: s.id, text: s.text, roles: rolesOf.get(s.id) ?? [], divisions: divsOf.get(s.id) ?? [], market: s.market_code, release: s.release_code,
    documentId: s.document_id, revisionNo: s.revision_no, isCurrentRevision: !!s.is_current, path: s.path,
  });

  for (const p of pairs) {
    const a = byId.get(p.a)!;
    const b = byId.get(p.b)!;
    if (exactPairs.has([a.id, b.id].sort().join('|'))) continue;
    const cross = a.chapter_id !== b.chapter_id;
    const why = `Gemeinsame Begriffe: ${p.sharedTerms.join(', ') || '–'}`;
    const hits = p.score >= settings.contradictionThreshold ? detectContradictions(stmt(a), stmt(b), p.score) : [];
    if (hits.length) {
      const severity = maxSeverity(hits.map((h) => (settings.ruleSeverity[h.rule] ?? 'medium') as Severity));
      found.push({
        type: 'contradiction', subtype: hits[0].rule, severity, chapterId: a.chapter_id, a: a.id, b: b.id, score: p.score, method: `${method} + contradiction-rules-1.0`,
        reason: hits.map((h) => h.reason).join('; '),
        details: { rules: hits.map((h) => ({ rule: h.rule, label: RULE_LABELS[h.rule], ...h.details })), sharedTerms: p.sharedTerms, crossChapter: cross, why },
      });
    } else if (p.score >= settings.duplicateThreshold) {
      found.push({
        type: 'duplicate', subtype: cross ? 'cross_chapter' : 'semantic', severity: cross ? 'medium' : 'low', chapterId: a.chapter_id, a: a.id, b: b.id, score: p.score, method,
        reason: cross ? 'Gleiches Fachkonzept in unterschiedlichen Kapiteln (Stufe 3)' : 'Semantisch nahezu gleiche Aussage (Stufe 2)',
        details: { level: cross ? 3 : 2, sharedTerms: p.sharedTerms, crossChapter: cross, why },
      });
    }
  }

  // Lücken: Unterkapitel ohne aktuelle Textabschnitte, Kapitel ohne bestätigte Quelle
  for (const sc of db.all(
    `SELECT sc.id, sc.title, sc.chapter_id, c.title AS chapter_title FROM subchapters sc JOIN chapters c ON c.id = sc.chapter_id
     WHERE c.project_id = ? AND NOT EXISTS (SELECT 1 FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE s.subchapter_id = sc.id AND r.is_current = 1)`,
    ctx.projectId,
  )) {
    found.push({ type: 'gap', subtype: 'empty_subchapter', severity: 'medium', chapterId: sc.chapter_id, method: 'structure-rules-1.0', reason: `Unterkapitel „${sc.title}“ enthält keinen Text`, details: { subchapterId: sc.id } });
  }
  for (const c of db.all(
    `SELECT c.id, c.title FROM chapters c WHERE c.project_id = ? AND NOT EXISTS (
       SELECT 1 FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE s.chapter_id = c.id AND r.is_current = 1
       AND s.evidence_status IN ('source_confirmed','manually_confirmed'))`,
    ctx.projectId,
  )) {
    found.push({ type: 'gap', subtype: 'no_confirmed_source', severity: 'high', chapterId: c.id, method: 'structure-rules-1.0', reason: `Kapitel „${c.title}“ hat keine bestätigte Quelle` });
  }

  // Datenschutz, Terminologie, Lesbarkeit je Textabschnitt
  for (const s of snippets) {
    const privacy = detectPrivacy(s.text);
    if (privacy.length) {
      found.push({ type: 'privacy', subtype: privacy[0].kind, severity: 'blocker', chapterId: s.chapter_id, a: s.id, method: 'privacy-patterns-1.0', reason: `Mögliche personenbezogene Daten: ${privacy.map((h) => `${h.kind} (${h.match})`).join(', ')}`, details: { hits: privacy } });
    }
    for (const t of all.terminology) {
      const hit = t.avoid.find((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(s.text));
      if (hit) found.push({ type: 'terminology', subtype: 'avoid_term', severity: 'low', chapterId: s.chapter_id, a: s.id, method: 'terminology-list', reason: `„${hit}“ → bevorzugt „${t.preferred}“`, details: { term: hit, preferred: t.preferred } });
    }
    const long = s.text.split(/(?<=[.!?])\s+/).filter((x: string) => x.split(/\s+/).length > all.readability.maxSentenceWords);
    if (long.length && s.kind === 'paragraph') {
      found.push({ type: 'readability', subtype: 'long_sentence', severity: 'low', chapterId: s.chapter_id, a: s.id, method: 'readability-rules-1.0', reason: `${long.length} Satz/Sätze mit mehr als ${all.readability.maxSentenceWords} Wörtern`, details: { sentences: long.length } });
    }
  }

  // Persistieren: bestehende Befunde (inkl. Entscheidungen) bleiben erhalten.
  const stats = { snippets: snippets.length, pairs: pairs.length, created: 0, kept: 0, obsolete: 0, clusters: 0 };
  db.tx(() => {
    const seen = new Set<string>();
    for (const f of found) {
      const fp = fingerprint(f);
      if (seen.has(fp)) continue;
      seen.add(fp);
      const existing = db.get("SELECT id FROM quality_findings WHERE project_id = ? AND fingerprint = ? AND status <> 'obsolete'", ctx.projectId, fp);
      if (existing) {
        db.run('UPDATE quality_findings SET score = ?, reason = ?, details = ?, analysis_run_id = ? WHERE id = ?', f.score ?? null, f.reason, json(f.details ?? {}), runId, existing.id);
        stats.kept++;
        continue;
      }
      db.run(
        `INSERT INTO quality_findings (id, seq, project_id, analysis_run_id, type, subtype, severity, status, chapter_id, snippet_a_id, snippet_b_id, score, method, reason, details, fingerprint, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newId('qf'), db.nextSeq('quality_findings'), ctx.projectId, runId, f.type, f.subtype, f.severity, f.chapterId, f.a ?? null, f.b ?? null, f.score ?? null, f.method, f.reason, json(f.details ?? {}), fp, now(),
      );
      stats.created++;
    }
    // Nicht mehr erkannte, unentschiedene Hinweise werden als „obsolete“ markiert (keine Löschung).
    for (const old of db.all("SELECT id, fingerprint FROM quality_findings WHERE project_id = ? AND status = 'open' AND decision IS NULL", ctx.projectId)) {
      if (!seen.has(old.fingerprint)) {
        db.run("UPDATE quality_findings SET status = 'obsolete', decision_reason = 'In aktueller Analyse nicht mehr erkannt' WHERE id = ?", old.id);
        stats.obsolete++;
      }
    }

    // Cluster: bestätigte Cluster bleiben, vorgeschlagene werden neu berechnet.
    db.run("DELETE FROM cluster_members WHERE cluster_id IN (SELECT id FROM semantic_clusters WHERE project_id = ? AND status = 'proposed')", ctx.projectId);
    db.run("DELETE FROM semantic_clusters WHERE project_id = ? AND status = 'proposed' AND id NOT IN (SELECT cluster_id FROM canonical_topics WHERE cluster_id IS NOT NULL)", ctx.projectId);
    const locked = new Set(db.all("SELECT m.snippet_id FROM cluster_members m JOIN semantic_clusters c ON c.id = m.cluster_id WHERE c.project_id = ? AND c.status <> 'proposed'", ctx.projectId).map((r) => r.snippet_id));
    const clusterPairsList = pairs.filter((p) => p.score >= settings.clusterThreshold && !locked.has(p.a) && !locked.has(p.b));
    for (const g of hashGroups.values()) for (let i = 1; i < g.length; i++) if (!locked.has(g[0].id) && !locked.has(g[i].id)) clusterPairsList.push({ a: g[0].id, b: g[i].id, score: 1, sharedTerms: [] });
    const groups = clusterPairs(snippets.map((s) => s.id).filter((id) => !locked.has(id)), clusterPairsList);
    for (const g of groups) {
      const members = g.map((id) => byId.get(id)!);
      const chapters = new Set(members.map((m) => m.chapter_id));
      const terms = new Map<string, number>();
      for (const p of clusterPairsList) if (g.includes(p.a)) for (const t of p.sharedTerms) terms.set(t, (terms.get(t) ?? 0) + 1);
      const name = [...terms.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3).map(([t]) => t).join(' · ') || members[0].text.slice(0, 40);
      const cid = newId('cl');
      db.run(
        "INSERT INTO semantic_clusters (id, project_id, analysis_run_id, name, status, scope, method, threshold, created_at, updated_at) VALUES (?, ?, ?, ?, 'proposed', ?, ?, ?, ?, ?)",
        cid, ctx.projectId, runId, name, chapters.size > 1 ? 'cross_chapter' : 'intra_chapter', method, settings.clusterThreshold, now(), now(),
      );
      for (const m of members) {
        const best = clusterPairsList.filter((p) => p.a === m.id || p.b === m.id).sort((x, y) => y.score - x.score)[0];
        db.run('INSERT INTO cluster_members (cluster_id, snippet_id, score, reason) VALUES (?, ?, ?, ?)', cid, m.id, best?.score ?? 1, best?.sharedTerms.length ? `Gemeinsame Begriffe: ${best.sharedTerms.join(', ')}` : 'Identischer Text');
      }
      stats.clusters++;
    }
    db.run("UPDATE analysis_runs SET status = 'completed', finished_at = ?, stats = ? WHERE id = ?", now(), json(stats), runId);
  });
  audit(db, 'system', 'analysis.finished', 'analysis_run', runId, stats);
  return stats;
}

function groupCodes(rows: Row[]) {
  const m = new Map<string, string[]>();
  for (const r of rows) m.set(r.snippet_id, [...(m.get(r.snippet_id) ?? []), r.code]);
  return m;
}

// ---------- Befunde ----------

export interface FindingQuery {
  type?: string;
  severity?: string;
  status?: string;
  chapterId?: string;
  minScore?: number;
}

export function listFindings(ctx: Ctx, q: FindingQuery) {
  const where = ['f.project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (q.type) (where.push('f.type = ?'), params.push(q.type));
  if (q.severity) (where.push('f.severity = ?'), params.push(q.severity));
  if (q.status) {
    const st = q.status.split(',');
    where.push(`f.status IN (${st.map(() => '?').join(',')})`);
    params.push(...st);
  } else where.push("f.status <> 'obsolete'");
  if (q.chapterId) {
    where.push('(f.chapter_id = ? OR sa.chapter_id = ? OR sb.chapter_id = ?)');
    params.push(q.chapterId, q.chapterId, q.chapterId);
  }
  if (q.minScore !== undefined) (where.push('(f.score IS NULL OR f.score >= ?)'), params.push(q.minScore));
  const rows = ctx.db.all(
    `SELECT f.*, c.title AS chapter_title FROM quality_findings f LEFT JOIN chapters c ON c.id = f.chapter_id
     LEFT JOIN text_snippets sa ON sa.id = f.snippet_a_id LEFT JOIN text_snippets sb ON sb.id = f.snippet_b_id
     WHERE ${where.join(' AND ')} ORDER BY CASE f.severity WHEN 'blocker' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, f.score DESC, f.seq`,
    ...params,
  );
  return rows.map((f) => findingDto(ctx, f));
}

function snippetBrief(ctx: Ctx, id: string | null) {
  if (!id) return null;
  const s = ctx.db.get(
    `SELECT s.id, s.seq, s.text, s.market_code, s.release_code, s.evidence_status, s.excluded_reason, s.line_start, s.line_end, s.chapter_id, r.id AS revision_id, c.title AS chapter, sc.title AS subchapter, d.path, r.revision_no, r.is_current
     FROM text_snippets s JOIN chapters c ON c.id = s.chapter_id LEFT JOIN subchapters sc ON sc.id = s.subchapter_id
     JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE s.id = ?`, id,
  );
  if (!s) return null;
  return {
    id: s.id, seq: s.seq, text: s.text, chapter: s.chapter, subchapter: s.subchapter, path: s.path, revisionNo: s.revision_no, revisionId: s.revision_id, chapterId: s.chapter_id, isCurrent: !!s.is_current, lineStart: s.line_start, lineEnd: s.line_end,
    market: s.market_code, release: s.release_code, evidenceStatus: s.evidence_status, excludedReason: s.excluded_reason,
    roles: ctx.db.all('SELECT role_code AS code, evidence_status AS evidenceStatus FROM snippet_roles WHERE snippet_id = ?', id),
    divisions: ctx.db.all('SELECT division_code AS code, evidence_status AS evidenceStatus FROM snippet_divisions WHERE snippet_id = ?', id),
  };
}

export function findingDto(ctx: Ctx, f: Row) {
  return {
    id: f.id, seq: f.seq, type: f.type, subtype: f.subtype, severity: f.severity, status: f.status, chapterId: f.chapter_id, chapterTitle: f.chapter_title,
    score: f.score, method: f.method, reason: f.reason, details: parseJson(f.details, {}), decision: f.decision, decisionReason: f.decision_reason,
    decidedBy: f.decided_by, decidedAt: f.decided_at, createdAt: f.created_at, a: snippetBrief(ctx, f.snippet_a_id), b: snippetBrief(ctx, f.snippet_b_id),
  };
}

export function getFinding(ctx: Ctx, id: string) {
  const f = ctx.db.get('SELECT f.*, c.title AS chapter_title FROM quality_findings f LEFT JOIN chapters c ON c.id = f.chapter_id WHERE f.id = ?', id);
  if (!f) throw notFound(`Befund ${id}`);
  return findingDto(ctx, f);
}

export interface DecisionInput {
  decision: string;
  reason: string;
  /** bei „veraltete Quelle“: welche Aussage veraltet ist */
  outdated?: 'a' | 'b';
}

export function decideFinding(ctx: Ctx, id: string, input: DecisionInput, actor: string) {
  const f = getFinding(ctx, id);
  if (!DECISION_CODES.includes(input.decision)) throw badRequest(`Unbekannte Entscheidung. Erlaubt: ${DECISION_CODES.join(', ')}`);
  if (!input.reason || input.reason.trim().length < 3) throw unprocessable('Eine Entscheidung benötigt eine Begründung (mind. 3 Zeichen).');
  if (f.status === 'resolved' || f.status === 'ignored') throw unprocessable(`Befund #${f.seq} ist bereits entschieden (${f.decision}).`);
  const def = DECISIONS.find((d) => d.code === input.decision)!;
  if ((input.decision === 'take_a' || input.decision === 'take_b') && !f.b) throw badRequest('Befund hat nur eine Aussage.');
  if (input.decision === 'outdated_source' && !input.outdated) throw badRequest('Bei „veraltete Quelle“ muss angegeben werden, welche Aussage veraltet ist (outdated: a | b).');

  const status = input.decision === 'defer' ? 'deferred' : input.decision === 'ignore' ? 'ignored' : 'resolved';
  const { db } = ctx;
  db.tx(() => {
    db.run('UPDATE quality_findings SET status = ?, decision = ?, decision_reason = ?, decided_by = ?, decided_at = ? WHERE id = ?', status, input.decision, input.reason.trim(), actor, now(), id);
    const exclude = (sid: string | undefined) =>
      sid && db.run('UPDATE text_snippets SET excluded_reason = ? WHERE id = ?', `Befund #${f.seq}: ${def.label} – ${input.reason.trim()}`, sid);
    if (input.decision === 'take_a') exclude(f.b?.id);
    if (input.decision === 'take_b') exclude(f.a?.id);
    if (input.decision === 'outdated_source') exclude(input.outdated === 'a' ? f.a?.id : f.b?.id);
    audit(db, actor, 'finding.decided', 'finding', id, { decision: input.decision, reason: input.reason, outdated: input.outdated });
  });
  return getFinding(ctx, id);
}

// ---------- Cluster und Canonical Topics (US-005, US-006) ----------

export function listClusters(ctx: Ctx, status?: string) {
  const rows = ctx.db.all(
    `SELECT * FROM semantic_clusters WHERE project_id = ? ${status ? 'AND status = ?' : "AND status <> 'dissolved'"} ORDER BY status DESC, created_at`,
    ...(status ? [ctx.projectId, status] : [ctx.projectId]),
  );
  return rows.map((c) => clusterDto(ctx, c));
}

function clusterDto(ctx: Ctx, c: Row) {
  const members = ctx.db.all(
    `SELECT m.snippet_id, m.score, m.reason, s.seq, s.text, s.chapter_id, ch.title AS chapter, sc.title AS subchapter, d.path
     FROM cluster_members m JOIN text_snippets s ON s.id = m.snippet_id JOIN chapters ch ON ch.id = s.chapter_id LEFT JOIN subchapters sc ON sc.id = s.subchapter_id
     JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE m.cluster_id = ? ORDER BY s.seq`, c.id,
  );
  const topic = ctx.db.get('SELECT id, title FROM canonical_topics WHERE cluster_id = ?', c.id);
  return {
    id: c.id, name: c.name, status: c.status, scope: c.scope, method: c.method, threshold: c.threshold, createdAt: c.created_at, updatedAt: c.updated_at,
    canonicalTopic: topic ?? null,
    members: members.map((m) => ({ snippetId: m.snippet_id, seq: m.seq, text: m.text, chapterId: m.chapter_id, chapter: m.chapter, subchapter: m.subchapter, path: m.path, score: m.score, reason: m.reason })),
  };
}

function getCluster(ctx: Ctx, id: string) {
  const c = ctx.db.get('SELECT * FROM semantic_clusters WHERE id = ?', id);
  if (!c) throw notFound(`Cluster ${id}`);
  return c;
}

export function updateCluster(ctx: Ctx, id: string, patch: { name?: string; status?: 'confirmed' | 'dissolved' | 'proposed' }, actor: string) {
  getCluster(ctx, id);
  if (patch.status && !['confirmed', 'dissolved', 'proposed'].includes(patch.status)) throw badRequest('Status muss confirmed, proposed oder dissolved sein.');
  ctx.db.run('UPDATE semantic_clusters SET name = COALESCE(?, name), status = COALESCE(?, status), updated_at = ? WHERE id = ?', patch.name?.trim() || null, patch.status ?? null, now(), id);
  audit(ctx.db, actor, 'cluster.updated', 'cluster', id, patch);
  return clusterDto(ctx, getCluster(ctx, id));
}

export function mergeClusters(ctx: Ctx, id: string, otherIds: string[], actor: string) {
  getCluster(ctx, id);
  ctx.db.tx(() => {
    for (const o of otherIds) {
      if (o === id) continue;
      getCluster(ctx, o);
      ctx.db.run('INSERT OR IGNORE INTO cluster_members (cluster_id, snippet_id, score, reason) SELECT ?, snippet_id, score, reason FROM cluster_members WHERE cluster_id = ?', id, o);
      ctx.db.run('DELETE FROM cluster_members WHERE cluster_id = ?', o);
      ctx.db.run("UPDATE semantic_clusters SET status = 'dissolved', updated_at = ? WHERE id = ?", now(), o);
    }
    const chapters = ctx.db.get<{ n: number }>('SELECT COUNT(DISTINCT s.chapter_id) n FROM cluster_members m JOIN text_snippets s ON s.id = m.snippet_id WHERE m.cluster_id = ?', id)!.n;
    ctx.db.run("UPDATE semantic_clusters SET status = 'confirmed', scope = ?, updated_at = ? WHERE id = ?", chapters > 1 ? 'cross_chapter' : 'intra_chapter', now(), id);
    audit(ctx.db, actor, 'cluster.merged', 'cluster', id, { merged: otherIds });
  });
  return clusterDto(ctx, getCluster(ctx, id));
}

export function splitCluster(ctx: Ctx, id: string, snippetIds: string[], name: string | undefined, actor: string) {
  const c = getCluster(ctx, id);
  if (!snippetIds.length) throw badRequest('Mindestens ein Textabschnitt muss abgeteilt werden.');
  const newIdValue = newId('cl');
  ctx.db.tx(() => {
    ctx.db.run(
      "INSERT INTO semantic_clusters (id, project_id, analysis_run_id, name, status, scope, method, threshold, created_at, updated_at) VALUES (?, ?, ?, ?, 'confirmed', ?, 'manual-split', ?, ?, ?)",
      newIdValue, ctx.projectId, c.analysis_run_id, name?.trim() || `${c.name} (Teil)`, c.scope, c.threshold, now(), now(),
    );
    for (const sid of snippetIds) {
      const moved = ctx.db.run('UPDATE cluster_members SET cluster_id = ? WHERE cluster_id = ? AND snippet_id = ?', newIdValue, id, sid);
      if (!moved.changes) throw badRequest(`Textabschnitt ${sid} gehört nicht zu Cluster ${id}.`);
    }
    ctx.db.run("UPDATE semantic_clusters SET status = 'confirmed', updated_at = ? WHERE id = ?", now(), id);
    audit(ctx.db, actor, 'cluster.split', 'cluster', id, { newCluster: newIdValue, snippetIds });
  });
  return [clusterDto(ctx, getCluster(ctx, id)), clusterDto(ctx, getCluster(ctx, newIdValue))];
}

export interface CanonicalInput {
  title: string;
  clusterId?: string;
  snippetIds?: string[];
  leadChapterId: string;
  leadSnippetId?: string;
  reason: string;
}

/** Canonical Topic: führendes Kapitel festlegen, andere Kapitel erhalten Querverweise (US-006). */
export function createCanonicalTopic(ctx: Ctx, input: CanonicalInput, actor: string) {
  if (!input.title?.trim() || !input.reason?.trim()) throw unprocessable('Titel und Begründung sind Pflicht.');
  if (!ctx.db.get('SELECT id FROM chapters WHERE id = ?', input.leadChapterId)) throw notFound(`Kapitel ${input.leadChapterId}`);
  let snippetIds = input.snippetIds ?? [];
  if (input.clusterId) {
    getCluster(ctx, input.clusterId);
    snippetIds = [...new Set([...snippetIds, ...ctx.db.all('SELECT snippet_id FROM cluster_members WHERE cluster_id = ?', input.clusterId).map((r) => r.snippet_id)])];
  }
  if (snippetIds.length < 2) throw unprocessable('Ein Canonical Topic benötigt mindestens zwei Textabschnitte.');
  const id = newId('ct');
  ctx.db.tx(() => {
    ctx.db.run(
      'INSERT INTO canonical_topics (id, project_id, title, cluster_id, lead_chapter_id, lead_snippet_id, reason, decided_by, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, input.title.trim(), input.clusterId ?? null, input.leadChapterId, input.leadSnippetId ?? null, input.reason.trim(), actor, now(),
    );
    for (const sid of snippetIds) ctx.db.run('INSERT INTO canonical_topic_members (topic_id, snippet_id) VALUES (?, ?)', id, sid);
    if (input.clusterId) ctx.db.run("UPDATE semantic_clusters SET status = 'confirmed', updated_at = ? WHERE id = ?", now(), input.clusterId);
    // Dopplungsbefunde zwischen Mitgliedern gelten durch diese Entscheidung als entschieden.
    const ph = snippetIds.map(() => '?').join(',');
    ctx.db.run(
      `UPDATE quality_findings SET status = 'resolved', decision = 'canonical_topic', decision_reason = ?, decided_by = ?, decided_at = ?
       WHERE type = 'duplicate' AND status IN ('open','deferred') AND snippet_a_id IN (${ph}) AND snippet_b_id IN (${ph})`,
      `Canonical Topic „${input.title.trim()}“`, actor, now(), ...snippetIds, ...snippetIds,
    );
    audit(ctx.db, actor, 'canonical_topic.created', 'canonical_topic', id, { ...input, snippetIds });
  });
  return listCanonicalTopics(ctx).find((t) => t.id === id)!;
}

export function listCanonicalTopics(ctx: Ctx) {
  return ctx.db.all(
    'SELECT t.*, c.title AS lead_chapter FROM canonical_topics t JOIN chapters c ON c.id = t.lead_chapter_id WHERE t.project_id = ? ORDER BY t.decided_at',
    ctx.projectId,
  ).map((t) => ({
    id: t.id, title: t.title, clusterId: t.cluster_id, leadChapterId: t.lead_chapter_id, leadChapter: t.lead_chapter, leadSnippetId: t.lead_snippet_id,
    reason: t.reason, decidedBy: t.decided_by, decidedAt: t.decided_at,
    snippetIds: ctx.db.all('SELECT snippet_id FROM canonical_topic_members WHERE topic_id = ?', t.id).map((r) => r.snippet_id),
  }));
}
