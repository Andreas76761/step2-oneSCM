// Designvorlagen als PowerPoint (ADR-116), 16:9 – mit denselben Inhalten wie HTML, PDF und Word (domain/designs.ts) und der
// Anpassung der Vorlage (ADR-114):
// - Quick Reference Guide: Titelfolie mit Marke und „Die Prozesse im Überblick“, je Abschnitt eine Karte (abgerundeter Rahmen
//   in der Akzentfarbe, Bildschirmfoto rechts, Warnbox), Links und häufige Fragen; Fußzeile „Hinweis“ und „STAND … | n/N“.
// - Handbuch-Kapitel: Kopfzeile mit Dokumentart und „Folie n von N“, Titelfolie mit Kennzahlen, je Abschnitt Folien mit
//   nummerierter Überschrift und Balken, Tabellen, Hinweis-/Wichtig-/Warn-/Querverweis-Boxen; Fußzeile.
// Lange Inhalte laufen auf Folgefolien „(Fortsetzung)“ weiter. Icons als PNG (Lucide), Bilder eingebettet.
import type { DesignIcon } from '../domain/designIcons.js';
import {
  BOX, cardTitle, chapterFacts, DEFAULT_THEMES, fachdokuFooter, fachdokuLabel, hasInteractiveLinks, processOverview, QR_ICON,
  type Design, type DesignBlock, type DesignChapter, type DesignOptions, type DesignTheme,
} from '../domain/designs.js';
import { markdownParagraphs, paginate, renderPptx, runs, SLIDE, xfrm, esc, type RunStyle, type Slide, type SlideImage, type SlideParagraph } from '../domain/pptxWriter.js';
import { DECORATIVE_EXT } from '../domain/officeAccessibility.js';
import { iconImage } from './designIconRaster.js';
import type { MediaFile } from './media.js';

export interface DesignPptxOptions extends Omit<DesignOptions, 'md' | 'logo'> {
  media: Map<string, MediaFile>;
  logo?: MediaFile | null;
}

const FONT: Record<DesignTheme['headingFont'], string> = { serif: 'Georgia', sans: 'Segoe UI' };
const cm = (v: number) => Math.round(v * 360000);
const hex = (c: string) => c.replace('#', '').toUpperCase();
function mix(a: string, b: string, share: number) {
  const p = (c: string, i: number) => parseInt(c.replace('#', '').slice(i * 2, i * 2 + 2), 16);
  return [0, 1, 2].map((i) => Math.round(p(a, i) * share + p(b, i) * (1 - share)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const IMG_MIME = new Set(['image/png', 'image/jpeg', 'image/gif']);

interface Para { text: string; size: number; style?: RunStyle; bullet?: 'char' | 'num' | null; level?: number; num?: number; align?: 'l' | 'r' | 'ctr'; before?: number }
function paraXml(p: Para) {
  const lvl = Math.min(Math.max(p.level ?? 0, 0), 4);
  const bu = p.bullet === 'num' ? `<a:buFont typeface="+mj-lt"/><a:buAutoNum type="arabicPeriod"${p.num && p.num > 1 ? ` startAt="${p.num}"` : ''}/>` : p.bullet === 'char' ? '<a:buFont typeface="Arial"/><a:buChar char="•"/>' : '<a:buNone/>';
  const marL = p.bullet ? 285750 * (lvl + 1) : 0;
  return `<a:p><a:pPr marL="${marL}" indent="${p.bullet ? -285750 : 0}" algn="${p.align ?? 'l'}"><a:spcBef><a:spcPts val="${p.before ?? 300}"/></a:spcBef>${bu}</a:pPr>${runs(p.text, p.size, p.style)}</a:p>`;
}

/** Formen einer Folie mit fortlaufenden IDs und eingebetteten Bildern (rId2 …) */
class Shapes {
  private id = 2;
  readonly images: SlideImage[] = [];
  private out: string[] = [];
  rect(x: number, y: number, w: number, h: number, o: { fill?: string; line?: string; lineW?: number; geom?: 'rect' | 'roundRect'; radius?: number } = {}) {
    this.out.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Form"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>${xfrm(x, y, w, h)}${this.geom(o.geom, o.radius)}${this.fill(o.fill)}${this.line(o.line, o.lineW)}</p:spPr></p:sp>`);
  }
  text(x: number, y: number, w: number, h: number, paras: Para[], o: { anchor?: 't' | 'ctr' | 'b'; fill?: string; line?: string; lineW?: number; geom?: 'rect' | 'roundRect'; radius?: number; inset?: number; name?: string } = {}) {
    const ins = o.inset ?? cm(0.15);
    const body = paras.length ? paras.map(paraXml).join('') : '<a:p><a:endParaRPr lang="de-DE"/></a:p>';
    // Folientitel als Platzhalter „title“, damit Screenreader und die Barrierefreiheitsprüfung ihn finden (ADR-120)
    const nv = o.name === 'Titel' ? '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr>' : '<p:cNvSpPr txBox="1"/><p:nvPr/>';
    this.out.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="${esc(o.name ?? 'Text')}"/>${nv}</p:nvSpPr><p:spPr>${xfrm(x, y, w, h)}${this.geom(o.geom, o.radius)}${this.fill(o.fill)}${this.line(o.line, o.lineW)}</p:spPr>`
      + `<p:txBody><a:bodyPr wrap="square" lIns="${ins}" tIns="${ins}" rIns="${ins}" bIns="${ins}" anchor="${o.anchor ?? 't'}"><a:normAutofit/></a:bodyPr><a:lstStyle/>${body}</p:txBody></p:sp>`);
  }
  pic(x: number, y: number, w: number, h: number, img: SlideImage) {
    this.images.push(img);
    this.out.push(`<p:pic><p:nvPicPr>${img.decorative ? `<p:cNvPr id="${this.id++}" name="Icon" descr="">${DECORATIVE_EXT}</p:cNvPr>` : `<p:cNvPr id="${this.id++}" name="Bild" descr="${esc(img.alt)}"/>`}<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>`
      + `<p:blipFill><a:blip r:embed="rId${this.images.length + 1}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>${xfrm(x, y, w, h)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`);
  }
  /** Bild in einen Rahmen einpassen (Seitenverhältnis bleibt) */
  fit(x: number, y: number, w: number, h: number, img: SlideImage, line?: string) {
    const ratio = img.width && img.height ? img.width / img.height : 16 / 9;
    const cw = Math.round(Math.min(w, h * ratio));
    const ch = Math.round(cw / ratio);
    if (line) this.rect(x, y, cw, ch, { line, lineW: 6350 });
    this.pic(x, y, cw, ch, img);
  }
  table(x: number, y: number, w: number, rows: string[][], o: { size: number; header: string; line: string }) {
    const cols = Math.max(...rows.map((r) => r.length));
    const colW = Math.floor(w / cols);
    const ln = (tag: string) => `<a:${tag} w="6350"><a:solidFill><a:srgbClr val="${o.line}"/></a:solidFill></a:${tag}>`;
    const tr = rows.map((r, i) => `<a:tr h="${cm(0.7)}">${Array.from({ length: cols }, (_, c) => `<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p>${runs(r[c] ?? '', o.size, i === 0 ? { color: o.header } : c === 0 ? { bold: true } : {})}</a:p></a:txBody>`
      + `<a:tcPr marL="${cm(0.15)}" marR="${cm(0.15)}" marT="${cm(0.08)}" marB="${cm(0.08)}">${ln('lnL')}${ln('lnR')}${ln('lnT')}${ln('lnB')}${i === 0 ? '<a:solidFill><a:srgbClr val="F3F4F6"/></a:solidFill>' : '<a:noFill/>'}</a:tcPr></a:tc>`).join('')}</a:tr>`).join('');
    this.out.push(`<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="${this.id++}" name="Tabelle"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>`
      + `<p:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${colW * cols}" cy="${cm(0.7) * rows.length}"/></p:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1"/>`
      + `<a:tblGrid>${Array.from({ length: cols }, () => `<a:gridCol w="${colW}"/>`).join('')}</a:tblGrid>${tr}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>`);
  }
  xml() {
    return this.out.join('');
  }
  private geom(g: 'rect' | 'roundRect' = 'rect', radius?: number) {
    return `<a:prstGeom prst="${g}"><a:avLst>${g === 'roundRect' ? `<a:gd name="adj" fmla="val ${radius ?? 6000}"/>` : ''}</a:avLst></a:prstGeom>`;
  }
  private fill(c?: string) {
    return c ? `<a:solidFill><a:srgbClr val="${hex(c)}"/></a:solidFill>` : '<a:noFill/>';
  }
  private line(c?: string, w = 12700) {
    return c ? `<a:ln w="${w}"><a:solidFill><a:srgbClr val="${hex(c)}"/></a:solidFill></a:ln>` : '<a:ln><a:noFill/></a:ln>';
  }
}

const iconPic = async (sh: Shapes, name: DesignIcon, color: string, x: number, y: number, size: number) => {
  const { png } = await iconImage(name, color);
  sh.pic(x, y, size, size, { data: png, mime: 'image/png', width: 64, height: 64, alt: '', decorative: true });
};

/** Inhalt eines Absatzes zerlegen: Bilder (media:…), Tabelle, Code, sonst Folienabsätze */
interface Parts { paras: SlideParagraph[]; images: SlideImage[]; table: string[][] | null; code: string | null }
function parts(text: string, media: Map<string, MediaFile>): Parts {
  const images: SlideImage[] = [];
  const rest = text.replace(/!\[([^\]]*)\]\(media:([a-f0-9]{64})\)/g, (_, alt: string, sha: string) => {
    const m = media.get(sha);
    const f = m && (IMG_MIME.has(m.mime) ? m : m.fallback && IMG_MIME.has(m.fallback.mime) ? m.fallback : null);
    if (f) images.push({ data: f.data, mime: f.mime, width: f.width ?? m!.width, height: f.height ?? m!.height, alt });
    return '';
  });
  const code = /```[a-z]*\n([\s\S]*?)```/.exec(rest)?.[1] ?? null;
  const lines = rest.split('\n');
  const tableLines = lines.filter((l) => /^\s*\|/.test(l));
  const table = tableLines.length >= 2 ? tableLines.filter((l) => !/^\s*\|?[\s|:-]*-[\s|:-]*\|?\s*$/.test(l)).map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim().replace(/\\\\/g, '\\'))) : null;
  const textPart = (code ? rest.replace(/```[\s\S]*?```/, '') : rest).split('\n').filter((l) => !table || !/^\s*\|/.test(l)).join('\n');
  return { paras: markdownParagraphs(textPart).filter((p) => p.text.trim()), images, table, code };
}
const paraOf = (p: SlideParagraph, size: number, style: RunStyle = {}): Para => ({ text: p.text, size, style, bullet: p.bullet, level: p.level, num: p.num });

// ---------------------------------------------------------------- Quick Reference Guide

async function quickRefSlides(chapters: DesignChapter[], o: DesignPptxOptions, t: DesignTheme) {
  const H = FONT[t.headingFont];
  const builders: ((n: number, total: number) => Promise<Slide>)[] = [];
  const frame = (sh: Shapes, n: number, total: number) => {
    sh.text(cm(1.2), cm(18.0), cm(22), cm(0.8), o.footerText ? [{ text: `**Hinweis:** ${o.footerText}`, size: 900, style: { color: '1D1D1B' } }] : [], { anchor: 'ctr' });
    sh.text(cm(23.5), cm(18.0), cm(9.2), cm(0.8), [{ text: `STAND: ${o.asOf} | ${n}/${total}`, size: 900, style: { color: '4B5563' }, align: 'r' }], { anchor: 'ctr' });
  };
  const brand = async (sh: Shapes, x: number, y: number, align: 'l' | 'r') => {
    const logo = o.logo && IMG_MIME.has(o.logo.mime) ? o.logo : null;
    const markX = align === 'r' ? x + cm(5.6) : x;
    if (logo) sh.fit(markX - (align === 'r' ? cm(1.8) : 0), y, cm(3), cm(1.3), { data: logo.data, mime: logo.mime, width: logo.width, height: logo.height, alt: o.brand ?? 'Logo' });
    else {
      sh.rect(markX, y, cm(1.3), cm(1.3), { geom: 'roundRect', radius: 50000, line: '9CA3AF', lineW: 15875 });
      await iconPic(sh, 'book-open', '#4B5563', markX + cm(0.3), y + cm(0.3), cm(0.7));
    }
    const tx = align === 'r' ? x : x + cm(1.5);
    sh.text(tx, y - cm(0.1), cm(5.4), cm(1.6), [
      { text: o.brand || 'oneSCM', size: 1600, style: { font: H, color: '374151' }, align, before: 0 },
      ...(o.productLine ? [{ text: o.productLine, size: 1400, style: { font: H, italic: true, color: t.primary }, align, before: 0 } as Para] : []),
    ]);
  };

  // Titelfolie mit Überblick
  builders.push(async (n, total) => {
    const sh = new Shapes();
    const left = t.logo === 'left';
    if (t.logo !== 'none') await brand(sh, left ? cm(1.2) : cm(25.6), cm(0.9), left ? 'l' : 'r');
    sh.text(left ? cm(8.4) : cm(1.2), cm(0.8), cm(24), cm(2.0), [{ text: o.title, size: 3200, style: { font: H, color: '1B1B1B' }, before: 0 }], { anchor: 'ctr', name: 'Titel' });
    let y = cm(2.9);
    if (hasInteractiveLinks(chapters, o)) {
      await iconPic(sh, 'mouse-pointer-click', t.primary, cm(1.35), y + cm(0.12), cm(0.45));
      sh.text(cm(1.9), y, cm(28), cm(0.7), [{ text: 'Dieses Dokument ist interaktiv – enthaltene Links können direkt geöffnet werden.', size: 1100, style: { color: t.primary }, before: 0 }], { anchor: 'ctr' });
      y += cm(1.0);
    }
    const ov = processOverview(chapters);
    if (ov.length) {
      sh.rect(cm(1.2), y, cm(31.4), cm(17.4) - y, { geom: 'roundRect', radius: 4000, line: t.accent, lineW: 19050 });
      await iconPic(sh, 'layers', t.primary, cm(1.7), y + cm(0.45), cm(0.6));
      sh.text(cm(2.5), y + cm(0.25), cm(20), cm(1.0), [{ text: 'Die Prozesse im Überblick', size: 1800, style: { font: H }, before: 0 }], { anchor: 'ctr' });
      const colW = cm(14.8);
      const half = Math.ceil(ov.length / 2);
      [ov.slice(0, half), ov.slice(half)].forEach((col, ci) => {
        if (!col.length) return;
        sh.text(cm(1.7) + ci * (colW + cm(0.6)), y + cm(1.4), colW, cm(17.2) - y - cm(1.5), col.flatMap((x) => [
          { text: x.title, size: 1300, style: { font: H, color: t.warn }, before: 600 } as Para,
          ...x.steps.map((s) => ({ text: s, size: 1100, bullet: 'char', before: 100 }) as Para),
        ]));
      });
    }
    frame(sh, n, total);
    return { kind: 'custom', title: o.title, shapes: sh.xml(), images: sh.images };
  });

  // Karte als Folie(n)
  const card = async (title: string, ic: DesignIcon, blocks: DesignBlock[]) => {
    const all = blocks.map((b) => ({ b, p: parts(b.text, o.media) }));
    const images = all.flatMap((x) => x.p.images);
    const warnings = all.filter((x) => x.b.kind === 'warning');
    const text: Para[] = [];
    for (const { b, p } of all) {
      if (b.kind === 'warning') continue;
      const prefix = b.kind === 'note' ? 'Hinweis' : b.kind === 'tip' ? 'Tipp' : b.kind === 'xref' ? 'Siehe auch' : null;
      p.paras.forEach((x, i) => text.push(paraOf({ ...x, text: i === 0 && prefix ? `**${prefix}:** ${x.text}` : x.text }, 1400)));
      if (p.table) p.table.forEach((r) => text.push({ text: r.join(' · '), size: 1200 }));
      if (p.code) p.code.split('\n').forEach((l) => text.push({ text: l, size: 1100, style: { font: 'Consolas' }, before: 0 }));
    }
    const pages = text.length ? paginate(text.map((x) => ({ ...x, text: x.text })), warnings.length ? 7 : 9, 120) as unknown as Para[][] : [[]];
    pages.forEach((page, pi) => builders.push(async (n, total) => {
      const sh = new Shapes();
      sh.rect(cm(1.2), cm(0.9), cm(31.4), cm(16.6), { geom: 'roundRect', radius: 4000, line: t.accent, lineW: 19050 });
      await iconPic(sh, ic, t.primary, cm(1.8), cm(1.45), cm(0.7));
      sh.text(cm(2.7), cm(1.2), cm(28), cm(1.2), [{ text: pi ? `${title} (Fortsetzung)` : title, size: 2200, style: { font: H, color: '1B1B1B' }, before: 0 }], { anchor: 'ctr', name: 'Titel' });
      const img = pi === 0 ? images[0] : undefined;
      const textW = img ? cm(17.6) : cm(29.6);
      const warnH = pi === pages.length - 1 && warnings.length ? cm(1.6) * warnings.length + cm(0.3) : 0;
      sh.text(cm(1.8), cm(2.6), textW, cm(14.4) - warnH, page as Para[]);
      if (img) sh.fit(cm(20.0), cm(2.8), cm(12.0), cm(8.0), img, 'D1D5DB');
      if (warnH) {
        let y = cm(17.0) - warnH;
        for (const w of warnings) {
          sh.rect(cm(1.8), y, cm(30.2), cm(1.4), { geom: 'roundRect', radius: 16000, fill: mix(t.warn, '#ffffff', 0.06), line: mix(t.warn, '#ffffff', 0.6), lineW: 19050 });
          await iconPic(sh, 'circle-alert', t.warn, cm(2.2), y + cm(0.3), cm(0.8));
          sh.text(cm(3.3), y, cm(28.5), cm(1.4), w.p.paras.map((x) => paraOf(x, 1300, {})).map((x) => ({ ...x, before: 0 })), { anchor: 'ctr' });
          y += cm(1.6);
        }
      }
      frame(sh, n, total);
      return { kind: 'custom', title, shapes: sh.xml(), images: sh.images };
    }));
  };

  for (const [i, c] of chapters.entries()) for (const s of c.sections) await card(cardTitle(chapters, i, s), QR_ICON[s.code] ?? 'file-text', s.blocks);
  if (o.links) await card('Wichtige Links und Ansprechpartner', 'link', [{ kind: 'paragraph', text: o.links }]);
  if (o.faq?.length) await card('Häufig gestellte Fragen und Antworten', 'circle-question-mark', o.faq.map((f) => ({ kind: 'paragraph', text: `**${f.question}**\n${f.answer}` })));
  return builders;
}

// ---------------------------------------------------------------- Handbuch-Kapitel

const FD_COLORS: Record<string, (t: DesignTheme) => { bar: string; text?: string }> = {
  info: (t) => ({ bar: t.accent }),
  tip: () => ({ bar: '#C76B00', text: '8A4B00' }),
  warn: (t) => ({ bar: t.warn, text: mix(t.warn, '#000000', 0.7) }),
  xref: (t) => ({ bar: t.primary }),
};

/** geschätzte Höhe in cm (für die Verteilung auf Folien) */
const lineCm = (text: string, perLine = 95) => Math.max(1, Math.ceil(text.length / perLine)) * 0.6;

async function fachdokuSlides(chapters: DesignChapter[], o: DesignPptxOptions, t: DesignTheme) {
  const H = FONT[t.headingFont];
  const label = fachdokuLabel(chapters, o);
  const builders: ((n: number, total: number) => Promise<Slide>)[] = [];
  const frame = (sh: Shapes, n: number, total: number) => {
    sh.text(cm(1.2), cm(0.35), cm(24), cm(0.8), [{ text: label, size: 1000, style: { bold: true, color: t.primary }, before: 0 }], { anchor: 'b' });
    sh.text(cm(25), cm(0.35), cm(7.6), cm(0.8), [{ text: `Folie ${n} von ${total}`, size: 1000, align: 'r', before: 0 }], { anchor: 'b' });
    sh.rect(cm(1.2), cm(1.2), cm(31.4), cm(0.04), { fill: t.primary });
    sh.rect(cm(1.2), cm(17.95), cm(31.4), cm(0.02), { fill: '#D9DEE5' });
    sh.text(cm(1.2), cm(18.0), cm(20), cm(0.7), [{ text: fachdokuFooter(o), size: 900, style: { color: '5F6B7A' }, before: 0 }], { anchor: 'ctr' });
    sh.text(cm(21.5), cm(18.0), cm(11.1), cm(0.7), [{ text: o.title, size: 900, style: { color: '5F6B7A' }, align: 'r', before: 0 }], { anchor: 'ctr' });
  };
  for (const [ci, c] of chapters.entries()) {
    const { sub, kpis } = chapterFacts(c);
    builders.push(async (n, total) => {
      const sh = new Shapes();
      const left = t.logo === 'left';
      const showBrand = ci === 0 && t.logo !== 'none';
      if (showBrand) {
        const logo = o.logo && IMG_MIME.has(o.logo.mime) ? o.logo : null;
        const bx = left ? cm(1.2) : cm(26.6);
        if (logo) sh.fit(bx, cm(1.9), cm(4), cm(1.1), { data: logo.data, mime: logo.mime, width: logo.width, height: logo.height, alt: o.brand ?? 'Logo' });
        else {
          await iconPic(sh, 'book-open', t.accent, bx, cm(2.0), cm(0.8));
          sh.text(bx + cm(1.0), cm(1.8), cm(5), cm(1.2), [{ text: o.brand || 'oneSCM', size: 1200, style: { bold: true, color: t.primary }, before: 0 }, ...(o.productLine ? [{ text: o.productLine, size: 1000, style: { color: '5F6B7A' }, before: 0 } as Para] : [])], { anchor: 'ctr' });
        }
      }
      const tx = showBrand && left ? cm(7.4) : cm(1.2);
      sh.text(tx, cm(2.2), cm(25), cm(3.2), [{ text: c.title, size: 4000, style: { font: H, bold: true, color: t.primary }, before: 0 }], { anchor: 'b', name: 'Titel' });
      sh.text(tx, cm(5.6), cm(28), cm(2.0), [{ text: sub, size: 1600, style: { color: '5F6B7A' }, before: 0 }]);
      const kw = cm(7.4);
      for (const [k, [ic, v, l]] of kpis.entries()) {
        const x = cm(1.2) + k * (kw + cm(0.6));
        sh.rect(x, cm(9.0), kw, cm(3.6), { geom: 'roundRect', radius: 5000, line: '#D9DEE5', lineW: 9525 });
        sh.rect(x, cm(9.0), kw, cm(0.12), { fill: t.primary });
        await iconPic(sh, ic, t.accent, x + cm(0.5), cm(9.75), cm(0.8));
        sh.text(x + cm(1.5), cm(9.4), kw - cm(1.7), cm(1.4), [{ text: v, size: 2800, style: { bold: true, color: t.primary, font: H }, before: 0 }], { anchor: 'ctr' });
        sh.text(x + cm(0.4), cm(10.9), kw - cm(0.8), cm(1.5), [{ text: l, size: 1100, style: { color: '5F6B7A' }, before: 0 }]);
      }
      frame(sh, n, total);
      return { kind: 'custom', title: c.title, shapes: sh.xml(), images: sh.images };
    });

    // Abschnitte: Inhalte nach geschätzter Höhe auf Folien verteilen
    for (const [si, s] of c.sections.entries()) {
      type Item = { h: number; draw: (sh: Shapes, y: number) => Promise<void> };
      const items: Item[] = [];
      for (const b of s.blocks) {
        const p = parts(b.text, o.media);
        const kind = BOX[b.kind];
        if (kind) {
          const col = FD_COLORS[kind.cls](t);
          const body = p.paras.map((x) => paraOf(x, 1300, col.text ? { color: col.text } : {}));
          const h = 0.9 + body.reduce((a, x) => a + lineCm(x.text, 100), 0) + 0.3;
          items.push({ h, draw: async (sh, y) => {
            if (kind.cls === 'xref') sh.rect(cm(1.2), y, cm(31.4), cm(h), { line: '#D9DEE5', lineW: 9525 });
            sh.rect(cm(1.2), y, cm(0.18), cm(h), { fill: col.bar });
            await iconPic(sh, kind.icon, `#${col.text ?? hex(col.bar)}`, cm(1.7), y + cm(0.25), cm(0.5));
            sh.text(cm(2.3), y + cm(0.1), cm(29), cm(0.8), [{ text: kind.label, size: 1300, style: { bold: true, color: col.text }, before: 0 }], { anchor: 'ctr' });
            sh.text(cm(1.6), y + cm(0.85), cm(30.8), cm(h - 0.9), body.map((x) => ({ ...x, before: 100 })));
          } });
          continue;
        }
        if (p.paras.length) {
          const body = p.paras.map((x) => paraOf(x, 1300));
          const h = body.reduce((a, x) => a + lineCm(x.text, 105) + 0.1, 0) + 0.3;
          items.push({ h, draw: async (sh, y) => sh.text(cm(1.2), y, cm(31.4), cm(h), body.map((x) => ({ ...x, before: 150 }))) });
        }
        if (p.table) {
          const rows = p.table;
          items.push({ h: rows.length * 0.7 + 0.4, draw: async (sh, y) => sh.table(cm(1.2), y, cm(31.4), rows, { size: 1100, header: '5F6B7A', line: 'D9DEE5' }) });
        }
        if (p.code) {
          const code = p.code.replace(/\n$/, '').split('\n');
          const h = code.length * 0.5 + 0.5;
          items.push({ h, draw: async (sh, y) => sh.text(cm(1.2), y, cm(31.4), cm(h), code.map((l) => ({ text: l || ' ', size: 1000, style: { font: 'Consolas', color: '5F6B7A' }, before: 0 })), { line: '#D9DEE5', lineW: 9525, inset: cm(0.3) }) });
        }
        for (const img of p.images) items.push({ h: 6.5, draw: async (sh, y) => sh.fit(cm(1.2), y, cm(14), cm(6.2), img, 'D9DEE5') });
      }
      // verteilen: Platz unter der Überschrift bis zur Fußlinie
      const pages: Item[][] = [[]];
      let used = 0;
      const room = 17.6 - 3.3;
      for (const it of items) {
        if (used && used + it.h > room) {
          pages.push([]);
          used = 0;
        }
        pages[pages.length - 1].push(it);
        used += it.h + 0.3;
      }
      pages.forEach((page, pi) => builders.push(async (n, total) => {
        const sh = new Shapes();
        sh.rect(cm(1.2), cm(1.75), cm(0.22), cm(1.0), { fill: t.primary });
        sh.text(cm(1.7), cm(1.6), cm(30.8), cm(1.3), [{ text: `${si + 1}. ${s.title}${pi ? ' (Fortsetzung)' : ''}`, size: 2400, style: { font: H, bold: true, color: t.primary }, before: 0 }], { anchor: 'ctr', name: 'Titel' });
        let y = 3.3;
        for (const it of page) {
          await it.draw(sh, cm(y));
          y += it.h + 0.3;
        }
        frame(sh, n, total);
        return { kind: 'custom', title: `${si + 1}. ${s.title}`, shapes: sh.xml(), images: sh.images };
      }));
    }
  }
  return builders;
}

/** Designvorlage als .pptx (ADR-116) */
export async function renderDesignPptx(design: Exclude<Design, 'standard'>, chapters: DesignChapter[], o: DesignPptxOptions): Promise<Buffer> {
  const t = o.theme ?? DEFAULT_THEMES[design];
  const builders = design === 'quickref' ? await quickRefSlides(chapters, o, t) : await fachdokuSlides(chapters, o, t);
  const slides: Slide[] = [];
  for (const [i, b] of builders.entries()) slides.push(await b(i + 1, builders.length));
  return renderPptx(slides, { title: o.title, color: t.primary, fonts: { major: FONT[t.headingFont], minor: FONT[t.bodyFont] } });
}
