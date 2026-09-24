import { useEffect, useState } from 'react';
import { put } from '../api';
import { Assumption, Card, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

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
      await put('/settings', { analysis: draft.analysis, import: draft.import, terminology: draft.terminology, readability: draft.readability });
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
      <Assumption id="E-01 · E-05 · E-07">Alle Werte sind vorläufige Annahmen zu offenen P0-Entscheidungen (docs/04-offene-entscheidungen.md) und bewusst konfigurierbar. Speichern erfordert die Berechtigung „admin“.</Assumption>
      <div className="grid2">
        <Card title="Analyse (semantische Ähnlichkeit)">
          {slider('clusterThreshold', 'Clusterschwelle', 'Ab dieser Ähnlichkeit werden Texte zu einem Cluster vorgeschlagen.')}
          {slider('duplicateThreshold', 'Dopplungsschwelle', 'Ab dieser Ähnlichkeit gilt ein Paar als semantische Dopplung (Stufe 2/3).')}
          {slider('contradictionThreshold', 'Widerspruchskandidaten', 'Ab dieser Ähnlichkeit werden Texte auf Widerspruchsmuster geprüft.')}
          <label><input type="checkbox" checked={a.crossChapter} onChange={(e) => setA('crossChapter', e.target.checked)} /> Kapitelübergreifend analysieren</label>
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
        <Card title="Terminologie und Lesbarkeit">
          <table className="table compact">
            <thead><tr><th>Bevorzugt</th><th>Zu vermeiden (kommagetrennt)</th><th /></tr></thead>
            <tbody>
              {draft.terminology.map((t: any, i: number) => (
                <tr key={i}>
                  <td><input value={t.preferred} onChange={(e) => setDraft({ ...draft, terminology: draft.terminology.map((x: any, j: number) => (j === i ? { ...x, preferred: e.target.value } : x)) })} aria-label="Bevorzugter Begriff" /></td>
                  <td><input value={t.avoid.join(', ')} onChange={(e) => setDraft({ ...draft, terminology: draft.terminology.map((x: any, j: number) => (j === i ? { ...x, avoid: e.target.value.split(',').map((y: string) => y.trim()).filter(Boolean) } : x)) })} aria-label="Zu vermeidende Begriffe" /></td>
                  <td><button className="btn ghost small" onClick={() => setDraft({ ...draft, terminology: draft.terminology.filter((_: any, j: number) => j !== i) })}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn small" onClick={() => setDraft({ ...draft, terminology: [...draft.terminology, { preferred: '', avoid: [] }] })}>+ Begriff</button>
          <label className="block">Max. Wörter je Satz <input type="number" value={draft.readability.maxSentenceWords} onChange={(e) => setDraft({ ...draft, readability: { maxSentenceWords: Number(e.target.value) } })} /></label>
        </Card>
      </div>
    </Page>
  );
}
