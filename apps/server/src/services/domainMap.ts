// Zuordnung Fachdomäne → Gliederungspunkt → Ordner (ADR-082): welche Domäne gehört zu welchem Kapitel der
// Gesamtgliederung, zu welchem Menüpunkt und in welchen Ordner des Handbuch-Arbeitsordners (tools/handbuch-ordner).
// Vorschläge kommen aus dem Katalog (DOMAIN_LINKS) und aus Chunks, die beide Labels tragen; je Projekt änderbar.
import { audit, type Ctx, type User } from '../context.js';
import { now, type Db, type Row } from '../db.js';
import { DOMAIN_LINKS } from '../domain/metadataLabels.js';
import { stripNumber } from '../domain/outline.js';
import { badRequest } from '../problem.js';
import { getOutline } from './outlines.js';

// Ordnernamen wie handbuch_struktur.py (ordnername, GRUPPEN, ARBEITSORDNER) – beide Stellen gemeinsam ändern
export const KAPITEL_BASIS = '02_Kapitel';
export const ARBEITSORDNER = ['01_Quellen', '02_Entwurf', '03_Bilder', '04_Pruefung_Freigabe', '05_Audit', '06_FAQ', '07_Ideenspeicher', '08_Steuerung'];
export const STEUERUNGSORDNER = [
  { folder: '05_I_Output', nameDe: 'I Output', description: 'Finale Texte mit Screens: Handbuch, Releaseletter, QuickGuide, Schulungsmaterial, interne Dokumente, Videos, Grafiken, Prozesse' },
  { folder: '06_II_Stil_und_Design', nameDe: 'II Stil und Design', description: 'Designvorschläge und Tonalität' },
  { folder: '07_III_Grammatik_Synonyme_Fehlerliste', nameDe: 'III Grammatik, Synonyme, Fehlerliste', description: 'Sprachregeln, bevorzugte Begriffe, gefundene Fehler' },
  { folder: '08_IV_Translation', nameDe: 'IV Translation', description: 'Glossar, Übersetzungsspeicher und Länderreview je Sprache' },
];
const ANHANG: Record<string, string> = {
  vorspann: '00_Vorspann',
  'anhang-a': 'Anhang_A_Glossar_und_Abkürzungen',
  'anhang-b': 'Anhang_B_Alltagschecklisten',
  'anhang-c': 'Anhang_C_Prozessdiagramme',
  'anhang-d': 'Anhang_D_Rollen-_Status-_und_Scopematrizen',
  'anhang-e': 'Anhang_E_Ticket-zu-Kapitel-Zuordnung',
  'anhang-f': 'Anhang_F_Quellen_und_Klärungsregister',
  'anhang-g': 'Anhang_G_Bildverzeichnis_und_Nachweise',
  'anhang-h': 'Anhang_H_Wissenschecks_und_Lösungen',
  'anhang-i': 'Anhang_I_Praxisbeispiele_Rechenbeispiele_Testdaten',
};

/** Windows-taugliche Ordnernamen wie ordnername() in handbuch_struktur.py */
export function ordnername(titel: string, laenge = 60) {
  let t = titel.replace(/\[[^\]]*\]/g, '').replace(/[\\/:*?"<>|,;]/g, '').replace(/–/g, '-').trim().replace(/\s+/g, ' ');
  if (t.length > laenge) {
    t = t.slice(0, laenge);
    const cut = t.lastIndexOf(' ');
    if (cut > 0) t = t.slice(0, cut);
  }
  return t.replace(/ /g, '_').replace(/^[._-]+|[._-]+$/g, '');
}

/** Kapitelordner eines Gliederungs-Labels (outline.kap09 → 02_Kapitel/09_MO_Checks_und_fachliche_Prüfungen) */
export function chapterFolder(code: string, nameDe: string) {
  const key = code.replace(/^outline\./, '');
  const m = /^kap(\d+)$/.exec(key);
  if (m) return { number: Number(m[1]), folder: `${KAPITEL_BASIS}/${m[1].padStart(2, '0')}_${ordnername(stripNumber(nameDe) || nameDe)}` };
  return { number: null, folder: `${KAPITEL_BASIS}/${ANHANG[key] ?? ordnername(nameDe)}` };
}

const norm = (t: string) => (stripNumber(t) || t).replace(/^[A-Z]\s+/, '').toLowerCase().replace(/[^a-z0-9äöüß]+/g, ' ').trim();

/** Katalogvorschläge einmal je Projekt anlegen; entfernte Vorschläge (active = 0) bleiben entfernt. */
export async function seedDomainLinks(db: Db, projectId: string) {
  const ids = new Map((await db.all("SELECT id, code FROM metadata_labels WHERE project_id = ? AND origin = 'catalog'", projectId)).map((r) => [r.code as string, r.id as string]));
  const pairs = Object.entries(DOMAIN_LINKS).flatMap(([d, targets]) => targets.map((t) => [ids.get(`domain.${d}`), ids.get(t)] as const)).filter(([a, b]) => a && b);
  const have = new Set((await db.all('SELECT domain_label_id, target_label_id FROM metadata_label_links WHERE project_id = ?', projectId)).map((r) => `${r.domain_label_id}:${r.target_label_id}`));
  const missing = pairs.filter(([a, b]) => !have.has(`${a}:${b}`));
  if (!missing.length) return;
  await db.tx(async () => {
    for (const [a, b] of missing) {
      await db.run(
        "INSERT INTO metadata_label_links (project_id, domain_label_id, target_label_id, origin, active, updated_by, updated_at) VALUES (?, ?, ?, 'catalog', 1, 'system', ?) ON CONFLICT (domain_label_id, target_label_id) DO NOTHING",
        projectId, a, b, now(),
      );
    }
  });
}

async function labels(ctx: Ctx) {
  return ctx.db.all(
    "SELECT id, code, label_group, name_de, name_en, position FROM metadata_labels WHERE project_id = ? AND archived_at IS NULL AND label_group IN ('domain', 'outline', 'navigation') ORDER BY position",
    ctx.projectId,
  );
}

/** Unterordner aus einer App-Gliederung: Kapitel per Titel den Gliederungs-Labels zugeordnet */
async function subfoldersFrom(ctx: Ctx, outlineId: string | undefined, outline: Row[]) {
  const out = new Map<string, { title: string; folder: string }[]>();
  if (!outlineId) return { outline: null, map: out };
  const o = await getOutline(ctx, outlineId);
  const nodes = (o as any).nodes as { id: string; parentId: string | null; level: number; position: number; title: string }[];
  const byTitle = new Map(outline.map((l) => [norm(l.name_de), l]));
  const top = nodes.filter((n) => n.level === 1).sort((a, b) => a.position - b.position);
  for (const c of top) {
    const l = byTitle.get(norm(c.title));
    if (!l) continue;
    const { number, folder } = chapterFolder(l.code, l.name_de);
    const children = nodes.filter((n) => n.parentId === c.id).sort((a, b) => a.position - b.position);
    out.set(l.id, children.map((s, j) => {
      const title = stripNumber(s.title) || s.title;
      return { title, folder: `${folder}/${number !== null ? `${number}.${j + 1}` : String(j + 1)}_${ordnername(title)}` };
    }));
  }
  return { outline: { id: o.id, name: o.name, matched: out.size, chapters: top.length }, map: out };
}

export async function getDomainMap(ctx: Ctx, opts: { outlineId?: string } = {}) {
  const all = await labels(ctx);
  const domains = all.filter((l) => l.label_group === 'domain');
  const outline = all.filter((l) => l.label_group === 'outline');
  const navigation = all.filter((l) => l.label_group === 'navigation');
  const links = await ctx.db.all('SELECT domain_label_id, target_label_id, origin, active FROM metadata_label_links WHERE project_id = ?', ctx.projectId);
  const linkOf = new Map(links.map((r) => [`${r.domain_label_id}:${r.target_label_id}`, r]));
  // Belege aus den Chunks: Abschnitte mit Domänen- und Ziel-Label
  const pairCounts = new Map((await ctx.db.all(
    `SELECT d.label_id AS domain_id, t.label_id AS target_id, COUNT(*) AS n
     FROM metadata_chunk_labels d JOIN metadata_chunk_labels t ON t.snippet_id = d.snippet_id AND t.label_id <> d.label_id
     JOIN metadata_labels ld ON ld.id = d.label_id AND ld.project_id = ? AND ld.label_group = 'domain'
     JOIN metadata_labels lt ON lt.id = t.label_id AND lt.label_group IN ('outline', 'navigation')
     GROUP BY d.label_id, t.label_id`, ctx.projectId,
  )).map((r) => [`${r.domain_id}:${r.target_id}`, Number(r.n)]));
  const sub = await subfoldersFrom(ctx, opts.outlineId, outline);

  const target = (d: Row, t: Row) => {
    const link = linkOf.get(`${d.id}:${t.id}`);
    const chunks = pairCounts.get(`${d.id}:${t.id}`) ?? 0;
    const linked = !!link && !!Number(link.active);
    return { linked, origin: link?.origin ?? null, chunks, suggested: !linked && chunks > 0 && !link };
  };
  const outlineDto = (l: Row) => {
    const f = chapterFolder(l.code, l.name_de);
    return { id: l.id, code: l.code, nameDe: l.name_de, nameEn: l.name_en, folder: f.folder, output: `04_Output/<Sprache>/${f.folder.split('/').pop()}`, subfolders: sub.map.get(l.id) ?? null };
  };
  const navDto = (l: Row) => ({ id: l.id, code: l.code, nameDe: l.name_de, nameEn: l.name_en });
  const items = domains.map((d) => {
    const ofGroup = (group: Row[], dto: (l: Row) => any) => group.map((t) => ({ ...dto(t), ...target(d, t) })).filter((x) => x.linked || x.suggested);
    return { id: d.id, code: d.code, nameDe: d.name_de, nameEn: d.name_en, outline: ofGroup(outline, outlineDto), navigation: ofGroup(navigation, navDto) };
  });
  const linkedOutline = new Set(items.flatMap((i) => i.outline.filter((o) => o.linked).map((o) => o.id)));
  return {
    domains: items,
    outline: outline.map(outlineDto),
    navigation: navigation.map(navDto),
    // Gliederungspunkte ohne Domäne (z. B. Einführung, Rollout): kein Fehler, nur zur Übersicht
    withoutDomain: outline.filter((l) => !linkedOutline.has(l.id)).map((l) => l.id),
    workFolders: ARBEITSORDNER,
    controlFolders: STEUERUNGSORDNER,
    subfolderSource: sub.outline,
    summary: {
      domains: items.length,
      links: items.reduce((n, i) => n + i.outline.filter((o) => o.linked).length + i.navigation.filter((o) => o.linked).length, 0),
      suggestions: items.reduce((n, i) => n + i.outline.filter((o) => o.suggested).length + i.navigation.filter((o) => o.suggested).length, 0),
    },
  };
}

export async function setDomainLink(ctx: Ctx, input: { domainId?: string; targetId?: string; linked?: unknown }, user: User) {
  const all = await labels(ctx);
  const d = all.find((l) => l.id === input.domainId && l.label_group === 'domain');
  if (!d) throw badRequest('domainId ist keine Fachdomäne dieses Projekts.');
  const t = all.find((l) => l.id === input.targetId && (l.label_group === 'outline' || l.label_group === 'navigation'));
  if (!t) throw badRequest('targetId ist kein Gliederungs- oder Menüpunkt dieses Projekts.');
  if (typeof input.linked !== 'boolean') throw badRequest('linked muss true oder false sein.');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO metadata_label_links (project_id, domain_label_id, target_label_id, origin, active, updated_by, updated_at) VALUES (?, ?, ?, 'manual', ?, ?, ?)
       ON CONFLICT (domain_label_id, target_label_id) DO UPDATE SET active = excluded.active, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      ctx.projectId, d.id, t.id, input.linked ? 1 : 0, user.id, now(),
    );
    await audit(ctx, user.id, 'domain_map.updated', 'metadata_label', d.id, { domain: d.code, target: t.code, linked: input.linked });
  });
  return { domainId: d.id, targetId: t.id, linked: input.linked };
}

/** CSV für den Arbeitsordner: je Domäne und Gliederungspunkt der Ordner (Semikolon, UTF-8 mit BOM) */
export async function exportDomainMap(ctx: Ctx, opts: { outlineId?: string } = {}) {
  const m = await getDomainMap(ctx, opts);
  const esc = (v: string) => (/[;"\n]/.test(v) || /^[=+\-@]/.test(v) ? `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"` : v);
  const rows = [['Domäne', 'Gliederungspunkt', 'Ordner', 'Unterordner', 'Menüpunkte', 'Herkunft', 'Chunks']];
  for (const d of m.domains) {
    const nav = d.navigation.filter((n: any) => n.linked).map((n: any) => n.nameEn).join(', ');
    for (const o of d.outline.filter((x: any) => x.linked)) {
      rows.push([d.nameDe, o.nameDe, o.folder, (o.subfolders ?? []).map((s: any) => s.folder.split('/').pop()).join(', '), nav, o.origin === 'catalog' ? 'Katalog' : 'manuell', String(o.chunks)]);
    }
  }
  return '﻿' + rows.map((r) => r.map(esc).join(';')).join('\r\n') + '\r\n';
}
