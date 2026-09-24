import { useState } from 'react';
import { Link } from 'react-router-dom';
import { patch, post } from '../api';
import { Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

/** Diskussion zu einem Absatz, Befund oder Kapitel (ADR-019): Kommentare, Antworten, Aufgaben mit @Erwähnung */
export function DiscussionPanel({ entityType, entityId, canEdit }: { entityType: 'block' | 'finding' | 'chapter'; entityId: string; canEdit: boolean }) {
  const { notify, userId } = useApp();
  const thread = useLoad<any[]>(`/comments?entityType=${entityType}&entityId=${encodeURIComponent(entityId)}`, [entityType, entityId]);
  const people = useLoad<any[]>('/collaborators');
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<'comment' | 'task'>('comment');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      thread.reload();
      return true;
    } catch (e) {
      notify(errorText(e), 'error');
      return false;
    }
  };
  const send = async () => {
    const ok = await act(
      () => post('/comments', { entityType, entityId, body, kind, parentId: replyTo?.id, ...(kind === 'task' ? { assignee, dueDate: dueDate || undefined } : {}) }),
      kind === 'task' ? 'Aufgabe angelegt.' : 'Kommentar gespeichert.',
    );
    if (ok) (setBody(''), setReplyTo(null), setKind('comment'), setAssignee(''), setDueDate(''));
  };
  const list = thread.data ?? [];
  return (
    <div className="discussion">
      <ErrorBox error={thread.error} />
      {!list.length ? <Empty>Noch keine Kommentare.</Empty> : (
        <ul className="comment-list">
          {list.map((c) => (
            <li key={c.id} className={c.parentId ? 'reply' : ''}>
              <div className="small">
                <strong>{c.authorName}</strong> · {new Date(c.createdAt).toLocaleString('de-DE')}
                {c.kind === 'task' && (
                  <> · <span className={`tag ${c.status === 'done' ? 'st-approved' : 'st-open'}`}>{c.status === 'done' ? 'Aufgabe erledigt' : 'Aufgabe offen'}</span> für {c.assigneeName}{c.dueDate && <> bis {new Date(c.dueDate).toLocaleDateString('de-DE')}</>}</>
                )}
              </div>
              <Md text={c.body} />
              <div className="row-actions">
                {!c.parentId && <button className="btn link small" onClick={() => setReplyTo(c)}>Antworten</button>}
                {c.kind === 'task' && c.status === 'open' && (c.assignee === userId || canEdit) && (
                  <button className="btn small" onClick={() => act(() => patch(`/comments/${c.id}`, { status: 'done' }), 'Aufgabe erledigt.')}>Erledigt</button>
                )}
                {c.kind === 'task' && c.status === 'done' && (c.assignee === userId || canEdit) && (
                  <button className="btn link small" onClick={() => act(() => patch(`/comments/${c.id}`, { status: 'open' }), 'Aufgabe wieder geöffnet.')}>Wieder öffnen</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="comment-form">
        {replyTo && <p className="small">Antwort an {replyTo.authorName} <button className="btn link small" onClick={() => setReplyTo(null)}>abbrechen</button></p>}
        <label className="block">{kind === 'task' ? 'Aufgabe' : 'Kommentar'} (Markdown; @kennung erwähnt eine Person)
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} aria-label="Kommentartext" />
        </label>
        <p className="small muted">Personen: {people.data?.map((p) => <button key={p.id} type="button" className="btn link small" onClick={() => setBody(`${body}${body && !body.endsWith(' ') ? ' ' : ''}@${p.id} `)} title={p.name}>@{p.id}</button>)}</p>
        {canEdit && !replyTo && (
          <div className="form-row">
            <label>Art
              <select aria-label="Art des Eintrags" value={kind} onChange={(e) => setKind(e.target.value as any)}>
                <option value="comment">Kommentar</option>
                <option value="task">Aufgabe</option>
              </select>
            </label>
            {kind === 'task' && (
              <>
                <label>Zuständig
                  <select aria-label="Zuständige Person" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                    <option value="">– wählen –</option>
                    {people.data?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </label>
                <label>Frist <input type="date" aria-label="Frist" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
              </>
            )}
          </div>
        )}
        <button className="btn primary small" disabled={!body.trim() || (kind === 'task' && !assignee)} onClick={send}>{kind === 'task' ? 'Aufgabe anlegen' : 'Senden'}</button>
      </div>
    </div>
  );
}

/** Aufgaben & Hinweise: Benachrichtigungen und eigene offene Aufgaben im Projekt */
export function InboxPage({ onRead }: { onRead: () => void }) {
  const { notify } = useApp();
  const notes = useLoad<any>('/notifications');
  const tasks = useLoad<any[]>('/tasks?assignee=me&status=open');
  const read = async (ids?: string[]) => {
    try {
      await post('/notifications/read', { ids });
      notes.reload();
      onRead();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Page title="Aufgaben & Hinweise" subtitle="Erwähnungen, Zuweisungen und Antworten im aktuellen Projekt">
      <div className="grid2">
        <section className="card">
          <div className="card-head">
            <h2>Hinweise {notes.data?.unread ? `(${notes.data.unread} neu)` : ''}</h2>
            {!!notes.data?.unread && <button className="btn small" onClick={() => read()}>Alle als gelesen markieren</button>}
          </div>
          {!notes.data?.items.length ? <Empty>Keine Hinweise.</Empty> : (
            <ul className="comment-list">
              {notes.data.items.map((n: any) => (
                <li key={n.id} className={n.readAt ? '' : 'unread'}>
                  <div>{n.text}</div>
                  <div className="small muted">
                    {new Date(n.createdAt).toLocaleString('de-DE')}
                    {n.link && <> · <Link to={n.link} onClick={() => !n.readAt && read([n.id])}>öffnen</Link></>}
                    {!n.readAt && <> · <button className="btn link small" onClick={() => read([n.id])}>gelesen</button></>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <div className="card-head"><h2>Meine offenen Aufgaben</h2></div>
          {!tasks.data?.length ? <Empty>Keine offenen Aufgaben.</Empty> : (
            <ul className="comment-list">
              {tasks.data.map((t) => (
                <li key={t.id}>
                  <Md text={t.body} />
                  <div className="small muted">
                    {t.label} · von {t.authorName}{t.dueDate && <> · bis {new Date(t.dueDate).toLocaleDateString('de-DE')}</>}
                    {t.link && <> · <Link to={t.link}>öffnen</Link></>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Page>
  );
}
