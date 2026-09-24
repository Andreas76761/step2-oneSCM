import { useState } from 'react';
import { Card, Empty, ErrorBox, Page, Severity, Status, TYPE_LABEL, useLoad } from '../components/ui';
import { CompareDialog } from './Contradictions';

const TYPES = ['gap', 'terminology', 'readability', 'privacy'];

export function OptimizationsPage() {
  const [type, setType] = useState('');
  const f = useLoad<any[]>(`/quality/findings?status=open,deferred${type ? `&type=${type}` : ''}`, [type]);
  const [sel, setSel] = useState<any | null>(null);
  const rows = (f.data ?? []).filter((x) => TYPES.includes(x.type));
  return (
    <Page title="Optimierungen" subtitle="Lücken, Terminologie, Lesbarkeit und Datenschutz – Hinweise zur redaktionellen Verbesserung">
      <div className="filters">
        <select aria-label="Befundtyp" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Alle Optimierungstypen</option>
          {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </select>
      </div>
      <ErrorBox error={f.error} />
      <Card>
        {!rows.length ? <Empty>Keine offenen Optimierungshinweise.</Empty> : (
          <table className="table">
            <thead><tr><th>#</th><th>Typ</th><th>Schwere</th><th>Hinweis</th><th>Kapitel</th><th>Text</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td>#{x.seq}</td>
                  <td>{TYPE_LABEL[x.type]}</td>
                  <td><Severity s={x.severity} /></td>
                  <td>{x.reason}</td>
                  <td className="small">{x.chapterTitle ?? x.a?.chapter}</td>
                  <td className="preview small">{x.a?.text.slice(0, 120)}</td>
                  <td><Status s={x.status} /></td>
                  <td><button className="btn small" onClick={() => setSel(x)}>Details / entscheiden</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {sel && <CompareDialog finding={sel} onClose={() => setSel(null)} onDecided={() => (setSel(null), f.reload())} />}
    </Page>
  );
}
