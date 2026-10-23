// Zugriffsmatrix (ADR-081, F-06): je Rolle und Menüpunkt die Stufe V (nutzt/bearbeitet), L (liest), - (kein Zugriff), ? (offen),
// jeweils mit Beleg. Zeilen und Spalten sind die Labels der Gruppen „navigation“ und „role“ (ADR-080); ausgeblendete fehlen.
import { audit, type Ctx, type User } from '../context.js';
import { now, type Row } from '../db.js';
import { parseCsv } from '../domain/tabular.js';
import { badRequest } from '../problem.js';

export const ACCESS_LEVELS = ['V', 'L', '-', '?'] as const;
const LEVEL_ALIASES: Record<string, string> = { v: 'V', l: 'L', '-': '-', '–': '-', '—': '-', x: 'V', '?': '?', '': '?' };
const MAX_EVIDENCE = 500;

async function axes(ctx: Ctx) {
  const labels = await ctx.db.all(
    "SELECT id, code, label_group, name_de, name_en, position FROM metadata_labels WHERE project_id = ? AND archived_at IS NULL AND label_group IN ('role', 'navigation') ORDER BY position",
    ctx.projectId,
  );
  const dto = (r: Row) => ({ id: r.id, code: r.code, nameDe: r.name_de, nameEn: r.name_en });
  return {
    // „Alle Rollen“ ist keine eigene Spalte
    roles: labels.filter((l) => l.label_group === 'role' && l.code !== 'role.all').map(dto),
    navigation: labels.filter((l) => l.label_group === 'navigation').map(dto),
  };
}

export async function getAccessMatrix(ctx: Ctx) {
  const { roles, navigation } = await axes(ctx);
  const cells = (await ctx.db.all('SELECT role_label_id, nav_label_id, level, evidence, updated_by, updated_at FROM access_matrix WHERE project_id = ?', ctx.projectId))
    .map((c) => ({ roleId: c.role_label_id, navId: c.nav_label_id, level: c.level, evidence: c.evidence ?? null, updatedBy: c.updated_by, updatedAt: c.updated_at }));
  const n = (lv: string) => cells.filter((c) => c.level === lv).length;
  const total = roles.length * navigation.length;
  return { roles, navigation, cells, summary: { cells: total, V: n('V'), L: n('L'), none: n('-'), open: total - n('V') - n('L') - n('-'), withEvidence: cells.filter((c) => c.evidence && c.level !== '?').length } };
}

async function writeCell(ctx: Ctx, roleId: string, navId: string, level: string, evidence: string | null, user: User) {
  await ctx.db.run(
    `INSERT INTO access_matrix (project_id, role_label_id, nav_label_id, level, evidence, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (role_label_id, nav_label_id) DO UPDATE SET level = excluded.level, evidence = excluded.evidence, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    ctx.projectId, roleId, navId, level, evidence, user.id, now(),
  );
}

function cleanLevel(v: unknown) {
  const lv = LEVEL_ALIASES[String(v ?? '').trim().toLowerCase()];
  if (!lv) throw badRequest(`level muss eines von ${ACCESS_LEVELS.join(', ')} sein.`);
  return lv;
}

export async function setAccessCell(ctx: Ctx, input: { roleId?: string; navId?: string; level?: string; evidence?: string | null }, user: User) {
  const { roles, navigation } = await axes(ctx);
  if (!roles.some((r) => r.id === input.roleId)) throw badRequest('roleId ist keine Rolle dieses Projekts.');
  if (!navigation.some((n) => n.id === input.navId)) throw badRequest('navId ist kein Menüpunkt dieses Projekts.');
  const level = cleanLevel(input.level);
  const evidence = input.evidence?.trim().slice(0, MAX_EVIDENCE) || null;
  await ctx.db.tx(async () => {
    await writeCell(ctx, input.roleId!, input.navId!, level, evidence, user);
    await audit(ctx, user.id, 'access_matrix.updated', 'access_matrix', `${input.roleId}:${input.navId}`, { level, evidence });
  });
  return getAccessMatrix(ctx);
}

/**
 * CSV-Import: erste Spalte Menüpunkt (Code, englischer UI-Begriff oder deutscher Name), dann je Rolle eine Spalte
 * (Code oder Name) mit V, L, - oder ?; optional Spalte „Beleg“. Leere Zellen ändern nichts.
 */
export async function importAccessMatrix(ctx: Ctx, input: { csv?: string }, user: User) {
  if (typeof input.csv !== 'string' || !input.csv.trim()) throw badRequest('csv ist Pflicht.');
  const rows = parseCsv(input.csv.replace(/^﻿/, ''));
  if (rows.length < 2) throw badRequest('Die CSV-Datei braucht eine Kopfzeile und mindestens eine Zeile.');
  const { roles, navigation } = await axes(ctx);
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const find = <T extends { code: string; nameDe: string; nameEn: string }>(list: T[], key: string) =>
    list.find((x) => [x.code, x.nameDe, x.nameEn].some((v) => norm(v) === norm(key)) || norm(x.code.split('.').slice(1).join('.')) === norm(key));
  const head = rows[0];
  const evidenceCol = head.findIndex((h) => ['beleg', 'quelle', 'evidence', 'source'].includes(norm(h)));
  const roleCols = head.map((h, i) => ({ i, role: i === 0 || i === evidenceCol ? undefined : find(roles, h) }));
  const unknownRoles = head.filter((h, i) => i > 0 && i !== evidenceCol && h.trim() && !roleCols[i].role);
  const unknownNav: string[] = [];
  const errors: string[] = [];
  let written = 0;
  await ctx.db.tx(async () => {
    for (const [n, r] of rows.slice(1).entries()) {
      if (!r[0]?.trim()) continue;
      const nav = find(navigation, r[0]);
      if (!nav) {
        unknownNav.push(r[0].trim());
        continue;
      }
      const evidence = evidenceCol >= 0 ? r[evidenceCol]?.trim().slice(0, MAX_EVIDENCE) || null : null;
      for (const { i, role } of roleCols) {
        if (!role || !(r[i] ?? '').trim()) continue;
        const lv = LEVEL_ALIASES[r[i].trim().toLowerCase()];
        if (!lv) {
          errors.push(`Zeile ${n + 2}, ${head[i]}: „${r[i]}“ ist keine Stufe (V, L, -, ?)`);
          continue;
        }
        await writeCell(ctx, role.id, nav.id, lv, evidence, user);
        written++;
      }
    }
    await audit(ctx, user.id, 'access_matrix.imported', 'access_matrix', ctx.projectId, { written, unknownNav: unknownNav.length, unknownRoles, errors: errors.length });
  });
  return { written, unknownNavigation: unknownNav, unknownRoles, errors: errors.slice(0, 50) };
}

/** CSV im Importformat (Spalten = Rollen-Codes), mit Beleg je Menüpunkt (erster nicht leerer Beleg der Zeile) */
export async function exportAccessMatrix(ctx: Ctx) {
  const m = await getAccessMatrix(ctx);
  // keine Formel-Einschleusung in Excel: Werte, die wie eine Formel beginnen, als Text markieren
  const q = (raw: string) => {
    const s = /^[=+\-@]/.test(raw) && raw !== '-' ? `'${raw}` : raw;
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [['Menüpunkt', 'Menüpunkt (UI)', ...m.roles.map((r) => r.code), 'Beleg'].join(';')];
  for (const n of m.navigation) {
    const cells = m.roles.map((r) => m.cells.find((c) => c.roleId === r.id && c.navId === n.id));
    const evidence = cells.find((c) => c?.evidence)?.evidence ?? '';
    lines.push([q(n.nameDe), q(n.nameEn), ...cells.map((c) => c?.level ?? '?'), q(evidence)].join(';'));
  }
  return `﻿${lines.join('\n')}\n`;
}
