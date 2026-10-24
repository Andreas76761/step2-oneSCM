import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { del, patch, post, put, qs } from '../api';
import { Card, DownloadButton, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

// Release-Abgleich und Releaseletter aus Jira-Tickets (ADR-083, F-02, F-03)

const SEV: Record<string, { label: string; cls: string }> = {
  fail: { label: 'Kritisch', cls: 'sev-high' }, warn: { label: 'Warnung', cls: 'sev-medium' }, hint: { label: 'Hinweis', cls: 'sev-low' },
};
const VERDICT_CLS: Record<string, string> = { block: 'sev-high', cond: 'sev-medium', ok: 'sev-low' };
const AUDIENCES = [['biz', 'Fachbereich'], ['it', 'IT und Entwicklung'], ['mgmt', 'Management (Kurzfassung)'], ['end', 'Endanwender']];
const DIVISIONS = [['all', 'Pkw und Van'], ['car', 'Pkw'], ['van', 'Van']];

function usePermissions() {
  const me = useLoad<{ permissions: string[] }>('/me');
  const p = me.data?.permissions ?? [];
  return { canEdit: p.includes('edit') || p.includes('admin'), canApprove: p.includes('approve') || p.includes('admin'), canDecide: p.includes('decide') || p.includes('admin') };
}

const CLASS_CLS: Record<string, string> = { approved: 'st-approved', review: '', internal: 'sev-low', background: 'sev-low' };

/** Ticket-Einstufung (ADR-102, W-03): Auswahl für Personen mit Entscheidungsrecht, sonst Anzeige */
function TicketClass({ t, labels, hints, canDecide, onChanged }: { t: any; labels: Record<string, string>; hints: Record<string, string>; canDecide: boolean; onChanged: () => void }) {
  const { notify } = useApp();
  if (!canDecide) return <span className={`tag ${CLASS_CLS[t.classification]}`} title={hints[t.classification]}>{t.classificationLabel}{t.classificationOrigin === 'derived' ? ' (abgeleitet)' : ''}</span>;
  return (
    <select aria-label={`Einstufung ${t.key}`} value={t.classificationOrigin === 'manual' ? t.classification : ''} title={t.classificationNote ?? hints[t.classification]} onChange={async (e) => {
      try {
        await put('/ticket-classifications', { keys: [t.key], classification: e.target.value || null });
        notify(`${t.key}: ${e.target.value ? labels[e.target.value] : 'Einstufung wieder abgeleitet'}.`);
        onChanged();
      } catch (err) {
        notify(errorText(err), 'error');
      }
    }}>
      <option value="">abgeleitet: {labels[t.classificationOrigin === 'manual' ? (t.manualClass === 'internal' ? 'internal' : 'review') : t.classification]}</option>
      {Object.entries(labels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}

export function TicketReleasesPage() {
  const { notify } = useApp();
  const { canDecide } = usePermissions();
  const [release, setRelease] = useState('');
  const data = useLoad<any>(`/ticket-releases${qs({ release: release || undefined })}`);
  const [keys, setKeys] = useState('');
  const [match, setMatch] = useState<any | null>(null);
  const d = data.data;
  const all = d?.releases ?? [];
  const sum = (k: string) => all.reduce((n: number, r: any) => n + r[k], 0);
  return (
    <Page title="Release-Abgleich" subtitle="Jira-Tickets je Release: Handbuch-Kandidat oder intern, Status, Änderungen seit dem letzten Import und Bezug zum Handbuch">
      <ErrorBox error={data.error} />
      {d && (
        <div className="stat-row">
          <div className="stat"><span className="muted small">Tickets</span><strong>{sum('tickets')}</strong></div>
          <div className="stat"><span className="muted small">Handbuch-Kandidaten</span><strong>{sum('manual')}</strong></div>
          <div className="stat"><span className="muted small">Intern / Bug</span><strong>{sum('internal')}</strong></div>
          <div className="stat"><span className="muted small">Ohne Kapitel im Handbuch</span><strong>{sum('gaps')}</strong></div>
        </div>
      )}
      <Card title="Releases">
        <p className="small muted">Release = Lösungsversion des Tickets, ohne Angabe „PI TBD“. Tickets vom Typ Bug gelten als intern, alle anderen als Kandidat für das Benutzerhandbuch. Ticket- und Teststatus sind kein Nachweis für den Produktivstand.</p>
        <p className="small muted">Einstufung: <strong>genehmigt</strong> und <strong>in Prüfung</strong> fließen ins Handbuch, <strong>intern</strong> und <strong>Background</strong> nicht; Background zählt nur in der Lückenanalyse und erscheint in keinem Releaseletter. Ohne Einstufung gilt: Bug = intern, sonst „in Prüfung“.</p>
        {!all.length ? <Empty>Keine Jira-Tickets eingelesen. Laden Sie einen Jira-Export (XML oder CSV) unter <Link to="/quellen">Quellen</Link> hoch.</Empty> : (
          <table className="table">
            <thead><tr><th>Release</th><th>Tickets</th><th>Kandidaten</th><th>Intern</th><th>Erledigt</th><th>Ohne Kapitel</th><th>Geändert</th><th /></tr></thead>
            <tbody>
              {all.map((r: any) => (
                <tr key={r.label} className={release === r.label ? 'selected' : ''}>
                  <th scope="row"><button className="linklike" aria-pressed={release === r.label} onClick={() => setRelease(release === r.label ? '' : r.label)}>{r.label}</button></th>
                  <td>{r.tickets}</td><td>{r.manual}</td><td>{r.internal}</td><td>{r.done}</td>
                  <td>{r.gaps ? <span className="tag sev-medium">{r.gaps}</span> : 0}</td><td>{r.changed}</td>
                  <td className="row-actions"><Link className="btn small" to={`/releaseletter?release=${encodeURIComponent(r.label)}`}>Releaseletter</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {!!d?.tickets.length && (
        <Card title={release ? `Tickets in ${release}` : 'Alle Tickets'} actions={release ? <button className="btn small ghost" onClick={() => setRelease('')}>Alle zeigen</button> : null}>
          <div className="am-wrap">
            <table className="table">
              <thead><tr><th>Ticket</th><th>Zusammenfassung</th><th>Typ</th><th>Status</th><th>Einordnung</th><th>Einstufung</th><th>Handbuch</th><th>Seit letztem Import</th></tr></thead>
              <tbody>
                {d.tickets.map((t: any) => (
                  <tr key={t.key}>
                    <th scope="row" className="small">{t.key}</th>
                    <td className="small">{t.summary}</td>
                    <td className="small">{t.type || '–'}</td>
                    <td className="small">{t.status || '–'} <span className="muted">({t.statusLabel})</span></td>
                    <td><span className={`tag ${t.manualClass === 'manual' ? '' : 'sev-low'}`}>{t.manualClassLabel}</span></td>
                    <td><TicketClass t={t} labels={d.ticketClassLabels} hints={d.ticketClassHints} canDecide={canDecide} onChanged={() => data.reload()} /></td>
                    <td className="small">{t.chapters.length ? t.chapters.join(', ') : t.gap ? <span className="tag sev-medium">fehlt</span> : '–'}</td>
                    <td className="small">{t.isNew ? 'neu' : t.changes.length ? t.changes.map((c: any) => `${c.field}: ${c.before || '–'} → ${c.after || '–'}`).join('; ') : 'unverändert'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Card title="Ticketliste eines Releases abgleichen">
        <label className="block">Ticketnummern (eine je Zeile oder durch Komma getrennt)
          <textarea id="rl-keys" rows={4} value={keys} onChange={(e) => setKeys(e.target.value)} />
        </label>
        <button className="btn primary" disabled={!keys.trim()} onClick={async () => {
          try {
            setMatch(await post('/ticket-releases/match', { keys }));
          } catch (e) {
            notify(errorText(e), 'error');
          }
        }}>Abgleichen</button>
        {match && (
          <p className="small" role="status">
            {match.loaded.length} von {match.total} Tickets sind eingelesen.{match.missing.length ? <> Es fehlen: <strong>{match.missing.join(', ')}</strong> – diese Tickets im Jira-Export ergänzen.</> : ' Alle Tickets der Liste liegen vor.'}
          </p>
        )}
      </Card>
    </Page>
  );
}

function LetterDetail({ id, onChange, onOpen }: { id: string; onChange: () => void; onOpen: (id: string) => void }) {
  const { notify } = useApp();
  const { canEdit, canApprove } = usePermissions();
  const l = useLoad<any>(`/release-letters/${id}`, [id]);
  const [text, setText] = useState('');
  const [reason, setReason] = useState('');
  useEffect(() => setText(l.data?.text ?? ''), [l.data?.text]);
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      l.reload();
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const x = l.data;
  if (!x) return <ErrorBox error={l.error} />;
  const c = x.check;
  const draft = x.status === 'draft';
  return (
    <Card title={<>{x.title} <span className="muted small">{x.release} · {x.language.toUpperCase()} · {x.audienceLabel} · {x.origin === 'external' ? 'eingefügt' : x.origin === 'translated' ? 'übersetzt' : x.origin === 'comparison' ? `aus Projektvergleich ${x.comparison?.fromVersion ?? '–'} → ${x.comparison?.toVersion}` : 'aus Tickets'}</span></>}
      actions={<>
        {/* Übersetzung DE↔EN (U-09): Speicher zuerst, sonst KI; neuer Entwurf mit Prüfbefunden je Zeile */}
        {canEdit && !x.translationOf && !x.translations.length && (
          <button className="btn small" onClick={() => void (async () => {
            try {
              const r = await post<any>(`/release-letters/${id}/translate`, {});
              notify(`Übersetzt (${x.language === 'de' ? 'EN' : 'DE'}): ${r.fromMemory} Zeilen aus dem Speicher, ${r.machine} per KI, ${r.issues.length} mit Prüfbefund.`);
              onChange();
              onOpen(r.id);
            } catch (e) {
              notify(errorText(e), 'error');
            }
          })()}>Übersetzen ({x.language === 'de' ? 'DE → EN' : 'EN → DE'})</button>
        )}
        {x.translations.map((t: any) => <button key={t.id} className="btn small" onClick={() => onOpen(t.id)}>Übersetzung {t.language.toUpperCase()} öffnen</button>)}
        {x.translationOf && <button className="btn small" onClick={() => onOpen(x.translationOf)}>Ausgangsletter öffnen</button>}
        <DownloadButton href={`/api/v1/release-letters/${id}/export?format=md`} name={`releaseletter_${x.release}_${x.language}.md`} className="btn small">Markdown</DownloadButton>
        <DownloadButton href={`/api/v1/release-letters/${id}/export?format=docx`} name={`releaseletter_${x.release}_${x.language}.docx`} className="btn small">Word</DownloadButton>
      </>}>
      <div className={`alert ${c.verdict === 'block' ? 'error' : c.verdict === 'cond' ? 'warning' : 'info'}`} role="status">
        <strong>{c.verdictLabel}</strong> – {c.verdictText}
      </div>
      <div className="stat-row">
        <div className="stat"><span className="muted small">Kritisch</span><strong>{c.counts.fail}</strong></div>
        <div className="stat"><span className="muted small">Warnungen</span><strong>{c.counts.warn}</strong></div>
        <div className="stat"><span className="muted small">Hinweise</span><strong>{c.counts.hint}</strong></div>
        <div className="stat"><span className="muted small">Personenbezogene Daten</span><strong>{c.pii.length}</strong></div>
        <div className="stat"><span className="muted small">Feldabdeckung</span><strong>{c.coverage} %</strong></div>
      </div>
      {x.translationOf && (x.translationIssues.length ? (
        <div className="alert warning" role="status">
          <strong>Übersetzungsprüfung: {x.translationIssues.length} Zeilen mit Befund</strong> – vor der Freigabe beheben.
          <ul className="small">{x.translationIssues.map((t: any, i: number) => <li key={i}>{t.line ? `Zeile ${t.line}: ` : ''}{t.labels.join('; ')}{t.text ? ` – „${t.text.slice(0, 80)}“` : ''}</li>)}</ul>
        </div>
      ) : <p className="small">Übersetzungsprüfung ohne Befund (Länge, deutsche Wörter, Zahlen, Kennungen, Platzhalter).</p>)}
      {c.ticketsNotLoaded.length > 0 && <p className="alert warning">Nicht mehr eingelesen: {c.ticketsNotLoaded.join(', ')}</p>}
      {!c.findings.length ? <p className="small muted">Keine Befunde.</p> : (
        <ul className="rl-findings" aria-label="Befunde">
          {c.findings.map((f: any, i: number) => (
            <li key={i}>
              <span className={`tag ${SEV[f.severity].cls}`}>{SEV[f.severity].label}</span> <strong>{f.title}</strong>{f.ticket ? ` · ${f.ticket}` : ''}{f.detail ? <span className="muted"> ({f.detail})</span> : null}
              <div className="small muted">Regel {f.rule}: {f.recommendation}</div>
            </li>
          ))}
        </ul>
      )}
      <label className="block">Text (Markdown){!draft && <span className="muted small"> – freigegeben am {new Date(x.approvedAt).toLocaleString('de-DE')} von {x.approvedBy}, unveränderlich</span>}
        <textarea id="rl-text" rows={18} value={text} readOnly={!draft || !canEdit} onChange={(e) => setText(e.target.value)} className="mono" />
      </label>
      {draft && (
        <div className="filters">
          {canEdit && <button className="btn primary" disabled={text === x.text} onClick={() => run(() => patch(`/release-letters/${id}`, { text }), 'Gespeichert und erneut geprüft.')}>Speichern und prüfen</button>}
          {canApprove && c.verdict === 'cond' && <label className="grow"><span className="sr-only">Begründung</span><input value={reason} placeholder="Begründung für die bedingte Freigabe" aria-label="Begründung für die bedingte Freigabe" onChange={(e) => setReason(e.target.value)} /></label>}
          {canApprove && <button className="btn" disabled={c.verdict === 'block' || text !== x.text} onClick={() => run(() => post(`/release-letters/${id}/approve`, { reason: reason || undefined }), 'Releaseletter freigegeben.')}>Freigeben</button>}
          {canEdit && <button className="btn ghost" onClick={() => run(() => del(`/release-letters/${id}`), 'Releaseletter gelöscht.')}>Löschen</button>}
        </div>
      )}
    </Card>
  );
}

export function ReleaseLettersPage() {
  const { notify } = useApp();
  const { canEdit } = usePermissions();
  const [params] = useSearchParams();
  const releases = useLoad<any>('/ticket-releases');
  const letters = useLoad<any[]>('/release-letters');
  const [selected, setSelected] = useState<string | null>(params.get('letter'));
  // Entwurf aus dem Projektvergleich zweier Handbuch-Releases (ADR-102, W-04)
  const handbook = useLoad<any[]>('/releases');
  const [cmp, setCmp] = useState({ releaseId: '', fromReleaseId: '', language: 'de', audience: 'biz' });
  const [form, setForm] = useState({ release: params.get('release') ?? '', keys: '', language: 'de', audience: 'biz', country: 'DE', division: 'all' });
  const [ext, setExt] = useState({ text: '', keys: '', audience: 'biz' });
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });
  const create = async (path: string, body: any, msg: string) => {
    try {
      const r: any = await post(path, body);
      notify(msg);
      letters.reload();
      setSelected(r.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Page title="Releaseletter" subtitle="Aus den Jira-Tickets eines Releases erzeugen oder einen vorhandenen Letter einfügen – geprüft gegen die Tickets nach festen Regeln">
      <ErrorBox error={letters.error ?? releases.error} />
      {canEdit && (
        <div className="grid2">
          <Card title="Aus Tickets erzeugen">
            <label className="block">Release
              <select value={form.release} aria-label="Release" onChange={(e) => set('release', e.target.value)}>
                <option value="">– Ticketnummern angeben –</option>
                {(releases.data?.releases ?? []).map((r: any) => <option key={r.label} value={r.label}>{r.label} ({r.tickets} Tickets)</option>)}
              </select>
            </label>
            {!form.release && <label className="block">Ticketnummern <input value={form.keys} placeholder="ONESCM-101, ONESCM-102" onChange={(e) => set('keys', e.target.value)} /></label>}
            <div className="filters">
              <label>Sprache <select value={form.language} onChange={(e) => set('language', e.target.value)}><option value="de">Deutsch</option><option value="en">Englisch</option></select></label>
              <label>Zielgruppe <select value={form.audience} onChange={(e) => set('audience', e.target.value)}>{AUDIENCES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
              <label>Markt <input value={form.country} maxLength={2} size={3} onChange={(e) => set('country', e.target.value.toUpperCase())} /></label>
              <label>Sparte <select value={form.division} onChange={(e) => set('division', e.target.value)}>{DIVISIONS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
            </div>
            <button className="btn primary" disabled={!form.release && !form.keys.trim()} onClick={() => create('/release-letters', { ...form, release: form.release || undefined, keys: form.release ? undefined : form.keys }, 'Releaseletter erzeugt.')}>Erzeugen</button>
            <p className="small muted">Nur Fakten aus den Tickets: Datum aus „Erstellt“, „PI TBD“ ohne Version, verknüpfte Tickets sind kein Inhalt, Status wörtlich, ein Test bleibt ein Testfall, Verfasser „oneSCM Team“. Stornierte Tickets entfallen.</p>
          </Card>
          <Card title="Aus Projektvergleich erzeugen">
            <p className="small muted">Vergleicht zwei Handbuch-Releases: neue und geänderte Kapitel, neue Bildfassungen, neue Funktionen („gültig ab“ = Version), abgelöste Funktionen (Historie) und die Tickets der Version ohne Background.</p>
            {!handbook.data?.length ? <Empty>Noch kein Handbuch-Release unter <Link to="/veroeffentlichung">Veröffentlichung</Link>.</Empty> : (
              <>
                <div className="filters">
                  <label>Release <select aria-label="Handbuch-Release" value={cmp.releaseId} onChange={(e) => setCmp({ ...cmp, releaseId: e.target.value })}>
                    <option value="">– wählen –</option>
                    {handbook.data.map((r: any) => <option key={r.id} value={r.id}>Version {r.version}</option>)}
                  </select></label>
                  <label>Verglichen mit <select aria-label="Vergleichs-Release" value={cmp.fromReleaseId} onChange={(e) => setCmp({ ...cmp, fromReleaseId: e.target.value })}>
                    <option value="">Vorgänger-Release</option>
                    {handbook.data.filter((r: any) => r.id !== cmp.releaseId).map((r: any) => <option key={r.id} value={r.id}>Version {r.version}</option>)}
                  </select></label>
                  <label>Sprache <select value={cmp.language} onChange={(e) => setCmp({ ...cmp, language: e.target.value })}><option value="de">Deutsch</option><option value="en">Englisch</option></select></label>
                  <label>Zielgruppe <select value={cmp.audience} onChange={(e) => setCmp({ ...cmp, audience: e.target.value })}>{AUDIENCES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
                </div>
                <button className="btn" disabled={!cmp.releaseId} onClick={() => create('/release-letters/from-comparison', { ...cmp, fromReleaseId: cmp.fromReleaseId || undefined }, 'Entwurf aus dem Projektvergleich erzeugt.')}>Aus Vergleich anlegen</button>
              </>
            )}
          </Card>
          <Card title="Vorhandenen Letter einfügen und prüfen">
            <label className="block">Text des Releaseletters <textarea id="rl-ext" rows={6} value={ext.text} onChange={(e) => setExt({ ...ext, text: e.target.value })} /></label>
            <div className="filters">
              <label className="grow">Tickets (optional) <input value={ext.keys} placeholder="sonst aus dem Text" onChange={(e) => setExt({ ...ext, keys: e.target.value })} /></label>
              <label>Zielgruppe <select value={ext.audience} onChange={(e) => setExt({ ...ext, audience: e.target.value })}>{AUDIENCES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
            </div>
            <button className="btn" disabled={!ext.text.trim()} onClick={() => create('/release-letters/import', { text: ext.text, keys: ext.keys || undefined, audience: ext.audience }, 'Releaseletter eingefügt und geprüft.')}>Einfügen und prüfen</button>
          </Card>
        </div>
      )}
      <Card title={`Releaseletter (${letters.data?.length ?? 0})`}>
        {!letters.data?.length ? <Empty>Noch keine Releaseletter.</Empty> : (
          <table className="table">
            <thead><tr><th>Titel</th><th>Release</th><th>Sprache</th><th>Zielgruppe</th><th>Prüfung</th><th>Status</th></tr></thead>
            <tbody>
              {letters.data.map((l) => (
                <tr key={l.id} className={selected === l.id ? 'selected' : ''}>
                  <th scope="row"><button className="linklike" onClick={() => setSelected(l.id)}>{l.title}</button></th>
                  <td>{l.release}</td><td>{l.language.toUpperCase()}</td><td className="small">{l.audienceLabel}</td>
                  <td>{l.verdict ? <span className={`tag ${VERDICT_CLS[l.verdict]}`}>{l.verdictLabel}</span> : '–'}</td>
                  <td>{l.status === 'approved' ? 'freigegeben' : 'Entwurf'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {selected && <LetterDetail id={selected} onChange={() => letters.reload()} onOpen={setSelected} />}
    </Page>
  );
}
