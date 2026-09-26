// Benutzerverwaltung (ADR-045): Benutzer anlegen, bearbeiten, sperren; Projektzugriffe je Benutzer – nur Administration.
import { useEffect, useState } from 'react';
import { del, patch, post, put } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const PERMS: { code: string; label: string }[] = [
  { code: 'read', label: 'Lesen' }, { code: 'edit', label: 'Bearbeiten' }, { code: 'decide', label: 'Entscheiden' }, { code: 'approve', label: 'Freigeben' }, { code: 'admin', label: 'Administration' },
];
const permLabel = (p: string) => PERMS.find((x) => x.code === p)?.label ?? p;
const ORIGIN: Record<string, string> = { demo: 'Demo', local: 'lokal', oidc: 'OIDC (Identity Provider)' };

function PermChecks({ value, onChange, disabled, legend }: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean; legend: string }) {
  return (
    <fieldset className="checks">
      <legend className="small">{legend}</legend>
      {PERMS.map((p) => (
        <label key={p.code} className="inline">
          <input type="checkbox" disabled={disabled || p.code === 'read'} checked={p.code === 'read' || value.includes(p.code)}
            onChange={(e) => onChange(e.target.checked ? [...value, p.code] : value.filter((x) => x !== p.code))} /> {p.label}
        </label>
      ))}
    </fieldset>
  );
}

/** Rollenvorlage wählen (ADR-047); „einzeln“ = Berechtigungen selbst setzen */
function TemplateSelect({ templates, value, onChange, label, disabled }: { templates: any[]; value: string; onChange: (id: string) => void; label: string; disabled?: boolean }) {
  return (
    <label className="inline">{label}
      <select aria-label={label} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">– einzeln –</option>
        {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.permissions.map(permLabel).join(', ')})</option>)}
      </select>
    </label>
  );
}

function NewUser({ onCreated, templates }: { onCreated: (id: string) => void; templates: any[] }) {
  const { notify } = useApp();
  const [f, setF] = useState({ id: 'u-', name: '', email: '', permissions: ['read'] as string[], roleTemplateId: 'rt-redaktion' });
  const create = async () => {
    try {
      const u = await post<any>('/users', { ...f, email: f.email || null, roleTemplateId: f.roleTemplateId || undefined });
      notify(`Benutzer „${u.name}“ angelegt.`);
      setF({ id: 'u-', name: '', email: '', permissions: ['read'], roleTemplateId: 'rt-redaktion' });
      onCreated(u.id);
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title="Benutzer anlegen">
      <div className="form-row">
        <label>Kennung <input value={f.id} onChange={(e) => setF({ ...f, id: e.target.value.trim() })} placeholder="u-vorname oder oidc:<Subject>" /></label>
        <label>Name <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>E-Mail <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      </div>
      <TemplateSelect label="Rollenvorlage" templates={templates} value={f.id.startsWith('oidc:') ? '' : f.roleTemplateId} disabled={f.id.startsWith('oidc:')} onChange={(roleTemplateId) => setF({ ...f, roleTemplateId })} />
      {!f.roleTemplateId && <PermChecks legend="Berechtigungen (OIDC-Benutzer erhalten sie vom Identity Provider)" value={f.permissions} onChange={(permissions) => setF({ ...f, permissions })} disabled={f.id.startsWith('oidc:')} />}
      <button className="btn primary" disabled={f.id.length < 3 || !f.name.trim()} onClick={create}>Benutzer anlegen</button>
    </Card>
  );
}

function UserDetail({ user, onChanged, templates }: { user: any; onChanged: () => void; templates: any[] }) {
  const { notify } = useApp();
  const oidc = user.origin === 'oidc';
  const [f, setF] = useState({ name: user.name, email: user.email ?? '', permissions: user.permissions as string[] });
  useEffect(() => setF({ name: user.name, email: user.email ?? '', permissions: user.permissions }), [user]);
  const access = useLoad<any[]>(`/users/${encodeURIComponent(user.id)}/projects`, [user.id, user.permissions.join(), user.disabled]);
  const [edit, setEdit] = useState<Record<string, string[]>>({});
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      onChanged();
      access.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title={`${user.name} (${user.id})`}>
      <div className="form-row">
        <label>Name <input disabled={oidc} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>E-Mail <input type="email" disabled={oidc} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      </div>
      {!oidc && (
        <div className="filters">
          <TemplateSelect label="Rollenvorlage" templates={templates} value={user.roleTemplateId ?? ''} onChange={(id) => id
            ? run(() => patch(`/users/${encodeURIComponent(user.id)}`, { roleTemplateId: id }), 'Rollenvorlage zugewiesen.')
            : run(() => patch(`/users/${encodeURIComponent(user.id)}`, { permissions: f.permissions }), 'Berechtigungen einzeln verwaltet.')} />
        </div>
      )}
      <PermChecks legend={oidc ? 'Berechtigungen (vom Identity Provider, hier nicht änderbar)' : user.roleTemplateId ? 'Globale Berechtigungen (aus der Vorlage; Ändern löst die Verknüpfung)' : 'Globale Berechtigungen'} disabled={oidc} value={f.permissions} onChange={(permissions) => setF({ ...f, permissions })} />
      <div className="row-actions">
        {!oidc && <button className="btn primary" onClick={() => run(() => patch(`/users/${encodeURIComponent(user.id)}`, {
          name: f.name, email: f.email || null,
          // mit Rollenvorlage: Berechtigungen nur senden, wenn sie bewusst geändert wurden – sonst bliebe die Verknüpfung nicht erhalten
          ...(!user.roleTemplateId || f.permissions.join() !== user.permissions.join() ? { permissions: f.permissions } : {}),
        }), 'Benutzer gespeichert.')}>Speichern</button>}
        <button className={`btn${user.disabled ? '' : ' danger'}`} onClick={() => run(() => patch(`/users/${encodeURIComponent(user.id)}`, { disabled: !user.disabled }), user.disabled ? 'Benutzer entsperrt.' : 'Benutzer gesperrt.')}>
          {user.disabled ? 'Entsperren' : 'Sperren'}
        </button>
      </div>
      <h3>Projektzugriffe</h3>
      <ErrorBox error={access.error} />
      <div className="table-wrap" role="region" aria-label={`Projektzugriffe von ${user.name}`} tabIndex={0}>
        <table className="table compact">
          <thead><tr><th>Projekt</th><th>Sichtbarkeit</th><th>Mitglied mit</th><th>wirksam</th><th /></tr></thead>
          <tbody>
            {(access.data ?? []).map((p) => {
              const draft = edit[p.projectId] ?? p.member ?? ['read'];
              return (
                <tr key={p.projectId}>
                  <td>{p.name}{p.archived && <span className="small muted"> (archiviert)</span>}</td>
                  <td>{p.visibility === 'open' ? 'offen' : 'nur Mitglieder'}</td>
                  <td>
                    <div className="perm-inline">
                      {PERMS.filter((x) => x.code !== 'admin').map((x) => (
                        <label key={x.code} className="inline small">
                          <input type="checkbox" aria-label={`${p.name}: ${x.label}`} disabled={x.code === 'read'} checked={x.code === 'read' || draft.includes(x.code)}
                            onChange={(e) => setEdit({ ...edit, [p.projectId]: e.target.checked ? [...draft, x.code] : draft.filter((y) => y !== x.code) })} /> {x.label}
                        </label>
                      ))}
                    </div>
                    <select className="small" aria-label={`${p.name}: Rollenvorlage`} value="" onChange={(e) => {
                      const t = templates.find((x) => x.id === e.target.value);
                      if (t) setEdit({ ...edit, [p.projectId]: t.permissions });
                    }}>
                      <option value="">Vorlage …</option>
                      {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    {!p.member && <span className="small muted"> kein Mitglied</span>}
                  </td>
                  <td>{p.effective.length ? p.effective.map(permLabel).join(', ') : <span className="muted">kein Zugriff</span>}</td>
                  <td className="row-actions">
                    <button className="btn small" onClick={() => run(() => put(`/projects/${p.projectId}/members/${encodeURIComponent(user.id)}`, { permissions: [...new Set(['read', ...draft])] }), `Zugriff auf „${p.name}“ gespeichert.`)}>{p.member ? 'Ändern' : 'Hinzufügen'}</button>
                    {p.member && <button className="btn small danger" onClick={() => run(() => del(`/projects/${p.projectId}/members/${encodeURIComponent(user.id)}`), `Mitgliedschaft in „${p.name}“ entfernt.`)}>Entfernen</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RoleTemplates({ list, onChanged }: { list: any[]; onChanged: () => void }) {
  const { notify } = useApp();
  const [f, setF] = useState({ name: '', description: '', permissions: ['read', 'edit'] as string[] });
  const [edit, setEdit] = useState<Record<string, string[]>>({});
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      onChanged();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  return (
    <Card title="Rollenvorlagen">
      <p className="small muted">Benannte Berechtigungssätze. Benutzer mit Vorlage erhalten Änderungen der Vorlage automatisch.</p>
      <div className="table-wrap" role="region" aria-label="Rollenvorlagen" tabIndex={0}>
        <table className="table compact">
          <thead><tr><th>Vorlage</th><th>Berechtigungen</th><th>Benutzer</th><th /></tr></thead>
          <tbody>
            {list.map((t) => {
              const draft = edit[t.id] ?? t.permissions;
              return (
                <tr key={t.id}>
                  <td>{t.name}{t.builtin && <span className="small muted"> (mitgeliefert)</span>}{t.description && <div className="small muted">{t.description}</div>}</td>
                  <td>
                    <div className="perm-inline">
                      {PERMS.map((x) => (
                        <label key={x.code} className="inline small">
                          <input type="checkbox" aria-label={`${t.name}: ${x.label}`} disabled={x.code === 'read'} checked={x.code === 'read' || draft.includes(x.code)}
                            onChange={(e) => setEdit({ ...edit, [t.id]: e.target.checked ? [...draft, x.code] : draft.filter((y) => y !== x.code) })} /> {x.label}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td>{t.users}</td>
                  <td className="row-actions">
                    <button className="btn small" disabled={!edit[t.id]} onClick={() => run(() => patch(`/role-templates/${t.id}`, { permissions: draft }), `Vorlage „${t.name}“ gespeichert.`)}>Speichern</button>
                    {!t.builtin && <button className="btn small danger" onClick={() => run(() => del(`/role-templates/${t.id}`), `Vorlage „${t.name}“ gelöscht.`)}>Löschen</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="form-row">
        <label>Name der Vorlage <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>Beschreibung <input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
      </div>
      <PermChecks legend="Berechtigungen der neuen Vorlage" value={f.permissions} onChange={(permissions) => setF({ ...f, permissions })} />
      <button className="btn" disabled={!f.name.trim()} onClick={() => run(async () => {
        await post('/role-templates', f);
        setF({ name: '', description: '', permissions: ['read', 'edit'] });
      }, 'Rollenvorlage angelegt.')}>Vorlage anlegen</button>
    </Card>
  );
}

export function UsersPage() {
  const { reloadRef } = useApp();
  const me = useLoad<any>('/me');
  const isAdmin = !!me.data?.permissions.includes('admin');
  const users = useLoad<any[]>(isAdmin ? '/users' : null, [isAdmin]);
  const templates = useLoad<any[]>(isAdmin ? '/role-templates' : null, [isAdmin]);
  const tpl = templates.data ?? [];
  const [sel, setSel] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const selected = users.data?.find((u) => u.id === sel);
  if (me.data && !isAdmin) return <Page title="Benutzer"><Empty>Die Benutzerverwaltung ist der Administration vorbehalten.</Empty></Page>;
  const shown = (users.data ?? []).filter((u) => !q.trim() || `${u.name} ${u.id} ${u.email ?? ''}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Page title="Benutzer" subtitle="Benutzer anlegen, Berechtigungen vergeben, sperren und Projektzugriffe verwalten">
      <ErrorBox error={users.error} />
      <label className="inline">Filter <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, Kennung oder E-Mail" /></label>
      <div className="table-wrap" role="region" aria-label="Benutzer" tabIndex={0}>
        <table className="table">
          <thead><tr><th>Name</th><th>Kennung</th><th>E-Mail</th><th>Berechtigungen</th><th>Rollenvorlage</th><th>Herkunft</th><th>Status</th><th>zuletzt aktiv</th><th /></tr></thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u.id} className={u.disabled ? 'user-disabled' : ''} aria-current={u.id === sel ? 'true' : undefined}>
                <td>{u.name}</td>
                <td><code>{u.id}</code></td>
                <td>{u.email ?? '–'}</td>
                <td className="small">{u.permissions.map(permLabel).join(', ')}</td>
                <td className="small">{tpl.find((t) => t.id === u.roleTemplateId)?.name ?? '–'}</td>
                <td className="small">{ORIGIN[u.origin] ?? u.origin}</td>
                <td>{u.disabled ? <span className="tag st-failed">gesperrt</span> : <span className="tag st-approved">aktiv</span>}</td>
                <td className="small">{u.lastActivity ? new Date(u.lastActivity).toLocaleString('de-DE') : '–'}</td>
                <td><button className="btn small" aria-label={`${u.name} bearbeiten`} onClick={() => setSel(u.id)}>Bearbeiten</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Benutzerauswahl (Demo) in der Navigation mitaktualisieren */}
      {selected && <UserDetail user={selected} templates={tpl} onChanged={() => (users.reload(), templates.reload(), reloadRef())} />}
      <NewUser templates={tpl} onCreated={(id) => (users.reload(), templates.reload(), reloadRef(), setSel(id))} />
      <RoleTemplates list={tpl} onChanged={() => (templates.reload(), users.reload())} />
    </Page>
  );
}
