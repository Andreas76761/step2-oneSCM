// Gemeinsame Grundlagen des Anleitungs-Checks (ADR-051, ADR-057) – ohne Abhängigkeit zur Kapitellogik,
// damit das Qualitätsgate (chapters.ts) den Check nutzen kann.
import { audit, type Ctx, type User } from '../context.js';
import { analyzeGuidance, GUIDANCE_OPEN_LABEL, type GuidanceBlock } from '../domain/guidance.js';
import { badRequest } from '../problem.js';

/** Der Abschnitt „Quellen- und Freigabestatus“ ist Verwaltungsinformation und kein Anleitungstext */
export const SKIP_SECTIONS = new Set(['status']);

export async function knownAcronyms(ctx: Ctx) {
  const abbr = (await ctx.db.all('SELECT abbreviation FROM abbreviations WHERE project_id = ?', ctx.projectId)).map((r) => String(r.abbreviation).trim().toUpperCase());
  const terms = (await ctx.db.all("SELECT preferred FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId)).map((r) => String(r.preferred).trim());
  return new Set([...abbr, ...terms.filter((t) => /^[\p{Lu}\d-]{2,8}$/u.test(t))]);
}

/** Anleitungs-Check für eine Liste von Absätzen einer Kapitelversion */
export async function guidanceForBlocks(ctx: Ctx, blocks: { id: string; section: string; kind: string; text: string; versionNo: number; mode: string }[]) {
  const list: GuidanceBlock[] = blocks.filter((b) => !SKIP_SECTIONS.has(b.section)).map((b) => ({ id: b.id, section: b.section, kind: b.kind, text: b.text, versionNo: b.versionNo, locked: b.mode === 'locked' }));
  return analyzeGuidance(list, { knownAcronyms: await knownAcronyms(ctx) });
}

// ---------- Freigabebedingung (ADR-057) ----------

export async function getGuidanceSettings(ctx: Ctx) {
  const r = await ctx.db.get('SELECT guidance_min_score FROM projects WHERE id = ?', ctx.projectId);
  return { minScore: r?.guidance_min_score === null || r?.guidance_min_score === undefined ? null : Number(r.guidance_min_score) };
}

export async function updateGuidanceSettings(ctx: Ctx, input: { minScore?: unknown }, user: User) {
  const v = input.minScore;
  if (v !== null && (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 100)) throw badRequest('minScore muss eine ganze Zahl von 0 bis 100 oder null sein.');
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET guidance_min_score = ? WHERE id = ?', v, ctx.projectId);
    await audit(ctx, user.id, 'guidance.settings_changed', 'project', ctx.projectId, { minScore: v });
  });
  return getGuidanceSettings(ctx);
}

/** Gate-Prüfung: nur wenn ein Mindestwert eingestellt ist */
export async function guidanceGateCheck(ctx: Ctx, blocks: Parameters<typeof guidanceForBlocks>[1]) {
  const { minScore } = await getGuidanceSettings(ctx);
  if (minScore === null) return null;
  const a = await guidanceForBlocks(ctx, blocks);
  return {
    code: 'guidance_min_score',
    label: `Anleitungs-Check mindestens ${minScore} von 100 (aktuell ${a.score})`,
    passed: a.score >= minScore,
    details: a.checks.filter((c) => c.status !== 'ok').map((c) => `${c.status === 'warning' ? '!' : 'i'} ${GUIDANCE_OPEN_LABEL[c.code]}`),
  };
}
