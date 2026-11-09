// Prüfbericht Barrierefreiheit für PDF (ADR-118): liest die unkomprimierten Objekt-Wörterbücher eines PDF (wie sie Chromium
// schreibt) und prüft die Grundlagen eines getaggten, zugänglichen Dokuments – angelehnt an PDF/UA (ISO 14289-1), ohne eine
// Konformität zu behaupten. Objektströme (/ObjStm) werden nicht entpackt; dann gelten die Strukturprüfungen als „nicht prüfbar“.

export interface PdfCheck { id: string; label: string; ok: boolean | null; detail?: string }
export interface PdfAccessibility { ok: boolean; checks: PdfCheck[] }

/** Objekte „n 0 obj … endobj“ als Text (Latin-1, Ströme ausgelassen) */
function objects(pdf: Buffer): Map<number, string> {
  const text = pdf.toString('latin1');
  const out = new Map<number, string>();
  const re = /(\d+) 0 obj\b([\s\S]*?)endobj/g;
  for (const m of text.matchAll(re)) out.set(Number(m[1]), m[2].replace(/stream[\s\S]*?endstream/g, ''));
  return out;
}

const ref = (dict: string, key: string) => {
  const m = new RegExp(`/${key}\\s+(\\d+)\\s+0\\s+R`).exec(dict);
  return m ? Number(m[1]) : null;
};

export function checkPdfAccessibility(pdf: Buffer): PdfAccessibility {
  const text = pdf.toString('latin1');
  const objs = objects(pdf);
  const trailer = text.slice(text.lastIndexOf('trailer'));
  const rootNo = ref(trailer, 'Root') ?? [...objs].find(([, d]) => /\/Type\s*\/Catalog/.test(d))?.[0] ?? null;
  const catalog = rootNo !== null ? objs.get(rootNo) ?? '' : '';
  const infoNo = ref(trailer, 'Info');
  const info = infoNo !== null ? objs.get(infoNo) ?? '' : '';
  const packed = /\/ObjStm\b/.test(text);
  const elems = [...objs.values()].filter((d) => /\/Type\s*\/StructElem\b/.test(d) || (/\/S\s*\/\w+/.test(d) && /\/P\s+\d+\s+0\s+R/.test(d)));
  const tag = (d: string) => /\/S\s*\/(\w+)/.exec(d)?.[1] ?? '';
  const tags = elems.map(tag);
  const figures = elems.filter((d) => tag(d) === 'Figure');
  const figuresWithAlt = figures.filter((d) => /\/Alt\s*\((?:\\.|[^)\\])+\)|\/Alt\s*<[0-9A-Fa-f]+>/.test(d));
  const headings = tags.filter((t) => /^H[1-6]?$/.test(t));
  const tables = tags.filter((t) => t === 'Table').length;
  const th = tags.filter((t) => t === 'TH').length;
  const structurable = !packed && /\/StructTreeRoot/.test(catalog);

  const checks: PdfCheck[] = [
    { id: 'tagged', label: 'Getaggtes PDF (Tagged PDF)', ok: /\/MarkInfo\s*<<[^>]*\/Marked\s+true/.test(catalog) },
    { id: 'structure', label: 'Strukturbaum vorhanden', ok: /\/StructTreeRoot\s+\d+\s+0\s+R/.test(catalog) },
    { id: 'lang', label: 'Dokumentsprache angegeben', ok: /\/Lang\s*\([^)]+\)/.test(catalog), detail: /\/Lang\s*\(([^)]+)\)/.exec(catalog)?.[1] },
    { id: 'title', label: 'Titel in den Dokumenteigenschaften', ok: /\/Title\s*(\((?:\\.|[^)\\])+\)|<[0-9A-Fa-f]+>)/.test(info) },
    { id: 'displayTitle', label: 'Fenstertitel zeigt den Dokumenttitel', ok: /\/DisplayDocTitle\s+true/.test(catalog) },
    { id: 'outline', label: 'Lesezeichen (Gliederung)', ok: /\/Outlines\s+\d+\s+0\s+R/.test(catalog) },
    { id: 'headings', label: 'Überschriften ausgezeichnet', ok: structurable ? headings.length > 0 : null, detail: structurable ? `${headings.length} Überschriften` : undefined },
    { id: 'figures', label: 'Abbildungen mit Alternativtext', ok: structurable ? figures.length === figuresWithAlt.length : null, detail: structurable ? `${figuresWithAlt.length} von ${figures.length}` : undefined },
    { id: 'tables', label: 'Tabellen mit Kopfzellen', ok: structurable ? tables === 0 || th > 0 : null, detail: structurable ? `${tables} Tabellen, ${th} Kopfzellen` : undefined },
  ];
  return { ok: checks.every((c) => c.ok !== false), checks };
}
