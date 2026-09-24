import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import Markdown from 'react-markdown';
import { ApiError, download, get } from '../api';

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
  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await get<T>(path));
      setError(null);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
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
    <span className="badge" style={{ borderColor: item.color, color: item.color }} title={item.description ?? item.label}>
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
  completed: 'abgeschlossen', completed_with_errors: 'mit Fehlern', failed: 'fehlgeschlagen', imported: 'importiert', identical: 'identisch', skipped: 'übersprungen',
  source_confirmed: 'Quelle bestätigt', manually_confirmed: 'manuell bestätigt', unconfirmed: 'unbestätigt', open_question: 'offene Frage', general: 'allgemein',
};
export const statusLabel = (s: string) => STATUS_LABEL[s] ?? s;
export const Status = ({ s }: { s: string }) => <span className={`tag st-${s}`}>{statusLabel(s)}</span>;

export const TYPE_LABEL: Record<string, string> = { gap: 'Lücke', duplicate: 'Dopplung', contradiction: 'Widerspruch', terminology: 'Terminologie', privacy: 'Datenschutz', readability: 'Lesbarkeit' };

// ---------- Layout-Bausteine ----------

export function Page({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
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

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h2>{title}</h2>
          <button className="btn ghost" onClick={onClose} aria-label="Schließen">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Markdown-Vorschau ohne HTML-Ausführung (kein rehype-raw, §13). */
export const Md = ({ text }: { text: string }) => (
  <div className="md">
    <Markdown skipHtml>{text}</Markdown>
  </div>
);

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
