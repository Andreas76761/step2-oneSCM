// Anleitungs-Check (ADR-051): Ist ein Kapitel leicht zu befolgen? Checkliste je Kapitel mit Korrekturen per Klick.
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { post } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const STATUS_ICON: Record<string, { icon: string; label: string }> = {
  ok: { icon: '✓', label: 'erfüllt' },
  warning: { icon: '!', label: 'bitte beheben' },
  info: { icon: 'i', label: 'Empfehlung' },
};

export const scoreLabel = (n: number) => (n >= 90 ? 'leicht zu befolgen' : n >= 70 ? 'gut, mit Lücken' : 'schwer zu befolgen');

function ScoreMeter({ score }: { score: number }) {
  return (
    <div className="guide-score">
      <strong>{score}</strong><span className="small muted"> von 100 · {scoreLabel(score)}</span>
      <div className="meter" role="img" aria-label={`Leserfreundlichkeit ${score} von 100`}><span style={{ width: `${score}%` }} /></div>
    </div>
  );
}

/** Fehlenden Abschnitt direkt schreiben */
function AddSection({ versionId, add, onDone }: { versionId: string; add: { section: string; kind: string; placeholder: string }; onDone: () => void }) {
  const { notify } = useApp();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <div className="guide-add">
      <label className="block">Text für diesen Abschnitt
        <textarea rows={add.kind === 'list' ? 4 : 2} value={text} placeholder={add.placeholder} onChange={(e) => setText(e.target.value)} />
      </label>
      <button className="btn small primary" disabled={!text.trim() || busy} onClick={async () => {
        setBusy(true);
        try {
          await post(`/chapter-versions/${versionId}/content-blocks`, { section: add.section, kind: add.kind, text: text.trim(), reason: 'Anleitungs-Check' });
          notify('Absatz hinzugefügt.');
          setText('');
          onDone();
        } catch (e) {
          notify(errorText(e), 'error');
        } finally {
          setBusy(false);
        }
      }}>Absatz hinzufügen</button>
    </div>
  );
}

/** Checkliste eines Kapitels – auch in der Werkstatt nutzbar */
export function GuidancePanel({ versionId, canEdit, onChanged }: { versionId: string; canEdit: boolean; onChanged?: () => void }) {
  const { notify } = useApp();
  const g = useLoad<any>(`/guidance/chapter-versions/${versionId}`, [versionId]);
  // mehrere Punkte gleichzeitig aufklappbar
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  if (!g.data) return <ErrorBox error={g.error} />;
  const d = g.data;
  const editable = canEdit && d.editable;
  const apply = async (fixes: any[]) => {
    setBusy(true);
    try {
      const r = await post<any>(`/guidance/chapter-versions/${versionId}/apply`, { fixes });
      notify(r.skipped.length ? `${r.saved.length} übernommen, ${r.skipped.length} übersprungen (${r.skipped.map((s: any) => s.reason).join('; ')}).` : `${r.saved.length} ${r.saved.length === 1 ? 'Korrektur' : 'Korrekturen'} übernommen.`);
      g.setData(r.guidance);
      onChanged?.();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const allFixes = d.checks.flatMap((c: any) => c.items.filter((i: any) => i.fix).map((i: any) => i.fix));
  // je Absatz nur eine Korrektur gleichzeitig (spätere beziehen sich sonst auf einen veralteten Stand)
  const oneFixPerBlock = [...new Map(allFixes.map((f: any) => [f.blockId, f])).values()];
  return (
    <div className="guide">
      <div className="guide-head">
        <ScoreMeter score={d.score} />
        <p className="small">{d.passed} von {d.total} Punkten erfüllt{!d.editable && ' · freigegebene oder eingereichte Versionen sind schreibgeschützt'}</p>
        {editable && oneFixPerBlock.length > 0 && (
          <button className="btn primary" disabled={busy} onClick={() => apply(oneFixPerBlock)}>Alle Korrekturen übernehmen ({oneFixPerBlock.length})</button>
        )}
      </div>
      <ul className="guide-list">
        {d.checks.map((c: any) => {
          const st = STATUS_ICON[c.status];
          const expanded = open.has(c.code);
          return (
            <li key={c.code} className={`guide-item st-${c.status}`}>
              <div className="guide-row">
                <span className={`guide-icon ${c.status}`} aria-hidden="true">{st.icon}</span>
                <div className="guide-text">
                  <strong>{c.label}</strong> <span className="sr-only">({st.label})</span>
                  <div className="small">{c.message}</div>
                </div>
                {c.status !== 'ok' && (
                  <button className="btn small" aria-expanded={expanded} aria-controls={`guide-${c.code}`} onClick={() => setOpen((o) => { const n = new Set(o); if (expanded) n.delete(c.code); else n.add(c.code); return n; })}>
                    {expanded ? 'Schließen' : 'So geht’s'}
                  </button>
                )}
              </div>
              {expanded && (
                <div id={`guide-${c.code}`} className="guide-detail">
                  <p className="small">{c.hint}</p>
                  {c.items.length > 0 && (
                    <ul className="plain">
                      {c.items.map((it: any, i: number) => (
                        <li key={i} className="guide-hit">
                          <span>„{it.excerpt}“{it.section && <span className="small muted"> · {it.section}</span>}</span>
                          {editable && it.fix && <button className="btn small" disabled={busy} onClick={() => apply([it.fix])}>{it.fix.label}</button>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.code === 'abbreviations' && <Link className="small" to="/stammdaten/abkuerzungen">Abkürzungen in den Stammdaten erfassen →</Link>}
                  {editable && c.addSection && <AddSection versionId={versionId} add={c.addSection} onDone={() => { g.reload(); onChanged?.(); }} />}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function GuidancePage() {
  const { versionId } = useParams();
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const list = useLoad<any>('/guidance', [versionId]);
  const current = list.data?.chapters.find((c: any) => c.versionId === versionId);
  if (versionId) {
    return (
      <Page title="Anleitungs-Check" subtitle={current ? `${current.title} · Version ${current.versionNo}` : 'Ist das Kapitel leicht zu befolgen?'}
        actions={<><Link className="btn" to="/anleitungs-check">← Alle Kapitel</Link>{current && <Link className="btn" to={`/werkstatt/${current.chapterId}`}>In der Werkstatt öffnen</Link>}</>}>
        <Card><GuidancePanel versionId={versionId} canEdit={canEdit} onChanged={list.reload} /></Card>
      </Page>
    );
  }
  const chapters: any[] = list.data?.chapters ?? [];
  return (
    <Page title="Anleitungs-Check" subtitle="Sind die Kapitel leicht zu befolgen? Zweck, Voraussetzungen, nummerierte Schritte, Ergebnis – mit Korrekturen per Klick">
      <ErrorBox error={list.error} />
      {list.data && !chapters.length && <Empty>Noch keine Kapitel. <Link to="/kapitel-assistent">Mit dem Kapitel-Assistenten beginnen →</Link></Empty>}
      {chapters.length > 0 && (
        <Card title={`Kapitel (${chapters.length})`} actions={list.data.average !== null && <span className="small">Durchschnitt: <strong>{list.data.average}</strong> · {scoreLabel(list.data.average)}</span>}>
          <div className="table-wrap" role="region" aria-label="Kapitel im Anleitungs-Check" tabIndex={0}>
            <table className="table">
              <thead><tr><th>Kapitel</th><th>Wert</th><th>Offene Punkte</th><th /></tr></thead>
              <tbody>
                {chapters.map((c) => (
                  <tr key={c.chapterId}>
                    <td>{c.title}<div className="small muted">Version {c.versionNo}</div></td>
                    <td><strong>{c.score}</strong> <span className="small muted">({c.passed}/{c.total})</span></td>
                    <td>{c.open.length ? c.open.map((o: any) => <span key={o.code} className={`tag guide-tag ${o.status}`}>{o.status === 'warning' ? '! ' : 'i '}{o.label}</span>) : <span className="small">✓ alles erfüllt</span>}</td>
                    <td><Link className="btn small" to={`/anleitungs-check/${c.versionId}`} aria-label={`${c.title} prüfen`}>Prüfen</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Page>
  );
}
