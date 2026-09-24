// Integrationen (ADR-028): API-Tokens und ausgehende Webhooks des Projekts
import { useState } from 'react';
import { del, patch, post } from '../api';
import { Card, Empty, ErrorBox, Modal, Page, Status, errorText, useApp, useLoad } from '../components/ui';

const SCOPES = [
  { code: 'read', label: 'Lesen' },
  { code: 'edit', label: 'Bearbeiten' },
  { code: 'decide', label: 'Befunde entscheiden' },
  { code: 'approve', label: 'Freigeben' },
  { code: 'admin', label: 'Administration' },
];

/** Einmalig angezeigtes Geheimnis mit Kopierhilfe */
function SecretOnce({ label, value, onClose }: { label: string; value: string; onClose: () => void }) {
  return (
    <Modal title={label} onClose={onClose}>
      <p>Dieser Wert wird nur jetzt angezeigt. Bitte sicher ablegen.</p>
      <pre tabIndex={0} aria-label={label} className="source">{value}</pre>
      <div className="actions">
        <button className="btn" onClick={() => void navigator.clipboard?.writeText(value)}>Kopieren</button>
        <button className="btn primary" onClick={onClose}>Gespeichert</button>
      </div>
    </Modal>
  );
}

export function IntegrationsPage() {
  const { notify } = useApp();
  const tokens = useLoad<any[]>('/api-tokens');
  const hooks = useLoad<any>('/webhooks');
  const [secret, setSecret] = useState<{ label: string; value: string } | null>(null);
  const [tokenForm, setTokenForm] = useState({ name: '', scopes: ['read'], expiresInDays: '90' });
  const [hookForm, setHookForm] = useState<{ url: string; events: string[]; description: string } | null>(null);
  const run = async (fn: () => Promise<any>, msg?: string) => {
    try {
      const r = await fn();
      if (msg) notify(msg);
      tokens.reload();
      hooks.reload();
      return r;
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page title="Integrationen" subtitle="API-Tokens für Maschinen und Webhooks zu Ereignissen dieses Projekts">
      <Card title="API-Tokens">
        <ErrorBox error={tokens.error} />
        <p className="small">Zugriff per <code>Authorization: Bearer oscm_…</code> – nur auf dieses Projekt, mit den gewählten Berechtigungen und Ablaufdatum.</p>
        <form className="filters" onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            const t = await post('/api-tokens', { ...tokenForm, expiresInDays: Number(tokenForm.expiresInDays) });
            setSecret({ label: `API-Token „${t.name}“`, value: t.token });
            setTokenForm({ name: '', scopes: ['read'], expiresInDays: '90' });
          });
        }}>
          <label className="inline">Name <input value={tokenForm.name} onChange={(e) => setTokenForm({ ...tokenForm, name: e.target.value })} /></label>
          <fieldset className="inline-fieldset">
            <legend>Berechtigungen</legend>
            {SCOPES.map((s) => (
              <label key={s.code} className="inline"><input type="checkbox" checked={tokenForm.scopes.includes(s.code)} onChange={(e) => setTokenForm({ ...tokenForm, scopes: e.target.checked ? [...tokenForm.scopes, s.code] : tokenForm.scopes.filter((x) => x !== s.code) })} /> {s.label}</label>
            ))}
          </fieldset>
          <label className="inline">Gültig (Tage) <input type="number" min={1} max={365} value={tokenForm.expiresInDays} onChange={(e) => setTokenForm({ ...tokenForm, expiresInDays: e.target.value })} /></label>
          <button className="btn primary" type="submit" disabled={!tokenForm.name.trim() || !tokenForm.scopes.length}>Token erstellen</button>
        </form>
        {!tokens.data?.length ? <Empty>Keine API-Tokens.</Empty> : (
          <table className="table compact">
            <thead><tr><th>Name</th><th>Kennung</th><th>Berechtigungen</th><th>Status</th><th>Läuft ab</th><th>Zuletzt genutzt</th><th><span className="sr-only">Aktionen</span></th></tr></thead>
            <tbody>
              {tokens.data.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td className="mono small">{t.prefix}…</td>
                  <td className="small">{t.scopes.join(', ')}</td>
                  <td><span className={`tag ${t.status === 'active' ? 'st-approved' : 'st-ignored'}`}>{t.status === 'active' ? 'aktiv' : t.status === 'revoked' ? 'widerrufen' : 'abgelaufen'}</span></td>
                  <td className="small">{new Date(t.expiresAt).toLocaleDateString('de-DE')}</td>
                  <td className="small">{t.lastUsedAt ? new Date(t.lastUsedAt).toLocaleString('de-DE') : '–'}</td>
                  <td>{t.status === 'active' && <button className="btn small ghost" aria-label={`Token ${t.name} widerrufen`} onClick={() => confirm(`Token „${t.name}“ widerrufen?`) && void run(() => del(`/api-tokens/${t.id}`), 'Token widerrufen.')}>Widerrufen</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Webhooks" actions={<button className="btn" onClick={() => setHookForm({ url: '', events: ['release.published'], description: '' })}>Webhook anlegen</button>}>
        <ErrorBox error={hooks.error} />
        <p className="small">Zustellung als JSON per POST, signiert mit <code>X-OneSCM-Signature: sha256=HMAC(Geheimnis, Zeitstempel + "." + Rumpf)</code>; bis zu fünf Versuche.</p>
        {!hooks.data?.items.length ? <Empty>Keine Webhooks.</Empty> : hooks.data.items.map((h: any) => (
          <div key={h.id} className="webhook">
            <h3>{h.url} {!h.active && <span className="tag st-ignored">inaktiv</span>}</h3>
            <p className="small">{h.description && <>{h.description} · </>}Ereignisse: {h.events.join(', ')}</p>
            <div className="actions">
              <button className="btn small" onClick={() => void run(() => post(`/webhooks/${h.id}/ping`), 'Testereignis gesendet.')}>Testen</button>
              <button className="btn small ghost" onClick={() => void run(() => patch(`/webhooks/${h.id}`, { active: !h.active }), h.active ? 'Deaktiviert.' : 'Aktiviert.')}>{h.active ? 'Deaktivieren' : 'Aktivieren'}</button>
              <button className="btn small ghost" aria-label={`Webhook ${h.url} löschen`} onClick={() => confirm('Webhook löschen?') && void run(() => del(`/webhooks/${h.id}`), 'Webhook gelöscht.')}>Löschen</button>
            </div>
            {h.recent.length > 0 && (
              <table className="table compact">
                <thead><tr><th>Ereignis</th><th>Status</th><th>Versuche</th><th>Antwort</th><th>Zeit</th><th><span className="sr-only">Aktionen</span></th></tr></thead>
                <tbody>
                  {h.recent.map((d: any) => (
                    <tr key={d.id}>
                      <td>{d.event}</td>
                      <td><Status s={d.status === 'delivered' ? 'completed' : d.status === 'failed' ? 'failed' : 'queued'} />{d.error && <div className="small">{d.error}</div>}</td>
                      <td>{d.attempts}</td>
                      <td>{d.responseCode ?? '–'}</td>
                      <td className="small">{new Date(d.createdAt).toLocaleString('de-DE')}</td>
                      <td>{d.status === 'failed' && <button className="btn small" onClick={() => void run(() => post(`/webhook-deliveries/${d.id}/redeliver`), 'Erneut zugestellt.')}>Erneut senden</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </Card>

      {hookForm && (
        <Modal title="Webhook anlegen" onClose={() => setHookForm(null)}>
          <label className="block">Ziel-URL (https)<input value={hookForm.url} placeholder="https://ci.example.org/hooks/onescm" onChange={(e) => setHookForm({ ...hookForm, url: e.target.value })} /></label>
          <label className="block">Beschreibung<input value={hookForm.description} onChange={(e) => setHookForm({ ...hookForm, description: e.target.value })} /></label>
          <fieldset>
            <legend>Ereignisse</legend>
            {(hooks.data?.events ?? []).map((ev: string) => (
              <label key={ev} className="block-check"><input type="checkbox" checked={hookForm.events.includes(ev)} onChange={(e) => setHookForm({ ...hookForm, events: e.target.checked ? [...hookForm.events, ev] : hookForm.events.filter((x) => x !== ev) })} /> {ev}</label>
            ))}
          </fieldset>
          <div className="actions">
            <button className="btn primary" disabled={!hookForm.url || !hookForm.events.length} onClick={() => void run(async () => {
              const h = await post('/webhooks', hookForm);
              setHookForm(null);
              setSecret({ label: 'Webhook-Geheimnis', value: h.secret });
            })}>Anlegen</button>
          </div>
        </Modal>
      )}
      {secret && <SecretOnce label={secret.label} value={secret.value} onClose={() => setSecret(null)} />}
    </Page>
  );
}
