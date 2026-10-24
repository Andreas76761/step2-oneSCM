// Datenschutzprüfung (§13, US-012). Treffer sind Blocker für Freigabe und Export.
// ENTSCHEIDUNG(E-07): Musterliste; Beispiel-Domains (RFC 2606) und Platzhalter werden nicht gemeldet.
// ADR-080 (F-04): zusätzlich Fahrgestellnummern (FIN/VIN), Kfz-Kennzeichen, Benutzerkennungen, Straßenadressen,
// Personennamen aus Metadatenfeldern (Autor, Bearbeiter, Assignee …) und eine projektübergreifende Namensliste;
// Pseudonymisierung ersetzt Treffer durch Platzhalter wie [Person 1].

export type PrivacyKind = 'email' | 'phone' | 'iban' | 'vin' | 'plate' | 'user_id' | 'address' | 'name';

export interface PrivacyHit {
  kind: PrivacyKind;
  match: string;
}

export interface PrivacyOptions {
  /** zusätzliche Klarnamen (Einstellung privacy.names), Groß-/Kleinschreibung egal */
  names?: string[];
}

interface RawHit { kind: PrivacyKind; start: number; end: number; value: string }

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /(?:\+|00)\d{2}[\s/-]?\(?\d{2,5}\)?[\s/-]?\d{3,}[\s-]?\d{0,6}|\b0\d{2,5}[\s/-]\d{4,}(?:[\s-]\d{1,6})?\b/g;
const IBAN = /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){3,7}(?:\s?[A-Z0-9]{1,4})?\b/g;
const SAFE_EMAIL = /@(example\.(com|org|net)|[\w.-]+\.(example|test|invalid))$/i;
// FIN/VIN: 17 Zeichen ohne I, O, Q, mit Ziffern und Buchstaben
const VIN = /\b[A-HJ-NPR-Z0-9]{17}\b/g;
// deutsches Kennzeichen mit Bindestrich nach dem Ortskürzel: S-AB 1234, M-X 12E
const PLATE = /\b[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s?\d{1,4}[EH]?\b/g;
// Benutzerkennung nach einer Feldbezeichnung
const USER_ID = /\b(?:User[- ]?ID|UserID|Benutzer[- ]?(?:ID|kennung|name)|Login|Kennung)\s*[:=]\s*([A-Za-z0-9._-]{3,})/gi;
// Straße mit Hausnummer, optional mit PLZ und Ort
const ADDRESS = /\b[A-ZÄÖÜ][a-zäöüß]+(?:straße|strasse|str\.|weg|allee|platz|gasse|ring|damm)\s+\d{1,4}\s?[a-z]?\b(?:\s*,\s*\d{5}\s+[A-ZÄÖÜ][a-zäöüß]+)?/g;
// Personenname nach einer Metadaten-Bezeichnung (Jira, Word-Eigenschaften, Kontakte)
const NAME_FIELD = /\b(?:Autor(?:in)?|Bearbeiter(?:in)?|Verfasser(?:in)?|Ansprechpartner(?:in)?|Kontaktperson|Assignee|Reporter|Author|Created by|Prepared by|Exported by|Responsible PO|(?:Export )?[Ee]rstellt von)\s*[:=]?\s*([A-ZÄÖÜ][a-zäöüß]+(?:[ -][A-ZÄÖÜ][a-zäöüß]+){1,2})/g;

const mask = (s: string) => (s.length <= 4 ? '****' : `${s.slice(0, 2)}…${s.slice(-2)}`);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Alle Treffer mit Position. Reihenfolge der Arten wie bisher (E-Mail, IBAN, Telefon), dann die Arten aus ADR-080. */
function findRaw(text: string, opts: PrivacyOptions = {}): RawHit[] {
  const hits: RawHit[] = [];
  // gefundene Stellen werden für nachfolgende Muster ausgeblendet (gleiche Länge, Positionen bleiben gültig)
  let rest = text;
  const take = (kind: PrivacyKind, start: number, value: string) => {
    hits.push({ kind, start, end: start + value.length, value });
    rest = rest.slice(0, start) + ' '.repeat(value.length) + rest.slice(start + value.length);
  };
  const vins = [...text.matchAll(VIN)].filter((m) => /\d.*\d.*\d/.test(m[0]) && /[A-Z].*[A-Z].*[A-Z]/.test(m[0]) && !/(.)\1{7}/.test(m[0]));
  // FIN vor IBAN ausblenden, damit eine Fahrgestellnummer nicht als IBAN gilt
  for (const m of vins) rest = rest.slice(0, m.index!) + ' '.repeat(17) + rest.slice(m.index! + 17);
  for (const m of text.matchAll(EMAIL)) if (!SAFE_EMAIL.test(m[0])) take('email', m.index!, m[0]);
  for (const m of [...rest.matchAll(IBAN)]) if (/\d{6,}/.test(m[0].replace(/\s/g, ''))) take('iban', m.index!, m[0]);
  for (const m of [...rest.matchAll(PHONE)]) {
    const v = m[0].trimEnd();
    take('phone', m.index!, v);
  }
  for (const m of vins) hits.push({ kind: 'vin', start: m.index!, end: m.index! + 17, value: m[0] });
  for (const m of [...rest.matchAll(PLATE)]) take('plate', m.index!, m[0]);
  for (const m of [...rest.matchAll(USER_ID)]) take('user_id', m.index! + m[0].length - m[1].length, m[1]);
  for (const m of [...rest.matchAll(ADDRESS)]) take('address', m.index!, m[0]);
  for (const m of [...rest.matchAll(NAME_FIELD)]) take('name', m.index! + m[0].length - m[1].length, m[1]);
  for (const n of (opts.names ?? []).map((x) => x.trim()).filter((x) => x.length >= 3)) {
    for (const m of [...rest.matchAll(new RegExp(`(?<![\\p{L}\\d])${escapeRe(n)}(?![\\p{L}\\d])`, 'giu'))]) take('name', m.index!, m[0]);
  }
  return hits;
}

/** Treffer mit Position (Zeichen) und maskiertem Wert – z. B. um Fundstellen in Bildern unkenntlich zu machen (ADR-095) */
export function privacySpans(text: string, opts: PrivacyOptions = {}) {
  return findRaw(text, opts).map((h) => ({ kind: h.kind, start: h.start, end: h.end, match: mask(h.value) }));
}

export function detectPrivacy(text: string, opts: PrivacyOptions = {}): PrivacyHit[] {
  return findRaw(text, opts).map((h) => ({ kind: h.kind, match: mask(h.value) }));
}

export const PRIVACY_PLACEHOLDER: Record<PrivacyKind, string> = {
  name: 'Person', email: 'E-Mail', phone: 'Telefon', iban: 'IBAN', vin: 'FIN', plate: 'Kennzeichen', user_id: 'User-ID', address: 'Adresse',
};

/** Treffer durch nummerierte Platzhalter ersetzen; gleicher Wert → gleicher Platzhalter. Gibt keine Klarwerte zurück. */
export function pseudonymize(text: string, opts: PrivacyOptions = {}) {
  const hits = findRaw(text, opts).sort((a, b) => a.start - b.start);
  const nummer = new Map<string, string>();
  const zaehler: Partial<Record<PrivacyKind, number>> = {};
  let out = '';
  let pos = 0;
  for (const h of hits) {
    if (h.start < pos) continue; // überlappende Treffer nur einmal ersetzen
    const key = `${h.kind}:${h.value.toLowerCase()}`;
    if (!nummer.has(key)) {
      zaehler[h.kind] = (zaehler[h.kind] ?? 0) + 1;
      nummer.set(key, `[${PRIVACY_PLACEHOLDER[h.kind]} ${zaehler[h.kind]}]`);
    }
    out += text.slice(pos, h.start) + nummer.get(key);
    pos = h.end;
  }
  out += text.slice(pos);
  return { text: out, replaced: hits.length, kinds: Object.entries(zaehler).map(([kind, count]) => ({ kind: kind as PrivacyKind, distinct: count! })) };
}
