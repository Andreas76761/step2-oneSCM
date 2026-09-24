// Traceability-Matrix (US-020, ADR-010): Anforderung ↔ API ↔ Test ↔ Dokumentation ↔ Release.
import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Ctx } from '../context.js';
import { REPO_ROOT } from '../config.js';

export interface Requirement { id: string; title: string; priority: string; idStatus: string; documentation: string[] }
export interface TestCase { id: string; title: string; file: string; level: string; requirements: string[] }
export interface ApiOp { id: string; method: string; path: string; summary: string; requirements: string[]; extension: boolean }

export interface TraceRow {
  requirement: string;
  title: string;
  priority: string;
  idStatus: string;
  apiOperations: string[];
  tests: string[];
  documentation: string[];
  release: string;
  status: 'covered' | 'missing_tests' | 'missing_api';
}

export function loadTraceSources(ctx: Pick<Ctx, 'config'>) {
  const requirements: Requirement[] = JSON.parse(fs.readFileSync(path.join(ctx.config.traceabilityDir, 'requirements.json'), 'utf8'));
  const tests: TestCase[] = JSON.parse(fs.readFileSync(path.join(ctx.config.traceabilityDir, 'tests.json'), 'utf8'));
  const spec = parseYaml(fs.readFileSync(ctx.config.openapiPath, 'utf8'));
  const ops: ApiOp[] = [];
  for (const [p, item] of Object.entries<any>(spec.paths ?? {})) {
    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const op = item[method];
      if (!op) continue;
      ops.push({ id: op.operationId, method: method.toUpperCase(), path: `${spec.servers?.[0]?.url ?? ''}${p}`, summary: op.summary ?? '', requirements: op['x-requirements'] ?? [], extension: !!op['x-extension'] });
    }
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  return { requirements, tests, ops, release: String(pkg.version) };
}

export function buildMatrix(ctx: Pick<Ctx, 'config'>) {
  const { requirements, tests, ops, release } = loadTraceSources(ctx);
  const rows: TraceRow[] = requirements.map((r) => {
    const apiOperations = ops.filter((o) => o.requirements.includes(r.id)).map((o) => `${o.method} ${o.path}`);
    const t = tests.filter((x) => x.requirements.includes(r.id)).map((x) => x.id);
    return {
      requirement: r.id, title: r.title, priority: r.priority, idStatus: r.idStatus, apiOperations, tests: t, documentation: r.documentation, release,
      status: t.length === 0 ? 'missing_tests' : apiOperations.length === 0 && r.priority === 'P0' ? 'missing_api' : 'covered',
    };
  });
  const knownReq = new Set(requirements.map((r) => r.id));
  const issues = [
    ...ops.filter((o) => o.requirements.length === 0).map((o) => `Operation ${o.id} referenziert keine User Story`),
    ...ops.flatMap((o) => o.requirements.filter((r) => !knownReq.has(r)).map((r) => `Operation ${o.id} referenziert unbekannte Story ${r}`)),
    ...tests.flatMap((t) => t.requirements.filter((r) => !knownReq.has(r)).map((r) => `Test ${t.id} referenziert unbekannte Story ${r}`)),
    ...rows.filter((r) => r.priority === 'P0' && r.status !== 'covered').map((r) => `P0-Story ${r.requirement}: ${r.status}`),
  ];
  return { release, rows, operations: ops, tests, issues };
}

const cols = ['Anforderung', 'Titel', 'Priorität', 'ID-Status', 'API-Operationen', 'Tests', 'Dokumentation', 'Release', 'Status'] as const;
const cells = (r: TraceRow) => [r.requirement, r.title, r.priority, r.idStatus, r.apiOperations.join('; '), r.tests.join('; '), r.documentation.join('; '), r.release, r.status];

export function matrixCsv(rows: TraceRow[]) {
  const esc = (v: string) => (/[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return '﻿' + [cols.join(';'), ...rows.map((r) => cells(r).map(esc).join(';'))].join('\n');
}

export function matrixMarkdown(rows: TraceRow[], release: string, issues: string[]) {
  const esc = (v: string) => v.replace(/\|/g, '\\|');
  return [
    '# Traceability-Matrix',
    '',
    `Release ${release}. Generiert mit \`npm run traceability\` aus \`traceability/*.json\` und \`openapi/openapi.yaml\` (ADR-010).`,
    '',
    `| ${cols.join(' | ')} |`,
    `|${cols.map(() => '---').join('|')}|`,
    ...rows.map((r) => `| ${cells(r).map((c) => esc(c.replace(/; /g, '<br>'))).join(' | ')} |`),
    '',
    '## Prüfergebnis',
    '',
    issues.length ? issues.map((i) => `- ⚠️ ${i}`).join('\n') : '- ✅ Jede P0-Story hat mindestens einen Test und eine API-Operation; jede API-Operation referenziert mindestens eine Story.',
    '',
  ].join('\n');
}

export async function matrixXlsx(rows: TraceRow[], ops: ApiOp[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Traceability');
  ws.addRow([...cols]).font = { bold: true };
  for (const r of rows) ws.addRow(cells(r));
  ws.columns.forEach((c) => (c.width = 28));
  const wo = wb.addWorksheet('API-Operationen');
  wo.addRow(['operationId', 'Methode', 'Pfad', 'Zusammenfassung', 'x-requirements', 'Erweiterung']).font = { bold: true };
  for (const o of ops) wo.addRow([o.id, o.method, o.path, o.summary, o.requirements.join(', '), o.extension ? 'ja' : 'nein']);
  wo.columns.forEach((c) => (c.width = 30));
  return Buffer.from(await wb.xlsx.writeBuffer());
}
