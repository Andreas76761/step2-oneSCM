// Bilder aus Text (ADR-041): Struktur aus Handbuchtext erkennen (Schritte, Entscheidungen, Klickpfad, Kennzahlen) und daraus
// ASCII-Bild, Klickstrecke, Prozessbild und Infografik als SVG zeichnen. Reine Fachlogik ohne I/O; die SVGs bestehen nur aus
// Elementen der SVG-Positivliste (domain/svg.ts) und werden beim Speichern zusätzlich bereinigt.

export const DIAGRAM_KINDS = ['ascii', 'clickpath', 'process', 'infographic'] as const;
export type DiagramKind = (typeof DIAGRAM_KINDS)[number];
export const KIND_LABEL: Record<DiagramKind, string> = { ascii: 'ASCII-Bild', clickpath: 'Klickstrecke', process: 'Prozessbild', infographic: 'Infografik' };

export interface DiagramStep { label: string; decision?: boolean; yes?: string; no?: string }
export interface DiagramFact { label: string; value: string }
export interface DiagramStructure { title: string; steps: DiagramStep[]; clicks: string[]; facts: DiagramFact[] }

const MAX_STEPS = 12;
const MAX_CLICKS = 10;
const MAX_FACTS = 6;
const MAX_LABEL = 90;

const clean = (s: string) => s.replace(/\*\*|__|`/g, '').replace(/\s+/g, ' ').trim();
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const cut = (s: string, n = MAX_LABEL) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const stripEnd = (s: string) => s.replace(/[.:;!]+$/, '').trim();

/** Sätze bzw. Listenpunkte in Lesereihenfolge (Überschriften liefern den Titel) */
function units(text: string): { title: string | null; items: string[] } {
  let title: string | null = null;
  const items: string[] = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const h = /^#{1,6}\s+(.+)$/.exec(line);
    if (h) {
      title ??= clean(h[1]);
      continue;
    }
    const li = /^(?:[-*+•]|\d{1,2}[.)])\s+(.+)$/.exec(line);
    if (li) {
      items.push(clean(li[1]));
      continue;
    }
    // Fließtext in Sätze zerlegen (Abkürzungen wie „z. B.“ trennen nicht)
    const parts = clean(line).split(/(?<=[.!?])\s+(?=[\p{Lu}\d„"])/u);
    let buf = '';
    parts.forEach((p, i) => {
      buf = buf ? `${buf} ${p}` : p;
      const abbr = /(?:^|\s)(?:\p{L}\.\s?\p{Lu}|\p{Ll}|[Cc]a|[Gg]gf|[Bb]zw|[Bb]zgl|Nr|[Vv]gl|[Ii]nkl|[Ee]vtl|usw|etc)\.$/u.test(buf)
        || (/(?:^|\s)\p{Lu}\.$/u.test(buf) && /^\p{L}\./u.test(parts[i + 1] ?? ''));
      if (abbr) return;
      items.push(buf);
      buf = '';
    });
    if (buf) items.push(buf);
  }
  return { title, items };
}

const DECISION = /^(?:wenn|falls|sofern|ist|sind|liegt|gibt es|existiert)\b/i;

const FINITE = /^(?:ist|sind|hat|haben|liegt|liegen|fehlt|fehlen|existiert|existieren|gibt|wird|werden|kann|können|muss|müssen|soll|sollen|darf|dürfen|war|waren|besteht|bestehen|stimmt|stimmen|passt|passen|reicht|reichen)$/i;
const LOWER_START = /^(?:der|die|das|den|dem|des|ein|eine|einer|eines|einem|einen|kein|keine|keiner|es|er|sie|man|noch|bereits|alle|mehr|weniger)$/i;

/** Nebensatz „der Kunde gesperrt ist“ → Frage „Ist der Kunde gesperrt?“ */
export function question(clause: string) {
  const words = clause.trim().replace(/[?.]+$/, '').split(/\s+/);
  const last = words[words.length - 1];
  if (words.length >= 2 && FINITE.test(last)) {
    const rest = words.slice(0, -1);
    if (LOWER_START.test(rest[0])) rest[0] = rest[0].toLowerCase();
    return `${cap(last.toLowerCase())} ${rest.join(' ')}?`;
  }
  return `${cap(words.join(' '))}?`;
}

/** Entscheidung „Wenn A, dann B; sonst C“ → Bedingung, Ja-Zweig, Nein-Zweig */
function decision(sentence: string): DiagramStep | null {
  const s = stripEnd(sentence);
  const m = /^(?:wenn|falls|sofern)\s+(.+?),\s*(?:dann\s+)?(.+?)(?:[;,.]\s*(?:sonst|andernfalls|ansonsten|anderenfalls)[,:]?\s+(.+))?$/i.exec(s);
  if (m) return { label: cut(question(m[1])), decision: true, yes: cut(cap(m[2])), ...(m[3] ? { no: cut(cap(m[3])) } : {}) };
  if (/\?$/.test(sentence.trim()) && DECISION.test(s)) return { label: cut(sentence.trim()), decision: true };
  return null;
}

/** Klickpfad: Menüpfade (A > B > C, A → B) und fett gesetzte Bedienelemente in Reihenfolge */
export function clickPath(text: string): string[] {
  const out: string[] = [];
  const push = (x: string) => {
    const v = cut(clean(x).replace(/^[„"']|[“"']$/g, ''), 40);
    if (v && out[out.length - 1] !== v) out.push(v);
  };
  const re = /\*\*([^*]+)\*\*|„([^“]{1,40})“|((?:[\p{L}\d][\p{L}\d .&/-]{0,30}\s*(?:>|→|›|->|»)\s*)+[\p{L}\d][\p{L}\d .&/-]{0,30})/gu;
  for (const m of text.matchAll(re)) {
    const seg = m[1] ?? m[2] ?? m[3];
    for (const part of seg.split(/\s*(?:>|→|›|->|»)\s*/)) if (part.trim()) push(part);
  }
  return out.slice(0, MAX_CLICKS);
}

/** Kennzahlen: „Bezeichnung: Wert“, Sätze mit Zahlen (Wert = Zahl mit Einheit) */
export function facts(items: string[]): DiagramFact[] {
  return factItems(items).map((f) => f.fact);
}

/** Aussagen mit Kennzahl (Anweisungen mit „Sie“ bleiben Schritte) */
const isStatement = (it: string) => !/\bSie\b/.test(it) && !/^(?:wenn|falls|sofern)\b/i.test(it);

function factItems(items: string[]): { item: string; fact: DiagramFact }[] {
  const out: { item: string; fact: DiagramFact }[] = [];
  for (const it of items) {
    const kv = /^([^:]{2,40}):\s*(.{1,40})$/.exec(it);
    if (kv && /\d|ja|nein/i.test(kv[2])) {
      out.push({ item: it, fact: { label: cut(stripEnd(kv[1]), 40), value: cut(stripEnd(kv[2]), 24) } });
      continue;
    }
    const n = /(\d+(?:[.,]\d+)?\s*(?:%|Prozent|Tage?n?|Stunden?|Minuten?|Wochen?|Monate?n?|Jahre?n?|Euro|EUR|€|Stück|Zeichen|MB|GB|kg|Schritte?|Werktage?n?)?)/u.exec(it);
    if (n && !/^\d{1,2}[.)]\s/.test(it)) {
      const label = stripEnd(it.replace(n[0], '…'))
        .replace(/\s+(?:beträgt|beträgen|liegt bei|liegen bei|ist|sind|von|bei|um|dauert|dauern)\s+…$/i, '')
        .replace(/^(?:etwa|rund|ca\.|circa|bis zu|mindestens|höchstens|maximal|nur)?\s*…\s*/i, '')
        .replace(/^(?:[Dd]ie|[Dd]er|[Dd]as)\s+(?=\p{Lu})/u, '');
      out.push({ item: it, fact: { label: cut(cap(label), 60), value: cut(n[0].trim(), 24) } });
    }
  }
  return out.slice(0, MAX_FACTS);
}

/** Struktur aus Text erkennen (regelbasiert) */
export function parseStructure(text: string): DiagramStructure {
  const { title, items } = units(text);
  const found = factItems(items).slice(0, MAX_FACTS);
  // Reine Aussagen mit Kennzahl gehören in die Infografik, nicht in den Ablauf
  const factOnly = new Set(found.filter((f) => isStatement(f.item)).map((f) => f.item));
  const steps: DiagramStep[] = [];
  for (const it of items) {
    if (factOnly.has(it)) continue;
    if (steps.length >= MAX_STEPS) break;
    const d = decision(it);
    if (d) steps.push(d);
    else {
      const label = stripEnd(it);
      if (label) steps.push({ label: cut(label) });
    }
  }
  return { title: cut(title ?? (steps[0] && !steps[0].decision ? steps[0].label : 'Ablauf'), 70), steps, clicks: clickPath(text), facts: found.map((f) => f.fact) };
}

/** Von KI oder Client gelieferte Struktur prüfen und begrenzen */
export function normalizeStructure(input: unknown): DiagramStructure | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;
  const str = (v: unknown, n = MAX_LABEL) => (typeof v === 'string' && clean(v) ? cut(clean(v), n) : undefined);
  const steps = Array.isArray(o.steps)
    ? o.steps.flatMap((s): DiagramStep[] => {
      if (typeof s === 'string') return str(s) ? [{ label: str(s)! }] : [];
      const x = s as Record<string, unknown>;
      const label = str(x?.label);
      if (!label) return [];
      return [{ label, ...(x.decision ? { decision: true } : {}), ...(str(x.yes) ? { yes: str(x.yes) } : {}), ...(str(x.no) ? { no: str(x.no) } : {}) }];
    }).slice(0, MAX_STEPS)
    : [];
  const clicks = Array.isArray(o.clicks) ? o.clicks.map((c) => str(c, 40)).filter((c): c is string => !!c).slice(0, MAX_CLICKS) : [];
  const fs = Array.isArray(o.facts)
    ? o.facts.flatMap((f): DiagramFact[] => {
      const x = f as Record<string, unknown>;
      const label = str(x?.label, 60);
      const value = str(x?.value, 24);
      return label && value ? [{ label, value }] : [];
    }).slice(0, MAX_FACTS)
    : [];
  if (!steps.length && !clicks.length && !fs.length) return null;
  return { title: str(o.title, 70) ?? 'Ablauf', steps, clicks, facts: fs };
}

// ---------- Zeichnen ----------

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = 'Segoe UI, Arial, Helvetica, sans-serif';

/** Zeilenumbruch nach geschätzter Zeichenbreite */
export function wrap(text: string, maxChars: number, maxLines = 3): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if (!w) continue;
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= maxChars) cur += ` ${w}`;
    else {
      lines.push(cur);
      cur = w;
    }
    while (cur.length > maxChars) {
      lines.push(cur.slice(0, maxChars - 1) + '-');
      cur = cur.slice(maxChars - 1);
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = cut(`${kept[maxLines - 1]} ${lines[maxLines]}`, maxChars);
    return kept;
  }
  return lines;
}

function textLines(lines: string[], x: number, cy: number, size: number, attrs = '') {
  const lh = size * 1.25;
  const y0 = cy - ((lines.length - 1) * lh) / 2;
  return lines.map((l, i) => `<text x="${x}" y="${(y0 + i * lh).toFixed(1)}" font-size="${size}" text-anchor="middle" dominant-baseline="middle"${attrs}>${xml(l)}</text>`).join('');
}

function svgDoc(w: number, h: number, title: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${xml(title)}" font-family="${FONT}">`
    + `<title>${xml(title)}</title><rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff"/>${body}</svg>`;
}

const arrowDefs = (color: string) => `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker></defs>`;

/** Hellere Variante einer Farbe (für Flächen) */
export function tint(hex: string, amount = 0.88) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).map((v) => Math.round(v + (255 - v) * amount));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

// ASCII
function box(lines: string[], width: number) {
  const inner = width - 4;
  return [`+${'-'.repeat(width - 2)}+`, ...lines.map((l) => `| ${l.padEnd(inner)} |`), `+${'-'.repeat(width - 2)}+`];
}
function center(line: string, width: number) {
  const pad = Math.max(0, Math.floor((width - line.length) / 2));
  return ' '.repeat(pad) + line;
}

/** ASCII-Bild: Schritte als Kästen mit Pfeilen, Entscheidungen als <…?> mit Ja/Nein */
export function renderAscii(s: DiagramStructure): string {
  const W = 44;
  const out: string[] = [center(s.title.toUpperCase(), W), center('='.repeat(Math.min(s.title.length, W)), W), ''];
  const steps = s.steps.length ? s.steps : s.clicks.map((c) => ({ label: c }) as DiagramStep);
  steps.forEach((st, i) => {
    if (i) out.push(center('|', W), center('v', W));
    if (st.decision) {
      const lines = wrap(st.label, W - 8, 3);
      out.push(center(`/${'-'.repeat(W - 10)}\\`, W));
      for (const l of lines) out.push(center(`< ${l.padEnd(W - 12)} >`, W));
      out.push(center(`\\${'-'.repeat(W - 10)}/`, W));
      if (st.no) out.push(center('|', W).padEnd(W) + ` Nein -> ${cut(st.no, 34)}`);
      out.push(center('| Ja', W + 3));
      if (st.yes) {
        out.push(center('v', W));
        out.push(...box(wrap(st.yes, W - 4, 3), W));
      }
    } else out.push(...box(wrap(st.label, W - 4, 3), W).map((l) => l));
  });
  if (s.clicks.length && s.steps.length) out.push('', `Klickpfad: ${s.clicks.join(' > ')}`);
  if (s.facts.length) {
    out.push('', 'Kennzahlen:');
    for (const f of s.facts) out.push(`  * ${f.value.padEnd(10)} ${f.label}`);
  }
  return out.map((l) => l.replace(/\s+$/, '')).join('\n');
}

/** ASCII-Bild als SVG (Festbreitenschrift), damit es wie jedes Bild gespeichert und exportiert werden kann */
export function asciiSvg(ascii: string, title: string) {
  const lines = ascii.split('\n');
  const cw = 7.8;
  const lh = 17;
  const w = Math.ceil(Math.max(20, ...lines.map((l) => l.length)) * cw + 32);
  const h = lines.length * lh + 32;
  const body = lines.map((l, i) => (l ? `<text x="16" y="${16 + (i + 1) * lh - 4}" font-size="13">${xml(l).replace(/ /g, '\u00a0')}</text>` : '')).join('');
  return svgDoc(w, h, title, `<g font-family="Consolas, 'Courier New', monospace" fill="#111827">${body}</g>`);
}

/** Klickstrecke: nummerierte Stationen von links nach rechts (Umbruch nach 4) */
export function renderClickPath(s: DiagramStructure, color: string) {
  const items = s.clicks.length ? s.clicks : s.steps.filter((x) => !x.decision).map((x) => x.label);
  const per = 4;
  const bw = 170;
  const bh = 70;
  const gap = 46;
  const rows = Math.max(1, Math.ceil(items.length / per));
  const w = 40 + Math.min(items.length || 1, per) * (bw + gap) - gap;
  const h = 70 + rows * (bh + 50);
  let body = arrowDefs(color) + textLines([s.title], w / 2, 30, 18, ` font-weight="700" fill="#111827"`);
  items.forEach((label, i) => {
    const r = Math.floor(i / per);
    const c = i % per;
    const x = 20 + c * (bw + gap);
    const y = 60 + r * (bh + 50);
    body += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="${tint(color)}" stroke="${color}" stroke-width="2"/>`;
    body += `<circle cx="${x + 18}" cy="${y + 18}" r="13" fill="${color}"/>${textLines([String(i + 1)], x + 18, y + 18, 13, ' font-weight="700" fill="#ffffff"')}`;
    body += textLines(wrap(label, 18, 2), x + bw / 2 + 10, y + bh / 2 + 4, 14, ' fill="#111827"');
    if (i < items.length - 1) {
      if (c < per - 1) body += `<line x1="${x + bw + 4}" y1="${y + bh / 2}" x2="${x + bw + gap - 6}" y2="${y + bh / 2}" stroke="${color}" stroke-width="2.5" marker-end="url(#arrow)"/>`;
      else {
        // Umbruch: Pfeil nach unten links in die nächste Zeile
        const ny = y + bh + 50;
        body += `<path d="M${x + bw / 2},${y + bh + 4} L${x + bw / 2},${y + bh + 25} L${20 + bw / 2},${y + bh + 25} L${20 + bw / 2},${ny - 6}" fill="none" stroke="${color}" stroke-width="2.5" marker-end="url(#arrow)"/>`;
      }
    }
  });
  if (!items.length) body += textLines(['Kein Klickpfad erkannt'], w / 2, 95, 14, ' fill="#6b7280"');
  return svgDoc(Math.max(w, 260), h, s.title, body);
}

/** Prozessbild: Start → Schritte/Entscheidungen (Raute, Ja nach unten, Nein nach rechts) → Ende */
export function renderProcess(s: DiagramStructure, color: string) {
  const cx = 200;
  const bw = 260;
  const w = s.steps.some((x) => x.decision && x.no) ? 640 : 400;
  let y = 60;
  let body = arrowDefs(color) + textLines([s.title], w / 2, 26, 18, ` font-weight="700" fill="#111827"`);
  const arrow = (y1: number, y2: number) => `<line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2 - 4}" stroke="${color}" stroke-width="2" marker-end="url(#arrow)"/>`;
  const terminal = (label: string) => {
    const s1 = `<rect x="${cx - 60}" y="${y}" width="120" height="36" rx="18" fill="${color}"/>${textLines([label], cx, y + 18, 14, ' font-weight="700" fill="#ffffff"')}`;
    y += 36;
    return s1;
  };
  const stepBox = (label: string, x = cx, fill = tint(color)) => {
    const lines = wrap(label, 34, 3);
    const hh = 22 + lines.length * 18;
    const r = `<rect x="${x - bw / 2}" y="${y}" width="${bw}" height="${hh}" rx="6" fill="${fill}" stroke="${color}" stroke-width="2"/>${textLines(lines, x, y + hh / 2, 14, ' fill="#111827"')}`;
    return { svg: r, h: hh };
  };
  body += terminal('Start');
  for (const st of s.steps) {
    body += arrow(y, y + 30);
    y += 30;
    if (st.decision) {
      const lines = wrap(st.label, 22, 3);
      const dh = 70 + lines.length * 12;
      const dw = 250;
      body += `<polygon points="${cx},${y} ${cx + dw / 2},${y + dh / 2} ${cx},${y + dh} ${cx - dw / 2},${y + dh / 2}" fill="#fff7e6" stroke="#b45309" stroke-width="2"/>`;
      body += textLines(lines, cx, y + dh / 2, 13, ' fill="#111827"');
      const mid = y + dh / 2;
      if (st.no) {
        const nx = cx + dw / 2 + 60 + 90;
        body += `<line x1="${cx + dw / 2}" y1="${mid}" x2="${nx - 94}" y2="${mid}" stroke="#b45309" stroke-width="2" marker-end="url(#arrow)"/>`;
        body += textLines(['Nein'], cx + dw / 2 + 24, mid - 10, 12, ' font-weight="700" fill="#92400e"');
        const lines2 = wrap(st.no, 20, 3);
        const nh = 22 + lines2.length * 18;
        body += `<rect x="${nx - 90}" y="${mid - nh / 2}" width="180" height="${nh}" rx="6" fill="#ffffff" stroke="#b45309" stroke-width="2" stroke-dasharray="5 3"/>${textLines(lines2, nx, mid, 13, ' fill="#111827"')}`;
      }
      y += dh;
      body += textLines(['Ja'], cx + 18, y + 12, 12, ' font-weight="700" fill="#166534"');
      if (st.yes) {
        body += arrow(y, y + 30);
        y += 30;
        const b = stepBox(st.yes);
        body += b.svg;
        y += b.h;
      }
    } else {
      const b = stepBox(st.label);
      body += b.svg;
      y += b.h;
    }
  }
  body += arrow(y, y + 30);
  y += 30;
  body += terminal('Ende');
  return svgDoc(w, y + 24, s.title, body);
}

/** Infografik: Titelband, Kennzahlen-Kacheln und nummerierte Kernschritte */
export function renderInfographic(s: DiagramStructure, color: string) {
  const w = 720;
  let body = `<rect x="0" y="0" width="${w}" height="64" fill="${color}"/>${textLines(wrap(s.title, 60, 1), w / 2, 32, 22, ' font-weight="700" fill="#ffffff"')}`;
  let y = 88;
  const cols = Math.min(3, Math.max(1, s.facts.length));
  const cw = (w - 40 - (cols - 1) * 16) / cols;
  s.facts.forEach((f, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = 20 + c * (cw + 16);
    const yy = y + r * 126;
    body += `<rect x="${x}" y="${yy}" width="${cw}" height="110" rx="12" fill="${tint(color)}" stroke="${color}" stroke-width="1.5"/>`;
    body += textLines([f.value], x + cw / 2, yy + 36, 28, ` font-weight="700" fill="${color}"`);
    body += textLines(wrap(f.label, Math.floor(cw / 7.5), 2), x + cw / 2, yy + 80, 13, ' fill="#1f2937"');
  });
  if (s.facts.length) y += Math.ceil(s.facts.length / cols) * 126 + 8;
  const steps = s.steps.slice(0, 6);
  if (steps.length) {
    body += `<text x="20" y="${y + 10}" font-size="16" font-weight="700" fill="#111827">So geht's</text>`;
    y += 28;
    steps.forEach((st, i) => {
      const lines = wrap(st.decision ? `${st.label}${st.yes ? ` Ja: ${st.yes}` : ''}${st.no ? ` Nein: ${st.no}` : ''}` : st.label, 78, 2);
      const hh = Math.max(44, 16 + lines.length * 18);
      body += `<circle cx="42" cy="${y + hh / 2}" r="16" fill="${st.decision ? '#b45309' : color}"/>${textLines([st.decision ? '?' : String(i + 1)], 42, y + hh / 2, 14, ' font-weight="700" fill="#ffffff"')}`;
      body += lines.map((l, j) => `<text x="70" y="${(y + hh / 2 - ((lines.length - 1) * 18) / 2 + j * 18).toFixed(1)}" font-size="14" dominant-baseline="middle" fill="#1f2937">${xml(l)}</text>`).join('');
      if (i < steps.length - 1) body += `<line x1="42" y1="${y + hh / 2 + 16}" x2="42" y2="${y + hh + 6 + 8}" stroke="${tint(color, 0.5)}" stroke-width="3"/>`;
      y += hh + 8;
    });
  }
  if (!s.facts.length && !steps.length) {
    body += textLines(['Keine Kennzahlen oder Schritte erkannt'], w / 2, y + 20, 14, ' fill="#6b7280"');
    y += 40;
  }
  return svgDoc(w, y + 20, s.title, body);
}

export interface RenderedDiagram { kind: DiagramKind; label: string; title: string; svg: string; ascii: string | null; warnings: string[] }

/** Gewünschte Bildarten zeichnen; Hinweise, wenn die Struktur für eine Art zu dünn ist */
export function renderDiagrams(s: DiagramStructure, kinds: readonly DiagramKind[], color: string): RenderedDiagram[] {
  return kinds.map((kind) => {
    const warnings: string[] = [];
    const title = `${KIND_LABEL[kind]}: ${s.title}`;
    if (kind === 'ascii') {
      const ascii = renderAscii(s);
      return { kind, label: KIND_LABEL[kind], title, svg: asciiSvg(ascii, title), ascii, warnings };
    }
    if (kind === 'clickpath' && !s.clicks.length) warnings.push('Kein Menüpfad und keine **fett** gesetzten Bedienelemente erkannt – die Schritte werden als Stationen gezeigt.');
    if (kind === 'process' && s.steps.length < 2) warnings.push('Weniger als zwei Schritte erkannt.');
    if (kind === 'infographic' && !s.facts.length) warnings.push('Keine Kennzahlen (Zahlen, „Bezeichnung: Wert“) erkannt.');
    const svg = kind === 'clickpath' ? renderClickPath(s, color) : kind === 'process' ? renderProcess(s, color) : renderInfographic(s, color);
    return { kind, label: KIND_LABEL[kind], title, svg, ascii: null, warnings };
  });
}
