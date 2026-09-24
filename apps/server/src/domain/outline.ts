// Gliederungen (ADR-032): Einlesen aus Markdown/JSON, Nummerierung, Ausgabe. Reine Fachlogik ohne I/O.
import { headingKey } from './markdown.js';
import { DIVISIONS, ROLES } from './reference.js';

export interface OutlineTreeNode {
  title: string;
  description?: string | null;
  children?: OutlineTreeNode[];
}

export const MAX_NODES = 1000;
const MAX_TITLE = 200;

const cleanTitle = (t: string) => t.replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE);
/** Führende Nummer entfernen („3.2 Aufträge“ → „Aufträge“) – die Nummer ergibt sich aus der Reihenfolge */
export const stripNumber = (t: string) => cleanTitle(t.replace(/^\s*(?:kapitel\s+)?\d+(?:\.\d+)*\.?\s+/i, ''));

/**
 * Markdown-Gliederung einlesen. Erkannt werden
 *   # Kapitel / ## Unterkapitel
 *   1. Kapitel / 1.1 Unterkapitel (nummeriert)
 *   - Kapitel /   - Unterkapitel (eingerückte Aufzählung)
 * Tiefere Ebenen werden dem Unterkapitel zugeschlagen (höchstens 2 Ebenen).
 */
export function parseOutlineMarkdown(text: string): OutlineTreeNode[] {
  const out: OutlineTreeNode[] = [];
  let current: OutlineTreeNode | null = null;
  let inFence = false;
  const add = (level: number, raw: string) => {
    const title = stripNumber(raw);
    if (!title) return;
    if (level === 1 || !current) {
      current = { title, children: [] };
      out.push(current);
    } else current.children!.push({ title });
  };
  for (const line of text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line.trim()) continue;
    let m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      add(m[1].length === 1 ? 1 : 2, m[2]);
      continue;
    }
    m = /^\s*(\d+(?:\.\d+)*)\.?\s+(.+)$/.exec(line);
    if (m) {
      add(m[1].split('.').filter(Boolean).length === 1 ? 1 : 2, m[2]);
      continue;
    }
    m = /^(\s*)[-*+]\s+(.+)$/.exec(line);
    if (m) add(m[1].replace(/\t/g, '  ').length >= 2 ? 2 : 1, m[2]);
  }
  return out;
}

/** JSON-Gliederung einlesen (Format des Exports: { nodes: [{ title, children: [{ title }] }] } oder direkt ein Array) */
export function parseOutlineJson(text: string): { tree: OutlineTreeNode[]; meta: Record<string, unknown> } {
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Keine gültige JSON-Datei.');
  }
  const nodes = Array.isArray(data) ? data : data?.nodes;
  if (!Array.isArray(nodes)) throw new Error('JSON muss ein Feld „nodes“ (Liste) enthalten.');
  const map = (n: any, level: number): OutlineTreeNode | null => {
    const title = cleanTitle(String(n?.title ?? ''));
    if (!title) return null;
    return { title, description: n?.description ? String(n.description).slice(0, 1000) : null, ...(level === 1 ? { children: (Array.isArray(n?.children) ? n.children : []).map((c: any) => map(c, 2)).filter(Boolean) } : {}) };
  };
  return { tree: nodes.map((n: any) => map(n, 1)).filter(Boolean) as OutlineTreeNode[], meta: Array.isArray(data) ? {} : data };
}

export function countNodes(tree: OutlineTreeNode[]) {
  return tree.reduce((n, c) => n + 1 + (c.children?.length ?? 0), 0);
}

export interface NumberedNode {
  id: string;
  parentId: string | null;
  level: number;
  position: number;
  title: string;
}

/** Nummern „1“, „1.2“ nach Reihenfolge */
export function numberNodes<T extends NumberedNode>(nodes: T[]): (T & { number: string })[] {
  const top = nodes.filter((n) => !n.parentId).sort((a, b) => a.position - b.position);
  const out: (T & { number: string })[] = [];
  top.forEach((c, i) => {
    out.push({ ...c, number: `${i + 1}` });
    nodes.filter((n) => n.parentId === c.id).sort((a, b) => a.position - b.position).forEach((s, j) => out.push({ ...s, number: `${i + 1}.${j + 1}` }));
  });
  return out;
}

export function outlineToMarkdown(title: string, nodes: (NumberedNode & { number: string })[]) {
  const lines = [`<!-- oneSCM-Gliederung: ${title.replace(/--/g, '–')} -->`, ''];
  for (const n of nodes) lines.push(`${n.level === 1 ? '#' : '##'} ${n.number} ${n.title}`);
  return `${lines.join('\n')}\n`;
}

/** Vergleichsschlüssel für die automatische Zuordnung (Nummern und Formatierung ignoriert) */
export const matchKey = (title: string) => headingKey(title);

const roleLabel = (c: string) => ROLES.find((r) => r.code === c)?.label ?? c;
const divisionLabel = (c: string) => DIVISIONS.find((d) => d.code === c)?.label ?? c;

/** Passt ein Schnipsel zur Variante einer Gliederung? Allgemeine Inhalte passen immer; „ungeklärt“ wird eigens gemeldet. */
export function variantProblems(
  snippet: { roles: string[]; divisions: string[]; market: string | null },
  outline: { roles: string[]; divisions: string[]; marketScope: 'blueprint' | 'markets'; markets: string[] },
): string[] {
  const problems: string[] = [];
  const general = (codes: string[]) => !codes.length || codes.includes('all');
  if (outline.roles.length && !general(snippet.roles) && !snippet.roles.some((r) => outline.roles.includes(r))) problems.push(`Rolle ${snippet.roles.map(roleLabel).join(', ')} gehört nicht zur Variante`);
  const divisions = snippet.divisions.filter((d) => d !== 'unconfirmed');
  if (outline.divisions.length) {
    if (!divisions.length && snippet.divisions.includes('unconfirmed')) problems.push('Sparte ungeklärt – bitte zuordnen');
    else if (!general(divisions) && !divisions.some((d) => outline.divisions.includes(d))) problems.push(`Sparte ${divisions.map(divisionLabel).join(', ')} gehört nicht zur Variante`);
  }
  if (snippet.market) {
    if (outline.marketScope === 'blueprint') problems.push(`marktspezifisch (${snippet.market}) in einer Blueprint-Gliederung`);
    else if (!outline.markets.includes(snippet.market)) problems.push(`Markt ${snippet.market} gehört nicht zur Variante`);
  }
  return problems;
}
