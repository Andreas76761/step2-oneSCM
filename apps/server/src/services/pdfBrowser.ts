// PDF im Design (ADR-113): ein lokal installierter Chromium, Chrome oder Edge druckt die Designvorlage (ADR-112) als PDF.
// Aufruf ohne Shell, mit eigenem Profil im Temp-Ordner, Zeitlimit und ohne Netz (alle Namen lösen ins Leere auf).
// Seitenformat, Kopf- und Fußzeilen mit Seitenzahl kommen aus den @page-Regeln der Vorlage.
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { AppConfig } from '../config.js';

type PdfBrowserConfig = AppConfig['pdfBrowser'];

export const pdfBrowserAvailable = (cfg: PdfBrowserConfig) => !!cfg.path;

/** Argumente für den Druck; die HTML-Datei enthält keine Skripte und erlaubt per CSP nur eingebettete Bilder */
export function browserArgs(cfg: PdfBrowserConfig, dir: string, input: string, output: string): string[] {
  return [
    '--headless', '--disable-gpu', '--disable-extensions', '--no-first-run', '--no-default-browser-check', '--disable-sync',
    ...(cfg.noSandbox ? ['--no-sandbox'] : []),
    `--user-data-dir=${path.join(dir, 'profil')}`,
    '--host-resolver-rules=MAP * ~NOTFOUND',
    '--no-pdf-header-footer',
    // barrierefreies PDF (ADR-118): Tags aus der HTML-Struktur, Lesezeichen aus den Überschriften
    '--export-tagged-pdf', '--generate-pdf-document-outline',
    `--print-to-pdf=${output}`,
    pathToFileURL(input).href,
  ];
}

/** HTML einer Designvorlage als PDF drucken */
export async function htmlToPdf(cfg: PdfBrowserConfig, html: string): Promise<Buffer> {
  if (!cfg.path) throw new Error('Kein Browser für PDF eingerichtet (PDF_BROWSER_PATH).');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'onescm-pdf-'));
  try {
    const input = path.join(dir, 'dokument.html');
    const output = path.join(dir, 'dokument.pdf');
    await fs.writeFile(input, html, 'utf8');
    await new Promise<void>((resolve, reject) => {
      execFile(cfg.path!, browserArgs(cfg, dir, input, output), { cwd: dir, timeout: cfg.timeoutMs, maxBuffer: 16 * 1024 * 1024, windowsHide: true }, (err, _stdout, stderr) => {
        // letzte aussagekräftige Zeilen (Meldungen zu D-Bus sind in Containern üblich und ohne Belang), sonst Exit-Code
        const lines = stderr.toString().split('\n').filter((l) => !/dbus/i.test(l)).map((l) => l.replace(/^\[[^\]]*\]\s*/, '').trim()).filter(Boolean);
        if (err) reject(new Error(`${path.basename(cfg.path!)}: ${lines.slice(-2).join(' ') || (err.killed ? 'Zeitlimit überschritten' : `Exit-Code ${err.code}`)}`));
        else resolve();
      });
    });
    const pdf = await fs.readFile(output).catch(() => null);
    if (!pdf || pdf.subarray(0, 5).toString('latin1') !== '%PDF-') throw new Error(`${path.basename(cfg.path)} hat kein PDF erzeugt.`);
    return pdf;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}
