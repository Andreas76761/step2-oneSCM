import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarList, Card, Empty, ErrorBox, Page, Severity, Status, TYPE_LABEL, useLoad } from '../components/ui';
import { CompareDialog } from './Contradictions';

const TYPES = ['gap', 'terminology', 'readability', 'privacy'];

export function OptimizationsPage() {
  const [type, setType] = useState('');
  const f = useLoad<any[]>(`/quality/findings?status=open,deferred${type ? `&type=${type}` : ''}`, [type]);
  const [sel, setSel] = useState<any | null>(null);
  const rows = (f.data ?? []).filter((x) => TYPES.includes(x.type));
  const o = useLoad<any>('/optimizations');
  const PRIO: Record<number, string> = { 1: '⛔ sofort', 2: '▲ wichtig', 3: '▽ optional' };
  const ROUTE: Record<string, (id: string) => string> = {
    widersprueche: () => '/widersprueche', quellen: () => '/quellen', generator: () => '/generator', werkstatt: (id) => `/werkstatt/${id}`,
    freigabe: () => '/freigabe', optimierungen: () => '/optimierungen',
  };
  return (
    <Page title="Optimierungen" subtitle="Lücken, Terminologie, Lesbarkeit und Datenschutz – Hinweise zur redaktionellen Verbesserung">
      {o.data && (
        <>
          <div className="tiles">
            <div className="tile"><span className="tile-label">Kapitel</span><span className="tile-value">{o.data.totals.chapters}</span><span className="tile-sub">{o.data.totals.approved} freigegeben · {o.data.totals.inReview} eingereicht</span></div>
            <div className={`tile ${o.data.totals.blockers ? 'alert-tile' : ''}`}><span className="tile-label">Blocker</span><span className="tile-value">{o.data.totals.blockers}</span><span className="tile-sub">offen</span></div>
            <div className="tile"><span className="tile-label">Nachweisquote</span><span className="tile-value">{o.data.totals.evidenceCoverage ?? '–'}{o.data.totals.evidenceCoverage !== null && ' %'}</span><span className="tile-sub">Absätze mit Quelle oder Begründung</span></div>
          </div>
          <div className="grid2">
            <Card title={`Empfehlungen (${o.data.recommendations.length})`}>
              {!o.data.recommendations.length ? <Empty>Keine offenen Empfehlungen.</Empty> : (
                <ul className="finding-list">
                  {o.data.recommendations.slice(0, 15).map((r: any, i: number) => (
                    <li key={i}>
                      <span className={`tag ${r.priority === 1 ? 'sev-blocker' : r.priority === 2 ? 'sev-high' : ''}`}>{PRIO[r.priority]}</span> <strong>{r.chapter}:</strong> {r.text}{' '}
                      <Link to={ROUTE[r.target](r.chapterId)} className="small">öffnen →</Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card title="Bestätigte Textabschnitte je Kapitel (%)">
              <BarList label="Bestätigungsquote je Kapitel" rows={o.data.chapters.map((c: any) => ({ key: c.chapterId, label: c.title, value: c.confirmedPct, hint: `${c.title}: ${c.confirmedPct} % von ${c.snippets} Textabschnitten bestätigt` }))} />
            </Card>
          </div>
          <Card title="Kennzahlen je Kapitel">
            <table className="table compact">
              <thead><tr><th>Kapitel</th><th>Textabschnitte</th><th>bestätigt</th><th>Blocker</th><th>Lücken</th><th>Terminologie</th><th>Lesbarkeit</th><th>Version</th><th>Nachweis</th><th>veraltete Quellen</th></tr></thead>
              <tbody>
                {o.data.chapters.map((c: any) => (
                  <tr key={c.chapterId}>
                    <td>{c.title}</td><td>{c.snippets}</td><td>{c.confirmedPct} %</td><td>{c.blockers || '–'}</td>
                    <td>{c.findingsByType.gap ?? '–'}</td><td>{c.findingsByType.terminology ?? '–'}</td><td>{c.findingsByType.readability ?? '–'}</td>
                    <td>{c.latestVersion ? <>V{c.latestVersion.versionNo} <Status s={c.latestVersion.status} /></> : '–'}</td>
                    <td>{c.evidence ? <Link to={`/evidenz/${c.latestVersion.id}`}>{c.evidence.coverage} %</Link> : '–'}</td>
                    <td>{c.evidence?.outdatedSources || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
      <h2 className="section-title">Offene Optimierungshinweise</h2>
      <div className="filters">
        <select aria-label="Befundtyp" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Alle Optimierungstypen</option>
          {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </select>
      </div>
      <ErrorBox error={f.error} />
      <Card>
        {!rows.length ? <Empty>Keine offenen Optimierungshinweise.</Empty> : (
          <table className="table">
            <thead><tr><th>#</th><th>Typ</th><th>Schwere</th><th>Hinweis</th><th>Kapitel</th><th>Text</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td>#{x.seq}</td>
                  <td>{TYPE_LABEL[x.type]}</td>
                  <td><Severity s={x.severity} /></td>
                  <td>{x.reason}</td>
                  <td className="small">{x.chapterTitle ?? x.a?.chapter}</td>
                  <td className="preview small">{x.a?.text.slice(0, 120)}</td>
                  <td><Status s={x.status} /></td>
                  <td><button className="btn small" onClick={() => setSel(x)}>Details / entscheiden</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {sel && <CompareDialog finding={sel} onClose={() => setSel(null)} onDecided={() => (setSel(null), f.reload())} />}
    </Page>
  );
}
