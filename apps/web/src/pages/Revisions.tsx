// Überarbeitung (ADR-104): Word-Prüffassung zurücklesen (W-06), KI-Lektorat mit Wortvergleich (G-07),
// Drei-Spalten-Ansicht Stand | Vorschlag | Neu mit internem Kommentar (W-08)
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, patch, post } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const STATUS_CLS: Record<string, string> = { open: 'sev-medium', accepted: 'st-approved', rejected: 'sev-low', stale: 'sev-high' };
const ORIGIN_DE: Record<string, string> = { word: 'Word-Prüfung', ai: 'KI-Lektorat' };

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((p) => p === 'edit' || p === 'admin');
}

const DiffPart = (o: { op: string; text: string }, i: number) => (o.op === '=' ? <span key={i}>{o.text}</span> : o.op === '-' ? <del key={i}>{o.text}</del> : <ins key={i}>{o.text}</ins>);

/** Ein Vorschlag in drei Spalten: Stand (aktueller Text), Vorschlag (Wortvergleich), Neu (eigene Fassung) */
function Proposal({ p, canEdit, changed }: { p: any; canEdit: boolean; changed: (p: any) => void }) {
  const { notify } = useApp();
  const [text, setText] = useState<string>(p.proposed ?? '');
  const [comment, setComment] = useState<string>(p.comment ?? '');
  const open = p.status === 'open';
  const decide = async (decision: 'accept' | 'reject') => {
    try {
      const body: Record<string, unknown> = { decision, comment };
      if (decision === 'accept' && p.change !== 'removed' && text.trim() !== (p.proposed ?? '').trim()) body.text = text;
      const r = await post<any>(`/revision-proposals/${p.id}/decision`, body);
      changed(r);
      notify(decision === 'accept' ? 'Vorschlag in den Entwurf übernommen.' : 'Vorschlag verworfen.');
    } catch (e) {
      const proposal = (e as any)?.problem?.proposal;
      if (proposal) changed(proposal);
      notify(errorText(e), 'error');
    }
  };
  const saveComment = async () => {
    try {
      changed(await patch<any>(`/revision-proposals/${p.id}`, { comment }));
      notify('Interner Kommentar gespeichert.');
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const label = `${p.sectionTitle}: ${p.changeLabel}`;
  return (
    <li className="rev-item" aria-label={label} data-testid="revision-proposal">
      <div className="dp-head">
        <strong>{p.sectionTitle}</strong>
        <span className="tag">{p.changeLabel}</span>
        <span className={`tag ${STATUS_CLS[p.status] ?? ''}`}>{p.statusLabel}</span>
        {p.outdated && <span className="tag sev-high" title="Der Absatz wurde seit dem Einlesen geändert.">Stand geändert</span>}
        {p.appliedVersionId && <Link className="small" to={`/werkstatt/${p.chapterId}`}>zum Entwurf</Link>}
      </div>
      <div className="dp-cols">
        <div className="dp-side">
          <p className="small muted">Stand</p>
          {p.change === 'added' ? <p className="muted small">neuer Absatz</p> : <p className="md-text small">{p.current ?? p.original}</p>}
          {p.outdated && p.original && <p className="small muted" title={p.original}>beim Einlesen: {p.original.slice(0, 120)}{p.original.length > 120 ? ' …' : ''}</p>}
        </div>
        <div className="dp-side dp-diff">
          <p className="small muted">Vorschlag <span className="muted">(<del>entfällt</del> · <ins>neu</ins>)</span></p>
          <p className="md-text small" title={p.original ?? undefined}>
            {p.diff ? p.diff.map(DiffPart) : p.change === 'removed' ? <del>{p.original}</del> : <ins>{p.proposed}</ins>}
          </p>
        </div>
        <div className="dp-side dp-leading">
          <p className="small muted">Neu</p>
          {p.change === 'removed' ? <p className="small">Absatz entfällt.</p>
            : open && canEdit ? <label className="block small">Text für den Entwurf<textarea rows={Math.min(8, Math.max(3, text.split('\n').length + 1))} value={text} onChange={(e) => setText(e.target.value)} /></label>
              : <p className="md-text small">{p.proposed}</p>}
        </div>
      </div>
      {p.criterion && <p className="small muted">Fertig, wenn: {p.criterion}</p>}
      <div className="form-row">
        <label className="grow">Interner Kommentar (nie im Export)
          <input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} disabled={!canEdit} />
        </label>
        {canEdit && <button type="button" className="btn small" onClick={saveComment} disabled={comment === (p.comment ?? '')}>Kommentar speichern</button>}
        {canEdit && open && <>
          <button type="button" className="btn small primary" onClick={() => void decide('accept')}>Übernehmen</button>
          <button type="button" className="btn small" onClick={() => void decide('reject')}>Verwerfen</button>
        </>}
      </div>
    </li>
  );
}

function BatchDetail({ id }: { id: string }) {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const b = useLoad<any>(`/revision-batches/${id}`, [id]);
  const [status, setStatus] = useState('open');
  if (!b.data) return <ErrorBox error={b.error} />;
  const d = b.data;
  const replace = (p: any) => b.setData({ ...d, chapters: d.chapters.map((c: any) => ({ ...c, proposals: c.proposals.map((x: any) => (x.id === p.id ? p : x)) })) });
  const acceptAll = async (chapterId: string) => {
    try {
      const r = await post<any>(`/revision-batches/${id}/accept-all`, { chapterId });
      b.setData(r.batch);
      notify(`${r.accepted} Vorschläge übernommen${r.stale ? `, ${r.stale} veraltet` : ''}.`);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const s = d.stats ?? {};
  return (
    <>
      <Card title={<>{ORIGIN_DE[d.origin] ?? d.origin}{d.fileName ? ` – ${d.fileName}` : ''} <span className="muted small">{new Date(d.createdAt).toLocaleString('de-DE')}</span></>}
        actions={<Link className="btn small" to="/ueberarbeitung">Alle Listen</Link>}>
        <p className="small">
          {s.proposals ?? 0} Vorschläge: {s.changed ?? 0} geändert, {s.added ?? 0} neu, {s.removed ?? 0} entfällt
          {d.origin === 'word' && <> · {d.exportId ? 'Prüffassung erkannt' : 'ohne Prüffassung – Kapitel über den Titel zugeordnet'}</>}
          {d.origin === 'ai' && s.method && <> · Verfahren: {s.method === 'ai' ? 'KI-Dienst (lokal)' : 'Regelkorrekturen'}{s.skipped ? `, ${s.skipped} Absätze ausgelassen` : ''}</>}
        </p>
        {s.unmatchedChapters?.length > 0 && <div className="alert small">Kapitel ohne Zuordnung: {s.unmatchedChapters.join(', ')}</div>}
        {s.unmatchedSections?.length > 0 && <div className="alert small">Abschnitte ohne Zuordnung: {s.unmatchedSections.join('; ')}</div>}
        <div className="filters">
          <label>Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">alle</option>
              {Object.entries(d.statusLabels as Record<string, string>).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
      </Card>
      {!d.chapters.length && <Empty>Keine Abweichungen – die Datei stimmt mit dem Stand überein.</Empty>}
      {d.chapters.map((c: any) => {
        const list = c.proposals.filter((p: any) => !status || p.status === status);
        const openCount = c.proposals.filter((p: any) => p.status === 'open').length;
        return (
          <Card key={c.chapterId} title={<>{c.title} <span className="muted small">{openCount} offen</span></>}
            actions={canEdit && openCount > 0 ? <button type="button" className="btn small" onClick={() => void acceptAll(c.chapterId)}>Alle übernehmen (Kapitel)</button> : undefined}>
            <p className="small muted">Übernommen wird in einen Entwurf des Kapitels; ist die neueste Version freigegeben, entsteht der Entwurf als Kopie und die freigegebene Version bleibt unverändert.</p>
            {!list.length ? <Empty>Keine Vorschläge mit diesem Status.</Empty> : (
              <ul className="plain" aria-label={`Vorschläge zu ${c.title}`}>
                {list.map((p: any) => <Proposal key={p.id} p={p} canEdit={canEdit} changed={replace} />)}
              </ul>
            )}
          </Card>
        );
      })}
    </>
  );
}

export function RevisionsPage() {
  const { batchId } = useParams();
  const { notify } = useApp();
  const navigate = useNavigate();
  const canEdit = useCanEdit();
  const batches = useLoad<any[]>(batchId ? null : '/revision-batches');
  const chapters = useLoad<any[]>(batchId ? null : '/chapters');
  const [versionId, setVersionId] = useState('');
  const [busy, setBusy] = useState(false);
  const started = (r: any, msg: string) => {
    notify(msg);
    navigate(`/ueberarbeitung/${r.id}`);
  };
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api<any>('POST', '/revisions/word', fd);
      started(r, `„${file.name}“ eingelesen: ${r.stats.proposals} Vorschläge.`);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const lektorat = async () => {
    setBusy(true);
    try {
      const r = await post<any>(`/chapter-versions/${versionId}/lektorat`);
      started(r, `KI-Lektorat: ${r.stats.proposals} Vorschläge.`);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  // neueste Version je Kapitel
  const versions = (chapters.data ?? []).flatMap((c: any) => {
    const v = [...(c.versions ?? [])].filter((x: any) => x.status !== 'superseded').sort((a: any, b: any) => b.versionNo - a.versionNo)[0];
    return v ? [{ id: v.id, label: `${c.title} – Version ${v.versionNo} (${v.status === 'approved' ? 'freigegeben' : v.status === 'draft' ? 'Entwurf' : 'eingereicht'})` }] : [];
  });
  return (
    <Page title="Überarbeitung" subtitle="Änderungen aus Word und KI-Lektorat als Vorschläge prüfen: Stand, Vorschlag und neue Fassung nebeneinander">
      {batchId ? <BatchDetail id={batchId} /> : (
        <>
          {canEdit && (
            <div className="grid2">
              <Card title="Word-Prüffassung zurücklesen">
                <p className="small muted">Prüffassung unter „Export“ (Word, „Prüffassung für Word“) erstellen, in Word bearbeiten und hier hochladen. Abweichungen je Absatz werden Vorschläge; nichts wird sofort geändert.</p>
                <label className="block">Word-Datei (.docx) <input type="file" accept=".docx" disabled={busy} data-testid="revision-word" onChange={(e) => void upload(e.target.files?.[0])} /></label>
              </Card>
              <Card title="KI-Lektorat je Kapitel">
                <p className="small muted">Jeder Absatz wird nach den Stilregeln umformuliert (lokaler KI-Dienst, sonst Regelkorrekturen). Gesperrte Absätze, Bilder und Absätze, in denen eine Zahl verloren ginge, bleiben unverändert.</p>
                <div className="form-row">
                  <label className="grow">Kapitel
                    <select value={versionId} onChange={(e) => setVersionId(e.target.value)}>
                      <option value="">– wählen –</option>
                      {versions.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                    </select>
                  </label>
                  <button type="button" className="btn primary" disabled={!versionId || busy} onClick={() => void lektorat()}>KI-Lektorat starten</button>
                </div>
              </Card>
            </div>
          )}
          <Card title="Vorschlagslisten">
            <ErrorBox error={batches.error} />
            {!batches.data?.length ? <Empty>Noch keine Vorschläge.</Empty> : (
              <div className="table-wrap"><table className="table compact">
                <thead><tr><th>Herkunft</th><th>Datei</th><th>Erstellt</th><th>offen</th><th>übernommen</th><th>verworfen</th><th>veraltet</th></tr></thead>
                <tbody>
                  {batches.data.map((b) => (
                    <tr key={b.id}>
                      <td><Link to={`/ueberarbeitung/${b.id}`}>{ORIGIN_DE[b.origin] ?? b.origin}</Link></td>
                      <td>{b.fileName ?? '–'}</td>
                      <td>{new Date(b.createdAt).toLocaleString('de-DE')}</td>
                      <td>{b.counts.open ?? 0}</td><td>{b.counts.accepted ?? 0}</td><td>{b.counts.rejected ?? 0}</td><td>{b.counts.stale ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
          </Card>
        </>
      )}
    </Page>
  );
}
