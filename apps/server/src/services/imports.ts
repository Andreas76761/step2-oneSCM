// Importpipeline (US-001, US-002, US-003, US-004).
import JSZip from 'jszip';
import path from 'node:path';
import { audit, getSettings, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { classifySnippet } from '../domain/classify.js';
import { CONVERTIBLE, docxToMarkdown, embedDataImages, htmlToMarkdown } from '../domain/convert.js';
import { chapterOf, headingKey, parseMarkdown } from '../domain/markdown.js';
import { MEDIA_EXT, resolveRelative, rewriteImages } from '../domain/media.js';
import { normalizedHash, sha256 } from '../domain/similarity.js';
import { finishConnectionImport } from './connections.js';
import { storeMedia } from './media.js';
import { contextsFromFrontMatter } from './contextHelp.js';
import { badRequest, notFound, Problem } from '../problem.js';

interface Entry {
  path: string;
  data?: Buffer;
  error?: string;
  skipped?: string;
  /** Bilddatei im ZIP (ADR-029) – wird als Medium abgelegt, nicht als Dokument */
  media?: boolean;
}

const MD_EXT = ['.md', '.markdown'];

export async function createImport(ctx: Ctx, fileName: string, data: Buffer, actor: string) {
  const settings = (await getSettings(ctx.db)).import;
  const ext = path.extname(fileName).toLowerCase();
  if (!settings.allowedExtensions.includes(ext)) {
    throw new Problem(415, 'Unsupported Media Type', `Dateityp „${ext || '(ohne Endung)'}“ ist nicht erlaubt. Erlaubt: ${settings.allowedExtensions.join(', ')}`);
  }
  if (data.length > settings.maxUploadBytes) throw new Problem(413, 'Content Too Large', `Datei überschreitet ${settings.maxUploadBytes} Bytes.`);
  if (data.length === 0) throw badRequest('Die Datei ist leer.');

  const hash = sha256(data);
  await ctx.store.put(`uploads/${hash}`, data);
  const id = newId('imp');
  // Import, Audit und Job atomar: kein Import ohne Job, kein Job ohne Import (ADR-008)
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO imports (id, project_id, file_name, kind, sha256, byte_size, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, fileName, ext === '.zip' ? 'zip' : CONVERTIBLE[ext] ?? 'md', hash, data.length, 'queued', actor, now(),
    );
    await audit(ctx, actor, 'import.created', 'import', id, { fileName, sha256: hash });
    // Persistenter Job: Originaldatei liegt im Object-Store, der Job kennt nur die Import-ID
    await ctx.jobs.enqueue('import', { importId: id });
  });
  ctx.jobs.wake();
  return getImport(ctx, id);
}

/** Job-Handler: verarbeitet einen Import. Idempotent – ein erneuter Lauf nach Abbruch liefert dasselbe Ergebnis. */
export async function runImportJob(ctx: Ctx, payload: { importId: string }) {
  const imp = await ctx.db.get('SELECT file_name, sha256 FROM imports WHERE id = ?', payload.importId);
  if (!imp) throw new Error(`Import ${payload.importId} existiert nicht`);
  const data = await ctx.store.get(`uploads/${imp.sha256}`);
  await processImport(ctx, payload.importId, imp.file_name, data);
}

/** Job endgültig fehlgeschlagen (nach allen Wiederholungen). */
export async function failImportJob(ctx: Ctx, payload: { importId: string }, error: string) {
  await ctx.db.run("UPDATE imports SET status = 'failed', error = ?, finished_at = ? WHERE id = ?", error, now(), payload.importId);
  await audit(ctx, 'system', 'import.failed', 'import', payload.importId, { error });
  await finishConnectionImport(ctx, payload.importId, 'failed', error);
}

async function readEntries(ctx: Ctx, fileName: string, data: Buffer): Promise<Entry[]> {
  const settings = (await getSettings(ctx.db)).import;
  if (!fileName.toLowerCase().endsWith('.zip')) return [{ path: path.basename(fileName), data }];
  const zip = await JSZip.loadAsync(data);
  const files = Object.values(zip.files).filter((f) => !f.dir);
  if (files.length > settings.maxZipFiles) throw badRequest(`ZIP enthält ${files.length} Dateien, erlaubt sind ${settings.maxZipFiles}.`);
  const out: Entry[] = [];
  for (const f of files) {
    const p = f.name.replace(/\\/g, '/').replace(/^\/+/, '');
    if (p.startsWith('__MACOSX/') || path.basename(p).startsWith('.')) continue;
    const ext = path.extname(p).toLowerCase();
    const media = !!MEDIA_EXT[ext];
    if (!media && !MD_EXT.includes(ext) && !(CONVERTIBLE[ext] && settings.allowedExtensions.includes(ext))) {
      out.push({ path: p, skipped: 'Kein unterstütztes Format – übersprungen' });
      continue;
    }
    // Schutz vor Zip-Bomben: deklarierte Größe prüfen, dann tatsächliche Größe
    const declared = (f as any)._data?.uncompressedSize ?? 0;
    if (declared > settings.maxEntryBytes) {
      out.push({ path: p, error: `Datei größer als ${settings.maxEntryBytes} Bytes` });
      continue;
    }
    try {
      const buf = await f.async('nodebuffer');
      if (buf.length > settings.maxEntryBytes) out.push({ path: p, error: `Datei größer als ${settings.maxEntryBytes} Bytes` });
      else out.push({ path: p, data: buf, media });
    } catch (e) {
      out.push({ path: p, error: `Entpacken fehlgeschlagen: ${(e as Error).message}` });
    }
  }
  return out;
}

const decoder = new TextDecoder('utf-8', { fatal: true });

export async function processImport(ctx: Ctx, importId: string, fileName: string, data: Buffer) {
  const { db } = ctx;
  await db.run("UPDATE imports SET status = 'processing' WHERE id = ?", importId);
  await db.run('DELETE FROM import_items WHERE import_id = ?', importId); // Wiederholung nach Abbruch
  const stats = { files: 0, imported: 0, identical: 0, failed: 0, skipped: 0, snippets: 0, media: 0 };
  let cache = newCache();
  const items: unknown[][] = [];
  let entries: Entry[];
  try {
    entries = await readEntries(ctx, fileName, data);
  } catch (e) {
    await db.run("UPDATE imports SET status = 'failed', error = ?, finished_at = ?, stats = ? WHERE id = ?", (e as Error).message, now(), json(stats), importId);
    await finishConnectionImport(ctx, importId, 'failed', (e as Error).message);
    return;
  }

  // Bilder zuerst ablegen, damit Dokumente sie über ihren relativen Pfad referenzieren können (ADR-029)
  const mediaByPath = new Map<string, string>();
  const mediaItems = new Map<string, { status: string; message: string; sha: string | null }>();
  for (const entry of entries.filter((e) => e.media && e.data)) {
    try {
      const m = await storeMedia(ctx, entry.data!, path.posix.basename(entry.path), importId);
      mediaByPath.set(entry.path, m.sha);
      mediaItems.set(entry.path, { status: 'media', message: `Bild ${m.mime}${m.width ? `, ${m.width}×${m.height}` : ''}`, sha: m.sha });
    } catch {
      mediaItems.set(entry.path, { status: 'skipped', message: 'Kein gültiges Bild (PNG, JPEG, GIF, WebP) – übersprungen', sha: null });
    }
  }
  const images: ImageResolver = { byPath: mediaByPath, importId };

  for (const entry of entries) {
    stats.files++;
    const mediaItem = mediaItems.get(entry.path);
    if (entry.media && mediaItem) {
      if (mediaItem.status === 'media') stats.media++;
      else stats.skipped++;
      items.push([newId('ii'), importId, entry.path, mediaItem.sha, mediaItem.status, mediaItem.message, null, stats.files]);
      continue;
    }
    const item = { id: newId('ii'), path: entry.path, sha256: entry.data ? sha256(entry.data) : null as string | null, status: 'imported', message: null as string | null, revisionId: null as string | null };
    try {
      if (entry.skipped) {
        item.status = 'skipped';
        item.message = entry.skipped;
      } else if (entry.error) {
        throw new Error(entry.error);
      } else {
        const converted = await convertEntry(ctx, entry.path, entry.data!, images);
        if (converted.skip) {
          item.status = 'skipped';
          item.message = converted.skip;
        } else {
          const res = await storeRevision(ctx, importId, entry.path, converted.markdown, converted.original, cache);
          const warning = [res.warning, ...converted.warnings].filter(Boolean).join('; ');
          item.status = res.identical ? 'identical' : 'imported';
          item.revisionId = res.revisionId;
          item.message = res.identical ? `Identisch mit Revision ${res.revisionNo}` : `Revision ${res.revisionNo}, ${res.snippets} Textabschnitte${warning ? ` – ${warning}` : ''}`;
          stats.snippets += res.snippets;
        }
      }
    } catch (e) {
      cache = newCache();
      item.status = 'failed';
      const msg = (e as Error).message;
      item.message = msg.includes('encoded data was not valid') ? 'Keine gültige UTF-8-Datei' : msg;
    }
    if (item.status === 'imported') stats.imported++;
    else if (item.status === 'identical') stats.identical++;
    else if (item.status === 'failed') stats.failed++;
    else stats.skipped++;
    items.push([item.id, importId, item.path, item.sha256, item.status, item.message, item.revisionId, stats.files]);
  }
  await insertMany(ctx, 'import_items (id, import_id, path, sha256, status, message, revision_id, position)', items);

  // Bilder zählen nicht als Dokumente: schlagen alle Dokumente fehl, ist der Import fehlgeschlagen
  const status = stats.failed === 0 ? 'completed' : stats.failed === stats.files - mediaItems.size ? 'failed' : 'completed_with_errors';
  await db.run('UPDATE imports SET status = ?, finished_at = ?, stats = ? WHERE id = ?', status, now(), json(stats), importId);
  await audit(ctx, 'system', 'import.finished', 'import', importId, { status, ...stats });
  await finishConnectionImport(ctx, importId, status, stats.failed ? `${stats.failed} von ${stats.files} Dateien fehlerhaft (Import ${importId})` : null);
}

interface Original {
  format: 'html' | 'docx';
  data: Buffer;
}

/** Bilder des laufenden Imports (Pfad im ZIP → SHA-256) */
interface ImageResolver {
  byPath: Map<string, string>;
  importId: string;
}

const missingWarning = (missing: string[]) =>
  missing.length ? [`Bild nicht gefunden: ${[...new Set(missing)].slice(0, 5).join(', ')}${missing.length > 5 ? ' …' : ''}`] : [];

/** Markdown direkt übernehmen, HTML/Word umwandeln (ADR-022). Die Originaldatei wird zusätzlich aufbewahrt. */
async function convertEntry(ctx: Ctx, filePath: string, data: Buffer, images?: ImageResolver): Promise<{ markdown: Buffer; original?: Original; warnings: string[]; skip?: string }> {
  const format = CONVERTIBLE[path.extname(filePath).toLowerCase()];
  const fromZip = (target: string) => {
    const p = resolveRelative(filePath, target);
    return p ? images?.byPath.get(p) ?? null : null;
  };
  if (!format) {
    const text = decoder.decode(data); // nur gültiges UTF-8
    // Relative Bildverweise auf mitgelieferte Bilder zeigen danach auf das abgelegte Medium (Zeilen bleiben erhalten)
    const res = rewriteImages(text, fromZip);
    return { markdown: res.changed ? Buffer.from(res.markdown, 'utf8') : data, warnings: missingWarning(res.missing) };
  }
  const title = path.basename(filePath, path.extname(filePath));
  const settings = (await getSettings(ctx.db)).import;
  const embed = async (buf: Buffer, name: string) => (await storeMedia(ctx, buf, name, images?.importId ?? null)).sha;
  const res = format === 'html'
    ? htmlToMarkdown(await embedDataImages(decodeHtml(data), embed), title, { resolve: fromZip })
    : await docxToMarkdown(data, title, settings.maxEntryBytes * 5, embed);
  return { markdown: Buffer.from(res.markdown, 'utf8'), original: { format, data }, warnings: res.warnings, skip: res.skip };
}

/** HTML-Zeichensatz: UTF-8 (Standard), sonst laut meta charset (Windows-1252/ISO-8859-1 älterer Exporte) */
function decodeHtml(data: Buffer) {
  const head = data.subarray(0, 2048).toString('latin1');
  const charset = /charset=["']?([\w-]+)/i.exec(head)?.[1]?.toLowerCase();
  if (charset && charset !== 'utf-8' && charset !== 'utf8') {
    try {
      return new TextDecoder(charset).decode(data);
    } catch {
      /* unbekannter Zeichensatz: UTF-8 versuchen */
    }
  }
  return decoder.decode(data);
}

/** Kapitel/Unterkapitel eines Imports (über alle Dateien); nach einem Fehler verworfen, da die Transaktion zurückgerollt wurde */
interface StructureCache {
  chapters: Map<string, Promise<Row>>;
  subs: Map<string, Promise<Row>>;
}
const newCache = (): StructureCache => ({ chapters: new Map(), subs: new Map() });

async function storeRevision(ctx: Ctx, importId: string, filePath: string, data: Buffer, original?: Original, cache: StructureCache = newCache()) {
  const { db } = ctx;
  const text = decoder.decode(data);
  const hash = sha256(data);
  await ctx.store.put(`sources/${hash}`, data);
  const originalKey = original ? `originals/${sha256(original.data)}` : null;
  if (original) await ctx.store.put(originalKey!, original.data);
  const parsed = parseMarkdown(text);
  const warning = parsed.frontMatterError ? `Front-Matter ungültig: ${parsed.frontMatterError}` : undefined;

  return db.tx(async () => {
    let doc = await db.get('SELECT * FROM source_documents WHERE project_id = ? AND path = ?', ctx.projectId, filePath);
    const latest = doc ? await db.get('SELECT * FROM source_revisions WHERE document_id = ? ORDER BY revision_no DESC LIMIT 1', doc.id) : undefined;
    if (latest && latest.sha256 === hash) {
      // Wiederholter Lauf desselben Imports: Revision stammt aus diesem Import → als importiert melden
      if (latest.import_id === importId) {
        const n = (await db.get<{ n: number }>('SELECT COUNT(*) AS n FROM text_snippets WHERE revision_id = ?', latest.id))?.n ?? 0;
        return { identical: false, revisionId: latest.id as string, revisionNo: latest.revision_no as number, snippets: n, warning };
      }
      return { identical: true, revisionId: latest.id as string, revisionNo: latest.revision_no as number, snippets: 0, warning };
    }

    let snippetCount = 0;
    const revisionId = newId('rev');
    const revisionNo = (latest?.revision_no ?? 0) + 1;
    if (!doc) {
      doc = { id: newId('doc') };
      await db.run('INSERT INTO source_documents (id, project_id, path, file_name, created_at) VALUES (?, ?, ?, ?, ?)', doc.id, ctx.projectId, filePath, path.basename(filePath), now());
    }
    await db.run('UPDATE source_revisions SET is_current = 0 WHERE document_id = ?', doc.id);
    await db.run(
      'INSERT INTO source_revisions (id, document_id, import_id, revision_no, sha256, storage_key, byte_size, front_matter, is_current, imported_at, source_format, original_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)',
      revisionId, doc.id, importId, revisionNo, hash, `sources/${hash}`, data.length, json(parsed.frontMatter), now(), original?.format ?? 'markdown', originalKey,
    );

    // Kapitel/Unterkapitel zwischenspeichern (statt einer Abfrage je Absatz)
    const { chapters, subs } = cache;
    const chapterFor = (title: string | null) => {
      const k = title ?? '';
      if (!chapters.has(k)) chapters.set(k, ensureChapter(ctx, title));
      return chapters.get(k)!;
    };
    const subFor = async (chapterTitle: string | null, title: string) => {
      const ch = await chapterFor(chapterTitle);
      const k = `${ch.id}|${title}`;
      if (!subs.has(k)) subs.set(k, ensureSubchapter(ctx, ch.id, title));
      return subs.get(k)!;
    };
    // Unterkapitel auch für leere Überschriften anlegen (Lückenerkennung)
    for (const h of parsed.headings) {
      if (h.level === 1) await chapterFor(h.title);
      if (h.level === 2) await subFor(h.chapterTitle, h.title);
    }
    // Kontext-IDs für die Kontexthilfe aus dem Front-Matter (ADR-030) → erstes Kapitel der Datei
    const firstChapter = parsed.headings.find((h) => h.level === 1);
    if (firstChapter && (parsed.frontMatter.help_context || parsed.frontMatter.help_contexts)) {
      await contextsFromFrontMatter(ctx, parsed.frontMatter, (await chapterFor(firstChapter.title)).id, 'system');
    }

    // Sammel-INSERTs (Etappe 9): eine fortlaufende Nummer je Revision reservieren, Zeilen blockweise schreiben
    const snippetRows: unknown[][] = [];
    const roleRows: unknown[][] = [];
    const divisionRows: unknown[][] = [];
    const markets = new Set<string>();
    const releases = new Set<string>();
    let seq = parsed.blocks.length ? await db.nextSeq('text_snippets') : 0;
    const created = now();
    for (const b of parsed.blocks) {
      const chapter = await chapterFor(b.chapterTitle);
      const sub = b.subchapterTitle ? await subFor(b.chapterTitle, b.subchapterTitle) : null;
      const cls = classifySnippet({ text: b.text, headings: [b.chapterTitle ?? '', b.subchapterTitle ?? '', ...b.headingPath], path: filePath, frontMatter: parsed.frontMatter });
      const snippetId = newId('sn');
      snippetRows.push([
        snippetId, seq++, revisionId, chapter.id, sub?.id ?? null, json(b.headingPath), b.position, b.lineStart, b.lineEnd, b.kind, b.text,
        sha256(b.text), normalizedHash(b.text), cls.evidenceStatus, cls.market?.code ?? null, cls.release?.code ?? null,
        (cls.market?.status ?? 'confirmed') === 'confirmed' && (cls.release?.status ?? 'confirmed') === 'confirmed' ? 'confirmed' : 'unconfirmed', created,
      ]);
      for (const r of cls.roles) roleRows.push([snippetId, r.code, r.score, r.method, r.modelVersion, r.evidenceStatus, r.evidence]);
      for (const d of cls.divisions) divisionRows.push([snippetId, d.code, d.score, d.method, d.modelVersion, d.evidenceStatus, d.evidence]);
      if (cls.market) markets.add(cls.market.code);
      if (cls.release) releases.add(cls.release.code);
      snippetCount++;
    }
    await insertMany(ctx, `text_snippets (id, seq, revision_id, chapter_id, subchapter_id, heading_path, position, line_start, line_end, kind, text, text_hash, norm_hash,
      evidence_status, market_code, release_code, scope_status, created_at)`, snippetRows);
    await insertMany(ctx, 'snippet_roles', roleRows);
    await insertMany(ctx, 'snippet_divisions', divisionRows);
    for (const m of markets) await db.run('INSERT INTO markets (code, label) VALUES (?, ?) ON CONFLICT (code) DO NOTHING', m, m);
    for (const r of releases) await db.run('INSERT INTO release_scopes (code, label) VALUES (?, ?) ON CONFLICT (code) DO NOTHING', r, r);
    return { identical: false, revisionId, revisionNo, snippets: snippetCount, warning };
  });
}

/** Mehrzeiliges INSERT in Blöcken (Parametergrenzen: SQLite 32 766, PostgreSQL 65 535) */
async function insertMany(ctx: Ctx, target: string, rows: unknown[][], chunk = 200) {
  for (let i = 0; i < rows.length; i += chunk) {
    const part = rows.slice(i, i + chunk);
    const marks = `(${part[0].map(() => '?').join(', ')})`;
    await ctx.db.run(`INSERT INTO ${target} VALUES ${part.map(() => marks).join(', ')}`, ...part.flat());
  }
}

/** Nummerierte Überschriften („3.“, „3.2“) werden nach ihrer Nummer sortiert, sonst nach Reihenfolge des Auftretens. */
function numberedPosition(title: string): number | null {
  const m = /^\s*(?:kapitel\s+)?(\d+(?:\.\d+)*)\.?\s/i.exec(title);
  if (!m) return null;
  const last = Number(m[1].split('.').pop());
  return Number.isFinite(last) ? last * 1000 : null;
}

async function ensureChapter(ctx: Ctx, title: string | null): Promise<Row> {
  const { key, title: display } = chapterOf({ chapterTitle: title });
  const existing = await ctx.db.get('SELECT * FROM chapters WHERE project_id = ? AND key = ?', ctx.projectId, key);
  if (existing) return existing;
  const pos = numberedPosition(display) ?? (((await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM chapters WHERE project_id = ?', ctx.projectId))?.m ?? 0) + 1);
  const row = { id: newId('ch'), key, title: display, position: key === '__none__' ? 0 : pos };
  await ctx.db.run('INSERT INTO chapters (id, project_id, key, title, position) VALUES (?, ?, ?, ?, ?)', row.id, ctx.projectId, row.key, row.title, row.position);
  return row;
}

async function ensureSubchapter(ctx: Ctx, chapterId: string, title: string): Promise<Row> {
  const key = headingKey(title) || title;
  const existing = await ctx.db.get('SELECT * FROM subchapters WHERE chapter_id = ? AND key = ?', chapterId, key);
  if (existing) return existing;
  const pos = numberedPosition(title) ?? (((await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM subchapters WHERE chapter_id = ?', chapterId))?.m ?? 0) + 1);
  const row = { id: newId('sub'), key, title, position: pos };
  await ctx.db.run('INSERT INTO subchapters (id, chapter_id, key, title, position) VALUES (?, ?, ?, ?, ?)', row.id, chapterId, key, title, pos);
  return row;
}

export async function getImport(ctx: Ctx, id: string) {
  const row = await ctx.db.get('SELECT * FROM imports WHERE id = ?', id);
  if (!row) throw notFound(`Import ${id}`);
  const items = await ctx.db.all('SELECT id, path, sha256, status, message, revision_id AS revisionId FROM import_items WHERE import_id = ? ORDER BY position, path', id);
  return {
    id: row.id, fileName: row.file_name, kind: row.kind, sha256: row.sha256, byteSize: row.byte_size, status: row.status,
    createdBy: row.created_by, createdAt: row.created_at, finishedAt: row.finished_at, stats: parseJson(row.stats, {}), error: row.error, items,
  };
}

export async function listImports(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT id FROM imports WHERE project_id = ? ORDER BY created_at DESC', ctx.projectId);
  return Promise.all(rows.map(async (r) => {
    const { items, ...rest } = await getImport(ctx, r.id);
    return { ...rest, itemCount: items.length };
  }));
}

export async function listSources(ctx: Ctx) {
  const docs = await ctx.db.all('SELECT * FROM source_documents WHERE project_id = ? ORDER BY path', ctx.projectId);
  return Promise.all(docs.map(async (d) => ({
    id: d.id,
    path: d.path,
    fileName: d.file_name,
    revisions: (await ctx.db.all(
      `SELECT r.id, r.revision_no AS revisionNo, r.sha256, r.byte_size AS byteSize, r.is_current AS isCurrent, r.imported_at AS importedAt, r.import_id AS importId,
        r.front_matter AS frontMatter, r.source_format AS sourceFormat, (SELECT COUNT(*) FROM text_snippets s WHERE s.revision_id = r.id) AS snippetCount
       FROM source_revisions r WHERE r.document_id = ? ORDER BY r.revision_no DESC`, d.id,
    )).map((r) => ({ ...r, isCurrent: !!r.isCurrent, frontMatter: parseJson(r.frontMatter, {}) })),
  })));
}

export async function getRevisionRaw(ctx: Ctx, revisionId: string) {
  const r = await ctx.db.get('SELECT storage_key FROM source_revisions WHERE id = ?', revisionId);
  if (!r) throw notFound(`Revision ${revisionId}`);
  return (await ctx.store.get(r.storage_key)).toString('utf8');
}

const ORIGINAL_TYPES: Record<string, string> = {
  html: 'text/plain; charset=utf-8', // nie als HTML ausliefern (keine Skriptausführung)
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/** Originaldatei einer umgewandelten Revision (HTML, Word) */
export async function getRevisionOriginal(ctx: Ctx, revisionId: string) {
  const r = await ctx.db.get('SELECT r.original_key, r.source_format, d.file_name FROM source_revisions r JOIN source_documents d ON d.id = r.document_id WHERE r.id = ?', revisionId);
  if (!r) throw notFound(`Revision ${revisionId}`);
  if (!r.original_key) throw notFound(`Originaldatei zu Revision ${revisionId} (Markdown-Quelle)`);
  return { data: await ctx.store.get(r.original_key), fileName: r.file_name as string, contentType: ORIGINAL_TYPES[r.source_format] ?? 'application/octet-stream' };
}
