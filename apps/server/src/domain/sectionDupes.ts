// Dubletten über alle Formate je Abschnitt (ADR-088, M4): Text so normalisieren, dass dieselbe Stelle als Folie
// (Aufzählung), PDF-Absatz oder Word-Abschnitt gleich aussieht, und Unterschiede wortweise zeigen.

export const SECTION_MIN_CHARS = 40;   // kürzere Abschnitte („Fragen?“) sind keine sinnvollen Dubletten
export const NEAR_THRESHOLD = 0.85;    // M-07: ab 85 % Ähnlichkeit

/** Abschnittstext ohne Aufzählungszeichen, Nummerierung, Formatierung, Bilder, Tabellenstriche und Zitatzeichen */
export function normalizeSection(texts: string[]): string {
  return texts
    .join('\n')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')                 // Bilder
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')               // Links → Linktext
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, ' ')               // Tabellentrenner
    .replace(/^\s{0,3}>\s?/gm, '')                         // Zitat
    .replace(/^\s*(?:[-*+•▪◦]|\d{1,3}[.)])\s+/gm, '')     // Aufzählung, Nummerierung
    .replace(/[|*_`#~]/g, ' ')
    .replace(/\\([\\`*_{}[\]()#+.!-])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export type DiffOp = { op: '=' | '-' | '+'; text: string };

/** Wortweiser Unterschied (LCS); bei sehr langen Texten grob nach Sätzen, damit die Rechenzeit begrenzt bleibt */
export function wordDiff(a: string, b: string, maxTokens = 1500): DiffOp[] {
  const split = (s: string) => (s.split(/\s+/).length > maxTokens ? s.split(/(?<=[.!?])\s+/) : s.split(/(\s+)/)).filter((x) => x !== '');
  const x = split(a);
  const y = split(b);
  const n = x.length;
  const m = y.length;
  const dp: Uint16Array[] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffOp[] = [];
  const push = (op: DiffOp['op'], text: string) => {
    const last = out[out.length - 1];
    if (last && last.op === op) last.text += text;
    else out.push({ op, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) (push('=', x[i]), i++, j++);
    else if (dp[i + 1][j] >= dp[i][j + 1]) push('-', x[i++]);
    else push('+', y[j++]);
  }
  while (i < n) push('-', x[i++]);
  while (j < m) push('+', y[j++]);
  return out;
}
