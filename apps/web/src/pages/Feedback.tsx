// Rückmeldungen auswerten (ADR-058): Welche Kapitel helfen Leserinnen und Lesern nicht? Was wünschen sie sich?
// Aus einer Rückmeldung wird mit einem Klick eine Aufgabe für die Redaktion.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, post, put } from '../api';
import { BarList, Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const trendText = (t: number | null) => (t === null ? '–' : t === 0 ? '→ unverändert' : t > 0 ? `▲ ${t} Punkte schlechter` : `▼ ${-t} Punkte besser`);

function TaskButton({ f, people, onDone }: { f: any; people: any[]; onDone: () => void }) {
  const { notify } = useApp();
  const [open, setOpen] = useState(false);
  const [assignee, setAssignee] = useState('');
  if (!open) return <button className="btn small" onClick={() => setOpen(true)}>Aufgabe erstellen</button>;
  return (
    <span className="inline-form">
      <label className="inline small">Zuständig
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="">ich selbst</option>
          {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <button className="btn small primary" onClick={async () => {
        try {
          await post(`/feedback/${f.id}/task`, assignee ? { assignee } : {});
          notify('Aufgabe erstellt – die Rückmeldung ist erledigt.');
          onDone();
        } catch (e) {
          notify(errorText(e), 'error');
        }
      }}>Erstellen</button>
      <button className="btn small ghost" onClick={() => setOpen(false)}>Abbrechen</button>
    </span>
  );
}

export function FeedbackPage() {
  const { notify } = useApp();
  const [days, setDays] = useState(90);
  const data = useLoad<any>(`/feedback/insights?days=${days}`, [days]);
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const people = useLoad<any[]>(canEdit ? '/collaborators' : null, [canEdit]);
  const isAdmin = !!me.data?.permissions.includes('admin');
  const d = data.data;
  return (
    <Page title="Rückmeldungen" subtitle="Was Leserinnen und Leser zu den Kapiteln sagen – aus der Leseransicht und der Online-Hilfe">
      <div className="filters">
        <label className="inline">Zeitraum
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={30}>30 Tage</option><option value={90}>90 Tage</option><option value={365}>1 Jahr</option>
          </select>
        </label>
      </div>
      <ErrorBox error={data.error} />
      {d && !d.total && <Empty>Noch keine Rückmeldungen in diesem Zeitraum. Leser antworten in der <Link to="/lesen">Leseransicht</Link> und in der Online-Hilfe auf „War das hilfreich?“.</Empty>}
      {d && d.total > 0 && (
        <>
          <div className="stat-row">
            <div className="stat"><strong>{d.total}</strong><span>Rückmeldungen</span></div>
            <div className="stat"><strong>{d.helpfulShare} %</strong><span>fanden das Kapitel hilfreich</span></div>
            <div className="stat"><strong>{d.chapters.reduce((n: number, c: any) => n + c.open, 0)}</strong><span>offen mit Kritik oder Kommentar</span></div>
          </div>
          <div className="grid2">
            <Card title="Kapitel mit dem größten Verbesserungsbedarf">
              <p className="small muted">Anteil „nicht hilfreich“ je Kapitel (höher = dringender)</p>
              <BarList label="Anteil nicht hilfreich je Kapitel" rows={d.chapters.filter((c: any) => c.notHelpful > 0).slice(0, 8).map((c: any) => ({
                key: c.chapterId, label: <Link to={`/lesen/${c.chapterId}`}>{c.title}</Link>, value: c.notHelpfulShare, hint: `${c.notHelpful} von ${c.total} nicht hilfreich`,
              }))} />
              {!d.chapters.some((c: any) => c.notHelpful > 0) && <p className="small">✓ Alle Rückmeldungen sind positiv.</p>}
            </Card>
            <Card title="Häufige Begriffe in der Kritik">
              {d.words.length ? (
                <ul className="plain word-list">{d.words.map((w: any) => <li key={w.word} className="tag">{w.word} <span className="small muted">×{w.count}</span></li>)}</ul>
              ) : <p className="small muted">Noch keine wiederkehrenden Begriffe (ab zwei Nennungen).</p>}
            </Card>
          </div>
          <Card title="Alle Kapitel">
            <div className="table-wrap" role="region" aria-label="Rückmeldungen je Kapitel" tabIndex={0}>
              <table className="table">
                <thead><tr><th>Kapitel</th><th>👍 hilfreich</th><th>👎 nicht hilfreich</th><th>Anteil nicht hilfreich</th><th>Entwicklung (30 Tage)</th><th>davon Online-Hilfe</th><th>offen</th></tr></thead>
                <tbody>
                  {d.chapters.map((c: any) => (
                    <tr key={c.chapterId}>
                      <td><Link to={`/lesen/${c.chapterId}`}>{c.title}</Link></td>
                      <td>{c.helpful}</td><td>{c.notHelpful}</td><td>{c.notHelpfulShare} %</td><td>{trendText(c.trend)}</td><td>{c.online}</td><td>{c.open || '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Neueste Kommentare">
            <ul className="plain feedback-list">
              {d.comments.map((f: any) => (
                <li key={f.id}>
                  <span aria-hidden="true">{f.helpful ? '👍' : '👎'}</span><span className="sr-only">{f.helpful ? 'hilfreich' : 'nicht hilfreich'}:</span>
                  <strong>{f.title}</strong> – „{f.comment}“
                  <span className="small muted"> · {f.source === 'online-help' ? 'Online-Hilfe' : f.createdBy}, {new Date(f.createdAt).toLocaleDateString('de-DE')}{f.status === 'done' ? ' · erledigt' : ''}</span>
                  {canEdit && f.status === 'open' && (
                    <span className="row-actions">
                      <Link className="btn small" to={`/werkstatt/${f.chapterId}`}>In der Werkstatt öffnen</Link>
                      <TaskButton f={f} people={people.data ?? []} onDone={data.reload} />
                      <button className="btn small ghost" onClick={async () => {
                        try {
                          await api('PATCH', `/feedback/${f.id}`, { status: 'done' });
                          notify('Als erledigt markiert.');
                          data.reload();
                        } catch (e) {
                          notify(errorText(e), 'error');
                        }
                      }}>Erledigt</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
      {canEdit && <DigestCard isAdmin={isAdmin} />}
    </Page>
  );
}

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

/** Wöchentliche Übersicht (ADR-064): Wochentag einstellen, eigene Übersicht als Vorschau, sofort senden */
function DigestCard({ isAdmin }: { isAdmin: boolean }) {
  const { notify } = useApp();
  const settings = useLoad<any>('/digest/settings');
  const preview = useLoad<any>('/digest/preview');
  const s = settings.data;
  const p = preview.data;
  const setWeekday = async (value: string) => {
    try {
      await put('/digest/settings', { weekday: value ? Number(value) : null });
      notify(value ? `Übersicht kommt jetzt jeden ${WEEKDAYS[Number(value) - 1]}.` : 'Wöchentliche Übersicht ausgeschaltet.');
      settings.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const sendNow = async () => {
    try {
      const r = await post<any>('/digest/send', {});
      notify(r.sent ? `Übersicht an ${r.sent} Person${r.sent === 1 ? '' : 'en'} gesendet.` : 'Niemand hatte in dieser Woche etwas Neues – oder alle haben die Übersicht schon erhalten.');
      settings.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title="Wöchentliche Übersicht">
      <p className="small muted">Alle mit Bearbeitungsrecht erhalten einmal pro Woche eine Benachrichtigung mit offenen Rückmeldungen, ihren Aufgaben und Kapiteln mit Handlungsbedarf – nur, wenn es etwas zu tun gibt.</p>
      <ErrorBox error={settings.error ?? preview.error} />
      {s && (
        <div className="filters">
          <label className="inline">Senden am
            <select value={s.weekday ?? ''} disabled={!isAdmin} onChange={(e) => setWeekday(e.target.value)}>
              <option value="">nie (ausgeschaltet)</option>
              {WEEKDAYS.map((w, i) => <option key={w} value={i + 1}>{w}</option>)}
            </select>
          </label>
          {isAdmin && <button className="btn small" onClick={sendNow}>📨 Jetzt senden</button>}
          <span className="small muted">{s.lastWeek ? `Zuletzt gesendet: ${s.lastWeek}` : 'Noch nie gesendet'}</span>
        </div>
      )}
      {!isAdmin && <p className="small muted">Den Wochentag legt die Projektleitung fest.</p>}
      {p && (
        <div className="digest-preview" aria-label="Vorschau Ihrer Übersicht">
          <h3>Ihre Übersicht für {p.week}</h3>
          {p.empty ? <p className="small">✓ Nichts zu tun – diese Woche erhielten Sie keine Nachricht.</p> : (
            <ul>
              {p.openFeedback > 0 && <li><Link to="/rueckmeldungen">{p.openFeedback} offene Leser-Rückmeldung{p.openFeedback === 1 ? '' : 'en'}</Link>{p.feedbackByChapter.length > 0 && ` – ${p.feedbackByChapter.slice(0, 3).map((c: any) => `${c.title}: ${c.open}`).join(', ')}`}</li>}
              {p.tasks > 0 && <li><Link to="/aufgaben">{p.tasks} offene Aufgabe{p.tasks === 1 ? '' : 'n'} für Sie</Link>{p.overdueTasks > 0 && `, davon ${p.overdueTasks} überfällig`}</li>}
              {p.weakChapters.map((c: any) => <li key={c.chapterId}>Anleitungs-Check: <Link to={`/anleitungs-check/${c.versionId}`}>{c.title}</Link> ({c.score} Punkte)</li>)}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
