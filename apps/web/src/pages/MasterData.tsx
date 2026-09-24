// Stammdaten (ADR-032): Abkürzungen, Glossar, Bildverzeichnis, FAQ, Redaktionsplanung
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { del, mediaUrl, patch, post, put } from '../api';
import { Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

function useCanEdit() {
  const me = useLoad<any>('/me');
  return !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
}

function useRun(reload: () => void) {
  const { notify } = useApp();
  return async (fn: () => Promise<any>, msg?: string) => {
    try {
      const r = await fn();
      if (msg) notify(msg);
      reload();
      return r ?? true;
    } catch (e) {
      notify(errorText(e), 'error');
      return null;
    }
  };
}

// ---------- Abkürzungen ----------

export function AbbreviationsPage() {
  const list = useLoad<any[]>('/abbreviations');
  const canEdit = useCanEdit();
  const sugg = useLoad<any[]>(canEdit ? '/abbreviations/suggestions' : null, [canEdit]);
  const run = useRun(() => (list.reload(), sugg.reload()));
  const [form, setForm] = useState({ abbreviation: '', expansion: '', description: '' });
  const [edit, setEdit] = useState<any | null>(null);
  return (
    <Page title="Abkürzungen" subtitle="Abkürzungsverzeichnis des Handbuchs">
      {canEdit && (
        <Card title="Abkürzung erfassen">
          <form className="filters" onSubmit={async (e) => {
            e.preventDefault();
            if (await run(() => post('/abbreviations', { ...form, description: form.description || null }), `„${form.abbreviation}“ erfasst.`)) setForm({ abbreviation: '', expansion: '', description: '' });
          }}>
            <label className="inline">Abkürzung <input value={form.abbreviation} onChange={(e) => setForm({ ...form, abbreviation: e.target.value })} /></label>
            <label className="inline">Bedeutung <input value={form.expansion} onChange={(e) => setForm({ ...form, expansion: e.target.value })} /></label>
            <label className="inline">Erläuterung <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <button className="btn primary" type="submit" disabled={!form.abbreviation.trim() || !form.expansion.trim()}>Hinzufügen</button>
          </form>
        </Card>
      )}
      <Card title={`Verzeichnis${list.data ? ` (${list.data.length})` : ''}`}>
        <ErrorBox error={list.error} />
        {list.data && !list.data.length ? <Empty>Noch keine Abkürzungen.</Empty> : (
          <div className="table-wrap" role="region" aria-label="Abkürzungsverzeichnis" tabIndex={0}>
            <table>
              <thead><tr><th>Abkürzung</th><th>Bedeutung</th><th>Erläuterung</th>{canEdit && <th>Aktion</th>}</tr></thead>
              <tbody>
                {list.data?.map((a) => edit?.id === a.id ? (
                  <tr key={a.id}>
                    <td><input aria-label="Abkürzung" value={edit.abbreviation} onChange={(e) => setEdit({ ...edit, abbreviation: e.target.value })} /></td>
                    <td><input aria-label="Bedeutung" value={edit.expansion} onChange={(e) => setEdit({ ...edit, expansion: e.target.value })} /></td>
                    <td><input aria-label="Erläuterung" value={edit.description ?? ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></td>
                    <td className="row-actions">
                      <button className="btn small primary" onClick={async () => (await run(() => patch(`/abbreviations/${a.id}`, { abbreviation: edit.abbreviation, expansion: edit.expansion, description: edit.description || null }), 'Gespeichert.')) && setEdit(null)}>Speichern</button>
                      <button className="btn small" onClick={() => setEdit(null)}>Abbrechen</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={a.id}>
                    <td><strong>{a.abbreviation}</strong></td><td>{a.expansion}</td><td>{a.description ?? ''}</td>
                    {canEdit && (
                      <td className="row-actions">
                        <button className="btn small" onClick={() => setEdit(a)} aria-label={`${a.abbreviation} bearbeiten`}>Bearbeiten</button>
                        <button className="btn small danger" onClick={() => confirm(`„${a.abbreviation}“ löschen?`) && run(() => del(`/abbreviations/${a.id}`), 'Gelöscht.')} aria-label={`${a.abbreviation} löschen`}>Löschen</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {canEdit && sugg.data && sugg.data.length > 0 && (
        <Card title="In den Quellen gefunden, noch nicht erfasst">
          <ul>
            {sugg.data.map((s) => (
              <li key={s.abbreviation}>
                <button className="btn small" onClick={() => setForm({ abbreviation: s.abbreviation, expansion: '', description: '' })}>Übernehmen</button>{' '}
                <strong>{s.abbreviation}</strong> <span className="small muted">({s.occurrences}×) „…{s.example}…“</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}

// ---------- Glossar (Begriffe und Definitionen der Terminologie) ----------

export function GlossaryPage() {
  const terms = useLoad<any[]>('/terminology');
  const canEdit = useCanEdit();
  const run = useRun(terms.reload);
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<{ id: string; definition: string } | null>(null);
  const items = (terms.data ?? []).filter((t) => t.status === 'active' && (!q || `${t.preferred} ${t.definition ?? ''}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => a.preferred.localeCompare(b.preferred, 'de'));
  const letters = [...new Set(items.map((t) => t.preferred[0]?.toUpperCase() ?? '#'))];
  return (
    <Page title="Glossar" subtitle="Fachbegriffe mit Definition – gepflegt gemeinsam mit der Terminologie">
      <div className="filters">
        <label className="inline">Suche <input value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <Link className="btn" to="/terminologie">Begriffe verwalten (Terminologie)</Link>
        <span className="small muted">{items.filter((t) => !t.definition).length} Begriffe ohne Definition</span>
      </div>
      <ErrorBox error={terms.error} />
      {terms.data && !items.length && <Empty>Keine Begriffe. Begriffe legen Sie unter Terminologie an.</Empty>}
      {letters.map((l) => (
        <section key={l} aria-labelledby={`gl-${l}`}>
          <h2 className="glossary-letter" id={`gl-${l}`}>{l}</h2>
          <dl>
            {items.filter((t) => (t.preferred[0]?.toUpperCase() ?? '#') === l).map((t) => (
              <div key={t.id} className="glossary-entry">
                <dt><strong>{t.preferred}</strong>{t.avoid.length > 0 && <span className="small muted"> – nicht: {t.avoid.join(', ')}</span>}</dt>
                <dd>
                  {edit && edit.id === t.id ? (
                    <form onSubmit={async (e) => { e.preventDefault(); const def = edit.definition; if (await run(() => patch(`/terminology/${t.id}`, { definition: def || null }), 'Definition gespeichert.')) setEdit(null); }}>
                      <textarea aria-label={`Definition von ${t.preferred}`} rows={2} value={edit.definition} onChange={(e) => setEdit({ id: t.id, definition: e.target.value })} />
                      <button className="btn small primary" type="submit">Speichern</button> <button className="btn small" type="button" onClick={() => setEdit(null)}>Abbrechen</button>
                    </form>
                  ) : (
                    <>
                      {t.definition ?? <span className="muted">Keine Definition.</span>}
                      {canEdit && <> <button className="btn small" aria-label={`Definition von ${t.preferred} bearbeiten`} onClick={() => setEdit({ id: t.id, definition: t.definition ?? '' })}>✎</button></>}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </Page>
  );
}

// ---------- Bildverzeichnis ----------

function Thumb({ sha, alt }: { sha: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    mediaUrl(sha).then((u) => alive && setUrl(u), () => undefined);
    return () => {
      alive = false;
    };
  }, [sha]);
  return url ? <img className="img-thumb" src={url} alt={alt} /> : <span className="img-thumb" aria-hidden="true" />;
}

export function ImageIndexPage() {
  const idx = useLoad<any[]>('/image-index');
  const canEdit = useCanEdit();
  const run = useRun(idx.reload);
  const [titles, setTitles] = useState<Record<string, string>>({});
  return (
    <Page title="Bildverzeichnis" subtitle="Alle Bilder mit Nummer, Titel, Alternativtext und Verwendung">
      <ErrorBox error={idx.error} />
      {idx.data && !idx.data.length && <Empty>Noch keine Bilder. Bilder kommen über Importe (ZIP, Word, Confluence) oder „Bild einfügen“ in der Werkstatt.</Empty>}
      {idx.data && idx.data.length > 0 && (
        <div className="table-wrap" role="region" aria-label="Bildverzeichnis" tabIndex={0}>
          <table>
            <thead><tr><th>Nr.</th><th>Bild</th><th>Titel</th><th>Alternativtext</th><th>Verwendet in</th><th>Datei</th></tr></thead>
            <tbody>
              {idx.data.map((m) => (
                <tr key={m.sha256}>
                  <td>{m.number ? `Abb. ${m.number}` : <span className="muted">–</span>}</td>
                  <td><Thumb sha={m.sha256} alt={m.altTexts.find(Boolean) ?? m.title ?? m.originalName ?? 'Bild'} /></td>
                  <td>
                    {canEdit ? (
                      <form onSubmit={(e) => (e.preventDefault(), run(() => patch(`/media/${m.sha256}`, { title: titles[m.sha256] ?? m.title ?? '' }), 'Titel gespeichert.'))}>
                        <input aria-label={`Titel für ${m.originalName ?? m.sha256.slice(0, 8)}`} value={titles[m.sha256] ?? m.title ?? ''} onChange={(e) => setTitles({ ...titles, [m.sha256]: e.target.value })} />
                        <button className="btn small" type="submit">Speichern</button>
                      </form>
                    ) : m.title ?? ''}
                  </td>
                  <td>{m.altTexts.filter(Boolean).join(' / ') || <span className="muted">–</span>}{m.missingAlt && <div><span className="flag flag-warning">⚠ Alternativtext fehlt</span></div>}</td>
                  <td className="small">
                    {m.usedIn.chapters.map((c: any) => <div key={`${c.chapterId}-${c.versionNo}`}><Link to={`/werkstatt/${c.chapterId}`}>{c.chapter}</Link> V{c.versionNo}</div>)}
                    {m.usedIn.sources.map((s: any) => <div key={s.seq}>Quelle #{s.seq} ({s.chapter})</div>)}
                    {!m.usedIn.chapters.length && !m.usedIn.sources.length && <span className="muted">nicht verwendet</span>}
                  </td>
                  <td className="small">{m.originalName ?? '–'}<br />{m.mime}{m.width ? `, ${m.width}×${m.height}` : ''}, {Math.round(m.byteSize / 1024)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}

// ---------- FAQ ----------

interface FaqForm { id?: string; question: string; answer: string; roles: string[]; divisions: string[]; status: string; sourceQuestion?: string }
const emptyFaq = (): FaqForm => ({ question: '', answer: '', roles: [], divisions: [], status: 'draft' });

export function FaqPage() {
  const { ref } = useApp();
  const list = useLoad<any[]>('/faq');
  const canEdit = useCanEdit();
  const sugg = useLoad<any[]>(canEdit ? '/faq/suggestions' : null, [canEdit]);
  const run = useRun(() => (list.reload(), sugg.reload()));
  const [form, setForm] = useState<FaqForm | null>(null);
  const toggle = (l: string[], v: string) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]);
  const save = async () => {
    if (!form) return;
    const body = { question: form.question, answer: form.answer, roles: form.roles, divisions: form.divisions, status: form.status, ...(form.sourceQuestion ? { sourceQuestion: form.sourceQuestion } : {}) };
    if (await run(() => (form.id ? patch(`/faq/${form.id}`, body) : post('/faq', body)), 'FAQ-Eintrag gespeichert.')) setForm(null);
  };
  return (
    <Page title="FAQ" subtitle="Häufige Fragen je Rolle und Sparte – mit Vorschlägen aus dem Handbuch-Assistenten" actions={canEdit && <button className="btn primary" onClick={() => setForm(emptyFaq())}>Frage hinzufügen</button>}>
      {form && (
        <Card title={form.id ? 'FAQ-Eintrag bearbeiten' : 'Neuer FAQ-Eintrag'}>
          <label className="block">Frage <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></label>
          <label className="block">Antwort (Markdown) <textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></label>
          <fieldset className="checks"><legend>Rollen (keine = alle)</legend>
            {ref?.roles.filter((r) => r.code !== 'all').map((r) => <label key={r.code} className="inline"><input type="checkbox" checked={form.roles.includes(r.code)} onChange={() => setForm({ ...form, roles: toggle(form.roles, r.code) })} /> {r.icon} {r.label}</label>)}
          </fieldset>
          <fieldset className="checks"><legend>Sparten (keine = alle)</legend>
            {ref?.divisions.filter((d) => d.code !== 'all' && d.code !== 'unconfirmed').map((d) => <label key={d.code} className="inline"><input type="checkbox" checked={form.divisions.includes(d.code)} onChange={() => setForm({ ...form, divisions: toggle(form.divisions, d.code) })} /> {d.icon} {d.label}</label>)}
          </fieldset>
          <label className="inline">Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">Entwurf</option><option value="published">veröffentlicht</option></select>
          </label>
          <div className="actions">
            <button className="btn primary" disabled={form.question.trim().length < 3 || !form.answer.trim()} onClick={save}>Speichern</button>
            <button className="btn" onClick={() => setForm(null)}>Abbrechen</button>
          </div>
        </Card>
      )}
      <Card title={`Fragen${list.data ? ` (${list.data.length})` : ''}`}>
        <ErrorBox error={list.error} />
        {list.data && !list.data.length && <Empty>Noch keine FAQ-Einträge.</Empty>}
        {list.data?.map((f, i) => (
          <details key={f.id} className="faq-entry">
            <summary><strong>{f.question}</strong> {f.status === 'draft' && <span className="tag">Entwurf</span>} {f.source === 'assistant' && <span className="tag">aus Assistent</span>}
              {[...f.roles.map((r: string) => ref?.roles.find((x) => x.code === r)?.label ?? r), ...f.divisions.map((d: string) => ref?.divisions.find((x) => x.code === d)?.label ?? d)].map((l) => <span key={l} className="tag">{l}</span>)}
            </summary>
            <Md text={f.answer} />
            {canEdit && (
              <div className="row-actions">
                <button className="btn small" onClick={() => setForm({ id: f.id, question: f.question, answer: f.answer, roles: f.roles, divisions: f.divisions, status: f.status })}>Bearbeiten</button>
                <button className="btn small" disabled={i === 0} onClick={() => run(() => patch(`/faq/${f.id}`, { move: 'up' }))} aria-label={`${f.question} nach oben`}>↑</button>
                <button className="btn small" disabled={i === list.data!.length - 1} onClick={() => run(() => patch(`/faq/${f.id}`, { move: 'down' }))} aria-label={`${f.question} nach unten`}>↓</button>
                <button className="btn small danger" onClick={() => confirm('FAQ-Eintrag löschen?') && run(() => del(`/faq/${f.id}`), 'Gelöscht.')}>Löschen</button>
              </div>
            )}
          </details>
        ))}
      </Card>
      {canEdit && sugg.data && sugg.data.length > 0 && (
        <Card title="Vorschläge aus dem Assistenten">
          <ul>
            {sugg.data.map((s) => (
              <li key={s.question}>
                <strong>{s.question}</strong> <span className="small muted">– {s.reason}, {s.asked}× gefragt</span>{' '}
                <button className="btn small" onClick={() => setForm({ ...emptyFaq(), question: s.question, answer: s.suggestedAnswer ?? '', roles: s.roles, sourceQuestion: s.question })}>Als FAQ übernehmen</button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}

// ---------- Planung ----------

const PLAN_LABEL: Record<string, string> = { open: 'offen', in_progress: 'in Arbeit', review: 'im Review', done: 'fertig' };

export function PlanningPage() {
  const { ref } = useApp();
  const list = useLoad<any>('/outlines');
  const [outlineId, setOutlineId] = useState<string | null>(null);
  const selected = outlineId ?? list.data?.items.find((o: any) => o.status === 'active')?.id ?? list.data?.items[0]?.id ?? null;
  const plan = useLoad<any>(selected ? `/outlines/${selected}/plan` : null, [selected]);
  const canEdit = useCanEdit();
  const run = useRun(plan.reload);
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const value = (i: any, k: string) => drafts[i.nodeId]?.[k] ?? i[k] ?? '';
  const set = (i: any, k: string, v: string) => setDrafts({ ...drafts, [i.nodeId]: { ...drafts[i.nodeId], [k]: v } });
  const save = async (i: any) => {
    const d = drafts[i.nodeId] ?? {};
    if (await run(() => put(`/outline-nodes/${i.nodeId}/plan`, { assignee: d.assignee ?? i.assignee, dueDate: (d.dueDate ?? i.dueDate) || null, status: d.status ?? i.status, note: d.note ?? i.note }), `Planung für ${i.number} gespeichert.`)) {
      const rest = { ...drafts };
      delete rest[i.nodeId];
      setDrafts(rest);
    }
  };
  const s = plan.data?.summary;
  return (
    <Page title="Planung" subtitle="Redaktionsplanung je Kapitel und Unterkapitel einer Gliederung">
      <ErrorBox error={list.error ?? plan.error} />
      {list.data && !list.data.items.length && <Empty>Noch keine Gliederung. Legen Sie unter <Link to="/stammdaten/inhaltsverzeichnis">Inhaltsverzeichnis</Link> eine an.</Empty>}
      {list.data && list.data.items.length > 0 && (
        <div className="filters">
          <label className="inline">Gliederung
            <select value={selected ?? ''} onChange={(e) => setOutlineId(e.target.value)}>
              {list.data.items.map((o: any) => <option key={o.id} value={o.id}>{o.name} – V{o.versionNo}{o.status === 'active' ? ' (aktiv)' : ''}</option>)}
            </select>
          </label>
        </div>
      )}
      {s && (
        <Card title="Fortschritt">
          <p><strong>{s.progress} %</strong> fertig · {s.open} offen · {s.in_progress} in Arbeit · {s.review} im Review · {s.done} fertig{s.overdue > 0 && <> · <span className="overdue">{s.overdue} überfällig</span></>}</p>
          <progress max={100} value={s.progress} aria-label="Fortschritt in Prozent" />
        </Card>
      )}
      {plan.data && (
        <div className="table-wrap" role="region" aria-label="Redaktionsplan" tabIndex={0}>
          <table>
            <thead><tr><th>Nr.</th><th>Kapitel</th><th>Schnipsel</th><th>Verantwortlich</th><th>Termin</th><th>Status</th><th>Notiz</th>{canEdit && <th>Aktion</th>}</tr></thead>
            <tbody>
              {plan.data.items.map((i: any) => (
                <tr key={i.nodeId}>
                  <td>{i.number}</td>
                  <td style={{ paddingLeft: i.level === 2 ? 24 : undefined }}>{i.title}</td>
                  <td>{i.snippets}</td>
                  {canEdit ? (
                    <>
                      <td>
                        <select aria-label={`Verantwortlich für ${i.number}`} value={value(i, 'assignee')} onChange={(e) => set(i, 'assignee', e.target.value)}>
                          <option value="">–</option>
                          {ref?.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                          {i.assignee && !ref?.users.some((u) => u.id === i.assignee) && <option value={i.assignee}>{i.assignee}</option>}
                        </select>
                      </td>
                      <td><input type="date" aria-label={`Termin für ${i.number}`} value={value(i, 'dueDate')} onChange={(e) => set(i, 'dueDate', e.target.value)} />{i.overdue && <div className="overdue small">überfällig</div>}</td>
                      <td>
                        <select aria-label={`Status von ${i.number}`} value={value(i, 'status')} onChange={(e) => set(i, 'status', e.target.value)}>
                          {Object.entries(PLAN_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </select>
                      </td>
                      <td><input aria-label={`Notiz zu ${i.number}`} value={value(i, 'note')} onChange={(e) => set(i, 'note', e.target.value)} /></td>
                      <td><button className="btn small primary" disabled={!drafts[i.nodeId]} onClick={() => save(i)}>Speichern</button></td>
                    </>
                  ) : (
                    <>
                      <td>{ref?.users.find((u) => u.id === i.assignee)?.name ?? i.assignee ?? '–'}</td>
                      <td>{i.dueDate ?? '–'}{i.overdue && <span className="overdue"> (überfällig)</span>}</td>
                      <td>{PLAN_LABEL[i.status]}</td>
                      <td>{i.note ?? ''}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
