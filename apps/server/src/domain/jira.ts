// Jira-Import als Datei (ADR-081, F-01): XML-Export (RSS) und CSV-Export eines Jira-Filters → je Ticket eine Markdown-Quelle.
// ENTSCHEIDUNG(Q-05): keine Jira-Anbindung, nur Dateien. Personenfelder (Bearbeiter, Autor, Beobachter, Kommentare) werden
// nicht übernommen; Zusammenfassung und Beschreibung werden pseudonymisiert. Verknüpfte Tickets sind nur Metadaten, kein Inhalt.
import { htmlToMarkdown } from './convert.js';
import { pseudonymize } from './privacy.js';
import { parseCsv } from './tabular.js';

export interface JiraIssue {
  key: string;
  summary: string;
  type: string;
  status: string;
  priority: string;
  resolution: string;
  project: string;
  components: string[];
  fixVersions: string[];
  affectsVersions: string[];
  labels: string[];
  epic: string;
  sprint: string;
  created: string;
  updated: string;
  links: { type: string; key: string }[];
  /** Beschreibung als Markdown (aus HTML bzw. Jira-Wiki-Syntax umgewandelt) */
  description: string;
  /** Akzeptanzkriterien aus einem eigenen Feld, falls vorhanden */
  acceptance: string;
}

const KEY_RE = /^[A-Z][A-Z0-9_]+-\d+$/;

const decode = (s: string) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&');
const text = (s: string) => decode(s).replace(/\s+/g, ' ').trim();
const tagAll = (block: string, tag: string) => [...block.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => m[1]);
const tag = (block: string, t: string) => tagAll(block, t)[0] ?? '';
const isoDate = (s: string) => {
  const d = Date.parse(s);
  return Number.isNaN(d) ? s : new Date(d).toISOString().slice(0, 10);
};

/** Überschriften der Beschreibung unter die Ticketebene schieben (H4 … H6): sie dürfen keine Kapitel erzeugen */
const demoteHtml = (html: string) => html.replace(/<(\/?)h([1-6])\b/gi, (_, slash, n) => `<${slash}h${Math.min(6, Number(n) + 3)}`);

function htmlFragment(html: string) {
  if (!html.trim()) return '';
  return htmlToMarkdown(`<body>${demoteHtml(html)}</body>`).markdown.trim();
}

/** Jira-Wiki-Syntax (CSV-Export) in Markdown – Überschriften, Listen, Code, Fett, Links */
export function wikiToMarkdown(wiki: string) {
  let inCode = false;
  return wiki.replace(/\r\n?/g, '\n').split('\n').map((line) => {
    if (/^\s*\{(code|noformat)[^}]*\}\s*$/.test(line)) {
      inCode = !inCode;
      return '```';
    }
    if (inCode) return line;
    return line
      .replace(/^h([1-6])\.\s+/, (_, n) => `${'#'.repeat(Math.min(6, Number(n) + 3))} `)
      .replace(/^(#+)\s+(?=\S)/, (m, h) => (/^h/.test(line) ? m : `${'   '.repeat(h.length - 1)}1. `))
      .replace(/^(\*+)\s+/, (_, s) => `${'  '.repeat(s.length - 1)}- `)
      .replace(/\*([^*\n]+)\*/g, '**$1**')
      .replace(/\[([^|\]]+)\|([^\]]+)\]/g, '[$1]($2)')
      .replace(/\{\{([^}]+)\}\}/g, '`$1`');
  }).join('\n').trim();
}

/** Jira-XML-Export (RSS, „Exportieren › XML“) – null, wenn die Datei kein solcher Export ist */
export function parseJiraXml(xml: string): JiraIssue[] | null {
  if (!/<rss\b/i.test(xml) || !/<item\b/i.test(xml) || !/<key\b/i.test(xml)) return null;
  const issues: JiraIssue[] = [];
  for (const item of tagAll(xml, 'item')) {
    const key = text(tag(item, 'key'));
    if (!KEY_RE.test(key)) continue;
    const custom = (name: string) => {
      for (const cf of tagAll(item, 'customfield')) {
        if (text(tag(cf, 'customfieldname')).toLowerCase() === name) return tagAll(cf, 'customfieldvalue').map((v) => decode(v).trim()).filter(Boolean);
      }
      return [] as string[];
    };
    const links: JiraIssue['links'] = [];
    for (const lt of tagAll(item, 'issuelinktype')) {
      for (const dir of [...lt.matchAll(/<(?:outwardlinks|inwardlinks)\b[^>]*description="([^"]*)"[^>]*>([\s\S]*?)<\/(?:outwardlinks|inwardlinks)>/g)]) {
        for (const k of tagAll(dir[2], 'issuekey')) links.push({ type: text(dir[1]), key: text(k) });
      }
    }
    const acceptance = custom('acceptance criteria').concat(custom('akzeptanzkriterien'));
    issues.push({
      key,
      summary: text(tag(item, 'summary')) || text(tag(item, 'title')).replace(/^\[[^\]]+\]\s*/, ''),
      type: text(tag(item, 'type')), status: text(tag(item, 'status')), priority: text(tag(item, 'priority')), resolution: text(tag(item, 'resolution')),
      project: text(tag(item, 'project')),
      components: tagAll(item, 'component').map(text), fixVersions: tagAll(item, 'fixVersion').map(text), affectsVersions: tagAll(item, 'version').map(text),
      labels: tagAll(tag(item, 'labels'), 'label').map(text),
      epic: [...custom('epic link'), ...custom('epic name')].map(text)[0] ?? '', sprint: custom('sprint').map(text).join(', '),
      created: isoDate(text(tag(item, 'created'))), updated: isoDate(text(tag(item, 'updated'))),
      links,
      description: htmlFragment(decode(tag(item, 'description'))),
      acceptance: acceptance.map((a) => htmlFragment(a)).join('\n\n'),
    });
  }
  return issues;
}

// Spaltennamen des CSV-Exports (englische und deutsche Oberfläche)
const CSV_FIELDS: Record<keyof Omit<JiraIssue, 'links' | 'description' | 'acceptance'> | 'description' | 'acceptance' | 'links', string[]> = {
  key: ['issue key', 'schlüssel', 'vorgangsschlüssel', 'key'],
  summary: ['summary', 'zusammenfassung'],
  type: ['issue type', 'vorgangstyp', 'typ'],
  status: ['status'],
  priority: ['priority', 'priorität'],
  resolution: ['resolution', 'lösung'],
  project: ['project name', 'projektname', 'project', 'projekt'],
  components: ['component/s', 'components', 'komponente/n', 'komponenten'],
  fixVersions: ['fix version/s', 'fix versions', 'lösungsversion/en', 'lösungsversion'],
  affectsVersions: ['affects version/s', 'affects versions', 'betrifft version/en', 'betroffene version/en'],
  labels: ['labels', 'stichwörter'],
  epic: ['custom field (epic link)', 'epic link', 'parent', 'übergeordnet'],
  sprint: ['sprint'],
  created: ['created', 'erstellt'],
  updated: ['updated', 'aktualisiert'],
  description: ['description', 'beschreibung'],
  acceptance: ['custom field (acceptance criteria)', 'acceptance criteria', 'akzeptanzkriterien'],
  links: [],
};

/** Jira-CSV-Export – null, wenn die Spalten „Issue key“ und „Summary“ (bzw. deutsch) fehlen */
export function parseJiraCsv(csv: string): JiraIssue[] | null {
  const rows = parseCsv(csv.replace(/^﻿/, ''));
  if (rows.length < 2) return null;
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const cols = (field: keyof typeof CSV_FIELDS) => head.map((h, i) => (CSV_FIELDS[field].includes(h) ? i : -1)).filter((i) => i >= 0);
  if (!cols('key').length || !cols('summary').length) return null;
  // Spalten wie „Component/s“ wiederholen sich im Export je Wert; Verknüpfungen: „Outward issue link (relates)“
  const linkCols = head.map((h, i) => [h, i] as const).filter(([h]) => /^(outward|inward) issue link \(/.test(h));
  const issues: JiraIssue[] = [];
  for (const r of rows.slice(1)) {
    const one = (f: keyof typeof CSV_FIELDS) => cols(f).map((i) => (r[i] ?? '').trim()).find(Boolean) ?? '';
    const many = (f: keyof typeof CSV_FIELDS) => cols(f).flatMap((i) => (r[i] ?? '').split(/;\s*/)).map((x) => x.trim()).filter(Boolean);
    const key = one('key');
    if (!KEY_RE.test(key)) continue;
    issues.push({
      key, summary: one('summary'), type: one('type'), status: one('status'), priority: one('priority'), resolution: one('resolution'), project: one('project'),
      components: many('components'), fixVersions: many('fixVersions'), affectsVersions: many('affectsVersions'), labels: many('labels').flatMap((l) => l.split(/\s+/)),
      epic: one('epic'), sprint: many('sprint').join(', '), created: isoDate(one('created')), updated: isoDate(one('updated')),
      links: linkCols.flatMap(([h, i]) => ((r[i] ?? '').trim() ? [{ type: /\((.*)\)/.exec(h)![1], key: r[i].trim() }] : [])),
      description: wikiToMarkdown(one('description')),
      acceptance: wikiToMarkdown(one('acceptance')),
    });
  }
  return issues;
}

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const yamlStr = (s: string) => JSON.stringify(s);

/** Ein Ticket als Markdown-Quelle: H1 „Jira-Tickets“ (ein Kapitel für alle Tickets), H2 je Ticket, H3 je Abschnitt */
export function issueToMarkdown(issue: JiraIssue, opts: { names?: string[] } = {}) {
  const clean = (s: string) => pseudonymize(s, { names: opts.names }).text;
  const summary = clean(issue.summary);
  const felder: [string, string][] = [
    ['Ticket', issue.key], ['Typ', issue.type], ['Status', issue.status], ['Priorität', issue.priority], ['Lösung', issue.resolution],
    ['Projekt', issue.project], ['Komponente', issue.components.join(', ')], ['Lösungsversion (PI)', issue.fixVersions.join(', ') || 'PI TBD'],
    ['Betrifft Version', issue.affectsVersions.join(', ')], ['Labels', issue.labels.join(', ')], ['Epic', issue.epic], ['Sprint', issue.sprint],
    ['Erstellt', issue.created], ['Aktualisiert', issue.updated],
  ];
  const fm = [
    '---', 'evidence_status: unconfirmed', 'source_type: jira', `jira_key: ${yamlStr(issue.key)}`, `jira_type: ${yamlStr(issue.type)}`,
    `jira_status: ${yamlStr(issue.status)}`, `jira_fix_versions: ${JSON.stringify(issue.fixVersions)}`, `jira_components: ${JSON.stringify(issue.components)}`,
    `jira_epic: ${yamlStr(issue.epic)}`, `jira_created: ${yamlStr(issue.created)}`,
    'jira_note: "Ticket- und Teststatus sind kein Nachweis für den Produktivstand."', '---',
  ];
  const md = [...fm, '', '# Jira-Tickets', '', `## ${issue.key} ${summary}`, '', '| Feld | Wert |', '|---|---|',
    ...felder.filter(([, v]) => v).map(([k, v]) => `| ${k} | ${cell(v)} |`), ''];
  if (issue.description) md.push('### Beschreibung', '', clean(issue.description), '');
  if (issue.acceptance) md.push('### Akzeptanzkriterien', '', clean(issue.acceptance), '');
  // feste Hinweistexte gehören in die Front-Matter: gleiche Absätze in allen Tickets würden als Dopplungen gemeldet
  if (issue.links.length) md.push('### Verknüpfte Tickets (Hinweis, kein Inhalt)', '', ...issue.links.map((l) => `- ${l.type}: ${l.key}`), '');
  const original = { ...issue, summary, description: issue.description ? clean(issue.description) : '', acceptance: issue.acceptance ? clean(issue.acceptance) : '' };
  return { markdown: md.join('\n'), original: JSON.stringify(original, null, 2) };
}

/** Jira-Export erkennen (XML oder CSV); null = kein Jira-Export */
export function parseJira(fileName: string, data: Buffer): JiraIssue[] | null {
  const raw = data.toString('utf8');
  if (/\.xml$/i.test(fileName)) return parseJiraXml(raw);
  if (/\.csv$/i.test(fileName)) return parseJiraCsv(raw);
  return null;
}
