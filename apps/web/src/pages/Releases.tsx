import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { download, post } from '../api';
import { Gated, Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

const CHANGE: Record<string, { label: string; cls: string }> = {
  new: { label: 'neu', cls: 'st-approved' },
  updated: { label: 'geändert', cls: 'st-in_review' },
  removed: { label: 'entfernt', cls: 'st-failed' },
  unchanged: { label: 'unverändert', cls: '' },
};

const IMAGE_CHANGE: Record<string, string> = { new: 'neues Bild', version: 'neue Fassung', removed: 'entfernt' };

/** Projektvergleich mit dem Vorgänger-Release und Releaseletter-Entwurf daraus (ADR-102, W-04) */
function ComparisonPanel({ id, canEdit }: { id: string; canEdit: boolean }) {
  const { notify } = useApp();
  const navigate = useNavigate();
  const c = useLoad<any>(`/releases/${id}/comparison`, [id]);
  if (!c.data) return <ErrorBox error={c.error} />;
  const d = c.data;
  return (
    <section aria-label="Projektvergleich" className="release-compare">
      <h4>Projektvergleich {d.from ? `mit Version ${d.from.version}` : '(erstes Release)'}</h4>
      <ul className="small">
        <li><strong>Neue Funktionen:</strong> {d.functions.added.length ? d.functions.added.map((f: any) => `„${f.title}“${f.parentTitle ? ` (${f.parentTitle})` : ''}`).join(', ') : '–'}</li>
        <li><strong>Geänderte Bilder:</strong> {d.images.length ? d.images.map((i: any) => `„${i.title}“ – ${IMAGE_CHANGE[i.change]}`).join(', ') : '–'}</li>
        <li><strong>Abgelöste Funktionen:</strong> {d.functions.superseded.length ? d.functions.superseded.map((f: any) => `„${f.title}“${f.replacedByTitle ? ` → „${f.replacedByTitle}“` : ''}`).join(', ') : '–'}</li>
        <li><strong>Tickets der Version:</strong> {d.tickets.length ? d.tickets.map((t: any) => t.key).join(', ') : '–'}</li>
      </ul>
      {canEdit && (
        <button className="btn small" onClick={async () => {
          try {
            const r = await post<any>('/release-letters/from-comparison', { releaseId: id });
            notify('Releaseletter-Entwurf aus dem Projektvergleich erzeugt.');
            navigate(`/releaseletter?letter=${encodeURIComponent(r.id)}`);
          } catch (e) {
            notify(errorText(e), 'error');
          }
        }}>Releaseletter-Entwurf erzeugen</button>
      )}
    </section>
  );
}

/** Handbuch-Releases (ADR-018): Stand aller freigegebenen Kapitel veröffentlichen, Änderungen und Online-Hilfe */
export function ReleasesPage() {
  const { notify } = useApp();
  const releases = useLoad<any[]>('/releases');
  const me = useLoad<any>('/me');
  const canPublish = !!me.data?.permissions.some((p: string) => p === 'approve' || p === 'admin');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const outlines = useLoad<any>('/outlines');
  const [form, setForm] = useState({ version: '', title: 'oneSCM Benutzerhandbuch', notes: '', outlineId: '' });
  const outlineName = (id: string | null) => outlines.data?.items.find((o: any) => o.id === id)?.name ?? null;
  const [open, setOpen] = useState<string | null>(null);
  const publish = async () => {
    try {
      const r = await post<any>('/releases', { ...form, outlineId: form.outlineId || undefined });
      // Zukunfts-Inhalte (W-09): Kapitel mit späterem „gültig ab“ kommen erst in ein späteres Release
      notify(`Version ${r.version} veröffentlicht (${r.chapters.length} Kapitel).${r.future?.length ? ` Nicht enthalten, da erst später gültig: ${r.future.map((f: any) => `„${f.title}“ (ab ${f.validFrom})`).join(', ')}.` : ''}`);
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
            <label>Handbuch
              <select value={form.outlineId} aria-label="Handbuch" onChange={(e) => setForm({ ...form, outlineId: e.target.value, title: outlineName(e.target.value) ?? 'oneSCM Benutzerhandbuch' })}>
                <option value="">Kapitel der Quellen</option>
                {outlines.data?.items.map((o: any) => <option key={o.id} value={o.id}>Variante: {o.name} – V{o.versionNo}</option>)}
              </select>
            </label>
            <label>Version <input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="z. B. 2026.1" aria-label="Versionsnummer" /></label>
            <label>Titel <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Titel des Handbuchs" /></label>
          </div>
          <label className="block">Einleitung / Hinweise (Markdown, optional)
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <p className="small muted">{form.outlineId ? 'Enthalten sind die freigegebenen Kapitel der Variante, gefiltert nach Rollen, Sparten und Blueprint/Märkten; Abkürzungen, Glossar, Bildverzeichnis und FAQ werden als Verzeichnisse beigefügt.' : 'Enthalten sind alle Kapitel der Quellen mit freigegebener Version.'} Kapitel, deren „gültig ab“ nach der Versionsnummer liegt, bleiben bis zu ihrem Release draußen. Offene Blocker- oder Datenschutzbefunde verhindern die Veröffentlichung.</p>
          <Gated className="btn primary" missing={[!form.version.trim() && 'Version']} onClick={publish}>Veröffentlichen</Gated>
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
                    <strong>Version {r.version}</strong>{r.outlineId && <span className="tag">Variante</span>}
                    <span className="small muted">{r.title} · {new Date(r.createdAt).toLocaleString('de-DE')} · {r.createdBy} · {r.chapters.length} Kapitel · {changed.length} Änderungen{r.languages?.length ? ` · Sprachen: DE, ${r.languages.map((l: any) => l.language.toUpperCase()).join(', ')}` : ''}</span>
                  </div>
                  <div className="row-actions">
                    <button className="btn small" onClick={() => get(r.id, 'site', `online-hilfe-${r.version}.zip`)}>Online-Hilfe (ZIP)</button>
                    <button className="btn small" onClick={() => get(r.id, 'md', `handbuch-${r.version}.md`)}>Markdown</button>
                    {r.languages?.map((l: any) => (
                      <button key={l.language} className="btn small" title={`${l.translated} von ${l.total} Kapiteln übersetzt`} onClick={() => download(`/api/v1/releases/${r.id}/download?format=md&language=${l.language}`, `handbuch-${r.version}-${l.language}.md`).catch((e) => notify(errorText(e), 'error'))}>
                        Markdown {l.language.toUpperCase()} ({l.translated}/{l.total})
                      </button>
                    ))}
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
                      <ComparisonPanel id={r.id} canEdit={canEdit} />
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
