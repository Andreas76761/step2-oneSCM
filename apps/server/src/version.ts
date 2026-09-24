// Version der Anwendung (ADR-031): aus package.json des Servers, im Container-Image zusätzlich über APP_VERSION gesetzt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8')) as { version: string };

export const APP_VERSION: string = process.env.APP_VERSION?.trim() || pkg.version;
