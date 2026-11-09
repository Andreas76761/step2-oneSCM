// Schreibstil (ADR-040): Regeln – eigene Formulierungsregeln, Tonalität, Regelsätze (tekom, STE, Vale), Austausch und Bibliotheken.
import { XIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useEffect, useState } from 'react';
import { api, currentProjectId, del, patch, post, put } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, errorText, useApp, useLoad } from '../components/ui';

/** Prüf- und Bearbeitungsfläche für einen Text (freies Textfeld oder Kapitelabsatz) */

const RULE_NAMES: Record<string, string> = {
  long_sentence: 'Lange Sätze', passive: 'Passiv', future: 'Futur', past: 'Vergangenheit', filler: 'Füllwörter', double_word: 'Doppelte Wörter',
  punctuation: 'Zeichensetzung', capitalization: 'Großschreibung am Satzanfang', impersonal: 'Unpersönlich („man“)', colloquial: 'Umgangssprache',
  hedging: 'Unklare Anweisungen', nominal: 'Nominalstil', spelling: 'Rechtschreibung', abbreviation: 'Abkürzungen', terminology: 'Terminologie',
  custom: 'Eigene Regeln', address: 'Anrede',
  typography: 'Typografie („…“, –, ›)', numbers: 'Zahlen, Einheiten, Datum', product_name: 'Produktname oneSCM', grammar: 'Grammatik (Englisch: a/an, „I“)',
  tone: 'Tonalität (je Produktart und Rolle)', rule_set: 'Regelsätze (unten ein- und ausschalten)',
};

interface Phrase { avoid: string; use: string | null; note: string | null; language?: string | null }

// Sprachen eigener Regeln (ADR-097): Deutsch und die Zielsprachen
export const PHRASE_LANGS: [string, string][] = [['de', 'Deutsch'], ['en', 'Englisch'], ['fr', 'Französisch'], ['es', 'Spanisch'], ['it', 'Italienisch'], ['nl', 'Niederländisch'], ['pl', 'Polnisch'], ['cs', 'Tschechisch'], ['pt', 'Portugiesisch'], ['sk', 'Slowakisch'], ['ko', 'Koreanisch'], ['ms', 'Malaiisch']];

/** Tonalität je Produktart und Rolle (ADR-102, S-02): leer = Ton aus TONALITAET.md bzw. der Produktart */
function ToneCard({ d, setD, ro }: { d: any; setD: (d: any) => void; ro: boolean }) {
  const tone = useLoad<any>('/style/tone');
  if (!tone.data) return <ErrorBox error={tone.error} />;
  const t = d.tone ?? { products: {}, roles: {} };
  const set = (kind: 'products' | 'roles', key: string, value: string) => {
    const next = { ...t[kind] };
    if (value) next[key] = value;
    else delete next[key];
    setD({ ...d, tone: { ...t, [kind]: next } });
  };
  const label = (code: string) => tone.data.tones.find((x: any) => x.tone === code)?.label ?? code;
  return (
    <Card title="Tonalität">
      <p className="small muted">Ton je Produktart (Vorgabe aus TONALITAET.md) und je Rolle: Ein Rollenprofil gilt für Absätze, die genau dieser Rolle zugeordnet sind. Der Ton wirkt auf die Prüfung (Regel „Tonalität“) und auf die KI-Vorschläge.</p>
      <ul className="small">{tone.data.tones.map((x: any) => <li key={x.tone}><strong>{x.label}:</strong> {x.hint}</li>)}</ul>
      <div className="table-wrap" role="region" aria-label="Tonalität" tabIndex={0}>
        <table className="table compact">
          <caption className="sr-only">Ton je Produktart und Rolle</caption>
          <thead><tr><th scope="col">Produktart bzw. Rolle</th><th scope="col">Ton</th></tr></thead>
          <tbody>
            {tone.data.products.map((p: any) => (
              <tr key={p.product}>
                <td>{p.label}</td>
                <td>
                  <select aria-label={`Ton für ${p.label}`} disabled={ro} value={t.products[p.product] ?? ''} onChange={(e) => set('products', p.product, e.target.value)}>
                    <option value="">Standard ({label(p.default)})</option>
                    {tone.data.tones.map((x: any) => <option key={x.tone} value={x.tone}>{x.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {tone.data.roles.map((r: any) => (
              <tr key={r.role}>
                <td>Rolle {r.label}</td>
                <td>
                  <select aria-label={`Ton für Rolle ${r.label}`} disabled={ro} value={t.roles[r.role] ?? ''} onChange={(e) => set('roles', r.role, e.target.value)}>
                    <option value="">wie Produktart</option>
                    {tone.data.tones.map((x: any) => <option key={x.tone} value={x.tone}>{x.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/** Eigene Stilregeln des Projekts (ADR-044): Regeln an/aus, Anrede, Satzlänge, eigene Formulierungen – ändern nur Administration */
export function RulesTab({ canAdmin, canGlobalAdmin }: { canAdmin: boolean; canGlobalAdmin: boolean }) {
  const { notify } = useApp();
  const rules = useLoad<any>('/style/rules');
  const [d, setD] = useState<any | null>(null);
  // Zeilen mit „ersetzen durch …“, deren Ersatz noch leer ist (sonst gleichbedeutend mit „streichen“)
  const [replacing, setReplacing] = useState<Set<number>>(new Set());
  useEffect(() => setD(rules.data ? structuredClone(rules.data) : null), [rules.data]);
  if (!d) return <ErrorBox error={rules.error} />;
  const phrases: Phrase[] = d.phrases;
  const setPhrase = (i: number, p: Partial<Phrase>) => setD({ ...d, phrases: phrases.map((x, j) => (j === i ? { ...x, ...p } : x)) });
  const save = async () => {
    try {
      await put('/style/rules', { ...d, phrases: phrases.filter((p) => p.avoid.trim()), allowed: (d.allowed ?? []).filter((x: string) => x.trim()) });
      notify('Stilregeln gespeichert.');
      rules.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const ro = !canAdmin;
  return (
    <>
      {ro && <p className="small muted">Nur die Administration kann die Stilregeln ändern.</p>}
      <Card title="Regeln">
        <fieldset className="checks rule-grid">
          <legend className="small">Aktive Prüfungen</legend>
          {Object.entries(RULE_NAMES).map(([k, label]) => (
            <label key={k} className="inline"><input type="checkbox" disabled={ro} checked={!d.disabled.includes(k)} onChange={(e) => setD({ ...d, disabled: e.target.checked ? d.disabled.filter((x: string) => x !== k) : [...d.disabled, k] })} /> {label}</label>
          ))}
        </fieldset>
        <div className="filters">
          <label className="inline">Zielgruppe (Lesbarkeit)
            <select disabled={ro} value={d.audience ?? 'enduser'} onChange={(e) => setD({ ...d, audience: e.target.value })}>
              <option value="enduser">Endanwender (Flesch ≥ 60, Ø ≤ 15 Wörter)</option><option value="expert">Fachanwender und Administration (Flesch ≥ 40)</option>
            </select>
          </label>
          <label className="inline">Anrede
            <select disabled={ro} value={d.address ?? ''} onChange={(e) => setD({ ...d, address: e.target.value || null })}>
              <option value="sie">Sie</option><option value="du">du</option><option value="">nicht prüfen</option>
            </select>
          </label>
          <label className="inline">Höchstens Wörter je Satz
            <input type="number" min={8} max={60} disabled={ro} value={d.maxSentenceWords ?? ''} placeholder="Standard" style={{ width: '6em' }}
              onChange={(e) => setD({ ...d, maxSentenceWords: e.target.value ? Number(e.target.value) : null })} />
          </label>
        </div>
        <label className="block">Erlaubte Begriffe (werden nie als Fehler gemeldet, je Zeile einer – z. B. oneSCM, VIN, BTO)
          <textarea rows={4} disabled={ro} value={(d.allowed ?? []).join('\n')} onChange={(e) => setD({ ...d, allowed: e.target.value.split('\n') })} />
        </label>
        {!ro && (
          <label className="small">Liste einlesen (.txt, .csv – je Zeile ein Begriff)
            <input type="file" accept=".txt,.csv,.md,text/plain,text/csv" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const words = (await f.text()).split(/\r?\n|;|,/).map((x) => x.replace(/^\ufeff/, '').trim()).filter(Boolean);
              setD({ ...d, allowed: [...new Set([...(d.allowed ?? []).filter((x: string) => x.trim()), ...words])] });
              notify(`${words.length} Begriffe übernommen – zum Sichern „Stilregeln speichern“.`);
            }} />
          </label>
        )}
      </Card>
      <ToneCard d={d} setD={setD} ro={ro} />
      <Card title="Eigene Formulierungen">
        <p className="small muted">Zu vermeidende Wörter oder Wendungen, optional mit Ersatz (leer = streichen) oder Hinweis – je Sprache, z. B. „Dealer → Händler“ (Deutsch) und „Händler → Dealer“ (Englisch). Gilt für Prüfung, automatische Korrektur, KI-Umformulierung und Übersetzungen der Sprache.</p>
        <div className="table-wrap" role="region" aria-label="Eigene Formulierungen" tabIndex={0}>
          <table className="table compact">
            <thead><tr><th>Vermeiden</th><th>Aktion</th><th>Hinweis</th><th>Sprache</th><th /></tr></thead>
            <tbody>
              {phrases.map((p, i) => (
                <tr key={i}>
                  <td><input aria-label={`Regel ${i + 1} vermeiden`} disabled={ro} value={p.avoid} onChange={(e) => setPhrase(i, { avoid: e.target.value })} /></td>
                  <td>
                    <select aria-label={`Regel ${i + 1} Aktion`} disabled={ro} value={p.use === null ? 'hint' : p.use === '' && !replacing.has(i) ? 'delete' : 'replace'}
                      onChange={(e) => { const v = e.target.value; setReplacing((r) => { const n = new Set(r); if (v === 'replace') n.add(i); else n.delete(i); return n; }); setPhrase(i, { use: v === 'hint' ? null : v === 'delete' ? '' : p.use ?? '' }); }}>
                      <option value="replace">ersetzen durch …</option><option value="delete">streichen</option><option value="hint">nur Hinweis</option>
                    </select>
                    {p.use !== null && (p.use !== '' || replacing.has(i)) && <input aria-label={`Regel ${i + 1} ersetzen durch`} disabled={ro} value={p.use} onChange={(e) => setPhrase(i, { use: e.target.value })} />}
                  </td>
                  <td><input aria-label={`Regel ${i + 1} Hinweis`} disabled={ro} value={p.note ?? ''} onChange={(e) => setPhrase(i, { note: e.target.value || null })} /></td>
                  <td>
                    <select aria-label={`Regel ${i + 1} Sprache`} disabled={ro} value={p.language ?? 'de'} onChange={(e) => setPhrase(i, { language: e.target.value === 'de' ? null : e.target.value })}>
                      {PHRASE_LANGS.map(([c, l]) => <option key={c} value={c}>{l}</option>)}
                    </select>
                  </td>
                  <td>{!ro && <button className="btn small danger" aria-label={`Regel ${i + 1} entfernen`} onClick={() => { setReplacing(new Set()); setD({ ...d, phrases: phrases.filter((_, j) => j !== i) }); }}><Ico icon={XIcon} /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!ro && <button className="btn small" onClick={() => { setReplacing((r) => new Set(r).add(phrases.length)); setD({ ...d, phrases: [...phrases, { avoid: '', use: '', note: null }] }); }}>+ Formulierung</button>}
      </Card>
      {!ro && <button className="btn primary" onClick={save}>Stilregeln speichern</button>}
      <RuleSets canAdmin={canAdmin} />
      <RulesExchange canAdmin={canAdmin} onChanged={rules.reload} />
      <Libraries canAdmin={canAdmin} canGlobalAdmin={canGlobalAdmin} />
    </>
  );
}

/** Stilregeln austauschen (ADR-047): Export CSV/JSON, Import (zusammenführen/ersetzen), Übernahme aus einem anderen Projekt */
/** Zuschaltbare Regelsätze (ADR-109, S-06): Regelbasiertes Schreiben, STE-Grundregeln, eingelesene Vale-Stile */
function RuleSets({ canAdmin }: { canAdmin: boolean }) {
  const { notify } = useApp();
  const sets = useLoad<{ sets: any[]; languages: string[] }>('/style/rule-sets');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any | null>(null);
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const importStyle = async () => {
    try {
      let r: any;
      if (files.length === 1 && /\.zip$/i.test(files[0].name)) {
        const fd = new FormData();
        fd.append('file', files[0]);
        r = await post(`/style/rule-sets/vale?name=${encodeURIComponent(name.trim() || files[0].name.replace(/\.zip$/i, ''))}&language=${language}`, fd);
      } else {
        r = await post('/style/rule-sets/vale', { name: name.trim(), language, files: await Promise.all(files.map(async (f) => ({ name: f.name, content: await f.text() }))) });
      }
      setResult(r);
      setFiles([]);
      notify(`Vale-Stil „${r.name}“ eingelesen: ${r.rules.length} ${r.rules.length === 1 ? 'Regel' : 'Regeln'}.`);
      sets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  if (!sets.data) return <ErrorBox error={sets.error} />;
  const ro = !canAdmin;
  return (
    <Card title="Regelsätze">
      <p className="small muted">Zuschaltbare Regelsätze prüfen zusätzlich zu den Regeln oben – in Schreibstil, Kapitelprüfung, Kapitelbewertung und Fehlerliste. Ein Satz gilt für Texte seiner Sprache.</p>
      <ul className="plain rule-sets">
        {sets.data.sets.map((rs) => {
          const off = rs.rules.filter((r: any) => !r.enabled).map((r: any) => r.id);
          return (
            <li key={rs.key}>
              <fieldset aria-label={`Regelsatz ${rs.name}`}>
                <legend>
                  <label><input type="checkbox" checked={rs.enabled} disabled={ro} onChange={(e) => void run(() => patch(`/style/rule-sets/${encodeURIComponent(rs.key)}`, { enabled: e.target.checked }), `Regelsatz „${rs.name}“ ${e.target.checked ? 'eingeschaltet' : 'ausgeschaltet'}.`)} /> {rs.name}</label>
                  <span className="small muted"> · {rs.kind === 'vale' ? 'Vale-Stil' : 'mitgeliefert'} · Sprache {rs.language}</span>
                </legend>
                <p className="small muted">{rs.description}</p>
                <details>
                  <summary>Regeln ({rs.rules.length - off.length} von {rs.rules.length} aktiv)</summary>
                  <ul className="plain">
                    {rs.rules.map((r: any) => (
                      <li key={r.id}>
                        <label title={r.description}><input type="checkbox" checked={r.enabled} disabled={ro}
                          onChange={(e) => void run(() => patch(`/style/rule-sets/${encodeURIComponent(rs.key)}`, { disabledRules: e.target.checked ? off.filter((x: string) => x !== r.id) : [...off, r.id] }), 'Regel geändert.')} /> {r.label}</label>
                        <span className="small muted"> – {r.description}</span>
                      </li>
                    ))}
                  </ul>
                  {rs.unsupported.length > 0 && <p className="small muted">Nicht übernommen: {rs.unsupported.map((u: any) => `${u.name} (${u.reason})`).join('; ')}</p>}
                </details>
                {rs.kind === 'vale' && !ro && <button type="button" className="btn small danger" onClick={() => void run(() => del(`/style/rule-sets/${encodeURIComponent(rs.key)}`), `Vale-Stil „${rs.name}“ entfernt.`)}>Vale-Stil entfernen</button>}
              </fieldset>
            </li>
          );
        })}
      </ul>
      {!ro && (
        <div role="group" aria-label="Vale-Stil einlesen" className="form-row">
          <label>Name des Stils <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Haus" /></label>
          <label>Sprache der Texte <select value={language} onChange={(e) => setLanguage(e.target.value)}>{sets.data.languages.map((l) => <option key={l} value={l}>{l}</option>)}</select></label>
          <label>Regeldateien (.yml oder ZIP) <input type="file" multiple accept=".yml,.yaml,.zip" onChange={(e) => setFiles([...(e.target.files ?? [])])} /></label>
          <button type="button" className="btn" disabled={!files.length || (!name.trim() && !(files.length === 1 && /\.zip$/i.test(files[0].name)))} onClick={() => void importStyle()}>Vale-Stil einlesen</button>
        </div>
      )}
      {result?.unsupported?.length > 0 && <p className="small" role="status">Nicht übernommen: {result.unsupported.map((u: any) => `${u.name} (${u.reason})`).join('; ')}</p>}
      <p className="small muted">Unterstützt werden Vale-Regeln der Typen existence, substitution und occurrence; Muster laufen lokal, nichts verlässt den Rechner.</p>
    </Card>
  );
}

function RulesExchange({ canAdmin, onChanged }: { canAdmin: boolean; onChanged: () => void }) {
  const { notify } = useApp();
  const projects = useLoad<any[]>(canAdmin ? '/projects' : null, [canAdmin]);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [from, setFrom] = useState('');
  const current = currentProjectId();
  const done = (r: any, what: string) => {
    notify(`${what}: ${r.summary.added} neu, ${r.summary.updated} aktualisiert, ${r.summary.total} Formulierungen.`);
    onChanged();
  };
  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const body = /\.json$/i.test(file.name) ? { rules: JSON.parse(text), mode } : { csv: text, mode };
      done(await post<any>('/style/rules/import', body), 'Import');
    } catch (e) {
      notify(e instanceof SyntaxError ? 'Die JSON-Datei ist ungültig.' : errorText(e), 'error');
    }
  };
  return (
    <Card title="Austauschen">
      <div className="filters">
        <DownloadButton href="/api/v1/style/rules/export?format=csv" name="stilregeln.csv">Als CSV exportieren</DownloadButton>
        <DownloadButton href="/api/v1/style/rules/export?format=json" name="stilregeln.json">Als JSON exportieren</DownloadButton>
      </div>
      {canAdmin && (
        <>
          <div className="filters">
            <label className="inline">Übernahme
              <select value={mode} onChange={(e) => setMode(e.target.value as 'merge' | 'replace')}>
                <option value="merge">zusammenführen (vorhandene bleiben, gleiche werden aktualisiert)</option>
                <option value="replace">ersetzen (vorhandene Formulierungen entfallen)</option>
              </select>
            </label>
          </div>
          <label className="block">Aus Datei importieren (CSV: vermeiden; aktion; ersetzen durch; hinweis – oder JSON-Export)
            <input type="file" accept=".csv,.json,text/csv,application/json" data-testid="rules-import" onChange={(e) => { void importFile(e.target.files?.[0]); e.target.value = ''; }} />
          </label>
          <div className="filters">
            <label className="inline">Aus Projekt übernehmen
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="">– Projekt wählen –</option>
                {(projects.data ?? []).filter((p) => p.id !== current).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <button className="btn" disabled={!from} onClick={async () => {
              try {
                done(await post<any>('/style/rules/copy', { fromProjectId: from, mode }), 'Übernommen');
              } catch (e) {
                notify(errorText(e), 'error');
              }
            }}>Regeln übernehmen</button>
          </div>
        </>
      )}
    </Card>
  );
}

/**
 * Gemeinsame Regeln (ADR-050): Bibliotheken abonnieren (Reihenfolge = Vorrang), wirksame Formulierungen mit Herkunft ansehen;
 * die Administration legt Bibliotheken aus den Regeln dieses Projekts oder aus einer CSV an und aktualisiert sie.
 */
// Abonnieren: Projekt-Administration; Bibliotheken pflegen: nur globale Administration (projektübergreifende Daten)
function Libraries({ canAdmin, canGlobalAdmin }: { canAdmin: boolean; canGlobalAdmin: boolean }) {
  const { notify } = useApp();
  const subs = useLoad<any>('/style/libraries');
  const eff = useLoad<any>('/style/rules/effective');
  const [order, setOrder] = useState<string[] | null>(null);
  const [name, setName] = useState('');
  useEffect(() => setOrder(subs.data ? [...subs.data.subscribed] : null), [subs.data]);
  const all: any[] = subs.data?.available ?? [];
  const byId = new Map(all.map((l) => [l.id, l]));
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      subs.reload();
      eff.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  if (!order) return <ErrorBox error={subs.error} />;
  const move = (i: number, d: number) => {
    const n = [...order];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    setOrder(n);
  };
  const changed = order.join() !== subs.data.subscribed.join();
  return (
    <>
      <Card title="Gemeinsame Regeln (Bibliotheken)">
        <p className="small muted">Bibliotheken bündeln Formulierungsregeln für mehrere Handbücher – einmal gepflegt, überall gleich. Eigene Formulierungen dieses Projekts haben Vorrang; bei mehreren Bibliotheken gilt die obere.</p>
        {!all.length && <Empty>Noch keine Bibliothek vorhanden.{canGlobalAdmin ? ' Legen Sie unten eine aus den Regeln dieses Projekts an.' : ''}</Empty>}
        {order.length > 0 && (
          <ol className="plain lib-order">
            {order.map((id, i) => (
              <li key={id}>
                <strong>{byId.get(id)?.name ?? id}</strong> <span className="small muted">{byId.get(id)?.phrases ?? 0} Formulierungen</span>
                {canAdmin && (
                  <span className="row-actions">
                    <button className="btn small" disabled={i === 0} aria-label={`${byId.get(id)?.name} nach oben`} onClick={() => move(i, -1)}>↑</button>
                    <button className="btn small" disabled={i === order.length - 1} aria-label={`${byId.get(id)?.name} nach unten`} onClick={() => move(i, 1)}>↓</button>
                    <button className="btn small" onClick={() => setOrder(order.filter((x) => x !== id))}>Abbestellen</button>
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
        {canAdmin && all.some((l) => !order.includes(l.id)) && (
          <div className="filters">
            {all.filter((l) => !order.includes(l.id)).map((l) => (
              <button key={l.id} className="btn small" title={l.description ?? undefined} onClick={() => setOrder([...order, l.id])}>+ {l.name} ({l.phrases})</button>
            ))}
          </div>
        )}
        {canAdmin && changed && <button className="btn primary" onClick={() => run(() => put('/style/libraries', { libraryIds: order }), 'Bibliotheken gespeichert.')}>Auswahl speichern</button>}
      </Card>
      <Card title="Wirksame Formulierungen">
        {eff.data && !eff.data.phrases.length ? <Empty>Keine Formulierungsregeln.</Empty> : (
          <div className="table-wrap" role="region" aria-label="Wirksame Formulierungen" tabIndex={0}>
            <table className="table compact">
              <thead><tr><th>Vermeiden</th><th>Stattdessen</th><th>Herkunft</th></tr></thead>
              <tbody>
                {(eff.data?.phrases ?? []).map((p: any) => (
                  <tr key={p.avoid}>
                    <td>{p.avoid}</td>
                    <td>{p.use === null ? <span className="muted">nur Hinweis{p.note ? `: ${p.note}` : ''}</span> : p.use === '' ? <span className="muted">streichen</span> : p.use}</td>
                    <td>{p.source.type === 'project' ? 'dieses Projekt' : `Bibliothek „${p.source.name}“`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {eff.data?.shadowed?.length > 0 && (
          <p className="small muted">Überdeckt: {eff.data.shadowed.map((x: any) => `„${x.avoid}“ aus ${x.libraryName}`).join(', ')}.</p>
        )}
      </Card>
      {canGlobalAdmin && (
        <Card title="Bibliotheken pflegen">
          <p className="small muted">Pflegen Sie Formulierungen hier im Projekt und veröffentlichen Sie sie dann als Bibliothek – oder laden Sie eine CSV hoch (Spalten wie beim Export).</p>
          <div className="filters">
            <label className="inline">Name der neuen Bibliothek <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Konzernsprache" /></label>
            <button className="btn" disabled={!name.trim()} onClick={() => run(async () => { await post('/style-libraries', { name, fromProjectId: currentProjectId() }); setName(''); }, 'Bibliothek aus den Projektregeln angelegt.')}>Aus Regeln dieses Projekts anlegen</button>
          </div>
          {all.length > 0 && (
            <div className="table-wrap" role="region" aria-label="Bibliotheken" tabIndex={0}>
              <table className="table compact">
                <thead><tr><th>Bibliothek</th><th>Formulierungen</th><th>Aktionen</th></tr></thead>
                <tbody>
                  {all.map((l) => (
                    <tr key={l.id}>
                      <td>{l.name}{l.description && <div className="small muted">{l.description}</div>}</td>
                      <td>{l.phrases}</td>
                      <td className="row-actions">
                        <button className="btn small" onClick={() => run(() => api('PATCH', `/style-libraries/${l.id}`, { fromProjectId: currentProjectId() }), `„${l.name}“ mit den Regeln dieses Projekts überschrieben.`)}>Mit Projektregeln überschreiben</button>
                        <label className="btn small file-btn">CSV ergänzen
                          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void run(async () => api('PATCH', `/style-libraries/${l.id}`, { csv: await f.text(), mode: 'merge' }), `CSV in „${l.name}“ übernommen.`); }} />
                        </label>
                        <DownloadButton className="btn small" href={`/api/v1/style-libraries/${l.id}/export`} name={`${l.name}.csv`}>CSV</DownloadButton>
                        <button className="btn small danger" onClick={() => run(() => api('DELETE', `/style-libraries/${l.id}`), `„${l.name}“ gelöscht.`)}>Löschen</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
