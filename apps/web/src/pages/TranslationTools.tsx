import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { del, download, patch, post } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Übersetzung (ADR-101): Übersetzungsspeicher (U-01) und Glossar je Sprache (U-04) – Pflege, Export wie im Arbeitsordner
// (SPEICHER.csv, GLOSSAR.csv) und Rückimport mit Vorschau

function useLanguages() {
  const langs = useLoad<any>('/languages');
  const project: string[] = langs.data?.projectLanguages ?? [];
  const name = (code: string) => langs.data?.languages.find((l: any) => l.code === code)?.name ?? code;
  return { project, name, loaded: !!langs.data };
}
function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((p) => p === 'edit' || p === 'admin');
}

function Tabs() {
  return (
    <nav className="tabs" aria-label="Übersetzung">
      <NavLink to="/uebersetzungen" end className={({ isActive }) => (isActive ? 'active' : '')}>Übersetzungen</NavLink>
      <NavLink to="/uebersetzungen/speicher" className={({ isActive }) => (isActive ? 'active' : '')}>Übersetzungsspeicher</NavLink>
      <NavLink to="/uebersetzungen/glossar" className={({ isActive }) => (isActive ? 'active' : '')}>Glossar je Sprache</NavLink>
    </nav>
  );
}

/** Datei hochladen: erst Vorschau, dann übernehmen */
function ImportBox({ label, path, describe, onDone }: { label: string; path: string; describe: (r: any) => string; onDone: () => void }) {
  const { notify } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const send = async (apply: boolean) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await post<any>(`${path}${path.includes('?') ? '&' : '?'}apply=${apply}`, fd);
      if (apply) {
        notify(`„${file.name}“ übernommen: ${describe(r)}`);
        setPreview(null);
        setFile(null);
        onDone();
      } else setPreview(r);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div className="filters">
      <label className="small">{label} <input type="file" accept=".csv,.xlsx" onChange={(e) => (setFile(e.target.files?.[0] ?? null), setPreview(null))} /></label>
      <button type="button" className="btn small" disabled={!file} onClick={() => void send(false)}>Prüfen</button>
      {preview && (
        <span className="small" role="status">
          Vorschau: {describe(preview)} <button type="button" className="btn small primary" onClick={() => void send(true)}>Übernehmen</button>
        </span>
      )}
    </div>
  );
}

export function TranslationMemoryPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const { project, name } = useLanguages();
  const [language, setLanguage] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!language && project.length) setLanguage(project[0]);
  }, [project.length]);
  const path = language ? `/translation-memory?language=${encodeURIComponent(language)}&q=${encodeURIComponent(q)}${status ? `&status=${status}` : ''}` : null;
  const tm = useLoad<any>(path, [path]);
  const [edit, setEdit] = useState<Record<string, string>>({});
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      tm.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const count = (st: string) => tm.data?.counts.find((c: any) => c.language === language && c.status === st)?.count ?? 0;
  return (
    <Page title="Übersetzungsspeicher" subtitle="Freigegebene Übersetzungen je Absatz und Sprachpaar: 100-%-Treffer werden beim Anlegen einer Übersetzung übernommen, ähnliche Treffer ab 75 % vorgeschlagen">
      <Tabs />
      {!project.length ? <div className="alert">Für dieses Projekt sind keine Zielsprachen festgelegt (<Link to="/projekte">Projekte</Link>).</div> : (
        <Card title={`Deutsch → ${name(language)}: ${count('approved')} freigegeben, ${count('review')} zu prüfen`} actions={(
          <span className="row-actions">
            <button type="button" className="btn small" onClick={() => download(`/api/v1/translation-memory/export?language=${language}&format=csv`, `SPEICHER_${language}.csv`).catch((e) => notify(errorText(e), 'error'))}>SPEICHER.csv</button>
            <button type="button" className="btn small" onClick={() => download(`/api/v1/translation-memory/export?language=${language}&format=xlsx`, `speicher_${language}.xlsx`).catch((e) => notify(errorText(e), 'error'))}>Excel</button>
          </span>
        )}>
          <div className="filters">
            <label>Zielsprache
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {project.map((l) => <option key={l} value={l}>{name(l)}</option>)}
              </select>
            </label>
            <label className="grow">Suche <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Deutsch oder Übersetzung" /></label>
            <label>Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">alle</option><option value="approved">freigegeben</option><option value="review">zu prüfen</option>
              </select>
            </label>
          </div>
          {canEdit && <ImportBox label="Import (SPEICHER.csv oder Excel: Deutsch; Sprache; Datei; Ausgangsversion; Status)" path={`/translation-memory/import?language=${language}`} onDone={() => tm.reload()}
            describe={(r) => `${r.usable} von ${r.rows} Zeilen verwendbar, ${r.approved} freigegeben${r.applied ? ` – ${r.added} neu, ${r.updated} aktualisiert` : ''}.`} />}
          <ErrorBox error={tm.error} />
          {!tm.data ? null : !tm.data.items.length ? <Empty>Noch keine Segmente. Sie entstehen bei der Freigabe einer Übersetzung bzw. eines übersetzten Releaseletters oder per Import.</Empty> : (
            <table className="table">
              <caption className="sr-only">Segmente im Übersetzungsspeicher</caption>
              <thead><tr><th scope="col">Deutsch</th><th scope="col">{name(language)}</th><th scope="col">Herkunft</th><th scope="col">Status</th><th scope="col">genutzt</th><th scope="col"><span className="sr-only">Aktion</span></th></tr></thead>
              <tbody>
                {tm.data.items.map((x: any) => (
                  <tr key={x.id}>
                    <td lang="de">{x.sourceText}</td>
                    <td lang={language}>
                      {canEdit && edit[x.id] !== undefined ? (
                        <textarea rows={3} aria-label={`Übersetzung bearbeiten: ${x.sourceText.slice(0, 40)}`} value={edit[x.id]} onChange={(e) => setEdit({ ...edit, [x.id]: e.target.value })} />
                      ) : x.targetText}
                    </td>
                    <td className="small">{x.origin === 'translation' ? 'Übersetzung' : x.origin === 'release_letter' ? 'Releaseletter' : 'Import'}{x.originRef ? ` · ${x.originRef}` : ''}{x.originVersion ? ` · ${x.originVersion}` : ''}</td>
                    <td>{x.status === 'approved' ? 'freigegeben' : <span className="tag">zu prüfen</span>}</td>
                    <td>{x.uses}</td>
                    <td>
                      {canEdit && (
                        <span className="row-actions">
                          {edit[x.id] !== undefined
                            ? <button type="button" className="btn small primary" onClick={() => void run(() => patch(`/translation-memory/${x.id}`, { targetText: edit[x.id] }), 'Segment gespeichert.').then(() => setEdit(({ [x.id]: _x, ...rest }) => rest))}>Speichern</button>
                            : <button type="button" className="btn small" aria-label={`Bearbeiten: ${x.sourceText.slice(0, 40)}`} onClick={() => setEdit({ ...edit, [x.id]: x.targetText })}>Bearbeiten</button>}
                          {x.status === 'review' && <button type="button" className="btn small" aria-label={`Freigeben: ${x.sourceText.slice(0, 40)}`} onClick={() => void run(() => patch(`/translation-memory/${x.id}`, { status: 'approved' }), 'Segment freigegeben.')}>Freigeben</button>}
                          <button type="button" className="btn small danger" aria-label={`Löschen: ${x.sourceText.slice(0, 40)}`} onClick={() => void run(() => del(`/translation-memory/${x.id}`), 'Segment gelöscht.')}>Löschen</button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tm.data && tm.data.total > tm.data.items.length && <p className="small muted">{tm.data.items.length} von {tm.data.total} Segmenten – Suche eingrenzen.</p>}
        </Card>
      )}
    </Page>
  );
}

export function TranslationGlossaryPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const { project, name } = useLanguages();
  const [language, setLanguage] = useState('');
  useEffect(() => {
    if (!language && project.length) setLanguage(project[0]);
  }, [project.length]);
  const g = useLoad<any>(language ? `/translation-glossary?language=${encodeURIComponent(language)}` : null, [language]);
  const items: any[] = g.data?.items ?? [];
  return (
    <Page title="Glossar je Sprache" subtitle="Feste Übersetzungen der Terminologie für Übersetzer und Büros – Export wie GLOSSAR.csv im Arbeitsordner, Rückimport mit Vorschau">
      <Tabs />
      {!project.length ? <div className="alert">Für dieses Projekt sind keine Zielsprachen festgelegt (<Link to="/projekte">Projekte</Link>).</div> : (
        <Card title={`Deutsch → ${name(language)}: ${items.filter((x) => x.status === 'bestätigt').length} von ${items.length} Begriffen mit fester Übersetzung`} actions={(
          <span className="row-actions">
            <button type="button" className="btn small" onClick={() => download(`/api/v1/translation-glossary/export?language=${language}&format=csv`, `GLOSSAR_${language}.csv`).catch((e) => notify(errorText(e), 'error'))}>GLOSSAR.csv</button>
            <button type="button" className="btn small" onClick={() => download(`/api/v1/translation-glossary/export?language=${language}&format=xlsx`, `glossar_${language}.xlsx`).catch((e) => notify(errorText(e), 'error'))}>Excel</button>
          </span>
        )}>
          <div className="filters">
            <label>Zielsprache
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {project.map((l) => <option key={l} value={l}>{name(l)}</option>)}
              </select>
            </label>
            <span className="small muted">Begriffe pflegen Sie in der <Link to="/terminologie">Terminologie</Link>.</span>
          </div>
          {canEdit && <ImportBox label="Rückimport (Deutsch; Sprache)" path={`/translation-glossary/import?language=${language}`} onDone={() => g.reload()}
            describe={(r) => `${r.changes.length} feste Übersetzungen neu bzw. geändert${r.unknown.length ? `, unbekannte Begriffe: ${r.unknown.join(', ')}` : ''}.`} />}
          <ErrorBox error={g.error} />
          {!items.length ? <Empty>Keine aktiven Begriffe in der Terminologie.</Empty> : (
            <table className="table">
              <caption className="sr-only">Glossar je Sprache</caption>
              <thead><tr><th scope="col">Deutsch</th><th scope="col">{name(language)}</th><th scope="col">Kontext</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.termId}>
                    <td lang="de"><strong>{x.term}</strong>{x.avoid.length > 0 && <div className="small muted">nicht: {x.avoid.join(', ')}</div>}</td>
                    <td lang={language}>{x.translation ?? <span className="muted">–</span>}{x.inherited && <span className="tag small">aus Grundsprache</span>}{x.keepUntranslated && <span className="tag small">nicht übersetzen</span>}</td>
                    <td className="small">{x.definition ?? ''}</td>
                    <td>{x.status === 'bestätigt' ? 'bestätigt' : <span className="tag">offen</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </Page>
  );
}
