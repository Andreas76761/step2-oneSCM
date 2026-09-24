// Qualitätsgate (US-012). ENTSCHEIDUNG(E-12): keine Ausnahmen, einstufige Freigabe.

export interface GateBlock {
  id: string;
  kind: string;
  section: string;
  sourceCount: number;
  justification: string | null;
  scopeStatus: string;
  mode: string;
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
