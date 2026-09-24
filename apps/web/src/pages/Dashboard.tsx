import { Link } from 'react-router-dom';
import { post } from '../api';
import { Badge, BarList, Card, ErrorBox, Page, Status, TYPE_LABEL, errorText, useApp, useLoad } from '../components/ui';

export function DashboardPage() {
  const { ref, notify } = useApp();
  const dash = useLoad<any>('/dashboard');
  const chapters = useLoad<any[]>('/chapters');
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
