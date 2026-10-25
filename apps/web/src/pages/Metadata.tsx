import { CompassIcon, FolderIcon, FolderInputIcon, FolderOpenIcon, FolderTreeIcon, PuzzleIcon, TagsIcon } from 'lucide-react';
import { FormatIcon, Ico, RefIcon } from '../components/icons';
import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { del, patch, post, put, qs } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';
import { InlineMd } from '../components/InlineMd';

// oneSCM_Metadaten (ADR-079): Übersicht, Chunks mit Labels, gespeicherte Fragen und Antworten, Labelkatalog

interface Label { id: string; code: string; group: string; nameDe: string; nameEn: string; archived: boolean; description?: string | null; position?: number; origin?: string; chunkCount?: number; qaCount?: number }
interface Group { code: string; nameDe: string; nameEn: string; icon: string; color: string }
type Lang = 'de' | 'en';

const LANG_KEY = 'onescm.metadata.lang';
const readLang = (): Lang => {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'de';
  } catch {
    return 'de';
  }
};
/** Sprache der Labelnamen (Deutsch/Englisch), je Browser gemerkt */
function useLabelLang() {
  const [lang, setLang] = useState<Lang>(readLang);
  const change = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* nur für diese Sitzung */
    }
  };
  return [lang, change] as const;
}
const nameOf = (l: Pick<Label, 'nameDe' | 'nameEn'>, lang: Lang) => (lang === 'en' ? l.nameEn : l.nameDe);

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <label className="small">Labels auf{' '}
      <select value={lang} onChange={(e) => onChange(e.target.value as Lang)} aria-label="Sprache der Labels">
        <option value="de">Deutsch</option>
        <option value="en">Englisch</option>
      </select>
    </label>
  );
}

function useMe() {
  const me = useLoad<{ permissions: string[] }>('/me');
  const perms = me.data?.permissions ?? [];
  return { canEdit: perms.includes('edit') || perms.includes('admin'), isAdmin: perms.includes('admin') };
}

function useLabels(includeArchived = false) {
  const labels = useLoad<Label[]>(`/metadata/labels${includeArchived ? '?includeArchived=true' : ''}`, [includeArchived]);
  const groups = useLoad<Group[]>('/metadata/label-groups');
  return { labels, groups: groups.data ?? [] };
}

function LabelTag({ label, lang, groups, onRemove }: { label: Label; lang: Lang; groups: Group[]; onRemove?: () => void }) {
  const g = groups.find((x) => x.code === label.group);
  const name = nameOf(label, lang);
  return (
    <span className={`tag md-label${label.archived ? ' md-archived' : ''}`} style={{ borderLeftColor: g?.color }} title={`${g ? nameOf(g, lang) : label.group} · ${label.code}${label.archived ? ' (ausgeblendet)' : ''}`}>
      <RefIcon name={g?.icon} /> {name}
      {onRemove && <button type="button" className="md-remove" aria-label={`Label „${name}“ entfernen`} onClick={onRemove}>×</button>}
    </span>
  );
}

/** Auswahl eines Labels, gruppiert; ausgeblendete Labels sind nicht wählbar */
function LabelSelect({ labels, groups, lang, value, onChange, exclude = [], ariaLabel, placeholder = 'Label wählen …' }: {
  labels: Label[]; groups: Group[]; lang: Lang; value: string; onChange: (id: string) => void; exclude?: string[]; ariaLabel: string; placeholder?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel}>
      <option value="">{placeholder}</option>
      {groups.map((g) => (
        <optgroup key={g.code} label={nameOf(g, lang)}>
          {labels.filter((l) => l.group === g.code && !l.archived && !exclude.includes(l.id)).map((l) => <option key={l.id} value={l.id}>{nameOf(l, lang)}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

/** Mehrfachauswahl: gewählte Labels als Tags, weitere per Auswahlliste */
function LabelMulti({ labels, groups, lang, selected, onChange, ariaLabel }: { labels: Label[]; groups: Group[]; lang: Lang; selected: string[]; onChange: (ids: string[]) => void; ariaLabel: string }) {
  return (
    <div className="md-multi">
      {selected.map((id) => {
        const l = labels.find((x) => x.id === id);
        return l ? <LabelTag key={id} label={l} lang={lang} groups={groups} onRemove={() => onChange(selected.filter((x) => x !== id))} /> : null;
      })}
      <LabelSelect labels={labels} groups={groups} lang={lang} value="" exclude={selected} ariaLabel={ariaLabel} placeholder="+ Label …" onChange={(id) => id && onChange([...selected, id])} />
    </div>
  );
}

const FORMAT_LABEL: Record<string, string> = { markdown: 'Markdown', html: 'HTML', docx: 'Word', pptx: 'PowerPoint', pdf: 'PDF', mp4: 'Video', subtitles: 'Untertitel', jira: 'Jira-Ticket' };
const formatText = (f: string) => FORMAT_LABEL[f] ?? f;
/** Format mit Icon (ADR-111) – in Auswahllisten nur der Text */
const FormatCell = ({ f }: { f: string }) => <><FormatIcon format={f} />{formatText(f)}</>;

/** Fundstelle lesbar: Seite, Folie, Zeitmarke oder Zeilen */
function locatorText(c: { locator: Record<string, unknown> | null; lineStart: number; lineEnd: number }) {
  const l = c.locator ?? {};
  if (l.page) return `Seite ${l.page}`;
  if (l.slide) return `Folie ${l.slide}`;
  if (l.time) return `bei ${l.time}`;
  if (l.anchor) return `Abschnitt #${l.anchor}`;
  return c.lineStart === c.lineEnd ? `Zeile ${c.lineStart}` : `Zeilen ${c.lineStart}–${c.lineEnd}`;
}
const headingText = (c: { chapter?: string; subchapter?: string | null; headingPath: string[] }) =>
  [c.chapter, c.subchapter, ...c.headingPath].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(' › ');

// ---------------------------------------------------------------- Übersicht

const STEPS = [
  { no: '①', title: 'Ablage', text: 'Dateien hochladen (einzeln oder als ZIP); identische Dateien werden erkannt.', stage: 'M1', ready: true, to: '/quellen' },
  { no: '②', title: 'Extraktion', text: 'Markdown, HTML, Word, PowerPoint und PDF (mit Texterkennung), Untertitel und Video mit Zeitmarke, Jira-Exporte.', stage: 'M2', ready: true, to: '/metadaten/einlesen' },
  { no: '③', title: 'Chunking', text: 'Textabschnitte je Überschrift mit Fundstelle (Zeile, Folie, Seite, Zeitmarke), lange Abschnitte in Teilstücken.', stage: 'M3', ready: true, to: '/metadaten/chunks' },
  { no: '④', title: 'Indexierung', text: 'Volltext- und semantischer Index, Dubletten je Abschnitt über alle Formate.', stage: 'M4', ready: true, to: '/metadaten/dubletten' },
  { no: '⑤', title: 'Fragestellung', text: 'Fragen an alle Quellen, Antwort nur aus den gefundenen Chunks mit Beleg je Satz.', stage: 'M5', ready: true, to: '/metadaten/fragen' },
  { no: '⑥', title: 'Ausgabe', text: 'Antwort mit Quelldatei und Auszug; Fragen und Antworten mit Labels speichern.', stage: 'M1', ready: true, to: '/metadaten/fragen' },
  { no: '⑦', title: 'Qualität', text: 'Testfragen mit erwarteten Quellen, Trefferquote und Verlauf; Wissenslücken an Fachleute.', stage: 'M7', ready: true, to: '/metadaten/qualitaet' },
];

export function MetadataOverviewPage() {
  const [lang, setLang] = useLabelLang();
  const ov = useLoad<any>('/metadata/overview');
  const d = ov.data;
  return (
    <Page title="oneSCM_Metadaten" subtitle="Alle Quellen einlesen, je Überschrift anzeigen, labeln und befragen – die Daten bleiben in der eigenen Umgebung" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={ov.error} />
      <div className="stat-row">
        <div className="stat"><span className="muted small">Quelldateien</span><strong>{d?.documents ?? '–'}</strong></div>
        <div className="stat"><span className="muted small">Chunks</span><strong>{d?.chunks ?? '–'}</strong></div>
        <div className="stat"><span className="muted small">Chunks mit Label</span><strong>{d?.labeledChunks ?? '–'}</strong></div>
        <div className="stat"><span className="muted small">Gespeicherte Antworten</span><strong>{d?.savedAnswers ?? '–'}</strong></div>
      </div>
      <Card title="Ablauf">
        <ol className="md-steps">
          {STEPS.map((s) => (
            <li key={s.no}>
              <span className="md-step-no" aria-hidden="true">{s.no}</span>
              <div>
                <strong>{s.to ? <Link to={s.to}>{s.title}</Link> : s.title}</strong> <span className={`tag ${s.ready ? 'tag-new' : ''}`}>{s.ready ? 'verfügbar' : `geplant (${s.stage})`}</span>
                <div className="small muted">{s.text}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>
      <div className="grid2">
        <Card title="Quelldateien je Format" actions={<Link className="btn small" to="/quellen"><Ico icon={FolderInputIcon} />Dateien einlesen</Link>}>
          {!d?.formats.length ? <Empty>Noch keine Quelldateien. Unter „Quellen“ Dateien hochladen.</Empty> : (
            <table className="table">
              <thead><tr><th>Format</th><th>Dateien</th><th>Chunks</th></tr></thead>
              <tbody>{d.formats.map((f: any) => <tr key={f.format}><td><FormatCell f={f.format} /></td><td>{f.documents}</td><td>{f.chunks}</td></tr>)}</tbody>
            </table>
          )}
        </Card>
        <Card title="Labels" actions={<Link className="btn small" to="/metadaten/labels"><Ico icon={TagsIcon} />Katalog</Link>}>
          <table className="table">
            <thead><tr><th>Gruppe</th><th>Labels</th></tr></thead>
            <tbody>{(d?.labelGroups ?? []).map((g: any) => <tr key={g.code}><td><RefIcon name={g.icon} /> {nameOf(g, lang)}</td><td>{g.labels}</td></tr>)}</tbody>
          </table>
        </Card>
      </div>
    </Page>
  );
}

// ---------------------------------------------------------------- Chunks

const PAGE_SIZE = 25;

export function MetadataChunksPage() {
  const { notify } = useApp();
  const { canEdit } = useMe();
  const [lang, setLang] = useLabelLang();
  const { labels, groups } = useLabels(true);
  const all = labels.data ?? [];
  const [q, setQ] = useState('');
  // Überschrift (M3): auch über den Link aus „Quellen je Überschrift“ (?heading=…)
  const [heading, setHeading] = useState(() => new URLSearchParams(window.location.search).get('heading') ?? '');
  const [format, setFormat] = useState('');
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const [unlabeled, setUnlabeled] = useState(false);
  const [noOutline, setNoOutline] = useState(false);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'table' | 'headings'>('headings');
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLabel, setBulkLabel] = useState('');
  const path = `/metadata/chunks${qs({ q: q.trim() || undefined, heading: heading.trim() || undefined, format, labels: filterLabels.join(',') || undefined, unlabeled: unlabeled || undefined, noOutline: noOutline || undefined, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })}`;
  const chunks = useLoad<{ total: number; items: any[] }>(path, [path]);
  const items = chunks.data?.items ?? [];
  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
    setSelected([]);
  };

  const change = async (snippetIds: string[], body: { add?: string[]; remove?: string[] }) => {
    try {
      const r = await post<{ added: number; removed: number }>('/metadata/chunks/labels', { snippetIds, ...body });
      notify(body.add ? `${r.added} Zuordnung(en) hinzugefügt.` : `${r.removed} Zuordnung(en) entfernt.`);
      chunks.reload();
      labels.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  // Ansicht „Je Überschrift“: Chunks dieser Seite nach Kapitel › Unterkapitel gruppiert, Quelldateien nebeneinander
  const byHeading = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const c of items) {
      const key = [c.chapter, c.subchapter].filter(Boolean).join(' › ') || '(ohne Überschrift)';
      m.set(key, [...(m.get(key) ?? []), c]);
    }
    return [...m.entries()];
  }, [items]);

  const allOnPage = items.length > 0 && items.every((c) => selected.includes(c.id));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const chunkLabels = (c: any) => c.labels.map((l: Label) => <LabelTag key={l.id} label={l} lang={lang} groups={groups} onRemove={canEdit ? () => change([c.id], { remove: [l.id] }) : undefined} />);
  // Gliederungs-Vorschlag (F-13): nur Vorschlag mit Trefferwert, übernommen wird von Hand
  const suggest = (c: any) => c.outlineSuggestions?.length > 0 && (
    <div className="md-suggest small">
      <span className="muted">Gliederung, Vorschlag:</span>
      {c.outlineSuggestions.map((s: any) => (
        <span key={s.labelId} className="md-suggest-item" title={`Treffer: ${s.matched.join(', ')}`}>
          {s.name} <span className="muted">({Math.round(s.score * 100)} %)</span>
          {canEdit && <button className="btn small" aria-label={`${s.name} für Chunk #${c.seq} übernehmen`} onClick={() => change([c.id], { add: [s.labelId] })}>Übernehmen</button>}
        </span>
      ))}
    </div>
  );
  // Teilstücke langer Chunks (ADR-087): für Suche und Antworten, der Chunk selbst bleibt unverändert
  const parts = (c: any) => c.parts?.length > 0 && (
    <details className="md-parts small">
      <summary>{c.chars} Zeichen – in {c.parts.length} Teilstücken für Suche und Antworten</summary>
      <ol>{c.parts.map((p: any) => <li key={p.no}>{p.overlap && <span className="muted">… {p.overlap} </span>}{p.text}</li>)}</ol>
    </details>
  );
  const addOne = (c: any) => canEdit && <LabelSelect labels={all} groups={groups} lang={lang} value="" exclude={c.labels.map((l: Label) => l.id)} ariaLabel={`Label für Chunk #${c.seq} hinzufügen`} placeholder="+ Label …" onChange={(id) => id && change([c.id], { add: [id] })} />;

  return (
    <Page title="Chunks" subtitle="Textabschnitte aller aktuellen Quelldateien – je Überschrift, mit Fundstelle und Labels" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <Card>
        <div className="filters">
          <label className="grow"><span className="sr-only">Suche im Text</span><input type="search" placeholder="Im Text suchen …" value={q} onChange={(e) => resetPage(setQ)(e.target.value)} aria-label="Im Text suchen" /></label>
          <label><span className="sr-only">Überschrift</span><input type="search" placeholder="Überschrift …" value={heading} onChange={(e) => resetPage(setHeading)(e.target.value)} aria-label="Nach Überschrift filtern" /></label>
          <select value={format} onChange={(e) => resetPage(setFormat)(e.target.value)} aria-label="Format">
            <option value="">Alle Formate</option>
            {Object.keys(FORMAT_LABEL).map((f) => <option key={f} value={f}>{formatText(f)}</option>)}
          </select>
          <label className="small"><input type="checkbox" checked={unlabeled} onChange={(e) => resetPage(setUnlabeled)(e.target.checked)} /> nur ohne Label</label>
          <label className="small"><input type="checkbox" checked={noOutline} onChange={(e) => resetPage(setNoOutline)(e.target.checked)} /> nur ohne Gliederungspunkt</label>
          <select value={view} onChange={(e) => setView(e.target.value as 'table' | 'headings')} aria-label="Ansicht">
            <option value="headings">Je Überschrift</option>
            <option value="table">Tabelle</option>
          </select>
        </div>
        <div className="filters">
          <span className="small muted">Mit allen Labels:</span>
          <LabelMulti labels={all} groups={groups} lang={lang} selected={filterLabels} onChange={resetPage(setFilterLabels)} ariaLabel="Nach Label filtern" />
        </div>
        {canEdit && (
          <div className="filters md-bulk" role="group" aria-label="Ausgewählte Chunks labeln">
            <span className="small"><strong>{selected.length}</strong> ausgewählt</span>
            <LabelSelect labels={all} groups={groups} lang={lang} value={bulkLabel} onChange={setBulkLabel} ariaLabel="Label für die Auswahl" />
            <button className="btn small primary" disabled={!selected.length || !bulkLabel} onClick={() => change(selected, { add: [bulkLabel] })}>Hinzufügen</button>
            <button className="btn small" disabled={!selected.length || !bulkLabel} onClick={() => change(selected, { remove: [bulkLabel] })}>Entfernen</button>
            {selected.length > 0 && <button className="btn small ghost" onClick={() => setSelected([])}>Auswahl aufheben</button>}
          </div>
        )}
      </Card>
      <Card title={`${chunks.data?.total ?? 0} Chunks`}>
        <ErrorBox error={chunks.error} />
        {!items.length ? <Empty>Keine Chunks gefunden. Quelldateien unter <Link to="/quellen">Quellen</Link> einlesen.</Empty> : view === 'table' ? (
          <table className="table">
            <thead><tr>
              {canEdit && <th><input type="checkbox" checked={allOnPage} aria-label="Alle auf dieser Seite auswählen" onChange={() => setSelected(allOnPage ? [] : items.map((c) => c.id))} /></th>}
              <th>#</th><th>Quelle</th><th>Überschrift</th><th>Text</th><th>Labels</th>
            </tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  {canEdit && <td><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} aria-label={`Chunk #${c.seq} auswählen`} /></td>}
                  <td>#{c.seq}</td>
                  <td className="small"><FormatCell f={c.format} /><br />{c.path}<br /><span className="muted">{locatorText(c)}</span></td>
                  <td className="small">{headingText(c)}</td>
                  <td className="md-text">{c.text}{parts(c)}</td>
                  <td>{chunkLabels(c)}{addOne(c)}{suggest(c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          byHeading.map(([heading, list]) => (
            <section key={heading} className="md-heading-group">
              <h3>{heading} <span className="muted small">({list.length})</span></h3>
              {list.map((c) => (
                <article key={c.id} className="md-chunk">
                  <div className="md-chunk-head small">
                    {canEdit && <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} aria-label={`Chunk #${c.seq} auswählen`} />}
                    <strong>#{c.seq}</strong> <FormatCell f={c.format} /> · {c.path} · <span className="muted">{locatorText(c)}</span>
                    {c.headingPath.length > 0 && <span className="muted"> · {c.headingPath.join(' › ')}</span>}
                  </div>
                  <p className="md-text">{c.text}</p>
                  {parts(c)}
                  <div>{chunkLabels(c)}{addOne(c)}</div>
                  {suggest(c)}
                </article>
              ))}
            </section>
          ))
        )}
        <div className="pager">
          <button className="btn ghost" disabled={page <= 1} onClick={() => { setPage(page - 1); setSelected([]); }} aria-label="Vorherige Seite">‹</button>
          <span>Seite {page} von {Math.max(1, Math.ceil((chunks.data?.total ?? 0) / PAGE_SIZE))}</span>
          <button className="btn ghost" disabled={page * PAGE_SIZE >= (chunks.data?.total ?? 0)} onClick={() => { setPage(page + 1); setSelected([]); }} aria-label="Nächste Seite">›</button>
        </div>
      </Card>
    </Page>
  );
}

// ---------------------------------------------------------------- Fragen und Antworten

const EMPTY_QA = { question: '', answer: '', language: 'de' as Lang, note: '', labelIds: [] as string[], sources: [] as any[], filters: null as any, askId: null as string | null };

// ---------------------------------------------------------------- Fragen über alle Quellen (M5, ADR-089)

const DIFF_PART = (o: { op: string; text: string }, i: number) => (o.op === '=' ? <span key={i}>{o.text}</span> : o.op === '-' ? <del key={i}>{o.text}</del> : <ins key={i}>{o.text}</ins>);

/** Antwort mit Belegnummern und den Belegen darunter */
function AskResult({ r }: { r: any }) {
  return (
    <div className="ask-result" role="region" aria-label="Antwort mit Belegen">
      {r.notice && <p className="alert small">{r.notice}</p>}
      {r.answer.length > 0 && (
        <p className="md-text">
          {r.answer.map((s: any, i: number) => <span key={i}><InlineMd text={s.text} />{s.sources.map((n: number) => <sup key={n}><a href={`#beleg-${r.id}-${n}`} aria-label={`Beleg ${n}`}>[{n}]</a></sup>)} </span>)}
        </p>
      )}
      <p className="small muted">{r.mode === 'llm' ? 'Antwort aus den Belegen formuliert, jeder Satz geprüft' : r.mode === 'extractive' ? 'Passende Sätze aus den Belegen (ohne KI)' : ''}{r.dropped ? ` · ${r.dropped} unbelegte Sätze verworfen` : ''} · {r.searched} Abschnitte durchsucht
        {r.retrieval?.expansions?.length > 0 && <> · Abfrage erweitert um {r.retrieval.expansions.map((x: string) => `„${x}“`).join(', ')} (Terminologie, Abkürzungen)</>}
        {r.retrieval?.unknownTerms?.length > 0 && <> · in den Quellen nicht gefunden: {r.retrieval.unknownTerms.join(', ')}</>}</p>
      {r.sources.map((s: any) => (
        <blockquote key={s.n} id={`beleg-${r.id}-${s.n}`} className="md-excerpt small">
          <strong>[{s.n}] {s.path}</strong> · {s.headingPath.join(' › ') || '–'} · <span className="muted">{locatorText(s)}{s.part ? ` · Teilstück ${s.part} von ${s.parts}` : ''}</span>
          <div><InlineMd text={s.text} /></div>
        </blockquote>
      ))}
    </div>
  );
}

function AskCard({ canEdit, onTake }: { canEdit: boolean; onTake: (r: any) => void }) {
  const { notify } = useApp();
  const docs = useLoad<any[]>('/metadata/headings/documents');
  const { labels, groups } = useLabels(false);
  const [lang] = useLabelLang();
  const [question, setQuestion] = useState('');
  const [format, setFormat] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [heading, setHeading] = useState('');
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const ask = async () => {
    setBusy(true);
    try {
      setResult(await post('/metadata/ask', { question, filters: { ...(format ? { format } : {}), ...(documentId ? { documentId } : {}), ...(heading.trim() ? { heading: heading.trim() } : {}), ...(labelIds.length ? { labelIds } : {}) } }));
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card title="Frage an alle Quellen">
      <label className="block">Ihre Frage <textarea rows={2} value={question} maxLength={500} onChange={(e) => setQuestion(e.target.value)} placeholder="z. B. Wie kündige ich einen Vertrag?" /></label>
      <div className="filters" role="group" aria-label="Quellen eingrenzen">
        <select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Nur Format">
          <option value="">alle Formate</option>
          {['markdown', 'html', 'docx', 'pptx', 'pdf', 'mp4', 'subtitles', 'jira'].map((f) => <option key={f} value={f}>{formatText(f)}</option>)}
        </select>
        <select value={documentId} onChange={(e) => setDocumentId(e.target.value)} aria-label="Nur Datei">
          <option value="">alle Dateien</option>
          {(docs.data ?? []).map((d) => <option key={d.documentId} value={d.documentId}>{d.path}</option>)}
        </select>
        <label><span className="sr-only">Nur unter Überschrift</span><input type="search" value={heading} placeholder="Überschrift …" aria-label="Nur unter Überschrift" onChange={(e) => setHeading(e.target.value)} /></label>
        <LabelMulti labels={labels.data ?? []} groups={groups} lang={lang} selected={labelIds} onChange={setLabelIds} ariaLabel="Nur Chunks mit Label" />
      </div>
      <div className="row-actions">
        <button className="btn primary" disabled={busy || question.trim().length < 3} onClick={() => void ask()}>{busy ? 'Suche …' : 'Fragen'}</button>
        {result && canEdit && result.answer.length > 0 && <button className="btn" onClick={() => onTake(result)}>Als Frage & Antwort übernehmen</button>}
      </div>
      {result && <AskResult r={result} />}
    </Card>
  );
}

export function MetadataQaPage() {
  const { notify } = useApp();
  const { canEdit } = useMe();
  const [lang, setLang] = useLabelLang();
  const { labels, groups } = useLabels(true);
  const all = labels.data ?? [];
  const [q, setQ] = useState('');
  const [language, setLanguage] = useState('');
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const path = `/metadata/qa${qs({ q: q.trim() || undefined, language, labels: filterLabels.join(',') || undefined })}`;
  const list = useLoad<any[]>(path, [path]);
  const [form, setForm] = useState(EMPTY_QA);
  const [editId, setEditId] = useState<string | null>(null);
  const [sourceQ, setSourceQ] = useState('');
  const found = useLoad<{ items: any[] }>(sourceQ.trim().length >= 2 ? `/metadata/chunks${qs({ q: sourceQ.trim(), limit: 8 })}` : null, [sourceQ]);
  const [open, setOpen] = useState<string | null>(null);
  const [reask, setReask] = useState<Record<string, any>>({});
  const runReask = async (id: string) => {
    try {
      const r = await post(`/metadata/qa/${id}/reask`, {});
      setReask({ ...reask, [id]: r });
      setOpen(id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const take = (r: any) => {
    setEditId(null);
    setForm({ ...EMPTY_QA, question: r.question, answer: r.answerText, sources: r.sources.map((s: any) => ({ ...s, id: s.snippetId })), filters: r.filters, askId: r.id });
    notify('Antwort übernommen – Labels ergänzen und speichern.');
  };

  const save = async () => {
    const body = { question: form.question, answer: form.answer, language: form.language, note: form.note || null, labelIds: form.labelIds, snippetIds: form.sources.map((s) => s.snippetId ?? s.id), ...(editId ? {} : { filters: form.filters ?? undefined, askId: form.askId ?? undefined }) };
    try {
      if (editId) await patch(`/metadata/qa/${editId}`, body);
      else await post('/metadata/qa', body);
      notify(editId ? 'Frage und Antwort gespeichert.' : 'Frage und Antwort angelegt.');
      setForm(EMPTY_QA);
      setEditId(null);
      setSourceQ('');
      list.reload();
      labels.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const remove = async (id: string) => {
    if (!window.confirm('Frage und Antwort löschen?')) return;
    try {
      await del(`/metadata/qa/${id}`);
      notify('Gelöscht.');
      list.reload();
      labels.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const startEdit = (x: any) => {
    setEditId(x.id);
    setForm({ question: x.question, answer: x.answer, language: x.language, note: x.note ?? '', labelIds: x.labels.map((l: Label) => l.id), sources: x.sources, filters: x.filters, askId: x.askId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Page title="Fragen & Antworten" subtitle="Fragen an alle Quellen mit Belegen, Antworten mit Quelldatei, Fundstelle und Auszug speichern und mit Labels ordnen" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <AskCard canEdit={canEdit} onTake={take} />
      {canEdit && (
        <Card title={editId ? 'Frage und Antwort bearbeiten' : 'Frage und Antwort speichern'}>
          {form.askId && <p className="small muted">Aus der Frage an alle Quellen übernommen – der Rahmen der Frage wird für „Erneut fragen“ mitgespeichert.</p>}
          <label className="block">Frage <textarea rows={2} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} aria-label="Frage" /></label>
          <label className="block">Antwort <textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} aria-label="Antwort" /></label>
          <div className="filters">
            <label className="small">Sprache{' '}
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as Lang })} aria-label="Sprache der Antwort">
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
              </select>
            </label>
            <span className="small muted">Labels:</span>
            <LabelMulti labels={all} groups={groups} lang={lang} selected={form.labelIds} onChange={(ids) => setForm({ ...form, labelIds: ids })} ariaLabel="Label zur Antwort hinzufügen" />
          </div>
          <fieldset className="md-sources">
            <legend className="small">Quellen ({form.sources.length})</legend>
            {form.sources.map((s, i) => (
              <div key={s.snippetId ?? s.id} className="md-source small">
                <strong>[{i + 1}]</strong> {s.path} · {headingText(s)} · <span className="muted">{locatorText(s)}</span>
                <button type="button" className="btn small ghost" aria-label={`Quelle ${i + 1} entfernen`} onClick={() => setForm({ ...form, sources: form.sources.filter((_, j) => j !== i) })}>×</button>
              </div>
            ))}
            <input type="search" placeholder="Chunk suchen und als Quelle hinzufügen …" value={sourceQ} onChange={(e) => setSourceQ(e.target.value)} aria-label="Chunk als Quelle suchen" />
            {sourceQ.trim().length >= 2 && (
              <ul className="md-found">
                {(found.data?.items ?? []).filter((c) => !form.sources.some((s) => (s.snippetId ?? s.id) === c.id)).map((c) => (
                  <li key={c.id}>
                    <button type="button" className="btn small" onClick={() => setForm({ ...form, sources: [...form.sources, c] })}>+ #{c.seq}</button>{' '}
                    <span className="small">{c.path} · {headingText(c)} – {c.text.slice(0, 120)}{c.text.length > 120 ? ' …' : ''}</span>
                  </li>
                ))}
                {found.data && !found.data.items.length && <li className="small muted">Kein Chunk gefunden.</li>}
              </ul>
            )}
          </fieldset>
          <label className="block">Notiz (optional) <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} aria-label="Notiz" /></label>
          <button className="btn primary" disabled={!form.question.trim() || !form.answer.trim()} onClick={save}>{editId ? 'Speichern' : 'Anlegen'}</button>
          {editId && <button className="btn" onClick={() => { setEditId(null); setForm(EMPTY_QA); }}>Abbrechen</button>}
        </Card>
      )}
      <Card title={`Gespeichert (${list.data?.length ?? 0})`} actions={<span className="row-actions">
        {(['csv', 'xlsx', 'json'] as const).map((f) => <DownloadButton key={f} className="btn small" href={`/api/v1/metadata/qa/export${qs({ format: f, q: q.trim() || undefined, language, labels: filterLabels.join(',') || undefined })}`} name={`fragen-antworten.${f}`}>⬇ {f.toUpperCase()}</DownloadButton>)}
      </span>}>
        <div className="filters">
          <label className="grow"><span className="sr-only">Suche in Fragen und Antworten</span><input type="search" placeholder="In Fragen und Antworten suchen …" value={q} onChange={(e) => setQ(e.target.value)} aria-label="In Fragen und Antworten suchen" /></label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Sprache filtern">
            <option value="">Alle Sprachen</option>
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
          </select>
          <LabelMulti labels={all} groups={groups} lang={lang} selected={filterLabels} onChange={setFilterLabels} ariaLabel="Nach Label filtern" />
        </div>
        <ErrorBox error={list.error} />
        {!list.data?.length ? <Empty>Noch keine gespeicherten Fragen.</Empty> : (
          <table className="table">
            <thead><tr><th>Frage</th><th>Sprache</th><th>Labels</th><th>Quellen</th><th>Gespeichert</th><th /></tr></thead>
            <tbody>
              {list.data.map((x) => (
                <Fragment key={x.id}>
                  <tr>
                    <td>
                      <button type="button" className="linklike" aria-expanded={open === x.id} onClick={() => setOpen(open === x.id ? null : x.id)}>{open === x.id ? '▾' : '▸'} {x.question}</button>
                    </td>
                    <td>{x.language.toUpperCase()}</td>
                    <td>{x.labels.map((l: Label) => <LabelTag key={l.id} label={l} lang={lang} groups={groups} />)}</td>
                    <td>{x.sources.length}</td>
                    <td className="small">{x.updatedBy}, {new Date(x.updatedAt).toLocaleString('de-DE')}</td>
                    <td className="row-actions">
                      <button className="btn small" onClick={() => void runReask(x.id)}>Erneut fragen</button>
                      {canEdit && <button className="btn small" onClick={() => startEdit(x)}>Bearbeiten</button>}
                      {canEdit && <button className="btn small danger" onClick={() => remove(x.id)}>Löschen</button>}
                    </td>
                  </tr>
                  {open === x.id && (
                    <tr className="md-detail">
                      <td colSpan={6}>
                        <p className="md-text">{x.answer}</p>
                        {x.note && <p className="small muted">Notiz: {x.note}</p>}
                        {reask[x.id] && (
                          <section className="ask-compare" aria-label="Vergleich mit dem neuen Stand">
                            <h4>Neuer Stand vom {new Date().toLocaleString('de-DE')}</h4>
                            <p className="small">{reask[x.id].changes.answerChanged ? 'Antwort geändert' : 'Antwort unverändert'} · Belege: {reask[x.id].changes.sourcesAdded.length} neu, {reask[x.id].changes.sourcesRemoved.length} entfallen, {reask[x.id].changes.sourcesKept.length} gleich</p>
                            {reask[x.id].changes.answerChanged && <p className="md-text small dp-diff">{reask[x.id].changes.diff.map(DIFF_PART)}</p>}
                            <AskResult r={reask[x.id].current} />
                          </section>
                        )}
                        {x.sources.map((s: any, i: number) => (
                          <blockquote key={s.snippetId} className="md-excerpt small">
                            <strong>[{i + 1}] {s.path}</strong> · {s.headingPath.join(' › ') || '–'} · <span className="muted">{locatorText(s)}</span>
                            <div>{s.excerpt}</div>
                          </blockquote>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Page>
  );
}

// ---------------------------------------------------------------- Labelkatalog

export function MetadataLabelsPage() {
  const { notify } = useApp();
  const { isAdmin } = useMe();
  const [lang, setLang] = useLabelLang();
  const [showArchived, setShowArchived] = useState(false);
  const { labels, groups } = useLabels(showArchived);
  const [edit, setEdit] = useState<{ id: string; nameDe: string; nameEn: string; description: string } | null>(null);
  const [form, setForm] = useState({ group: 'navigation', code: '', nameDe: '', nameEn: '' });
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      labels.reload();
      return true;
    } catch (e) {
      notify(errorText(e), 'error');
      return false;
    }
  };

  return (
    <Page title="Labels" subtitle="100 vordefinierte Labels in sechs Gruppen, Deutsch und Englisch – Pflege durch die Administration" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={labels.error} />
      {isAdmin && (
        <Card title="Label ergänzen">
          <div className="filters">
            <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} aria-label="Gruppe">
              {groups.map((g) => <option key={g.code} value={g.code}>{g.nameDe}</option>)}
            </select>
            <input placeholder="Code, z. B. nav.orders" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} aria-label="Code" />
            <input placeholder="Name (Deutsch)" value={form.nameDe} onChange={(e) => setForm({ ...form, nameDe: e.target.value })} aria-label="Name Deutsch" />
            <input placeholder="Name (Englisch)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} aria-label="Name Englisch" />
            <button className="btn primary" disabled={!form.code.trim() || !form.nameDe.trim() || !form.nameEn.trim()}
              onClick={async () => (await run(() => post('/metadata/labels', form), `Label „${form.nameDe}“ angelegt.`)) && setForm({ ...form, code: '', nameDe: '', nameEn: '' })}>
              Anlegen
            </button>
          </div>
        </Card>
      )}
      <label className="small md-archived-toggle"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> ausgeblendete anzeigen</label>
      {groups.map((g) => {
        const rows = (labels.data ?? []).filter((l) => l.group === g.code);
        return (
          <Card key={g.code} title={<><RefIcon name={g.icon} /> {nameOf(g, lang)} <span className="muted small">({rows.length})</span></>}>
            <table className="table">
              <thead><tr><th>Deutsch</th><th>Englisch</th><th>Code</th><th>Chunks</th><th>Antworten</th>{isAdmin && <th />}</tr></thead>
              <tbody>
                {rows.map((l) => edit?.id === l.id ? (
                  <tr key={l.id}>
                    <td><input value={edit.nameDe} onChange={(e) => setEdit({ ...edit, nameDe: e.target.value })} aria-label="Name Deutsch bearbeiten" /></td>
                    <td><input value={edit.nameEn} onChange={(e) => setEdit({ ...edit, nameEn: e.target.value })} aria-label="Name Englisch bearbeiten" /></td>
                    <td colSpan={3}><input value={edit.description} placeholder="Beschreibung (optional)" onChange={(e) => setEdit({ ...edit, description: e.target.value })} aria-label="Beschreibung bearbeiten" /></td>
                    <td className="row-actions">
                      <button className="btn small primary" onClick={async () => (await run(() => patch(`/metadata/labels/${l.id}`, { nameDe: edit.nameDe, nameEn: edit.nameEn, description: edit.description || null }), 'Label gespeichert.')) && setEdit(null)}>Speichern</button>
                      <button className="btn small" onClick={() => setEdit(null)}>Abbrechen</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={l.id} className={l.archived ? 'muted' : ''}>
                    <td style={{ borderLeft: `4px solid ${g.color}` }}>{l.nameDe}{l.archived && <span className="tag small">ausgeblendet</span>}{l.origin === 'custom' && <span className="tag small">eigenes</span>}{l.description && <div className="small muted">{l.description}</div>}</td>
                    <td>{l.nameEn}</td>
                    <td><code className="small">{l.code}</code></td>
                    <td>{l.chunkCount}</td>
                    <td>{l.qaCount}</td>
                    {isAdmin && (
                      <td className="row-actions">
                        <button className="btn small" onClick={() => setEdit({ id: l.id, nameDe: l.nameDe, nameEn: l.nameEn, description: l.description ?? '' })}>Bearbeiten</button>
                        <button className="btn small" onClick={() => run(() => patch(`/metadata/labels/${l.id}`, { archived: !l.archived }), l.archived ? 'Label eingeblendet.' : 'Label ausgeblendet.')}>{l.archived ? 'Einblenden' : 'Ausblenden'}</button>
                        <button className="btn small danger" aria-label={`Label „${l.nameDe}“ löschen`} onClick={() => {
                          if (window.confirm(`Label „${l.nameDe}“ löschen? Es wird von ${l.chunkCount ?? 0} Chunks und ${l.qaCount ?? 0} Fragen entfernt.`)) void run(() => del(`/metadata/labels/${l.id}`), `Label „${l.nameDe}“ gelöscht.`);
                        }}>Löschen</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );
      })}
    </Page>
  );
}

// ---------------------------------------------------------------- Zugriffsmatrix (ADR-081, F-06)

const LEVEL_TEXT: Record<string, string> = { V: 'V – nutzt/bearbeitet', L: 'L – liest', '-': '– kein Zugriff', '?': '? offen' };

export function AccessMatrixPage() {
  const { notify } = useApp();
  const { canEdit } = useMe();
  const [lang, setLang] = useLabelLang();
  const m = useLoad<any>('/metadata/access-matrix');
  const [sel, setSel] = useState<{ roleId: string; navId: string } | null>(null);
  const [evidence, setEvidence] = useState('');
  const [csv, setCsv] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const cell = (roleId: string, navId: string) => m.data?.cells.find((c: any) => c.roleId === roleId && c.navId === navId);
  const save = async (roleId: string, navId: string, level: string, ev?: string | null) => {
    try {
      m.setData(await put('/metadata/access-matrix/cells', { roleId, navId, level, evidence: ev !== undefined ? ev : cell(roleId, navId)?.evidence ?? null }));
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const choose = (roleId: string, navId: string) => {
    setSel({ roleId, navId });
    setEvidence(cell(roleId, navId)?.evidence ?? '');
  };
  const d = m.data;
  const selRole = d?.roles.find((r: any) => r.id === sel?.roleId);
  const selNav = d?.navigation.find((n: any) => n.id === sel?.navId);
  return (
    <Page title="Zugriffsmatrix" subtitle="Welche Rolle nutzt welchen Menüpunkt in oneSCM – mit Beleg je Eintrag" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={m.error} />
      {d && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Felder</span><strong>{d.summary.cells}</strong></div>
          <div className="stat"><span className="muted small">V / L</span><strong>{d.summary.V} / {d.summary.L}</strong></div>
          <div className="stat"><span className="muted small">kein Zugriff</span><strong>{d.summary.none}</strong></div>
          <div className="stat"><span className="muted small">offen</span><strong>{d.summary.open}</strong></div>
        </div>
      )}
      <Card title="Matrix" actions={<DownloadButton href="/api/v1/metadata/access-matrix/export" name="zugriffsmatrix.csv" className="btn small">CSV exportieren</DownloadButton>}>
        <p className="small muted">V = nutzt/bearbeitet · L = liest · – = kein Zugriff · ? = offen (Beleg fehlt). {canEdit ? 'Feld anklicken, Stufe wählen, Beleg darunter eintragen.' : ''}</p>
        {!d?.navigation.length ? <Empty>Keine Menüpunkte im Labelkatalog.</Empty> : (
          <div className="am-wrap">
            <table className="table am-table">
              <thead><tr><th scope="col">Menüpunkt</th>{d.roles.map((r: any) => <th key={r.id} scope="col" className="am-role">{nameOf(r, lang)}</th>)}</tr></thead>
              <tbody>
                {d.navigation.map((n: any) => (
                  <tr key={n.id}>
                    <th scope="row" className="small">{nameOf(n, lang)}</th>
                    {d.roles.map((r: any) => {
                      const c = cell(r.id, n.id);
                      const lv = c?.level ?? '?';
                      const active = sel?.roleId === r.id && sel?.navId === n.id;
                      return (
                        <td key={r.id} className={`am-cell am-${lv === '-' ? 'none' : lv === '?' ? 'open' : lv}${active ? ' am-active' : ''}`} title={c?.evidence ? `Beleg: ${c.evidence}` : 'ohne Beleg'}>
                          {canEdit ? (
                            <select value={lv} aria-label={`${nameOf(n, lang)} – ${nameOf(r, lang)}`} onFocus={() => choose(r.id, n.id)} onChange={(e) => save(r.id, n.id, e.target.value)}>
                              {Object.keys(LEVEL_TEXT).map((k) => <option key={k} value={k}>{k === '-' ? '–' : k}</option>)}
                            </select>
                          ) : <span>{lv === '-' ? '–' : lv}</span>}
                          {c?.evidence && <span className="am-dot" aria-hidden="true">•</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {canEdit && sel && selRole && selNav && (
          <div className="filters am-evidence">
            <span className="small"><strong>{nameOf(selNav, lang)}</strong> · {nameOf(selRole, lang)}: {LEVEL_TEXT[cell(sel.roleId, sel.navId)?.level ?? '?']}</span>
            <label className="grow"><span className="sr-only">Beleg</span><input value={evidence} placeholder="Beleg, z. B. Navigation_oneSCM_Version3.docx, S. 4" aria-label="Beleg für das gewählte Feld" onChange={(e) => setEvidence(e.target.value)} /></label>
            <button className="btn small primary" onClick={async () => { await save(sel.roleId, sel.navId, cell(sel.roleId, sel.navId)?.level ?? '?', evidence); notify('Beleg gespeichert.'); }}>Beleg speichern</button>
          </div>
        )}
      </Card>
      {canEdit && (
        <Card title="Aus CSV übernehmen">
          <p className="small muted">Erste Spalte: Menüpunkt (Code, englischer UI-Begriff oder deutscher Name). Weitere Spalten: je Rolle (Code oder Name) V, L, – oder ?. Optional Spalte „Beleg“. Leere Felder bleiben unverändert. Trennzeichen Komma oder Semikolon.</p>
          <label className="block">CSV-Datei <input type="file" accept=".csv,text/csv" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()); }} /></label>
          <label className="block">oder Inhalt einfügen <textarea id="am-csv" rows={4} value={csv} onChange={(e) => setCsv(e.target.value)} aria-label="CSV-Inhalt" /></label>
          <button className="btn primary" disabled={!csv.trim()} onClick={async () => {
            try {
              const r = await post('/metadata/access-matrix/import', { csv });
              setResult(r);
              notify(`${r.written} Felder übernommen.`);
              m.reload();
            } catch (e) {
              notify(errorText(e), 'error');
            }
          }}>Übernehmen</button>
          {result && (
            <ul className="small">
              <li>{result.written} Felder übernommen</li>
              {result.unknownNavigation.length > 0 && <li>Unbekannte Menüpunkte: {result.unknownNavigation.join(', ')}</li>}
              {result.unknownRoles.length > 0 && <li>Unbekannte Rollen: {result.unknownRoles.join(', ')}</li>}
              {result.errors.map((x: string) => <li key={x}>{x}</li>)}
            </ul>
          )}
        </Card>
      )}
    </Page>
  );
}

// Zuordnung Domäne → Gliederungspunkt → Ordner (ADR-082)
export function DomainMapPage() {
  const { notify } = useApp();
  const { canEdit } = useMe();
  const [lang, setLang] = useLabelLang();
  const [outlineId, setOutlineId] = useState('');
  const outlines = useLoad<{ items: any[] }>('/outlines');
  const m = useLoad<any>(`/metadata/domain-map${qs({ outlineId: outlineId || undefined })}`);
  const [add, setAdd] = useState<Record<string, string>>({});
  const link = async (domainId: string, targetId: string, linked: boolean, msg: string) => {
    try {
      await put('/metadata/domain-map/links', { domainId, targetId, linked });
      notify(msg);
      m.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const d = m.data;
  const origin = (t: any) => (t.suggested ? <span className="tag sev-low" title="Chunks tragen beide Labels">Vorschlag · {t.chunks} Chunks</span>
    : <span className="tag">{t.origin === 'catalog' ? 'Katalog' : 'manuell'}{t.chunks ? ` · ${t.chunks} Chunks` : ''}</span>);
  const free = (domain: any) => [...(d?.outline ?? []), ...(d?.navigation ?? [])]
    .filter((t: any) => ![...domain.outline, ...domain.navigation].some((x: any) => x.id === t.id && x.linked));
  return (
    <Page title="Zuordnung" subtitle="Welche Fachdomäne gehört zu welchem Gliederungspunkt, Menüpunkt und Ordner im Arbeitsordner" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={m.error ?? outlines.error} />
      {d && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Domänen</span><strong>{d.summary.domains}</strong></div>
          <div className="stat"><span className="muted small">Zuordnungen</span><strong>{d.summary.links}</strong></div>
          <div className="stat"><span className="muted small">Vorschläge aus Chunks</span><strong>{d.summary.suggestions}</strong></div>
          <div className="stat"><span className="muted small">Gliederungspunkte ohne Domäne</span><strong>{d.withoutDomain.length}</strong></div>
        </div>
      )}
      <Card title="Ordnerbasis" actions={<DownloadButton href={`/api/v1/metadata/domain-map/export${qs({ outlineId: outlineId || undefined })}`} name="zuordnung-domaene-ordner.csv" className="btn small">CSV exportieren</DownloadButton>}>
        <div className="filters">
          <label>Unterordner aus Gliederung
            <select value={outlineId} onChange={(e) => setOutlineId(e.target.value)}>
              <option value="">– nur Kapitelordner –</option>
              {(outlines.data?.items ?? []).filter((o: any) => o.latest).map((o: any) => <option key={o.id} value={o.id}>{o.name} (v{o.versionNo})</option>)}
            </select>
          </label>
        </div>
        <p className="small muted">
          Kapitelordner wie im Arbeitsordner (<code>02_Kapitel/…</code>, Werkzeug <code>handbuch_struktur.py</code>). Unterordner erscheinen, wenn Sie eine Gliederung der App wählen, deren Kapitel
          die Titel der Gesamtgliederung tragen (Stammdaten › Inhaltsverzeichnis).
          {d?.subfolderSource && <> Gewählt: <strong>{d.subfolderSource.name}</strong> – {d.subfolderSource.matched} von {d.subfolderSource.chapters} Kapiteln zugeordnet.</>}
        </p>
      </Card>
      <div className="dm-grid">
        {(d?.domains ?? []).map((dom: any) => (
          <Card key={dom.id} title={<><Ico icon={PuzzleIcon} />{nameOf(dom, lang)}</>}>
            <section aria-label={`Gliederungspunkte zu ${nameOf(dom, lang)}`}>
              <h3 className="small muted">Gliederungspunkte und Ordner</h3>
              {!dom.outline.length ? <Empty>Noch kein Gliederungspunkt zugeordnet.</Empty> : (
                <ul className="dm-list">
                  {dom.outline.map((o: any) => (
                    <li key={o.id} className={o.suggested ? 'dm-suggested' : ''}>
                      <div className="dm-head"><strong>{nameOf(o, lang)}</strong> {origin(o)}
                        {canEdit && (o.suggested
                          ? <button className="btn small" onClick={() => link(dom.id, o.id, true, 'Vorschlag übernommen.')}>Übernehmen</button>
                          : <button className="btn small ghost" aria-label={`${nameOf(o, lang)} von ${nameOf(dom, lang)} lösen`} onClick={() => link(dom.id, o.id, false, 'Zuordnung entfernt.')}>Lösen</button>)}
                      </div>
                      <code className="dm-path"><Ico icon={FolderIcon} />{o.folder}</code>
                      {o.subfolders?.length ? (
                        <ul className="dm-sub small">{o.subfolders.map((s: any) => <li key={s.folder}><code><Ico icon={FolderOpenIcon} />{s.folder.split('/').pop()}</code></li>)}</ul>
                      ) : o.subfolders ? <div className="small muted">keine Unterkapitel in der gewählten Gliederung</div> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section aria-label={`Menüpunkte zu ${nameOf(dom, lang)}`}>
              <h3 className="small muted">Menüpunkte</h3>
              <div className="dm-tags">
                {dom.navigation.map((n: any) => (
                  <span key={n.id} className={`tag ${n.suggested ? 'sev-low' : ''}`} title={n.suggested ? `Vorschlag aus ${n.chunks} Chunks` : n.origin === 'catalog' ? 'Katalog' : 'manuell'}>
                    <Ico icon={CompassIcon} />{nameOf(n, lang)}
                    {canEdit && (n.suggested
                      ? <button className="dm-x" aria-label={`${nameOf(n, lang)} übernehmen`} onClick={() => link(dom.id, n.id, true, 'Vorschlag übernommen.')}>＋</button>
                      : <button className="dm-x" aria-label={`${nameOf(n, lang)} von ${nameOf(dom, lang)} lösen`} onClick={() => link(dom.id, n.id, false, 'Zuordnung entfernt.')}>×</button>)}
                  </span>
                ))}
                {!dom.navigation.length && <span className="small muted">keine</span>}
              </div>
            </section>
            {canEdit && (
              <div className="filters">
                <label className="grow"><span className="sr-only">Zuordnen</span>
                  <select value={add[dom.id] ?? ''} aria-label={`Gliederungs- oder Menüpunkt für ${nameOf(dom, lang)}`} onChange={(e) => setAdd({ ...add, [dom.id]: e.target.value })}>
                    <option value="">Gliederungs- oder Menüpunkt wählen …</option>
                    <optgroup label="Gliederung">{free(dom).filter((t: any) => t.code.startsWith('outline.')).map((t: any) => <option key={t.id} value={t.id}>{nameOf(t, lang)}</option>)}</optgroup>
                    <optgroup label="Navigation">{free(dom).filter((t: any) => t.code.startsWith('nav.')).map((t: any) => <option key={t.id} value={t.id}>{nameOf(t, lang)}</option>)}</optgroup>
                  </select>
                </label>
                <button className="btn small primary" aria-label={`Zuordnen zu ${nameOf(dom, lang)}`} disabled={!add[dom.id]} onClick={async () => { await link(dom.id, add[dom.id], true, 'Zugeordnet.'); setAdd({ ...add, [dom.id]: '' }); }}>Zuordnen</button>
              </div>
            )}
          </Card>
        ))}
      </div>
      {d && (
        <Card title="Gliederungspunkte ohne Domäne">
          <p className="small muted">Querschnittskapitel wie Einführung, Rollout oder Anhänge brauchen nicht unbedingt eine Fachdomäne.</p>
          <div className="dm-tags">
            {d.outline.filter((o: any) => d.withoutDomain.includes(o.id)).map((o: any) => <span key={o.id} className="tag" title={o.folder}><Ico icon={FolderTreeIcon} size={14} />{nameOf(o, lang)}</span>)}
          </div>
        </Card>
      )}
      {d && (
        <Card title="Ordner im Arbeitsordner">
          <div className="su-grid">
            <div>
              <h3 className="small muted">Je Kapitel (und Unterkapitel)</h3>
              <ul className="small">{d.workFolders.map((f: string) => <li key={f}><code>{f}</code></li>)}</ul>
            </div>
            <div>
              <h3 className="small muted">Hauptordner zur Steuerung</h3>
              <ul className="small">{d.controlFolders.map((f: any) => <li key={f.folder}><code>{f.folder}</code> – {f.description}</li>)}</ul>
            </div>
          </div>
        </Card>
      )}
    </Page>
  );
}
