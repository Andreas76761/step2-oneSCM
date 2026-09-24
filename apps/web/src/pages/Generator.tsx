import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../api';
import { Assumption, Card, ErrorBox, Page, Status, errorText, useApp, useLoad } from '../components/ui';

export function GeneratorPage() {
  const { notify, ref } = useApp();
  const chapters = useLoad<any[]>('/chapters');
  const [result, setResult] = useState<Record<string, { ok: boolean; text: string }>>({});
  const navigate = useNavigate();

  const generate = async (c: any) => {
    try {
      const v = await post<any>(`/chapters/${c.id}/generate`);
      const gaps = v.generation.gaps.map((g: string) => ref?.sections.find((s) => s.code === g)?.title ?? g);
      setResult((r) => ({ ...r, [c.id]: { ok: true, text: `Version ${v.versionNo} erzeugt: ${v.generation.usedSnippets} Quellen übernommen, ${v.generation.skippedUnconfirmed} unbestätigte übersprungen, ${v.generation.deduplicated} Dopplungen zusammengeführt. Lücken: ${gaps.join(', ') || 'keine'}.` } }));
      notify(`Kapitel „${c.title}“ generiert (Version ${v.versionNo}).`);
      chapters.reload();
    } catch (e) {
      setResult((r) => ({ ...r, [c.id]: { ok: false, text: errorText(e) } }));
    }
  };

  return (
    <Page title="Kapitelgenerator" subtitle="Professionelle Kapitelentwürfe ausschließlich aus bestätigten Quellen erzeugen">
      <Assumption id="E-09">Der Generator ist extraktiv (ADR-007): Er übernimmt bestätigte Quelltexte, ordnet sie der Standardstruktur zu, führt exakte Dopplungen zusammen und setzt Querverweise für Canonical Topics. Es werden keine Inhalte erfunden; Abschnitte ohne Quelle werden als Lücke markiert.</Assumption>
      <Card>
        <ErrorBox error={chapters.error} />
        <table className="table">
          <thead><tr><th>Kapitel</th><th>Textabschnitte</th><th>bestätigt</th><th>offene Befunde</th><th>Blocker</th><th>Versionen</th><th>Aktion</th></tr></thead>
          <tbody>
            {chapters.data?.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.title}</strong>
                  {result[c.id] && <div className={`alert ${result[c.id].ok ? 'ok' : 'error'} small`}>{result[c.id].text}</div>}
                </td>
                <td>{c.snippetCount}</td>
                <td>{c.confirmedSnippetCount}</td>
                <td>{c.openFindings}</td>
                <td>{c.openBlockers ? <span className="tag sev-blocker">⛔ {c.openBlockers}</span> : '–'}</td>
                <td className="small">{c.versions.slice(0, 3).map((v: any) => <div key={v.id}>V{v.versionNo} <Status s={v.status} /></div>)}</td>
                <td className="row-actions">
                  <button className="btn primary small" onClick={() => generate(c)} disabled={!c.confirmedSnippetCount}>Generieren</button>
                  {c.versions.length > 0 && <button className="btn small" onClick={() => navigate(`/werkstatt/${c.id}`)}>Werkstatt</button>}
                  {c.openBlockers > 0 && <Link className="small" to="/widersprueche">Blocker klären →</Link>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
