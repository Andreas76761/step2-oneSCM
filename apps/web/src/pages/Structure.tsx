import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patch, post } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Kapitelsteuerung (ADR-096): Kapitelanweisung je Kapitel und Unterkapitel, fehlende Kapitel ergänzen, Version
// („gültig ab“), veraltete Funktionen ablösen – das Abgelöste kommt in die Historie

const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
type Sel = { kind: 'chapter' | 'subchapter'; id: string } | null;

function usePerms() {
  const me = useLoad<{ permissions: string[] }>('/me');
  const p = me.data?.permissions ?? [];
  return { canEdit: p.some((x) => x === 'edit' || x === 'admin'), isAdmin: p.includes('admin') };
}

export function StructurePage() {
  const { notify } = useApp();
  const { canEdit, isAdmin } = usePerms();
  const [showHistory, setShowHistory] = useState(false);
  // Handbuch-Varianten (ADR-097, W-01): eigene Anweisung je Variantenkapitel zusätzlich zur Anweisung der Quellkapitel
  const outlines = useLoad<{ items: any[] }>('/structure/outlines');
  const [outline, setOutline] = useState('');
  const query = [showHistory && !outline ? 'history=true' : '', outline ? `outline=${encodeURIComponent(outline)}` : ''].filter(Boolean).join('&');
  const st = useLoad<any>(`/structure${query ? `?${query}` : ''}`, [query]);
  const hist = useLoad<{ items: any[] }>('/structure/history');
  const [sel, setSel] = useState<Sel>(null);
  const [newCh, setNewCh] = useState({ title: '', afterId: '', validFrom: '' });
  const reload = () => {
    st.reload();
    hist.reload();
  };
  const chapters: any[] = st.data?.chapters ?? [];
  const selChapter = sel?.kind === 'chapter' ? chapters.find((c) => c.id === sel.id) : chapters.find((c) => c.subchapters.some((s: any) => s.id === sel?.id));
  const item = sel?.kind === 'chapter' ? selChapter : selChapter?.subchapters.find((s: any) => s.id === sel?.id);
  const addChapter = async () => {
    try {
      const c = await post('/structure/chapters', { title: newCh.title, afterId: newCh.afterId || undefined, validFrom: newCh.validFrom || null });
      notify(`Kapitel „${c.title}“ ergänzt.`);
      setNewCh({ title: '', afterId: '', validFrom: '' });
      reload();
      setSel({ kind: 'chapter', id: c.id });
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const restore = async (h: any) => {
    try {
      await post(`/structure/history/${h.id}/restore`, {});
      notify(`„${h.title}“ aus der Historie zurückgeholt.`);
      reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const s = st.data?.summary;
  return (
    <Page title="Kapitelsteuerung" subtitle="Je Kapitel und Unterkapitel eine kurze Anweisung: worauf es ankommt, welche Themen wichtig sind und was nicht beschrieben wird – sie gilt mit Vorrang für Generator, KI-Vorschläge und Agenten"
      actions={<DownloadButton className="btn small" href="/api/v1/structure/instructions/export" name="anweisungen.json">⬇ Anweisungen (JSON)</DownloadButton>}>
      <ErrorBox error={st.error ?? hist.error} />
      {s && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Kapitel</span><strong>{s.chapters}</strong></div>
          <div className="stat"><span className="muted small">Unterkapitel</span><strong>{s.subchapters}</strong></div>
          <div className="stat"><span className="muted small">mit Anweisung</span><strong>{s.withInstruction}</strong></div>
          <div className="stat"><span className="muted small">in der Historie</span><strong>{hist.data?.items.length ?? 0}</strong></div>
        </div>
      )}
      <div className="grid2">
        <Card title="Kapitel und Unterkapitel" actions={<span className="row-actions">
          {(outlines.data?.items ?? []).some((o) => o.chapters) && (
            <label className="inline small">Gliederung
              <select value={outline} onChange={(e) => { setOutline(e.target.value); setSel(null); }}>
                <option value="">Quellen (Gesamtgliederung)</option>
                {(outlines.data?.items ?? []).filter((o) => o.chapters).map((o) => <option key={o.familyId} value={o.familyId}>Variante: {o.name}</option>)}
              </select>
            </label>
          )}
          {!outline && <label className="inline small"><input type="checkbox" checked={showHistory} onChange={(e) => setShowHistory(e.target.checked)} /> Historie einblenden</label>}
        </span>}>
          {outline && <p className="small muted">Kapitel der Handbuch-Variante: Ihre Anweisung gilt zusätzlich zur Anweisung der Quellkapitel, aus denen die Absätze stammen. Kapitel ergänzen Sie in der Gliederung (Stammdaten › Inhaltsverzeichnis).</p>}
          {!chapters.length ? <Empty>Noch keine Kapitel. Kapitel entstehen beim Einlesen oder hier unten.</Empty> : (
            <ul className="st-tree" aria-label="Kapitel">
              {chapters.map((c) => (
                <li key={c.id}>
                  <button type="button" className="btn link" aria-current={sel?.id === c.id ? true : undefined} onClick={() => setSel({ kind: 'chapter', id: c.id })}>{c.title}</button>
                  <Meta x={c} />
                  {c.subchapters.length > 0 && (
                    <ul>
                      {c.subchapters.map((u: any) => (
                        <li key={u.id}>
                          <button type="button" className="btn link" aria-current={sel?.id === u.id ? true : undefined} onClick={() => setSel({ kind: 'subchapter', id: u.id })}>{u.title}</button>
                          {u.isNew && <span className="tag small" title="von TRIAGE angelegt – noch nicht bestätigt">neu</span>}
                          <Meta x={u} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          {canEdit && !outline && (
            <fieldset className="st-add">
              <legend>Fehlendes Kapitel ergänzen</legend>
              <div className="filters">
                <label className="grow">Titel des Kapitels <input value={newCh.title} maxLength={160} placeholder="z. B. 7. Vertrag kündigen" onChange={(e) => setNewCh({ ...newCh, title: e.target.value })} /></label>
                <label>Einordnen nach
                  <select value={newCh.afterId} onChange={(e) => setNewCh({ ...newCh, afterId: e.target.value })}>
                    <option value="">{/^\s*\d+\./.test(newCh.title) ? 'nach Nummer im Titel' : 'am Ende'}</option>
                    {chapters.filter((c) => !c.inHistory).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </label>
                <label>Gültig ab (neues Kapitel) <input value={newCh.validFrom} size={10} maxLength={40} placeholder="2026.3" onChange={(e) => setNewCh({ ...newCh, validFrom: e.target.value })} /></label>
                <button type="button" className="btn primary" disabled={newCh.title.trim().length < 3} onClick={addChapter}>Kapitel ergänzen</button>
              </div>
              <p className="small muted">Eingelesene Quellen mit derselben Kapitelüberschrift werden diesem Kapitel zugeordnet.</p>
            </fieldset>
          )}
        </Card>
        <div>
          {item ? <Editor key={item.id} kind={sel!.kind} item={item} chapter={selChapter} chapters={chapters} canEdit={canEdit} variant={!!outline} onChange={reload} />
            : <Card title="Anweisung"><Empty>Wählen Sie links ein Kapitel oder Unterkapitel.</Empty></Card>}
          <LabelVersions isAdmin={isAdmin} onChange={reload} />
        </div>
      </div>
      <Card title="Historie: abgelöste Funktionen">
        {!hist.data?.items.length ? <Empty>Noch nichts abgelöst. Abgelöste Kapitel, Unterkapitel und Labels erscheinen hier und im Handbuch im Anhang „Historie“.</Empty> : (
          <table className="table compact">
            <thead><tr><th>Art</th><th>Funktion</th><th>gültig</th><th>ersetzt durch</th><th>Hinweis</th><th>abgelöst</th><th /></tr></thead>
            <tbody>
              {hist.data.items.map((h) => (
                <tr key={h.id}>
                  <td>{h.kindLabel}</td>
                  <td>{h.kind === 'subchapter' && h.parentTitle ? `${h.parentTitle} › ` : ''}{h.title}</td>
                  <td>{h.validFrom ? `${h.validFrom} – ` : 'bis '}{h.validUntil ?? h.createdAt.slice(0, 10)}</td>
                  <td>{h.replacedBy?.title ?? '–'}{Object.entries(h.moved ?? {}).some(([, n]) => Number(n) > 0) && <span className="small muted"> ({Object.entries(h.moved).map(([k, n]) => `${n} ${k === 'chunks' ? 'Chunks' : k === 'qa' ? 'F&A' : 'Bilder'}`).join(', ')} übertragen)</span>}</td>
                  <td>{h.note ?? ''}</td>
                  <td className="small">{new Date(h.createdAt).toLocaleDateString('de-DE')} · {h.createdBy}</td>
                  <td>{canEdit && (h.kind !== 'label' || isAdmin) && <button type="button" className="btn small ghost" onClick={() => void restore(h)}>Zurückholen</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Page>
  );
}

function Meta({ x }: { x: any }) {
  const has = x.instruction.text || x.instruction.topics.length || x.instruction.excluded.length;
  return (
    <span className="small">
      {x.validFrom && <span className="tag">ab {x.validFrom}</span>}
      {has ? <span className="tag">Anweisung</span> : null}
      {x.inHistory && <span className="tag sev-medium">Historie{x.validUntil ? ` · bis ${x.validUntil}` : ''}</span>}
      {x.pipeline > 0 && <Link to="/pipeline" className="tag" title="Tickets in Bearbeitung zu diesem Kapitel – noch nicht produktiv">Pipeline: {x.pipeline}</Link>}
    </span>
  );
}

function Editor({ kind, item, chapter, chapters, canEdit, variant, onChange }: { kind: 'chapter' | 'subchapter'; item: any; chapter: any; chapters: any[]; canEdit: boolean; variant?: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const [f, setF] = useState({ title: item.title, validFrom: item.validFrom ?? '', text: item.instruction.text ?? '', topics: item.instruction.topics.join('\n'), excluded: item.instruction.excluded.join('\n') });
  const [levels, setLevels] = useState<string[]>(item.detailLevels ?? []);
  useEffect(() => setLevels(item.detailLevels ?? []), [item.id, item.detailLevels]);
  const [sub, setSub] = useState('');
  const [rep, setRep] = useState({ mode: 'new', newTitle: '', replacementId: '', validFrom: '', note: '' });
  useEffect(() => setRep((r) => ({ ...r, newTitle: '', replacementId: '' })), [item.id]);
  const base = kind === 'chapter' ? `/structure/chapters/${item.id}` : `/structure/subchapters/${item.id}`;
  const save = async () => {
    try {
      await patch(base, { title: f.title, validFrom: f.validFrom || null, instruction: f.text || null, topics: lines(f.topics), excluded: lines(f.excluded), ...(kind === 'chapter' && levels.length && [...levels].sort().join() !== [...(item.detailLevels ?? [])].sort().join() ? { detailLevels: levels } : {}) });
      notify('Anweisung gespeichert.');
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const confirmNew = async () => {
    try {
      await post(`/triage/new-subchapters/${item.id}/confirm`, {});
      notify(`Unterkapitel „${item.title}“ in die Gliederung aufgenommen.`);
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const addSub = async () => {
    try {
      await post(`/structure/chapters/${item.id}/subchapters`, { title: sub });
      notify(`Unterkapitel „${sub}“ ergänzt.`);
      setSub('');
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const replace = async () => {
    try {
      const r = await post('/structure/replace', { kind, id: item.id, validFrom: rep.validFrom || null, note: rep.note || null, ...(rep.mode === 'new' ? { newTitle: rep.newTitle } : { replacementId: rep.replacementId }) });
      notify(`„${item.title}“ in die Historie gelegt – ersetzt durch „${r.successor.title}“.`);
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const candidates = kind === 'chapter' ? chapters.filter((c) => c.id !== item.id && !c.inHistory) : (chapter?.subchapters ?? []).filter((s: any) => s.id !== item.id && !s.inHistory);
  const what = kind === 'chapter' ? 'Kapitel' : 'Unterkapitel';
  return (
    <Card title={<>{what}: {item.title}</>} actions={kind === 'chapter' && <Link className="btn small" to={`/werkstatt/${item.id}`}>Zur Werkstatt</Link>}>
      {item.inHistory && <p className="small sev-medium">In der Historie{item.validUntil ? ` (gültig bis ${item.validUntil})` : ''} – nicht mehr im Handbuch.</p>}
      {kind === 'subchapter' && <p className="small muted">Gilt zusätzlich zur Anweisung des Kapitels „{chapter?.title}“.</p>}
      {kind === 'subchapter' && item.isNew && (
        <div className="alert warning" role="status">
          Von TRIAGE angelegt (Kennung „neu“) – bitte prüfen, umbenennen oder ablösen. {canEdit && <button type="button" className="btn small" onClick={confirmNew}>In die Gliederung aufnehmen</button>}
        </div>
      )}
      <fieldset disabled={!canEdit} aria-label="Anweisung bearbeiten">
        <div className="filters">
          <label className="grow">Titel <input value={f.title} maxLength={160} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
          <label>Gültig ab (Version, Release) <input value={f.validFrom} size={10} maxLength={40} placeholder="2026.3" onChange={(e) => setF({ ...f, validFrom: e.target.value })} /></label>
        </div>
        <label className="block">Worauf es ankommt (kurze Anleitung)
          <textarea rows={3} maxLength={2000} value={f.text} placeholder="z. B. Nur die Sicht des Händlers; jeder Schritt mit Menüpfad." onChange={(e) => setF({ ...f, text: e.target.value })} />
        </label>
        <div className="grid2 tight">
          <label className="block">Wichtige Themen (je Zeile eines – müssen vorkommen)
            <textarea rows={4} value={f.topics} placeholder={'Kündigungsgrund\nKündigungsfrist'} onChange={(e) => setF({ ...f, topics: e.target.value })} />
          </label>
          <label className="block">Nicht beschreiben (je Zeile eines)
            <textarea rows={4} value={f.excluded} placeholder={'Storno\nInterne Abrechnung'} onChange={(e) => setF({ ...f, excluded: e.target.value })} />
          </label>
        </div>
        {kind === 'chapter' && (
          <fieldset className="st-detail">
            <legend>Detaillierung – welche Detaillevel der Generator übernimmt{item.detailLevelsCustom ? '' : ' (Standard)'}</legend>
            {DETAIL_LEVELS.map(([code, name, hint]) => (
              <label key={code} className="inline small" title={hint}>
                <input type="checkbox" checked={levels.includes(code)} onChange={(e) => setLevels(e.target.checked ? [...levels, code] : levels.filter((x) => x !== code))} /> {name}
              </label>
            ))}
            <p className="small muted">HappyPath zeigt den Standardablauf, Edge die Ausnahmen (Abschnitt „Fehlerbehebung“); Intern und inPrüfung sind im Standard ausgeschlossen.</p>
          </fieldset>
        )}
        {canEdit && <button type="button" className="btn primary" disabled={kind === 'chapter' && !levels.length} onClick={save}>Anweisung speichern</button>}
      </fieldset>
      <p className="small muted">Der Generator lässt Quellen zu „Nicht beschreiben“ weg und meldet wichtige Themen ohne Quelle als Lücke; KI-Vorschläge und der Anleitungs-Check beachten die Anweisung. Im Arbeitsordner steht sie als <code>ANWEISUNG.md</code>.</p>
      {canEdit && kind === 'chapter' && !item.inHistory && !variant && (
        <div className="filters">
          <label className="grow">Fehlendes Unterkapitel <input value={sub} maxLength={160} placeholder="z. B. 7.2 Kündigung prüfen" onChange={(e) => setSub(e.target.value)} /></label>
          <button type="button" className="btn" disabled={sub.trim().length < 3} onClick={addSub}>Unterkapitel ergänzen</button>
        </div>
      )}
      {canEdit && !item.inHistory && !variant && (
        <fieldset className="st-replace">
          <legend>Veraltete Funktion ablösen</legend>
          <p className="small muted">Das {what} gilt dann bis zur Version des Nachfolgers, kommt in die Historie und erscheint nicht mehr im Handbuch – dort steht es im Anhang „Historie“.</p>
          <div className="filters">
            <label className="small"><input type="radio" name="rep-mode" checked={rep.mode === 'new'} onChange={() => setRep({ ...rep, mode: 'new' })} /> neuer Nachfolger</label>
            <label className="small"><input type="radio" name="rep-mode" checked={rep.mode === 'existing'} onChange={() => setRep({ ...rep, mode: 'existing' })} /> vorhandener Nachfolger</label>
          </div>
          <div className="filters">
            {rep.mode === 'new'
              ? <label className="grow">Titel des Nachfolgers <input value={rep.newTitle} maxLength={160} onChange={(e) => setRep({ ...rep, newTitle: e.target.value })} /></label>
              : <label className="grow">Nachfolger
                  <select value={rep.replacementId} onChange={(e) => setRep({ ...rep, replacementId: e.target.value })}>
                    <option value="">– wählen –</option>
                    {candidates.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </label>}
            <label>Nachfolger gültig ab <input value={rep.validFrom} size={10} maxLength={40} placeholder="2026.3" onChange={(e) => setRep({ ...rep, validFrom: e.target.value })} /></label>
            <label className="grow">Hinweis <input value={rep.note} maxLength={500} placeholder="z. B. Menüpunkt umbenannt" onChange={(e) => setRep({ ...rep, note: e.target.value })} /></label>
          </div>
          <button type="button" className="btn" disabled={rep.mode === 'new' ? rep.newTitle.trim().length < 3 : !rep.replacementId} onClick={replace}>Ablösen und in die Historie legen</button>
        </fieldset>
      )}
    </Card>
  );
}

const DETAIL_LEVELS: [string, string, string][] = [
  ['basis', 'Basis', 'Grundlagen: was die Funktion ist'], ['basis-plus', 'Basis+', 'Grundlagen mit Erläuterung'], ['zusatz', 'Zusatz', 'Tipps und Zusatzwissen'],
  ['intern', 'Intern', 'interne Inhalte – nie im Handbuch-Standard'], ['happy-path', 'HappyPath', 'Standardablauf Schritt für Schritt'], ['edge', 'Edge', 'Ausnahmen und Fehlermeldungen'],
  ['in-review', 'inPrüfung', 'noch nicht bestätigt'],
];

const GROUP_LABEL: Record<string, string> = { outline: 'Gliederung', role: 'Rolle', navigation: 'Navigation', domain: 'Domäne', content: 'Inhalt', division: 'Sparte', customer: 'Kunde', system: 'System', quality: 'Qualität' };

/** Version je Label und Ablösen veralteter Labels (Administration) */
function LabelVersions({ isAdmin, onChange }: { isAdmin: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const labels = useLoad<any[]>('/metadata/labels');
  const [id, setId] = useState('');
  const [v, setV] = useState({ validFrom: '', newTitle: '', replacementId: '', successorFrom: '', note: '', move: true });
  const l = labels.data?.find((x) => x.id === id);
  useEffect(() => setV((x) => ({ ...x, validFrom: l?.validFrom ?? '' })), [l?.id, l?.validFrom]);
  if (!isAdmin) return null;
  const saveVersion = async () => {
    try {
      await patch(`/metadata/labels/${id}`, { validFrom: v.validFrom || null });
      notify('Version des Labels gespeichert.');
      labels.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const replace = async () => {
    try {
      const r = await post('/structure/replace', { kind: 'label', id, newTitle: v.replacementId ? undefined : v.newTitle, replacementId: v.replacementId || undefined, validFrom: v.successorFrom || null, note: v.note || null, moveAssignments: v.move });
      notify(`Label „${l.nameDe}“ abgelöst durch „${r.successor.title}“.`);
      setId('');
      labels.reload();
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title="Labels: Version und Ablösen">
      <ErrorBox error={labels.error} />
      <label className="block">Label
        <select value={id} onChange={(e) => setId(e.target.value)}>
          <option value="">– wählen –</option>
          {(labels.data ?? []).map((x) => <option key={x.id} value={x.id}>{GROUP_LABEL[x.group] ?? x.group}: {x.nameDe}{x.validFrom ? ` (ab ${x.validFrom})` : ''}</option>)}
        </select>
      </label>
      {l && (
        <>
          <div className="filters">
            <label>Gültig ab <input value={v.validFrom} size={10} maxLength={40} placeholder="2026.3" onChange={(e) => setV({ ...v, validFrom: e.target.value })} /></label>
            <button type="button" className="btn small" onClick={saveVersion}>Version speichern</button>
          </div>
          <fieldset>
            <legend className="small">Label ablösen</legend>
            <div className="filters">
              <label className="grow">Neues Label (Name) <input value={v.newTitle} maxLength={120} disabled={!!v.replacementId} onChange={(e) => setV({ ...v, newTitle: e.target.value })} /></label>
              <label className="grow">oder vorhandenes Label
                <select value={v.replacementId} onChange={(e) => setV({ ...v, replacementId: e.target.value })}>
                  <option value="">–</option>
                  {(labels.data ?? []).filter((x) => x.group === l.group && x.id !== l.id).map((x) => <option key={x.id} value={x.id}>{x.nameDe}</option>)}
                </select>
              </label>
            </div>
            <div className="filters">
              <label>Nachfolger gültig ab <input value={v.successorFrom} size={10} maxLength={40} placeholder="2026.3" onChange={(e) => setV({ ...v, successorFrom: e.target.value })} /></label>
              <label className="grow">Hinweis <input value={v.note} maxLength={500} onChange={(e) => setV({ ...v, note: e.target.value })} /></label>
              <label className="small"><input type="checkbox" checked={v.move} onChange={(e) => setV({ ...v, move: e.target.checked })} /> Chunks, Fragen & Antworten und Bilder übertragen</label>
            </div>
            <button type="button" className="btn" disabled={!v.replacementId && v.newTitle.trim().length < 2} onClick={replace}>Label ablösen</button>
          </fieldset>
        </>
      )}
    </Card>
  );
}
