// Bilder aus Text (ADR-041): Textstelle einfügen, Struktur erkennen (Regeln oder KI), ASCII-Bild, Klickstrecke, Prozessbild und
// Infografik erzeugen, Struktur nachbearbeiten, Bilder auswählen und in der Bildablage speichern (mit Titel fürs Bildverzeichnis).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../api';
import { Card, Empty, Page, errorText, useApp, useLoad } from '../components/ui';

type Kind = 'ascii' | 'clickpath' | 'process' | 'infographic';
const KINDS: { kind: Kind; label: string; hint: string }[] = [
  { kind: 'ascii', label: 'ASCII-Bild', hint: 'Kästen und Pfeile aus Textzeichen – auch für Wikis und E-Mails' },
  { kind: 'clickpath', label: 'Klickstrecke', hint: 'Menüpfade und fett gesetzte Bedienelemente als nummerierte Stationen' },
  { kind: 'process', label: 'Prozessbild', hint: 'Ablaufdiagramm mit Start, Schritten, Entscheidungen (Ja/Nein) und Ende' },
  { kind: 'infographic', label: 'Infografik', hint: 'Kennzahlen als Kacheln und die wichtigsten Schritte' },
];

interface Step { label: string; decision?: boolean; yes?: string; no?: string }
interface Structure { title: string; steps: Step[]; clicks: string[]; facts: { label: string; value: string }[] }
interface Image { kind: Kind; label: string; title: string; svg: string; ascii: string | null; warnings: string[] }
interface Result { structure: Structure; method: 'rules' | 'ai' | 'edited'; provider: { id: string; model: string } | null; aiAvailable: boolean; images: Image[] }
interface Saved { kind: Kind; sha256: string; url: string; markdown: string; title: string }

const SAMPLE = `## Auftrag anlegen
Öffnen Sie **Verkauf > Aufträge > Neu**.
Geben Sie die Kundennummer ein und klicken Sie auf **Übernehmen**.
Wenn der Kunde gesperrt ist, dann informieren Sie die Buchhaltung; sonst erfassen Sie die Positionen.
Klicken Sie auf **Speichern**.
Die Lieferfrist beträgt 14 Tage.
Mindestbestellwert: 50 Euro`;

// Struktur als bearbeitbarer Text: je Zeile ein Schritt („? Bedingung | Ja: … | Nein: …“), Klickpfad „A > B“, Kennzahl „Wert | Bezeichnung“
const stepsToText = (s: Step[]) => s.map((x) => (x.decision ? `? ${x.label}${x.yes ? ` | Ja: ${x.yes}` : ''}${x.no ? ` | Nein: ${x.no}` : ''}` : x.label)).join('\n');
function textToSteps(t: string): Step[] {
  return t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    if (!l.startsWith('?')) return { label: l };
    const [label, ...rest] = l.slice(1).split('|').map((x) => x.trim());
    const yes = rest.find((x) => /^ja:/i.test(x))?.replace(/^ja:\s*/i, '');
    const no = rest.find((x) => /^nein:/i.test(x))?.replace(/^nein:\s*/i, '');
    return { label, decision: true, ...(yes ? { yes } : {}), ...(no ? { no } : {}) };
  });
}
const factsToText = (f: Structure['facts']) => f.map((x) => `${x.value} | ${x.label}`).join('\n');
const textToFacts = (t: string) => t.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0] && p[1]).map(([value, label]) => ({ value, label }));

const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function StructureEditor({ s, onApply, busy }: { s: Structure; onApply: (s: Structure) => void; busy: boolean }) {
  const [title, setTitle] = useState(s.title);
  const [steps, setSteps] = useState(stepsToText(s.steps));
  const [clicks, setClicks] = useState(s.clicks.join(' > '));
  const [facts, setFacts] = useState(factsToText(s.facts));
  return (
    <details className="card">
      <summary>Erkannte Struktur bearbeiten ({s.steps.length} Schritte, {s.clicks.length} Klicks, {s.facts.length} Kennzahlen)</summary>
      <label className="block">Titel<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label className="block">Schritte (je Zeile einer; Entscheidung: „? Bedingung | Ja: … | Nein: …“)
        <textarea rows={6} value={steps} onChange={(e) => setSteps(e.target.value)} />
      </label>
      <label className="block">Klickpfad (mit „&gt;“ getrennt)<input value={clicks} onChange={(e) => setClicks(e.target.value)} /></label>
      <label className="block">Kennzahlen (je Zeile „Wert | Bezeichnung“)
        <textarea rows={3} value={facts} onChange={(e) => setFacts(e.target.value)} />
      </label>
      <button className="btn" disabled={busy} onClick={() => onApply({ title, steps: textToSteps(steps), clicks: clicks.split('>').map((x) => x.trim()).filter(Boolean), facts: textToFacts(facts) })}>
        Neu zeichnen
      </button>
    </details>
  );
}

export function DiagramsPage() {
  const { notify } = useApp();
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const [text, setText] = useState('');
  const [kinds, setKinds] = useState<Kind[]>(KINDS.map((k) => k.kind));
  const [useAi, setUseAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [selected, setSelected] = useState<Kind[]>([]);
  const [alts, setAlts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Saved[]>([]);
  const [editorKey, setEditorKey] = useState(0);

  const generate = async (structure?: Structure) => {
    setBusy(true);
    try {
      const r = await post<Result>('/diagrams/generate', structure ? { structure, kinds } : { text, kinds, useAi: useAi && canEdit });
      setRes(r);
      setSelected([]);
      setAlts(Object.fromEntries(r.images.map((i) => [i.kind, i.title])));
      if (!structure) setEditorKey((k) => k + 1);
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
        done.push({ kind: img.kind, sha256: r.sha256, url: r.url, markdown: r.markdown, title: r.title });
      }
      notify(`${done.length} Bild(er) gespeichert.`);
      setSelected([]);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setSaved((s) => [...done, ...s]);
      setBusy(false);
    }
  };

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const missingAlt = res?.images.some((i) => selected.includes(i.kind) && !alts[i.kind]?.trim());

  return (
    <Page title="Bilder" subtitle="Aus Textstellen ASCII-Bilder, Klickstrecken, Prozessbilder und Infografiken erzeugen, auswählen und speichern">
      <Card title="Text">
        <label className="block">Textstelle
          <textarea rows={9} value={text} onChange={(e) => setText(e.target.value)} placeholder="Textstelle hier einfügen – z. B. eine Schrittfolge, einen Menüpfad oder Kennzahlen …" />
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
          <button className="btn primary" disabled={busy || !text.trim() || !kinds.length} onClick={() => generate()}>Bilder erzeugen</button>
          <button className="btn ghost" disabled={busy} onClick={() => setText(SAMPLE)}>Beispiel einfügen</button>
        </div>
      </Card>

      {res && (
        <>
          <p className="small" role="status">
            {res.images.length} Bild(er) erzeugt · Struktur {res.method === 'ai' ? `per KI (${res.provider?.id}/${res.provider?.model})` : res.method === 'edited' ? 'manuell bearbeitet' : 'per Regeln erkannt'}
            {useAi && !res.aiAvailable ? ' · kein KI-Dienst eingerichtet' : ''}
          </p>
          <StructureEditor key={editorKey} s={res.structure} busy={busy} onApply={(s) => generate(s)} />
          <div className="diagram-grid">
            {res.images.map((img) => {
              const isSel = selected.includes(img.kind);
              return (
                <Card key={img.kind} className={`diagram-card${isSel ? ' selected' : ''}`} title={
                  <label className="inline"><input type="checkbox" checked={isSel} onChange={() => setSelected(toggle(selected, img.kind))} /> {img.label} auswählen</label>
                }>
                  {img.warnings.map((w) => <p key={w} className="small muted">ⓘ {w}</p>)}
                  <div className="diagram-preview"><img src={svgUrl(img.svg)} alt={alts[img.kind] || img.title} /></div>
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

      {saved.length > 0 && (
        <Card title="Gespeicherte Bilder">
          <p className="small">Im <Link to="/stammdaten/bildverzeichnis">Bildverzeichnis</Link> gelistet (Nummer, sobald in einem Kapitel verwendet) und in der Werkstatt über „Bild einfügen“ wählbar. Markdown zum Einfügen in einen Absatz:</p>
          <ul className="plain">
            {saved.map((s) => (
              <li key={s.sha256}>
                <strong>{s.title}</strong> <code>{s.markdown}</code>{' '}
                <button className="btn small ghost" onClick={() => navigator.clipboard?.writeText(s.markdown).then(() => notify('Markdown kopiert.'))}>Markdown kopieren</button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}
