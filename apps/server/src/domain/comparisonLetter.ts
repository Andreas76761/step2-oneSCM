// Releaseletter-Entwurf aus dem Projektvergleich (ADR-102, W-04): neue und geänderte Kapitel, geänderte Bilder,
// neue und abgelöste Funktionen und die Tickets eines Releases. Nur Fakten aus dem Vergleich, nichts erfunden.
// Reine Fachlogik ohne I/O.
import { typeLabel, type Audience, type ReleaseTicket } from './releaseLetter.js';

export interface ComparisonData {
  from: { id: string; version: string; createdAt: string } | null;
  to: { id: string; version: string; title: string; createdAt: string };
  chapters: { chapterId: string; title: string; change: 'new' | 'updated' | 'removed'; fromVersionNo: number | null; toVersionNo: number | null; summary: { added: number; removed: number; changed: number; moved: number } | null }[];
  images: { sha: string; title: string; change: 'new' | 'version' | 'removed'; versionNo: number | null; fromVersionNo: number | null; chapters: string[] }[];
  functions: {
    added: { kind: 'chapter' | 'subchapter'; id: string; title: string; parentTitle: string | null; validFrom: string }[];
    superseded: { kind: string; title: string; parentTitle: string | null; replacedByTitle: string | null; validUntil: string | null }[];
  };
  tickets: ReleaseTicket[];
}

const T = {
  de: {
    title: (v: string) => `Releaseletter ${v}`, draft: (f: string | null, t: string) => `Entwurf aus dem Projektvergleich ${f ? `Version ${f} → ${t}` : `Version ${t} (erstes Release)`} – bitte prüfen und ergänzen.`,
    overview: 'Überblick', counts: (c: number[]) => `${c[0]} neue Funktionen, ${c[1]} neue bzw. geänderte Kapitel, ${c[2]} geänderte Bilder, ${c[3]} abgelöste Funktionen.`,
    added: 'Neue Funktionen', addedLine: (t: string, p: string | null, v: string) => `- **${t}**${p ? ` (${p})` : ''} – neu ab ${v}`,
    chapters: 'Neue und geänderte Kapitel', newCh: 'neues Kapitel', removedCh: 'nicht mehr im Handbuch',
    changed: (s: NonNullable<ComparisonData['chapters'][number]['summary']>) => [s.added ? `${s.added} Absätze neu` : '', s.changed ? `${s.changed} geändert` : '', s.removed ? `${s.removed} entfernt` : '', s.moved ? `${s.moved} verschoben` : ''].filter(Boolean).join(', ') || 'überarbeitet',
    version: (a: number | null, b: number | null) => `Version ${a ?? '–'} → ${b ?? '–'}`,
    images: 'Geänderte Bilder', imgNew: 'neues Bild', imgVersion: (a: number | null, b: number | null) => `neue Fassung${a && b ? ` (Fassung ${a} → ${b})` : ''}`, imgRemoved: 'entfernt', inCh: 'in',
    superseded: 'Abgelöste Funktionen', replacedBy: 'ersetzt durch', until: 'gültig bis',
    tickets: 'Tickets dieses Releases', more: 'Weitere Informationen', moreText: (v: string) => `Einzelheiten stehen im Benutzerhandbuch, Version ${v}.`,
    none: 'Keine Änderungen gegenüber dem Vorgänger-Release.',
  },
  en: {
    title: (v: string) => `Release letter ${v}`, draft: (f: string | null, t: string) => `Draft from the project comparison ${f ? `version ${f} → ${t}` : `version ${t} (first release)`} – please review and complete.`,
    overview: 'Overview', counts: (c: number[]) => `${c[0]} new functions, ${c[1]} new or changed chapters, ${c[2]} changed images, ${c[3]} superseded functions.`,
    added: 'New functions', addedLine: (t: string, p: string | null, v: string) => `- **${t}**${p ? ` (${p})` : ''} – new as of ${v}`,
    chapters: 'New and changed chapters', newCh: 'new chapter', removedCh: 'no longer in the manual',
    changed: (s: NonNullable<ComparisonData['chapters'][number]['summary']>) => [s.added ? `${s.added} paragraphs added` : '', s.changed ? `${s.changed} changed` : '', s.removed ? `${s.removed} removed` : '', s.moved ? `${s.moved} moved` : ''].filter(Boolean).join(', ') || 'revised',
    version: (a: number | null, b: number | null) => `version ${a ?? '–'} → ${b ?? '–'}`,
    images: 'Changed images', imgNew: 'new image', imgVersion: (a: number | null, b: number | null) => `new version${a && b ? ` (version ${a} → ${b})` : ''}`, imgRemoved: 'removed', inCh: 'in',
    superseded: 'Superseded functions', replacedBy: 'replaced by', until: 'valid until',
    tickets: 'Tickets in this release', more: 'Further information', moreText: (v: string) => `Details are in the user manual, version ${v}.`,
    none: 'No changes compared with the previous release.',
  },
};

/** Markdown des Entwurfs; Kapitel- und Bildtitel bleiben in der Sprache des Handbuchs (Deutsch) */
export function buildComparisonLetter(d: ComparisonData, opts: { language: 'de' | 'en'; audience: Audience; title?: string }) {
  const L = T[opts.language];
  const v = d.to.version;
  const out: string[] = [`# ${opts.title?.trim() || L.title(v)}`, '', `> ${L.draft(d.from?.version ?? null, v)}`, ''];
  const counts = [d.functions.added.length, d.chapters.length, d.images.length, d.functions.superseded.length];
  out.push(`## ${L.overview}`, '', counts.some(Boolean) || d.tickets.length ? L.counts(counts) : L.none, '');
  if (d.functions.added.length) out.push(`## ${L.added}`, '', ...d.functions.added.map((f) => L.addedLine(f.title, f.parentTitle, f.validFrom)), '');
  if (d.chapters.length) {
    out.push(`## ${L.chapters}`, '', ...d.chapters.map((c) => `- **${c.title}** – ${c.change === 'new' ? L.newCh : c.change === 'removed' ? L.removedCh : `${L.version(c.fromVersionNo, c.toVersionNo)}${c.summary ? `: ${L.changed(c.summary)}` : ''}`}`), '');
  }
  // Endanwender und Management: Bilder nur als Anzahl, Details in Fachbereich und IT
  if (d.images.length) {
    out.push(`## ${L.images}`, '');
    if (opts.audience === 'mgmt' || opts.audience === 'end') out.push(`- ${d.images.length} × ${L.imgVersion(null, null)}`, '');
    else out.push(...d.images.map((i) => `- „${i.title}“ – ${i.change === 'new' ? L.imgNew : i.change === 'removed' ? L.imgRemoved : L.imgVersion(i.fromVersionNo, i.versionNo)}${i.chapters.length ? ` (${L.inCh} ${i.chapters.map((c) => `„${c}“`).join(', ')})` : ''}`), '');
  }
  if (d.functions.superseded.length) {
    out.push(`## ${L.superseded}`, '', ...d.functions.superseded.map((f) => `- „${f.title}“${f.parentTitle ? ` (${f.parentTitle})` : ''}${f.replacedByTitle ? ` – ${L.replacedBy} „${f.replacedByTitle}“` : ''}${f.validUntil ? ` · ${L.until} ${f.validUntil}` : ''}`), '');
  }
  if (d.tickets.length) {
    // Format wie im Letter aus Tickets: Ticketnummer, Typ und Status wörtlich (Traceability, Prüfregeln 1, 2, 11)
    out.push(`## ${L.tickets}`, '', ...d.tickets.map((t) => `- ${t.summary || t.key} (${t.key}) – ${typeLabel(t.type, opts.language)}${t.type && typeLabel(t.type, opts.language) !== t.type ? ` (${t.type})` : ''}, ${t.status}`), '');
  }
  out.push(`## ${L.more}`, '', L.moreText(v), '');
  return out.join('\n');
}
