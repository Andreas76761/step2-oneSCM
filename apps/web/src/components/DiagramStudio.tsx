// Bilder aus Text (ADR-041, ADR-042): Textstelle → Struktur (Regeln oder KI) → ASCII-Bild, Klickstrecke, Prozessbild, Infografik.
// Struktur und Darstellung (Farbe, Form, Schriftgröße, Stationen je Zeile) lassen sich nachbearbeiten und als Vorlage speichern;
// gespeicherte Bilder erhalten eine im Browser gerasterte PNG-Fassung für Word. Genutzt auf der Seite „Bilder“ und in der Werkstatt.
import { useEffect, useState } from 'react';
import { del, post } from '../api';
import { storeRendition, svgDataUrl } from '../images';
import { Card, Empty, errorText, useApp, useLoad } from './ui';

export type Kind = 'ascii' | 'clickpath' | 'process' | 'infographic';
export const KINDS: { kind: Kind; label: string; hint: string }[] = [
  { kind: 'ascii', label: 'ASCII-Bild', hint: 'Kästen und Pfeile aus Textzeichen – auch für Wikis und E-Mails' },
  { kind: 'clickpath', label: 'Klickstrecke', hint: 'Menüpfade und fett gesetzte Bedienelemente als nummerierte Stationen' },
  { kind: 'process', label: 'Prozessbild', hint: 'Ablaufdiagramm mit Start, Schritten, Entscheidungen (Ja/Nein) und Ende' },
  { kind: 'infographic', label: 'Infografik', hint: 'Kennzahlen als Kacheln und die wichtigsten Schritte' },
];

interface Step { label: string; decision?: boolean; yes?: string; no?: string }
export interface Structure { title: string; steps: Step[]; clicks: string[]; facts: { label: string; value: string }[] }
export interface Options { color: string; shape: 'rounded' | 'square' | 'pill'; textSize: 'normal' | 'large'; perRow: number }
interface Image { kind: Kind; label: string; title: string; svg: string; ascii: string | null; warnings: string[] }
interface Result { structure: Structure; options: Options; method: 'rules' | 'ai' | 'edited'; provider: { id: string; model: string } | null; aiAvailable: boolean; images: Image[] }
export interface Saved { kind: Kind; sha256: string; url: string; markdown: string; title: string; png: boolean }

export const SAMPLE = `## Auftrag anlegen
Öffnen Sie **Verkauf > Aufträge > Neu**.
Geben Sie die Kundennummer ein und klicken Sie auf **Übernehmen**.
Wenn der Kunde gesperrt ist, dann informieren Sie die Buchhaltung; sonst erfassen Sie die Positionen.
Klicken Sie auf **Speichern**.
Die Lieferfrist beträgt 14 Tage.
Mindestbestellwert: 50 Euro`;

const factsToText = (f: Structure['facts']) => f.map((x) => `${x.value} | ${x.label}`).join('\n');
const textToFacts = (t: string) => t.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0] && p[1]).map(([value, label]) => ({ value, label }));

export function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const move = <T,>(list: T[], i: number, d: number) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const out = [...list];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
};

/** Struktur (Schritte sortierbar, Entscheidungen mit Ja/Nein), Klickpfad, Kennzahlen und Darstellung bearbeiten */
function StructureEditor({ s, o, onChange, onOptions, onApply, busy }: {
  s: Structure; o: Options; onChange: (s: Structure) => void; onOptions: (o: Options) => void; onApply: () => void; busy: boolean;
}) {
  const [facts, setFacts] = useState(factsToText(s.facts));
  // Kennzahlen neu übernehmen, wenn die Struktur von außen wechselt (z. B. Vorlage geladen)
  useEffect(() => {
    if (JSON.stringify(textToFacts(facts)) !== JSON.stringify(s.facts)) setFacts(factsToText(s.facts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.facts]);
  const setStep = (i: number, patch: Partial<Step>) => onChange({ ...s, steps: s.steps.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  return (
    <details className="card">
      <summary>Erkannte Struktur bearbeiten ({s.steps.length} Schritte, {s.clicks.length} Klicks, {s.facts.length} Kennzahlen) · Darstellung</summary>
      <label className="block">Titel<input value={s.title} onChange={(e) => onChange({ ...s, title: e.target.value })} /></label>
      <fieldset className="step-list">
        <legend className="small">Schritte (Reihenfolge mit ↑ ↓ ändern)</legend>
        <ol>
          {s.steps.map((st, i) => (
            <li key={i}>
              <div className="step-row">
                <input aria-label={`Schritt ${i + 1}`} value={st.label} onChange={(e) => setStep(i, { label: e.target.value })} />
                <label className="inline small"><input type="checkbox" checked={!!st.decision} onChange={(e) => setStep(i, { decision: e.target.checked })} /> Entscheidung</label>
                <button type="button" className="btn small" aria-label={`Schritt ${i + 1} nach oben`} disabled={i === 0} onClick={() => onChange({ ...s, steps: move(s.steps, i, -1) })}>↑</button>
                <button type="button" className="btn small" aria-label={`Schritt ${i + 1} nach unten`} disabled={i === s.steps.length - 1} onClick={() => onChange({ ...s, steps: move(s.steps, i, 1) })}>↓</button>
                <button type="button" className="btn small danger" aria-label={`Schritt ${i + 1} entfernen`} onClick={() => onChange({ ...s, steps: s.steps.filter((_, j) => j !== i) })}>✕</button>
              </div>
              {st.decision && (
                <div className="step-row">
                  <input aria-label={`Schritt ${i + 1} Ja`} placeholder="Ja: …" value={st.yes ?? ''} onChange={(e) => setStep(i, { yes: e.target.value })} />
                  <input aria-label={`Schritt ${i + 1} Nein`} placeholder="Nein: …" value={st.no ?? ''} onChange={(e) => setStep(i, { no: e.target.value })} />
                </div>
              )}
            </li>
          ))}
        </ol>
        <button type="button" className="btn small" onClick={() => onChange({ ...s, steps: [...s.steps, { label: 'Neuer Schritt' }] })}>+ Schritt</button>
      </fieldset>
      <label className="block">Klickpfad (mit „&gt;“ getrennt)
        <input value={s.clicks.join(' > ')} onChange={(e) => onChange({ ...s, clicks: e.target.value.split('>').map((x) => x.trim()).filter(Boolean) })} />
      </label>
      <label className="block">Kennzahlen (je Zeile „Wert | Bezeichnung“)
        <textarea rows={3} value={facts} onChange={(e) => { setFacts(e.target.value); onChange({ ...s, facts: textToFacts(e.target.value) }); }} />
      </label>
      <fieldset className="filters">
        <legend className="small">Darstellung</legend>
        <label className="inline">Farbe <input type="color" aria-label="Farbe" value={o.color} onChange={(e) => onOptions({ ...o, color: e.target.value })} /></label>
        <label className="inline">Form
          <select aria-label="Form" value={o.shape} onChange={(e) => onOptions({ ...o, shape: e.target.value as Options['shape'] })}>
            <option value="rounded">abgerundet</option><option value="square">eckig</option><option value="pill">Pille</option>
          </select>
        </label>
        <label className="inline">Schriftgröße
          <select aria-label="Schriftgröße" value={o.textSize} onChange={(e) => onOptions({ ...o, textSize: e.target.value as Options['textSize'] })}>
            <option value="normal">normal</option><option value="large">groß</option>
          </select>
        </label>
        <label className="inline">Stationen je Zeile
          <input type="number" aria-label="Stationen je Zeile" min={2} max={6} value={o.perRow} onChange={(e) => onOptions({ ...o, perRow: Number(e.target.value) || 4 })} style={{ width: '4.5em' }} />
        </label>
      </fieldset>
      <button className="btn" disabled={busy} onClick={onApply}>Neu zeichnen</button>
    </details>
  );
}

function Templates({ canEdit, current, onLoad }: { canEdit: boolean; current: { structure: Structure; options: Options; kinds: Kind[] } | null; onLoad: (t: any) => void }) {
  const { notify } = useApp();
  const list = useLoad<any[]>('/diagram-templates');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const chosen = list.data?.find((t) => t.id === id);
  return (
    <fieldset className="filters diagram-templates">
      <legend className="small">Vorlagen</legend>
      <label className="inline">Vorlage
        <select aria-label="Vorlage" value={id} onChange={(e) => setId(e.target.value)}>
          <option value="">– wählen –</option>
          {(list.data ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label>
      <button className="btn small" disabled={!chosen} onClick={() => onLoad(chosen)}>Vorlage laden</button>
      {canEdit && <button className="btn small danger" disabled={!chosen} onClick={async () => {
        try {
          await del(`/diagram-templates/${id}`);
          setId('');
          list.reload();
          notify('Vorlage gelöscht.');
        } catch (e) {
          notify(errorText(e), 'error');
        }
      }}>Vorlage löschen</button>}
      {canEdit && current && (
        <>
          <label className="inline">Name <input aria-label="Name der Vorlage" value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Auftragsablauf" /></label>
          <button className="btn small" disabled={!name.trim()} onClick={async () => {
            try {
              await post('/diagram-templates', { name, ...current });
              setName('');
              list.reload();
              notify(`Vorlage „${name.trim()}“ gespeichert.`);
            } catch (e) {
              notify(errorText(e), 'error');
            }
          }}>Als Vorlage speichern</button>
        </>
      )}
    </fieldset>
  );
}

export function DiagramStudio({ initialText = '', canEdit, onSaved, showSample = true }: { initialText?: string; canEdit: boolean; onSaved?: (saved: Saved[]) => void; showSample?: boolean }) {
  const { notify } = useApp();
  const [text, setText] = useState(initialText);
  const [kinds, setKinds] = useState<Kind[]>(KINDS.map((k) => k.kind));
  const [useAi, setUseAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [draft, setDraft] = useState<Structure | null>(null);
  const [opts, setOpts] = useState<Options | null>(null);
  const [selected, setSelected] = useState<Kind[]>([]);
  const [alts, setAlts] = useState<Record<string, string>>({});
  const [editorKey, setEditorKey] = useState(0);
  useEffect(() => setText(initialText), [initialText]);

  const generate = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const r = await post<Result>('/diagrams/generate', body);
      setRes(r);
      setDraft(r.structure);
      setOpts(r.options);
      setSelected([]);
      setAlts(Object.fromEntries(r.images.map((i) => [i.kind, i.title])));
      if (r.method !== 'edited') setEditorKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!res) return;
    setBusy(true);
    const done: Saved[] = [];
    try {
      for (const img of res.images.filter((i) => selected.includes(i.kind))) {
        const r = await post<any>('/diagrams/save', { svg: img.svg, kind: img.kind, title: img.title, alt: alts[img.kind] });
        // PNG-Fassung für Word; scheitert sie, bleibt das Bild gespeichert (Word zeigt dann den Alternativtext)
        const png = await storeRendition(r.sha256, img.svg).then(() => true, () => false);
        done.push({ kind: img.kind, sha256: r.sha256, url: r.url, markdown: r.markdown, title: r.title, png });
      }
      notify(`${done.length} Bild(er) gespeichert.`);
      setSelected([]);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
      if (done.length) onSaved?.(done);
    }
  };

  const missingAlt = res?.images.some((i) => selected.includes(i.kind) && !alts[i.kind]?.trim());
  return (
    <>
      <Card title="Text">
        <label className="block">Textstelle
          <textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} placeholder="Textstelle hier einfügen – z. B. eine Schrittfolge, einen Menüpfad oder Kennzahlen …" />
        </label>
        <p className="small muted">Tipp: Menüpfade als „**Verkauf &gt; Aufträge**“, Entscheidungen als „Wenn …, dann …; sonst …“, Kennzahlen als „Frist: 14 Tage“.</p>
        <fieldset className="filters">
          <legend className="small">Bildarten</legend>
          {KINDS.map((k) => (
            <label key={k.kind} className="inline" title={k.hint}>
              <input type="checkbox" checked={kinds.includes(k.kind)} onChange={() => setKinds(toggle(kinds, k.kind))} /> {k.label}
            </label>
          ))}
        </fieldset>
        {canEdit && (
          <div className="filters"><label className="inline"><input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} /> Struktur mit KI erkennen (sonst Regeln)</label></div>
        )}
        <div className="filters">
          <button className="btn primary" disabled={busy || !text.trim() || !kinds.length} onClick={() => generate({ text, kinds, useAi: useAi && canEdit, ...(opts ? { options: opts } : {}) })}>Bilder erzeugen</button>
          {showSample && <button className="btn ghost" disabled={busy} onClick={() => setText(SAMPLE)}>Beispiel einfügen</button>}
        </div>
        <Templates canEdit={canEdit} current={draft && opts ? { structure: draft, options: opts, kinds } : null} onLoad={(t) => {
          setKinds(t.kinds);
          setEditorKey((k) => k + 1);
          void generate({ structure: t.structure, options: t.options, kinds: t.kinds });
        }} />
      </Card>

      {res && draft && opts && (
        <>
          <p className="small" role="status">
            {res.images.length} Bild(er) erzeugt · Struktur {res.method === 'ai' ? `per KI (${res.provider?.id}/${res.provider?.model})` : res.method === 'edited' ? 'manuell bearbeitet' : 'per Regeln erkannt'}
            {useAi && !res.aiAvailable ? ' · kein KI-Dienst eingerichtet' : ''}
          </p>
          <StructureEditor key={editorKey} s={draft} o={opts} onChange={setDraft} onOptions={setOpts} busy={busy} onApply={() => generate({ structure: draft, options: opts, kinds })} />
          <div className="diagram-grid">
            {res.images.map((img) => {
              const isSel = selected.includes(img.kind);
              return (
                <Card key={img.kind} className={`diagram-card${isSel ? ' selected' : ''}`} title={
                  <label className="inline"><input type="checkbox" checked={isSel} onChange={() => setSelected(toggle(selected, img.kind))} /> {img.label} auswählen</label>
                }>
                  {img.warnings.map((w) => <p key={w} className="small muted">ⓘ {w}</p>)}
                  <div className="diagram-preview"><img src={svgDataUrl(img.svg)} alt={alts[img.kind] || img.title} /></div>
                  {img.ascii && (
                    <details>
                      <summary>ASCII-Text</summary>
                      <pre className="diagram-ascii" tabIndex={0}>{img.ascii}</pre>
                    </details>
                  )}
                  <label className="block">Alternativtext (Pflicht zum Speichern)
                    <input value={alts[img.kind] ?? ''} onChange={(e) => setAlts({ ...alts, [img.kind]: e.target.value })} />
                  </label>
                  <div className="row-actions">
                    <button className="btn small ghost" onClick={() => download(`${img.kind}.svg`, img.svg, 'image/svg+xml')}>SVG herunterladen</button>
                    {img.ascii && <button className="btn small ghost" onClick={() => navigator.clipboard?.writeText(img.ascii!).then(() => notify('ASCII-Bild kopiert.'))}>ASCII kopieren</button>}
                  </div>
                </Card>
              );
            })}
          </div>
          {canEdit ? (
            <div className="filters">
              <button className="btn primary" disabled={busy || !selected.length || missingAlt} onClick={save}>Ausgewählte speichern ({selected.length})</button>
              {missingAlt && <span className="small">Bitte für jedes ausgewählte Bild einen Alternativtext angeben.</span>}
            </div>
          ) : <p className="small muted">Speichern erfordert Bearbeitungsrechte.</p>}
        </>
      )}
      {!res && <Empty>Text einfügen, Bildarten wählen und „Bilder erzeugen“ klicken.</Empty>}
    </>
  );
}
