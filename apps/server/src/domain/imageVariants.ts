// Varianten einer Maske (ADR-093, F-22): Bilder derselben Maske in verschiedenen Sprachen, Rollen, Sparten oder
// Märkten. Für eine Ausgabe wird je Verweis die passendste Fassung gewählt – nie eine in falscher Sprache.

export interface VariantImage { sha: string; language: string | null; roles: string[]; divisions: string[]; markets: string[] }
export interface VariantTarget { language?: string | null; roles?: string[]; divisions?: string[]; market?: string | null }

const fitList = (have: string[], want: string[] | undefined) => {
  if (!want?.length) return 0;
  if (have.some((x) => want.includes(x))) return 2;
  if (have.includes('all') || !have.length) return 1;
  return -2; // ausdrücklich für eine andere Rolle bzw. Sparte
};

/** Passung einer Fassung zum Ziel; null = ausgeschlossen (andere Sprache bzw. anderer Markt) */
export function variantScore(v: VariantImage, t: VariantTarget): number | null {
  let s = 0;
  if (t.language) {
    // Schweizer Varianten (U-07): Bild in der Grundsprache (de, fr) passt, die eigene Fassung passt besser
    const base = t.language.split('-')[0];
    if (v.language && v.language !== t.language && v.language !== base) return null;
    s += v.language === t.language ? 4 : v.language === base ? 3 : 0;
  }
  if (t.market) {
    if (v.markets.length && !v.markets.includes(t.market)) return null;
    s += v.markets.includes(t.market) ? 2 : 0;
  } else if (v.markets.length) s -= 1; // marktspezifische Fassung nur, wenn der Markt gefragt ist
  return s + fitList(v.roles, t.roles) + fitList(v.divisions, t.divisions);
}

/** Beste Fassung der Gruppe für das Ziel; bei Gleichstand bleibt die verwendete Fassung */
export function pickVariant(current: VariantImage, group: VariantImage[], t: VariantTarget): string {
  const base = variantScore(current, t);
  let best = { sha: current.sha, score: base ?? -Infinity };
  for (const v of group) {
    if (v.sha === current.sha) continue;
    const s = variantScore(v, t);
    if (s !== null && s > best.score) best = { sha: v.sha, score: s };
  }
  return best.sha;
}

/** Zwei Fassungen mit gleichen Merkmalen sind vermutlich doppelt */
export const variantKey = (v: VariantImage) => [v.language ?? '', [...v.roles].sort().join(','), [...v.divisions].sort().join(','), [...v.markets].sort().join(',')].join('|');
