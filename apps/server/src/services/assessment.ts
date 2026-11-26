// Kapitelbewertung mit fünf Kriterien und Ampel (ADR-103, S-07) und Plausibilität je Aussage (W-02) – aus den vorhandenen
// Werten: Schreibstil und Lesbarkeit, Anleitungs-Check, Tonalität, Evidenz je Absatz mit Widersprüchen, Zahlen in den Quellen.
import { getSettings, type Ctx } from '../context.js';
import {
  classifyBlock, CRITERIA, CRITERION_HINT, CRITERION_LABEL, factValue, overall, plausibilityValue, STATEMENT_LABEL, traffic, TRAFFIC_LABEL,
  type Criterion, type StatementSource,
} from '../domain/assessment.js';
import { CONFIRMED_EVIDENCE } from '../domain/reference.js';
import { notFound } from '../problem.js';
import { chapterGuidance } from './guidance.js';
import { SKIP_SECTIONS } from './guidanceBase.js';
import { evidenceForVersion } from './insights.js';
import { checkChapterVersion } from './style.js';

/** Vom Generator aus den Rollen-Metadaten erzeugte Liste (domain/generator) */
const ROLE_LIST = /^Dieses Kapitel betrifft folgende Rollen:/;

/** Plausibilität je Aussage einer Kapitelversion (W-02) */
export async function plausibility(ctx: Ctx, versionId: string) {
  const ev = await evidenceForVersion(ctx, versionId);
  const ids = [...new Set(ev.blocks.flatMap((b) => b.sources.map((s) => s.snippetId)))];
  // Quellen in offenen Widersprüchen der Qualitätsanalyse
  const contra = new Set<string>();
  for (let i = 0; i < ids.length; i += 400) {
    const part = ids.slice(i, i + 400);
    const q = part.map(() => '?').join(',');
    for (const r of await ctx.db.all(
      `SELECT snippet_a_id, snippet_b_id FROM quality_findings WHERE type = 'contradiction' AND status IN ('open', 'deferred') AND (snippet_a_id IN (${q}) OR snippet_b_id IN (${q}))`, ...part, ...part,
    )) {
      if (r.snippet_a_id) contra.add(r.snippet_a_id);
      if (r.snippet_b_id) contra.add(r.snippet_b_id);
    }
  }
  const minSupport = (await getSettings(ctx.db)).rewrite.minSupport;
  // Quellen- und Freigabestatus sowie die vom Generator erzeugte Rollenliste sind keine Aussagen des Kapitels
  const blocks = ev.blocks.filter((b) => !SKIP_SECTIONS.has(b.section) && !(b.section === 'responsibilities' && ROLE_LIST.test(b.text)));
  const statements = blocks.flatMap((b) => classifyBlock(
    { id: b.blockId, section: b.sectionTitle, kind: b.kind, text: b.text },
    b.sources.map((s): StatementSource => ({
      label: `S${s.seq}`, snippetId: s.snippetId, seq: s.seq, text: s.text,
      confirmed: CONFIRMED_EVIDENCE.includes(s.evidenceStatus), contradicted: !!s.excludedReason || contra.has(s.snippetId),
    })),
    minSupport,
  ));
  const { value, counts } = plausibilityValue(statements);
  return {
    versionId: ev.versionId, chapterId: ev.chapterId, title: ev.title, versionNo: ev.versionNo, status: ev.status,
    value, traffic: traffic(value), counts, labels: STATEMENT_LABEL,
    statements: statements.map((s) => ({ ...s, label: STATEMENT_LABEL[s.class] })),
    facts: factValue(blocks.filter((b) => b.kind !== 'gap').map((b) => ({ text: b.text, sourceText: b.sources.map((s) => s.text).join('\n') }))),
  };
}

/** Kapitelbewertung mit fünf Kriterien und Ampel (S-07) */
export async function chapterAssessment(ctx: Ctx, versionId: string) {
  const plaus = await plausibility(ctx, versionId);
  const style = await checkChapterVersion(ctx, versionId);
  const guide = await chapterGuidance(ctx, versionId);
  // Sprache: Stilwert der Sätze (gewichtet) und Anteil erfüllter Lesbarkeitsziele
  let sentences = 0;
  let weighted = 0;
  let toneHits = 0;
  let toneChecked = 0;
  for (const b of style.blocks) {
    const n = b.analysis.sentences.length;
    sentences += n;
    weighted += b.analysis.score * n;
    if (b.tone) {
      toneChecked += n;
      toneHits += b.analysis.sentences.filter((s) => s.issues.some((i) => i.rule === 'tone')).length;
    }
  }
  const styleScore = sentences ? weighted / sentences : 100;
  const checks = (style.readability as any)?.checks ?? [];
  const readShare = checks.length ? checks.filter((c: any) => c.ok).length / checks.length : 1;
  const values: Record<Criterion, number> = {
    language: Math.round(0.7 * styleScore + 30 * readShare),
    goal: Math.round(guide.score),
    tone: toneChecked ? Math.round((100 * (toneChecked - toneHits)) / toneChecked) : 100,
    sources: plaus.value,
    facts: plaus.facts.value,
  };
  const details: Record<Criterion, string> = {
    language: `Stilwert ${Math.round(styleScore)}, Lesbarkeit ${checks.filter((c: any) => c.ok).length} von ${checks.length} Sollwerten`,
    goal: `${guide.passed} von ${guide.total} Punkten des Anleitungs-Checks erfüllt`,
    tone: toneChecked ? `${toneHits} von ${toneChecked} Sätzen mit Befund` : 'Tonprüfung ausgeschaltet oder keine Sätze',
    sources: `${plaus.counts.supported} belegt, ${plaus.counts.unsupported} unbelegt, ${plaus.counts.contradiction} Widerspruch, ${plaus.counts.missing} fehlend`,
    facts: plaus.facts.total ? `${plaus.facts.found} von ${plaus.facts.total} Zahlen und Kennungen in den Quellen${plaus.facts.missing.length ? ` (fehlen: ${plaus.facts.missing.join(', ')})` : ''}` : 'keine Zahlen oder Kennungen im Text',
  };
  return {
    versionId: plaus.versionId, chapterId: plaus.chapterId, title: plaus.title, versionNo: plaus.versionNo, status: plaus.status,
    overall: { ...overall(values), label: TRAFFIC_LABEL[overall(values).traffic] },
    criteria: CRITERIA.map((c) => ({ code: c, label: CRITERION_LABEL[c], hint: CRITERION_HINT[c], value: values[c], traffic: traffic(values[c]), trafficLabel: TRAFFIC_LABEL[traffic(values[c])], detail: details[c] })),
    plausibility: { value: plaus.value, counts: plaus.counts, statements: plaus.statements },
  };
}

/** Übersicht: neueste Version je Kapitel der Quellen mit Ampel (ohne abgelöste Kapitel) */
export async function assessmentOverview(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT c.id, c.title, c.position, v.id AS version_id FROM chapters c JOIN generated_chapter_versions v ON v.chapter_id = c.id
     WHERE c.project_id = ? AND c.outline_family_id IS NULL AND c.history_at IS NULL AND v.status <> 'superseded'
       AND v.version_no = (SELECT MAX(x.version_no) FROM generated_chapter_versions x WHERE x.chapter_id = c.id AND x.status <> 'superseded')
     ORDER BY c.position, c.title`, ctx.projectId,
  );
  const items: { chapterId: string; title: string; versionId: string; versionNo: number; status: string; overall: unknown; criteria: unknown[]; trafficRank: number }[] = [];
  for (const r of rows) {
    const a = await chapterAssessment(ctx, r.version_id);
    items.push({ chapterId: r.id, title: r.title, versionId: r.version_id, versionNo: a.versionNo, status: a.status, overall: a.overall, criteria: a.criteria.map(({ code, label, value, traffic: t, trafficLabel }) => ({ code, label, value, traffic: t, trafficLabel })), trafficRank: ['red', 'yellow', 'green'].indexOf(a.overall.traffic) });
  }
  const count = (t: string) => items.filter((i) => (i.overall as { traffic: string }).traffic === t).length;
  return { items, summary: { chapters: items.length, green: count('green'), yellow: count('yellow'), red: count('red') }, criteria: CRITERIA.map((c) => ({ code: c, label: CRITERION_LABEL[c], hint: CRITERION_HINT[c] })) };
}

export async function assertVersion(ctx: Ctx, versionId: string) {
  if (!(await ctx.db.get('SELECT v.id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE v.id = ? AND c.project_id = ?', versionId, ctx.projectId))) throw notFound(`Kapitelversion ${versionId}`);
}
