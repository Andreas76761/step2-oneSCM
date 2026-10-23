import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, del, post } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// oneSCM_Metadaten › Antwortqualität (ADR-091, M7): Testfragen mit erwarteten Quellen, Prüflauf mit Kennzahlen, Verlauf

const pct = (v: number | undefined) => (v === undefined ? '–' : `${Math.round(v * 100)} %`);
const KPIS: [string, string, (v: number | undefined) => string, string][] = [
  ['passRate', 'bestanden', pct, 'Anteil der Testfragen, die alle Erwartungen erfüllen'],
  ['hitAt1', 'Treffer@1', pct, 'erwartete Quelle an erster Stelle'],
  ['hitAt6', 'Treffer@6', pct, 'erwartete Quelle unter den sechs gefundenen Stellen (Trefferquote)'],
  ['mrr', 'MRR', (v) => (v === undefined ? '–' : v.toFixed(2)), 'mittlerer reziproker Rang der erwarteten Quelle'],
  ['citedRate', 'Beleg richtig', pct, 'Antwort belegt mit einer erwarteten Quelle'],
  ['keywordCoverage', 'Stichworte', pct, 'Anteil der erwarteten Stichworte in der Antwort'],
  ['noAnswerAccuracy', 'Lücken richtig', pct, 'Lückenfragen ohne Antwort („keine Aussage in den Quellen“)'],
];
const expText = (e: any) => [e.path, e.heading].filter(Boolean).join(' › ');

function Delta({ v, points = true }: { v: number | undefined; points?: boolean }) {
  if (!v) return null;
  const t = points ? `${v > 0 ? '+' : '−'}${Math.abs(Math.round(v * 100))} Pkt.` : `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`;
  return <span className={`tag small ${v < 0 ? 'sev-high' : ''}`}>{v > 0 ? '▲' : '▼'} {t}</span>;
}

export function AnswerQualityPage() {
  const { notify } = useApp();
  const me = useLoad<{ permissions: string[] }>('/me');
  const canEdit = !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
  const sets = useLoad<any[]>('/metadata/eval-sets');
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => {
    if (!sel && sets.data?.length) setSel(sets.data[0].id);
  }, [sets.data, sel]);
  const set = useLoad<any>(sel ? `/metadata/eval-sets/${sel}` : null, [sel]);
  const [runId, setRunId] = useState<string | null>(null);
  useEffect(() => setRunId(set.data?.runs?.[0]?.id ?? null), [set.data]);
  const run = useLoad<any>(runId ? `/metadata/eval-runs/${runId}` : null, [runId]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [onlyFailed, setOnlyFailed] = useState(false);
  const [q, setQ] = useState({ question: '', sources: '', keywords: '', gap: false });

  const created = (r: any, text: string) => {
    notify(text);
    sets.reload();
    setSel(r.id);
  };
  const upload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api<any>('POST', '/metadata/eval-sets', fd);
      created(r, `${r.items.length} Testfragen aus „${file.name}“ eingelesen.`);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const create = async (fromQa: boolean) => {
    try {
      const r = await post<any>('/metadata/eval-sets', { name: name.trim() || (fromQa ? 'Aus Fragen & Antworten' : 'Testfragen'), ...(fromQa ? { fromQa: {} } : {}) });
      setName('');
      created(r, fromQa ? `${r.items.length} Testfragen aus gespeicherten Fragen & Antworten angelegt.` : 'Testfragensatz angelegt.');
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const addItem = async () => {
    try {
      await post(`/metadata/eval-sets/${sel}/items`, {
        question: q.question, expected: q.sources.split('\n').map((x) => x.trim()).filter(Boolean), keywords: q.keywords.split(/[,;]/).map((x) => x.trim()).filter(Boolean), expectNoAnswer: q.gap,
      });
      setQ({ question: '', sources: '', keywords: '', gap: false });
      set.reload();
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const removeItem = async (id: string) => {
    try {
      await del(`/metadata/eval-items/${id}`);
      set.reload();
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const start = async () => {
    setBusy(true);
    try {
      const r = await post<any>(`/metadata/eval-sets/${sel}/runs`, {});
      notify(`Prüflauf fertig: ${r.metrics.passed} von ${r.metrics.questions} Testfragen bestanden.`);
      set.reload();
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const removeSet = async () => {
    if (!window.confirm('Testfragensatz mit allen Prüfläufen löschen?')) return;
    try {
      await del(`/metadata/eval-sets/${sel}`);
      setSel(null);
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  const s = set.data;
  const r = run.data;
  const results = (r?.results ?? []).filter((x: any) => !onlyFailed || !x.passed);
  const changed = new Map<string, string>([...(r?.compare?.improved ?? []).map((id: string) => [id, 'neu bestanden']), ...(r?.compare?.regressed ?? []).map((id: string) => [id, 'neu durchgefallen'])] as [string, string][]);
  return (
    <Page title="Antwortqualität" subtitle="Testfragen mit erwarteten Quellen stellen und messen, wie gut „Frage an alle Quellen“ die richtigen Stellen findet und belegt">
      <ErrorBox error={sets.error ?? set.error ?? run.error} />
      <div className="grid2">
        {canEdit && (
          <Card title="Testfragensatz anlegen">
            <label className="block">Datei (CSV oder Excel mit Spalten „Frage“, „Erwartete Quelle“, „Erwartete Überschrift“, „Stichworte“, „Keine Antwort“ – oder JSON) <input type="file" accept=".csv,.xlsx,.json" data-testid="eval-input" onChange={(e) => void upload(e.target.files?.[0])} /></label>
            <p className="small muted">Mehrere Quellen bzw. Stichworte in einer Zelle mit „|“ trennen; „Pfad › Überschrift“ grenzt auf eine Überschrift ein. „Keine Antwort = ja“ kennzeichnet Lückenfragen. Die Fragen bleiben in der App, nicht im Repository.</p>
            <label className="block">Name <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Wissens-Check Kapitel 3" /></label>
            <div className="row-actions">
              <button className="btn" onClick={() => void create(true)}>Aus Fragen & Antworten</button>
              <button className="btn ghost" onClick={() => void create(false)}>Leerer Satz</button>
            </div>
          </Card>
        )}
        <Card title={`Testfragensätze (${sets.data?.length ?? 0})`}>
          {!sets.data?.length ? <Empty>Noch kein Testfragensatz.</Empty> : (
            <ul className="oq-list" aria-label="Testfragensätze">
              {sets.data.map((x) => (
                <li key={x.id}>
                  <button aria-current={x.id === sel} onClick={() => setSel(x.id)}>
                    <span>{x.name}</span>
                    <span className="muted small">{x.questions} Fragen · {x.lastRun ? `${pct(x.lastRun.metrics.passRate)} bestanden` : 'noch kein Prüflauf'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {s && (
        <Card title={s.name} actions={<span className="row-actions">
          {canEdit && <button className="btn primary small" disabled={busy || !s.items.length} onClick={() => void start()}>{busy ? 'Prüflauf läuft …' : 'Prüflauf starten'}</button>}
          {canEdit && <button className="btn small ghost" onClick={() => void removeSet()}>Löschen</button>}
        </span>}>
          {!r ? <Empty>Noch kein Prüflauf. Starten Sie einen Prüflauf, um die Kennzahlen zu sehen.</Empty> : (
            <>
              <div className="stat-row" role="group" aria-label="Kennzahlen">
                {KPIS.map(([k, label, fmt, help]) => (
                  <div key={k} className="stat" title={help}>
                    <span className="muted small">{label}</span>
                    <strong>{fmt(r.metrics[k])}</strong>
                    <Delta v={r.compare?.delta?.[k]} points={k !== 'mrr'} />
                  </div>
                ))}
              </div>
              <p className="small muted">
                {r.metrics.passed} von {r.metrics.questions} bestanden · {r.metrics.withSources} mit erwarteter Quelle · {r.metrics.noAnswerItems} Lückenfragen · {r.config.units} durchsuchte Stellen · {r.config.llm ? `KI: ${r.config.llm.provider}` : 'ohne KI (extraktiv)'} · Ø {r.metrics.avgMs} ms je Frage
                {r.compare && <> · verglichen mit dem Lauf vom {new Date(r.compare.previousAt).toLocaleString('de-DE')}: {r.compare.improved.length} neu bestanden, {r.compare.regressed.length} neu durchgefallen</>}
              </p>
            </>
          )}
          {s.runs.length > 0 && (
            <details>
              <summary>Verlauf ({s.runs.length} Prüfläufe)</summary>
              <table className="table compact">
                <thead><tr><th>Lauf</th><th>bestanden</th><th>Treffer@1</th><th>Treffer@6</th><th>MRR</th><th>Beleg richtig</th><th>Lücken richtig</th><th></th></tr></thead>
                <tbody>
                  {s.runs.map((x: any) => (
                    <tr key={x.id} aria-current={x.id === runId}>
                      <td>{new Date(x.createdAt).toLocaleString('de-DE')}</td><td>{pct(x.metrics.passRate)}</td><td>{pct(x.metrics.hitAt1)}</td><td>{pct(x.metrics.hitAt6)}</td>
                      <td>{x.metrics.mrr?.toFixed(2)}</td><td>{pct(x.metrics.citedRate)}</td><td>{x.metrics.noAnswerItems ? pct(x.metrics.noAnswerAccuracy) : '–'}</td>
                      <td><button className="btn small ghost" onClick={() => setRunId(x.id)}>Anzeigen</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </Card>
      )}

      {r && (
        <Card title="Ergebnis je Testfrage" actions={<span className="row-actions">
          {(['xlsx', 'csv', 'json'] as const).map((f) => <DownloadButton key={f} className="btn small" href={`/api/v1/metadata/eval-runs/${r.id}/export?format=${f}`} name={`antwortqualitaet.${f}`}>⬇ {f.toUpperCase()}</DownloadButton>)}
        </span>}>
          <label className="small"><input type="checkbox" checked={onlyFailed} onChange={(e) => setOnlyFailed(e.target.checked)} /> nur nicht bestanden</label>
          {!results.length ? <Empty>Alle Testfragen bestanden.</Empty> : (
            <table className="table compact" aria-label="Ergebnisse">
              <thead><tr><th>Nr.</th><th>Frage</th><th>Ergebnis</th><th>Rang</th><th>Beleg</th><th>Stichworte</th></tr></thead>
              <tbody>
                {results.map((x: any) => (
                  <tr key={x.itemId}>
                    <td>{x.position}</td>
                    <td>
                      {x.question}
                      <details className="small">
                        <summary>Antwort und gefundene Stellen</summary>
                        <p>{x.answerText ?? x.notice ?? '–'}</p>
                        <ol>{x.retrieved.map((f: any) => <li key={f.rank}>{f.path}{f.headingPath.length ? ` › ${f.headingPath.join(' › ')}` : ''} <span className="muted">({f.score})</span></li>)}</ol>
                      </details>
                    </td>
                    <td><span className={`tag small ${x.passed ? '' : 'sev-high'}`}>{x.passed ? 'bestanden' : 'nicht bestanden'}</span>{changed.has(x.itemId) && <span className="tag small">{changed.get(x.itemId)}</span>}</td>
                    <td>{x.rank ?? '–'}</td>
                    <td>{x.cited ? 'richtig' : x.answered ? 'andere Quelle' : 'keine Antwort'}</td>
                    <td>{x.keywordTotal ? `${x.keywordHits}/${x.keywordTotal}` : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {s && (
        <Card title={`Testfragen (${s.items.length})`}>
          {canEdit && (
            <div className="grid2">
              <label className="block">Frage <input value={q.question} onChange={(e) => setQ({ ...q, question: e.target.value })} /></label>
              <label className="block">Stichworte (mit Komma getrennt) <input value={q.keywords} onChange={(e) => setQ({ ...q, keywords: e.target.value })} /></label>
              <label className="block">Erwartete Quellen (eine je Zeile, Teil des Pfads, optional „› Überschrift“) <textarea rows={2} value={q.sources} onChange={(e) => setQ({ ...q, sources: e.target.value })} /></label>
              <div>
                <label className="small"><input type="checkbox" checked={q.gap} onChange={(e) => setQ({ ...q, gap: e.target.checked })} /> Lückenfrage (keine Antwort erwartet)</label>
                <p><button className="btn" disabled={q.question.trim().length < 3} onClick={() => void addItem()}>Testfrage hinzufügen</button></p>
              </div>
            </div>
          )}
          {!s.items.length ? <Empty>Noch keine Testfragen.</Empty> : (
            <table className="table compact" aria-label="Testfragen">
              <thead><tr><th>Nr.</th><th>Frage</th><th>Erwartet</th><th>Stichworte</th>{canEdit && <th></th>}</tr></thead>
              <tbody>
                {s.items.map((i: any) => (
                  <tr key={i.id}>
                    <td>{i.position}</td>
                    <td>{i.question}</td>
                    <td className="small">{i.expectNoAnswer ? <span className="tag small">Lückenfrage</span> : i.expected.map(expText).join('; ') || '–'}</td>
                    <td className="small">{i.keywords.join(', ') || '–'}</td>
                    {canEdit && <td><button className="btn small ghost" aria-label={`Testfrage ${i.position} entfernen`} onClick={() => void removeItem(i.id)}>Entfernen</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="small muted">Ausgewertet wird wie unter <Link to="/metadaten/fragen">Fragen & Antworten</Link> – Prüfläufe erscheinen nicht im Frageprotokoll.</p>
        </Card>
      )}
    </Page>
  );
}
