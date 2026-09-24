import { useState } from 'react';
import { patch, post } from '../api';
import { Decision, Card, Empty, ErrorBox, Modal, Page, Status, errorText, useApp, useLoad } from '../components/ui';

export function ClustersPage() {
  const { notify } = useApp();
  const [status, setStatus] = useState('');
  const clusters = useLoad<any[]>(`/clusters${status ? `?status=${status}` : ''}`, [status]);
  const [mergeSel, setMergeSel] = useState<string[]>([]);
  const [splitSel, setSplitSel] = useState<Record<string, string[]>>({});
  const [canonical, setCanonical] = useState<any | null>(null);

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      setMergeSel([]);
      setSplitSel({});
      clusters.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page title="Textcluster" subtitle="Semantisch verwandte Textabschnitte kapitelintern und kapitelübergreifend konsolidieren">
      <Decision id="E-05">Verfahren TF-IDF-Kosinus (tfidf-cosine-1.0); Schwellenwert unter Einstellungen. Vorschläge werden bei jeder Analyse neu berechnet, bestätigte Cluster bleiben erhalten.</Decision>
      <div className="filters">
        <select aria-label="Clusterstatus" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Vorschläge und bestätigte</option>
          <option value="proposed">nur Vorschläge</option>
          <option value="confirmed">nur bestätigte</option>
          <option value="dissolved">aufgelöste</option>
        </select>
        {mergeSel.length > 1 && (
          <button className="btn primary" onClick={() => act(() => post(`/clusters/${mergeSel[0]}/merge`, { clusterIds: mergeSel.slice(1) }), 'Cluster zusammengeführt.')}>
            {mergeSel.length} Cluster zusammenführen
          </button>
        )}
      </div>
      <ErrorBox error={clusters.error} />
      {!clusters.data?.length && <Empty>Keine Cluster. Starten Sie die Analyse im Dashboard.</Empty>}
      <div className="cluster-grid">
        {clusters.data?.map((c) => (
          <Card
            key={c.id}
            title={
              <span>
                <input type="checkbox" aria-label="Zum Zusammenführen auswählen" checked={mergeSel.includes(c.id)} onChange={() => setMergeSel((s) => (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]))} />{' '}
                {c.name}
              </span>
            }
            actions={<span><Status s={c.status} /> <span className="tag">{c.scope === 'cross_chapter' ? 'kapitelübergreifend' : 'kapitelintern'}</span></span>}
          >
            <p className="small muted">Methode {c.method} · Schwelle {Math.round(c.threshold * 100)} % {c.canonicalTopic && <>· Canonical Topic: <strong>{c.canonicalTopic.title}</strong></>}</p>
            <ul className="members">
              {c.members.map((m: any) => (
                <li key={m.snippetId}>
                  <label>
                    <input type="checkbox" aria-label="Zum Teilen auswählen" checked={(splitSel[c.id] ?? []).includes(m.snippetId)} onChange={() => setSplitSel((s) => ({ ...s, [c.id]: (s[c.id] ?? []).includes(m.snippetId) ? s[c.id].filter((x) => x !== m.snippetId) : [...(s[c.id] ?? []), m.snippetId] }))} />
                    <strong>#{m.seq}</strong> {m.text.slice(0, 160)}
                  </label>
                  <div className="small muted">{m.chapter}{m.subchapter ? ` / ${m.subchapter}` : ''} · {m.path} · Score {Math.round(m.score * 100)} % · {m.reason}</div>
                </li>
              ))}
            </ul>
            <div className="row-actions">
              {c.status !== 'confirmed' && <button className="btn" onClick={() => act(() => patch(`/clusters/${c.id}`, { status: 'confirmed' }), 'Cluster bestätigt.')}>Bestätigen</button>}
              <button className="btn" onClick={() => { const n = prompt('Neuer Name', c.name); if (n) void act(() => patch(`/clusters/${c.id}`, { name: n }), 'Cluster umbenannt.'); }}>Umbenennen</button>
              {(splitSel[c.id]?.length ?? 0) > 0 && <button className="btn" onClick={() => act(() => post(`/clusters/${c.id}/split`, { snippetIds: splitSel[c.id] }), 'Cluster geteilt.')}>Auswahl abteilen</button>}
              {!c.canonicalTopic && <button className="btn" onClick={() => setCanonical(c)}>Canonical Topic festlegen</button>}
              {c.status !== 'dissolved' && <button className="btn ghost" onClick={() => act(() => patch(`/clusters/${c.id}`, { status: 'dissolved' }), 'Cluster aufgelöst.')}>Auflösen</button>}
            </div>
          </Card>
        ))}
      </div>
      {canonical && (
        <CanonicalDialog
          title={canonical.name}
          chapters={leadSuggestion(canonical.members)}
          onClose={() => setCanonical(null)}
          onSubmit={(body) => act(() => post('/canonical-topics', { ...body, clusterId: canonical.id }), 'Canonical Topic festgelegt – andere Kapitel erhalten bei der Generierung einen Querverweis.').then(() => setCanonical(null))}
        />
      )}
    </Page>
  );
}

/** ENTSCHEIDUNG(E-06): Vorschlag = Kapitel mit den meisten Cluster-Mitgliedern (steht zuerst); festgelegt wird nur manuell. */
function leadSuggestion(members: { chapterId: string; chapter: string }[]): [string, string][] {
  const counts = new Map<string, { title: string; n: number }>();
  for (const m of members) counts.set(m.chapterId, { title: m.chapter, n: (counts.get(m.chapterId)?.n ?? 0) + 1 });
  return [...counts.entries()].sort((a, b) => b[1].n - a[1].n).map(([id, v], i) => [id, i === 0 && counts.size > 1 ? `${v.title} (Vorschlag: ${v.n} Textabschnitte)` : v.title]);
}

export function CanonicalDialog({ title, chapters, onClose, onSubmit }: { title: string; chapters: [string, string][]; onClose: () => void; onSubmit: (b: { title: string; leadChapterId: string; reason: string }) => void }) {
  const [t, setT] = useState(title);
  const [lead, setLead] = useState(chapters[0]?.[0] ?? '');
  const [reason, setReason] = useState('');
  return (
    <Modal title="Canonical Topic festlegen" onClose={onClose}>
      <p className="small muted">Das führende Kapitel enthält die Aussage; alle anderen Kapitel erhalten bei der nächsten Generierung einen Querverweis. Es wird nichts automatisch gelöscht.</p>
      <label className="block">Titel <input value={t} onChange={(e) => setT(e.target.value)} /></label>
      <label className="block">Führendes Kapitel
        <select value={lead} onChange={(e) => setLead(e.target.value)}>
          {chapters.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
      <label className="block">Begründung (Pflicht) <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} /></label>
      <button className="btn primary" disabled={!reason.trim() || !t.trim()} onClick={() => onSubmit({ title: t, leadChapterId: lead, reason })}>Festlegen</button>
    </Modal>
  );
}
