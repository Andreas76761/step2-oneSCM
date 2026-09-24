// Stammdaten › Inhaltsverzeichnis (ADR-032): Gliederungen je Variante (Rolle, Sparte, Blueprint oder Märkte),
// Versionen speichern, hochladen, bearbeiten, erweitern, exportieren
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { currentProjectId, del, download, patch, post } from '../api';
import { Card, Empty, ErrorBox, Modal, Page, errorText, useApp, useLoad } from '../components/ui';

export const SCOPE_LABEL: Record<string, string> = { blueprint: 'Blueprint', markets: 'Märkte' };
const STATUS_LABEL: Record<string, string> = { draft: 'Entwurf', active: 'aktiv', archived: 'archiviert' };

/** Variante als lesbare Kurzform: „Dealer · PKW · Blueprint“ */
export function variantText(o: { roles: string[]; divisions: string[]; marketScope: string; markets: string[] }, ref: ReturnType<typeof useApp>['ref']) {
  const roles = o.roles.length ? o.roles.map((r) => ref?.roles.find((x) => x.code === r)?.label ?? r).join(', ') : 'alle Rollen';
  const divisions = o.divisions.length ? o.divisions.map((d) => ref?.divisions.find((x) => x.code === d)?.label ?? d).join(', ') : 'alle Sparten';
  return `${roles} · ${divisions} · ${o.marketScope === 'markets' ? `Märkte ${o.markets.join(', ')}` : 'Blueprint'}`;
}

interface VariantForm {
  name: string;
  description: string;
  roles: string[];
  divisions: string[];
  marketScope: 'blueprint' | 'markets';
  markets: string[];
}

function VariantFields({ form, setForm, markets }: { form: VariantForm; setForm: (f: VariantForm) => void; markets: string[] }) {
  const { ref } = useApp();
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  return (
    <>
      <label className="block">Name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="z. B. Händlerhandbuch Pkw" /></label>
      <label className="block">Beschreibung <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <fieldset className="checks">
        <legend>Rollen (keine Auswahl = alle)</legend>
        {ref?.roles.filter((r) => r.code !== 'all').map((r) => (
          <label key={r.code} className="inline"><input type="checkbox" checked={form.roles.includes(r.code)} onChange={() => setForm({ ...form, roles: toggle(form.roles, r.code) })} /> {r.icon} {r.label}</label>
        ))}
      </fieldset>
      <fieldset className="checks">
        <legend>Sparten (keine Auswahl = alle)</legend>
        {ref?.divisions.filter((d) => d.code !== 'all').map((d) => (
          <label key={d.code} className="inline"><input type="checkbox" checked={form.divisions.includes(d.code)} onChange={() => setForm({ ...form, divisions: toggle(form.divisions, d.code) })} /> {d.icon} {d.label}</label>
        ))}
      </fieldset>
      <fieldset className="checks">
        <legend>Marktbezug</legend>
        <label className="inline"><input type="radio" name="scope" checked={form.marketScope === 'blueprint'} onChange={() => setForm({ ...form, marketScope: 'blueprint', markets: [] })} /> Blueprint (marktneutral)</label>
        <label className="inline"><input type="radio" name="scope" checked={form.marketScope === 'markets'} onChange={() => setForm({ ...form, marketScope: 'markets', markets: form.markets.length ? form.markets : markets })} /> Märkte</label>
        {form.marketScope === 'markets' && (
          <div role="group" aria-label="Märkte">
            {markets.map((m) => <label key={m} className="inline"><input type="checkbox" checked={form.markets.includes(m)} onChange={() => setForm({ ...form, markets: toggle(form.markets, m) })} /> {m}</label>)}
          </div>
        )}
      </fieldset>
    </>
  );
}

const emptyForm = (): VariantForm => ({ name: '', description: '', roles: [], divisions: [], marketScope: 'blueprint', markets: [] });

function CreateOutline({ markets, onDone, onClose }: { markets: string[]; onDone: (id: string) => void; onClose: () => void }) {
  const { notify } = useApp();
  const [form, setForm] = useState<VariantForm>(emptyForm());
  const [start, setStart] = useState<'empty' | 'chapters' | 'upload'>('chapters');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const create = async () => {
    setError(null);
    try {
      const body: Record<string, unknown> = { ...form, description: form.description || null };
      if (start === 'chapters') body.fromChapters = true;
      if (start === 'upload') {
        if (!file) return setError('Bitte eine Datei wählen.');
        body.content = await file.text();
        body.format = /\.json$/i.test(file.name) ? 'json' : 'markdown';
        if (!form.name.trim()) body.name = undefined;
      }
      const o = await post('/outlines', body);
      notify(`Gliederung „${o.name}“ angelegt (${o.nodes.length} Einträge).`);
      onDone(o.id);
    } catch (e) {
      setError(errorText(e));
    }
  };
  return (
    <Modal title="Gliederung anlegen" onClose={onClose} wide>
      <VariantFields form={form} setForm={setForm} markets={markets} />
      <fieldset className="checks">
        <legend>Ausgangspunkt</legend>
        <label className="inline"><input type="radio" name="start" checked={start === 'chapters'} onChange={() => setStart('chapters')} /> aktuelle Kapitelstruktur der Quellen</label>
        <label className="inline"><input type="radio" name="start" checked={start === 'empty'} onChange={() => setStart('empty')} /> leer</label>
        <label className="inline"><input type="radio" name="start" checked={start === 'upload'} onChange={() => setStart('upload')} /> Datei hochladen</label>
        {start === 'upload' && (
          <label className="block">Gliederungsdatei (.md mit # / ## bzw. 1. / 1.1, oder .json aus dem Export)
            <input type="file" accept=".md,.markdown,.txt,.json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        )}
      </fieldset>
      <ErrorBox error={error} />
      <div className="actions">
        <button className="btn primary" disabled={!form.name.trim() && start !== 'upload'} onClick={create}>Anlegen</button>
        <button className="btn" onClick={onClose}>Abbrechen</button>
      </div>
    </Modal>
  );
}

function MarketsEditor({ markets, onSaved }: { markets: string[]; onSaved: () => void }) {
  const { notify } = useApp();
  const [value, setValue] = useState(markets.join(', '));
  return (
    <form className="filters" onSubmit={async (e) => {
      e.preventDefault();
      try {
        await patch(`/projects/${currentProjectId()}`, { markets: value.split(/[\s,;]+/).filter(Boolean) });
        notify('Märkte gespeichert.');
        onSaved();
      } catch (err) {
        notify(errorText(err), 'error');
      }
    }}>
      <label className="inline">Märkte des Projekts <input value={value} onChange={(e) => setValue(e.target.value)} aria-describedby="markets-hint" /></label>
      <button className="btn small" type="submit">Speichern</button>
      <span id="markets-hint" className="small muted">Marktcodes, durch Komma getrennt (Standard: DE, FR, IT, ES, GB, NL)</span>
    </form>
  );
}

export function OutlinesPage() {
  const { outlineId } = useParams();
  const navigate = useNavigate();
  const { ref, notify } = useApp();
  const list = useLoad<any>('/outlines');
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const isAdmin = !!me.data?.permissions.includes('admin');
  const selectedId = outlineId ?? list.data?.items.find((o: any) => o.status === 'active')?.id ?? list.data?.items[0]?.id ?? null;
  const detail = useLoad<any>(selectedId ? `/outlines/${selectedId}` : null, [selectedId]);
  const [creating, setCreating] = useState(false);
  const [editVariant, setEditVariant] = useState<VariantForm | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editing, setEditing] = useState<{ id: string; title: string } | null>(null);
  const o = detail.data;
  const run = async (fn: () => Promise<any>, msg?: string) => {
    try {
      const r = await fn();
      if (msg) notify(msg);
      detail.reload();
      list.reload();
      return r;
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page title="Inhaltsverzeichnis" subtitle="Gliederungen je Rolle, Sparte und Markt – versioniert, hochladbar, erweiterbar" actions={canEdit && <button className="btn primary" onClick={() => setCreating(true)}>Gliederung anlegen</button>}>
      <ErrorBox error={list.error} />
      {isAdmin && list.data && <Card title="Märkte"><MarketsEditor markets={list.data.markets} onSaved={list.reload} /></Card>}
      <div className="grid2">
        <Card title="Gliederungen">
          {list.data && !list.data.items.length ? <Empty>Noch keine Gliederung. „Gliederung anlegen“ übernimmt z. B. die aktuelle Kapitelstruktur oder eine hochgeladene Datei.</Empty> : (
            <ul className="outline-list">
              {list.data?.items.map((x: any) => (
                <li key={x.id}>
                  <Link to={`/stammdaten/inhaltsverzeichnis/${x.id}`} aria-current={x.id === selectedId ? 'true' : undefined}>
                    <strong>{x.name}</strong> <span className="tag">V{x.versionNo}</span> {x.status !== 'draft' && <span className="tag">{STATUS_LABEL[x.status]}</span>}
                  </Link>
                  <div className="small muted">{variantText(x, ref)} · {x.nodes} Einträge · {x.assigned} Schnipsel</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        {o && (
          <Card title={`${o.name} – Version ${o.versionNo}`} actions={<span className="tag">{STATUS_LABEL[o.status]}</span>}>
            <p className="small">{variantText(o, ref)}{o.description ? ` · ${o.description}` : ''}</p>
            <div className="row-actions">
              <Link className="btn small" to={`/draft-manual/${o.id}`}>Im Draft Manual öffnen</Link>
              <button className="btn small" onClick={() => download(`/api/v1/outlines/${o.id}/export?format=md`, 'gliederung.md').catch((e) => notify(errorText(e), 'error'))}>Export Markdown</button>
              <button className="btn small" onClick={() => download(`/api/v1/outlines/${o.id}/export?format=json`, 'gliederung.json').catch((e) => notify(errorText(e), 'error'))}>Export JSON</button>
              {canEdit && (
                <>
                  <button className="btn small" onClick={() => run(async () => navigate(`/stammdaten/inhaltsverzeichnis/${(await post(`/outlines/${o.id}/versions`, {})).id}`), 'Neue Version gespeichert.')}>Als neue Version speichern</button>
                  {o.status !== 'active' && <button className="btn small" onClick={() => run(() => patch(`/outlines/${o.id}`, { status: 'active' }), 'Version ist jetzt aktiv.')}>Aktiv setzen</button>}
                  <button className="btn small" onClick={() => setEditVariant({ name: o.name, description: o.description ?? '', roles: o.roles, divisions: o.divisions, marketScope: o.marketScope, markets: o.markets })}>Variante bearbeiten</button>
                  <button className="btn small danger" onClick={() => confirm(`Version ${o.versionNo} von „${o.name}“ löschen?`) && run(async () => { await del(`/outlines/${o.id}`); navigate('/stammdaten/inhaltsverzeichnis'); }, 'Gliederung gelöscht.')}>Löschen</button>
                </>
              )}
            </div>
            {o.versions.length > 1 && (
              <p className="small">Versionen: {o.versions.map((v: any) => (
                <Link key={v.id} className="tag" to={`/stammdaten/inhaltsverzeichnis/${v.id}`} aria-current={v.id === o.id ? 'true' : undefined}>V{v.versionNo}{v.status === 'active' ? ' (aktiv)' : ''}</Link>
              ))}</p>
            )}
            <ol className="outline-tree" aria-label="Gliederung">
              {o.nodes.map((n: any, i: number) => (
                <li key={n.id} className={`level-${n.level}`}>
                  <span className="num">{n.number}</span>
                  {editing && editing.id === n.id ? (
                    <form className="title" onSubmit={(e) => { e.preventDefault(); const title = editing.title; void run(() => patch(`/outline-nodes/${n.id}`, { title }), 'Umbenannt.').then(() => setEditing(null)); }}>
                      <input aria-label={`Titel von ${n.number}`} value={editing.title} onChange={(e) => setEditing({ id: n.id, title: e.target.value })} autoFocus />
                      <button className="btn small primary" type="submit">OK</button>
                    </form>
                  ) : <span className="title">{n.title} {n.snippets > 0 && <span className="small muted">({n.snippets})</span>}</span>}
                  {canEdit && editing?.id !== n.id && (
                    <span className="row-actions">
                      <button className="btn small" aria-label={`${n.title} umbenennen`} onClick={() => setEditing({ id: n.id, title: n.title })}>✎</button>
                      <button className="btn small" aria-label={`${n.title} nach oben`} onClick={() => run(() => patch(`/outline-nodes/${n.id}`, { move: 'up' }))}>↑</button>
                      <button className="btn small" aria-label={`${n.title} nach unten`} onClick={() => run(() => patch(`/outline-nodes/${n.id}`, { move: 'down' }))}>↓</button>
                      {n.level === 1 && <button className="btn small" aria-label={`Unterkapitel zu ${n.title} hinzufügen`} onClick={() => { const t = prompt(`Neues Unterkapitel in ${n.number} ${n.title}`); if (t?.trim()) void run(() => post(`/outlines/${o.id}/nodes`, { title: t, parentId: n.id }), 'Unterkapitel hinzugefügt.'); }}>+ Unterkapitel</button>}
                      {n.level === 2 && i > 0 && <button className="btn small" aria-label={`${n.title} zum Kapitel machen`} onClick={() => run(() => patch(`/outline-nodes/${n.id}`, { parentId: null }), 'Zum Kapitel gemacht.')}>⇤</button>}
                      <button className="btn small danger" aria-label={`${n.title} löschen`} onClick={() => confirm(`„${n.number} ${n.title}“${n.level === 1 ? ' mit Unterkapiteln' : ''} löschen? Zuordnungen werden gelöst.`) && run(() => del(`/outline-nodes/${n.id}`), 'Gelöscht.')}>✕</button>
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {!o.nodes.length && <Empty>Noch keine Einträge.</Empty>}
            {canEdit && (
              <form className="filters" onSubmit={(e) => (e.preventDefault(), newTitle.trim() && run(() => post(`/outlines/${o.id}/nodes`, { title: newTitle }), 'Kapitel hinzugefügt.').then(() => setNewTitle('')))}>
                <label className="inline">Neues Kapitel <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titel" /></label>
                <button className="btn small primary" type="submit" disabled={!newTitle.trim()}>Hinzufügen</button>
              </form>
            )}
          </Card>
        )}
      </div>
      {creating && list.data && <CreateOutline markets={list.data.markets} onClose={() => setCreating(false)} onDone={(id) => { setCreating(false); list.reload(); navigate(`/stammdaten/inhaltsverzeichnis/${id}`); }} />}
      {editVariant && o && (
        <Modal title="Variante bearbeiten" onClose={() => setEditVariant(null)} wide>
          <VariantFields form={editVariant} setForm={setEditVariant} markets={list.data?.markets ?? []} />
          <div className="actions">
            <button className="btn primary" onClick={() => run(() => patch(`/outlines/${o.id}`, { ...editVariant, description: editVariant.description || null }), 'Variante gespeichert.').then((r) => r && setEditVariant(null))}>Speichern</button>
            <button className="btn" onClick={() => setEditVariant(null)}>Abbrechen</button>
          </div>
        </Modal>
      )}
    </Page>
  );
}
