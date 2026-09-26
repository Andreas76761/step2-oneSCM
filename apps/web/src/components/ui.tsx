import { Suspense, createContext, lazy, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { ApiError, download, get, mediaUrl, post } from '../api';

// ---------- Referenzdaten & Benachrichtigungen ----------

export interface RefItem { code: string; label: string; icon: string; color: string; description?: string }
export interface Reference {
  roles: RefItem[];
  divisions: RefItem[];
  evidenceStatuses: string[];
  findingTypes: string[];
  severities: string[];
  decisions: { code: string; label: string }[];
  sections: { code: string; title: string }[];
  blockModes: string[];
  contradictionRules: Record<string, string>;
  markets: { code: string }[];
  releases: { code: string }[];
  users: { id: string; name: string; permissions: string[] }[];
}

interface AppState {
  ref: Reference | null;
  reloadRef: () => void;
  notify: (msg: string, kind?: 'ok' | 'error') => void;
  userId: string;
  setUserId: (id: string) => void;
}
export const AppCtx = createContext<AppState>(null as any);
export const useApp = () => useContext(AppCtx);

export function errorText(e: unknown): string {
  if (e instanceof ApiError) {
    const p = e.problem;
    const failed = p?.gate?.checks?.filter((c: any) => !c.passed).map((c: any) => `${c.label}: ${c.details.slice(0, 3).join('; ')}`);
    const blockers = p?.blockers?.flatMap((b: any) => b.checks.map((c: any) => `${c.label}: ${c.details.slice(0, 3).join('; ')}`));
    return [p?.detail ?? p?.title ?? e.message, ...(failed ?? []), ...(blockers ?? [])].join(' — ');
  }
  return (e as Error)?.message ?? String(e);
}

/** Lädt Daten und stellt reload bereit. */
export function useLoad<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // nur die Antwort der jüngsten Anfrage übernehmen: wechselt der Pfad (z. B. andere Variante), darf eine spät
  // eintreffende ältere Antwort den neuen Stand nicht überschreiben
  const latest = useRef(0);
  const load = useCallback(async () => {
    if (!path) return;
    const id = ++latest.current;
    setLoading(true);
    try {
      const result = await get<T>(path);
      if (id !== latest.current) return;
      setData(result);
      setError(null);
    } catch (e) {
      if (id === latest.current) setError(errorText(e));
    } finally {
      if (id === latest.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);
  useEffect(() => {
    void load();
  }, [load]);
  return { data, error, loading, reload: load, setData };
}

// ---------- Badges (US-010: Icon + Label + Farbe immer gemeinsam) ----------

export function Badge({ item, compact }: { item?: RefItem; compact?: boolean }) {
  if (!item) return null;
  return (
    <span className="badge" style={{ '--badge': item.color } as CSSProperties} title={item.description ?? item.label}>
      <span aria-hidden="true">{item.icon}</span> {compact ? <span className="sr-only">{item.label}</span> : item.label}
    </span>
  );
}

export function RoleBadges({ codes, confirmed }: { codes: (string | { code: string; evidenceStatus?: string })[]; confirmed?: boolean }) {
  const { ref } = useApp();
  return (
    <span className="badges">
      {codes.map((c) => {
        const code = typeof c === 'string' ? c : c.code;
        const st = typeof c === 'string' ? undefined : c.evidenceStatus;
        return (
          <span key={code} className={st && !['source_confirmed', 'manually_confirmed'].includes(st) ? 'unconfirmed' : ''} title={st ? `Evidenz: ${st}` : undefined}>
            <Badge item={ref?.roles.find((r) => r.code === code)} />
            {st && !['source_confirmed', 'manually_confirmed'].includes(st) && confirmed !== false && <sup title="unbestätigt">?</sup>}
          </span>
        );
      })}
    </span>
  );
}

export function DivisionBadges({ codes }: { codes: (string | { code: string; evidenceStatus?: string })[] }) {
  const { ref } = useApp();
  return (
    <span className="badges">
      {codes.map((c) => {
        const code = typeof c === 'string' ? c : c.code;
        const st = typeof c === 'string' ? undefined : c.evidenceStatus;
        const unconf = st && !['source_confirmed', 'manually_confirmed'].includes(st);
        return (
          <span key={code} className={unconf ? 'unconfirmed' : ''} title={st ? `Evidenz: ${st}` : undefined}>
            <Badge item={ref?.divisions.find((r) => r.code === code)} />
            {unconf && <sup title="unbestätigt">?</sup>}
          </span>
        );
      })}
    </span>
  );
}

const SEV_LABEL: Record<string, string> = { blocker: '⛔ Blocker', high: '▲ hoch', medium: '■ mittel', low: '▽ niedrig' };
export const Severity = ({ s }: { s: string }) => <span className={`tag sev-${s}`}>{SEV_LABEL[s] ?? s}</span>;

const STATUS_LABEL: Record<string, string> = {
  open: 'offen', deferred: 'zurückgestellt', resolved: 'entschieden', ignored: 'ignoriert', obsolete: 'obsolet',
  draft: 'Entwurf', in_review: '⏳ eingereicht', rejected: 'abgelehnt', approved: 'freigegeben', superseded: 'ersetzt', proposed: 'Vorschlag', confirmed: 'bestätigt', dissolved: 'aufgelöst',
  generated: 'generiert', manually_edited: 'manuell bearbeitet', ai_rewritten: '✨ KI-umformuliert', invalid: 'ungültig', accepted: 'übernommen', stale: 'veraltet', locked: '🔒 gesperrt', needs_regeneration: '⟳ prüfen', queued: 'wartet', processing: 'läuft',
  completed: 'abgeschlossen', completed_with_errors: 'mit Fehlern', cancelled: 'abgebrochen', failed: 'fehlgeschlagen', imported: 'importiert', identical: 'identisch', skipped: 'übersprungen', removed: 'entfernt', media: 'Bild', idle: 'aktuell', syncing: 'gleicht ab', importing: 'importiert gerade',
  source_confirmed: 'Quelle bestätigt', manually_confirmed: 'manuell bestätigt', unconfirmed: 'unbestätigt', open_question: 'offene Frage', general: 'allgemein',
};
export const statusLabel = (s: string) => STATUS_LABEL[s] ?? s;
export const Status = ({ s }: { s: string }) => <span className={`tag st-${s}`}>{statusLabel(s)}</span>;

export const TYPE_LABEL: Record<string, string> = { gap: 'Lücke', duplicate: 'Dopplung', contradiction: 'Widerspruch', terminology: 'Terminologie', privacy: 'Datenschutz', readability: 'Lesbarkeit' };

// ---------- Layout-Bausteine ----------

export function Page({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  // Seitentitel für Browser-Tabs und Screenreader (WCAG 2.4.2)
  useEffect(() => {
    document.title = `${title} – oneSCM Handbook Studio`;
  }, [title]);
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {actions && <div className="actions">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export const Card = ({ title, children, actions, className }: { title?: ReactNode; children: ReactNode; actions?: ReactNode; className?: string }) => (
  <section className={`card ${className ?? ''}`}>
    {(title || actions) && (
      <div className="card-head">
        {title && <h2>{title}</h2>}
        {actions}
      </div>
    )}
    {children}
  </section>
);

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Dialog: Fokus beim Öffnen hinein, Tab bleibt im Dialog, beim Schließen zurück zum Auslöser (WCAG 2.4.3). */
export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !ref.current) return;
      const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
    };
    window.addEventListener('keydown', h);
    return () => {
      window.removeEventListener('keydown', h);
      opener?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div ref={ref} className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h2>{title}</h2>
          <button className="btn ghost" onClick={onClose} aria-label="Schließen">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Bild hochladen und als Markdown-Verweis einfügen; Alternativtext ist Pflicht (Barrierefreiheit, ADR-029) */
export function ImageInsert({ onInsert }: { onInsert: (markdown: string) => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return <button type="button" className="btn small" onClick={() => setOpen(true)}>🖼️ Bild einfügen</button>;
  const insert = async () => {
    if (!file || !alt.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const m = await post<{ sha256: string }>('/media', fd);
      onInsert(`![${alt.trim().replace(/([\\[\]])/g, '\\$1')}](media:${m.sha256})`);
      setOpen(false);
      setFile(null);
      setAlt('');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <fieldset className="image-insert">
      <legend>Bild einfügen</legend>
      <label>Bilddatei (PNG, JPEG, GIF, WebP, SVG) <input type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,.svg" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
      <label>Alternativtext (Pflicht) <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Was zeigt das Bild?" /></label>
      <ErrorBox error={error} />
      <div className="row-actions">
        <button type="button" className="btn primary small" disabled={!file || !alt.trim() || busy} onClick={insert}>{busy ? 'Lädt hoch …' : 'Einfügen'}</button>
        <button type="button" className="btn small" onClick={() => setOpen(false)}>Abbrechen</button>
      </div>
    </fieldset>
  );
}

/** Markdown-Vorschau ohne HTML-Ausführung (kein rehype-raw, §13) – Renderer wird nachgeladen (Code-Splitting) */
let markdownModule: Promise<typeof import('./Markdown')> | null = null;
/** Renderer laden (einmal); die Druckansicht wartet darauf, bevor sie das Drucken freigibt */
export const preloadMarkdown = () => (markdownModule ??= import('./Markdown'));
const MarkdownView = lazy(preloadMarkdown);
export function Md({ text }: { text: string }) {
  // bis der Renderer geladen ist: Text unformatiert, damit nichts springt oder fehlt
  return <Suspense fallback={<div className="md md-pending">{text}</div>}><MarkdownView text={text} /></Suspense>;
}

export const ErrorBox = ({ error }: { error: string | null }) => (error ? <div className="alert error" role="alert">{error}</div> : null);
export const Empty = ({ children }: { children: ReactNode }) => <div className="empty">{children}</div>;

/** Hinweis auf eine fachliche Entscheidung (docs/04-offene-entscheidungen.md, entschieden am 24.09.2026). */
export function Decision({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="alert decision" title="Fachliche Entscheidung vom 24.09.2026 – Details in docs/04-offene-entscheidungen.md">
      <strong>Entscheidung {id}:</strong> {children}
    </div>
  );
}

// ---------- Zeilen-Diff für Versionsvergleich ----------

export function diffLines(a: string, b: string): { op: '=' | '-' | '+'; text: string }[] {
  const x = a.split('\n');
  const y = b.split('\n');
  const dp = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: { op: '=' | '-' | '+'; text: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) (out.push({ op: '=', text: x[i] }), i++, j++);
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ op: '-', text: x[i++] });
    else out.push({ op: '+', text: y[j++] });
  }
  while (i < x.length) out.push({ op: '-', text: x[i++] });
  while (j < y.length) out.push({ op: '+', text: y[j++] });
  return out;
}

export const Diff = ({ a, b }: { a: string; b: string }) => (
  <pre className="diff">
    {diffLines(a, b).map((l, i) => (
      <div key={i} className={`d${l.op === '+' ? 'add' : l.op === '-' ? 'del' : 'eq'}`}>
        {l.op === '=' ? '  ' : `${l.op} `}
        {l.text}
      </div>
    ))}
  </pre>
);

/** Einfaches, einfarbiges Balkendiagramm (eine Serie, direkt beschriftet, Tooltip über title). */
export function BarList({ rows, label }: { rows: { key: string; label: ReactNode; value: number; hint?: string }[]; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="barlist" role="table" aria-label={label}>
      {rows.map((r) => (
        <div className="bar-row" role="row" key={r.key} title={r.hint ?? `${r.value}`}>
          <span className="bar-label" role="cell">{r.label}</span>
          <span className="bar-track" role="cell">
            <span className="bar" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="bar-value" role="cell">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function useDialog<T>() {
  const [value, setValue] = useState<T | null>(null);
  return { value, open: (v: T) => setValue(v), close: () => setValue(null) };
}

export function useRef2() {
  return useApp().ref;
}

/** Download-Schaltfläche mit Anmeldung */
export function DownloadButton({ href, name, children, className }: { href: string; name: string; children: ReactNode; className?: string }) {
  const { notify } = useApp();
  return (
    <button className={className ?? 'btn'} onClick={() => download(href, name).catch((e) => notify(errorText(e), 'error'))}>
      {children}
    </button>
  );
}

/** Mausklick-Ziel zusätzlich per Tastatur bedienbar machen (Enter/Leertaste, WCAG 2.1.1). */
export function activatable(fn: () => void) {
  return {
    onClick: fn,
    tabIndex: 0,
    onKeyDown: (e: ReactKeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
        e.preventDefault();
        fn();
      }
    },
  };
}
