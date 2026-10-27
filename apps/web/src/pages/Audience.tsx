// Textvarianten je Kapitel (ADR-105, S-05) und vier Prüferprofile (W-12)
import { useState } from 'react';
import { post } from '../api';
import { Gated, Card, DownloadButton, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';

const TRAFFIC_CLS: Record<string, string> = { green: 'st-approved', yellow: 'sev-medium', red: 'sev-high' };
const SEVERITY_CLS: Record<string, string> = { high: 'sev-high', medium: 'sev-medium', low: 'sev-low' };

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((p) => p === 'edit' || p === 'admin');
}

/** Neueste Version je Kapitel zur Auswahl */
function useVersions() {
  const chapters = useLoad<any[]>('/chapters');
  return (chapters.data ?? []).flatMap((c: any) => {
    const v = [...(c.versions ?? [])].filter((x: any) => x.status !== 'superseded').sort((a: any, b: any) => b.versionNo - a.versionNo)[0];
    return v ? [{ id: v.id as string, label: `${c.title} – Version ${v.versionNo}` }] : [];
  });
}

function VersionSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const versions = useVersions();
  return (
    <label className="grow">Kapitel
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">– wählen –</option>
        {versions.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
      </select>
    </label>
  );
}

export function TextVariantsPage() {
  const [versionId, setVersionId] = useState('');
  const [ai, setAi] = useState(false);
  const [code, setCode] = useState('enduser');
  const r = useLoad<any>(versionId ? `/chapter-versions/${versionId}/text-variants${ai ? '?ai=true' : ''}` : null, [versionId, ai]);
  const d = r.data && r.data.versionId === versionId ? r.data : null;
  const variant = d?.variants.find((v: any) => v.code === code);
  return (
    <Page title="Textvarianten" subtitle="Ein Kapitel in drei Fassungen: für Endanwender, als Fachtext und als Kurzfassung für das Management">
      <Card title="Kapitel wählen">
        <div className="form-row">
          <VersionSelect value={versionId} onChange={setVersionId} />
          <label className="inline"><input type="checkbox" checked={ai} onChange={(e) => setAi(e.target.checked)} /> Kurzfassung mit KI-Dienst (lokal)</label>
        </div>
        <p className="small muted">Die Kurzfassung entsteht regelbasiert aus Zweck, Ergebnis, Warnhinweisen und Ablauf. Mit KI-Dienst wird sie umformuliert; enthält sie Zahlen ohne Grundlage im Kapitel oder ist sie zu lang, bleibt die regelbasierte Fassung. Als Export: „Ausgabe – Kurzfassung“ unter Export.</p>
      </Card>
      <ErrorBox error={r.error} />
      {!versionId ? <Empty>Bitte ein Kapitel wählen.</Empty> : d && (
        <>
          {d.note && <div className="alert small" role="status">{d.note}</div>}
          <div className="stat-row" role="tablist" aria-label="Varianten">
            {d.variants.map((v: any) => (
              <button key={v.code} type="button" role="tab" aria-selected={code === v.code} className={`stat linklike${code === v.code ? ' selected' : ''}`} onClick={() => setCode(v.code)} title={v.hint}>
                <span className="muted small">{v.label}</span>
                <strong>{v.words} Wörter</strong>
                <span className="small muted">{v.ratio} % des Fachtexts</span>
              </button>
            ))}
          </div>
          {variant && (
            <Card title={<>{variant.label}{variant.code === 'summary' && <span className="muted small"> · {d.method === 'ai' ? 'KI-Dienst' : 'regelbasiert'}</span>}</>}
              actions={<DownloadButton className="btn small" href={`/api/v1/chapter-versions/${versionId}/text-variants/${variant.code}/download${ai ? '?ai=true' : ''}`} name={`${variant.code}.md`}>⬇ Markdown</DownloadButton>}>
              <p className="small muted">{variant.hint}</p>
              <div className="export-preview" role="tabpanel" tabIndex={0} aria-label={`Fassung ${variant.label}`}><Md text={variant.markdown} /></div>
            </Card>
          )}
        </>
      )}
    </Page>
  );
}

export function ProfileReviewsPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const profiles = useLoad<any[]>('/review-profiles');
  const [versionId, setVersionId] = useState('');
  const [chosen, setChosen] = useState<string[]>(['domain', 'editorial', 'compliance', 'enduser']);
  const [ai, setAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const r = useLoad<any>(versionId ? `/chapter-versions/${versionId}/profile-reviews` : null, [versionId]);
  const d = r.data && r.data.versionId === versionId ? r.data : null;
  const run = async () => {
    setBusy(true);
    try {
      r.setData(await post<any>(`/chapter-versions/${versionId}/profile-reviews`, { profiles: chosen, ai }));
      notify(`Prüfung abgeschlossen (${chosen.length} ${chosen.length === 1 ? 'Profil' : 'Profile'}).`);
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Page title="Prüferprofile" subtitle="Ein Kapitel mit vier Blicken prüfen: fachlich, Redaktion, Compliance und Endanwender">
      <Card title="Prüfung">
        <div className="form-row">
          <VersionSelect value={versionId} onChange={setVersionId} />
        </div>
        <fieldset className="checks">
          <legend>Profile</legend>
          {(profiles.data ?? []).map((p) => (
            <label key={p.profile} title={p.focus}><input type="checkbox" checked={chosen.includes(p.profile)} onChange={() => setChosen(chosen.includes(p.profile) ? chosen.filter((x) => x !== p.profile) : [...chosen, p.profile])} /> {p.label}</label>
          ))}
        </fieldset>
        <div className="form-row">
          <label className="inline"><input type="checkbox" checked={ai} onChange={(e) => setAi(e.target.checked)} /> Zusätzlich KI-Dienst je Profil (lokal)</label>
          {canEdit && <Gated type="button" className="btn primary" busy={busy} missing={[!versionId && 'Kapitel', !chosen.length && 'mindestens ein Profil']} onClick={() => void run()}>Prüfung starten</Gated>}
        </div>
      </Card>
      <ErrorBox error={r.error} />
      {!versionId ? <Empty>Bitte ein Kapitel wählen.</Empty> : d && (
        <>
          {!d.latest.length && <Empty>Für diese Version gibt es noch keine Prüfung.</Empty>}
          {d.latest[0]?.note && <div className="alert small" role="status">{d.latest[0].note}</div>}
          <div className="grid2">
            {d.latest.map((x: any) => (
              <Card key={x.id} title={<>{x.label} <span className={`tag ${TRAFFIC_CLS[x.traffic]}`}>{x.trafficLabel} · {x.score}</span></>}>
                <p className="small muted">{x.focus}</p>
                <p className="small">{x.counts.high} hoch, {x.counts.medium} mittel, {x.counts.low} gering · {x.method === 'ai' ? 'Regeln und KI-Dienst' : 'Regeln'} · {new Date(x.createdAt).toLocaleString('de-DE')}</p>
                {!x.findings.length ? <Empty>Keine Funde.</Empty> : (
                  <ul className="plain" aria-label={`Funde ${x.label}`}>
                    {x.findings.map((f: any, i: number) => (
                      <li key={i}>
                        <span className={`tag ${SEVERITY_CLS[f.severity]}`}>{f.severityLabel}</span> {f.message}
                        {f.section && <span className="small muted"> · {f.section}</span>}
                        {f.excerpt && <div className="small muted">„{f.excerpt}“</div>}
                        {f.suggestion && <div className="small">Vorschlag: {f.suggestion}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>
          {d.history.length > d.latest.length && (
            <Card title="Verlauf">
              <div className="table-wrap" role="region" aria-label="Verlauf der Prüfungen" tabIndex={0}>
                <table className="table compact">
                  <caption className="sr-only">Werte früherer Prüfungen</caption>
                  <thead><tr><th scope="col">Zeit</th><th scope="col">Profil</th><th scope="col">Wert</th><th scope="col">Verfahren</th></tr></thead>
                  <tbody>{d.history.map((h: any) => <tr key={h.id}><td>{new Date(h.createdAt).toLocaleString('de-DE')}</td><td>{h.label}</td><td>{h.score}</td><td>{h.method === 'ai' ? 'Regeln und KI' : 'Regeln'}</td></tr>)}</tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </Page>
  );
}
