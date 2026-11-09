import { ArrowUpRightIcon, CircleDashedIcon, InfoIcon, LightbulbIcon, ListChecksIcon, LockIcon, LockOpenIcon, MessageSquareIcon, PaletteIcon, PuzzleIcon, SparklesIcon, SpellCheckIcon, TriangleAlertIcon, WandSparklesIcon, type LucideIcon } from 'lucide-react';
import { BlockerIcon, Ico } from '../components/icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { del, patch, post } from '../api';
import { Badge, DivisionBadges, Empty, ErrorBox, ImageInsert, Md, RoleBadges, Status, errorText, useApp, useLoad, Modal, activatable, statusLabel, useDocTitle } from '../components/ui';
import { DiagramStudio } from '../components/DiagramStudio';
import { MarkedText, SentenceEditor, type Analysis } from './StyleShared';
import { DiscussionPanel } from './Discussion';
import { ApprovalPanel } from './ApprovalPanel';
import { ChapterRewrite, REWRITABLE, RewriteProposal, StyleBatch } from './WorkshopRewrite';
import { FindingsTab, HistoryTab, InstructionBanner, PipelineBanner, SaveTemplateButton, SourcesTab } from './WorkshopPanels';


const KIND_ICON: Record<string, LucideIcon> = { note: InfoIcon, tip: LightbulbIcon, warning: TriangleAlertIcon, xref: ArrowUpRightIcon, gap: CircleDashedIcon };
const KIND_LABEL: Record<string, string> = { paragraph: 'Absatz', list: 'Liste', note: 'Hinweis', tip: 'Tipp', warning: 'Warnung', xref: 'Querverweis', gap: 'Lücke', table: 'Tabelle', code: 'Code' };

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
  // Kapitel „Intern“ und „In Planung“ (Etappe 100): vorgemerkte Abschnitte, nicht im Handbuch
  const parked = useLoad<any[]>('/parked', [chapters.data]);
  const outlines = useLoad<any>('/outlines');
  const chapter = chapters.data?.find((c) => c.id === chapterId);
  useDocTitle('Kapitelwerkstatt', chapter?.title);
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

  // Seitenkopf vor dem Raster: Die Seite beginnt mit der Überschrift der ersten Ebene, danach Inhaltsverzeichnis und Kapitel
  return (
    <>
    <header className="page-head">
      <div>
        <h1>Kapitelwerkstatt</h1>
        <p className="muted">{chapter?.title ?? 'Kapitel wählen'}</p>
      </div>
      <div className="actions">
        {chapter && chapter.versions.length > 0 && (
          <select aria-label="Version" value={versionId ?? ''} onChange={(e) => setVersionId(e.target.value)}>
            {chapter.versions.map((x: any) => <option key={x.id} value={x.id}>Version {x.versionNo} ({statusLabel(x.status)})</option>)}
          </select>
        )}
        {chapter && chapter.versions.length > 1 && <Link className="btn" to={`/vergleich/${chapter.id}`}>Versionen vergleichen</Link>}
        {v && <Link className="btn" to={`/anleitungs-check/${v.id}`}><ListChecksIcon className="btn-icon" aria-hidden="true" size={16} />Anleitungs-Check</Link>}
        {v && <button className={`btn${styleOn ? ' active' : ''}`} aria-pressed={styleOn} onClick={() => setStyleOn(!styleOn)}><SpellCheckIcon className="btn-icon" aria-hidden="true" size={16} />Stil anzeigen</button>}
        {v && editable && <button className="btn" onClick={() => setBatchStyleOpen(true)}><WandSparklesIcon className="btn-icon" aria-hidden="true" size={16} />Stil korrigieren</button>}
        {v && me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin') && <SaveTemplateButton versionId={v.id} title={v.title} />}
        {v && editable && llm.data?.enabled && <button className="btn" onClick={() => setBatchOpen(true)}><SparklesIcon className="btn-icon" aria-hidden="true" size={16} />Kapitel umformulieren</button>}
        {chapter && <button className="btn primary" onClick={regenerate}>{chapter.versions.length ? 'Neu generieren' : 'Generieren'}</button>}
      </div>
    </header>
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
                {c.openBlockers > 0 && <span className="tag sev-blocker"><BlockerIcon />{c.openBlockers}<span className="sr-only"> offene Blocker</span></span>}
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
        <h3 className="toc-group">Nicht im Handbuch</h3>
        <ul className="toc" aria-label="Nicht im Handbuch">
          {[['intern', 'Intern'], ['planning', 'In Planung']].map(([code, title]) => (
            <li key={code}>
              <Link to={`/vormerkungen?ziel=${code}`}>{title}</Link>
              <div className="small muted">{(parked.data ?? []).filter((p) => p.target === code).length} vorgemerkt</div>
            </li>
          ))}
        </ul>
      </aside>

      <section className="ws-main">
        <ErrorBox error={version.error} />
        {chapterId && <InstructionBanner chapterId={chapterId} />}
        {chapterId && <PipelineBanner chapterId={chapterId} />}
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
          : <Empty>Wählen Sie im Kapitel einen Absatz, um die Diskussion zu sehen – sie bleibt über neue Versionen erhalten.</Empty>)}
        {tab === 'findings' && chapterId && <FindingsTab chapterId={chapterId} />}
        {tab === 'history' && <HistoryTab block={selectedBlock} editable={editable} onRestored={refresh} />}
        {tab === 'approval' && v && <ApprovalPanel version={v} onApproved={refresh} />}
      </aside>
    </div>
    </>
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
        <span className="tag">{KIND_ICON[b.kind] && <Ico icon={KIND_ICON[b.kind]} size={14} />}{KIND_LABEL[b.kind] ?? b.kind}</span>
        <Status s={b.mode} />
        {b.scopeStatus !== 'confirmed' && <Status s={b.scopeStatus} />}
        <RoleBadges codes={b.roles.filter((r: string) => r !== 'all')} />
        <DivisionBadges codes={b.divisions.filter((d: string) => d !== 'all')} />
        {b.market && <span className="tag">Markt {b.market}</span>}
        {b.release && <span className="tag">Release {b.release}</span>}
        {b.moduleId && <span className="tag" title="Absatz aus einem Textbaustein – gepflegt unter „Textbausteine“; eigener Text löst die Verknüpfung"><Ico icon={PuzzleIcon} />Textbaustein F{b.moduleVersion}</span>}
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
      {b.comment && <p className="small comment"><Ico icon={MessageSquareIcon} />{b.comment}</p>}
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
          {!locked && <button className="btn small" onClick={() => setImageOpen(true)}><PaletteIcon className="btn-icon" aria-hidden="true" size={16} />Bild erzeugen</button>}
          {!locked && canRewrite && !proposal && <button className="btn small" disabled={busy} onClick={requestRewrite}>{busy ? 'KI formuliert …' : <><SparklesIcon className="btn-icon" aria-hidden="true" size={16} />KI-Vorschlag</>}</button>}
          {!locked && prev && <button className="btn small" aria-label="nach oben" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { position: prev.position - 5 }), 'Verschoben.')}>↑</button>}
          {!locked && next && <button className="btn small" aria-label="nach unten" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { position: next.position + 5 }), 'Verschoben.')}>↓</button>}
          {!locked && (
            <select aria-label="In Abschnitt verschieben" value="" onChange={(e) => e.target.value && run(() => patch(`/content-blocks/${b.id}`, { section: e.target.value }), 'In anderen Abschnitt verschoben.')}>
              <option value="">Verschieben nach …</option>
              {ref?.sections.filter((s) => s.code !== b.section).map((s) => <option key={s.code} value={s.code}>{s.title}</option>)}
            </select>
          )}
          {/* Etappe 100: Quellen des Absatzes ins Kapitel „Intern“ bzw. „In Planung“ – der Absatz entfällt im Entwurf; nicht bei Rollen- und Quellenübersicht */}
          {!locked && !b.summary && b.sources?.length > 0 && (
            <select aria-label="Für Intern oder In Planung vormerken" value="" onChange={(e) => e.target.value && run(() => post(`/content-blocks/${b.id}/park`, { target: e.target.value }), `Für „${e.target.value === 'intern' ? 'Intern' : 'In Planung'}“ vorgemerkt – der Absatz entfällt im Entwurf.`)}>
              <option value="">Vormerken für …</option>
              <option value="intern">Intern</option>
              <option value="planning">In Planung</option>
            </select>
          )}
          <button className="btn small" onClick={() => run(() => patch(`/content-blocks/${b.id}`, { mode: locked ? 'manually_edited' : 'locked' }), locked ? 'Block entsperrt.' : 'Block gesperrt.')}>{locked ? <><Ico icon={LockOpenIcon} />Entsperren</> : <><Ico icon={LockIcon} />Sperren</>}</button>
          <button className="btn small" onClick={() => { const c = prompt('Kommentar', b.comment ?? ''); if (c !== null) void run(() => patch(`/content-blocks/${b.id}`, { comment: c }), 'Kommentar gespeichert.'); }} aria-label="Kommentar" title="Kommentar"><Ico icon={MessageSquareIcon} /></button>
          {!locked && <button className="btn small danger" onClick={() => { const r = prompt('Grund für das Löschen (wird protokolliert)'); if (r !== null) void run(() => del(`/content-blocks/${b.id}?reason=${encodeURIComponent(r)}`), 'Block gelöscht – über Historie wiederherstellbar.'); }}>Löschen</button>}
        </div>
      )}
    </article>
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
