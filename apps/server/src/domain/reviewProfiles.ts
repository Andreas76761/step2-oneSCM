// Vier Prüferprofile (ADR-105, W-12): fachlich, Redaktion, Compliance, Endanwender. Jedes Profil liest das Kapitel mit
// eigenem Blick; die Regeln hier sind die Grundlage, ein lokaler KI-Dienst kann je Profil Funde ergänzen.
import { segmentSentences } from './style.js';

export const REVIEW_PROFILES = ['domain', 'editorial', 'compliance', 'enduser'] as const;
export type ReviewProfile = (typeof REVIEW_PROFILES)[number];
export const PROFILE_LABEL: Record<ReviewProfile, string> = { domain: 'Fachlich', editorial: 'Redaktion', compliance: 'Compliance', enduser: 'Endanwender' };
export const PROFILE_FOCUS: Record<ReviewProfile, string> = {
  domain: 'Stimmen Aussagen, Zahlen und Kennungen mit den Quellen überein? Gibt es Widersprüche oder Lücken?',
  editorial: 'Stil, Hausregeln, Terminologie und Aufbau einer Anleitung (Zweck, Schritte, Ergebnis).',
  compliance: 'Personenbezogene Daten, unhaltbare Zusagen, fehlende Warnhinweise bei folgenreichen Aktionen, Warnhinweise nach Schema.',
  enduser: 'Versteht ein Endanwender das Kapitel ohne Vorwissen? Lesbarkeit, Satzlänge, Fachjargon, unerklärte Abkürzungen.',
};
export type Severity = 'high' | 'medium' | 'low';
export const SEVERITY_LABEL: Record<Severity, string> = { high: 'hoch', medium: 'mittel', low: 'gering' };
const SEVERITY_POINTS: Record<Severity, number> = { high: 15, medium: 7, low: 3 };

export interface ReviewFinding {
  profile: ReviewProfile;
  severity: Severity;
  /** Kennung der Regel, z. B. „promise“; KI-Funde „ai“ */
  rule: string;
  message: string;
  blockId: string | null;
  section: string | null;
  excerpt: string;
  suggestion?: string | null;
  origin: 'rules' | 'ai';
}

/** Wert je Profil 0–100: 100 minus Punkte je Fund (hoch 15, mittel 7, gering 3) */
export function profileScore(findings: { severity: Severity }[]) {
  return Math.max(0, 100 - findings.reduce((n, f) => n + SEVERITY_POINTS[f.severity], 0));
}

export interface ReviewBlock { id: string; section: string; sectionTitle: string; kind: string; text: string }

const excerpt = (s: string, at = 0, len = 120) => {
  const t = s.replace(/\s+/g, ' ').trim();
  const start = Math.max(0, at - 30);
  return (start > 0 ? '… ' : '') + t.slice(start, start + len) + (t.length > start + len ? ' …' : '');
};

/** Zusagen, die ein Handbuch nicht halten kann (Compliance) */
const PROMISES: { re: RegExp; message: string; suggestion: string }[] = [
  { re: /\bgarantiert\b|\bgarantieren\b/i, message: 'Zusage „garantiert“ – das Handbuch kann kein Ergebnis zusichern.', suggestion: 'Beschreiben Sie, was das System tut, ohne Zusage.' },
  { re: /\b100\s?%\s*(?:sicher|fehlerfrei|korrekt)\b|\bfehlerfrei\b/i, message: 'Absolute Zusage (fehlerfrei, 100 %).', suggestion: 'Zusage streichen oder belegen.' },
  { re: /\brisikolos\b|\bohne (?:jedes )?Risiko\b|\bvöllig sicher\b|\babsolut sicher\b/i, message: 'Sicherheitszusage ohne Beleg.', suggestion: 'Risiken und Grenzen sachlich nennen.' },
  { re: /\brechtssicher\b|\brechtlich (?:unbedenklich|zulässig)\b/i, message: 'Rechtliche Aussage – bitte durch Recht/Compliance bestätigen lassen.', suggestion: 'Rechtliche Bewertung nicht im Handbuch treffen; auf die Fachabteilung verweisen.' },
  { re: /\b(?:immer|niemals|nie)\b(?=[^.]*\b(?:sicher|korrekt|richtig|vollständig|automatisch)\b)/i, message: 'Pauschale Aussage („immer“/„nie“) über das Systemverhalten.', suggestion: 'Bedingungen nennen, unter denen das Verhalten gilt.' },
];
/** Folgenreiche Aktionen, vor denen ein Warnhinweis stehen sollte */
const CONSEQUENTIAL = /\b(?:löschen|gelöscht|unwiderruflich|endgültig|kündigen|stornieren|überschreiben|zurücksetzen|versenden)\b/i;
/** Fachjargon und interne Begriffe, die Endanwender nicht kennen müssen */
export const JARGON = ['Backend', 'Frontend', 'Payload', 'Request', 'Response', 'Endpoint', 'Deployment', 'Batch', 'Job', 'Queue', 'Cache', 'Datenbank', 'Datensatz-ID', 'Schnittstelle', 'API', 'Workflow-Engine', 'Persistenz', 'Timeout', 'Flag'];
const JARGON_RE = new RegExp(`(?<![\\p{L}])(${JARGON.map((j) => j.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}])`, 'u');
export const LONG_SENTENCE = 25;

export function compliancePromises(blocks: ReviewBlock[]): ReviewFinding[] {
  const out: ReviewFinding[] = [];
  for (const b of blocks) {
    for (const p of PROMISES) {
      const m = p.re.exec(b.text);
      if (m) out.push({ profile: 'compliance', severity: 'medium', rule: 'promise', message: p.message, blockId: b.id, section: b.sectionTitle, excerpt: excerpt(b.text, m.index), suggestion: p.suggestion, origin: 'rules' });
    }
  }
  return out;
}

/** Folgenreiche Aktion in den Schritten, aber kein Warnhinweis im Kapitel */
export function missingWarnings(blocks: ReviewBlock[]): ReviewFinding[] {
  if (blocks.some((b) => b.kind === 'warning')) return [];
  const hit = blocks.find((b) => b.section === 'steps' && CONSEQUENTIAL.test(b.text));
  if (!hit) return [];
  const m = CONSEQUENTIAL.exec(hit.text)!;
  return [{ profile: 'compliance', severity: 'high', rule: 'missing_warning', message: `Folgenreiche Aktion („${m[0]}“) ohne Warnhinweis im Kapitel.`, blockId: hit.id, section: hit.sectionTitle, excerpt: excerpt(hit.text, m.index), suggestion: 'Warnhinweis nach Schema ergänzen: Gefahr, Folge, Vermeidung.', origin: 'rules' }];
}

export function endUserLanguage(blocks: ReviewBlock[]): ReviewFinding[] {
  const out: ReviewFinding[] = [];
  for (const b of blocks) {
    for (const s of segmentSentences(b.text.replace(/!\[[^\]]*\]\([^)]*\)/g, ''))) {
      const words = s.text.split(/\s+/).filter(Boolean).length;
      if (words > LONG_SENTENCE) out.push({ profile: 'enduser', severity: 'medium', rule: 'long_sentence', message: `Satz mit ${words} Wörtern – für Endanwender schwer zu lesen.`, blockId: b.id, section: b.sectionTitle, excerpt: excerpt(s.text), suggestion: 'In zwei oder mehr Sätze teilen.', origin: 'rules' });
    }
    const j = JARGON_RE.exec(b.text);
    if (j) out.push({ profile: 'enduser', severity: 'low', rule: 'jargon', message: `Fachbegriff „${j[1]}“ – Endanwender kennen ihn womöglich nicht.`, blockId: b.id, section: b.sectionTitle, excerpt: excerpt(b.text, j.index), suggestion: 'Durch einen Begriff der Oberfläche ersetzen oder kurz erklären.', origin: 'rules' });
  }
  return out;
}

/** KI-Funde (JSON des Dienstes) prüfen: nur Funde zu bekannten Absätzen, Schweregrad und Meldung Pflicht */
export function parseAiFindings(profile: ReviewProfile, raw: unknown, blocks: ReviewBlock[]): ReviewFinding[] {
  const list = Array.isArray((raw as any)?.findings) ? (raw as any).findings : [];
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const out: ReviewFinding[] = [];
  for (const f of list.slice(0, 30)) {
    const b = typeof f?.blockId === 'string' ? byId.get(f.blockId) : undefined;
    const message = typeof f?.message === 'string' ? f.message.trim().slice(0, 300) : '';
    if (!message) continue;
    const severity: Severity = ['high', 'medium', 'low'].includes(f?.severity) ? f.severity : 'low';
    out.push({ profile, severity, rule: 'ai', message, blockId: b?.id ?? null, section: b?.sectionTitle ?? null, excerpt: b ? excerpt(typeof f?.quote === 'string' && b.text.includes(f.quote) ? f.quote : b.text) : '', suggestion: typeof f?.suggestion === 'string' ? f.suggestion.slice(0, 500) : null, origin: 'ai' });
  }
  return out;
}
