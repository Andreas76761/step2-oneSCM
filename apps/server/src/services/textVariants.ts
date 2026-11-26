// Textvarianten je Kapitel (ADR-105, S-05): Endanwender, Fachtext, Kurzfassung – aus der Kapitelversion berechnet, nicht gespeichert
import { privacyNames, type Ctx } from '../context.js';
import { detectPrivacy } from '../domain/privacy.js';
import {
  ENDUSER_SECTIONS, extractiveSummary, inventedFacts, SUMMARY_MAX_RATIO, SUMMARY_RATIO, TEXT_VARIANT_HINT, TEXT_VARIANT_LABEL, TEXT_VARIANTS, sectionsWords, variantMarkdown, wordCount,
  type TextVariant, type VariantSection,
} from '../domain/textVariants.js';
import { LlmError } from '../llm.js';
import { badRequest, Problem } from '../problem.js';
import { getChapterVersion } from './chapters.js';

const SUMMARY_PROMPT = `Du fasst Kapitel eines Software-Benutzerhandbuchs (oneSCM) auf Deutsch für das Management zusammen.
Regeln:
- Höchstens „maxWords“ Wörter, ein Absatz, sachlich, Präsens, Anrede „Sie“.
- Inhalt: wozu das Kapitel dient, was am Ende erreicht ist, wichtige Warnhinweise, der Ablauf in einem Satz.
- Nur Aussagen aus dem Kapitel; keine neuen Zahlen, Fristen oder Kennungen. „draft“ ist ein regelbasierter Entwurf.
Antworte nur mit JSON: {"text": "…"}`;

/** Abschnitte der Kapitelversion ohne Lücken (Fachtext) */
function expertSections(v: Awaited<ReturnType<typeof getChapterVersion>>): VariantSection[] {
  return v.sections.map((s) => ({ code: s.code as string, title: s.title as string, blocks: (s.blocks as any[]).filter((b) => b.kind !== 'gap' && b.text.trim()).map((b) => ({ kind: b.kind as string, text: b.text as string })) }))
    .filter((s) => s.blocks.length);
}

/** Endanwender: Zweck, Voraussetzungen, Schritte, Ergebnis, Hinweise; Warnungen aus anderen Abschnitten wandern zu den Hinweisen */
function enduserSections(expert: VariantSection[]): VariantSection[] {
  const kept = expert.filter((s) => ENDUSER_SECTIONS.includes(s.code)).map((s) => ({ ...s, blocks: s.blocks.filter((b) => b.kind !== 'xref') }));
  const moved = expert.filter((s) => !ENDUSER_SECTIONS.includes(s.code)).flatMap((s) => s.blocks.filter((b) => b.kind === 'warning'));
  if (moved.length) {
    const hints = kept.find((s) => s.code === 'hints');
    if (hints) hints.blocks.push(...moved);
    else kept.push({ code: 'hints', title: 'Hinweise, Tipps und Warnungen', blocks: moved });
  }
  return kept.filter((s) => s.blocks.length);
}

async function aiSummary(ctx: Ctx, expert: VariantSection[], draft: string, maxWords: number, limit: number) {
  const provider = ctx.llm!;
  const text = variantMarkdown('Kapitel', expert);
  if (provider.external && detectPrivacy(text, { names: await privacyNames(ctx.db) }).length) return { text: null, note: 'KI-Kurzfassung gesperrt: Das Kapitel enthält mögliche personenbezogene Daten.' };
  let raw: string;
  try {
    raw = (await provider.complete({ system: SUMMARY_PROMPT, user: `Fasse das Kapitel zusammen. Eingabedaten:\n<<<DATA\n${JSON.stringify({ task: 'summary', maxWords, draft, text }, null, 2)}\nDATA>>>` })).text;
  } catch (e) {
    if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', `KI-Dienst nicht verfügbar: ${e.message}`);
    throw e;
  }
  const cleaned = raw.replace(/```(?:json)?/gi, '');
  let out = '';
  try {
    out = String(JSON.parse(cleaned.slice(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1))?.text ?? '').trim();
  } catch {
    out = '';
  }
  if (!out) return { text: null, note: 'Antwort des KI-Dienstes nicht lesbar – regelbasierte Kurzfassung.' };
  const invented = inventedFacts(out, text);
  if (invented.length) return { text: null, note: `KI-Kurzfassung verworfen: Zahlen oder Kennungen ohne Grundlage im Kapitel (${invented.join(', ')}).` };
  if (wordCount(out) > limit) return { text: null, note: 'KI-Kurzfassung verworfen: zu lang.' };
  return { text: out, note: null };
}

/** Drei Textvarianten einer Kapitelversion; Kurzfassung mit KI nur auf Wunsch (`ai`), sonst regelbasiert */
export async function textVariants(ctx: Ctx, versionId: string, opts: { ai?: boolean } = {}) {
  const v = await getChapterVersion(ctx, versionId);
  const expert = expertSections(v);
  const total = sectionsWords(expert);
  const draft = extractiveSummary(expert);
  let summary = draft;
  let method: 'rules' | 'ai' = 'rules';
  let note: string | null = null;
  if (opts.ai) {
    if (!ctx.llm) note = 'Kein KI-Dienst eingestellt – regelbasierte Kurzfassung.';
    else {
      const r = await aiSummary(ctx, expert, draft, Math.max(20, Math.round(total * SUMMARY_RATIO)), Math.max(30, Math.ceil(total * SUMMARY_MAX_RATIO)));
      if (r.text) (summary = r.text, method = 'ai');
      note = r.note;
    }
  }
  const sections: Record<TextVariant, VariantSection[]> = {
    enduser: enduserSections(expert),
    expert,
    summary: [{ code: 'summary', title: 'Kurzfassung', blocks: [{ kind: 'paragraph', text: summary }] }],
  };
  return {
    versionId: v.id, chapterId: v.chapterId, title: v.title, versionNo: v.versionNo, status: v.status, method, note,
    variants: TEXT_VARIANTS.map((code) => {
      const words = sectionsWords(sections[code]);
      return { code, label: TEXT_VARIANT_LABEL[code], hint: TEXT_VARIANT_HINT[code], words, ratio: total ? Math.round((100 * words) / total) : 100, sections: sections[code], markdown: variantMarkdown(v.title, sections[code]) };
    }),
  };
}

/** Eine Variante als Markdown-Datei */
export async function textVariantFile(ctx: Ctx, versionId: string, code: string, opts: { ai?: boolean } = {}) {
  if (!(TEXT_VARIANTS as readonly string[]).includes(code)) throw badRequest(`Variante muss eine von ${TEXT_VARIANTS.join(', ')} sein.`);
  const r = await textVariants(ctx, versionId, opts);
  const variant = r.variants.find((x) => x.code === code)!;
  const slug = r.title.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'kapitel';
  return { fileName: `${slug}-${code}.md`, body: variant.markdown };
}
