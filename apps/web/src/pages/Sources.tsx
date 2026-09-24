import { useEffect, useState } from 'react';
import { api, get, patch, qs } from '../api';
import {
  Decision, Card, DivisionBadges, Empty, ErrorBox, Md, Modal, Page, RoleBadges, Status, TYPE_LABEL, errorText, statusLabel, useApp, useLoad,
} from '../components/ui';

export function SourcesPage() {
  const { notify } = useApp();
  const imports = useLoad<any[]>('/imports');
  const chapters = useLoad<any[]>('/chapters');
  const [busy, setBusy] = useState(false);
  const [openImport, setOpenImport] = useState<string | null>(null);
  const [filter, setFilter] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const snippets = useLoad<any>(`/snippets${qs({ ...filter, page, pageSize: 25 })}`, [filter, page]);
  const [selected, setSelected] = useState<any | null>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const imp = await api<any>('POST', '/imports', fd);
      notify(`Import „${imp.fileName}“ angenommen – Verarbeitung läuft.`);
      for (let i = 0; i < 40; i++) {
        const cur = await get<any>(`/imports/${imp.id}`);
        if (!['queued', 'processing'].includes(cur.status)) {
          notify(`Import ${statusLabel(cur.status)}: ${cur.stats.imported} importiert, ${cur.stats.identical} identisch, ${cur.stats.failed} Fehler, ${cur.stats.skipped} übersprungen`, cur.status === 'failed' ? 'error' : 'ok');
          break;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      imports.reload();
      chapters.reload();
      snippets.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  const setF = (k: string, v: string) => {
    setPage(1);
    setFilter((f) => ({ ...f, [k]: v }));
  };
  const chapter = chapters.data?.find((c) => c.id === filter.chapterId);

  return (
    <Page title="Quellen" subtitle="ZIP- und Markdown-Dateien importieren, Textabschnitte suchen und klassifizieren">
      <div className="grid2">
        <Card title="Import">
          <label
            className={`dropzone ${busy ? 'busy' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void upload(e.dataTransfer.files[0]);
            }}
          >
            <input type="file" accept=".zip,.md,.markdown" data-testid="file-input" disabled={busy} onChange={(e) => void upload(e.target.files?.[0] ?? undefined)} />
            <span>{busy ? 'Import läuft …' : 'ZIP- oder MD-Datei hierher ziehen oder auswählen'}</span>
          </label>
          <Decision id="E-01">Erlaubt sind .md, .markdown und .zip; Grenzen unter Einstellungen. Identische Dateien (gleicher Pfad, gleicher SHA-256) erzeugen keine neue Revision.</Decision>
        </Card>
        <Card title="Importprotokoll">
          <ErrorBox error={imports.error} />
          {!imports.data?.length ? <Empty>Noch keine Importe.</Empty> : (
            <table className="table compact">
              <thead><tr><th>Datei</th><th>Status</th><th>Importiert</th><th>Identisch</th><th>Fehler</th><th>Zeit</th></tr></thead>
              <tbody>
                {imports.data.map((i) => (
                  <tr key={i.id} className="clickable" onClick={() => setOpenImport(i.id)}>
                    <td>{i.fileName}</td>
                    <td><Status s={i.status} /></td>
                    <td>{i.stats.imported ?? '–'}</td>
                    <td>{i.stats.identical ?? '–'}</td>
                    <td>{i.stats.failed ?? '–'}</td>
                    <td>{new Date(i.createdAt).toLocaleString('de-DE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card title={`Textabschnitte (${snippets.data?.total ?? 0})`}>
        <div className="filters">
          <input placeholder="Suche im Text, Pfad oder #ID …" aria-label="Suche" value={filter.q ?? ''} onChange={(e) => setF('q', e.target.value)} />
          <select aria-label="Kapitel" value={filter.chapterId ?? ''} onChange={(e) => (setF('chapterId', e.target.value), setF('subchapterId', ''))}>
            <option value="">Alle Kapitel</option>
            {chapters.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <select aria-label="Unterkapitel" value={filter.subchapterId ?? ''} onChange={(e) => setF('subchapterId', e.target.value)} disabled={!chapter}>
            <option value="">Alle Unterkapitel</option>
            {chapter?.subchapters.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <RefSelect kind="roles" value={filter.role} onChange={(v) => setF('role', v)} />
          <RefSelect kind="divisions" value={filter.division} onChange={(v) => setF('division', v)} />
          <EvidenceSelect value={filter.evidenceStatus} onChange={(v) => setF('evidenceStatus', v)} />
          <FindingTypeSelect value={filter.findingType} onChange={(v) => setF('findingType', v)} />
          <MarketReleaseInputs filter={filter} setF={setF} />
          <button className="btn ghost" onClick={() => (setFilter({}), setPage(1))}>Filter zurücksetzen</button>
        </div>
        <ErrorBox error={snippets.error} />
        <table className="table">
          <thead><tr><th>ID</th><th>Textvorschau</th><th>Quelle</th><th>Kapitel / Unterkapitel</th><th>Rollen</th><th>Sparten</th><th>Evidenz</th><th>Befunde</th></tr></thead>
          <tbody>
            {snippets.data?.items.map((s: any) => (
              <tr key={s.id} className="clickable" onClick={() => setSelected(s)}>
                <td>#{s.seq}</td>
                <td className="preview">{s.text.slice(0, 140)}{s.text.length > 140 ? '…' : ''}{s.excludedReason && <div className="tag st-ignored" title={s.excludedReason}>ausgeschlossen</div>}</td>
                <td className="small">{s.source.path}<br />Rev. {s.source.revisionNo}, Z. {s.lineStart}</td>
                <td className="small">{s.chapter.title}{s.subchapter && <><br />{s.subchapter.title}</>}</td>
                <td><RoleBadges codes={s.roles} /></td>
                <td><DivisionBadges codes={s.divisions} /></td>
                <td><Status s={s.evidenceStatus} /></td>
                <td>{s.findings.filter((f: any) => ['open', 'deferred'].includes(f.status)).map((f: any) => <span key={f.id} className={`tag sev-${f.severity}`} title={TYPE_LABEL[f.type]}>#{f.seq}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pager">
          <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
          <span>Seite {page} von {Math.max(1, Math.ceil((snippets.data?.total ?? 0) / 25))}</span>
          <button className="btn ghost" disabled={page * 25 >= (snippets.data?.total ?? 0)} onClick={() => setPage(page + 1)}>›</button>
        </div>
      </Card>

      {openImport && <ImportDetail id={openImport} onClose={() => setOpenImport(null)} />}
      {selected && <SnippetDialog snippet={selected} onClose={() => setSelected(null)} onSaved={() => snippets.reload()} />}
    </Page>
  );
}

export function RefSelect({ kind, value, onChange, label }: { kind: 'roles' | 'divisions'; value?: string; onChange: (v: string) => void; label?: string }) {
  const { ref } = useApp();
  return (
    <select aria-label={label ?? (kind === 'roles' ? 'Rolle' : 'Sparte')} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{kind === 'roles' ? 'Alle Rollen' : 'Alle Sparten'}</option>
      {ref?.[kind].map((r) => <option key={r.code} value={r.code}>{r.icon} {r.label}</option>)}
    </select>
  );
}

function EvidenceSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const { ref } = useApp();
  return (
    <select aria-label="Evidenzstatus" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">Jeder Evidenzstatus</option>
      {ref?.evidenceStatuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
    </select>
  );
}

function FindingTypeSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const { ref } = useApp();
  return (
    <select aria-label="Qualitätsbefund" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">Alle (Befunde)</option>
      {ref?.findingTypes.map((s) => <option key={s} value={s}>mit offenem Befund: {TYPE_LABEL[s]}</option>)}
    </select>
  );
}

function MarketReleaseInputs({ filter, setF }: { filter: Record<string, string>; setF: (k: string, v: string) => void }) {
  const { ref } = useApp();
  return (
    <>
      <select aria-label="Markt" value={filter.market ?? ''} onChange={(e) => setF('market', e.target.value)}>
        <option value="">Alle Märkte</option>
        {ref?.markets.map((m) => <option key={m.code}>{m.code}</option>)}
      </select>
      <select aria-label="Release" value={filter.release ?? ''} onChange={(e) => setF('release', e.target.value)}>
        <option value="">Alle Releases</option>
        {ref?.releases.map((m) => <option key={m.code}>{m.code}</option>)}
      </select>
    </>
  );
}

function ImportDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, error } = useLoad<any>(`/imports/${id}`);
  return (
    <Modal title={`Import ${data?.fileName ?? ''}`} onClose={onClose} wide>
      <ErrorBox error={error} />
      {data && (
        <>
          <p className="small muted">SHA-256: <code>{data.sha256}</code> · {data.byteSize} Bytes · Status <Status s={data.status} /></p>
          <table className="table compact">
            <thead><tr><th>Pfad</th><th>Status</th><th>Meldung</th><th>SHA-256</th></tr></thead>
            <tbody>
              {data.items.map((i: any) => (
                <tr key={i.id}><td>{i.path}</td><td><Status s={i.status} /></td><td>{i.message}</td><td className="mono small">{i.sha256?.slice(0, 16)}…</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Modal>
  );
}

export function SourceViewer({ revisionId, lineStart, lineEnd, onClose }: { revisionId: string; lineStart?: number; lineEnd?: number; onClose: () => void }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    get<string>(`/source-revisions/${revisionId}/raw`).then(setText).catch((e) => setText(`Fehler: ${errorText(e)}`));
  }, [revisionId]);
  return (
    <Modal title="Quelle (unveränderter Ursprungstext)" onClose={onClose} wide>
      <pre className="source">
        {(text ?? 'Lade …').split('\n').map((l, i) => (
          <div key={i} className={lineStart && i + 1 >= lineStart && i + 1 <= (lineEnd ?? lineStart) ? 'hl' : ''}>
            <span className="ln">{i + 1}</span>{l}
          </div>
        ))}
      </pre>
    </Modal>
  );
}

function SnippetDialog({ snippet, onClose, onSaved }: { snippet: any; onClose: () => void; onSaved: () => void }) {
  const { ref, notify } = useApp();
  const [s, setS] = useState(snippet);
  const [roles, setRoles] = useState<string[]>(snippet.roles.map((r: any) => r.code));
  const [divs, setDivs] = useState<string[]>(snippet.divisions.map((r: any) => r.code));
  const [evidence, setEvidence] = useState(snippet.evidenceStatus);
  const [market, setMarket] = useState(snippet.market ?? '');
  const [release, setRelease] = useState(snippet.release ?? '');
  const [showSource, setShowSource] = useState(false);
  const toggle = (list: string[], set: (v: string[]) => void, code: string) => set(list.includes(code) ? list.filter((c) => c !== code) : [...list, code]);

  const save = async () => {
    try {
      const updated = await patch(`/snippets/${s.id}`, { roles, divisions: divs, evidenceStatus: evidence, market: market || null, release: release || null });
      setS(updated);
      notify(`Textabschnitt #${s.seq} gespeichert (manuell bestätigt).`);
      onSaved();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Modal title={`Textabschnitt #${s.seq}`} onClose={onClose} wide>
      <div className="grid2">
        <div>
          <h3>Vorschau</h3>
          <Md text={s.text} />
          <h3>Ursprungstext (unveränderlich)</h3>
          <pre className="source small">{s.text}</pre>
        </div>
        <div>
          <dl className="meta">
            <dt>Quelle</dt><dd>{s.source.path} (Rev. {s.source.revisionNo}{s.source.isCurrent ? '' : ', veraltet'}) <button className="btn link" onClick={() => setShowSource(true)}>Quelle öffnen</button></dd>
            <dt>Position</dt><dd>Zeile {s.lineStart}–{s.lineEnd}</dd>
            <dt>Kapitel</dt><dd>{s.chapter.title}</dd>
            <dt>Unterkapitel</dt><dd>{s.subchapter?.title ?? '–'}{s.headingPath.length ? ` › ${s.headingPath.join(' › ')}` : ''}</dd>
            <dt>Text-ID / Hash</dt><dd>#{s.seq} · <span className="mono small">{s.textHash.slice(0, 12)}…</span></dd>
            {s.excludedReason && (<><dt>Ausgeschlossen</dt><dd>{s.excludedReason}</dd></>)}
          </dl>
          <h3>Automatische Zuordnung</h3>
          <table className="table compact">
            <thead><tr><th>Wert</th><th>Score</th><th>Methode</th><th>Modell</th><th>Evidenz</th></tr></thead>
            <tbody>
              {[...s.roles, ...s.divisions].map((a: any, i: number) => (
                <tr key={i}><td>{ref?.roles.find((r) => r.code === a.code)?.label ?? ref?.divisions.find((r) => r.code === a.code)?.label}</td><td>{a.score.toFixed(2)}</td><td>{a.method}</td><td>{a.modelVersion}</td><td><Status s={a.evidenceStatus} /></td></tr>
              ))}
            </tbody>
          </table>
          <h3>Klassifikation bestätigen / ändern</h3>
          <fieldset className="checks">
            <legend>Fachliche Rollen (Mehrfachauswahl)</legend>
            {ref?.roles.map((r) => (
              <label key={r.code}><input type="checkbox" checked={roles.includes(r.code)} onChange={() => toggle(roles, setRoles, r.code)} /> {r.icon} {r.label}</label>
            ))}
          </fieldset>
          <fieldset className="checks">
            <legend>Sparten (Mehrfachauswahl)</legend>
            {ref?.divisions.map((r) => (
              <label key={r.code}><input type="checkbox" checked={divs.includes(r.code)} onChange={() => toggle(divs, setDivs, r.code)} /> {r.icon} {r.label}</label>
            ))}
          </fieldset>
          <div className="form-row">
            <label>Evidenzstatus
              <select value={evidence} onChange={(e) => setEvidence(e.target.value)}>
                {ref?.evidenceStatuses.map((x) => <option key={x} value={x}>{statusLabel(x)}</option>)}
              </select>
            </label>
            <label>Markt <input value={market} onChange={(e) => setMarket(e.target.value.toUpperCase())} placeholder="z. B. DE" /></label>
            <label>Release <input value={release} onChange={(e) => setRelease(e.target.value)} placeholder="z. B. 2026.3" /></label>
          </div>
          <button className="btn primary" onClick={save}>Speichern (manuell bestätigt)</button>
        </div>
      </div>
      {showSource && <SourceViewer revisionId={s.source.revisionId} lineStart={s.lineStart} lineEnd={s.lineEnd} onClose={() => setShowSource(false)} />}
    </Modal>
  );
}
