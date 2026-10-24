import { BookOpenIcon, CheckIcon, EyeIcon, ZapIcon } from 'lucide-react';
import { Ico, OkMark } from '../components/icons';
import { useState } from 'react';
import { api, post } from '../api';
import { Badge, Card, DownloadButton, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

export function ExportPage() {
  const { ref, notify } = useApp();
  const outlines = useLoad<any>('/outlines');
  const [outlineId, setOutlineId] = useState('');
  const outline = outlines.data?.items.find((o: any) => o.id === outlineId);
  const chapters = useLoad<any[]>(outline ? `/chapters?outline=${outline.familyId}` : '/chapters', [outline?.familyId]);
  const [appendices, setAppendices] = useState(true);
  const history = useLoad<any[]>('/exports');
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [divs, setDivs] = useState<string[]>([]);
  const [market, setMarket] = useState('');
  const [release, setRelease] = useState('');
  // Stand für Zukunfts-Inhalte (ADR-102, W-09): Kapitel mit späterem „gültig ab“ werden ausgeblendet
  const [asOf, setAsOf] = useState('');
  const [format, setFormat] = useState('md');
  // Designvorlage für HTML (ADR-112): Quick Reference Guide oder Handbuch-Kapitel
  const [design, setDesign] = useState('standard');
  const templates = useLoad<any[]>('/design-templates');
  const [profile, setProfile] = useState('full');
  const [reading, setReading] = useState(false);
  const [transitions, setTransitions] = useState(true);
  // Prüffassung für Word (ADR-104, W-06): mit „Fertig, wenn: …“ je Kapitel, zum Zurücklesen auf der Seite „Überarbeitung“
  const [review, setReview] = useState(false);
  const [criterion, setCriterion] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = (l: string[], s: (v: string[]) => void, c: string) => s(l.includes(c) ? l.filter((x) => x !== c) : [...l, c]);
  const approved = (chapters.data ?? []).filter((c) => c.versions.some((v: any) => v.status === 'approved'));

  const run = async () => {
    setError(null);
    try {
      const r = await post('/exports', { chapterIds, roles, divisions: divs, market: market || null, release: release || null, asOf: asOf.trim() || undefined, format, profile, reading, ...(format === 'html' && design !== 'standard' ? { design } : {}), transitions, ...(review && format === 'docx' ? { reviewCopy: { criterion: criterion.trim() || undefined } } : {}), ...(outline ? { outlineId, appendices } : {}) });
      setResult(r);
      notify(`Export erstellt (${r.chapters} Kapitel).`);
      history.reload();
    } catch (e) {
      setError(errorText(e));
      setResult(null);
    }
  };

  // Muster als eigenständige Seite öffnen (mit Anmeldung geladen, dann als Blob angezeigt)
  const showSample = async (t: any) => {
    try {
      const html = await api<string>('GET', `/design-templates/${t.id}/sample`);
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page title="Export" subtitle="Freigegebene Kapitel rollen-, sparten-, markt- und releasegefiltert exportieren">
      <div className="grid2">
        <Card title="Exportumfang">
          <div className="form-row">
            <label>Handbuch
              <select value={outlineId} onChange={(e) => { setOutlineId(e.target.value); setChapterIds([]); }}>
                <option value="">Kapitel der Quellen</option>
                {outlines.data?.items.map((o: any) => <option key={o.id} value={o.id}>Variante: {o.name} – V{o.versionNo}</option>)}
              </select>
            </label>
            {outline && <label className="inline"><input type="checkbox" checked={appendices} onChange={(e) => setAppendices(e.target.checked)} /> Verzeichnisse anhängen (Abkürzungen, Glossar, Bilder, FAQ)</label>}
          </div>
          {outline && <p className="small muted">Filter der Variante (Rollen, Sparten, Blueprint/Märkte) werden angewendet; weitere Auswahl unten schränkt zusätzlich ein.</p>}
          <fieldset className="checks">
            <legend>Kapitel (leer = alle freigegebenen)</legend>
            {!approved.length && <p className="small muted">Noch kein Kapitel freigegeben.</p>}
            {(chapters.data ?? []).map((c) => (
              <label key={c.id}><input type="checkbox" checked={chapterIds.includes(c.id)} onChange={() => t(chapterIds, setChapterIds, c.id)} /> {c.title} {c.versions.some((v: any) => v.status === 'approved') ? <OkMark ok /> : <span className="muted small">(nicht freigegeben)</span>}</label>
            ))}
          </fieldset>
          <fieldset className="checks"><legend>Rollen</legend>{ref?.roles.filter((r) => r.code !== 'all').map((r) => <label key={r.code}><input type="checkbox" checked={roles.includes(r.code)} onChange={() => t(roles, setRoles, r.code)} /> <Badge item={r} /></label>)}</fieldset>
          <fieldset className="checks"><legend>Sparten</legend>{ref?.divisions.filter((d) => !['all', 'unconfirmed'].includes(d.code)).map((r) => <label key={r.code}><input type="checkbox" checked={divs.includes(r.code)} onChange={() => t(divs, setDivs, r.code)} /> <Badge item={r} /></label>)}</fieldset>
          <div className="form-row">
            <label>Markt <select value={market} onChange={(e) => setMarket(e.target.value)}><option value="">alle</option>{ref?.markets.map((m) => <option key={m.code}>{m.code}</option>)}</select></label>
            <label>Release <select value={release} onChange={(e) => setRelease(e.target.value)}><option value="">alle</option>{ref?.releases.map((m) => <option key={m.code}>{m.code}</option>)}</select></label>
            <label>Stand (Release) <input value={asOf} onChange={(e) => setAsOf(e.target.value)} placeholder={release || 'z. B. 2026.3'} size={10} title="Kapitel mit späterem „gültig ab“ werden ausgeblendet; leer = Release-Filter" /></label>
            <label>Format <select value={format} onChange={(e) => setFormat(e.target.value)}><option value="md">Markdown</option><option value="html">HTML (druckfähig)</option><option value="pdf">PDF</option><option value="docx">Word (.docx)</option><option value="pptx">PowerPoint (.pptx)</option><option value="json">JSON</option></select></label>
          </div>
          {format === 'html' && (
            <div className="form-row">
              <label>Design
                <select value={design} onChange={(e) => { setDesign(e.target.value); if (e.target.value === 'quickref') setProfile('quickguide'); }}>
                  <option value="standard">Standard (Firmen-Layout)</option>
                  {templates.data?.map((t) => <option key={t.id} value={t.id}>{t.name} – {t.page}</option>)}
                </select>
              </label>
            </div>
          )}
          <div className="form-row">
            <label>Ausgabe
              <select value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="full">Vollständig</option>
                <option value="quickguide">Quick Guide – Voraussetzungen, Schritte, Ergebnis, Warnungen</option>
                <option value="onepager">One Pager – Zweck kurz, Schritte, Warnungen</option>
                <option value="summary">Kurzfassung – je Kapitel ein Absatz (Management, etwa ¼ der Länge)</option>
              </select>
            </label>
            <label className="inline"><input type="checkbox" checked={reading} onChange={(e) => setReading(e.target.checked)} /> Lesefassung (ohne Rollen-/Sparten-Badges, Versionszeile und Quellenstatus)</label>
            {profile === 'full' && <label className="inline"><input type="checkbox" checked={transitions} onChange={(e) => setTransitions(e.target.checked)} /> „Weiter mit …“ am Kapitelende</label>}
          </div>
          {format === 'docx' && (
            <div className="form-row">
              <label className="inline"><input type="checkbox" checked={review} onChange={(e) => setReview(e.target.checked)} /> Prüffassung für Word (Lesefassung mit „Fertig, wenn …“ je Kapitel; geänderte Datei unter „Überarbeitung“ zurücklesen)</label>
              {review && <label>Fertig, wenn … <input value={criterion} onChange={(e) => setCriterion(e.target.value)} maxLength={300} size={50} placeholder="alle Schritte, Begriffe und Bildschirmtexte mit der aktuellen Oberfläche übereinstimmen." /></label>}
            </div>
          )}
          <button className="btn primary" onClick={run}>Export erstellen</button>
          <ErrorBox error={error} />
        </Card>
        <Card title="Ergebnis">
          {!result ? <Empty>Noch kein Export in dieser Sitzung.</Empty> : (
            <>
              <p><DownloadButton className="btn primary" href={result.downloadUrl} name={result.fileName}>⬇ {result.fileName} herunterladen</DownloadButton></p>
              {result.skipped.map((s: any) => <div key={s.chapterId} className="alert small">{s.reason}</div>)}
              {result.future?.length > 0 && (
                <div className="alert small" role="status">
                  Zukunfts-Inhalte, nicht im Export (Stand {result.asOf}): {result.future.map((f: any) => `„${f.title}“ (gültig ab ${f.validFrom})`).join(', ')}
                </div>
              )}
              {result.preview === null ? <p className="muted">{result.format === 'docx' ? 'Word-Dokument' : result.format === 'pptx' ? 'PowerPoint-Präsentation' : 'PDF'} erstellt ({Math.round(result.byteSize / 1024)} KB) – Vorschau nach dem Herunterladen.</p>
                : result.format === 'json' ? <pre tabIndex={0} aria-label="Quelltext" className="source small">{result.preview}</pre> : <div className="export-preview" tabIndex={0} role="region" aria-label="Exportvorschau"><Md text={result.preview} /></div>}
            </>
          )}
        </Card>
      </div>
      <Card title="Designvorlagen">
        <p className="small muted">Druckfähige HTML-Vorlagen (im Browser als PDF speichern). Marke, Logo und Texte kommen aus dem Firmen-Layout unter Einstellungen; das Muster zeigt fiktive Inhalte.</p>
        <ErrorBox error={templates.error} />
        <div className="design-templates">
          {templates.data?.map((t) => (
            <section key={t.id} className="design-template" aria-labelledby={`dt-${t.id}`}>
              <h3 id={`dt-${t.id}`}><Ico icon={t.id === 'quickref' ? ZapIcon : BookOpenIcon} size={18} /> {t.name}</h3>
              <p className="small"><span className="page-format">{t.page}</span> {t.description}</p>
              <div className="actions">
                <button className="btn" onClick={() => void showSample(t)}><Ico icon={EyeIcon} /> Muster ansehen</button>
                <button className="btn" onClick={() => { setFormat('html'); setDesign(t.id); if (t.id === 'quickref') setProfile('quickguide'); }}><Ico icon={CheckIcon} /> Für den Export wählen</button>
              </div>
            </section>
          ))}
        </div>
      </Card>
      <Card title="Exportverlauf">
        {!history.data?.length ? <Empty>Keine Exporte.</Empty> : (
          <table className="table compact">
            <thead><tr><th>Zeit</th><th>Datei</th><th>Filter</th><th>Erstellt von</th><th /></tr></thead>
            <tbody>
              {history.data.map((h) => (
                <tr key={h.id}>
                  <td>{new Date(h.createdAt).toLocaleString('de-DE')}</td>
                  <td>{h.fileName}</td>
                  <td className="small">{[h.params.roles?.join(','), h.params.divisions?.join(','), h.params.market, h.params.release].filter(Boolean).join(' · ') || 'ungefiltert'}</td>
                  <td>{h.createdBy}</td>
                  <td><DownloadButton className="btn link" href={h.downloadUrl} name={h.fileName}>Download</DownloadButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Page>
  );
}
