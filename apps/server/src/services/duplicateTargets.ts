// Zielkapitel je Dopplung (ADR-084, F-18): „zusammenführen in Kapitel X“ der Gesamtgliederung. Die Wahl setzt das
// Gliederungs-Label auf beide Chunks, so dass sie unter „Kapitel ↔ Quellen“ zusammen erscheinen. Vorschlag aus F-13.
import { audit, type Ctx, type User } from '../context.js';
import { now } from '../db.js';
import { suggestOutline } from '../domain/outlineSuggest.js';
import { badRequest, notFound } from '../problem.js';
import { setChunkLabels } from './metadata.js';
import { outlineProfiles } from './metadataOutline.js';

export async function listDuplicateTargets(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT f.id, f.status, a.text AS a_text, b.text AS b_text, t.outline_label_id, t.note, t.decided_by, t.decided_at, l.code, l.name_de
     FROM quality_findings f JOIN text_snippets a ON a.id = f.snippet_a_id LEFT JOIN text_snippets b ON b.id = f.snippet_b_id
     LEFT JOIN duplicate_targets t ON t.finding_id = f.id LEFT JOIN metadata_labels l ON l.id = t.outline_label_id
     WHERE f.project_id = ? AND f.type = 'duplicate'`, ctx.projectId,
  );
  const profiles = await outlineProfiles(ctx);
  return rows.map((r) => ({
    findingId: r.id,
    target: r.outline_label_id ? { labelId: r.outline_label_id, code: r.code, nameDe: r.name_de, note: r.note ?? null, decidedBy: r.decided_by, decidedAt: r.decided_at } : null,
    suggestion: r.outline_label_id ? null : suggestOutline(profiles, { text: `${r.a_text} ${r.b_text ?? ''}`, headings: [], labelIds: [] }, { limit: 1 })[0] ?? null,
  }));
}

export async function setDuplicateTarget(ctx: Ctx, findingId: string, input: { outlineLabelId?: unknown; note?: unknown }, user: User) {
  const f = await ctx.db.get("SELECT id, seq, snippet_a_id, snippet_b_id FROM quality_findings WHERE id = ? AND project_id = ? AND type = 'duplicate'", findingId, ctx.projectId);
  if (!f) throw notFound(`Dopplung ${findingId}`);
  const label = await ctx.db.get("SELECT id, code FROM metadata_labels WHERE id = ? AND project_id = ? AND label_group = 'outline' AND archived_at IS NULL", String(input.outlineLabelId ?? ''), ctx.projectId);
  if (!label) throw badRequest('outlineLabelId ist kein Gliederungspunkt dieses Projekts.');
  const note = input.note === undefined || input.note === null ? null : String(input.note).trim().slice(0, 500) || null;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO duplicate_targets (finding_id, project_id, outline_label_id, note, decided_by, decided_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (finding_id) DO UPDATE SET outline_label_id = excluded.outline_label_id, note = excluded.note, decided_by = excluded.decided_by, decided_at = excluded.decided_at`,
      findingId, ctx.projectId, label.id, note, user.id, now(),
    );
    await audit(ctx, user.id, 'duplicate.target_set', 'finding', findingId, { outline: label.code, note });
  });
  // beide Textabschnitte dem Zielkapitel zuordnen (eigene Transaktion und Audit der Label-Zuordnung)
  await setChunkLabels(ctx, { snippetIds: [f.snippet_a_id, f.snippet_b_id].filter(Boolean), add: [label.id] }, user);
  return (await listDuplicateTargets(ctx)).find((t) => t.findingId === findingId);
}

export async function removeDuplicateTarget(ctx: Ctx, findingId: string, user: User) {
  const res = await ctx.db.run('DELETE FROM duplicate_targets WHERE finding_id = ? AND project_id = ?', findingId, ctx.projectId);
  if (!res.changes) throw notFound(`Zielkapitel zu ${findingId}`);
  await audit(ctx, user.id, 'duplicate.target_removed', 'finding', findingId, {});
}
