import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, del, patch, post, put } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// oneSCM_Metadaten › Expertenbefragung (ADR-092, F-16): Wissenslücken an Fachleute geben – Option und Freitext,
// in der App oder per Excel; Übernahme als Frage & Antwort mit Label „Prüfen“

const STATUS: Record<string, [string, string]> = { open: ['offen', ''], answered: ['beantwortet', ''], adopted: ['übernommen', ''] };

function AnswerForm({ item, onSaved }: { item: any; onSaved: (it: any) => void }) {
  const { notify } = useApp();
  const [choice, setChoice] = useState<string>(item.choice ?? '');
  const [text, setText] = useState<string>(item.answerText ?? '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      const r = await put<any>(`/metadata/survey-items/${item.id}/answer`, { choice: choice || null, text: text || null });
      notify('Antwort gespeichert.');
      onSaved(r);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="survey-answer">
      {item.options.length > 0 && (
        <fieldset className="inline">
          <legend className="small">Antwort zu Frage {item.position}</legend>
          {item.options.map((o: string) => <label key={o} className="small"><input type="radio" name={`c-${item.id}`} checked={choice === o} onChange={() => setChoice(o)} /> {o}</label>)}
          {choice && <button className="btn small ghost" onClick={() => setChoice('')}>Auswahl leeren</button>}
        </fieldset>
      )}
      <label className="block small">Freitext (Erläuterung, Quelle, Ansprechstelle) <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} /></label>
      <button className="btn small" disabled={busy || (choice === (item.choice ?? '') && text === (item.answerText ?? ''))} onClick={() => void save()}>Antwort speichern</button>
    </div>
  );
}

export function SurveysPage() {
  const { notify } = useApp();
  const me = useLoad<{ permissions: string[] }>('/me');
  const canEdit = !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
  const list = useLoad<any[]>('/metadata/surveys');
  const catalogs = useLoad<any[]>(canEdit ? '/metadata/question-sets' : null, [canEdit]);
  const evalSets = useLoad<any[]>(canEdit ? '/metadata/eval-sets' : null, [canEdit]);
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => {
    if (!sel && list.data?.length) setSel(list.data[0].id);
  }, [list.data, sel]);
  const sv = useLoad<any>(sel ? `/metadata/surveys/${sel}` : null, [sel]);
  const [form, setForm] = useState({ title: '', audience: '', source: '', options: 'Ja, Nein, Teilweise, Weiß nicht' });
  const [newQ, setNewQ] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);

  const create = async () => {
    const [kind, id] = form.source.split(':');
    try {
      const r = await post<any>('/metadata/surveys', {
        title: form.title, audience: form.audience || null, options: form.options.split(',').map((x) => x.trim()).filter(Boolean),
        ...(kind === 'catalog' ? { from: { catalogId: id } } : kind === 'eval' ? { from: { evalRunId: id } } : {}),
      });
      notify(`Befragung „${r.title}“ mit ${r.items.length} Fragen angelegt.`);
      setForm({ ...form, title: '', audience: '' });
      list.reload();
      setSel(r.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const run = async (fn: () => Promise<unknown>, text?: string) => {
    try {
      await fn();
      if (text) notify(text);
      sv.reload();
      list.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const upload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api<any>('POST', `/metadata/surveys/${sel}/answers`, fd);
      notify(`${r.updated} Antworten übernommen${r.skipped ? `, ${r.skipped} unverändert` : ''}${r.errors.length ? `, ${r.errors.length} Zeilen mit Fehler (${r.errors.slice(0, 3).map((e: any) => `Zeile ${e.row}: ${e.message}`).join('; ')})` : ''}.`, r.errors.length ? 'error' : undefined);
      sv.setData(r.survey);
      list.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  const s = sv.data;
  const items = (s?.items ?? []).filter((i: any) => !onlyOpen || i.status === 'open');
  return (
    <Page title="Expertenbefragung" subtitle="Wissenslücken – Fragen ohne Aussage in den Quellen – an Fachleute geben und die Antworten als zu prüfende Fragen & Antworten übernehmen">
      <ErrorBox error={list.error ?? sv.error} />
      <div className="grid2">
        {canEdit && (
          <Card title="Befragung anlegen">
            <label className="block">Titel <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="z. B. Lücken Kapitel 3 Verträge" /></label>
            <label className="block">Zielgruppe (Fachbereich oder Rolle) <input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="z. B. Fachbereich Zoll" /></label>
            <label className="block">Fragen aus
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                <option value="">– von Hand ergänzen –</option>
                {(catalogs.data ?? []).map((c) => <option key={c.id} value={`catalog:${c.id}`}>Rückfragen: {c.name} (ohne Aussage)</option>)}
                {(evalSets.data ?? []).filter((x) => x.lastRun).map((x) => <option key={x.id} value={`eval:${x.lastRun.id}`}>Antwortqualität: {x.name} (letzter Prüflauf, ohne Antwort)</option>)}
              </select>
            </label>
            <label className="block">Antwortoptionen (mit Komma getrennt; Freitext ist immer möglich) <input value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} /></label>
            <button className="btn primary" disabled={!form.title.trim()} onClick={() => void create()}>Befragung anlegen</button>
          </Card>
        )}
        <Card title={`Befragungen (${list.data?.length ?? 0})`}>
          {!list.data?.length ? <Empty>Noch keine Befragung.</Empty> : (
            <ul className="oq-list" aria-label="Befragungen">
              {list.data.map((x) => (
                <li key={x.id}>
                  <button aria-current={x.id === sel} onClick={() => setSel(x.id)}>
                    <span>{x.title}{x.status === 'closed' && ' (abgeschlossen)'}</span>
                    <span className="muted small">{x.answered}/{x.questions} beantwortet · {x.adopted} übernommen{x.audience ? ` · ${x.audience}` : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {s && (
        <Card title={s.title} actions={<span className="row-actions">
          {(['xlsx', 'csv'] as const).map((f) => <DownloadButton key={f} className="btn small" href={`/api/v1/metadata/surveys/${s.id}/export?format=${f}`} name={`${s.title}.${f}`}>⬇ {f.toUpperCase()}</DownloadButton>)}
          {canEdit && <button className="btn small" onClick={() => void run(() => patch(`/metadata/surveys/${s.id}`, { status: s.status === 'open' ? 'closed' : 'open' }), s.status === 'open' ? 'Befragung abgeschlossen.' : 'Befragung wieder geöffnet.')}>{s.status === 'open' ? 'Abschließen' : 'Wieder öffnen'}</button>}
          {canEdit && <button className="btn small ghost" onClick={() => window.confirm('Befragung mit allen Antworten löschen?') && void run(async () => { await del(`/metadata/surveys/${s.id}`); setSel(null); })}>Löschen</button>}
        </span>}>
          <p className="small">
            {s.audience && <>Zielgruppe: <strong>{s.audience}</strong> · </>}{s.summary.answered} von {s.summary.questions} beantwortet · {s.summary.adopted} übernommen · {s.status === 'open' ? 'offen für Antworten' : 'abgeschlossen'}
          </p>
          {canEdit && s.status === 'open' && (
            <div className="filters">
              <label className="small">Ausgefüllte Excel- oder CSV-Datei einlesen <input type="file" accept=".xlsx,.csv" data-testid="survey-answers" onChange={(e) => void upload(e.target.files?.[0])} /></label>
              <label className="small">Frage ergänzen <input value={newQ} onChange={(e) => setNewQ(e.target.value)} /></label>
              <button className="btn small" disabled={newQ.trim().length < 3} onClick={() => void run(async () => { await post(`/metadata/surveys/${s.id}/items`, { question: newQ }); setNewQ(''); })}>Hinzufügen</button>
            </div>
          )}
          <label className="small"><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} /> nur offene</label>
          {!items.length ? <Empty>Keine Fragen.</Empty> : items.map((i: any) => (
            <article key={i.id} className="qc-item" aria-label={`Frage ${i.position}`}>
              <p><strong>{i.position}. {i.question}</strong> <span className={`tag small ${STATUS[i.status][1]}`}>{STATUS[i.status][0]}</span></p>
              {i.context && <p className="small muted">{i.context}</p>}
              {i.status !== 'open' && <p className="small">Antwort: {[i.choice, i.answerText].filter(Boolean).join(' – ')} <span className="muted">({i.answeredBy})</span></p>}
              {s.status === 'open' && !i.qaId && <AnswerForm item={i} onSaved={() => { sv.reload(); list.reload(); }} />}
              {canEdit && i.status === 'answered' && <button className="btn small primary" onClick={() => void run(() => post(`/metadata/survey-items/${i.id}/qa`, {}), 'Als Frage & Antwort mit Label „Prüfen“ übernommen.')}>Als Frage & Antwort übernehmen</button>}
              {i.qaId && <Link className="small" to="/metadaten/fragen">In Fragen & Antworten ansehen →</Link>}
            </article>
          ))}
        </Card>
      )}
    </Page>
  );
}
