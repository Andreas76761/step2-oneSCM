import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, get } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// oneSCM_Metadaten › Einlesen (ADR-086, M2): mehrere Dateien auf einmal, je Datei Ergebnis mit Chunks und Hinweisen

const FORMATS = [
  ['📝', 'Markdown', '.md, .markdown', 'Zeilen'],
  ['🌐', 'HTML / Confluence-Export', '.html, .htm', 'Abschnitt (Anker der Überschrift)'],
  ['📄', 'Word', '.docx', 'Abschnitt (Überschrift)'],
  ['📊', 'PowerPoint', '.pptx', 'Folie – Titel, Aufzählungen, Tabellen, Bilder, Sprechernotizen'],
  ['📕', 'PDF', '.pdf', 'Seite – Überschriften aus Lesezeichen bzw. Schriftgröße; gescannte Seiten erst mit M6'],
  ['🎫', 'Jira-Export', '.xml, .csv', 'Ticket'],
  ['🗜', 'ZIP', '.zip', 'alle Dateien darin, Bilder werden mit abgelegt'],
];
const ACCEPT = '.zip,.md,.markdown,.html,.htm,.docx,.pptx,.pdf,.xml,.csv';
const STATUS: Record<string, string> = { imported: 'eingelesen', identical: 'unverändert', skipped: 'übersprungen', failed: 'Fehler', media: 'Bild', removed: 'entfernt' };

type Run = { name: string; importId?: string; status: string; items: any[]; error?: string };

export function IngestPage() {
  const { notify } = useApp();
  const me = useLoad<{ permissions: string[] }>('/me');
  const canEdit = !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
  const settings = useLoad<any>('/settings');
  const [runs, setRuns] = useState<Run[]>([]);
  const [busy, setBusy] = useState(false);
  const allowed: string[] = settings.data?.import?.allowedExtensions ?? [];

  const upload = async (files: File[]) => {
    if (!files.length) return;
    setBusy(true);
    const next: Run[] = files.map((f) => ({ name: f.name, status: 'wartet', items: [] }));
    setRuns(next);
    const update = (i: number, r: Partial<Run>) => setRuns((cur) => cur.map((x, j) => (j === i ? { ...x, ...r } : x)));
    for (let i = 0; i < files.length; i++) {
      try {
        update(i, { status: 'läuft' });
        const fd = new FormData();
        fd.append('file', files[i]);
        const imp = await api<any>('POST', '/imports', fd);
        let cur = imp;
        for (let n = 0; n < 120 && ['queued', 'processing'].includes(cur.status); n++) {
          await new Promise((r) => setTimeout(r, 500));
          cur = await get<any>(`/imports/${imp.id}`);
        }
        update(i, { importId: imp.id, status: cur.status, items: cur.items ?? [] });
      } catch (e) {
        update(i, { status: 'failed', error: errorText(e) });
      }
    }
    setBusy(false);
    notify(`${files.length} Datei(en) verarbeitet.`);
  };

  return (
    <Page title="Einlesen" subtitle="Dokumente in oneSCM_Metadaten einlesen – je Folie, Seite oder Abschnitt mit Fundstelle, danach als Chunks labelbar">
      <div className="grid2">
        <Card title="Dateien">
          {!canEdit ? <p className="small muted">Einlesen erfordert das Recht „Bearbeiten“.</p> : (
            <label className={`dropzone ${busy ? 'busy' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void upload([...e.dataTransfer.files]); }}>
              <input type="file" multiple accept={ACCEPT} data-testid="ingest-input" disabled={busy} onChange={(e) => void upload([...(e.target.files ?? [])])} />
              <span>{busy ? 'Einlesen läuft …' : 'Eine oder mehrere Dateien hierher ziehen oder auswählen'}</span>
            </label>
          )}
          <p className="small muted">Die Originaldatei bleibt erhalten. Daten bleiben lokal – keine KI, kein externer Dienst. Ausschlussliste und Grenzen unter <Link to="/einstellungen">Einstellungen</Link>.</p>
        </Card>
        <Card title="Formate und Fundstelle">
          <table className="table compact">
            <thead><tr><th>Format</th><th>Endung</th><th>Fundstelle je Chunk</th></tr></thead>
            <tbody>
              {FORMATS.map(([icon, name, ext, loc]) => {
                const off = ext.split(', ').every((x) => allowed.length && !allowed.includes(x));
                return <tr key={name}><td>{icon} {name}{off && <span className="tag sev-medium">in den Einstellungen nicht erlaubt</span>}</td><td><code>{ext}</code></td><td className="small">{loc}</td></tr>;
              })}
            </tbody>
          </table>
        </Card>
      </div>
      <Card title="Ergebnis">
        <ErrorBox error={settings.error} />
        {!runs.length ? <Empty>Noch nichts eingelesen in dieser Sitzung. Frühere Importe stehen unter <Link to="/quellen">Quellen</Link>.</Empty> : (
          <ul className="rl-findings" aria-label="Eingelesene Dateien">
            {runs.map((r, i) => (
              <li key={i}>
                <strong>{r.name}</strong> <span className={`tag${r.status === 'failed' ? ' sev-high' : r.status === 'completed_with_errors' ? ' sev-medium' : ''}`}>{r.status === 'completed' ? 'fertig' : r.status === 'completed_with_errors' ? 'fertig mit Fehlern' : r.status === 'failed' ? 'fehlgeschlagen' : r.status}</span>
                {r.error && <p className="small">{r.error}</p>}
                {r.items.length > 0 && (
                  <table className="table compact">
                    <thead><tr><th>Datei</th><th>Status</th><th>Hinweis</th></tr></thead>
                    <tbody>
                      {r.items.map((it: any) => <tr key={it.id ?? it.path}><td>{it.path}</td><td>{STATUS[it.status] ?? it.status}</td><td className="small">{it.message}</td></tr>)}
                    </tbody>
                  </table>
                )}
              </li>
            ))}
          </ul>
        )}
        {runs.some((r) => r.items.some((it) => it.status === 'imported')) && <p><Link className="btn" to="/metadaten/chunks">Zu den Chunks →</Link></p>}
      </Card>
    </Page>
  );
}
