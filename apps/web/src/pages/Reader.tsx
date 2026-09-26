// Leseransicht (ADR-054): das Handbuch so lesen, wie Endnutzer es sehen – Inhaltsverzeichnis, Schritte zum Abhaken,
// Hinweise hervorgehoben – und je Kapitel „War das hilfreich?“ beantworten.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, currentProjectId, get, mediaUrl, post } from '../api';
import { GlossText, GlossaryProvider, type GlossaryEntry } from '../components/Glossary';
import { Card, Empty, ErrorBox, Md, Page, errorText, preloadMarkdown, useApp, useLoad } from '../components/ui';
import { matches } from './FilteredView';

const CALLOUT: Record<string, { icon: string; label: string }> = {
  tip: { icon: '💡', label: 'Tipp' },
  warning: { icon: '⚠️', label: 'Achtung' },
  note: { icon: 'ℹ️', label: 'Hinweis' },
};
// Verwaltungsabschnitt und Lückenhinweise gehören nicht in die Leseransicht
const HIDDEN_SECTIONS = new Set(['status']);

/** **fett** und `Code` innerhalb einer Zeile; Glossarbegriffe (ADR-066) beim ersten Vorkommen in `seen` markiert */
function inline(t: string, seen: Set<string>): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}><GlossText text={part.slice(2, -2)} seen={seen} /></strong>
      : part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : <GlossText key={i} text={part} seen={seen} />);
}

const storeKey = (versionId: string) => `onescm.reader.done.${versionId}`;
const readDone = (versionId: string): number[] => {
  try {
    return JSON.parse(localStorage.getItem(storeKey(versionId)) ?? '[]');
  } catch {
    return [];
  }
};

/** Nummerierte Schritte zum Abhaken (Stand je Browser gemerkt) */
function StepList({ versionId, blockId, text }: { versionId: string; blockId: string; text: string }) {
  // Zeilen vor dem ersten Schritt = Einleitung; Folgezeilen gehören zum vorangehenden Schritt
  const intro: string[] = [];
  const items: string[] = [];
  for (const l of text.split('\n')) {
    const m = l.match(/^\s*\d+[.)]\s+/);
    if (m) items.push(l.slice(m[0].length));
    else if (!l.trim()) continue;
    else if (items.length) items[items.length - 1] += ` ${l.trim()}`;
    else intro.push(l.trim());
  }
  const [done, setDone] = useState<number[]>(() => readDone(`${versionId}.${blockId}`));
  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i];
    setDone(next);
    try {
      localStorage.setItem(storeKey(`${versionId}.${blockId}`), JSON.stringify(next));
    } catch {
      /* ohne Speicher nur für diese Sitzung */
    }
  };
  if (!items.length) return <Md text={text} />;
  const seen = new Set<string>();
  return (
    <>
      {intro.length > 0 && <p>{inline(intro.join(' '), seen)}</p>}
      <ol className="reader-steps">
        {items.map((t, i) => (
          <li key={i} className={done.includes(i) ? 'done' : ''}>
            <label><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /> <span>{inline(t, seen)}</span></label>
          </li>
        ))}
      </ol>
      <p className="small muted no-print" aria-live="polite">{done.length} von {items.length} Schritten erledigt</p>
    </>
  );
}

/** „War das hilfreich?“ */
function Feedback({ chapterId, versionId }: { chapterId: string; versionId: string }) {
  const { notify } = useApp();
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  useEffect(() => {
    setHelpful(null);
    setComment('');
    setSent(false);
  }, [versionId]);
  const send = async (h: boolean, c?: string) => {
    try {
      await post(`/chapters/${chapterId}/feedback`, { helpful: h, versionId, comment: c?.trim() || undefined });
      setSent(true);
      notify('Danke für Ihre Rückmeldung.');
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  if (sent) return <p className="reader-feedback" role="status">✓ Danke für Ihre Rückmeldung{helpful === false ? ' – die Redaktion kümmert sich darum' : ''}.</p>;
  return (
    <section className="reader-feedback no-print" aria-labelledby="fb-q">
      <h2 id="fb-q">War dieses Kapitel hilfreich?</h2>
      <div className="row-actions">
        <button className="btn" aria-pressed={helpful === true} onClick={() => { setHelpful(true); void send(true); }}>👍 Ja</button>
        <button className="btn" aria-pressed={helpful === false} onClick={() => setHelpful(false)}>👎 Nein</button>
      </div>
      {helpful === false && (
        <div className="reader-feedback-form">
          <label className="block">Was hat gefehlt oder war unklar? (optional)
            <textarea rows={3} value={comment} maxLength={1000} onChange={(e) => setComment(e.target.value)} placeholder="z. B. Schritt 3 passt nicht zur aktuellen Maske" />
          </label>
          <button className="btn primary" onClick={() => void send(false, comment)}>Rückmeldung senden</button>
        </div>
      )}
    </section>
  );
}

/** Sichtbare Abschnitte: ohne Verwaltung und Lücken; mit Rolle nur allgemeine und passende Inhalte (wie Rollenansichten) */
export function readerSections(version: any, role?: string) {
  return version.sections.filter((s: any) => !HIDDEN_SECTIONS.has(s.code))
    .map((s: any) => ({ ...s, blocks: s.blocks.filter((b: any) => b.kind !== 'gap' && (!role || matches(b, [role], []))) }))
    .filter((s: any) => s.blocks.length);
}

/** Kapitelinhalt in Lesedarstellung (Leseransicht und Druckansicht) */
export function ChapterContent({ version, role }: { version: any; role?: string }) {
  return (
    <>
      {readerSections(version, role).map((s: any) => (
        <section key={s.code} className="reader-section">
          <h3>{s.title}</h3>
          {s.blocks.map((b: any) => {
            if (CALLOUT[b.kind]) return <div key={b.id} className={`callout ${b.kind}`}><strong><span aria-hidden="true">{CALLOUT[b.kind].icon}</span> {CALLOUT[b.kind].label}:</strong> <Md text={b.text} /></div>;
            if (s.code === 'steps' && b.kind === 'list') return <StepList key={b.id} versionId={version.id} blockId={b.id} text={b.text} />;
            return <Md key={b.id} text={b.text} />;
          })}
        </section>
      ))}
    </>
  );
}

/** Glossar für Leseransicht und Druck (Terminologie mit Definition und Abkürzungen) */
export const useReaderGlossary = (lang = 'de') => useLoad<GlossaryEntry[]>(`/reader/glossary${lang !== 'de' ? `?lang=${lang}` : ''}`, [lang]);

const LANG_KEY = 'onescm.reader.lang';
/** Lesesprache (ADR-071): aus ?lang=, sonst gemerkt je Browser; nur Sprachen des Projekts */
function useReaderLanguage() {
  const [params] = useSearchParams();
  const languages = useLoad<{ code: string; name: string; chapters: number | null }[]>('/reader/languages');
  const [lang, setLangState] = useState<string>(() => {
    try {
      return params.get('lang') ?? localStorage.getItem(LANG_KEY) ?? 'de';
    } catch {
      return params.get('lang') ?? 'de';
    }
  });
  useEffect(() => {
    if (languages.data && !languages.data.some((l) => l.code === lang)) setLangState('de');
  }, [languages.data, lang]);
  const setLang = (code: string) => {
    setLangState(code);
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {
      /* nur für diese Sitzung */
    }
  };
  const name = languages.data?.find((l) => l.code === lang)?.name ?? lang;
  return { lang, setLang, languages: languages.data ?? [], name };
}

/** Hinweis, wenn ein Kapitel (noch) nicht in der Lesesprache vorliegt */
function LanguageNote({ version, name }: { version: any; name: string }) {
  if (!version || version.requestedLanguage === 'de' || !version.requestedLanguage) return null;
  if (version.fallback === 'missing') return <p className="reader-lang-note" role="note">Dieses Kapitel ist noch nicht in {name} übersetzt – Sie lesen die deutsche Fassung.</p>;
  if (version.fallback === 'outdated') return <p className="reader-lang-note" role="note">Die {name}-Übersetzung gehört zu einer älteren Fassung – Sie lesen die aktuelle deutsche Fassung.</p>;
  if (version.untranslatedBlocks > 0) return <p className="reader-lang-note" role="note">{version.untranslatedBlocks === 1 ? '1 Absatz ist' : `${version.untranslatedBlocks} Absätze sind`} noch nicht übersetzt und erscheinen deutsch.</p>;
  return null;
}

const HIGHLIGHT = 'reader-search';
/**
 * Suchwörter im Kapitel hervorheben (CSS Custom Highlight API, ADR-066): keine DOM-Änderung, daher unabhängig von React;
 * Browser ohne Unterstützung zeigen das Kapitel ohne Markierung. Liefert die Zahl der Treffer.
 */
function useHighlight(root: React.RefObject<HTMLElement | null>, words: string[], key: string) {
  const [count, setCount] = useState(0);
  useLayoutEffect(() => {
    const reg = (window as any).CSS?.highlights;
    const HighlightCtor = (window as any).Highlight;
    if (!root.current || !words.length) {
      reg?.delete(HIGHLIGHT);
      setCount(0);
      return;
    }
    const ranges: Range[] = [];
    const walker = document.createTreeWalker(root.current, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if ((n.parentElement?.closest('.reader-feedback, .no-print, [role="tooltip"]'))) continue;
      const text = (n.nodeValue ?? '').toLocaleLowerCase('de');
      for (const w of words) {
        for (let i = text.indexOf(w); i >= 0; i = text.indexOf(w, i + w.length)) {
          const r = document.createRange();
          r.setStart(n, i);
          r.setEnd(n, i + w.length);
          ranges.push(r);
        }
      }
    }
    setCount(ranges.length);
    if (reg && HighlightCtor) reg.set(HIGHLIGHT, new HighlightCtor(...ranges));
    ranges[0]?.startContainer.parentElement?.scrollIntoView({ block: 'center' });
    return () => reg?.delete(HIGHLIGHT);
  }, [root, words.join(' '), key]);
  return count;
}

/** Ausschnitt mit markierten Suchwörtern */
function Marked({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</>;
}

/** „Siehe auch“ und passende häufige Fragen unter einem Kapitel (ADR-069); Redaktion pflegt Verweise direkt hier */
function Related({ chapterId, drafts, lang, canEdit, chapters, withQ }: { chapterId: string; drafts: boolean; lang: string; canEdit: boolean; chapters: { id: string; title: string }[]; withQ: (id: string) => string }) {
  const { notify } = useApp();
  const rel = useLoad<any>(`/reader/related/${chapterId}?drafts=${drafts}${lang !== 'de' ? `&lang=${lang}` : ''}`, [chapterId, drafts, lang]);
  const [editing, setEditing] = useState(false);
  const [add, setAdd] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => setEditing(false), [chapterId]);
  // Daten des vorigen Kapitels (während das neue lädt) nie anzeigen oder als Grundlage zum Speichern nehmen
  const d = rel.data?.chapterId === chapterId ? rel.data : null;
  if (!d) return null;
  const links = [...d.manual, ...d.automatic];
  // jede Änderung ersetzt beide Listen: nacheinander speichern und erst nach dem Neuladen die nächste zulassen,
  // sonst würde eine zweite schnelle Änderung auf dem alten Stand aufsetzen und die erste zurücknehmen
  const save = async (manual: string[], hidden: string[], msg: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await api('PUT', `/chapters/${chapterId}/related`, { manual, hidden });
      await rel.reload();
      notify(msg);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const manualIds = d.manual.map((m: any) => m.chapterId);
  const hiddenIds = d.hidden.map((h: any) => h.chapterId);
  if (!links.length && !d.faq.length && !canEdit) return null;
  return (
    <section className="reader-related no-print" aria-labelledby={`rel-${chapterId}`}>
      {(links.length > 0 || canEdit) && (
        <>
          <h2 id={`rel-${chapterId}`}>Siehe auch</h2>
          {links.length ? (
            <ul className="related-list">
              {links.map((l: any) => (
                <li key={l.chapterId}>
                  <Link to={withQ(l.chapterId)}>{l.title}</Link>
                  {editing && manualIds.includes(l.chapterId) && <button type="button" className="btn small ghost" disabled={busy} aria-label={`Verweis auf „${l.title}“ entfernen`} onClick={() => save(manualIds.filter((x: string) => x !== l.chapterId), hiddenIds, 'Verweis entfernt.')}>✕</button>}
                  {editing && !manualIds.includes(l.chapterId) && <button type="button" className="btn small ghost" disabled={busy} aria-label={`Vorschlag „${l.title}“ ausblenden`} onClick={() => save(manualIds, [...hiddenIds, l.chapterId], 'Vorschlag ausgeblendet.')}>Ausblenden</button>}
                </li>
              ))}
            </ul>
          ) : <p className="small muted">Noch keine verwandten Kapitel.</p>}
          {canEdit && !editing && <button type="button" className="btn small" onClick={() => setEditing(true)}>Verweise bearbeiten</button>}
          {editing && (
            <div className="related-edit">
              <label className="inline">Kapitel verweisen
                <select value={add} onChange={(e) => setAdd(e.target.value)}>
                  <option value="">– wählen –</option>
                  {chapters.filter((c) => c.id !== chapterId && !manualIds.includes(c.id)).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </label>
              <button type="button" className="btn small" disabled={!add || busy || manualIds.length >= 5} onClick={async () => { const id = add; setAdd(''); await save([...manualIds, id], hiddenIds.filter((x: string) => x !== id), 'Verweis hinzugefügt.'); }}>Hinzufügen</button>
              {manualIds.length >= 5 && <span className="small muted">Höchstens 5 Verweise.</span>}
              {d.hidden.length > 0 && (
                <p className="small">Ausgeblendet: {d.hidden.map((h: any) => (
                  <button key={h.chapterId} type="button" className="btn small ghost" disabled={busy} aria-label={`„${h.title}“ wieder vorschlagen`} onClick={() => save(manualIds, hiddenIds.filter((x: string) => x !== h.chapterId), 'Vorschlag wieder sichtbar.')}>{h.title} ↺</button>
                ))}</p>
              )}
              <button type="button" className="btn small primary" onClick={() => setEditing(false)}>Fertig</button>
            </div>
          )}
        </>
      )}
      {d.faq.length > 0 && (
        <>
          <h2>Häufige Fragen dazu</h2>
          {d.faq.map((f: any) => (
            <details key={f.id} className="faq-item"><summary>{f.question}</summary><Md text={f.answer} /></details>
          ))}
          <p className="small"><Link to="/lesen/faq">Alle häufigen Fragen</Link></p>
        </>
      )}
    </section>
  );
}

/** Lesezeichen mit eigenen Notizen (ADR-073): filtern, Notiz bearbeiten, entfernen, als CSV speichern */
export function ReaderBookmarksPage() {
  const { notify } = useApp();
  const mine = useLoad<any>('/reader/me');
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const q = filter.trim().toLocaleLowerCase('de');
  const all: any[] = mine.data?.bookmarks ?? [];
  const items = all.filter((b) => !q || `${b.title} ${b.note ?? ''}`.toLocaleLowerCase('de').includes(q));
  const saveNote = async (b: any) => {
    try {
      await api('PUT', `/reader/bookmarks/${b.chapterId}`, { note: notes[b.chapterId] ?? '' });
      notify('Notiz gespeichert.');
      setNotes(({ [b.chapterId]: _drop, ...rest }) => rest);
      mine.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const remove = async (b: any) => {
    try {
      await api('DELETE', `/reader/bookmarks/${b.chapterId}`);
      notify(`Lesezeichen „${b.title}“ entfernt.`);
      mine.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const exportCsv = () => {
    // Formel-Einschleusung verhindern: beginnt ein Wert wie eine Formel, wird er mit ' als Text markiert
    const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    const rows = [['Kapitel', 'Notiz', 'Gemerkt am', 'Link'], ...items.map((b) => [b.title, b.note ?? '', new Date(b.createdAt).toLocaleDateString('de-DE'), `${window.location.origin}/lesen/${b.chapterId}`])];
    const url = URL.createObjectURL(new Blob([`\ufeff${rows.map((r) => r.map(cell).join(';')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lesezeichen.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Page title="Lesezeichen" subtitle="Ihre gemerkten Kapitel mit eigenen Notizen – nur für Sie sichtbar"
      actions={<span className="row-actions"><Link className="btn" to="/lesen">← Leseransicht</Link><button className="btn" disabled={!items.length} onClick={exportCsv}>📤 Als CSV speichern</button></span>}>
      <ErrorBox error={mine.error} />
      <div className="filters">
        <label className="inline">Lesezeichen filtern <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Titel oder Notiz" /></label>
        <span className="small muted" aria-live="polite">{mine.data ? `${items.length} von ${all.length}` : ''}</span>
      </div>
      {mine.data && !all.length ? <Empty>Noch keine Lesezeichen. In der <Link to="/lesen">Leseransicht</Link> merken Sie Kapitel mit „☆ Merken“.</Empty> : (
        <Card title="Gemerkte Kapitel">
          <ul className="plain bookmark-list">
            {items.map((b) => {
              const draft = notes[b.chapterId];
              return (
                <li key={b.chapterId}>
                  <span><Link to={`/lesen/${b.chapterId}`}><strong>{b.title}</strong></Link> <span className="small muted">· gemerkt am {new Date(b.createdAt).toLocaleDateString('de-DE')}</span></span>
                  <label className="block">Notiz
                    <textarea rows={2} maxLength={500} aria-label={`Notiz zu „${b.title}“`} value={draft ?? b.note ?? ''} placeholder="z. B. für die Inventur im Dezember"
                      onChange={(e) => setNotes({ ...notes, [b.chapterId]: e.target.value })} />
                  </label>
                  <span className="row-actions">
                    <button className="btn small primary" disabled={draft === undefined || draft === (b.note ?? '')} onClick={() => saveNote(b)} aria-label={`Notiz zu „${b.title}“ speichern`}>Notiz speichern</button>
                    <button className="btn small danger" onClick={() => remove(b)} aria-label={`Lesezeichen „${b.title}“ entfernen`}>Entfernen</button>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </Page>
  );
}

/** Häufige Fragen für Leser (ADR-069): veröffentlichte FAQ mit Filter */
export function ReaderFaqPage() {
  const { lang, name } = useReaderLanguage();
  const faqLang = useLoad<any[]>(lang !== 'de' ? `/faq?status=published&language=${lang}` : null, [lang]);
  const faqDe = useLoad<any[]>('/faq?status=published&language=de');
  // in der Lesesprache, sonst deutsch (wie die Vorschläge unter den Kapiteln)
  const faq = lang !== 'de' && faqLang.data?.length ? faqLang : faqDe;
  const glossary = useReaderGlossary(lang);
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLocaleLowerCase('de');
  const items = (faq.data ?? []).filter((f) => !q || `${f.question} ${f.answer}`.toLocaleLowerCase('de').includes(q));
  return (
    <GlossaryProvider entries={glossary.data}>
      <Page title="Häufige Fragen" subtitle="Kurze Antworten auf das, was Leserinnen und Leser oft wissen möchten"
        actions={<Link className="btn no-print" to="/lesen">← Leseransicht</Link>}>
        <ErrorBox error={faq.error} />
        {lang !== 'de' && faqLang.data && !faqLang.data.length && <p className="reader-lang-note" role="note">Noch keine häufigen Fragen in {name} – Sie lesen die deutschen.</p>}
        <div className="filters">
          <label className="inline">Fragen filtern <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="z. B. Passwort" /></label>
          <span className="small muted" aria-live="polite">{faq.data ? `${items.length} von ${faq.data.length}` : ''}</span>
        </div>
        {faq.data && !faq.data.length ? <Empty>Noch keine veröffentlichten Fragen.</Empty> : (
          <div className="card faq-list">
            {items.map((f) => <details key={f.id} className="faq-item"><summary>{f.question}</summary><Md text={f.answer} /></details>)}
          </div>
        )}
      </Page>
    </GlossaryProvider>
  );
}

export function ReaderPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const chapters = useLoad<any[]>('/chapters');
  const [drafts, setDrafts] = useState(false);
  const { lang, setLang, languages, name: langName } = useReaderLanguage();
  const glossary = useReaderGlossary(lang);
  const trans = useLoad<any>(lang !== 'de' ? `/reader/translations?lang=${lang}&drafts=${drafts}` : null, [lang, drafts]);
  const titleOf = (id: string, fallback: string) => (lang !== 'de' && trans.data?.language === lang ? trans.data.titles[id] ?? fallback : fallback);
  const untranslated = (id: string) => lang !== 'de' && trans.data?.language === lang && !trans.data.translated.includes(id);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [search, setSearch] = useState<{ q: string; words: string[]; total: number; results: any[] } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const article = useRef<HTMLElement>(null);
  // Suche beim Tippen (ab zwei Zeichen, kurz verzögert); Treffer ersetzen das Inhaltsverzeichnis
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSearch(null);
      setSearchError(null);
      return;
    }
    let alive = true;
    const t = setTimeout(() => {
      get<any>(`/reader/search?q=${encodeURIComponent(q)}${drafts ? '&drafts=true' : ''}${lang !== 'de' ? `&lang=${lang}` : ''}`)
        .then((r) => alive && (setSearch(r), setSearchError(null)), (e) => alive && setSearchError(errorText(e)));
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query, drafts, lang]);
  // je Kapitel die anzuzeigende Version: freigegeben, sonst (mit „Entwürfe einblenden“) die neueste
  const list = useMemo(() => (chapters.data ?? []).map((c) => {
    // „Entwürfe einblenden“: jeweils die neueste Version (Vorschau); sonst die freigegebene
    const shown = drafts ? c.versions[0] : c.versions.find((v: any) => v.status === 'approved');
    return shown ? { id: c.id as string, title: c.title as string, version: shown, draft: shown.status !== 'approved' } : null;
  }).filter((x): x is NonNullable<typeof x> => !!x), [chapters.data, drafts]);
  const current = list.find((c) => c.id === chapterId) ?? null;
  // deutsch: Fassung direkt; andere Sprache: dieselbe Fassung mit Texten der freigegebenen Übersetzung (sonst deutsch mit Hinweis)
  const version = useLoad<any>(current ? (lang === 'de' ? `/chapter-versions/${current.version.id}` : `/reader/versions/${current.version.id}?lang=${lang}`) : null, [current?.version.id, lang]);
  // Lesezeichen, Verlauf, Änderungen seit dem letzten Besuch (ADR-070)
  const mine = useLoad<any>('/reader/me');
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions?.some((p: string) => p === 'edit' || p === 'admin');
  const updates: Record<string, 'changed' | 'new'> = mine.data?.updates ?? {};
  // Stand des geöffneten Kapitels vor dem Speichern des Besuchs (danach entfällt seine Markierung)
  const [openedAs, setOpenedAs] = useState<{ chapterId: string; kind: 'changed' | 'new' } | null>(null);
  useEffect(() => {
    // Besuch merken, sobald das Kapitel angezeigt wird; danach Hinweise „neu/geändert“ aktualisieren
    if (!current || !version.data) return;
    const kind = mine.data?.updates?.[current.id];
    setOpenedAs(kind ? { chapterId: current.id, kind } : null);
    post('/reader/visits', { chapterId: current.id, versionId: version.data.id }).then(() => mine.reload(), () => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.data?.id]);
  // übrige markierte Kapitel – live gezählt, sinkt mit jedem gelesenen
  const otherUpdates = Object.keys(updates).filter((id) => id !== current?.id).length;
  const bookmarked = !!mine.data?.bookmarks.some((b: any) => b.chapterId === current?.id);
  const bookmarkNote = mine.data?.bookmarks.find((b: any) => b.chapterId === current?.id)?.note as string | undefined;
  const idx = current ? list.indexOf(current) : -1;
  // Hervorhebung: Suchwörter aus dem Link (?q=) – bleiben beim Blättern erhalten, bis sie entfernt werden
  const marked = useMemo(() => [...new Set((params.get('q') ?? '').toLocaleLowerCase('de').split(/\s+/).filter((w) => w.length >= 2))], [params]);
  const hits = useHighlight(article, version.data ? marked : [], `${version.data?.id ?? ''}.${glossary.data?.length ?? 0}`);
  const withQ = (id: string) => `/lesen/${id}${params.get('q') ? `?q=${encodeURIComponent(params.get('q')!)}` : ''}`;
  return (
    <GlossaryProvider entries={glossary.data}>
    <Page title="Leseransicht" subtitle="Das Handbuch so lesen, wie Ihre Leserinnen und Leser es sehen"
      actions={<span className="no-print row-actions">
        {current && <button className="btn" onClick={() => window.print()}>🖨️ Kapitel drucken</button>}
        <Link className="btn" to={`/lesen/druck${drafts ? '?entwuerfe=1' : ''}`}>📄 Handbuch drucken</Link>
      </span>}>
      <ErrorBox error={chapters.error} />
      <div className="reader">
        <nav className="reader-toc card no-print" aria-label="Inhaltsverzeichnis">
          {languages.length > 1 && (
            <label className="block">Sprache
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                {languages.map((l) => <option key={l.code} value={l.code}>{l.name}{l.chapters !== null ? ` (${l.chapters} übersetzt)` : ''}</option>)}
              </select>
            </label>
          )}
          <div role="search" className="reader-search">
            <label className="reader-search-label" htmlFor="reader-q">Im Handbuch suchen</label>
            <div className="reader-search-row">
              <input id="reader-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="z. B. Lieferschein drucken"
                aria-describedby="reader-q-status" autoComplete="off" />
              {query && <button type="button" className="btn small ghost" onClick={() => setQuery('')} aria-label="Suche leeren">✕</button>}
            </div>
            <p id="reader-q-status" className="small muted" aria-live="polite">
              {searchError ?? (search ? (search.total ? `${search.total} Kapitel gefunden` : `Nichts gefunden zu „${search.q}“ – anderes Wort versuchen`) : '')}
            </p>
          </div>
          <label className="inline small"><input type="checkbox" checked={drafts} onChange={(e) => setDrafts(e.target.checked)} /> Entwürfe einblenden</label>
          {search ? (
            <ol className="plain reader-results" aria-label="Suchergebnisse">
              {search.results.map((r) => (
                <li key={r.chapterId}>
                  <Link to={`/lesen/${r.chapterId}?q=${encodeURIComponent(search.q)}`} aria-current={r.chapterId === chapterId ? 'page' : undefined} className={r.chapterId === chapterId ? 'active' : ''}>
                    <Marked text={r.title} words={search.words} />
                  </Link>
                  {r.draft && <span className="tag small">Entwurf</span>}
                  {r.snippet && <p className="small muted"><Marked text={r.snippet} words={search.words} /></p>}
                </li>
              ))}
            </ol>
          ) : (
            <>
              {mine.data?.bookmarks.length > 0 && (
                <>
                  <h2 className="toc-sub">★ Lesezeichen</h2>
                  <ul className="plain">{mine.data.bookmarks.slice(0, 5).map((b: any) => <li key={b.chapterId}><Link to={withQ(b.chapterId)}>{titleOf(b.chapterId, b.title)}</Link></li>)}</ul>
                  <p className="small"><Link to="/lesen/lesezeichen">Alle Lesezeichen und Notizen</Link></p>
                </>
              )}
              {mine.data?.recent.length > 0 && (
                <>
                  <h2 className="toc-sub">Zuletzt gelesen</h2>
                  <ul className="plain">{mine.data.recent.slice(0, 3).map((r: any) => <li key={r.chapterId}><Link to={withQ(r.chapterId)}>{titleOf(r.chapterId, r.title)}</Link></li>)}</ul>
                </>
              )}
              <h2>Inhalt</h2>
              {chapters.data && !list.length && <p className="small muted">Noch keine freigegebenen Kapitel. {drafts ? '' : 'Blenden Sie Entwürfe ein, um sie vorab zu lesen.'}</p>}
              <ol className="plain">
                {list.map((c) => (
                  <li key={c.id}>
                    <Link to={withQ(c.id)} aria-current={c.id === chapterId ? 'page' : undefined} className={c.id === chapterId ? 'active' : ''}><span lang={untranslated(c.id) ? 'de' : lang}>{titleOf(c.id, c.title)}</span></Link>
                    {c.draft && <span className="tag small">Entwurf</span>}
                    {untranslated(c.id) && <span className="tag small" title="noch nicht übersetzt">DE</span>}
                    {updates[c.id] && <span className={`tag small tag-${updates[c.id]}`}>{updates[c.id] === 'new' ? 'Neu' : 'Geändert'}</span>}
                  </li>
                ))}
              </ol>
              <p className="small"><Link to="/lesen/faq">❓ Häufige Fragen</Link></p>
            </>
          )}
          {glossary.data && glossary.data.length > 0 && <p className="small muted">Unterstrichene Begriffe erklären sich per Klick oder Maus.</p>}
        </nav>
        <article ref={article} className="reader-body card" aria-label={current ? titleOf(current.id, current.title) : 'Kapitel'} lang={version.data?.language ?? 'de'}>
          {!current ? <Empty>Wählen Sie links ein Kapitel{search ? ' aus den Suchergebnissen' : ''}.</Empty> : !version.data ? <ErrorBox error={version.error} /> : (
            <>
              {marked.length > 0 && (
                <p className="reader-marked no-print" role="status">
                  {hits ? `${hits} Treffer für „${params.get('q')}“ markiert.` : `„${params.get('q')}“ kommt in diesem Kapitel nicht vor.`}{' '}
                  <button type="button" className="btn small ghost" onClick={() => { params.delete('q'); setParams(params); }}>Markierung entfernen</button>
                </p>
              )}
              {(otherUpdates > 0 || openedAs?.chapterId === current.id) && (
                <p className="reader-updates no-print" role="note">
                  {openedAs?.chapterId === current.id && (openedAs.kind === 'new' ? 'Dieses Kapitel ist neu für Sie. ' : 'Dieses Kapitel wurde seit Ihrem letzten Lesen geändert. ')}
                  {otherUpdates > 0 && `${otherUpdates === 1 ? '1 weiteres Kapitel ist neu für Sie oder wurde' : `${otherUpdates} weitere Kapitel sind neu für Sie oder wurden`} seit Ihrem letzten Lesen geändert – im Inhalt markiert.`}
                </p>
              )}
              <div className="reader-title-row">
                <h2 className="reader-title">{version.data.title ?? current.title}{current.draft && <span className="tag small">Entwurf – noch nicht freigegeben</span>}</h2>
                <button type="button" className="btn small no-print" aria-pressed={bookmarked} onClick={async () => {
                  await api(bookmarked ? 'DELETE' : 'PUT', `/reader/bookmarks/${current.id}`);
                  mine.reload();
                }}>{bookmarked ? '★ Gemerkt' : '☆ Merken'}</button>
              </div>
              {bookmarkNote && <p className="small bookmark-note">📝 {bookmarkNote} · <Link to="/lesen/lesezeichen">Notiz bearbeiten</Link></p>}
              <LanguageNote version={version.data} name={langName} />
              <ChapterContent version={version.data} />
              <Related chapterId={current.id} drafts={drafts} lang={lang} canEdit={canEdit} chapters={list.map((c) => ({ id: c.id, title: titleOf(c.id, c.title) }))} withQ={withQ} />
              <Feedback chapterId={current.id} versionId={version.data.id} />
              <div className="row-actions reader-nav no-print">
                {idx > 0 && <button className="btn" onClick={() => navigate(withQ(list[idx - 1].id))}>← {titleOf(list[idx - 1].id, list[idx - 1].title)}</button>}
                {idx >= 0 && idx < list.length - 1 && <button className="btn" onClick={() => navigate(withQ(list[idx + 1].id))}>{titleOf(list[idx + 1].id, list[idx + 1].title)} →</button>}
              </div>
            </>
          )}
        </article>
      </div>
    </Page>
    </GlossaryProvider>
  );
}

/** Leser-Rückmeldungen für die Redaktion (im Anleitungs-Check) */
export function FeedbackCard({ canEdit }: { canEdit: boolean }) {
  const { notify } = useApp();
  const fb = useLoad<any[]>('/feedback?status=open');
  const items = (fb.data ?? []).filter((f) => !f.helpful || f.comment);
  return (
    <Card title={`Rückmeldungen von Leserinnen und Lesern (${items.length} offen)`}>
      <ErrorBox error={fb.error} />
      {fb.data && !items.length ? <p className="small">Keine offenen Rückmeldungen. Leser antworten in der <Link to="/lesen">Leseransicht</Link> auf „War dieses Kapitel hilfreich?“.</p> : (
        <ul className="plain feedback-list">
          {items.map((f) => (
            <li key={f.id}>
              <span aria-hidden="true">{f.helpful ? '👍' : '👎'}</span> <span className="sr-only">{f.helpful ? 'hilfreich' : 'nicht hilfreich'}:</span>
              <Link to={`/lesen/${f.chapterId}`}><strong>{f.title ?? f.chapterId}</strong></Link>
              {f.comment && <> – „{f.comment}“</>}
              <span className="small muted"> · {f.createdBy}, {new Date(f.createdAt).toLocaleDateString('de-DE')}</span>
              {canEdit && <DoneButton id={f.id} title={f.title ?? f.chapterId} onDone={() => { notify('Als erledigt markiert.'); fb.reload(); }} />}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function DoneButton({ id, title, onDone }: { id: string; title: string; onDone: () => void }) {
  const { notify } = useApp();
  return (
    <button className="btn small" aria-label={`Rückmeldung zu ${title} erledigt`} onClick={async () => {
      try {
        await api('PATCH', `/feedback/${id}`, { status: 'done' });
        onDone();
      } catch (e) {
        notify(errorText(e), 'error');
      }
    }}>Erledigt</button>
  );
}

/** „3. Titel“ – Titel, die schon mit einer Nummer beginnen (z. B. „4. Vertragsbearbeitung“), bleiben unverändert */
const numbered = (n: number, title: string) => (/^\d+(\.\d+)*\.?\s/.test(title) ? title : `${n}. ${title}`);

/** Firmenlogo aus der Medienablage (Layout, ADR-038) */
function Logo({ sha, alt, onDone }: { sha: string; alt: string; onDone: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    // fehlt das Bild, wird ohne Logo gedruckt – aber erst, wenn das feststeht
    mediaUrl(sha).then((u) => alive && setUrl(u), () => alive && onDone());
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sha]);
  return url ? <img className="print-cover-logo" src={url} alt={alt} onLoad={onDone} onError={onDone} /> : null;
}

/**
 * Druckansicht (ADR-060, ADR-063, ADR-065): ganzes Handbuch oder eine Handbuch-Variante, optional nur für eine Rolle –
 * Deckblatt im Firmen-Layout, Inhaltsverzeichnis, je Kapitel neue Seite, Glossar der vorkommenden Begriffe; PDF über den Browser.
 */
export function PrintPage() {
  const [params, setParams] = useSearchParams();
  const drafts = params.has('entwuerfe');
  const outlineId = params.get('variante') ?? '';
  const role = params.get('rolle') ?? '';
  const languagesLoad = useLoad<{ code: string; name: string }[]>('/reader/languages');
  const lang = languagesLoad.data?.some((l) => l.code === params.get('sprache')) ? params.get('sprache')! : 'de';
  const langName = languagesLoad.data?.find((l) => l.code === lang)?.name ?? lang;
  const { ref } = useApp();
  const outlines = useLoad<any>('/outlines');
  const variants = (outlines.data?.items ?? []).filter((o: any) => o.latest);
  const chapters = useLoad<any>(outlineId ? `/outlines/${outlineId}/chapters` : '/chapters', [outlineId]);
  const glossary = useReaderGlossary(lang);
  // „Siehe auch“ und FAQ für alle gedruckten Kapitel – Standardhandbuch oder die Kapitel der gewählten Variante (ADR-072)
  const related = useLoad<Record<string, any>>(`/reader/related?drafts=${drafts}${lang !== 'de' ? `&lang=${lang}` : ''}${outlineId ? `&outline=${encodeURIComponent(outlineId)}` : ''}`, [outlineId, drafts, lang]);
  const layout = useLoad<any>('/layout');
  const [versions, setVersions] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setParam = (k: string, v: string) => {
    if (v) params.set(k, v);
    else params.delete(k);
    setParams(params, { replace: true });
  };
  useEffect(() => {
    const list: any[] | undefined = outlineId ? chapters.data?.chapters : chapters.data;
    if (!list) return;
    setVersions(null);
    // Antworten einer inzwischen abgewählten Variante/Einstellung verwerfen – sonst stünde das falsche Handbuch unter dem Titel
    let current = true;
    const shown = list.map((c) => (drafts ? c.versions[0] : c.versions.find((v: any) => v.status === 'approved'))).filter(Boolean);
    Promise.all(shown.map((v: any) => api<any>('GET', lang === 'de' ? `/chapter-versions/${v.id}` : `/reader/versions/${v.id}?lang=${lang}`)))
      .then((v) => current && setVersions(v), (e) => current && setError(errorText(e)));
    return () => {
      current = false;
    };
  }, [chapters.data, drafts, outlineId, lang]);
  // mit Rolle: Kapitel ohne passenden Inhalt entfallen
  const printed = (versions ?? []).filter((v) => readerSections(v, role || undefined).length);
  // Kapitelnummern der gedruckten Kapitel: „Siehe auch“ verweist nur auf mitgedruckte Kapitel
  const numberOf = new Map(printed.map((v, n) => [v.chapterId as string, n + 1]));
  const seeAlso = (chapterId: string) => {
    const r = related.data?.[chapterId];
    return r ? [...r.manual, ...r.automatic].filter((x: any) => numberOf.has(x.chapterId)) : [];
  };
  const printedFaq = (() => {
    const seen = new Map<string, any>();
    for (const v of printed) for (const f of related.data?.[v.chapterId]?.faq ?? []) if (!seen.has(f.id)) seen.set(f.id, f);
    return [...seen.values()];
  })();
  const date = new Date().toLocaleDateString('de-DE');
  const projects = useLoad<any[]>('/projects');
  const releases = useLoad<any[]>('/releases');
  const project = projects.data?.find((p) => p.id === currentProjectId()) ?? projects.data?.[0];
  const release = releases.data?.[0];
  const lay = layout.data;
  const variant = variants.find((o: any) => o.id === outlineId);
  const roleLabel = role ? ref?.roles.find((r) => r.code === role)?.label ?? role : '';
  // Deckblatt (ADR-063): Titel, Stand und Version – bei Entwürfen und Varianten „Arbeitsstand“ (Releases gelten dem Standardhandbuch)
  const edition = !drafts && !outlineId && release ? `Version ${release.version}` : 'Arbeitsstand';
  const bookTitle = variant?.name ?? project?.name ?? 'Benutzerhandbuch';
  // Drucken erst, wenn Kapitel, Deckblattangaben, Markdown-Renderer und Logo bereit sind – sonst entstünde ein PDF mit
  // Ersatzangaben, unformatiertem Text oder ohne Logo
  const [markdownReady, setMarkdownReady] = useState(false);
  const [logoDone, setLogoDone] = useState(false);
  useEffect(() => {
    preloadMarkdown().then(() => setMarkdownReady(true), () => setMarkdownReady(true));
  }, []);
  useEffect(() => setLogoDone(false), [layout.data?.logoSha]);
  const ready = !!versions && !!projects.data && !!releases.data && !!layout.data && !!outlines.data && (!!related.data || !!related.error) && markdownReady && (!layout.data?.logoSha || logoDone);
  const print = async () => {
    // letzte Absicherung: warten, bis kein Text mehr auf den Renderer wartet (höchstens 3 s)
    for (let i = 0; i < 60 && document.querySelector('.print-book .md-pending'); i++) await new Promise((r) => setTimeout(r, 50));
    window.print();
  };
  const header = [lay?.headerText || [lay?.companyName, bookTitle].filter(Boolean).join(' · '), edition, roleLabel && `für ${roleLabel}`].filter(Boolean).join(' · ');
  useEffect(() => {
    // Kopf-/Fußzeile der gedruckten Seiten: @page-Randboxen erben keine Variablen, daher als eigener Stilblock
    // Deckblatt ohne Kopfzeile: die :first-Regel muss nach der allgemeinen stehen, sonst gewinnt Chrome die spätere
    const style = document.createElement('style');
    style.dataset.printHeader = '';
    const footer = lay?.footerText ? ` @bottom-left { content: ${JSON.stringify(lay.footerText)}; font-size: 9pt; color: #555; }` : '';
    style.textContent = `@page { @top-center { content: ${JSON.stringify(header)}; }${footer} } @page :first { @top-center { content: none; } @bottom-left { content: none; } }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [header, lay?.footerText]);
  // Glossar-Anhang: nur Begriffe, die im gedruckten Text vorkommen
  const usedGlossary = useMemo(() => {
    if (!glossary.data?.length || !printed.length) return [];
    const text = printed.flatMap((v) => readerSections(v, role || undefined).flatMap((s: any) => s.blocks.map((b: any) => b.text))).join('\n');
    return glossary.data.filter((g) => new RegExp(`(?<![\\p{L}\\p{N}])${g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, g.kind === 'abbreviation' ? 'u' : 'iu').test(text))
      .sort((a, b) => a.term.localeCompare(b.term, 'de'));
  }, [glossary.data, printed, role]);
  const accent = lay?.primaryColor ?? undefined;
  return (
    <GlossaryProvider entries={glossary.data}>
    <Page title="Handbuch drucken" subtitle={`${variant ? `Variante „${variant.name}“` : 'Standardhandbuch'}${roleLabel ? ` für ${roleLabel}` : ''} · ${drafts ? 'freigegebene Kapitel und Entwürfe' : 'freigegebene Kapitel'} · Stand ${date}`}
      actions={<span className="no-print row-actions">
        <Link className="btn" to="/lesen">← Leseransicht</Link>
        <button className="btn primary" disabled={!ready} onClick={() => void print()}>🖨️ Drucken / als PDF speichern</button>
      </span>}>
      <ErrorBox error={error ?? chapters.error ?? projects.error ?? releases.error ?? layout.error} />
      <div className="filters no-print" role="group" aria-label="Was drucken?">
        <label className="inline">Handbuch
          <select value={outlineId} onChange={(e) => setParam('variante', e.target.value)}>
            <option value="">Standardhandbuch (alle Kapitel)</option>
            {variants.map((o: any) => <option key={o.id} value={o.id}>Variante: {o.name}</option>)}
          </select>
        </label>
        <label className="inline">Für Rolle
          <select value={role} onChange={(e) => setParam('rolle', e.target.value)}>
            <option value="">alle Rollen</option>
            {(ref?.roles ?? []).filter((r) => r.code !== 'all').map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
          </select>
        </label>
        {(languagesLoad.data?.length ?? 0) > 1 && (
          <label className="inline">Sprache
            <select value={lang} onChange={(e) => setParam('sprache', e.target.value === 'de' ? '' : e.target.value)}>
              {languagesLoad.data!.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </label>
        )}
        <label className="inline"><input type="checkbox" checked={drafts} onChange={(e) => setParam('entwuerfe', e.target.checked ? '1' : '')} /> Entwürfe mitdrucken</label>
      </div>
      <p className="small muted no-print">Tipp: Im Druckdialog „Als PDF speichern“ wählen. Das Handbuch beginnt mit einem Deckblatt{lay?.companyName || lay?.logoSha ? ' im Firmen-Layout' : ''}; jedes Kapitel beginnt auf einer neuen Seite, unten steht „Seite X von Y“. Mit einer Rolle erscheinen nur allgemeine und für diese Rolle bestimmte Inhalte.</p>
      {!versions ? <p className="muted">Lade …</p> : !printed.length ? <Empty>{versions.length && role ? `Keine Inhalte für die Rolle „${roleLabel}“.` : 'Noch keine freigegebenen Kapitel.'}</Empty> : (
        <div className="print-book" style={accent ? ({ '--print-accent': accent } as React.CSSProperties) : undefined}>
          <section className="print-cover" aria-label="Deckblatt">
            {lay?.logoSha && <Logo sha={lay.logoSha} alt={`Logo ${lay.companyName ?? ''}`.trim()} onDone={() => setLogoDone(true)} />}
            <p className="print-cover-kicker">{lay?.companyName ? `${lay.companyName} · ` : ''}Benutzerhandbuch</p>
            <h2 className="print-cover-title">{bookTitle}</h2>
            {lay?.coverSubtitle && <p className="print-cover-subtitle">{lay.coverSubtitle}</p>}
            <p className="print-cover-edition">{edition}{roleLabel && ` · für ${roleLabel}`}{lang !== 'de' && ` · ${langName}`}</p>
            <dl className="print-cover-meta">
              <div><dt>Stand</dt><dd>{date}</dd></div>
              <div><dt>Kapitel</dt><dd>{printed.length}</dd></div>
              {edition !== 'Arbeitsstand' && release && <div><dt>Veröffentlicht</dt><dd>{new Date(release.createdAt).toLocaleDateString('de-DE')}</dd></div>}
              {drafts && <div><dt>Hinweis</dt><dd>enthält nicht freigegebene Entwürfe</dd></div>}
            </dl>
            {lay?.confidentiality && <p className="print-cover-confidential">{lay.confidentiality}</p>}
          </section>
          <nav className="print-toc" aria-label="Inhaltsverzeichnis des Handbuchs">
            <h2>Inhalt</h2>
            <ol>
              {printed.map((v, n) => <li key={v.id}><a href={`#k-${v.id}`}>{numbered(n + 1, v.title)}</a>{v.status !== 'approved' && ' (Entwurf)'}</li>)}
              {printedFaq.length > 0 && <li><a href="#faq">Häufige Fragen</a></li>}
              {usedGlossary.length > 0 && <li><a href="#glossar">Glossar</a></li>}
            </ol>
          </nav>
          {printed.map((v, n) => (
            <article key={v.id} id={`k-${v.id}`} className="print-chapter reader-body" aria-label={v.title}>
              <h2 className="reader-title">{numbered(n + 1, v.title)}{v.status !== 'approved' && <span className="tag small">Entwurf</span>}</h2>
              {v.fallback && <p className="small muted">({v.fallback === 'outdated' ? 'Übersetzung veraltet' : 'noch nicht übersetzt'} – deutsche Fassung)</p>}
              <ChapterContent version={v} role={role || undefined} />
              {seeAlso(v.chapterId).length > 0 && (
                <p className="print-see"><strong>Siehe auch:</strong> {seeAlso(v.chapterId).map((x: any, i: number) => (
                  <span key={x.chapterId}>{i > 0 && '; '}<a href={`#k-${printed[numberOf.get(x.chapterId)! - 1].id}`}>Kapitel {numberOf.get(x.chapterId)} „{x.title.replace(/^\d+(\.\d+)*\.?\s+/, '')}“</a></span>
                ))}</p>
              )}
            </article>
          ))}
          {printedFaq.length > 0 && (
            <section id="faq" className="print-chapter print-faq" aria-labelledby="faq-h">
              <h2 id="faq-h" className="reader-title">Häufige Fragen</h2>
              {printedFaq.map((f) => <div key={f.id} className="print-faq-item"><h3>{f.question}</h3><Md text={f.answer} /></div>)}
            </section>
          )}
          {usedGlossary.length > 0 && (
            <section id="glossar" className="print-chapter print-glossary" aria-labelledby="glossar-h">
              <h2 id="glossar-h" className="reader-title">Glossar</h2>
              <dl>{usedGlossary.map((g) => <div key={g.term}><dt>{g.term}</dt><dd>{g.text}</dd></div>)}</dl>
            </section>
          )}
        </div>
      )}
    </Page>
    </GlossaryProvider>
  );
}
