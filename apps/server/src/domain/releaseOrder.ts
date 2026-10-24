// Reihenfolge von Releases (ADR-102, W-09): „gültig ab“ eines Kapitels gegen den Stand eines Exports bzw. Releases.
// Versionen werden in Zahlen- und Wortteile zerlegt („2026.10“ > „2026.9“, „PI 26.3“ < „PI 26.10“); ein vorangestelltes
// Wort wie „PI“, „R“, „v“ oder „Release“ zählt nicht. Reine Fachlogik ohne I/O.

const parts = (v: string) => (v.trim().replace(/^[^\d]*(?=\d)/, '').match(/\d+|[^\d\s._-]+/g) ?? []).map((p) => (/^\d+$/.test(p) ? Number(p) : p.toLowerCase()));

/** < 0: a vor b, 0: gleich, > 0: a nach b */
export function compareReleases(a: string, b: string): number {
  const x = parts(a);
  const y = parts(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const p = x[i];
    const q = y[i];
    if (p === undefined) return typeof q === 'number' ? -1 : 1; // „2026.1“ < „2026.1.1“, aber „2026.1“ > „2026.1-beta“
    if (q === undefined) return typeof p === 'number' ? 1 : -1;
    if (p === q) continue;
    if (typeof p === 'number' && typeof q === 'number') return p - q;
    if (typeof p === 'number') return 1;
    if (typeof q === 'number') return -1;
    return p < q ? -1 : 1;
  }
  return 0;
}

/** Inhalt mit „gültig ab“ nach dem Stand – im Export bzw. Release ausgeblendet (Zukunfts-Inhalt) */
export function isFutureContent(validFrom: string | null | undefined, asOf: string | null | undefined): boolean {
  return !!validFrom?.trim() && !!asOf?.trim() && compareReleases(validFrom, asOf) > 0;
}
