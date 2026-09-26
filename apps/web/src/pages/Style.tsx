// Schreibstil (ADR-040): Text prüfen, problematische Sätze gelb markieren und bearbeiten, automatisch korrigieren,
// professionell bzw. ins Präsens umformulieren – für freien Text, Kapitelabsätze (übernehmen) und Textschnipsel (nur prüfen).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { api, currentProjectId, patch, post, put, qs } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

export interface Fix { start: number; end: number; replacement: string; label: string }
export interface Issue { rule: string; severity: 'warning' | 'info'; message: string; start: number; end: number; fix?: Fix }
export interface Sentence { start: number; end: number; text: string; issues: Issue[] }
export interface Analysis { sentences: Sentence[]; score: number; rules: { rule: string; label: string; count: number }[]; problemSentences: number; fixable: number }

/** Korrekturen von hinten nach vorn anwenden, überlappende auslassen (wie im Server) */
export function applyFixes(text: string, fixes: Fix[]) {
  let out = text;
  let limit = Infinity;
  for (const f of [...fixes].sort((a, b) => b.start - a.start || b.end - a.end)) {
    if (f.end > limit) continue;
    out = out.slice(0, f.start) + f.replacement + out.slice(f.end);
    limit = f.start;
  }
  return out;
}

/**
 * Korrektur des Originalsatzes auf den aktuellen (evtl. schon geänderten) Entwurf übertragen: Die Stelle wird über den
 * Originaltext samt vorangehendem Kontext gesucht (nächstgelegene Fundstelle); fehlt sie, bleibt der Entwurf unverändert.
 */
export function applyToDraft(draft: string, original: string, fix: Fix): string {
  if (draft === original) return applyFixes(draft, [fix]);
  const orig = original.slice(fix.start, fix.end);
  // mit möglichst viel Kontext suchen; Kontext kann durch frühere Korrekturen verändert sein, daher schrittweise kürzen
  for (let ctx = Math.min(12, fix.start); ctx >= (orig ? 0 : 1); ctx--) {
    const needle = original.slice(fix.start - ctx, fix.end);
    let best = -1;
    for (let i = draft.indexOf(needle); i >= 0; i = draft.indexOf(needle, i + 1)) {
      if (best < 0 || Math.abs(i + ctx - fix.start) < Math.abs(best + ctx - fix.start)) best = i;
    }
    if (best >= 0) {
      const at = best + ctx;
      return draft.slice(0, at) + fix.replacement + draft.slice(at + orig.length);
    }
  }
  return draft;
}

const scoreClass = (s: number) => (s >= 80 ? 'st-approved' : s >= 50 ? 'st-in_review' : 'st-failed');

export function Summary({ a }: { a: Analysis }) {
  return (
    <p className="small" role="status">
      <span className={`tag ${scoreClass(a.score)}`}>Stilwert {a.score}/100</span> · {a.problemSentences} Sätze mit Problemen · {a.fixable} automatisch korrigierbar
      {a.rules.length > 0 && <> · {a.rules.map((r) => `${r.label} ${r.count}`).join(', ')}</>}
    </p>
  );
}

const IMAGE_MD = /!\[[^\]]*\]\([^)]*\)/g;

/** Text mit markierten Sätzen: gelb = Problem (Warnung), unterstrichen = Hinweis; Klick öffnet die Bearbeitung.
 * `hideImages`: Bild-Markdown ausblenden (Bilder zeigt der Aufrufer selbst an, z. B. in der Werkstatt). */
export function MarkedText({ text, a, selected, onSelect, hideImages }: { text: string; a: Analysis; selected?: number | null; onSelect?: (i: number) => void; hideImages?: boolean }) {
  const show = (t: string) => (hideImages ? t.replace(IMAGE_MD, '').replace(/\n{3,}/g, '\n\n') : t);
  const parts: ReactNode[] = [];
  let pos = 0;
  a.sentences.forEach((s, i) => {
    if (s.start > pos) parts.push(<span key={`t${i}`}>{show(text.slice(pos, s.start))}</span>);
    const warn = s.issues.some((x) => x.severity === 'warning');
    const cls = `style-sentence${warn ? ' warn' : s.issues.length ? ' info' : ''}${selected === i ? ' selected' : ''}`;
    const title = s.issues.map((x) => x.message).join('\n');
    parts.push(s.issues.length && onSelect
      ? <button key={`s${i}`} type="button" className={cls} title={title} aria-label={`${text.slice(s.start, s.end)} – ${s.issues.length} Hinweis(e), bearbeiten`} onClick={() => onSelect(i)}>{show(text.slice(s.start, s.end))}</button>
      : <span key={`s${i}`} className={cls} title={title || undefined}>{show(text.slice(s.start, s.end))}</span>);
    pos = s.end;
  });
  if (pos < text.length) parts.push(<span key="end">{show(text.slice(pos))}</span>);
  return <div className="style-text" role="group" aria-label="Geprüfter Text">{parts}</div>;
}

/** Bearbeitung eines Satzes: Hinweise mit Einzelkorrektur, freie Bearbeitung */
export function SentenceEditor({ s, onApply, onClose }: { s: Sentence; onApply: (replacement: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(s.text);
  useEffect(() => setDraft(s.text), [s.start, s.text]);
  // Korrekturen relativ zum Satz
  const rel = (f: Fix) => ({ ...f, start: f.start - s.start, end: f.end - s.start });
  return (
    <Card title="Satz bearbeiten">
      <ul className="style-issues">
        {s.issues.map((i, n) => (
          <li key={n} className={i.severity}>
            <span className="tag">{i.severity === 'warning' ? '⚠ Problem' : 'ℹ Hinweis'}</span> {i.message}
            {i.fix && <button className="btn small" onClick={() => setDraft((d) => applyToDraft(d, s.text, rel(i.fix!)))}>{i.fix.label || 'korrigieren'}</button>}
          </li>
        ))}
      </ul>
      <label className="block">Satz <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} /></label>
      <div className="filters">
        <button className="btn" onClick={() => setDraft((d) => s.issues.filter((i) => i.fix).map((i) => rel(i.fix!)).sort((x, y) => y.start - x.start || y.end - x.end)
          .reduce((acc, f, n, all) => (n > 0 && f.end > all[n - 1].start ? acc : applyToDraft(acc, s.text, f)), d))}>Alle Korrekturen im Satz</button>
        <button className="btn primary" onClick={() => onApply(draft)}>Übernehmen</button>
        <button className="btn ghost" onClick={onClose}>Schließen</button>
      </div>
    </Card>
  );
}

/** Prüf- und Bearbeitungsfläche für einen Text (freies Textfeld oder Kapitelabsatz) */
function StyleEditor({ initial, onSave, saveLabel, canRewrite }: { initial: string; onSave?: (text: string) => Promise<void>; saveLabel?: string; canRewrite: boolean }) {
  const { notify } = useApp();
  const [text, setText] = useState(initial);
  const [a, setA] = useState<Analysis | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [proposal, setProposal] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  // aktueller Text für Antworten, die nach einer Änderung eintreffen
  const textRef = useRef(text);
  textRef.current = text;
  useEffect(() => setText(initial), [initial]);
  // Ein Vorschlag gilt nur für den Text, aus dem er entstand
  useEffect(() => {
    if (proposal && proposal.source !== text) setProposal(null);
  }, [text, proposal]);
  const check = async (t = text) => {
    if (!t.trim()) return;
    try {
      const r = await post<any>('/style/check', { text: t });
      setA(r);
      setSel(null);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  useEffect(() => {
    if (initial.trim()) void check(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);
  // Wiederholen, bis keine Korrektur mehr greift (eine Korrektur kann die nächste sichtbar machen, wie serverseitig autoFix)
  const autoFix = async () => {
    if (!a) return;
    setBusy(true);
    let cur = text;
    let analysis: Analysis = a;
    let applied = 0;
    try {
      for (let round = 0; round < 5 && analysis.fixable > 0; round++) {
        const next = applyFixes(cur, analysis.sentences.flatMap((s) => s.issues).filter((i) => i.fix).map((i) => i.fix!));
        if (next === cur) break;
        applied += analysis.fixable;
        cur = next;
        analysis = await post<Analysis>('/style/check', { text: cur });
      }
      setText(cur);
      setA(analysis);
      setSel(null);
      notify(`${applied} Korrekturen angewendet.`);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const rewrite = async (mode: 'professional' | 'present') => {
    setBusy(true);
    try {
      const source = text;
      const r = await post<any>('/style/rewrite', { text: source, mode });
      if (textRef.current === source) setProposal({ ...r, source });
      else notify('Der Text wurde inzwischen geändert – Vorschlag verworfen. Bitte erneut umformulieren.', 'error');
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const replaceSentence = async (i: number, replacement: string) => {
    if (!a) return;
    const s = a.sentences[i];
    const next = text.slice(0, s.start) + replacement + text.slice(s.end);
    setText(next);
    await check(next);
  };
  return (
    <>
      <label className="block">Text
        <textarea rows={8} value={text} onChange={(e) => { setText(e.target.value); setA(null); }} placeholder="Fließtext hier einfügen …" />
      </label>
      <div className="filters">
        <button className="btn primary" disabled={!text.trim()} onClick={() => check()}>Prüfen</button>
        <button className="btn" disabled={busy || !a?.fixable} onClick={autoFix}>Automatisch korrigieren{a?.fixable ? ` (${a.fixable})` : ''}</button>
        {canRewrite && <button className="btn" disabled={busy || !text.trim()} onClick={() => rewrite('professional')}>Professionell umformulieren</button>}
        {canRewrite && <button className="btn" disabled={busy || !text.trim()} onClick={() => rewrite('present')}>In Präsens umwandeln</button>}
        <button className="btn ghost" disabled={!text.trim()} onClick={() => navigator.clipboard?.writeText(text).then(() => notify('Text kopiert.'))}>Kopieren</button>
        {onSave && <button className="btn primary" disabled={busy || text === initial} onClick={() => onSave(text)}>{saveLabel ?? 'Speichern'}</button>}
      </div>
      {proposal && (
        <Card title={`Vorschlag (${proposal.method === 'ai' ? `KI: ${proposal.provider.id}/${proposal.provider.model}` : 'Regelkorrekturen'})`}>
          {proposal.lostNumbers.length > 0 && <p className="alert small">Achtung: Zahlen fehlen im Vorschlag: {proposal.lostNumbers.join(', ')}</p>}
          <div className="style-compare">
            <div><h3>Vorher</h3><p className="style-text">{text}</p></div>
            <div><h3>Nachher</h3><p className="style-text">{proposal.text}</p></div>
          </div>
          <Summary a={proposal.analysis} />
          <div className="filters">
            <button className="btn primary" onClick={async () => { setText(proposal.text); setProposal(null); await check(proposal.text); }}>Vorschlag übernehmen</button>
            <button className="btn ghost" onClick={() => setProposal(null)}>Verwerfen</button>
          </div>
        </Card>
      )}
      {a && (
        <div className="style-layout">
          <Card title="Prüfergebnis">
            <Summary a={a} />
            <p className="small muted">Gelb markierte Sätze haben Probleme, unterstrichene Hinweise – zum Bearbeiten anklicken.</p>
            <MarkedText text={text} a={a} selected={sel} onSelect={setSel} />
          </Card>
          {sel !== null && a.sentences[sel] && <SentenceEditor s={a.sentences[sel]} onApply={(r) => replaceSentence(sel, r)} onClose={() => setSel(null)} />}
        </div>
      )}
    </>
  );
}

function ChapterTab({ canEdit }: { canEdit: boolean }) {
  const { notify } = useApp();
  const chapters = useLoad<any[]>('/chapters?outline=all');
  const [chapterId, setChapterId] = useState('');
  const chapter = chapters.data?.find((c) => c.id === chapterId);
  const versionId = chapter?.versions[0]?.id as string | undefined;
  const data = useLoad<any>(versionId ? `/style/chapter-versions/${versionId}` : null, [versionId]);
  const [open, setOpen] = useState<string | null>(null);
  const withVersions = (chapters.data ?? []).filter((c) => c.versions.length);
  return (
    <>
      <label className="inline">Kapitel
        <select value={chapterId} onChange={(e) => { setChapterId(e.target.value); setOpen(null); }}>
          <option value="">– Kapitel wählen –</option>
          {withVersions.map((c) => <option key={c.id} value={c.id}>{c.title} (V{c.versions[0].versionNo})</option>)}
        </select>
      </label>
      <ErrorBox error={data.error} />
      {data.data && (
        <>
          <p className="small" role="status">
            {data.data.summary.withProblems} von {data.data.summary.blocks} Absätzen mit Problemen ·
            {data.data.version.editable ? ' Entwurf – Korrekturen werden als neue Absatzversion gespeichert' : ' nicht bearbeitbar (eingereicht oder freigegeben)'} · <Link to={`/werkstatt/${data.data.version.chapterId}`}>in der Werkstatt öffnen</Link>
          </p>
          {data.data.blocks.map((b: any) => (
            <Card key={b.id} title={`${b.section} · ${b.analysis.problemSentences ? `⚠ ${b.analysis.problemSentences} Problem(e)` : '✓'}`}>
              {open === b.id ? (
                <StyleEditor initial={b.text} canRewrite={canEdit} saveLabel="Absatz speichern" onSave={data.data.version.editable && canEdit ? async (text) => {
                  try {
                    await patch(`/content-blocks/${b.id}`, { text, expectedVersionNo: b.versionNo });
                    notify('Absatz gespeichert.');
                    setOpen(null);
                    data.reload();
                  } catch (e) {
                    notify(errorText(e), 'error');
                  }
                } : undefined} />
              ) : (
                <>
                  <MarkedText text={b.text} a={b.analysis} />
                  {b.analysis.sentences.some((s: Sentence) => s.issues.length) && <button className="btn small" onClick={() => setOpen(b.id)}>Bearbeiten</button>}
                </>
              )}
            </Card>
          ))}
        </>
      )}
      {chapters.data && !withVersions.length && <Empty>Noch keine Kapitelentwürfe – zuerst im Kapitelgenerator erzeugen.</Empty>}
    </>
  );
}

function SnippetTab() {
  const chapters = useLoad<any[]>('/chapters');
  const [chapterId, setChapterId] = useState('');
  const [page, setPage] = useState(1);
  const data = useLoad<any>(chapterId ? `/style/snippets${qs({ chapterId, page })}` : null, [chapterId, page]);
  const pages = data.data ? Math.max(1, Math.ceil(data.data.total / data.data.pageSize)) : 1;
  return (
    <>
      <label className="inline">Kapitel der Quellen
        <select value={chapterId} onChange={(e) => { setChapterId(e.target.value); setPage(1); }}>
          <option value="">– Kapitel wählen –</option>
          {(chapters.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </label>
      <p className="small muted">Textschnipsel werden nur geprüft – Quellen bleiben unverändert. Korrekturen im Kapitelentwurf vornehmen.</p>
      <ErrorBox error={data.error} />
      {data.data && <p className="small" role="status">{data.data.total} von {data.data.checked} Textschnipseln mit Hinweisen</p>}
      {data.data?.items.map((s: any) => (
        <Card key={s.id} title={`#${s.seq} · ${s.path}`}>
          <MarkedText text={s.text} a={s.analysis} />
          <p className="small muted">{s.analysis.rules.map((r: any) => `${r.label} ${r.count}`).join(' · ')}</p>
        </Card>
      ))}
      {pages > 1 && (
        <div className="row-actions">
          <button className="btn small" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ zurück</button>
          <span className="small">Seite {page} von {pages}</span>
          <button className="btn small" disabled={page >= pages} onClick={() => setPage(page + 1)}>weiter ›</button>
        </div>
      )}
    </>
  );
}

const RULE_NAMES: Record<string, string> = {
  long_sentence: 'Lange Sätze', passive: 'Passiv', future: 'Futur', past: 'Vergangenheit', filler: 'Füllwörter', double_word: 'Doppelte Wörter',
  punctuation: 'Zeichensetzung', capitalization: 'Großschreibung am Satzanfang', impersonal: 'Unpersönlich („man“)', colloquial: 'Umgangssprache',
  hedging: 'Unklare Anweisungen', nominal: 'Nominalstil', spelling: 'Rechtschreibung', abbreviation: 'Abkürzungen', terminology: 'Terminologie',
  custom: 'Eigene Regeln', address: 'Anrede',
};
interface Phrase { avoid: string; use: string | null; note: string | null }

/** Eigene Stilregeln des Projekts (ADR-044): Regeln an/aus, Anrede, Satzlänge, eigene Formulierungen – ändern nur Administration */
function RulesTab({ canAdmin, canGlobalAdmin }: { canAdmin: boolean; canGlobalAdmin: boolean }) {
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
      await put('/style/rules', { ...d, phrases: phrases.filter((p) => p.avoid.trim()) });
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
      </Card>
      <Card title="Eigene Formulierungen">
        <p className="small muted">Zu vermeidende Wörter oder Wendungen, optional mit Ersatz (leer = streichen) oder Hinweis. Gilt für Prüfung, automatische Korrektur und KI-Umformulierung.</p>
        <div className="table-wrap" role="region" aria-label="Eigene Formulierungen" tabIndex={0}>
          <table className="table compact">
            <thead><tr><th>Vermeiden</th><th>Aktion</th><th>Hinweis</th><th /></tr></thead>
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
                  <td>{!ro && <button className="btn small danger" aria-label={`Regel ${i + 1} entfernen`} onClick={() => { setReplacing(new Set()); setD({ ...d, phrases: phrases.filter((_, j) => j !== i) }); }}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!ro && <button className="btn small" onClick={() => { setReplacing((r) => new Set(r).add(phrases.length)); setD({ ...d, phrases: [...phrases, { avoid: '', use: '', note: null }] }); }}>+ Formulierung</button>}
      </Card>
      {!ro && <button className="btn primary" onClick={save}>Stilregeln speichern</button>}
      <RulesExchange canAdmin={canAdmin} onChanged={rules.reload} />
      <Libraries canAdmin={canAdmin} canGlobalAdmin={canGlobalAdmin} />
    </>
  );
}

/** Stilregeln austauschen (ADR-047): Export CSV/JSON, Import (zusammenführen/ersetzen), Übernahme aus einem anderen Projekt */
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

export function StylePage() {
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const canAdmin = !!me.data?.permissions.includes('admin');
  const canGlobalAdmin = !!me.data?.globalPermissions?.includes('admin');
  const [tab, setTab] = useState<'text' | 'chapter' | 'snippets' | 'rules'>('text');
  const empty = useMemo(() => '', []);
  return (
    <Page title="Schreibstil" subtitle="Professioneller Stil, Grammatik und Präsens – problematische Sätze sind gelb markiert und direkt bearbeitbar">
      <div className="tabs" role="tablist" aria-label="Textquelle">
        {(['text', 'chapter', 'snippets', 'rules'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {{ text: 'Textfeld', chapter: 'Kapitel', snippets: 'Textschnipsel', rules: 'Regeln' }[t]}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'text' && <StyleEditor initial={empty} canRewrite={canEdit} />}
        {tab === 'chapter' && <ChapterTab canEdit={canEdit} />}
        {tab === 'snippets' && <SnippetTab />}
        {tab === 'rules' && <RulesTab canAdmin={canAdmin} canGlobalAdmin={canGlobalAdmin} />}
      </div>
    </Page>
  );
}
