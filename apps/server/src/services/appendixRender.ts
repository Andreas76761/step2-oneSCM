// Verzeichnisse als Anhang (ADR-034): Abkürzungen, Glossar, Bildverzeichnis, FAQ – für Markdown, HTML und PDF.
import type { Appendices } from './variants.js';
import { escapeHtml, markdownToHtml, markdownToPdf, type ImageSource, type PdfImage } from './render.js';

type HistoryRow = NonNullable<Appendices['history']>[number];
/** Zeitraum einer abgelösten Funktion, z. B. „2025.1 – 2026.2“ bzw. „bis 2026.2“ */
export const historySpan = (h: HistoryRow) => (h.validFrom ? `${h.validFrom} – ${h.validUntil ?? h.date}` : `bis ${h.validUntil ?? h.date}`);
export const HISTORY_TITLE = 'Historie: abgelöste Funktionen';

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ');

export function appendixMarkdown(a: Appendices, level = '##') {
  const out: string[] = [];
  if (a.abbreviations.length) {
    out.push(`${level} Abkürzungsverzeichnis`, '', '| Abkürzung | Bedeutung |', '| --- | --- |');
    for (const x of a.abbreviations) out.push(`| **${cell(x.abbreviation)}** | ${cell(x.expansion)}${x.description ? ` – ${cell(x.description)}` : ''} |`);
    out.push('');
  }
  if (a.glossary.length) {
    out.push(`${level} Glossar`, '');
    for (const g of a.glossary) out.push(`**${g.term}** – ${g.definition}${g.avoid.length ? ` *(nicht: ${g.avoid.join(', ')})*` : ''}`, '');
  }
  if (a.images.length) {
    out.push(`${level} Bildverzeichnis`, '');
    for (const i of a.images) out.push(`${i.number}. Abb. ${i.number}: ${i.title ?? i.alt ?? 'Bild'} (${i.chapter})`);
    out.push('');
  }
  if (a.faq.length) {
    out.push(`${level} Häufige Fragen (FAQ)`, '');
    for (const f of a.faq) out.push(`**${f.question}**`, '', f.answer, '');
  }
  if (a.history?.length) {
    out.push(`${level} ${HISTORY_TITLE}`, '', '| Art | Funktion | gültig | ersetzt durch | Hinweis |', '| --- | --- | --- | --- | --- |');
    for (const h of a.history) out.push(`| ${h.kind} | ${cell(h.title)} | ${cell(historySpan(h))} | ${cell(h.replacedBy ?? '–')} | ${cell(h.note ?? '')} |`);
    out.push('');
  }
  return out.join('\n');
}

export const APPENDIX_ANCHORS = [
  { key: 'abbreviations', id: 'abkuerzungen', title: 'Abkürzungsverzeichnis' },
  { key: 'glossary', id: 'glossar', title: 'Glossar' },
  { key: 'images', id: 'bildverzeichnis', title: 'Bildverzeichnis' },
  { key: 'faq', id: 'faq', title: 'Häufige Fragen (FAQ)' },
  { key: 'history', id: 'historie', title: HISTORY_TITLE },
] as const;

/** HTML-Abschnitte je Verzeichnis (nur vorhandene), mit Anker */
export function appendixHtmlSections(a: Appendices, images?: ImageSource): { id: string; title: string; html: string }[] {
  const out: { id: string; title: string; html: string }[] = [];
  if (a.abbreviations.length) out.push({ id: 'abkuerzungen', title: 'Abkürzungsverzeichnis', html: `<table><thead><tr><th>Abkürzung</th><th>Bedeutung</th></tr></thead><tbody>${a.abbreviations.map((x) => `<tr><td><strong>${escapeHtml(x.abbreviation)}</strong></td><td>${escapeHtml(x.expansion)}${x.description ? ` – ${escapeHtml(x.description)}` : ''}</td></tr>`).join('')}</tbody></table>` });
  if (a.glossary.length) out.push({ id: 'glossar', title: 'Glossar', html: `<dl>${a.glossary.map((g) => `<dt><strong>${escapeHtml(g.term)}</strong></dt><dd>${escapeHtml(g.definition)}${g.avoid.length ? ` <em>(nicht: ${escapeHtml(g.avoid.join(', '))})</em>` : ''}</dd>`).join('')}</dl>` });
  if (a.images.length) out.push({ id: 'bildverzeichnis', title: 'Bildverzeichnis', html: `<ol>${a.images.map((i) => `<li>Abb. ${i.number}: ${escapeHtml(i.title ?? i.alt ?? 'Bild')} <span class="meta">(${escapeHtml(i.chapter)})</span>${images?.(i.sha) ? '' : ''}</li>`).join('')}</ol>` });
  if (a.faq.length) out.push({ id: 'faq', title: 'Häufige Fragen (FAQ)', html: a.faq.map((f) => `<h3>${escapeHtml(f.question)}</h3>${markdownToHtml(f.answer, images)}`).join('') });
  if (a.history?.length) {
    out.push({ id: 'historie', title: HISTORY_TITLE, html: `<table><thead><tr><th>Art</th><th>Funktion</th><th>gültig</th><th>ersetzt durch</th><th>Hinweis</th></tr></thead><tbody>${a.history.map((h) => `<tr><td>${escapeHtml(h.kind)}</td><td>${escapeHtml(h.title)}</td><td>${escapeHtml(historySpan(h))}</td><td>${escapeHtml(h.replacedBy ?? '–')}</td><td>${escapeHtml(h.note ?? '')}</td></tr>`).join('')}</tbody></table>` });
  }
  return out;
}

export function appendixPdf(a: Appendices, media?: Map<string, PdfImage>): unknown[] {
  const out: unknown[] = [];
  const head = (t: string) => out.push({ text: t, style: 'chapter', tocItem: true, pageBreak: 'before' });
  if (a.abbreviations.length) {
    head('Abkürzungsverzeichnis');
    out.push({ table: { headerRows: 1, widths: [90, '*'], body: [[{ text: 'Abkürzung', bold: true }, { text: 'Bedeutung', bold: true }], ...a.abbreviations.map((x) => [{ text: x.abbreviation, bold: true }, `${x.expansion}${x.description ? ` – ${x.description}` : ''}`])] }, layout: 'lightHorizontalLines' });
  }
  if (a.glossary.length) {
    head('Glossar');
    for (const g of a.glossary) out.push({ text: [{ text: `${g.term} – `, bold: true }, g.definition], margin: [0, 0, 0, 4] });
  }
  if (a.images.length) {
    head('Bildverzeichnis');
    out.push({ ol: a.images.map((i) => `Abb. ${i.number}: ${i.title ?? i.alt ?? 'Bild'} (${i.chapter})`) });
  }
  if (a.faq.length) {
    head('Häufige Fragen (FAQ)');
    for (const f of a.faq) out.push({ text: f.question, style: 'section' }, ...markdownToPdf(f.answer, media));
  }
  if (a.history?.length) {
    head(HISTORY_TITLE);
    out.push({ table: { headerRows: 1, widths: [60, '*', 80, '*'], body: [['Art', 'Funktion', 'gültig', 'ersetzt durch'].map((t) => ({ text: t, bold: true })), ...a.history.map((h) => [h.kind, `${h.title}${h.note ? ` – ${h.note}` : ''}`, historySpan(h), h.replacedBy ?? '–'])] }, layout: 'lightHorizontalLines' });
  }
  return out;
}
