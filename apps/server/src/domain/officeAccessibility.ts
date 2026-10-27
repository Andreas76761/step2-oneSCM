// Barrierefreiheit für Word und PowerPoint (ADR-120): Nachbearbeitung der erzeugten Dateien und Prüfbericht wie beim PDF
// (ADR-118), angelehnt an die Barrierefreiheitsprüfung von Microsoft Office, ohne eine Konformität zu behaupten.
// - Nachbearbeitung Word: Dokumentsprache in den Standardformaten, dekorative Icons als „dekorativ“ markiert, eindeutige Bild-IDs.
// - Prüfbericht: Titel, Sprache, Überschriften bzw. Folientitel, Alternativtexte (dekorative Bilder zählen nicht),
//   Tabellen mit Kopfzeile.
import JSZip from 'jszip';
import type { PdfAccessibility, PdfCheck } from './pdfAccessibility.js';

export type OfficeAccessibility = PdfAccessibility;

/** Erweiterung „dekorativ“ (Office 2019/365) – ältere Programme überspringen sie */
export const DECORATIVE_EXT = '<a:extLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}"><adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="1"/></a:ext></a:extLst>';
const DECORATIVE = /adec:decorative[^>]*val="1"/;

const text = async (zip: JSZip, name: string) => (await zip.file(name)?.async('string')) ?? '';
const parts = (zip: JSZip, re: RegExp) => Object.keys(zip.files).filter((n) => re.test(n)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const decode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const coreTitle = (core: string) => decode(/<dc:title>([\s\S]*?)<\/dc:title>/.exec(core)?.[1] ?? '').trim();
const attr = (tag: string, name: string) => decode(new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1] ?? '').trim();

/** Bilder mit Alternativtext; dekorative zählen nicht mit */
function figures(tags: { tag: string; full: string }[]) {
  const content = tags.filter((t) => !DECORATIVE.test(t.full));
  const withAlt = content.filter((t) => attr(t.tag, 'descr') || attr(t.tag, 'title'));
  return { total: content.length, withAlt: withAlt.length, decorative: tags.length - content.length };
}
const figureCheck = (f: ReturnType<typeof figures>): PdfCheck => ({
  id: 'figures', label: 'Bilder mit Alternativtext', ok: f.total === f.withAlt,
  detail: `${f.withAlt} von ${f.total}${f.decorative ? `, ${f.decorative} dekorativ` : ''}`,
});

/** Tabellen einzeln, verschachtelte Tabellen herausgelöst (Layout-Boxen enthalten oft Inhaltstabellen) */
function tablesOf(xml: string, open: string, close: string) {
  const out: string[] = [];
  const stack: { start: number; parts: string[]; from: number }[] = [];
  const re = new RegExp(`${open}|${close}`, 'g');
  for (const m of xml.matchAll(re)) {
    if (m[0] !== close) {
      if (stack.length) stack[stack.length - 1].parts.push(xml.slice(stack[stack.length - 1].from, m.index));
      stack.push({ start: m.index!, parts: [], from: m.index! });
    } else if (stack.length) {
      const t = stack.pop()!;
      t.parts.push(xml.slice(t.from, m.index! + m[0].length));
      out.push(t.parts.join(''));
      if (stack.length) stack[stack.length - 1].from = m.index! + m[0].length;
    }
  }
  return out;
}

// ---------------------------------------------------------------- Word

/** Word-Datei nachbearbeiten: Sprache, dekorative Icons (ohne Namen und Beschreibung), eindeutige Bild-IDs */
export async function finishDocx(buf: Buffer, lang = 'de-DE'): Promise<Buffer> {
  const zip = await JSZip.loadAsync(buf);
  const styles = await text(zip, 'word/styles.xml');
  if (styles && !/<w:rPrDefault>[\s\S]*?<w:lang\b[\s\S]*?<\/w:rPrDefault>/.test(styles)) {
    const langTag = `<w:lang w:val="${lang}" w:eastAsia="${lang}" w:bidi="ar-SA"/>`;
    let next = styles.replace(/<w:rPrDefault>\s*<w:rPr>([\s\S]*?)<\/w:rPr>/, (_, inner: string) => `<w:rPrDefault><w:rPr>${inner}${langTag}</w:rPr>`);
    if (next === styles) next = styles.replace(/<w:rPrDefault\s*\/>|<w:rPrDefault>\s*<\/w:rPrDefault>/, `<w:rPrDefault><w:rPr>${langTag}</w:rPr></w:rPrDefault>`);
    if (next === styles) next = styles.replace(/<w:docDefaults>/, `<w:docDefaults><w:rPrDefault><w:rPr>${langTag}</w:rPr></w:rPrDefault>`);
    if (next === styles && !/<w:docDefaults/.test(styles)) next = styles.replace(/(<w:styles\b[^>]*>)/, `$1<w:docDefaults><w:rPrDefault><w:rPr>${langTag}</w:rPr></w:rPrDefault></w:docDefaults>`);
    zip.file('word/styles.xml', next);
  }
  let id = 1;
  for (const name of parts(zip, /^word\/(document|header\d*|footer\d*)\.xml$/)) {
    const xml = await text(zip, name);
    const out = xml.replace(/<wp:docPr\b([^>]*?)(\/>|>([\s\S]*?)<\/wp:docPr>)/g, (_m, attrs: string, _end: string, inner?: string) => {
      const a = attrs.replace(/\bid="\d+"/, `id="${id++}"`);
      const deco = !attr(`<x${attrs}>`, 'name') && !attr(`<x${attrs}>`, 'descr') && !DECORATIVE.test(inner ?? '');
      return `<wp:docPr${a}>${inner ?? ''}${deco ? DECORATIVE_EXT : ''}</wp:docPr>`;
    });
    if (out !== xml) zip.file(name, out);
  }
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

export async function checkDocxAccessibility(buf: Buffer): Promise<OfficeAccessibility> {
  const zip = await JSZip.loadAsync(buf);
  const [core, styles, doc] = await Promise.all([text(zip, 'docProps/core.xml'), text(zip, 'word/styles.xml'), text(zip, 'word/document.xml')]);
  const others = await Promise.all(parts(zip, /^word\/(header|footer)\d*\.xml$/).map((n) => text(zip, n)));
  const lang = /<w:rPrDefault>[\s\S]*?<w:lang\b[^>]*w:val="([^"]+)"/.exec(styles)?.[1] ?? /<w:lang\b[^>]*w:val="([^"]+)"/.exec(doc)?.[1];

  // Überschriften: Formatvorlagen „heading n“/„Title“ oder mit Gliederungsebene
  const headingStyles = new Set<string>(['Title', 'Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5', 'Heading6']);
  for (const m of styles.matchAll(/<w:style\b[^>]*w:styleId="([^"]+)"[^>]*>([\s\S]*?)<\/w:style>/g)) {
    if (/<w:name w:val="(heading \d|Title)"/i.test(m[2]) || /<w:outlineLvl w:val="[0-8]"/.test(m[2])) headingStyles.add(m[1]);
  }
  const paras = doc.match(/<w:p\b[\s\S]*?<\/w:p>/g) ?? [];
  const headings = paras.filter((p) => headingStyles.has(/<w:pStyle w:val="([^"]+)"/.exec(p)?.[1] ?? '') || /<w:outlineLvl w:val="[0-8]"/.test(p)).length;

  const tags = [doc, ...others].flatMap((x) => [...x.matchAll(/<wp:docPr\b([^>]*?)(?:\/>|>([\s\S]*?)<\/wp:docPr>)/g)].map((m) => ({ tag: `<x${m[1]}>`, full: m[0] })));
  // Tabellen mit mehreren Zeilen brauchen eine Kopfzeile, die auf jeder Seite wiederholt wird; einzeilige Tabellen dienen dem Layout
  const tables = tablesOf(doc, '<w:tbl>', '</w:tbl>').filter((t) => (t.match(/<w:tr\b/g) ?? []).length > 1);
  const withHeader = tables.filter((t) => /<w:tblHeader\s*\/>|<w:tblHeader w:val="(true|1|on)"/.test(/<w:tr\b[\s\S]*?<\/w:tr>/.exec(t)?.[0] ?? ''));

  const checks: PdfCheck[] = [
    { id: 'title', label: 'Titel in den Dokumenteigenschaften', ok: !!coreTitle(core), detail: coreTitle(core) || undefined },
    { id: 'lang', label: 'Dokumentsprache angegeben', ok: !!lang, detail: lang },
    { id: 'headings', label: 'Überschriften als Formatvorlage (Navigationsbereich)', ok: headings > 0, detail: `${headings} Überschriften` },
    figureCheck(figures(tags)),
    { id: 'tables', label: 'Tabellen mit Kopfzeile', ok: tables.length === withHeader.length, detail: `${withHeader.length} von ${tables.length}` },
  ];
  return { ok: checks.every((c) => c.ok !== false), checks };
}

// ---------------------------------------------------------------- PowerPoint

export async function checkPptxAccessibility(buf: Buffer): Promise<OfficeAccessibility> {
  const zip = await JSZip.loadAsync(buf);
  const [core, pres] = await Promise.all([text(zip, 'docProps/core.xml'), text(zip, 'ppt/presentation.xml')]);
  const slides = await Promise.all(parts(zip, /^ppt\/slides\/slide\d+\.xml$/).map((n) => text(zip, n)));
  const lang = /<a:defRPr\b[^>]*\blang="([^"]+)"/.exec(pres)?.[1] ?? slides.map((s) => /<a:rPr\b[^>]*\blang="([^"]+)"/.exec(s)?.[1]).find(Boolean);

  // Folientitel: Platzhalter „title“ bzw. „ctrTitle“ mit Text
  const titled = slides.filter((s) => (s.match(/<p:sp>[\s\S]*?<\/p:sp>/g) ?? []).some((sp) => /<p:ph\b[^>]*type="(title|ctrTitle)"/.test(sp) && /<a:t>[^<]*\S[^<]*<\/a:t>/.test(sp))).length;
  const titles = slides.map((s) => {
    const sp = (s.match(/<p:sp>[\s\S]*?<\/p:sp>/g) ?? []).find((x) => /<p:ph\b[^>]*type="(title|ctrTitle)"/.test(x));
    return sp ? [...sp.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => decode(m[1])).join('').trim() : '';
  }).filter(Boolean);
  const duplicates = titles.length - new Set(titles).size;

  const tags = slides.flatMap((s) => [...s.matchAll(/<p:nvPicPr>\s*(<p:cNvPr\b([^>]*?)(?:\/>|>([\s\S]*?)<\/p:cNvPr>))/g)].map((m) => ({ tag: `<x${m[2]}>`, full: m[1] })));
  const tables = slides.flatMap((s) => tablesOf(s, '<a:tbl>', '</a:tbl>'));
  const withHeader = tables.filter((t) => /<a:tblPr\b[^>]*firstRow="1"/.test(t));

  const checks: PdfCheck[] = [
    { id: 'title', label: 'Titel in den Dokumenteigenschaften', ok: !!coreTitle(core), detail: coreTitle(core) || undefined },
    { id: 'lang', label: 'Sprache des Texts angegeben', ok: !!lang, detail: lang },
    { id: 'slideTitles', label: 'Jede Folie mit Titel', ok: slides.length > 0 && titled === slides.length, detail: `${titled} von ${slides.length}${duplicates ? `, ${duplicates} doppelt` : ''}` },
    figureCheck(figures(tags)),
    { id: 'tables', label: 'Tabellen mit Kopfzeile', ok: tables.length === withHeader.length, detail: `${withHeader.length} von ${tables.length}` },
  ];
  return { ok: checks.every((c) => c.ok !== false), checks };
}
