import { useState } from 'react';
import { currentProjectId, del, patch, post, put, setCurrentProjectId } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const PERMS = ['read', 'edit', 'decide', 'approve', 'admin'];
const PERM_LABEL: Record<string, string> = { read: 'lesen', edit: 'bearbeiten', decide: 'entscheiden', approve: 'freigeben', admin: 'administrieren' };

/** Mandanten/Projekte (ADR-014): Übersicht, Anlegen, Sichtbarkeit, Archivierung und Mitglieder */
export function ProjectsPage({ onChanged }: { onChanged: () => void }) {
  const { notify } = useApp();
  const projects = useLoad<any[]>('/projects');
  const me = useLoad<any>('/me');
  const isAdmin = !!me.data?.permissions.includes('admin');
  const [form, setForm] = useState({ name: '', description: '', visibility: 'restricted' });
  const [membersOf, setMembersOf] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      projects.reload();
      onChanged();
      return true;
    } catch (e) {
      notify(errorText(e), 'error');
      return false;
    }
  };

  return (
    <Page title="Projekte" subtitle="Mehrere Handbücher getrennt verwalten – Daten, Freigaben und Audit sind je Projekt getrennt">
      <ErrorBox error={projects.error} />
      <div className="grid2">
        <Card title="Projekte">
          {!projects.data?.length ? <Empty>Keine zugänglichen Projekte.</Empty> : (
            <table className="table">
              <thead><tr><th>Name</th><th>Sichtbarkeit</th><th>Kapitel</th><th>Quellen</th><th>Meine Rechte</th><th /></tr></thead>
              <tbody>
                {projects.data.map((p) => (
                  <tr key={p.id} aria-current={p.id === currentProjectId() ? 'true' : undefined}>
                    <td><strong>{p.name}</strong>{p.id === currentProjectId() && <span className="tag st-approved">aktiv</span>}{p.archivedAt && <span className="tag">archiviert</span>}{p.description && <div className="small muted">{p.description}</div>}</td>
                    <td>{p.visibility === 'open' ? 'offen' : 'eingeschränkt'}</td>
                    <td>{p.chapters}</td>
                    <td>{p.sources}</td>
                    <td className="small">{p.myPermissions.map((x: string) => PERM_LABEL[x] ?? x).join(', ')}</td>
                    <td className="row-actions">
                      {p.id !== currentProjectId() && <button className="btn small" onClick={() => { setCurrentProjectId(p.id); window.location.assign('/'); }}>Öffnen</button>}
                      {isAdmin && (
                        <>
                          <button className="btn small" onClick={() => run(() => patch(`/projects/${p.id}`, { visibility: p.visibility === 'open' ? 'restricted' : 'open' }), 'Sichtbarkeit geändert.')}>
                            {p.visibility === 'open' ? 'Einschränken' : 'Öffnen für alle'}
                          </button>
                          {p.id !== 'p_default' && (
                            <button className="btn small" onClick={() => run(() => patch(`/projects/${p.id}`, { archived: !p.archivedAt }), p.archivedAt ? 'Projekt reaktiviert.' : 'Projekt archiviert (nur lesbar).')}>
                              {p.archivedAt ? 'Reaktivieren' : 'Archivieren'}
                            </button>
                          )}
                          <button className="btn small" onClick={() => setMembersOf(membersOf === p.id ? null : p.id)} aria-expanded={membersOf === p.id}>Mitglieder</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="small muted">Offen: alle angemeldeten Benutzer mit ihren globalen Berechtigungen. Eingeschränkt: nur Mitglieder mit den hier vergebenen Berechtigungen. Archivierte Projekte sind nur lesbar.</p>
        </Card>
        {isAdmin && (
          <Card title="Neues Projekt">
            <label className="block">Name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Projektname" /></label>
            <label className="block">Beschreibung (optional) <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} aria-label="Projektbeschreibung" /></label>
            <label className="block">Sichtbarkeit
              <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="restricted">eingeschränkt (nur Mitglieder)</option>
                <option value="open">offen (alle angemeldeten Benutzer)</option>
              </select>
            </label>
            <button className="btn primary" disabled={!form.name.trim()} onClick={async () => {
              if (await run(() => post('/projects', form), `Projekt „${form.name}“ angelegt.`)) setForm({ name: '', description: '', visibility: 'restricted' });
            }}>Anlegen</button>
          </Card>
        )}
      </div>
      {membersOf && isAdmin && <Members projectId={membersOf} name={projects.data?.find((p) => p.id === membersOf)?.name ?? ''} />}
    </Page>
  );
}

function Members({ projectId, name }: { projectId: string; name: string }) {
  const { notify, ref } = useApp();
  const members = useLoad<any[]>(`/projects/${projectId}/members`, [projectId]);
  const [userId, setUserId] = useState('');
  const [perms, setPerms] = useState<string[]>(['read']);
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      members.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title={`Mitglieder: ${name}`}>
      <ErrorBox error={members.error} />
      {!members.data?.length ? <Empty>Keine Mitglieder – bei eingeschränkter Sichtbarkeit hat nur die Administration Zugriff.</Empty> : (
        <table className="table">
          <thead><tr><th>Benutzer</th><th>Berechtigungen</th><th>hinzugefügt</th><th /></tr></thead>
          <tbody>
            {members.data.map((m) => (
              <tr key={m.userId}>
                <td>{m.name ?? m.userId} <span className="small muted">{m.userId}</span></td>
                <td className="small">{m.permissions.map((x: string) => PERM_LABEL[x] ?? x).join(', ')}</td>
                <td className="small">{m.addedBy} · {new Date(m.addedAt).toLocaleDateString('de-DE')}</td>
                <td><button className="btn small danger" onClick={() => act(() => del(`/projects/${projectId}/members/${encodeURIComponent(m.userId)}`), 'Mitglied entfernt.')}>Entfernen</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Mitglied hinzufügen oder ändern</h3>
      <div className="form-row">
        <label>Benutzer
          <input list="known-users" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="z. B. u-redaktion oder oidc:…" aria-label="Benutzerkennung" />
          <datalist id="known-users">{ref?.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</datalist>
        </label>
      </div>
      <fieldset className="checks">
        <legend>Berechtigungen im Projekt</legend>
        {PERMS.map((p) => (
          <label key={p}>
            <input type="checkbox" checked={perms.includes(p)} disabled={p === 'read'} onChange={() => setPerms(perms.includes(p) ? perms.filter((x) => x !== p) : [...perms, p])} /> {PERM_LABEL[p]}
          </label>
        ))}
      </fieldset>
      <button className="btn primary small" disabled={!userId.trim()} onClick={() => act(() => put(`/projects/${projectId}/members/${encodeURIComponent(userId.trim())}`, { permissions: perms }), 'Mitgliedschaft gespeichert.')}>Speichern</button>
    </Card>
  );
}
