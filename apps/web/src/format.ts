// Gemeinsame Formatierer der Oberfläche (deutsches Format wie bisher an jeder Stelle einzeln geschrieben)

/** Datum und Uhrzeit, z. B. „8.11.2026, 20:59:09“ (ohne Angabe: jetzt) */
export const formatDateTime = (d: string | number | Date = Date.now()) => new Date(d).toLocaleString('de-DE');
/** Datum, z. B. „8.11.2026“ (ohne Angabe: heute) */
export const formatDate = (d: string | number | Date = Date.now()) => new Date(d).toLocaleDateString('de-DE');
/** Sonderzeichen eines regulären Ausdrucks maskieren, damit ein Begriff wörtlich gesucht wird */
export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
