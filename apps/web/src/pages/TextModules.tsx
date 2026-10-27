// Textbausteine (ADR-107, W-11, Single Sourcing): wiederkehrende Absätze einmal pflegen, in Kapitel einfügen und neue
// Fassungen in die Entwürfe der Kapitel übernehmen
import { useState } from 'react';
import { patch, post } from '../api';
import { Gated, Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

const KINDS: [string, string][] = [['paragraph', 'Absatz'], ['note', 'Hinweis'], ['tip', 'Tipp'], ['warning', 'Warnung'], ['list', 'Liste'], ['table', 'Tabelle']];
const SECTIONS: [string, string][] = [['purpose', 'Zweck'], ['prerequisites', 'Voraussetzungen'], ['steps', 'Schrittweise Durchführung'], ['result', 'Ergebnis und Systemstatus'], ['hints', 'Hinweise, Tipps und Warnungen'], ['troubleshooting', 'Fehlerbehebung']];
const STATUS_DE: Record<string, string> = { draft: 'Entwurf', in_review: 'eingereicht', approved: 'freigegeben' };

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((p) => p === 'edit' || p === 'admin');
}

function ModuleDetail({ id, canEdit, onChange }: { id: string; canEdit: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const d = useLoad<any>(`/text-modules/${id}`, [id]);
  const chapters = useLoad<any[]>('/chapters');
  const [text, setText] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [section, setSection] = useState('hints');
  if (!d.data) return <ErrorBox error={d.error} />;
  const m = d.data;
  const run = async (fn: () => Promise<any>, msg: (r: any) => string) => {
    try {
      const r = await fn();
      notify(msg(r));
      d.reload();
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const current = text ?? m.text;
  return (
    <Card title={<>{m.title} <span className="muted small">„{m.key}“ · Fassung {m.versionNo}{m.status === 'retired' ? ' · abgelegt' : ''}</span></>}>
      {canEdit ? (
        <>
          <label className="block">Text des Bausteins (Markdown)<textarea rows={5} value={current} onChange={(e) => setText(e.target.value)} /></label>
          <div className="form-row">
            <label className="grow">Änderungsnotiz <input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="z. B. Sitzungsdauer geändert" /></label>
            <button type="button" className="btn primary" disabled={current.trim() === m.text.trim()} onClick={() => void run(() => patch(`/text-modules/${id}`, { text: current, note }), (r) => `Neue Fassung ${r.versionNo} gespeichert.`).then(() => (setText(null), setNote('')))}>Neue Fassung speichern</button>
            <button type="button" className="btn" onClick={() => void run(() => patch(`/text-modules/${id}`, { status: m.status === 'active' ? 'retired' : 'active' }), () => (m.status === 'active' ? 'Textbaustein abgelegt.' : 'Textbaustein wieder aktiv.'))}>{m.status === 'active' ? 'Ablegen' : 'Wieder aktivieren'}</button>
          </div>
        </>
      ) : <div className="md-text"><Md text={m.text} /></div>}

      <h3>Verwendung</h3>
      {!m.usage.length ? <Empty>In keinem Kapitel verknüpft.</Empty> : (
        <div className="table-wrap" role="region" aria-label="Verwendung" tabIndex={0}>
          <table className="table compact">
            <caption className="sr-only">Kapitel mit diesem Textbaustein</caption>
            <thead><tr><th scope="col">Kapitel</th><th scope="col">Version</th><th scope="col">Absätze</th><th scope="col">Stand</th></tr></thead>
            <tbody>{m.usage.map((u: any) => (
              <tr key={u.chapterId}><td>{u.title}</td><td>{u.versionNo} ({STATUS_DE[u.status] ?? u.status})</td><td>{u.blocks}</td>
                <td>{u.outdated ? <span className="tag sev-medium">veraltet (Fassung {Math.min(...u.moduleVersions)})</span> : <span className="tag st-approved">aktuell</span>}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {m.candidates.length > 0 && <p className="small">Gleicher Text, noch nicht verknüpft: {m.candidates.map((c: any) => c.title).join(', ')}</p>}
      {canEdit && (m.outdatedChapters > 0 || m.candidates.length > 0) && (
        <div className="row-actions">
          {m.outdatedChapters > 0 && <button type="button" className="btn primary" onClick={() => void run(() => post(`/text-modules/${id}/propagate`, {}), (r) => `Fassung ${r.version} in ${r.updated.length} Kapitel übernommen${r.skipped.length ? `, ${r.skipped.length} übersprungen (eingereicht)` : ''}.`)}>In Kapitel aktualisieren ({m.outdatedChapters})</button>}
          {m.candidates.length > 0 && <button type="button" className="btn" onClick={() => void run(() => post(`/text-modules/${id}/propagate`, { adopt: true }), (r) => `${r.updated.length} Kapitel verknüpft und aktualisiert.`)}>Gleiche Absätze verknüpfen ({m.candidates.length})</button>}
        </div>
      )}
      <p className="small muted">Aktualisiert wird in einen Entwurf des Kapitels; ist es freigegeben, entsteht der Entwurf als Kopie. Eingereichte Kapitel werden übersprungen.</p>

      {canEdit && m.status === 'active' && (
        <>
          <h3>In Kapitel einfügen</h3>
          <div className="form-row">
            <label className="grow">Kapitel
              <select value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
                <option value="">– wählen –</option>
                {(chapters.data ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </label>
            <label>Abschnitt <select value={section} onChange={(e) => setSection(e.target.value)}>{SECTIONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <button type="button" className="btn" disabled={!chapterId} onClick={() => void run(() => post(`/text-modules/${id}/insert`, { chapterId, section }), () => 'Textbaustein eingefügt (Entwurf).')}>Einfügen</button>
          </div>
        </>
      )}
      <h3>Fassungen</h3>
      <ol className="small" reversed>{m.versions.map((v: any) => <li key={v.versionNo}>Fassung {v.versionNo} · {new Date(v.createdAt).toLocaleString('de-DE')}{v.note ? ` · ${v.note}` : ''}</li>)}</ol>
    </Card>
  );
}

export function TextModulesPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const list = useLoad<any[]>('/text-modules');
  const cands = useLoad<any[]>('/text-modules/candidates');
  const [sel, setSel] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', key: '', kind: 'paragraph', text: '' });
  const create = async (body: Record<string, string>) => {
    try {
      const r = await post<any>('/text-modules', body);
      notify(`Textbaustein „${r.key}“ angelegt.`);
      setForm({ title: '', key: '', kind: 'paragraph', text: '' });
      list.reload();
      cands.reload();
      setSel(r.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const reload = () => (list.reload(), cands.reload());
  return (
    <Page title="Textbausteine" subtitle="Wiederkehrende Absätze einmal pflegen und in allen Kapiteln gleich halten (Single Sourcing)">
      <div className="grid2">
        <Card title="Textbausteine">
          <ErrorBox error={list.error} />
          {!list.data?.length ? <Empty>Noch keine Textbausteine.</Empty> : (
            <ul className="plain" aria-label="Textbausteine">
              {list.data.map((m) => (
                <li key={m.id}>
                  <button type="button" className="linklike" aria-pressed={sel === m.id} onClick={() => setSel(m.id)}>{m.title}</button>
                  <span className="muted small"> „{m.key}“ · F{m.versionNo} · {m.chapters} Kapitel</span>
                  {m.outdatedChapters > 0 && <span className="tag sev-medium"> {m.outdatedChapters} veraltet</span>}
                  {m.status === 'retired' && <span className="tag"> abgelegt</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
        {canEdit && (
          <Card title="Neuer Textbaustein">
            <div className="form-row">
              <label className="grow">Titel <input value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <label>Kennung <input value={form.key} maxLength={60} placeholder="aus dem Titel" onChange={(e) => setForm({ ...form, key: e.target.value })} /></label>
              <label>Art <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{KINDS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            </div>
            <label className="block">Text (Markdown)<textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></label>
            <Gated type="button" className="btn primary" missing={[!form.title.trim() && 'Titel', !form.text.trim() && 'Text']} onClick={() => void create(form)}>Anlegen</Gated>
          </Card>
        )}
      </div>
      {sel && <ModuleDetail id={sel} canEdit={canEdit} onChange={reload} />}
      <Card title="Wiederkehrende Absätze">
        <p className="small muted">Gleicher Text in mindestens zwei Kapiteln – Kandidaten für einen Textbaustein.</p>
        {!cands.data?.length ? <Empty>Keine wiederkehrenden Absätze gefunden.</Empty> : (
          <ul className="plain" aria-label="Wiederkehrende Absätze">
            {cands.data.map((c, i) => (
              <li key={i}>
                <div className="md-text small"><Md text={c.text} /></div>
                <span className="small muted">in {c.chapters.length} Kapiteln: {c.chapters.map((x: any) => x.title).join(', ')}</span>
                {canEdit && <button type="button" className="btn small" onClick={() => void create({ title: c.text.replace(/[*_`]/g, '').split(/[.!?]/)[0].slice(0, 60), kind: c.kind === 'list' ? 'list' : c.kind, text: c.text })}>Als Textbaustein anlegen</button>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Page>
  );
}
