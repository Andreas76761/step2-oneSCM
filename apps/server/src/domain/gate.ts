// Qualitätsgate (US-012). ENTSCHEIDUNG(E-12): keine Ausnahmen, einstufige Freigabe.
import { imagesWithoutAlt } from './media.js';
import { sentenceEvidenceProblems } from './rewrite.js';

export interface GateBlock {
  id: string;
  kind: string;
  section: string;
  sourceCount: number;
  justification: string | null;
  scopeStatus: string;
  mode: string;
  /** für die Satz-Evidenz KI-umformulierter Absätze (ADR-013) */
  text?: string;
  sourceIds?: string[];
  sentences?: { text: string; sourceIds: string[] }[] | null;
}

export interface GateFinding {
  id: string;
  seq: number;
  type: string;
  severity: string;
  status: string;
  reason: string;
}

export interface GateCheck {
  code: string;
  label: string;
  passed: boolean;
  details: string[];
}

export interface GateResult {
  passed: boolean;
  checks: GateCheck[];
}

const isOpen = (f: GateFinding) => f.status === 'open' || f.status === 'deferred';

export function evaluateGate(blocks: GateBlock[], findings: GateFinding[], opts: { purpose: 'generate' | 'approve' | 'export' }): GateResult {
  const checks: GateCheck[] = [];
  const blockers = findings.filter((f) => isOpen(f) && f.severity === 'blocker' && f.type !== 'privacy');
  checks.push({
    code: 'no_open_blockers',
    label: 'Keine offenen Blocker-Befunde (Widersprüche)',
    passed: blockers.length === 0,
    details: blockers.map((f) => `#${f.seq} ${f.type}: ${f.reason}`),
  });
  const privacy = findings.filter((f) => isOpen(f) && f.type === 'privacy');
  checks.push({
    code: 'no_privacy_blockers',
    label: 'Keine offenen Datenschutzblocker',
    passed: privacy.length === 0,
    details: privacy.map((f) => `#${f.seq}: ${f.reason}`),
  });

  if (opts.purpose !== 'generate') {
    const noEvidence = blocks.filter((b) => b.sourceCount === 0 && !b.justification?.trim());
    checks.push({
      code: 'evidence_per_block',
      label: 'Jeder Absatz besitzt Evidenz oder dokumentierte manuelle Begründung',
      passed: noEvidence.length === 0,
      details: noEvidence.map((b) => `Block ${b.id} (${b.section}${b.kind === 'gap' ? ', Lücke' : ''})`),
    });
    const unscoped = blocks.filter((b) => b.scopeStatus !== 'confirmed' && b.scopeStatus !== 'general');
    checks.push({
      code: 'scope_confirmed',
      label: 'Rolle, Sparte, Markt und Release bestätigt oder bewusst allgemein markiert',
      passed: unscoped.length === 0,
      details: unscoped.map((b) => `Block ${b.id} (${b.section})`),
    });
    const sentenceIssues = blocks
      .map((b) => ({ b, problems: sentenceEvidenceProblems({ kind: b.kind, text: b.text ?? '', mode: b.mode, sourceIds: b.sourceIds ?? [], sentences: b.sentences ?? null }) }))
      .filter((x) => x.problems.length);
    checks.push({
      code: 'sentence_evidence',
      label: 'KI-umformulierte Absätze: jeder Satz mit Quelle des Absatzes belegt',
      passed: sentenceIssues.length === 0,
      details: sentenceIssues.map((x) => `Block ${x.b.id} (${x.b.section}): ${x.problems.join('; ')}`),
    });
    // Barrierefreiheit (ADR-029): jedes Bild braucht einen Alternativtext
    const noAlt = blocks.map((b) => ({ b, n: imagesWithoutAlt(b.text ?? '').length })).filter((x) => x.n);
    checks.push({
      code: 'image_alt',
      label: 'Jedes Bild besitzt einen Alternativtext',
      passed: noAlt.length === 0,
      details: noAlt.map((x) => `Block ${x.b.id} (${x.b.section}): ${x.n} Bild${x.n > 1 ? 'er' : ''} ohne Alternativtext`),
    });
    const stale = blocks.filter((b) => b.mode === 'needs_regeneration');
    checks.push({
      code: 'no_stale_blocks',
      label: 'Keine Blöcke mit Status „needs_regeneration“',
      passed: stale.length === 0,
      details: stale.map((b) => `Block ${b.id}`),
    });
  }
  return { passed: checks.every((c) => c.passed), checks };
}
