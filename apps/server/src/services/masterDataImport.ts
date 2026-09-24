// Stammdaten-Import aus CSV/Excel (ADR-036): Abkürzungen, Glossar (Terminologie) und FAQ.
// Vorschau zeigt je Zeile, was passiert (neu, aktualisiert, unverändert, Fehler); Übernahme wendet nur gültige Zeilen an.
import path from 'node:path';
import ExcelJS from 'exceljs';
import { audit, type Ctx, type User } from '../context.js';
import { cellList, mapHeader, parseCsv } from '../domain/tabular.js';
import { badRequest, Problem } from '../problem.js';
import { createAbbreviation, createFaq, updateAbbreviation, updateFaq } from './masterData.js';
import { createTerm, updateTerm } from './terminology.js';

export const IMPORT_KINDS = ['abbreviations', 'glossary', 'faq'] as const;
type Kind = (typeof IMPORT_KINDS)[number];
const MAX_ROWS = 5000;

const FIELDS: Record<Kind, { fields: Record<string, string[]>; required: string[] }> = {
  abbreviations: {
    fields: { abbreviation: ['Abkürzung', 'Abkuerzung', 'Kürzel', 'abbreviation', 'short'], expansion: ['Bedeutung', 'Langform', 'Ausgeschrieben', 'expansion', 'meaning'], description: ['Beschreibung', 'Erläuterung', 'description'] },
    required: ['abbreviation', 'expansion'],
  },
  glossary: {
    fields: { preferred: ['Begriff', 'Bevorzugter Begriff', 'term', 'preferred'], definition: ['Definition', 'Erklärung', 'definition'], avoid: ['Vermeiden', 'Zu vermeiden', 'Synonyme vermeiden', 'avoid'] },
    required: ['preferred'],
  },
  faq: {
    fields: { question: ['Frage', 'question'], answer: ['Antwort', 'answer'], roles: ['Rollen', 'Rolle', 'roles'], divisions: ['Sparten', 'Sparte', 'divisions'], status: ['Status', 'status'] },
    required: ['question', 'answer'],
  },
};

export interface ImportRow {
  row: number;
  key: string;
  action: 'create' | 'update' | 'unchanged' | 'error';
  message: string | null;
}

async function readTable(fileName: string, data: Buffer): Promise<string[][]> {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.csv' || ext === '.txt') {
    try {
      return parseCsv(new TextDecoder('utf-8', { fatal: true }).decode(data));
    } catch {
      // Excel speichert CSV unter Windows oft als Windows-1252
      return parseCsv(new TextDecoder('windows-1252').decode(data));
    }
  }
  if (ext === '.xlsx') {
    const wb = new ExcelJS.Workbook();
    try {
      await wb.xlsx.load(data as any);
    } catch {
      throw badRequest('Keine gültige Excel-Datei (.xlsx).');
    }
    const ws = wb.worksheets[0];
    if (!ws) throw badRequest('Die Excel-Datei enthält kein Tabellenblatt.');
    const rows: string[][] = [];
    ws.eachRow({ includeEmpty: false }, (r) => {
      const vals = (r.values as unknown[]).slice(1).map((v: any) => (v == null ? '' : typeof v === 'object' ? String(v.text ?? v.result ?? (Array.isArray(v.richText) ? v.richText.map((t: any) => t.text).join('') : '')) : String(v)));
      if (vals.some((v) => v.trim())) rows.push(vals);
    });
    return rows;
  }
  throw new Problem(415, 'Unsupported Media Type', 'Erlaubt sind CSV (.csv) und Excel (.xlsx).');
}

/**
 * Stammdaten importieren. `apply=false`: nur Vorschau. Bestehende Einträge (gleiche Abkürzung, gleicher Begriff bzw. gleiche Frage,
 * ohne Groß-/Kleinschreibung) werden aktualisiert, neue angelegt; fehlerhafte Zeilen werden gemeldet und übersprungen.
 */
export async function importMasterData(ctx: Ctx, kind: string, fileName: string, data: Buffer, apply: boolean, user: User) {
  if (!(IMPORT_KINDS as readonly string[]).includes(kind)) throw badRequest(`kind muss eines von ${IMPORT_KINDS.join(', ')} sein.`);
  const k = kind as Kind;
  const table = await readTable(fileName, data);
  if (table.length < 2) throw badRequest('Die Tabelle braucht eine Kopfzeile und mindestens eine Datenzeile.');
  if (table.length - 1 > MAX_ROWS) throw badRequest(`Höchstens ${MAX_ROWS} Zeilen je Import.`);
  const spec = FIELDS[k];
  const cols = mapHeader(table[0], spec.fields);
  const missing = spec.required.filter((f) => cols[f] === undefined);
  if (missing.length) throw badRequest(`Spalten fehlen: ${missing.map((f) => spec.fields[f][0]).join(', ')}. Erwartet: ${Object.values(spec.fields).map((n) => n[0]).join(', ')}.`);

  const existing = await existingEntries(ctx, k);
  const seen = new Set<string>();
  const rows: ImportRow[] = [];
  for (const [i, raw] of table.slice(1).entries()) {
    const get = (f: string) => (cols[f] === undefined ? undefined : (raw[cols[f]] ?? '').trim());
    const rowNo = i + 2;
    const key = (get(spec.required[0]) ?? '').trim();
    const r: ImportRow = { row: rowNo, key, action: 'create', message: null };
    rows.push(r);
    const id = existing.get(key.toLowerCase());
    try {
      if (!key) throw badRequest(`${spec.fields[spec.required[0]][0]} fehlt.`);
      if (seen.has(key.toLowerCase())) throw badRequest('Doppelt in der Datei – nur die erste Zeile zählt.');
      seen.add(key.toLowerCase());
      const input = toInput(k, get);
      if (id && sameAs(existing.rows.get(id)!, input)) {
        r.action = 'unchanged';
        continue;
      }
      r.action = id ? 'update' : 'create';
      if (!apply) {
        validate(k, input);
        continue;
      }
      if (k === 'abbreviations') await (id ? updateAbbreviation(ctx, id, input, user) : createAbbreviation(ctx, input, user));
      else if (k === 'glossary') await (id ? updateTerm(ctx, id, input, user.id) : createTerm(ctx, input, user.id));
      else await (id ? updateFaq(ctx, id, input, user) : createFaq(ctx, input, user));
    } catch (e) {
      if (!(e instanceof Problem) || e.status >= 500) throw e;
      r.action = 'error';
      r.message = e.detail ?? e.title;
    }
  }
  const summary = { rows: rows.length, create: 0, update: 0, unchanged: 0, error: 0 };
  for (const r of rows) summary[r.action]++;
  if (apply) await audit(ctx, user.id, 'master_data.imported', 'project', ctx.projectId, { kind: k, fileName, ...summary });
  return { kind: k, applied: apply, summary, rows: rows.slice(0, 500) };
}

async function existingEntries(ctx: Ctx, k: Kind) {
  const sql = {
    abbreviations: 'SELECT id, abbreviation AS k, expansion, description FROM abbreviations WHERE project_id = ?',
    glossary: 'SELECT id, preferred AS k, definition, avoid, status FROM terminology_terms WHERE project_id = ?',
    faq: 'SELECT id, question AS k, answer, roles, divisions, status FROM faq_entries WHERE project_id = ?',
  }[k];
  const list = await ctx.db.all(sql, ctx.projectId);
  const map = new Map(list.map((r) => [String(r.k).toLowerCase(), r.id as string])) as Map<string, string> & { rows: Map<string, any> };
  map.rows = new Map(list.map((r) => [r.id, r]));
  return map;
}

function toInput(k: Kind, get: (f: string) => string | undefined): any {
  if (k === 'abbreviations') return { abbreviation: get('abbreviation'), expansion: get('expansion'), ...(get('description') !== undefined ? { description: get('description') || null } : {}) };
  if (k === 'glossary') return { preferred: get('preferred'), ...(get('definition') !== undefined ? { definition: get('definition') || null } : {}), ...(get('avoid') !== undefined ? { avoid: cellList(get('avoid')) } : {}), status: 'active' };
  const status = get('status')?.toLowerCase();
  return {
    question: get('question'), answer: get('answer'),
    ...(get('roles') !== undefined ? { roles: cellList(get('roles')).map((x) => x.toLowerCase()) } : {}),
    ...(get('divisions') !== undefined ? { divisions: cellList(get('divisions')).map((x) => x.toLowerCase()) } : {}),
    ...(status ? { status: ({ veröffentlicht: 'published', veroeffentlicht: 'published', entwurf: 'draft' } as Record<string, string>)[status] ?? status } : {}),
  };
}

/** Vorschau: dieselben Pflichtprüfungen wie beim Anlegen (ohne zu schreiben) */
function validate(k: Kind, input: any) {
  if (k === 'abbreviations' && (!input.abbreviation || !input.expansion)) throw badRequest('Abkürzung und Bedeutung sind Pflicht.');
  if (k === 'faq') {
    if (!input.question || input.question.length < 3 || !input.answer) throw badRequest('Frage (mind. 3 Zeichen) und Antwort sind Pflicht.');
    if (input.status && !['draft', 'published'].includes(input.status)) throw badRequest('Status muss Entwurf oder veröffentlicht sein.');
  }
}

function sameAs(r: any, input: any) {
  const list = (v: unknown) => JSON.stringify([...(typeof v === 'string' ? JSON.parse(v) : (v as string[] ?? []))].sort());
  const eq = (a: unknown, b: unknown) => (a ?? '') === (b ?? '');
  if (input.expansion !== undefined) return eq(r.expansion, input.expansion) && (input.description === undefined || eq(r.description, input.description));
  if (input.preferred !== undefined) {
    return r.status === 'active' && (input.definition === undefined || eq(r.definition, input.definition)) && (input.avoid === undefined || list(r.avoid) === list(input.avoid));
  }
  return eq(r.answer, input.answer) && (input.roles === undefined || list(r.roles) === list(input.roles))
    && (input.divisions === undefined || list(r.divisions) === list(input.divisions)) && (input.status === undefined || r.status === input.status);
}
