// Kapitelwerkstatt: Seitenleiste (Quellen, Befunde, Historie), Vorlage speichern, Hinweise zu Pipeline und Kapitelanweisung.
import { SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get, post } from '../api';
import { Gated, Diff, Empty, ErrorBox, Severity, Status, TYPE_LABEL, errorText, useApp, useLoad, Modal } from '../components/ui';
import { SourceViewer } from './Sources';
import { formatDateTime } from '../format';

export function SourcesTab({ block }: { block?: any }) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [viewer, setViewer] = useState<any | null>(null);
  useEffect(() => {
    if (!block) return;
    for (const s of block.sources) get<any>(`/snippets/${s.snippetId}`).then((sn) => setTexts((t) => ({ ...t, [s.snippetId]: sn.text }))).catch(() => undefined);
  }, [block?.id]);
  if (!block) return <Empty>Wählen Sie im Kapitel einen Absatz, um seine Quellen zu sehen.</Empty>;
  if (!block.sources.length) return <Empty>{block.justification ? `Keine Quelle – manuelle Begründung: ${block.justification}` : 'Dieser Block hat weder Quelle noch Begründung (Qualitätsgate!).'}</Empty>;
  return (
    <div>
      {block.sentences && (
        <div className="source-item">
          <h3>Satz-Evidenz (KI-umformuliert)</h3>
          <ol className="small">
            {block.sentences.map((s: any, i: number) => (
              <li key={i}>{s.text} {s.sourceIds.map((id: string) => <span key={id} className="tag">#{block.sources.find((x: any) => x.snippetId === id)?.seq ?? '?'}</span>)}</li>
            ))}
          </ol>
        </div>
      )}
      {block.sources.map((s: any) => (
        <div key={s.snippetId} className="source-item">
          <div className="small"><strong>#{s.seq}</strong> {s.path} · Rev. {s.revisionNo}{s.isCurrent ? '' : ' (veraltet)'} · Z. {s.lineStart}–{s.lineEnd} · <Status s={s.evidenceStatus} /></div>
          <pre tabIndex={0} aria-label="Quelltext" className="source small">{texts[s.snippetId] ?? '…'}</pre>
          <button className="btn link small" onClick={() => setViewer(s)}>Quelle öffnen</button>
        </div>
      ))}
      {viewer && <SourceViewer revisionId={viewer.revisionId} lineStart={viewer.lineStart} lineEnd={viewer.lineEnd} onClose={() => setViewer(null)} />}
    </div>
  );
}

export function FindingsTab({ chapterId }: { chapterId: string }) {
  const f = useLoad<any[]>(`/quality/findings?chapterId=${chapterId}&status=open,deferred`, [chapterId]);
  if (!f.data?.length) return <Empty>Keine offenen Befunde für dieses Kapitel.</Empty>;
  return (
    <ul className="finding-list">
      {f.data.map((x) => (
        <li key={x.id}><Severity s={x.severity} /> <strong>#{x.seq} {TYPE_LABEL[x.type]}</strong><div className="small">{x.reason}</div></li>
      ))}
    </ul>
  );
}

export function HistoryTab({ block, editable, onRestored }: { block?: any; editable: boolean; onRestored: () => void }) {
  const { notify } = useApp();
  const h = useLoad<any[]>(block ? `/content-blocks/${block.id}/versions` : null, [block?.id, block?.versionNo]);
  const [cmp, setCmp] = useState<[number, number] | null>(null);
  if (!block) return <Empty>Block auswählen, um die Historie zu sehen.</Empty>;
  const versions = h.data ?? [];
  const find = (n: number) => versions.find((v) => v.versionNo === n)?.snapshot.text ?? '';
  return (
    <div>
      <ErrorBox error={h.error} />
      <ul className="history">
        {versions.map((v) => (
          <li key={v.versionNo}>
            <strong>v{v.versionNo}</strong> {v.changeType} · {v.author} · {formatDateTime(v.createdAt)}
            {v.reason && <div className="small muted">{v.reason}</div>}
            <div className="row-actions">
              {v.versionNo !== block.versionNo && <button className="btn small" onClick={() => setCmp([v.versionNo, block.versionNo])}>mit aktueller vergleichen</button>}
              {editable && v.versionNo !== block.versionNo && (
                <button className="btn small" onClick={async () => {
                  try {
                    await post(`/content-blocks/${block.id}/restore`, { versionNo: v.versionNo });
                    notify(`Version ${v.versionNo} wiederhergestellt.`);
                    onRestored();
                  } catch (e) {
                    notify(errorText(e), 'error');
                  }
                }}>wiederherstellen</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {cmp && (
        <div>
          <h3>Vergleich v{cmp[0]} → v{cmp[1]}</h3>
          <Diff a={find(cmp[0])} b={find(cmp[1])} />
        </div>
      )}
    </div>
  );
}

/** „Als Vorlage speichern“ (ADR-059): Aufbau dieses Kapitels als eigene Vorlage für den Kapitel-Assistenten */
export function SaveTemplateButton({ versionId, title }: { versionId: string; title: string }) {
  const { notify } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  return (
    <>
      <button className="btn" onClick={() => { setName(title.replace(/^\d+(\.\d+)*\.?\s*/, '')); setOpen(true); }}><SaveIcon className="btn-icon" aria-hidden="true" size={16} />Als Vorlage</button>
      {open && (
        <Modal title="Als Vorlage speichern" onClose={() => setOpen(false)}>
          <p className="small">Zweck, Voraussetzungen, Schritte, Ergebnis und Tipps dieses Kapitels werden zur Vorlage im Kapitel-Assistenten. Ersetzen Sie danach konkrete Begriffe bei Bedarf durch „…“.</p>
          <label className="block">Name der Vorlage <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} /></label>
          <label className="block">Beschreibung (optional) <input value={description} maxLength={300} onChange={(e) => setDescription(e.target.value)} placeholder="Wofür eignet sich die Vorlage?" /></label>
          <div className="row-actions">
            <Gated className="btn primary" missing={[!name.trim() && 'Name']} onClick={async () => {
              try {
                await post('/chapter-templates', { name, description, fromVersionId: versionId });
                notify(`Vorlage „${name}“ gespeichert – im Kapitel-Assistenten wählbar.`);
                setOpen(false);
              } catch (e) {
                notify(errorText(e), 'error');
              }
            }}>Speichern</Gated>
            <button className="btn" onClick={() => setOpen(false)}>Abbrechen</button>
          </div>
        </Modal>
      )}
    </>
  );
}

/** Pipeline (ADR-098): Tickets dieses Kapitels in Bearbeitung – vorab dokumentiert, aber noch nicht produktiv */
export function PipelineBanner({ chapterId }: { chapterId: string }) {
  const r = useLoad<any>(`/work-areas?area=pipeline&chapterId=${encodeURIComponent(chapterId)}`, [chapterId]);
  const items = (r.data?.items ?? []).filter((i: any) => i.state !== 'cancelled' && i.state !== 'live');
  if (!items.length) return null;
  const ready = items.filter((i: any) => i.state === 'ready').length;
  return (
    <aside className="alert info ws-instruction" aria-label="Pipeline">
      <strong>Pipeline:</strong> {items.length} Ticket{items.length === 1 ? '' : 's'} für dieses Kapitel in Bearbeitung ({items.map((i: any) => i.jiraKey ?? i.title).join(', ')}) – noch nicht produktiv, nicht ins Kapitel schreiben.
      {ready > 0 && <> {ready} davon produktiv – übernehmen.</>} <Link to="/pipeline" className="small">zur Pipeline</Link>
    </aside>
  );
}

/** Kapitelanweisung (ADR-096) oben in der Werkstatt – mit Vorrang für Generator und KI-Vorschläge */
export function InstructionBanner({ chapterId }: { chapterId: string }) {
  const r = useLoad<any>(`/chapters/${chapterId}/instruction`, [chapterId]);
  const c = r.data?.chapter;
  const subs = (r.data?.subchapters ?? []).filter((s: any) => s.instruction.text || s.instruction.topics.length || s.instruction.excluded.length);
  if (!c || (!c.text && !c.topics.length && !c.excluded.length && !subs.length)) return null;
  const part = (i: any) => (
    <>
      {i.text && <span>{i.text} </span>}
      {i.topics.length > 0 && <span><strong>Wichtig:</strong> {i.topics.join(', ')}. </span>}
      {i.excluded.length > 0 && <span><strong>Nicht beschreiben:</strong> {i.excluded.join(', ')}.</span>}
    </>
  );
  return (
    <aside className="alert info ws-instruction" aria-label="Kapitelanweisung">
      <strong>Kapitelanweisung:</strong> {part(c)} <Link to="/kapitelsteuerung" className="small">bearbeiten</Link>
      {subs.length > 0 && <ul className="small">{subs.map((s: any) => <li key={s.id}><em>{s.title}:</em> {part(s.instruction)}</li>)}</ul>}
    </aside>
  );
}
