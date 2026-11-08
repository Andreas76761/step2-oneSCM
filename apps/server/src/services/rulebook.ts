// Regelwerk (Etappe 100): Regeln allgemein oder je Kapitel pflegen; geprüft in der Analyse (Befund „Regelwerk“) und vor der Freigabe.
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { SEVERITIES } from '../domain/reference.js';
import { RULE_KINDS, RULE_KIND_LABELS, ruleMatcher, rulesFor, ruleViolations, violationReason, type RulebookRule, type RuleKind } from '../domain/rulebook.js';
import type { GateCheck } from '../domain/gate.js';
import { isChapterSummary } from '../domain/generator.js';
import { badRequest, notFound } from '../problem.js';

const dto = (r: Row, chapterTitle?: string | null): RulebookRule & { kindLabel: string; chapterTitle: string | null; createdBy: string; createdAt: string; updatedAt: string | null } => ({
  id: r.id, chapterId: r.chapter_id ?? null, chapterTitle: chapterTitle ?? null, kind: r.kind as RuleKind, kindLabel: RULE_KIND_LABELS[r.kind as RuleKind] ?? r.kind,
  term: r.term, message: r.message ?? null, severity: r.severity, active: !!r.active, createdBy: r.created_by, createdAt: r.created_at, updatedAt: r.updated_at ?? null,
});

/** aktive und inaktive Regeln des Projekts (für Analyse und Freigabe nur die aktiven, siehe rulesFor) */
export async function loadRules(ctx: Ctx): Promise<RulebookRule[]> {
  return (await ctx.db.all('SELECT * FROM rulebook_rules WHERE project_id = ? ORDER BY created_at', ctx.projectId)).map((r) => dto(r));
}

export async function listRules(ctx: Ctx) {
  const rows = await ctx.db.all(
    'SELECT r.*, c.title AS chapter_title FROM rulebook_rules r LEFT JOIN chapters c ON c.id = r.chapter_id WHERE r.project_id = ? ORDER BY r.chapter_id IS NOT NULL, c.position, r.created_at',
    ctx.projectId,
  );
  return { kinds: RULE_KINDS.map((k) => ({ code: k, label: RULE_KIND_LABELS[k] })), severities: SEVERITIES, rules: rows.map((r) => dto(r, r.chapter_title)) };
}

interface RuleInput { chapterId?: string | null; kind?: string; term?: string; message?: string | null; severity?: string; active?: boolean }

async function validate(ctx: Ctx, input: RuleInput, base?: Row) {
  const kind = String(input.kind ?? base?.kind ?? '');
  if (!(RULE_KINDS as readonly string[]).includes(kind)) throw badRequest(`kind muss eines von ${RULE_KINDS.join(', ')} sein.`);
  const term = String(input.term ?? base?.term ?? '').trim();
  if (!term || term.length > 200) throw badRequest('term (Begriff bzw. Muster, 1–200 Zeichen) erforderlich.');
  if (!ruleMatcher({ kind: kind as RuleKind, term })) throw badRequest('Das Muster ist ungültig oder riskant (verschachtelte Wiederholungen, Rückverweise oder Lookbehind sind nicht erlaubt).');
  const severity = String(input.severity ?? base?.severity ?? 'medium');
  if (!(SEVERITIES as readonly string[]).includes(severity)) throw badRequest(`severity muss eines von ${SEVERITIES.join(', ')} sein.`);
  const chapterId = input.chapterId !== undefined ? (input.chapterId || null) : (base?.chapter_id ?? null);
  if (chapterId && !(await ctx.db.get('SELECT 1 FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId))) throw notFound(`Kapitel ${chapterId}`);
  const message = input.message !== undefined ? (String(input.message ?? '').trim().slice(0, 500) || null) : (base?.message ?? null);
  const active = input.active !== undefined ? !!input.active : base ? !!base.active : true;
  return { kind, term, severity, chapterId, message, active };
}

async function ruleRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT r.*, c.title AS chapter_title FROM rulebook_rules r LEFT JOIN chapters c ON c.id = r.chapter_id WHERE r.id = ? AND r.project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Regel ${id}`);
  return r;
}

export async function createRule(ctx: Ctx, input: RuleInput, user: User) {
  const v = await validate(ctx, input);
  const id = newId('rule');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO rulebook_rules (id, project_id, chapter_id, kind, term, message, severity, active, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, v.chapterId, v.kind, v.term, v.message, v.severity, v.active ? 1 : 0, user.id, now(),
    );
    await audit(ctx, user.id, 'rulebook_rule.created', 'rulebook_rule', id, v);
  });
  const row = await ruleRow(ctx, id);
  return dto(row, row.chapter_title);
}

export async function updateRule(ctx: Ctx, id: string, input: RuleInput, user: User) {
  const v = await validate(ctx, input, await ruleRow(ctx, id));
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE rulebook_rules SET chapter_id = ?, kind = ?, term = ?, message = ?, severity = ?, active = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      v.chapterId, v.kind, v.term, v.message, v.severity, v.active ? 1 : 0, user.id, now(), id);
    await audit(ctx, user.id, 'rulebook_rule.updated', 'rulebook_rule', id, v);
  });
  const row = await ruleRow(ctx, id);
  return dto(row, row.chapter_title);
}

export async function deleteRule(ctx: Ctx, id: string, user: User) {
  await ruleRow(ctx, id);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM rulebook_rules WHERE id = ?', id);
    await audit(ctx, user.id, 'rulebook_rule.deleted', 'rulebook_rule', id, {});
  });
}

/** Freigabe: Absätze der Version gegen Regeln mit Schweregrad „Blocker“ (übrige Regeln melden sich als Befund der Analyse) */
export async function rulebookGateCheck(ctx: Ctx, chapterId: string, blocks: { id: string; kind: string; section: string; text: string }[]): Promise<GateCheck> {
  // wie in der Analyse: Pflichtbegriffe nicht im Sammelkapitel „Ohne Kapitel“
  const none = (await ctx.db.get('SELECT key FROM chapters WHERE id = ?', chapterId))?.key === '__none__';
  const rules = rulesFor(await loadRules(ctx), chapterId).filter((r) => r.severity === 'blocker' && !(none && r.kind === 'required'));
  // nur Inhalt: keine Lücken-Hinweise, keine generierten Übersichten (Rollen, Quellen- und Freigabestatus mit Dateipfaden)
  const texts = blocks.filter((b) => b.kind !== 'gap' && !isChapterSummary(b.section, b.text)).map((b) => ({ id: b.id, text: b.text }));
  const found = ruleViolations(rules, texts);
  return {
    code: 'rulebook',
    label: 'Regelwerk: keine Verstöße gegen Blocker-Regeln',
    passed: found.length === 0,
    details: found.map((v) => `${v.id ? `Block ${v.id}: ` : ''}${violationReason(v)}`),
  };
}
