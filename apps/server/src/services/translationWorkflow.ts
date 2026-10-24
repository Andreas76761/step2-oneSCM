// Übersetzung (ADR-101, U-01 … U-10): Übersetzungsspeicher, Glossar je Sprache, XLIFF 1.2 und Excel für Übersetzungsbüros,
// Länderreview mit MQM-Fehlerpunkten, Rückübersetzung von Sicherheitshinweisen, Releaseletter DE↔EN, Hinweis auf
// fehlende Bildvarianten. Alles lokal; KI nur über den eingerichteten Dienst (bei externen Diensten ohne personenbezogene Daten).
import ExcelJS from 'exceljs';
import { audit, privacyNames, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import { type Audience } from '../domain/releaseLetter.js';
import { RewriteParseError } from '../domain/rewrite.js';
import {
  backSimilarity, BACK_MIN, baseLanguage, buildTranslatePrompt, buildXliff, checkTranslation, countWords, LANGUAGES, MQM_CATEGORIES, MQM_PASS_PER_1000, MQM_SEVERITY_LABEL,
  MQM_WEIGHTS, mqmScore, parseTranslateResponse, parseXliff, sampleEvery, TM_FUZZY_MIN, tmNormalize, tmSimilarity, TRANSLATION_ISSUE_LABELS, XliffError, type TranslationIssue,
} from '../domain/translate.js';
import { signalLevels } from '../domain/warnings.js';
import { germanDate } from '../domain/workAreas.js';
import { LlmError } from '../llm.js';
import { badRequest, conflict, notFound, Problem, unprocessable } from '../problem.js';
import { projectNotice } from './collaboration.js';
import { readTable } from './masterDataImport.js';
import { fixedTranslations } from './terminology.js';
import { projectLanguages } from './translations.js';

const code = (l: string) => l.toUpperCase();
const xlsxType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
// CSV wie im Arbeitsordner: Semikolon, UTF-8 mit BOM (Excel)
const csv = (rows: unknown[][]) => `﻿${rows.map((r) => r.map(csvCell).join(';')).join('\n')}\n`;
async function xlsx(sheet: string, rows: unknown[][], widths: number[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheet);
  rows.forEach((r, i) => {
    const row = ws.addRow(r);
    if (!i) row.font = { bold: true };
  });
  ws.columns.forEach((c, i) => (c.width = widths[i] ?? 20));
  return Buffer.from(await wb.xlsx.writeBuffer());
}
async function assertLanguage(ctx: Ctx, language: string) {
  if (!LANGUAGES[language]) throw badRequest(`language muss eine von ${Object.keys(LANGUAGES).join(', ')} sein.`);
  if (!(await projectLanguages(ctx)).includes(language)) throw unprocessable(`${LANGUAGES[language]} ist keine Zielsprache dieses Projekts (Projekte → Sprachen).`);
}

// ---------------------------------------------------------------- Übersetzungsspeicher (U-01)

const TM_STATUS_DE: Record<string, string> = { approved: 'freigegeben', review: 'zu prüfen' };
const tmDto = (r: Row) => ({
  id: r.id, sourceLanguage: r.source_lang, targetLanguage: r.target_lang, sourceText: r.source_text, targetText: r.target_text, origin: r.origin,
  originRef: r.origin_ref ?? null, originVersion: r.origin_version ?? null, status: r.status, uses: Number(r.uses), updatedBy: r.updated_by, updatedAt: r.updated_at, lastUsedAt: r.last_used_at ?? null,
});

export interface TmMatch { id: string; sourceText: string; targetText: string; score: number; status: string; origin: string; originRef: string | null }

/** Treffer im Speicher: 100 % über den normalisierten Text, sonst ähnliche Segmente ab 75 % (beste zuerst) */
export async function tmLookup(ctx: Ctx, sourceLang: string, targetLang: string, text: string, limit = 3): Promise<TmMatch[]> {
  const norm = tmNormalize(text);
  if (!norm) return [];
  const exact = await ctx.db.get('SELECT * FROM translation_memory WHERE project_id = ? AND source_lang = ? AND target_lang = ? AND source_norm = ?', ctx.projectId, sourceLang, targetLang, norm);
  const out: TmMatch[] = exact ? [{ id: exact.id, sourceText: exact.source_text, targetText: exact.target_text, score: 1, status: exact.status, origin: exact.origin, originRef: exact.origin_ref ?? null }] : [];
  // Kandidaten mit ähnlicher Länge; bei großen Speichern begrenzt
  const rows = await ctx.db.all(
    'SELECT * FROM translation_memory WHERE project_id = ? AND source_lang = ? AND target_lang = ? AND source_norm <> ? AND LENGTH(source_norm) BETWEEN ? AND ? ORDER BY updated_at DESC LIMIT 5000',
    ctx.projectId, sourceLang, targetLang, norm, Math.floor(norm.length * 0.6), Math.ceil(norm.length * 1.6),
  );
  for (const r of rows) {
    const score = Math.round(tmSimilarity(text, r.source_text) * 100) / 100;
    if (score >= TM_FUZZY_MIN) out.push({ id: r.id, sourceText: r.source_text, targetText: r.target_text, score, status: r.status, origin: r.origin, originRef: r.origin_ref ?? null });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function tmTouch(ctx: Ctx, id: string) {
  await ctx.db.run('UPDATE translation_memory SET uses = uses + 1, last_used_at = ? WHERE id = ?', now(), id);
}

/** Segmente aufnehmen bzw. aktualisieren (Freigabe einer Übersetzung, eines Releaseletters, Import) */
export async function tmRecord(ctx: Ctx, input: { sourceLang: string; targetLang: string; origin: string; status?: string; pairs: { source: string; target: string; ref?: string | null; version?: string | null }[] }, actor: string) {
  let added = 0;
  let updated = 0;
  for (const p of input.pairs) {
    const source = p.source.trim();
    const target = p.target.trim();
    const norm = tmNormalize(source);
    if (!norm || !target) continue;
    const have = await ctx.db.get('SELECT id, target_text, status FROM translation_memory WHERE project_id = ? AND source_lang = ? AND target_lang = ? AND source_norm = ?', ctx.projectId, input.sourceLang, input.targetLang, norm);
    const status = input.status ?? 'approved';
    if (!have) {
      await ctx.db.run(
        `INSERT INTO translation_memory (id, project_id, source_lang, target_lang, source_text, source_norm, target_text, origin, origin_ref, origin_version, status, created_by, created_at, updated_by, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newId('tm'), ctx.projectId, input.sourceLang, input.targetLang, source, norm, target, input.origin, p.ref ?? null, p.version ?? null, status, actor, now(), actor, now(),
      );
      added++;
    } else if (have.target_text !== target || (have.status !== status && status === 'approved')) {
      // ein freigegebenes Segment wird nicht durch einen ungeprüften Import ersetzt
      if (have.status === 'approved' && status !== 'approved') continue;
      await ctx.db.run('UPDATE translation_memory SET target_text = ?, origin = ?, origin_ref = ?, origin_version = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?',
        target, input.origin, p.ref ?? null, p.version ?? null, status, actor, now(), have.id);
      updated++;
    }
  }
  return { added, updated };
}

export async function listTm(ctx: Ctx, opts: { language?: string; q?: string; status?: string; limit?: number; offset?: number }) {
  const where = ['project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (opts.language) (where.push('target_lang = ?'), params.push(opts.language));
  if (opts.status) (where.push('status = ?'), params.push(opts.status));
  if (opts.q?.trim()) (where.push('(LOWER(source_text) LIKE ? OR LOWER(target_text) LIKE ?)'), params.push(`%${opts.q.trim().toLowerCase()}%`, `%${opts.q.trim().toLowerCase()}%`));
  const limit = Math.min(500, Math.max(1, opts.limit ?? 100));
  const total = Number((await ctx.db.get(`SELECT COUNT(*) AS n FROM translation_memory WHERE ${where.join(' AND ')}`, ...params))?.n ?? 0);
  const rows = await ctx.db.all(`SELECT * FROM translation_memory WHERE ${where.join(' AND ')} ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${Math.max(0, opts.offset ?? 0)}`, ...params);
  const counts = await ctx.db.all('SELECT target_lang, status, COUNT(*) AS n FROM translation_memory WHERE project_id = ? GROUP BY target_lang, status', ctx.projectId);
  return { total, items: rows.map(tmDto), counts: counts.map((c) => ({ language: c.target_lang, status: c.status, count: Number(c.n) })) };
}

async function tmRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM translation_memory WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Speichereintrag ${id}`);
  return r;
}

export async function updateTm(ctx: Ctx, id: string, input: { targetText?: unknown; status?: unknown }, user: User) {
  const r = await tmRow(ctx, id);
  const target = input.targetText === undefined ? r.target_text : String(input.targetText).trim();
  if (!target) throw badRequest('targetText darf nicht leer sein.');
  const status = input.status === undefined ? r.status : String(input.status);
  if (!['approved', 'review'].includes(status)) throw badRequest('status muss approved oder review sein.');
  await ctx.db.run('UPDATE translation_memory SET target_text = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?', target, status, user.id, now(), id);
  await audit(ctx, user.id, 'translation_memory.updated', 'translation_memory', id, { status });
  return tmDto((await tmRow(ctx, id))!);
}

export async function deleteTm(ctx: Ctx, id: string, user: User) {
  await tmRow(ctx, id);
  await ctx.db.run('DELETE FROM translation_memory WHERE id = ?', id);
  await audit(ctx, user.id, 'translation_memory.deleted', 'translation_memory', id, {});
}

/** Export wie `SPEICHER.csv` im Arbeitsordner: Nr;Deutsch;<Sprache>;Datei;Ausgangsversion;Datum;Status */
export async function exportTm(ctx: Ctx, language: string, format: string) {
  if (!LANGUAGES[language]) throw badRequest(`language muss eine von ${Object.keys(LANGUAGES).join(', ')} sein.`);
  const rows = await ctx.db.all("SELECT * FROM translation_memory WHERE project_id = ? AND source_lang = 'de' AND target_lang = ? ORDER BY created_at", ctx.projectId, language);
  const table: unknown[][] = [['Nr', 'Deutsch', code(language), 'Datei', 'Ausgangsversion', 'Datum', 'Status'],
    ...rows.map((r, i) => [i + 1, r.source_text, r.target_text, r.origin_ref ?? '', r.origin_version ?? '', germanDate(String(r.updated_at).slice(0, 10)), TM_STATUS_DE[r.status] ?? r.status])];
  const base = `speicher_${language}`;
  if (format === 'xlsx') return { data: await xlsx('Übersetzungsspeicher', table, [6, 60, 60, 30, 14, 12, 12]), fileName: `${base}.xlsx`, contentType: xlsxType };
  if (format !== 'csv') throw badRequest('format muss csv oder xlsx sein.');
  return { data: Buffer.from(csv(table), 'utf8'), fileName: `${base}.csv`, contentType: 'text/csv; charset=utf-8' };
}

const header = (row: string[]) => row.map((h) => h.trim().toLowerCase().replace(/^﻿/, ''));
const col = (h: string[], ...names: string[]) => h.findIndex((x) => names.includes(x));

/** Import aus CSV oder Excel (z. B. `SPEICHER.csv` des Arbeitsordners); Status „freigegeben“ übernimmt freigegeben, sonst „zu prüfen“ */
export async function importTm(ctx: Ctx, language: string, fileName: string, data: Buffer, apply: boolean, user: User) {
  await assertLanguage(ctx, language);
  const rows = await readTable(fileName, data);
  if (rows.length < 2) throw badRequest('Die Datei enthält keine Zeilen.');
  const h = header(rows[0]);
  const de = col(h, 'deutsch', 'de', 'source', 'quelle');
  const tgt = col(h, language, baseLanguage(language), 'übersetzung', 'target', 'ziel');
  if (de < 0 || tgt < 0) throw badRequest(`Spalten „Deutsch“ und „${code(language)}“ (bzw. „Übersetzung“) fehlen.`);
  const file = col(h, 'datei', 'file');
  const ver = col(h, 'ausgangsversion', 'version');
  const st = col(h, 'status');
  const pairs = rows.slice(1).map((r) => ({ source: r[de] ?? '', target: r[tgt] ?? '', ref: file >= 0 ? r[file] || null : fileName, version: ver >= 0 ? r[ver] || null : null, approved: st >= 0 && /^(freigegeben|approved|bestätigt)$/i.test((r[st] ?? '').trim()) }))
    .filter((p) => p.source.trim() && p.target.trim());
  const preview = { rows: rows.length - 1, usable: pairs.length, approved: pairs.filter((p) => p.approved).length };
  if (!apply) return { ...preview, applied: false };
  let added = 0;
  let updated = 0;
  await ctx.db.tx(async () => {
    for (const status of ['approved', 'review']) {
      const r = await tmRecord(ctx, { sourceLang: 'de', targetLang: language, origin: 'import', status, pairs: pairs.filter((p) => p.approved === (status === 'approved')) }, user.id);
      added += r.added;
      updated += r.updated;
    }
    await audit(ctx, user.id, 'translation_memory.imported', 'project', ctx.projectId, { language, fileName, added, updated });
  });
  return { ...preview, applied: true, added, updated };
}

/** Vorschläge für einen Absatz einer Übersetzung */
export async function blockMemory(ctx: Ctx, blockId: string) {
  const b = await ctx.db.get('SELECT tb.*, t.language, t.project_id FROM translation_blocks tb JOIN translations t ON t.id = tb.translation_id WHERE tb.id = ?', blockId);
  if (!b || b.project_id !== ctx.projectId) throw notFound(`Übersetzungsabsatz ${blockId}`);
  return { blockId, matches: await tmLookup(ctx, 'de', b.language, b.source_text, 5) };
}

// ---------------------------------------------------------------- Glossar je Sprache (U-04)

export async function glossary(ctx: Ctx, language: string) {
  if (!LANGUAGES[language]) throw badRequest(`language muss eine von ${Object.keys(LANGUAGES).join(', ')} sein.`);
  const rows = await ctx.db.all("SELECT id, preferred, avoid, definition, translations, keep_untranslated, status FROM terminology_terms WHERE project_id = ? AND status = 'active' ORDER BY preferred", ctx.projectId);
  return rows.map((r) => {
    const tr = parseJson<Record<string, { term?: string; definition?: string | null }>>(r.translations, {});
    const own = tr[language]?.term?.trim() || null;
    const inherited = !own && language !== baseLanguage(language) ? tr[baseLanguage(language)]?.term?.trim() || null : null;
    const keep = !!Number(r.keep_untranslated);
    return {
      termId: r.id, term: r.preferred, avoid: parseJson<string[]>(r.avoid, []), definition: r.definition ?? null, keepUntranslated: keep,
      translation: keep ? r.preferred : own ?? inherited, inherited: !!inherited, status: keep || own || inherited ? 'bestätigt' : 'offen',
    };
  });
}

/** Export wie `GLOSSAR.csv` im Arbeitsordner: Deutsch;<Sprache>;Kontext;Status;Quelle */
export async function exportGlossary(ctx: Ctx, language: string, format: string) {
  const g = await glossary(ctx, language);
  const table: unknown[][] = [['Deutsch', code(language), 'Kontext', 'Status', 'Quelle'],
    ...g.map((x) => [x.term, x.translation ?? '', [x.definition, x.keepUntranslated ? 'nicht übersetzen' : null, x.avoid.length ? `nicht: ${x.avoid.join(', ')}` : null].filter(Boolean).join(' · '), x.status, 'App-Terminologie'])];
  const base = `glossar_${language}`;
  if (format === 'xlsx') return { data: await xlsx('Glossar', table, [30, 30, 60, 12, 18]), fileName: `${base}.xlsx`, contentType: xlsxType };
  if (format !== 'csv') throw badRequest('format muss csv oder xlsx sein.');
  return { data: Buffer.from(csv(table), 'utf8'), fileName: `${base}.csv`, contentType: 'text/csv; charset=utf-8' };
}

/** Übersetzer liefern das Glossar zurück: feste Übersetzung je Begriff; unbekannte deutsche Begriffe werden gemeldet, nicht angelegt */
export async function importGlossary(ctx: Ctx, language: string, fileName: string, data: Buffer, apply: boolean, user: User) {
  await assertLanguage(ctx, language);
  const rows = await readTable(fileName, data);
  if (rows.length < 2) throw badRequest('Die Datei enthält keine Zeilen.');
  const h = header(rows[0]);
  const de = col(h, 'deutsch', 'de', 'begriff');
  const tgt = col(h, language, baseLanguage(language), 'übersetzung', 'target');
  if (de < 0 || tgt < 0) throw badRequest(`Spalten „Deutsch“ und „${code(language)}“ fehlen.`);
  const terms = await ctx.db.all("SELECT id, preferred, translations, keep_untranslated FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId);
  const byTerm = new Map(terms.map((t) => [String(t.preferred).toLowerCase(), t]));
  const changes: { termId: string; term: string; before: string | null; after: string }[] = [];
  const unknown: string[] = [];
  for (const r of rows.slice(1)) {
    const term = (r[de] ?? '').trim();
    const value = (r[tgt] ?? '').trim();
    if (!term || !value) continue;
    const t = byTerm.get(term.toLowerCase());
    if (!t) {
      unknown.push(term);
      continue;
    }
    if (Number(t.keep_untranslated)) continue;
    const before = parseJson<Record<string, { term?: string }>>(t.translations, {})[language]?.term?.trim() || null;
    if (before !== value) changes.push({ termId: t.id, term: t.preferred, before, after: value });
  }
  if (apply && changes.length) {
    await ctx.db.tx(async () => {
      for (const c of changes) {
        const t = terms.find((x) => x.id === c.termId)!;
        const tr = parseJson<Record<string, { term?: string; definition?: string | null }>>(t.translations, {});
        tr[language] = { ...(tr[language] ?? {}), term: c.after, definition: tr[language]?.definition ?? null };
        await ctx.db.run('UPDATE terminology_terms SET translations = ?, updated_by = ?, updated_at = ? WHERE id = ?', json(tr), user.id, now(), c.termId);
      }
      await audit(ctx, user.id, 'glossary.imported', 'project', ctx.projectId, { language, fileName, changed: changes.length, unknown: unknown.length });
    });
  }
  return { rows: rows.length - 1, changes, unknown, applied: apply };
}

// ---------------------------------------------------------------- XLIFF 1.2 und Excel je Übersetzung (U-05)

async function translationRow(ctx: Ctx, id: string) {
  const t = await ctx.db.get('SELECT t.*, c.title AS chapter_title, v.version_no FROM translations t JOIN chapters c ON c.id = t.chapter_id JOIN generated_chapter_versions v ON v.id = t.chapter_version_id WHERE t.id = ? AND t.project_id = ?', id, ctx.projectId);
  if (!t) throw notFound(`Übersetzung ${id}`);
  return t;
}
async function units(ctx: Ctx, id: string) {
  return ctx.db.all('SELECT tb.*, b.section_code, b.kind FROM translation_blocks tb JOIN content_blocks b ON b.id = tb.block_id WHERE tb.translation_id = ? ORDER BY b.position', id);
}
const fileBase = (t: Row) => `uebersetzung_${t.language}_${String(t.chapter_title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}_v${t.version_no}`;

/** Für das Übersetzungsbüro: XLIFF 1.2 (jedes CAT-Werkzeug) oder Excel; ID je Absatz für den Rückimport */
export async function exportTranslationFile(ctx: Ctx, id: string, format: string) {
  const t = await translationRow(ctx, id);
  const rows = await units(ctx, id);
  const note = (r: Row) => [`Abschnitt: ${r.section_code}`, `Art: ${r.kind}`, ...parseJson<TranslationIssue[]>(r.issues, []).filter((i) => i !== 'empty').map((i) => TRANSLATION_ISSUE_LABELS[i])].join(' · ');
  if (format === 'xlf' || format === 'xliff') {
    const xml = buildXliff({ original: `${t.chapter_title} (Version ${t.version_no})`, sourceLanguage: 'de', targetLanguage: t.language, units: rows.map((r) => ({ id: r.id, source: r.source_text, target: r.text ?? null, note: note(r), state: r.mode === 'edited' ? 'translated' : r.mode === 'memory' ? 'final' : 'needs-review-translation' })) });
    return { data: Buffer.from(xml, 'utf8'), fileName: `${fileBase(t)}.xlf`, contentType: 'application/x-xliff+xml; charset=utf-8' };
  }
  if (format !== 'xlsx') throw badRequest('format muss xlf oder xlsx sein.');
  const table: unknown[][] = [['ID', 'Abschnitt', 'Deutsch', code(t.language), 'Status', 'Hinweis'], ...rows.map((r) => [r.id, r.section_code, r.source_text, r.text ?? '', r.text ? r.mode : 'offen', note(r)])];
  return { data: await xlsx('Übersetzung', table, [30, 16, 60, 60, 12, 40]), fileName: `${fileBase(t)}.xlsx`, contentType: xlsxType };
}

/**
 * Rückimport vom Büro: nur Absätze dieser Übersetzung (ID), nur wenn der deutsche Text unverändert ist; jede Übersetzung
 * wird geprüft. Ohne apply nur Vorschau.
 */
export async function importTranslationFile(ctx: Ctx, id: string, fileName: string, data: Buffer, apply: boolean, user: User) {
  const t = await translationRow(ctx, id);
  if (t.status !== 'draft') throw conflict('Die Übersetzung ist freigegeben und unveränderlich.');
  let parsed: { id: string; source: string; target: string | null }[];
  if (/\.(xlf|xliff|xml)$/i.test(fileName)) {
    try {
      const x = parseXliff(data.toString('utf8'));
      const lang = x.targetLanguage?.replace('_', '-');
      if (lang && lang !== t.language) throw badRequest(`Die Datei ist für ${lang}, die Übersetzung für ${t.language}.`);
      parsed = x.units;
    } catch (e) {
      if (e instanceof XliffError) throw badRequest(e.message);
      throw e;
    }
  } else {
    const rows = await readTable(fileName, data);
    const h = header(rows[0] ?? []);
    const idc = col(h, 'id');
    const de = col(h, 'deutsch', 'source');
    const tgt = col(h, t.language, baseLanguage(t.language), 'übersetzung', 'target');
    if (idc < 0 || de < 0 || tgt < 0) throw badRequest(`Spalten „ID“, „Deutsch“ und „${code(t.language)}“ fehlen.`);
    parsed = rows.slice(1).map((r) => ({ id: (r[idc] ?? '').trim(), source: r[de] ?? '', target: (r[tgt] ?? '').trim() || null }));
  }
  const blocks = new Map((await units(ctx, id)).map((b) => [b.id as string, b]));
  const terms = await fixedTranslations(ctx);
  const results: { id: string; result: 'updated' | 'unchanged' | 'empty' | 'unknown' | 'source_changed'; issues: TranslationIssue[] }[] = [];
  for (const u of parsed) {
    const b = blocks.get(u.id);
    if (!b) { results.push({ id: u.id, result: 'unknown', issues: [] }); continue; }
    if (tmNormalize(u.source) !== tmNormalize(b.source_text)) { results.push({ id: u.id, result: 'source_changed', issues: [] }); continue; }
    if (!u.target?.trim()) { results.push({ id: u.id, result: 'empty', issues: [] }); continue; }
    const text = u.target.trim();
    if (text === b.text) { results.push({ id: u.id, result: 'unchanged', issues: parseJson(b.issues, []) }); continue; }
    results.push({ id: u.id, result: 'updated', issues: checkTranslation(b.source_text, text, null, { language: t.language, terms }) });
  }
  const updated = results.filter((r) => r.result === 'updated');
  if (apply && updated.length) {
    await ctx.db.tx(async () => {
      for (const r of updated) {
        const u = parsed.find((x) => x.id === r.id)!;
        await ctx.db.run("UPDATE translation_blocks SET text = ?, sentences = NULL, issues = ?, mode = 'imported', tm_id = NULL, tm_score = NULL, updated_by = ?, updated_at = ? WHERE id = ?", u.target!.trim(), json(r.issues), user.id, now(), r.id);
      }
      await reopenReviews(ctx, id, user.id);
      await audit(ctx, user.id, 'translation.imported', 'translation', id, { fileName, updated: updated.length });
    });
  }
  const count = (k: string) => results.filter((r) => r.result === k).length;
  return { units: parsed.length, updated: updated.length, unchanged: count('unchanged'), empty: count('empty'), unknown: count('unknown'), sourceChanged: count('source_changed'), withIssues: updated.filter((r) => r.issues.length).length, results, applied: apply };
}

// ---------------------------------------------------------------- Länderreview mit MQM (U-03)

async function targetWords(ctx: Ctx, translationId: string) {
  return (await ctx.db.all('SELECT text FROM translation_blocks WHERE translation_id = ? AND text IS NOT NULL', translationId)).reduce((s, b) => s + countWords(b.text), 0);
}
async function reviewDto(ctx: Ctx, r: Row) {
  const errors = parseJson<any[]>(r.errors, []);
  const words = r.status === 'open' ? await targetWords(ctx, r.translation_id) : Number(r.words);
  const reviewer = await ctx.db.get('SELECT name FROM users WHERE id = ?', r.reviewer);
  const deputy = r.deputy ? await ctx.db.get('SELECT name FROM users WHERE id = ?', r.deputy) : null;
  return {
    id: r.id, translationId: r.translation_id, reviewer: r.reviewer, reviewerName: reviewer?.name ?? r.reviewer, market: r.market ?? null, status: r.status,
    deputy: r.deputy ?? null, deputyName: r.deputy ? deputy?.name ?? r.deputy : null, assignedBy: r.assigned_by ?? 'manual',
    errors: errors.map((e) => ({ ...e, categoryLabel: MQM_CATEGORIES[e.category] ?? e.category, severityLabel: MQM_SEVERITY_LABEL[e.severity] ?? e.severity, points: MQM_WEIGHTS[e.severity] ?? 0 })),
    score: mqmScore(errors, words), threshold: MQM_PASS_PER_1000, comment: r.comment ?? null,
    requestedBy: r.requested_by, requestedAt: r.requested_at, decidedBy: r.decided_by ?? null, decidedAt: r.decided_at ?? null,
  };
}
export async function listReviews(ctx: Ctx, translationId: string) {
  await translationRow(ctx, translationId);
  const rows = await ctx.db.all('SELECT * FROM translation_reviews WHERE translation_id = ? ORDER BY requested_at DESC', translationId);
  return Promise.all(rows.map((r) => reviewDto(ctx, r)));
}
export async function latestReview(ctx: Ctx, translationId: string) {
  const r = await ctx.db.get("SELECT * FROM translation_reviews WHERE translation_id = ? AND status <> 'dropped' ORDER BY requested_at DESC LIMIT 1", translationId);
  return r ? reviewDto(ctx, r) : null;
}
async function reviewRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM translation_reviews WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Länderreview ${id}`);
  return r;
}
const isAdmin = (u: User) => u.permissions.includes('admin');
function assertReviewer(r: Row, user: User) {
  // Vertretung der Ansprechperson des Marktes (ADR-108, O-09) darf ebenso prüfen
  if (r.reviewer !== user.id && r.deputy !== user.id && !isAdmin(user)) throw new Problem(403, 'Forbidden', 'Nur die zugewiesene Prüferin bzw. der zugewiesene Prüfer (oder Administration) bearbeitet das Länderreview.');
}

/** Länderreview anfordern: Prüferin bzw. Prüfer und Markt; ohne Prüfer die Ansprechperson des Marktes (O-09); eine Runde je Übersetzung zur Zeit */
export async function requestReview(ctx: Ctx, translationId: string, input: { reviewer?: unknown; market?: unknown }, user: User) {
  const t = await translationRow(ctx, translationId);
  if (t.status !== 'draft') throw conflict('Die Übersetzung ist bereits freigegeben.');
  const market = input.market ? String(input.market).trim().toUpperCase() : null;
  if (market && !/^[A-Z]{2}$/.test(market)) throw badRequest('market ist ein Ländercode mit zwei Buchstaben (z. B. CH).');
  const contact = market ? await marketReviewerFor(ctx, market, t.language) : null;
  let reviewer = String(input.reviewer ?? '').trim();
  let deputy: string | null = null;
  let assignedBy = 'manual';
  if (!reviewer) {
    if (!market) throw badRequest('reviewer oder market angeben.');
    if (!contact) throw badRequest(`Für den Markt ${market} ist keine Ansprechperson hinterlegt – bitte unter „Ansprechpersonen je Markt“ eintragen oder eine Prüferin bzw. einen Prüfer wählen.`);
    // Ansprechperson, bei deaktiviertem Konto die Vertretung
    const active = async (id: string | null) => !!id && !!(await ctx.db.get('SELECT 1 FROM users WHERE id = ? AND disabled_at IS NULL', id));
    if (await active(contact.user_id)) (reviewer = contact.user_id, deputy = (await active(contact.deputy_user_id)) ? contact.deputy_user_id : null);
    else if (await active(contact.deputy_user_id)) reviewer = contact.deputy_user_id;
    else throw badRequest(`Ansprechperson und Vertretung für den Markt ${market} sind nicht aktiv.`);
    assignedBy = 'market';
  } else if (contact && contact.user_id === reviewer) deputy = contact.deputy_user_id ?? null;
  const u = await ctx.db.get('SELECT id, disabled_at FROM users WHERE id = ?', reviewer);
  if (!u || u.disabled_at) throw badRequest('reviewer muss ein aktiver Benutzer sein.');
  if (await ctx.db.get("SELECT 1 FROM translation_reviews WHERE translation_id = ? AND status = 'open'", translationId)) throw conflict('Es läuft bereits ein Länderreview.');
  const id = newId('rev');
  await ctx.db.tx(async () => {
    await ctx.db.run("INSERT INTO translation_reviews (id, project_id, translation_id, reviewer, market, status, requested_by, requested_at, deputy, assigned_by) VALUES (?, ?, ?, ?, ?, 'open', ?, ?, ?, ?)",
      id, ctx.projectId, translationId, reviewer, market, user.id, now(), deputy, assignedBy);
    await audit(ctx, user.id, 'translation_review.requested', 'translation', translationId, { reviewer, deputy, market, assignedBy });
    // Benachrichtigung an Prüferin bzw. Prüfer und Vertretung (ADR-109): Posteingang, Webhook/E-Mail je Einstellung
    const where = `„${t.chapter_title}“ (${LANGUAGES[t.language] ?? t.language}${market ? `, Markt ${market}` : ''})`;
    const link = reviewLink(translationId, t.chapter_id);
    if (reviewer !== user.id) await projectNotice(ctx, reviewer, `Länderreview für ${where} ist Ihnen zugewiesen${assignedBy === 'market' ? ' – als Ansprechperson des Marktes' : ''}.`, 'review_assigned', link);
    if (deputy && deputy !== user.id) await projectNotice(ctx, deputy, `Länderreview für ${where}: Sie sind als Vertretung eingetragen.`, 'review_assigned', link);
  });
  return reviewDto(ctx, await reviewRow(ctx, id));
}

/** Sprung aus der Benachrichtigung direkt zur Übersetzung (ADR-109) */
const reviewLink = (translationId: string, chapterId: string) => `/uebersetzungen?kapitel=${encodeURIComponent(chapterId)}&uebersetzung=${encodeURIComponent(translationId)}`;

// ---------------------------------------------------------------- Ansprechperson je Markt (ADR-108, O-09)

/** Eintrag für Markt und Sprache, sonst für den Markt (alle Sprachen) */
async function marketReviewerFor(ctx: Ctx, market: string, language: string) {
  return (await ctx.db.get('SELECT * FROM market_reviewers WHERE project_id = ? AND market = ? AND language = ?', ctx.projectId, market, language.toLowerCase()))
    ?? ctx.db.get("SELECT * FROM market_reviewers WHERE project_id = ? AND market = ? AND language = ''", ctx.projectId, market);
}

export async function listMarketReviewers(ctx: Ctx) {
  const names = new Map((await ctx.db.all('SELECT id, name, disabled_at FROM users')).map((u) => [u.id as string, { name: u.name as string, active: !u.disabled_at }]));
  return (await ctx.db.all('SELECT * FROM market_reviewers WHERE project_id = ? ORDER BY market, language', ctx.projectId)).map((r) => ({
    market: r.market as string, language: (r.language as string) || null, userId: r.user_id as string, userName: names.get(r.user_id)?.name ?? r.user_id, userActive: names.get(r.user_id)?.active ?? false,
    deputyUserId: r.deputy_user_id ?? null, deputyName: r.deputy_user_id ? names.get(r.deputy_user_id)?.name ?? r.deputy_user_id : null, note: r.note ?? null, updatedBy: r.updated_by, updatedAt: r.updated_at,
  }));
}

export async function setMarketReviewer(ctx: Ctx, input: { market?: unknown; language?: unknown; userId?: unknown; deputyUserId?: unknown; note?: unknown }, user: User) {
  const market = String(input.market ?? '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(market)) throw badRequest('market ist ein Ländercode mit zwei Buchstaben (z. B. CH).');
  const language = typeof input.language === 'string' ? input.language.trim().toLowerCase() : '';
  if (language && !LANGUAGES[language]) throw badRequest(`language muss eine der Sprachen sein (${Object.keys(LANGUAGES).join(', ')}) oder leer.`);
  const userId = String(input.userId ?? '').trim();
  const deputy = typeof input.deputyUserId === 'string' && input.deputyUserId.trim() ? input.deputyUserId.trim() : null;
  for (const id of [userId, deputy].filter(Boolean) as string[]) {
    const u = await ctx.db.get('SELECT disabled_at FROM users WHERE id = ?', id);
    if (!u || u.disabled_at) throw badRequest(`Benutzer ${id} ist nicht aktiv.`);
  }
  if (deputy === userId) throw badRequest('Die Vertretung muss eine andere Person sein.');
  const note = typeof input.note === 'string' ? input.note.trim().slice(0, 300) || null : null;
  await ctx.db.run(
    `INSERT INTO market_reviewers (project_id, market, language, user_id, deputy_user_id, note, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (project_id, market, language) DO UPDATE SET user_id = excluded.user_id, deputy_user_id = excluded.deputy_user_id, note = excluded.note, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    ctx.projectId, market, language, userId, deputy, note, user.id, now(),
  );
  await audit(ctx, user.id, 'market_reviewer.set', 'market', market, { language, userId, deputy });
  return listMarketReviewers(ctx);
}

export async function deleteMarketReviewer(ctx: Ctx, market: string, language: string, user: User) {
  const n = (await ctx.db.run('DELETE FROM market_reviewers WHERE project_id = ? AND market = ? AND language = ?', ctx.projectId, market.toUpperCase(), language.toLowerCase())).changes;
  if (!n) throw notFound(`Ansprechperson für ${market}${language ? ` (${language})` : ''}`);
  await audit(ctx, user.id, 'market_reviewer.deleted', 'market', market.toUpperCase(), { language });
}

/** Offene Länderreviews, bei denen ich Prüferin bzw. Prüfer oder Vertretung bin */
export async function myReviews(ctx: Ctx, user: User) {
  const rows = await ctx.db.all(
    `SELECT r.*, t.language, t.chapter_id, c.title FROM translation_reviews r JOIN translations t ON t.id = r.translation_id JOIN chapters c ON c.id = t.chapter_id
     WHERE r.project_id = ? AND r.status = 'open' AND (r.reviewer = ? OR r.deputy = ?) ORDER BY r.requested_at`, ctx.projectId, user.id, user.id,
  );
  return Promise.all(rows.map(async (r) => ({ ...(await reviewDto(ctx, r)), language: r.language as string, chapterId: r.chapter_id as string, chapterTitle: r.title as string, asDeputy: r.reviewer !== user.id })));
}

export async function addReviewError(ctx: Ctx, reviewId: string, input: { blockId?: unknown; category?: unknown; severity?: unknown; note?: unknown }, user: User) {
  const r = await reviewRow(ctx, reviewId);
  assertReviewer(r, user);
  if (r.status !== 'open') throw conflict('Das Länderreview ist abgeschlossen.');
  const category = String(input.category ?? '');
  const severity = String(input.severity ?? '');
  if (!MQM_CATEGORIES[category]) throw badRequest(`category muss eine von ${Object.keys(MQM_CATEGORIES).join(', ')} sein.`);
  if (!MQM_WEIGHTS[severity]) throw badRequest(`severity muss eine von ${Object.keys(MQM_WEIGHTS).join(', ')} sein.`);
  const blockId = input.blockId ? String(input.blockId) : null;
  if (blockId && !(await ctx.db.get('SELECT 1 FROM translation_blocks WHERE id = ? AND translation_id = ?', blockId, r.translation_id))) throw badRequest('blockId gehört nicht zu dieser Übersetzung.');
  const note = String(input.note ?? '').trim().slice(0, 1000);
  if (!note) throw badRequest('note (Beschreibung des Fehlers) ist Pflicht.');
  const errors = [...parseJson<any[]>(r.errors, []), { id: newId('mqm'), blockId, category, severity, note, by: user.id, at: now() }];
  await ctx.db.run('UPDATE translation_reviews SET errors = ? WHERE id = ?', json(errors), reviewId);
  await audit(ctx, user.id, 'translation_review.error_added', 'translation', r.translation_id, { category, severity });
  return reviewDto(ctx, await reviewRow(ctx, reviewId));
}

export async function removeReviewError(ctx: Ctx, reviewId: string, errorId: string, user: User) {
  const r = await reviewRow(ctx, reviewId);
  assertReviewer(r, user);
  if (r.status !== 'open') throw conflict('Das Länderreview ist abgeschlossen.');
  const errors = parseJson<any[]>(r.errors, []);
  if (!errors.some((e) => e.id === errorId)) throw notFound(`Fehler ${errorId}`);
  await ctx.db.run('UPDATE translation_reviews SET errors = ? WHERE id = ?', json(errors.filter((e) => e.id !== errorId)), reviewId);
  return reviewDto(ctx, await reviewRow(ctx, reviewId));
}

/** „zurück an Übersetzung“ oder Freigabe durch das Land (bis 5 MQM-Punkte je 1 000 Wörter) */
export async function decideReview(ctx: Ctx, reviewId: string, input: { decision?: unknown; comment?: unknown }, user: User) {
  const r = await reviewRow(ctx, reviewId);
  assertReviewer(r, user);
  if (r.status !== 'open') throw conflict('Das Länderreview ist abgeschlossen.');
  const decision = String(input.decision ?? '');
  if (!['approve', 'return'].includes(decision)) throw badRequest('decision muss approve oder return sein.');
  const comment = String(input.comment ?? '').trim().slice(0, 2000) || null;
  const words = await targetWords(ctx, r.translation_id);
  const score = mqmScore(parseJson<any[]>(r.errors, []), words);
  if (decision === 'approve' && !score.pass) throw conflict(`Freigabe durch das Land nicht möglich: ${score.per1000} MQM-Punkte je 1 000 Wörter (höchstens ${MQM_PASS_PER_1000}).`, { score });
  if (decision === 'return' && !comment && !parseJson<any[]>(r.errors, []).length) throw badRequest('Für „zurück an Übersetzung“ bitte Fehler erfassen oder einen Kommentar angeben.');
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE translation_reviews SET status = ?, words = ?, comment = ?, decided_by = ?, decided_at = ? WHERE id = ?', decision === 'approve' ? 'approved' : 'returned', words, comment, user.id, now(), reviewId);
    await audit(ctx, user.id, `translation_review.${decision === 'approve' ? 'approved' : 'returned'}`, 'translation', r.translation_id, { per1000: score.per1000, errors: parseJson<any[]>(r.errors, []).length });
    // Ergebnis an die anfordernde Person (ADR-109)
    if (r.requested_by && r.requested_by !== user.id) {
      const t = await translationRow(ctx, r.translation_id);
      await projectNotice(ctx, r.requested_by, `Länderreview für „${t.chapter_title}“ (${LANGUAGES[t.language] ?? t.language}${r.market ? `, Markt ${r.market}` : ''}): ${decision === 'approve' ? 'vom Land freigegeben' : 'zurück an Übersetzung'}.`, 'review_decided', reviewLink(r.translation_id, t.chapter_id));
    }
  });
  return reviewDto(ctx, await reviewRow(ctx, reviewId));
}

/** Nach einer Änderung an einer vom Land freigegebenen Übersetzung muss das Land erneut prüfen */
export async function reopenReviews(ctx: Ctx, translationId: string, actor: string) {
  const r = await ctx.db.get("SELECT id FROM translation_reviews WHERE translation_id = ? AND status = 'approved' ORDER BY requested_at DESC LIMIT 1", translationId);
  if (!r) return;
  await ctx.db.run("UPDATE translation_reviews SET status = 'open', comment = COALESCE(comment || ' · ', '') || 'nach Änderung erneut prüfen', decided_by = NULL, decided_at = NULL WHERE id = ?", r.id);
  await audit(ctx, actor, 'translation_review.reopened', 'translation', translationId, {});
}

/** Freigabe der Übersetzung: ein angefordertes Länderreview muss vom Land freigegeben sein */
export async function reviewBlocker(ctx: Ctx, translationId: string): Promise<string | null> {
  const r = await latestReview(ctx, translationId);
  if (!r || r.status === 'approved') return null;
  return r.status === 'returned' ? 'Länderreview: zurück an Übersetzung – bitte überarbeiten und erneut anfordern' : `Länderreview (${r.reviewerName}) noch offen`;
}

// ---------------------------------------------------------------- Rückübersetzung von Sicherheitshinweisen (U-06)

const backDto = (r: Row) => {
  const sample = parseJson<any[]>(r.sample, []);
  return { id: r.id, translationId: r.translation_id, candidates: Number(r.candidates), sample, checked: sample.filter((s) => !s.skipped).length, passed: sample.filter((s) => s.ok).length, failed: sample.filter((s) => s.ok === false).length, threshold: BACK_MIN, createdBy: r.created_by, createdAt: r.created_at };
};
export async function latestBackcheck(ctx: Ctx, translationId: string) {
  const r = await ctx.db.get('SELECT * FROM translation_backchecks WHERE translation_id = ? ORDER BY created_at DESC LIMIT 1', translationId);
  return r ? backDto(r) : null;
}

/** Stichprobe von 10 % der übersetzten Warnhinweise und Absätze mit Signalwort ins Deutsche zurückübersetzen und vergleichen */
export async function runBackcheck(ctx: Ctx, translationId: string, user: User) {
  const provider = ctx.llm;
  if (!provider) throw new Problem(503, 'Service Unavailable', 'KI-Dienst ist nicht eingerichtet (LLM_PROVIDER).');
  const t = await translationRow(ctx, translationId);
  if (baseLanguage(t.language) === 'de') throw unprocessable('Schweizer Hochdeutsch entsteht aus dem deutschen Text – eine Rückübersetzung ist nicht nötig.');
  const candidates = (await units(ctx, translationId)).filter((b) => b.text && (b.kind === 'warning' || signalLevels(b.source_text).length));
  if (!candidates.length) throw unprocessable('Die Übersetzung enthält keine übersetzten Sicherheitshinweise.');
  const names = provider.external ? await privacyNames(ctx.db) : [];
  const sample: { blockId: string; source: string; text: string; back: string | null; similarity: number | null; ok: boolean | null; skipped?: string }[] = [];
  for (const b of sampleEvery(candidates, 0.1)) {
    if (provider.external && detectPrivacy(b.text, { names }).length) {
      sample.push({ blockId: b.id, source: b.source_text, text: b.text, back: null, similarity: null, ok: null, skipped: 'personenbezogene Daten – nicht an externen Dienst' });
      continue;
    }
    try {
      const prompt = buildTranslatePrompt({ language: 'de', sourceLanguage: t.language, kind: b.kind, sentences: [b.text], terms: [], purpose: 'backcheck' });
      const back = parseTranslateResponse((await provider.complete(prompt)).text).map((s) => s.text).join(' ');
      const similarity = backSimilarity(b.source_text, back);
      sample.push({ blockId: b.id, source: b.source_text, text: b.text, back, similarity, ok: similarity >= BACK_MIN });
    } catch (e) {
      if (!(e instanceof LlmError || e instanceof RewriteParseError)) throw e;
      sample.push({ blockId: b.id, source: b.source_text, text: b.text, back: null, similarity: null, ok: null, skipped: 'KI-Dienst ohne Antwort' });
    }
  }
  const id = newId('bck');
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO translation_backchecks (id, project_id, translation_id, sample, candidates, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', id, ctx.projectId, translationId, json(sample), candidates.length, user.id, now());
    await audit(ctx, user.id, 'translation.backchecked', 'translation', translationId, { candidates: candidates.length, sampled: sample.length, failed: sample.filter((s) => s.ok === false).length, provider: provider.id });
  });
  return backDto((await ctx.db.get('SELECT * FROM translation_backchecks WHERE id = ?', id))!);
}

// ---------------------------------------------------------------- Releaseletter DE↔EN (U-09)

/** Segmente eines Letters: nicht leere Zeilen; reine Tabellentrenner und Ticketzeilen-Kennungen bleiben unverändert */
const letterSegments = (text: string) => text.split('\n').map((line, i) => ({ i, line })).filter((x) => x.line.trim() && !/^\s*\|?\s*:?-{3,}/.test(x.line));
export interface LetterSegmentIssue { line: number; source: string; text: string; issues: TranslationIssue[] }
export function letterIssues(source: string, target: string, language: string): LetterSegmentIssue[] {
  const a = letterSegments(source);
  const b = letterSegments(target);
  if (a.length !== b.length) return [{ line: 0, source: '', text: '', issues: ['structure_changed'] }];
  return a.map((s, k) => ({ line: s.i + 1, source: s.line, text: b[k].line, issues: checkTranslation(s.line, b[k].line, null, { language }) })).filter((x) => x.issues.length);
}

/** Letter in die andere Sprache (DE↔EN): Speicher zuerst, sonst KI je Zeile; Ergebnis als neuer Entwurf mit Prüfbefunden */
export async function translateReleaseLetter(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT * FROM release_letters WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Releaseletter ${id}`);
  if (r.translation_of) throw unprocessable('Dieser Letter ist bereits eine Übersetzung – bitte den Ausgangsletter übersetzen.');
  const target = r.language === 'de' ? 'en' : 'de';
  if (await ctx.db.get('SELECT 1 FROM release_letters WHERE translation_of = ? AND language = ?', id, target)) throw conflict(`Für diesen Letter gibt es bereits eine Übersetzung (${code(target)}).`);
  const provider = ctx.llm;
  const segments = letterSegments(r.text);
  const lines = r.text.split('\n');
  const names = provider?.external ? await privacyNames(ctx.db) : [];
  const todo: { i: number; line: string }[] = [];
  let fromMemory = 0;
  for (const s of segments) {
    const hit = (await tmLookup(ctx, r.language, target, s.line, 1)).find((m) => m.score === 1 && m.status === 'approved');
    if (hit) {
      lines[s.i] = hit.targetText;
      await tmTouch(ctx, hit.id);
      fromMemory++;
    } else todo.push(s);
  }
  if (todo.length) {
    if (!provider) throw new Problem(503, 'Service Unavailable', 'KI-Dienst ist nicht eingerichtet (LLM_PROVIDER) und der Speicher enthält nicht alle Zeilen.');
    if (provider.external && todo.some((s) => detectPrivacy(s.line, { names }).length)) throw unprocessable('Der Letter enthält personenbezogene Daten – nicht an einen externen KI-Dienst.');
    const fixed = await fixedTranslations(ctx);
    // Begriffe nur für DE→EN (feste Übersetzungen sind deutsch → Zielsprache)
    const terms = r.language === 'de' ? fixed.map((x) => ({ preferred: x.preferred, fixed: x.translations.en ?? null })) : [];
    try {
      const out = parseTranslateResponse((await provider.complete(buildTranslatePrompt({ language: target, sourceLanguage: r.language, kind: 'list', sentences: todo.map((s) => s.line), terms }))).text);
      todo.forEach((s, k) => {
        const got = out.filter((o) => o.sources.includes(k + 1)).map((o) => o.text).join(' ').trim();
        // Markdown-Zeichen am Zeilenanfang (Überschrift, Liste, Tabelle) bleiben erhalten
        const prefix = s.line.match(/^\s*(?:#{1,6}\s|[-*]\s|\d+\.\s|\|\s?)?/)?.[0] ?? '';
        lines[s.i] = got ? (got.startsWith(prefix.trim()) ? got : `${prefix}${got}`) : s.line;
      });
    } catch (e) {
      if (e instanceof LlmError || e instanceof RewriteParseError) throw new Problem(502, 'Bad Gateway', `KI-Übersetzung fehlgeschlagen: ${e.message}`);
      throw e;
    }
  }
  const text = lines.join('\n');
  const issues = letterIssues(r.text, text, target);
  const tickets = parseJson<string[]>(r.ticket_keys, []);
  const newIdValue = newId('rl');
  const { letterVerdict } = await import('./releaseLetters.js');
  const verdict = await letterVerdict(ctx, text, tickets, r.audience as Audience);
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO release_letters (id, project_id, title, release_label, ticket_keys, language, audience, country, division, origin, text, status, verdict, created_by, created_at, updated_by, updated_at, translation_of, translation_issues)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'translated', ?, 'draft', ?, ?, ?, ?, ?, ?, ?)`,
      newIdValue, ctx.projectId, `${String(r.title).replace(/\s*\((DE|EN)\)\s*$/, '')} (${code(target)})`.slice(0, 200), r.release_label, json(tickets), target, r.audience, r.country, r.division, text, verdict, user.id, now(), user.id, now(), id, json(issues),
    );
    await audit(ctx, user.id, 'release_letter.translated', 'release_letter', newIdValue, { from: id, language: target, fromMemory, machine: todo.length, issues: issues.length });
  });
  return { id: newIdValue, fromMemory, machine: todo.length, issues };
}

/** beim Speichern bzw. vor der Freigabe eines übersetzten Letters: Prüfbefunde neu berechnen */
export async function refreshLetterIssues(ctx: Ctx, letterId: string) {
  const r = await ctx.db.get('SELECT * FROM release_letters WHERE id = ?', letterId);
  if (!r?.translation_of) return [];
  const src = await ctx.db.get('SELECT text FROM release_letters WHERE id = ?', r.translation_of);
  const issues = src ? letterIssues(src.text, r.text, r.language) : [];
  await ctx.db.run('UPDATE release_letters SET translation_issues = ? WHERE id = ?', json(issues), letterId);
  return issues;
}

/** Freigegebener übersetzter Letter: Zeilenpaare in den Speicher */
export async function recordLetterMemory(ctx: Ctx, letterId: string, actor: string) {
  const r = await ctx.db.get('SELECT * FROM release_letters WHERE id = ?', letterId);
  if (!r?.translation_of) return;
  const src = await ctx.db.get('SELECT text, language FROM release_letters WHERE id = ?', r.translation_of);
  if (!src) return;
  const a = letterSegments(src.text);
  const b = letterSegments(r.text);
  if (a.length !== b.length) return;
  await tmRecord(ctx, { sourceLang: src.language, targetLang: r.language, origin: 'release_letter', pairs: a.map((s, k) => ({ source: s.line, target: b[k].line, ref: r.title, version: r.release_label })) }, actor);
}
