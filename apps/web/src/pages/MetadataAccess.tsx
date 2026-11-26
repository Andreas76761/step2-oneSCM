// oneSCM_Metadaten: Zugriffsmatrix Rolle × Menüpunkt (ADR-081, F-06) und Zuordnung Domäne → Gliederungspunkt → Ordner (ADR-082).
import { CompassIcon, FolderIcon, FolderOpenIcon, FolderTreeIcon, PuzzleIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useRef, useState } from 'react';
import { post, put, qs } from '../api';
import { Gated, Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';
import { LangSwitch, nameOf, useLabelLang, useMe } from './MetadataShared';

const LEVEL_TEXT: Record<string, string> = { V: 'V – nutzt/bearbeitet', L: 'L – liest', '-': '– kein Zugriff', '?': '? offen' };

export function AccessMatrixPage() {
  const { notify } = useApp();
  const { canEdit } = useMe();
  const [lang, setLang] = useLabelLang();
  const m = useLoad<any>('/metadata/access-matrix');
  const [sel, setSel] = useState<{ roleId: string; navId: string } | null>(null);
  const [evidence, setEvidence] = useState('');
  const [csv, setCsv] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const cell = (roleId: string, navId: string) => m.data?.cells.find((c: any) => c.roleId === roleId && c.navId === navId);
  // Stufe und Beleg je Feld sofort merken und der Reihe nach speichern: sonst überschrieb „Beleg speichern“ eine gerade
  // gewählte Stufe mit dem alten Stand, solange deren Antwort noch ausstand
  const pending = useRef(new Map<string, { level: string; evidence: string | null }>());
  const queue = useRef<Promise<void>>(Promise.resolve());
  const save = (roleId: string, navId: string, change: { level?: string; evidence?: string | null }) => {
    const k = `${roleId}|${navId}`;
    const c = cell(roleId, navId);
    const next = { level: c?.level ?? '?', evidence: c?.evidence ?? null, ...pending.current.get(k), ...change };
    pending.current.set(k, next);
    const done = queue.current.then(async () => {
      try {
        m.setData(await put('/metadata/access-matrix/cells', { roleId, navId, ...next }));
        if (pending.current.get(k) === next) pending.current.delete(k);
        return true;
      } catch (e) {
        pending.current.delete(k);
        notify(errorText(e), 'error');
        return false;
      }
    });
    queue.current = done.then(() => undefined);
    return done;
  };
  const choose = (roleId: string, navId: string) => {
    setSel({ roleId, navId });
    setEvidence(cell(roleId, navId)?.evidence ?? '');
  };
  const d = m.data;
  const selRole = d?.roles.find((r: any) => r.id === sel?.roleId);
  const selNav = d?.navigation.find((n: any) => n.id === sel?.navId);
  return (
    <Page title="Zugriffsmatrix" subtitle="Welche Rolle nutzt welchen Menüpunkt in oneSCM – mit Beleg je Eintrag" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={m.error} />
      {d && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Felder</span><strong>{d.summary.cells}</strong></div>
          <div className="stat"><span className="muted small">V / L</span><strong>{d.summary.V} / {d.summary.L}</strong></div>
          <div className="stat"><span className="muted small">kein Zugriff</span><strong>{d.summary.none}</strong></div>
          <div className="stat"><span className="muted small">offen</span><strong>{d.summary.open}</strong></div>
        </div>
      )}
      <Card title="Matrix" actions={<DownloadButton href="/api/v1/metadata/access-matrix/export" name="zugriffsmatrix.csv" className="btn small">CSV exportieren</DownloadButton>}>
        <p className="small muted">V = nutzt/bearbeitet · L = liest · – = kein Zugriff · ? = offen (Beleg fehlt). {canEdit ? 'Feld anklicken, Stufe wählen, Beleg darunter eintragen.' : ''}</p>
        {!d?.navigation.length ? <Empty>Keine Menüpunkte im Labelkatalog.</Empty> : (
          <div className="am-wrap">
            <table className="table am-table">
              <thead><tr><th scope="col">Menüpunkt</th>{d.roles.map((r: any) => <th key={r.id} scope="col" className="am-role">{nameOf(r, lang)}</th>)}</tr></thead>
              <tbody>
                {d.navigation.map((n: any) => (
                  <tr key={n.id}>
                    <th scope="row" className="small">{nameOf(n, lang)}</th>
                    {d.roles.map((r: any) => {
                      const c = cell(r.id, n.id);
                      const lv = c?.level ?? '?';
                      const active = sel?.roleId === r.id && sel?.navId === n.id;
                      return (
                        <td key={r.id} className={`am-cell am-${lv === '-' ? 'none' : lv === '?' ? 'open' : lv}${active ? ' am-active' : ''}`} title={c?.evidence ? `Beleg: ${c.evidence}` : 'ohne Beleg'}>
                          {canEdit ? (
                            <select value={lv} aria-label={`${nameOf(n, lang)} – ${nameOf(r, lang)}`} onFocus={() => choose(r.id, n.id)} onChange={(e) => save(r.id, n.id, { level: e.target.value })}>
                              {Object.keys(LEVEL_TEXT).map((k) => <option key={k} value={k}>{k === '-' ? '–' : k}</option>)}
                            </select>
                          ) : <span>{lv === '-' ? '–' : lv}</span>}
                          {c?.evidence && <span className="am-dot" aria-hidden="true">•</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {canEdit && sel && selRole && selNav && (
          <div className="filters am-evidence">
            <span className="small"><strong>{nameOf(selNav, lang)}</strong> · {nameOf(selRole, lang)}: {LEVEL_TEXT[cell(sel.roleId, sel.navId)?.level ?? '?']}</span>
            <label className="grow"><span className="sr-only">Beleg</span><input value={evidence} placeholder="Beleg, z. B. Navigation_oneSCM_Version3.docx, S. 4" aria-label="Beleg für das gewählte Feld" onChange={(e) => setEvidence(e.target.value)} /></label>
            <button className="btn small primary" onClick={async () => { if (await save(sel.roleId, sel.navId, { evidence })) notify('Beleg gespeichert.'); }}>Beleg speichern</button>
          </div>
        )}
      </Card>
      {canEdit && (
        <Card title="Aus CSV übernehmen">
          <p className="small muted">Erste Spalte: Menüpunkt (Code, englischer UI-Begriff oder deutscher Name). Weitere Spalten: je Rolle (Code oder Name) V, L, – oder ?. Optional Spalte „Beleg“. Leere Felder bleiben unverändert. Trennzeichen Komma oder Semikolon.</p>
          <label className="block">CSV-Datei <input type="file" accept=".csv,text/csv" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()); }} /></label>
          <label className="block">oder Inhalt einfügen <textarea id="am-csv" rows={4} value={csv} onChange={(e) => setCsv(e.target.value)} /></label>
          <Gated className="btn primary" missing={[!csv.trim() && 'CSV-Datei oder eingefügter Inhalt']} onClick={async () => {
            try {
              const r = await post('/metadata/access-matrix/import', { csv });
              setResult(r);
              notify(`${r.written} Felder übernommen.`);
              m.reload();
            } catch (e) {
              notify(errorText(e), 'error');
            }
          }}>Übernehmen</Gated>
          {result && (
            <ul className="small">
              <li>{result.written} Felder übernommen</li>
              {result.unknownNavigation.length > 0 && <li>Unbekannte Menüpunkte: {result.unknownNavigation.join(', ')}</li>}
              {result.unknownRoles.length > 0 && <li>Unbekannte Rollen: {result.unknownRoles.join(', ')}</li>}
              {result.errors.map((x: string) => <li key={x}>{x}</li>)}
            </ul>
          )}
        </Card>
      )}
    </Page>
  );
}

// Zuordnung Domäne → Gliederungspunkt → Ordner (ADR-082)
export function DomainMapPage() {
  const { notify } = useApp();
  const { canEdit } = useMe();
  const [lang, setLang] = useLabelLang();
  const [outlineId, setOutlineId] = useState('');
  const outlines = useLoad<{ items: any[] }>('/outlines');
  const m = useLoad<any>(`/metadata/domain-map${qs({ outlineId: outlineId || undefined })}`);
  const [add, setAdd] = useState<Record<string, string>>({});
  const link = async (domainId: string, targetId: string, linked: boolean, msg: string) => {
    try {
      await put('/metadata/domain-map/links', { domainId, targetId, linked });
      notify(msg);
      m.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const d = m.data;
  const origin = (t: any) => (t.suggested ? <span className="tag sev-low" title="Chunks tragen beide Labels">Vorschlag · {t.chunks} Chunks</span>
    : <span className="tag">{t.origin === 'catalog' ? 'Katalog' : 'manuell'}{t.chunks ? ` · ${t.chunks} Chunks` : ''}</span>);
  const free = (domain: any) => [...(d?.outline ?? []), ...(d?.navigation ?? [])]
    .filter((t: any) => ![...domain.outline, ...domain.navigation].some((x: any) => x.id === t.id && x.linked));
  return (
    <Page title="Zuordnung" subtitle="Welche Fachdomäne gehört zu welchem Gliederungspunkt, Menüpunkt und Ordner im Arbeitsordner" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={m.error ?? outlines.error} />
      {d && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Domänen</span><strong>{d.summary.domains}</strong></div>
          <div className="stat"><span className="muted small">Zuordnungen</span><strong>{d.summary.links}</strong></div>
          <div className="stat"><span className="muted small">Vorschläge aus Chunks</span><strong>{d.summary.suggestions}</strong></div>
          <div className="stat"><span className="muted small">Gliederungspunkte ohne Domäne</span><strong>{d.withoutDomain.length}</strong></div>
        </div>
      )}
      <Card title="Ordnerbasis" actions={<DownloadButton href={`/api/v1/metadata/domain-map/export${qs({ outlineId: outlineId || undefined })}`} name="zuordnung-domaene-ordner.csv" className="btn small">CSV exportieren</DownloadButton>}>
        <div className="filters">
          <label>Unterordner aus Gliederung
            <select value={outlineId} onChange={(e) => setOutlineId(e.target.value)}>
              <option value="">– nur Kapitelordner –</option>
              {(outlines.data?.items ?? []).filter((o: any) => o.latest).map((o: any) => <option key={o.id} value={o.id}>{o.name} (v{o.versionNo})</option>)}
            </select>
          </label>
        </div>
        <p className="small muted">
          Kapitelordner wie im Arbeitsordner (<code>02_Kapitel/…</code>, Werkzeug <code>handbuch_struktur.py</code>). Unterordner erscheinen, wenn Sie eine Gliederung der App wählen, deren Kapitel
          die Titel der Gesamtgliederung tragen (Stammdaten › Inhaltsverzeichnis).
          {d?.subfolderSource && <> Gewählt: <strong>{d.subfolderSource.name}</strong> – {d.subfolderSource.matched} von {d.subfolderSource.chapters} Kapiteln zugeordnet.</>}
        </p>
      </Card>
      <div className="dm-grid">
        {(d?.domains ?? []).map((dom: any) => (
          <Card key={dom.id} title={<><Ico icon={PuzzleIcon} />{nameOf(dom, lang)}</>}>
            <section aria-label={`Gliederungspunkte zu ${nameOf(dom, lang)}`}>
              <h3 className="small muted">Gliederungspunkte und Ordner</h3>
              {!dom.outline.length ? <Empty>Noch kein Gliederungspunkt zugeordnet.</Empty> : (
                <ul className="dm-list">
                  {dom.outline.map((o: any) => (
                    <li key={o.id} className={o.suggested ? 'dm-suggested' : ''}>
                      <div className="dm-head"><strong>{nameOf(o, lang)}</strong> {origin(o)}
                        {canEdit && (o.suggested
                          ? <button className="btn small" onClick={() => link(dom.id, o.id, true, 'Vorschlag übernommen.')}>Übernehmen</button>
                          : <button className="btn small ghost" aria-label={`${nameOf(o, lang)} von ${nameOf(dom, lang)} lösen`} onClick={() => link(dom.id, o.id, false, 'Zuordnung entfernt.')}>Lösen</button>)}
                      </div>
                      <code className="dm-path"><Ico icon={FolderIcon} />{o.folder}</code>
                      {o.subfolders?.length ? (
                        <ul className="dm-sub small">{o.subfolders.map((s: any) => <li key={s.folder}><code><Ico icon={FolderOpenIcon} />{s.folder.split('/').pop()}</code></li>)}</ul>
                      ) : o.subfolders ? <div className="small muted">keine Unterkapitel in der gewählten Gliederung</div> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section aria-label={`Menüpunkte zu ${nameOf(dom, lang)}`}>
              <h3 className="small muted">Menüpunkte</h3>
              <div className="dm-tags">
                {dom.navigation.map((n: any) => (
                  <span key={n.id} className={`tag ${n.suggested ? 'sev-low' : ''}`} title={n.suggested ? `Vorschlag aus ${n.chunks} Chunks` : n.origin === 'catalog' ? 'Katalog' : 'manuell'}>
                    <Ico icon={CompassIcon} />{nameOf(n, lang)}
                    {canEdit && (n.suggested
                      ? <button className="dm-x" aria-label={`${nameOf(n, lang)} übernehmen`} onClick={() => link(dom.id, n.id, true, 'Vorschlag übernommen.')}>＋</button>
                      : <button className="dm-x" aria-label={`${nameOf(n, lang)} von ${nameOf(dom, lang)} lösen`} onClick={() => link(dom.id, n.id, false, 'Zuordnung entfernt.')}>×</button>)}
                  </span>
                ))}
                {!dom.navigation.length && <span className="small muted">keine</span>}
              </div>
            </section>
            {canEdit && (
              <div className="filters">
                <label className="grow"><span className="sr-only">Zuordnen</span>
                  <select value={add[dom.id] ?? ''} aria-label={`Gliederungs- oder Menüpunkt für ${nameOf(dom, lang)}`} onChange={(e) => setAdd({ ...add, [dom.id]: e.target.value })}>
                    <option value="">Gliederungs- oder Menüpunkt wählen …</option>
                    <optgroup label="Gliederung">{free(dom).filter((t: any) => t.code.startsWith('outline.')).map((t: any) => <option key={t.id} value={t.id}>{nameOf(t, lang)}</option>)}</optgroup>
                    <optgroup label="Navigation">{free(dom).filter((t: any) => t.code.startsWith('nav.')).map((t: any) => <option key={t.id} value={t.id}>{nameOf(t, lang)}</option>)}</optgroup>
                  </select>
                </label>
                <button className="btn small primary" aria-label={`Zuordnen zu ${nameOf(dom, lang)}`} disabled={!add[dom.id]} onClick={async () => { await link(dom.id, add[dom.id], true, 'Zugeordnet.'); setAdd({ ...add, [dom.id]: '' }); }}>Zuordnen</button>
              </div>
            )}
          </Card>
        ))}
      </div>
      {d && (
        <Card title="Gliederungspunkte ohne Domäne">
          <p className="small muted">Querschnittskapitel wie Einführung, Rollout oder Anhänge brauchen nicht unbedingt eine Fachdomäne.</p>
          <div className="dm-tags">
            {d.outline.filter((o: any) => d.withoutDomain.includes(o.id)).map((o: any) => <span key={o.id} className="tag" title={o.folder}><Ico icon={FolderTreeIcon} size={14} />{nameOf(o, lang)}</span>)}
          </div>
        </Card>
      )}
      {d && (
        <Card title="Ordner im Arbeitsordner">
          <div className="su-grid">
            <div>
              <h3 className="small muted">Je Kapitel (und Unterkapitel)</h3>
              <ul className="small">{d.workFolders.map((f: string) => <li key={f}><code>{f}</code></li>)}</ul>
            </div>
            <div>
              <h3 className="small muted">Hauptordner zur Steuerung</h3>
              <ul className="small">{d.controlFolders.map((f: any) => <li key={f.folder}><code>{f.folder}</code> – {f.description}</li>)}</ul>
            </div>
          </div>
        </Card>
      )}
    </Page>
  );
}
