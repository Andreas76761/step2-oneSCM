import { Card, DownloadButton, ErrorBox, Page, useLoad } from '../components/ui';

export function TraceabilityPage() {
  const m = useLoad<any>('/traceability');
  return (
    <Page
      title="Traceability"
      subtitle="Anforderung ↔ API-Operation ↔ Test ↔ Dokumentation ↔ Release"
      actions={
        <>
          <DownloadButton href="/api/v1/traceability?format=xlsx" name="traceability.xlsx">⬇ Excel</DownloadButton>
          <DownloadButton href="/api/v1/traceability?format=csv" name="traceability.csv">⬇ CSV</DownloadButton>
          <DownloadButton href="/api/v1/traceability?format=md" name="traceability.md">⬇ Markdown</DownloadButton>
        </>
      }
    >
      <ErrorBox error={m.error} />
      {m.data && (
        <>
          <Card title={`Prüfergebnis · Release ${m.data.release}`}>
            {m.data.issues.length ? <ul>{m.data.issues.map((i: string) => <li key={i} className="fail">⚠ {i}</li>)}</ul> : <p className="ok">✔ Jede P0-Story hat mindestens einen Test und eine API-Operation; jede Operation referenziert eine Story.</p>}
          </Card>
          <Card title="Matrix">
            {/* breite Tabelle: scrollbarer Bereich per Tastatur erreichbar (WCAG 2.1.1) */}
            <div className="table-wrap" tabIndex={0} role="region" aria-label="Traceability-Matrix">
            <table className="table">
              <thead><tr><th>Story</th><th>Titel</th><th>Prio</th><th>ID</th><th>API-Operationen</th><th>Tests</th><th>Dokumentation</th><th>Status</th></tr></thead>
              <tbody>
                {m.data.rows.map((r: any) => (
                  <tr key={r.requirement}>
                    <td><strong>{r.requirement}</strong></td>
                    <td>{r.title}</td>
                    <td>{r.priority}</td>
                    <td className="small">{r.idStatus === 'decided' ? 'entschieden (E-14)' : 'Masterprompt'}</td>
                    <td className="small mono">{r.apiOperations.map((o: string) => <div key={o}>{o}</div>)}</td>
                    <td className="small">{r.tests.join(', ')}</td>
                    <td className="small">{r.documentation.map((d: string) => <div key={d}>{d}</div>)}</td>
                    <td><span className={`tag ${r.status === 'covered' ? 'st-approved' : 'sev-high'}`}>{r.status === 'covered' ? 'abgedeckt' : r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Card>
          <Card title={`Tests (${m.data.tests.length})`}>
            <table className="table compact">
              <thead><tr><th>ID</th><th>Titel</th><th>Ebene</th><th>Stories</th><th>Datei</th></tr></thead>
              <tbody>{m.data.tests.map((t: any) => <tr key={t.id}><td>{t.id}</td><td>{t.title}</td><td>{t.level}</td><td>{t.requirements.join(', ')}</td><td className="small mono">{t.file}</td></tr>)}</tbody>
            </table>
          </Card>
        </>
      )}
    </Page>
  );
}
