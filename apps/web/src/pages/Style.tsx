// Schreibstil (ADR-040): Text prüfen, problematische Sätze gelb markieren und bearbeiten, automatisch korrigieren,
// professionell bzw. ins Präsens umformulieren – für freien Text, Kapitelabsätze (übernehmen) und Textschnipsel (nur prüfen).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { patch, post, qs } from '../api';
import { Gated, Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';
import { applyFixes, MarkedText, ReadabilityPanel, SentenceEditor, Summary, type Analysis, type Sentence } from './StyleShared';
import { PHRASE_LANGS, RulesTab } from './StyleRules';

/** Prüf- und Bearbeitungsfläche für einen Text (freies Textfeld oder Kapitelabsatz) */
function StyleEditor({ initial, onSave, saveLabel, canRewrite, chooseLanguage }: { initial: string; onSave?: (text: string) => Promise<void>; saveLabel?: string; canRewrite: boolean; chooseLanguage?: boolean }) {
  const { notify } = useApp();
  // Sprache des Textes (ADR-097): Deutsch prüft alle Regeln, Englisch zusätzlich a/an, „I“ und Rechtschreibung
  const [lang, setLang] = useState('de');
  // Tonalität (ADR-102, S-02): Produktart und Rolle bestimmen den Ton der Prüfung und der KI
  const [product, setProduct] = useState('manual');
  const [role, setRole] = useState('');
  const tone = useLoad<any>('/style/tone');
  const scope = { product, ...(role ? { roles: [role] } : {}) };
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
      const r = await post<any>('/style/check', { text: t, language: lang, ...scope });
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
        analysis = await post<Analysis>('/style/check', { text: cur, language: lang, ...scope });
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
      const r = await post<any>('/style/rewrite', { text: source, mode, ...scope });
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
      {chooseLanguage && (
        <label className="inline">Sprache des Textes
          <select value={lang} onChange={(e) => { setLang(e.target.value); setA(null); }}>
            {PHRASE_LANGS.map(([c, l]) => <option key={c} value={c}>{l}</option>)}
          </select>
        </label>
      )}
      {tone.data?.active && lang === 'de' && (
        <div className="filters">
          <label className="inline">Produktart
            <select value={product} onChange={(e) => { setProduct(e.target.value); setA(null); }}>
              {tone.data.products.map((p: any) => <option key={p.product} value={p.product}>{p.label}</option>)}
            </select>
          </label>
          <label className="inline">Rolle
            <select value={role} onChange={(e) => { setRole(e.target.value); setA(null); }}>
              <option value="">alle Rollen</option>
              {tone.data.roles.map((r: any) => <option key={r.role} value={r.role}>{r.label}</option>)}
            </select>
          </label>
          {(a as any)?.tone && <span className="tag">Ton: {(a as any).tone.label}</span>}
        </div>
      )}
      <label className="block">Text
        <textarea rows={8} value={text} onChange={(e) => { setText(e.target.value); setA(null); }} placeholder="Fließtext hier einfügen …" />
      </label>
      <div className="filters">
        <Gated className="btn primary" missing={[!text.trim() && 'Text']} onClick={() => check()}>Prüfen</Gated>
        <button className="btn" disabled={busy || !a?.fixable} onClick={autoFix}>Automatisch korrigieren{a?.fixable ? ` (${a.fixable})` : ''}</button>
        {canRewrite && lang === 'de' && <button className="btn" disabled={busy || !text.trim()} onClick={() => rewrite('professional')}>Professionell umformulieren</button>}
        {canRewrite && lang === 'de' && <button className="btn" disabled={busy || !text.trim()} onClick={() => rewrite('present')}>In Präsens umwandeln</button>}
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
          <ReadabilityPanel r={data.data.readability} />
          {data.data.blocks.map((b: any) => (
            <Card key={b.id} title={`${b.section} · ${b.analysis.problemSentences ? `${b.analysis.problemSentences} Problem(e)` : '✓'}`}>
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
  const canAdmin = !!me.data?.permissions.includes('admin');
  const canGlobalAdmin = !!me.data?.globalPermissions?.includes('admin');
  const [tab, setTab] = useState<'text' | 'chapter' | 'snippets' | 'rules'>('text');
  const empty = useMemo(() => '', []);
  // lokale Grammatikprüfung (ADR-108, G-04)
  const lt = useLoad<any>('/style/language-tool');
  return (
    <Page title="Schreibstil" subtitle="Professioneller Stil, Grammatik und Präsens – problematische Sätze sind gelb markiert und direkt bearbeitbar">
      {lt.data && <p className="small muted" role="status">LanguageTool: {lt.data.available ? `verbunden (${(lt.data.languages ?? []).join(', ')})` : lt.data.configured ? 'nicht erreichbar – Prüfung mit den eigenen Regeln' : 'nicht eingerichtet – Prüfung mit den eigenen Regeln'}</p>}
      <div className="tabs" role="tablist" aria-label="Textquelle">
        {(['text', 'chapter', 'snippets', 'rules'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {{ text: 'Textfeld', chapter: 'Kapitel', snippets: 'Textschnipsel', rules: 'Regeln' }[t]}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'text' && <StyleEditor initial={empty} canRewrite={canEdit} chooseLanguage />}
        {tab === 'chapter' && <ChapterTab canEdit={canEdit} />}
        {tab === 'snippets' && <SnippetTab />}
        {tab === 'rules' && <RulesTab canAdmin={canAdmin} canGlobalAdmin={canGlobalAdmin} />}
      </div>
    </Page>
  );
}
