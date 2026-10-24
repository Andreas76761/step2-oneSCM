// Kapitelbewertung mit Ampel und Plausibilität je Aussage (ADR-103, S-07, W-02) sowie Fehlerliste (G-05)
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { patch, post, qs } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const TRAFFIC_CLS: Record<string, string> = { green: 'st-approved', yellow: 'sev-medium', red: 'sev-high' };
const CLASS_CLS: Record<string, string> = { supported: 'st-approved', unsupported: 'sev-medium', contradiction: 'sev-high', missing: 'sev-low' };

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((p) => p === 'edit' || p === 'admin');
}

const Traffic = ({ t, label, value }: { t: string; label: string; value?: number }) => (
  <span className={`tag ${TRAFFIC_CLS[t] ?? ''}`}>{label}{value !== undefined ? ` · ${value}` : ''}</span>
);

/** Bewertung einer Kapitelversion: fünf Kriterien, Gesamtampel, Aussagen mit Einstufung */
function AssessmentDetail({ versionId }: { versionId: string }) {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const a = useLoad<any>(`/chapter-versions/${versionId}/assessment`, [versionId]);
  const [filter, setFilter] = useState('');
  if (!a.data) return <ErrorBox error={a.error} />;
  const d = a.data;
  const statements = (d.plausibility.statements as any[]).filter((s) => !filter || s.class === filter);
  return (
    <>
      <Card title={<>{d.title} <span className="muted small">Version {d.versionNo}</span> <Traffic t={d.overall.traffic} label={`Gesamt ${d.overall.label}`} value={d.overall.value} /></>}
        actions={<span className="row-actions">
          <Link className="btn small" to={`/anleitungs-check/${versionId}`}>Anleitungs-Check</Link>
          {canEdit && <button type="button" className="btn small" onClick={async () => {
            try {
              const r = await post<any>('/language-errors/collect', { versionId });
              notify(`Fehlerliste: ${r.added} neue Funde, ${r.known} schon erfasst, ${r.fixed} als korrigiert erkannt.`);
            } catch (e) {
              notify(errorText(e), 'error');
            }
          }}>Funde in die Fehlerliste</button>}
        </span>}>
        <div className="stat-row" role="list" aria-label="Kriterien">
          {d.criteria.map((c: any) => (
            <div key={c.code} className="stat" role="listitem" title={c.hint}>
              <span className="muted small">{c.label}</span>
              <strong>{c.value}</strong>
              <Traffic t={c.traffic} label={c.trafficLabel} />
              <span className="small muted">{c.detail}</span>
            </div>
          ))}
        </div>
        <p className="small muted">Ampel je Kriterium: grün ab 80, gelb ab 60, sonst rot. Gesamt ist der Mittelwert; die Gesamtampel ist höchstens so gut wie das schwächste Kriterium.</p>
      </Card>
      <Card title={`Plausibilität je Aussage: ${d.plausibility.value} von 100`}>
        <p className="small muted">Jeder Satz gegen die Quellen seines Absatzes: belegt (durch bestätigte Quelle gedeckt), unbelegt (keine oder unbestätigte Quelle, geht über die Quelle hinaus, Zahl fehlt in der Quelle), Widerspruch (Quelle in einem offenen Widerspruch), fehlend (Lücke). Ein Widerspruch zählt doppelt.</p>
        <div className="filters">
          <label>Einstufung
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">alle ({d.plausibility.statements.length})</option>
              {Object.entries(d.plausibility.counts).map(([k, n]) => <option key={k} value={k}>{({ supported: 'belegt', unsupported: 'unbelegt', contradiction: 'Widerspruch', missing: 'fehlend' } as Record<string, string>)[k]} ({String(n)})</option>)}
            </select>
          </label>
        </div>
        {!statements.length ? <Empty>Keine Aussagen mit dieser Einstufung.</Empty> : (
          <div className="table-wrap" role="region" aria-label="Aussagen" tabIndex={0}>
            <table className="table compact">
              <caption className="sr-only">Aussagen mit Einstufung</caption>
              <thead><tr><th scope="col">Abschnitt</th><th scope="col">Aussage</th><th scope="col">Einstufung</th><th scope="col">Begründung</th><th scope="col">Quellen</th></tr></thead>
              <tbody>
                {statements.map((s, i) => (
                  <tr key={`${s.blockId}-${i}`}>
                    <td className="small">{s.section}</td>
                    <td>{s.text}</td>
                    <td><span className={`tag ${CLASS_CLS[s.class]}`}>{s.label}</span></td>
                    <td className="small">{s.reason}</td>
                    <td className="small">{s.sources.length ? s.sources.map((n: number) => `#${n}`).join(', ') : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

export function AssessmentPage() {
  const { versionId } = useParams();
  const ov = useLoad<any>('/assessments');
  const [open, setOpen] = useState<string | null>(versionId ?? null);
  const d = ov.data;
  return (
    <Page title="Kapitelbewertung" subtitle="Fünf Kriterien je Kapitel mit Ampel – Sprache, Ziel, Tonalität, Quellenabgleich, Fakten – und Plausibilität je Aussage">
      <ErrorBox error={ov.error} />
      {d && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Kapitel</span><strong>{d.summary.chapters}</strong></div>
          <div className="stat"><span className="muted small">grün</span><strong>{d.summary.green}</strong></div>
          <div className="stat"><span className="muted small">gelb</span><strong>{d.summary.yellow}</strong></div>
          <div className="stat"><span className="muted small">rot</span><strong>{d.summary.red}</strong></div>
        </div>
      )}
      <Card title="Kapitel">
        {!d?.items.length ? <Empty>Noch kein Kapitel erzeugt.</Empty> : (
          <div className="table-wrap" role="region" aria-label="Kapitelbewertung" tabIndex={0}>
            <table className="table compact">
              <caption className="sr-only">Bewertung je Kapitel</caption>
              <thead><tr><th scope="col">Kapitel</th><th scope="col">Gesamt</th>{d.criteria.map((c: any) => <th key={c.code} scope="col" title={c.hint}>{c.label}</th>)}</tr></thead>
              <tbody>
                {d.items.map((i: any) => (
                  <tr key={i.chapterId} className={open === i.versionId ? 'selected' : ''}>
                    <th scope="row"><button type="button" className="linklike" aria-pressed={open === i.versionId} onClick={() => setOpen(open === i.versionId ? null : i.versionId)}>{i.title}</button> <span className="muted small">V{i.versionNo}</span></th>
                    <td><Traffic t={i.overall.traffic} label={i.overall.label} value={i.overall.value} /></td>
                    {i.criteria.map((c: any) => <td key={c.code}><Traffic t={c.traffic} label={String(c.value)} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {open && <AssessmentDetail versionId={open} />}
    </Page>
  );
}

const STATUS = [['open', 'offen'], ['fixed', 'korrigiert'], ['rejected', 'abgelehnt'], ['rule_missing', 'Regel fehlt']];

function ErrorRow({ e, categories, canEdit, onChange }: { e: any; categories: string[]; canEdit: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const [reason, setReason] = useState(e.reason ?? '');
  const [rejecting, setRejecting] = useState(false);
  const save = async (body: Record<string, unknown>, msg: string) => {
    try {
      await patch(`/language-errors/${e.id}`, body);
      notify(msg);
      setRejecting(false);
      onChange();
    } catch (err) {
      notify(errorText(err), 'error');
    }
  };
  return (
    <tr>
      <th scope="row" className="small">{e.nr}</th>
      <td className="small">{new Date(e.foundAt).toLocaleDateString('de-DE')}</td>
      <td className="small">{e.location}</td>
      <td>{e.error}</td>
      <td>{e.correction ?? '–'}</td>
      <td className="small">{canEdit ? (
        <select aria-label={`Kategorie ${e.nr}`} value={e.category} onChange={(ev) => void save({ category: ev.target.value }, `${e.nr}: Kategorie geändert.`)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : e.category}</td>
      <td className="small">{e.rule ?? '–'}</td>
      <td>
        {canEdit ? (
          <>
            <select aria-label={`Status ${e.nr}`} value={rejecting ? 'rejected' : e.status} onChange={(ev) => (ev.target.value === 'rejected' ? setRejecting(true) : void save({ status: ev.target.value }, `${e.nr}: ${STATUS.find(([k]) => k === ev.target.value)?.[1]}.`))}>
              {STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            {rejecting && (
              <span className="row-actions">
                <input aria-label={`Begründung ${e.nr}`} placeholder="Begründung" value={reason} onChange={(ev) => setReason(ev.target.value)} />
                <button type="button" className="btn small" disabled={!reason.trim()} onClick={() => void save({ status: 'rejected', reason }, `${e.nr}: abgelehnt.`)}>Ablehnen</button>
              </span>
            )}
            {e.status === 'rejected' && e.reason && !rejecting && <div className="small muted">{e.reason}</div>}
          </>
        ) : <span>{e.statusLabel}{e.reason ? ` (${e.reason})` : ''}</span>}
      </td>
    </tr>
  );
}

export function LanguageErrorsPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const [status, setStatus] = useState('open');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const list = useLoad<any>(`/language-errors${qs({ status: status || undefined, category: category || undefined, q: q || undefined })}`);
  const [form, setForm] = useState({ location: '', error: '', correction: '', category: 'Rechtschreibung' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const d = list.data;
  const categories: string[] = d?.categories.map((c: any) => c.category) ?? [];
  const importCsv = async (apply: boolean) => {
    if (!file) return;
    try {
      const r = await post<any>('/language-errors/import', { csv: await file.text(), apply });
      if (r.applied) {
        notify(`FEHLERLISTE.csv übernommen: ${r.changes.filter((c: any) => c.action === 'new').length} neu, ${r.changes.filter((c: any) => c.action === 'update').length} geändert.`);
        setPreview(null);
        setFile(null);
        list.reload();
      } else setPreview(r);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Page title="Fehlerliste" subtitle="Sprachfehler mit Fundstelle, Korrektur, Kategorie und Status – Abgleich mit FEHLERLISTE.csv des Arbeitsordners"
      actions={<DownloadButton className="btn" href="/api/v1/language-errors/export" name="FEHLERLISTE.csv">FEHLERLISTE.csv</DownloadButton>}>
      <ErrorBox error={list.error} />
      {d && (
        <div className="stat-row">
          {STATUS.map(([k, l]) => <div key={k} className="stat"><span className="muted small">{l}</span><strong>{d.summary[k]}</strong></div>)}
        </div>
      )}
      <Card title="Einträge">
        <p className="small muted">Funde übernehmen Sie in der <Link to="/kapitelbewertung">Kapitelbewertung</Link> („Funde in die Fehlerliste“). Dabei setzt die App offene Funde, deren Text im Kapitel nicht mehr steht, auf „korrigiert“.</p>
        <div className="filters">
          <label>Status <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">alle</option>{STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          <label>Kategorie <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">alle</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          <label className="grow">Suche <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Fehler, Fundstelle, Korrektur" /></label>
        </div>
        {!d?.items.length ? <Empty>Keine Einträge.</Empty> : (
          <div className="table-wrap" role="region" aria-label="Fehlerliste" tabIndex={0}>
            <table className="table compact">
              <caption className="sr-only">Fehlerliste</caption>
              <thead><tr><th scope="col">Nr</th><th scope="col">Datum</th><th scope="col">Fundstelle</th><th scope="col">Fehler</th><th scope="col">Korrektur</th><th scope="col">Kategorie</th><th scope="col">Regel</th><th scope="col">Status</th></tr></thead>
              <tbody>{d.items.map((e: any) => <ErrorRow key={e.id} e={e} categories={categories} canEdit={canEdit} onChange={() => list.reload()} />)}</tbody>
            </table>
          </div>
        )}
      </Card>
      {canEdit && (
        <div className="grid2">
          <Card title="Eintrag erfassen">
            <label className="block">Fundstelle <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="z. B. 05_I_Output/02_Releaseletter/…, Zeile 3" /></label>
            <label className="block">Fehler <input value={form.error} onChange={(e) => setForm({ ...form, error: e.target.value })} /></label>
            <label className="block">Korrektur <input value={form.correction} onChange={(e) => setForm({ ...form, correction: e.target.value })} /></label>
            <label className="block">Kategorie <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
            <button type="button" className="btn primary" disabled={!form.location.trim() || !form.error.trim()} onClick={async () => {
              try {
                const r = await post<any>('/language-errors', form);
                notify(`${r.nr} erfasst.`);
                setForm({ ...form, location: '', error: '', correction: '' });
                list.reload();
              } catch (e) {
                notify(errorText(e), 'error');
              }
            }}>Erfassen</button>
          </Card>
          <Card title="FEHLERLISTE.csv einlesen">
            <p className="small muted">Einträge mit bekannter Nr. übernehmen Status, Korrektur und Begründung („abgelehnt (Begründung)“); neue Nr. werden angelegt. Erst prüfen, dann übernehmen.</p>
            <div className="filters">
              <label className="small">Datei <input type="file" accept=".csv,text/csv" onChange={(e) => (setFile(e.target.files?.[0] ?? null), setPreview(null))} /></label>
              <button type="button" className="btn small" disabled={!file} onClick={() => void importCsv(false)}>Prüfen</button>
            </div>
            {preview && (
              <div role="status" className="small">
                Vorschau: {preview.changes.filter((c: any) => c.action === 'new').length} neu, {preview.changes.filter((c: any) => c.action === 'update').length} geändert, {preview.invalid} mit Fehler.
                {preview.changes.filter((c: any) => c.problems.length).map((c: any) => <div key={c.nr} className="alert small">{c.nr}: {c.problems.join('; ')}</div>)}
                {!preview.invalid && <button type="button" className="btn small primary" onClick={() => void importCsv(true)}>Übernehmen</button>}
              </div>
            )}
          </Card>
        </div>
      )}
    </Page>
  );
}
