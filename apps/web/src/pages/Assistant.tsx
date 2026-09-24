// Handbuch-Assistent (ADR-026): Fragen an das freigegebene Handbuch, Antwort mit Quellen je Satz
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { currentProjectId, post } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';
import { RefSelect } from './Sources';

const LANG_NAMES: Record<string, string> = { de: 'Deutsch', en: 'Englisch', fr: 'Französisch', es: 'Spanisch', it: 'Italienisch', nl: 'Niederländisch', pl: 'Polnisch', cs: 'Tschechisch', pt: 'Portugiesisch' };

export function AssistantPage() {
  const { notify } = useApp();
  const [params] = useSearchParams();
  const project = useLoad<any[]>('/projects');
  const me = useLoad<any>('/me');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState(params.get('language') ?? 'de');
  const [role, setRole] = useState('');
  const [division, setDivision] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [rated, setRated] = useState<number | null>(null);
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const gaps = useLoad<any>(canEdit ? '/assistant/open-questions?limit=20' : null, [canEdit, result?.id]);
  const current = project.data?.find((p) => p.id === currentProjectId()) ?? project.data?.[0];
  const languages = ['de', ...(current?.languages ?? [])];

  const askNow = async () => {
    if (question.trim().length < 3) return;
    setBusy(true);
    setRated(null);
    try {
      setResult(await post('/assistant/ask', { question, language, role: role || undefined, division: division || undefined }));
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const rate = async (helpful: boolean) => {
    try {
      await post(`/assistant/answers/${result.id}/feedback`, { helpful });
      setRated(helpful ? 1 : -1);
      notify('Danke für die Bewertung.');
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page title="Assistent" subtitle="Fragen an das freigegebene Handbuch – jede Aussage mit Quelle, ohne Inhalte aus Entwürfen">
      <Card title="Frage">
        <form onSubmit={(e) => (e.preventDefault(), void askNow())}>
          <label className="block">Ihre Frage
            <textarea rows={2} maxLength={500} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="z. B. Wie lege ich einen Auftrag an?" />
          </label>
          <div className="filters">
            <select aria-label="Sprache" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((l) => <option key={l} value={l}>{LANG_NAMES[l] ?? l}</option>)}
            </select>
            <RefSelect kind="roles" value={role} onChange={setRole} />
            <RefSelect kind="divisions" value={division} onChange={setDivision} />
            <button className="btn primary" type="submit" disabled={busy || question.trim().length < 3}>{busy ? 'Suche …' : 'Fragen'}</button>
          </div>
        </form>
      </Card>
      {result && (
        <Card title="Antwort">
          {result.notice && <p className="alert" role="note">{result.notice}</p>}
          {result.answer.length > 0 && (
            <div className="answer" lang={result.language}>
              {result.answer.map((s: any, i: number) => (
                <p key={i}>{s.text} {s.sources.map((n: number) => <sup key={n}><a href={`#quelle-${n}`} aria-label={`Quelle ${n}`}>[{n}]</a></sup>)}</p>
              ))}
            </div>
          )}
          <p className="small muted">{result.mode === 'llm' ? 'Formuliert vom KI-Dienst, jeder Satz gegen die Quellen geprüft.' : result.mode === 'extractive' ? 'Wörtlich aus dem freigegebenen Handbuch.' : ''}</p>
          {result.sources.length > 0 && (
            <>
              <h3>Quellen</h3>
              <ol className="sources">
                {result.sources.map((s: any) => (
                  <li key={s.n} id={`quelle-${s.n}`}>
                    <strong>{s.chapter}</strong> · {s.sectionTitle} (Version {s.versionNo}) – <Link to={s.link}>öffnen</Link>
                    <blockquote lang={result.language}>{s.text}</blockquote>
                  </li>
                ))}
              </ol>
            </>
          )}
          <div className="actions">
            <span className="small">War die Antwort hilfreich?</span>
            <button className="btn small" aria-pressed={rated === 1} disabled={rated !== null} onClick={() => void rate(true)}>👍 Ja</button>
            <button className="btn small ghost" aria-pressed={rated === -1} disabled={rated !== null} onClick={() => void rate(false)}>👎 Nein</button>
          </div>
        </Card>
      )}
      {canEdit && (
        <Card title="Wissenslücken (für die Redaktion)">
          <ErrorBox error={gaps.error} />
          {gaps.data && <p className="small">{gaps.data.stats.questions} Fragen · {gaps.data.stats.answered} beantwortet · {gaps.data.stats.helpful} hilfreich · {gaps.data.stats.unhelpful} nicht hilfreich</p>}
          {!gaps.data?.items.length ? <Empty>Keine offenen Fragen.</Empty> : (
            <table className="table compact">
              <thead><tr><th>Frage</th><th>Sprache</th><th>Grund</th><th>Zeit</th></tr></thead>
              <tbody>
                {gaps.data.items.map((q: any) => (
                  <tr key={q.id}>
                    <td>{q.question}{q.feedback && <div className="small muted">„{q.feedback}“</div>}</td>
                    <td>{q.language.toUpperCase()}</td>
                    <td>{q.answered ? 'als nicht hilfreich bewertet' : 'keine Aussage im Handbuch'}</td>
                    <td className="small">{new Date(q.createdAt).toLocaleString('de-DE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </Page>
  );
}
