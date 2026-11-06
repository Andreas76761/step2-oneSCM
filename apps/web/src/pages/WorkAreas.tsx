import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ApiError, api, patch, post } from '../api';
import { Card, Empty, ErrorBox, Modal, Page, errorText, useApp, useLoad } from '../components/ui';

// Arbeitsbereiche Pipeline, Backlog und Intern (ADR-098): Pipeline = Jira-Tickets in Bearbeitung, noch nicht produktiv,
// je Gliederungspunkt mit Erstelldatum, Stream, Produktionsdatum und Vorab-Dokumentation; Backlog = noch nicht begonnen;
// Intern = interne Themen (Testing, Reporting, Systeme, Migration, Rollout, Other), nie im Handbuch

type Area = 'pipeline' | 'backlog' | 'intern';
const TOPICS = ['testing', 'reporting', 'systems', 'migration', 'rollout', 'other'] as const;
const INFO: Record<Area, { title: string; subtitle: string }> = {
  pipeline: { title: 'Pipeline', subtitle: 'Jira-Tickets in Bearbeitung, noch nicht produktiv – je Kapitel und Unterkapitel der aktuellen Gliederung, mit Erstelldatum, Stream, Produktionsdatum und der bereits geschriebenen Dokumentation' },
  backlog: { title: 'Backlog', subtitle: 'Jira-Tickets, deren Bearbeitung noch nicht begonnen hat – sie wechseln beim Abgleich in die Pipeline, sobald sie in Bearbeitung sind' },
  intern: { title: 'Intern', subtitle: 'Interne Themen rund um oneSCM – Testing, Reporting, Systeme, Migration, Rollout, Other; erscheinen nie im Handbuch, Export oder Release' },
};
const de = (iso: string | null) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : iso ?? '–');

function usePerms() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((x) => x === 'edit' || x === 'admin');
}

export function WorkAreaPage({ area }: { area: Area }) {
  const { notify } = useApp();
  const canEdit = usePerms();
  const [topic, setTopic] = useState<string>('');
  const q = `/work-areas?area=${area}${area === 'intern' && topic ? `&topic=${topic}` : ''}`;
  const r = useLoad<any>(q, [q]);
  const [edit, setEdit] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const d = r.data;
  const sync = async () => {
    setBusy(true);
    try {
      const s = await post('/work-areas/sync-jira', {});
      notify(`${s.tickets} Jira-Tickets abgeglichen: ${s.created} neu, ${s.moved} verschoben, ${s.ready} produktiv, ${s.cancelled} abgebrochen, ${s.skipped} ohne Eintrag (produktiv, abgebrochen oder Bug).`);
      r.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const info = INFO[area];
  const byId = new Map<string, any>((d?.items ?? []).map((i: any) => [i.id, i]));
  return (
    <Page title={info.title} subtitle={info.subtitle} actions={canEdit && (
      <span className="row-actions">
        {area !== 'intern' && <button type="button" className="btn small" disabled={busy} onClick={() => void sync()}>Aus Jira-Tickets abgleichen</button>}
        <button type="button" className="btn small primary" onClick={() => setEdit({ area, topic: area === 'intern' ? topic || 'testing' : null })}>Neuer Eintrag</button>
      </span>
    )}>
      <nav className="tabs" aria-label="Arbeitsbereiche">
        {(['pipeline', 'backlog', 'intern'] as Area[]).map((a) => (
          <NavLink key={a} to={`/${a}`} className={({ isActive }) => (isActive ? 'active' : '')}>{INFO[a].title} ({d?.counts?.[a] ?? 0})</NavLink>
        ))}
      </nav>
      <ErrorBox error={r.error} />
      {area === 'pipeline' && d?.ready > 0 && (
        <div className="alert warning" role="status">{d.ready} Einträge sind produktiv – bitte prüfen und ins Handbuch übernehmen.</div>
      )}
      {area === 'intern' && (
        <div className="tabs" role="tablist" aria-label="Themen">
          <button type="button" role="tab" aria-selected={!topic} className={!topic ? 'active' : ''} onClick={() => setTopic('')}>Alle</button>
          {TOPICS.map((t) => (
            <button type="button" key={t} role="tab" aria-selected={topic === t} className={topic === t ? 'active' : ''} onClick={() => setTopic(t)}>
              {d?.topicLabels?.[t] ?? t} ({d?.topicCounts?.[t] ?? 0})
            </button>
          ))}
        </div>
      )}
      {!d ? null : !d.items.length ? (
        <Card><Empty>{area === 'intern' ? 'Noch keine internen Einträge.' : 'Noch keine Einträge. Jira-Export (XML oder CSV) unter „Quellen“ einlesen und „Aus Jira-Tickets abgleichen“ wählen.'}</Empty></Card>
      ) : area === 'pipeline' ? (
        <>
          {d.groups.map((g: any) => (
            <Card key={g.chapterId} title={g.chapterTitle}>
              {g.items.length > 0 && <ItemTable items={g.items.map((id: string) => byId.get(id))} area={area} onEdit={setEdit} />}
              {g.subchapters.map((s: any) => (
                <section key={s.id} className="wa-sub">
                  <h3>{s.title}</h3>
                  <ItemTable items={s.items.map((id: string) => byId.get(id))} area={area} onEdit={setEdit} />
                </section>
              ))}
            </Card>
          ))}
          {d.unassigned.length > 0 && (
            <Card title="Ohne Zuordnung zur Gliederung">
              <ItemTable items={d.unassigned.map((id: string) => byId.get(id))} area={area} onEdit={setEdit} />
            </Card>
          )}
        </>
      ) : (
        <Card><ItemTable items={d.items} area={area} onEdit={setEdit} /></Card>
      )}
      {edit && <Editor item={edit} outline={d?.outline ?? []} topicLabels={d?.topicLabels ?? {}} canEdit={canEdit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); r.reload(); }} />}
    </Page>
  );
}

function ItemTable({ items, area, onEdit }: { items: any[]; area: Area; onEdit: (i: any) => void }) {
  return (
    <table className="table compact">
      <thead>
        <tr>
          {area !== 'intern' && <th>Ticket</th>}<th>Titel</th>{area === 'intern' && <th>Thema</th>}<th>Erstelldatum</th>
          {area !== 'intern' && <><th>Stream</th><th>Produktionsdatum</th><th>Status (Jira)</th></>}<th>Dokumentation</th><th />
        </tr>
      </thead>
      <tbody>
        {items.filter(Boolean).map((i) => (
          <tr key={i.id} className={i.state === 'cancelled' ? 'muted' : undefined}>
            {area !== 'intern' && <td>{i.jiraKey ?? '–'}</td>}
            <td>{i.title}{i.chapterSource === 'suggested' && <span className="tag small" title="Kapitel aus dem Titelvergleich – bitte bestätigen">Vorschlag</span>}</td>
            {area === 'intern' && <td>{i.topicLabel}</td>}
            <td>{de(i.createdOn)}</td>
            {area !== 'intern' && <><td>{i.stream ?? '–'}</td><td>{de(i.productionDate)}</td><td>{i.jiraStatus ?? '–'}</td></>}
            <td><span className={`tag wa-${i.state}`}>{i.stateLabel}</span></td>
            <td><button type="button" className="btn small ghost" aria-label={`${i.title} bearbeiten`} onClick={() => onEdit(i)}>Bearbeiten</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Editor({ item, outline, topicLabels, canEdit, onClose, onSaved }: { item: any; outline: any[]; topicLabels: Record<string, string>; canEdit: boolean; onClose: () => void; onSaved: () => void }) {
  const { notify } = useApp();
  const isNew = !item.id;
  const locked = item.state === 'live' || !canEdit;
  const [f, setF] = useState({
    area: item.area, topic: item.topic ?? 'testing', title: item.title ?? '', jiraKey: item.jiraKey ?? '', stream: item.stream ?? '', createdOn: item.createdOn ?? '',
    productionDate: item.productionDate ?? '', place: item.subchapterId ? `s:${item.subchapterId}` : item.chapterId ? `c:${item.chapterId}` : '', text: item.text ?? '',
  });
  const [privacy, setPrivacy] = useState<string[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const body = (pseudonymize = false) => ({
    area: f.area, topic: f.area === 'intern' ? f.topic : null, title: f.title, ...(item.origin === 'jira' ? {} : { jiraKey: f.jiraKey || null }),
    stream: f.stream, createdOn: f.createdOn || null, productionDate: f.productionDate || null,
    chapterId: f.place.startsWith('c:') ? f.place.slice(2) : f.place ? undefined : null, subchapterId: f.place.startsWith('s:') ? f.place.slice(2) : null,
    text: f.text, ...(pseudonymize ? { pseudonymize: true } : {}),
  });
  const save = async (pseudonymize = false) => {
    try {
      if (isNew) await post('/work-areas', body(pseudonymize));
      else await patch(`/work-areas/${item.id}`, body(pseudonymize));
      notify(isNew ? 'Eintrag angelegt.' : 'Eintrag gespeichert.');
      onSaved();
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && e.problem?.hits) {
        setPrivacy(e.problem.hits.map((h: any) => `${h.kind}: ${h.match}`));
        return;
      }
      setErr(errorText(e));
    }
  };
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      onSaved();
    } catch (e) {
      setErr(errorText(e));
    }
  };
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={isNew ? 'Neuer Eintrag' : `${item.jiraKey ? `${item.jiraKey} – ` : ''}${item.title}`} onClose={onClose} wide>
      <ErrorBox error={err} />
      {item.state === 'live' && <p className="alert info">Ins Handbuch übernommen am {new Date(item.liveAt).toLocaleDateString('de-DE')} – Änderungen bitte im Kapitel.</p>}
      <div className="filters">
        <label>Bereich
          <select value={f.area} disabled={locked} onChange={set('area')}>
            <option value="pipeline">Pipeline</option><option value="backlog">Backlog</option><option value="intern">Intern</option>
          </select>
        </label>
        {f.area === 'intern' && (
          <label>Thema
            <select value={f.topic} disabled={locked} onChange={set('topic')}>{TOPICS.map((t) => <option key={t} value={t}>{topicLabels[t] ?? t}</option>)}</select>
          </label>
        )}
        <label className="grow">Titel <input value={f.title} disabled={locked} maxLength={200} onChange={set('title')} /></label>
        <label>Ticket <input value={f.jiraKey} disabled={locked || item.origin === 'jira'} placeholder="ONESCM-123" size={14} onChange={set('jiraKey')} /></label>
        <label>Erstelldatum <input type="date" value={f.createdOn} disabled={locked} onChange={set('createdOn')} /></label>
        {f.area !== 'intern' && <>
          <label>Stream <input value={f.stream} disabled={locked} maxLength={80} onChange={set('stream')} /></label>
          <label>Produktionsdatum <input type="date" value={f.productionDate} disabled={locked} onChange={set('productionDate')} /></label>
          <label className="grow">Gliederung
            <select value={f.place} disabled={locked} onChange={set('place')}>
              <option value="">– ohne Zuordnung –</option>
              {outline.map((c) => [
                <option key={c.chapterId} value={`c:${c.chapterId}`}>{c.chapterTitle}</option>,
                ...c.subchapters.map((s: any) => <option key={s.id} value={`s:${s.id}`}>{'  '}{s.title}</option>),
              ])}
            </select>
          </label>
        </>}
      </div>
      {item.jiraStatus && <p className="small muted">Status in Jira: {item.jiraStatus}{item.chapterSource === 'suggested' ? ' · Gliederung aus dem Titelvergleich vorgeschlagen – bitte prüfen' : ''}</p>}
      <label className="block">{f.area === 'intern' ? 'Inhalt (Markdown)' : 'Dokumentation (Markdown) – bereits vorab schreiben, übernommen wird erst, wenn das Ticket produktiv ist'}
        <textarea rows={10} value={f.text} disabled={locked} onChange={set('text')} />
      </label>
      {privacy && (
        <div className="alert warning" role="alert">
          Mögliche personenbezogene Daten: {privacy.join(', ')}. Bitte entfernen oder pseudonymisieren.
          <button type="button" className="btn small" onClick={() => void save(true)}>Pseudonymisiert speichern</button>
        </div>
      )}
      {canEdit && (
        <div className="row-actions">
          {!locked && <button type="button" className="btn primary" disabled={f.title.trim().length < 3} onClick={() => void save()}>Speichern</button>}
          {!isNew && item.area === 'pipeline' && !locked && item.state !== 'cancelled' && (
            <button type="button" className="btn" disabled={!item.text?.trim() || !item.chapterId}
              title={!item.chapterId ? 'Zuerst Gliederung zuordnen und speichern' : !item.text?.trim() ? 'Zuerst Dokumentation schreiben und speichern' : undefined}
              onClick={() => { if (window.confirm('Ist das Ticket produktiv? Die Dokumentation wird als Quelle des Kapitels eingelesen (Evidenz unbestätigt).')) void act(() => post(`/work-areas/${item.id}/go-live`, {}), 'Ins Handbuch übernommen – als Quelle des Kapitels eingelesen.'); }}>
              Ins Handbuch übernehmen
            </button>
          )}
          {!isNew && !locked && item.state !== 'cancelled' && <button type="button" className="btn ghost" onClick={() => void act(() => patch(`/work-areas/${item.id}`, { state: 'cancelled' }), 'Auf „abgebrochen“ gesetzt.')}>Abgebrochen</button>}
          {!isNew && item.state === 'cancelled' && canEdit && <button type="button" className="btn ghost" onClick={() => void act(() => patch(`/work-areas/${item.id}`, { state: 'open' }), 'Wieder aufgenommen.')}>Wieder aufnehmen</button>}
          {!isNew && item.origin === 'manual' && item.state !== 'live' && (
            <button type="button" className="btn ghost danger" onClick={() => { if (window.confirm('Eintrag löschen?')) void act(() => api('DELETE', `/work-areas/${item.id}`), 'Eintrag gelöscht.'); }}>Löschen</button>
          )}
          <button type="button" className="btn" onClick={onClose}>Schließen</button>
        </div>
      )}
    </Modal>
  );
}
