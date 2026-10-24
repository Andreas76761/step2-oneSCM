// Prüfbericht Barrierefreiheit für den HTML-Export (ADR-121), wie für PDF (ADR-118), Word und PowerPoint (ADR-120):
// Grundlagen nach WCAG 2.2 für die von der App erzeugten Seiten – Sprache, Titel, Hauptbereich, Überschriften ohne
// Sprünge, Bilder mit Alternativtext, Icons ausgeblendet, Tabellen mit Kopfzellen, Links mit Namen. Gelesen wird das
// Markup per Muster, wie es die App schreibt; eine vollständige Prüfung (z. B. axe im Browser) ersetzt das nicht.
import type { PdfAccessibility, PdfCheck } from './pdfAccessibility.js';

const attr = (tag: string, name: string) => {
  const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag);
  return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null;
};
const hidden = (tag: string) => attr(tag, 'aria-hidden') === 'true' || /^(presentation|none)$/.test(attr(tag, 'role') ?? '');
const plain = (html: string) => html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();

export function checkHtmlAccessibility(html: string): PdfAccessibility {
  const lang = attr(/<html\b[^>]*>/i.exec(html)?.[0] ?? '', 'lang') ?? '';
  const title = plain(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '');
  const body = html.replace(/<head\b[\s\S]*?<\/head>/i, '');

  // Überschriften: genau eine Hauptüberschrift ist nicht Pflicht, aber mindestens eine; keine übersprungene Ebene
  const levels = [...body.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;

  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const decorative = imgs.filter(hidden);
  const content = imgs.filter((t) => !hidden(t));
  const withAlt = content.filter((t) => (attr(t, 'alt') ?? '').trim());
  // Inline-SVG: als Icon ausgeblendet oder mit Namen (role="img" und aria-label bzw. <title>)
  const svgs = [...body.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/gi)];
  const unnamedSvg = svgs.filter((m) => !hidden(m[0]) && !(attr(m[0], 'aria-label') ?? '').trim() && !/<title>\s*\S/.test(m[1])).length;

  const tables = [...body.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)].map((m) => m[0]).filter((t) => !hidden(/<table\b[^>]*>/i.exec(t)![0]));
  const withTh = tables.filter((t) => /<th\b/i.test(t));

  const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].filter((m) => attr(`<a${m[1]}>`, 'href') !== null);
  const unnamed = links.filter((m) => {
    const tag = `<a${m[1]}>`;
    if ((attr(tag, 'aria-label') ?? '').trim()) return false;
    const imgAlt = [...m[2].matchAll(/<img\b[^>]*>/gi)].some((i) => (attr(i[0], 'alt') ?? '').trim());
    return !plain(m[2]) && !imgAlt;
  });

  const checks: PdfCheck[] = [
    { id: 'lang', label: 'Sprache der Seite angegeben', ok: !!lang.trim(), detail: lang || undefined },
    { id: 'title', label: 'Seitentitel', ok: !!title, detail: title || undefined },
    { id: 'main', label: 'Hauptbereich ausgezeichnet', ok: /<main\b/i.test(body) || /role\s*=\s*"main"/i.test(body) },
    { id: 'headings', label: 'Überschriften ohne übersprungene Ebene', ok: levels.length > 0 && levels[0] === 1 && skips === 0, detail: `${levels.length} Überschriften${skips ? `, ${skips} Sprünge` : ''}` },
    { id: 'figures', label: 'Bilder mit Alternativtext', ok: withAlt.length === content.length, detail: `${withAlt.length} von ${content.length}${decorative.length ? `, ${decorative.length} dekorativ` : ''}` },
    { id: 'icons', label: 'Icons für Screenreader ausgeblendet oder benannt', ok: unnamedSvg === 0, detail: `${svgs.length - unnamedSvg} von ${svgs.length}` },
    { id: 'tables', label: 'Tabellen mit Kopfzellen', ok: withTh.length === tables.length, detail: `${withTh.length} von ${tables.length}` },
    { id: 'links', label: 'Links mit erkennbarem Namen', ok: unnamed.length === 0, detail: `${links.length - unnamed.length} von ${links.length}` },
  ];
  return { ok: checks.every((c) => c.ok !== false), checks };
}
