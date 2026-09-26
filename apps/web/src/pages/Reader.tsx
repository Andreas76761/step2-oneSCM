// Leseransicht (ADR-054): das Handbuch so lesen, wie Endnutzer es sehen – Inhaltsverzeichnis, Schritte zum Abhaken,
// Hinweise hervorgehoben – und je Kapitel „War das hilfreich?“ beantworten.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, currentProjectId, post } from '../api';
import { Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

const CALLOUT: Record<string, { icon: string; label: string }> = {
  tip: { icon: '💡', label: 'Tipp' },
  warning: { icon: '⚠️', label: 'Achtung' },
  note: { icon: 'ℹ️', label: 'Hinweis' },
};
// Verwaltungsabschnitt und Lückenhinweise gehören nicht in die Leseransicht
const HIDDEN_SECTIONS = new Set(['status']);

/** **fett** und `Code` innerhalb einer Zeile */
function inline(t: string): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part);
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
  return (
    <>
      {intro.length > 0 && <p>{inline(intro.join(' '))}</p>}
      <ol className="reader-steps">
        {items.map((t, i) => (
          <li key={i} className={done.includes(i) ? 'done' : ''}>
            <label><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /> <span>{inline(t)}</span></label>
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

/** Kapitelinhalt in Lesedarstellung (Leseransicht und Druckansicht) */
export function ChapterContent({ version }: { version: any }) {
  return (
    <>
      {version.sections.filter((s: any) => !HIDDEN_SECTIONS.has(s.code) && s.blocks.some((b: any) => b.kind !== 'gap')).map((s: any) => (
        <section key={s.code} className="reader-section">
          <h3>{s.title}</h3>
          {s.blocks.filter((b: any) => b.kind !== 'gap').map((b: any) => {
            if (CALLOUT[b.kind]) return <div key={b.id} className={`callout ${b.kind}`}><strong><span aria-hidden="true">{CALLOUT[b.kind].icon}</span> {CALLOUT[b.kind].label}:</strong> <Md text={b.text} /></div>;
            if (s.code === 'steps' && b.kind === 'list') return <StepList key={b.id} versionId={version.id} blockId={b.id} text={b.text} />;
            return <Md key={b.id} text={b.text} />;
          })}
        </section>
      ))}
    </>
  );
}

export function ReaderPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const chapters = useLoad<any[]>('/chapters');
  const [drafts, setDrafts] = useState(false);
  const [filter, setFilter] = useState('');
  // je Kapitel die anzuzeigende Version: freigegeben, sonst (mit „Entwürfe einblenden“) die neueste
  const list = useMemo(() => (chapters.data ?? []).map((c) => {
    // „Entwürfe einblenden“: jeweils die neueste Version (Vorschau); sonst die freigegebene
    const shown = drafts ? c.versions[0] : c.versions.find((v: any) => v.status === 'approved');
    return shown ? { id: c.id as string, title: c.title as string, version: shown, draft: shown.status !== 'approved' } : null;
  }).filter((x): x is NonNullable<typeof x> => !!x), [chapters.data, drafts]);
  const visible = list.filter((c) => c.title.toLowerCase().includes(filter.trim().toLowerCase()));
  const current = list.find((c) => c.id === chapterId) ?? null;
  const version = useLoad<any>(current ? `/chapter-versions/${current.version.id}` : null, [current?.version.id]);
  const idx = current ? list.indexOf(current) : -1;
  return (
    <Page title="Leseransicht" subtitle="Das Handbuch so lesen, wie Ihre Leserinnen und Leser es sehen"
      actions={<span className="no-print row-actions">
        {current && <button className="btn" onClick={() => window.print()}>🖨️ Kapitel drucken</button>}
        <Link className="btn" to={`/lesen/druck${drafts ? '?entwuerfe=1' : ''}`}>📄 Ganzes Handbuch drucken</Link>
      </span>}>
      <ErrorBox error={chapters.error} />
      <div className="reader">
        <nav className="reader-toc card no-print" aria-label="Inhaltsverzeichnis">
          <h2>Inhalt</h2>
          <label className="block">Kapitel filtern <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="z. B. Vertrag" /></label>
          <label className="inline small"><input type="checkbox" checked={drafts} onChange={(e) => setDrafts(e.target.checked)} /> Entwürfe einblenden</label>
          {chapters.data && !list.length && <p className="small muted">Noch keine freigegebenen Kapitel. {drafts ? '' : 'Blenden Sie Entwürfe ein, um sie vorab zu lesen.'}</p>}
          <ol className="plain">
            {visible.map((c) => (
              <li key={c.id}>
                <Link to={`/lesen/${c.id}`} aria-current={c.id === chapterId ? 'page' : undefined} className={c.id === chapterId ? 'active' : ''}>{c.title}</Link>
                {c.draft && <span className="tag small">Entwurf</span>}
              </li>
            ))}
          </ol>
        </nav>
        <article className="reader-body card" aria-label={current?.title ?? 'Kapitel'}>
          {!current ? <Empty>Wählen Sie links ein Kapitel.</Empty> : !version.data ? <ErrorBox error={version.error} /> : (
            <>
              <h2 className="reader-title">{current.title}{current.draft && <span className="tag small">Entwurf – noch nicht freigegeben</span>}</h2>
              <ChapterContent version={version.data} />
              <Feedback chapterId={current.id} versionId={version.data.id} />
              <div className="row-actions reader-nav no-print">
                {idx > 0 && <button className="btn" onClick={() => navigate(`/lesen/${list[idx - 1].id}`)}>← {list[idx - 1].title}</button>}
                {idx >= 0 && idx < list.length - 1 && <button className="btn" onClick={() => navigate(`/lesen/${list[idx + 1].id}`)}>{list[idx + 1].title} →</button>}
              </div>
            </>
          )}
        </article>
      </div>
    </Page>
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

/** Druckansicht (ADR-060): ganzes Handbuch mit Inhaltsverzeichnis, je Kapitel neue Seite – über den Browser als PDF speichern */
export function PrintPage() {
  const drafts = new URLSearchParams(window.location.search).has('entwuerfe');
  const chapters = useLoad<any[]>('/chapters');
  const [versions, setVersions] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!chapters.data) return;
    const shown = chapters.data.map((c) => (drafts ? c.versions[0] : c.versions.find((v: any) => v.status === 'approved'))).filter(Boolean);
    Promise.all(shown.map((v: any) => api<any>('GET', `/chapter-versions/${v.id}`))).then(setVersions).catch((e) => setError(errorText(e)));
  }, [chapters.data, drafts]);
  const date = new Date().toLocaleDateString('de-DE');
  const projects = useLoad<any[]>('/projects');
  const releases = useLoad<any[]>('/releases');
  const project = projects.data?.find((p) => p.id === currentProjectId()) ?? projects.data?.[0];
  const release = releases.data?.[0];
  // Deckblatt (ADR-063): Titel, Stand und Version – bei Entwürfen immer „Arbeitsstand“, da nicht veröffentlicht
  const edition = !drafts && release ? `Version ${release.version}` : 'Arbeitsstand';
  const bookTitle = project?.name ?? 'Benutzerhandbuch';
  useEffect(() => {
    // Kopfzeile der gedruckten Seiten: @page-Randboxen erben keine Variablen, daher als eigener Stilblock
    const style = document.createElement('style');
    style.dataset.printHeader = '';
    // Deckblatt ohne Kopfzeile: die :first-Regel muss nach der allgemeinen stehen, sonst gewinnt Chrome die spätere
    style.textContent = `@page { @top-center { content: ${JSON.stringify(`${bookTitle} · ${edition}`)}; } } @page :first { @top-center { content: none; } }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [bookTitle, edition]);
  return (
    <Page title="Handbuch drucken" subtitle={`${drafts ? 'Freigegebene Kapitel und Entwürfe' : 'Freigegebene Kapitel'} · Stand ${date}`}
      actions={<span className="no-print row-actions">
        <Link className="btn" to="/lesen">← Leseransicht</Link>
        <button className="btn primary" disabled={!versions} onClick={() => window.print()}>🖨️ Drucken / als PDF speichern</button>
      </span>}>
      <ErrorBox error={error ?? chapters.error} />
      <p className="small muted no-print">Tipp: Im Druckdialog „Als PDF speichern“ wählen. Das Handbuch beginnt mit einem Deckblatt; jedes Kapitel beginnt auf einer neuen Seite, unten steht „Seite X von Y“. Schritte erscheinen mit Kästchen zum Abhaken.</p>
      {!versions ? <p className="muted">Lade …</p> : !versions.length ? <Empty>Noch keine freigegebenen Kapitel.</Empty> : (
        <div className="print-book">
          <section className="print-cover" aria-label="Deckblatt">
            <p className="print-cover-kicker">Benutzerhandbuch</p>
            <h2 className="print-cover-title">{bookTitle}</h2>
            <p className="print-cover-edition">{edition}</p>
            <dl className="print-cover-meta">
              <div><dt>Stand</dt><dd>{date}</dd></div>
              <div><dt>Kapitel</dt><dd>{versions.length}</dd></div>
              {!drafts && release && <div><dt>Veröffentlicht</dt><dd>{new Date(release.createdAt).toLocaleDateString('de-DE')}</dd></div>}
              {drafts && <div><dt>Hinweis</dt><dd>enthält nicht freigegebene Entwürfe</dd></div>}
            </dl>
          </section>
          <nav className="print-toc" aria-label="Inhaltsverzeichnis des Handbuchs">
            <h2>Inhalt</h2>
            <ol>{versions.map((v, n) => <li key={v.id}><a href={`#k-${v.id}`}>{n + 1}. {v.title}</a>{v.status !== 'approved' && ' (Entwurf)'}</li>)}</ol>
          </nav>
          {versions.map((v, n) => (
            <article key={v.id} id={`k-${v.id}`} className="print-chapter reader-body" aria-label={v.title}>
              <h2 className="reader-title">{n + 1}. {v.title}{v.status !== 'approved' && <span className="tag small">Entwurf</span>}</h2>
              <ChapterContent version={v} />
            </article>
          ))}
        </div>
      )}
    </Page>
  );
}
