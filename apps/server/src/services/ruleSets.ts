// Zuschaltbare Regelsätze je Projekt (ADR-109, S-06): mitgelieferte Sätze ein- und ausschalten, einzelne Regeln abschalten,
// Vale-Stile (YAML, einzeln oder als ZIP) einlesen. Die Prüfung selbst steckt in domain/ruleSets.ts.
import JSZip from 'jszip';
import { audit, type Ctx, type User } from '../context.js';
import { json, now, parseJson, type Row } from '../db.js';
import { BUILTIN_SETS, parseValeStyle, type ActiveSet, type ValeRule } from '../domain/ruleSets.js';
import { badRequest, notFound } from '../problem.js';
import { LANGUAGES } from '../domain/translate.js';

const MAX_FILES = 300;
const MAX_FILE_BYTES = 64 * 1024;
const LANGS = ['de', ...Object.keys(LANGUAGES)];

const rows = async (ctx: Ctx) => new Map((await ctx.db.all('SELECT * FROM style_rule_sets WHERE project_id = ?', ctx.projectId)).map((r) => [r.set_key as string, r]));

function valeDto(r: Row) {
  const rules = parseJson<ValeRule[]>(r.rules, []);
  const off = new Set(parseJson<string[]>(r.disabled_rules, []));
  return {
    key: r.set_key as string, name: r.name as string, kind: 'vale' as const, language: r.language as string, enabled: !!Number(r.enabled),
    description: `Vale-Stil mit ${rules.length} Regeln`,
    rules: rules.map((x) => ({ id: x.name, label: x.name, description: `${x.extends} · ${x.level}${x.extends === 'occurrence' ? ` · höchstens ${x.max}` : ''} – ${x.message}`, enabled: !off.has(x.name) })),
    unsupported: parseJson<{ name: string; reason: string }[]>(r.unsupported, []), updatedBy: r.updated_by as string, updatedAt: r.updated_at as string,
  };
}

/** Alle Regelsätze des Projekts: mitgelieferte (aus, solange nicht eingeschaltet) und eingelesene Vale-Stile */
export async function listRuleSets(ctx: Ctx) {
  const saved = await rows(ctx);
  const builtin = BUILTIN_SETS.map((b) => {
    const r = saved.get(b.key);
    const off = new Set(parseJson<string[]>(r?.disabled_rules, []));
    return {
      key: b.key, name: b.name, kind: 'builtin' as const, language: (r?.language as string) ?? b.language, enabled: !!Number(r?.enabled ?? 0), description: b.description,
      rules: b.rules.map((x) => ({ ...x, enabled: !off.has(x.id) })), unsupported: [], updatedBy: (r?.updated_by as string) ?? null, updatedAt: (r?.updated_at as string) ?? null,
    };
  });
  const vale = [...saved.values()].filter((r) => r.kind === 'vale').sort((a, b) => String(a.name).localeCompare(String(b.name))).map(valeDto);
  return { sets: [...builtin, ...vale], languages: LANGS };
}

/** Eingeschaltete Regelsätze für die Stilprüfung */
export async function activeRuleSets(ctx: Ctx): Promise<ActiveSet[]> {
  const out: ActiveSet[] = [];
  for (const r of (await rows(ctx)).values()) {
    if (!Number(r.enabled)) continue;
    const b = BUILTIN_SETS.find((x) => x.key === r.set_key);
    if (r.kind === 'builtin' && !b) continue;
    out.push({ key: r.set_key, name: b?.name ?? r.name, language: r.language, disabledRules: parseJson<string[]>(r.disabled_rules, []), ...(r.kind === 'vale' ? { rules: parseJson<ValeRule[]>(r.rules, []) } : {}) });
  }
  return out;
}

/** Satz ein-/ausschalten, Regeln abschalten, Sprache ändern (Administration) */
export async function updateRuleSet(ctx: Ctx, key: string, input: { enabled?: unknown; disabledRules?: unknown; language?: unknown }, user: User) {
  const saved = (await rows(ctx)).get(key);
  const b = BUILTIN_SETS.find((x) => x.key === key);
  if (!b && !saved) throw notFound(`Regelsatz ${key}`);
  const ruleIds = b ? b.rules.map((r) => r.id) : parseJson<ValeRule[]>(saved!.rules, []).map((r) => r.name);
  const enabled = input.enabled === undefined ? !!Number(saved?.enabled ?? 0) : input.enabled === true;
  if (input.enabled !== undefined && typeof input.enabled !== 'boolean') throw badRequest('enabled ist true oder false.');
  let disabled = parseJson<string[]>(saved?.disabled_rules, []);
  if (input.disabledRules !== undefined) {
    if (!Array.isArray(input.disabledRules) || input.disabledRules.some((x) => typeof x !== 'string' || !ruleIds.includes(x))) throw badRequest(`disabledRules: Liste von Regeln des Satzes (${ruleIds.join(', ')}).`);
    disabled = [...new Set(input.disabledRules as string[])];
  }
  const language = input.language === undefined ? (saved?.language as string) ?? b!.language : String(input.language).toLowerCase();
  if (!LANGS.includes(language)) throw badRequest(`language: eine von ${LANGS.join(', ')}.`);
  await ctx.db.tx(async () => {
    if (saved) {
      await ctx.db.run('UPDATE style_rule_sets SET enabled = ?, disabled_rules = ?, language = ?, updated_by = ?, updated_at = ? WHERE project_id = ? AND set_key = ?', enabled ? 1 : 0, json(disabled), language, user.id, now(), ctx.projectId, key);
    } else {
      await ctx.db.run("INSERT INTO style_rule_sets (project_id, set_key, name, kind, language, enabled, disabled_rules, updated_by, updated_at) VALUES (?, ?, ?, 'builtin', ?, ?, ?, ?, ?)",
        ctx.projectId, key, b!.name, language, enabled ? 1 : 0, json(disabled), user.id, now());
    }
    await audit(ctx, user.id, 'style.rule_set_changed', 'project', ctx.projectId, { key, enabled, disabled, language });
  });
  return (await listRuleSets(ctx)).sets.find((s) => s.key === key)!;
}

/** YAML-Dateien aus einer Datei (.yml oder .zip mit Stilordner) */
export async function valeFiles(fileName: string, data: Buffer): Promise<{ name: string; content: string }[]> {
  if (/\.ya?ml$/i.test(fileName)) return [{ name: fileName, content: data.toString('utf8') }];
  if (!/\.zip$/i.test(fileName)) throw badRequest('Erwartet eine .yml-Datei oder ein ZIP mit dem Vale-Stilordner.');
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch {
    throw badRequest('ZIP-Datei nicht lesbar.');
  }
  const entries = Object.values(zip.files).filter((f) => !f.dir && /\.ya?ml$/i.test(f.name) && !/(^|\/)(__MACOSX|\.)/.test(f.name));
  if (entries.length > MAX_FILES) throw badRequest(`Höchstens ${MAX_FILES} Regeln je Stil.`);
  const out: { name: string; content: string }[] = [];
  for (const f of entries) {
    const buf = await f.async('nodebuffer');
    if (buf.length > MAX_FILE_BYTES) throw badRequest(`${f.name}: größer als ${MAX_FILE_BYTES / 1024} KB.`);
    out.push({ name: f.name, content: buf.toString('utf8') });
  }
  return out;
}

/** Vale-Stil einlesen bzw. ersetzen (gleicher Name); er ist danach eingeschaltet */
export async function importValeStyle(ctx: Ctx, input: { name?: unknown; language?: unknown; files?: unknown }, user: User) {
  const name = String(input.name ?? '').trim();
  if (!/^[\p{L}\p{N}][\p{L}\p{N} ._-]{0,59}$/u.test(name)) throw badRequest('name: 1–60 Zeichen (Buchstaben, Ziffern, Leerzeichen, . _ -).');
  const language = String(input.language ?? 'en').toLowerCase();
  if (!LANGS.includes(language)) throw badRequest(`language: eine von ${LANGS.join(', ')}.`);
  const files = input.files;
  if (!Array.isArray(files) || !files.length || files.length > MAX_FILES || files.some((f) => !f || typeof f.name !== 'string' || typeof f.content !== 'string' || f.content.length > MAX_FILE_BYTES)) {
    throw badRequest(`files: 1–${MAX_FILES} Dateien { name, content } mit je höchstens ${MAX_FILE_BYTES / 1024} KB.`);
  }
  const parsed = parseValeStyle(files as { name: string; content: string }[]);
  if (!parsed.rules.length) throw badRequest('Keine unterstützte Regel im Stil gefunden.', { unsupported: parsed.unsupported });
  const key = `vale:${name.toLowerCase().replace(/\s+/g, '-')}`;
  if (BUILTIN_SETS.some((b) => b.key === key)) throw badRequest('Dieser Name ist vergeben.');
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM style_rule_sets WHERE project_id = ? AND set_key = ?', ctx.projectId, key);
    await ctx.db.run("INSERT INTO style_rule_sets (project_id, set_key, name, kind, language, enabled, disabled_rules, rules, unsupported, updated_by, updated_at) VALUES (?, ?, ?, 'vale', ?, 1, '[]', ?, ?, ?, ?)",
      ctx.projectId, key, name, language, json(parsed.rules), json(parsed.unsupported), user.id, now());
    await audit(ctx, user.id, 'style.vale_imported', 'project', ctx.projectId, { key, rules: parsed.rules.length, unsupported: parsed.unsupported.length });
  });
  return (await listRuleSets(ctx)).sets.find((s) => s.key === key)!;
}

/** Vale-Stil entfernen; mitgelieferte Sätze lassen sich nur ausschalten */
export async function deleteRuleSet(ctx: Ctx, key: string, user: User) {
  const r = (await rows(ctx)).get(key);
  if (!r || r.kind !== 'vale') throw notFound(`Vale-Stil ${key}`);
  await ctx.db.run('DELETE FROM style_rule_sets WHERE project_id = ? AND set_key = ?', ctx.projectId, key);
  await audit(ctx, user.id, 'style.vale_deleted', 'project', ctx.projectId, { key });
}
