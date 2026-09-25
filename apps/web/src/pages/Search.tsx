// Globale Suche (ADR-035, Volltext ADR-039): Treffer nach Relevanz, Filter nach Bereich mit Anzahl, Seiten, Hervorhebung aus dem Index
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { qs } from '../api';
import { Card, Empty, ErrorBox, Page, useLoad } from '../components/ui';

const PAGE_SIZE = 20;

/** Suchwörter im Titel hervorheben (Präfix, ohne Groß-/Kleinschreibung; ohne HTML aus dem Inhalt) */
function HighlightTitle({ text, q }: { text: string; q: string }) {
  const words = [...q.matchAll(/[\p{L}\p{N}]+/gu)].map((m) => m[0].toLowerCase());
  if (!words.length) return <>{text}</>;
  const parts: ReactNode[] = [];
  const re = /[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu;
  for (const m of text.matchAll(re)) {
    const w = m[0];
    parts.push(words.some((x) => w.toLowerCase().startsWith(x)) ? <mark key={m.index}>{w}</mark> : w);
  }
  return <>{parts}</>;
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const type = params.get('type') ?? '';
  const page = Math.max(Number(params.get('page')) || 1, 1);
  const res = useLoad<any>(q.length >= 2 ? `/search${qs({ q, types: type || undefined, page, limit: PAGE_SIZE })}` : null, [q, type, page]);
  const r = res.data;
  const go = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) (v ? p.set(k, v) : p.delete(k));
    setParams(p);
  };
  const pages = r ? Math.max(1, Math.ceil(r.total / r.pageSize)) : 1;
  const allCount = r?.facets.reduce((a: number, f: any) => a + f.count, 0) ?? 0;
  return (
    <Page title="Suche" subtitle={q ? `Treffer für „${q}“` : 'Kapitel, Texte, Quellen, Gliederungen und Stammdaten durchsuchen'}>
      <ErrorBox error={res.error} />
      {q.length < 2 && <Empty>Bitte mindestens 2 Zeichen in das Suchfeld der Navigation eingeben.</Empty>}
      {r && !allCount && <Empty>Keine Treffer für „{r.query}“. Tipp: Wortanfänge genügen („Anmel“ findet „Anmeldung“); alle Wörter müssen vorkommen.</Empty>}
      {r && allCount > 0 && (
        <>
          <div className="filters" role="group" aria-label="Bereich filtern">
            <button className={`chip${!type ? ' active' : ''}`} aria-pressed={!type} onClick={() => go({ type: null, page: null })}>Alle ({allCount})</button>
            {r.facets.map((f: any) => (
              <button key={f.type} className={`chip${type === f.type ? ' active' : ''}`} aria-pressed={type === f.type} onClick={() => go({ type: f.type, page: null })}>{f.label} ({f.count})</button>
            ))}
          </div>
          <p className="small muted" role="status">{r.total} Treffer{pages > 1 ? ` · Seite ${page} von ${pages}` : ''} · nach Relevanz sortiert</p>
          <Card>
            <ol className="search-hits">
              {r.hits.map((h: any) => (
                <li key={`${h.type}-${h.id}`}>
                  <span className="tag">{h.label}</span> <Link to={h.link}><HighlightTitle text={h.title} q={q} /></Link>
                  {h.excerptParts && (
                    <div className="small muted">{h.excerptParts.map((p: any, i: number) => (p.hit ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>))}</div>
                  )}
                </li>
              ))}
            </ol>
          </Card>
          {pages > 1 && (
            <nav className="row-actions" aria-label="Trefferseiten">
              <button className="btn small" disabled={page <= 1} onClick={() => go({ page: String(page - 1) })}>‹ zurück</button>
              <span className="small">Seite {page} von {pages}</span>
              <button className="btn small" disabled={page >= pages} onClick={() => go({ page: String(page + 1) })}>weiter ›</button>
            </nav>
          )}
        </>
      )}
    </Page>
  );
}
