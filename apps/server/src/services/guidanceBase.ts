// Gemeinsame Grundlagen des Anleitungs-Checks (ADR-051, ADR-057) – ohne Abhängigkeit zur Kapitellogik,
// damit das Qualitätsgate (chapters.ts) den Check nutzen kann.
import { audit, type Ctx, type User } from '../context.js';
import { parseJson } from '../db.js';
import { analyzeGuidance, DEFAULT_LEVELS, GUIDANCE_CODES, GUIDANCE_LABEL, GUIDANCE_OPEN_LABEL, type GuidanceBlock, type GuidanceCode, type GuidanceLevel } from '../domain/guidance.js';
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
  return analyzeGuidance(list, { knownAcronyms: await knownAcronyms(ctx), levels: (await getGuidanceSettings(ctx)).levels });
}

// ---------- Freigabebedingung (ADR-057) ----------

export async function getGuidanceSettings(ctx: Ctx) {
  const r = await ctx.db.get('SELECT guidance_min_score, guidance_levels, guidance_require_must FROM projects WHERE id = ?', ctx.projectId);
  const stored = parseJson<Partial<Record<GuidanceCode, GuidanceLevel>>>(r?.guidance_levels, {});
  const levels = Object.fromEntries(GUIDANCE_CODES.map((c) => [c, stored[c] === 'must' || stored[c] === 'should' ? stored[c] : DEFAULT_LEVELS[c]])) as Record<GuidanceCode, GuidanceLevel>;
  return {
    minScore: r?.guidance_min_score === null || r?.guidance_min_score === undefined ? null : Number(r.guidance_min_score),
    // Punktmodell (ADR-092, F-08): Muss/Soll je Prüfpunkt und ob alle Muss-Punkte Bedingung für Einreichen und Freigabe sind
    levels, requireMust: !!Number(r?.guidance_require_must ?? 0),
    checks: GUIDANCE_CODES.map((c) => ({ code: c, label: GUIDANCE_LABEL[c], level: levels[c], defaultLevel: DEFAULT_LEVELS[c] })),
  };
}

export async function updateGuidanceSettings(ctx: Ctx, input: { minScore?: unknown; levels?: unknown; requireMust?: unknown }, user: User) {
  const cur = await getGuidanceSettings(ctx);
  const v = input.minScore === undefined ? cur.minScore : input.minScore;
  if (v !== null && (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 100)) throw badRequest('minScore muss eine ganze Zahl von 0 bis 100 oder null sein.');
  let levels = cur.levels;
  if (input.levels !== undefined) {
    const l = input.levels as Record<string, unknown>;
    if (!l || typeof l !== 'object' || Array.isArray(l) || Object.entries(l).some(([k, x]) => !GUIDANCE_CODES.includes(k as GuidanceCode) || (x !== 'must' && x !== 'should'))) {
      throw badRequest(`levels: je Prüfpunkt (${GUIDANCE_CODES.join(', ')}) „must“ oder „should“.`);
    }
    levels = { ...levels, ...(l as Record<GuidanceCode, GuidanceLevel>) };
  }
  if (input.requireMust !== undefined && typeof input.requireMust !== 'boolean') throw badRequest('requireMust muss true oder false sein.');
  const requireMust = input.requireMust === undefined ? cur.requireMust : input.requireMust as boolean;
  // nur Abweichungen vom Standard speichern
  const diff = Object.fromEntries(Object.entries(levels).filter(([k, x]) => DEFAULT_LEVELS[k as GuidanceCode] !== x));
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET guidance_min_score = ?, guidance_levels = ?, guidance_require_must = ? WHERE id = ?', v, JSON.stringify(diff), requireMust ? 1 : 0, ctx.projectId);
    await audit(ctx, user.id, 'guidance.settings_changed', 'project', ctx.projectId, { minScore: v, levels: diff, requireMust });
  });
  return getGuidanceSettings(ctx);
}

/** Gate-Prüfung: Mindestwert und/oder alle Muss-Punkte (F-08) – nur, was im Projekt eingestellt ist */
export async function guidanceGateChecks(ctx: Ctx, blocks: Parameters<typeof guidanceForBlocks>[1]) {
  const { minScore, requireMust } = await getGuidanceSettings(ctx);
  if (minScore === null && !requireMust) return [];
  const a = await guidanceForBlocks(ctx, blocks);
  const out = [];
  if (minScore !== null) {
    out.push({
      code: 'guidance_min_score',
      label: `Anleitungs-Check mindestens ${minScore} von 100 (aktuell ${a.score})`,
      passed: a.score >= minScore,
      details: a.checks.filter((c) => c.status !== 'ok').map((c) => `${c.status === 'warning' ? '!' : 'i'} ${GUIDANCE_OPEN_LABEL[c.code]}`),
    });
  }
  if (requireMust) {
    out.push({
      code: 'guidance_must',
      label: `Anleitungs-Check: alle Muss-Punkte erfüllt (${a.points.achieved} von ${a.points.possible} Punkten, offen: ${a.mustOpen.length})`,
      passed: a.mustPassed,
      details: a.mustOpen.map((c) => `! ${GUIDANCE_OPEN_LABEL[c]}`),
    });
  }
  return out;
}
