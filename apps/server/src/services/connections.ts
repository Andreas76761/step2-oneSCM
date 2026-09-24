// Git-Quellverbindungen mit automatischer Neu-Synchronisierung (ADR-022).
// Ein Sync klont den Stand flach (depth 1), sammelt Markdown-, HTML- und Word-Dateien unterhalb des Unterordners
// und führt sie als ZIP-Import durch die normale Pipeline (Revisionen, Identitätserkennung, Analyse).
import { execFile } from 'node:child_process';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import JSZip from 'jszip';
import { audit, getSettings, type Ctx } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { CONVERTIBLE } from '../domain/convert.js';
import { MEDIA_EXT } from '../domain/media.js';
import { badRequest, notFound } from '../problem.js';
import { createImport } from './imports.js';
import { assertSafeUrl } from './webhooks.js';
import { sha256 } from '../domain/similarity.js';
import { withProject } from './projects.js';
import { Problem } from '../problem.js';

const run = promisify(execFile);
const CREDENTIAL_ENV = /^(GIT|CONFLUENCE)_CREDENTIAL_[A-Z0-9_]{1,64}$/;
const SPACE_KEY = /^[A-Za-z0-9_~-]{1,64}$/;
const BRANCH = /^(?!-)(?!.*\.\.)[\w./-]{1,200}$/;
/** An git weitergereichte Umgebung: nur Pfad, Proxy und Zertifikate – keine Geheimnisse des Servers */
const PASS_ENV = ['PATH', 'HTTP_PROXY', 'HTTPS_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'no_proxy', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'GIT_SSL_CAINFO'];

export interface ConnectionInput {
  /** git (Standard) oder confluence (Confluence Cloud REST-API, ADR-028) */
  kind?: string;
  spaceKey?: string;
  /** neues Geheimnis für den Push-Webhook erzeugen (wird nur in dieser Antwort gezeigt) */
  rotateWebhookSecret?: boolean;
  name?: string;
  url?: string;
  branch?: string | null;
  subPath?: string;
  credentialEnv?: string | null;
  intervalMinutes?: number;
}

function dto(r: Row) {
  return {
    id: r.id, kind: r.kind, name: r.name, url: r.url, branch: r.branch, subPath: r.sub_path, credentialEnv: r.credential_env,
    credentialAvailable: r.credential_env ? !!process.env[r.credential_env] : null,
    intervalMinutes: r.interval_minutes, status: r.status, nextSyncAt: r.next_sync_at, lastSyncAt: r.last_sync_at, lastCommit: r.last_commit, pendingCommit: r.pending_commit ?? null,
    lastImportId: r.last_import_id, lastError: r.last_error, createdBy: r.created_by, createdAt: r.created_at,
    spaceKey: r.space_key ?? null,
    // Push-Webhook (ADR-028): GitHub (X-Hub-Signature-256) oder GitLab (X-Gitlab-Token)
    webhookPath: r.kind === 'git' ? `/api/v1/hooks/source-connections/${r.id}` : null, hasWebhookSecret: !!r.webhook_secret,
  };
}

const newSecret = () => `whsec_${randomBytes(24).toString('base64url')}`;

function validate(ctx: Ctx, input: ConnectionInput, partial: boolean, kind: string) {
  const out: Record<string, unknown> = {};
  if (kind === 'confluence') {
    if (input.spaceKey !== undefined || !partial) {
      const key = String(input.spaceKey ?? '').trim();
      if (!SPACE_KEY.test(key)) throw badRequest('Confluence: Bereichsschlüssel (spaceKey) erforderlich.');
      out.space_key = key;
    }
    if (input.url !== undefined || !partial) {
      const raw = String(input.url ?? '').trim().replace(/\/+$/, '');
      let url: URL;
      try {
        url = new URL(raw);
      } catch {
        throw badRequest('Ungültige Confluence-URL (z. B. https://firma.atlassian.net/wiki).');
      }
      if (url.protocol !== 'https:' && !(ctx.config.integrations.allowInsecure && url.protocol === 'http:')) throw badRequest('Nur https-URLs sind erlaubt.');
      if (url.username || url.password) throw badRequest('Die URL darf keine Zugangsdaten enthalten – über „credentialEnv“ angeben.');
      out.url = raw;
    }
    input = { ...input, url: undefined, branch: undefined, subPath: undefined };
  }
  if (input.name !== undefined || !partial) {
    const name = String(input.name ?? '').trim();
    if (!name || name.length > 120) throw badRequest('Name (1–120 Zeichen) erforderlich.');
    out.name = name;
  }
  if (kind === 'git' && (input.url !== undefined || !partial)) {
    const raw = String(input.url ?? '').trim();
    let url: URL | null = null;
    try {
      url = new URL(raw);
    } catch {
      /* ggf. lokaler Pfad */
    }
    const local = ctx.config.git.allowFile && (url?.protocol === 'file:' || (!url && path.isAbsolute(raw)));
    if (!local) {
      if (!url || url.protocol !== 'https:') throw badRequest('Nur https-URLs sind erlaubt.');
      // Zugangsdaten gehören in eine Umgebungsvariable, nie in die URL (Datenbank, Backup, Audit)
      if (url.username || url.password) throw badRequest('Die URL darf keine Zugangsdaten enthalten – Token über „credentialEnv“ angeben.');
    }
    out.url = raw;
  }
  if (input.branch !== undefined) {
    const b = input.branch ? String(input.branch).trim() : '';
    if (b && !BRANCH.test(b)) throw badRequest('Ungültiger Branch-Name.');
    out.branch = b || null;
  }
  if (input.subPath !== undefined) {
    const sp = path.posix.normalize(String(input.subPath ?? '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '') || '.');
    if (sp.startsWith('..')) throw badRequest('Unterordner darf nicht aus dem Repository herausführen.');
    out.sub_path = sp === '.' ? '' : sp;
  }
  if (input.credentialEnv !== undefined) {
    const c = input.credentialEnv ? String(input.credentialEnv).trim() : '';
    if (c && !CREDENTIAL_ENV.test(c)) throw badRequest('Zugangsdaten nur über eine Umgebungsvariable GIT_CREDENTIAL_… bzw. CONFLUENCE_CREDENTIAL_… angeben.');
    out.credential_env = c || null;
  }
  if (input.intervalMinutes !== undefined) {
    const i = Number(input.intervalMinutes);
    if (!Number.isInteger(i) || (i !== 0 && (i < 5 || i > 10080))) throw badRequest('Intervall: 0 (nur manuell) oder 5 … 10080 Minuten.');
    out.interval_minutes = i;
  }
  return out;
}

async function load(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM source_connections WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Quellverbindung ${id}`);
  return r;
}

export async function listConnections(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM source_connections WHERE project_id = ? ORDER BY name', ctx.projectId)).map(dto);
}

export async function getConnection(ctx: Ctx, id: string) {
  return dto(await load(ctx, id));
}

export async function createConnection(ctx: Ctx, input: ConnectionInput, actor: string) {
  const kind = input.kind ?? 'git';
  if (!['git', 'confluence'].includes(kind)) throw badRequest('kind muss git oder confluence sein.');
  const v = validate(ctx, input, false, kind);
  const id = newId('conn');
  const secret = kind === 'git' ? newSecret() : null;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO source_connections (id, project_id, kind, name, url, branch, sub_path, credential_env, interval_minutes, status, created_by, created_at, webhook_secret, space_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?, ?, ?)`,
      id, ctx.projectId, kind, v.name, v.url, v.branch ?? null, v.sub_path ?? '', v.credential_env ?? null, v.interval_minutes ?? 0, actor, now(), secret, v.space_key ?? null,
    );
    await audit(ctx, actor, 'source_connection.created', 'source_connection', id, { kind, name: v.name, url: v.url });
    // Erster Abgleich sofort; danach plant der Sync selbst die nächste Ausführung
    await ctx.jobs.enqueue('source-sync', { connectionId: id, actor }, 1);
  });
  ctx.jobs.wake();
  // Webhook-Geheimnis nur in dieser Antwort
  return { ...(await getConnection(ctx, id)), ...(secret ? { webhookSecret: secret } : {}) };
}

export async function updateConnection(ctx: Ctx, id: string, input: ConnectionInput, actor: string) {
  const before = await load(ctx, id);
  const v = validate(ctx, input, true, before.kind);
  const secret = input.rotateWebhookSecret && before.kind === 'git' ? newSecret() : null;
  if (secret) v.webhook_secret = secret;
  if (!Object.keys(v).length) return dto(before);
  await ctx.db.tx(async () => {
    await ctx.db.run(`UPDATE source_connections SET ${Object.keys(v).map((k) => `${k} = ?`).join(', ')} WHERE id = ?`, ...Object.values(v), id);
    await audit(ctx, actor, 'source_connection.updated', 'source_connection', id, { ...v, webhook_secret: secret ? '(neu)' : undefined });
    if (v.interval_minutes !== undefined && v.interval_minutes !== before.interval_minutes) await schedule(ctx, id, Number(v.interval_minutes));
    // andere Quelle (URL, Branch, Unterordner): Stand zurücksetzen und neu abgleichen – derselbe Commit liefert andere Dateien
    const sourceChanged = (['url', 'branch', 'sub_path', 'space_key'] as const).some((k) => k in v && v[k] !== before[k]);
    if (sourceChanged) {
      await ctx.db.run("UPDATE source_connections SET last_commit = NULL, pending_commit = NULL, status = 'queued' WHERE id = ?", id);
      await ctx.jobs.enqueue('source-sync', { connectionId: id, actor }, 1);
    }
  });
  ctx.jobs.wake();
  return { ...(await getConnection(ctx, id)), ...(secret ? { webhookSecret: secret } : {}) };
}

export async function deleteConnection(ctx: Ctx, id: string, actor: string) {
  await load(ctx, id);
  await ctx.db.tx(async () => {
    // geplante Jobs laufen ins Leere (Verbindung fehlt); Importe und Revisionen bleiben erhalten
    await ctx.db.run('DELETE FROM source_connections WHERE id = ?', id);
    await audit(ctx, actor, 'source_connection.deleted', 'source_connection', id, {});
  });
}

export async function requestSync(ctx: Ctx, id: string, actor: string, force = false) {
  const c = await load(ctx, id);
  if (['queued', 'syncing', 'importing'].includes(c.status)) return dto(c);
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE source_connections SET status = 'queued' WHERE id = ?", id);
    await ctx.jobs.enqueue('source-sync', { connectionId: id, actor, force }, 1);
  });
  ctx.jobs.wake();
  return getConnection(ctx, id);
}

/** Nächsten Abgleich planen. Ein neues Token macht ältere geplante Jobs wirkungslos (keine doppelten Ketten). */
async function schedule(ctx: Ctx, id: string, intervalMinutes: number) {
  if (!intervalMinutes) {
    await ctx.db.run('UPDATE source_connections SET schedule_token = NULL, next_sync_at = NULL WHERE id = ?', id);
    return;
  }
  const token = newId('sched');
  const delay = intervalMinutes * 60_000;
  await ctx.db.run('UPDATE source_connections SET schedule_token = ?, next_sync_at = ? WHERE id = ?', token, new Date(Date.now() + delay).toISOString(), id);
  await ctx.jobs.enqueue('source-sync', { connectionId: id, token, actor: 'system' }, 1, delay);
}

async function git(ctx: Ctx, args: string[], cwd: string, env: Record<string, string>) {
  const protocols = ['-c', 'protocol.allow=never', '-c', 'protocol.https.allow=always', ...(ctx.config.git.allowFile ? ['-c', 'protocol.file.allow=always'] : [])];
  const { stdout } = await run('git', [...protocols, '-c', 'core.symlinks=false', '-c', 'core.hooksPath=/dev/null', ...args], {
    cwd, env, timeout: ctx.config.git.timeoutMs, maxBuffer: 1024 * 1024,
  });
  return stdout.trim();
}

/** Flacher Klon; liefert Commit und die Dateien unterhalb des Unterordners (ohne symbolische Links). */
async function fetchRepository(ctx: Ctx, c: Row) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'onescm-git-'));
  const env: Record<string, string> = { GIT_TERMINAL_PROMPT: '0', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', HOME: dir, GIT_LFS_SKIP_SMUDGE: '1' };
  for (const k of PASS_ENV) if (process.env[k]) env[k] = process.env[k]!;
  if (c.credential_env) {
    const token = process.env[c.credential_env];
    if (!token) throw new Error(`Umgebungsvariable ${c.credential_env} ist nicht gesetzt.`);
    // Token nur über die Umgebung des git-Prozesses (nicht in Argumenten, URL oder Protokoll)
    Object.assign(env, { GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'http.extraHeader', GIT_CONFIG_VALUE_0: `Authorization: Basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}` });
  }
  try {
    const target = path.join(dir, 'repo');
    try {
      await git(ctx, ['clone', '--depth', '1', '--no-tags', '--single-branch', ...(c.branch ? ['--branch', c.branch] : []), '--', c.url, target], dir, env);
    } catch (e) {
      const stderr = String((e as any).stderr ?? (e as Error).message).split('\n').filter((l) => /fatal|error/i.test(l)).join(' ').slice(0, 500);
      throw new Error(`git clone fehlgeschlagen: ${stderr || (e as Error).message}`);
    }
    const commit = await git(ctx, ['rev-parse', 'HEAD'], target, env);
    // Symbolische Links (Modus 120000) nie importieren – mit core.symlinks=false liegen sie als Textdatei mit dem Linkziel vor
    const links = new Set((await git(ctx, ['ls-files', '-s', '-z'], target, env)).split('\0').filter((l) => l.startsWith('120000 ')).map((l) => path.join(target, l.split('\t')[1])));
    const settings = (await getSettings(ctx.db)).import;
    const exts = new Set(['.md', '.markdown', ...Object.keys(MEDIA_EXT), ...Object.keys(CONVERTIBLE).filter((x) => settings.allowedExtensions.includes(x))]);
    const root = path.join(target, c.sub_path || '');
    if (!fs.existsSync(root) || !fs.lstatSync(root).isDirectory()) throw new Error(`Unterordner „${c.sub_path}“ existiert im Repository nicht.`);
    const zip = new JSZip();
    let count = 0;
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (e.name.startsWith('.')) continue; // .git, versteckte Dateien
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.isFile() && !links.has(full) && exts.has(path.extname(e.name).toLowerCase())) {
          if (++count > settings.maxZipFiles) throw new Error(`Mehr als ${settings.maxZipFiles} Dateien im Repository.`);
          zip.file(path.relative(root, full).split(path.sep).join('/'), fs.readFileSync(full));
        }
      }
    };
    walk(root);
    if (!count) throw new Error('Keine Markdown-, HTML- oder Word-Dateien gefunden.');
    return { commit, data: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }), files: count };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** Job-Handler `source-sync` */
export async function runSync(ctx: Ctx, payload: { connectionId: string; token?: string; force?: boolean; actor?: string }) {
  const c = await ctx.db.get('SELECT * FROM source_connections WHERE id = ?', payload.connectionId);
  if (!c) return; // gelöscht
  if (payload.token && payload.token !== c.schedule_token) return; // durch neuere Planung ersetzt
  await ctx.db.run("UPDATE source_connections SET status = 'syncing' WHERE id = ?", c.id);
  const actor = payload.actor ?? 'system';
  try {
    const repo = c.kind === 'confluence' ? await fetchConfluence(ctx, c) : await fetchRepository(ctx, c);
    if (repo.commit === c.last_commit && !payload.force) {
      await ctx.db.run("UPDATE source_connections SET status = 'idle', last_sync_at = ?, last_error = NULL WHERE id = ?", now(), c.id);
      await audit(ctx, actor, 'source_connection.synced', 'source_connection', c.id, { commit: repo.commit, unchanged: true });
    } else {
      // Commit gilt erst nach erfolgreichem Import als abgeglichen (finishConnectionImport)
      await ctx.db.run("UPDATE source_connections SET status = 'importing', pending_commit = ? WHERE id = ?", repo.commit, c.id);
      const imp = await createImport(ctx, `${c.name.replace(/[^\w.-]+/g, '_')}@${repo.commit.slice(0, 7)}.zip`, repo.data, actor);
      await ctx.db.run('UPDATE source_connections SET last_sync_at = ?, last_import_id = ?, last_error = NULL WHERE id = ?', now(), imp.id, c.id);
      await audit(ctx, actor, 'source_connection.synced', 'source_connection', c.id, { commit: repo.commit, importId: imp.id, files: repo.files });
    }
  } catch (e) {
    const msg = (e as Error).message;
    await ctx.db.run("UPDATE source_connections SET status = 'failed', last_sync_at = ?, last_error = ? WHERE id = ?", now(), msg, c.id);
    await audit(ctx, actor, 'source_connection.failed', 'source_connection', c.id, { error: msg });
  }
  await schedule(ctx, c.id, c.interval_minutes);
}

/** Job endgültig abgebrochen (z. B. Neustart während des Klonens) */
export async function failSync(ctx: Ctx, payload: { connectionId: string }, error: string) {
  await ctx.db.run("UPDATE source_connections SET status = 'failed', last_error = ? WHERE id = ?", error, payload.connectionId);
}

/** Nach Abschluss eines Imports: Commit der Verbindung übernehmen (Erfolg) oder Fehler melden (Import fehlgeschlagen). */
export async function finishConnectionImport(ctx: Ctx, importId: string, status: string, detail: string | null) {
  const c = await ctx.db.get('SELECT id, pending_commit FROM source_connections WHERE last_import_id = ? AND pending_commit IS NOT NULL', importId);
  if (!c) return;
  if (status === 'failed') {
    await ctx.db.run("UPDATE source_connections SET status = 'failed', pending_commit = NULL, last_error = ? WHERE id = ?", `Import fehlgeschlagen: ${detail ?? 'unbekannter Fehler'}`, c.id);
    return;
  }
  // teilweise fehlerhafte Dateien: Stand übernehmen (ein erneuter Import desselben Commits ändert nichts), Fehler sichtbar machen
  await ctx.db.run(
    "UPDATE source_connections SET status = 'idle', last_commit = pending_commit, pending_commit = NULL, last_error = ? WHERE id = ?",
    status === 'completed_with_errors' ? `Import mit Fehlern: ${detail}` : null, c.id,
  );
}

// ------------------------------------------------------------------ Confluence Cloud (ADR-028)

/**
 * Seiten eines Bereichs über die REST-API lesen (Speicherformat = XHTML) und als HTML-Dateien in die normale
 * Import-Pipeline geben (ADR-022). Stand = Hash über Seiten-IDs und Versionsnummern – unverändert: kein Import.
 * Zugang: Umgebungsvariable CONFLUENCE_CREDENTIAL_* mit „E-Mail:API-Token“ (Basic) oder persönlichem Token (Bearer).
 */
async function fetchConfluence(ctx: Ctx, c: Row) {
  const base = c.url.replace(/\/+$/, '');
  await assertSafeUrl(base, ctx.config.integrations.allowInsecure);
  const headers: Record<string, string> = { accept: 'application/json' };
  if (c.credential_env) {
    const cred = process.env[c.credential_env];
    if (!cred) throw new Error(`Umgebungsvariable ${c.credential_env} ist nicht gesetzt.`);
    headers.authorization = cred.includes(':') ? `Basic ${Buffer.from(cred).toString('base64')}` : `Bearer ${cred}`;
  }
  const settings = (await getSettings(ctx.db)).import;
  const pages: { id: string; title: string; version: number; html: string }[] = [];
  let next: string | null = `${base}/rest/api/content?spaceKey=${encodeURIComponent(c.space_key)}&type=page&status=current&expand=body.storage,version&limit=50`;
  for (let guard = 0; next && guard < 1000; guard++) {
    const res: Response = await fetch(next, { headers, redirect: 'error', signal: AbortSignal.timeout(ctx.config.git.timeoutMs) });
    if (!res.ok) throw new Error(`Confluence antwortete mit ${res.status}${res.status === 401 || res.status === 403 ? ' (Zugangsdaten prüfen)' : ''}.`);
    const data = (await res.json()) as { results?: any[]; _links?: { next?: string; base?: string } };
    for (const p of data.results ?? []) {
      pages.push({ id: String(p.id), title: String(p.title ?? p.id), version: Number(p.version?.number ?? 0), html: String(p.body?.storage?.value ?? '') });
      if (pages.length > settings.maxZipFiles) throw new Error(`Mehr als ${settings.maxZipFiles} Seiten im Bereich.`);
    }
    // next-Links sind relativ zur Basis (Cloud: „/rest/api/…“ bzw. „/wiki/rest/api/…“)
    const link = data._links?.next;
    next = link ? confluenceLink(base, link) : null;
  }
  if (!pages.length) throw new Error(`Keine Seiten im Bereich „${c.space_key}“ gefunden.`);
  pages.sort((a, b) => a.id.localeCompare(b.id));
  const zip = new JSZip();
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const attr = (tag: string, name: string) => new RegExp(`\\b${name}=["']([^"']*)["']`).exec(tag)?.[1];
  const state: string[] = [];
  let files = 0;
  for (const p of pages) {
    state.push(`${p.id}:${p.version}`);
    // Bilder (ADR-029): <ac:image><ri:attachment ri:filename="…"/></ac:image> → Anhang laden und als <img> referenzieren
    let html = p.html;
    const imageTags = [...html.matchAll(/<ac:image\b([^>]*)>([\s\S]*?)<\/ac:image>/g)];
    if (imageTags.length) {
      const attachments = await confluenceAttachments(ctx, base, headers, p.id);
      const loaded = new Map<string, string | null>();
      for (const [, , inner] of imageTags) {
        const file = attr(inner, 'ri:filename');
        const a = file ? attachments.find((x) => x.title === file) : undefined;
        if (!file || !a || loaded.has(file)) continue;
        loaded.set(file, null);
        if (!MEDIA_EXT[path.extname(file).toLowerCase()] || a.size > settings.maxEntryBytes) continue;
        const res = await fetch(confluenceLink(base, a.download), { headers, redirect: 'error', signal: AbortSignal.timeout(ctx.config.git.timeoutMs) });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > settings.maxEntryBytes) continue;
        if (++files > settings.maxZipFiles) throw new Error(`Mehr als ${settings.maxZipFiles} Dateien im Bereich.`);
        zip.file(`${c.space_key}/attachments/${p.id}/${file}`, buf);
        loaded.set(file, `attachments/${p.id}/${encodeURIComponent(file)}`);
        state.push(`${p.id}/${file}:${a.version}`);
      }
      html = html.replace(/<ac:image\b([^>]*)>([\s\S]*?)<\/ac:image>/g, (_all, attrs: string, inner: string) => {
        const file = attr(inner, 'ri:filename');
        const alt = attr(attrs, 'ac:alt') ?? attr(attrs, 'ac:title') ?? '';
        const src = file ? loaded.get(file) : null;
        return src ? `<img src="${esc(src)}" alt="${alt}">` : alt ? `<img alt="${alt}">` : '';
      });
    }
    const slug = p.title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'seite';
    zip.file(`${c.space_key}/${slug}-${p.id}.html`, `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(c.space_key)} : ${esc(p.title)}</title></head><body><div id="main-content">${html}</div></body></html>`);
  }
  // Stand über Seiten- und Anhangversionen: ein ausgetauschter Screenshot löst einen neuen Import aus
  const commit = sha256(state.join('|'));
  return { commit, data: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }), files: pages.length + files };
}

/** Relativer Confluence-Link (Cloud: „/rest/api/…“ bzw. „/wiki/…“) → absolute URL auf demselben Host */
function confluenceLink(base: string, link: string) {
  const url = /^https?:/.test(link) ? link : `${base.replace(/\/wiki$/, '')}${link.startsWith('/wiki') ? '' : base.endsWith('/wiki') ? '/wiki' : ''}${link}`;
  if (new URL(url).origin !== new URL(base).origin) throw new Error('Confluence: Verweis auf fremden Host.');
  return url;
}

async function confluenceAttachments(ctx: Ctx, base: string, headers: Record<string, string>, pageId: string) {
  const res = await fetch(`${base}/rest/api/content/${encodeURIComponent(pageId)}/child/attachment?limit=200&expand=version`, { headers, redirect: 'error', signal: AbortSignal.timeout(ctx.config.git.timeoutMs) });
  if (!res.ok) return [];
  const data = (await res.json()) as { results?: any[] };
  return (data.results ?? []).map((a) => ({
    title: String(a.title ?? ''), download: String(a._links?.download ?? ''), version: Number(a.version?.number ?? 0), size: Number(a.extensions?.fileSize ?? 0),
  })).filter((a) => a.title && a.download);
}

// ------------------------------------------------------------------ Push-Webhook (ADR-028)

/**
 * Eingehender Push eines Git-Servers: GitHub (X-Hub-Signature-256 = HMAC-SHA256 des Rumpfs) oder GitLab (X-Gitlab-Token).
 * Öffentlicher Endpunkt – authentisiert ausschließlich über das Geheimnis der Verbindung.
 */
export async function handlePushWebhook(base: Ctx, connectionId: string, headers: Record<string, string | string[] | undefined>, rawBody: string) {
  const h = (n: string) => {
    const v = headers[n];
    return Array.isArray(v) ? v[0] : v;
  };
  const c = await base.db.get("SELECT * FROM source_connections WHERE id = ? AND kind = 'git'", connectionId);
  // unbekannt und falsches Geheimnis sind nicht unterscheidbar (keine Preisgabe von Verbindungs-IDs)
  const denied = new Problem(401, 'Unauthorized', 'Webhook-Signatur ungültig.');
  if (!c?.webhook_secret) throw denied;
  const sig = h('x-hub-signature-256');
  const token = h('x-gitlab-token');
  const safeEq = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
  const ok = sig ? safeEq(sig, `sha256=${createHmac('sha256', c.webhook_secret).update(rawBody).digest('hex')}`) : token ? safeEq(token, c.webhook_secret) : false;
  if (!ok) throw denied;
  if (h('x-github-event') === 'ping') return { status: 'pong' };
  let payload: any = {};
  try {
    payload = JSON.parse(rawBody || '{}');
  } catch {
    throw new Problem(400, 'Bad Request', 'Rumpf ist kein JSON.');
  }
  const ref = typeof payload.ref === 'string' ? payload.ref : null;
  const defaultBranch = payload.repository?.default_branch ?? payload.project?.default_branch ?? null;
  const wanted = c.branch ?? defaultBranch;
  if (ref && wanted && ref !== `refs/heads/${wanted}`) return { status: 'ignored', reason: `Push auf ${ref}, verbunden ist ${wanted}.` };
  const ctx = withProject(base, c.project_id);
  const res = await requestSync(ctx, c.id, 'webhook');
  await audit(ctx, 'webhook', 'source_connection.push_received', 'source_connection', c.id, { ref, after: payload.after ?? payload.checkout_sha ?? null });
  return { status: 'queued', connection: res.status };
}
