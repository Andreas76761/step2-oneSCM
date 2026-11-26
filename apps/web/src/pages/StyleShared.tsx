// Schreibstil (ADR-040): gemeinsame Bausteine – Prüfergebnis mit markierten Sätzen, Satz bearbeiten, Korrekturen anwenden,
// Lesbarkeit. Genutzt von Schreibstil, Kapitelwerkstatt und „Prüfen & Verständlichkeit“.
import { InfoIcon, TriangleAlertIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useEffect, useState, type ReactNode } from 'react';
import { Card } from '../components/ui';

export interface Fix { start: number; end: number; replacement: string; label: string }

export interface Issue { rule: string; severity: 'warning' | 'info'; message: string; start: number; end: number; fix?: Fix }

export interface Sentence { start: number; end: number; text: string; issues: Issue[] }

export interface Analysis { sentences: Sentence[]; score: number; rules: { rule: string; label: string; count: number }[]; problemSentences: number; fixable: number }

/** Korrekturen von hinten nach vorn anwenden, überlappende auslassen (wie im Server) */
export function applyFixes(text: string, fixes: Fix[]) {
  let out = text;
  let limit = Infinity;
  for (const f of [...fixes].sort((a, b) => b.start - a.start || b.end - a.end)) {
    if (f.end > limit) continue;
    out = out.slice(0, f.start) + f.replacement + out.slice(f.end);
    limit = f.start;
  }
  return out;
}

/**
 * Korrektur des Originalsatzes auf den aktuellen (evtl. schon geänderten) Entwurf übertragen: Die Stelle wird über den
 * Originaltext samt vorangehendem Kontext gesucht (nächstgelegene Fundstelle); fehlt sie, bleibt der Entwurf unverändert.
 */
export function applyToDraft(draft: string, original: string, fix: Fix): string {
  if (draft === original) return applyFixes(draft, [fix]);
  const orig = original.slice(fix.start, fix.end);
  // mit möglichst viel Kontext suchen; Kontext kann durch frühere Korrekturen verändert sein, daher schrittweise kürzen
  for (let ctx = Math.min(12, fix.start); ctx >= (orig ? 0 : 1); ctx--) {
    const needle = original.slice(fix.start - ctx, fix.end);
    let best = -1;
    for (let i = draft.indexOf(needle); i >= 0; i = draft.indexOf(needle, i + 1)) {
      if (best < 0 || Math.abs(i + ctx - fix.start) < Math.abs(best + ctx - fix.start)) best = i;
    }
    if (best >= 0) {
      const at = best + ctx;
      return draft.slice(0, at) + fix.replacement + draft.slice(at + orig.length);
    }
  }
  return draft;
}

const scoreClass = (s: number) => (s >= 80 ? 'st-approved' : s >= 50 ? 'st-in_review' : 'st-failed');

export function Summary({ a }: { a: Analysis }) {
  return (
    <p className="small" role="status">
      <span className={`tag ${scoreClass(a.score)}`}>Stilwert {a.score}/100</span> · {a.problemSentences} Sätze mit Problemen · {a.fixable} automatisch korrigierbar
      {a.rules.length > 0 && <> · {a.rules.map((r) => `${r.label} ${r.count}`).join(', ')}</>}
    </p>
  );
}

const IMAGE_MD = /!\[[^\]]*\]\([^)]*\)/g;

/** Text mit markierten Sätzen: gelb = Problem (Warnung), unterstrichen = Hinweis; Klick öffnet die Bearbeitung.
 * `hideImages`: Bild-Markdown ausblenden (Bilder zeigt der Aufrufer selbst an, z. B. in der Werkstatt). */
export function MarkedText({ text, a, selected, onSelect, hideImages }: { text: string; a: Analysis; selected?: number | null; onSelect?: (i: number) => void; hideImages?: boolean }) {
  const show = (t: string) => (hideImages ? t.replace(IMAGE_MD, '').replace(/\n{3,}/g, '\n\n') : t);
  const parts: ReactNode[] = [];
  let pos = 0;
  a.sentences.forEach((s, i) => {
    if (s.start > pos) parts.push(<span key={`t${i}`}>{show(text.slice(pos, s.start))}</span>);
    const warn = s.issues.some((x) => x.severity === 'warning');
    const cls = `style-sentence${warn ? ' warn' : s.issues.length ? ' info' : ''}${selected === i ? ' selected' : ''}`;
    const title = s.issues.map((x) => x.message).join('\n');
    parts.push(s.issues.length && onSelect
      ? <button key={`s${i}`} type="button" className={cls} title={title} aria-label={`${text.slice(s.start, s.end)} – ${s.issues.length} Hinweis(e), bearbeiten`} onClick={() => onSelect(i)}>{show(text.slice(s.start, s.end))}</button>
      : <span key={`s${i}`} className={cls} title={title || undefined}>{show(text.slice(s.start, s.end))}</span>);
    pos = s.end;
  });
  if (pos < text.length) parts.push(<span key="end">{show(text.slice(pos))}</span>);
  return <div className="style-text" role="group" aria-label="Geprüfter Text">{parts}</div>;
}

/** Bearbeitung eines Satzes: Hinweise mit Einzelkorrektur, freie Bearbeitung */
export function SentenceEditor({ s, onApply, onClose }: { s: Sentence; onApply: (replacement: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(s.text);
  useEffect(() => setDraft(s.text), [s.start, s.text]);
  // Korrekturen relativ zum Satz
  const rel = (f: Fix) => ({ ...f, start: f.start - s.start, end: f.end - s.start });
  return (
    <Card title="Satz bearbeiten">
      <ul className="style-issues">
        {s.issues.map((i, n) => (
          <li key={n} className={i.severity}>
            <span className="tag"><Ico icon={i.severity === 'warning' ? TriangleAlertIcon : InfoIcon} size={14} />{i.severity === 'warning' ? 'Problem' : 'Hinweis'}</span> {i.message}
            {i.fix && <button className="btn small" onClick={() => setDraft((d) => applyToDraft(d, s.text, rel(i.fix!)))}>{i.fix.label || 'korrigieren'}</button>}
          </li>
        ))}
      </ul>
      <label className="block">Satz <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} /></label>
      <div className="filters">
        <button className="btn" onClick={() => setDraft((d) => s.issues.filter((i) => i.fix).map((i) => rel(i.fix!)).sort((x, y) => y.start - x.start || y.end - x.end)
          .reduce((acc, f, n, all) => (n > 0 && f.end > all[n - 1].start ? acc : applyToDraft(acc, s.text, f)), d))}>Alle Korrekturen im Satz</button>
        <button className="btn primary" onClick={() => onApply(draft)}>Übernehmen</button>
        <button className="btn ghost" onClick={onClose}>Schließen</button>
      </div>
    </Card>
  );
}

/** Lesbarkeit eines Kapitels mit Sollwerten der Zielgruppe (ADR-097, S-01) */
export function ReadabilityPanel({ r }: { r: any }) {
  if (!r?.sentences) return null;
  return (
    <section className={`alert ${r.ok ? 'ok' : 'warning'}`} aria-label="Lesbarkeit">
      <strong>Lesbarkeit für {r.audienceLabel}:</strong> Flesch {r.flesch} · LIX {r.lix} ({r.lixLabel}) · Ø {String(r.avgWords).replace('.', ',')} Wörter je Satz · {r.longShare} % lange Sätze · {r.passiveShare} % Passiv
      <ul className="small read-checks">
        {r.checks.map((c: any) => <li key={c.code}>{c.ok ? '✓' : '✗'} {c.label} <span className="muted">(ist {String(c.value).replace('.', ',')})</span></li>)}
      </ul>
    </section>
  );
}
