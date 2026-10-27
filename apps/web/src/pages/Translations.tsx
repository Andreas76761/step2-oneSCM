import { SparklesIcon } from 'lucide-react';
import { Ico, OkMark } from '../components/icons';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { del, download, get, patch, post } from '../api';
import { Card, Empty, ErrorBox, Md, Page, Status, errorText, useApp, useLoad } from '../components/ui';

/** Mehrsprachigkeit (ADR-020): Übersetzungen freigegebener Kapitel je Zielsprache */
export function TranslationsPage() {
  const { notify } = useApp();
  const chapters = useLoad<any[]>('/chapters?outline=all');
  const langs = useLoad<any>('/languages');
  const llm = useLoad<any>('/llm/status');
  const me = useLoad<any>('/me');
  const approved = (chapters.data ?? []).filter((c) => c.versions.some((v: any) => v.status === 'approved'));
  // Sprung aus einer Benachrichtigung (ADR-109): ?kapitel=…&uebersetzung=…
  const [params] = useSearchParams();
  const [chapterId, setChapterId] = useState(params.get('kapitel') ?? '');
  useEffect(() => {
    if (!chapterId && approved.length) setChapterId(approved[0].id);
  }, [approved.length]);
  const list = useLoad<any[]>(chapterId ? `/translations?chapterId=${chapterId}` : null, [chapterId]);
  const [openId, setOpenId] = useState<string | null>(params.get('uebersetzung'));
  const perms: string[] = me.data?.permissions ?? [];
  const canEdit = perms.includes('edit') || perms.includes('admin');
  const projectLangs: string[] = langs.data?.projectLanguages ?? [];
  const name = (code: string) => langs.data?.languages.find((l: any) => l.code === code)?.name ?? code;
  const current = (list.data ?? []).filter((t) => !t.outdated);
  // Übersetzungswünsche aus der Leseransicht (ADR-075)
  const requests = useLoad<any[]>('/translation-requests');
  // offene Länderreviews, bei denen ich Ansprechperson bzw. Vertretung bin (ADR-108, O-09)
  const mine = useLoad<{ items: any[] }>('/translation-reviews/mine');
  const create = async (language: string, forChapter = chapterId) => {
    try {
      const t = await post<any>('/translations', { chapterId: forChapter, language });
      notify(`Übersetzung ${name(language)} angelegt.`);
      if (forChapter !== chapterId) setChapterId(forChapter);
      else list.reload();
      requests.reload();
      setOpenId(t.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Page title="Übersetzungen" subtitle="Freigegebene deutsche Kapitel in die Zielsprachen des Projekts übersetzen – mit Übersetzungsspeicher, Satz-Zuordnung, Prüfungen, Länderreview und Freigabe je Sprache"
      actions={<span className="row-actions"><Link className="btn small" to="/uebersetzungen/speicher">Übersetzungsspeicher</Link><Link className="btn small" to="/uebersetzungen/glossar">Glossar je Sprache</Link></span>}>
      {!projectLangs.length && <div className="alert">Für dieses Projekt sind keine Zielsprachen festgelegt. Die Administration legt sie unter <Link to="/projekte">Projekte</Link> fest.</div>}
      {!!mine.data?.items.length && (
        <Card title={`Meine Länderreviews (${mine.data.items.length})`}>
          <ul className="plain" aria-label="Meine Länderreviews">
            {mine.data.items.map((r) => (
              <li key={r.id}>
                <button type="button" className="linklike" onClick={() => (setChapterId(r.chapterId), setOpenId(r.translationId))}>{r.chapterTitle}</button>
                <span className="small muted"> · {name(r.language)}{r.market ? ` · Markt ${r.market}` : ''}{r.asDeputy ? ` · als Vertretung für ${r.reviewerName}` : ''} · seit {new Date(r.requestedAt).toLocaleDateString('de-DE')}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {!!requests.data?.length && (
        <Card title={`Gewünschte Übersetzungen (${requests.data.length})`}>
          <p className="small muted">Leserinnen und Leser haben diese Kapitel in der Leseransicht angefordert – meistgewünschte zuerst. Erledigt ist ein Wunsch, sobald die Übersetzung der aktuellen Fassung freigegeben ist.</p>
          <table className="table request-list">
            <thead><tr><th>Kapitel</th><th>Sprache</th><th>Wünsche</th><th>Stand</th><th>Zuletzt</th><th /></tr></thead>
            <tbody>
              {requests.data.map((r) => (
                <tr key={`${r.chapterId}.${r.language}`}>
                  <td>{r.title}</td>
                  <td>{r.languageName}</td>
                  <td className="count">{r.count}</td>
                  <td>{r.state === 'in_progress' ? <span className="tag">in Arbeit</span> : r.state === 'outdated' ? <span className="tag st-needs_regeneration">veraltet</span> : <span className="tag">fehlt</span>}</td>
                  <td className="small">{new Date(r.lastRequestedAt).toLocaleDateString('de-DE')}</td>
                  <td>
                    {canEdit && r.state !== 'in_progress' && approved.some((c) => c.id === r.chapterId)
                      ? <button className="btn small" aria-label={`„${r.title}“ übersetzen (${r.languageName})`} onClick={() => create(r.language, r.chapterId)}>Übersetzen</button>
                      : <button className="btn small" aria-label={`${r.title} öffnen`} onClick={() => (setChapterId(r.chapterId), setOpenId(null))}>Öffnen</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <Card title="Kapitel">
        {!approved.length ? <Empty>Noch kein Kapitel freigegeben – übersetzt werden nur freigegebene Versionen.</Empty> : (
          <div className="filters">
            <select aria-label="Kapitel für Übersetzungen" value={chapterId} onChange={(e) => (setChapterId(e.target.value), setOpenId(null))}>
              {approved.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            {canEdit && projectLangs.filter((l) => !current.some((t) => t.language === l)).map((l) => (
              <button key={l} className="btn" onClick={() => create(l)}>+ {name(l)}</button>
            ))}
          </div>
        )}
        <ErrorBox error={list.error} />
        {!!list.data?.length && (
          <table className="table">
            <thead><tr><th>Sprache</th><th>Titel</th><th>Quelle</th><th>Status</th><th>Fortschritt</th><th /></tr></thead>
            <tbody>
              {list.data.map((t) => (
                <tr key={t.id} aria-current={openId === t.id ? 'true' : undefined}>
                  <td>{t.languageName}</td>
                  <td>{t.title ?? <span className="muted">–</span>}</td>
                  <td>Version {t.sourceVersionNo}{t.outdated && <> <span className="tag st-needs_regeneration">veraltet</span></>}</td>
                  <td><Status s={t.status} />{t.jobStatus && t.jobStatus !== 'completed' && <> <Status s={t.jobStatus} /></>}</td>
                  <td>{t.translated} / {t.blocks}{t.flagged > 0 && <> · <span className="sev-text">{t.flagged} mit Befund</span></>}</td>
                  <td><button className="btn small" onClick={() => setOpenId(openId === t.id ? null : t.id)}>{openId === t.id ? 'Schließen' : 'Öffnen'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {openId && <TranslationEditor id={openId} me={me.data} canEdit={canEdit} canApprove={perms.includes('approve') || perms.includes('admin')} llm={llm.data} langs={langs.data} onChanged={() => list.reload()} />}
    </Page>
  );
}

const MODE_LABEL = (b: any) => (b.mode === 'memory' ? `Speicher ${Math.round((b.tmScore ?? 1) * 100)} %`
  : b.mode === 'imported' ? 'Import (Büro)'
  : b.mode === 'machine' ? (b.provider === 'rules' ? 'Regeln de-CH' : b.provider === 'variant' ? 'aus Französisch' : `KI (${b.model})`)
  : b.mode === 'edited' ? 'bearbeitet' : 'offen');

function TranslationEditor({ id, me, canEdit, canApprove, llm, langs, onChanged }: { id: string; me: any; canEdit: boolean; canApprove: boolean; llm: any; langs: any; onChanged: () => void }) {
  const issueLabels: Record<string, string> = langs?.issueLabels ?? {};
  const { notify } = useApp();
  const [memory, setMemory] = useState<Record<string, any[]>>({});
  const t = useLoad<any>(`/translations/${id}`, [id]);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const d = t.data;
  const running = d && ['queued', 'processing'].includes(d.jobStatus);
  useEffect(() => {
    if (d) setTitle(d.title ?? '');
  }, [d?.title]);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => t.reload(), 1500);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (d && !running) onChanged();
  }, [d?.jobStatus]);
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      t.reload();
      onChanged();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  if (!d) return <ErrorBox error={t.error} />;
  const draft = d.status === 'draft';
  return (
    <Card title={`${d.languageName}: ${d.sourceTitle}`}>
      <div className="form-row">
        <label>Titel in {d.languageName}
          <input value={title} disabled={!draft || !canEdit} onChange={(e) => setTitle(e.target.value)} aria-label="Übersetzter Kapiteltitel" />
        </label>
        {draft && canEdit && <button className="btn small" disabled={!title.trim() || title === d.title} onClick={() => act(() => patch(`/translations/${id}`, { title }), 'Titel gespeichert.')}>Titel speichern</button>}
        {draft && canEdit && d.ruleBased && (
          <button className="btn" disabled={running} onClick={() => void act(() => post(`/translations/${id}/machine`, {}), 'Schweizer Hochdeutsch nach Regeln übernommen (ss statt ß, «…»).')}>
            {running ? 'wird übernommen …' : 'Aus dem Deutschen nach Schweizer Regeln übernehmen'}
          </button>
        )}
        {draft && canEdit && !d.ruleBased && llm?.enabled && (
          <button className="btn" disabled={running} title="Zuerst 100-%-Treffer aus dem Übersetzungsspeicher, dann KI" onClick={() => {
            if (llm.external && !confirm(`Die deutschen Absätze werden zur Übersetzung an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return;
            void act(() => post(`/translations/${id}/machine`, {}), 'KI-Übersetzung gestartet.');
          }}>{running ? 'KI übersetzt …' : <><Ico icon={SparklesIcon} />Unübersetzte Absätze mit KI übersetzen</>}</button>
        )}
        <button className="btn small" onClick={() => download(`/api/v1/translations/${id}/export?format=md`, `${d.language}.md`).catch((e) => notify(errorText(e), 'error'))}>Export Markdown</button>
        <button className="btn small" onClick={() => download(`/api/v1/translations/${id}/export?format=html`, `${d.language}.html`).catch((e) => notify(errorText(e), 'error'))}>Export HTML</button>
      </div>
      {d.jobError && <p className="small sev-text">{d.jobError}</p>}
      <OfficeFiles id={id} language={d.language} draft={draft} canEdit={canEdit} onDone={() => (t.reload(), onChanged())} />
      {d.imageHints?.length > 0 && (
        <div className="alert warning" role="status">
          <strong>Bilder ohne Fassung in {d.languageName}:</strong>{' '}
          {d.imageHints.map((h: any) => `${h.imageNo ?? 'Bild'}${h.title ? ` „${h.title}“` : ''} (Oberfläche ${h.imageLanguage.toUpperCase()})`).join(', ')}.{' '}
          Im <Link to="/bildarchiv">Bildarchiv</Link> eine Variante in der Zielsprache verknüpfen – sonst erscheint das Bild in der Ausgangssprache.
        </div>
      )}
      {d.sections.map((s: any) => (
        <section key={s.code} className="tr-section">
          <h3>{s.title} <span className="muted small">→ {s.translatedTitle}</span></h3>
          {s.blocks.map((b: any) => (
            <div key={b.id} className="tr-row">
              <div className="tr-source" lang="de"><Md text={b.sourceText} /></div>
              <div className="tr-target" lang={d.language}>
                {draft && canEdit ? (
                  <>
                    <textarea rows={Math.max(3, (texts[b.id] ?? b.text ?? '').split('\n').length + 1)} value={texts[b.id] ?? b.text ?? ''} onChange={(e) => setTexts({ ...texts, [b.id]: e.target.value })} aria-label={`Übersetzung: ${b.sourceText.slice(0, 40)}`} />
                    <button className="btn small" disabled={!(texts[b.id] ?? '').trim() || texts[b.id] === b.text} onClick={() => act(() => patch(`/translation-blocks/${b.id}`, { text: texts[b.id] }), 'Übersetzung gespeichert.')}>Speichern</button>
                    {b.mode !== 'memory' && (
                      <button className="btn small" aria-label={`Vorschläge aus dem Speicher: ${b.sourceText.slice(0, 40)}`} onClick={async () => {
                        try {
                          const r = await get<any>(`/translation-blocks/${b.id}/memory`);
                          setMemory({ ...memory, [b.id]: r.matches });
                          if (!r.matches.length) notify('Keine ähnlichen Segmente im Speicher (ab 75 %).');
                        } catch (e) {
                          notify(errorText(e), 'error');
                        }
                      }}>Vorschläge aus dem Speicher</button>
                    )}
                    {memory[b.id]?.length > 0 && (
                      <ul className="small tm-matches" aria-label="Treffer im Übersetzungsspeicher">
                        {memory[b.id].map((m: any) => (
                          <li key={m.id}>
                            <span className="tag small">{Math.round(m.score * 100)} %</span> {m.targetText}
                            <span className="muted"> – zu „{m.sourceText.slice(0, 60)}“{m.status === 'review' ? ' (zu prüfen)' : ''}</span>{' '}
                            <button className="btn small" onClick={() => setTexts({ ...texts, [b.id]: m.targetText })}>Übernehmen</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : b.text ? <Md text={b.text} /> : <span className="muted">nicht übersetzt</span>}
                <div className="small">
                  <span className="tag">{MODE_LABEL(b)}</span>
                  {b.issues.filter((x: string) => x !== 'empty' || b.text).map((x: string) => <span key={x} className="sev-text"> ✖ {issueLabels[x] ?? x}</span>)}
                  {b.sentences && <span className="muted"> · {b.sentences.length} Sätze der Quelle zugeordnet</span>}
                </div>
                {/* Sprachprüfung der Zielsprache (ADR-097): Englisch mit a/an, „I“, Rechtschreibung; sonst sprachneutrale Regeln und eigene Regeln der Sprache */}
                {b.style?.length > 0 && (
                  <ul className="small tr-style" aria-label="Sprachprüfung">
                    {b.style.slice(0, 8).map((x: any, i: number) => <li key={i}><span className={`tag small ${x.severity === 'warning' ? 'sev-medium' : ''}`}>{x.label}</span> {x.message}</li>)}
                    {b.style.length > 8 && <li className="muted">… und {b.style.length - 8} weitere</li>}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      ))}
      <ReviewPanel translation={d} me={me} canEdit={canEdit} mqm={langs?.mqm} onChanged={() => t.reload()} />
      <BackcheckPanel translation={d} canEdit={canEdit && llm?.enabled} onChanged={() => t.reload()} />
      {draft && canApprove && (
        <div className="form-row">
          <label>Kommentar zur Freigabe <input value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Kommentar zur Freigabe der Übersetzung" /></label>
          <button className="btn primary" disabled={!comment.trim()} onClick={() => act(() => post(`/translations/${id}/approve`, { comment }), `Übersetzung ${d.languageName} freigegeben.`)}>Übersetzung freigeben</button>
        </div>
      )}
      {!draft && <p className="small">Freigegeben von {d.approvedBy} am {new Date(d.approvedAt).toLocaleString('de-DE')}.</p>}
    </Card>
  );
}

/** XLIFF 1.2 und Excel für Übersetzungsbüros (U-05): Export, Rückimport mit Vorschau und Prüfung */
function OfficeFiles({ id, language, draft, canEdit, onDone }: { id: string; language: string; draft: boolean; canEdit: boolean; onDone: () => void }) {
  const { notify } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const send = async (apply: boolean) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await post<any>(`/translations/${id}/file${apply ? '?apply=true' : ''}`, fd);
      if (apply) {
        notify(`${r.updated} Absätze aus „${file.name}“ übernommen${r.withIssues ? `, ${r.withIssues} mit Prüfbefund` : ''}.`);
        setPreview(null);
        setFile(null);
        onDone();
      } else setPreview(r);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <details className="tr-office">
      <summary>Übersetzungsbüro: XLIFF 1.2 oder Excel</summary>
      <div className="form-row">
        <button className="btn small" onClick={() => download(`/api/v1/translations/${id}/file?format=xlf`, `uebersetzung-${language}.xlf`).catch((e) => notify(errorText(e), 'error'))}>XLIFF 1.2 herunterladen</button>
        <button className="btn small" onClick={() => download(`/api/v1/translations/${id}/file?format=xlsx`, `uebersetzung-${language}.xlsx`).catch((e) => notify(errorText(e), 'error'))}>Excel herunterladen</button>
        {draft && canEdit && (
          <>
            <label className="small">Rückgabe des Büros (.xlf, .xlsx)
              <input type="file" accept=".xlf,.xliff,.xml,.xlsx,.csv" onChange={(e) => (setFile(e.target.files?.[0] ?? null), setPreview(null))} />
            </label>
            <button className="btn small" disabled={!file} onClick={() => void send(false)}>Prüfen</button>
          </>
        )}
      </div>
      {preview && (
        <div className="alert" role="status">
          {preview.units} Einheiten: {preview.updated} neu übersetzt{preview.withIssues ? ` (${preview.withIssues} mit Prüfbefund)` : ''}, {preview.unchanged} unverändert, {preview.empty} leer
          {preview.sourceChanged ? `, ${preview.sourceChanged} mit geändertem deutschen Text (nicht übernommen)` : ''}{preview.unknown ? `, ${preview.unknown} unbekannt` : ''}.{' '}
          <button className="btn small primary" disabled={!preview.updated} onClick={() => void send(true)}>Übernehmen</button>
        </div>
      )}
    </details>
  );
}

/** Länderreview mit MQM-Fehlerpunkten (U-03) */
function ReviewPanel({ translation: d, me, canEdit, mqm, onChanged }: { translation: any; me: any; canEdit: boolean; mqm: any; onChanged: () => void }) {
  const { notify } = useApp();
  const people = useLoad<any[]>('/collaborators');
  const [form, setForm] = useState({ reviewer: '', market: '' });
  const [err, setErr] = useState({ blockId: '', category: 'accuracy', severity: 'minor', note: '' });
  const [comment, setComment] = useState('');
  const r = d.review;
  // Vertretung der Ansprechperson des Marktes prüft ebenso (ADR-108, O-09)
  const isReviewer = r && (r.reviewer === me?.id || r.deputy === me?.id || me?.permissions?.includes('admin'));
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      onChanged();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const blocks = d.sections.flatMap((s: any) => s.blocks);
  const draft = d.status === 'draft';
  return (
    <section className="tr-review" aria-labelledby={`rev-${d.id}`}>
      <h3 id={`rev-${d.id}`}>Länderreview</h3>
      {!r ? <p className="small muted">Noch kein Länderreview angefordert. Optional: eine Prüferin bzw. ein Prüfer je Sprache und Markt prüft vor der Freigabe (MQM, bestanden bis 5 Punkte je 1 000 Wörter).</p> : (
        <>
          <p className="small">
            <strong>{r.status === 'open' ? 'offen' : r.status === 'returned' ? 'zurück an Übersetzung' : r.status === 'approved' ? 'vom Land freigegeben' : r.status}</strong>
            {' '}– {r.reviewerName}{r.deputyName ? `, Vertretung ${r.deputyName}` : ''}{r.market ? ` (${r.market}${r.assignedBy === 'market' ? ', Ansprechperson des Marktes' : ''})` : ''} · {r.score.points} MQM-Punkte bei {r.score.words} Wörtern = {r.score.per1000 === null ? '–' : String(r.score.per1000).replace('.', ',')} je 1 000 Wörter
            {' '}(<span className={r.score.pass ? '' : 'sev-text'}>{r.score.pass ? 'bestanden' : `über ${r.threshold}`}</span>){r.comment ? ` · „${r.comment}“` : ''}
          </p>
          {r.errors.length > 0 && (
            <table className="table compact">
              <caption className="sr-only">Erfasste Fehler des Länderreviews</caption>
              <thead><tr><th scope="col">Absatz</th><th scope="col">Kategorie</th><th scope="col">Schwere</th><th scope="col">Beschreibung</th><th scope="col"><span className="sr-only">Aktion</span></th></tr></thead>
              <tbody>
                {r.errors.map((e: any) => (
                  <tr key={e.id}>
                    <td className="small">{e.blockId ? (blocks.find((b: any) => b.id === e.blockId)?.sourceText ?? '').slice(0, 50) : 'allgemein'}</td>
                    <td>{e.categoryLabel}</td><td>{e.severityLabel} ({e.points})</td><td>{e.note}</td>
                    <td>{isReviewer && r.status === 'open' && <button className="btn small" aria-label={`Fehler entfernen: ${e.note}`} onClick={() => void act(() => del(`/translation-reviews/${r.id}/errors/${e.id}`), 'Fehler entfernt.')}>Entfernen</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {isReviewer && r.status === 'open' && (
            <fieldset className="tr-review-form">
              <legend>Fehler erfassen (MQM)</legend>
              <div className="filters">
                <label>Absatz
                  <select value={err.blockId} onChange={(e) => setErr({ ...err, blockId: e.target.value })}>
                    <option value="">allgemein</option>
                    {blocks.map((b: any) => <option key={b.id} value={b.id}>{b.sourceText.slice(0, 50)}</option>)}
                  </select>
                </label>
                <label>Kategorie
                  <select value={err.category} onChange={(e) => setErr({ ...err, category: e.target.value })}>
                    {Object.entries(mqm?.categories ?? {}).map(([k, v]) => <option key={k} value={k}>{String(v)}</option>)}
                  </select>
                </label>
                <label>Schwere
                  <select value={err.severity} onChange={(e) => setErr({ ...err, severity: e.target.value })}>
                    {Object.entries(mqm?.severities ?? {}).map(([k, v]) => <option key={k} value={k}>{String(v)}</option>)}
                  </select>
                </label>
                <label className="grow">Beschreibung <input value={err.note} maxLength={1000} onChange={(e) => setErr({ ...err, note: e.target.value })} /></label>
                <button className="btn small" disabled={!err.note.trim()} onClick={() => void act(() => post(`/translation-reviews/${r.id}/errors`, err), 'Fehler erfasst.').then(() => setErr({ ...err, note: '' }))}>Erfassen</button>
              </div>
              <div className="filters">
                <label className="grow">Kommentar <input value={comment} maxLength={2000} onChange={(e) => setComment(e.target.value)} /></label>
                <button className="btn small" onClick={() => void act(() => post(`/translation-reviews/${r.id}/decision`, { decision: 'return', comment }), 'Zurück an Übersetzung.')}>Zurück an Übersetzung</button>
                <button className="btn small primary" disabled={!r.score.pass} onClick={() => void act(() => post(`/translation-reviews/${r.id}/decision`, { decision: 'approve', comment }), 'Vom Land freigegeben.')}>Freigeben (Land)</button>
              </div>
            </fieldset>
          )}
        </>
      )}
      {draft && canEdit && (!r || r.status === 'returned') && (
        <div className="filters">
          <label>Prüferin / Prüfer
            <select value={form.reviewer} onChange={(e) => setForm({ ...form, reviewer: e.target.value })}>
              <option value="">automatisch – Ansprechperson des Marktes</option>
              {(people.data ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label>Markt (Ländercode) <input value={form.market} size={4} maxLength={2} placeholder="CH" onChange={(e) => setForm({ ...form, market: e.target.value.toUpperCase() })} /></label>
          <button className="btn small" disabled={!form.reviewer && form.market.length !== 2} onClick={() => void act(() => post(`/translations/${d.id}/reviews`, { reviewer: form.reviewer || undefined, market: form.market || undefined }), r ? 'Neue Runde des Länderreviews angefordert.' : 'Länderreview angefordert.')}>
            {r ? 'Erneut anfordern' : 'Länderreview anfordern'}
          </button>
        </div>
      )}
    </section>
  );
}

/** Rückübersetzung der Sicherheitshinweise als Stichprobe (U-06) */
function BackcheckPanel({ translation: d, canEdit, onChanged }: { translation: any; canEdit: boolean; onChanged: () => void }) {
  const { notify } = useApp();
  const [busy, setBusy] = useState(false);
  const b = d.backcheck;
  if (d.ruleBased) return null;
  return (
    <section className="tr-backcheck" aria-labelledby={`bck-${d.id}`}>
      <h3 id={`bck-${d.id}`}>Rückübersetzung der Sicherheitshinweise</h3>
      {b ? (
        <>
          <p className="small">Stichprobe vom {new Date(b.createdAt).toLocaleString('de-DE')}: {b.checked} von {b.candidates} Hinweisen geprüft, {b.passed} stimmen mit dem Deutschen überein, <span className={b.failed ? 'sev-text' : ''}>{b.failed} weichen ab</span> (Schwelle {Math.round(b.threshold * 100)} %).</p>
          <ul className="small">
            {b.sample.map((x: any) => (
              <li key={x.blockId}>{x.ok === null ? '–' : <OkMark ok={x.ok} />} „{x.source.slice(0, 80)}“ → zurück: „{x.back ?? x.skipped}“{x.similarity !== null ? ` (${Math.round(x.similarity * 100)} %)` : ''}</li>
            ))}
          </ul>
        </>
      ) : <p className="small muted">Noch keine Rückübersetzung. 10 % der übersetzten Warnhinweise (mindestens einer) werden ins Deutsche zurückübersetzt und verglichen.</p>}
      {canEdit && (
        <button className="btn small" disabled={busy} onClick={async () => {
          setBusy(true);
          try {
            const r = await post<any>(`/translations/${d.id}/backcheck`, {});
            notify(`Rückübersetzung: ${r.passed} von ${r.checked} stimmen überein.`);
            onChanged();
          } catch (e) {
            notify(errorText(e), 'error');
          } finally {
            setBusy(false);
          }
        }}>Stichprobe rückübersetzen</button>
      )}
    </section>
  );
}
