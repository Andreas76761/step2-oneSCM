import { FormatIcon } from '../components/icons';
import { useState } from 'react';
import { post, put } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// oneSCM_Metadaten › Dubletten über alle Formate je Abschnitt (ADR-088, M4)

const LABEL: Record<string, string> = { markdown: 'Markdown', html: 'HTML', docx: 'Word', pptx: 'PowerPoint', pdf: 'PDF', mp4: 'Video', jira: 'Jira' };
const where = (s: any) => (s.locator?.page ? `Seite ${s.locator.page}` : s.locator?.slide ? `Folie ${s.locator.slide}` : s.locator?.time ? `bei ${s.locator.time}` : s.locator?.anchor ? `Abschnitt #${s.locator.anchor}` : '');

function Side({ s, side, leading }: { s: any; side: string; leading: boolean }) {
  return (
    <div className={`dp-side${leading ? ' dp-leading' : ''}`}>
      <div className="small"><strong>{side}</strong> <FormatIcon format={s.format} /> {LABEL[s.format] ?? s.format} · {s.path}</div>
      <div className="small muted">{s.headingPath.join(' › ') || s.title}{where(s) ? ` · ${where(s)}` : ''} · {s.chars} Zeichen</div>
      {leading && <span className="tag">führende Fassung</span>}
    </div>
  );
}

function Diff({ id }: { id: string }) {
  const d = useLoad<any>(`/metadata/duplicates/${id}`, [id]);
  if (d.error) return <ErrorBox error={d.error} />;
  if (!d.data) return <p className="small muted">Lade …</p>;
  return (
    <div className="dp-diff">
      <p className="small muted">Unterschiede: <del>nur in A</del> · <ins>nur in B</ins></p>
      <p className="md-text small" aria-label="Unterschiede">
        {d.data.diff.map((o: any, i: number) => (o.op === '=' ? <span key={i}>{o.text}</span> : o.op === '-' ? <del key={i}>{o.text}</del> : <ins key={i}>{o.text}</ins>))}
      </p>
    </div>
  );
}

export function MetaDuplicatesPage() {
  const { notify } = useApp();
  const me = useLoad<{ permissions: string[] }>('/me');
  const canEdit = !!me.data?.permissions.some((p) => p === 'edit' || p === 'admin');
  const [status, setStatus] = useState('open');
  const [cross, setCross] = useState(false);
  const [view, setView] = useState<'pairs' | 'groups'>('pairs');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const list = useLoad<any>(view === 'pairs' ? `/metadata/duplicates?status=${status}&crossFormat=${cross}&limit=20&offset=${page * 20}` : null, [status, cross, page, view]);
  const groups = useLoad<any[]>(view === 'groups' ? `/metadata/duplicates/groups?crossFormat=${cross}` : null, [cross, view]);
  const decide = async (id: string, body: any, msg: string) => {
    try {
      await put(`/metadata/duplicates/${id}/decision`, body);
      notify(msg);
      list.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const rebuild = async () => {
    try {
      const r = await post<any>('/metadata/duplicates/rebuild', {});
      notify(`Neu berechnet: ${r.sections} Abschnitte, ${r.pairs} Paare.`);
      list.reload();
      groups.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const s = list.data?.summary;
  return (
    <Page title="Dubletten über alle Formate" subtitle="Gleiche und ähnliche Abschnitte (ab 85 %) über Dateien und Formate hinweg – z. B. dieselbe Folie als PowerPoint und PDF; nach jedem Import nur für geänderte Dateien neu berechnet"
      actions={canEdit ? <button className="btn" onClick={() => void rebuild()}>Neu berechnen</button> : undefined}>
      <ErrorBox error={list.error ?? groups.error} />
      {s && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Abschnitte</span><strong>{s.sections}</strong></div>
          <div className="stat"><span className="muted small">Paare</span><strong>{s.pairs}</strong></div>
          <div className="stat"><span className="muted small">exakt gleich</span><strong>{s.exact}</strong></div>
          <div className="stat"><span className="muted small">formatübergreifend</span><strong>{s.crossFormat}</strong></div>
          <div className="stat"><span className="muted small">offen</span><strong>{s.open}</strong></div>
          <div className="stat"><span className="muted small">Gruppen</span><strong>{s.groups}</strong></div>
        </div>
      )}
      <div className="filters">
        <label>Ansicht <select value={view} onChange={(e) => setView(e.target.value as any)}><option value="pairs">Paare</option><option value="groups">Gruppen</option></select></label>
        {view === 'pairs' && <label>Status <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}><option value="open">offen</option><option value="decided">entschieden</option><option value="all">alle</option></select></label>}
        <label className="small"><input type="checkbox" checked={cross} onChange={(e) => { setCross(e.target.checked); setPage(0); }} /> nur formatübergreifend</label>
      </div>
      {view === 'groups' ? (
        <Card title={`${groups.data?.length ?? 0} Gruppen offener Dubletten`}>
          {!groups.data?.length ? <Empty>Keine offenen Gruppen.</Empty> : (
            <ul className="rl-findings" aria-label="Gruppen">
              {groups.data.map((g, i) => (
                <li key={i}>
                  <strong>{g.sections.length} Abschnitte</strong> <span className="muted small">bis {Math.round(g.maxScore * 100)} % · {g.formats.map((f: string) => LABEL[f] ?? f).join(', ')}</span>
                  <ul className="small">{g.sections.map((x: any) => <li key={x.sectionId}><FormatIcon format={x.format} /> {x.path} · {x.title}{where(x) ? ` · ${where(x)}` : ''}</li>)}</ul>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : (
        <Card title={`${list.data?.total ?? 0} Paare`}>
          {!list.data?.items.length ? <Empty>{status === 'open' ? 'Keine offenen Dubletten.' : 'Keine Paare.'}</Empty> : list.data.items.map((p: any) => {
            const lead = p.decision?.leading;
            return (
              <article key={p.id} className="dp-pair" aria-label={`Dublette ${p.a.title}`}>
                <div className="dp-head">
                  <span className={`tag${p.kind === 'exact' ? '' : ' sev-medium'}`}>{p.kind === 'exact' ? 'exakt gleich' : `${Math.round(p.score * 100)} % ähnlich`}</span>
                  {p.crossFormat && <span className="tag">formatübergreifend</span>}
                  {p.decision && <span className="tag">{p.decision.decision === 'not_duplicate' ? 'kein Duplikat' : 'entschieden'}{p.decision.note ? ` – ${p.decision.note}` : ''}</span>}
                  {p.shared.length > 0 && <span className="small muted">gemeinsam: {p.shared.join(', ')}</span>}
                </div>
                <div className="dp-cols">
                  <Side s={p.a} side="A" leading={lead === 'a'} />
                  <Side s={p.b} side="B" leading={lead === 'b'} />
                </div>
                <div className="filters">
                  <button className="btn small ghost" aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)}>{open === p.id ? 'Unterschiede ausblenden' : 'Unterschiede zeigen'}</button>
                  {canEdit && (
                    <>
                      <button className="btn small" onClick={() => void decide(p.id, { decision: 'leading', leading: 'a' }, 'A ist die führende Fassung.')}>A führend</button>
                      <button className="btn small" onClick={() => void decide(p.id, { decision: 'leading', leading: 'b' }, 'B ist die führende Fassung.')}>B führend</button>
                      <button className="btn small" onClick={() => void decide(p.id, { decision: 'not_duplicate' }, 'Als „kein Duplikat“ markiert.')}>Kein Duplikat</button>
                      {p.decision && <button className="btn small ghost" onClick={() => void decide(p.id, { decision: 'open' }, 'Entscheidung zurückgesetzt.')}>Zurücksetzen</button>}
                    </>
                  )}
                </div>
                {open === p.id && <Diff id={p.id} />}
              </article>
            );
          })}
          {list.data && list.data.total > 20 && (
            <div className="pager">
              <button className="btn ghost" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Vorherige Seite">‹</button>
              <span>Seite {page + 1} von {Math.ceil(list.data.total / 20)}</span>
              <button className="btn ghost" disabled={(page + 1) * 20 >= list.data.total} onClick={() => setPage(page + 1)} aria-label="Nächste Seite">›</button>
            </div>
          )}
        </Card>
      )}
    </Page>
  );
}

