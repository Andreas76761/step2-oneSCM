import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../api';
import { Badge, BarList, Card, ErrorBox, Page, Status, TYPE_LABEL, errorText, useApp, useLoad } from '../components/ui';

/**
 * Verlauf des durchschnittlichen Stilwerts (ADR-048): eine Linie (2px) mit Endpunkt-Beschriftung, Achse 0–100,
 * Fadenkreuz mit Tooltip beim Überfahren; die Tabelle darunter enthält alle Werte (auch ohne Maus).
 */
function StyleTrend({ points }: { points: { day: string; average: number | null }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const pts = points.filter((p) => p.average !== null) as { day: string; average: number }[];
  if (pts.length < 2) return <p className="small muted">Der Verlauf erscheint, sobald Stilwerte an mindestens zwei Tagen erfasst sind (bei jedem Aufruf des Dashboards und nach Korrekturen).</p>;
  const W = 640;
  const H = 180;
  const pad = { l: 34, r: 44, t: 12, b: 24 };
  const t0 = Date.parse(pts[0].day);
  const t1 = Date.parse(pts.at(-1)!.day);
  const x = (d: string) => pad.l + ((Date.parse(d) - t0) / Math.max(1, t1 - t0)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.day).toFixed(1)},${y(p.average).toFixed(1)}`).join(' ');
  const fmt = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach((p, i) => { if (Math.abs(x(p.day) - px) < Math.abs(x(pts[best].day) - px)) best = i; });
    setHover(best);
  };
  const last = pts.at(-1)!;
  const h = hover !== null ? pts[hover] : null;
  return (
    <div className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Stilwert von ${pts[0].average} am ${fmt(pts[0].day)} auf ${last.average} am ${fmt(last.day)}`}
        onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="trend-grid" />
            <text x={pad.l - 6} y={y(v)} className="trend-axis" textAnchor="end" dominantBaseline="middle">{v}</text>
          </g>
        ))}
        <text x={pad.l} y={H - 6} className="trend-axis">{fmt(pts[0].day)}</text>
        <text x={W - pad.r} y={H - 6} className="trend-axis" textAnchor="end">{fmt(last.day)}</text>
        <path d={line} className="trend-line" />
        <circle cx={x(last.day)} cy={y(last.average)} r={4} className="trend-dot" />
        <text x={x(last.day) + 8} y={y(last.average)} className="trend-label" dominantBaseline="middle">{last.average}</text>
        {h && (
          <g>
            <line x1={x(h.day)} x2={x(h.day)} y1={pad.t} y2={H - pad.b} className="trend-cross" />
            <circle cx={x(h.day)} cy={y(h.average)} r={4} className="trend-dot" />
          </g>
        )}
      </svg>
      {h && <div className="trend-tip" role="status" style={{ left: `${(x(h.day) / W) * 100}%` }}><strong>{h.average}</strong> <span>{new Date(h.day).toLocaleDateString('de-DE')}</span></div>}
      <details>
        <summary className="small">Werte als Tabelle</summary>
        <table className="table compact">
          <thead><tr><th>Tag</th><th>Stilwert (Durchschnitt)</th></tr></thead>
          <tbody>{pts.map((p) => <tr key={p.day}><td>{new Date(p.day).toLocaleDateString('de-DE')}</td><td>{p.average}</td></tr>)}</tbody>
        </table>
      </details>
    </div>
  );
}

export function DashboardPage() {
  const { ref, notify } = useApp();
  const dash = useLoad<any>('/dashboard');
  const chapters = useLoad<any[]>('/chapters');
  const style = useLoad<any>('/style/chapters');
  // Verlauf erst nach der Übersicht laden: die Übersicht schreibt den aktuellen Messpunkt fort
  const history = useLoad<any>(style.data ? '/style/history?days=90' : null, [!!style.data]);
  const change = (id: string) => history.data?.chapters.find((c: any) => c.chapterId === id)?.change ?? 0;
  const d = dash.data;

  const count = (type?: string, severity?: string) =>
    (d?.openFindings ?? []).filter((f: any) => (!type || f.type === type) && (!severity || f.severity === severity)).reduce((s: number, f: any) => s + f.n, 0);

  const runAnalysis = async () => {
    try {
      await post('/quality/analysis');
      notify('Analyse gestartet – Ergebnisse erscheinen in wenigen Sekunden.');
      setTimeout(() => (dash.reload(), chapters.reload()), 1500);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  const tiles = [
    { label: 'Textabschnitte', value: d?.snippets ?? 0, sub: `${d?.confirmedSnippets ?? 0} bestätigt` },
    { label: 'Lücken', value: count('gap'), sub: 'offen' },
    { label: 'Dopplungen', value: count('duplicate'), sub: 'offen' },
    { label: 'Widersprüche', value: count('contradiction'), sub: 'offen' },
    { label: 'Blocker', value: count(undefined, 'blocker'), sub: 'sperren Generierung/Freigabe/Export', alert: true },
  ];

  return (
    <Page title="Dashboard" subtitle="Überblick über Quellen, Qualitätsbefunde und Kapitelstatus" actions={<button className="btn primary" onClick={runAnalysis}>Analyse starten</button>}>
      <ErrorBox error={dash.error} />
      <div className="tiles">
        {tiles.map((t) => (
          <div className={`tile ${t.alert && t.value ? 'alert-tile' : ''}`} key={t.label}>
            <span className="tile-label">{t.label}</span>
            <span className="tile-value">{t.value}</span>
            <span className="tile-sub">{t.sub}</span>
          </div>
        ))}
      </div>
      <div className="grid3">
        <Card title="Offene Befunde nach Typ">
          <BarList
            label="Offene Befunde nach Typ"
            rows={(ref?.findingTypes ?? []).map((t) => ({ key: t, label: TYPE_LABEL[t] ?? t, value: count(t), hint: `${TYPE_LABEL[t]}: ${count(t)} offen, davon ${count(t, 'blocker')} Blocker` }))}
          />
        </Card>
        <Card title="Rollenabdeckung (Textabschnitte)">
          <BarList label="Rollenabdeckung" rows={(ref?.roles ?? []).map((r) => ({ key: r.code, label: <Badge item={r} />, value: d?.roleCoverage.find((x: any) => x.code === r.code)?.n ?? 0 }))} />
        </Card>
        <Card title="Spartenabdeckung (Textabschnitte)">
          <BarList label="Spartenabdeckung" rows={(ref?.divisions ?? []).map((r) => ({ key: r.code, label: <Badge item={r} />, value: d?.divisionCoverage.find((x: any) => x.code === r.code)?.n ?? 0 }))} />
        </Card>
      </div>
      {style.data?.chapters.length > 0 && (
        <Card title="Schreibstil je Kapitel" actions={<Link className="small" to="/schreibstil">Schreibstil →</Link>}>
          <p className="small">Durchschnittlicher Stilwert: <strong>{style.data.average ?? '–'}/100</strong> · Verlauf der letzten 90 Tage · niedrigste Werte zuerst</p>
          {history.data && <StyleTrend points={history.data.project} />}
          <table className="table compact">
            <thead><tr><th>Kapitel</th><th>Stilwert</th><th>Veränderung (90 Tage)</th><th>Sätze mit Problemen</th><th>automatisch korrigierbar</th><th>Version</th><th /></tr></thead>
            <tbody>
              {style.data.chapters.slice(0, 8).map((c: any) => (
                <tr key={c.chapterId}>
                  <td>{c.title}{c.variant && <span className="small muted"> (Variante)</span>}</td>
                  <td><span className={`tag ${c.score >= 80 ? 'st-approved' : c.score >= 50 ? 'st-in_review' : 'st-failed'}`}>{c.score}</span></td>
                  <td>{change(c.chapterId) > 0 ? `▲ +${change(c.chapterId)} besser` : change(c.chapterId) < 0 ? `▼ ${change(c.chapterId)} schlechter` : '–'}</td>
                  <td>{c.problemSentences}</td>
                  <td>{c.fixable}</td>
                  <td>V{c.versionNo} <Status s={c.status} /></td>
                  <td><Link to={`/werkstatt/${c.chapterId}`} aria-label={`${c.title} in der Werkstatt öffnen`}>Werkstatt →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {d?.translations?.length > 0 && (
        <Card title="Übersetzungsstand" actions={<Link className="small" to="/uebersetzungen">Übersetzungen →</Link>}>
          <table className="table compact">
            <thead><tr><th>Sprache</th><th>freigegeben</th><th>in Arbeit</th><th>fehlt</th><th>veraltet</th><th>von Kapiteln</th></tr></thead>
            <tbody>
              {d.translations.map((t: any) => (
                <tr key={t.language}>
                  <td>{t.languageName}</td><td>{t.approved}</td><td>{t.draft}</td><td>{t.missing}</td><td>{t.outdated}</td><td>{t.chapters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <Card title="Kapitelstatus">
        <table className="table">
          <thead>
            <tr><th>Kapitel</th><th>Textabschnitte</th><th>bestätigt</th><th>offene Befunde</th><th>Blocker</th><th>letzte Version</th><th /></tr>
          </thead>
          <tbody>
            {(chapters.data ?? []).map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.snippetCount}</td>
                <td>{c.confirmedSnippetCount}</td>
                <td>{c.openFindings}</td>
                <td>{c.openBlockers ? <span className="tag sev-blocker">⛔ {c.openBlockers}</span> : '–'}</td>
                <td>{c.versions[0] ? <>V{c.versions[0].versionNo} <Status s={c.versions[0].status} /></> : '–'}</td>
                <td><Link to={`/werkstatt/${c.id}`}>Werkstatt →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {d?.lastAnalysis && <p className="muted small">Letzte Analyse: {new Date(d.lastAnalysis.startedAt).toLocaleString('de-DE')} ({d.lastAnalysis.status})</p>}
      </Card>
    </Page>
  );
}
