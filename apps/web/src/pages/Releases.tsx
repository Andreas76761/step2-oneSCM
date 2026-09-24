import { useState } from 'react';
import { download, post } from '../api';
import { Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

const CHANGE: Record<string, { label: string; cls: string }> = {
  new: { label: 'neu', cls: 'st-approved' },
  updated: { label: 'geändert', cls: 'st-in_review' },
  removed: { label: 'entfernt', cls: 'st-failed' },
  unchanged: { label: 'unverändert', cls: '' },
};

/** Handbuch-Releases (ADR-018): Stand aller freigegebenen Kapitel veröffentlichen, Änderungen und Online-Hilfe */
export function ReleasesPage() {
  const { notify } = useApp();
  const releases = useLoad<any[]>('/releases');
  const me = useLoad<any>('/me');
  const canPublish = !!me.data?.permissions.some((p: string) => p === 'approve' || p === 'admin');
  const [form, setForm] = useState({ version: '', title: 'oneSCM Benutzerhandbuch', notes: '' });
  const [open, setOpen] = useState<string | null>(null);
  const publish = async () => {
    try {
      const r = await post<any>('/releases', form);
      notify(`Version ${r.version} veröffentlicht (${r.chapters.length} Kapitel).`);
      setForm({ ...form, version: '', notes: '' });
      setOpen(r.id);
      releases.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const get = (id: string, format: 'site' | 'md', name: string) => download(`/api/v1/releases/${id}/download?format=${format}`, name).catch((e) => notify(errorText(e), 'error'));
  return (
    <Page title="Veröffentlichung" subtitle="Handbuch-Versionen aus allen freigegebenen Kapiteln – unveränderlich, mit Änderungsliste und Online-Hilfe">
      <ErrorBox error={releases.error} />
      {canPublish && (
        <Card title="Neue Version veröffentlichen">
          <div className="form-row">
            <label>Version <input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="z. B. 2026.1" aria-label="Versionsnummer" /></label>
            <label>Titel <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Titel des Handbuchs" /></label>
          </div>
          <label className="block">Einleitung / Hinweise (Markdown, optional)
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} aria-label="Einleitung" />
          </label>
          <p className="small muted">Enthalten sind alle Kapitel mit freigegebener Version. Offene Blocker- oder Datenschutzbefunde verhindern die Veröffentlichung.</p>
          <button className="btn primary" disabled={!form.version.trim()} onClick={publish}>Veröffentlichen</button>
        </Card>
      )}
      <Card title="Veröffentlichte Versionen">
        {!releases.data?.length ? <Empty>Noch keine Version veröffentlicht.</Empty> : (
          <ul className="release-list">
            {releases.data.map((r) => {
              const changed = r.changes.filter((c: any) => c.change !== 'unchanged');
              return (
                <li key={r.id}>
                  <div className="block-meta">
                    <strong>Version {r.version}</strong>
                    <span className="small muted">{r.title} · {new Date(r.createdAt).toLocaleString('de-DE')} · {r.createdBy} · {r.chapters.length} Kapitel · {changed.length} Änderungen</span>
                  </div>
                  <div className="row-actions">
                    <button className="btn small" onClick={() => get(r.id, 'site', `online-hilfe-${r.version}.zip`)}>Online-Hilfe (ZIP)</button>
                    <button className="btn small" onClick={() => get(r.id, 'md', `handbuch-${r.version}.md`)}>Markdown</button>
                    <button className="btn small ghost" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? 'Details ausblenden' : 'Änderungen anzeigen'}</button>
                  </div>
                  {open === r.id && (
                    <div className="release-detail">
                      {r.notes && <Md text={r.notes} />}
                      <table className="table compact">
                        <thead><tr><th>Kapitel</th><th>Änderung</th><th>Version</th><th>Absätze</th></tr></thead>
                        <tbody>
                          {r.changes.map((c: any) => (
                            <tr key={c.chapterId}>
                              <td>{c.title}</td>
                              <td><span className={`tag ${CHANGE[c.change].cls}`}>{CHANGE[c.change].label}</span></td>
                              <td>{c.fromVersionNo ?? '–'} → {c.toVersionNo ?? '–'}</td>
                              <td className="small">{c.summary ? `${c.summary.changed} geändert, ${c.summary.added} neu, ${c.summary.removed} entfernt, ${c.summary.moved} verschoben` : '–'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </Page>
  );
}
