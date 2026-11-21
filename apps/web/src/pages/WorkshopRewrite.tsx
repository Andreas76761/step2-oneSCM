// Kapitelwerkstatt: Stil für alle Absätze korrigieren und KI-Umformulierung (Absatz und ganzes Kapitel) mit Quellenbindung je Satz.
import { CircleXIcon, SparklesIcon, XIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useEffect, useRef, useState } from 'react';
import { post } from '../api';
import { Diff, Empty, Status, errorText, useApp, useLoad, Modal } from '../components/ui';

/** Absatzarten, die die KI umformulieren darf */
export const REWRITABLE = ['paragraph', 'list', 'note', 'tip', 'warning'];

/**
 * Stapelkorrektur Schreibstil (ADR-043) bzw. KI-Stapelumformulierung (ADR-044): Vorschau je Absatz, Auswahl, Übernahme mit Versionsprüfung.
 * Regeln: serverseitige Vorschau. KI: je Absatz über /style/rewrite (Fortschritt sichtbar, Absätze mit Bildern ausgenommen).
 */
export function StyleBatch({ version, llm, onClose, onChanged }: { version: any; llm: any; onClose: () => void; onChanged: () => void }) {
  const { notify } = useApp();
  const [mode, setMode] = useState<'rules' | 'professional' | 'present'>('rules');
  const [items, setItems] = useState<any[] | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const cancelled = useRef(false);
  useEffect(() => () => {
    cancelled.current = true;
  }, []);

  const load = async (m: typeof mode) => {
    setItems(null);
    setChosen([]);
    cancelled.current = false;
    try {
      if (m === 'rules') {
        const r = await post<any>(`/style/chapter-versions/${version.id}/autofix`, {});
        setItems(r.blocks.map((b: any) => ({ ...b, note: `${b.applied} Korrektur(en)` })));
        setChosen(r.blocks.filter((b: any) => !b.locked).map((b: any) => b.id));
        return;
      }
      if (llm?.external && !confirm(`Die Absätze werden zur Umformulierung an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return setMode('rules');
      const blocks = version.sections.flatMap((s: any) => s.blocks.map((b: any) => ({ ...b, sectionTitle: s.title })))
        .filter((b: any) => REWRITABLE.includes(b.kind) && b.mode !== 'locked' && !b.text.includes('](media:'));
      const out: any[] = [];
      setProgress({ done: 0, total: blocks.length });
      for (const [n, b] of blocks.entries()) {
        if (cancelled.current) break;
        try {
          const r = await post<any>('/style/rewrite', { text: b.text, mode: m });
          if (r.text.trim() !== b.text.trim()) {
            out.push({ id: b.id, section: b.sectionTitle, versionNo: b.versionNo, before: b.text, after: r.text, lostNumbers: r.lostNumbers,
              note: r.lostNumbers.length ? `Zahlen fehlen: ${r.lostNumbers.join(', ')}` : r.method === 'ai' ? 'KI-Vorschlag' : 'Regelkorrektur' });
          }
        } catch (e) {
          out.push({ id: b.id, section: b.sectionTitle, versionNo: b.versionNo, before: b.text, after: null, note: `nicht umformuliert: ${errorText(e)}` });
        }
        setProgress({ done: n + 1, total: blocks.length });
      }
      setItems(out);
      // Vorschläge mit fehlenden Zahlen nicht vorauswählen
      setChosen(out.filter((x) => x.after && !x.lostNumbers?.length).map((x) => x.id));
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setProgress(null);
    }
  };
  useEffect(() => {
    void load(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.id, mode]);

  const apply = async () => {
    if (!items) return;
    setBusy(true);
    try {
      const sel = items.filter((b) => chosen.includes(b.id));
      const r = mode === 'rules'
        ? await post<any>(`/style/chapter-versions/${version.id}/autofix`, { apply: true, blocks: sel.map((b) => ({ id: b.id, versionNo: b.versionNo })) })
        : await post<any>(`/style/chapter-versions/${version.id}/apply`, { blocks: sel.map((b) => ({ id: b.id, versionNo: b.versionNo, text: b.after })), reason: mode === 'present' ? 'Schreibstil: ins Präsens (KI)' : 'Schreibstil: professionell umformuliert (KI)' });
      notify(`${r.saved.length} Absatz/Absätze ${mode === 'rules' ? 'korrigiert' : 'umformuliert'}${r.skipped.length ? `, ${r.skipped.length} übersprungen (${r.skipped.map((x: any) => x.reason).join('; ')})` : ''}.`);
      onChanged();
      onClose();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const usable = (items ?? []).filter((b) => b.after);
  return (
    <Modal title="Schreibstil: Kapitel automatisch korrigieren" wide onClose={onClose}>
      <div className="filters" role="group" aria-label="Art der Überarbeitung">
        <button className={`chip${mode === 'rules' ? ' active' : ''}`} aria-pressed={mode === 'rules'} disabled={!!progress} onClick={() => setMode('rules')}>Regelkorrekturen</button>
        {llm?.enabled && <button className={`chip${mode === 'professional' ? ' active' : ''}`} aria-pressed={mode === 'professional'} disabled={!!progress} onClick={() => setMode('professional')}><Ico icon={SparklesIcon} />KI: professionell umformulieren</button>}
        {llm?.enabled && <button className={`chip${mode === 'present' ? ' active' : ''}`} aria-pressed={mode === 'present'} disabled={!!progress} onClick={() => setMode('present')}><Ico icon={SparklesIcon} />KI: ins Präsens</button>}
      </div>
      {progress && (
        <div role="status">
          <p className="small">KI formuliert Absatz {Math.min(progress.done + 1, progress.total)} von {progress.total} …</p>
          <progress max={progress.total} value={progress.done} aria-label="Fortschritt der Umformulierung" />
          <button className="btn small" onClick={() => (cancelled.current = true)}>Abbrechen</button>
        </div>
      )}
      {!items && !progress && <p className="small">Vorschau wird berechnet …</p>}
      {items && !usable.length && <Empty>{mode === 'rules' ? 'Keine automatischen Korrekturen nötig.' : 'Keine Änderungsvorschläge.'}</Empty>}
      {items && items.length > 0 && (
        <>
          <p className="small" role="status">{usable.length} Absätze mit {mode === 'rules' ? 'automatischen Korrekturen' : 'Vorschlägen'} · {chosen.length} ausgewählt</p>
          <ul className="plain style-batch">
            {items.map((b: any) => (
              <li key={b.id}>
                <label className="inline"><input type="checkbox" disabled={b.locked || !b.after} checked={chosen.includes(b.id)} onChange={() => setChosen(chosen.includes(b.id) ? chosen.filter((x) => x !== b.id) : [...chosen, b.id])} /> {b.section} · {b.note}{b.locked ? ' · gesperrt' : ''}</label>
                {b.after && <Diff a={b.before} b={b.after} />}
              </li>
            ))}
          </ul>
          <div className="row-actions">
            <button className="btn primary" disabled={busy || !!progress || !chosen.length} onClick={apply}>Auswahl übernehmen ({chosen.length})</button>
            <button className="btn" onClick={onClose}>Abbrechen</button>
          </div>
        </>
      )}
    </Modal>
  );
}

/**
 * KI-Umformulierung des ganzen Kapitels: Auftrag starten, Fortschritt verfolgen, Vorschläge gesammelt prüfen.
 * Sichtbar, sobald ein Auftrag läuft, offene Vorschläge vorliegen oder der Auftrag gestartet werden soll.
 */
export function ChapterRewrite({ version: v, llm, editable, open, onClose, onChanged }: { version: any; llm: any; editable: boolean; open: boolean; onClose: () => void; onChanged: () => void }) {
  const { notify, ref } = useApp();
  const batches = useLoad<any[]>(`/chapter-versions/${v.id}/rewrite-jobs`, [v.id]);
  const proposals = useLoad<any[]>(`/chapter-versions/${v.id}/rewrite-proposals`, [v.id, JSON.stringify(v.sections.map((s: any) => s.blocks.map((b: any) => b.versionNo)))]);
  const [instructions, setInstructions] = useState('');
  const latest = batches.data?.[0];
  const running = latest && ['queued', 'processing'].includes(latest.status);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      batches.reload();
      proposals.reload();
    }, 1500);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (latest && !running) proposals.reload();
  }, [latest?.status]);
  const act = async (fn: () => Promise<any>, msg: (r: any) => string) => {
    try {
      const r = await fn();
      notify(msg(r));
      batches.reload();
      proposals.reload();
      onChanged();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const start = () => {
    if (llm.external && !confirm(`Alle geeigneten Absätze dieses Kapitels und ihre Quelltexte werden an ${llm.provider} (${llm.model}) übertragen. Fortfahren?`)) return;
    void act(() => post(`/chapter-versions/${v.id}/rewrite-jobs`, { instructions }), (b) => `Umformulierung gestartet: ${b.total} Absätze.`);
    onClose();
  };
  const list = proposals.data ?? [];
  const valid = list.filter((p) => p.status === 'proposed' && p.valid);
  if (!open && !running && !list.length) return null;
  const title = (code: string) => ref?.sections.find((s) => s.code === code)?.title ?? code;
  return (
    <section className="card rewrite-batch" aria-label="KI-Umformulierung des Kapitels">
      <div className="card-head">
        <h2><Ico icon={SparklesIcon} />KI-Umformulierung des Kapitels</h2>
        {open && <button className="btn ghost small" onClick={onClose} aria-label="Schließen"><Ico icon={XIcon} /></button>}
      </div>
      {open && !running && editable && (
        <div className="form-row">
          <label>Hinweis an die KI (optional) <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="z. B. kürzer, einfache Sprache" /></label>
          <button className="btn primary" onClick={start}>Vorschläge für alle Absätze anfordern</button>
        </div>
      )}
      {latest && (
        <div className="batch-status">
          <progress max={latest.total || 1} value={latest.done} aria-label="Fortschritt der Umformulierung" />
          <span className="small">
            <Status s={latest.status} /> {latest.done} / {latest.total} Absätze · gültig {latest.valid} · ungültig {latest.invalid}
            {latest.skipped > 0 && <> · übersprungen {latest.skipped}</>}{latest.failed > 0 && <> · Fehler {latest.failed}</>}
            {' '}· Tokens {latest.inputTokens + latest.outputTokens}
          </span>
          {running && <button className="btn small" onClick={() => act(() => post(`/rewrite-jobs/${latest.id}/cancel`, {}), () => 'Abbruch angefordert.')}>Abbrechen</button>}
          {latest.error && <span className="small sev-text">{latest.error}</span>}
        </div>
      )}
      {list.length > 0 && (
        <>
          <div className="card-head">
            <h3>Sammelprüfung: {list.length} offene Vorschläge</h3>
            {editable && valid.length > 0 && (
              <button className="btn primary small" onClick={() => act(() => post(`/chapter-versions/${v.id}/rewrite-proposals/accept-valid`, {}), (r) => `${r.accepted.length} Vorschläge übernommen${r.errors.length ? `, ${r.errors.length} nicht (veraltet)` : ''}.`)}>
                Alle gültigen übernehmen ({valid.length})
              </button>
            )}
          </div>
          <ul className="batch-list">
            {list.map((p) => (
              <li key={p.id}>
                <div className="block-meta">
                  <strong>{title(p.section)}</strong>
                  <span className={`tag ${p.valid ? 'st-approved' : 'sev-blocker'}`}>{p.valid ? 'jeder Satz belegt' : 'Satzprüfung nicht bestanden'}</span>
                </div>
                <Diff a={p.originalText} b={p.proposedText} />
                {!p.valid && <ul className="small">{p.sentences.filter((s: any) => s.issues.length).map((s: any, i: number) => <li key={i} className="sev-text">{s.text} – {s.issues.map((x: string) => llm.issueLabels?.[x] ?? x).join(', ')}</li>)}</ul>}
                {editable && (
                  <div className="row-actions">
                    <button className="btn small" disabled={!p.valid || p.status !== 'proposed'} onClick={() => act(() => post(`/rewrite-proposals/${p.id}/accept`, {}), () => 'Vorschlag übernommen.')}>Übernehmen</button>
                    <button className="btn small" onClick={() => act(() => post(`/rewrite-proposals/${p.id}/reject`, {}), () => 'Vorschlag verworfen.')}>Verwerfen</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** KI-Vorschlag: Textdiff, Sätze mit Quellen und Prüfergebnis; übernehmen nur bei bestandener Satzprüfung (ADR-013). */
export function RewriteProposal({ proposal: p, block: b, llm, onClose, onDecided }: { proposal: any; block: any; llm: any; onClose: () => void; onDecided: () => void }) {
  const { notify } = useApp();
  const seqOf = (id: string) => b.sources.find((s: any) => s.snippetId === id)?.seq;
  const decide = async (action: 'accept' | 'reject') => {
    try {
      await post(`/rewrite-proposals/${p.id}/${action}`, {});
      notify(action === 'accept' ? 'KI-Vorschlag übernommen – jeder Satz ist mit seinen Quellen verknüpft.' : 'KI-Vorschlag verworfen.');
      onDecided();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <div className="rewrite" onClick={(e) => e.stopPropagation()} aria-label="KI-Vorschlag">
      <div className="block-meta">
        <strong><Ico icon={SparklesIcon} />KI-Vorschlag</strong>
        <span className="small muted">{p.provider} · {p.model}</span>
        <span className={`tag ${p.valid ? 'st-approved' : 'sev-blocker'}`}>{p.valid ? 'jeder Satz belegt' : 'Satzprüfung nicht bestanden'}</span>
      </div>
      <Diff a={p.originalText} b={p.proposedText} />
      <ol className="rewrite-sentences small">
        {p.sentences.map((s: any, i: number) => (
          <li key={i} className={s.issues.length ? 'fail' : 'ok'}>
            {s.text}{' '}
            {s.sourceIds.map((id: string) => <span key={id} className="tag">#{seqOf(id)}</span>)}
            <span className="muted"> · Abdeckung {Math.round(s.support * 100)} %</span>
            {s.issues.map((x: string) => <div key={x} className="sev-text"><Ico icon={CircleXIcon} />{llm?.issueLabels?.[x] ?? x}</div>)}
            {s.details.map((d: string, j: number) => <div key={j} className="muted">{d}</div>)}
          </li>
        ))}
      </ol>
      <div className="row-actions">
        <button className="btn primary small" disabled={!p.valid} onClick={() => decide('accept')}>Übernehmen</button>
        <button className="btn small" onClick={() => decide('reject')}>Verwerfen</button>
        <button className="btn ghost small" onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
}
