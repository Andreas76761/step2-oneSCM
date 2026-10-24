// Designvorlagen (ADR-112): Quick Reference Guide (A4 quer, Karten in zwei Spalten) und Handbuch-Kapitel im Stil einer
// Fachdokumentation (A4 hoch, Kopf- und Fußzeile, Kennzahlen, nummerierte Abschnitte, farbige Hinweisboxen).
// Eigenständiges, druckfähiges HTML ohne Skripte und ohne externe Schriften; Icons als Inline-SVG (Lucide).
// Reine Darstellung: Inhalte kommen gefiltert und zugeschnitten aus dem Export.
import { svgIcon, type DesignIcon } from './designIcons.js';

export const DESIGNS = ['standard', 'quickref', 'fachdoku'] as const;
export type Design = (typeof DESIGNS)[number];
export const DESIGN_INFO: Record<Exclude<Design, 'standard'>, { name: string; description: string; page: string }> = {
  quickref: {
    name: 'Quick Reference Guide',
    description: 'Kompakte Schritt-für-Schritt-Anleitung im Querformat: Karten in zwei Spalten mit nummerierten Schritten, Bildschirmfotos daneben, rote Warnboxen, Überblick über die Prozesse, Links und häufige Fragen.',
    page: 'A4 quer',
  },
  fachdoku: {
    name: 'Handbuch-Kapitel (Fachdokumentation)',
    description: 'Ausführliches Kapitel im Hochformat: Kopfzeile mit Dokumentart und Seitenzahl, Titel mit Untertitel, Kennzahlen-Karten, nummerierte Abschnitte mit Balken, Tabellen, Hinweis-, Wichtig- und Warnboxen, Code- und Ablaufdarstellungen.',
    page: 'A4 hoch',
  },
};

/**
 * Anpassung je Designvorlage (ADR-114): Hauptfarbe (Text, Links, Überschriften), Akzent (Rahmen, Icons), Warnfarbe,
 * Schriften und Logo-Position. Farben werden vor dem Einsetzen ins CSS geprüft (#rrggbb, Kontrast).
 */
export interface DesignTheme {
  primary: string;
  accent: string;
  warn: string;
  headingFont: DesignFont;
  bodyFont: DesignFont;
  logo: 'right' | 'left' | 'none';
}
export const DESIGN_FONTS = ['serif', 'sans'] as const;
export type DesignFont = (typeof DESIGN_FONTS)[number];
export const LOGO_POSITIONS = ['right', 'left', 'none'] as const;
/** Systemschriften (ohne Nachladen): Serifen wie im Muster, sonst serifenlos */
const FONTS: Record<DesignFont, string> = {
  serif: 'Georgia,"Times New Roman",serif',
  sans: '"Segoe UI",system-ui,-apple-system,Roboto,"Open Sans",Arial,sans-serif',
};
export const DEFAULT_THEMES: Record<Exclude<Design, 'standard'>, DesignTheme> = {
  quickref: { primary: '#0870ad', accent: '#3fa9e0', warn: '#d0021b', headingFont: 'serif', bodyFont: 'sans', logo: 'right' },
  fachdoku: { primary: '#1f3a68', accent: '#2b5fad', warn: '#c8102e', headingFont: 'sans', bodyFont: 'sans', logo: 'right' },
};

/** Relative Leuchtdichte (WCAG 2.x) und Kontrast zu Weiß */
function luminance(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export const contrastToWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

/** Mindestkontrast zu Weiß: Text (Hauptfarbe, Warnfarbe) 4,5 : 1, Rahmen und Icons (Akzent) 3 : 1 (WCAG 1.4.3, 1.4.11) */
export const THEME_CONTRAST = { primary: 4.5, accent: 3, warn: 4.5 } as const;
const COLOR_LABEL = { primary: 'Hauptfarbe', accent: 'Akzentfarbe', warn: 'Warnfarbe' } as const;

/** Anpassung prüfen und mit dem Standard der Vorlage vervollständigen; Fehler als Liste verständlicher Sätze */
export function normalizeTheme(design: Exclude<Design, 'standard'>, input: Partial<Record<keyof DesignTheme, unknown>>): { theme: DesignTheme; issues: string[] } {
  const base = DEFAULT_THEMES[design];
  const theme: DesignTheme = { ...base };
  const issues: string[] = [];
  for (const k of ['primary', 'accent', 'warn'] as const) {
    if (input[k] === undefined || input[k] === null || input[k] === '') continue;
    const c = String(input[k]).trim().toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(c)) {
      issues.push(`${COLOR_LABEL[k]}: Farbe im Format #rrggbb angeben.`);
      continue;
    }
    const ratio = contrastToWhite(c);
    if (ratio < THEME_CONTRAST[k]) issues.push(`${COLOR_LABEL[k]} ${c} hat zu wenig Kontrast zu Weiß (${ratio.toFixed(2).replace('.', ',')} : 1, nötig ${String(THEME_CONTRAST[k]).replace('.', ',')} : 1).`);
    else theme[k] = c;
  }
  for (const k of ['headingFont', 'bodyFont'] as const) {
    if (input[k] === undefined || input[k] === null) continue;
    if ((DESIGN_FONTS as readonly unknown[]).includes(input[k])) theme[k] = input[k] as DesignFont;
    else issues.push(`${k === 'headingFont' ? 'Schrift der Überschriften' : 'Schrift des Textes'}: serif (mit Serifen) oder sans (serifenlos).`);
  }
  if (input.logo !== undefined && input.logo !== null) {
    if ((LOGO_POSITIONS as readonly unknown[]).includes(input.logo)) theme.logo = input.logo as DesignTheme['logo'];
    else issues.push('Logo-Position: right (rechts), left (links) oder none (ohne Logo).');
  }
  return { theme, issues };
}

export interface DesignBlock { kind: string; text: string }
export interface DesignSection { code: string; title: string; blocks: DesignBlock[] }
export interface DesignChapter { title: string; versionNo?: number; approvedAt?: string | null; validFrom?: string | null; sections: DesignSection[] }
export interface DesignOptions {
  title: string;
  /** Marke im Kopf (Name neben dem Logo); Standard „oneSCM“ */
  brand?: string | null;
  /** Zusatz unter der Marke, z. B. „für Van“ oder „Benutzerhandbuch“ */
  productLine?: string | null;
  /** Logo als data:-URI; ohne Logo ein neutrales Zeichen */
  logo?: string | null;
  /** Dokumentart in der Kopfzeile der Fachdokumentation, z. B. „oneSCM Fachdokumentation“ */
  docLabel?: string | null;
  /** Fußzeile: im Quick Reference Guide als „Hinweis: …“, in der Fachdokumentation links */
  footerText?: string | null;
  /** Markdown für die Karte „Wichtige Links und Ansprechpartner“ (Quick Reference Guide) */
  links?: string | null;
  faq?: { question: string; answer: string }[];
  /** Stand (TT.MM.JJJJ) */
  asOf: string;
  lang?: string;
  /** Markdown → HTML (mit Bildern als data:-URI) */
  md: (text: string) => string;
  /** Farben, Schriften und Logo-Position (ADR-114); Standard je Vorlage */
  theme?: DesignTheme;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const roman = (i: number) => ROMAN[i] ?? String(i + 1);
/** Klartext eines Markdown-Absatzes (für Überblick und Kennzahlen) */
const plain = (md: string) => md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`>#]/g, '').replace(/\s+/g, ' ').trim();
/** Listenpunkte eines Markdown-Absatzes */
const listItems = (md: string) => md.split('\n').map((l) => /^\s*(?:\d+[.)]|[-*•])\s+(.*)$/.exec(l)?.[1]).filter((x): x is string => !!x).map(plain);
const shorten = (s: string, n = 70) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')} …` : s);

export const BOX: Record<string, { cls: string; icon: DesignIcon; label: string }> = {
  note: { cls: 'info', icon: 'info', label: 'Hinweis' },
  tip: { cls: 'tip', icon: 'lightbulb', label: 'Tipp' },
  warning: { cls: 'warn', icon: 'triangle-alert', label: 'Warnung' },
  xref: { cls: 'xref', icon: 'arrow-up-right', label: 'Siehe auch' },
};

function brandHtml(o: DesignOptions, cls: string) {
  const mark = o.logo ? `<img class="${cls}-logo" src="${esc(o.logo)}" alt="${esc(o.brand ?? 'Logo')}">` : `<span class="${cls}-mark">${svgIcon('book-open', 26, 'ic')}</span>`;
  return `<div class="${cls}-brand">${mark}<span class="${cls}-brandtext"><span>${esc(o.brand || 'oneSCM')}</span>${o.productLine ? `<em>${esc(o.productLine)}</em>` : ''}</span></div>`;
}

const doc = (o: DesignOptions, css: string, body: string) => `<!doctype html>
<html lang="${esc(o.lang ?? 'de')}"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<style>${css}</style></head><body>
${body}
</body></html>`;

// ---------------------------------------------------------------- Gemeinsame Inhalte für HTML, PDF und Word (ADR-115)

/** „Die Prozesse im Überblick“: je Kapitel mit Schritten die Schritte in Kurzform, bei mehreren Kapiteln römisch nummeriert */
export function processOverview(chapters: DesignChapter[]): { title: string; steps: string[] }[] {
  const multi = chapters.length > 1;
  return chapters.map((c, i) => ({
    title: `${multi ? `${roman(i)}. ` : ''}${c.title}`,
    steps: c.sections.filter((s) => s.code === 'steps').flatMap((s) => s.blocks.flatMap((b) => listItems(b.text))).map((x) => shorten(x)),
  })).filter((x) => x.steps.length);
}

/** Titel einer Karte im Quick Reference Guide: Schritte tragen den Kapitelnamen, sonst der Abschnitt */
export const cardTitle = (chapters: DesignChapter[], i: number, s: DesignSection) => (s.code === 'steps' ? `${chapters.length > 1 ? `${roman(i)}. ` : ''}${chapters[i].title}` : s.title);

export const hasInteractiveLinks = (chapters: DesignChapter[], o: Pick<DesignOptions, 'links'>) => chapters.some((c) => c.sections.some((s) => s.blocks.some((b) => /\]\(https?:/.test(b.text)))) || !!o.links;

/** Icons der Karten je Abschnittsart */
export const QR_ICON: Record<string, DesignIcon> = { prerequisites: 'shield-check', steps: 'list-ordered', result: 'circle-check', purpose: 'info' };

/** Kopfzeile der Fachdokumentation in Großbuchstaben */
export const fachdokuLabel = (chapters: DesignChapter[], o: Pick<DesignOptions, 'docLabel' | 'brand' | 'title'>) =>
  `${o.docLabel || `${o.brand || 'oneSCM'} Fachdokumentation`} · ${chapters.length === 1 ? chapters[0].title : o.title}`.toUpperCase();
export const fachdokuFooter = (o: Pick<DesignOptions, 'footerText' | 'brand'>) => o.footerText ?? `${o.brand || 'oneSCM'} · Fach- und Handbuchdokumentation`;

/** Untertitel und Kennzahlen eines Kapitels (Abschnitte, Handlungsschritte, Version/Freigabe, Hinweise) */
export function chapterFacts(c: DesignChapter): { sub: string; kpis: [DesignIcon, string, string][] } {
  const blocks = c.sections.flatMap((s) => s.blocks);
  const steps = c.sections.filter((s) => s.code === 'steps').flatMap((s) => s.blocks.flatMap((b) => listItems(b.text))).length;
  const hints = blocks.filter((b) => ['note', 'tip', 'warning'].includes(b.kind)).length;
  const purpose = c.sections.find((s) => s.code === 'purpose')?.blocks[0];
  const sub = purpose ? shorten(plain(purpose.text), 140) : c.sections.map((s) => s.title).join(' · ');
  return {
    sub,
    kpis: [
      ['layers', String(c.sections.length), 'Abschnitte'],
      ['list-ordered', String(steps), 'Handlungsschritte'],
      ['shield-check', c.versionNo ? `V${c.versionNo}` : '–', c.approvedAt ? `Freigegeben am ${c.approvedAt.slice(8, 10)}.${c.approvedAt.slice(5, 7)}.${c.approvedAt.slice(0, 4)}` : 'Freigabestand'],
      ['triangle-alert', String(hints), c.validFrom ? `Hinweise · gültig ab ${c.validFrom}` : 'Hinweise und Warnungen'],
    ],
  };
}

// ---------------------------------------------------------------- Lesestil „Handbuch-Kapitel“ (ADR-117)

/** Zusatz-CSS der Online-Hilfe im Stil Handbuch-Kapitel: Farben und Schriften der Anpassung, Balken, Hinweisboxen */
export function readingCss(t: DesignTheme): string {
  const warnText = `color-mix(in srgb,${t.warn} 70%,#000)`;
  return `body{font-family:${FONTS[t.bodyFont]}}header{background:${t.primary}}`
    + `h1,h2,h3{font-family:${FONTS[t.headingFont]};color:${t.primary}}h2{border-bottom:0;border-left:4px solid ${t.primary};padding:0 0 0 9px}a{color:${t.primary}}`
    + `.kind-note,.kind-tip,.kind-warning,.kind-xref{background:#fff;border-left:4px solid ${t.accent};padding:6px 12px}`
    + `.kind-tip{border-left-color:#c76b00;color:#8a4b00}.kind-warning{border-left-color:${t.warn};color:${warnText}}`
    + `.kind-xref{border:1px solid #d9dee5;border-left:4px solid ${t.primary}}`
    + `.label{display:flex;align-items:center;gap:6px}.label svg{flex:none}th{background:#f3f4f6;color:#5f6b7a;font-weight:400}`;
}
/** Icon vor der Beschriftung einer Hinweisbox (Online-Hilfe) */
export const readingIcon = (kind: string) => (BOX[kind] ? svgIcon(BOX[kind].icon, 15) : '');

// ---------------------------------------------------------------- Quick Reference Guide

const QR_CSS = (o: DesignOptions, t: DesignTheme) => `
:root{--qr-line:${t.accent};--qr-ink:#1d1d1b;--qr-blue:${t.primary};--qr-title:#1b1b1b;--qr-red:${t.warn};--qr-redbg:color-mix(in srgb,${t.warn} 6%,#fff);--qr-muted:#6b7280}
*{box-sizing:border-box}
@page{size:A4 landscape;margin:12mm 10mm 13mm;
 @bottom-left{content:${o.footerText ? `"Hinweis: ${o.footerText.replace(/["\\]/g, '')}"` : 'none'};font:8pt system-ui,sans-serif;color:#1d1d1b}
 @bottom-right{content:"STAND: ${o.asOf} | " counter(page) "/" counter(pages);font:8pt system-ui,sans-serif;letter-spacing:.18em;color:#4b5563}}
body{margin:0;font:10.5pt/1.42 ${FONTS[t.bodyFont]};color:var(--qr-ink);background:#fff}
.qr{max-width:297mm;margin:0 auto;padding:10px 14px}
.qr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:8px}
.qr-head h1{font:400 25pt/1.1 ${FONTS[t.headingFont]};margin:0;color:var(--qr-title);letter-spacing:-.01em}
.qr-brand{display:flex;align-items:center;gap:8px;flex:none}
.qr-head.logo-left{flex-direction:row-reverse;justify-content:flex-end}
.qr-mark{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border:1.5px solid #9ca3af;border-radius:50%;color:#4b5563}
.qr-logo{max-height:44px;max-width:120px}
.qr-brandtext{display:flex;flex-direction:column;line-height:1.05;font:15pt ${FONTS[t.headingFont]};color:#374151}
.qr-brandtext em{color:var(--qr-blue);font-size:14pt}
.qr-cols{column-count:2;column-gap:14px;column-fill:auto}
.qr-card{border:1.5px solid var(--qr-line);border-radius:14px;padding:10px 14px 12px;margin:0 0 12px;break-inside:auto;-webkit-box-decoration-break:clone;box-decoration-break:clone;background:#fff}
.qr-card.keep{break-inside:avoid}
.qr-card h2{font:400 13pt/1.25 ${FONTS[t.headingFont]};margin:0 0 8px;break-after:avoid;color:var(--qr-title);display:flex;align-items:center;gap:6px}
.qr-card h2 .ic{color:var(--qr-blue);flex:none}
.qr-card h3{font:600 10.5pt system-ui,sans-serif;margin:8px 0 4px}
.qr p{margin:0 0 6px}
.qr ol{margin:4px 0 6px;padding-left:22px}
.qr ol li{margin:0 0 7px;padding-left:3px}
.qr ol li::marker{color:#4b5563}
.qr ul{margin:3px 0 6px;padding-left:18px}
.qr ul li{margin:0 0 2px}
.qr strong{font-weight:600;color:#111}
.qr a{color:var(--qr-blue)}
.qr img{float:right;max-width:46%;max-height:150px;margin:0 0 6px 10px;border:1px solid #d1d5db;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.qr ol li::after,.qr-card::after{content:"";display:block;clear:both}
.qr-hint strong:first-child{color:#111}
.qr-warn{display:flex;gap:10px;align-items:flex-start;border:1.5px solid color-mix(in srgb,${t.warn} 60%,#fff);background:var(--qr-redbg);border-radius:12px;padding:8px 12px;margin:8px 0 10px;break-inside:avoid}
.qr-warn .ic{color:var(--qr-red);flex:none;margin-top:1px}
.qr-warn strong{color:var(--qr-red)}
.qr-warn p{margin:0}
.qr-tip{border-left:3px solid var(--qr-line);padding:2px 0 2px 8px;margin:6px 0}
.qr-interactive{color:var(--qr-blue);display:flex;align-items:center;gap:6px;margin:-2px 0 10px;font-size:10pt;break-inside:avoid}
.qr-overview{margin:0 0 12px;break-inside:avoid}
.qr-overview h2{font:400 13pt ${FONTS[t.headingFont]};margin:0 0 6px;display:flex;align-items:center;gap:6px}
.qr-overview h2 .ic{color:var(--qr-blue)}
.qr-overview .qr-ovcols{column-count:2;column-gap:18px}
.qr-overview h3{font:400 10.5pt ${FONTS[t.headingFont]};color:var(--qr-red);margin:4px 0 2px;break-after:avoid}
.qr-overview ul{list-style:none;padding-left:0;margin:0 0 6px}
.qr-overview li{padding-left:14px;position:relative;break-inside:avoid}
.qr-overview li::before{content:"•";position:absolute;left:2px;color:#374151}
.qr-faq dt{font-weight:600;margin-top:6px;display:flex;gap:6px}
.qr-faq dt .ic{color:var(--qr-blue);flex:none;margin-top:2px}
.qr-faq dd{margin:2px 0 4px 22px}
.qr-links ul{list-style:none;padding-left:0}
.qr-links li{display:flex;gap:6px;margin-bottom:5px}
.qr-links li .ic{color:var(--qr-blue);flex:none;margin-top:3px}
.qr-foot{display:flex;justify-content:space-between;gap:16px;font-size:8.5pt;margin-top:6px;color:#374151}
.qr-foot .stand{letter-spacing:.18em;color:#4b5563;white-space:nowrap}
table{border-collapse:collapse;font-size:9.5pt;margin:4px 0}td,th{border:1px solid #d1d5db;padding:3px 6px;text-align:left}
code{font-family:ui-monospace,Consolas,monospace;font-size:9pt;background:#f3f4f6;padding:0 3px;border-radius:3px}
@media print{.qr{padding:0;max-width:none}.qr-foot{display:none}a{text-decoration:underline}}
@media screen{body{background:#eef2f6}.qr{background:#fff;margin:16px auto;box-shadow:0 2px 12px rgba(0,0,0,.08);border-radius:6px;padding:18px 22px}}
`;

function qrBlock(b: DesignBlock, o: DesignOptions): string {
  const html = o.md(b.text);
  if (b.kind === 'warning') return `<div class="qr-warn">${svgIcon('circle-alert', 26)}<div>${html}</div></div>`;
  if (b.kind === 'note') return `<div class="qr-hint">${html.replace(/^<p>/, '<p><strong>Hinweis</strong>: ')}</div>`;
  if (b.kind === 'tip') return `<div class="qr-tip">${html.replace(/^<p>/, '<p><strong>Tipp</strong>: ')}</div>`;
  if (b.kind === 'xref') return `<div class="qr-hint">${html.replace(/^<p>/, '<p><strong>Siehe auch</strong>: ')}</div>`;
  return html;
}


export function renderQuickRef(chapters: DesignChapter[], o: DesignOptions): string {
  const t = o.theme ?? DEFAULT_THEMES.quickref;
  // Überblick über die Prozesse: Kapitel mit römischer Nummer, darunter die Schritte in Kurzform
  const ov = processOverview(chapters);
  const overview = ov.length ? `<section class="qr-overview" aria-label="Überblick">
<h2>${svgIcon('layers', 18)}Die Prozesse im Überblick</h2><div class="qr-ovcols">${ov.map((x) => `<h3>${esc(x.title)}</h3><ul>${x.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`).join('')}</div></section>` : '';
  const hasLinks = hasInteractiveLinks(chapters, o);
  const cards: string[] = [];
  chapters.forEach((c, i) => {
    for (const s of c.sections) {
      const title = cardTitle(chapters, i, s);
      cards.push(`<section class="qr-card${s.blocks.length <= 2 && s.code !== 'steps' ? ' keep' : ''}"><h2>${svgIcon(QR_ICON[s.code] ?? 'file-text', 18)}${esc(title)}</h2>${s.blocks.map((b) => qrBlock(b, o)).join('\n')}</section>`);
    }
  });
  if (o.links) cards.push(`<section class="qr-card keep qr-links"><h2>${svgIcon('link', 18)}Wichtige Links und Ansprechpartner</h2>${o.md(o.links).replace(/<li>/g, `<li>${svgIcon('arrow-right', 14)}<span>`).replace(/<\/li>/g, '</span></li>')}</section>`);
  if (o.faq?.length) cards.push(`<section class="qr-card qr-faq"><h2>${svgIcon('circle-question-mark', 18)}Häufig gestellte Fragen und Antworten</h2><dl>${o.faq.map((f) => `<dt>${svgIcon('circle-question-mark', 14)}<span>${esc(f.question)}</span></dt><dd>${o.md(f.answer)}</dd>`).join('')}</dl></section>`);
  const body = `<main class="qr">
<header class="qr-head${t.logo === 'left' ? ' logo-left' : ''}"><h1>${esc(o.title)}</h1>${t.logo === 'none' ? '' : brandHtml(o, 'qr')}</header>
${hasLinks ? `<p class="qr-interactive">${svgIcon('mouse-pointer-click', 16)}Dieses Dokument ist interaktiv – enthaltene Links können direkt geöffnet werden.</p>` : ''}
<div class="qr-cols">
${overview}
${cards.join('\n')}
</div>
<footer class="qr-foot"><span>${o.footerText ? `<strong>Hinweis</strong>: ${esc(o.footerText)}` : ''}</span><span class="stand">STAND: ${esc(o.asOf)}</span></footer>
</main>`;
  return doc(o, QR_CSS(o, t), body);
}

// ---------------------------------------------------------------- Handbuch-Kapitel (Fachdokumentation)

const FD_CSS = (o: DesignOptions, label: string, t: DesignTheme) => `
:root{--fd-navy:${t.primary};--fd-blue:${t.accent};--fd-ink:#1f2933;--fd-muted:#5f6b7a;--fd-line:#d9dee5;--fd-th:#5f6b7a}
*{box-sizing:border-box}
@page{size:A4;margin:18mm 16mm 16mm;
 @top-left{content:"${label.replace(/["\\]/g, '')}";font:700 8pt "Segoe UI",system-ui,sans-serif;letter-spacing:.04em;color:${t.primary};border-bottom:1.5px solid ${t.primary};vertical-align:bottom;padding-bottom:3mm}
 @top-right{content:"Seite " counter(page) " von " counter(pages);font:8pt "Segoe UI",system-ui,sans-serif;color:#1f2933;border-bottom:1.5px solid ${t.primary};vertical-align:bottom;padding-bottom:3mm}
 @bottom-left{content:"${fachdokuFooter(o).replace(/["\\]/g, '')}";font:7.5pt "Segoe UI",system-ui,sans-serif;color:#5f6b7a;border-top:1px solid #d9dee5;vertical-align:top;padding-top:2mm}
 @bottom-right{content:"${o.title.replace(/["\\]/g, '')}";font:7.5pt "Segoe UI",system-ui,sans-serif;color:#5f6b7a;border-top:1px solid #d9dee5;vertical-align:top;padding-top:2mm}}
body{margin:0;font:9.5pt/1.55 ${FONTS[t.bodyFont]};color:var(--fd-ink);background:#fff;text-align:justify;hyphens:auto}
.fd{max-width:210mm;margin:0 auto;padding:0}
.fd-run{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1.5px solid var(--fd-navy);padding-bottom:4px;margin-bottom:14px;font-size:8pt}
.fd-run b{color:var(--fd-navy);letter-spacing:.04em;text-transform:uppercase}
.fd-chapter{break-before:page}
.fd-chapter:first-of-type{break-before:auto}
.fd-titlerow{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.fd-titlerow.logo-left{flex-direction:row-reverse;justify-content:flex-end}
.fd h1{font:700 21pt/1.15 ${FONTS[t.headingFont]};color:var(--fd-navy);margin:0 0 2px;text-align:left}
.fd-sub{color:var(--fd-muted);font-size:10.5pt;margin:0 0 10px;text-align:left}
.fd-brand{display:flex;align-items:center;gap:6px;color:var(--fd-navy);flex:none}
.fd-mark{display:inline-flex;color:var(--fd-blue)}
.fd-logo{max-height:32px;max-width:110px}
.fd-brandtext{display:flex;flex-direction:column;line-height:1.1;font-weight:600;font-size:9pt}
.fd-brandtext em{font-weight:400;color:var(--fd-muted);font-style:normal}
.fd-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:8px 0 16px;padding:0;list-style:none;break-inside:avoid}
.fd-kpi{border:1px solid var(--fd-line);border-top:2px solid var(--fd-navy);border-radius:6px;padding:7px 10px;text-align:left}
.fd-kpi .v{display:flex;align-items:center;gap:6px;font:700 15pt ${FONTS[t.headingFont]};color:var(--fd-navy)}
.fd-kpi .v .ic{color:var(--fd-blue)}
.fd-kpi .l{font-size:8pt;color:var(--fd-muted);line-height:1.3}
.fd h2{font:700 13pt/1.3 ${FONTS[t.headingFont]};color:var(--fd-navy);border-left:4px solid var(--fd-navy);padding-left:9px;margin:16px 0 6px;text-align:left;break-after:avoid}
.fd h3{font:700 10.5pt ${FONTS[t.headingFont]};color:#1f2933;margin:12px 0 4px;text-align:left;break-after:avoid}
.fd h4{font:700 9.5pt ${FONTS[t.headingFont]};margin:10px 0 3px}
.fd p{margin:0 0 6px}
.fd ul,.fd ol{margin:3px 0 8px;padding-left:18px;text-align:left}
.fd li{margin:0 0 3px}
.fd strong{font-weight:700}
.fd a{color:#1d4ed8;font-weight:600}
.fd code{font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;font-size:8.3pt;background:#f2f4f7;border:1px solid #e5e8ec;border-radius:3px;padding:0 3px}
.fd pre{background:#fff;border:1px solid var(--fd-line);border-radius:6px;padding:9px 12px;color:#5f6b7a;font:8pt/1.45 ui-monospace,Consolas,monospace;white-space:pre-wrap;text-align:left;break-inside:avoid}
.fd pre code{background:none;border:0;padding:0;color:inherit}
.fd table{width:100%;border-collapse:collapse;margin:6px 0 10px;font-size:8.6pt;text-align:left;break-inside:auto}
.fd th{color:var(--fd-th);font-weight:400;border:1px solid var(--fd-line);padding:5px 7px;vertical-align:top}
.fd td{border:1px solid var(--fd-line);padding:5px 7px;vertical-align:top}
.fd td:first-child{font-weight:700}
.fd tr{break-inside:avoid}
.fd img{max-width:100%;height:auto;border:1px solid var(--fd-line);border-radius:4px;margin:4px 0}
.fd-box{border-left:4px solid var(--fd-blue);background:#fff;padding:7px 12px;margin:8px 0 10px;text-align:left;break-inside:avoid}
.fd-box .t{display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:2px}
.fd-box p:last-child{margin-bottom:0}
.fd-box.info{border-left-color:var(--fd-blue)}.fd-box.info .t{color:#1f2933}.fd-box.info .t .ic{color:var(--fd-blue)}
.fd-box.tip{border-left-color:#c76b00}.fd-box.tip,.fd-box.tip .t{color:#8a4b00}
.fd-box.warn{border-left-color:${t.warn}}.fd-box.warn,.fd-box.warn .t{color:color-mix(in srgb,${t.warn} 70%,#000)}
.fd-box.xref{border:1px solid var(--fd-line);border-left:4px solid var(--fd-navy);border-radius:0 6px 6px 0}
.fd-panel{border:1px solid var(--fd-line);border-radius:6px;padding:8px 12px;margin:8px 0 10px;text-align:left;break-inside:avoid}
.fd-panel .t{font-weight:700;margin-bottom:2px}
.fd-foot{display:flex;justify-content:space-between;border-top:1px solid var(--fd-line);padding-top:4px;margin-top:18px;font-size:7.5pt;color:var(--fd-muted)}
@media print{.fd-run,.fd-foot{display:none}}
@media screen{body{background:#eef2f6}.fd{background:#fff;margin:16px auto;padding:16mm 16mm 12mm;box-shadow:0 2px 12px rgba(0,0,0,.08);border-radius:6px}.fd-chapter{border-top:1px dashed var(--fd-line);padding-top:12px;margin-top:20px}.fd-chapter:first-of-type{border-top:0;margin-top:0;padding-top:0}}
`;

function fdBlock(b: DesignBlock, o: DesignOptions): string {
  const box = BOX[b.kind];
  const html = o.md(b.text);
  return box ? `<div class="fd-box ${box.cls}"><div class="t">${svgIcon(box.icon, 15)}${esc(box.label)}</div>${html}</div>` : html;
}

export function renderFachdoku(chapters: DesignChapter[], o: DesignOptions): string {
  const t = o.theme ?? DEFAULT_THEMES.fachdoku;
  const label = fachdokuLabel(chapters, o);
  const parts = chapters.map((c, ci) => {
    const { sub, kpis } = chapterFacts(c);
    const sections = c.sections.map((s, si) => `<section><h2>${si + 1}. ${esc(s.title)}</h2>${s.blocks.map((b) => fdBlock(b, o)).join('\n')}</section>`).join('\n');
    return `<article class="fd-chapter" data-title="${esc(c.title)}">
<div class="fd-run"><b>${esc(label)}</b><span>Kapitel ${ci + 1} von ${chapters.length}</span></div>
<div class="fd-titlerow${t.logo === 'left' ? ' logo-left' : ''}"><div><h1>${esc(c.title)}</h1><p class="fd-sub">${esc(sub)}</p></div>${ci === 0 && t.logo !== 'none' ? brandHtml(o, 'fd') : ''}</div>
<ul class="fd-kpis" role="list" aria-label="Kennzahlen">${kpis.map(([ic, v, l]) => `<li class="fd-kpi"><div class="v">${svgIcon(ic, 16)}${esc(v)}</div><div class="l">${esc(l)}</div></li>`).join('')}</ul>
${sections}
<div class="fd-foot"><span>${esc(fachdokuFooter(o))}</span><span>${esc(c.title)} · Stand ${esc(o.asOf)}</span></div>
</article>`;
  });
  return doc(o, FD_CSS(o, label, t), `<main class="fd">\n${parts.join('\n')}\n</main>`);
}

export function renderDesign(design: Exclude<Design, 'standard'>, chapters: DesignChapter[], o: DesignOptions): string {
  return design === 'quickref' ? renderQuickRef(chapters, o) : renderFachdoku(chapters, o);
}
