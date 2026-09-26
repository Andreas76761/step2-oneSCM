// Glossar in der Leseransicht (ADR-066): Fachbegriffe und Abkürzungen im Text werden beim ersten Vorkommen je Absatz
// markiert und erklären sich bei Maus, Tastatur oder Antippen – WCAG 1.4.13: per Esc schließbar, überfahrbar, bleibt stehen.
import { createContext, useContext, useId, useMemo, useState, type ReactNode } from 'react';

export interface GlossaryEntry { term: string; text: string; kind: 'term' | 'abbreviation' }

interface Glossary { entries: GlossaryEntry[]; regex: RegExp | null; byKey: Map<string, GlossaryEntry> }
const lower = (s: string) => s.toLocaleLowerCase('de');
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildGlossary(entries: GlossaryEntry[]): Glossary {
  if (!entries.length) return { entries, regex: null, byKey: new Map() };
  // Begriffe: Anfangsbuchstabe groß oder klein (Satzanfang); Abkürzungen: genau so geschrieben. Längste zuerst.
  const alts = [...entries].sort((a, b) => b.term.length - a.term.length).map((e) => {
    const t = esc(e.term);
    if (e.kind === 'abbreviation') return t;
    const first = e.term[0];
    return first.toLowerCase() !== first.toUpperCase() ? `[${esc(first.toUpperCase())}${esc(first.toLowerCase())}]${esc(e.term.slice(1))}` : t;
  });
  return { entries, regex: new RegExp(`(?<![\\p{L}\\p{N}])(${alts.join('|')})(?![\\p{L}\\p{N}])`, 'gu'), byKey: new Map(entries.map((e) => [lower(e.term), e])) };
}

const EMPTY: Glossary = { entries: [], regex: null, byKey: new Map() };
const GlossaryContext = createContext<Glossary>(EMPTY);
export const useGlossary = () => useContext(GlossaryContext);

export function GlossaryProvider({ entries, children }: { entries: GlossaryEntry[] | null | undefined; children: ReactNode }) {
  const value = useMemo(() => (entries?.length ? buildGlossary(entries) : EMPTY), [entries]);
  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

/** Text in Stücke teilen: Zeichenkette oder Glossar-Treffer (jeder Begriff nur beim ersten Vorkommen in `seen`) */
export function splitGlossary(text: string, g: Glossary, seen: Set<string>): (string | { match: string; entry: GlossaryEntry })[] {
  if (!g.regex) return [text];
  const out: (string | { match: string; entry: GlossaryEntry })[] = [];
  let last = 0;
  for (const m of text.matchAll(g.regex)) {
    const entry = g.byKey.get(lower(m[0]));
    if (!entry || seen.has(lower(entry.term))) continue;
    seen.add(lower(entry.term));
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ match: m[0], entry });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Klartext mit markierten Glossarbegriffen */
export function GlossText({ text, seen }: { text: string; seen: Set<string> }) {
  const g = useGlossary();
  return <>{splitGlossary(text, g, seen).map((p, i) => (typeof p === 'string' ? p : <GlossTerm key={i} entry={p.entry}>{p.match}</GlossTerm>))}</>;
}

export function GlossTerm({ entry, children }: { entry: GlossaryEntry; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="gloss" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {/* Name = der Begriff selbst: steht er in einer Schritt-Beschriftung, bleibt deren zugänglicher Name unverändert */}
      <button type="button" className="gloss-term" aria-expanded={open} aria-describedby={open ? id : undefined}
        onClick={(e) => { e.preventDefault(); setOpen(!open); }} onBlur={() => setOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); } }}>
        {children}
      </button>
      {open && <span role="tooltip" id={id} className="gloss-tip"><strong>{entry.term}</strong>{entry.kind === 'abbreviation' ? ' = ' : ': '}{entry.text}</span>}
    </span>
  );
}

// ---------- Markdown: remark-Plugin, das Textknoten in <gloss-term>-Elemente teilt ----------

type MdNode = { type: string; value?: string; children?: MdNode[]; data?: Record<string, unknown> };
const SKIP = new Set(['link', 'inlineCode', 'code', 'image', 'heading']);

export function remarkGlossary(g: Glossary) {
  return () => (tree: MdNode) => {
    if (!g.regex) return;
    const seen = new Set<string>();
    const walk = (node: MdNode) => {
      if (!node.children || SKIP.has(node.type)) return;
      node.children = node.children.flatMap((c) => {
        if (c.type !== 'text' || !c.value) {
          walk(c);
          return [c];
        }
        return splitGlossary(c.value, g, seen).map((p) => (typeof p === 'string' ? { type: 'text', value: p }
          : { type: 'glossTerm', data: { hName: 'gloss-term', hProperties: { term: p.entry.term } }, children: [{ type: 'text', value: p.match }] }));
      });
    };
    walk(tree);
  };
}

/** Komponente für <gloss-term> in react-markdown */
export function MdGlossTerm({ term, children }: { term?: string; children?: ReactNode }) {
  const g = useGlossary();
  const entry = term ? g.byKey.get(lower(term)) : undefined;
  return entry ? <GlossTerm entry={entry}>{children}</GlossTerm> : <>{children}</>;
}
