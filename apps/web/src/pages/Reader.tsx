// Leseransicht (ADR-054): das Handbuch so lesen, wie Endnutzer es sehen – Inhaltsverzeichnis, Schritte zum Abhaken,
// Hinweise hervorgehoben – und je Kapitel „War das hilfreich?“ beantworten.
import { CheckIcon, CircleHelpIcon, FileTextIcon, NotebookPenIcon, PrinterIcon, StarIcon, ThumbsDownIcon, ThumbsUpIcon, XIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, get, post } from '../api';
import { GlossaryProvider } from '../components/Glossary';
import { Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';
import { languageLabel, ReaderTextProvider, readerTexts, useReaderText } from '../readerText';
import { escapeRegExp } from '../format';
import { ChapterContent, useReaderGlossary, useReaderLanguage } from './ReaderShared';

/**
 * Signalwort am Textanfang („**Wichtig:**“) als Beschriftung der Box, wie in Designvorlagen und Releases (Server: signalLabel);
 * nur in deutschen Texten und nur, wenn es zur Art passt – sonst stünde „Tipp: Wichtig:“ doppelt da.
 */
/** „War das hilfreich?“ */
function Feedback({ chapterId, versionId }: { chapterId: string; versionId: string }) {
  const { notify } = useApp();
  const { t, uiLang } = useReaderText();
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
      notify(`${t('fbThanks')}.`);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  if (sent) return <p className="reader-feedback" role="status" lang={uiLang}><Ico icon={CheckIcon} />{t('fbThanks')}{helpful === false ? t('fbThanksNo') : ''}.</p>;
  return (
    <section className="reader-feedback no-print" aria-labelledby="fb-q" lang={uiLang}>
      <h2 id="fb-q">{t('fbQuestion')}</h2>
      <div className="row-actions">
        <button className="btn" aria-pressed={helpful === true} onClick={() => { setHelpful(true); void send(true); }}><ThumbsUpIcon className="btn-icon" aria-hidden="true" size={16} />{t('yes')}</button>
        <button className="btn" aria-pressed={helpful === false} onClick={() => setHelpful(false)}><ThumbsDownIcon className="btn-icon" aria-hidden="true" size={16} />{t('no')}</button>
      </div>
      {helpful === false && (
        <div className="reader-feedback-form">
          <label className="block">{t('fbMissing')}
            <textarea rows={3} value={comment} maxLength={1000} onChange={(e) => setComment(e.target.value)} placeholder={t('fbPlaceholder')} />
          </label>
          <button className="btn primary" onClick={() => void send(false, comment)}>{t('fbSend')}</button>
        </div>
      )}
    </section>
  );
}

/** Hinweis, wenn ein Kapitel (noch) nicht in der Lesesprache vorliegt */
function LanguageNote({ version, chapterId, requested, onRequested }: { version: any; chapterId: string; requested: boolean; onRequested: () => void }) {
  const { t, into, uiLang } = useReaderText();
  const { notify } = useApp();
  const [busy, setBusy] = useState(false);
  // Wunsch mit optionaler Begründung (ADR-125): erst auf Klick, damit der Hinweis kurz bleibt
  const [asking, setAsking] = useState(false);
  const [reason, setReason] = useState('');
  if (!version || version.requestedLanguage === 'de' || !version.requestedLanguage) return null;
  const lang = version.requestedLanguage as string;
  // Übersetzung anfordern (ADR-075), wenn das Kapitel fehlt oder veraltet ist
  const request = async () => {
    setBusy(true);
    try {
      await post('/reader/translation-requests', { chapterId, language: lang, ...(reason.trim() ? { reason: reason.trim() } : {}) });
      setAsking(false);
      setReason('');
      onRequested();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const ask = version.fallback && (requested
    ? <span className="small" role="status"><Ico icon={CheckIcon} />{t('requested')}</span>
    : !asking
      ? <button type="button" className="btn small" onClick={() => setAsking(true)}>{t('requestTranslation')}</button>
      : (
        <form className="request-form" onSubmit={(e) => (e.preventDefault(), void request())}>
          <label className="block small">{t('requestReason')}
            <textarea rows={2} maxLength={300} value={reason} placeholder={t('requestReasonPlaceholder')} onChange={(e) => setReason(e.target.value)} autoFocus />
          </label>
          <span className="row-actions">
            <button type="submit" className="btn small primary" disabled={busy}>{t('sendRequest')}</button>
            <button type="button" className="btn small" onClick={() => (setAsking(false), setReason(''))}>{t('cancel')}</button>
          </span>
        </form>
      ));
  if (version.fallback === 'missing') return <div className="reader-lang-note" role="note" lang={uiLang}><p>{t('langMissing', { into: into(lang) })}</p>{ask}</div>;
  if (version.fallback === 'outdated') return <div className="reader-lang-note" role="note" lang={uiLang}><p>{t('langOutdated', { into: into(lang) })}</p>{ask}</div>;
  if (version.untranslatedBlocks > 0) return <p className="reader-lang-note" role="note" lang={uiLang}>{version.untranslatedBlocks === 1 ? t('untranslatedOne') : t('untranslatedMany', { n: version.untranslatedBlocks })}</p>;
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
  const re = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</>;
}

/**
 * „Weiter mit …“ am Kapitelende (ADR-085, F-29): gepflegter Übergangstext und Folgekapitel; die Redaktion pflegt beides hier.
 * Ohne Eintrag gilt das nächste Kapitel der Reihenfolge (Schaltfläche unten).
 */
function Transition({ chapterId, canEdit, chapters, withQ }: { chapterId: string; canEdit: boolean; chapters: { id: string; title: string }[]; withQ: (id: string) => string }) {
  const { t } = useReaderText();
  const { notify } = useApp();
  const tr = useLoad<any>(`/chapter-transitions/${chapterId}`, [chapterId]);
  const [edit, setEdit] = useState<{ nextChapterId: string; text: string } | null>(null);
  useEffect(() => setEdit(null), [chapterId]);
  const d = tr.data;
  const next = d?.next && chapters.find((c) => c.id === d.next.chapterId);
  const save = async (body: any, method: 'PUT' | 'DELETE') => {
    try {
      await api(method, `/chapter-transitions/${chapterId}`, method === 'PUT' ? body : undefined);
      notify(method === 'PUT' ? 'Übergang gespeichert.' : 'Übergang entfernt – es gilt das nächste Kapitel.');
      setEdit(null);
      tr.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  if (!d) return null;
  return (
    <>
      {d.explicit && next && (
        <aside className="reader-transition" aria-label={t('continueWith')}>
          <Link to={withQ(next.id)}><strong>{t('continueWith')} „{next.title}“</strong> →</Link>
          {d.text && <p className="small" lang="de">{d.text}</p>}
        </aside>
      )}
      {canEdit && !edit && <p className="no-print" lang="de"><button type="button" className="btn small ghost" onClick={() => setEdit({ nextChapterId: d.nextChapterId ?? '', text: d.text ?? '' })}>{d.explicit ? 'Übergang bearbeiten' : 'Übergang „Weiter mit …“ pflegen'}</button></p>}
      {canEdit && edit && (
        <fieldset className="reader-transition-edit no-print" lang="de">
          <legend>Übergang zum nächsten Kapitel</legend>
          <label className="block">Folgekapitel
            <select value={edit.nextChapterId} onChange={(e) => setEdit({ ...edit, nextChapterId: e.target.value })}>
              <option value="">nächstes Kapitel der Reihenfolge</option>
              {chapters.filter((c) => c.id !== chapterId).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          <label className="block">Übergangstext <input value={edit.text} maxLength={500} placeholder="z. B. Nach dem Anlegen prüft MO den Antrag." onChange={(e) => setEdit({ ...edit, text: e.target.value })} /></label>
          <div className="row-actions">
            <button type="button" className="btn primary small" onClick={() => save({ nextChapterId: edit.nextChapterId || null, text: edit.text || null }, 'PUT')}>Speichern</button>
            {d.explicit && <button type="button" className="btn small" onClick={() => save(null, 'DELETE')}>Entfernen</button>}
            <button type="button" className="btn small ghost" onClick={() => setEdit(null)}>Abbrechen</button>
          </div>
        </fieldset>
      )}
    </>
  );
}

/** „Siehe auch“ und passende häufige Fragen unter einem Kapitel (ADR-069); Redaktion pflegt Verweise direkt hier */
function Related({ chapterId, drafts, lang, canEdit, chapters, withQ }: { chapterId: string; drafts: boolean; lang: string; canEdit: boolean; chapters: { id: string; title: string }[]; withQ: (id: string) => string }) {
  const { notify } = useApp();
  const { t, uiLang } = useReaderText();
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
          <h2 id={`rel-${chapterId}`} lang={uiLang}>{t('seeAlso')}</h2>
          {links.length ? (
            <ul className="related-list">
              {links.map((l: any) => (
                <li key={l.chapterId}>
                  <Link to={withQ(l.chapterId)}>{l.title}</Link>
                  {editing && manualIds.includes(l.chapterId) && <button type="button" className="btn small ghost" disabled={busy} aria-label={`Verweis auf „${l.title}“ entfernen`} onClick={() => save(manualIds.filter((x: string) => x !== l.chapterId), hiddenIds, 'Verweis entfernt.')}><Ico icon={XIcon} /></button>}
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
          <h2 lang={uiLang}>{t('faqRelated')}</h2>
          {d.faq.map((f: any) => (
            <details key={f.id} className="faq-item" lang={f.language}>
              <summary>{f.question}{lang !== 'de' && f.language === 'de' && <> <span className="tag small" lang={uiLang} title={t('untranslatedTag')}>DE</span></>}</summary>
              <Md text={f.answer} />
            </details>
          ))}
          <p className="small" lang={uiLang}><Link to="/lesen/faq">{t('allFaq')}</Link></p>
        </>
      )}
    </section>
  );
}

/** Notiz zum Kapitel direkt unter dem Titel (ADR-076): anlegen, ändern, löschen – legt dabei das Lesezeichen an */
function ChapterNote({ chapterId, note, onSaved }: { chapterId: string; note: string | null | undefined; onSaved: () => void }) {
  const { t } = useReaderText();
  const { notify } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => setEditing(false), [chapterId]);
  const save = async (text: string) => {
    setBusy(true);
    try {
      await api('PUT', `/reader/bookmarks/${chapterId}`, { note: text });
      notify(text.trim() ? t('noteSaved') : t('noteDeleted'));
      setEditing(false);
      onSaved();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (editing) {
    return (
      <div className="chapter-note-edit no-print">
        <label className="block">{t('noteLabel')}
          <textarea rows={3} maxLength={500} value={draft} autoFocus placeholder={t('notePlaceholder')} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }} aria-describedby={`note-hint-${chapterId}`} />
        </label>
        <p id={`note-hint-${chapterId}`} className="small muted">{t('noteHint')} {draft.length}/500</p>
        <span className="row-actions">
          <button type="button" className="btn small primary" disabled={busy || draft === (note ?? '')} onClick={() => void save(draft)}>{t('save')}</button>
          <button type="button" className="btn small" disabled={busy} onClick={() => setEditing(false)}>{t('cancel')}</button>
          {note && <button type="button" className="btn small danger" disabled={busy} onClick={() => void save('')}>{t('deleteNote')}</button>}
        </span>
      </div>
    );
  }
  return note
    ? <p className="small bookmark-note"><Ico icon={NotebookPenIcon} />{note} · <button type="button" className="linklike no-print" onClick={() => { setDraft(note); setEditing(true); }}>{t('editNote')}</button></p>
    : <p className="no-print chapter-note-add"><button type="button" className="btn small ghost" onClick={() => { setDraft(''); setEditing(true); }}><Ico icon={NotebookPenIcon} />{t('addNote')}</button></p>;
}

export function ReaderPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const chapters = useLoad<any[]>('/chapters');
  const [drafts, setDrafts] = useState(false);
  const { lang, setLang, languages } = useReaderLanguage();
  const { t, uiLang } = useMemo(() => readerTexts(lang), [lang]);
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
  // erst, wenn der eigene Stand geladen ist: sonst ginge beim direkten Aufruf (Link aus einem Hinweis) der Hinweis
  // „neu/geändert“ verloren, weil der Besuch schon gespeichert wäre
  const mineReady = mine.data !== null || !!mine.error;
  useEffect(() => {
    // Besuch merken, sobald das Kapitel angezeigt wird; danach Hinweise „neu/geändert“ aktualisieren
    if (!current || !version.data || !mineReady) return;
    const kind = mine.data?.updates?.[current.id];
    setOpenedAs(kind ? { chapterId: current.id, kind } : null);
    post('/reader/visits', { chapterId: current.id, versionId: version.data.id }).then(() => mine.reload(), () => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.data?.id, mineReady]);
  // übrige markierte Kapitel – live gezählt, sinkt mit jedem gelesenen
  const otherUpdates = Object.keys(updates).filter((id) => id !== current?.id).length;
  const bookmarked = !!mine.data?.bookmarks.some((b: any) => b.chapterId === current?.id);
  const bookmarkNote = mine.data?.bookmarks.find((b: any) => b.chapterId === current?.id)?.note as string | undefined;
  const translationRequested = !!mine.data?.translationRequests?.some((r: any) => r.chapterId === current?.id && r.language === lang);
  const idx = current ? list.indexOf(current) : -1;
  // Hervorhebung: Suchwörter aus dem Link (?q=) – bleiben beim Blättern erhalten, bis sie entfernt werden
  const marked = useMemo(() => [...new Set((params.get('q') ?? '').toLocaleLowerCase('de').split(/\s+/).filter((w) => w.length >= 2))], [params]);
  const hits = useHighlight(article, version.data ? marked : [], `${version.data?.id ?? ''}.${glossary.data?.length ?? 0}`);
  const withQ = (id: string) => `/lesen/${id}${params.get('q') ? `?q=${encodeURIComponent(params.get('q')!)}` : ''}`;
  return (
    <GlossaryProvider entries={glossary.data}>
    <ReaderTextProvider lang={lang}>
    <Page title="Leseransicht" docTitle={version.data?.title ?? current?.title} subtitle="Das Handbuch so lesen, wie Ihre Leserinnen und Leser es sehen"
      actions={<span className="no-print row-actions">
        {current && <button className="btn" onClick={() => window.print()}><PrinterIcon className="btn-icon" aria-hidden="true" size={16} />Kapitel drucken</button>}
        <Link className="btn" to={`/lesen/druck${drafts ? '?entwuerfe=1' : ''}`}><FileTextIcon className="btn-icon" aria-hidden="true" size={16} />Handbuch drucken</Link>
      </span>}>
      <ErrorBox error={chapters.error} />
      <div className="reader">
        <nav className="reader-toc card no-print" aria-label={t('toc')} lang={uiLang}>
          {languages.length > 1 && (
            <label className="block">{t('language')}
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                {languages.map((l) => <option key={l.code} value={l.code} lang={l.code}>{languageLabel(l.code)}{l.chapters !== null ? ` (${t('translatedCount', { n: l.chapters })})` : ''}</option>)}
              </select>
            </label>
          )}
          <div role="search" className="reader-search" aria-labelledby="reader-q-label">
            <label className="reader-search-label" htmlFor="reader-q" id="reader-q-label">{t('search')}</label>
            <div className="reader-search-row">
              <input id="reader-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchPlaceholder')}
                aria-describedby="reader-q-status" autoComplete="off" />
              {query && <button type="button" className="btn small ghost" onClick={() => setQuery('')} aria-label={t('clearSearch')}><Ico icon={XIcon} /></button>}
            </div>
            <p id="reader-q-status" className="small muted" aria-live="polite">
              {searchError ?? (search ? (search.total ? t('found', { n: search.total }) : t('notFound', { q: search.q })) : '')}
            </p>
          </div>
          <label className="inline small" lang="de"><input type="checkbox" checked={drafts} onChange={(e) => setDrafts(e.target.checked)} /> Entwürfe einblenden</label>
          {search ? (
            <ol className="plain reader-results" aria-label={t('searchResults')}>
              {search.results.map((r) => (
                <li key={r.chapterId}>
                  <Link to={`/lesen/${r.chapterId}?q=${encodeURIComponent(search.q)}`} aria-current={r.chapterId === chapterId ? 'page' : undefined} className={r.chapterId === chapterId ? 'active' : ''}>
                    <Marked text={r.title} words={search.words} />
                  </Link>
                  {r.draft && <span className="tag small">{t('draft')}</span>}
                  {r.snippet && <p className="small muted"><Marked text={r.snippet} words={search.words} /></p>}
                </li>
              ))}
            </ol>
          ) : (
            <>
              {mine.data?.bookmarks.length > 0 && (
                <>
                  <h2 className="toc-sub"><Ico icon={StarIcon} />{t('bookmarks')}</h2>
                  <ul className="plain">{mine.data.bookmarks.slice(0, 5).map((b: any) => <li key={b.chapterId}><Link to={withQ(b.chapterId)}>{titleOf(b.chapterId, b.title)}</Link></li>)}</ul>
                  <p className="small"><Link to="/lesen/lesezeichen">{t('allBookmarks')}</Link></p>
                </>
              )}
              {mine.data?.recent.length > 0 && (
                <>
                  <h2 className="toc-sub">{t('recent')}</h2>
                  <ul className="plain">{mine.data.recent.slice(0, 3).map((r: any) => <li key={r.chapterId}><Link to={withQ(r.chapterId)}>{titleOf(r.chapterId, r.title)}</Link></li>)}</ul>
                </>
              )}
              <h2>{t('contents')}</h2>
              {chapters.data && !list.length && <p className="small muted">Noch keine freigegebenen Kapitel. {drafts ? '' : 'Blenden Sie Entwürfe ein, um sie vorab zu lesen.'}</p>}
              <ol className="plain">
                {list.map((c) => (
                  <li key={c.id}>
                    <Link to={withQ(c.id)} aria-current={c.id === chapterId ? 'page' : undefined} className={c.id === chapterId ? 'active' : ''}><span lang={untranslated(c.id) ? 'de' : lang}>{titleOf(c.id, c.title)}</span></Link>
                    {c.draft && <span className="tag small">{t('draft')}</span>}
                    {untranslated(c.id) && <span className="tag small" title={t('untranslatedTag')}>DE</span>}
                    {updates[c.id] && <span className={`tag small tag-${updates[c.id]}`}>{updates[c.id] === 'new' ? t('tagNew') : t('tagChanged')}</span>}
                  </li>
                ))}
              </ol>
              <p className="small"><Link to="/lesen/faq"><Ico icon={CircleHelpIcon} />{t('faqLink')}</Link></p>
            </>
          )}
          {glossary.data && glossary.data.length > 0 && <p className="small muted">{t('glossHint')}</p>}
        </nav>
        <article ref={article} className="reader-body card" aria-label={current ? titleOf(current.id, current.title) : t('chapter')} lang={version.data?.language ?? 'de'}>
          {!current ? <Empty><span lang={uiLang}>{t('chooseChapter')}</span></Empty> : !version.data ? <ErrorBox error={version.error} /> : (
            <>
              {marked.length > 0 && (
                <p className="reader-marked no-print" role="status" lang={uiLang}>
                  {hits ? t('hits', { n: hits, q: params.get('q')! }) : t('noHits', { q: params.get('q')! })}{' '}
                  <button type="button" className="btn small ghost" onClick={() => { params.delete('q'); setParams(params); }}>{t('removeMark')}</button>
                </p>
              )}
              {(otherUpdates > 0 || openedAs?.chapterId === current.id) && (
                <p className="reader-updates no-print" role="note" lang={uiLang}>
                  {openedAs?.chapterId === current.id && `${openedAs.kind === 'new' ? t('newChapter') : t('changedChapter')} `}
                  {otherUpdates > 0 && (otherUpdates === 1 ? t('otherOne') : t('otherMany', { n: otherUpdates }))}
                </p>
              )}
              <div className="reader-title-row">
                <h2 className="reader-title">{version.data.title ?? current.title}{current.draft && <span className="tag small" lang={uiLang}>{t('draftBanner')}</span>}</h2>
                <button type="button" className="btn small no-print" lang={uiLang} aria-pressed={bookmarked} onClick={async () => {
                  await api(bookmarked ? 'DELETE' : 'PUT', `/reader/bookmarks/${current.id}`);
                  mine.reload();
                }}><Ico icon={StarIcon} className={`ico${bookmarked ? ' filled' : ''}`} />{bookmarked ? t('bookmarked') : t('bookmark')}</button>
              </div>
              <div lang={uiLang}><ChapterNote chapterId={current.id} note={bookmarkNote} onSaved={() => mine.reload()} /></div>
              <LanguageNote version={version.data} chapterId={current.id} requested={translationRequested} onRequested={() => mine.reload()} />
              <ChapterContent version={version.data} />
              <Transition chapterId={current.id} canEdit={canEdit} chapters={list.map((c) => ({ id: c.id, title: titleOf(c.id, c.title) }))} withQ={withQ} />
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
    </ReaderTextProvider>
    </GlossaryProvider>
  );
}
