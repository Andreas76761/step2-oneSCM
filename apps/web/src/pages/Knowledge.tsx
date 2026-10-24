import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { del, patch, post } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Kapitel ↔ Quellen (F-14) und Wissensnotizen (F-15), ADR-084

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
}

export function OutlineSourcesPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const cov = useLoad<any>('/metadata/outline-coverage');
  const [id, setId] = useState<string | null>(null);
  const view = useLoad<any>(id ? `/metadata/outline/${id}` : null, [id]);
  useEffect(() => {
    if (!id && cov.data?.items.length) setId((cov.data.items.find((i: any) => i.chunks || i.suggestions) ?? cov.data.items[0]).id);
  }, [cov.data, id]);
  const assign = async (snippetId: string) => {
    try {
      await post('/metadata/chunks/labels', { snippetIds: [snippetId], add: [id] });
      notify('Dem Gliederungspunkt zugeordnet.');
      view.reload();
      cov.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const v = view.data;
  return (
    <Page title="Kapitel ↔ Quellen" subtitle="Je Punkt der Gesamtgliederung: das Handbuchkapitel links, die zugeordneten Quellen rechts – mit Vorschlägen aus nicht zugeordneten Chunks">
      <ErrorBox error={cov.error ?? view.error} />
      {cov.data && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Chunks</span><strong>{cov.data.chunks}</strong></div>
          <div className="stat"><span className="muted small">ohne Gliederungspunkt</span><strong>{cov.data.unassigned}</strong></div>
          <div className="stat"><span className="muted small">Vorschläge ab</span><strong>{Math.round(cov.data.minScore * 100)} %</strong></div>
        </div>
      )}
      <div className="oq-layout">
        <Card title="Gesamtgliederung">
          <ul className="oq-list" aria-label="Gliederungspunkte">
            {(cov.data?.items ?? []).map((i: any) => (
              <li key={i.id}>
                <button aria-current={i.id === id} onClick={() => setId(i.id)}>
                  <span>{i.nameDe}</span>
                  <span className="muted small">{i.chunks}{i.suggestions ? ` +${i.suggestions}` : ''}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="small muted">Zahl = zugeordnete Chunks, „+n“ = Vorschläge.</p>
        </Card>
        <div>
          {v && (
            <Card title={<>{v.outline.nameDe} <span className="muted small"><code>{v.outline.folder}</code></span></>}>
              <div className="stat-row">
                <div className="stat"><span className="muted small">Handbuchkapitel</span><strong>{v.summary.chapters}</strong></div>
                <div className="stat"><span className="muted small">Quellen</span><strong>{v.summary.chunks}</strong></div>
                <div className="stat"><span className="muted small">davon im Handbuch</span><strong>{v.summary.used}</strong></div>
                <div className="stat"><span className="muted small">noch nicht verwendet</span><strong>{v.summary.unused}</strong></div>
              </div>
              <div className="oq-cols">
                <section aria-label="Handbuch">
                  <h3>Handbuch</h3>
                  {!v.handbook.length ? <Empty>Kein Handbuchkapitel zu diesem Gliederungspunkt. Kapitel mit gleichem Titel oder auf Grundlage der zugeordneten Quellen erscheinen hier.</Empty> : v.handbook.map((h: any) => (
                    <div key={h.chapterId}>
                      <h4><Link to={`/werkstatt/${h.chapterId}`}>{h.title}</Link> <span className="muted small">{h.version ? `Version ${h.version.versionNo} · ${h.version.status}` : 'noch nicht generiert'} · {h.match === 'title' ? 'gleicher Titel' : 'über Quellen'}</span></h4>
                      {h.blocks.slice(0, 40).map((b: any) => <p key={b.id} className="oq-block md-text small">{b.text}</p>)}
                    </div>
                  ))}
                </section>
                <section aria-label="Quellen">
                  <h3>Quellen</h3>
                  {!v.chunks.length ? <Empty>Noch keine Chunks zugeordnet.</Empty> : v.chunks.map((c: any) => (
                    <div key={c.id} className={`oq-chunk${c.usedInHandbook ? ' used' : ''}`}>
                      <div className="small muted">{c.path} · {[c.chapter, c.subchapter].filter(Boolean).join(' › ')} {c.usedInHandbook ? <span className="tag">im Handbuch</span> : <span className="tag sev-medium">nicht verwendet</span>}</div>
                      <p className="md-text small">{c.text}</p>
                    </div>
                  ))}
                  {v.suggestions.length > 0 && (
                    <>
                      <h4>Vorschläge <span className="muted small">(nie automatisch übernommen)</span></h4>
                      {v.suggestions.map((c: any) => (
                        <div key={c.id} className="oq-chunk">
                          <div className="small muted">{c.path} · {Math.round(c.score * 100)} % · Treffer: {c.matched.join(', ')}</div>
                          <p className="md-text small">{c.text}</p>
                          {canEdit && <button className="btn small" aria-label={`Chunk #${c.seq} zuordnen`} onClick={() => assign(c.id)}>Zuordnen</button>}
                        </div>
                      ))}
                    </>
                  )}
                </section>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}

const ROLES = [['dealer', 'Dealer'], ['market', 'Markt'], ['mo', 'MO'], ['hq', 'HQ'], ['all', 'Alle']];
const DIVISIONS = [['car', 'Pkw'], ['van', 'Van'], ['all', 'Pkw und Van']];
const EMPTY = { question: '', insight: '', roles: ['all'], divisions: ['all'], confirmed: false, imageAlt: '', pseudonymize: false };

const readFile = (f: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = () => reject(r.error);
  r.readAsDataURL(f);
});

export function KnowledgeNotesPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const notes = useLoad<any[]>('/knowledge-notes');
  const [form, setForm] = useState<any>(EMPTY);
  const [image, setImage] = useState<{ name: string; data: string } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [hits, setHits] = useState<any[] | null>(null);
  const toggle = (k: 'roles' | 'divisions', v: string) => setForm({ ...form, [k]: form[k].includes(v) ? form[k].filter((x: string) => x !== v) : [...form[k], v] });
  const save = async () => {
    try {
      const body = { ...form, ...(image ? { image } : {}), imageAlt: form.imageAlt || undefined };
      if (editId) await patch(`/knowledge-notes/${editId}`, body);
      else await post('/knowledge-notes', body);
      notify(editId ? 'Notiz geändert – neue Revision eingelesen.' : 'Notiz gespeichert und als Quelle eingelesen.');
      setForm(EMPTY);
      setImage(null);
      setEditId(null);
      setHits(null);
      notes.reload();
    } catch (e: any) {
      setHits(e?.problem?.hits ?? null);
      notify(errorText(e), 'error');
    }
  };
  return (
    <Page title="Wissensnotizen" subtitle="Frage, Erkenntnis und Screenshot als eigene Quelle – mit Revisionen, durchsuchbar und labelbar wie jede Quelldatei">
      <ErrorBox error={notes.error} />
      {canEdit && (
        <Card title={editId ? 'Notiz ändern' : 'Neue Notiz'}>
          <label className="block">Frage bzw. Titel <input value={form.question} maxLength={300} onChange={(e) => setForm({ ...form, question: e.target.value })} /></label>
          <label className="block">Erkenntnis <textarea id="kn-insight" rows={5} value={form.insight} onChange={(e) => setForm({ ...form, insight: e.target.value })} /></label>
          <fieldset className="filters"><legend className="small">Rollen</legend>
            {ROLES.map(([v, t]) => <label key={v} className="small"><input type="checkbox" checked={form.roles.includes(v)} onChange={() => toggle('roles', v)} /> {t}</label>)}
          </fieldset>
          <fieldset className="filters"><legend className="small">Sparten</legend>
            {DIVISIONS.map(([v, t]) => <label key={v} className="small"><input type="checkbox" checked={form.divisions.includes(v)} onChange={() => toggle('divisions', v)} /> {t}</label>)}
          </fieldset>
          <div className="filters">
            <label className="block">Screenshot (PNG, JPEG, GIF, WebP bis 5 MB)
              <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={async (e) => { const f = e.target.files?.[0]; setImage(f ? { name: f.name, data: await readFile(f) } : null); }} />
            </label>
            <label className="grow">Alternativtext <input value={form.imageAlt} placeholder="Was zeigt der Screenshot?" onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} /></label>
          </div>
          <div className="filters">
            <label className="small"><input type="checkbox" checked={form.confirmed} onChange={(e) => setForm({ ...form, confirmed: e.target.checked })} /> fachlich bestätigt</label>
            <label className="small"><input type="checkbox" checked={form.pseudonymize} onChange={(e) => setForm({ ...form, pseudonymize: e.target.checked })} /> personenbezogene Daten pseudonymisieren</label>
          </div>
          {hits && <p className="alert warning">Mögliche personenbezogene Daten: {hits.map((h) => `${h.kind} „${h.match}“`).join(', ')}</p>}
          <div className="filters">
            <button className="btn primary" disabled={form.question.trim().length < 5 || form.insight.trim().length < 5 || !form.roles.length || !form.divisions.length} onClick={save}>{editId ? 'Ändern' : 'Speichern'}</button>
            {editId && <button className="btn ghost" onClick={() => { setEditId(null); setForm(EMPTY); setImage(null); }}>Abbrechen</button>}
          </div>
        </Card>
      )}
      <Card title={`Notizen (${notes.data?.length ?? 0})`}>
        {!notes.data?.length ? <Empty>Noch keine Wissensnotizen.</Empty> : (
          <ul className="rl-findings">
            {notes.data.map((n) => (
              <li key={n.id}>
                <strong>{n.question}</strong> {n.confirmed ? <span className="tag">bestätigt</span> : <span className="tag sev-medium">unbestätigt</span>}
                {n.image && <span className="tag" title={n.image.alt}>🖼 Screenshot</span>}
                <div className="small muted">{n.roles.join(', ')} · {n.divisions.join(', ')} · Revision {n.revisions} · {n.chunks} Chunks · <Link to={`/metadaten/chunks`}>{n.path}</Link></div>
                <p className="md-text small">{n.insight}</p>
                {canEdit && (
                  <div className="filters">
                    <button className="btn small" onClick={() => { setEditId(n.id); setForm({ question: n.question, insight: n.insight, roles: n.roles, divisions: n.divisions, confirmed: n.confirmed, imageAlt: n.image?.alt ?? '', pseudonymize: false }); setImage(null); }}>Bearbeiten</button>
                    <button className="btn small ghost" onClick={async () => {
                      try {
                        await del(`/knowledge-notes/${n.id}`);
                        notify('Notiz entfernt – die Quelle gilt als entfernt.');
                        notes.reload();
                      } catch (e) {
                        notify(errorText(e), 'error');
                      }
                    }}>Entfernen</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Page>
  );
}
