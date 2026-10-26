// Vorher/Nachher-Belege (ADR-106, W-05): zwei Fassungen eines Bildes mit Schieberegler, Anlass, Änderung und Wirkung;
// als Gegenüberstellung im Bildarchiv ablegen und in Kapitel einfügen
import { useEffect, useState } from 'react';
import { del, mediaUrl, patch, post } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

function useCanEdit() {
  const me = useLoad<{ permissions: string[] }>('/me');
  return (me.data?.permissions ?? []).some((p) => p === 'edit' || p === 'admin');
}

function useImage(sha: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setUrl(null);
    if (sha) mediaUrl(sha, 'original=1').then((u) => alive && setUrl(u), () => undefined);
    return () => {
      alive = false;
    };
  }, [sha]);
  return url;
}

/** Vorher (unten) und Nachher (oben, links bis zum Regler sichtbar) übereinander */
function Slider({ before, after, label }: { before: string; after: string; label: string }) {
  const [pos, setPos] = useState(50);
  const b = useImage(before);
  const a = useImage(after);
  return (
    <figure className="ba">
      <div className="ba-frame">
        {b && <img src={b} alt={`Vorher: ${label}`} />}
        {a && <img src={a} alt={`Nachher: ${label}`} className="ba-after" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />}
        <span className="ba-line" style={{ left: `${pos}%` }} aria-hidden="true" />
      </div>
      <label className="block small">Anteil Nachher <output>{pos} %</output>
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label={`Anteil Nachher: ${label}`} />
      </label>
      <figcaption className="small muted">links Nachher, rechts Vorher – den Regler nach rechts ziehen, um mehr vom Nachher zu sehen</figcaption>
    </figure>
  );
}

function ComparisonCard({ c, canEdit, onChange }: { c: any; canEdit: boolean; onChange: () => void }) {
  const { notify } = useApp();
  const [form, setForm] = useState({ reason: c.reason ?? '', change: c.change ?? '', effect: c.effect ?? '', ticket: c.ticket ?? '' });
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      onChange();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title={<>{c.title} <span className="muted small">Fassung {c.before.versionNo} → {c.after.versionNo}{c.ticket ? ` · ${c.ticket}` : ''}</span></>}>
      <Slider before={c.beforeSha} after={c.afterSha} label={c.title} />
      <div className="grid3 tight">
        {(['reason', 'change', 'effect'] as const).map((k) => (
          <label key={k} className="block small">{({ reason: 'Anlass', change: 'Änderung', effect: 'Wirkung' } as const)[k]}
            <textarea rows={2} maxLength={500} value={form[k]} disabled={!canEdit} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      {canEdit && (
        <div className="row-actions">
          <label className="small">Ticket <input value={form.ticket} maxLength={40} size={10} onChange={(e) => setForm({ ...form, ticket: e.target.value })} /></label>
          <button type="button" className="btn small" onClick={() => void run(() => patch(`/image-comparisons/${c.id}`, form), 'Beleg gespeichert.')}>Speichern</button>
          <button type="button" className="btn small primary" onClick={() => void run(() => post(`/image-comparisons/${c.id}/render`), 'Gegenüberstellung im Bildarchiv abgelegt.')}>Als Bild ins Archiv</button>
          <button type="button" className="btn small danger" onClick={() => void run(() => del(`/image-comparisons/${c.id}`), 'Beleg gelöscht.')}>Löschen</button>
        </div>
      )}
      {c.markdown && <p className="small">In Kapitel einfügen: <code>{c.markdown}</code></p>}
    </Card>
  );
}

export function BeforeAfterPage() {
  const { notify } = useApp();
  const canEdit = useCanEdit();
  const archive = useLoad<any>('/image-archive');
  const list = useLoad<any[]>('/image-comparisons');
  const [imageSha, setImageSha] = useState('');
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const items: any[] = archive.data?.items ?? [];
  const withVersions = items.filter((i) => i.versions.length >= 2);
  const image = items.find((i) => i.sha === imageSha);
  useEffect(() => {
    if (!image) return;
    const v = [...image.versions].sort((a: any, b: any) => a.versionNo - b.versionNo);
    setBefore(v[v.length - 2]?.sha ?? '');
    setAfter(v[v.length - 1]?.sha ?? '');
  }, [image?.sha]); // eslint-disable-line react-hooks/exhaustive-deps
  const create = async () => {
    try {
      await post('/image-comparisons', { beforeSha: before, afterSha: after, title: image?.title ?? undefined });
      notify('Vorher/Nachher-Beleg angelegt.');
      list.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const label = (v: any) => `Fassung ${v.versionNo}${v.note ? ` – ${v.note}` : ''}`;
  return (
    <Page title="Vorher/Nachher" subtitle="Zwei Fassungen eines Bildes mit Schieberegler vergleichen und die Änderung belegen: Anlass, Änderung, Wirkung">
      {canEdit && (
        <Card title="Neuer Beleg">
          {!withVersions.length ? <Empty>Kein Bild mit mehreren Fassungen – im Bildarchiv eine neue Fassung hochladen.</Empty> : (
            <div className="form-row">
              <label className="grow">Bild
                <select value={imageSha} onChange={(e) => setImageSha(e.target.value)}>
                  <option value="">– wählen –</option>
                  {withVersions.map((i) => <option key={i.sha} value={i.sha}>{i.imageNo} {i.title ?? ''} ({i.versions.length} Fassungen)</option>)}
                </select>
              </label>
              {image && <>
                <label>Vorher <select value={before} onChange={(e) => setBefore(e.target.value)}>{image.versions.map((v: any) => <option key={v.sha} value={v.sha}>{label(v)}</option>)}</select></label>
                <label>Nachher <select value={after} onChange={(e) => setAfter(e.target.value)}>{image.versions.map((v: any) => <option key={v.sha} value={v.sha}>{label(v)}</option>)}</select></label>
                <button type="button" className="btn primary" disabled={!before || !after || before === after} onClick={() => void create()}>Beleg anlegen</button>
              </>}
            </div>
          )}
        </Card>
      )}
      <ErrorBox error={list.error} />
      {!list.data?.length ? <Empty>Noch keine Vorher/Nachher-Belege.</Empty> : list.data.map((c) => <ComparisonCard key={`${c.id}-${c.updatedAt}`} c={c} canEdit={canEdit} onChange={list.reload} />)}
    </Page>
  );
}
