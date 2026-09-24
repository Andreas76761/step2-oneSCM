// Draft Manual (ADR-033): Textschnipsel einer Gliederung zuordnen, Dopplungen, Lücken, Widersprüche und Warnungen farblich
import { useEffect, useState } from 'react';
import type React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { del, download, patch, post, qs } from '../api';
import { Card, Empty, ErrorBox, Md, Page, Status, errorText, useApp, useLoad } from '../components/ui';
import { variantText } from './Outlines';

type FlagType = 'duplicate' | 'contradiction' | 'gap' | 'warning';
const FLAG: Record<FlagType, { icon: string; label: string }> = {
  contradiction: { icon: '⛔', label: 'Widerspruch' },
  duplicate: { icon: '⧉', label: 'Dopplung' },
  gap: { icon: '◌', label: 'Lücke' },
  warning: { icon: '⚠', label: 'Warnung' },
};
const ORDER: FlagType[] = ['contradiction', 'duplicate', 'warning', 'gap'];

// Drag & Drop (ADR-035): Schnipsel-Kennungen im eigenen Datenformat
const DND = 'application/x-onescm-snippets';
const dragSnippets = (e: React.DragEvent, ids: string[]) => {
  e.dataTransfer.setData(DND, JSON.stringify(ids));
  e.dataTransfer.effectAllowed = 'move';
};
const droppedSnippets = (e: React.DragEvent): string[] | null => {
  try {
    const v = JSON.parse(e.dataTransfer.getData(DND) || 'null');
    return Array.isArray(v) && v.every((x) => typeof x === 'string') ? v : null;
  } catch {
    return null;
  }
};
const accepts = (e: React.DragEvent) => e.dataTransfer.types.includes(DND);

export const FlagChip = ({ type, count }: { type: FlagType; count?: number }) => (
  <span className={`flag flag-${type}`}><span aria-hidden="true">{FLAG[type].icon}</span> {FLAG[type].label}{count !== undefined ? `: ${count}` : ''}</span>
);

function FlagList({ flags }: { flags: { type: FlagType; label: string }[] }) {
  if (!flags.length) return null;
  return (
    <ul className="draft-flags" aria-label="Kennzeichnungen">
      {flags.map((f, i) => <li key={i} style={{ listStyle: 'none' }}><span className={`flag flag-${f.type}`} title={f.label}><span aria-hidden="true">{FLAG[f.type].icon}</span> {FLAG[f.type].label}</span> <span className="small">{f.label}</span></li>)}
    </ul>
  );
}

const severity = (flags: { type: FlagType }[]) => ORDER.find((t) => flags.some((f) => f.type === t)) ?? 'ok';

function Candidates({ outline, nodes, canEdit, onAssigned }: { outline: any; nodes: any[]; canEdit: boolean; onAssigned: () => void }) {
  const { notify } = useApp();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const data = useLoad<any>(`/outlines/${outline.id}/candidates${qs({ q: q || undefined, page, pageSize: 25 })}`, [outline.id, q, page, outline.updatedAt]);
  useEffect(() => setSelected([]), [outline.id, q, page]);
  const assign = async () => {
    try {
      const r = await post(`/outlines/${outline.id}/assignments`, { nodeId: target, snippetIds: selected });
      notify(`${r.assigned} Schnipsel zugeordnet.`);
      setSelected([]);
      data.reload();
      onAssigned();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const pages = data.data ? Math.max(1, Math.ceil(data.data.total / data.data.pageSize)) : 1;
  return (
    <Card title={`Nicht zugeordnete Schnipsel${data.data ? ` (${data.data.total})` : ''}`}>
      <label className="block">Suche <input value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} placeholder="Text enthält …" /></label>
      {canEdit && (
        <div className="filters">
          <label className="inline">Ziel
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="">– Kapitel wählen –</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.level === 2 ? '  ' : ''}{n.number} {n.title}</option>)}
            </select>
          </label>
          <button className="btn small primary" disabled={!target || !selected.length} onClick={assign}>{selected.length || ''} Zuordnen</button>
        </div>
      )}
      <ErrorBox error={data.error} />
      {data.data && !data.data.items.length && <Empty>Alle passenden Schnipsel sind zugeordnet.</Empty>}
      {data.data?.items.map((s: any) => (
        <div key={s.id} className={`draft-snippet sev-${severity(s.flags)}`} draggable={canEdit}
          onDragStart={(e) => dragSnippets(e, selected.includes(s.id) ? selected : [s.id])}>
          <label className="inline small">
            {canEdit && <input type="checkbox" checked={selected.includes(s.id)} onChange={() => setSelected(selected.includes(s.id) ? selected.filter((x) => x !== s.id) : [...selected, s.id])} />}
            #{s.seq} · {s.chapter}{s.subchapter ? ` › ${s.subchapter}` : ''}
          </label>
          <div className="small">{s.text.length > 220 ? `${s.text.slice(0, 220)} …` : s.text}</div>
          {s.flags.length > 0 && <div className="draft-flags">{[...new Set<FlagType>(s.flags.map((f: any) => f.type as FlagType))].map((t) => <FlagChip key={t} type={t} />)}</div>}
        </div>
      ))}
      {pages > 1 && (
        <div className="row-actions">
          <button className="btn small" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ zurück</button>
          <span className="small">Seite {page} von {pages}</span>
          <button className="btn small" disabled={page >= pages} onClick={() => setPage(page + 1)}>weiter ›</button>
        </div>
      )}
    </Card>
  );
}

/** Varianten synchronisieren (ADR-037): Schnipsel und fehlende Einträge aus einer anderen Gliederung übernehmen */
function SyncCard({ outline, outlines, canEdit, onApplied }: { outline: any; outlines: any[]; canEdit: boolean; onApplied: () => void }) {
  const { notify } = useApp();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('');
  const pv = useLoad<any>(open && from ? `/outlines/${outline.id}/sync?from=${encodeURIComponent(from)}` : null, [open, from, outline.id, outline.updatedAt]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [createNodes, setCreateNodes] = useState<Record<string, boolean>>({});
  useEffect(() => {
    // Vorauswahl: passende Schnipsel und alle fehlenden Einträge
    const p: Record<string, boolean> = {};
    const c: Record<string, boolean> = {};
    for (const e of pv.data?.entries ?? []) {
      for (const x of e.onlySource) if (!x.elsewhere) p[`${e.sourceNodeId}|${x.id}`] = x.fits;
      if (!e.target) c[e.sourceNodeId] = true;
    }
    setPicked(p);
    setCreateNodes(c);
  }, [pv.data]);
  useEffect(() => setFrom(''), [outline.id]);
  const entries: any[] = (pv.data?.entries ?? []).filter((e: any) => !e.target || e.onlySource.length || e.onlyTarget.length);
  const ids = (e: any) => e.onlySource.filter((x: any) => !x.elsewhere && picked[`${e.sourceNodeId}|${x.id}`]).map((x: any) => x.id);
  const apply = async () => {
    const add = entries.filter((e) => e.target && ids(e).length).map((e) => ({ sourceNodeId: e.sourceNodeId, snippetIds: ids(e) }));
    const create = entries.filter((e) => !e.target && createNodes[e.sourceNodeId]).map((e) => ({ sourceNodeId: e.sourceNodeId, snippetIds: ids(e) }));
    try {
      const r = await post<any>(`/outlines/${outline.id}/sync`, { from, add, create });
      notify(`${r.added} Schnipsel übernommen, ${r.created} Einträge angelegt.`);
      pv.reload();
      onApplied();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const selected = entries.reduce((a, e) => a + ids(e).length, 0) + entries.filter((e) => !e.target && createNodes[e.sourceNodeId]).length;
  if (!open) return <div className="filters"><button className="btn" onClick={() => setOpen(true)}>Mit anderer Gliederung abgleichen</button></div>;
  return (
    <Card title="Varianten abgleichen">
      <div className="filters">
        <label className="inline">Übernehmen aus
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">– Gliederung wählen –</option>
            {outlines.filter((o) => o.id !== outline.id).map((o) => <option key={o.id} value={o.id}>{o.name} – V{o.versionNo}</option>)}
          </select>
        </label>
        <button className="btn ghost" onClick={() => setOpen(false)}>Schließen</button>
      </div>
      <ErrorBox error={pv.error} />
      {pv.data && (
        <>
          <p className="small" role="status">
            {pv.data.summary.matched} Einträge zugeordnet · {pv.data.summary.missing} fehlen im Ziel · {pv.data.summary.offered} Schnipsel übernehmbar, davon {pv.data.summary.fitting} passend zur Variante · {pv.data.summary.onlyTarget} nur im Ziel
          </p>
          {!entries.length && <Empty>Keine Unterschiede.</Empty>}
          <div className="sync-list">
            {entries.map((e) => (
              <section key={e.sourceNodeId} className="sync-entry" aria-label={`${e.number} ${e.title}`}>
                <div className="sync-head">
                  {e.target ? <strong>{e.number} {e.title} → {e.target.number} {e.target.title}</strong> : (
                    <label className="inline"><input type="checkbox" disabled={!canEdit} checked={!!createNodes[e.sourceNodeId]} onChange={(ev) => setCreateNodes({ ...createNodes, [e.sourceNodeId]: ev.target.checked })} /> <strong>{e.number} {e.title}</strong> <span className="tag st-approved">fehlt im Ziel – anlegen</span></label>
                  )}
                </div>
                {e.onlySource.map((x: any) => (
                  <label key={x.id} className="sync-snippet">
                    <input type="checkbox" disabled={!canEdit || !!x.elsewhere || (!e.target && !createNodes[e.sourceNodeId])} checked={!!picked[`${e.sourceNodeId}|${x.id}`]}
                      onChange={(ev) => setPicked({ ...picked, [`${e.sourceNodeId}|${x.id}`]: ev.target.checked })} />
                    <span>
                      <span className="small muted">#{x.seq} · {x.path}{x.elsewhere ? ` · im Ziel bereits unter ${x.elsewhere}` : ''}</span><br />
                      {x.text}
                      {x.problems.map((pr: string) => <span key={pr} className="flag flag-warning"><span aria-hidden="true">⚠</span> {pr}</span>)}
                      {!x.isCurrent && <span className="flag flag-warning"><span aria-hidden="true">⚠</span> veraltet</span>}
                    </span>
                  </label>
                ))}
                {e.onlyTarget.length > 0 && <p className="small muted">{e.onlyTarget.length} Schnipsel nur im Ziel (bleiben erhalten)</p>}
              </section>
            ))}
          </div>
          {canEdit && entries.length > 0 && <button className="btn primary" disabled={!selected} onClick={apply}>Auswahl übernehmen ({selected})</button>}
        </>
      )}
    </Card>
  );
}

const RESULT: Record<string, string> = { generated: 'Entwurf erzeugt', skipped: 'übersprungen', blocked: 'blockiert' };

/** Handbuch-Variante (ADR-034): aus dem Draft Manual Kapitelentwürfe erzeugen, die über Werkstatt und Freigabe laufen */
function VariantCard({ outlineId, canEdit }: { outlineId: string; canEdit: boolean }) {
  const { notify } = useApp();
  const chapters = useLoad<any>(`/outlines/${outlineId}/chapters`, [outlineId]);
  const [results, setResults] = useState<any[] | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setResults(null), [outlineId]);
  const generate = async () => {
    setBusy(true);
    try {
      const r = await post<any>(`/outlines/${outlineId}/generate`, {});
      setResults(r.results);
      notify(`${r.generated} Kapitelentwürfe erzeugt – Prüfung und Freigabe in der Werkstatt.`);
      chapters.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const list: any[] = chapters.data?.chapters ?? [];
  const approved = list.filter((c) => c.versions.some((v: any) => v.status === 'approved')).length;
  return (
    <Card title="Handbuch dieser Variante">
      <p className="small">
        Aus den Zuordnungen entstehen eigene Kapitel mit Versionen. Sie werden in der Werkstatt geprüft, freigegeben und unter
        {' '}<Link to="/export">Export</Link> bzw. <Link to="/veroeffentlichung">Veröffentlichung</Link> als Handbuch der Variante ausgegeben.
      </p>
      {canEdit && <button className="btn primary" disabled={busy} onClick={generate}>{busy ? 'Erzeuge …' : 'Kapitel für Freigabe erzeugen'}</button>}
      {list.length > 0 && (
        <table className="table compact" aria-label="Kapitel der Variante">
          <caption className="small muted">{list.length} Kapitel · {approved} freigegeben</caption>
          <thead><tr><th>Kapitel</th><th>Schnipsel</th><th>Stand</th>{results && <th>Ergebnis</th>}<th /></tr></thead>
          <tbody>
            {list.map((c) => {
              const r = results?.find((x) => x.chapterId === c.id);
              return (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.snippetCount}</td>
                  <td>{c.versions[0] ? <>V{c.versions[0].versionNo} <Status s={c.versions[0].status} /></> : <span className="muted">kein Entwurf</span>}</td>
                  {results && <td className="small">{r ? `${RESULT[r.status]}${r.message ? ` – ${r.message}` : ''}` : '–'}</td>}
                  <td>{c.versions[0] && <Link to={`/werkstatt/${c.id}`}>Werkstatt</Link>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export function DraftManualPage() {
  const { outlineId } = useParams();
  const navigate = useNavigate();
  const { ref, notify } = useApp();
  const list = useLoad<any>('/outlines');
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const selectedId = outlineId ?? list.data?.items.find((o: any) => o.status === 'active')?.id ?? list.data?.items[0]?.id ?? null;
  const draft = useLoad<any>(selectedId ? `/outlines/${selectedId}/draft` : null, [selectedId]);
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [dropAt, setDropAt] = useState<string | null>(null);
  // Ablegen auf einem Eintrag (ans Ende) oder auf einem Schnipsel (davor)
  const drop = (e: React.DragEvent, nodeId: string, beforeSnippetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropAt(null);
    const ids = droppedSnippets(e);
    if (!ids?.length || !d || (beforeSnippetId && ids.includes(beforeSnippetId))) return;
    void run(() => post(`/outlines/${d.outline.id}/assignments`, { nodeId, snippetIds: ids, ...(beforeSnippetId ? { beforeSnippetId } : {}) }), ids.length > 1 ? `${ids.length} Schnipsel zugeordnet.` : 'Schnipsel zugeordnet.');
  };
  const over = (e: React.DragEvent, key: string) => {
    if (!canEdit || !accepts(e)) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dropAt !== key) setDropAt(key);
  };
  const d = draft.data;
  const run = async (fn: () => Promise<any>, msg?: string) => {
    try {
      const r = await fn();
      if (msg) notify(msg);
      draft.reload();
      return r;
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const nodes = d?.nodes ?? [];

  return (
    <Page title="Draft Manual" subtitle="Handbuchentwurf entlang einer Gliederung – Textschnipsel zuordnen und Auffälligkeiten klären">
      <ErrorBox error={list.error ?? draft.error} />
      {list.data && !list.data.items.length && (
        <Empty>Noch keine Gliederung vorhanden. Legen Sie unter <Link to="/stammdaten/inhaltsverzeichnis">Stammdaten › Inhaltsverzeichnis</Link> eine an.</Empty>
      )}
      {list.data && list.data.items.length > 0 && (
        <div className="filters">
          <label className="inline">Gliederung
            <select value={selectedId ?? ''} onChange={(e) => navigate(`/draft-manual/${e.target.value}`)}>
              {list.data.items.map((o: any) => <option key={o.id} value={o.id}>{o.name} – V{o.versionNo}{o.status === 'active' ? ' (aktiv)' : ''}</option>)}
            </select>
          </label>
          <label className="inline"><input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} /> nur Auffälligkeiten</label>
          {canEdit && d && <button className="btn" onClick={() => run(async () => { const r = await post(`/outlines/${d.outline.id}/auto-assign`, {}); return r; }).then((r) => r && notify(`${r.assigned} Schnipsel automatisch zugeordnet, ${r.remaining} verbleiben.`))}>Automatisch zuordnen</button>}
          {d && <button className="btn" onClick={() => download(`/api/v1/outlines/${d.outline.id}/draft/export`, 'draft-manual.md').catch((e) => notify(errorText(e), 'error'))}>Export Markdown</button>}
          {d && <Link className="btn" to={`/stammdaten/inhaltsverzeichnis/${d.outline.id}`}>Gliederung bearbeiten</Link>}
        </div>
      )}
      {d && (
        <>
          <Card title="Übersicht">
            <p className="small">{variantText(d.outline, ref)} · {d.summary.nodes} Einträge · {d.summary.snippets} Schnipsel zugeordnet · {d.summary.unassigned} nicht zugeordnet</p>
            <div className="legend" aria-label="Legende">
              <FlagChip type="contradiction" count={d.summary.contradiction} />
              <FlagChip type="duplicate" count={d.summary.duplicate} />
              <FlagChip type="warning" count={d.summary.warning} />
              <FlagChip type="gap" count={d.summary.gap} />
            </div>
          </Card>
          <VariantCard outlineId={d.outline.id} canEdit={canEdit} />
          <SyncCard outline={d.outline} outlines={list.data?.items ?? []} canEdit={canEdit} onApplied={draft.reload} />
          <div className="draft-layout">
            <div>
              {!nodes.length && <Empty>Die Gliederung hat noch keine Einträge.</Empty>}
              {nodes.map((n: any) => {
                const snippets = onlyFlagged ? n.snippets.filter((s: any) => s.flags.length) : n.snippets;
                if (onlyFlagged && !snippets.length && !n.flags.length) return null;
                const H = n.level === 1 ? 'h2' : 'h3';
                return (
                  <section key={n.id} className={`draft-node${n.flags.some((f: any) => f.type === 'gap') ? ' gap' : ''}${dropAt === n.id ? ' drop-target' : ''}`} aria-labelledby={`h-${n.id}`}
                    onDragOver={(e) => over(e, n.id)} onDragLeave={() => setDropAt(null)} onDrop={(e) => drop(e, n.id)}>
                    <div className="draft-node-head">
                      <H id={`h-${n.id}`}>{n.number} {n.title}</H>
                      <FlagList flags={n.flags} />
                    </div>
                    {snippets.map((s: any, i: number) => (
                      <article key={s.id} className={`draft-snippet sev-${severity(s.flags)}${dropAt === s.id ? ' drop-target' : ''}`} aria-label={`Schnipsel #${s.seq}`}
                        draggable={canEdit} onDragStart={(e) => dragSnippets(e, [s.id])} onDragOver={(e) => over(e, s.id)} onDrop={(e) => drop(e, n.id, s.id)}>
                        <div className="small muted">#{s.seq} · Quelle: {s.path} · {s.chapter}{s.subchapter ? ` › ${s.subchapter}` : ''}</div>
                        <Md text={s.text} />
                        <FlagList flags={s.flags} />
                        {canEdit && (
                          <div className="row-actions">
                            <button className="btn small" disabled={i === 0} aria-label={`Schnipsel #${s.seq} nach oben`} onClick={() => run(() => patch(`/outlines/${d.outline.id}/assignments/${s.id}`, { move: 'up' }))}>↑</button>
                            <button className="btn small" disabled={i === snippets.length - 1} aria-label={`Schnipsel #${s.seq} nach unten`} onClick={() => run(() => patch(`/outlines/${d.outline.id}/assignments/${s.id}`, { move: 'down' }))}>↓</button>
                            <select aria-label={`Schnipsel #${s.seq} verschieben nach`} value="" onChange={(e) => e.target.value && run(() => post(`/outlines/${d.outline.id}/assignments`, { nodeId: e.target.value, snippetIds: [s.id] }), 'Verschoben.')}>
                              <option value="">Verschieben nach …</option>
                              {nodes.filter((x: any) => x.id !== n.id).map((x: any) => <option key={x.id} value={x.id}>{x.number} {x.title}</option>)}
                            </select>
                            <button className="btn small" onClick={() => run(() => del(`/outlines/${d.outline.id}/assignments/${s.id}`), 'Zuordnung gelöst.')}>Zuordnung lösen</button>
                          </div>
                        )}
                      </article>
                    ))}
                  </section>
                );
              })}
            </div>
            <div className="draft-side">
              <Candidates outline={d.outline} nodes={nodes} canEdit={canEdit} onAssigned={draft.reload} />
            </div>
          </div>
        </>
      )}
    </Page>
  );
}
