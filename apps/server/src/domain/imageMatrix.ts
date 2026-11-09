// Deckungsmatrix (ADR-092, F-30): je Stelle (Reiter/Menüpunkt bzw. Kapitel) und je Kombination aus Sprache, Rolle und
// Sparte – gibt es ein passendes Bild? Bilder für „alle“ Rollen bzw. Sparten decken jede Rolle bzw. Sparte ab.
// Platzhalter zählen getrennt: Die Stelle ist vorgesehen, die echte Fassung fehlt.

export type MatrixDim = 'language' | 'role' | 'division';
export const MATRIX_DIMS: MatrixDim[] = ['language', 'role', 'division'];
export const MATRIX_ROLES = ['dealer', 'market', 'mo', 'hq'];
export const MATRIX_DIVISIONS = ['car', 'van'];
const ROLE_LABEL: Record<string, string> = { dealer: 'Händler', market: 'Markt', mo: 'MO', hq: 'Zentrale' };
const DIVISION_LABEL: Record<string, string> = { car: 'Pkw', van: 'Van' };

export interface MatrixImage { imageNo: string; title: string | null; language: string | null; roles: string[]; divisions: string[]; placeholder: boolean; places: { key: string; label: string }[] }
export interface MatrixColumn { key: string; label: string; language?: string; role?: string; division?: string }

export function matrixColumns(dims: MatrixDim[], languages: string[]): MatrixColumn[] {
  let cols: MatrixColumn[] = [{ key: '', label: '' }];
  for (const d of MATRIX_DIMS.filter((x) => dims.includes(x))) {
    const values = d === 'language' ? languages : d === 'role' ? MATRIX_ROLES : MATRIX_DIVISIONS;
    const label = (v: string) => (d === 'language' ? v.toUpperCase() : d === 'role' ? ROLE_LABEL[v] : DIVISION_LABEL[v]);
    cols = cols.flatMap((c) => values.map((v) => ({ ...c, [d]: v, key: c.key ? `${c.key}|${v}` : v, label: c.label ? `${c.label} · ${label(v)}` : label(v) })));
  }
  return cols;
}

/** Bild passt zur Spalte: gleiche Sprache, Rolle bzw. Sparte enthalten oder „alle“ */
export function covers(img: MatrixImage, col: MatrixColumn): boolean {
  if (col.language && img.language !== col.language) return false;
  if (col.role && !img.roles.includes(col.role) && !img.roles.includes('all')) return false;
  if (col.division && !img.divisions.includes(col.division) && !img.divisions.includes('all')) return false;
  return true;
}

export function coverageMatrix(images: MatrixImage[], dims: MatrixDim[], languages: string[]) {
  const columns = matrixColumns(dims, languages);
  const places = new Map<string, { key: string; label: string; images: MatrixImage[] }>();
  for (const img of images) {
    for (const p of img.places) {
      const row = places.get(p.key) ?? { key: p.key, label: p.label, images: [] };
      row.images.push(img);
      places.set(p.key, row);
    }
  }
  const rows = [...places.values()].sort((a, b) => a.label.localeCompare(b.label, 'de')).map((r) => {
    const cells = columns.map((c) => {
      const hits = r.images.filter((i) => covers(i, c));
      const real = hits.filter((i) => !i.placeholder);
      return { key: c.key, count: real.length, placeholders: hits.length - real.length, images: hits.map((i) => i.imageNo) };
    });
    return {
      key: r.key, label: r.label, images: r.images.length, cells,
      gaps: cells.filter((c) => !c.count && !c.placeholders).length, placeholderOnly: cells.filter((c) => !c.count && c.placeholders).length,
      // Bilder ohne Angabe zu Sprache, Rolle oder Sparte lassen sich keiner Spalte zuordnen
      unassigned: r.images.filter((i) => (dims.includes('language') && !i.language) || (dims.includes('role') && !i.roles.length) || (dims.includes('division') && !i.divisions.length)).map((i) => i.imageNo),
    };
  });
  const cells = rows.length * columns.length;
  const covered = rows.reduce((n, r) => n + r.cells.filter((c) => c.count).length, 0);
  return {
    dims, languages, columns: columns.map(({ key, label }) => ({ key, label })), rows,
    summary: {
      rows: rows.length, columns: columns.length, cells, covered, placeholderOnly: rows.reduce((n, r) => n + r.placeholderOnly, 0), gaps: rows.reduce((n, r) => n + r.gaps, 0),
      coverage: cells ? Math.round((covered / cells) * 100) : 0, unassigned: new Set(rows.flatMap((r) => r.unassigned)).size,
    },
  };
}
