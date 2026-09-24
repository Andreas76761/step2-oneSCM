// Datenschutzprüfung (§13, US-012). Treffer sind Blocker für Freigabe und Export.
// ANNAHME(E-07): Musterliste; Beispiel-Domains (RFC 2606) und Platzhalter werden nicht gemeldet.

export interface PrivacyHit {
  kind: 'email' | 'phone' | 'iban';
  match: string;
}

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /(?:\+|00)\d{2}[\s/-]?\(?\d{2,5}\)?[\s/-]?\d{3,}[\s-]?\d{0,6}|\b0\d{2,5}[\s/-]\d{4,}(?:[\s-]\d{1,6})?\b/g;
const IBAN = /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){3,7}(?:\s?[A-Z0-9]{1,4})?\b/g;
const SAFE_EMAIL = /@(example\.(com|org|net)|[\w.-]+\.(example|test|invalid))$/i;

const mask = (s: string) => (s.length <= 4 ? '****' : `${s.slice(0, 2)}…${s.slice(-2)}`);

export function detectPrivacy(text: string): PrivacyHit[] {
  const hits: PrivacyHit[] = [];
  for (const m of text.matchAll(EMAIL)) if (!SAFE_EMAIL.test(m[0])) hits.push({ kind: 'email', match: mask(m[0]) });
  let rest = text;
  for (const m of text.matchAll(IBAN)) {
    if (/\d{6,}/.test(m[0].replace(/\s/g, ''))) {
      hits.push({ kind: 'iban', match: mask(m[0]) });
      rest = rest.replace(m[0], ' ');
    }
  }
  for (const m of rest.matchAll(PHONE)) hits.push({ kind: 'phone', match: mask(m[0].trim()) });
  return hits;
}
