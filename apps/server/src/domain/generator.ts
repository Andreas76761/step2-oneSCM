// Extraktiver Kapitelgenerator (US-008, ADR-007).
// Es wird ausschließlich Quelltext bestätigter Snippets übernommen; nichts wird hinzuerfunden.
// ANNAHME(E-09): Zuordnung zu den Standardabschnitten per Heuristik (Überschrift, Präfix, Listentyp).
import { CHAPTER_SECTIONS, CONFIRMED_EVIDENCE, ROLES, type SectionCode } from './reference.js';

export const GENERATOR_ID = 'extractive-1.0';

export interface GenAssignment {
  code: string;
  evidenceStatus: string;
}

export interface GenSnippet {
  id: string;
  seq: number;
  text: string;
  kind: string;
  evidenceStatus: string;
  subchapterTitle: string | null;
  headingPath: string[];
  order: number; // globale Reihenfolge (Unterkapitel-Position, Datei, Position)
  normHash: string;
  roles: GenAssignment[];
  divisions: GenAssignment[];
  market: string | null;
  release: string | null;
  scopeStatus: string; // Markt/Release bestätigt?
  sourceLabel: string; // Datei + Revision
  canonicalRedirect?: { topicId: string; topicTitle: string; leadChapterTitle: string } | null;
}

export interface GenBlock {
  section: SectionCode;
  kind: string;
  text: string;
  sourceIds: string[];
  roles: string[];
  divisions: string[];
  market: string | null;
  release: string | null;
  scopeStatus: 'confirmed' | 'general' | 'unconfirmed';
}

export interface GenResult {
  blocks: GenBlock[];
  gaps: SectionCode[];
  usedSnippetIds: string[];
  skippedUnconfirmed: number;
  deduplicated: number;
}

const H = (s: string) => s.toLowerCase();
const HEADING_RULES: [RegExp, SectionCode][] = [
  [/(zweck|überblick|ueberblick|einleitung|übersicht|uebersicht|ziel)/, 'purpose'],
  [/(voraussetzung|vorbedingung|vorbereitung)/, 'prerequisites'],
  [/(zuständig|zustaendig|verantwortlich|rollen)/, 'responsibilities'],
  [/(fehler|problem|störung|stoerung|troubleshooting|fehlerbehebung)/, 'troubleshooting'],
  [/(ergebnis|systemstatus|abschluss)/, 'result'],
  [/(hinweis|tipp|warnung|achtung|wichtig)/, 'hints'],
  [/(schritt|vorgehen|durchführung|durchfuehrung|ablauf|anleitung)/, 'steps'],
];

function hintKind(text: string): 'note' | 'tip' | 'warning' | null {
  const t = text.replace(/^[>\s*_]+/, '').toLowerCase();
  if (/^(warnung|achtung|vorsicht)\b/.test(t)) return 'warning';
  if (/^tipp\b/.test(t)) return 'tip';
  if (/^(hinweis|wichtig|info)\b/.test(t)) return 'note';
  return null;
}

function isConfirmed(a: GenAssignment) {
  return CONFIRMED_EVIDENCE.includes(a.evidenceStatus);
}

const specificCodes = (as: GenAssignment[]) => as.map((a) => a.code).filter((c) => c !== 'all' && c !== 'unconfirmed').sort();
const setKey = (codes: string[]) => codes.join(',');

function majority(keys: string[]): string {
  const counts = new Map<string, number>();
  for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  let best = '';
  let max = -1;
  for (const [k, c] of counts) if (c > max) [best, max] = [k, c];
  return best;
}

export function scopeStatusOf(snippets: Pick<GenSnippet, 'roles' | 'divisions' | 'scopeStatus'>[]): 'confirmed' | 'general' | 'unconfirmed' {
  const all = snippets.flatMap((s) => [...s.roles, ...s.divisions]);
  if (!all.length || !all.every(isConfirmed)) return 'unconfirmed';
  const general = snippets.every((s) => s.roles.every((r) => r.code === 'all') && s.divisions.every((d) => d.code === 'all'));
  return general ? 'general' : 'confirmed';
}

export function assignSection(s: GenSnippet, ctx: { first: boolean; roleMajority: string; divMajority: string }): { section: SectionCode; kind: string } {
  const hk = hintKind(s.text);
  const baseKind = s.kind === 'ordered_list' || s.kind === 'list' ? 'list' : s.kind === 'table' ? 'table' : s.kind === 'code' ? 'code' : 'paragraph';
  const heading = H([s.subchapterTitle ?? '', ...s.headingPath].filter(Boolean).slice(-2).join(' '));
  const headingSection = HEADING_RULES.find(([re]) => re.test(heading))?.[1];
  if (hk) return { section: headingSection === 'troubleshooting' ? 'troubleshooting' : 'hints', kind: hk };
  if (/^\s*(\*\*)?ergebnis\s*:/i.test(s.text)) return { section: 'result', kind: baseKind };
  if (/^\s*(\*\*)?voraussetzung(en)?\s*:/i.test(s.text)) return { section: 'prerequisites', kind: baseKind };

  const roleKey = setKey(specificCodes(s.roles));
  if (roleKey && roleKey !== ctx.roleMajority) return { section: 'role_specifics', kind: baseKind };
  const divKey = setKey(specificCodes(s.divisions));
  if (divKey && divKey !== ctx.divMajority) return { section: 'scope_differences', kind: baseKind };

  if (headingSection) return { section: headingSection, kind: headingSection === 'hints' ? 'note' : baseKind };
  if (s.kind === 'ordered_list') return { section: 'steps', kind: 'list' };
  if (ctx.first && s.kind === 'paragraph') return { section: 'purpose', kind: 'paragraph' };
  return { section: 'steps', kind: baseKind };
}

export function generateChapter(chapterTitle: string, input: GenSnippet[]): GenResult {
  const confirmed = input.filter((s) => CONFIRMED_EVIDENCE.includes(s.evidenceStatus)).sort((a, b) => a.order - b.order);
  const skippedUnconfirmed = input.length - confirmed.length;

  // Exakte Dopplungen innerhalb des Kapitels zusammenführen (allgemeine Aussagen nur einmal).
  const byHash = new Map<string, GenSnippet[]>();
  for (const s of confirmed) byHash.set(s.normHash, [...(byHash.get(s.normHash) ?? []), s]);
  const unique = [...byHash.values()].map((g) => g[0]);
  const deduplicated = confirmed.length - unique.length;

  const roleMajority = majority(unique.map((s) => setKey(specificCodes(s.roles))));
  const divMajority = majority(unique.map((s) => setKey(specificCodes(s.divisions))));

  const blocks: GenBlock[] = [];
  const xrefs = new Map<string, { title: string; lead: string; snippets: GenSnippet[] }>();
  let first = true;

  for (const s of unique) {
    const group = byHash.get(s.normHash)!;
    if (s.canonicalRedirect) {
      const r = s.canonicalRedirect;
      const x = xrefs.get(r.topicId) ?? { title: r.topicTitle, lead: r.leadChapterTitle, snippets: [] };
      x.snippets.push(...group);
      xrefs.set(r.topicId, x);
      continue;
    }
    const { section, kind } = assignSection(s, { first, roleMajority, divMajority });
    first = false;
    const roles = [...new Set(group.flatMap((g) => g.roles.map((r) => r.code)))];
    const divisions = [...new Set(group.flatMap((g) => g.divisions.map((d) => d.code)))];
    blocks.push({ section, kind, text: s.text, sourceIds: group.map((g) => g.id), roles, divisions, market: s.market, release: s.release, scopeStatus: scopeStatusOf(group) });
  }

  for (const x of xrefs.values()) {
    blocks.push({
      section: 'hints',
      kind: 'xref',
      text: `Siehe Kapitel „${x.lead}“ – ${x.title}.`,
      sourceIds: x.snippets.map((s) => s.id),
      roles: [...new Set(x.snippets.flatMap((g) => g.roles.map((r) => r.code)))],
      divisions: [...new Set(x.snippets.flatMap((g) => g.divisions.map((d) => d.code)))],
      market: null,
      release: null,
      scopeStatus: scopeStatusOf(x.snippets),
    });
  }

  // Rollen und Zuständigkeiten: nur aus bestätigten Rollenzuordnungen abgeleitet.
  if (!blocks.some((b) => b.section === 'responsibilities')) {
    const confirmedRoles = new Map<string, string[]>();
    for (const s of unique) for (const r of s.roles) if (isConfirmed(r)) confirmedRoles.set(r.code, [...(confirmedRoles.get(r.code) ?? []), s.id]);
    if (confirmedRoles.size) {
      const lines = ROLES.filter((r) => confirmedRoles.has(r.code)).map((r) => `- ${r.icon} ${r.label} (${r.description})`);
      blocks.push({ section: 'responsibilities', kind: 'list', text: `Dieses Kapitel betrifft folgende Rollen:\n\n${lines.join('\n')}`, sourceIds: [...new Set([...confirmedRoles.values()].flat())], roles: [...confirmedRoles.keys()], divisions: ['all'], market: null, release: null, scopeStatus: 'general' });
    }
  }

  // Quellen- und Freigabestatus
  if (unique.length) {
    const labels = [...new Set(confirmed.map((s) => s.sourceLabel))];
    blocks.push({
      section: 'status',
      kind: 'note',
      text: `Quellen: ${labels.join('; ')}. Freigabestatus: Entwurf (nicht freigegeben). ${skippedUnconfirmed ? `${skippedUnconfirmed} unbestätigte Textabschnitte wurden nicht übernommen.` : ''}`.trim(),
      sourceIds: confirmed.map((s) => s.id),
      roles: ['all'],
      divisions: ['all'],
      market: null,
      release: null,
      scopeStatus: 'general',
    });
  }

  const present = new Set(blocks.map((b) => b.section));
  const gaps = CHAPTER_SECTIONS.map((s) => s.code).filter((c) => !present.has(c)) as SectionCode[];
  for (const g of gaps) {
    blocks.push({ section: g, kind: 'gap', text: 'Für diesen Abschnitt liegt keine bestätigte Quelle vor.', sourceIds: [], roles: [], divisions: [], market: null, release: null, scopeStatus: 'unconfirmed' });
  }

  const order = CHAPTER_SECTIONS.map((s) => s.code) as string[];
  blocks.sort((a, b) => order.indexOf(a.section) - order.indexOf(b.section));
  void chapterTitle;
  return { blocks, gaps, usedSnippetIds: confirmed.map((s) => s.id), skippedUnconfirmed, deduplicated };
}
