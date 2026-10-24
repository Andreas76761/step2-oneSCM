// Erzeugt src/domain/designIcons.ts aus lucide-react (ISC) – Icons der Designvorlagen (ADR-112) als SVG ohne Laufzeit-Abhängigkeit.
// Aufruf: node scripts/gen-design-icons.mjs  (aus apps/server)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICONS = [
  'info', 'lightbulb', 'triangle-alert', 'octagon-alert', 'circle-alert', 'circle-check', 'circle-question-mark', 'link', 'external-link', 'mail',
  'file-text', 'list-checks', 'list-ordered', 'layers', 'gauge', 'hash', 'shield-check', 'tag', 'calendar', 'book-open', 'check',
  'arrow-right', 'arrow-up-right', 'sparkles', 'users', 'clock', 'mouse-pointer-click', 'image', 'bookmark', 'files', 'circle-dashed', 'code',
];
const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '../../../node_modules/lucide-react/dist/esm/icons');
const version = JSON.parse(fs.readFileSync(path.resolve(here, '../../../node_modules/lucide-react/package.json'), 'utf8')).version;
const out = {};
for (const name of ICONS) {
  const { __iconData } = await import(path.join(dir, `${name}.mjs`));
  // ["circle", { cx: "12", … }] → <circle cx="12" …/>
  out[name] = __iconData.node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
}
const body = `// Erzeugt von scripts/gen-design-icons.mjs – nicht von Hand ändern.
// Icons: Lucide (lucide-react ${version}), ISC License, Copyright (c) Lucide Icons and Contributors – https://lucide.dev
export const DESIGN_ICONS = ${JSON.stringify(out, null, 2)} as const;
export type DesignIcon = keyof typeof DESIGN_ICONS;

/** Icon als Inline-SVG (Farbe über currentColor, für Screenreader ausgeblendet) */
export function svgIcon(name: DesignIcon, size = 16, cls = 'ic'): string {
  return \`<svg class="\${cls}" xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">\${DESIGN_ICONS[name]}</svg>\`;
}
`;
fs.writeFileSync(path.resolve(here, '../src/domain/designIcons.ts'), body);
console.log(`${ICONS.length} Icons geschrieben (lucide-react ${version})`);
