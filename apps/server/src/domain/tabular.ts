// Tabellen einlesen (ADR-036): CSV mit automatisch erkanntem Trennzeichen (; , Tab) und Anführungszeichen nach RFC 4180.
// Reine Fachlogik ohne I/O; Excel wird im Dienst über exceljs gelesen.

/** Trennzeichen aus der ersten Zeile (außerhalb von Anführungszeichen) bestimmen */
export function detectDelimiter(text: string) {
  const first = text.split(/\r?\n/, 1)[0] ?? '';
  const count = (c: string) => first.replace(/"[^"]*"/g, '').split(c).length - 1;
  return [';', '\t', ','].reduce((best, c) => (count(c) > count(best) ? c : best), ',');
}

export function parseCsv(input: string, delimiter = detectDelimiter(input)): string[][] {
  const text = input.replace(/^﻿/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"' && cell === '') quoted = true;
    else if (c === delimiter) {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Spaltenüberschriften auf Felder abbilden (Groß-/Kleinschreibung, Leerzeichen und Umlaute egal) */
export function mapHeader(header: string[], fields: Record<string, string[]>) {
  const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const out: Record<string, number> = {};
  header.forEach((h, i) => {
    const n = norm(h);
    for (const [field, names] of Object.entries(fields)) if (out[field] === undefined && names.some((x) => norm(x) === n)) out[field] = i;
  });
  return out;
}

/** Liste in einer Zelle („dealer, hq“ oder „dealer; hq“) */
export const cellList = (v: string | undefined) => (v ?? '').split(/[,;|]/).map((x) => x.trim()).filter(Boolean);
