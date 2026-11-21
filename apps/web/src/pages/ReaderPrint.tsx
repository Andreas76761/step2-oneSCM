// Leseransicht (ADR-054): Handbuch drucken bzw. als PDF speichern – Deckblatt, Inhaltsverzeichnis, Kapitel, Glossar.
import { PrinterIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, currentProjectId, mediaUrl } from '../api';
import { GlossaryProvider } from '../components/Glossary';
import { Empty, ErrorBox, Md, Page, errorText, preloadMarkdown, useApp, useLoad } from '../components/ui';
import { languageLabel, ReaderTextProvider, readerTexts } from '../readerText';
import { escapeRegExp, formatDate } from '../format';
import { ChapterContent, numbered, readerSections, useReaderGlossary } from './ReaderShared';

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
  // Beschriftungen des gedruckten Handbuchs in der Druck-Sprache (ADR-074); Bedienelemente bleiben deutsch
  const rt = useMemo(() => readerTexts(lang), [lang]);
  const { t } = rt;
  const { ref } = useApp();
  const outlines = useLoad<any>('/outlines');
  const variants = (outlines.data?.items ?? []).filter((o: any) => o.latest);
  const chapters = useLoad<any>(outlineId ? `/outlines/${outlineId}/chapters` : '/chapters', [outlineId]);
  const glossary = useReaderGlossary(lang);
  // „Siehe auch“ und FAQ für alle gedruckten Kapitel – Standardhandbuch oder die Kapitel der gewählten Variante (ADR-072)
  const related = useLoad<Record<string, any>>(`/reader/related?drafts=${drafts}${lang !== 'de' ? `&lang=${lang}` : ''}${outlineId ? `&outline=${encodeURIComponent(outlineId)}` : ''}`, [outlineId, drafts, lang]);
  const layout = useLoad<any>('/layout');
  // gepflegte Übergänge „Weiter mit …“ (F-29); gedruckt nur, wenn das Folgekapitel mitgedruckt wird
  const transitions = useLoad<any[]>('/chapter-transitions');
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
  const transitionOf = (chapterId: string) => {
    const tr = transitions.data?.find((x) => x.chapterId === chapterId);
    return tr?.next && numberOf.has(tr.next.chapterId) ? { ...tr, n: numberOf.get(tr.next.chapterId)! } : null;
  };
  // Wasserzeichen „ENTWURF“ (F-28), sobald ein gedrucktes Kapitel nicht freigegeben ist
  const hasDrafts = drafts && printed.some((v) => v.status !== 'approved');
  const printedFaq = (() => {
    const seen = new Map<string, any>();
    for (const v of printed) for (const f of related.data?.[v.chapterId]?.faq ?? []) if (!seen.has(f.id)) seen.set(f.id, f);
    return [...seen.values()];
  })();
  const date = formatDate();
  const printDate = rt.date(new Date());
  const projects = useLoad<any[]>('/projects');
  const releases = useLoad<any[]>('/releases');
  const project = projects.data?.find((p) => p.id === currentProjectId()) ?? projects.data?.[0];
  const release = releases.data?.[0];
  const lay = layout.data;
  const variant = variants.find((o: any) => o.id === outlineId);
  const roleLabel = role ? ref?.roles.find((r) => r.code === role)?.label ?? role : '';
  // Deckblatt (ADR-063): Titel, Stand und Version – bei Entwürfen und Varianten „Arbeitsstand“ (Releases gelten dem Standardhandbuch)
  const released = !drafts && !outlineId && !!release;
  const edition = released ? t('version', { v: release.version }) : t('workingState');
  const bookTitle = variant?.name ?? project?.name ?? 'Benutzerhandbuch';
  // Drucken erst, wenn Kapitel, Deckblattangaben, Markdown-Renderer und Logo bereit sind – sonst entstünde ein PDF mit
  // Ersatzangaben, unformatiertem Text oder ohne Logo
  const [markdownReady, setMarkdownReady] = useState(false);
  const [logoDone, setLogoDone] = useState(false);
  useEffect(() => {
    preloadMarkdown().then(() => setMarkdownReady(true), () => setMarkdownReady(true));
  }, []);
  useEffect(() => setLogoDone(false), [layout.data?.logoSha]);
  const ready = !!versions && !!projects.data && !!releases.data && !!layout.data && !!outlines.data && (!!related.data || !!related.error) && (!!transitions.data || !!transitions.error) && markdownReady && (!layout.data?.logoSha || logoDone);
  const print = async () => {
    // letzte Absicherung: warten, bis kein Text mehr auf den Renderer wartet (höchstens 3 s)
    for (let i = 0; i < 60 && document.querySelector('.print-book .md-pending'); i++) await new Promise((r) => setTimeout(r, 50));
    window.print();
  };
  const header = [lay?.headerText || [lay?.companyName, bookTitle].filter(Boolean).join(' · '), edition, roleLabel && t('forRole', { role: roleLabel })].filter(Boolean).join(' · ');
  // „Seite X von Y“ in der Druck-Sprache: Text und Zähler als CSS-content-Liste
  const pageOf = t('pageOf').split(/(\{page\}|\{pages\})/).filter(Boolean)
    .map((part) => (part === '{page}' ? 'counter(page)' : part === '{pages}' ? 'counter(pages)' : JSON.stringify(part))).join(' ');
  // Kopf-/Fußzeile der gedruckten Seiten: @page-Randboxen erben keine Variablen, daher als eigener Stilblock.
  // Mitgerendert statt per Effekt in <head> geschrieben – so passt er immer zum angezeigten Stand (Rolle, Sprache, Layout).
  // Deckblatt ohne Kopfzeile: die :first-Regel muss nach der allgemeinen stehen, sonst gewinnt Chrome die spätere
  const footerCss = lay?.footerText ? ` @bottom-left { content: ${JSON.stringify(lay.footerText)}; font-size: 9pt; color: #555; }` : '';
  const pageCss = `@page { @top-center { content: ${JSON.stringify(header)}; }${footerCss} @bottom-right { content: ${pageOf}; } } @page :first { @top-center { content: none; } @bottom-left { content: none; } }`;
  // Glossar-Anhang: nur Begriffe, die im gedruckten Text vorkommen
  const usedGlossary = useMemo(() => {
    if (!glossary.data?.length || !printed.length) return [];
    const text = printed.flatMap((v) => readerSections(v, role || undefined).flatMap((s: any) => s.blocks.map((b: any) => b.text))).join('\n');
    return glossary.data.filter((g) => new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(g.term)}(?![\\p{L}\\p{N}])`, g.kind === 'abbreviation' ? 'u' : 'iu').test(text))
      .sort((a, b) => a.term.localeCompare(b.term, 'de'));
  }, [glossary.data, printed, role]);
  const accent = lay?.primaryColor ?? undefined;
  return (
    <GlossaryProvider entries={glossary.data}>
    <Page title="Handbuch drucken" subtitle={`${variant ? `Variante „${variant.name}“` : 'Standardhandbuch'}${roleLabel ? ` für ${roleLabel}` : ''} · ${drafts ? 'freigegebene Kapitel und Entwürfe' : 'freigegebene Kapitel'} · Stand ${date}`}
      actions={<span className="no-print row-actions">
        <Link className="btn" to="/lesen">← Leseransicht</Link>
        <button className="btn primary" disabled={!ready} onClick={() => void print()}><PrinterIcon className="btn-icon" aria-hidden="true" size={16} />Drucken / als PDF speichern</button>
      </span>}>
      <style data-print-header="">{pageCss}</style>
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
        <ReaderTextProvider lang={lang}>
        {hasDrafts && <div className="print-watermark" aria-hidden="true">{t('draftWatermark')}</div>}
        <div className={`print-book${hasDrafts ? ' print-draft' : ''}`} lang={rt.uiLang} style={accent ? ({ '--print-accent': accent } as React.CSSProperties) : undefined}>
          <section className="print-cover" aria-label={t('cover')}>
            {lay?.logoSha && <Logo sha={lay.logoSha} alt={`Logo ${lay.companyName ?? ''}`.trim()} onDone={() => setLogoDone(true)} />}
            <p className="print-cover-kicker">{lay?.companyName ? `${lay.companyName} · ` : ''}{t('manual')}</p>
            <h2 className="print-cover-title">{bookTitle}</h2>
            {lay?.coverSubtitle && <p className="print-cover-subtitle">{lay.coverSubtitle}</p>}
            <p className="print-cover-edition">{edition}{roleLabel && ` · ${t('forRole', { role: roleLabel })}`}{lang !== 'de' && ` · ${languageLabel(lang)}`}</p>
            <dl className="print-cover-meta">
              <div><dt>{t('asOf')}</dt><dd>{printDate}</dd></div>
              <div><dt>{t('chapters')}</dt><dd>{printed.length}</dd></div>
              {released && <div><dt>{t('published')}</dt><dd>{rt.date(release.createdAt)}</dd></div>}
              {drafts && <div><dt>{t('notice')}</dt><dd>{t('includesDrafts')}</dd></div>}
            </dl>
            {lay?.confidentiality && <p className="print-cover-confidential">{lay.confidentiality}</p>}
          </section>
          <nav className="print-toc" aria-label={t('printToc')}>
            <h2>{t('contents')}</h2>
            <ol>
              {printed.map((v, n) => <li key={v.id}><a href={`#k-${v.id}`}>{numbered(n + 1, v.title)}</a>{v.status !== 'approved' && t('draftSuffix')}</li>)}
              {printedFaq.length > 0 && <li><a href="#faq">{t('faqTitle')}</a></li>}
              {usedGlossary.length > 0 && <li><a href="#glossar">{t('glossary')}</a></li>}
            </ol>
          </nav>
          {printed.map((v, n) => (
            <article key={v.id} id={`k-${v.id}`} className="print-chapter reader-body" aria-label={v.title}>
              <h2 className="reader-title">{numbered(n + 1, v.title)}{v.status !== 'approved' && <span className="tag small">{t('draft')}</span>}</h2>
              {v.fallback && <p className="small muted">{v.fallback === 'outdated' ? t('printOutdated') : t('printMissing')}</p>}
              <ChapterContent version={v} role={role || undefined} />
              {transitionOf(v.chapterId) && (() => {
                const tr = transitionOf(v.chapterId)!;
                return <p className="print-transition"><a href={`#k-${printed[tr.n - 1].id}`}><strong>{t('continueWith')}</strong> {t('chapterN', { n: tr.n })} {t('quote', { x: tr.next.title.replace(/^\d+(\.\d+)*\.?\s+/, '') })}</a>{tr.text && <> – <span lang="de">{tr.text}</span></>}</p>;
              })()}
              {seeAlso(v.chapterId).length > 0 && (
                <p className="print-see"><strong>{t('printSeeAlso')}</strong> {seeAlso(v.chapterId).map((x: any, i: number) => (
                  <span key={x.chapterId}>{i > 0 && '; '}<a href={`#k-${printed[numberOf.get(x.chapterId)! - 1].id}`}>{t('chapterN', { n: numberOf.get(x.chapterId)! })} {t('quote', { x: x.title.replace(/^\d+(\.\d+)*\.?\s+/, '') })}</a></span>
                ))}</p>
              )}
            </article>
          ))}
          {printedFaq.length > 0 && (
            <section id="faq" className="print-chapter print-faq" aria-labelledby="faq-h">
              <h2 id="faq-h" className="reader-title">{t('faqTitle')}</h2>
              {printedFaq.map((f) => <div key={f.id} className="print-faq-item" lang={f.language}><h3>{f.question}</h3><Md text={f.answer} /></div>)}
            </section>
          )}
          {usedGlossary.length > 0 && (
            <section id="glossar" className="print-chapter print-glossary" aria-labelledby="glossar-h">
              <h2 id="glossar-h" className="reader-title">{t('glossary')}</h2>
              <dl>{usedGlossary.map((g) => <div key={g.term}><dt>{g.term}</dt><dd>{g.text}</dd></div>)}</dl>
            </section>
          )}
        </div>
        </ReaderTextProvider>
      )}
    </Page>
    </GlossaryProvider>
  );
}
