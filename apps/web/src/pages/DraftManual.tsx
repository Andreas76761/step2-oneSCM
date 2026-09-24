// Draft Manual (ADR-033): Textschnipsel einer Gliederung zuordnen, Dopplungen, Lücken, Widersprüche und Warnungen farblich
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { del, download, patch, post, qs } from '../api';
import { Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';
import { variantText } from './Outlines';

type FlagType = 'duplicate' | 'contradiction' | 'gap' | 'warning';
const FLAG: Record<FlagType, { icon: string; label: string }> = {
  contradiction: { icon: '⛔', label: 'Widerspruch' },
  duplicate: { icon: '⧉', label: 'Dopplung' },
  gap: { icon: '◌', label: 'Lücke' },
  warning: { icon: '⚠', label: 'Warnung' },
};
const ORDER: FlagType[] = ['contradiction', 'duplicate', 'warning', 'gap'];

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
  const data = useLoad<any>(`/outlines/${outline.id}/candidates${qs({ q: q || undefined, page, pageSize: 25 })}`, [outline.id, q, page]);
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
        <div key={s.id} className={`draft-snippet sev-${severity(s.flags)}`}>
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
          <div className="draft-layout">
            <div>
              {!nodes.length && <Empty>Die Gliederung hat noch keine Einträge.</Empty>}
              {nodes.map((n: any) => {
                const snippets = onlyFlagged ? n.snippets.filter((s: any) => s.flags.length) : n.snippets;
                if (onlyFlagged && !snippets.length && !n.flags.length) return null;
                const H = n.level === 1 ? 'h2' : 'h3';
                return (
                  <section key={n.id} className={`draft-node${n.flags.some((f: any) => f.type === 'gap') ? ' gap' : ''}`} aria-labelledby={`h-${n.id}`}>
                    <div className="draft-node-head">
                      <H id={`h-${n.id}`}>{n.number} {n.title}</H>
                      <FlagList flags={n.flags} />
                    </div>
                    {snippets.map((s: any, i: number) => (
                      <article key={s.id} className={`draft-snippet sev-${severity(s.flags)}`} aria-label={`Schnipsel #${s.seq}`}>
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
