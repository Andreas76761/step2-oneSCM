import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, Empty, ErrorBox, Md, Page, Status, useLoad } from '../components/ui';
import { SourceViewer } from './Sources';

/** Evidenz- und Quellenansicht (US-011): welcher Absatz beruht auf welcher Quelle? */
export function EvidencePage() {
  const { versionId } = useParams();
  const navigate = useNavigate();
  const chapters = useLoad<any[]>('/chapters');
  const withVersion = (chapters.data ?? []).filter((c) => c.versions.length);
  const effectiveId = versionId ?? withVersion[0]?.versions[0]?.id ?? null;
  const ev = useLoad<any>(effectiveId ? `/chapter-versions/${effectiveId}/evidence` : null, [effectiveId]);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [viewer, setViewer] = useState<any | null>(null);
  const d = ev.data;
  const rows = (d?.blocks ?? []).filter((b: any) => !onlyIssues || b.issues.length);

  return (
    <Page title="Evidenz" subtitle="Quellen je Absatz: Herkunft, Revision, Bestätigung und Lücken der Nachweise">
      <div className="filters">
        <select aria-label="Kapitelversion" value={effectiveId ?? ''} onChange={(e) => navigate(`/evidenz/${e.target.value}`)}>
          {withVersion.flatMap((c) => c.versions.map((v: any) => <option key={v.id} value={v.id}>{c.title} – Version {v.versionNo} ({v.status})</option>))}
        </select>
        <label><input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} /> nur Absätze mit Auffälligkeiten</label>
        {d && <Link to={`/werkstatt/${d.chapterId}`}>In der Kapitelwerkstatt öffnen →</Link>}
      </div>
      <ErrorBox error={ev.error} />
      {!effectiveId && <Empty>Noch keine generierte Kapitelversion.</Empty>}
      {d && (
        <>
          <div className="tiles">
            <div className="tile"><span className="tile-label">Nachweisquote</span><span className="tile-value">{d.summary.coverage} %</span><span className="tile-sub">{d.summary.blocks} Absätze</span></div>
            <div className="tile"><span className="tile-label">mit Quelle</span><span className="tile-value">{d.summary.withSources}</span><span className="tile-sub">{d.summary.justifiedOnly} nur begründet</span></div>
            <div className={`tile ${d.summary.withoutEvidence ? 'alert-tile' : ''}`}><span className="tile-label">ohne Nachweis</span><span className="tile-value">{d.summary.withoutEvidence}</span><span className="tile-sub">blockiert die Freigabe</span></div>
            <div className="tile"><span className="tile-label">veraltete Quellen</span><span className="tile-value">{d.summary.outdatedSources}</span><span className="tile-sub">neu generieren</span></div>
            <div className="tile"><span className="tile-label">unbestätigt</span><span className="tile-value">{d.summary.unconfirmedSources}</span><span className="tile-sub">Quelle oder Zuordnung</span></div>
          </div>
          <Card title={`${d.title} – Version ${d.versionNo}`} actions={<Status s={d.status} />}>
            {!rows.length ? <Empty>Keine Absätze für diesen Filter.</Empty> : (
              <table className="table">
                <thead><tr><th>Abschnitt</th><th>Absatz</th><th>Quellen</th><th>Auffälligkeiten</th></tr></thead>
                <tbody>
                  {rows.map((b: any) => (
                    <tr key={b.blockId}>
                      <td className="small">{b.sectionTitle}<br /><Status s={b.mode} /></td>
                      <td className="preview"><Md text={b.text.length > 300 ? `${b.text.slice(0, 300)} …` : b.text} />{b.justification && <div className="small muted">Begründung: {b.justification}</div>}</td>
                      <td className="small">
                        {b.sources.map((s: any) => (
                          <div key={s.snippetId} className="source-item">
                            <strong>#{s.seq}</strong> {s.path} · Rev. {s.revisionNo}{!s.isCurrent && <span className="tag sev-high">veraltet</span>} · Z. {s.lineStart}–{s.lineEnd} · <Status s={s.evidenceStatus} />
                            {s.excludedReason && <div className="tag sev-high" title={s.excludedReason}>ausgeschlossen</div>}
                            <div><button className="btn link small" onClick={() => setViewer(s)}>Quelle öffnen</button></div>
                          </div>
                        ))}
                        {!b.sources.length && '–'}
                      </td>
                      <td className="small">
                        {b.issues.length ? b.issues.map((i: string) => <div key={i} className={i === 'no_evidence' ? 'fail' : ''}>⚠ {d.issueLabels[i]}</div>) : <span className="ok">✔ belegt</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
      {viewer && <SourceViewer revisionId={viewer.revisionId} lineStart={viewer.lineStart} lineEnd={viewer.lineEnd} onClose={() => setViewer(null)} />}
    </Page>
  );
}
