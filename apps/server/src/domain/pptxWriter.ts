// Ausgabe als PowerPoint (ADR-106, W-07): schlanker OOXML-Generator (16:9) mit Titel- und Inhaltsfolien, Aufzählungen,
// Fettdruck und Bildern. Ohne Fremdbibliothek; das Ergebnis liest der eigene PPTX-Import (domain/pptx) wieder ein.
import JSZip from 'jszip';

export interface SlideImage { data: Buffer; mime: string; width: number | null; height: number | null; alt: string }
export interface SlideParagraph { text: string; bullet?: 'char' | 'num' | null; level?: number; /** Nummer aus dem Markdown – bleibt über Unterpunkte und Folgefolien erhalten */ num?: number }
export type Slide =
  | { kind: 'title'; title: string; subtitle?: string }
  | { kind: 'content'; title: string; paragraphs: SlideParagraph[] }
  | { kind: 'image'; title: string; image: SlideImage }
  /** frei gestaltete Folie (Designvorlagen, ADR-116): fertige Formen; Bilder als r:embed="rId2", "rId3" … in Reihenfolge */
  | { kind: 'custom'; title: string; shapes: string; images: SlideImage[] };

const W = 12192000;
const H = 6858000;
/** Foliengröße 16:9 in EMU */
export const SLIDE = { W, H } as const;
const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpeg', 'image/gif': 'gif' };

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // in XML 1.0 unzulässige Steuerzeichen entfernen
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

export interface RunStyle { color?: string; font?: string; bold?: boolean; italic?: boolean }
/** Text mit **Fettdruck** in Läufe zerlegen; übrige Markdown-Zeichen (`, _, Links) werden schlichter Text */
export function runs(text: string, size: number, st: RunStyle = {}) {
  const clean = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/`([^`]*)`/g, '$1');
  const out: string[] = [];
  const parts = clean.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== '');
  for (const p of parts.length ? parts : ['']) {
    const bold = /^\*\*[^*]+\*\*$/.test(p);
    const fill = st.color ? `<a:solidFill><a:srgbClr val="${st.color.replace('#', '').toUpperCase()}"/></a:solidFill>` : '';
    const font = st.font ? `<a:latin typeface="${esc(st.font)}"/>` : '';
    const attrs = `lang="de-DE" sz="${size}"${bold || st.bold ? ' b="1"' : ''}${st.italic ? ' i="1"' : ''} dirty="0"`;
    out.push(`<a:r><a:rPr ${attrs}${fill || font ? `>${fill}${font}</a:rPr>` : '/>'}<a:t>${esc(bold ? p.slice(2, -2) : p)}</a:t></a:r>`);
  }
  return out.join('');
}

export const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const GRP = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
export const xfrm = (x: number, y: number, cx: number, cy: number) => `<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`;
const BOX = { title: [457200, 304800, W - 914400, 1005840], body: [457200, 1463040, W - 914400, H - 1920240], ctr: [914400, 2011680, W - 1828800, 1463040], sub: [914400, 3611880, W - 1828800, 1005840] } as const;

function shape(id: number, name: string, ph: string, box: readonly number[], body: string, anchor = 't') {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${esc(name)}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr>${ph}</p:nvPr></p:nvSpPr>`
    + `<p:spPr>${xfrm(box[0], box[1], box[2], box[3])}</p:spPr><p:txBody><a:bodyPr wrap="square" anchor="${anchor}"><a:normAutofit/></a:bodyPr><a:lstStyle/>${body}</p:txBody></p:sp>`;
}

function paragraph(p: SlideParagraph, size: number) {
  const lvl = Math.min(Math.max(p.level ?? 0, 0), 4);
  const indent = 342900 * (lvl + 1);
  const bu = p.bullet === 'num' ? `<a:buFont typeface="+mj-lt"/><a:buAutoNum type="arabicPeriod"${p.num && p.num > 1 ? ` startAt="${p.num}"` : ''}/>` : p.bullet === 'char' ? '<a:buFont typeface="Arial"/><a:buChar char="•"/>' : '<a:buNone/>';
  const spc = '<a:spcBef><a:spcPts val="600"/></a:spcBef>';
  const pPr = p.bullet ? `<a:pPr marL="${indent}" lvl="${lvl}" indent="-342900">${spc}${bu}</a:pPr>` : `<a:pPr marL="0" indent="0">${spc}${bu}</a:pPr>`;
  return `<a:p>${pPr}${runs(p.text, size)}</a:p>`;
}

function slideXml(s: Slide, imageRel: string | null) {
  const title = (t: string, type = 'title', box: readonly number[] = BOX.title, size = 3200) =>
    shape(2, 'Titel', `<p:ph type="${type}"/>`, box, `<a:p>${runs(t, size)}</a:p>`, type === 'ctrTitle' ? 'b' : 'ctr');
  let tree = '';
  if (s.kind === 'title') {
    tree = title(s.title, 'ctrTitle', BOX.ctr, 4000) + (s.subtitle ? shape(3, 'Untertitel', '<p:ph type="subTitle" idx="1"/>', BOX.sub, `<a:p><a:pPr marL="0" indent="0" algn="ctr"><a:buNone/></a:pPr>${runs(s.subtitle, 1800)}</a:p>`) : '');
  } else if (s.kind === 'content') {
    tree = title(s.title) + shape(3, 'Inhalt', '<p:ph type="body" idx="1"/>', BOX.body, s.paragraphs.length ? s.paragraphs.map((p) => paragraph(p, 2000)).join('') : '<a:p><a:endParaRPr lang="de-DE"/></a:p>');
  } else if (s.kind === 'custom') {
    tree = s.shapes;
  } else {
    // Bild einpassen (Seitenverhältnis bleibt), mittig unter dem Titel
    const [bx, by, bw, bh] = BOX.body;
    const ratio = s.image.width && s.image.height ? s.image.width / s.image.height : 16 / 9;
    const cw = Math.round(Math.min(bw, bh * ratio));
    const ch = Math.round(cw / ratio);
    tree = title(s.title) + `<p:pic><p:nvPicPr><p:cNvPr id="3" name="Bild" descr="${esc(s.image.alt)}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>`
      + `<p:blipFill><a:blip r:embed="${imageRel}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>${xfrm(bx + Math.round((bw - cw) / 2), by + Math.round((bh - ch) / 2), cw, ch)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
  }
  return `${XML}<p:sld ${NS}><p:cSld><p:spTree>${GRP}${tree}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

const rel = (id: string, type: string, target: string) => `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"/>`;
const rels = (items: string[]) => `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items.join('')}</Relationships>`;

function theme(color: string, fonts: { major: string; minor: string }) {
  const c = color.replace('#', '').toUpperCase();
  const fill = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';
  const ln = '<a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>';
  return `${XML}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="oneSCM"><a:themeElements>`
    + `<a:clrScheme name="oneSCM"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F2937"/></a:dk2><a:lt2><a:srgbClr val="F3F4F6"/></a:lt2>`
    + `<a:accent1><a:srgbClr val="${c}"/></a:accent1><a:accent2><a:srgbClr val="B91C1C"/></a:accent2><a:accent3><a:srgbClr val="15803D"/></a:accent3><a:accent4><a:srgbClr val="B45309"/></a:accent4><a:accent5><a:srgbClr val="6D28D9"/></a:accent5><a:accent6><a:srgbClr val="0E7490"/></a:accent6>`
    + '<a:hlink><a:srgbClr val="1D4ED8"/></a:hlink><a:folHlink><a:srgbClr val="6D28D9"/></a:folHlink></a:clrScheme>'
    + `<a:fontScheme name="oneSCM"><a:majorFont><a:latin typeface="${esc(fonts.major)}"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="${esc(fonts.minor)}"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>`
    + `<a:fmtScheme name="oneSCM"><a:fillStyleLst>${fill}${fill}${fill}</a:fillStyleLst><a:lnStyleLst>${ln}${ln}${ln}</a:lnStyleLst>`
    + '<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>'
    + `<a:bgFillStyleLst>${fill}${fill}${fill}</a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
}

function master() {
  const ph = (id: number, type: string, box: readonly number[]) => `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${type}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="${type}"${type === 'body' ? ' idx="1"' : ''}/></p:nvPr></p:nvSpPr><p:spPr>${xfrm(box[0], box[1], box[2], box[3])}</p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="de-DE"/></a:p></p:txBody></p:sp>`;
  const lvl = (n: number, size: number, color: string) => `<a:lvl${n}pPr marL="${n === 1 ? 0 : 342900 * n}" indent="${n === 1 ? 0 : -342900}"><a:defRPr sz="${size}"><a:solidFill><a:schemeClr val="${color}"/></a:solidFill><a:latin typeface="+mn-lt"/></a:defRPr></a:lvl${n}pPr>`;
  return `${XML}<p:sldMaster ${NS}><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>${GRP}${ph(2, 'title', BOX.title)}${ph(3, 'body', BOX.body)}</p:spTree></p:cSld>`
    + '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
    + '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/><p:sldLayoutId id="2147483650" r:id="rId2"/></p:sldLayoutIdLst>'
    + `<p:txStyles><p:titleStyle>${lvl(1, 3200, 'accent1').replace('<a:lvl1pPr marL="0" indent="0">', '<a:lvl1pPr marL="0" indent="0" algn="l">')}</p:titleStyle><p:bodyStyle>${[1, 2, 3].map((n) => lvl(n, n === 1 ? 2000 : 1800, 'tx1')).join('')}</p:bodyStyle><p:otherStyle>${lvl(1, 1800, 'tx1')}</p:otherStyle></p:txStyles></p:sldMaster>`;
}

const layout = (type: 'title' | 'obj', name: string) =>
  `${XML}<p:sldLayout ${NS} type="${type}" preserve="1"><p:cSld name="${name}"><p:spTree>${GRP}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;

/** Präsentation (PPTX) aus Folien; `color` ist die Hausfarbe (Titel) */
export async function renderPptx(slides: Slide[], opts: { title: string; color?: string; author?: string; created?: string; fonts?: { major: string; minor: string } }): Promise<Buffer> {
  const zip = new JSZip();
  const created = opts.created ?? new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const images: { file: string; mime: string }[] = [];
  const exts = new Set<string>();
  slides.forEach((s, i) => {
    const n = i + 1;
    let imageRel: string | null = null;
    const r = [rel('rId1', 'slideLayout', `../slideLayouts/slideLayout${s.kind === 'title' ? 1 : 2}.xml`)];
    const pics = s.kind === 'image' ? [s.image] : s.kind === 'custom' ? s.images : [];
    pics.forEach((img, k) => {
      const ext = EXT[img.mime] ?? 'png';
      exts.add(ext);
      const file = `image${images.length + 1}.${ext}`;
      images.push({ file, mime: img.mime });
      zip.file(`ppt/media/${file}`, img.data);
      r.push(rel(`rId${k + 2}`, 'image', `../media/${file}`));
    });
    if (s.kind === 'image') imageRel = 'rId2';
    zip.file(`ppt/slides/slide${n}.xml`, slideXml(s, imageRel));
    zip.file(`ppt/slides/_rels/slide${n}.xml.rels`, rels(r));
  });
  const ct = [
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>', '<Default Extension="xml" ContentType="application/xml"/>',
    ...[...exts].map((e) => `<Default Extension="${e}" ContentType="image/${e}"/>`),
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
    '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
    '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
    '<Override PartName="/ppt/slideLayouts/slideLayout2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
    '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
    '<Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>',
    '<Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>',
    '<Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>',
    ...slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`),
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
  ];
  zip.file('[Content_Types].xml', `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${ct.join('')}</Types>`);
  zip.file('_rels/.rels', rels([
    rel('rId1', 'officeDocument', 'ppt/presentation.xml'),
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>',
    rel('rId3', 'extended-properties', 'docProps/app.xml'),
  ]));
  zip.file('docProps/core.xml', `${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(opts.title)}</dc:title><dc:creator>${esc(opts.author ?? 'oneSCM Handbook Studio')}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${created}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${created}</dcterms:modified></cp:coreProperties>`);
  zip.file('docProps/app.xml', `${XML}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>oneSCM Handbook Studio</Application><Slides>${slides.length}</Slides></Properties>`);
  zip.file('ppt/presentation.xml', `${XML}<p:presentation ${NS} saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>`
    + `<p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 10}"/>`).join('')}</p:sldIdLst><p:sldSz cx="${W}" cy="${H}"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="de-DE"/></a:defPPr></p:defaultTextStyle></p:presentation>`);
  zip.file('ppt/_rels/presentation.xml.rels', rels([
    rel('rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'), rel('rId2', 'theme', 'theme/theme1.xml'),
    rel('rId3', 'presProps', 'presProps.xml'), rel('rId4', 'viewProps', 'viewProps.xml'), rel('rId5', 'tableStyles', 'tableStyles.xml'),
    ...slides.map((_, i) => rel(`rId${i + 10}`, 'slide', `slides/slide${i + 1}.xml`)),
  ]));
  zip.file('ppt/presProps.xml', `${XML}<p:presentationPr ${NS}/>`);
  zip.file('ppt/viewProps.xml', `${XML}<p:viewPr ${NS}><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>`);
  zip.file('ppt/tableStyles.xml', `${XML}<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`);
  zip.file('ppt/slideMasters/slideMaster1.xml', master());
  zip.file('ppt/slideMasters/_rels/slideMaster1.xml.rels', rels([rel('rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'), rel('rId2', 'slideLayout', '../slideLayouts/slideLayout2.xml'), rel('rId3', 'theme', '../theme/theme1.xml')]));
  zip.file('ppt/slideLayouts/slideLayout1.xml', layout('title', 'Titelfolie'));
  zip.file('ppt/slideLayouts/slideLayout2.xml', layout('obj', 'Titel und Inhalt'));
  for (const n of [1, 2]) zip.file(`ppt/slideLayouts/_rels/slideLayout${n}.xml.rels`, rels([rel('rId1', 'slideMaster', '../slideMasters/slideMaster1.xml')]));
  zip.file('ppt/theme/theme1.xml', theme(opts.color ?? '#1F4E79', opts.fonts ?? { major: 'Calibri', minor: 'Calibri' }));
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

/** Absatztext (Markdown) in Folienabsätze: Listenpunkte als Aufzählung bzw. Nummerierung, sonst Absätze */
export function markdownParagraphs(md: string): SlideParagraph[] {
  const out: SlideParagraph[] = [];
  for (const raw of md.replace(/\r\n?/g, '\n').split('\n')) {
    if (!raw.trim() || /^\s*\|?[\s|:-]*-[\s|:-]*\|?\s*$/.test(raw)) continue;
    const m = /^(\s*)(\d+[.)]|[-*•])\s+(.*)$/.exec(raw);
    if (m) out.push({ text: m[3].trim(), bullet: /\d/.test(m[2]) ? 'num' : 'char', level: Math.floor(m[1].length / 2), ...(/\d/.test(m[2]) ? { num: parseInt(m[2], 10) } : {}) });
    else out.push({ text: raw.replace(/^#{1,6}\s+/, '').replace(/^>\s?/, '').replace(/^\|\s*|\s*\|$/g, '').replace(/\s*\|\s*/g, ' · ').trim() });
  }
  return out;
}

/** Absätze auf Folien verteilen: höchstens `max` Absätze bzw. etwa 110 Wörter je Folie */
export function paginate(paragraphs: SlideParagraph[], max = 8, maxWords = 110): SlideParagraph[][] {
  const pages: SlideParagraph[][] = [];
  let cur: SlideParagraph[] = [];
  let words = 0;
  for (const p of paragraphs) {
    const w = p.text.split(/\s+/).filter(Boolean).length;
    if (cur.length && (cur.length >= max || words + w > maxWords)) {
      pages.push(cur);
      cur = [];
      words = 0;
    }
    cur.push(p);
    words += w;
  }
  if (cur.length) pages.push(cur);
  return pages;
}
