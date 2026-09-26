import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { del, get, patch, post } from '../api';
import {
  Badge, Diff, DivisionBadges, Empty, ErrorBox, ImageInsert, Md, RoleBadges, Severity, Status, TYPE_LABEL, errorText, useApp, useLoad,
  Modal, activatable,
} from '../components/ui';
import { DiagramStudio } from '../components/DiagramStudio';
import { MarkedText, SentenceEditor, type Analysis } from './Style';
import { SourceViewer } from './Sources';
import { DiscussionPanel } from './Discussion';

const REWRITABLE = ['paragraph', 'list', 'note', 'tip', 'warning'];

const KIND_LABEL: Record<string, string> = { paragraph: 'Absatz', list: 'Liste', note: 'ℹ️ Hinweis', tip: '💡 Tipp', warning: '⚠️ Warnung', xref: '↗️ Querverweis', gap: '⚠ Lücke', table: 'Tabelle', code: 'Code' };

/** Kapitel nach Handbuch gruppieren: Quellenkapitel zuerst, danach je Handbuch-Variante (ADR-034) */
function groupByHandbook(chapters: any[], outlines: any[]) {
  const name = new Map<string, string>();
  for (const o of [...outlines].sort((a, b) => (a.status === 'active' ? 1 : 0) - (b.status === 'active' ? 1 : 0))) name.set(o.familyId, o.name);
  const groups: { key: string; name: string | null; chapters: any[] }[] = [];
  for (const c of chapters) {
    const key = c.outlineFamilyId ?? '';
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push((g = { key, name: key ? `Variante: ${name.get(key) ?? 'Gliederung'}` : null, chapters: [] }));
    g.chapters.push(c);
  }
  if (groups.length > 1 && !groups[0].key) groups[0].name = 'Quellen';
  return groups;
}

export function WorkshopPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { notify } = useApp();
  const chapters = useLoad<any[]>('/chapters?outline=all');
  const outlines = useLoad<any>('/outlines');
  const chapter = chapters.data?.find((c) => c.id === chapterId);
  const [versionId, setVersionId] = useState<string | null>(null);
  const version = useLoad<any>(versionId ? `/chapter-versions/${versionId}` : null, [versionId]);
  const llm = useLoad<any>('/llm/status');
  const [batchOpen, setBatchOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<'sources' | 'discussion' | 'findings' | 'history' | 'approval'>('sources');
  const me = useLoad<any>('/me');
  const [styleOn, setStyleOn] = useState(false);
  const [batchStyleOpen, setBatchStyleOpen] = useState(false);

  useEffect(() => {
    if (!chapterId && chapters.data?.length) {
      const first = chapters.data.find((c) => c.versions.length) ?? chapters.data[0];
      navigate(`/werkstatt/${first.id}`, { replace: true });
    }
  }, [chapterId, chapters.data, navigate]);
  useEffect(() => {
    setVersionId(chapter?.versions[0]?.id ?? null);
    setSelected(null);
  }, [chapter?.id, chapter?.versions[0]?.id]);

  const v = version.data;
  const styleData = useLoad<any>(styleOn && v ? `/style/chapter-versions/${v.id}` : null, [styleOn, v?.id, v && JSON.stringify(v.sections.flatMap((s: any) => s.blocks.map((b: any) => b.versionNo)))]);
  const styleOf = (id: string): Analysis | null => styleData.data?.blocks.find((x: any) => x.id === id)?.analysis ?? null;
  const editable = v?.status === 'draft';
  const allBlocks: any[] = v ? v.sections.flatMap((s: any) => s.blocks) : [];
  const selectedBlock = allBlocks.find((b) => b.id === selected);
  const refresh = () => {
    version.reload();
    chapters.reload();
  };

  const regenerate = async () => {
    try {
      const nv = await post<any>(`/chapters/${chapterId}/generate`);
      notify(`Version ${nv.versionNo} generiert – manuelle und gesperrte Blöcke wurden übernommen.`);
      chapters.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <div className="workshop">
      <aside className="ws-left" aria-label="Inhaltsverzeichnis">
        <h2>Inhaltsverzeichnis</h2>
        {groupByHandbook(chapters.data ?? [], outlines.data?.items ?? []).map((g) => (
        <div key={g.key}>
        {g.name && <h3 className="toc-group">{g.name}</h3>}
        <ul className="toc" aria-label={g.name ?? 'Kapitel der Quellen'}>
          {g.chapters.map((c) => (
            <li key={c.id} className={c.id === chapterId ? 'active' : ''}>
              <button className="btn link" onClick={() => navigate(`/werkstatt/${c.id}`)}>{c.title}</button>
              <div className="small">
                {c.versions[0] ? <Status s={c.versions[0].status} /> : <span className="muted">nicht generiert</span>}
                {c.openBlockers > 0 && <span className="tag sev-blocker">⛔ {c.openBlockers}</span>}
              </div>
              {c.id === chapterId && (
                <div className="coverage small">
                  <RoleBadges codes={c.coverage.roles.map((r: any) => r.code)} />
                  <DivisionBadges codes={c.coverage.divisions.map((r: any) => r.code)} />
                </div>
              )}
            </li>
          ))}
        </ul>
        </div>
        ))}
      </aside>

      <section className="ws-main">
        <header className="page-head">
          <div>
            <h1>Kapitelwerkstatt</h1>
            <p className="muted">{chapter?.title ?? 'Kapitel wählen'}</p>
          </div>
          <div className="actions">
            {chapter && chapter.versions.length > 0 && (
              <select aria-label="Version" value={versionId ?? ''} onChange={(e) => setVersionId(e.target.value)}>
                {chapter.versions.map((x: any) => <option key={x.id} value={x.id}>Version {x.versionNo} ({x.status})</option>)}
              </select>
            )}
            {chapter && chapter.versions.length > 1 && <Link className="btn" to={`/vergleich/${chapter.id}`}>Versionen vergleichen</Link>}
            {v && <Link className="btn" to={`/anleitungs-check/${v.id}`}>🔍 Anleitungs-Check</Link>}
            {v && <button className={`btn${styleOn ? ' active' : ''}`} aria-pressed={styleOn} onClick={() => setStyleOn(!styleOn)}>🖋️ Stil anzeigen</button>}
            {v && editable && <button className="btn" onClick={() => setBatchStyleOpen(true)}>🖋️ Stil korrigieren</button>}
            {v && editable && llm.data?.enabled && <button className="btn" onClick={() => setBatchOpen(true)}>✨ Kapitel umformulieren</button>}
            {chapter && <button className="btn primary" onClick={regenerate}>{chapter.versions.length ? 'Neu generieren' : 'Generieren'}</button>}
          </div>
        </header>
        <ErrorBox error={version.error} />
        {!v && <Empty>Für dieses Kapitel gibt es noch keine generierte Version.</Empty>}
        {styleOn && styleData.data && (
          <p className="small" role="status">
            Schreibstil: {styleData.data.summary.withProblems} von {styleData.data.summary.blocks} Absätzen mit Problemen – gelb markierte Sätze {editable ? 'anklicken und korrigieren' : 'sind im Entwurf bearbeitbar'} · <Link to="/schreibstil">Schreibstil-Seite</Link>
          </p>
        )}
        {batchStyleOpen && v && <StyleBatch version={v} llm={llm.data} onClose={() => setBatchStyleOpen(false)} onChanged={refresh} />}
        {v && llm.data?.enabled && <ChapterRewrite version={v} llm={llm.data} editable={editable} open={batchOpen} onClose={() => setBatchOpen(false)} onChanged={refresh} />}
        {v && !editable && <div className="alert">Version {v.versionNo} ist <strong>{v.status === 'approved' ? 'freigegeben und unveränderlich' : v.status === 'in_review' ? 'zur Freigabe eingereicht' : 'ersetzt'}</strong>. {v.status === 'in_review' ? 'Zum Bearbeiten die Einreichung im Tab „Freigabe“ zurückziehen.' : 'Änderungen erfordern eine neue Version.'}</div>}
        {v?.sections.map((s: any, si: number) => (
          <section key={s.code} className="ws-section">
            <h2>{si + 1}. {s.title}</h2>
            {s.blocks.map((b: any, bi: number) => (
              <BlockCard
                key={b.id}
                block={b}
                editable={editable}
                selected={selected === b.id}
                onSelect={() => setSelected(b.id)}
                prev={s.blocks[bi - 1]}
                next={s.blocks[bi + 1]}
                llm={llm.data}
                onChanged={refresh}
                style={styleOn ? styleOf(b.id) : null}
              />
            ))}
            {editable && <AddBlock versionId={v.id} section={s.code} onAdded={refresh} />}
          </section>
        ))}
      </section>

      <aside className="ws-right" aria-label="Details">
        <div className="tabs" role="tablist">
          {(['sources', 'discussion', 'findings', 'history', 'approval'] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {{ sources: 'Quellen', discussion: 'Diskussion', findings: 'Befunde', history: 'Historie', approval: 'Freigabe' }[t]}
            </button>
          ))}
        </div>
        {tab === 'sources' && <SourcesTab block={selectedBlock} />}
        {tab === 'discussion' && (selectedBlock
          ? <DiscussionPanel entityType="block" entityId={selectedBlock.lineageId} canEdit={!!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin')} />
          : <Empty>Block in der Mitte auswählen, um die Diskussion zu sehen – sie bleibt über neue Versionen erhalten.</Empty>)}
        {tab === 'findings' && chapterId && <FindingsTab chapterId={chapterId} />}
        {tab === 'history' && <HistoryTab block={selectedBlock} editable={editable} onRestored={refresh} />}
        {tab === 'approval' && v && <ApprovalPanel version={v} onApproved={refresh} />}
      </aside>
    </div>
  );
}

function BlockCard({ block: b, editable, selected, onSelect, prev, next, llm, onChanged, style }: {
  block: any; editable: boolean; selected: boolean; onSelect: () => void; prev?: any; next?: any; llm?: any; onChanged: () => void; style?: Analysis | null;
}) {
  const { ref, notify } = useApp();
  const [styleSel, setStyleSel] = useState<number | null>(null);
  const [imageOpen, setImageOpen] = useState(false);
  useEffect(() => setStyleSel(null), [b.versionNo]);
  const [mode, setMode] = useState<'view' | 'edit' | 'classify'>('view');
  const [proposal, setProposal] = useState<any | null>(null);
  // Nach Übernahme, Wiederherstellung oder Neuladen den Editor mit dem aktuellen Text füllen
  useEffect(() => {
    if (mode !== 'edit') setText(b.text);
  }, [b.text, b.versionNo, mode]);
  const [busy, setBusy] = useState(false);
  const canRewrite = llm?.enabled && REWRITABLE.includes(b.kind) && b.sources.length > 0;
  const requestRewrite = async () => {
    if (llm.external && !confirm(`Absatz und ${b.sources.length} Quelltext(e) werden zur Umformulierung an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return;
    setBusy(true);
    try {
      setProposal(await post(`/content-blocks/${b.id}/rewrite-proposals`, {}));
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const [text, setText] = useState<string>(b.text);
  const [reason, setReason] = useState('');
  const locked = b.mode === 'locked';

  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      setMode('view');
      onChanged();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <article className={`block kind-${b.kind} mode-${b.mode} ${selected ? 'selected' : ''}`} {...activatable(onSelect)} aria-current={selected ? 'true' : undefined} aria-label={`Block ${KIND_LABEL[b.kind] ?? b.kind}`}>
      <div className="block-meta">
        <span className="tag">{KIND_LABEL[b.kind] ?? b.kind}</span>
        <Status s={b.mode} />
        {b.scopeStatus !== 'confirmed' && <Status s={b.scopeStatus} />}
        <RoleBadges codes={b.roles.filter((r: string) => r !== 'all')} />
        <DivisionBadges codes={b.divisions.filter((d: string) => d !== 'all')} />
        {b.market && <span className="tag">Markt {b.market}</span>}
        {b.release && <span className="tag">Release {b.release}</span>}
        <span className="small muted">{b.sources.length ? `${b.sources.length} Quelle(n)` : b.justification ? 'manuell begründet' : 'ohne Evidenz'} · v{b.versionNo}</span>
      </div>
      {mode === 'edit' ? (
        <div onClick={(e) => e.stopPropagation()}>
          <textarea rows={Math.max(3, text.split('\n').length + 1)} value={text} onChange={(e) => setText(e.target.value)} aria-label="Text bearbeiten" />
          <ImageInsert onInsert={(md) => setText((t) => `${t.trimEnd()}\n\n${md}`)} />
          <input placeholder="Änderungsgrund (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="row-actions">
            <button className="btn primary small" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { text, reason, expectedVersionNo: b.versionNo }), 'Block gespeichert (manuell bearbeitet).')}>Speichern</button>
            <button className="btn small" onClick={() => (setMode('view'), setText(b.text))}>Abbrechen</button>
          </div>
        </div>
      ) : style && style.sentences.some((x) => x.issues.length) ? (
        // Schreibstil (ADR-043): gelb markierte Sätze direkt im Absatz bearbeiten
        <div className="block-style" onClick={(e) => e.stopPropagation()}>
          <MarkedText text={b.text} a={style} hideImages selected={styleSel} onSelect={editable && !locked ? setStyleSel : undefined} />
          {/* Bilder des Absatzes bleiben im Stilmodus sichtbar */}
          {[...b.text.matchAll(/!\[[^\]]*\]\([^)]*\)/g)].map((m, i) => <Md key={i} text={m[0]} />)}
          {styleSel !== null && style.sentences[styleSel] && (
            <SentenceEditor s={style.sentences[styleSel]} onClose={() => setStyleSel(null)} onApply={(r) => {
              const st = style.sentences[styleSel];
              void run(() => patch(`/content-blocks/${b.id}`, { text: b.text.slice(0, st.start) + r + b.text.slice(st.end), expectedVersionNo: b.versionNo, reason: 'Schreibstil' }), 'Satz korrigiert.');
            }} />
          )}
        </div>
      ) : (
        <Md text={b.text} />
      )}
      {proposal && <RewriteProposal proposal={proposal} block={b} llm={llm} onClose={() => setProposal(null)} onDecided={() => (setProposal(null), onChanged())} />}
      {b.justification && <p className="small muted">Begründung: {b.justification}</p>}
      {b.comment && <p className="small comment">💬 {b.comment}</p>}
      {mode === 'classify' && <ClassifyForm block={b} onDone={() => (setMode('view'), onChanged())} />}
      {imageOpen && (
        // Bild aus diesem Absatz (ADR-042): gespeicherte Bilder werden an den Absatz angehängt
        <div onClick={(e) => e.stopPropagation()}>
          <Modal title="Bild aus diesem Absatz erzeugen" wide onClose={() => setImageOpen(false)}>
            <DiagramStudio initialText={b.text} canEdit={editable} showSample={false} onSaved={(saved) => {
              setImageOpen(false);
              void run(() => patch(`/content-blocks/${b.id}`, { text: `${b.text.trimEnd()}\n\n${saved.map((x) => x.markdown).join('\n\n')}`, expectedVersionNo: b.versionNo, reason: 'Bild eingefügt' }), `${saved.length} Bild(er) in den Absatz eingefügt.`);
            }} />
          </Modal>
        </div>
      )}
      {editable && mode === 'view' && (
        <div className="row-actions" onClick={(e) => e.stopPropagation()}>
          {!locked && <button className="btn small" onClick={() => setMode('edit')}>Bearbeiten</button>}
          {!locked && <button className="btn small" onClick={() => setMode('classify')}>Zuordnen</button>}
          {!locked && <button className="btn small" onClick={() => setImageOpen(true)}>🎨 Bild erzeugen</button>}
          {!locked && canRewrite && !proposal && <button className="btn small" disabled={busy} onClick={requestRewrite}>{busy ? 'KI formuliert …' : '✨ KI-Vorschlag'}</button>}
          {!locked && prev && <button className="btn small" aria-label="nach oben" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { position: prev.position - 5 }), 'Verschoben.')}>↑</button>}
          {!locked && next && <button className="btn small" aria-label="nach unten" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { position: next.position + 5 }), 'Verschoben.')}>↓</button>}
          {!locked && (
            <select aria-label="In Abschnitt verschieben" value="" onChange={(e) => e.target.value && run(() => patch(`/content-blocks/${b.id}`, { section: e.target.value }), 'In anderen Abschnitt verschoben.')}>
              <option value="">Verschieben nach …</option>
              {ref?.sections.filter((s) => s.code !== b.section).map((s) => <option key={s.code} value={s.code}>{s.title}</option>)}
            </select>
          )}
          <button className="btn small" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { mode: locked ? 'manually_edited' : 'locked' }), locked ? 'Block entsperrt.' : 'Block gesperrt.')}>{locked ? '🔓 Entsperren' : '🔒 Sperren'}</button>
          <button className="btn small" onClick={() => { const c = prompt('Kommentar', b.comment ?? ''); if (c !== null) void run(() => patch(`/content-blocks/${b.id}`, { comment: c }), 'Kommentar gespeichert.'); }}>💬</button>
          {!locked && <button className="btn small danger" onClick={() => { const r = prompt('Grund für das Löschen (wird protokolliert)'); if (r !== null) void run(() => del(`/content-blocks/${b.id}?reason=${encodeURIComponent(r)}`), 'Block gelöscht – über Historie wiederherstellbar.'); }}>Löschen</button>}
        </div>
      )}
    </article>
  );
}

/**
 * Stapelkorrektur Schreibstil (ADR-043) bzw. KI-Stapelumformulierung (ADR-044): Vorschau je Absatz, Auswahl, Übernahme mit Versionsprüfung.
 * Regeln: serverseitige Vorschau. KI: je Absatz über /style/rewrite (Fortschritt sichtbar, Absätze mit Bildern ausgenommen).
 */
function StyleBatch({ version, llm, onClose, onChanged }: { version: any; llm: any; onClose: () => void; onChanged: () => void }) {
  const { notify } = useApp();
  const [mode, setMode] = useState<'rules' | 'professional' | 'present'>('rules');
  const [items, setItems] = useState<any[] | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const cancelled = useRef(false);
  useEffect(() => () => {
    cancelled.current = true;
  }, []);

  const load = async (m: typeof mode) => {
    setItems(null);
    setChosen([]);
    cancelled.current = false;
    try {
      if (m === 'rules') {
        const r = await post<any>(`/style/chapter-versions/${version.id}/autofix`, {});
        setItems(r.blocks.map((b: any) => ({ ...b, note: `${b.applied} Korrektur(en)` })));
        setChosen(r.blocks.filter((b: any) => !b.locked).map((b: any) => b.id));
        return;
      }
      if (llm?.external && !confirm(`Die Absätze werden zur Umformulierung an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return setMode('rules');
      const blocks = version.sections.flatMap((s: any) => s.blocks.map((b: any) => ({ ...b, sectionTitle: s.title })))
        .filter((b: any) => REWRITABLE.includes(b.kind) && b.mode !== 'locked' && !b.text.includes('](media:'));
      const out: any[] = [];
      setProgress({ done: 0, total: blocks.length });
      for (const [n, b] of blocks.entries()) {
        if (cancelled.current) break;
        try {
          const r = await post<any>('/style/rewrite', { text: b.text, mode: m });
          if (r.text.trim() !== b.text.trim()) {
            out.push({ id: b.id, section: b.sectionTitle, versionNo: b.versionNo, before: b.text, after: r.text, lostNumbers: r.lostNumbers,
              note: r.lostNumbers.length ? `⚠ Zahlen fehlen: ${r.lostNumbers.join(', ')}` : r.method === 'ai' ? 'KI-Vorschlag' : 'Regelkorrektur' });
          }
        } catch (e) {
          out.push({ id: b.id, section: b.sectionTitle, versionNo: b.versionNo, before: b.text, after: null, note: `nicht umformuliert: ${errorText(e)}` });
        }
        setProgress({ done: n + 1, total: blocks.length });
      }
      setItems(out);
      // Vorschläge mit fehlenden Zahlen nicht vorauswählen
      setChosen(out.filter((x) => x.after && !x.lostNumbers?.length).map((x) => x.id));
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setProgress(null);
    }
  };
  useEffect(() => {
    void load(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.id, mode]);

  const apply = async () => {
    if (!items) return;
    setBusy(true);
    try {
      const sel = items.filter((b) => chosen.includes(b.id));
      const r = mode === 'rules'
        ? await post<any>(`/style/chapter-versions/${version.id}/autofix`, { apply: true, blocks: sel.map((b) => ({ id: b.id, versionNo: b.versionNo })) })
        : await post<any>(`/style/chapter-versions/${version.id}/apply`, { blocks: sel.map((b) => ({ id: b.id, versionNo: b.versionNo, text: b.after })), reason: mode === 'present' ? 'Schreibstil: ins Präsens (KI)' : 'Schreibstil: professionell umformuliert (KI)' });
      notify(`${r.saved.length} Absatz/Absätze ${mode === 'rules' ? 'korrigiert' : 'umformuliert'}${r.skipped.length ? `, ${r.skipped.length} übersprungen (${r.skipped.map((x: any) => x.reason).join('; ')})` : ''}.`);
      onChanged();
      onClose();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const usable = (items ?? []).filter((b) => b.after);
  return (
    <Modal title="Schreibstil: Kapitel automatisch korrigieren" wide onClose={onClose}>
      <div className="filters" role="group" aria-label="Art der Überarbeitung">
        <button className={`chip${mode === 'rules' ? ' active' : ''}`} aria-pressed={mode === 'rules'} disabled={!!progress} onClick={() => setMode('rules')}>Regelkorrekturen</button>
        {llm?.enabled && <button className={`chip${mode === 'professional' ? ' active' : ''}`} aria-pressed={mode === 'professional'} disabled={!!progress} onClick={() => setMode('professional')}>✨ KI: professionell umformulieren</button>}
        {llm?.enabled && <button className={`chip${mode === 'present' ? ' active' : ''}`} aria-pressed={mode === 'present'} disabled={!!progress} onClick={() => setMode('present')}>✨ KI: ins Präsens</button>}
      </div>
      {progress && (
        <div role="status">
          <p className="small">KI formuliert Absatz {Math.min(progress.done + 1, progress.total)} von {progress.total} …</p>
          <progress max={progress.total} value={progress.done} aria-label="Fortschritt der Umformulierung" />
          <button className="btn small" onClick={() => (cancelled.current = true)}>Abbrechen</button>
        </div>
      )}
      {!items && !progress && <p className="small">Vorschau wird berechnet …</p>}
      {items && !usable.length && <Empty>{mode === 'rules' ? 'Keine automatischen Korrekturen nötig.' : 'Keine Änderungsvorschläge.'}</Empty>}
      {items && items.length > 0 && (
        <>
          <p className="small" role="status">{usable.length} Absätze mit {mode === 'rules' ? 'automatischen Korrekturen' : 'Vorschlägen'} · {chosen.length} ausgewählt</p>
          <ul className="plain style-batch">
            {items.map((b: any) => (
              <li key={b.id}>
                <label className="inline"><input type="checkbox" disabled={b.locked || !b.after} checked={chosen.includes(b.id)} onChange={() => setChosen(chosen.includes(b.id) ? chosen.filter((x) => x !== b.id) : [...chosen, b.id])} /> {b.section} · {b.note}{b.locked ? ' · gesperrt' : ''}</label>
                {b.after && <Diff a={b.before} b={b.after} />}
              </li>
            ))}
          </ul>
          <div className="row-actions">
            <button className="btn primary" disabled={busy || !!progress || !chosen.length} onClick={apply}>Auswahl übernehmen ({chosen.length})</button>
            <button className="btn" onClick={onClose}>Abbrechen</button>
          </div>
        </>
      )}
    </Modal>
  );
}

/**
 * KI-Umformulierung des ganzen Kapitels: Auftrag starten, Fortschritt verfolgen, Vorschläge gesammelt prüfen.
 * Sichtbar, sobald ein Auftrag läuft, offene Vorschläge vorliegen oder der Auftrag gestartet werden soll.
 */
function ChapterRewrite({ version: v, llm, editable, open, onClose, onChanged }: { version: any; llm: any; editable: boolean; open: boolean; onClose: () => void; onChanged: () => void }) {
  const { notify, ref } = useApp();
  const batches = useLoad<any[]>(`/chapter-versions/${v.id}/rewrite-jobs`, [v.id]);
  const proposals = useLoad<any[]>(`/chapter-versions/${v.id}/rewrite-proposals`, [v.id, JSON.stringify(v.sections.map((s: any) => s.blocks.map((b: any) => b.versionNo)))]);
  const [instructions, setInstructions] = useState('');
  const latest = batches.data?.[0];
  const running = latest && ['queued', 'processing'].includes(latest.status);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      batches.reload();
      proposals.reload();
    }, 1500);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (latest && !running) proposals.reload();
  }, [latest?.status]);
  const act = async (fn: () => Promise<any>, msg: (r: any) => string) => {
    try {
      const r = await fn();
      notify(msg(r));
      batches.reload();
      proposals.reload();
      onChanged();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const start = () => {
    if (llm.external && !confirm(`Alle geeigneten Absätze dieses Kapitels und ihre Quelltexte werden an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return;
    void act(() => post(`/chapter-versions/${v.id}/rewrite-jobs`, { instructions }), (b) => `Umformulierung gestartet: ${b.total} Absätze.`);
    onClose();
  };
  const list = proposals.data ?? [];
  const valid = list.filter((p) => p.status === 'proposed' && p.valid);
  if (!open && !running && !list.length) return null;
  const title = (code: string) => ref?.sections.find((s) => s.code === code)?.title ?? code;
  return (
    <section className="card rewrite-batch" aria-label="KI-Umformulierung des Kapitels">
      <div className="card-head">
        <h2>✨ KI-Umformulierung des Kapitels</h2>
        {open && <button className="btn ghost small" onClick={onClose} aria-label="Schließen">✕</button>}
      </div>
      {open && !running && editable && (
        <div className="form-row">
          <label>Hinweis an die KI (optional) <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="z. B. kürzer, einfache Sprache" /></label>
          <button className="btn primary" onClick={start}>Vorschläge für alle Absätze anfordern</button>
        </div>
      )}
      {latest && (
        <div className="batch-status">
          <progress max={latest.total || 1} value={latest.done} aria-label="Fortschritt der Umformulierung" />
          <span className="small">
            <Status s={latest.status} /> {latest.done} / {latest.total} Absätze · gültig {latest.valid} · ungültig {latest.invalid}
            {latest.skipped > 0 && <> · übersprungen {latest.skipped}</>}{latest.failed > 0 && <> · Fehler {latest.failed}</>}
            {' '}· Tokens {latest.inputTokens + latest.outputTokens}
          </span>
          {running && <button className="btn small" onClick={() => act(() => post(`/rewrite-jobs/${latest.id}/cancel`, {}), () => 'Abbruch angefordert.')}>Abbrechen</button>}
          {latest.error && <span className="small sev-text">{latest.error}</span>}
        </div>
      )}
      {list.length > 0 && (
        <>
          <div className="card-head">
            <h3>Sammelprüfung: {list.length} offene Vorschläge</h3>
            {editable && valid.length > 0 && (
              <button className="btn primary small" onClick={() => act(() => post(`/chapter-versions/${v.id}/rewrite-proposals/accept-valid`, {}), (r) => `${r.accepted.length} Vorschläge übernommen${r.errors.length ? `, ${r.errors.length} nicht (veraltet)` : ''}.`)}>
                Alle gültigen übernehmen ({valid.length})
              </button>
            )}
          </div>
          <ul className="batch-list">
            {list.map((p) => (
              <li key={p.id}>
                <div className="block-meta">
                  <strong>{title(p.section)}</strong>
                  <span className={`tag ${p.valid ? 'st-approved' : 'sev-blocker'}`}>{p.valid ? 'jeder Satz belegt' : 'Satzprüfung nicht bestanden'}</span>
                </div>
                <Diff a={p.originalText} b={p.proposedText} />
                {!p.valid && <ul className="small">{p.sentences.filter((s: any) => s.issues.length).map((s: any, i: number) => <li key={i} className="sev-text">{s.text} – {s.issues.map((x: string) => llm.issueLabels?.[x] ?? x).join(', ')}</li>)}</ul>}
                {editable && (
                  <div className="row-actions">
                    <button className="btn small" disabled={!p.valid || p.status !== 'proposed'} onClick={() => act(() => post(`/rewrite-proposals/${p.id}/accept`, {}), () => 'Vorschlag übernommen.')}>Übernehmen</button>
                    <button className="btn small" onClick={() => act(() => post(`/rewrite-proposals/${p.id}/reject`, {}), () => 'Vorschlag verworfen.')}>Verwerfen</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** KI-Vorschlag: Textdiff, Sätze mit Quellen und Prüfergebnis; übernehmen nur bei bestandener Satzprüfung (ADR-013). */
function RewriteProposal({ proposal: p, block: b, llm, onClose, onDecided }: { proposal: any; block: any; llm: any; onClose: () => void; onDecided: () => void }) {
  const { notify } = useApp();
  const seqOf = (id: string) => b.sources.find((s: any) => s.snippetId === id)?.seq;
  const decide = async (action: 'accept' | 'reject') => {
    try {
      await post(`/rewrite-proposals/${p.id}/${action}`, {});
      notify(action === 'accept' ? 'KI-Vorschlag übernommen – jeder Satz ist mit seinen Quellen verknüpft.' : 'KI-Vorschlag verworfen.');
      onDecided();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div className="rewrite" onClick={(e) => e.stopPropagation()} aria-label="KI-Vorschlag">
      <div className="block-meta">
        <strong>✨ KI-Vorschlag</strong>
        <span className="small muted">{p.provider} · {p.model}</span>
        <span className={`tag ${p.valid ? 'st-approved' : 'sev-blocker'}`}>{p.valid ? 'jeder Satz belegt' : 'Satzprüfung nicht bestanden'}</span>
      </div>
      <Diff a={p.originalText} b={p.proposedText} />
      <ol className="rewrite-sentences small">
        {p.sentences.map((s: any, i: number) => (
          <li key={i} className={s.issues.length ? 'fail' : 'ok'}>
            {s.text}{' '}
            {s.sourceIds.map((id: string) => <span key={id} className="tag">#{seqOf(id)}</span>)}
            <span className="muted"> · Abdeckung {Math.round(s.support * 100)} %</span>
            {s.issues.map((x: string) => <div key={x} className="sev-text">✖ {llm?.issueLabels?.[x] ?? x}</div>)}
            {s.details.map((d: string, j: number) => <div key={j} className="muted">{d}</div>)}
          </li>
        ))}
      </ol>
      <div className="row-actions">
        <button className="btn primary small" disabled={!p.valid} onClick={() => decide('accept')}>Übernehmen</button>
        <button className="btn small" onClick={() => decide('reject')}>Verwerfen</button>
        <button className="btn ghost small" onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
}

function ClassifyForm({ block: b, onDone }: { block: any; onDone: () => void }) {
  const { ref, notify } = useApp();
  const [roles, setRoles] = useState<string[]>(b.roles);
  const [divs, setDivs] = useState<string[]>(b.divisions);
  const [market, setMarket] = useState(b.market ?? '');
  const [release, setRelease] = useState(b.release ?? '');
  const [scope, setScope] = useState(b.scopeStatus);
  const [justification, setJustification] = useState(b.justification ?? '');
  const t = (l: string[], s: (v: string[]) => void, c: string) => s(l.includes(c) ? l.filter((x) => x !== c) : [...l, c]);
  const save = async () => {
    try {
      await patch(`/content-blocks/${b.id}`, { roles, divisions: divs, market: market || null, release: release || null, scopeStatus: scope, justification: justification || null });
      notify('Zuordnung gespeichert.');
      onDone();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div className="classify" onClick={(e) => e.stopPropagation()}>
      <fieldset className="checks"><legend>Rollen</legend>{ref?.roles.map((r) => <label key={r.code}><input type="checkbox" checked={roles.includes(r.code)} onChange={() => t(roles, setRoles, r.code)} /> <Badge item={r} /></label>)}</fieldset>
      <fieldset className="checks"><legend>Sparten</legend>{ref?.divisions.map((r) => <label key={r.code}><input type="checkbox" checked={divs.includes(r.code)} onChange={() => t(divs, setDivs, r.code)} /> <Badge item={r} /></label>)}</fieldset>
      <div className="form-row">
        <label>Markt <input value={market} onChange={(e) => setMarket(e.target.value.toUpperCase())} /></label>
        <label>Release <input value={release} onChange={(e) => setRelease(e.target.value)} /></label>
        <label>Zuordnungsstatus
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="confirmed">bestätigt</option>
            <option value="general">bewusst allgemein</option>
            <option value="unconfirmed">unbestätigt</option>
          </select>
        </label>
      </div>
      <label className="block">Manuelle Begründung (ersetzt fehlende Evidenz) <input value={justification} onChange={(e) => setJustification(e.target.value)} /></label>
      <button className="btn primary small" onClick={save}>Übernehmen</button> <button className="btn small" onClick={onDone}>Abbrechen</button>
    </div>
  );
}

function AddBlock({ versionId, section, onAdded }: { versionId: string; section: string; onAdded: () => void }) {
  const { notify } = useApp();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState('paragraph');
  const [text, setText] = useState('');
  const [justification, setJustification] = useState('');
  if (!open) return <button className="btn ghost small add" onClick={() => setOpen(true)}>+ Absatz, Hinweis, Tipp oder Warnung</button>;
  const save = async () => {
    try {
      await post(`/chapter-versions/${versionId}/content-blocks`, { section, kind, text, justification: justification || null });
      notify('Block hinzugefügt.');
      setOpen(false);
      setText('');
      onAdded();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div className="block add-form">
      <div className="form-row">
        <label>Typ
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {['paragraph', 'list', 'note', 'tip', 'warning'].map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
          </select>
        </label>
      </div>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Text (Markdown)" aria-label="Neuer Text" />
      <ImageInsert onInsert={(md) => setText((t) => (t.trim() ? `${t.trimEnd()}\n\n${md}` : md))} />
      <input value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Begründung / Beleg (Pflicht für Freigabe, wenn keine Quelle)" />
      <div className="row-actions">
        <button className="btn primary small" disabled={!text.trim()} onClick={save}>Hinzufügen</button>
        <button className="btn small" onClick={() => setOpen(false)}>Abbrechen</button>
      </div>
    </div>
  );
}

function SourcesTab({ block }: { block?: any }) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [viewer, setViewer] = useState<any | null>(null);
  useEffect(() => {
    if (!block) return;
    for (const s of block.sources) get<any>(`/snippets/${s.snippetId}`).then((sn) => setTexts((t) => ({ ...t, [s.snippetId]: sn.text }))).catch(() => undefined);
  }, [block?.id]);
  if (!block) return <Empty>Block in der Mitte auswählen, um seine Quellen zu sehen.</Empty>;
  if (!block.sources.length) return <Empty>{block.justification ? `Keine Quelle – manuelle Begründung: ${block.justification}` : 'Dieser Block hat weder Quelle noch Begründung (Qualitätsgate!).'}</Empty>;
  return (
    <div>
      {block.sentences && (
        <div className="source-item">
          <h3>Satz-Evidenz (KI-umformuliert)</h3>
          <ol className="small">
            {block.sentences.map((s: any, i: number) => (
              <li key={i}>{s.text} {s.sourceIds.map((id: string) => <span key={id} className="tag">#{block.sources.find((x: any) => x.snippetId === id)?.seq ?? '?'}</span>)}</li>
            ))}
          </ol>
        </div>
      )}
      {block.sources.map((s: any) => (
        <div key={s.snippetId} className="source-item">
          <div className="small"><strong>#{s.seq}</strong> {s.path} · Rev. {s.revisionNo}{s.isCurrent ? '' : ' (veraltet)'} · Z. {s.lineStart}–{s.lineEnd} · <Status s={s.evidenceStatus} /></div>
          <pre tabIndex={0} aria-label="Quelltext" className="source small">{texts[s.snippetId] ?? '…'}</pre>
          <button className="btn link small" onClick={() => setViewer(s)}>Quelle öffnen</button>
        </div>
      ))}
      {viewer && <SourceViewer revisionId={viewer.revisionId} lineStart={viewer.lineStart} lineEnd={viewer.lineEnd} onClose={() => setViewer(null)} />}
    </div>
  );
}

function FindingsTab({ chapterId }: { chapterId: string }) {
  const f = useLoad<any[]>(`/quality/findings?chapterId=${chapterId}&status=open,deferred`, [chapterId]);
  if (!f.data?.length) return <Empty>Keine offenen Befunde für dieses Kapitel.</Empty>;
  return (
    <ul className="finding-list">
      {f.data.map((x) => (
        <li key={x.id}><Severity s={x.severity} /> <strong>#{x.seq} {TYPE_LABEL[x.type]}</strong><div className="small">{x.reason}</div></li>
      ))}
    </ul>
  );
}

function HistoryTab({ block, editable, onRestored }: { block?: any; editable: boolean; onRestored: () => void }) {
  const { notify } = useApp();
  const h = useLoad<any[]>(block ? `/content-blocks/${block.id}/versions` : null, [block?.id, block?.versionNo]);
  const [cmp, setCmp] = useState<[number, number] | null>(null);
  if (!block) return <Empty>Block auswählen, um die Historie zu sehen.</Empty>;
  const versions = h.data ?? [];
  const find = (n: number) => versions.find((v) => v.versionNo === n)?.snapshot.text ?? '';
  return (
    <div>
      <ErrorBox error={h.error} />
      <ul className="history">
        {versions.map((v) => (
          <li key={v.versionNo}>
            <strong>v{v.versionNo}</strong> {v.changeType} · {v.author} · {new Date(v.createdAt).toLocaleString('de-DE')}
            {v.reason && <div className="small muted">{v.reason}</div>}
            <div className="row-actions">
              {v.versionNo !== block.versionNo && <button className="btn small" onClick={() => setCmp([v.versionNo, block.versionNo])}>mit aktueller vergleichen</button>}
              {editable && v.versionNo !== block.versionNo && (
                <button className="btn small" onClick={async () => {
                  try {
                    await post(`/content-blocks/${block.id}/restore`, { versionNo: v.versionNo });
                    notify(`Version ${v.versionNo} wiederhergestellt.`);
                    onRestored();
                  } catch (e) {
                    notify(errorText(e), 'error');
                  }
                }}>wiederherstellen</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {cmp && (
        <div>
          <h3>Vergleich v{cmp[0]} → v{cmp[1]}</h3>
          <Diff a={find(cmp[0])} b={find(cmp[1])} />
        </div>
      )}
    </div>
  );
}

export function ApprovalPanel({ version, onApproved }: { version: any; onApproved: () => void }) {
  const { notify } = useApp();
  const gate = useLoad<any>(`/chapter-versions/${version.id}/gate`, [version.id, version.status, JSON.stringify(version.sections.map((s: any) => s.blocks.map((b: any) => b.versionNo)))]);
  const [comment, setComment] = useState('');
  const act = async (path: string, body: unknown, msg: string) => {
    try {
      await post(`/chapter-versions/${version.id}/${path}`, body);
      notify(msg);
      setComment('');
      onApproved();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div>
      <p className="small">Status: <Status s={version.status} />{version.submittedBy && version.status === 'in_review' && <> · eingereicht von {version.submittedBy} am {new Date(version.submittedAt).toLocaleString('de-DE')}{version.submitComment && <> – „{version.submitComment}“</>}</>}</p>
      <h3>Qualitätsgate {gate.data && (gate.data.passed ? <span className="tag st-approved">bestanden</span> : <span className="tag sev-blocker">nicht bestanden</span>)}</h3>
      <ul className="gate">
        {gate.data?.checks.map((c: any) => (
          <li key={c.code} className={c.passed ? 'ok' : 'fail'}>
            {c.passed ? '✔' : '✖'} {c.label}
            {!c.passed && <ul className="small">{c.details.slice(0, 6).map((d: string, i: number) => <li key={i}>{d}</li>)}{c.details.length > 6 && <li>… {c.details.length - 6} weitere</li>}</ul>}
          </li>
        ))}
      </ul>
      <Link className="small" to={`/evidenz/${version.id}`}>Evidenz je Absatz ansehen →</Link>
      {version.status === 'draft' && (
        <>
          <h3>Zur Freigabe einreichen</h3>
          <p className="small muted">Nach dem Einreichen ist die Version bis zur Entscheidung gesperrt (Freigabestufen des Projekts siehe Seite „Freigabe“).</p>
          <label className="block">Hinweis an die Freigabe (optional) <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} /></label>
          <button className="btn primary" disabled={!gate.data?.passed} onClick={() => act('submit', { comment }, 'Zur Freigabe eingereicht.')}>Zur Freigabe einreichen</button>
        </>
      )}
      {version.workflow && (
        <>
          <h3>Freigabestufen{version.workflow.fourEyes && <span className="tag">Vier-Augen-Prinzip</span>}</h3>
          <ol className="stages">
            {version.workflow.stages.map((st: any) => (
              <li key={st.key} className={`stage-${st.status}`} aria-current={st.status === 'active' ? 'step' : undefined}>
                <strong>{st.name}</strong> – {st.status === 'done' ? 'abgeschlossen' : st.status === 'active' ? 'aktuell' : 'ausstehend'}
                {' '}· {st.votes.length}/{st.minApprovals} Zustimmung(en){st.approvers.length ? ` · zuständig: ${st.approvers.join(', ')}` : ''}
                {st.votes.length > 0 && <span className="small"> ({st.votes.map((x: any) => x.approver).join(', ')})</span>}
                {st.status === 'active' && version.workflow.dueAt && (
                  <span className={version.workflow.overdue ? 'tag sev-blocker' : 'small'}> Frist {new Date(version.workflow.dueAt).toLocaleDateString('de-DE')}{version.workflow.overdue ? ' – überfällig' : ''}</span>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
      {version.status === 'in_review' && (
        <>
          <h3>Fachliche Entscheidung</h3>
          <label className="block">Kommentar (Pflicht) <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} /></label>
          <div className="row-actions">
            <button className="btn primary" disabled={!gate.data?.passed || !comment.trim()} onClick={() => act('approve', { comment, decision: 'approved' }, version.workflow?.stages.length > 1 ? 'Zustimmung gespeichert.' : 'Kapitelversion freigegeben.')}>{version.workflow?.stages.length > 1 ? `Zustimmen (${version.workflow.stages[version.workflow.currentStage]?.name})` : 'Freigeben'}</button>
            <button className="btn" disabled={!comment.trim()} onClick={() => act('approve', { comment, decision: 'rejected' }, 'Abgelehnt – Version ist wieder ein bearbeitbarer Entwurf.')}>Ablehnen</button>
            <button className="btn ghost" onClick={() => act('withdraw', { reason: comment }, 'Einreichung zurückgezogen.')}>Einreichung zurückziehen</button>
          </div>
        </>
      )}
      <h3>Freigabeprotokoll</h3>
      {!version.approvals.length ? <p className="small muted">Noch keine Entscheidung.</p> : (
        <ul className="small">
          {version.approvals.map((a: any) => <li key={a.id}><Status s={a.decision} /> {a.approver}{a.stage && a.stage !== 'freigabe' ? ` (${a.stage})` : ''} · {new Date(a.createdAt).toLocaleString('de-DE')} — {a.comment}</li>)}
        </ul>
      )}
    </div>
  );
}
