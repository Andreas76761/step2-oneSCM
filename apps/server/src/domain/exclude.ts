// Ausschlussliste „nicht einlesen“ (ADR-084, F-17): Muster je Zeile, z. B. „*.tmp“, „Archiv/**“, „~$*“, „**/Entwurf_alt*“.
// * = beliebige Zeichen ohne „/“, ** = beliebige Ordner, ? = ein Zeichen; ohne „/“ gilt das Muster für den Dateinamen und jeden Ordnernamen.
// Groß-/Kleinschreibung zählt nicht.

export const MAX_EXCLUDE_PATTERNS = 200;

const toRegex = (pattern: string) => {
  let re = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === '*' && pattern[i + 1] === '*') {
      re += '.*';
      i++;
      if (pattern[i + 1] === '/') i++;
    } else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return re;
};

/** Prüffunktion: liefert das zutreffende Muster oder null */
export function compileExclusions(patterns: string[]): (path: string) => string | null {
  const compiled = patterns.map((p) => p.trim().replace(/\\/g, '/').replace(/^\.?\//, '')).filter(Boolean).map((p) => {
    const body = toRegex(p.replace(/\/$/, '/**'));
    // ohne „/“: Dateiname oder ein Ordnername; mit „/“: Pfad ab einer beliebigen Ordnerebene
    const re = p.includes('/') ? new RegExp(`(?:^|/)${body}$`, 'i') : new RegExp(`(?:^|/)${body}(?:/|$)`, 'i');
    return { p, re };
  });
  return (path: string) => {
    const norm = path.replace(/\\/g, '/').replace(/^\/+/, '');
    return compiled.find((c) => c.re.test(norm))?.p ?? null;
  };
}

/** Eingabe aus den Einstellungen bereinigen; null = ungültig */
export function cleanExcludePatterns(v: unknown): string[] | null {
  if (!Array.isArray(v) || v.length > MAX_EXCLUDE_PATTERNS) return null;
  if (v.some((p) => typeof p !== 'string' || p.trim().length > 200)) return null;
  return [...new Set((v as string[]).map((p) => p.trim()).filter(Boolean))];
}
