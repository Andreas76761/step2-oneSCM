// Statische Dateien nach dem Build vorkomprimieren (Brotli und gzip): der Server liefert sie über
// @fastify/static `preCompressed` direkt aus – ohne Komprimieren je Anfrage und ohne zusätzliche Abhängigkeit.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const root = new URL('../dist/', import.meta.url).pathname;
const TYPES = /\.(js|css|html|svg|json|txt|map)$/;
let before = 0;
let after = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (TYPES.test(name) && statSync(file).size >= 1024) {
      const data = readFileSync(file);
      const br = brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: data.length } });
      writeFileSync(`${file}.br`, br);
      writeFileSync(`${file}.gz`, gzipSync(data, { level: 9 }));
      before += data.length;
      after += br.length;
    }
  }
};
walk(root);
console.log(`vorkomprimiert: ${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB (Brotli)`);
