// Anleitungs-Check (ADR-051) und Kapitel-Assistent (ADR-052): Kapitel so schreiben, dass Leserinnen und Leser sie leicht befolgen können.
import { audit, type Ctx } from '../context.js';
import { newId, now } from '../db.js';
import { analyzeGuidance, GUIDANCE_OPEN_LABEL, isAction, type GuidanceBlock } from '../domain/guidance.js';
import { CHAPTER_SECTIONS } from '../domain/reference.js';
import { segmentSentences } from '../domain/style.js';
import { badRequest } from '../problem.js';
import { getChapterVersion, insertBlock, normalizePositions } from './chapters.js';
import { assertIdsInProject } from './projects.js';
import { applyChapterTexts } from './style.js';

/** Der Abschnitt „Quellen- und Freigabestatus“ ist Verwaltungsinformation und kein Anleitungstext */
const SKIP_SECTIONS = new Set(['status']);
const SECTION_TITLE = new Map<string, string>(CHAPTER_SECTIONS.map((s) => [s.code, s.title]));

async function knownAcronyms(ctx: Ctx) {
  const abbr = (await ctx.db.all('SELECT abbreviation FROM abbreviations WHERE project_id = ?', ctx.projectId)).map((r) => String(r.abbreviation).trim().toUpperCase());
  const terms = (await ctx.db.all("SELECT preferred FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId)).map((r) => String(r.preferred).trim());
  return new Set([...abbr, ...terms.filter((t) => /^[\p{Lu}\d-]{2,8}$/u.test(t))]);
}

/** Anleitungs-Check einer Kapitelversion mit Korrekturvorschlägen (nur Entwürfe sind änderbar) */
export async function chapterGuidance(ctx: Ctx, versionId: string) {
  const v = await getChapterVersion(ctx, versionId);
  const blocks: GuidanceBlock[] = v.sections.filter((s) => !SKIP_SECTIONS.has(s.code)).flatMap((s) => s.blocks.map((b: any) => ({
    id: b.id as string, section: s.code, kind: b.kind as string, text: b.text as string, versionNo: b.versionNo as number, locked: b.mode === 'locked',
  })));
  const a = analyzeGuidance(blocks, { knownAcronyms: await knownAcronyms(ctx) });
  const where = new Map(blocks.map((b) => [b.id, SECTION_TITLE.get(b.section) ?? b.section]));
  return {
    versionId: v.id, chapterId: v.chapterId, title: v.title, versionNo: v.versionNo, status: v.status, editable: v.status === 'draft',
    ...a, checks: a.checks.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i, section: i.blockId ? where.get(i.blockId) ?? null : null })) })),
  };
}

/** Korrekturen aus dem Check übernehmen (Text und ggf. Blocktyp); geänderte oder gesperrte Absätze werden übersprungen */
export async function applyGuidanceFixes(ctx: Ctx, versionId: string, input: { fixes?: unknown }, actor: string) {
  if (!Array.isArray(input.fixes) || !input.fixes.length) throw badRequest('fixes (blockId, versionNo, text, kind?) ist Pflicht.');
  const blocks = (input.fixes as Record<string, unknown>[]).map((f) => ({ id: f?.blockId, versionNo: f?.versionNo, text: f?.text, ...(typeof f?.kind === 'string' ? { kind: f.kind } : {}) }));
  const r = await applyChapterTexts(ctx, versionId, { blocks, reason: 'Anleitungs-Check' }, actor);
  return { ...r, guidance: await chapterGuidance(ctx, versionId) };
}

/** Übersicht je Kapitel (neueste Version): Wert und die offenen Punkte – schlechteste zuerst */
export async function guidanceSummary(ctx: Ctx) {
  const versions = await ctx.db.all(
    `SELECT c.id AS chapter_id, c.title, v.id AS version_id, v.version_no, v.status FROM chapters c JOIN generated_chapter_versions v ON v.chapter_id = c.id
     WHERE c.project_id = ? AND c.outline_family_id IS NULL AND v.version_no = (SELECT MAX(x.version_no) FROM generated_chapter_versions x WHERE x.chapter_id = c.id)`, ctx.projectId,
  );
  const known = await knownAcronyms(ctx);
  const out = [];
  for (const v of versions) {
    const rows = await ctx.db.all('SELECT id, section_code, kind, text, version_no, mode FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL ORDER BY position', v.version_id);
    const a = analyzeGuidance(rows.filter((b) => !SKIP_SECTIONS.has(b.section_code)).map((b) => ({ id: b.id, section: b.section_code, kind: b.kind, text: b.text, versionNo: b.version_no, locked: b.mode === 'locked' })), { knownAcronyms: known });
    out.push({
      chapterId: v.chapter_id as string, title: v.title as string, versionId: v.version_id as string, versionNo: Number(v.version_no), status: v.status as string,
      score: a.score, passed: a.passed, total: a.total, fixable: a.fixable, open: a.checks.filter((c) => c.status !== 'ok').map((c) => ({ code: c.code, label: GUIDANCE_OPEN_LABEL[c.code], status: c.status })),
    });
  }
  out.sort((x, y) => x.score - y.score || x.title.localeCompare(y.title));
  return { chapters: out, average: out.length ? Math.round(out.reduce((n, c) => n + c.score, 0) / out.length) : null };
}

// ---------- Kapitel-Assistent (ADR-052) ----------

type SuggestionKind = 'steps' | 'prerequisites' | 'result' | 'hints';
const PREREQ = /\b(?:Voraussetzung|voraussetz|Berechtigung|berechtigt|muss\s+(?:bereits\s+)?(?:angelegt|vorhanden|erfasst|freigegeben)|müssen\s+(?:bereits\s+)?(?:angelegt|vorhanden|erfasst)|zuvor|vorher)\b/i;
const RESULT = /\b(?:wird|werden)\s+(?:\S+\s+){0,4}(?:angezeigt|gespeichert|erstellt|angelegt|übernommen|versendet|gebucht|freigegeben|aktualisiert)\b|\berscheint\b|\bist\s+(?:\S+\s+){0,3}(?:gespeichert|angelegt|abgeschlossen)\b/i;
// Hinweise inkl. Fehlerbilder („Wenn … die Meldung … erscheint“)
const HINT = /^(?:Hinweis|Tipp|Achtung|Wichtig|Beachten Sie|Wenn|Falls)\b|\b(?:beachten Sie|achten Sie darauf|Meldung)\b/i;
const STOP = new Set(['und', 'oder', 'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'für', 'mit', 'von', 'bei', 'wie', 'im', 'in', 'zu', 'zur', 'zum', 'auf', 'an', 'ich', 'sie', 'man', 'neue', 'neuen', 'neuer']);

/** Vorschläge aus den Quellen für ein Thema: Sätze, sortiert nach Treffern, eingeteilt in Schritte, Voraussetzungen, Ergebnis, Hinweise */
export async function assistantSuggestions(ctx: Ctx, q: { topic?: string; chapterId?: string }) {
  const topic = (q.topic ?? '').trim().slice(0, 200);
  const terms = [...new Set(topic.toLowerCase().split(/[^\p{L}\d]+/u).filter((w) => w.length >= 3 && !STOP.has(w)))].slice(0, 8);
  // einfache Stammbildung: „erfassen“ findet auch „erfasst“
  const stems = terms.map((t) => (t.length >= 8 ? t.slice(0, -2) : t));
  if (q.chapterId) await assertIdsInProject(ctx, 'chapterId', [q.chapterId]);
  if (!terms.length && !q.chapterId) return { topic, terms, suggestions: { steps: [], prerequisites: [], result: [], hints: [] } };
  const base = `SELECT s.id, s.seq, s.text, s.chapter_id, d.path FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND d.removed_at IS NULL AND r.is_current = 1 AND s.excluded_reason IS NULL`;
  const matched = terms.length
    ? await ctx.db.all(`${base} AND (${terms.map(() => 'LOWER(s.text) LIKE ?').join(' OR ')}) ORDER BY s.seq LIMIT 400`, ctx.projectId, ...stems.map((t) => `%${t}%`))
    : [];
  // Kapitel mit den meisten Treffern (bzw. das gewählte Kapitel) vollständig einbeziehen: Voraussetzungen und Ergebnis
  // stehen oft in Nachbarabsätzen, die das Thema nicht selbst nennen
  const perChapter = new Map<string, number>();
  for (const r of matched) if (r.chapter_id) perChapter.set(r.chapter_id, (perChapter.get(r.chapter_id) ?? 0) + 1);
  const topChapters = [...new Set([...(q.chapterId ? [q.chapterId] : []), ...[...perChapter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id)])];
  const context = topChapters.length
    ? await ctx.db.all(`${base} AND s.chapter_id IN (${topChapters.map(() => '?').join(',')}) ORDER BY s.seq LIMIT 400`, ctx.projectId, ...topChapters)
    : [];
  const rows = [...new Map([...matched, ...context].map((r) => [r.id as string, r])).values()].sort((a, b) => Number(a.seq) - Number(b.seq));
  const inTop = new Set(topChapters);
  // Kapitel, deren Titel das Thema nennt, zählen mehr (z. B. „Vertragsbearbeitung“ für „Vertrag erfassen“)
  const titled = new Set(topChapters.length
    ? (await ctx.db.all(`SELECT id, title FROM chapters WHERE id IN (${topChapters.map(() => '?').join(',')})`, ...topChapters))
      .filter((c) => stems.some((t) => String(c.title).toLowerCase().includes(t))).map((c) => c.id as string)
    : []);
  type S = { text: string; snippetId: string; seq: number; path: string; hits: number; rank: number; order: number };
  const out: Record<SuggestionKind, S[]> = { steps: [], prerequisites: [], result: [], hints: [] };
  const seen = new Set<string>();
  let order = 0;
  for (const r of rows) {
    // Relevanz: Treffer im ganzen Schnipsel (Voraussetzungen nennen das Thema oft nicht selbst) plus Treffer im Satz
    const snippetHits = stems.filter((t) => String(r.text).toLowerCase().includes(t)).length + (inTop.has(r.chapter_id) ? 1 : 0) + (titled.has(r.chapter_id) ? 2 : 0);
    for (const seg of segmentSentences(String(r.text))) {
      const text = seg.text.replace(/^\s*(?:\d+[.)]|[-*•])\s+/, '').replace(/^#+\s*/, '').trim();
      if (text.length < 12 || text.length > 300 || seen.has(text.toLowerCase())) continue;
      const lower = text.toLowerCase();
      const hits = snippetHits + stems.filter((t) => lower.includes(t)).length;
      const kind: SuggestionKind | null = HINT.test(text) ? 'hints' : isAction(text) ? 'steps' : PREREQ.test(text) ? 'prerequisites' : RESULT.test(text) ? 'result' : null;
      if (!kind) continue;
      seen.add(lower);
      out[kind].push({ text, snippetId: r.id as string, seq: Number(r.seq), path: r.path as string, hits, rank: snippetHits, order: order++ });
    }
  }
  // Schritte: relevanteste Schnipsel zuerst, innerhalb eines Schnipsels in Quellreihenfolge (Ablauf); sonst nach Treffern
  const res = {} as Record<SuggestionKind, Omit<S, 'rank' | 'order'>[]>;
  for (const k of Object.keys(out) as SuggestionKind[]) {
    const list = out[k].filter((s) => s.hits > 0);
    list.sort(k === 'steps' ? (a, b) => b.rank - a.rank || a.order - b.order : (a, b) => b.hits - a.hits || a.seq - b.seq);
    res[k] = list.slice(0, k === 'steps' ? 30 : 12).map(({ rank: _r, order: _o, ...x }) => x);
  }
  return { topic, terms, suggestions: res };
}

interface DraftLine { text: string; snippetId?: string | null }
const cleanLines = (v: unknown, max: number, field: string): DraftLine[] => {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || v.length > max) throw badRequest(`${field}: Liste mit höchstens ${max} Einträgen.`);
  return (v as unknown[]).map((x) => {
    const o = typeof x === 'string' ? { text: x } : (x as Record<string, unknown>);
    const text = typeof o?.text === 'string' ? o.text.replace(/\s+/g, ' ').trim().slice(0, 600) : '';
    return { text, snippetId: typeof o?.snippetId === 'string' ? o.snippetId : null };
  }).filter((l) => l.text);
};
const sentence = (t: string) => (/[.!?:]$/.test(t) ? t : `${t}.`);

/**
 * Kapitel aus dem Assistenten anlegen: neues Kapitel mit Entwurf (Version 1) im Standardaufbau – Zweck, Voraussetzungen,
 * nummerierte Schritte, Ergebnis, Hinweise. Übernommene Quellsätze bleiben als Quelle am Absatz verknüpft.
 */
export async function createChapterFromAssistant(ctx: Ctx, input: Record<string, unknown>, actor: string) {
  const title = typeof input.title === 'string' ? input.title.replace(/\s+/g, ' ').trim().slice(0, 160) : '';
  if (!title) throw badRequest('title ist Pflicht.');
  const purpose = typeof input.purpose === 'string' ? input.purpose.trim().slice(0, 2000) : '';
  if (!purpose) throw badRequest('purpose (Wozu dient die Anleitung?) ist Pflicht.');
  const prerequisites = cleanLines(input.prerequisites, 20, 'prerequisites');
  const steps = cleanLines(input.steps, 40, 'steps');
  if (!steps.length) throw badRequest('steps: mindestens ein Handlungsschritt.');
  const result = typeof input.result === 'string' ? input.result.trim().slice(0, 2000) : '';
  const hints = cleanLines(input.hints, 20, 'hints');
  const sourceIds = [...new Set([...prerequisites, ...steps, ...hints].map((l) => l.snippetId).filter((x): x is string => !!x))];
  if (sourceIds.length) await assertIdsInProject(ctx, 'snippetId', sourceIds);
  if (await ctx.db.get('SELECT 1 FROM chapters WHERE project_id = ? AND LOWER(title) = LOWER(?)', ctx.projectId, title)) throw badRequest(`Ein Kapitel „${title}“ gibt es bereits.`);

  const chapterId = newId('ch');
  const versionId = newId('cv');
  await ctx.db.tx(async () => {
    const pos = Number((await ctx.db.get('SELECT MAX(position) AS m FROM chapters WHERE project_id = ?', ctx.projectId))?.m ?? 0) + 1;
    await ctx.db.run('INSERT INTO chapters (id, project_id, key, title, position) VALUES (?, ?, ?, ?, ?)', chapterId, ctx.projectId, `assistent-${chapterId}`, title, pos);
    await ctx.db.run(
      "INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at) VALUES (?, ?, 1, 'draft', ?, NULL, 'assistant-1.0', ?, ?)",
      versionId, chapterId, title, actor, now(),
    );
    let position = 0;
    const block = (section: string, kind: string, text: string, ids: string[]) => insertBlock(ctx, versionId, {
      section, position: position++, kind, text, mode: 'manually_edited', market: null, release: null, scopeStatus: 'general', roles: [], divisions: ['all'],
      sourceIds: ids, lineageId: newId('ln'), justification: ids.length ? null : 'Mit dem Kapitel-Assistenten verfasst', comment: null,
    }, actor, 'Kapitel-Assistent');
    const ids = (lines: DraftLine[]) => [...new Set(lines.map((l) => l.snippetId).filter((x): x is string => !!x))];
    await block('purpose', 'paragraph', purpose, []);
    if (prerequisites.length) await block('prerequisites', 'list', prerequisites.map((l) => `- ${sentence(l.text)}`).join('\n'), ids(prerequisites));
    await block('steps', 'list', steps.map((l, i) => `${i + 1}. ${sentence(l.text)}`).join('\n'), ids(steps));
    if (result) await block('result', 'paragraph', result, []);
    for (const h of hints) await block('hints', 'tip', sentence(h.text), ids([h]));
    await normalizePositions(ctx, versionId);
    await audit(ctx, actor, 'chapter.assistant_created', 'chapter', chapterId, { title, steps: steps.length, prerequisites: prerequisites.length, hints: hints.length, sources: sourceIds.length });
  });
  return { chapterId, versionId, guidance: await chapterGuidance(ctx, versionId) };
}
