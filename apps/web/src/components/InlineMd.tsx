// Inline-Markdown für Antwortsätze und Belegauszüge: **fett**, *kursiv*, `Code`; Bilder als „[Bild: …]“, Verweise als
// Text. Kein HTML, keine Ausführung – sonst stünden Sternchen und Bildverweise roh in Antworten (ADR-089).
import type { ReactNode } from 'react';

const TOKEN = /(!\[([^\]]*)\]\([^)]*\))|(\[([^\]]+)\]\([^)]*\))|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(`([^`]+)`)|(\*([^*\s][^*]*)\*)/g;

export function inlineMd(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<span key={k++} className="md-img-alt">[Bild: {m[2] || 'ohne Alternativtext'}]</span>);
    else if (m[3]) out.push(m[4]);
    else if (m[5]) out.push(<strong key={k++}>{m[6]}</strong>);
    else if (m[7]) out.push(<strong key={k++}>{m[8]}</strong>);
    else if (m[9]) out.push(<code key={k++}>{m[10]}</code>);
    else if (m[11]) out.push(<em key={k++}>{m[12]}</em>);
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const InlineMd = ({ text }: { text: string }) => <>{inlineMd(text)}</>;
