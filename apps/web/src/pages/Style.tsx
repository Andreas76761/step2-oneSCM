// Schreibstil (ADR-040): Text prüfen, problematische Sätze gelb markieren und bearbeiten, automatisch korrigieren,
// professionell bzw. ins Präsens umformulieren – für freien Text, Kapitelabsätze (übernehmen) und Textschnipsel (nur prüfen).
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { patch, post, qs } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

interface Fix { start: number; end: number; replacement: string; label: string }
interface Issue { rule: string; severity: 'warning' | 'info'; message: string; start: number; end: number; fix?: Fix }
interface Sentence { start: number; end: number; text: string; issues: Issue[] }
interface Analysis { sentences: Sentence[]; score: number; rules: { rule: string; label: string; count: number }[]; problemSentences: number; fixable: number }

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

const scoreClass = (s: number) => (s >= 80 ? 'st-approved' : s >= 50 ? 'st-in_review' : 'st-failed');

function Summary({ a }: { a: Analysis }) {
  return (
    <p className="small" role="status">
      <span className={`tag ${scoreClass(a.score)}`}>Stilwert {a.score}/100</span> · {a.problemSentences} Sätze mit Problemen · {a.fixable} automatisch korrigierbar
      {a.rules.length > 0 && <> · {a.rules.map((r) => `${r.label} ${r.count}`).join(', ')}</>}
    </p>
  );
}

/** Text mit markierten Sätzen: gelb = Problem (Warnung), unterstrichen = Hinweis; Klick öffnet die Bearbeitung */
function MarkedText({ text, a, selected, onSelect }: { text: string; a: Analysis; selected?: number | null; onSelect?: (i: number) => void }) {
  const parts: ReactNode[] = [];
  let pos = 0;
  a.sentences.forEach((s, i) => {
    if (s.start > pos) parts.push(<span key={`t${i}`}>{text.slice(pos, s.start)}</span>);
    const warn = s.issues.some((x) => x.severity === 'warning');
    const cls = `style-sentence${warn ? ' warn' : s.issues.length ? ' info' : ''}${selected === i ? ' selected' : ''}`;
    const title = s.issues.map((x) => x.message).join('\n');
    parts.push(s.issues.length && onSelect
      ? <button key={`s${i}`} type="button" className={cls} title={title} aria-label={`${text.slice(s.start, s.end)} – ${s.issues.length} Hinweis(e), bearbeiten`} onClick={() => onSelect(i)}>{text.slice(s.start, s.end)}</button>
      : <span key={`s${i}`} className={cls} title={title || undefined}>{text.slice(s.start, s.end)}</span>);
    pos = s.end;
  });
  if (pos < text.length) parts.push(<span key="end">{text.slice(pos)}</span>);
  return <div className="style-text" role="group" aria-label="Geprüfter Text">{parts}</div>;
}

/** Bearbeitung eines Satzes: Hinweise mit Einzelkorrektur, freie Bearbeitung */
function SentenceEditor({ s, onApply, onClose }: { s: Sentence; onApply: (replacement: string) => void; onClose: () => void }) {
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
            {i.fix && <button className="btn small" onClick={() => setDraft(applyFixes(s.text, [rel(i.fix!)]))}>{i.fix.label || 'korrigieren'}</button>}
          </li>
        ))}
      </ul>
      <label className="block">Satz <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} /></label>
      <div className="filters">
        <button className="btn" onClick={() => setDraft(applyFixes(s.text, s.issues.filter((i) => i.fix).map((i) => rel(i.fix!))))}>Alle Korrekturen im Satz</button>
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
  useEffect(() => setText(initial), [initial]);
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
  const autoFix = async () => {
    if (!a) return;
    const fixed = applyFixes(text, a.sentences.flatMap((s) => s.issues).filter((i) => i.fix).map((i) => i.fix!));
    setText(fixed);
    await check(fixed);
    notify(`${a.fixable} Korrekturen angewendet.`);
  };
  const rewrite = async (mode: 'professional' | 'present') => {
    setBusy(true);
    try {
      setProposal(await post<any>('/style/rewrite', { text, mode }));
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
        <button className="btn" disabled={!a?.fixable} onClick={autoFix}>Automatisch korrigieren{a?.fixable ? ` (${a.fixable})` : ''}</button>
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

export function StylePage() {
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const [tab, setTab] = useState<'text' | 'chapter' | 'snippets'>('text');
  const empty = useMemo(() => '', []);
  return (
    <Page title="Schreibstil" subtitle="Professioneller Stil, Grammatik und Präsens – problematische Sätze sind gelb markiert und direkt bearbeitbar">
      <div className="tabs" role="tablist" aria-label="Textquelle">
        {(['text', 'chapter', 'snippets'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {{ text: 'Textfeld', chapter: 'Kapitel', snippets: 'Textschnipsel' }[t]}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'text' && <StyleEditor initial={empty} canRewrite={canEdit} />}
        {tab === 'chapter' && <ChapterTab canEdit={canEdit} />}
        {tab === 'snippets' && <SnippetTab />}
      </div>
    </Page>
  );
}
