// Analytik und Berichte (ADR-023): Kennzahlen-Zeitreihen, Aktivität, Freigabedauer, Projektbericht, BI-Export
import { useState } from 'react';
import { download } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const SERIES = [
  { key: 'openFindings', label: 'Offene Befunde', color: '#c2410c' },
  { key: 'openBlockers', label: 'Offene Blocker', color: '#b91c1c' },
  { key: 'approvedChapters', label: 'Freigegebene Kapitel', color: '#15803d' },
] as const;
const PERCENT = [
  { key: 'evidenceCoverage', label: 'Nachweisabdeckung', color: '#1d4ed8' },
  { key: 'confirmedShare', label: 'Bestätigte Textabschnitte', color: '#7c3aed' },
] as const;
const DATASETS = [
  { key: 'kpis', label: 'Kennzahlen je Tag' },
  { key: 'flow', label: 'Aktivität je Tag' },
  { key: 'approvals', label: 'Freigabeentscheidungen' },
  { key: 'chapters', label: 'Kapitelstatus' },
  { key: 'findings', label: 'Befunde' },
];
const RANGES = [{ days: 30, label: '30 Tage' }, { days: 90, label: '90 Tage' }, { days: 365, label: '12 Monate' }];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const hours = (h: number | null) => (h === null ? '–' : h < 48 ? `${h.toLocaleString('de-DE')} h` : `${(Math.round((h / 24) * 10) / 10).toLocaleString('de-DE')} Tage`);

/** Einfaches Liniendiagramm (SVG) mit Tabellen-Alternative für Screenreader */
function LineChart({ title, rows, lines, max }: { title: string; rows: any[]; lines: readonly { key: string; label: string; color: string }[]; max?: number }) {
  if (!rows.length) return <Empty>Noch keine Kennzahlen im Zeitraum.</Empty>;
  const W = 640;
  const H = 180;
  const top = max ?? Math.max(1, ...rows.flatMap((r) => lines.map((l) => Number(r[l.key]) || 0)));
  const x = (i: number) => (rows.length === 1 ? W / 2 : (i / (rows.length - 1)) * (W - 40) + 30);
  const y = (v: number) => H - 20 - (v / top) * (H - 40);
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${lines.map((l) => `${l.label} aktuell ${rows.at(-1)[l.key]}`).join(', ')}`}>
        <line x1={30} x2={W - 10} y1={H - 20} y2={H - 20} stroke="currentColor" opacity={0.3} />
        <text x={0} y={y(top) + 4} fontSize={10} fill="currentColor">{top}</text>
        <text x={0} y={H - 16} fontSize={10} fill="currentColor">0</text>
        <text x={30} y={H - 4} fontSize={10} fill="currentColor">{new Date(rows[0].day).toLocaleDateString('de-DE')}</text>
        <text x={W - 10} y={H - 4} fontSize={10} fill="currentColor" textAnchor="end">{new Date(rows.at(-1).day).toLocaleDateString('de-DE')}</text>
        {lines.map((l) => (
          <polyline key={l.key} fill="none" stroke={l.color} strokeWidth={2} points={rows.map((r, i) => `${x(i)},${y(Number(r[l.key]) || 0)}`).join(' ')} />
        ))}
      </svg>
      <figcaption className="legend">
        {lines.map((l) => <span key={l.key}><i style={{ background: l.color }} aria-hidden="true" /> {l.label}: <strong>{rows.at(-1)[l.key]}</strong></span>)}
      </figcaption>
    </figure>
  );
}

export function AnalyticsPage() {
  const { notify } = useApp();
  const [days, setDays] = useState(90);
  const from = iso(new Date(Date.now() - (days - 1) * 86_400_000));
  const a = useLoad<any>(`/analytics?from=${from}`, [days]);
  const d = a.data;
  const sum = (k: string) => (d?.flow ?? []).reduce((n: number, r: any) => n + r[k], 0);

  const get = async (path: string, name: string) => {
    try {
      await download(`/api/v1${path}`, name);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page
      title="Analytik"
      subtitle="Kennzahlen im Zeitverlauf, Freigabeprozess, Projektbericht und Export für BI-Werkzeuge"
      actions={(
        <>
          <label className="inline">Zeitraum{' '}
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {RANGES.map((r) => <option key={r.days} value={r.days}>{r.label}</option>)}
            </select>
          </label>
          <button className="btn primary" onClick={() => void get(`/analytics/report?from=${from}`, 'projektbericht.pdf')}>Projektbericht (PDF)</button>
        </>
      )}
    >
      <ErrorBox error={a.error} />
      {d && (
        <>
          <div className="tiles">
            {[
              { label: 'Freigegebene Kapitel', value: `${d.current.approvedChapters}/${d.current.chapters}`, sub: `${d.current.inReview} in Prüfung` },
              { label: 'Offene Befunde', value: d.current.openFindings, sub: `${d.current.openBlockers} Blocker`, alert: d.current.openBlockers > 0 },
              { label: 'Nachweisabdeckung', value: `${d.current.evidenceCoverage.toLocaleString('de-DE')} %`, sub: 'Absätze mit Quelle/Begründung' },
              { label: 'Prüfdauer (Median)', value: hours(d.approvals.reviewHours.median), sub: `P90 ${hours(d.approvals.reviewHours.p90)}` },
              { label: 'Erstfreigabequote', value: `${d.approvals.firstPassRate.toLocaleString('de-DE')} %`, sub: `${d.approvals.decisions} Entscheidungen` },
            ].map((t) => (
              <div className={`tile ${t.alert ? 'alert-tile' : ''}`} key={t.label}>
                <span className="tile-label">{t.label}</span>
                <span className="tile-value">{t.value}</span>
                <span className="tile-sub">{t.sub}</span>
              </div>
            ))}
          </div>
          <div className="grid2">
            <Card title="Befunde und Freigaben"><LineChart title="Befunde und Freigaben" rows={d.series} lines={SERIES} /></Card>
            <Card title="Qualität (%)"><LineChart title="Qualität in Prozent" rows={d.series} lines={PERCENT} max={100} /></Card>
          </div>
          <div className="grid2">
            <Card title="Aktivität im Zeitraum">
              <table className="table compact">
                <tbody>
                  <tr><th scope="row">Befunde neu / erledigt</th><td>{sum('findingsOpened')} / {sum('findingsResolved')}</td></tr>
                  <tr><th scope="row">Freigaben / Ablehnungen</th><td>{sum('approvals')} / {sum('rejections')}</td></tr>
                  <tr><th scope="row">Importe</th><td>{sum('imports')}</td></tr>
                  <tr><th scope="row">Veröffentlichungen</th><td>{sum('releases')}</td></tr>
                  <tr><th scope="row">Durchlaufzeit Generierung → Freigabe (Median)</th><td>{hours(d.approvals.leadHours.median)}</td></tr>
                </tbody>
              </table>
            </Card>
            <Card title="Export für BI-Werkzeuge">
              <p className="small">Stabile Spaltennamen, CSV (UTF-8 mit BOM) oder JSON; auch direkt abrufbar unter <code>/api/v1/analytics/export/&lt;datensatz&gt;</code>.</p>
              <table className="table compact">
                <tbody>
                  {DATASETS.map((ds) => (
                    <tr key={ds.key}>
                      <td>{ds.label}</td>
                      <td>
                        <div className="actions">
                          <button className="btn small" aria-label={`${ds.label} als CSV`} onClick={() => void get(`/analytics/export/${ds.key}?from=${from}`, `${ds.key}.csv`)}>CSV</button>
                          <button className="btn small ghost" aria-label={`${ds.label} als JSON`} onClick={() => void get(`/analytics/export/${ds.key}?format=json&from=${from}`, `${ds.key}.json`)}>JSON</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      )}
    </Page>
  );
}
