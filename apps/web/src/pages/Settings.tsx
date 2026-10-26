import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, del, put } from '../api';
import { contrast } from '../contrast';
import { resetReadingStyle } from '../readingStyle';
import { DesignThemeCard } from './DesignThemeCard';

import { Decision, Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const SEVERITY_DE: Record<string, string> = { blocker: 'Blocker', high: 'Hoch', medium: 'Mittel', low: 'Niedrig' };

export function SettingsPage() {
  const { ref, notify } = useApp();
  const s = useLoad<any>('/settings');
  const [draft, setDraft] = useState<any | null>(null);
  // Namensliste roh bearbeiten (Leerzeichen, neue Zeilen); bereinigt wird erst beim Speichern
  const [namesText, setNamesText] = useState('');
  const [excludeText, setExcludeText] = useState('');
  useEffect(() => {
    setDraft(s.data ? structuredClone(s.data) : null);
    setNamesText((s.data?.privacy?.names ?? []).join('\n'));
    setExcludeText((s.data?.import?.excludePatterns ?? []).join('\n'));
  }, [s.data]);
  if (!draft) return <Page title="Einstellungen"><ErrorBox error={s.error} /></Page>;
  const a = draft.analysis;
  const setA = (k: string, v: unknown) => setDraft({ ...draft, analysis: { ...a, [k]: v } });

  const save = async () => {
    try {
      await put('/settings', { analysis: draft.analysis, import: { ...draft.import, excludePatterns: excludeText.split('\n').map((x) => x.trim()).filter(Boolean) }, readability: draft.readability, rewrite: draft.rewrite, semantic: draft.semantic, privacy: { names: namesText.split('\n').map((x) => x.trim()).filter(Boolean) }, triage: { auto: draft.triage?.auto !== false } });
      notify('Einstellungen gespeichert.');
      s.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  const slider = (k: string, label: string, help: string) => (
    <div className="setting">
      <label className="slider">{label}
        <input type="range" min={10} max={100} value={Math.round(a[k] * 100)} onChange={(e) => setA(k, Number(e.target.value) / 100)} />
        <output>{Math.round(a[k] * 100)} %</output>
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
          <label title="Agent TRIAGE (ADR-100): Pflichtlabels und Kapitelvorschläge für jeden neuen Chunk"><input type="checkbox" checked={draft.triage?.auto !== false} onChange={(e) => setDraft({ ...draft, triage: { auto: e.target.checked } })} /> TRIAGE nach jedem Einlesen</label>
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
                    <select value={sev as string} onChange={(e) => setA('ruleSeverity', { ...a.ruleSeverity, [rule]: e.target.value })} aria-label={`Schweregrad ${ref?.contradictionRules[rule] ?? rule}`}>
                      {ref?.severities.map((x) => <option key={x} value={x}>{SEVERITY_DE[x] ?? x}</option>)}
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
          <label className="block">Nicht einlesen – ein Muster je Zeile (z. B. *.tmp, ~$*, Archiv/**)
            <textarea id="exclude-patterns" rows={3} value={excludeText} onChange={(e) => setExcludeText(e.target.value)} />
          </label>
          <p className="small muted">* steht für beliebige Zeichen, ** für beliebige Ordner. Ausgeschlossene Dateien erscheinen im Import als „übersprungen“ mit dem Muster.</p>
        </Card>
        <Card title="Lesbarkeit">
          <label className="block">Max. Wörter je Satz <input type="number" value={draft.readability.maxSentenceWords} onChange={(e) => setDraft({ ...draft, readability: { maxSentenceWords: Number(e.target.value) } })} /></label>
          <p className="small muted">Begriffe werden seit Etappe 3 unter <Link to="/terminologie">Terminologie</Link> gepflegt.</p>
        </Card>
        <Card title="Datenschutz: Namensliste">
          <label className="block">Zusätzliche Klarnamen, einer je Zeile (z. B. Bearbeiter aus Jira-Exporten)
            <textarea id="privacy-names" rows={4} value={namesText} onChange={(e) => setNamesText(e.target.value)} />
          </label>
          <p className="small muted">Die Datenschutzprüfung meldet außerdem E-Mail, Telefon, IBAN, Fahrgestellnummer, Kennzeichen, Benutzerkennung, Straßenadresse und Namen hinter Feldern wie „Autor:“ oder „Assignee:“. Treffer blockieren Freigabe und Export.</p>
        </Card>
        <LayoutCard />
        <DesignThemeCard />
        <MarketReviewersCard />
        <LanguageToolCard />
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
      resetReadingStyle();
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
      <label className="block">Stil für Leseransicht, Druck und Online-Hilfe
        <select value={d.readingStyle ?? 'standard'} onChange={(e) => set('readingStyle', e.target.value)}>
          <option value="standard">Standard (Hausfarbe)</option>
          <option value="fachdoku">Handbuch-Kapitel (Farben und Schriften der Designvorlage)</option>
        </select>
      </label>
      <label className="block">Vertraulichkeitshinweis <input value={d.confidentiality ?? ''} onChange={(e) => set('confidentiality', e.target.value)} placeholder="z. B. VERTRAULICH" /></label>
      <fieldset className="checks">
        <legend>Designvorlagen (Quick Reference Guide, Handbuch-Kapitel)</legend>
        <div className="form-row">
          <label>Zusatz unter der Marke <input value={d.productLine ?? ''} onChange={(e) => set('productLine', e.target.value)} maxLength={60} placeholder="z. B. für Transporter" /></label>
          <label>Dokumentart in der Kopfzeile <input value={d.docLabel ?? ''} onChange={(e) => set('docLabel', e.target.value)} maxLength={80} placeholder="z. B. oneSCM Fachdokumentation" /></label>
        </div>
        <label className="block">Wichtige Links und Ansprechpartner (Markdown, Quick Reference Guide)
          <textarea rows={4} value={d.quickRefLinks ?? ''} onChange={(e) => set('quickRefLinks', e.target.value)} maxLength={2000} placeholder="- **Schulungsmaterial** – [hier](https://schulung.example.org)" />
        </label>
      </fieldset>
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

/** Lokale Grammatikprüfung mit LanguageTool (ADR-108, G-04): Status des Java-Dienstes */
function LanguageToolCard() {
  const st = useLoad<any>('/style/language-tool');
  const d = st.data;
  return (
    <Card title="Grammatikprüfung (LanguageTool)">
      <ErrorBox error={st.error} />
      {d && (d.available
        ? <p><span className="tag st-approved">verbunden</span> Sprachen: {(d.languages ?? []).join(', ') || '–'}</p>
        : <p><span className="tag sev-medium">{d.configured ? 'nicht erreichbar' : 'nicht eingerichtet'}</span> {d.reason}</p>)}
      <p className="small muted">LanguageTool läuft als lokaler Java-Dienst (tools/languagetool, Umgebungsvariable LANGUAGETOOL_URL, nur lokale bzw. interne Adressen). Die Funde erscheinen in der Stilprüfung als Grammatik, Rechtschreibung, Zeichensetzung und Groß-/Kleinschreibung mit Korrektur per Klick. Ohne Dienst prüft die App mit den eigenen Regeln.</p>
    </Card>
  );
}

/** Ansprechperson je Land/Markt für das Länderreview mit Vertretung (ADR-108, O-09) */
function MarketReviewersCard() {
  const { notify } = useApp();
  const list = useLoad<any[]>('/market-reviewers');
  const people = useLoad<any[]>('/collaborators');
  const [f, setF] = useState({ market: '', language: '', userId: '', deputyUserId: '', note: '' });
  const save = async () => {
    try {
      list.setData(await put<any[]>('/market-reviewers', { ...f, language: f.language || undefined, deputyUserId: f.deputyUserId || undefined }));
      notify(`Ansprechperson für ${f.market.toUpperCase()} gespeichert.`);
      setF({ market: '', language: '', userId: '', deputyUserId: '', note: '' });
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const remove = async (market: string, language: string | null) => {
    try {
      await del(`/market-reviewers/${market}${language ? `?language=${encodeURIComponent(language)}` : ''}`);
      notify(`Ansprechperson für ${market} entfernt.`);
      list.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const person = (id: string, label: string, set: (v: string) => void, optional = false) => (
    <label>{label}
      <select value={id} onChange={(e) => set(e.target.value)}>
        <option value="">{optional ? '– keine –' : '– wählen –'}</option>
        {(people.data ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </label>
  );
  return (
    <Card title="Ansprechpersonen je Markt (Länderreview)">
      <p className="small muted">Fordert die Redaktion ein Länderreview ohne Prüferin bzw. Prüfer an, geht es an die Ansprechperson des Marktes; die Vertretung kann ebenso prüfen und übernimmt, wenn das Konto der Ansprechperson gesperrt ist. Ein Eintrag mit Sprache gilt vor dem Eintrag für alle Sprachen.</p>
      {!list.data?.length ? <Empty>Noch keine Ansprechpersonen.</Empty> : (
        <div className="table-wrap" role="region" aria-label="Ansprechpersonen je Markt" tabIndex={0}>
          <table className="table compact">
            <caption className="sr-only">Ansprechpersonen je Markt</caption>
            <thead><tr><th scope="col">Markt</th><th scope="col">Sprache</th><th scope="col">Ansprechperson</th><th scope="col">Vertretung</th><th scope="col"><span className="sr-only">Aktion</span></th></tr></thead>
            <tbody>{list.data.map((r) => (
              <tr key={`${r.market}-${r.language ?? ''}`}>
                <td>{r.market}</td><td>{r.language ?? 'alle'}</td><td>{r.userName}{!r.userActive && <span className="tag sev-medium"> gesperrt</span>}</td><td>{r.deputyName ?? '–'}</td>
                <td><button type="button" className="btn small" aria-label={`Ansprechperson ${r.market} ${r.language ?? ''} entfernen`} onClick={() => void remove(r.market, r.language)}>Entfernen</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <div className="form-row" role="group" aria-label="Ansprechperson festlegen">
        <label>Markt <input value={f.market} size={4} maxLength={2} placeholder="CH" onChange={(e) => setF({ ...f, market: e.target.value.toUpperCase() })} /></label>
        <label>Sprache <input value={f.language} size={6} maxLength={8} placeholder="alle" onChange={(e) => setF({ ...f, language: e.target.value.toLowerCase() })} /></label>
        {person(f.userId, 'Ansprechperson', (v) => setF({ ...f, userId: v }))}
        {person(f.deputyUserId, 'Vertretung', (v) => setF({ ...f, deputyUserId: v }), true)}
        <button type="button" className="btn" disabled={f.market.length !== 2 || !f.userId} onClick={() => void save()}>Ansprechperson speichern</button>
      </div>
    </Card>
  );
}
