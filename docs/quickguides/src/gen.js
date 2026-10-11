// Quick-Guide-Generator: baut PPTX-Dateien im Layout der oneSCM-Vorlage (780 x 540 pt).
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, 'assets');
const W = 780 / 72, H = 540 / 72; // 10.833 x 7.5 in

const FONT_T = 'MB Corpo A Title Cond Office';
const FONT_B = 'MB Corpo S Text Office';
const C = {
  text: '262626', title: '262626', red: 'B21E23', blue: '00ADEF', cardFill: 'EFF8FF',
  warnFill: 'FFE0E1', warnLine: 'EF5F64', gray: 'BFBFBF', footer: '404040', white: 'FFFFFF', shot: 'F3F3F3',
};
const PT = 1 / 72;

// ---- Inline-Markup: **fett**, ~~rot fett~~, __Link__ -------------------------------------
function runs(text, base) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|~~[^~]+~~|__[^_]+__)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), options: { ...base } });
    const t = m[0];
    if (t.startsWith('**')) out.push({ text: t.slice(2, -2), options: { ...base, bold: true } });
    else if (t.startsWith('~~')) out.push({ text: t.slice(2, -2), options: { ...base, bold: true, color: C.red } });
    else out.push({ text: t.slice(2, -2), options: { ...base, color: C.blue, underline: { style: 'sng' } } });
    last = m.index + t.length;
  }
  if (last < text.length) out.push({ text: text.slice(last), options: { ...base } });
  if (!out.length) out.push({ text: ' ', options: { ...base } });
  return out;
}

function body(size) { return { fontFace: FONT_B, fontSize: size, color: C.text }; }

// Baut ein Array von Text-Runs aus einer Liste von Elementen:
// string  -> Absatz; {steps:[...]} -> nummerierte Liste; {bullets:[...]} -> Aufzählung; {head:'..'} -> fette Zeile
function paragraphs(items, size, opts = {}) {
  const base = body(size);
  const arr = [];
  const para = (text, extra) => {
    const r = runs(text, base);
    r[0].options = { ...r[0].options, ...extra };
    r[r.length - 1].options.breakLine = true;
    arr.push(...r);
  };
  const gap = opts.paraGap ?? Math.round(size * 0.45);
  items.forEach((it) => {
    if (typeof it === 'string') para(it, { paraSpaceAfter: gap });
    else if (it.head !== undefined) { if (it.head) para(`**${it.head}**`, { paraSpaceAfter: 2, color: it.red ? C.red : C.text }); }
    else if (it.steps) {
      it.steps.forEach((s, i) => {
        const sub = Array.isArray(s) ? s : null;
        const text = sub ? s[0] : s;
        para(text, { bullet: { type: 'number', startAt: (it.start || 1) + i, indent: 16 }, indentLevel: 0, paraSpaceAfter: gap });
        if (sub) s.slice(1).forEach((b) => para(b, { bullet: { code: '2022', indent: 12 }, indentLevel: 1, paraSpaceAfter: 2 }));
      });
    } else if (it.bullets) {
      it.bullets.forEach((b) => para(b, { bullet: { code: '2022', indent: 12 }, indentLevel: 0, paraSpaceAfter: it.gap ?? 2 }));
    }
  });
  if (arr.length) arr[arr.length - 1].options.breakLine = false;
  return arr;
}

// ---- Seitenrahmen ------------------------------------------------------------------------
function frame(slide, g, pageNo, pageCount) {
  slide.background = { color: C.white };
  slide.addImage({ path: path.join(SRC, 'stars_bg.png'), x: 0, y: 0, w: W, h: H, objectName: 'Hintergrund' });
  slide.addText(`oneSCM – ${g.title}`, {
    x: 0.22, y: 0.14, w: 8.6, h: 0.5, fontFace: FONT_T, fontSize: 24, color: C.title, margin: 0, isTextBox: true,
    fit: 'shrink', objectName: 'Titel',
  });
  // Logo rechts oben
  slide.addImage({ path: path.join(SRC, 'star.png'), x: 9.35, y: 0.13, w: 0.5, h: 0.48, objectName: 'Logo Stern' });
  slide.addText([
    { text: 'oneSCM', options: { fontFace: FONT_T, fontSize: 14, color: C.title, breakLine: true } },
    { text: g.variant || 'für Van', options: { fontFace: FONT_T, fontSize: 13, color: C.red, italic: true } },
  ], { x: 9.9, y: 0.12, w: 0.9, h: 0.55, margin: 0, isTextBox: true, valign: 'top', lineSpacingMultiple: 0.9, objectName: 'Logo Text' });
  // Fußzeile
  slide.addText(runs(g.footer, body(8)), { x: 0.22, y: 7.12, w: 8.2, h: 0.28, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Fußzeile Hinweis' });
  slide.addText(`STAND: ${g.stand} | ${pageNo}/${pageCount}`, {
    x: 8.5, y: 7.12, w: 2.1, h: 0.28, margin: 0, isTextBox: true, align: 'right', valign: 'middle',
    fontFace: FONT_B, fontSize: 7, color: C.footer, charSpacing: 2.5, objectName: 'Stand',
  });
}

const COL = { top: 0.78, gap: 0.12, left: { x: 0.22, w: 5.1 }, right: { x: 5.52, w: 5.1 } };

function card(slide, x, y, w, h, name) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.1, fill: { color: C.cardFill, transparency: 30 },
    line: { color: C.blue, width: 0.5 }, objectName: name,
  });
}

function shot(slide, x, y, w, h, label) {
  slide.addShape('rect', { x, y, w, h, fill: { color: C.shot }, line: { color: C.gray, width: 0.5 }, objectName: 'Screenshot-Rahmen' });
  slide.addText([
    { text: 'Screenshot', options: { fontFace: FONT_B, fontSize: 7, color: C.footer, bold: true, breakLine: true } },
    { text: label, options: { fontFace: FONT_B, fontSize: 7, color: C.footer } },
  ], { x, y, w, h, margin: 4, isTextBox: true, align: 'center', valign: 'middle', objectName: 'Screenshot-Beschriftung' });
}

function block(slide, b, x, y, w) {
  const h = b.h;
  const size = b.size || 9;
  if (b.type === 'card') {
    card(slide, x, y, w, h, b.title || 'Karte');
    const shotW = b.shot ? Math.min(1.9, w * 0.38) : 0;
    const tw = w - 0.2 - (shotW ? shotW + 0.12 : 0);
    let ty = y + 0.08;
    if (b.title) {
      slide.addText(b.title, { x: x + 0.12, y: ty, w: tw, h: 0.28, margin: 0, isTextBox: true, fontFace: FONT_T, fontSize: 11, bold: true, color: C.title, valign: 'top', objectName: 'Kartentitel' });
      ty += 0.3;
    }
    slide.addText(paragraphs(b.items, size), { x: x + 0.12, y: ty, w: tw, h: y + h - ty - 0.06, margin: 0, isTextBox: true, valign: 'top', objectName: 'Karteninhalt' });
    if (b.img) slide.addImage({ path: path.join(SRC, b.img), x: x + w - 0.1 - shotW, y: y + 0.1, w: shotW, h: Math.min(h - 0.2, b.shotH || 1.25), objectName: 'Kapitelbild' });
    else if (b.shot) shot(slide, x + w - 0.1 - shotW, y + 0.1, shotW, Math.min(h - 0.2, b.shotH || 1.25), b.shot);
  } else if (b.type === 'steps') {
    const shotW = b.shot ? Math.min(1.9, w * 0.38) : 0;
    const tw = w - (shotW ? shotW + 0.12 : 0);
    let ty = y;
    if (b.title) {
      slide.addText(b.title, { x, y: ty, w: tw, h: 0.28, margin: 0, isTextBox: true, fontFace: FONT_T, fontSize: 11, bold: true, color: C.title, valign: 'top', objectName: 'Abschnittstitel' });
      ty += 0.3;
    }
    slide.addText(paragraphs(b.items, size), { x: x + 0.02, y: ty, w: tw - 0.02, h: y + h - ty, margin: 0, isTextBox: true, valign: 'top', objectName: 'Schritte' });
    if (b.shot) shot(slide, x + w - shotW, y + (b.title ? 0.3 : 0), shotW, Math.min(h - 0.3, b.shotH || 1.25), b.shot);
  } else if (b.type === 'overview') {
    slide.addText(b.title || 'Die Prozesse im Überblick', { x, y, w, h: 0.28, margin: 0, isTextBox: true, fontFace: FONT_T, fontSize: 11, bold: true, color: C.title, objectName: 'Überblick Titel' });
    const cw = (w - 0.2) / b.cols.length;
    b.cols.forEach((c, i) => {
      const items = [];
      c.sections.forEach((s) => { items.push({ head: s.head, red: true }); items.push({ bullets: s.bullets, gap: 1 }); items.push(''); });
      items.pop();
      slide.addText(paragraphs(items, size, { paraGap: 1 }), { x: x + i * (cw + 0.2), y: y + 0.3, w: cw, h: h - 0.3, margin: 0, isTextBox: true, valign: 'top', objectName: 'Überblick Spalte' });
    });
  } else if (b.type === 'warn') {
    slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.08, fill: { color: C.warnFill }, line: { color: C.warnLine, width: 1 }, objectName: 'Warnhinweis' });
    slide.addText('!', { x: x + 0.08, y, w: 0.3, h, margin: 0, isTextBox: true, fontFace: FONT_B, fontSize: 16, bold: true, color: C.warnLine, align: 'center', valign: 'middle', objectName: 'Warnzeichen' });
    slide.addText(runs(b.text, { ...body(size), color: C.red }), { x: x + 0.45, y, w: w - 0.55, h, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Warntext' });
  } else if (b.type === 'note') {
    slide.addText(runs(b.text, { ...body(size), color: b.blue ? C.blue : C.text }), { x, y, w, h, margin: 0, isTextBox: true, valign: 'top', objectName: 'Hinweis' });
  } else if (b.type === 'text') {
    slide.addText(paragraphs(b.items, size), { x, y, w, h, margin: 0, isTextBox: true, valign: 'top', objectName: 'Text' });
  } else if (b.type === 'image') {
    slide.addImage({ path: path.join(SRC, b.path), x, y, w, h, objectName: 'Prozessbild' });
  } else if (b.type === 'faq') {
    card(slide, x, y, w, h, 'FAQ');
    const items = [{ head: b.title || 'Häufig gestellte Fragen und Antworten' }];
    const bl = b.qa.map(([q, a]) => `**${q}** ${a}`);
    items.push({ bullets: bl, gap: 3 });
    slide.addText(paragraphs(items, size), { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.14, margin: 0, isTextBox: true, valign: 'top', objectName: 'FAQ Inhalt' });
  }
  return h;
}

function build(g, outFile) {
  const pres = new pptxgen();
  pres.defineLayout({ name: 'QG', width: W, height: H });
  pres.layout = 'QG';
  pres.title = `oneSCM – ${g.title}`;
  pres.author = 'oneSCM Quick Guide';
  const n = g.pages.length;
  g.pages.forEach((p, i) => {
    const slide = pres.addSlide();
    frame(slide, g, i + 1, n);
    ['left', 'right'].forEach((side) => {
      let y = COL.top;
      (p[side] || []).forEach((b) => { y += block(slide, b, COL[side].x, y, COL[side].w) + COL.gap; });
      if (y - COL.gap > 7.08) console.warn(`  ! ${g.nr} Seite ${i + 1} ${side}: Spalte zu hoch (${(y - COL.gap).toFixed(2)} in)`);
    });
  });
  return pres.writeFile({ fileName: outFile }).then(() => fixParagraphProps(outFile));
}

// pptxgenjs schreibt je Textlauf ein <a:pPr>; gültig ist nur das erste je Absatz.
async function fixParagraphProps(file) {
  const JSZip = require('jszip');
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
  for (const n of names) {
    let xml = await zip.file(n).async('string');
    xml = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (m, inner) => {
      let seen = false;
      const cleaned = inner.replace(/<a:pPr[^>]*\/>|<a:pPr[^>]*>[\s\S]*?<\/a:pPr>/g, (pp) => { if (seen) return ''; seen = true; return pp; });
      return `<a:p>${cleaned}</a:p>`;
    });
    zip.file(n, xml);
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

module.exports = { build };

if (require.main === module) {
  const [specFile, outDir] = process.argv.slice(2);
  const specs = JSON.parse(fs.readFileSync(specFile, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  (async () => {
    for (const g of specs) {
      const name = `${String(g.nr).padStart(2, '0')}_Quick_Guide_oneSCM_${g.slug}.pptx`;
      await build(g, path.join(outDir, name));
      console.log('✓', name);
    }
  })();
}
