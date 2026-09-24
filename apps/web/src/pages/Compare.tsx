import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Diff, DivisionBadges, Empty, ErrorBox, Md, Page, RoleBadges, Status, useLoad } from '../components/ui';

const CHANGE: Record<string, { label: string; cls: string }> = {
  added: { label: '＋ hinzugefügt', cls: 'st-approved' },
  removed: { label: '－ entfernt', cls: 'st-failed' },
  changed: { label: '✎ geändert', cls: 'st-draft' },
  moved: { label: '↕ verschoben', cls: 'st-in_review' },
  unchanged: { label: '= unverändert', cls: '' },
};

/** Vergleich ganzer Kapitelversionen (US-019) */
export function ComparePage() {
  const { chapterId } = useParams();
  const versions = useLoad<any[]>(chapterId ? `/chapters/${chapterId}/versions` : null, [chapterId]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showUnchanged, setShowUnchanged] = useState(false);
  useEffect(() => {
    const v = versions.data ?? [];
    if (v.length >= 2) {
      setTo(v[0].id);
      setFrom(v[1].id);
    }
  }, [versions.data]);
  const cmp = useLoad<any>(chapterId && from && to ? `/chapters/${chapterId}/compare?from=${from}&to=${to}` : null, [from, to]);
  const d = cmp.data;
  const entries = (d?.entries ?? []).filter((e: any) => showUnchanged || e.change !== 'unchanged');
  const title = (code: string) => d?.sections.find((s: any) => s.code === code)?.title ?? code;

  const option = (v: any) => <option key={v.id} value={v.id}>Version {v.versionNo} ({v.status}, {new Date(v.generatedAt).toLocaleString('de-DE')})</option>;

  return (
    <Page title="Versionsvergleich" subtitle={d ? `${d.chapterTitle}: Version ${d.from.versionNo} → Version ${d.to.versionNo}` : 'Zwei Kapitelversionen gegenüberstellen'} actions={chapterId && <Link className="btn" to={`/werkstatt/${chapterId}`}>Zur Kapitelwerkstatt</Link>}>
      <ErrorBox error={versions.error ?? cmp.error} />
      {versions.data && versions.data.length < 2 && <Empty>Für dieses Kapitel gibt es noch keine zwei Versionen.</Empty>}
      {versions.data && versions.data.length >= 2 && (
        <div className="filters">
          <label>Von <select aria-label="Von Version" value={from} onChange={(e) => setFrom(e.target.value)}>{versions.data.map(option)}</select></label>
          <label>Nach <select aria-label="Nach Version" value={to} onChange={(e) => setTo(e.target.value)}>{versions.data.map(option)}</select></label>
          <label><input type="checkbox" checked={showUnchanged} onChange={(e) => setShowUnchanged(e.target.checked)} /> unveränderte Absätze anzeigen</label>
        </div>
      )}
      {d && (
        <>
          <div className="tiles">
            {(['added', 'removed', 'changed', 'moved', 'unchanged'] as const).map((k) => (
              <div className="tile" key={k}><span className="tile-label">{CHANGE[k].label}</span><span className="tile-value">{d.summary[k]}</span></div>
            ))}
          </div>
          <Card>
            {!entries.length ? <Empty>Keine Unterschiede.</Empty> : entries.map((e: any, i: number) => (
              <article key={i} className={`cmp cmp-${e.change}`} aria-label={`${CHANGE[e.change].label}: ${title(e.section)}`}>
                <div className="block-meta">
                  <span className={`tag ${CHANGE[e.change].cls}`}>{CHANGE[e.change].label}</span>
                  <strong>{title(e.section)}</strong>
                  {e.fields.includes('section') && <span className="small muted">aus „{title(e.from.section)}“</span>}
                  {e.fields.includes('order') && !e.fields.includes('section') && <span className="small muted">Reihenfolge geändert</span>}
                  {e.fields.length > 0 && e.change === 'changed' && <span className="small muted">geändert: {e.fields.map((f: string) => d.fieldLabels[f]).join(', ')}</span>}
                  {(e.to ?? e.from) && <><RoleBadges codes={(e.to ?? e.from).roles.filter((r: string) => r !== 'all')} /><DivisionBadges codes={(e.to ?? e.from).divisions.filter((x: string) => x !== 'all')} /></>}
                  {e.to && <Status s={e.to.mode} />}
                </div>
                {e.change === 'changed' && e.fields.includes('text') ? <Diff a={e.from.text} b={e.to.text} /> : <Md text={(e.to ?? e.from).text} />}
                {e.change === 'changed' && e.fields.some((f: string) => !['text', 'section', 'order'].includes(f)) && (
                  <ul className="small">
                    {e.fields.filter((f: string) => !['text', 'section', 'order'].includes(f)).map((f: string) => (
                      <li key={f}>{d.fieldLabels[f]}: {fmt(e.from, f)} → {fmt(e.to, f)}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Card>
        </>
      )}
    </Page>
  );
}

function fmt(b: any, f: string): string {
  const v = f === 'sources' ? b.sources.map((s: number) => `#${s}`) : b[f];
  if (Array.isArray(v)) return v.length ? v.join(', ') : '–';
  return v === null || v === undefined || v === '' ? '–' : String(v);
}
