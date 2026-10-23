import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, del, post } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// oneSCM_Metadaten › Rückfragen (ADR-089): Fragenkatalog einlesen und alle Fragen mit Belegen aus den Quellen beantworten

const STATUS: Record<string, [string, string]> = {
  open: ['offen', ''], answered: ['beantwortet', ''], no_answer: ['keine Aussage in den Quellen', 'sev-medium'], blocked: ['nicht gefragt', 'sev-high'],
};
const where = (s: any) => (s.locator?.page ? `Seite ${s.locator.page}` : s.locator?.slide ? `Folie ${s.locator.slide}` : s.lineStart === s.lineEnd ? `Zeile ${s.lineStart}` : `Zeilen ${s.lineStart}–${s.lineEnd}`);

export function QuestionCatalogPage() {
  const { notify } = useApp();
  const me = useLoad<{ permissions: string[] }>('/me');
  const canEdit = !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
  const sets = useLoad<any[]>('/metadata/question-sets');
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => {
    if (!sel && sets.data?.length) setSel(sets.data[0].id);
  }, [sets.data, sel]);
  const cat = useLoad<any>(sel ? `/metadata/question-sets/${sel}` : null, [sel]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [status, setStatus] = useState('');
  const upload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api<any>('POST', '/metadata/question-sets', fd);
      notify(`${r.summary.questions} Fragen aus „${r.fileName}“ eingelesen.`);
      sets.reload();
      setSel(r.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const fromText = async () => {
    try {
      const r = await post<any>('/metadata/question-sets', { text, name: 'Eingefügte Fragen' });
      notify(`${r.summary.questions} Fragen eingelesen.`);
      setText('');
      sets.reload();
      setSel(r.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const answerAll = async () => {
    setBusy(true);
    try {
      const r = await post<any>(`/metadata/question-sets/${sel}/answer`, { onlyOpen });
      notify(`${r.summary.answered} von ${r.summary.questions} Fragen mit Belegen beantwortet.`);
      cat.reload();
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const take = async (id: string) => {
    try {
      await post(`/metadata/question-items/${id}/qa`, {});
      notify('Als Frage & Antwort gespeichert.');
      cat.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const remove = async () => {
    if (!window.confirm('Fragenkatalog mit allen Antworten löschen?')) return;
    try {
      await del(`/metadata/question-sets/${sel}`);
      setSel(null);
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const c = cat.data;
  const items = (c?.items ?? []).filter((i: any) => !status || i.status === status);
  const chapters = [...new Set(items.map((i: any) => i.chapter ?? '(ohne Kapitel)'))] as string[];
  return (
    <Page title="Rückfragen" subtitle="Fragenkatalog einlesen (z. B. aus einem Review-Cockpit) und alle Fragen mit Belegen aus den eingelesenen Quellen beantworten">
      <ErrorBox error={sets.error ?? cat.error} />
      <div className="grid2">
        {canEdit && (
          <Card title="Fragenkatalog einlesen">
            <label className="block">Datei (HTML-App, CSV mit Spalte „Frage“, JSON oder Text) <input type="file" accept=".html,.htm,.csv,.json,.txt,.md" data-testid="catalog-input" onChange={(e) => void upload(e.target.files?.[0])} /></label>
            <p className="small muted">Aus HTML werden Fragen aus dem Text, aus Tabellen und aus den Daten im Skript gelesen – mit Kapitel. Die Datei wird nicht ausgeführt. Die Fragen bleiben in der App, nicht im Repository.</p>
            <label className="block">oder Fragen einfügen (eine je Zeile, „## Kapitel“ als Überschrift) <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} /></label>
            <button className="btn" disabled={!text.includes('?')} onClick={() => void fromText()}>Einlesen</button>
          </Card>
        )}
        <Card title={`Kataloge (${sets.data?.length ?? 0})`}>
          {!sets.data?.length ? <Empty>Noch kein Fragenkatalog.</Empty> : (
            <ul className="oq-list" aria-label="Fragenkataloge">
              {sets.data.map((s) => (
                <li key={s.id}>
                  <button aria-current={s.id === sel} onClick={() => setSel(s.id)}>
                    <span>{s.name}</span>
                    <span className="muted small">{s.answered}/{s.questions} beantwortet</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      {c && (
        <Card title={c.name} actions={<span className="row-actions">
          {(['xlsx', 'csv', 'json'] as const).map((f) => <DownloadButton key={f} className="btn small" href={`/api/v1/metadata/question-sets/${c.id}/export?format=${f}`} name={`${c.name}.${f}`}>⬇ {f.toUpperCase()}</DownloadButton>)}
          {canEdit && <button className="btn small ghost" onClick={() => void remove()}>Löschen</button>}
        </span>}>
          <div className="stat-row">
            <div className="stat"><span className="muted small">Fragen</span><strong>{c.summary.questions}</strong></div>
            <div className="stat"><span className="muted small">Kapitel</span><strong>{c.summary.chapters}</strong></div>
            <div className="stat"><span className="muted small">beantwortet</span><strong>{c.summary.answered}</strong></div>
            <div className="stat"><span className="muted small">keine Aussage</span><strong>{c.summary.noAnswer}</strong></div>
            <div className="stat"><span className="muted small">offen</span><strong>{c.summary.open}</strong></div>
          </div>
          <div className="filters">
            {canEdit && <button className="btn primary" disabled={busy} onClick={() => void answerAll()}>{busy ? 'Beantworte …' : 'Alle mit Belegen beantworten'}</button>}
            {canEdit && <label className="small"><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} /> nur offene</label>}
            <label>Status <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">alle</option>{Object.entries(STATUS).map(([k, [t]]) => <option key={k} value={k}>{t}</option>)}</select></label>
          </div>
          {!items.length ? <Empty>Keine Fragen.</Empty> : chapters.map((ch) => (
            <section key={ch} className="qc-chapter" aria-label={ch}>
              <h3>{ch}</h3>
              {items.filter((i: any) => (i.chapter ?? '(ohne Kapitel)') === ch).map((i: any) => (
                <article key={i.id} className="qc-item" aria-label={`Frage ${i.position}`}>
                  <p><strong>{i.position}. {i.question}</strong> <span className={`tag small ${STATUS[i.status]?.[1] ?? ''}`}>{STATUS[i.status]?.[0] ?? i.status}</span>{i.qaId && <span className="tag small">gespeichert</span>}</p>
                  {i.answer.length > 0 && <p className="md-text small">{i.answer.map((s: any, k: number) => <span key={k}>{s.text}{s.sources.map((n: number) => <sup key={n}>[{n}]</sup>)} </span>)}</p>}
                  {i.notice && !i.answer.length && <p className="small muted">{i.notice}</p>}
                  {i.sources.length > 0 && (
                    <details className="small">
                      <summary>{i.sources.length} Belege</summary>
                      {i.sources.map((s: any) => <blockquote key={s.n} className="md-excerpt"><strong>[{s.n}] {s.path}</strong> · {s.headingPath.join(' › ') || '–'} · <span className="muted">{where(s)}</span><div>{s.text}</div></blockquote>)}
                    </details>
                  )}
                  {canEdit && i.status === 'answered' && !i.qaId && <button className="btn small" onClick={() => void take(i.id)}>Als Frage & Antwort speichern</button>}
                </article>
              ))}
            </section>
          ))}
          <p className="small muted">Gespeicherte Antworten stehen unter <Link to="/metadaten/fragen">Fragen & Antworten</Link>.</p>
        </Card>
      )}
    </Page>
  );
}
