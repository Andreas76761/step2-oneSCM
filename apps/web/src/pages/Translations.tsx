import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { download, patch, post } from '../api';
import { Card, Empty, ErrorBox, Md, Page, Status, errorText, useApp, useLoad } from '../components/ui';

/** Mehrsprachigkeit (ADR-020): Übersetzungen freigegebener Kapitel je Zielsprache */
export function TranslationsPage() {
  const { notify } = useApp();
  const chapters = useLoad<any[]>('/chapters');
  const langs = useLoad<any>('/languages');
  const llm = useLoad<any>('/llm/status');
  const me = useLoad<any>('/me');
  const approved = (chapters.data ?? []).filter((c) => c.versions.some((v: any) => v.status === 'approved'));
  const [chapterId, setChapterId] = useState('');
  useEffect(() => {
    if (!chapterId && approved.length) setChapterId(approved[0].id);
  }, [approved.length]);
  const list = useLoad<any[]>(chapterId ? `/translations?chapterId=${chapterId}` : null, [chapterId]);
  const [openId, setOpenId] = useState<string | null>(null);
  const perms: string[] = me.data?.permissions ?? [];
  const canEdit = perms.includes('edit') || perms.includes('admin');
  const projectLangs: string[] = langs.data?.projectLanguages ?? [];
  const name = (code: string) => langs.data?.languages.find((l: any) => l.code === code)?.name ?? code;
  const current = (list.data ?? []).filter((t) => !t.outdated);
  const create = async (language: string) => {
    try {
      const t = await post<any>('/translations', { chapterId, language });
      notify(`Übersetzung ${name(language)} angelegt.`);
      list.reload();
      setOpenId(t.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Page title="Übersetzungen" subtitle="Freigegebene deutsche Kapitel in die Zielsprachen des Projekts übersetzen – mit Satz-Zuordnung und Freigabe je Sprache">
      {!projectLangs.length && <div className="alert">Für dieses Projekt sind keine Zielsprachen festgelegt. Die Administration legt sie unter <Link to="/projekte">Projekte</Link> fest.</div>}
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
      {openId && <TranslationEditor id={openId} canEdit={canEdit} canApprove={perms.includes('approve') || perms.includes('admin')} llm={llm.data} issueLabels={langs.data?.issueLabels ?? {}} onChanged={() => list.reload()} />}
    </Page>
  );
}

function TranslationEditor({ id, canEdit, canApprove, llm, issueLabels, onChanged }: { id: string; canEdit: boolean; canApprove: boolean; llm: any; issueLabels: Record<string, string>; onChanged: () => void }) {
  const { notify } = useApp();
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
        {draft && canEdit && llm?.enabled && (
          <button className="btn" disabled={running} onClick={() => {
            if (llm.external && !confirm(`Die deutschen Absätze werden zur Übersetzung an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return;
            void act(() => post(`/translations/${id}/machine`, {}), 'KI-Übersetzung gestartet.');
          }}>{running ? 'KI übersetzt …' : '✨ Unübersetzte Absätze mit KI übersetzen'}</button>
        )}
        <button className="btn small" onClick={() => download(`/api/v1/translations/${id}/export?format=md`, `${d.language}.md`).catch((e) => notify(errorText(e), 'error'))}>Export Markdown</button>
        <button className="btn small" onClick={() => download(`/api/v1/translations/${id}/export?format=html`, `${d.language}.html`).catch((e) => notify(errorText(e), 'error'))}>Export HTML</button>
      </div>
      {d.jobError && <p className="small sev-text">{d.jobError}</p>}
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
                  </>
                ) : b.text ? <Md text={b.text} /> : <span className="muted">nicht übersetzt</span>}
                <div className="small">
                  <span className="tag">{b.mode === 'machine' ? `KI (${b.model})` : b.mode === 'edited' ? 'bearbeitet' : 'offen'}</span>
                  {b.issues.filter((x: string) => x !== 'empty' || b.text).map((x: string) => <span key={x} className="sev-text"> ✖ {issueLabels[x] ?? x}</span>)}
                  {b.sentences && <span className="muted"> · {b.sentences.length} Sätze der Quelle zugeordnet</span>}
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}
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
