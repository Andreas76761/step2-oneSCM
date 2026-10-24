import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { del, patch, post, put } from '../api';
import { Card, Empty, ErrorBox, Modal, Page, errorText, useApp, useLoad } from '../components/ui';

// Agenten in der App (ADR-100): ORCHESTRATOR plant und verfeinert Aufgaben aller Agenten und legt Entscheidungen vor,
// ein Mensch entscheidet; GOAL vergleicht den Stand aller Funktionen mit dem Ziel und erstellt Empfehlungen

const STATUS: Record<string, string> = { open: 'offen', in_progress: 'in Arbeit', done: 'erledigt', dropped: 'verworfen' };
const PRIO: Record<number, string> = { 1: 'hoch', 2: 'mittel', 3: 'niedrig' };
const fmt = (v: number | null, unit: string) => (v === null || v === undefined ? '–' : unit === 'share' ? `${Math.round(v * 100)} %` : String(v));

function usePerms() {
  const me = useLoad<{ permissions: string[] }>('/me');
  const p = me.data?.permissions ?? [];
  return { edit: p.includes('edit') || p.includes('admin'), decide: p.includes('decide') || p.includes('admin') };
}

function Tabs() {
  return (
    <nav className="tabs" aria-label="Agenten">
      <NavLink to="/agenten" end className={({ isActive }) => (isActive ? 'active' : '')}>Übersicht, Aufgaben, Entscheidungen</NavLink>
      <NavLink to="/agenten/goal" className={({ isActive }) => (isActive ? 'active' : '')}>GOAL – Ziel-Abgleich</NavLink>
    </nav>
  );
}

export function AgentsPage() {
  const { notify } = useApp();
  const perms = usePerms();
  const agents = useLoad<{ items: any[] }>('/agents');
  const [taskFilter, setTaskFilter] = useState<'active' | ''>('active');
  const tq = `/agents/tasks${taskFilter ? '?status=active' : ''}`;
  const tasks = useLoad<{ items: any[] }>(tq, [tq]);
  const decisions = useLoad<{ items: any[] }>('/agents/decisions');
  const [plan, setPlan] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);
  const [choose, setChoose] = useState<{ d: any; decision: string; note: string } | null>(null);
  const reload = () => (agents.reload(), tasks.reload(), decisions.reload());
  const run = async (fn: () => Promise<string | void>) => {
    setBusy(true);
    try {
      const m = await fn();
      if (m) notify(m);
      reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const orchestrate = () => run(async () => {
    const p = await post('/agents/orchestrator/plan', {});
    setPlan(p);
    return `Plan mit ${p.plan.length} Schritten: ${p.created} Aufgaben neu, ${p.updated} verfeinert, ${p.reopened} wieder geöffnet, ${p.closed} erledigt, ${p.decisionsCreated} Entscheidungen vorgelegt${p.executed.length ? `; ausgeführt: ${p.executed.map((x: any) => x.result).join(', ')}` : ''}.`;
  });
  const openDecisions = (decisions.data?.items ?? []).filter((d) => d.status === 'open');
  const agentName = (code: string) => agents.data?.items.find((a) => a.code === code)?.name ?? code;
  return (
    <Page title="Agenten" subtitle="Der ORCHESTRATOR steuert alle Agenten: Er plant Aufgaben aus dem Stand, verfeinert sie bei jedem Lauf und legt Entscheidungen vor. Entscheiden und freigeben bleibt beim Menschen."
      actions={perms.edit && (
        <span className="row-actions">
          <button type="button" className="btn small" onClick={() => setEdit({ agent: 'kapitel-redakteur', title: '', detail: '', priority: 2 })}>Neue Aufgabe</button>
          <button type="button" className="btn small primary" disabled={busy} onClick={() => void orchestrate()}>Plan erstellen / verfeinern</button>
        </span>
      )}>
      <Tabs />
      <ErrorBox error={agents.error ?? tasks.error ?? decisions.error} />
      {plan && (
        <Card title={`Plan des Orchestrators (${new Date(plan.plannedAt).toLocaleString('de-DE')})`}>
          {!plan.plan.length ? <Empty>Nichts zu tun – alle Ziele laut Stand erfüllt.</Empty> : (
            <ol>
              {plan.plan.map((s: any) => (
                <li key={s.key}>
                  <strong>{agentName(s.agent)}</strong>: {s.link ? <Link to={s.link}>{s.title}</Link> : s.title} <span className="tag small">{PRIO[s.priority]}</span>
                  {s.decision && <span className="tag small">Entscheidung nötig</span>}
                  <div className="muted small">{s.detail}</div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      )}
      <Card title={`Offene Entscheidungen (${openDecisions.length})`}>
        {!openDecisions.length ? <Empty>Keine offenen Entscheidungen.</Empty> : (
          <ul className="plain">
            {openDecisions.map((d) => (
              <li key={d.id}>
                <strong>{agentName(d.agent)}</strong>: {d.question}
                {d.context && <span className="muted small"> ({d.context})</span>}
                {perms.decide ? (
                  <span className="row-actions">
                    {d.options.map((o: string) => (
                      <button type="button" key={o} className="btn small" disabled={busy} onClick={() => setChoose({ d, decision: o, note: '' })}>{o}</button>
                    ))}
                    <button type="button" className="btn small" disabled={busy} onClick={() => void run(async () => (await post(`/agents/decisions/${d.id}/decide`, { drop: true }), 'Entscheidung verworfen.'))}>Verwerfen</button>
                  </span>
                ) : <span className="muted small"> – entscheidet eine Person mit dem Recht „Entscheiden“</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Aufgaben (offene Todos)" actions={(
        <label className="small">Anzeigen{' '}
          <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value as 'active' | '')}>
            <option value="active">offen und in Arbeit</option>
            <option value="">alle</option>
          </select>
        </label>
      )}>
        {!tasks.data?.items.length ? <Empty>Keine Aufgaben. „Plan erstellen“ leitet sie aus dem Stand ab.</Empty> : (
          <table className="table compact">
            <caption className="sr-only">Aufgaben der Agenten</caption>
            <thead><tr><th scope="col">Agent</th><th scope="col">Aufgabe</th><th scope="col">Priorität</th><th scope="col">Status</th><th scope="col">Herkunft</th><th scope="col"><span className="sr-only">Aktion</span></th></tr></thead>
            <tbody>
              {tasks.data.items.map((t) => (
                <tr key={t.id}>
                  <td>{agentName(t.agent)}</td>
                  <td>{t.link ? <Link to={t.link}>{t.title}</Link> : t.title}{t.detail && <div className="muted small">{t.detail}</div>}</td>
                  <td>{PRIO[t.priority]}</td>
                  <td>
                    {perms.edit ? (
                      <select aria-label={`Status: ${t.title}`} value={t.status} disabled={busy} onChange={(e) => void run(async () => void (await patch(`/agents/tasks/${t.id}`, { status: e.target.value })))}>
                        {Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </select>
                    ) : STATUS[t.status]}
                  </td>
                  <td>{t.source === 'orchestrator' ? 'Orchestrator' : t.source === 'goal' ? 'GOAL' : t.source === 'manual' ? 'von Hand' : t.source}</td>
                  <td>
                    {perms.edit && t.source === 'manual' && (
                      <span className="row-actions">
                        <button type="button" className="btn small" aria-label={`Bearbeiten: ${t.title}`} onClick={() => setEdit(t)}>Bearbeiten</button>
                        <button type="button" className="btn small" aria-label={`Löschen: ${t.title}`} disabled={busy} onClick={() => void run(async () => (await del(`/agents/tasks/${t.id}`), 'Aufgabe gelöscht.'))}>Löschen</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <Card title="Agenten">
        <table className="table compact">
          <caption className="sr-only">Alle Agenten mit offenen Aufgaben und Entscheidungen</caption>
          <thead><tr><th scope="col">Agent</th><th scope="col">Aufgabe</th><th scope="col">Ordner</th><th scope="col">offene Aufgaben</th><th scope="col">offene Entscheidungen</th></tr></thead>
          <tbody>
            {(agents.data?.items ?? []).map((a) => (
              <tr key={a.code}>
                <td>{a.link ? <Link to={a.link}>{a.name}</Link> : a.name}{a.inApp && <span className="tag small">in der App</span>}</td>
                <td>{a.purpose}</td>
                <td><code>{a.folder ?? '–'}</code></td>
                <td>{a.openTasks}</td>
                <td>{a.openDecisions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {edit && (
        <Modal title={edit.id ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'} onClose={() => setEdit(null)}>
          <form className="form" onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const body = { agent: edit.agent, title: edit.title, detail: edit.detail, priority: Number(edit.priority) };
              if (edit.id) await patch(`/agents/tasks/${edit.id}`, body);
              else await post('/agents/tasks', body);
              setEdit(null);
              return 'Aufgabe gespeichert.';
            });
          }}>
            <label>Agent
              <select value={edit.agent} onChange={(e) => setEdit({ ...edit, agent: e.target.value })}>
                {(agents.data?.items ?? []).map((a) => <option key={a.code} value={a.code}>{a.name}</option>)}
              </select>
            </label>
            <label>Aufgabe<input value={edit.title} required minLength={3} maxLength={200} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
            <label>Details<textarea rows={3} value={edit.detail ?? ''} onChange={(e) => setEdit({ ...edit, detail: e.target.value })} /></label>
            <label>Priorität
              <select value={edit.priority} onChange={(e) => setEdit({ ...edit, priority: Number(e.target.value) })}>
                {[1, 2, 3].map((p) => <option key={p} value={p}>{PRIO[p]}</option>)}
              </select>
            </label>
            <div className="row-actions"><button type="submit" className="btn primary" disabled={busy}>Speichern</button></div>
          </form>
        </Modal>
      )}
      {choose && (
        <Modal title="Entscheidung treffen" onClose={() => setChoose(null)}>
          <form className="form" onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await post(`/agents/decisions/${choose.d.id}/decide`, { decision: choose.decision, note: choose.note });
              setChoose(null);
              return `Entschieden: „${choose.decision}“. Der Orchestrator führt es beim nächsten Plan aus.`;
            });
          }}>
            <p>{choose.d.question}</p>
            <p><strong>Antwort:</strong> {choose.decision}</p>
            <label>Begründung (optional)<textarea rows={2} value={choose.note} onChange={(e) => setChoose({ ...choose, note: e.target.value })} /></label>
            <div className="row-actions"><button type="submit" className="btn primary" disabled={busy}>Entscheiden</button></div>
          </form>
        </Modal>
      )}
    </Page>
  );
}

export function GoalPage() {
  const { notify } = useApp();
  const perms = usePerms();
  const g = useLoad<any>('/agents/goal');
  const [goal, setGoal] = useState('');
  const [criteria, setCriteria] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (g.data) (setGoal(g.data.goal), setCriteria(g.data.criteria));
  }, [g.data]);
  const run = async (fn: () => Promise<string>) => {
    setBusy(true);
    try {
      notify(await fn());
      g.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const last = g.data?.lastRun;
  return (
    <Page title="GOAL – Ziel-Abgleich" subtitle="GOAL vergleicht den Stand aller Funktionen mit dem Ziel und erstellt Empfehlungen; nicht erfüllte Kriterien übernimmt der Orchestrator als Aufgaben"
      actions={perms.edit && <button type="button" className="btn small primary" disabled={busy} onClick={() => void run(async () => {
        const r = await post('/agents/goal/runs', {});
        return `Ziel-Abgleich: ${Math.round(r.score * 100)} % der Kriterien erfüllt.`;
      })}>Abgleich ausführen</button>}>
      <Tabs />
      <ErrorBox error={g.error} />
      {g.data && (
        <>
          <Card title="Ziel und Kriterien">
            <form className="form" onSubmit={(e) => {
              e.preventDefault();
              void run(async () => (await put('/agents/goal', { goal, criteria: criteria.map((c) => ({ code: c.code, target: Number(c.target), enabled: c.enabled })) }), 'Ziel gespeichert.'));
            }}>
              <label>Ziel<textarea rows={3} value={goal} disabled={!perms.edit} onChange={(e) => setGoal(e.target.value)} /></label>
              <table className="table compact">
                <caption className="sr-only">Kriterien des Ziels</caption>
                <thead><tr><th scope="col">aktiv</th><th scope="col">Kriterium</th><th scope="col">Soll</th><th scope="col">Agent</th></tr></thead>
                <tbody>
                  {criteria.map((c, i) => (
                    <tr key={c.code}>
                      <td><input type="checkbox" aria-label={`aktiv: ${c.title}`} checked={c.enabled} disabled={!perms.edit} onChange={(e) => setCriteria(criteria.map((x, j) => (j === i ? { ...x, enabled: e.target.checked } : x)))} /></td>
                      <td>{c.title}</td>
                      <td>
                        {c.direction === 'min' ? '≥ ' : '≤ '}
                        <input type="number" aria-label={`Soll: ${c.title}${c.unit === 'share' ? ' (Anteil 0 bis 1)' : ''}`} step={c.unit === 'share' ? 0.05 : 1} min={0} max={c.unit === 'share' ? 1 : 100000} value={c.target} disabled={!perms.edit} style={{ width: '6em' }}
                          onChange={(e) => setCriteria(criteria.map((x, j) => (j === i ? { ...x, target: e.target.value } : x)))} />
                        {c.unit === 'share' && <span className="muted small"> ({fmt(Number(c.target), 'share')})</span>}
                      </td>
                      <td>{c.agent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {perms.edit && <div className="row-actions"><button type="submit" className="btn" disabled={busy}>Ziel speichern</button></div>}
            </form>
          </Card>
          <Card title={last ? `Letzter Abgleich: ${new Date(last.createdAt).toLocaleString('de-DE')} – ${Math.round(last.score * 100)} % erfüllt` : 'Noch kein Abgleich'}>
            {!last ? <Empty>„Abgleich ausführen“ misst den Stand gegen alle aktiven Kriterien.</Empty> : (
              <table className="table">
                <caption className="sr-only">Ergebnis des Ziel-Abgleichs mit Empfehlungen</caption>
                <thead><tr><th scope="col">Kriterium</th><th scope="col">Ist</th><th scope="col">Soll</th><th scope="col">erfüllt</th><th scope="col">Empfehlung</th></tr></thead>
                <tbody>
                  {last.results.map((r: any) => (
                    <tr key={r.code}>
                      <td>{r.title}</td>
                      <td>{fmt(r.value, r.unit)}</td>
                      <td>{r.direction === 'min' ? '≥' : '≤'} {fmt(r.target, r.unit)}</td>
                      <td>{r.ok ? '✅ ja' : '❌ nein'}</td>
                      <td>{r.recommendation ?? '–'}{r.recommendation && <div className="muted small">zuständig: {r.agent}</div>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </Page>
  );
}
