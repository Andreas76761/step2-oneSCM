import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Decision, Empty, Page, Status, useLoad, activatable } from '../components/ui';
import { ApprovalPanel } from './Workshop';

const ORDER: Record<string, number> = { in_review: 0, draft: 1, approved: 2, superseded: 3 };

export function ApprovalPage() {
  const chapters = useLoad<any[]>('/chapters');
  const withVersion = (chapters.data ?? []).filter((c) => c.versions[0]).sort((a, b) => (ORDER[a.versions[0].status] ?? 9) - (ORDER[b.versions[0].status] ?? 9));
  const [sel, setSel] = useState<string | null>(null);
  const current = withVersion.find((c) => c.id === sel) ?? withVersion[0];
  const version = useLoad<any>(current ? `/chapter-versions/${current.versions[0].id}` : null, [current?.versions[0]?.id, current?.versions[0]?.status]);
  const waiting = withVersion.filter((c) => c.versions[0].status === 'in_review').length;
  return (
    <Page title="Freigabe" subtitle={`Freigabeworkflow: Entwurf → eingereicht → freigegeben oder abgelehnt · ${waiting} Version(en) warten auf Entscheidung`}>
      <Decision id="E-12">Einstufige Freigabe ohne Ausnahmen. Einreichen und Freigeben setzen ein bestandenes Qualitätsgate voraus; eine eingereichte Version ist bis zur Entscheidung gesperrt.</Decision>
      <div className="grid2">
        <Card title="Kapitelversionen">
          {!withVersion.length ? <Empty>Noch keine generierten Kapitel.</Empty> : (
            <table className="table compact">
              <thead><tr><th>Kapitel</th><th>Version</th><th>Status</th><th>Blocker</th><th /></tr></thead>
              <tbody>
                {withVersion.map((c) => (
                  <tr key={c.id} className={`clickable ${current?.id === c.id ? 'selected' : ''}`} {...activatable(() => setSel(c.id))} aria-current={current?.id === c.id ? 'true' : undefined}>
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
