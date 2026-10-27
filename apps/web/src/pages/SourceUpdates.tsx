import { useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../api';
import { Card, Diff, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Update-Eingang (ADR-081, F-05): geänderte Quellen absatzweise übernehmen

const KIND: Record<string, { label: string; cls: string; help: string }> = {
  changed: { label: 'Geändert', cls: 'sev-medium', help: 'Der Quellabschnitt hat einen neuen Wortlaut.' },
  unchanged: { label: 'Neue Revision, gleicher Text', cls: 'sev-low', help: 'Nur die Quelle muss auf die neue Revision zeigen.' },
  removed: { label: 'Entfallen', cls: 'sev-high', help: 'Der Quellabschnitt ist in der neuen Revision nicht mehr enthalten.' },
  added: { label: 'Neu in der Quelle', cls: 'sev-low', help: 'Neuer Abschnitt im selben Kapitel der Quelle.' },
};
const STATUS: Record<string, string> = { draft: 'Entwurf', in_review: 'eingereicht', approved: 'freigegeben' };

export function SourceUpdatesPage() {
  const { notify } = useApp();
  const me = useLoad<{ permissions: string[] }>('/me');
  const canEdit = !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
  const data = useLoad<{ summary: any; items: any[] }>('/source-updates');
  const [reason, setReason] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const decide = async (item: any, action: string, label: string) => {
    setBusy(item.id);
    try {
      await post('/source-updates/decisions', { blockId: item.blockId, oldSnippetId: item.old?.snippetId ?? null, newSnippetId: item.new?.snippetId ?? null, action, reason: reason[item.id] || undefined });
      notify(label);
      data.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(null);
    }
  };

  const items = data.data?.items ?? [];
  const chapters = [...new Map(items.map((i) => [i.versionId, i])).values()];
  const s = data.data?.summary;
  return (
    <Page title="Quellenänderungen" subtitle="Geänderte Quellen absatzweise übernehmen – nichts ändert sich ohne Ihre Entscheidung">
      <ErrorBox error={data.error} />
      {s && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Offen</span><strong>{s.total}</strong></div>
          <div className="stat"><span className="muted small">Geändert</span><strong>{s.changed}</strong></div>
          <div className="stat"><span className="muted small">Entfallen</span><strong>{s.removed}</strong></div>
          <div className="stat"><span className="muted small">Neu in der Quelle</span><strong>{s.added}</strong></div>
        </div>
      )}
      {s?.regenerate > 0 && <p className="alert info">{s.regenerate} Übersichtsabsätze (Rollen, Quellenstatus) beziehen sich auf geänderte Quellen. Sie werden mit „Kapitel generieren“ in der Kapitelwerkstatt erneuert; übernommene Absätze bleiben dabei erhalten.</p>}
      {!items.length && !data.error ? <Card><Empty>Keine offenen Quellenänderungen. Neue Revisionen einer Quelle erscheinen hier, sobald Kapitel auf ihnen beruhen.</Empty></Card> : null}
      {chapters.map((c) => (
        <Card key={c.versionId} title={<>{c.chapter} <span className="muted small">Version {c.versionNo} · {STATUS[c.versionStatus] ?? c.versionStatus}</span></>}
          actions={<Link className="btn small" to={`/werkstatt/${c.chapterId}`}>In der Werkstatt öffnen</Link>}>
          {!c.editable && <p className="small muted">Diese Version ist {STATUS[c.versionStatus]} und unveränderlich. Änderungen übernehmen Sie in einer neuen Version („Kapitel generieren“); hier können Sie Hinweise verwerfen.</p>}
          {items.filter((i) => i.versionId === c.versionId).map((i) => (
            <article key={i.id} className="su-item" aria-label={`${KIND[i.kind].label}: ${i.path}`}>
              <div className="su-head small">
                <span className={`tag ${KIND[i.kind].cls}`}>{KIND[i.kind].label}</span>
                <span>{i.path}</span>
                {i.old && <span className="muted">Rev. {i.old.revisionNo}</span>}
                {i.new && <span className="muted">→ Rev. {i.new.revisionNo}</span>}
                {i.kind === 'changed' && <span className="muted">Ähnlichkeit {Math.round(i.similarity * 100)} %</span>}
                {i.documentRemoved && <span className="tag">Quelldatei entfernt</span>}
              </div>
              <p className="small muted">{KIND[i.kind].help}</p>
              <div className="su-grid">
                <div><div className="small muted">Absatz im Kapitel</div><p className="md-text">{i.blockText}</p></div>
                <div>
                  <div className="small muted">{i.kind === 'added' ? 'Neuer Abschnitt' : 'Quelle alt → neu'}</div>
                  {i.kind === 'changed' && <Diff a={i.old.text} b={i.new.text} />}
                  {i.kind === 'unchanged' && <p className="md-text">{i.new.text}</p>}
                  {i.kind === 'removed' && <p className="md-text su-removed">{i.old.text}</p>}
                  {i.kind === 'added' && <p className="md-text">{i.new.text}</p>}
                </div>
              </div>
              {canEdit && (
                <div className="filters">
                  {c.editable && i.kind === 'changed' && <button className="btn small primary" disabled={busy === i.id} onClick={() => decide(i, 'replace', 'Neuer Wortlaut übernommen.')}>Neuen Text übernehmen</button>}
                  {c.editable && (i.kind === 'changed' || i.kind === 'unchanged') && <button className="btn small" disabled={busy === i.id} onClick={() => decide(i, 'relink', 'Quelle aktualisiert, Text unverändert.')}>Nur Quelle aktualisieren</button>}
                  {c.editable && i.kind === 'added' && <button className="btn small primary" disabled={busy === i.id} onClick={() => decide(i, 'append', 'Abschnitt als neuer Absatz ergänzt.')}>Als Absatz ergänzen</button>}
                  {c.editable && i.kind === 'removed' && <button className="btn small" disabled={busy === i.id} onClick={() => decide(i, 'remove', 'Entfallene Quelle entfernt.')}>Absatz bzw. Quelle entfernen</button>}
                  <label className="grow"><span className="sr-only">Begründung</span><input value={reason[i.id] ?? ''} placeholder="Begründung (optional)" aria-label={`Begründung zu ${i.path}`} onChange={(e) => setReason({ ...reason, [i.id]: e.target.value })} /></label>
                  <button className="btn small ghost" disabled={busy === i.id} onClick={() => decide(i, 'dismiss', 'Hinweis verworfen.')}>Verwerfen</button>
                </div>
              )}
            </article>
          ))}
        </Card>
      ))}
    </Page>
  );
}
