// Vier Prüferprofile (ADR-105, W-12): fachlich, Redaktion, Compliance, Endanwender – regelbasiert aus den vorhandenen
// Prüfungen, auf Wunsch ergänzt durch den KI-Dienst je Profil. Jede Prüfung wird gespeichert (Verlauf je Kapitelversion).
import { audit, privacyNames, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import { assessReadability, readability } from '../domain/readability.js';
import {
  compliancePromises, endUserLanguage, missingWarnings, parseAiFindings, PROFILE_FOCUS, PROFILE_LABEL, profileScore, REVIEW_PROFILES, SEVERITY_LABEL,
  type ReviewBlock, type ReviewFinding, type ReviewProfile, type Severity,
} from '../domain/reviewProfiles.js';
import { traffic } from '../domain/assessment.js';
import { LlmError } from '../llm.js';
import { badRequest, Problem } from '../problem.js';
import { plausibility } from './assessment.js';
import { getChapterVersion } from './chapters.js';
import { chapterGuidance } from './guidance.js';
import { SKIP_SECTIONS } from './guidanceBase.js';
import { checkChapterVersion } from './style.js';

/** Funde je Profil höchstens (die wichtigsten zuerst) */
const MAX_FINDINGS = 40;
const ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
const TRAFFIC_LABEL: Record<string, string> = { green: 'grün', yellow: 'gelb', red: 'rot' };
const ROLE_LIST = /^Dieses Kapitel betrifft folgende Rollen:/;

const PROMPT = (profile: ReviewProfile) => `Du prüfst ein Kapitel eines Software-Benutzerhandbuchs (oneSCM) als Prüfer mit dem Profil „${PROFILE_LABEL[profile]}“.
Blick des Profils: ${PROFILE_FOCUS[profile]}
Regeln:
- Nur echte Mängel, keine Geschmacksfragen; je Fund der Absatz (blockId aus „blocks“), ein wörtliches Zitat (quote), der Mangel (message), ein Vorschlag (suggestion) und severity high, medium oder low.
- Funde aus „known“ nicht wiederholen. Keine Aussagen über Inhalte außerhalb des Kapitels.
Antworte nur mit JSON: {"findings": [{"blockId": "…", "quote": "…", "message": "…", "suggestion": "…", "severity": "medium"}]}`;

type Input = { profiles?: unknown; ai?: unknown };

async function rulesFindings(ctx: Ctx, versionId: string, blocks: ReviewBlock[], profiles: ReviewProfile[]) {
  const out: Record<ReviewProfile, ReviewFinding[]> = { domain: [], editorial: [], compliance: [], enduser: [] };
  const sectionOf = new Map(blocks.map((b) => [b.id, b.sectionTitle]));
  const cut = (s: string) => (s.length > 140 ? `${s.slice(0, 140)} …` : s);
  const needGuidance = profiles.some((p) => p !== 'domain');
  const guide = needGuidance ? await chapterGuidance(ctx, versionId) : null;
  const failed = (codes: string[] | null, not: string[] = []) => (guide?.checks ?? []).filter((c: any) => c.status !== 'ok' && (codes ? codes.includes(c.code) : !not.includes(c.code)));
  const fromCheck = (profile: ReviewProfile, c: any): ReviewFinding => ({
    profile, severity: c.status === 'warning' ? 'medium' : 'low', rule: `guidance.${c.code}`, message: c.message, blockId: c.items[0]?.blockId ?? null,
    section: c.items[0]?.section ?? null, excerpt: c.items.map((i: any) => i.excerpt).filter(Boolean).slice(0, 2).join(' · '), suggestion: c.hint, origin: 'rules',
  });

  if (profiles.includes('domain')) {
    const p = await plausibility(ctx, versionId);
    for (const s of p.statements as any[]) {
      if (s.class === 'supported') continue;
      out.domain.push({
        profile: 'domain', severity: s.class === 'contradiction' ? 'high' : 'medium', rule: `statement.${s.class}`, message: `${s.label}: ${s.reason}`,
        blockId: s.blockId, section: s.section, excerpt: cut(s.text), suggestion: s.class === 'missing' ? 'Thema mit bestätigter Quelle belegen oder streichen.' : 'Aussage mit der Quelle abgleichen, belegen oder streichen.', origin: 'rules',
      });
    }
    if (p.facts.missing.length) out.domain.push({ profile: 'domain', severity: 'high', rule: 'facts', message: `Zahlen oder Kennungen ohne Quelle: ${p.facts.missing.join(', ')}`, blockId: null, section: null, excerpt: '', suggestion: 'Werte mit der Quelle prüfen.', origin: 'rules' });
  }
  if (profiles.includes('editorial')) {
    const style = await checkChapterVersion(ctx, versionId);
    for (const b of style.blocks) {
      for (const s of b.analysis.sentences) {
        for (const i of s.issues.filter((x) => x.severity === 'warning')) {
          out.editorial.push({ profile: 'editorial', severity: 'low', rule: `style.${i.rule}`, message: i.message, blockId: b.id, section: b.section, excerpt: cut(s.text), suggestion: i.fix ? `Ersetzen durch „${i.fix.replacement}“` : null, origin: 'rules' });
        }
      }
    }
    for (const c of failed(null, ['abbreviations', 'warning_schema'])) out.editorial.push(fromCheck('editorial', c));
  }
  if (profiles.includes('compliance')) {
    const names = await privacyNames(ctx.db);
    for (const b of blocks) {
      for (const h of detectPrivacy(b.text, { names })) out.compliance.push({ profile: 'compliance', severity: 'high', rule: `privacy.${h.kind}`, message: `Mögliche personenbezogene Daten (${h.kind}): „${h.match}“`, blockId: b.id, section: b.sectionTitle, excerpt: cut(b.text), suggestion: 'Durch fiktive oder pseudonyme Angaben ersetzen.', origin: 'rules' });
    }
    out.compliance.push(...compliancePromises(blocks), ...missingWarnings(blocks));
    for (const c of failed(['warning_schema'])) out.compliance.push({ ...fromCheck('compliance', c), severity: 'medium' });
  }
  if (profiles.includes('enduser')) {
    const read = assessReadability(readability(blocks.map((b) => b.text)), 'enduser');
    for (const c of read.checks.filter((x) => !x.ok)) out.enduser.push({ profile: 'enduser', severity: 'medium', rule: `readability.${c.code}`, message: `Lesbarkeit für Endanwender: ${c.label} nicht erreicht (Wert ${c.value}).`, blockId: null, section: null, excerpt: '', suggestion: 'Kürzere Sätze, aktive Formulierungen, bekannte Wörter.', origin: 'rules' });
    for (const c of failed(['abbreviations'])) out.enduser.push(fromCheck('enduser', c));
    out.enduser.push(...endUserLanguage(blocks));
  }
  for (const p of profiles) for (const f of out[p]) if (f.blockId && !f.section) f.section = sectionOf.get(f.blockId) ?? null;
  return out;
}

async function aiFindings(ctx: Ctx, profile: ReviewProfile, blocks: ReviewBlock[], known: ReviewFinding[]) {
  const payload = { task: 'review', profile, blocks: blocks.map((b) => ({ id: b.id, section: b.sectionTitle, kind: b.kind, text: b.text })), known: known.slice(0, 20).map((f) => ({ blockId: f.blockId, message: f.message })) };
  let raw: string;
  try {
    raw = (await ctx.llm!.complete({ system: PROMPT(profile), user: `Prüfe das Kapitel. Eingabedaten:\n<<<DATA\n${JSON.stringify(payload, null, 2)}\nDATA>>>` })).text;
  } catch (e) {
    if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', `KI-Dienst nicht verfügbar: ${e.message}`);
    throw e;
  }
  const cleaned = raw.replace(/```(?:json)?/gi, '');
  try {
    return parseAiFindings(profile, JSON.parse(cleaned.slice(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1)), blocks);
  } catch {
    return [];
  }
}

const reviewDto = (r: Record<string, any>) => {
  const findings = parseJson<ReviewFinding[]>(r.findings, []);
  return {
    id: r.id as string, versionId: r.chapter_version_id as string, profile: r.profile as ReviewProfile, label: PROFILE_LABEL[r.profile as ReviewProfile], focus: PROFILE_FOCUS[r.profile as ReviewProfile],
    method: r.method as string, score: Number(r.score), traffic: traffic(Number(r.score)), trafficLabel: TRAFFIC_LABEL[traffic(Number(r.score))], note: r.note ?? null,
    counts: { high: findings.filter((f) => f.severity === 'high').length, medium: findings.filter((f) => f.severity === 'medium').length, low: findings.filter((f) => f.severity === 'low').length },
    findings: findings.map((f) => ({ ...f, severityLabel: SEVERITY_LABEL[f.severity] })), createdBy: r.created_by as string, createdAt: r.created_at as string,
  };
};

/** Kapitelversion mit den gewählten Profilen prüfen (Standard: alle vier); `ai` ergänzt Funde des KI-Dienstes */
export async function runProfileReviews(ctx: Ctx, versionId: string, input: Input, user: User) {
  const profiles = Array.isArray(input.profiles) && input.profiles.length ? input.profiles : [...REVIEW_PROFILES];
  const bad = profiles.filter((p) => !(REVIEW_PROFILES as readonly unknown[]).includes(p));
  if (bad.length) throw badRequest(`Unbekannte Profile: ${bad.join(', ')} – erlaubt: ${REVIEW_PROFILES.join(', ')}.`);
  const chosen = REVIEW_PROFILES.filter((p) => profiles.includes(p));
  const v = await getChapterVersion(ctx, versionId);
  const blocks: ReviewBlock[] = v.sections.filter((s) => !SKIP_SECTIONS.has(s.code)).flatMap((s) => (s.blocks as any[])
    .filter((b) => b.kind !== 'gap' && b.kind !== 'xref' && b.text.trim() && !(s.code === 'responsibilities' && ROLE_LIST.test(b.text)))
    .map((b) => ({ id: b.id as string, section: s.code as string, sectionTitle: s.title as string, kind: b.kind as string, text: b.text as string })));
  const rules = await rulesFindings(ctx, versionId, blocks, chosen);
  let note: string | null = null;
  let useAi = input.ai === true;
  if (useAi && !ctx.llm) (useAi = false, note = 'Kein KI-Dienst eingestellt – nur regelbasierte Prüfung.');
  if (useAi && ctx.llm!.external) {
    const names = await privacyNames(ctx.db);
    if (blocks.some((b) => detectPrivacy(b.text, { names }).length)) (useAi = false, note = 'KI-Prüfung gesperrt: Das Kapitel enthält mögliche personenbezogene Daten.');
  }
  for (const p of chosen) {
    const extra = useAi ? await aiFindings(ctx, p, blocks, rules[p]) : [];
    const findings = [...rules[p], ...extra].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]).slice(0, MAX_FINDINGS);
    const id = newId('prv');
    await ctx.db.run(
      'INSERT INTO profile_reviews (id, project_id, chapter_id, chapter_version_id, profile, method, score, findings, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, v.chapterId, v.id, p, useAi ? 'ai' : 'rules', profileScore(findings), json(findings), note, user.id, now(),
    );
  }
  await audit(ctx, user.id, 'profile_review.run', 'chapter_version', versionId, { profiles: chosen, ai: useAi });
  return profileReviews(ctx, versionId);
}

/** Letzte Prüfung je Profil und Verlauf der Werte einer Kapitelversion */
export async function profileReviews(ctx: Ctx, versionId: string) {
  const v = await getChapterVersion(ctx, versionId);
  const rows = await ctx.db.all('SELECT * FROM profile_reviews WHERE chapter_version_id = ? AND project_id = ? ORDER BY created_at DESC, id DESC', versionId, ctx.projectId);
  const latest = REVIEW_PROFILES.map((p) => rows.find((r) => r.profile === p)).filter(Boolean).map((r) => reviewDto(r!));
  return {
    versionId: v.id, chapterId: v.chapterId, title: v.title, versionNo: v.versionNo, status: v.status,
    profiles: REVIEW_PROFILES.map((p) => ({ profile: p, label: PROFILE_LABEL[p], focus: PROFILE_FOCUS[p] })),
    latest,
    history: rows.slice(0, 40).map((r) => ({ id: r.id, profile: r.profile, label: PROFILE_LABEL[r.profile as ReviewProfile], score: Number(r.score), method: r.method, createdAt: r.created_at })),
  };
}

export const reviewProfileList = () => REVIEW_PROFILES.map((p) => ({ profile: p, label: PROFILE_LABEL[p], focus: PROFILE_FOCUS[p] }));
