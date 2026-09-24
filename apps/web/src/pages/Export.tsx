import { useState } from 'react';
import { post } from '../api';
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
  const [format, setFormat] = useState('md');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = (l: string[], s: (v: string[]) => void, c: string) => s(l.includes(c) ? l.filter((x) => x !== c) : [...l, c]);
  const approved = (chapters.data ?? []).filter((c) => c.versions.some((v: any) => v.status === 'approved'));

  const run = async () => {
    setError(null);
    try {
      const r = await post('/exports', { chapterIds, roles, divisions: divs, market: market || null, release: release || null, format, ...(outline ? { outlineId, appendices } : {}) });
      setResult(r);
      notify(`Export erstellt (${r.chapters} Kapitel).`);
      history.reload();
    } catch (e) {
      setError(errorText(e));
      setResult(null);
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
              <label key={c.id}><input type="checkbox" checked={chapterIds.includes(c.id)} onChange={() => t(chapterIds, setChapterIds, c.id)} /> {c.title} {c.versions.some((v: any) => v.status === 'approved') ? '✅' : <span className="muted small">(nicht freigegeben)</span>}</label>
            ))}
          </fieldset>
          <fieldset className="checks"><legend>Rollen</legend>{ref?.roles.filter((r) => r.code !== 'all').map((r) => <label key={r.code}><input type="checkbox" checked={roles.includes(r.code)} onChange={() => t(roles, setRoles, r.code)} /> <Badge item={r} /></label>)}</fieldset>
          <fieldset className="checks"><legend>Sparten</legend>{ref?.divisions.filter((d) => !['all', 'unconfirmed'].includes(d.code)).map((r) => <label key={r.code}><input type="checkbox" checked={divs.includes(r.code)} onChange={() => t(divs, setDivs, r.code)} /> <Badge item={r} /></label>)}</fieldset>
          <div className="form-row">
            <label>Markt <select value={market} onChange={(e) => setMarket(e.target.value)}><option value="">alle</option>{ref?.markets.map((m) => <option key={m.code}>{m.code}</option>)}</select></label>
            <label>Release <select value={release} onChange={(e) => setRelease(e.target.value)}><option value="">alle</option>{ref?.releases.map((m) => <option key={m.code}>{m.code}</option>)}</select></label>
            <label>Format <select value={format} onChange={(e) => setFormat(e.target.value)}><option value="md">Markdown</option><option value="html">HTML (druckfähig)</option><option value="pdf">PDF</option><option value="json">JSON</option></select></label>
          </div>
          <button className="btn primary" onClick={run}>Export erstellen</button>
          <ErrorBox error={error} />
        </Card>
        <Card title="Ergebnis">
          {!result ? <Empty>Noch kein Export in dieser Sitzung.</Empty> : (
            <>
              <p><DownloadButton className="btn primary" href={result.downloadUrl} name={result.fileName}>⬇ {result.fileName} herunterladen</DownloadButton></p>
              {result.skipped.map((s: any) => <div key={s.chapterId} className="alert small">{s.reason}</div>)}
              {result.preview === null ? <p className="muted">PDF erstellt ({Math.round(result.byteSize / 1024)} KB) – Vorschau nach dem Herunterladen.</p>
                : result.format === 'json' ? <pre tabIndex={0} aria-label="Quelltext" className="source small">{result.preview}</pre> : <div className="export-preview" tabIndex={0} role="region" aria-label="Exportvorschau"><Md text={result.preview} /></div>}
            </>
          )}
        </Card>
      </div>
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
