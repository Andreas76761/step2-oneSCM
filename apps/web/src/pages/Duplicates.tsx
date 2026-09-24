import { useState } from 'react';
import { post } from '../api';
import { Card, Empty, ErrorBox, Page, Status, errorText, useApp, useLoad } from '../components/ui';
import { CanonicalDialog } from './Clusters';
import { CompareDialog } from './Contradictions';

const LEVELS = [
  { level: 1, title: 'Stufe 1 – identischer Hash', subtypes: ['exact_hash'] },
  { level: 2, title: 'Stufe 2 – semantisch nahezu gleich', subtypes: ['semantic'] },
  { level: 3, title: 'Stufe 3 – gleiches Fachkonzept in anderen Kapiteln', subtypes: ['cross_chapter'] },
];

export function DuplicatesPage() {
  const { notify } = useApp();
  const [openOnly, setOpenOnly] = useState(true);
  const findings = useLoad<any[]>(`/quality/findings?type=duplicate${openOnly ? '&status=open,deferred' : ''}`, [openOnly]);
  const topics = useLoad<any[]>('/canonical-topics');
  const [canonical, setCanonical] = useState<any | null>(null);
  const [compare, setCompare] = useState<any | null>(null);

  const byLevel = (l: (typeof LEVELS)[number]) =>
    (findings.data ?? []).filter((f) => (f.details?.level ?? 0) === l.level || (l.level === 1 && f.subtype === 'exact_hash'));

  return (
    <Page title="Dopplungen" subtitle="Gleiche Aussagen im gesamten Handbuch erkennen – exakte und semantische Dopplungen getrennt">
      <div className="filters">
        <label><input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} /> Nur offene</label>
      </div>
      <ErrorBox error={findings.error} />
      {LEVELS.map((l) => (
        <Card key={l.level} title={`${l.title} (${byLevel(l).length})`}>
          {!byLevel(l).length ? <Empty>Keine Treffer.</Empty> : (
            <table className="table">
              <thead><tr><th>#</th><th>Score</th><th>Text A</th><th>Text B</th><th>Kapitel</th><th>Status</th><th>Aktion</th></tr></thead>
              <tbody>
                {byLevel(l).map((f) => (
                  <tr key={f.id}>
                    <td>#{f.seq}</td>
                    <td>{Math.round((f.score ?? 0) * 100)} %<div className="small muted">{f.method}</div></td>
                    <td className="preview"><strong>#{f.a?.seq}</strong> {f.a?.text.slice(0, 120)}<div className="small muted">{f.a?.path}</div></td>
                    <td className="preview"><strong>#{f.b?.seq}</strong> {f.b?.text.slice(0, 120)}<div className="small muted">{f.b?.path}</div></td>
                    <td className="small">{f.a?.chapter}{f.a?.chapter !== f.b?.chapter && <><br />↔ {f.b?.chapter}</>}</td>
                    <td><Status s={f.status} /></td>
                    <td className="row-actions">
                      {f.status === 'open' && <button className="btn primary small" onClick={() => setCanonical(f)}>Canonical Topic</button>}
                      <button className="btn small" onClick={() => setCompare(f)}>Vergleichen / entscheiden</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      ))}
      <Card title="Canonical Topics">
        {!topics.data?.length ? <Empty>Noch keine Canonical Topics festgelegt.</Empty> : (
          <table className="table compact">
            <thead><tr><th>Titel</th><th>Führendes Kapitel</th><th>Textabschnitte</th><th>Begründung</th><th>Entschieden</th></tr></thead>
            <tbody>
              {topics.data.map((t) => (
                <tr key={t.id}><td>{t.title}</td><td>{t.leadChapter}</td><td>{t.snippetIds.length}</td><td>{t.reason}</td><td className="small">{t.decidedBy}, {new Date(t.decidedAt).toLocaleString('de-DE')}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {canonical && (
        <CanonicalDialog
          title={canonical.a.text.slice(0, 60)}
          chapters={[...new Map([[canonical.a.chapterId, canonical.a.chapter], [canonical.b.chapterId, canonical.b.chapter]]).entries()].filter(([id]) => id) as [string, string][]}
          onClose={() => setCanonical(null)}
          onSubmit={async (body) => {
            try {
              await post('/canonical-topics', { ...body, snippetIds: [canonical.a.id, canonical.b.id] });
              notify('Canonical Topic festgelegt.');
              setCanonical(null);
              findings.reload();
              topics.reload();
            } catch (e) {
              notify(errorText(e), 'error');
            }
          }}
        />
      )}
      {compare && <CompareDialog finding={compare} onClose={() => setCompare(null)} onDecided={() => (setCompare(null), findings.reload())} />}
    </Page>
  );
}
