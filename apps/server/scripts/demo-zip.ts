import JSZip from 'jszip';
import fs from 'node:fs';
import path from 'node:path';

/** Packt den Ordner demo-data in ein ZIP (Buffer). */
export async function buildDemoZip(dir: string): Promise<Buffer> {
  const zip = new JSZip();
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (!e.name.endsWith('.zip')) zip.file(path.relative(dir, full).split(path.sep).join('/'), fs.readFileSync(full));
    }
  };
  walk(dir);
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
