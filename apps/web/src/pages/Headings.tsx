import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, ErrorBox, Page, useLoad } from '../components/ui';

// oneSCM_Metadaten › Quellen je Überschrift (ADR-087, M3): je Datei als Baum oder alle Quellen zusammengeführt

const ICON: Record<string, string> = { markdown: '📝', html: '🌐', docx: '📄', pptx: '📊', pdf: '📕', mp4: '🎬', jira: '🎫' };
const where = (c: any) => (c.locator?.page ? `Seite ${c.locator.page}` : c.locator?.slide ? `Folie ${c.locator.slide}` : c.locator?.time ? `bei ${c.locator.time}` : c.lineStart === c.lineEnd ? `Zeile ${c.lineStart}` : `Zeilen ${c.lineStart}–${c.lineEnd}`);
const chunksLink = (title: string) => `/metadaten/chunks?heading=${encodeURIComponent(title.replace(/^\d+(\.\d+)*\.?\s+/, ''))}`;

function ChunkList({ chunks }: { chunks: any[] }) {
  return (
    <ul className="hd-chunks">
      {chunks.map((c) => <li key={c.id}><span className="muted small">#{c.seq} · {where(c)}{c.chars > 800 ? ` · ${c.chars} Zeichen` : ''}</span> <span className="md-text small">{c.text}</span></li>)}
    </ul>
  );
}

function Tree({ nodes }: { nodes: any[] }) {
  return (
    <ul className="hd-tree">
      {nodes.map((n, i) => {
        const count = (x: any): number => x.chunks.length + x.children.reduce((s: number, c: any) => s + count(c), 0);
        return (
          <li key={`${n.title}-${i}`}>
            <details open={n.level <= 1}>
              <summary><strong>{n.title}</strong> <span className="muted small">({count(n)} Chunks)</span></summary>
              {/* Link außerhalb von <summary> (keine verschachtelten Bedienelemente) */}
              <p className="small hd-open"><Link to={chunksLink(n.title)} aria-label={`Chunks zu ${n.title} öffnen`}>→ Chunks zu dieser Überschrift</Link></p>
              {n.chunks.length > 0 && <ChunkList chunks={n.chunks} />}
              {n.children.length > 0 && <Tree nodes={n.children} />}
            </details>
          </li>
        );
      })}
    </ul>
  );
}

export function HeadingsPage() {
  const [view, setView] = useState<'files' | 'merged'>('files');
  const docs = useLoad<any[]>('/metadata/headings/documents');
  const [docId, setDocId] = useState('');
  useEffect(() => {
    if (!docId && docs.data?.length) setDocId(docs.data[0].documentId);
  }, [docs.data, docId]);
  const tree = useLoad<any>(view === 'files' && docId ? `/metadata/headings/documents/${docId}` : null, [docId, view]);
  const [q, setQ] = useState('');
  const [multi, setMulti] = useState(true);
  const [page, setPage] = useState(0);
  const merged = useLoad<any>(view === 'merged' ? `/metadata/headings/merged?multi=${multi}&limit=20&offset=${page * 20}${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ''}` : null, [view, multi, q, page]);
  return (
    <Page title="Quellen je Überschrift" subtitle="Je Datei als Überschriftenbaum oder alle Quellen zusammengeführt – gleiche Überschrift aus mehreren Dateien nebeneinander">
      <div className="filters" role="group" aria-label="Ansicht">
        <label className="small"><input type="radio" name="hd-view" checked={view === 'files'} onChange={() => setView('files')} /> Je Datei</label>
        <label className="small"><input type="radio" name="hd-view" checked={view === 'merged'} onChange={() => setView('merged')} /> Zusammengeführt je Überschrift</label>
      </div>
      <ErrorBox error={docs.error ?? tree.error ?? merged.error} />
      {view === 'files' ? (
        <div className="oq-layout">
          <Card title={`Dateien (${docs.data?.length ?? 0})`}>
            {!docs.data?.length ? <Empty>Noch keine Quellen. Dateien unter <Link to="/metadaten/einlesen">Einlesen</Link> hinzufügen.</Empty> : (
              <ul className="oq-list" aria-label="Dateien">
                {docs.data.map((d) => (
                  <li key={d.documentId}>
                    <button aria-current={d.documentId === docId} onClick={() => setDocId(d.documentId)}>
                      <span><span aria-hidden="true">{ICON[d.format] ?? '📁'}</span> {d.path}</span>
                      <span className="muted small">{d.headings} Überschr. · {d.chunks} Chunks</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title={tree.data?.path ?? 'Überschriften'}>
            {tree.data && (!tree.data.tree.length ? <Empty>Diese Datei hat keine Chunks.</Empty> : <Tree nodes={tree.data.tree} />)}
          </Card>
        </div>
      ) : (
        <Card title={`${merged.data?.total ?? 0} Überschriften${merged.data ? ` · ${merged.data.multiFiles} in mehreren Dateien` : ''}`}>
          <div className="filters">
            <label className="grow"><span className="sr-only">Überschrift suchen</span><input type="search" value={q} placeholder="Überschrift suchen …" aria-label="Überschrift suchen" onChange={(e) => { setQ(e.target.value); setPage(0); }} /></label>
            <label className="small"><input type="checkbox" checked={multi} onChange={(e) => { setMulti(e.target.checked); setPage(0); }} /> nur Überschriften aus mehreren Dateien</label>
          </div>
          {!merged.data?.items.length ? <Empty>{multi ? 'Keine Überschrift kommt in mehreren Dateien vor.' : 'Keine Überschriften gefunden.'}</Empty> : merged.data.items.map((g: any) => (
            <section key={g.key} className="hd-group" aria-label={g.title}>
              <h3>{g.title} <span className="muted small">{g.files} Dateien · {g.chunks} Chunks</span> <Link className="small" to={chunksLink(g.title)}>Chunks</Link></h3>
              <div className="hd-cols">
                {g.sources.map((s: any) => (
                  <div key={s.documentId} className="hd-source">
                    <div className="small"><span aria-hidden="true">{ICON[s.format] ?? '📁'}</span> <strong>{s.path}</strong></div>
                    <div className="small muted">{s.headingPath.join(' › ')}</div>
                    <ChunkList chunks={s.chunks} />
                  </div>
                ))}
              </div>
            </section>
          ))}
          {merged.data && merged.data.total > 20 && (
            <div className="pager">
              <button className="btn ghost" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Vorherige Seite">‹</button>
              <span>Seite {page + 1} von {Math.ceil(merged.data.total / 20)}</span>
              <button className="btn ghost" disabled={(page + 1) * 20 >= merged.data.total} onClick={() => setPage(page + 1)} aria-label="Nächste Seite">›</button>
            </div>
          )}
        </Card>
      )}
    </Page>
  );
}
