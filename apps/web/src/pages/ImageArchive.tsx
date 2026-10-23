import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, forgetMedia, mediaUrl, patch, post } from '../api';
import { readClipboardImage, usePasteImage } from '../components/clipboard';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Bildarchiv (ADR-085, F-20, F-21, F-23): feste Bildnummer, Merkmale, Prüfregeln, Versionen, Platzhalter, Bildabdeckung je Kapitel

const ROLES = [['dealer', 'Dealer'], ['market', 'Markt'], ['mo', 'MO'], ['hq', 'HQ'], ['all', 'Alle']];
const DIVISIONS = [['car', 'Pkw'], ['van', 'Van'], ['all', 'Pkw und Van']];
const SEV: Record<string, string> = { error: 'sev-high', warning: 'sev-medium', info: '' };

function Thumb({ sha, alt, large }: { sha: string; alt: string; large?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    mediaUrl(sha).then((u) => alive && setUrl(u), () => undefined);
    return () => {
      alive = false;
    };
  }, [sha]);
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
                    <Thumb sha={i.currentSha} alt="" />
                    <span>
                      <strong>{i.imageNo}</strong> {i.title ?? <span className="muted">ohne Bildunterschrift</span>}
                      {i.placeholder && <span className="tag sev-medium">Platzhalter</span>}
                      {i.versions.length > 1 && <span className="tag">Fassung {i.versions.length}</span>}
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
              <Thumb sha={item.currentSha} alt={item.title ?? item.imageNo} large />
              {item.checks.length > 0 && (
                <ul className="rl-findings" aria-label="Prüfregeln">
                  {item.checks.map((c: any) => <li key={c.rule}><span className={`tag small ${SEV[c.severity]}`}>{c.severity === 'error' ? 'Fehler' : c.severity === 'warning' ? 'Warnung' : 'Info'}</span> {c.message}</li>)}
                </ul>
              )}
              {item.usedIn.length > 0 && <p className="small">Verwendet in: {item.usedIn.map((c: any, n: number) => <span key={c.chapterId}>{n > 0 && ', '}<Link to={`/werkstatt/${c.chapterId}`}>{c.title}</Link></span>)}</p>}
              <p className="small">Einbinden: <code>{`![${item.title ?? 'Alternativtext'}](media:${item.sha})`}</code></p>
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
              <h3>Fassungen</h3>
              <ol className="small">
                {item.versions.map((v: any) => (
                  <li key={v.sha}>
                    Fassung {v.versionNo}{v.sha === item.currentSha && <span className="tag">aktuell</span>} · {new Date(v.createdAt).toLocaleDateString('de-DE')}{v.createdBy ? ` · ${v.createdBy}` : ''}{v.note ? ` – ${v.note}` : ''}{' '}
                    <DownloadButton className="btn link" href={v.url} name={`${item.imageNo}-v${v.versionNo}`}>Original</DownloadButton>
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
                  }}>📋 Aus Zwischenablage</button>
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
                  <td>{c.status}</td>
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
    </Page>
  );
}
