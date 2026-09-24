import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, del, put } from '../api';
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
          <label className="block">Näherungssuche (HNSW) ab Anzahl Textabschnitten (ADR-024)
            <input type="number" step="1000" min="0" value={draft.semantic.annThreshold ?? 20000} onChange={(e) => setDraft({ ...draft, semantic: { ...draft.semantic, annThreshold: Number(e.target.value) } })} />
          </label>
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
        <LayoutCard />
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

/** Kontrast zu Weiß (WCAG) – die Hausfarbe dient als Hintergrund weißer Schrift und als Schriftfarbe */
function contrast(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return 0;
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 1.05 / (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] + 0.05);
}

/** Firmen-Layout (ADR-038) für PDF, HTML, Word und Online-Hilfe */
function LayoutCard() {
  const { notify } = useApp();
  const layout = useLoad<any>('/layout');
  const media = useLoad<any[]>('/media');
  const [d, setD] = useState<any | null>(null);
  useEffect(() => setD(layout.data ? { ...layout.data } : null), [layout.data]);
  if (!d) return <Card title="Layout"><ErrorBox error={layout.error} /></Card>;
  const ratio = contrast(d.primaryColor);
  const set = (k: string, v: unknown) => setD({ ...d, [k]: v });
  const save = async () => {
    try {
      const { docxTemplate: _t, ...body } = d;
      await put('/layout', body);
      notify('Layout gespeichert.');
      layout.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const uploadLogo = async (file?: File) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const m = await api<any>('POST', '/media', fd);
      set('logoSha', m.sha256);
      media.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const uploadTemplate = async (file?: File) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      await api('POST', '/layout/docx-template', fd);
      notify(`Word-Vorlage „${file.name}“ übernommen.`);
      layout.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const logos = (media.data ?? []).filter((m) => m.mime === 'image/png' || m.mime === 'image/jpeg');
  const tpl = layout.data?.docxTemplate;
  return (
    <Card title="Layout (PDF, HTML, Word, Online-Hilfe)">
      <label className="block">Firmenname <input value={d.companyName ?? ''} onChange={(e) => set('companyName', e.target.value)} /></label>
      <div className="form-row">
        <label>Hausfarbe <input type="color" value={d.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} aria-label="Hausfarbe (Farbwähler)" /></label>
        <label>Farbwert <input value={d.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} aria-label="Hausfarbe als Farbwert" /></label>
        <span className={`small ${ratio >= 4.5 ? '' : 'error-text'}`} role="status">Kontrast zu Weiß {ratio.toFixed(1)} : 1 {ratio >= 4.5 ? '✓' : '– zu hell (mind. 4,5 : 1)'}</span>
      </div>
      <div className="form-row">
        <label>Logo
          <select value={d.logoSha ?? ''} onChange={(e) => set('logoSha', e.target.value || null)}>
            <option value="">kein Logo</option>
            {logos.map((m) => <option key={m.sha256} value={m.sha256}>{m.originalName ?? m.sha256.slice(0, 12)}{m.width ? ` (${m.width}×${m.height})` : ''}</option>)}
          </select>
        </label>
        <label>Logo hochladen (PNG/JPEG) <input type="file" accept="image/png,image/jpeg" onChange={(e) => void uploadLogo(e.target.files?.[0])} /></label>
      </div>
      <label className="inline"><input type="checkbox" checked={!!d.cover} onChange={(e) => set('cover', e.target.checked)} /> Titelseite mit Logo, Firmenname, Untertitel und Vertraulichkeitshinweis</label>
      <label className="block">Untertitel der Titelseite <input value={d.coverSubtitle ?? ''} onChange={(e) => set('coverSubtitle', e.target.value)} /></label>
      <div className="form-row">
        <label>Kopfzeile <input value={d.headerText ?? ''} onChange={(e) => set('headerText', e.target.value)} placeholder="Standard: Firmenname · Titel" /></label>
        <label>Fußzeile <input value={d.footerText ?? ''} onChange={(e) => set('footerText', e.target.value)} placeholder="z. B. Nur für den internen Gebrauch" /></label>
      </div>
      <label className="block">Vertraulichkeitshinweis <input value={d.confidentiality ?? ''} onChange={(e) => set('confidentiality', e.target.value)} placeholder="z. B. VERTRAULICH" /></label>
      <p className="small">Word-Vorlage: {tpl ? <><strong>{tpl.name}</strong> (Formatvorlagen: {[tpl.styles.title, tpl.styles.heading1, tpl.styles.heading2].filter(Boolean).join(', ') || 'keine erkannt'}) <button className="btn small" onClick={() => del('/layout/docx-template').then(() => (notify('Word-Vorlage entfernt.'), layout.reload())).catch((e) => notify(errorText(e), 'error'))}>Entfernen</button></> : 'keine – eigene Formatvorlagen in der Hausfarbe'}</p>
      <label className="block">Word-Vorlage hochladen (.dotx/.docx – übernommen werden die Formatvorlagen) <input type="file" accept=".dotx,.docx" onChange={(e) => void uploadTemplate(e.target.files?.[0])} /></label>
      <button className="btn primary" disabled={ratio < 4.5} onClick={save}>Layout speichern</button>
    </Card>
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
