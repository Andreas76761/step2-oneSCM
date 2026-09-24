// Globale Suche (ADR-035): Treffer gruppiert nach Art, jeweils mit Sprungziel
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { qs } from '../api';
import { Card, Empty, ErrorBox, Page, useLoad } from '../components/ui';

/** Treffer im Text hervorheben (ohne HTML aus dem Inhalt zu übernehmen) */
function Highlight({ text, q }: { text: string; q: string }) {
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: ReactNode[] = [];
  let i = 0;
  for (let j = lower.indexOf(needle); needle && j >= 0; j = lower.indexOf(needle, i)) {
    parts.push(text.slice(i, j), <mark key={j}>{text.slice(j, j + q.length)}</mark>);
    i = j + q.length;
  }
  parts.push(text.slice(i));
  return <>{parts}</>;
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const res = useLoad<any>(q.length >= 2 ? `/search${qs({ q, limit: 10 })}` : null, [q]);
  const r = res.data;
  return (
    <Page title="Suche" subtitle={q ? `Treffer für „${q}“` : 'Kapitel, Texte, Quellen, Gliederungen und Stammdaten durchsuchen'}>
      <ErrorBox error={res.error} />
      {q.length < 2 && <Empty>Bitte mindestens 2 Zeichen in das Suchfeld der Navigation eingeben.</Empty>}
      {r && !r.total && <Empty>Keine Treffer für „{r.query}“.</Empty>}
      {r && r.total > 0 && (
        <p className="small muted" role="status">{r.total} Treffer in {r.groups.length} Bereichen</p>
      )}
      {r?.groups.map((g: any) => (
        <Card key={g.type} title={`${g.label} (${g.hits.length})`}>
          <ul className="search-hits">
            {g.hits.map((h: any) => (
              <li key={`${h.type}-${h.id}`}>
                <Link to={h.link}><Highlight text={h.title} q={q} /></Link>
                {h.excerpt && <div className="small muted"><Highlight text={h.excerpt} q={q} /></div>}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </Page>
  );
}
