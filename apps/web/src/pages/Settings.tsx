import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { put } from '../api';
import { Decision, Card, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

export function SettingsPage() {
  const { ref, notify } = useApp();
  const s = useLoad<any>('/settings');
  const [draft, setDraft] = useState<any | null>(null);
  useEffect(() => setDraft(s.data ? structuredClone(s.data) : null), [s.data]);
  if (!draft) return <Page title="Einstellungen"><ErrorBox error={s.error} /></Page>;
  const a = draft.analysis;
  const setA = (k: string, v: unknown) => setDraft({ ...draft, analysis: { ...a, [k]: v } });

  const save = async () => {
    try {
      await put('/settings', { analysis: draft.analysis, import: draft.import, readability: draft.readability, rewrite: draft.rewrite, semantic: draft.semantic });
      notify('Einstellungen gespeichert.');
      s.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  const slider = (k: string, label: string, help: string) => (
    <div className="setting">
      <label className="slider">{label}
        <input type="range" min={10} max={100} value={Math.round(a[k] * 100)} onChange={(e) => setA(k, Number(e.target.value) / 100)} aria-label={label} />
        <strong>{Math.round(a[k] * 100)} %</strong>
      </label>
      <p className="small muted">{help}</p>
    </div>
  );

  return (
    <Page title="Einstellungen" subtitle="Schwellenwerte, Blockerdefinition, Uploadgrenzen, Terminologie" actions={<button className="btn primary" onClick={save}>Speichern</button>}>
      <Decision id="E-01 · E-05 · E-07">Die Standardwerte entsprechen den fachlichen Entscheidungen vom 24.09.2026 (docs/04-offene-entscheidungen.md) und bleiben konfigurierbar. Speichern erfordert die Berechtigung „admin“.</Decision>
      <div className="grid2">
        <Card title="Analyse (semantische Ähnlichkeit)">
          {slider('clusterThreshold', 'Clusterschwelle', 'Ab dieser Ähnlichkeit werden Texte zu einem Cluster vorgeschlagen.')}
          {slider('duplicateThreshold', 'Dopplungsschwelle', 'Ab dieser Ähnlichkeit gilt ein Paar als semantische Dopplung (Stufe 2/3).')}
          {slider('contradictionThreshold', 'Widerspruchskandidaten', 'Ab dieser Ähnlichkeit werden Texte auf Widerspruchsmuster geprüft.')}
          <label><input type="checkbox" checked={a.crossChapter} onChange={(e) => setA('crossChapter', e.target.checked)} /> Kapitelübergreifend analysieren</label>
          <label className="block">Verfahren (ADR-017)
            <select value={draft.semantic.analysisMethod} onChange={(e) => setDraft({ ...draft, semantic: { ...draft.semantic, analysisMethod: e.target.value } })}>
              <option value="tfidf">TF-IDF (Standard, Entscheidung E-05)</option>
              <option value="hybrid">Hybrid: TF-IDF + Embeddings</option>
            </select>
          </label>
          {draft.semantic.analysisMethod === 'hybrid' && (
            <label className="block">Embedding-Schwelle für zusätzliche Paare
              <input type="number" step="0.01" min="0.3" max="1" value={draft.semantic.embeddingThreshold} onChange={(e) => setDraft({ ...draft, semantic: { ...draft.semantic, embeddingThreshold: Number(e.target.value) } })} />
            </label>
          )}
        </Card>
        <Card title="Schweregrad je Widerspruchsregel (Blockerdefinition)">
          <table className="table compact">
            <tbody>
              {Object.entries(a.ruleSeverity).map(([rule, sev]) => (
                <tr key={rule}>
                  <td>{ref?.contradictionRules[rule] ?? rule}</td>
                  <td>
                    <select value={sev as string} onChange={(e) => setA('ruleSeverity', { ...a.ruleSeverity, [rule]: e.target.value })} aria-label={`Schweregrad ${rule}`}>
                      {ref?.severities.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Import">
          <label className="block">Erlaubte Endungen <input value={draft.import.allowedExtensions.join(', ')} onChange={(e) => setDraft({ ...draft, import: { ...draft.import, allowedExtensions: e.target.value.split(',').map((x: string) => x.trim()).filter(Boolean) } })} /></label>
          <label className="block">Max. Uploadgröße (MB) <input type="number" value={Math.round(draft.import.maxUploadBytes / 1048576)} onChange={(e) => setDraft({ ...draft, import: { ...draft.import, maxUploadBytes: Number(e.target.value) * 1048576 } })} /></label>
          <label className="block">Max. Dateien je ZIP <input type="number" value={draft.import.maxZipFiles} onChange={(e) => setDraft({ ...draft, import: { ...draft.import, maxZipFiles: Number(e.target.value) } })} /></label>
        </Card>
        <Card title="Lesbarkeit">
          <label className="block">Max. Wörter je Satz <input type="number" value={draft.readability.maxSentenceWords} onChange={(e) => setDraft({ ...draft, readability: { maxSentenceWords: Number(e.target.value) } })} /></label>
          <p className="small muted">Begriffe werden seit Etappe 3 unter <Link to="/terminologie">Terminologie</Link> gepflegt.</p>
        </Card>
        <Card title="KI-Umformulierung">
          <label className="block">Mindestabdeckung je Satz durch die zitierten Quellen (0,1–1)
            <input type="number" step="0.05" min="0.1" max="1" value={draft.rewrite.minSupport} onChange={(e) => setDraft({ ...draft, rewrite: { minSupport: Number(e.target.value) } })} />
          </label>
          <LlmUsage />
        </Card>
      </div>
    </Page>
  );
}

/** Nutzung des KI-Dienstes im aktuellen Projekt (Anfragen, Übernahmen, Tokens, geschätzte Kosten) */
function LlmUsage() {
  const status = useLoad<any>('/llm/status');
  const usage = useLoad<any>('/llm/usage');
  if (!status.data?.enabled) return <p className="small muted">Kein KI-Dienst eingerichtet (LLM_PROVIDER).</p>;
  const u = usage.data;
  return (
    <>
      <p className="small">Anbieter: <strong>{status.data.provider}</strong> · Modell {status.data.model}{status.data.external ? ' · Daten verlassen die eigene Umgebung' : ''}</p>
      {!u?.items.length ? <p className="small muted">Noch keine Anfragen in diesem Projekt.</p> : (
        <table className="table compact">
          <thead><tr><th>Modell</th><th>Anfragen</th><th>übernommen</th><th>ungültig</th><th>Tokens (ein/aus)</th>{u.pricePerMTok && <th>geschätzt</th>}</tr></thead>
          <tbody>
            {u.items.map((i: any) => (
              <tr key={`${i.provider}/${i.model}`}>
                <td>{i.provider}/{i.model}</td><td>{i.requests}</td><td>{i.accepted}</td><td>{i.invalid}</td>
                <td>{i.inputTokens.toLocaleString('de-DE')} / {i.outputTokens.toLocaleString('de-DE')}</td>
                {u.pricePerMTok && <td>{i.estimatedCost?.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {u.currency}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
