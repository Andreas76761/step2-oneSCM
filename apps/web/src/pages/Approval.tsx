import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Page, Status, useLoad } from '../components/ui';
import { ApprovalPanel } from './Workshop';

export function ApprovalPage() {
  const chapters = useLoad<any[]>('/chapters');
  const drafts = (chapters.data ?? []).filter((c) => c.versions[0]);
  const [sel, setSel] = useState<string | null>(null);
  const current = drafts.find((c) => c.id === sel) ?? drafts[0];
  const version = useLoad<any>(current ? `/chapter-versions/${current.versions[0].id}` : null, [current?.versions[0]?.id]);
  return (
    <Page title="Freigabe" subtitle="Nur Kapitel mit bestandenem Qualitätsgate können fachlich freigegeben werden">
      <div className="grid2">
        <Card title="Kapitelversionen">
          {!drafts.length ? <Empty>Noch keine generierten Kapitel.</Empty> : (
            <table className="table compact">
              <thead><tr><th>Kapitel</th><th>Version</th><th>Status</th><th>Blocker</th><th /></tr></thead>
              <tbody>
                {drafts.map((c) => (
                  <tr key={c.id} className={`clickable ${current?.id === c.id ? 'selected' : ''}`} onClick={() => setSel(c.id)}>
                    <td>{c.title}</td>
                    <td>V{c.versions[0].versionNo}</td>
                    <td><Status s={c.versions[0].status} /></td>
                    <td>{c.openBlockers || '–'}</td>
                    <td><Link to={`/werkstatt/${c.id}`} onClick={(e) => e.stopPropagation()}>Werkstatt</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <Card title={current ? `${current.title} – Version ${current.versions[0].versionNo}` : 'Freigabe'}>
          {version.data ? <ApprovalPanel version={version.data} onApproved={() => (version.reload(), chapters.reload())} /> : <Empty>Kapitel auswählen.</Empty>}
        </Card>
      </div>
    </Page>
  );
}
