// Fehlerliste in der App (ADR-103, G-05): gefundene Sprachfehler mit Fundstelle, Korrektur, Kategorie und Status;
// Export und Rückimport im Format von FEHLERLISTE.csv des Arbeitsordners (Agent sprach-lektor).
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { sha256 } from '../domain/similarity.js';
import { RULE_LABEL, type StyleRule } from '../domain/style.js';
import { mapHeader, parseCsv } from '../domain/tabular.js';
import { germanDate } from '../domain/workAreas.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { assertVersion } from './assessment.js';
import { checkChapterVersion } from './style.js';

export const ERROR_STATUSES = ['open', 'fixed', 'rejected', 'rule_missing'] as const;
export type ErrorStatus = (typeof ERROR_STATUSES)[number];
/** Status wie in FEHLERLISTE.md */
export const STATUS_DE: Record<ErrorStatus, string> = { open: 'offen', fixed: 'korrigiert', rejected: 'abgelehnt', rule_missing: 'Regel fehlt' };
const STATUS_FROM_DE = new Map(Object.entries(STATUS_DE).map(([k, v]) => [v.toLowerCase(), k as ErrorStatus]));
/** Kategorien laut FEHLERLISTE.md */
export const CATEGORIES = ['Rechtschreibung', 'Zeichensetzung', 'Grammatik', 'Terminologie', 'Zahlen und Einheiten', 'Stil und Tonalität', 'Konsistenz', 'Format', 'Übersetzung'];
/** Stilregel → Kategorie der Fehlerliste */
const CATEGORY_OF: Record<StyleRule, string> = {
  spelling: 'Rechtschreibung', capitalization: 'Rechtschreibung', double_word: 'Rechtschreibung',
  punctuation: 'Zeichensetzung', typography: 'Zeichensetzung', grammar: 'Grammatik',
  terminology: 'Terminologie', product_name: 'Terminologie', custom: 'Terminologie', numbers: 'Zahlen und Einheiten', abbreviation: 'Konsistenz',
  long_sentence: 'Stil und Tonalität', passive: 'Stil und Tonalität', future: 'Stil und Tonalität', past: 'Stil und Tonalität', filler: 'Stil und Tonalität',
  impersonal: 'Stil und Tonalität', colloquial: 'Stil und Tonalität', hedging: 'Stil und Tonalität', nominal: 'Stil und Tonalität', address: 'Stil und Tonalität', tone: 'Stil und Tonalität',
  rule_set: 'Stil und Tonalität',
};
const MAX_TEXT = 500;
const nrLabel = (n: number) => `F-${String(n).padStart(4, '0')}`;
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

const dto = (r: Row) => ({
  id: r.id as string, nr: nrLabel(Number(r.nr)), foundAt: r.found_at as string, location: r.location as string, chapterId: r.chapter_id ?? null, chapterVersionId: r.chapter_version_id ?? null,
  blockId: r.block_id ?? null, error: r.error_text as string, correction: r.correction ?? null, category: r.category as string, rule: r.rule ?? null,
  status: r.status as ErrorStatus, statusLabel: STATUS_DE[r.status as ErrorStatus], reason: r.reason ?? null, origin: r.origin as string,
  createdBy: r.created_by as string, createdAt: r.created_at as string, updatedBy: r.updated_by as string, updatedAt: r.updated_at as string,
});

async function nextNr(ctx: Ctx) {
  return Number((await ctx.db.get('SELECT MAX(nr) AS m FROM language_errors WHERE project_id = ?', ctx.projectId))?.m ?? 0) + 1;
}

export async function listLanguageErrors(ctx: Ctx, q: { status?: string; chapterId?: string; category?: string; q?: string } = {}) {
  const where = ['project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (q.status) {
    if (!(ERROR_STATUSES as readonly string[]).includes(q.status)) throw badRequest(`status: ${ERROR_STATUSES.join(', ')}.`);
    where.push('status = ?');
    params.push(q.status);
  }
  if (q.chapterId) (where.push('chapter_id = ?'), params.push(q.chapterId));
  if (q.category) (where.push('category = ?'), params.push(q.category));
  if (q.q) (where.push('(LOWER(error_text) LIKE ? OR LOWER(location) LIKE ? OR LOWER(COALESCE(correction, \'\')) LIKE ?)'), params.push(...Array(3).fill(`%${q.q.toLowerCase()}%`)));
  const items = (await ctx.db.all(`SELECT * FROM language_errors WHERE ${where.join(' AND ')} ORDER BY nr`, ...params)).map(dto);
  const all = await ctx.db.all('SELECT status, category FROM language_errors WHERE project_id = ?', ctx.projectId);
  return {
    items,
    summary: Object.fromEntries(ERROR_STATUSES.map((s) => [s, all.filter((r) => r.status === s).length])),
    categories: CATEGORIES.map((c) => ({ category: c, open: all.filter((r) => r.category === c && r.status === 'open').length })),
    statusLabels: STATUS_DE,
  };
}

/**
 * Funde der Stilprüfung einer Kapitelversion übernehmen (Warnungen; mit `includeInfo` auch Hinweise). Dieselbe Fundstelle
 * (Kapitel, Regel, Text) kommt nur einmal in die Liste. Offene Einträge des Kapitels, deren Text in der Version nicht mehr
 * vorkommt, gelten als korrigiert.
 */
export async function collectFromVersion(ctx: Ctx, input: { versionId?: unknown; includeInfo?: unknown }, user: User) {
  const versionId = typeof input.versionId === 'string' ? input.versionId : '';
  if (!versionId) throw badRequest('versionId ist Pflicht.');
  // Kennung aus dem Body: die Projektprüfung der Pfadparameter greift hier nicht
  await assertVersion(ctx, versionId);
  const check = await checkChapterVersion(ctx, versionId);
  const chapterId = check.version.chapterId as string;
  const chapterTitle = check.version.title as string;
  const at = now();
  let added = 0;
  let known = 0;
  let fixed = 0;
  const present = new Set<string>();
  await ctx.db.tx(async () => {
    let nr = await nextNr(ctx);
    for (const b of check.blocks) {
      present.add(norm(b.text));
      for (const s of b.analysis.sentences) {
        for (const i of s.issues) {
          if (i.severity !== 'warning' && input.includeInfo !== true) continue;
          const error = b.text.slice(i.start, i.end).trim().slice(0, MAX_TEXT) || s.text.slice(0, MAX_TEXT);
          const fingerprint = sha256(`${chapterId}|${i.rule}|${norm(error)}|${norm(s.text)}`);
          if (await ctx.db.get('SELECT 1 FROM language_errors WHERE project_id = ? AND fingerprint = ?', ctx.projectId, fingerprint)) {
            known++;
            continue;
          }
          await ctx.db.run(
            `INSERT INTO language_errors (id, project_id, nr, found_at, location, chapter_id, chapter_version_id, block_id, error_text, correction, category, rule, status, origin, fingerprint, created_by, created_at, updated_by, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', 'check', ?, ?, ?, ?, ?)`,
            newId('lerr'), ctx.projectId, nr++, at, `App: ${chapterTitle} › ${b.section}`, chapterId, versionId, b.id, error,
            i.fix ? i.fix.replacement || '(streichen)' : null, CATEGORY_OF[i.rule] ?? 'Stil und Tonalität', `${RULE_LABEL[i.rule]}: ${i.message}`.slice(0, MAX_TEXT), fingerprint, user.id, at, user.id, at,
          );
          added++;
        }
      }
    }
    // Abgleich: offene Funde dieses Kapitels, deren Satz nicht mehr im Text steht, sind korrigiert
    const text = [...present].join('\n');
    for (const r of await ctx.db.all("SELECT id, error_text FROM language_errors WHERE project_id = ? AND chapter_id = ? AND status = 'open' AND origin = 'check'", ctx.projectId, chapterId)) {
      if (!text.includes(norm(r.error_text))) {
        await ctx.db.run("UPDATE language_errors SET status = 'fixed', updated_by = ?, updated_at = ? WHERE id = ?", user.id, at, r.id);
        fixed++;
      }
    }
    await audit(ctx, user.id, 'language_errors.collected', 'chapter_version', versionId, { added, known, fixed });
  });
  return { added, known, fixed, ...(await listLanguageErrors(ctx, { chapterId })) };
}

const cleanStatus = (v: unknown) => {
  if (!(ERROR_STATUSES as readonly unknown[]).includes(v)) throw badRequest(`status: ${ERROR_STATUSES.join(', ')}.`);
  return v as ErrorStatus;
};
const cleanCategory = (v: unknown) => {
  const c = String(v ?? '').trim();
  if (!CATEGORIES.includes(c)) throw badRequest(`category: ${CATEGORIES.join(', ')}.`);
  return c;
};

/** Eintrag von Hand anlegen (z. B. Fund aus einem Produkt oder einer Übersetzung) */
export async function createLanguageError(ctx: Ctx, input: Record<string, unknown>, user: User) {
  const error = String(input.error ?? '').trim().slice(0, MAX_TEXT);
  const location = String(input.location ?? '').trim().slice(0, MAX_TEXT);
  if (!error || !location) throw badRequest('error und location sind Pflicht.');
  const category = cleanCategory(input.category);
  const id = newId('lerr');
  const at = now();
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO language_errors (id, project_id, nr, found_at, location, chapter_id, error_text, correction, category, rule, status, origin, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', 'manual', ?, ?, ?, ?)`,
      id, ctx.projectId, await nextNr(ctx), at, location, typeof input.chapterId === 'string' && input.chapterId ? input.chapterId : null, error,
      typeof input.correction === 'string' && input.correction.trim() ? input.correction.trim().slice(0, MAX_TEXT) : null, category,
      typeof input.rule === 'string' && input.rule.trim() ? input.rule.trim().slice(0, MAX_TEXT) : null, user.id, at, user.id, at,
    );
    await audit(ctx, user.id, 'language_error.created', 'language_error', id, { category });
  });
  return dto((await ctx.db.get('SELECT * FROM language_errors WHERE id = ?', id))!);
}

/** Status, Korrektur, Kategorie ändern; „abgelehnt“ braucht eine Begründung */
export async function updateLanguageError(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const r = await ctx.db.get('SELECT * FROM language_errors WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Eintrag ${id}`);
  const status = input.status === undefined ? r.status : cleanStatus(input.status);
  const reason = input.reason === undefined ? r.reason : (String(input.reason ?? '').trim().slice(0, MAX_TEXT) || null);
  if (status === 'rejected' && !reason) throw conflict('Für „abgelehnt“ ist eine Begründung nötig.');
  const correction = input.correction === undefined ? r.correction : (String(input.correction ?? '').trim().slice(0, MAX_TEXT) || null);
  const category = input.category === undefined ? r.category : cleanCategory(input.category);
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE language_errors SET status = ?, reason = ?, correction = ?, category = ?, updated_by = ?, updated_at = ? WHERE id = ?', status, reason, correction, category, user.id, now(), id);
    await audit(ctx, user.id, 'language_error.updated', 'language_error', id, { status, category });
  });
  return dto((await ctx.db.get('SELECT * FROM language_errors WHERE id = ?', id))!);
}

const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const FEHLERLISTE_HEADER = ['Nr', 'Datum', 'Fundstelle', 'Fehler', 'Korrektur', 'Kategorie', 'Regel', 'Status'];

/** Export wie FEHLERLISTE.csv (UTF-8 mit BOM, Semikolon); Begründung einer Ablehnung steht hinter dem Status */
export async function exportLanguageErrors(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT * FROM language_errors WHERE project_id = ? ORDER BY nr', ctx.projectId);
  const lines = [FEHLERLISTE_HEADER.join(';'), ...rows.map((r) => [
    nrLabel(Number(r.nr)), germanDate(String(r.found_at).slice(0, 10)), r.location, r.error_text, r.correction ?? '', r.category, r.rule ?? '',
    r.status === 'rejected' && r.reason ? `${STATUS_DE.rejected} (${r.reason})` : STATUS_DE[r.status as ErrorStatus] ?? r.status,
  ].map(csvCell).join(';'))];
  return { body: `﻿${lines.join('\r\n')}\r\n`, fileName: 'FEHLERLISTE.csv', contentType: 'text/csv; charset=utf-8' };
}

const fromGermanDate = (s: string) => {
  const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s.trim());
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T00:00:00.000Z` : null;
};

/**
 * Rückimport aus FEHLERLISTE.csv: Einträge mit bekannter Nr. übernehmen Status, Korrektur und Begründung; neue Nr. werden
 * angelegt (Fundstelle aus der Datei). Zuerst Vorschau (`apply` false), dann übernehmen.
 */
export async function importLanguageErrors(ctx: Ctx, input: { csv?: unknown; apply?: unknown }, user: User) {
  if (typeof input.csv !== 'string' || !input.csv.trim()) throw badRequest('csv ist Pflicht.');
  const rows = parseCsv(input.csv.replace(/^﻿/, ''));
  if (rows.length < 1) throw badRequest('Die Datei ist leer.');
  const col = mapHeader(rows[0], { nr: ['nr'], date: ['datum'], location: ['fundstelle'], error: ['fehler'], correction: ['korrektur'], category: ['kategorie'], rule: ['regel'], status: ['status'] });
  for (const k of ['nr', 'location', 'error', 'category', 'status']) if (col[k] === undefined) throw badRequest(`Spalte „${FEHLERLISTE_HEADER[['nr', 'date', 'location', 'error', 'correction', 'category', 'rule', 'status'].indexOf(k)]}“ fehlt.`);
  const existing = new Map((await ctx.db.all('SELECT * FROM language_errors WHERE project_id = ?', ctx.projectId)).map((r) => [Number(r.nr), r]));
  const changes: { nr: string; action: 'new' | 'update' | 'unchanged'; status: string; problems: string[] }[] = [];
  const parsed: { nr: number; date: string | null; location: string; error: string; correction: string | null; category: string; rule: string | null; status: ErrorStatus; reason: string | null }[] = [];
  for (const r of rows.slice(1)) {
    const cell = (k: string) => (col[k] === undefined ? '' : (r[col[k]!] ?? '').trim());
    if (!cell('nr') && !cell('error')) continue;
    const problems: string[] = [];
    const nrM = /^F-?(\d{1,6})$/i.exec(cell('nr'));
    if (!nrM) problems.push(`Nr „${cell('nr')}“ ungültig (F-0001)`);
    const statusRaw = cell('status');
    const sm = /^([^()]+?)\s*(?:\((.*)\))?$/.exec(statusRaw);
    const status = STATUS_FROM_DE.get((sm?.[1] ?? '').trim().toLowerCase());
    if (!status) problems.push(`Status „${statusRaw}“ unbekannt (${Object.values(STATUS_DE).join(', ')})`);
    if (!CATEGORIES.includes(cell('category'))) problems.push(`Kategorie „${cell('category')}“ unbekannt`);
    const reason = sm?.[2]?.trim() || null;
    if (status === 'rejected' && !reason) problems.push('„abgelehnt“ ohne Begründung – „abgelehnt (Begründung)“ schreiben');
    const nr = nrM ? Number(nrM[1]) : 0;
    const old = existing.get(nr);
    const item = { nr, date: fromGermanDate(cell('date')), location: cell('location').slice(0, MAX_TEXT), error: cell('error').slice(0, MAX_TEXT), correction: cell('correction').slice(0, MAX_TEXT) || null, category: cell('category'), rule: cell('rule').slice(0, MAX_TEXT) || null, status: status ?? 'open', reason };
    if (!problems.length && (!item.location || !item.error)) problems.push('Fundstelle und Fehler sind Pflicht');
    const unchanged = old && old.status === item.status && (old.correction ?? null) === item.correction && (old.reason ?? null) === (item.status === 'rejected' ? reason : old.reason ?? null) && old.category === item.category;
    changes.push({ nr: nrLabel(nr), action: !old ? 'new' : unchanged ? 'unchanged' : 'update', status: STATUS_DE[item.status], problems });
    if (!problems.length) parsed.push(item);
  }
  const invalid = changes.filter((c) => c.problems.length);
  if (input.apply !== true || invalid.length) return { applied: false, changes, invalid: invalid.length };
  const at = now();
  await ctx.db.tx(async () => {
    for (const p of parsed) {
      const old = existing.get(p.nr);
      if (old) {
        await ctx.db.run('UPDATE language_errors SET status = ?, correction = ?, category = ?, reason = ?, updated_by = ?, updated_at = ? WHERE id = ?',
          p.status, p.correction, p.category, p.status === 'rejected' ? p.reason : old.reason ?? null, user.id, at, old.id);
      } else {
        await ctx.db.run(
          `INSERT INTO language_errors (id, project_id, nr, found_at, location, error_text, correction, category, rule, status, reason, origin, created_by, created_at, updated_by, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'import', ?, ?, ?, ?)`,
          newId('lerr'), ctx.projectId, p.nr, p.date ?? at, p.location, p.error, p.correction, p.category, p.rule, p.status, p.reason, user.id, at, user.id, at,
        );
      }
    }
    await audit(ctx, user.id, 'language_errors.imported', 'project', ctx.projectId, { new: changes.filter((c) => c.action === 'new').length, updated: changes.filter((c) => c.action === 'update').length });
  });
  return { applied: true, changes, invalid: 0 };
}
