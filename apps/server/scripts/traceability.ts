// Erzeugt docs/traceability.md aus traceability/*.json und openapi/openapi.yaml (US-020).
import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, REPO_ROOT } from '../src/config.js';
import { buildMatrix, matrixMarkdown } from '../src/services/traceability.js';

const m = buildMatrix({ config: loadConfig({ webDist: null }) });
const out = path.join(REPO_ROOT, 'docs', 'traceability.md');
fs.writeFileSync(out, matrixMarkdown(m.rows, m.release, m.issues));
console.log(`${out} geschrieben (${m.rows.length} Anforderungen, ${m.operations.length} Operationen, ${m.tests.length} Tests).`);
if (m.issues.length) {
  console.error(m.issues.join('\n'));
  process.exit(1);
}
