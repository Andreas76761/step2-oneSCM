import { useState } from 'react';
import { Badge, Card, DivisionBadges, Empty, Md, Page, RoleBadges, Status, useApp, useLoad } from '../components/ui';

type Block = { roles: string[]; divisions: string[]; market: string | null; release: string | null; kind: string };

/** Gleiche Logik wie der Server-Export: allgemeine plus passende spezifische Inhalte (US-010). */
export function matches(b: Block, roles: string[], divisions: string[]) {
  const generalRole = b.roles.length === 0 || b.roles.includes('all');
  const generalDiv = b.divisions.length === 0 || b.divisions.includes('all');
  if (roles.length && !generalRole && !b.roles.some((r) => roles.includes(r))) return false;
  if (divisions.length && !generalDiv && !b.divisions.some((d) => divisions.includes(d))) return false;
  return true;
}

export function FilteredViewPage({ mode }: { mode: 'role' | 'division' }) {
  const { ref } = useApp();
  const chapters = useLoad<any[]>('/chapters');
  const [sel, setSel] = useState<string>('');
  const [chapterId, setChapterId] = useState('');
  const items = mode === 'role' ? ref?.roles.filter((r) => r.code !== 'all') : ref?.divisions.filter((d) => !['all', 'unconfirmed'].includes(d.code));
  const chapter = chapters.data?.find((c) => c.id === chapterId) ?? chapters.data?.find((c) => c.versions.length);
  const version = chapter?.versions.find((v: any) => v.status === 'approved') ?? chapter?.versions[0];
  const v = useLoad<any>(version ? `/chapter-versions/${version.id}` : null, [version?.id]);

  return (
    <Page title={mode === 'role' ? 'Rollenansichten' : 'Spartenansichten'} subtitle="Gefilterte Ansicht: allgemeine Inhalte plus passende rollen- bzw. spartenspezifische Inhalte">
      <div className="chips" role="radiogroup" aria-label={mode === 'role' ? 'Rolle' : 'Sparte'}>
        <button role="radio" aria-checked={!sel} className={`chip ${!sel ? 'active' : ''}`} onClick={() => setSel('')}>ohne Filter</button>
        {items?.map((i) => (
          <button key={i.code} role="radio" aria-checked={sel === i.code} className={`chip ${sel === i.code ? 'active' : ''}`} onClick={() => setSel(i.code)}>
            <Badge item={i} />
          </button>
        ))}
      </div>
      <div className="filters">
        <select aria-label="Kapitel" value={chapter?.id ?? ''} onChange={(e) => setChapterId(e.target.value)}>
          {chapters.data?.filter((c) => c.versions.length).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        {version && <span>Version {version.versionNo} <Status s={version.status} /></span>}
      </div>
      {!v.data ? <Empty>Noch kein generiertes Kapitel vorhanden.</Empty> : (
        <Card title={v.data.title}>
          {v.data.status !== 'approved' && <div className="alert">Entwurf – noch nicht fachlich freigegeben.</div>}
          {v.data.sections.map((s: any) => {
            const blocks = s.blocks.filter((b: any) => b.kind !== 'gap' && matches(b, mode === 'role' && sel ? [sel] : [], mode === 'division' && sel ? [sel] : []));
            if (!blocks.length) return null;
            return (
              <section key={s.code} className="reader">
                <h3>{s.title}</h3>
                {blocks.map((b: any) => (
                  <div key={b.id} className={`reader-block kind-${b.kind}`}>
                    {(b.roles.some((r: string) => r !== 'all') || b.divisions.some((d: string) => d !== 'all')) && (
                      <div className="block-meta"><RoleBadges codes={b.roles.filter((r: string) => r !== 'all')} /><DivisionBadges codes={b.divisions.filter((d: string) => d !== 'all')} /></div>
                    )}
                    <Md text={b.text} />
                  </div>
                ))}
              </section>
            );
          })}
        </Card>
      )}
    </Page>
  );
}
