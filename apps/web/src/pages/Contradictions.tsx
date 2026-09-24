import { useState } from 'react';
import { post, qs } from '../api';
import { Assumption, Card, DivisionBadges, Empty, ErrorBox, Md, Modal, Page, RoleBadges, Severity, Status, errorText, useApp, useLoad } from '../components/ui';
import { SourceViewer } from './Sources';

export function ContradictionsPage() {
  const [minScore, setMinScore] = useState(40);
  const [openOnly, setOpenOnly] = useState(true);
  const findings = useLoad<any[]>(`/quality/findings${qs({ type: 'contradiction', minScore: minScore / 100, status: openOnly ? 'open,deferred' : undefined })}`, [minScore, openOnly]);
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <Page title="Widersprüche" subtitle="Widersprüchliche Aussagen vor der Generierung fachlich klären">
      <Assumption id="E-07">Blocker: Negation, Pflicht/Optional, abweichende Zahl/Frist, Datenschutz. Hinweise sind Prüfvorschläge und keine fachliche Bewertung.</Assumption>
      <Card>
        <div className="filters">
          <label className="slider">Treffer ab Ähnlichkeit
            <input type="range" min={10} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} aria-label="Mindestähnlichkeit" />
            <strong>{minScore} %</strong>
          </label>
          <label><input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} /> Nur offene Hinweise</label>
          <button className="btn ghost" onClick={findings.reload}>⟳ Aktualisieren</button>
        </div>
        <ErrorBox error={findings.error} />
        {!findings.data?.length ? <Empty>Keine Widerspruchshinweise für diesen Filter.</Empty> : (
          <table className="table">
            <thead><tr><th>#</th><th>Grund</th><th>Schwere</th><th>Ähnlichkeit</th><th>Text A</th><th>Text B</th><th>Kapitel / Unterkapitel</th><th>Status</th><th>Aktion</th></tr></thead>
            <tbody>
              {findings.data.map((f) => (
                <tr key={f.id}>
                  <td>#{f.seq}</td>
                  <td>{f.reason}</td>
                  <td><Severity s={f.severity} /></td>
                  <td>{Math.round((f.score ?? 0) * 100)} %</td>
                  <td>#{f.a?.seq}</td>
                  <td>#{f.b?.seq}</td>
                  <td className="small">{f.a?.chapter}{f.a?.subchapter ? ` / ${f.a.subchapter}` : ''}</td>
                  <td><Status s={f.status} />{f.decision && <div className="small muted">{f.decision}</div>}</td>
                  <td><button className="btn primary small" onClick={() => setSelected(f)}>Texte vergleichen</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {selected && <CompareDialog finding={selected} onClose={() => setSelected(null)} onDecided={() => (setSelected(null), findings.reload())} />}
    </Page>
  );
}

function Statement({ label, s }: { label: string; s: any }) {
  const [src, setSrc] = useState(false);
  if (!s) return null;
  return (
    <div className="statement">
      <h3>{label} · #{s.seq}</h3>
      <Md text={s.text} />
      <dl className="meta">
        <dt>Quelle</dt><dd>{s.path} (Rev. {s.revisionNo}{s.isCurrent ? '' : ', veraltet'}) <button className="btn link" onClick={() => setSrc(true)}>öffnen</button></dd>
        <dt>Kapitel</dt><dd>{s.chapter}{s.subchapter ? ` / ${s.subchapter}` : ''}</dd>
        <dt>Rollen</dt><dd><RoleBadges codes={s.roles} /></dd>
        <dt>Sparten</dt><dd><DivisionBadges codes={s.divisions} /></dd>
        <dt>Markt</dt><dd>{s.market ?? '–'}</dd>
        <dt>Release</dt><dd>{s.release ?? '–'}</dd>
        <dt>Evidenz</dt><dd><Status s={s.evidenceStatus} /></dd>
        {s.excludedReason && (<><dt>Ausgeschlossen</dt><dd>{s.excludedReason}</dd></>)}
      </dl>
      {src && <SourceViewer revisionId={s.revisionId} lineStart={s.lineStart} lineEnd={s.lineEnd} onClose={() => setSrc(false)} />}
    </div>
  );
}

export function CompareDialog({ finding: f, onClose, onDecided }: { finding: any; onClose: () => void; onDecided: () => void }) {
  const { ref, notify } = useApp();
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [outdated, setOutdated] = useState<'a' | 'b'>('b');
  const decided = ['resolved', 'ignored'].includes(f.status);

  const submit = async () => {
    try {
      await post(`/quality/findings/${f.id}/decision`, { decision, reason, outdated: decision === 'outdated_source' ? outdated : undefined });
      notify(`Entscheidung zu Befund #${f.seq} protokolliert.`);
      onDecided();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Modal title={`Befund #${f.seq}: ${f.reason}`} onClose={onClose} wide>
      <p className="small muted">
        Ähnlichkeit {Math.round((f.score ?? 0) * 100)} % · Methode {f.method} · Schwere <Severity s={f.severity} />
        {f.details?.why && <> · {f.details.why}</>}
      </p>
      {f.details?.rules && (
        <ul className="small">
          {f.details.rules.map((r: any, i: number) => <li key={i}><strong>{r.label}</strong>{r.a !== undefined && <> — A: {JSON.stringify(r.a)} · B: {JSON.stringify(r.b)}</>}</li>)}
        </ul>
      )}
      <div className="grid2">
        <Statement label="Aussage A" s={f.a} />
        <Statement label="Aussage B" s={f.b} />
      </div>
      {decided ? (
        <div className="alert">Entschieden: <strong>{ref?.decisions.find((d) => d.code === f.decision)?.label ?? f.decision}</strong> von {f.decidedBy} am {new Date(f.decidedAt).toLocaleString('de-DE')} — {f.decisionReason}</div>
      ) : (
        <fieldset className="decision">
          <legend>Entscheidung (Begründung, Entscheider und Zeitstempel werden protokolliert)</legend>
          <div className="form-row">
            <label>Option
              <select value={decision} onChange={(e) => setDecision(e.target.value)} aria-label="Entscheidung">
                <option value="">– bitte wählen –</option>
                {ref?.decisions.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
              </select>
            </label>
            {decision === 'outdated_source' && (
              <label>Veraltet ist
                <select value={outdated} onChange={(e) => setOutdated(e.target.value as 'a' | 'b')}>
                  <option value="a">Aussage A</option>
                  <option value="b">Aussage B</option>
                </select>
              </label>
            )}
          </div>
          <label className="block">Begründung (Pflicht) <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Begründung" /></label>
          <button className="btn primary" disabled={!decision || reason.trim().length < 3} onClick={submit}>Entscheidung speichern</button>
        </fieldset>
      )}
    </Modal>
  );
}
