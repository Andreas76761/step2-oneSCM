// Bilder (ADR-041, ADR-042): aus Textstellen Diagramme erzeugen und nachbearbeiten, Screenshots markieren – auswählen und speichern.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DiagramStudio, type Saved } from '../components/DiagramStudio';
import { ScreenshotEditor } from '../components/ScreenshotEditor';
import { Card, Page, useApp, useLoad } from '../components/ui';

interface Entry { key: string; title: string; markdown: string; note?: string; legend?: string }

export function DiagramsPage() {
  const { notify } = useApp();
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const [tab, setTab] = useState<'text' | 'shot'>('text');
  const [saved, setSaved] = useState<Entry[]>([]);
  const copy = (t: string, what: string) => navigator.clipboard?.writeText(t).then(() => notify(`${what} kopiert.`));
  return (
    <Page title="Bilder" subtitle="Aus Textstellen ASCII-Bilder, Klickstrecken, Prozessbilder und Infografiken erzeugen, Screenshots markieren, auswählen und speichern">
      <div className="tabs" role="tablist" aria-label="Bildquelle">
        <button role="tab" aria-selected={tab === 'text'} className={tab === 'text' ? 'active' : ''} onClick={() => setTab('text')}>Aus Text</button>
        <button role="tab" aria-selected={tab === 'shot'} className={tab === 'shot' ? 'active' : ''} onClick={() => setTab('shot')}>Screenshot markieren</button>
      </div>
      <div role="tabpanel">
        {tab === 'text' && <DiagramStudio canEdit={canEdit} onSaved={(list: Saved[]) => setSaved((s) => [
          ...list.map((x) => ({ key: x.sha256, title: x.title, markdown: x.markdown, note: x.png ? 'mit PNG-Fassung für Word' : 'ohne PNG-Fassung – im Bildverzeichnis nachholen' })), ...s,
        ])} />}
        {tab === 'shot' && <ScreenshotEditor canEdit={canEdit} onSaved={(x) => setSaved((s) => [{ key: x.sha256, title: x.title, markdown: x.markdown, legend: x.legend }, ...s])} />}
      </div>

      {saved.length > 0 && (
        <Card title="Gespeicherte Bilder">
          <p className="small">Im <Link to="/stammdaten/bildverzeichnis">Bildverzeichnis</Link> gelistet (Nummer, sobald in einem Kapitel verwendet) und in der Werkstatt über „Bild einfügen“ wählbar. Markdown zum Einfügen in einen Absatz:</p>
          <ul className="plain">
            {saved.map((s) => (
              <li key={s.key}>
                <strong>{s.title}</strong> <code>{s.markdown}</code>{s.note && <span className="small muted"> · {s.note}</span>}{' '}
                <button className="btn small ghost" onClick={() => copy(s.legend ? `${s.markdown}\n\n${s.legend}` : s.markdown, 'Markdown')}>Markdown kopieren</button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}
