// Releaseletter und Release-Abgleich aus Jira-Tickets (ADR-083, F-02, F-03). Rein regelbasiert und lokal:
// Fakten nur aus den Ticketfeldern, feste Guardrails (Datum nur aus „Erstellt“, „PI TBD“ ohne Version, verknüpfte Tickets
// sind kein Inhalt, Status wörtlich, Typ wahrheitsgemäß, Verfasser „oneSCM Team“), Prüfregeln Ticket ↔ Letter mit Urteil.
// Übernommen aus den Artefakten „Releaseletter-Generator“, „Releaseletter-Prüfer“ und „Ticket-Cockpit“ (docs/07, F-02/F-03).
import { detectPrivacy } from './privacy.js';

export interface ReleaseTicket {
  key: string; summary: string; type: string; status: string; priority: string; resolution: string; project: string;
  components: string[]; fixVersions: string[]; affectsVersions: string[]; labels: string[]; created: string; updated: string;
  links: { type: string; key: string }[]; description: string; acceptance: string;
}

// ---------------------------------------------------------------- Status, Klassifizierung, Version

export type StatusBucket = 'done' | 'backlog' | 'progress' | 'blocked' | 'cancelled';
export const STATUS_BUCKET_LABEL: Record<StatusBucket, string> = { done: 'Erledigt', backlog: 'Offen / Backlog', progress: 'In Bearbeitung', blocked: 'Blockiert', cancelled: 'Abgebrochen' };
const BUCKET_OF_STATUS: Record<string, StatusBucket> = {
  fertig: 'done', geschlossen: 'done', cancelled: 'cancelled', offen: 'backlog', 'dev backlog': 'backlog', 'pi backlog': 'backlog', 'in refinement': 'backlog',
  'in analysis': 'backlog', 'bat testing': 'progress', 'qg-bu': 'progress', 'blocked bat testing': 'blocked',
};
/** Statusgruppe: feste Zuordnung (Ticket-Cockpit), sonst Muster in dieser Reihenfolge */
export function statusBucket(status: string): StatusBucket {
  const s = status.trim().toLowerCase();
  if (BUCKET_OF_STATUS[s]) return BUCKET_OF_STATUS[s];
  if (/closed|done|erledigt|geschlossen|resolved|fertig/.test(s)) return 'done';
  if (/cancel|abgebrochen|verworfen|won't|rejected/.test(s)) return 'cancelled';
  if (/block/.test(s)) return 'blocked';
  if (/progress|review|test|analysis|bearbeitung|refine/.test(s)) return 'progress';
  return 'backlog';
}

export type ManualClass = 'manual' | 'internal' | 'unknown';
export const MANUAL_CLASS_LABEL: Record<ManualClass, string> = { manual: 'Benutzerhandbuch-Kandidat', internal: 'Intern / Bug', unknown: 'Unbekannt (kein Typ im Export)' };
/** F-03: Bug = intern, alle anderen Typen sind Kandidaten für das Handbuch; ohne Typ „unbekannt“ */
export function manualClass(type: string): ManualClass {
  if (!type.trim()) return 'unknown';
  return /bug|fehler|defect/i.test(type) ? 'internal' : 'manual';
}

/**
 * Ticket-Einstufung (ADR-102, W-03, Ticket-Cockpit): genehmigt und in Prüfung fließen ins Handbuch, intern und Background nicht;
 * Background zählt nur in der Lückenanalyse. Ohne Einstufung durch einen Menschen: Bug = intern, sonst „in Prüfung“.
 */
export const TICKET_CLASSES = ['approved', 'review', 'internal', 'background'] as const;
export type TicketClass = (typeof TICKET_CLASSES)[number];
export const TICKET_CLASS_LABEL: Record<TicketClass, string> = { approved: 'genehmigt', review: 'in Prüfung', internal: 'intern', background: 'Background' };
export const TICKET_CLASS_HINT: Record<TicketClass, string> = {
  approved: 'fließt ins Handbuch und in Releaseletter',
  review: 'fließt ins Handbuch; Einstufung noch nicht bestätigt',
  internal: 'nicht im Handbuch; im Releaseletter nur als behobener Fehler (Bug)',
  background: 'nicht im Handbuch und nicht im Releaseletter; nur Lückenanalyse',
};
export const isTicketClass = (v: unknown): v is TicketClass => typeof v === 'string' && (TICKET_CLASSES as readonly string[]).includes(v);
export const defaultTicketClass = (type: string): TicketClass => (manualClass(type) === 'internal' ? 'internal' : 'review');
/** Quelle für Kapitel (Generierung) */
export const ticketFeedsManual = (c: TicketClass) => c === 'approved' || c === 'review';
/** Inhalt eines Releaseletters: kein Background; intern nur Bugs (Abschnitt „Behobene Fehler“) */
export const ticketInLetter = (c: TicketClass, type: string) => c !== 'background' && (c !== 'internal' || manualClass(type) === 'internal');

const isNone = (v: string) => !v.trim() || /^(keine|none)$/i.test(v.trim());
/** Release-Angabe nur aus Lösungs- bzw. betroffener Version, sonst „PI TBD“ – nie erfunden */
export function piLabel(t: Pick<ReleaseTicket, 'fixVersions' | 'affectsVersions'>) {
  const fix = t.fixVersions.filter((v) => !isNone(v));
  const aff = t.affectsVersions.filter((v) => !isNone(v));
  return fix[0] ?? aff[0] ?? 'PI TBD';
}
/** Typ wahrheitsgemäß: ein Test ist ein Testfall, nie ein Feature */
export function typeLabel(type: string, lang: 'de' | 'en' = 'de') {
  if (/test/i.test(type)) return lang === 'de' ? 'Testfall / Validierung' : 'Test case / validation';
  return type || (lang === 'de' ? 'unbekannt' : 'unknown');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_DE: Record<string, number> = { jan: 0, feb: 1, mär: 2, mrz: 2, mar: 2, apr: 3, mai: 4, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, dez: 11, dec: 11 };
/** Datum „Erstellt“ als DD MMM YYYY (Jira-XML „Mon, 5 Feb 2024 …“, CSV „05/Feb/24 …“, ISO); sonst wie geliefert */
export function formatJiraDate(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  let m = s.match(/(\d{1,2})[/. -]([A-Za-zäÄ]{3})[a-zä]*[/. -](\d{2,4})/);
  if (m && MONTH_DE[m[2].toLowerCase()] !== undefined) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${m[1].padStart(2, '0')} ${MONTHS[MONTH_DE[m[2].toLowerCase()]]} ${y}`;
  }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  return s;
}

/** Abschnitt der Beschreibung („Target State: …“ oder Überschrift „Target State“) */
export function descriptionSection(description: string, ...names: string[]) {
  for (const n of names) {
    const inline = description.match(new RegExp(`(?:^|\\n)\\s*(?:\\*\\*)?${n}(?:\\*\\*)?\\s*[:\\-]\\s*([^\\n]+)`, 'i'));
    if (inline) return inline[1].trim();
    const block = description.match(new RegExp(`(?:^|\\n)#+\\s*${n}\\s*\\n+([\\s\\S]*?)(?=\\n#+\\s|$)`, 'i'));
    if (block) return block[1].trim();
  }
  return '';
}

const sentences = (t: string, n: number) => t.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, n).join(' ');

// ---------------------------------------------------------------- Releaseletter erzeugen

export type Audience = 'mgmt' | 'biz' | 'it' | 'end';
export const AUDIENCES: Audience[] = ['mgmt', 'biz', 'it', 'end'];
export const AUDIENCE_LABEL: Record<Audience, string> = { mgmt: 'Management (Kurzfassung)', biz: 'Fachbereich', it: 'IT und Entwicklung', end: 'Endanwender' };
export const DIVISION_TEXT: Record<string, { de: string; en: string }> = { car: { de: 'Pkw', en: 'Car' }, van: { de: 'Van', en: 'Van' }, all: { de: 'Pkw und Van', en: 'Car and van' } };

export interface LetterOptions {
  language: 'de' | 'en'; audience: Audience; country: string; division: string;
  title?: string; release?: string;
}

const T = {
  de: {
    title: 'oneSCM Consolidated Release', meta: 'Metadaten', release: 'Release', date: 'Datum (Jira „Erstellt“)', prepared: 'Erstellt von', source: 'Quelle', sourceValue: 'Jira-Export (lokal)',
    audience: 'Zielgruppe', market: 'Markt', division: 'Sparte', overview: 'Überblick', summary: 'Zusammenfassung', features: 'Neue Funktionen und Änderungen', fixes: 'Fehlerbehebungen',
    tests: 'Testfälle und Validierung', product: 'Produkt', keyChanges: 'Wichtige Änderungen', benefits: 'Nutzen laut Ticket', notes: 'Hinweise', open: 'Bekannte Einschränkungen und offene Punkte',
    details: 'Details je Ticket', reference: 'Referenz', description: 'Beschreibung', steps: 'Ablauf', acceptance: 'Abnahmekriterien', footer: 'Release-Paket', footerDate: 'Release-Datum',
    draftRef: 'Referenzentwurf', created: 'Erstellt', validation: 'Validierungsstatus (Jira, wörtlich)', verified: '[belegt aus Jira]', editorial: '[redaktionell – vor Veröffentlichung fachlich bestätigen]',
    noOpen: 'Keine offenen Punkte bekannt.', freeText: 'Ticketinhalte stehen in der Sprache des Tickets; sie werden nicht automatisch übersetzt.',
    localize: (c: string) => `Für Markt ${c} ist eine Lokalisierung erforderlich.`, statusWord: 'Status', typeWord: 'Typ', component: 'Komponente', priority: 'Priorität', labels: 'Labels',
    count: (n: number) => `${n} ${n === 1 ? 'Ticket' : 'Tickets'}`, mgmtNote: 'Kurzfassung: nur belegte Fakten aus den Tickets.', endIntro: 'Was sich ändert:',
  },
  en: {
    title: 'oneSCM Consolidated Release', meta: 'Metadata', release: 'Release', date: 'Date (Jira “Created”)', prepared: 'Prepared by', source: 'Source', sourceValue: 'Jira export (local)',
    audience: 'Audience', market: 'Market', division: 'Division', overview: 'Overview', summary: 'Summary', features: 'New features and changes', fixes: 'Bug fixes',
    tests: 'Test cases and validation', product: 'Product', keyChanges: 'Key changes', benefits: 'Benefits according to ticket', notes: 'Notes', open: 'Known limitations and open items',
    details: 'Details per ticket', reference: 'Reference', description: 'Description', steps: 'Business flow', acceptance: 'Acceptance criteria', footer: 'Release package', footerDate: 'Release date',
    draftRef: 'Reference draft', created: 'Created', validation: 'Validation status (Jira, verbatim)', verified: '[verified from Jira]', editorial: '[editorial – confirm before publication]',
    noOpen: 'No open items known.', freeText: 'Ticket contents are shown in the language of the ticket; they are not translated automatically.',
    localize: (c: string) => `Localisation is required for market ${c}.`, statusWord: 'Status', typeWord: 'Type', component: 'Component', priority: 'Priority', labels: 'Labels',
    count: (n: number) => `${n} ${n === 1 ? 'ticket' : 'tickets'}`, mgmtNote: 'Short version: only facts backed by the tickets.', endIntro: 'What changes:',
  },
};

/** Neuestes „Erstellt“ der Tickets – nie das Laufdatum */
export function letterDate(tickets: ReleaseTicket[]) {
  const dated = tickets.map((t) => ({ t, d: Date.parse(t.created) })).filter((x) => x.t.created);
  if (!dated.length) return '';
  const best = dated.some((x) => !Number.isNaN(x.d)) ? dated.filter((x) => !Number.isNaN(x.d)).sort((a, b) => b.d - a.d)[0] : dated[0];
  return formatJiraDate(best.t.created);
}

/** Releaseletter als Markdown – ausschließlich aus Ticketfeldern; stornierte Tickets gehören nicht dazu */
export function buildReleaseLetter(all: ReleaseTicket[], opts: LetterOptions) {
  const L = T[opts.language];
  const tickets = all.filter((t) => statusBucket(t.status) !== 'cancelled').sort((a, b) => a.key.localeCompare(b.key, 'en', { numeric: true }));
  const pis = [...new Set(tickets.map(piLabel))];
  const release = opts.release?.trim() || (pis.length === 1 ? pis[0] : pis.filter((p) => p !== 'PI TBD')[0] ?? 'PI TBD');
  const date = letterDate(tickets) || (opts.language === 'de' ? 'unbekannt – Quelle prüfen' : 'unknown – check source');
  const id = `RL-ONESCM-${date.replace(/\D/g, '').slice(-8) || 'TBD'}-RC01`;
  const div = DIVISION_TEXT[opts.division]?.[opts.language] ?? DIVISION_TEXT.all[opts.language];
  const full = opts.audience === 'biz' || opts.audience === 'it';
  const out: string[] = [`# ${opts.title?.trim() || `${L.title} ${release} – ${date}`}`, '', `${id} · ${L.count(tickets.length)}`, '', `## ${L.meta}`, '',
    `| | |`, `|---|---|`, `| ${L.release} | ${release} |`, `| ${L.date} | ${date} |`, `| ${L.prepared} | oneSCM Team |`, `| ${L.source} | ${L.sourceValue} |`,
    `| ${L.audience} | ${AUDIENCE_LABEL[opts.audience]} |`, `| ${L.market} | ${opts.country || 'DE'} |`, `| ${L.division} | ${div} |`, ''];
  const line = (t: ReleaseTicket) => {
    const parts = [`**${t.key}** – ${t.summary || '–'}`];
    if (opts.audience !== 'end') parts.push(`${L.typeWord}: ${typeLabel(t.type, opts.language)}`, `${L.statusWord}: ${t.status || '–'}`);
    if (full && t.components.length) parts.push(`${L.component}: ${t.components.join(', ')}`);
    if (opts.audience === 'it' && t.priority) parts.push(`${L.priority}: ${t.priority}`);
    if (opts.audience === 'it' && t.labels.length) parts.push(`${L.labels}: ${t.labels.join(', ')}`);
    return `- ${parts.join(' · ')} ${L.verified}`;
  };
  const features = tickets.filter((t) => manualClass(t.type) !== 'internal' && !/test/i.test(t.type));
  const fixes = tickets.filter((t) => manualClass(t.type) === 'internal');
  const tests = tickets.filter((t) => /test/i.test(t.type));
  out.push(`## ${L.overview}`, '');
  if (opts.audience === 'mgmt') out.push(L.mgmtNote, '');
  if (opts.audience === 'end') out.push(L.endIntro, '');
  out.push(...tickets.map((t) => `- ${t.summary || t.key} (${t.key})`), '');
  out.push(`## ${L.summary}`, '', `| | |`, `|---|---|`, `| ${L.release} | ${release} |`, `| ${L.features} | ${features.length} |`, `| ${L.fixes} | ${fixes.length} |`,
    `| ${L.tests} | ${tests.length} |`, `| ${L.product} | oneSCM |`, '');
  out.push(`## ${L.keyChanges}`, '');
  if (features.length) out.push(`### ${L.features}`, '', ...features.map(line), '');
  if (fixes.length && opts.audience !== 'end') out.push(`### ${L.fixes}`, '', ...fixes.map(line), '');
  if (tests.length && opts.audience !== 'end') out.push(`### ${L.tests}`, '', ...tests.map(line), '');
  if (opts.audience !== 'mgmt') {
    const benefits = tickets.map((t) => ({ t, b: descriptionSection(t.description, 'Target State', 'Zielzustand') || sentences(t.acceptance, 1) })).filter((x) => x.b);
    if (benefits.length) out.push(`## ${L.benefits}`, '', ...benefits.map((x) => `- ${x.t.key}: ${sentences(x.b, 2)} ${L.verified}`), '');
  }
  const open = tickets.filter((t) => statusBucket(t.status) !== 'done');
  out.push(`## ${L.notes}`, '', L.freeText, '');
  if (opts.country && opts.country !== 'DE') out.push(`${L.localize(opts.country)} ${L.editorial}`, '');
  out.push(`### ${L.open}`, '', ...(open.length ? open.map((t) => `- ${t.key}: ${t.summary} (${L.statusWord}: ${t.status || '–'})`) : [L.noOpen]), '');
  if (full) {
    out.push(`## ${L.details}`, '');
    for (const t of tickets) {
      out.push(`### ${t.key} ${t.summary}`, '', `${L.reference}: ${t.key}${t.components.length ? ` – ${t.components.join(', ')}` : ''}${t.created ? ` · ${L.created}: ${formatJiraDate(t.created)}` : ''}`, '');
      const desc = descriptionSection(t.description, 'Target State', 'Zielzustand') ? [descriptionSection(t.description, 'Current State', 'Aktueller Zustand'), descriptionSection(t.description, 'Target State', 'Zielzustand'), descriptionSection(t.description, 'Extra Details')].filter(Boolean).join(' ') : t.description.split('\n').filter((l) => l.trim() && !/^\s*#/.test(l)).join(' ');
      if (desc) out.push(`**${L.description}:** ${sentences(desc, 4)} ${L.verified}`, '');
      const flow = descriptionSection(t.description, 'Business Flow', 'Ablauf');
      if (flow) out.push(`**${L.steps}:** ${flow}`, '');
      if (t.acceptance) out.push(`**${L.acceptance}:** ${sentences(t.acceptance, 3)}`, '');
    }
  }
  out.push('---', '', `${L.footer}: ${release} · ${L.footerDate}: ${date} · ${L.draftRef}: oneSCM_release_letter_${id}.docx`, '',
    `${L.validation}: ${tickets.map((t) => `${t.key} ${t.status || '–'}`).join('; ') || '–'}`, '');
  return { markdown: out.join('\n'), release, date, id, keys: tickets.map((t) => t.key) };
}

// ---------------------------------------------------------------- Prüfregeln Ticket ↔ Letter

export type Severity = 'fail' | 'warn' | 'hint';
export interface LetterFinding { rule: string; severity: Severity; ticket: string | null; title: string; recommendation: string; detail?: string }
export type Verdict = 'block' | 'cond' | 'ok';
export const VERDICT_LABEL: Record<Verdict, string> = { block: 'Nicht freigeben', cond: 'Bedingt freigeben', ok: 'Freigabe möglich' };
export const VERDICT_TEXT: Record<Verdict, string> = {
  block: 'Der Releaseletter enthält kritische Abweichungen oder personenbezogene Daten und darf so nicht veröffentlicht werden.',
  cond: 'Der Releaseletter ist grundsätzlich nutzbar, benötigt aber Korrekturen vor der Freigabe.',
  ok: 'Keine kritischen Abweichungen gefunden. Empfehlungen prüfen und freigeben.',
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const has = (hay: string, v: string) => !!v.trim() && norm(hay).includes(norm(v));
const KEY_RE = /(?<![A-Z0-9-])[A-Z][A-Z0-9]{1,9}-\d+\b/g;
const FEATURE_RE = /neues?\s*feature|new feature|\bfeature\b|bugfix|change request/i;
const STATUS_SUBST = /release[- ]?kandidat|validierungsphase|release candidate|validation phase/i;
const DONE_CLAIM = /erfolgreich|abgeschlossen|validiert|umgesetzt|erledigt|implementiert|successfully|completed|delivered|ausgeliefert/i;
const PI_RE = /\bPI\s?(?:TBD|20\d\d[.-]\d|\d{1,2})\b/gi;
const DATE_RE = /\b\d{1,2}\.?\s?(?:Jan|Feb|Mär|Mar|Apr|Mai|May|Jun|Jul|Aug|Sep|Okt|Oct|Nov|Dez|Dec)[a-zä.]*\s?20\d\d\b|\b\d{1,2}\.\d{1,2}\.20\d\d\b|\b20\d\d-\d{2}-\d{2}\b/gi;
const BUZZ = ['Effizienz', 'Benutzerfreundlichkeit', 'Datenqualität', 'Bestandsübersicht', 'Optimierung', 'optimiert', 'efficiency', 'user-friendliness', 'data quality', 'seamless', 'robust', 'streamlined', 'enhanced flexibility', 'greater flexibility'];

/** Text eines Tickets im Letter: Absätze mit dem Schlüssel; bei einem einzigen Ticket der ganze Letter */
function segmentOf(text: string, key: string, single: boolean) {
  if (single) return text;
  const blocks = text.split(/\n\s*\n/);
  const out: string[] = [];
  let inSection = false;
  for (const b of blocks) {
    const heading = /^\s*#{1,6}\s/.test(b);
    if (heading) inSection = b.includes(key);
    if (inSection || b.includes(key)) out.push(b.split('\n').filter((l) => l.includes(key) || inSection).join('\n'));
  }
  return out.join('\n\n');
}

export interface LetterCheck {
  verdict: Verdict; findings: LetterFinding[];
  counts: { fail: number; warn: number; hint: number }; pii: { kind: string; match: string }[];
  coverage: number; phantoms: string[]; missingTickets: string[];
}

/**
 * Prüfregeln 1–12 (mit 10b Phantom-Tickets und 10c Datumsherkunft) je Ticket des Umfangs.
 * Urteil: Fehler oder personenbezogene Daten → nicht freigeben; Warnungen → bedingt; sonst Freigabe möglich. Hinweise zählen nicht.
 */
export function checkReleaseLetter(text: string, tickets: ReleaseTicket[], opts: { audience?: Audience; names?: string[] } = {}): LetterCheck {
  const findings: LetterFinding[] = [];
  const add = (rule: string, severity: Severity, ticket: string | null, title: string, recommendation: string, detail?: string) => findings.push({ rule, severity, ticket, title, recommendation, ...(detail ? { detail } : {}) });
  const scope = new Set(tickets.map((t) => t.key));
  const single = tickets.length === 1;
  const metadata = !opts.audience || opts.audience === 'biz' || opts.audience === 'it';
  let present = 0;
  let total = 0;
  const cover = (v: string, seg: string) => { if (v.trim()) { total++; if (has(seg, v)) present++; } };
  const missingTickets: string[] = [];
  for (const t of tickets) {
    // 11 Traceability
    if (!text.includes(t.key)) {
      missingTickets.push(t.key);
      add('11', 'warn', t.key, 'Ticket-Referenz fehlt', 'Die eindeutige Ticketnummer fehlt im Releaseletter (Traceability). Je Aussage die Ticketnummer nennen.');
      continue;
    }
    const seg = segmentOf(text, t.key, single);
    [t.key, t.summary, t.status, t.type, t.priority, t.project, ...t.components, ...t.labels].forEach((v) => cover(v, seg));
    // 1 Vorgangstyp
    if (/test/i.test(t.type) && FEATURE_RE.test(seg)) add('1', 'fail', t.key, 'Vorgangstyp verfälscht', 'Aus einem Testfall darf kein Feature werden. Empfehlung: „Testfall / Validierung“ statt „Neues Feature“.');
    else if (t.type && !has(seg, t.type) && !has(seg, typeLabel(t.type, 'de')) && !has(seg, typeLabel(t.type, 'en')) && opts.audience !== 'end') add('1', 'warn', t.key, 'Vorgangstyp fehlt', 'Den Jira-Typ wahrheitsgemäß angeben.');
    // 2 Status
    if (t.status && !has(seg, t.status)) {
      if (STATUS_SUBST.test(seg)) add('2', 'warn', t.key, 'Status nicht aus Quelle ableitbar', 'Jira-Status wörtlich übernehmen; „Release Candidate / Validation Phase“ ist nicht aus der Quelle belegt.');
      else if (opts.audience !== 'end') add('2', 'warn', t.key, 'Status fehlt', 'Jira-Status wörtlich übernehmen.');
    }
    if (metadata) {
      // 3 Priorität, 4 Projekt, 5 Komponente, 7 Labels – nur bei Fachbereich und IT (Kurzfassung und Endanwender bewusst ohne)
      if (opts.audience === 'it' && t.priority && !has(seg, t.priority)) add('3', 'warn', t.key, 'Priorität fehlt', 'Priorität als Release- und Management-Signal angeben.');
      if (opts.audience === 'it' && t.project && !has(text, t.project)) add('4', 'warn', t.key, 'Exakter Projektname fehlt', 'Für die Traceability den Projektnamen ergänzen.');
      const comp = t.components.filter((c) => !has(seg, c));
      if (comp.length) add('5', 'warn', t.key, 'Exakte Komponente fehlt', 'Exakte Komponente inkl. Nummer angeben.', comp.join(', '));
      const labels = t.labels.filter((l) => !has(seg, l));
      if (opts.audience === 'it' && labels.length) add('7', 'warn', t.key, `Labels fehlen: ${labels.join(', ')}`, 'Besonders Test- und Automatisierungslabels sind relevant.');
    }
    // 6 Resolution: offenes Ticket als fertig kommuniziert (Wortlaut aus dem Ticket selbst zählt nicht)
    const own = `${t.summary} ${t.description} ${t.acceptance}`;
    const claims = [...new Set((seg.match(new RegExp(DONE_CLAIM.source, 'gi')) ?? []).map((w) => w.toLowerCase()))].filter((w) => !has(own, w));
    if (statusBucket(t.status) !== 'done' && claims.length) add('6', 'fail', t.key, 'Erledigung widersprüchlich', 'Nicht als fertig kommunizieren, solange das Ticket offen ist.', `${t.status}: ${claims.join(', ')}`);
    // 9 Jira-Historie
    if (t.created && !has(seg, t.created) && !has(seg, formatJiraDate(t.created)) && !(t.updated && has(seg, t.updated))) add('9', 'hint', t.key, 'Jira-Historie fehlt', 'Erstellt/Aktualisiert vom Release-Datum klar trennen.');
  }
  // 10 PI-Version
  const versions = new Set(tickets.flatMap((t) => [...t.fixVersions, ...t.affectsVersions]).filter((v) => !isNone(v)).map(norm));
  const pis = [...new Set((text.match(PI_RE) ?? []).map((p) => p.replace(/\s+/g, ' ').toUpperCase()))];
  const concrete = pis.filter((p) => !/TBD/.test(p));
  if (concrete.length && pis.some((p) => /TBD/.test(p))) add('10', 'fail', null, 'PI-Angaben widersprüchlich', 'Eine konsistente, belegte Release-Angabe verwenden (Titel = Zusammenfassung = Fußzeile).', pis.join(', '));
  else {
    const unbacked = concrete.filter((p) => ![...versions].some((v) => v.includes(norm(p)) || norm(p).includes(v)));
    if (unbacked.length) add('10', 'warn', null, 'Unbelegte PI-Angabe', 'Version nur, wenn im Ticket belegt; sonst „PI TBD“ – keine Erfindung.', unbacked.join(', '));
  }
  // 10b Phantom-Tickets: Schlüssel im Letter, die nicht zum Umfang gehören (meist aus „Verknüpfungen“)
  const linked = new Set(tickets.flatMap((t) => t.links.map((l) => l.key)));
  // nur Schlüssel der Jira-Projekte des Umfangs (nicht „UTF-8“, nicht die Letter-ID „RL-ONESCM-…“)
  const prefixes = new Set([...scope, ...linked].map((k) => k.split('-')[0]));
  const phantoms = [...new Set([...(text.match(KEY_RE) ?? [])].filter((k) => !scope.has(k) && prefixes.has(k.split('-')[0])))].sort();
  const scopeIncludes = [...text.matchAll(/scope\s+includes\s+([A-Z][A-Z0-9]+-\d+)/gi)].map((m) => m[1]);
  if (phantoms.length || scopeIncludes.length) {
    add('10b', 'fail', null, 'Phantom-Tickets (Halluzination)', 'Diese Tickets gehören nicht zum Umfang; sie stammen meist aus „Verknüpfungen“ (Klon, Test, Hyperlink). Nur die Tickets des Releases als Inhalt führen.',
      [...new Set([...phantoms, ...scopeIncludes])].map((k) => (linked.has(k) ? `${k} (verknüpft)` : k)).join(', '));
  }
  // 10c Datumsherkunft
  const created = tickets.flatMap((t) => (t.created ? [t.created, formatJiraDate(t.created)] : []));
  const dates = text.match(DATE_RE) ?? [];
  if (created.length && dates.length && !created.some((c) => has(text, c))) add('10c', 'warn', null, 'Datum nicht aus „Erstellt“', 'Datum ausschließlich aus dem Jira-Feld „Erstellt“, nie das Lauf- oder heutige Datum.', [...new Set(dates)].join(', '));
  // 12 Unbelegte Nutzenaussagen
  const source = tickets.map((t) => `${t.summary} ${t.description} ${t.acceptance}`).join(' ');
  const buzz = BUZZ.filter((b) => has(text, b) && !has(source, b));
  if (buzz.length) add('12', 'hint', null, 'Unbelegte Nutzenaussagen', 'Als redaktionelle Ergänzung kennzeichnen oder entfernen.', buzz.slice(0, 4).join(', '));
  // Personenbezogene Daten (Verfasser immer „oneSCM Team“)
  const pii = detectPrivacy(text, { names: opts.names }).map((h) => ({ kind: h.kind, match: h.match }));
  if (pii.length) add('pii', 'fail', null, 'Personenbezogene Daten', 'Personenbezogene Daten entfernen; Verfasser immer „oneSCM Team“.', [...new Set(pii.map((p) => p.kind))].join(', '));
  const counts = { fail: findings.filter((f) => f.severity === 'fail').length, warn: findings.filter((f) => f.severity === 'warn').length, hint: findings.filter((f) => f.severity === 'hint').length };
  const order: Record<Severity, number> = { fail: 0, warn: 1, hint: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);
  const verdict: Verdict = counts.fail || pii.length ? 'block' : counts.warn ? 'cond' : 'ok';
  return { verdict, findings, counts, pii, coverage: total ? Math.round((present / total) * 100) : 0, phantoms, missingTickets };
}
