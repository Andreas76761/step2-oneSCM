// Kapitelwerkstatt: Freigabe einer Kapitelversion mit Qualitätsgate (auch auf der Seite „Freigabe“).
import { OkMark } from '../components/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../api';
import { Gated, Status, errorText, useApp, useLoad } from '../components/ui';
import { formatDate, formatDateTime } from '../format';

export function ApprovalPanel({ version, onApproved }: { version: any; onApproved: () => void }) {
  const { notify } = useApp();
  const gate = useLoad<any>(`/chapter-versions/${version.id}/gate`, [version.id, version.status, JSON.stringify(version.sections.map((s: any) => s.blocks.map((b: any) => b.versionNo)))]);
  const [comment, setComment] = useState('');
  const act = async (path: string, body: unknown, msg: string) => {
    try {
      await post(`/chapter-versions/${version.id}/${path}`, body);
      notify(msg);
      setComment('');
      onApproved();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div>
      <p className="small">Status: <Status s={version.status} />{version.submittedBy && version.status === 'in_review' && <> · eingereicht von {version.submittedBy} am {formatDateTime(version.submittedAt)}{version.submitComment && <> – „{version.submitComment}“</>}</>}</p>
      <h3>Qualitätsgate {gate.data && (gate.data.passed ? <span className="tag st-approved">bestanden</span> : <span className="tag sev-blocker">nicht bestanden</span>)}</h3>
      <ul className="gate">
        {gate.data?.checks.map((c: any) => (
          <li key={c.code} className={c.passed ? 'ok' : 'fail'}>
            <OkMark ok={c.passed} /> {c.label}
            {!c.passed && <ul className="small">{c.details.slice(0, 6).map((d: string, i: number) => <li key={i}>{d}</li>)}{c.details.length > 6 && <li>… {c.details.length - 6} weitere</li>}</ul>}
          </li>
        ))}
      </ul>
      <Link className="small" to={`/evidenz/${version.id}`}>Evidenz je Absatz ansehen →</Link>
      {version.status === 'draft' && (
        <>
          <h3>Zur Freigabe einreichen</h3>
          <p className="small muted">Nach dem Einreichen ist die Version bis zur Entscheidung gesperrt (Freigabestufen des Projekts siehe Seite „Freigabe“).</p>
          <label className="block">Hinweis an die Freigabe (optional) <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} /></label>
          <Gated className="btn primary" busy={!gate.data} missing={[gate.data && !gate.data.passed && 'alle Prüfkriterien der Freigabe erfüllt (siehe oben)']} onClick={() => act('submit', { comment }, 'Zur Freigabe eingereicht.')}>Zur Freigabe einreichen</Gated>
        </>
      )}
      {version.workflow && (
        <>
          <h3>Freigabestufen{version.workflow.fourEyes && <span className="tag">Vier-Augen-Prinzip</span>}</h3>
          <ol className="stages">
            {version.workflow.stages.map((st: any) => (
              <li key={st.key} className={`stage-${st.status}`} aria-current={st.status === 'active' ? 'step' : undefined}>
                <strong>{st.name}</strong> – {st.status === 'done' ? 'abgeschlossen' : st.status === 'active' ? 'aktuell' : 'ausstehend'}
                {' '}· {st.votes.length}/{st.minApprovals} Zustimmung(en){st.approvers.length ? ` · zuständig: ${st.approvers.join(', ')}` : ''}
                {st.votes.length > 0 && <span className="small"> ({st.votes.map((x: any) => x.approver).join(', ')})</span>}
                {st.status === 'active' && version.workflow.dueAt && (
                  <span className={version.workflow.overdue ? 'tag sev-blocker' : 'small'}> Frist {formatDate(version.workflow.dueAt)}{version.workflow.overdue ? ' – überfällig' : ''}</span>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
      {version.status === 'in_review' && (
        <>
          <h3>Fachliche Entscheidung</h3>
          <label className="block">Kommentar (Pflicht) <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} /></label>
          <div className="row-actions">
            <Gated className="btn primary" busy={!gate.data} missing={[gate.data && !gate.data.passed && 'alle Prüfkriterien erfüllt', !comment.trim() && 'Kommentar']} onClick={() => act('approve', { comment, decision: 'approved' }, version.workflow?.stages.length > 1 ? 'Zustimmung gespeichert.' : 'Kapitelversion freigegeben.')}>{version.workflow?.stages.length > 1 ? `Zustimmen (${version.workflow.stages[version.workflow.currentStage]?.name})` : 'Freigeben'}</Gated>
            {/* braucht ebenfalls einen Kommentar; den Hinweis zeigt die Schaltfläche daneben */}
            <button className="btn" disabled={!comment.trim()} onClick={() => act('approve', { comment, decision: 'rejected' }, 'Abgelehnt – Version ist wieder ein bearbeitbarer Entwurf.')}>Ablehnen</button>
            <button className="btn ghost" onClick={() => act('withdraw', { reason: comment }, 'Einreichung zurückgezogen.')}>Einreichung zurückziehen</button>
          </div>
        </>
      )}
      <h3>Freigabeprotokoll</h3>
      {!version.approvals.length ? <p className="small muted">Noch keine Entscheidung.</p> : (
        <ul className="small">
          {version.approvals.map((a: any) => <li key={a.id}><Status s={a.decision} /> {a.approver}{a.stage && a.stage !== 'freigabe' ? ` (${a.stage})` : ''} · {formatDateTime(a.createdAt)} — {a.comment}</li>)}
        </ul>
      )}
    </div>
  );
}
