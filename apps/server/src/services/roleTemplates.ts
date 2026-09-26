// Rollenvorlagen (ADR-047): benannte Berechtigungssätze für Benutzer und Projektmitgliedschaften.
// Mitgelieferte Vorlagen lassen sich anpassen, aber nicht löschen; Benutzer mit Vorlage erhalten Änderungen automatisch.
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Db, type Row } from '../db.js';
import { PERMISSIONS } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';

export const BUILTIN_TEMPLATES = [
  { id: 'rt-leser', name: 'Lesen', description: 'Handbuch und Befunde ansehen', permissions: ['read'] },
  { id: 'rt-redaktion', name: 'Redaktion', description: 'Kapitel bearbeiten, Quellen importieren, Stil korrigieren', permissions: ['read', 'edit'] },
  { id: 'rt-fachpruefung', name: 'Fachprüfung', description: 'Bearbeiten und Widersprüche/Befunde entscheiden', permissions: ['read', 'edit', 'decide'] },
  { id: 'rt-freigabe', name: 'Freigabe', description: 'Entscheiden und Kapitel freigeben', permissions: ['read', 'decide', 'approve'] },
  { id: 'rt-admin', name: 'Administration', description: 'Alle Rechte inkl. Projekte, Benutzer, Einstellungen', permissions: ['read', 'edit', 'decide', 'approve', 'admin'] },
];

export async function seedRoleTemplates(db: Db) {
  for (const t of BUILTIN_TEMPLATES) {
    await db.run('INSERT INTO role_templates (id, name, description, permissions, builtin, created_by, created_at) VALUES (?, ?, ?, ?, 1, ?, ?) ON CONFLICT (id) DO NOTHING',
      t.id, t.name, t.description, json(t.permissions), 'system', now());
  }
}

const dto = (r: Row) => ({
  id: r.id as string, name: r.name as string, description: (r.description as string | null) ?? null, permissions: parseJson<string[]>(r.permissions, []),
  builtin: !!r.builtin, users: Number(r.users ?? 0),
});

export async function listRoleTemplates(db: Db) {
  return (await db.all('SELECT t.*, (SELECT COUNT(*) FROM users u WHERE u.role_template_id = t.id) AS users FROM role_templates t ORDER BY t.builtin DESC, t.name')).map(dto);
}

export async function getRoleTemplate(db: Db, id: unknown) {
  if (typeof id !== 'string' || !id) throw badRequest('Rollenvorlage fehlt.');
  const r = await db.get('SELECT t.*, (SELECT COUNT(*) FROM users u WHERE u.role_template_id = t.id) AS users FROM role_templates t WHERE t.id = ?', id);
  if (!r) throw notFound(`Rollenvorlage ${id}`);
  return dto(r);
}

function perms(v: unknown) {
  if (!Array.isArray(v) || v.some((p) => !(PERMISSIONS as readonly unknown[]).includes(p))) throw badRequest(`permissions: erlaubt sind ${PERMISSIONS.join(', ')}.`);
  const set = new Set(v as string[]);
  set.add('read');
  return PERMISSIONS.filter((p) => set.has(p));
}

export async function createRoleTemplate(ctx: Ctx, input: Record<string, unknown>, user: User) {
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 80) : '';
  if (!name) throw badRequest('name ist Pflicht.');
  if (await ctx.db.get('SELECT 1 FROM role_templates WHERE LOWER(name) = LOWER(?)', name)) throw conflict(`Rollenvorlage „${name}“ existiert bereits.`);
  const id = newId('rt');
  const p = perms(input.permissions);
  const description = typeof input.description === 'string' && input.description.trim() ? input.description.trim().slice(0, 300) : null;
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO role_templates (id, name, description, permissions, builtin, created_by, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)', id, name, description, json(p), user.id, now());
    await audit(ctx, user.id, 'role_template.created', 'role_template', id, { name, permissions: p });
  });
  return getRoleTemplate(ctx.db, id);
}

/** Ändern; neue Berechtigungen gehen auf alle lokalen Benutzer mit dieser Vorlage über (nicht auf OIDC-Benutzer) */
export async function updateRoleTemplate(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const t = await getRoleTemplate(ctx.db, id);
  const name = input.name === undefined ? t.name : typeof input.name === 'string' && input.name.trim() ? input.name.trim().slice(0, 80) : '';
  if (!name) throw badRequest('name darf nicht leer sein.');
  if (name.toLowerCase() !== t.name.toLowerCase() && await ctx.db.get('SELECT 1 FROM role_templates WHERE LOWER(name) = LOWER(?)', name)) throw conflict(`Rollenvorlage „${name}“ existiert bereits.`);
  const p = input.permissions === undefined ? t.permissions : perms(input.permissions);
  const description = input.description === undefined ? t.description : typeof input.description === 'string' && input.description.trim() ? input.description.trim().slice(0, 300) : null;
  const affected = (await ctx.db.all("SELECT id, permissions FROM users WHERE role_template_id = ? AND id NOT LIKE 'oidc:%'", id));
  // der letzte aktive Administrator darf nicht über eine Vorlage herabgestuft werden
  if (!p.includes('admin') && affected.some((u) => parseJson<string[]>(u.permissions, []).includes('admin'))) {
    const others = (await ctx.db.all('SELECT id, permissions, role_template_id FROM users WHERE disabled_at IS NULL'))
      .filter((u) => u.role_template_id !== id && parseJson<string[]>(u.permissions, []).includes('admin'));
    if (!others.length) throw conflict('Die Vorlage würde dem letzten aktiven Administrator die Administration entziehen.');
  }
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE role_templates SET name = ?, description = ?, permissions = ?, updated_at = ? WHERE id = ?', name, description, json(p), now(), id);
    for (const u of affected) await ctx.db.run('UPDATE users SET permissions = ? WHERE id = ?', json(p), u.id);
    await audit(ctx, user.id, 'role_template.updated', 'role_template', id, { name, permissions: p, users: affected.length });
  });
  return getRoleTemplate(ctx.db, id);
}

export async function deleteRoleTemplate(ctx: Ctx, id: string, user: User) {
  const t = await getRoleTemplate(ctx.db, id);
  if (t.builtin) throw conflict('Mitgelieferte Rollenvorlagen können nicht gelöscht werden.');
  await ctx.db.tx(async () => {
    // Benutzer behalten ihre Berechtigungen, verlieren nur die Verknüpfung
    await ctx.db.run('UPDATE users SET role_template_id = NULL WHERE role_template_id = ?', id);
    await ctx.db.run('DELETE FROM role_templates WHERE id = ?', id);
    await audit(ctx, user.id, 'role_template.deleted', 'role_template', id, { name: t.name });
  });
}
