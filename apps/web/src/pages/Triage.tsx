import { HandIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useState } from 'react';
import { post } from '../api';
import { BarList, Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Agent TRIAGE (ADR-100): nach dem Einlesen Pflichtlabels je Chunk (direkt gesetzt, Mensch geht vor) und Kapitel-/Unterkapitelvorschläge
// (Verschieben, neues Unterkapitel „neu“) zum Übernehmen oder Verwerfen; Inhalts-Dashboard je Kapitel und Domäne

const PLACEMENT: Record<string, string> = { kept: 'bleibt', move: 'verschieben', new_subchapter: 'neues Unterkapitel', unassigned: 'nicht zugeordnet' };
const STATUS: Record<string, string> = { applied: 'Labels gesetzt', proposed: 'Vorschlag', accepted: 'übernommen', rejected: 'verworfen' };
const DETAIL: Record<string, string> = { basis: 'Basis', 'basis-plus': 'Basis+', zusatz: 'Zusatz', intern: 'Intern', 'happy-path': 'HappyPath', edge: 'Edge', 'in-review': 'inPrüfung' };
const GROUP: Record<string, string> = { version: 'Version', status: 'Status', domain: 'Domäne', role: 'Rolle', language: 'Sprache', division: 'Sparte', market: 'Markt', detail: 'Detaillevel', review: 'Prüfung' };
const pct = (v: number) => `${Math.round(v * 100)} %`;

function usePerm(p: string) {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((x) => x === p || x === 'admin');
}

export function TriagePage() {
  const { notify } = useApp();
  const canEdit = usePerm('edit');
  const [filter, setFilter] = useState<'proposed' | 'review' | 'all'>('proposed');
  const q = filter === 'proposed' ? '/triage/results?status=proposed' : filter === 'review' ? '/triage/results?review=true' : '/triage/results?limit=300';
  const res = useLoad<{ items: any[] }>(q, [q]);
  const runs = useLoad<{ items: any[] }>('/triage/runs');
  const neu = useLoad<{ items: any[] }>('/triage/new-subchapters');
  const catalog = useLoad<{ code: string; nameDe: string }[]>('/metadata/labels');
  const labelName = (group: string, code: string) => catalog.data?.find((l) => l.code === `${group}.${code}`)?.nameDe ?? code;
  const [busy, setBusy] = useState(false);
  const reload = () => (res.reload(), runs.reload(), neu.reload());
  const act = async (fn: () => Promise<string>) => {
    setBusy(true);
    try {
      notify(await fn());
      reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const run = (scope: 'all' | 'missing') => act(async () => {
    const r = await post('/triage/runs', { scope });
    const s = r.stats;
    return `TRIAGE: ${s.chunks} Chunks, ${s.labels} Labels gesetzt, ${s.move} Verschiebungen und ${s.newSubchapter} neue Unterkapitel vorgeschlagen, ${s.review} zu prüfen, ${s.keptManual} Labels von Hand blieben stehen.`;
  });
  const last = runs.data?.items[0];
  return (
    <Page title="Triage" subtitle="Agent TRIAGE ordnet nach dem Einlesen jedem Chunk die Pflichtlabels zu (Version, Status, Domäne, Rolle, Sprache, Sparte, Markt, Detaillevel, zu prüfen) und schlägt Kapitel und Unterkapitel vor – auch neue Unterkapitel mit Kennung „neu“. Labels von Hand gehen vor."
      actions={canEdit && (
        <span className="row-actions">
          <button type="button" className="btn small" disabled={busy} onClick={() => void run('missing')}>Chunks ohne Pflichtlabels</button>
          <button type="button" className="btn small" disabled={busy} onClick={() => void run('all')}>Alle Chunks neu einordnen</button>
          <button type="button" className="btn small primary" disabled={busy || !res.data?.items.some((r) => r.status === 'proposed')}
            onClick={() => void act(async () => `${(await post('/triage/accept-all', {})).accepted} Vorschläge übernommen.`)}>Alle Vorschläge übernehmen</button>
        </span>
      )}>
      <ErrorBox error={res.error ?? runs.error} />
      {last && (
        <p className="muted small">Letzter Lauf: {new Date(last.startedAt).toLocaleString('de-DE')} ({last.scope.startsWith('import:') ? 'nach dem Einlesen' : last.scope === 'all' ? 'alle Chunks' : 'ohne Pflichtlabels'}) – {last.stats.chunks ?? 0} Chunks, {last.stats.move ?? 0} verschieben, {last.stats.newSubchapter ?? 0} neu, {last.stats.unassigned ?? 0} nicht zugeordnet, {last.stats.review ?? 0} zu prüfen.</p>
      )}
      {(neu.data?.items.length ?? 0) > 0 && (
        <Card title={`Neue Unterkapitel „neu“ (${neu.data!.items.length})`}>
          <table className="table compact">
            <thead><tr><th scope="col">Kapitel</th><th scope="col">Unterkapitel</th><th scope="col">Chunks</th><th scope="col"><span className="sr-only">Aktion</span></th></tr></thead>
            <tbody>
              {neu.data!.items.map((s) => (
                <tr key={s.id}>
                  <td>{s.chapterTitle}</td>
                  <td>{s.title} <span className="tag">neu</span></td>
                  <td>{s.chunks}</td>
                  <td>{canEdit && <button type="button" className="btn small" disabled={busy} onClick={() => void act(async () => (await post(`/triage/new-subchapters/${s.id}/confirm`, {}), `Unterkapitel „${s.title}“ in die Gliederung aufgenommen.`))}>Bestätigen</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <div className="tabs" role="tablist" aria-label="Ergebnisse filtern">
        {([['proposed', 'Vorschläge'], ['review', 'zu prüfen'], ['all', 'alle Ergebnisse']] as const).map(([k, l]) => (
          <button type="button" role="tab" key={k} aria-selected={filter === k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <Card>
        {!res.data ? null : !res.data.items.length ? (
          <Empty>{filter === 'proposed' ? 'Keine offenen Vorschläge.' : 'Keine Ergebnisse.'} Die Triage läuft automatisch nach jedem Einlesen.</Empty>
        ) : (
          <table className="table">
            <caption className="sr-only">Ergebnisse der Triage</caption>
            <thead><tr><th scope="col">Chunk</th><th scope="col">Labels</th><th scope="col">Zuordnung</th><th scope="col">Sicherheit</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Aktion</span></th></tr></thead>
            <tbody>
              {res.data.items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="small muted">{r.path}{r.headingPath.length ? ` › ${r.headingPath.join(' › ')}` : ''}</div>
                    {r.text.length > 220 ? `${r.text.slice(0, 220)} …` : r.text}
                  </td>
                  <td className="small">
                    {r.labels.map((l: any) => (
                      <span key={`${l.group}.${l.code}`} className="tag small" title={`${l.reason}${l.kept ? ' (von Hand, bleibt)' : ''} – Sicherheit ${pct(l.confidence)}`}>{GROUP[l.group] ?? l.group}: {labelName(l.group, l.code)}{l.kept ? <> <Ico icon={HandIcon} size={12} /></> : ''}</span>
                    ))}
                  </td>
                  <td className="small">
                    <strong>{PLACEMENT[r.placement] ?? r.placement}</strong>
                    {(r.placement === 'move' || r.placement === 'new_subchapter') && (
                      <div>{r.before.chapterTitle ?? '–'}{r.before.subchapterTitle ? ` › ${r.before.subchapterTitle}` : ''} → {r.target.chapterTitle}{r.target.subchapterTitle ? ` › ${r.target.subchapterTitle}` : ''}{r.target.newSubchapter && <span className="tag">neu</span>}</div>
                    )}
                    {r.reasons.length > 0 && <div className="muted">{r.reasons.join('; ')}</div>}
                  </td>
                  <td>{pct(r.confidence)}{r.review && <div><span className="tag">zu prüfen</span></div>}</td>
                  <td>{STATUS[r.status] ?? r.status}</td>
                  <td>
                    {canEdit && r.status === 'proposed' && (
                      <span className="row-actions">
                        <button type="button" className="btn small" disabled={busy} aria-label={`Vorschlag übernehmen: ${r.text.slice(0, 40)}`} onClick={() => void act(async () => (await post(`/triage/results/${r.id}/decision`, { decision: 'accept' }), 'Vorschlag übernommen.'))}>Übernehmen</button>
                        <button type="button" className="btn small" disabled={busy} aria-label={`Vorschlag verwerfen: ${r.text.slice(0, 40)}`} onClick={() => void act(async () => (await post(`/triage/results/${r.id}/decision`, { decision: 'reject' }), 'Vorschlag verworfen.'))}>Verwerfen</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Page>
  );
}

export function ContentDashboardPage() {
  const r = useLoad<any>('/triage/dashboard');
  const d = r.data;
  return (
    <Page title="Inhalts-Dashboard" subtitle="Wie viele Chunks, Labels und Wörter es je Kapitel und Domäne gibt, wie vollständig die Pflichtlabels sind und welche Detaillevel vorhanden sind">
      <ErrorBox error={r.error} />
      {d && (
        <>
          <div className="stat-row">
            <div className="stat"><span className="muted small">Chunks</span><strong>{d.totals.chunks}</strong></div>
            <div className="stat"><span className="muted small">Wörter</span><strong>{d.totals.words.toLocaleString('de-DE')}</strong></div>
            <div className="stat"><span className="muted small">Labels (verschiedene)</span><strong>{d.totals.distinctLabels}</strong></div>
            <div className="stat"><span className="muted small">Label-Zuordnungen</span><strong>{d.totals.labelAssignments}</strong></div>
            <div className="stat"><span className="muted small">Pflichtlabels vollständig</span><strong>{d.totals.complete}</strong></div>
            <div className="stat"><span className="muted small">zu prüfen</span><strong>{d.totals.review}</strong></div>
            <div className="stat"><span className="muted small">offene Vorschläge</span><strong>{d.openProposals}</strong></div>
            <div className="stat"><span className="muted small">Unterkapitel „neu“</span><strong>{d.newSubchapters}</strong></div>
          </div>
          <div className="grid2">
            <Card title="Pflichtlabels je Gruppe">
              <BarList label="Chunks mit Label je Pflichtgruppe" rows={d.requiredGroups.map((g: any) => ({ key: g.group, label: g.label, value: g.chunks, hint: pct(g.share) }))} />
            </Card>
            <Card title="Detaillevel">
              <BarList label="Chunks je Detaillevel" rows={d.detailLevels.map((x: any) => ({ key: x.code, label: `${DETAIL[x.code] ?? x.code}${x.standard ? '' : ' (nicht im Standard)'}`, value: x.chunks }))} />
            </Card>
          </div>
          <Card title="Je Kapitel">
            {!d.chapters.length ? <Empty>Noch keine Chunks.</Empty> : (
              <table className="table compact">
                <caption className="sr-only">Chunks, Wörter und Labels je Kapitel</caption>
                <thead><tr><th scope="col">Kapitel</th><th scope="col">Chunks</th><th scope="col">Wörter</th><th scope="col">Labels</th><th scope="col">zu prüfen</th><th scope="col">HappyPath</th><th scope="col">Edge</th></tr></thead>
                <tbody>
                  {d.chapters.map((c: any) => (
                    <tr key={c.chapterId}><td>{c.title}</td><td>{c.chunks}</td><td>{c.words.toLocaleString('de-DE')}</td><td>{c.labels}</td><td>{c.review}</td><td>{c.detail['happy-path'] ?? 0}</td><td>{c.detail.edge ?? 0}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
          <Card title="Je Domäne">
            <table className="table compact">
              <caption className="sr-only">Chunks und Wörter je Domäne</caption>
              <thead><tr><th scope="col">Domäne</th><th scope="col">Chunks</th><th scope="col">Wörter</th></tr></thead>
              <tbody>{d.domains.map((x: any) => <tr key={x.code}><td>{x.name}</td><td>{x.chunks}</td><td>{x.words.toLocaleString('de-DE')}</td></tr>)}</tbody>
            </table>
          </Card>
        </>
      )}
    </Page>
  );
}
