// SVG-Import (ADR-036): Vektorgrafiken werden nicht übernommen, sondern aus einer Positivliste neu geschrieben.
// Alles Unbekannte (Skripte, foreignObject, Ereignis-Attribute, externe Verweise, Entities) entfällt bzw. führt zur Ablehnung.
// Reine Fachlogik ohne I/O.

const ELEMENTS = new Set([
  'svg', 'g', 'defs', 'symbol', 'use', 'title', 'desc', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
  'text', 'tspan', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'pattern', 'marker',
]);
// Elemente, deren Inhalt komplett entfällt (auch Text)
// Elemente, die selbst entfallen, deren Inhalt aber bleibt (Links werden zu reinem Text/Grafik)
const UNWRAP = new Set(['a', 'switch']);
const DROP_WITH_CONTENT = new Set(['script', 'style', 'foreignobject', 'metadata', 'iframe', 'object', 'embed', 'image', 'audio', 'video', 'animate', 'set', 'animatetransform', 'animatemotion', 'handler', 'listener']);

const PRESENTATION = [
  'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray',
  'stroke-dashoffset', 'opacity', 'color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline', 'letter-spacing',
  'text-decoration', 'visibility', 'display', 'clip-rule', 'stop-color', 'stop-opacity', 'transform', 'clip-path', 'mask', 'marker-start', 'marker-mid', 'marker-end',
];
const ATTRIBUTES = new Set([
  ...PRESENTATION, 'id', 'class', 'xmlns', 'xmlns:xlink', 'version', 'viewbox', 'width', 'height', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'fx', 'fy', 'd', 'points', 'offset', 'gradientunits', 'gradienttransform', 'spreadmethod', 'patternunits', 'patterntransform', 'clippathunits', 'maskunits',
  'preserveaspectratio', 'dx', 'dy', 'rotate', 'textlength', 'lengthadjust', 'markerwidth', 'markerheight', 'refx', 'refy', 'orient', 'markerunits',
  'href', 'xlink:href', 'style', 'role', 'aria-label', 'aria-hidden', 'focusable',
]);
// SVG-Namen mit Großbuchstaben (Ausgabe in korrekter Schreibweise)
const CASE: Record<string, string> = {
  lineargradient: 'linearGradient', radialgradient: 'radialGradient', clippath: 'clipPath', viewbox: 'viewBox', gradientunits: 'gradientUnits',
  gradienttransform: 'gradientTransform', spreadmethod: 'spreadMethod', patternunits: 'patternUnits', patterntransform: 'patternTransform',
  clippathunits: 'clipPathUnits', maskunits: 'maskUnits', preserveaspectratio: 'preserveAspectRatio', textlength: 'textLength', lengthadjust: 'lengthAdjust',
  markerwidth: 'markerWidth', markerheight: 'markerHeight', refx: 'refX', refy: 'refY', markerunits: 'markerUnits',
};

export class SvgRejected extends Error {}

const esc = (s: string) => s.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d{1,7}|#x[0-9a-fA-F]{1,6});)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s: string) => esc(s).replace(/"/g, '&quot;');

/** Verweise nur innerhalb der Grafik (url(#id)); keine Skript-URLs, keine CSS-Tricks */
function safeValue(v: string) {
  const decoded = v.replace(/&#x?[0-9a-f]+;?/gi, '').toLowerCase().replace(/\s+/g, '');
  if (/javascript:|vbscript:|data:|expression\(|@import|\\|behavior:|-moz-binding/.test(decoded)) return false;
  for (const m of decoded.matchAll(/url\(([^)]*)\)/g)) if (!/^['"]?#[\w.:-]+['"]?$/.test(m[1])) return false;
  return true;
}

function safeStyle(style: string) {
  const out: string[] = [];
  for (const decl of style.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim().toLowerCase();
    const value = decl.slice(i + 1).trim();
    if (PRESENTATION.includes(prop) && value && safeValue(value)) out.push(`${prop}:${value}`);
  }
  return out.join(';');
}

const num = (v: string | undefined) => {
  const m = v ? /^\s*([\d.]+)\s*(px)?\s*$/.exec(v) : null;
  return m ? Math.round(Number(m[1])) || null : null;
};

const TAG = /<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/y;
const ATTR = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;

/**
 * SVG bereinigen. Liefert die neu geschriebene Grafik und ihre Größe (aus width/height bzw. viewBox);
 * wirft `SvgRejected`, wenn die Datei kein wohlgeformtes SVG ist oder Entities/DTDs enthält.
 */
export function sanitizeSvg(input: string): { svg: string; width: number | null; height: number | null } {
  let src = input.replace(/^﻿/, '');
  if (/<!DOCTYPE|<!ENTITY|<!\[CDATA\[/i.test(src)) throw new SvgRejected('DTD, Entities und CDATA sind in SVG nicht erlaubt.');
  src = src.replace(/<\?xml[^>]*\?>/gi, '').replace(/<\?[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const out: string[] = [];
  // keep: Element wird ausgegeben; inner: Inhalt (Text, Kindelemente) darf übernommen werden
  const stack: { name: string; keep: boolean; inner: boolean }[] = [];
  let root: Record<string, string> | null = null;
  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    const text = src.slice(i, lt < 0 ? src.length : lt);
    if (text && stack.length && stack[stack.length - 1].inner) out.push(esc(text));
    else if (text.trim() && !stack.length) throw new SvgRejected('Text außerhalb des svg-Elements.');
    if (lt < 0) break;
    TAG.lastIndex = lt;
    const m = TAG.exec(src);
    if (!m) throw new SvgRejected('Kein wohlgeformtes SVG.');
    i = TAG.lastIndex;
    const [, closing, rawName, rawAttrs, selfClosing] = m;
    const name = rawName.toLowerCase().replace(/^svg:/, '');
    if (closing) {
      const top = stack.pop();
      if (!top || top.name !== name) throw new SvgRejected(`Nicht passendes Ende-Tag </${rawName}>.`);
      if (top.keep) out.push(`</${CASE[name] ?? name}>`);
      continue;
    }
    if (!stack.length && name !== 'svg') throw new SvgRejected('Wurzelelement muss svg sein.');
    if (!stack.length && root) throw new SvgRejected('Mehr als ein Wurzelelement.');
    const drop = DROP_WITH_CONTENT.has(name);
    const parentInner = !stack.length || stack[stack.length - 1].inner;
    const keep = parentInner && !drop && ELEMENTS.has(name);
    const inner = parentInner && !drop && (ELEMENTS.has(name) || UNWRAP.has(name));
    if (keep) {
      const attrs: Record<string, string> = {};
      for (const a of rawAttrs.matchAll(ATTR)) {
        const an = a[1].toLowerCase();
        const value = a[2] ?? a[3] ?? '';
        if (!ATTRIBUTES.has(an) || an.startsWith('on')) continue;
        if (an === 'href' || an === 'xlink:href') {
          if (/^#[\w.:-]+$/.test(value.trim())) attrs[an] = value.trim();
          continue;
        }
        if (an === 'xmlns' || an === 'xmlns:xlink') continue; // wird fest gesetzt
        if (an === 'style') {
          const st = safeStyle(value);
          if (st) attrs.style = st;
          continue;
        }
        if (safeValue(value)) attrs[CASE[an] ?? an] = value;
      }
      if (name === 'svg' && !stack.length) {
        root = attrs;
        attrs.xmlns = 'http://www.w3.org/2000/svg';
        if (/xlink:href/.test(src)) attrs['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
      }
      out.push(`<${CASE[name] ?? name}${Object.entries(attrs).map(([k, v]) => ` ${k}="${escAttr(v)}"`).join('')}${selfClosing ? '/' : ''}>`);
    }
    if (!selfClosing) stack.push({ name, keep, inner });
  }
  if (stack.length) throw new SvgRejected(`Element <${stack[stack.length - 1].name}> nicht geschlossen.`);
  if (!root) throw new SvgRejected('Kein svg-Element gefunden.');
  const vb = (root.viewBox ?? '').trim().split(/[\s,]+/).map(Number);
  const width = num(root.width) ?? (vb.length === 4 && vb[2] > 0 ? Math.round(vb[2]) : null);
  const height = num(root.height) ?? (vb.length === 4 && vb[3] > 0 ? Math.round(vb[3]) : null);
  return { svg: out.join(''), width, height };
}

/** Sieht die Datei nach SVG aus (Textdatei, erstes Element svg)? */
export function looksLikeSvg(b: Buffer) {
  const head = b.subarray(0, 2048).toString('utf8').replace(/^﻿/, '').replace(/<\?[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trimStart();
  return /^(<!DOCTYPE\s+svg[^>]*>\s*)?<(svg:)?svg[\s>]/i.test(head);
}
