// Kapitel-Assistent (ADR-052): ein Kapitel in vier Schritten schreiben – Aufgabe, Voraussetzungen, Schritte, Ergebnis –
// mit Vorschlägen aus den Quellen statt eines leeren Editors.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, download, get, post } from '../api';
import { Card, Empty, Modal, Page, errorText, useApp, useLoad } from '../components/ui';
import { scoreLabel } from './Guidance';

interface Line { text: string; snippetId?: string | null }
interface Suggestion { text: string; snippetId: string; seq: number; path: string }
type Suggestions = Record<'steps' | 'prerequisites' | 'result' | 'hints', Suggestion[]>;

const STEPS = [
  { key: 'task', title: 'Aufgabe', help: 'Worum geht es, und wozu brauchen Leser diese Anleitung?' },
  { key: 'prereq', title: 'Voraussetzungen', help: 'Was muss erledigt sein, bevor man beginnt?' },
  { key: 'steps', title: 'Schritte', help: 'Was ist nacheinander zu tun? Eine Handlung je Schritt.' },
  { key: 'result', title: 'Ergebnis & Tipps', help: 'Woran erkennt man, dass es geklappt hat?' },
] as const;

/** Liste mit Hinzufügen, Verschieben, Entfernen */
function LineList({ label, lines, onChange, numbered, placeholder }: { label: string; lines: Line[]; onChange: (l: Line[]) => void; numbered?: boolean; placeholder: string }) {
  const [draft, setDraft] = useState('');
  const move = (i: number, d: number) => {
    const n = [...lines];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    onChange(n);
  };
  const add = () => {
    if (!draft.trim()) return;
    onChange([...lines, { text: draft.trim() }]);
    setDraft('');
  };
  const List = numbered ? 'ol' : 'ul';
  return (
    <div className="line-list">
      {lines.length > 0 && (
        <List className="line-items" aria-label={label}>
          {lines.map((l, i) => (
            <li key={i}>
              <input aria-label={`${label} ${i + 1}`} value={l.text} onChange={(e) => onChange(lines.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
              {l.snippetId && <span className="tag small" title="Aus einer Quelle übernommen – bleibt als Beleg verknüpft">Quelle</span>}
              <span className="row-actions">
                <button className="btn small" disabled={i === 0} aria-label={`${label} ${i + 1} nach oben`} onClick={() => move(i, -1)}>↑</button>
                <button className="btn small" disabled={i === lines.length - 1} aria-label={`${label} ${i + 1} nach unten`} onClick={() => move(i, 1)}>↓</button>
                <button className="btn small danger" aria-label={`${label} ${i + 1} entfernen`} onClick={() => onChange(lines.filter((_, j) => j !== i))}>✕</button>
              </span>
            </li>
          ))}
        </List>
      )}
      <div className="filters">
        <label className="inline grow">Neuer Eintrag
          <input value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        </label>
        <button className="btn" disabled={!draft.trim()} onClick={add}>Hinzufügen</button>
      </div>
    </div>
  );
}

/** Vorschläge aus den Quellen; übernommene verschwinden aus der Liste */
function SuggestionList({ title, items, used, onTake }: { title: string; items: Suggestion[]; used: Set<string>; onTake: (s: Suggestion[]) => void }) {
  const open = items.filter((s) => !used.has(s.text));
  if (!items.length) return <p className="small muted">Keine passenden Sätze in den Quellen gefunden – schreiben Sie die Einträge selbst.</p>;
  return (
    <div className="suggestions" role="region" aria-label={title}>
      <div className="card-head"><h3>{title}</h3>{open.length > 1 && <button className="btn small" onClick={() => onTake(open)}>Alle übernehmen ({open.length})</button>}</div>
      {!open.length ? <p className="small muted">Alle Vorschläge übernommen.</p> : (
        <ul className="plain">
          {open.map((s) => (
            <li key={`${s.snippetId}-${s.text}`} className="suggestion">
              <span>{s.text} <span className="small muted">· {s.path} #{s.seq}</span></span>
              <button className="btn small" aria-label={`Übernehmen: ${s.text}`} onClick={() => onTake([s])}>Übernehmen</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const sentence = (t: string) => (/[.!?:]$/.test(t) ? t : `${t}.`);
/** **fett** in der Vorschau darstellen */
const inline = (t: string) => sentence(t).split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part));

export function ChapterAssistantPage() {
  const { notify } = useApp();
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [prerequisites, setPrerequisites] = useState<Line[]>([]);
  const [steps, setSteps] = useState<Line[]>([]);
  const [result, setResult] = useState('');
  const [hints, setHints] = useState<Line[]>([]);
  const [sugg, setSugg] = useState<Suggestions | null>(null);
  const [loadingSugg, setLoadingSugg] = useState(false);
  const [created, setCreated] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  // Kapitelvorlagen (ADR-055): füllen leere bzw. noch unveränderte Felder
  const templates = useLoad<any[]>('/chapter-assistant/templates');
  const [tplId, setTplId] = useState('');
  const applyTemplate = (id: string) => {
    const prev = templates.data?.find((t) => t.id === tplId);
    const t = templates.data?.find((x) => x.id === id);
    const same = (lines: Line[], src?: string[]) => !lines.length || (!!src && lines.map((l) => l.text).join('\n') === src.join('\n'));
    const lines = (src: string[]) => src.map((text) => ({ text }));
    setTplId(id);
    if (!purpose.trim() || purpose === prev?.purpose) setPurpose(t?.purpose ?? '');
    if (same(prerequisites, prev?.prerequisites)) setPrerequisites(t ? lines(t.prerequisites) : []);
    if (same(steps, prev?.steps)) setSteps(t ? lines(t.steps) : []);
    if (!result.trim() || result === prev?.result) setResult(t?.result ?? '');
    if (same(hints, prev?.hints)) setHints(t ? lines(t.hints) : []);
  };
  const placeholderCount = [purpose, result, ...prerequisites.map((l) => l.text), ...steps.map((l) => l.text), ...hints.map((l) => l.text)].filter((t) => /…|\.\.\./.test(t)).length;

  const loadSuggestions = async () => {
    setLoadingSugg(true);
    try {
      setSugg((await get<any>(`/chapter-assistant/suggestions?topic=${encodeURIComponent(title)}`)).suggestions);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setLoadingSugg(false);
    }
  };
  const next = async () => {
    if (step === 0 && !sugg) await loadSuggestions();
    setStep(step + 1);
  };
  const missing = step === 0 ? (!title.trim() ? 'Bitte geben Sie der Aufgabe einen Namen.' : !purpose.trim() ? 'Bitte beschreiben Sie kurz, wozu die Anleitung dient.' : null)
    : step === 2 && !steps.length ? 'Mindestens ein Schritt ist nötig.' : null;
  const take = (setter: (fn: (l: Line[]) => Line[]) => void) => (s: Suggestion[]) => setter((l) => [...l, ...s.map((x) => ({ text: x.text, snippetId: x.snippetId }))]);
  const usedOf = (l: Line[]) => new Set(l.map((x) => x.text));

  const create = async () => {
    setBusy(true);
    try {
      const r = await post<any>('/chapter-assistant', { title, purpose, prerequisites, steps, result, hints });
      setCreated(r);
      notify('Kapitel angelegt.');
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    const g = created.guidance;
    return (
      <Page title="Kapitel-Assistent" subtitle="Fertig – das Kapitel ist als Entwurf angelegt">
        <Card title={`„${title}“ ist angelegt`}>
          <p>Leserfreundlichkeit: <strong>{g.score}</strong> von 100 ({scoreLabel(g.score)}), {g.passed} von {g.total} Punkten erfüllt.</p>
          <div className="row-actions">
            <Link className="btn primary" to={`/werkstatt/${created.chapterId}`}>In der Werkstatt weiterbearbeiten</Link>
            <Link className="btn" to={`/anleitungs-check/${created.versionId}`}>Anleitungs-Check ansehen</Link>
            <button className="btn" onClick={() => { setCreated(null); setStep(0); setTitle(''); setPurpose(''); setPrerequisites([]); setSteps([]); setResult(''); setHints([]); setSugg(null); setTplId(''); }}>Weiteres Kapitel schreiben</button>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Kapitel-Assistent" subtitle="Ein Kapitel Schritt für Schritt schreiben – mit Vorschlägen aus Ihren Quellen">
      {!canEdit && me.data && <p className="alert">Zum Anlegen von Kapiteln ist die Berechtigung „Bearbeiten“ nötig.</p>}
      <ol className="stepper" aria-label="Fortschritt">
        {STEPS.map((s, i) => (
          <li key={s.key} className={i === step ? 'current' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="stepper-no" aria-hidden="true">{i < step ? '✓' : i + 1}</span> {s.title}{i < step && <span className="sr-only"> (erledigt)</span>}
          </li>
        ))}
      </ol>
      <div className="assistant-grid">
        <Card title={`${step + 1}. ${STEPS[step].title}`}>
          <p className="muted">{STEPS[step].help}</p>
          {step === 0 && (
            <>
              <fieldset className="tpl-choice">
                <legend>Vorlage (optional) – bewährter Aufbau für typische Aufgaben</legend>
                <label className={`tpl-option${tplId === '' ? ' selected' : ''}`}><input type="radio" name="tpl" checked={tplId === ''} onChange={() => applyTemplate('')} /> <span><strong>Ohne Vorlage</strong><span className="small muted">Alles selbst schreiben</span></span></label>
                {(templates.data ?? []).map((t) => (
                  <label key={t.id} className={`tpl-option${tplId === t.id ? ' selected' : ''}`}>
                    <input type="radio" name="tpl" checked={tplId === t.id} onChange={() => applyTemplate(t.id)} /> <span><strong>{t.name}{!t.builtin && <span className="tag tpl-own">eigene</span>}</strong><span className="small muted">{t.description}</span></span>
                  </label>
                ))}
              </fieldset>
              {tplId && <p className="small">Die Vorlage füllt die Felder vor. Ersetzen Sie jedes „…“ durch die Begriffe Ihrer Aufgabe.</p>}
              <label className="block">Name der Aufgabe (wird die Kapitelüberschrift)
                <input value={title} maxLength={160} placeholder={templates.data?.find((t) => t.id === tplId)?.titleHint ? `z. B. ${templates.data.find((t) => t.id === tplId).titleHint.replace('…', 'Vertrag')}` : 'z. B. Wareneingang buchen'} onChange={(e) => { setTitle(e.target.value); setSugg(null); }} />
              </label>
              <label className="block">Wozu dient die Anleitung?
                <textarea rows={3} value={purpose} placeholder="Mit dieser Anleitung buchen Sie eine Lieferung in den Bestand. Sie brauchen sie, sobald Ware eintrifft." onChange={(e) => setPurpose(e.target.value)} />
              </label>
              <p className="small muted">Tipp: Beschreiben Sie die Aufgabe aus Sicht der Leser – „Sie …“ statt „Das System …“.</p>
            </>
          )}
          {step === 1 && <LineList label="Voraussetzung" lines={prerequisites} onChange={setPrerequisites} placeholder="z. B. Sie haben die Berechtigung Lager" />}
          {step === 2 && (
            <>
              <LineList label="Schritt" numbered lines={steps} onChange={setSteps} placeholder="z. B. Klicken Sie auf **Speichern**" />
              <p className="small muted">Jeder Schritt beginnt mit einer Handlung („Öffnen Sie …“, „Klicken Sie …“). Menüpfade und Schaltflächen setzen Sie mit **…** fett.</p>
            </>
          )}
          {step === 3 && (
            <>
              <label className="block">Ergebnis: Was zeigt das System nach dem letzten Schritt?
                <textarea rows={2} value={result} placeholder="Der Wareneingang ist gebucht und im Bestand sichtbar." onChange={(e) => setResult(e.target.value)} />
              </label>
              <h3>Hinweise und Tipps (optional)</h3>
              <LineList label="Hinweis" lines={hints} onChange={setHints} placeholder="z. B. Teillieferungen buchen Sie einzeln" />
            </>
          )}
          {missing && step !== 1 && step !== 3 && <p className="small" role="status">{missing}</p>}
          <div className="row-actions wizard-nav">
            {step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>← Zurück</button>}
            {step < STEPS.length - 1 && <button className="btn primary" disabled={!!missing || loadingSugg} onClick={() => void next()}>{loadingSugg ? 'Suche Vorschläge …' : 'Weiter →'}</button>}
            {step === STEPS.length - 1 && <button className="btn primary" disabled={busy || !canEdit} onClick={() => void create()}>Kapitel anlegen</button>}
          </div>
          <div>
            {placeholderCount > 0 && step > 0 && <p className="alert small" role="status">Noch {placeholderCount} {placeholderCount === 1 ? 'Eintrag enthält' : 'Einträge enthalten'} Platzhalter „…“ – bitte durch konkrete Begriffe ersetzen.</p>}
          </div>
        </Card>
        <div>
          {step > 0 && sugg && (
            <Card title="Vorschläge aus den Quellen">
              {step === 1 && <SuggestionList title="Mögliche Voraussetzungen" items={sugg.prerequisites} used={usedOf(prerequisites)} onTake={take(setPrerequisites)} />}
              {step === 2 && <SuggestionList title="Mögliche Schritte (in Quellreihenfolge)" items={sugg.steps} used={usedOf(steps)} onTake={take(setSteps)} />}
              {step === 3 && (
                <>
                  {sugg.result.length > 0 && (
                    <div className="suggestions" role="region" aria-label="Mögliches Ergebnis">
                      <h3>Mögliches Ergebnis</h3>
                      <ul className="plain">
                        {sugg.result.map((s) => (
                          <li key={s.text} className="suggestion"><span>{s.text}</span><button className="btn small" aria-label={`Als Ergebnis übernehmen: ${s.text}`} onClick={() => setResult(s.text)}>Übernehmen</button></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <SuggestionList title="Mögliche Hinweise" items={sugg.hints} used={usedOf(hints)} onTake={take(setHints)} />
                </>
              )}
            </Card>
          )}
          {step > 0 && (
            <Card title="Vorschau">
              <div className="preview">
                <h3>{title || 'Ohne Titel'}</h3>
                <p>{purpose}</p>
                {prerequisites.length > 0 && <><h4>Voraussetzungen</h4><ul>{prerequisites.map((l, i) => <li key={i}>{inline(l.text)}</li>)}</ul></>}
                {steps.length > 0 ? <><h4>Schrittweise Durchführung</h4><ol>{steps.map((l, i) => <li key={i}>{inline(l.text)}</li>)}</ol></> : <Empty>Noch keine Schritte.</Empty>}
                {result && <><h4>Ergebnis</h4><p>{result}</p></>}
                {hints.length > 0 && <><h4>Tipps</h4><ul>{hints.map((l, i) => <li key={i}>{inline(l.text)}</li>)}</ul></>}
              </div>
            </Card>
          )}
        </div>
      </div>
      {step === 0 && canEdit && <OwnTemplates templates={(templates.data ?? []).filter((t) => !t.builtin)} builtins={(templates.data ?? []).filter((t) => t.builtin)} onChanged={templates.reload} />}
    </Page>
  );
}

/** Eigene Vorlagen bearbeiten, kopieren, austauschen und löschen (ADR-059, ADR-062, ADR-067); neue entstehen in der Werkstatt über „Als Vorlage“ */
function OwnTemplates({ templates, builtins, onChanged }: { templates: any[]; builtins: any[]; onChanged: () => void }) {
  const { notify } = useApp();
  const [editing, setEditing] = useState<any | null>(null);
  const [copyFrom, setCopyFrom] = useState('');
  const run = async (fn: () => Promise<unknown>, msg: (r: any) => string) => {
    try {
      const r = await fn();
      notify(msg(r));
      onChanged();
      return r;
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const duplicate = (id: string) => run(() => post<any>('/chapter-templates/duplicate', { id }), (r) => `Kopie „${r.name}“ angelegt – jetzt anpassen.`);
  const importFile = async (file: File) => {
    let data: unknown;
    try {
      data = JSON.parse(await file.text());
    } catch {
      notify('Die Datei ist kein gültiges JSON – bitte eine exportierte Vorlagendatei wählen.', 'error');
      return;
    }
    await run(() => post<any>('/chapter-templates/import', data), (r) => {
      const renamed = r.templates.filter((t: any) => t.renamedFrom).length;
      return `${r.imported} Vorlage${r.imported === 1 ? '' : 'n'} importiert${renamed ? ` (${renamed} umbenannt, da der Name schon vergeben war)` : ''}.`;
    });
  };
  return (
    <Card title="Eigene Vorlagen">
      <div className="row-actions template-tools">
        <label className="inline">Vorlage kopieren
          <select value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)}>
            <option value="">– wählen –</option>
            <optgroup label="Mitgeliefert">{builtins.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>
            {templates.length > 0 && <optgroup label="Eigene">{templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>}
          </select>
        </label>
        <button className="btn small" disabled={!copyFrom} onClick={async () => { const id = copyFrom; setCopyFrom(''); await duplicate(id); }}>Als eigene Vorlage kopieren</button>
        <button className="btn small" disabled={!templates.length} onClick={() => download('/api/v1/chapter-templates/export', 'kapitelvorlagen.json').catch((e) => notify(errorText(e), 'error'))}>📤 Alle exportieren</button>
        <label className="btn small file-btn">📥 Importieren
          <input type="file" accept=".json,application/json" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void importFile(f); }} />
        </label>
      </div>
      {!templates.length ? <p className="small muted">Noch keine eigenen Vorlagen. In der Kapitelwerkstatt macht „💾 Als Vorlage“ aus einem gelungenen Kapitel eine Vorlage; oder kopieren Sie oben eine mitgelieferte Vorlage und passen sie an. Vorlagen aus anderen Projekten übernehmen Sie per Export und Import.</p> : (
        <ul className="plain own-templates">
          {templates.map((t) => (
            <li key={t.id}>
              <strong>{t.name}</strong>
              <span className="small muted">{t.steps.length} Schritte{t.description ? ` · ${t.description}` : ''}</span>
              <span className="row-actions">
                <button className="btn small" onClick={() => setEditing(t)} aria-label={`Vorlage „${t.name}“ bearbeiten`}>✏️ Bearbeiten</button>
                <button className="btn small" onClick={() => duplicate(t.id)} aria-label={`Vorlage „${t.name}“ duplizieren`}>Duplizieren</button>
                <button className="btn small" onClick={() => download(`/api/v1/chapter-templates/export?ids=${t.id}`, 'kapitelvorlage.json').catch((e) => notify(errorText(e), 'error'))} aria-label={`Vorlage „${t.name}“ exportieren`}>📤</button>
                <button className="btn small danger" onClick={() => run(() => api('DELETE', `/chapter-templates/${t.id}`), () => `Vorlage „${t.name}“ gelöscht.`)} aria-label={`Vorlage „${t.name}“ löschen`}>Löschen</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {editing && <TemplateEditor template={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); onChanged(); }} />}
    </Card>
  );
}

const toLines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

/** Alle Teile einer eigenen Vorlage in einem Dialog bearbeiten (ADR-062): Listen als eine Zeile je Eintrag */
function TemplateEditor({ template, onClose, onSaved }: { template: any; onClose: () => void; onSaved: () => void }) {
  const { notify } = useApp();
  const [f, setF] = useState({
    name: template.name ?? '', description: template.description ?? '', titleHint: template.titleHint ?? '', purpose: template.purpose ?? '',
    prerequisites: (template.prerequisites ?? []).join('\n'), steps: (template.steps ?? []).join('\n'), result: template.result ?? '', hints: (template.hints ?? []).join('\n'),
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const steps = toLines(f.steps);
  const save = async () => {
    setBusy(true);
    try {
      await api('PATCH', `/chapter-templates/${template.id}`, {
        name: f.name.trim(), description: f.description, titleHint: f.titleHint, purpose: f.purpose,
        prerequisites: toLines(f.prerequisites), steps, result: f.result, hints: toLines(f.hints),
      });
      notify(`Vorlage „${f.name.trim()}“ gespeichert.`);
      onSaved();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Vorlage bearbeiten: ${template.name}`} onClose={onClose} wide>
      <div className="template-editor">
        <label>Name <input value={f.name} onChange={set('name')} maxLength={120} /></label>
        <label>Kurzbeschreibung <input value={f.description} onChange={set('description')} maxLength={300} /></label>
        <label>Titelvorschlag <input value={f.titleHint} onChange={set('titleHint')} maxLength={160} placeholder="z. B. Lieferanten anlegen" /></label>
        <label>Wozu dient die Aufgabe? <textarea rows={2} value={f.purpose} onChange={set('purpose')} /></label>
        <label>Voraussetzungen <span className="small muted">(eine je Zeile)</span><textarea rows={3} value={f.prerequisites} onChange={set('prerequisites')} /></label>
        <label>Schritte <span className="small muted">(einer je Zeile · {steps.length} erkannt)</span><textarea rows={6} value={f.steps} onChange={set('steps')} /></label>
        <label>Ergebnis <textarea rows={2} value={f.result} onChange={set('result')} /></label>
        <label>Tipps <span className="small muted">(einer je Zeile)</span><textarea rows={3} value={f.hints} onChange={set('hints')} /></label>
        {!steps.length && <p className="small" role="alert">Eine Vorlage braucht mindestens einen Schritt.</p>}
        <div className="row-actions">
          <button className="btn primary" disabled={busy || !f.name.trim() || !steps.length} onClick={save}>Speichern</button>
          <button className="btn" onClick={onClose}>Abbrechen</button>
        </div>
      </div>
    </Modal>
  );
}
