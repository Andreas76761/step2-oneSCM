import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { put } from '../api';
import { GuidanceSummaryLine } from './Guidance';
import { Card, Decision, Empty, ErrorBox, Page, Status, errorText, useApp, useLoad, activatable } from '../components/ui';
import { ApprovalPanel } from './Workshop';

const ORDER: Record<string, number> = { in_review: 0, draft: 1, approved: 2, superseded: 3 };

export function ApprovalPage() {
  const chapters = useLoad<any[]>('/chapters?outline=all');
  const withVersion = (chapters.data ?? []).filter((c) => c.versions[0]).sort((a, b) => (ORDER[a.versions[0].status] ?? 9) - (ORDER[b.versions[0].status] ?? 9));
  const [sel, setSel] = useState<string | null>(null);
  const current = withVersion.find((c) => c.id === sel) ?? withVersion[0];
  const version = useLoad<any>(current ? `/chapter-versions/${current.versions[0].id}` : null, [current?.versions[0]?.id, current?.versions[0]?.status]);
  const waiting = withVersion.filter((c) => c.versions[0].status === 'in_review').length;
  const pending = useLoad<any[]>('/approvals/pending', [current?.versions[0]?.status]);
  const me = useLoad<any>('/me');
  return (
    <Page title="Freigabe" subtitle={`Freigabeworkflow: Entwurf → eingereicht → Freigabestufen → freigegeben oder abgelehnt · ${waiting} Version(en) warten auf Entscheidung`}>
      <Decision id="E-12">Standard ist die einstufige Freigabe; je Projekt lassen sich mehrere Stufen mit Zuständigkeit, Mindestanzahl Zustimmungen, Frist und Vier-Augen-Prinzip festlegen (ADR-025). Einreichen und Freigeben setzen ein bestandenes Qualitätsgate voraus; eine eingereichte Version ist bis zur Entscheidung gesperrt.</Decision>
      {!!pending.data?.length && (
        <Card title={`Meine offenen Entscheidungen (${pending.data.length})`}>
          <table className="table compact">
            <thead><tr><th>Kapitel</th><th>Version</th><th>Stufe</th><th>Eingereicht</th><th>Frist</th></tr></thead>
            <tbody>
              {pending.data.map((p) => (
                <tr key={p.versionId} className="clickable" {...activatable(() => setSel(p.chapterId))}>
                  <td>{p.chapter}</td>
                  <td>V{p.versionNo}</td>
                  <td>{p.stageIndex + 1}/{p.stages} {p.stage}</td>
                  <td className="small">{p.submittedBy} · {new Date(p.submittedAt).toLocaleDateString('de-DE')}</td>
                  <td>{p.dueAt ? <span className={p.overdue ? 'tag sev-blocker' : ''}>{new Date(p.dueAt).toLocaleDateString('de-DE')}{p.overdue ? ' überfällig' : ''}</span> : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
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
          {version.data && !current?.outlineFamilyId && <GuidanceSummaryLine versionId={version.data.id} />}
          {version.data ? <ApprovalPanel version={version.data} onApproved={() => (version.reload(), chapters.reload(), pending.reload())} /> : <Empty>Kapitel auswählen.</Empty>}
        </Card>
      </div>
      <WorkflowEditor canEdit={!!me.data?.permissions.includes('admin')} />
    </Page>
  );
}

/** Freigabestufen des Projekts (ADR-025) */
function WorkflowEditor({ canEdit }: { canEdit: boolean }) {
  const { notify } = useApp();
  const wf = useLoad<any>('/approval-workflow');
  const people = useLoad<any[]>('/collaborators');
  const approvers = (people.data ?? []).filter((p) => p.permissions.includes('approve'));
  const [draft, setDraft] = useState<any | null>(null);
  useEffect(() => {
    if (wf.data) setDraft({ fourEyes: wf.data.fourEyes || !wf.data.configured, stages: wf.data.configured ? wf.data.stages : [] });
  }, [wf.data]);
  if (!draft) return null;
  const setStage = (i: number, patch: any) => setDraft({ ...draft, stages: draft.stages.map((s: any, j: number) => (j === i ? { ...s, ...patch } : s)) });
  const save = async () => {
    try {
      await put('/approval-workflow', { fourEyes: draft.fourEyes, stages: draft.stages.map((s: any) => ({ ...s, dueDays: s.dueDays === '' || s.dueDays === null ? null : Number(s.dueDays), minApprovals: Number(s.minApprovals) })) });
      notify(draft.stages.length ? 'Freigabeworkflow gespeichert – gilt für neue Einreichungen.' : 'Einstufige Freigabe wiederhergestellt.');
      wf.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title="Freigabeworkflow des Projekts">
      <ErrorBox error={wf.error} />
      {!draft.stages.length && <p className="small">Einstufige Freigabe (Standard, E-12): eine Zustimmung durch eine Person mit Berechtigung „approve“.</p>}
      {draft.stages.length > 0 && (
        <table className="table compact">
          <thead><tr><th>Stufe</th><th>Name</th><th>Zuständig</th><th>Zustimmungen</th><th>Frist (Tage)</th><th><span className="sr-only">Aktionen</span></th></tr></thead>
          <tbody>
            {draft.stages.map((s: any, i: number) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><input aria-label={`Name der Stufe ${i + 1}`} value={s.name} disabled={!canEdit} onChange={(e) => setStage(i, { name: e.target.value })} /></td>
                <td>
                  <select multiple aria-label={`Zuständige der Stufe ${i + 1}`} value={s.approvers} disabled={!canEdit} onChange={(e) => setStage(i, { approvers: [...e.target.selectedOptions].map((o) => o.value) })}>
                    {approvers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <div className="small muted">{s.approvers.length ? '' : 'alle mit „approve“'}</div>
                </td>
                <td><input type="number" min={1} aria-label={`Zustimmungen der Stufe ${i + 1}`} value={s.minApprovals} disabled={!canEdit} onChange={(e) => setStage(i, { minApprovals: e.target.value })} /></td>
                <td><input type="number" min={1} max={90} aria-label={`Frist der Stufe ${i + 1} in Tagen`} value={s.dueDays ?? ''} disabled={!canEdit} onChange={(e) => setStage(i, { dueDays: e.target.value })} /></td>
                <td>{canEdit && <button className="btn small ghost" aria-label={`Stufe ${i + 1} entfernen`} onClick={() => setDraft({ ...draft, stages: draft.stages.filter((_: any, j: number) => j !== i) })}>Entfernen</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {canEdit && (
        <div className="actions">
          <button className="btn" disabled={draft.stages.length >= 6} onClick={() => setDraft({ ...draft, stages: [...draft.stages, { name: `Stufe ${draft.stages.length + 1}`, approvers: [], minApprovals: 1, dueDays: '' }] })}>+ Stufe</button>
          <label className="inline"><input type="checkbox" checked={draft.fourEyes} onChange={(e) => setDraft({ ...draft, fourEyes: e.target.checked })} /> Vier-Augen-Prinzip</label>
          <button className="btn primary" onClick={() => void save()}>Workflow speichern</button>
        </div>
      )}
    </Card>
  );
}
