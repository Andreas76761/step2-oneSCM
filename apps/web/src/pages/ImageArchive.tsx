import { ClipboardPasteIcon, XIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, del, forgetMedia, mediaUrl, patch, post, put } from '../api';
import { readClipboardImage, usePasteImage } from '../components/clipboard';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad, Status } from '../components/ui';

// Bildarchiv (ADR-085, F-20, F-21, F-23): feste Bildnummer, Merkmale, Prüfregeln, Versionen, Platzhalter, Bildabdeckung je Kapitel

const ROLES = [['dealer', 'Dealer'], ['market', 'Markt'], ['mo', 'MO'], ['hq', 'HQ'], ['all', 'Alle']];
const DIVISIONS = [['car', 'Pkw'], ['van', 'Van'], ['all', 'Pkw und Van']];
const SEV: Record<string, string> = { error: 'sev-high', warning: 'sev-medium', info: '' };

/** `rev` wechselt, wenn sich die ausgelieferte Fassung ändert (z. B. Unkenntlichmachung an/aus) */
function Thumb({ sha, alt, large, rev = '', query }: { sha: string; alt: string; large?: boolean; rev?: string; query?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    mediaUrl(sha, query ?? (rev ? `v=${rev.slice(0, 12)}` : '')).then((u) => alive && setUrl(u), () => undefined);
    return () => {
      alive = false;
    };
  }, [sha, rev, query]);
  return url ? <img className={`ia-thumb${large ? ' ia-preview' : ''}`} src={url} alt={alt} loading="lazy" /> : <span className="ia-thumb" aria-hidden="true" />;
}

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
}

export function ImageArchivePage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const [q, setQ] = useState('');
  const list = useLoad<any>(`/image-archive${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`, [q]);
  const cov = useLoad<any>('/image-archive/coverage');
  const nav = useLoad<any[]>('/metadata/labels?group=navigation');
  const [sel, setSel] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [phTitle, setPhTitle] = useState('');
  const [made, setMade] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const item = list.data?.items.find((i: any) => i.sha === sel) ?? null;
  useEffect(() => {
    setForm(item ? { title: item.title ?? '', language: item.language ?? '', roles: item.roles, divisions: item.divisions, markets: item.markets.join(', '), release: item.release ?? '', navLabelId: item.navigation?.id ?? '' } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.sha, item?.currentSha]);
  const reload = () => {
    list.reload();
    cov.reload();
  };
  const toggle = (k: 'roles' | 'divisions', v: string) => setForm({ ...form, [k]: form[k].includes(v) ? form[k].filter((x: string) => x !== v) : [...form[k], v] });
  const save = async () => {
    try {
      await patch(`/image-archive/${item.sha}`, {
        title: form.title || null, language: form.language || null, roles: form.roles, divisions: form.divisions,
        markets: form.markets.split(/[\s,;]+/).map((m: string) => m.trim().toUpperCase()).filter(Boolean), release: form.release || null, navLabelId: form.navLabelId || null,
      });
      notify(`${item.imageNo} gespeichert.`);
      reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const setOutline = async (outlineLabelId: string | null) => {
    try {
      await patch(`/image-archive/${item.sha}`, { outlineLabelId });
      notify(outlineLabelId ? 'Gliederungsstelle übernommen.' : 'Gliederungsstelle gelöst.');
      reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const upload = async (file: File | undefined) => {
    if (!file || !item) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (note.trim()) fd.append('note', note.trim());
      const r = await api<any>('POST', `/image-archive/${item.sha}/versions`, fd);
      // das Bild unter seiner ersten Kennung zeigt ab jetzt die neue Fassung
      forgetMedia(item.sha);
      notify(`${r.imageNo}: Fassung ${r.versions.length} hochgeladen – ersetzt das Bild überall.`);
      setNote('');
      reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  // F-23: neue Fassung direkt aus der Zwischenablage (Strg+V), solange ein Bild gewählt ist
  usePasteImage((f) => void upload(f), canEdit && !!item);
  const placeholder = async () => {
    try {
      const r = await post('/image-archive/placeholders', { title: phTitle });
      setMade(r.markdown);
      setPhTitle('');
      notify(`Platzhalter ${r.imageNo} angelegt.`);
      reload();
      setSel(r.sha);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const s = list.data?.summary;
  return (
    <Page title="Bildarchiv" subtitle="Alle Bilder mit fester Bildnummer, Merkmalen und Prüfregeln – neue Fassungen ersetzen ein Bild überall, Platzhalter reservieren die Nummer">
      <ErrorBox error={list.error ?? cov.error} />
      {s && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Bilder</span><strong>{s.images}</strong></div>
          <div className="stat"><span className="muted small">Platzhalter</span><strong>{s.placeholders}</strong></div>
          <div className="stat"><span className="muted small">mit Fehlern</span><strong>{s.withErrors}</strong></div>
          <div className="stat"><span className="muted small">mit Warnungen</span><strong>{s.withWarnings}</strong></div>
          <div className="stat"><span className="muted small">mit mehreren Fassungen</span><strong>{s.versioned}</strong></div>
        </div>
      )}
      <div className="grid2">
        <Card title="Bilder" actions={<label className="inline small">Suche <input type="search" value={q} placeholder="B-0001, Titel, Menüpunkt, Release" onChange={(e) => setQ(e.target.value)} /></label>}>
          {!list.data?.items.length ? <Empty>{q ? 'Keine Treffer.' : 'Noch keine Bilder. Bilder kommen über den Import, die Werkstatt oder als Platzhalter ins Archiv.'}</Empty> : (
            <ul className="ia-list" aria-label="Bilder">
              {list.data.items.map((i: any) => (
                <li key={i.sha}>
                  <button type="button" aria-current={i.sha === sel} onClick={() => setSel(i.sha)}>
                    <Thumb sha={i.currentSha} alt="" rev={i.redaction?.redactedSha ?? ''} />
                    <span>
                      <strong>{i.imageNo}</strong> {i.title ?? <span className="muted">ohne Bildunterschrift</span>}
                      {i.placeholder && <span className="tag sev-medium">Platzhalter</span>}
                      {i.versions.length > 1 && <span className="tag">Fassung {i.versions.length}</span>}
                      {i.redaction?.enabled && i.redaction.active > 0 && <span className="tag">unkenntlich</span>}
                      <span className="small muted ia-meta">{i.width && i.height ? `${i.width}×${i.height}` : i.mime} · {i.usedIn.length} Kapitel{i.sourceUses ? ` · ${i.sourceUses} Quellen` : ''}</span>
                      {i.checks.filter((c: any) => c.severity !== 'info').map((c: any) => <span key={c.rule} className={`tag small ${SEV[c.severity]}`}>{c.rule}</span>)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div>
          {item && form ? (
            <Card title={<>{item.imageNo} <span className="muted small">{item.title}</span></>}>
              <RedactionPanel item={item} canEdit={canEdit} onChange={reload} />
              {item.checks.length > 0 && (
                <ul className="rl-findings" aria-label="Prüfregeln">
                  {item.checks.map((c: any) => <li key={c.rule}><span className={`tag small ${SEV[c.severity]}`}>{c.severity === 'error' ? 'Fehler' : c.severity === 'warning' ? 'Warnung' : 'Info'}</span> {c.message}</li>)}
                </ul>
              )}
              {item.usedIn.length > 0 && <p className="small">Verwendet in: {item.usedIn.map((c: any, n: number) => <span key={c.chapterId}>{n > 0 && ', '}<Link to={`/werkstatt/${c.chapterId}`}>{c.title}</Link></span>)}</p>}
              <p className="small">Einbinden: <code>{`![${item.title ?? 'Alternativtext'}](media:${item.sha})`}</code></p>
              <ImageLabels item={item} canEdit={canEdit} onChange={reload} />
              {/* F-25: Gliederungsstelle – Vorschlag aus dem Folientext, übernommen nur von Hand */}
              <section className="ia-outline" aria-label="Gliederungsstelle">
                <p className="small"><strong>Gliederungsstelle:</strong> {item.outline ? item.outline.nameDe : <span className="muted">nicht zugeordnet</span>}
                  {item.outline && canEdit && <> <button type="button" className="btn small ghost" onClick={() => void setOutline(null)}>Lösen</button></>}</p>
                {item.source && <p className="small muted">Aus {item.source.path}{item.source.slide ? `, Folie ${item.source.slide}` : ''}{item.source.slideTitle ? ` „${item.source.slideTitle}“` : ''}</p>}
                {item.source?.suggestions?.filter((x: any) => x.labelId !== item.outline?.id).map((x: any) => (
                  <p key={x.labelId} className="small">Vorschlag: {x.name} <span className="muted">({Math.round(x.score * 100)} % · {x.matched.join(', ')})</span>{' '}
                    {canEdit && <button type="button" className="btn small" aria-label={`${x.name} als Gliederungsstelle übernehmen`} onClick={() => void setOutline(x.labelId)}>Übernehmen</button>}</p>
                ))}
              </section>
              <fieldset disabled={!canEdit}>
                <legend>Merkmale</legend>
                <label className="block">Bildunterschrift (Bildverzeichnis) <input value={form.title} maxLength={300} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
                <div className="filters">
                  <label>Sprache <input value={form.language} maxLength={2} size={3} placeholder="de" onChange={(e) => setForm({ ...form, language: e.target.value.toLowerCase() })} /></label>
                  <label>Märkte <input value={form.markets} placeholder="DE, AT" onChange={(e) => setForm({ ...form, markets: e.target.value })} /></label>
                  <label>Release <input value={form.release} maxLength={60} placeholder="2026.3" onChange={(e) => setForm({ ...form, release: e.target.value })} /></label>
                </div>
                <label className="block">Reiter / Menüpunkt
                  <select value={form.navLabelId} onChange={(e) => setForm({ ...form, navLabelId: e.target.value })}>
                    <option value="">–</option>
                    {(nav.data ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.nameDe}</option>)}
                  </select>
                </label>
                <fieldset className="filters"><legend className="small">Rollen</legend>
                  {ROLES.map(([v, t]) => <label key={v} className="small"><input type="checkbox" checked={form.roles.includes(v)} onChange={() => toggle('roles', v)} /> {t}</label>)}
                </fieldset>
                <fieldset className="filters"><legend className="small">Sparten</legend>
                  {DIVISIONS.map(([v, t]) => <label key={v} className="small"><input type="checkbox" checked={form.divisions.includes(v)} onChange={() => toggle('divisions', v)} /> {t}</label>)}
                </fieldset>
                {canEdit && <button className="btn primary" onClick={save}>Merkmale speichern</button>}
              </fieldset>
              {/* F-22: Varianten derselben Maske – im Export und in Übersetzungen wird die passende Fassung eingesetzt */}
              <section aria-label="Varianten dieser Maske">
                <h3>Varianten dieser Maske</h3>
                {item.variants.length ? (
                  <ul className="small">
                    {item.variants.map((v: any) => (
                      <li key={v.sha}>
                        <button type="button" className="btn link" onClick={() => setSel(v.sha)}>{v.imageNo}</button> {v.title ?? ''}
                        <span className="muted"> · {[v.language?.toUpperCase(), v.roles.join('/'), v.divisions.join('/'), v.markets.join('/')].filter(Boolean).join(' · ') || 'ohne Merkmale'}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="small muted">Keine Varianten verknüpft.</p>}
                {canEdit && (
                  <div className="filters">
                    <label className="grow">Variante verknüpfen
                      <select value="" onChange={async (e) => {
                        const v = e.target.value;
                        if (!v) return;
                        try {
                          await post(`/image-archive/${item.sha}/variants`, { withSha: v });
                          notify('Variante verknüpft.');
                          reload();
                        } catch (err) {
                          notify(errorText(err), 'error');
                        }
                      }}>
                        <option value="">– Bild wählen –</option>
                        {(list.data?.items ?? []).filter((x: any) => x.sha !== item.sha && !item.variants.some((v: any) => v.sha === x.sha)).map((x: any) => <option key={x.sha} value={x.sha}>{x.imageNo} {x.title ?? ''}</option>)}
                      </select>
                    </label>
                    {item.variantGroup && <button type="button" className="btn small ghost" onClick={async () => {
                      try {
                        await del(`/image-archive/${item.sha}/variants`);
                        notify('Aus der Variantengruppe gelöst.');
                        reload();
                      } catch (err) {
                        notify(errorText(err), 'error');
                      }
                    }}>Aus Gruppe lösen</button>}
                  </div>
                )}
                <p className="small muted">Im Export und in Übersetzungen wird je Verweis die Variante mit passender Sprache, Rolle, Sparte und Markt eingesetzt.</p>
              </section>
              <h3>Fassungen</h3>
              <ol className="small">
                {item.versions.map((v: any) => (
                  <li key={v.sha}>
                    Fassung {v.versionNo}{v.sha === item.currentSha && <span className="tag">aktuell</span>} · {new Date(v.createdAt).toLocaleDateString('de-DE')}{v.createdBy ? ` · ${v.createdBy}` : ''}{v.note ? ` – ${v.note}` : ''}{' '}
                    <DownloadButton className="btn link" href={v.url} name={`${item.imageNo}-v${v.versionNo}`}>Herunterladen</DownloadButton>
                    {canEdit && <> · <DownloadButton className="btn link" href={v.originalUrl} name={`${item.imageNo}-v${v.versionNo}-original`}>Original (ohne Unkenntlichmachung)</DownloadButton></>}
                  </li>
                ))}
              </ol>
              {canEdit && (
                <div className="filters">
                  <label className="grow">Anlass <input value={note} maxLength={300} placeholder="z. B. Release 2026.3, neue Maske" onChange={(e) => setNote(e.target.value)} /></label>
                  <label>Neue Fassung <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={(e) => void upload(e.target.files?.[0])} /></label>
                  <button type="button" className="btn" onClick={async () => {
                    try {
                      await upload(await readClipboardImage());
                    } catch (e) {
                      notify(errorText(e), 'error');
                    }
                  }}><Ico icon={ClipboardPasteIcon} />Aus Zwischenablage</button>
                </div>
              )}
              {canEdit && <p className="small muted">Tipp: Strg+V fügt einen Screenshot aus der Zwischenablage als neue Fassung ein. Zuschneiden und markieren Sie Screenshots in der Werkstatt (Screenshot markieren).</p>}
            </Card>
          ) : <Card title="Bild"><Empty>Wählen Sie links ein Bild.</Empty></Card>}
          {canEdit && (
            <Card title="Platzhalter anlegen">
              <p className="small muted">Reserviert die nächste Bildnummer, bis der echte Screenshot vorliegt. Ein Platzhalter in einem freigegebenen Kapitel gilt als Fehler.</p>
              <div className="filters">
                <label className="grow">Was soll das Bild zeigen? <input value={phTitle} maxLength={200} placeholder="z. B. Vertragsliste mit Filter" onChange={(e) => setPhTitle(e.target.value)} /></label>
                <button className="btn" disabled={phTitle.trim().length < 3} onClick={placeholder}>Platzhalter anlegen</button>
              </div>
              {made && <p className="small">In den Text einfügen: <code>{made}</code></p>}
            </Card>
          )}
          {canEdit && <ClickpathBuilder images={list.data?.items ?? []} onDone={reload} />}
        </div>
      </div>
      <Card title="Bildabdeckung je Kapitel">
        {!cov.data?.items.length ? <Empty>Noch keine Kapitelversionen.</Empty> : (
          <table className="table compact">
            <thead><tr><th>Kapitel</th><th>Status</th><th>Bilder</th><th>Platzhalter</th><th>ohne Alternativtext</th><th>Schritte mit Bild</th><th>Abdeckung</th></tr></thead>
            <tbody>
              {cov.data.items.map((c: any) => (
                <tr key={c.chapterId}>
                  <td><Link to={`/werkstatt/${c.chapterId}`}>{c.title}</Link></td>
                  <td><Status s={c.status} /></td>
                  <td>{c.images}</td>
                  <td>{c.placeholders || ''}</td>
                  <td>{c.missingAlt ? <span className="tag sev-high">{c.missingAlt}</span> : ''}</td>
                  <td>{c.stepBlocks ? `${c.stepBlocksWithImage} von ${c.stepBlocks}` : '–'}</td>
                  <td><meter min={0} max={100} value={c.coverage} aria-label={`Abdeckung ${c.title}`} /> {c.coverage} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <CoverageMatrix />
    </Page>
  );
}

const DIM_LABEL: Record<string, string> = { language: 'Sprache', role: 'Rolle', division: 'Sparte' };
// eindeutige Beschriftung neben dem Merkmalsfeld „Sprache“ des Bildes
const DIM_CHOICE: Record<string, string> = { language: 'je Sprachfassung', role: 'je Rolle', division: 'je Sparte' };

/** Deckungsmatrix (ADR-092, F-30): Stelle × Sprache/Rolle/Sparte – wo fehlt die passende Bildfassung? */
function CoverageMatrix() {
  const [rows, setRows] = useState('navigation');
  const [dims, setDims] = useState<string[]>(['language', 'division']);
  const query = `rows=${rows}&dims=${dims.join(',')}`;
  const m = useLoad<any>(dims.length ? `/image-archive/coverage-matrix?${query}` : null, [query]);
  const toggle = (d: string) => setDims((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  return (
    <Card title="Deckungsmatrix" actions={dims.length > 0 && <span className="row-actions">
      {(['xlsx', 'csv'] as const).map((f) => <DownloadButton key={f} className="btn small" href={`/api/v1/image-archive/coverage-matrix/export?${query}&format=${f}`} name={`deckungsmatrix.${f}`}>⬇ {f.toUpperCase()}</DownloadButton>)}
    </span>}>
      <div className="filters">
        <label>Zeilen <select value={rows} onChange={(e) => setRows(e.target.value)}><option value="navigation">je Reiter/Menüpunkt</option><option value="variant">je Maske (Varianten)</option><option value="chapter">je Kapitel</option><option value="outline">je Gliederungspunkt</option></select></label>
        <fieldset className="inline">
          <legend className="small">Spalten</legend>
          {Object.entries(DIM_LABEL).map(([d, l]) => <label key={d} className="small"><input type="checkbox" checked={dims.includes(d)} onChange={() => toggle(d)} /> {DIM_CHOICE[d]}</label>)}
        </fieldset>
      </div>
      <ErrorBox error={m.error} />
      {!dims.length ? <Empty>Wählen Sie mindestens ein Merkmal.</Empty> : !m.data ? null : !m.data.rows.length ? <Empty>Noch keine Bilder im Archiv.</Empty> : (
        <>
          <p className="small">
            {m.data.summary.covered} von {m.data.summary.cells} Feldern abgedeckt ({m.data.summary.coverage} %) · <span className="tag sev-high">{m.data.summary.gaps} Lücken</span> · {m.data.summary.placeholderOnly} nur mit Platzhalter
            {m.data.summary.unassigned > 0 && <> · {m.data.summary.unassigned} Bilder ohne Angabe zu {dims.map((d) => DIM_LABEL[d]).join('/')} (keiner Spalte zugeordnet)</>}
          </p>
          <div className="table-wrap" role="region" aria-label="Deckungsmatrix" tabIndex={0}>
            <table className="table compact matrix">
              <thead><tr><th>{rows === 'chapter' ? 'Kapitel' : rows === 'variant' ? 'Maske' : rows === 'outline' ? 'Gliederungspunkt' : 'Reiter/Menüpunkt'}</th><th>Bilder</th>{m.data.columns.map((c: any) => <th key={c.key}>{c.label}</th>)}</tr></thead>
              <tbody>
                {m.data.rows.map((r: any) => (
                  <tr key={r.key}>
                    <th scope="row">{r.label}</th>
                    <td>{r.images}</td>
                    {r.cells.map((c: any, i: number) => (
                      <td key={c.key} className={c.count ? 'cov-ok' : c.placeholders ? 'cov-ph' : 'cov-gap'} title={c.images.join(', ')}>
                        {c.count ? `✓ ${c.count}` : c.placeholders ? 'Platzhalter' : '–'}
                        <span className="sr-only">{c.count ? ' abgedeckt' : c.placeholders ? ' nur Platzhalter' : ' Lücke'} – {m.data.columns[i].label}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted">Bilder für „alle“ Rollen bzw. Sparten decken jede Rolle bzw. Sparte ab. Merkmale pflegen Sie oben je Bild.</p>
        </>
      )}
    </Card>
  );
}

type Station = { alternatives: { sha: string; caption: string }[] };

/** Klickstrecke aus Screenshots (ADR-093, F-24): Stationen aus Bildern des Archivs, parallele Wege als 3a/3b */
function ClickpathBuilder({ images, onDone }: { images: any[]; onDone: () => void }) {
  const { notify } = useApp();
  const saved = useLoad<any[]>('/image-clickpaths');
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [perRow, setPerRow] = useState(4);
  const empty = (): Station => ({ alternatives: [{ sha: '', caption: '' }] });
  const [steps, setSteps] = useState<Station[]>([empty(), empty()]);
  const [result, setResult] = useState<any>(null);
  const setAlt = (i: number, k: number, patchAlt: Partial<{ sha: string; caption: string }>) =>
    setSteps(steps.map((s, n) => (n === i ? { alternatives: s.alternatives.map((a, m) => (m === k ? { ...a, ...patchAlt } : a)) } : s)));
  const move = (i: number, d: number) => {
    const next = [...steps];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setSteps(next);
  };
  const label = (i: number, k: number) => (steps[i].alternatives.length > 1 ? `${i + 1}${String.fromCharCode(97 + k)}` : String(i + 1));
  const ready = title.trim().length >= 3 && steps.length >= 2 && steps.every((s) => s.alternatives.every((a) => a.sha));
  const submit = async () => {
    try {
      const body = { title, perRow, steps };
      const r = editId ? await put<any>(`/image-clickpaths/${editId}`, body) : await post<any>('/image-clickpaths', body);
      forgetMedia(r.baseSha); // neue Fassung unter derselben Adresse
      notify(editId ? 'Klickstrecke aktualisiert – neue Fassung im Bildarchiv.' : 'Klickstrecke im Bildarchiv abgelegt.');
      setResult(r);
      setEditId(r.id);
      saved.reload();
      onDone();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const load = (c: any) => {
    setEditId(c.id);
    setTitle(c.title);
    setPerRow(c.perRow);
    setSteps(c.steps);
    setResult(null);
  };
  return (
    <Card title="Klickstrecke aus Screenshots">
      <p className="small muted">Stationen aus Bildern des Archivs, nummeriert und mit Pfeilen verbunden. Mehrere Bilder einer Station sind parallele Wege (3a, 3b). Das Ergebnis liegt als Bild im Archiv; Änderungen werden eine neue Fassung.</p>
      {(saved.data?.length ?? 0) > 0 && (
        <label className="block small">Gespeicherte Klickstrecke bearbeiten
          <select value={editId ?? ''} onChange={(e) => { const c = saved.data!.find((x) => x.id === e.target.value); if (c) load(c); else { setEditId(null); setTitle(''); setSteps([empty(), empty()]); } }}>
            <option value="">– neu –</option>
            {saved.data!.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
      )}
      {editId && <p className="small"><DownloadButton className="btn small" href={`/api/v1/image-clickpaths/${editId}/bpmn`} name="klickstrecke.bpmn">⬇ Als BPMN 2.0 (Prozessmodell)</DownloadButton></p>}
      <div className="filters">
        <label className="grow">Titel der Klickstrecke <input value={title} maxLength={120} placeholder="z. B. Vertrag anlegen" onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Stationen je Zeile <select value={perRow} onChange={(e) => setPerRow(Number(e.target.value))}>{[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      <ol className="clickpath-steps" aria-label="Stationen">
        {steps.map((s, i) => (
          <li key={i}>
            {s.alternatives.map((a, k) => (
              <div key={k} className="filters">
                <span className="tag">{label(i, k)}</span>
                <label>Bild für {label(i, k)}
                  <select value={a.sha} onChange={(e) => setAlt(i, k, { sha: e.target.value })}>
                    <option value="">– Bild wählen –</option>
                    {images.map((x: any) => <option key={x.sha} value={x.sha}>{x.imageNo} {x.title ?? ''}</option>)}
                  </select>
                </label>
                <label className="grow">Beschriftung {label(i, k)} <input value={a.caption} maxLength={80} placeholder="z. B. Neu anlegen" onChange={(e) => setAlt(i, k, { caption: e.target.value })} /></label>
                {s.alternatives.length > 1 && <button type="button" className="btn small ghost" aria-label={`Weg ${label(i, k)} entfernen`} onClick={() => setSteps(steps.map((x, n) => (n === i ? { alternatives: x.alternatives.filter((_, m) => m !== k) } : x)))}><Ico icon={XIcon} /></button>}
              </div>
            ))}
            <div className="row-actions">
              {s.alternatives.length < 3 && <button type="button" className="btn small" onClick={() => setSteps(steps.map((x, n) => (n === i ? { alternatives: [...x.alternatives, { sha: '', caption: '' }] } : x)))}>+ paralleler Weg</button>}
              {i > 0 && <button type="button" className="btn small ghost" aria-label={`Station ${i + 1} nach oben`} onClick={() => move(i, -1)}>↑</button>}
              {i < steps.length - 1 && <button type="button" className="btn small ghost" aria-label={`Station ${i + 1} nach unten`} onClick={() => move(i, 1)}>↓</button>}
              {steps.length > 2 && <button type="button" className="btn small ghost" aria-label={`Station ${i + 1} entfernen`} onClick={() => setSteps(steps.filter((_, n) => n !== i))}>Station entfernen</button>}
            </div>
          </li>
        ))}
      </ol>
      <div className="row-actions">
        {steps.length < 12 && <button type="button" className="btn" onClick={() => setSteps([...steps, empty()])}>+ Station</button>}
        <button type="button" className="btn primary" disabled={!ready} onClick={() => void submit()}>{editId ? 'Klickstrecke aktualisieren' : 'Klickstrecke erstellen'}</button>
      </div>
      {result && (
        <div>
          <Thumb sha={result.baseSha} alt={result.alt} large />
          <p className="small">In den Text einfügen: <code>{result.markdown}</code></p>
        </div>
      )}
    </Card>
  );
}

const KIND: Record<string, string> = { email: 'E-Mail', phone: 'Telefon', iban: 'IBAN', vin: 'FIN', plate: 'Kennzeichen', user_id: 'User-ID', address: 'Adresse', name: 'Name', manual: 'manuell' };
type Box = { x: number; y: number; w: number; h: number };

/**
 * Datenschutz im Bild (ADR-095): erkannte Stellen (Name, User-ID, Adresse, FIN …) werden verpixelt ausgeliefert.
 * Unkenntlichmachung an/aus, je Stelle an/aus, eigene Stellen per Ziehen mit der Maus; das Original bleibt erhalten.
 */
function RedactionPanel({ item, canEdit, onChange }: { item: any; canEdit: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const sha = item.currentSha;
  const r = useLoad<any>(`/image-archive/${sha}/redaction`, [sha]);
  const [showOriginal, setShowOriginal] = useState(false);
  const [drag, setDrag] = useState<{ start: { x: number; y: number }; box: Box } | null>(null);
  const [pending, setPending] = useState<Box | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setShowOriginal(false);
    setPending(null);
  }, [sha]);
  const d = r.data;
  const raster = !['image/svg+xml'].includes(item.mime);
  const send = async (body: object, msg: string) => {
    setBusy(true);
    try {
      await patch(`/image-archive/${sha}/redaction`, body);
      notify(msg);
      setPending(null);
      r.reload();
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const detect = async () => {
    setBusy(true);
    try {
      const x = await post(`/image-archive/${sha}/redaction/detect`, {});
      notify(x.status === 'done' ? `${x.regions.filter((g: any) => g.source === 'ocr').length} Stelle(n) erkannt.` : x.status === 'unavailable' ? 'Keine Texterkennung eingerichtet – Stellen bitte von Hand markieren.' : `Texterkennung fehlgeschlagen: ${x.error ?? ''}`, x.status === 'failed' ? 'error' : undefined);
      r.reload();
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const rel = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    return { x: Math.min(Math.max((e.clientX - b.left) / b.width, 0), 1), y: Math.min(Math.max((e.clientY - b.top) / b.height, 0), 1) };
  };
  const editable = canEdit && raster && !busy;
  const boxStyle = (g: Box) => ({ left: `${g.x * 100}%`, top: `${g.y * 100}%`, width: `${g.w * 100}%`, height: `${g.h * 100}%` });
  const regions: any[] = d?.regions ?? [];
  return (
    <section className="ia-redact" aria-label="Datenschutz im Bild">
      <div
        className={`ia-redact-stage${editable ? ' editable' : ''}`}
        onPointerDown={editable ? (e) => {
          const p = rel(e);
          e.currentTarget.setPointerCapture(e.pointerId);
          setDrag({ start: p, box: { ...p, w: 0, h: 0 } });
        } : undefined}
        onPointerMove={drag ? (e) => {
          const p = rel(e);
          setDrag({ ...drag, box: { x: Math.min(p.x, drag.start.x), y: Math.min(p.y, drag.start.y), w: Math.abs(p.x - drag.start.x), h: Math.abs(p.y - drag.start.y) } });
        } : undefined}
        onPointerUp={drag ? () => {
          if (drag.box.w > 0.005 && drag.box.h > 0.005) setPending(drag.box);
          setDrag(null);
        } : undefined}
      >
        <Thumb sha={sha} alt={item.title ?? item.imageNo} large rev={d?.redactedSha ?? item.redaction?.redactedSha ?? ''} query={showOriginal ? 'original=1&unredacted=1' : undefined} />
        {canEdit && regions.map((g) => <span key={g.id} className={`ia-box${g.active && d?.enabled ? ' on' : ''}${g.source === 'manual' ? ' manual' : ''}`} style={boxStyle(g)} aria-hidden="true"><span>{g.id}</span></span>)}
        {(drag || pending) && <span className="ia-box new" style={boxStyle(drag?.box ?? pending!)} aria-hidden="true" />}
      </div>
      <ErrorBox error={r.error} />
      {d && (
        <>
          <p className="small">
            <strong>Datenschutz im Bild:</strong>{' '}
            {!raster ? <span className="muted">nur für Rasterbilder (PNG, JPEG, WebP, GIF).</span>
              : d.enabled && d.active ? <>{d.active} Stelle(n) unkenntlich gemacht – ausgeliefert und exportiert wird die verpixelte Fassung, das Original bleibt erhalten.</>
              : regions.length ? <span className="sev-medium">Unkenntlichmachung ist ausgeschaltet – das Original ist sichtbar.</span>
              : d.status === 'done' ? <>Keine personenbezogenen Daten erkannt.</>
              : d.status === 'failed' ? <span className="sev-medium">Texterkennung fehlgeschlagen: {d.error}</span>
              : d.available ? <span className="muted">Noch nicht geprüft.</span>
              : <span className="muted">Keine Texterkennung eingerichtet (OCR_CMD bzw. OCR_BOXES_CMD) – Stellen von Hand markieren.</span>}
          </p>
          {canEdit && raster && (
            <div className="filters">
              <label className="small"><input type="checkbox" checked={d.enabled} disabled={busy || !regions.length} onChange={(e) => void send({ enabled: e.target.checked }, e.target.checked ? 'Unkenntlichmachung eingeschaltet.' : 'Rückgängig gemacht – das Original wird wieder gezeigt.')} /> Personenbezogene Daten unkenntlich machen</label>
              <label className="small"><input type="checkbox" checked={showOriginal} onChange={(e) => setShowOriginal(e.target.checked)} /> Original ansehen</label>
              {d.available && <button type="button" className="btn small" disabled={busy} onClick={() => void detect()}>{d.status === 'done' ? 'Erneut erkennen' : 'Jetzt erkennen'}</button>}
            </div>
          )}
          {canEdit && regions.length > 0 && (
            <ul className="small ia-regions" aria-label="Stellen">
              {regions.map((g) => (
                <li key={g.id}>
                  <label><input type="checkbox" checked={g.active} disabled={busy} onChange={(e) => void send({ regions: [{ id: g.id, active: e.target.checked }] }, `Stelle ${g.id} ${e.target.checked ? 'unkenntlich' : 'sichtbar'}.`)} /> {g.id} · {KIND[g.kind] ?? g.kind}{g.source === 'ocr' ? ` „${g.label}“` : ''}</label>
                  {g.source === 'manual' && <button type="button" className="btn link small" disabled={busy} aria-label={`Stelle ${g.id} entfernen`} onClick={() => void send({ remove: [g.id] }, `Stelle ${g.id} entfernt.`)}>entfernen</button>}
                </li>
              ))}
            </ul>
          )}
          {editable && (pending ? (
            <p className="small">Neue Stelle markiert.{' '}
              <button type="button" className="btn small primary" onClick={() => void send({ add: [pending], enabled: true }, 'Stelle hinzugefügt und unkenntlich gemacht.')}>Stelle unkenntlich machen</button>{' '}
              <button type="button" className="btn small ghost" onClick={() => setPending(null)}>Verwerfen</button></p>
          ) : <ManualRegion onAdd={setPending} />)}
        </>
      )}
    </section>
  );
}

/** Stelle ohne Maus angeben (Prozent vom Bild) – Alternative zum Ziehen */
function ManualRegion({ onAdd }: { onAdd: (b: Box) => void }) {
  const [v, setV] = useState({ x: '', y: '', w: '', h: '' });
  const n = (k: keyof typeof v) => Number(v[k].replace(',', '.')) / 100;
  const ok = (['x', 'y', 'w', 'h'] as const).every((k) => v[k].trim() && Number.isFinite(n(k))) && n('w') > 0 && n('h') > 0;
  return (
    <details className="small">
      <summary>Stelle markieren: im Bild mit der Maus ziehen oder hier in Prozent angeben</summary>
      <div className="filters">
        {([['x', 'von links %'], ['y', 'von oben %'], ['w', 'Breite %'], ['h', 'Höhe %']] as const).map(([k, l]) => (
          <label key={k}>{l} <input inputMode="decimal" size={4} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></label>
        ))}
        <button type="button" className="btn small" disabled={!ok} onClick={() => onAdd({ x: n('x'), y: n('y'), w: n('w'), h: n('h') })}>Übernehmen</button>
      </div>
    </details>
  );
}

const LABEL_GROUPS: [string, string][] = [['domain', 'Domäne'], ['role', 'Rolle'], ['outline', 'Gliederung']];
const OTHER_GROUPS = ['navigation', 'content', 'division', 'customer', 'system', 'quality'];

/** Mehrere Labels (Domäne, Rolle, Gliederung, weitere) und Kapitel je Bild (ADR-095); Sprache steht unter „Merkmale“ */
function ImageLabels({ item, canEdit, onChange }: { item: any; canEdit: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const all = useLoad<any[]>('/metadata/labels');
  const chapters = useLoad<any[]>('/chapters');
  const labelIds: string[] = item.labels.map((l: any) => l.id);
  const chapterIds: string[] = item.chapters.map((c: any) => c.id);
  const send = async (body: object, msg: string) => {
    try {
      await patch(`/image-archive/${item.sha}`, body);
      notify(msg);
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const groups: [string, string, string[]][] = [...LABEL_GROUPS.map(([g, t]) => [g, t, [g]] as [string, string, string[]]), ['other', 'Weitere Labels', OTHER_GROUPS]];
  const chip = (id: string, text: string, onRemove: () => void) => (
    <span key={id} className="tag ia-chip">{text}{canEdit && <button type="button" className="btn link small" aria-label={`${text} entfernen`} onClick={onRemove}>×</button>}</span>
  );
  return (
    <section className="ia-labels" aria-label="Labels und Kapitel">
      <h3>Labels und Kapitel</h3>
      <ErrorBox error={all.error ?? chapters.error} />
      <dl className="ia-label-groups small">
        <dt>Sprache</dt>
        <dd>{item.language ? <span className="tag">{item.language.toUpperCase()}</span> : <span className="muted">nicht angegeben (unter Merkmale)</span>}</dd>
        {groups.map(([key, title, gs]) => {
          const mine = item.labels.filter((l: any) => gs.includes(l.group));
          const free = (all.data ?? []).filter((l: any) => gs.includes(l.group) && !labelIds.includes(l.id));
          if (key === 'other' && !mine.length && !free.length) return null;
          return (
            <div key={key} className="ia-label-row">
              <dt>{title}</dt>
              <dd>
                {mine.map((l: any) => chip(l.id, l.nameDe, () => void send({ removeLabelIds: [l.id] }, `${l.nameDe} entfernt.`)))}
                {!mine.length && <span className="muted">– </span>}
                {canEdit && free.length > 0 && (
                  <select aria-label={`${title} hinzufügen`} value="" onChange={(e) => e.target.value && void send({ addLabelIds: [e.target.value] }, 'Label hinzugefügt.')}>
                    <option value="">+ hinzufügen</option>
                    {free.map((l: any) => <option key={l.id} value={l.id}>{key === 'other' ? `${l.group}: ` : ''}{l.nameDe}</option>)}
                  </select>
                )}
              </dd>
            </div>
          );
        })}
        <dt>Kapitel</dt>
        <dd>
          {item.chapters.map((c: any) => chip(c.id, c.title, () => void send({ removeChapterIds: [c.id] }, `${c.title} entfernt.`)))}
          {!item.chapters.length && <span className="muted">– </span>}
          {canEdit && (chapters.data ?? []).some((c: any) => !chapterIds.includes(c.id)) && (
            <select aria-label="Kapitel hinzufügen" value="" onChange={(e) => e.target.value && void send({ addChapterIds: [e.target.value] }, 'Kapitel zugeordnet.')}>
              <option value="">+ hinzufügen</option>
              {(chapters.data ?? []).filter((c: any) => !chapterIds.includes(c.id)).map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          )}
        </dd>
      </dl>
    </section>
  );
}
