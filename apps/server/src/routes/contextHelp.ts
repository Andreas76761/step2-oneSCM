// Kontexthilfe für oneSCM (ADR-030): Zuordnungen verwalten, Hilfe zu einer Kontext-ID abrufen (API, Deep-Link),
// öffentliche Einbettung (Widget) für veröffentlichte Releases mit Handbuch-Assistent.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FastifyInstance } from 'fastify';
import type { Ctx, User } from '../context.js';
import { Problem } from '../problem.js';
import { ask } from '../services/assistant.js';
import { createContext, deleteContext, latestRelease, listContexts, resolveHelp, setHelpPublic, updateContext, type ResolvedHelp } from '../services/contextHelp.js';
import { withProject } from '../services/projects.js';
import { escapeHtml } from '../services/render.js';
import { userOf } from './helpers.js';

export function contextHelpRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { chapterId?: string } }>('/help-contexts', async (req) => (userOf(req.ctx, req), listContexts(req.ctx, req.query.chapterId)));
  app.post<{ Body: any }>('/help-contexts', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createContext(req.ctx, req.body ?? {}, user);
  });
  app.patch<{ Params: { helpContextId: string }; Body: any }>('/help-contexts/:helpContextId', async (req) => updateContext(req.ctx, req.params.helpContextId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { helpContextId: string } }>('/help-contexts/:helpContextId', async (req, reply) => {
    await deleteContext(req.ctx, req.params.helpContextId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.put<{ Body: { public?: boolean } }>('/help-settings', async (req) => setHelpPublic(req.ctx, !!req.body?.public, userOf(req.ctx, req, 'admin')));
  // Hilfe zu einer Kontext-ID (angemeldet oder per API-Token): aktuell freigegebener Stand
  app.get<{ Params: { contextKey: string }; Querystring: { role?: string; division?: string; language?: string } }>('/context-help/:contextKey', async (req) => {
    userOf(req.ctx, req);
    const { versionIds: _v, ...help } = await resolveHelp(req.ctx, req.params.contextKey, req.query, 'approved');
    return help;
  });
}

// ------------------------------------------------------------------ öffentliche Einbettung

const LABELS: Record<string, Record<string, string>> = {
  de: { help: 'oneSCM-Hilfe', ask: 'Frage an den Handbuch-Assistenten', send: 'Fragen', sources: 'Quellen', open: 'Im Handbuch öffnen', fallback: 'Noch nicht übersetzt – deutsche Fassung.', none: 'Zu dieser Stelle gibt es noch keine veröffentlichte Hilfe.', version: 'Version' },
  en: { help: 'oneSCM help', ask: 'Ask the manual assistant', send: 'Ask', sources: 'Sources', open: 'Open in manual', fallback: 'Not yet translated – German version shown.', none: 'No published help for this screen yet.', version: 'Version' },
  fr: { help: 'Aide oneSCM', ask: 'Poser une question à l’assistant', send: 'Demander', sources: 'Sources', open: 'Ouvrir dans le manuel', fallback: 'Pas encore traduit – version allemande affichée.', none: 'Pas encore d’aide publiée pour cet écran.', version: 'Version' },
  es: { help: 'Ayuda de oneSCM', ask: 'Preguntar al asistente', send: 'Preguntar', sources: 'Fuentes', open: 'Abrir en el manual', fallback: 'Aún no traducido: se muestra la versión alemana.', none: 'Aún no hay ayuda publicada para esta pantalla.', version: 'Versión' },
  it: { help: 'Guida oneSCM', ask: 'Chiedi all’assistente', send: 'Chiedi', sources: 'Fonti', open: 'Apri nel manuale', fallback: 'Non ancora tradotto: viene mostrata la versione tedesca.', none: 'Non c’è ancora una guida pubblicata per questa schermata.', version: 'Versione' },
};
const label = (lang: string) => LABELS[lang] ?? LABELS.de;

const EMBED_CSS = `body{font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;margin:0;padding:12px 14px;background:#fff}
h1{font-size:18px;margin:0 0 2px}h2{font-size:15px;margin:14px 0 4px;border-bottom:1px solid #cbd5e1}.meta{color:#5b6474;font-size:12px}
.block{margin:4px 0 8px}.kind-note,.kind-tip{background:#eaf1fd;border-left:4px solid #1d63d8;padding:4px 8px}.kind-warning{background:#fdecec;border-left:4px solid #b91c1c;padding:4px 8px}
img{max-width:100%;height:auto;border:1px solid #e2e8f0}table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:3px 6px}
form{margin-top:16px;border-top:1px solid #cbd5e1;padding-top:10px}label{display:block;font-weight:600;margin-bottom:4px}
input[type=text]{width:100%;box-sizing:border-box;padding:6px;border:1px solid #64748b;border-radius:4px;font:inherit}
button{margin-top:6px;padding:6px 12px;border:0;border-radius:4px;background:#1d4ed8;color:#fff;font:inherit;cursor:pointer}
button:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
.answer{background:#f1f5f9;border-radius:6px;padding:8px 10px;margin-top:10px}.answer sup{color:#1d4ed8}a{color:#1d4ed8}`;

interface EmbedState {
  lang: string;
  help: ResolvedHelp | null;
  question?: string;
  answer?: Awaited<ReturnType<typeof ask>>;
  error?: string;
  action: string;
  role?: string;
  division?: string;
  appUrl: string | null;
}

function embedPage(s: EmbedState) {
  const l = label(s.lang);
  const h = s.help;
  const hidden = (n: string, v?: string) => (v ? `<input type="hidden" name="${n}" value="${escapeHtml(v)}">` : '');
  const answer = s.answer
    ? `<div class="answer" role="status">${s.answer.answer.length
      ? `<p>${s.answer.answer.map((a) => `${escapeHtml(a.text)}${a.sources.map((n) => `<sup>[${n}]</sup>`).join('')}`).join(' ')}</p>
         <p class="meta">${escapeHtml(l.sources)}: ${s.answer.sources.map((x) => `[${x.n}] ${escapeHtml(x.chapter)} – ${escapeHtml(x.sectionTitle)}`).join(' · ')}</p>`
      : `<p>${escapeHtml(s.answer.notice ?? '')}</p>`}</div>`
    : s.error ? `<div class="answer" role="alert">${escapeHtml(s.error)}</div>` : '';
  const deep = h && s.appUrl ? ` · <a href="${escapeHtml(`${s.appUrl.replace(/\/+$/, '')}${h.deepLink}`)}" target="_blank" rel="noopener">${escapeHtml(l.open)}</a>` : '';
  const body = h
    ? `<h1>${escapeHtml(h.title)}</h1>
<p class="meta">${escapeHtml(l.version)} ${escapeHtml(h.release?.version ?? String(h.versionNo))}${deep}</p>
${h.fallback ? `<p class="meta" lang="${escapeHtml(s.lang)}"><strong>${escapeHtml(l.fallback)}</strong></p>` : ''}
<div${h.fallback ? ' lang="de"' : ''}>${h.html}</div>`
    : `<h1>${escapeHtml(l.help)}</h1><p>${escapeHtml(l.none)}</p>`;
  return `<!doctype html>
<html lang="${escapeHtml(s.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(h?.title ?? l.help)}</title><style>${EMBED_CSS}</style></head>
<body><main>${body}
${h ? `<form method="post" action="${escapeHtml(s.action)}">
<label for="q">${escapeHtml(l.ask)}</label>
<input type="text" id="q" name="question" required minlength="3" maxlength="500" value="${escapeHtml(s.question ?? '')}">
${hidden('role', s.role)}${hidden('division', s.division)}${hidden('language', s.lang === 'de' ? undefined : s.lang)}
<button type="submit">${escapeHtml(l.send)}</button>
</form>${answer}` : ''}
</main></body></html>`;
}

const WIDGET_JS = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'help-widget.js'), 'utf8');

/**
 * Öffentliche Kontexthilfe unter /help (ohne Anmeldung): nur für Projekte mit freigeschalteter Einbettung
 * und nur der Stand des neuesten veröffentlichten Releases. Einbettung in fremde Seiten nur für HELP_EMBED_ORIGINS.
 */
export async function publicHelpRoutes(app: FastifyInstance, base: Ctx, embedOrigins: string[]) {
  const ancestors = embedOrigins.length ? embedOrigins.join(' ') : "'self'";
  const csp = `default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'self'; base-uri 'none'; frame-ancestors ${ancestors}`;
  const helpUser: User = { id: 'help-widget', name: 'Kontexthilfe (öffentlich)', permissions: ['read'] };

  app.get('/help/widget.js', async (_req, reply) => {
    reply.header('Content-Type', 'text/javascript; charset=utf-8').header('Cache-Control', 'public, max-age=3600');
    return WIDGET_JS;
  });

  await app.register(async (embed) => {
    // Formular des Assistenten (application/x-www-form-urlencoded, ohne Skripte)
    embed.addContentTypeParser('application/x-www-form-urlencoded', { parseAs: 'string', bodyLimit: 4096 }, (_req, body, done) => {
      done(null, Object.fromEntries(new URLSearchParams(String(body))));
    });

    type Req = { Params: { projectId: string; contextKey: string }; Querystring: Record<string, string>; Body: Record<string, string> };
    const handle = async (req: any, reply: any, asking: boolean) => {
      const { projectId, contextKey } = req.params as Req['Params'];
      const input = { ...(req.query ?? {}), ...(asking ? req.body ?? {} : {}) } as Record<string, string>;
      const role = input.role || undefined;
      const division = input.division || undefined;
      const lang = String(input.language || 'de').slice(0, 5);
      reply.header('Content-Security-Policy', csp).header('Content-Type', 'text/html; charset=utf-8').header('Cache-Control', 'no-store');
      const project = /^[\w-]{1,80}$/.test(projectId) ? await base.db.get('SELECT id, help_public, archived_at FROM projects WHERE id = ?', projectId) : undefined;
      const ctx = project?.help_public ? withProject(base, project.id) : null;
      const state: EmbedState = { lang: LABELS[lang] ? lang : 'de', help: null, action: `/help/embed/${encodeURIComponent(projectId)}/${encodeURIComponent(contextKey)}`, role, division, appUrl: base.config.notify.appUrl };
      // nicht freigeschaltet und unbekannt sind nicht unterscheidbar
      if (!ctx) return reply.code(404).send(embedPage(state));
      try {
        state.help = await resolveHelp(ctx, contextKey, { role, division, language: lang }, 'release');
      } catch (e) {
        if (e instanceof Problem && (e.status === 404 || e.status === 400)) return reply.code(e.status).send(embedPage(state));
        throw e;
      }
      if (asking) {
        state.question = String(input.question ?? '').slice(0, 500);
        try {
          const rel = await latestRelease(ctx);
          state.answer = await ask(ctx, { question: state.question, language: lang, role, division }, helpUser, { versionIds: rel?.chapters.map((c) => c.chapterVersionId) ?? [] });
        } catch (e) {
          if (!(e instanceof Problem) || e.status >= 500) throw e;
          state.error = e.detail;
        }
      }
      return reply.send(embedPage(state));
    };
    embed.get<Req>('/help/embed/:projectId/:contextKey', (req, reply) => handle(req, reply, false));
    embed.post<Req>('/help/embed/:projectId/:contextKey', (req, reply) => handle(req, reply, true));
  });
}
