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
import { submitFeedback } from '../services/feedback.js';
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
  de: { see: 'Siehe auch', faq: 'Häufige Fragen', fb: 'War das hilfreich?', yes: 'Ja', no: 'Nein', comment: 'Was fehlt? (optional)', thanks: 'Danke für Ihre Rückmeldung.', limit: 'Zu viele Rückmeldungen – bitte später erneut versuchen.', help: 'oneSCM-Hilfe', ask: 'Frage an den Handbuch-Assistenten', send: 'Fragen', sources: 'Quellen', open: 'Im Handbuch öffnen', fallback: 'Noch nicht übersetzt – deutsche Fassung.', none: 'Zu dieser Stelle gibt es noch keine veröffentlichte Hilfe.', version: 'Version' },
  en: { see: 'See also', faq: 'Frequently asked questions', fb: 'Was this helpful?', yes: 'Yes', no: 'No', comment: 'What is missing? (optional)', thanks: 'Thank you for your feedback.', limit: 'Too much feedback – please try again later.', help: 'oneSCM help', ask: 'Ask the manual assistant', send: 'Ask', sources: 'Sources', open: 'Open in manual', fallback: 'Not yet translated – German version shown.', none: 'No published help for this screen yet.', version: 'Version' },
  fr: { see: 'Voir aussi', faq: 'Questions fréquentes', fb: 'Cette aide vous a-t-elle été utile ?', yes: 'Oui', no: 'Non', comment: 'Que manque-t-il ? (facultatif)', thanks: 'Merci pour votre retour.', limit: 'Trop de retours – veuillez réessayer plus tard.', help: 'Aide oneSCM', ask: 'Poser une question à l’assistant', send: 'Demander', sources: 'Sources', open: 'Ouvrir dans le manuel', fallback: 'Pas encore traduit – version allemande affichée.', none: 'Pas encore d’aide publiée pour cet écran.', version: 'Version' },
  es: { see: 'Véase también', faq: 'Preguntas frecuentes', fb: '¿Le ha resultado útil?', yes: 'Sí', no: 'No', comment: '¿Qué falta? (opcional)', thanks: 'Gracias por su opinión.', limit: 'Demasiadas respuestas: inténtelo más tarde.', help: 'Ayuda de oneSCM', ask: 'Preguntar al asistente', send: 'Preguntar', sources: 'Fuentes', open: 'Abrir en el manual', fallback: 'Aún no traducido: se muestra la versión alemana.', none: 'Aún no hay ayuda publicada para esta pantalla.', version: 'Versión' },
  it: { see: 'Vedi anche', faq: 'Domande frequenti', fb: 'È stato utile?', yes: 'Sì', no: 'No', comment: 'Cosa manca? (facoltativo)', thanks: 'Grazie per il riscontro.', limit: 'Troppi riscontri: riprovare più tardi.', help: 'Guida oneSCM', ask: 'Chiedi all’assistente', send: 'Chiedi', sources: 'Fonti', open: 'Apri nel manuale', fallback: 'Non ancora tradotto: viene mostrata la versione tedesca.', none: 'Non c’è ancora una guida pubblicata per questa schermata.', version: 'Versione' },
};
const label = (lang: string) => LABELS[lang] ?? LABELS.de;
/** Inhaltssprache wie angefragt (bleibt in Formularen und Links erhalten); Beschriftungen in fünf Sprachen, übrige englisch (ADR-074) */
function embedLanguages(requested: string) {
  const lang = /^[a-z]{2}$/.test(requested) ? requested : 'de';
  return { lang, ui: LABELS[lang] ? lang : lang === 'de' ? 'de' : 'en' };
}
/** anonyme Rückmeldungen je Stunde und Adresse (ADR-061) */
const FEEDBACK_MAX = Number(process.env.HELP_FEEDBACK_MAX ?? 10);

const EMBED_CSS = `body{font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;margin:0;padding:12px 14px;background:#fff}
h1{font-size:18px;margin:0 0 2px}h2{font-size:15px;margin:14px 0 4px;border-bottom:1px solid #cbd5e1}.meta{color:#5b6474;font-size:12px}
.block{margin:4px 0 8px}.kind-note,.kind-tip{background:#eaf1fd;border-left:4px solid #1d63d8;padding:4px 8px}.kind-warning{background:#fdecec;border-left:4px solid #b91c1c;padding:4px 8px}
img{max-width:100%;height:auto;border:1px solid #e2e8f0}table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:3px 6px}
form{margin-top:16px;border-top:1px solid #cbd5e1;padding-top:10px}label{display:block;font-weight:600;margin-bottom:4px}
input[type=text]{width:100%;box-sizing:border-box;padding:6px;border:1px solid #64748b;border-radius:4px;font:inherit}
button{margin-top:6px;padding:6px 12px;border:0;border-radius:4px;background:#1d4ed8;color:#fff;font:inherit;cursor:pointer}
button:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
.answer{background:#f1f5f9;border-radius:6px;padding:8px 10px;margin-top:10px}fieldset{border:1px solid #cbd5e1;border-radius:6px;margin:0;padding:8px 10px}legend{font-weight:600}.hp{position:absolute;left:-9999px;width:1px;height:1px}.answer sup{color:#1d4ed8}a{color:#1d4ed8}
details{border:1px solid #cbd5e1;border-radius:6px;padding:4px 8px;margin:4px 0}summary{cursor:pointer;font-weight:600;min-height:24px}.see ul{margin:4px 0;padding-left:20px}.see li{min-height:24px}`;

interface EmbedState {
  /** angefragte Inhaltssprache – bleibt in Formularen und Links erhalten */
  lang: string;
  /** Sprache der Beschriftungen (fünf Sprachen, übrige englisch, ADR-074) */
  ui: string;
  help: ResolvedHelp | null;
  question?: string;
  answer?: Awaited<ReturnType<typeof ask>>;
  error?: string;
  action: string;
  role?: string;
  division?: string;
  appUrl: string | null;
  /** Rückmeldung (ADR-061): gesendet bzw. abgelehnt */
  feedback?: 'sent' | 'limited';
}

/** „Siehe auch“ und passende FAQ (ADR-072): Verweise auf das Hilfethema des Zielkapitels, sonst nur der Titel */
function seeAlso(s: EmbedState) {
  const h = s.help;
  if (!h || (!h.related.length && !h.faq.length)) return '';
  const l = label(s.ui);
  const q = new URLSearchParams(Object.entries({ role: s.role, division: s.division, language: s.lang === 'de' ? undefined : s.lang }).filter(([, v]) => v) as [string, string][]);
  const base = s.action.replace(/\/[^/]*$/, '');
  const link = (r: { title: string; contextKey: string | null }) => (r.contextKey
    ? `<a href="${escapeHtml(`${base}/${encodeURIComponent(r.contextKey)}${q.size ? `?${q}` : ''}`)}">${escapeHtml(r.title)}</a>` : escapeHtml(r.title));
  return `${h.related.length ? `<nav class="see" aria-labelledby="see-h"><h2 id="see-h">${escapeHtml(l.see)}</h2><ul>${h.related.map((r) => `<li>${link(r)}</li>`).join('')}</ul></nav>` : ''}
${h.faq.length ? `<section aria-labelledby="faq-h"><h2 id="faq-h">${escapeHtml(l.faq)}</h2>${h.faq.map((f) => `<details><summary>${escapeHtml(f.question)}</summary>${f.html}</details>`).join('')}</section>` : ''}`;
}

function embedPage(s: EmbedState) {
  const l = label(s.ui);
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
${h.fallback ? `<p class="meta"><strong>${escapeHtml(l.fallback)}</strong></p>` : ''}
<div lang="${escapeHtml(h.fallback ? 'de' : h.language)}">${h.html}</div>
${seeAlso(s)}`
    : `<h1>${escapeHtml(l.help)}</h1><p>${escapeHtml(l.none)}</p>`;
  return `<!doctype html>
<html lang="${escapeHtml(s.ui)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(h?.title ?? l.help)}</title><style>${EMBED_CSS}</style></head>
<body><main>${body}
${h ? `<form method="post" action="${escapeHtml(s.action)}">
<label for="q">${escapeHtml(l.ask)}</label>
<input type="text" id="q" name="question" required minlength="3" maxlength="500" value="${escapeHtml(s.question ?? '')}">
${hidden('role', s.role)}${hidden('division', s.division)}${hidden('language', s.lang === 'de' ? undefined : s.lang)}
<button type="submit">${escapeHtml(l.send)}</button>
</form>${answer}
<form method="post" action="${escapeHtml(s.action)}/feedback" class="fb">
<fieldset><legend>${escapeHtml(l.fb)}</legend>
${s.feedback ? `<p role="status">${escapeHtml(s.feedback === 'sent' ? l.thanks : l.limit)}</p>` : `<label for="fbc">${escapeHtml(l.comment)}</label>
<input type="text" id="fbc" name="comment" maxlength="500">
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp">
${hidden('role', s.role)}${hidden('division', s.division)}${hidden('language', s.lang === 'de' ? undefined : s.lang)}
<button type="submit" name="helpful" value="1">👍 ${escapeHtml(l.yes)}</button> <button type="submit" name="helpful" value="0">👎 ${escapeHtml(l.no)}</button>`}
</fieldset></form>` : ''}
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
  const feedbackUser: User = { id: 'online-hilfe', name: 'Online-Hilfe (anonym)', permissions: ['read'] };

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
      const state: EmbedState = { ...embedLanguages(lang), help: null, action: `/help/embed/${encodeURIComponent(projectId)}/${encodeURIComponent(contextKey)}`, role, division, appUrl: base.config.notify.appUrl };
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
          // Sprache der angezeigten Hilfe: ohne freigegebene Übersetzung die deutsche Fassung
          state.answer = await ask(ctx, { question: state.question, language: state.help.language, role, division }, helpUser, { versionIds: rel?.chapters.map((c) => c.chapterVersionId) ?? [] });
        } catch (e) {
          if (!(e instanceof Problem) || e.status >= 500) throw e;
          state.error = e.detail;
        }
      }
      return reply.send(embedPage(state));
    };
    embed.get<Req>('/help/embed/:projectId/:contextKey', (req, reply) => handle(req, reply, false));
    embed.post<Req>('/help/embed/:projectId/:contextKey', (req, reply) => handle(req, reply, true));

    // Rückmeldung „War das hilfreich?“ (ADR-061): anonym, nur zu veröffentlichter Hilfe, höchstens FEEDBACK_MAX je Stunde und Adresse
    const recent = new Map<string, number[]>();
    embed.post<Req>('/help/embed/:projectId/:contextKey/feedback', async (req, reply) => {
      const { projectId, contextKey } = req.params;
      const input = (req.body ?? {}) as Record<string, string>;
      const lang = String(input.language || 'de').slice(0, 5);
      const role = input.role || undefined;
      const division = input.division || undefined;
      reply.header('Content-Security-Policy', csp).header('Content-Type', 'text/html; charset=utf-8').header('Cache-Control', 'no-store');
      const project = /^[\w-]{1,80}$/.test(projectId) ? await base.db.get('SELECT id, help_public FROM projects WHERE id = ?', projectId) : undefined;
      const ctx = project?.help_public ? withProject(base, project.id) : null;
      const state: EmbedState = { ...embedLanguages(lang), help: null, action: `/help/embed/${encodeURIComponent(projectId)}/${encodeURIComponent(contextKey)}`, role, division, appUrl: base.config.notify.appUrl };
      if (!ctx) return reply.code(404).send(embedPage(state));
      try {
        state.help = await resolveHelp(ctx, contextKey, { role, division, language: lang }, 'release');
      } catch (e) {
        if (e instanceof Problem && (e.status === 404 || e.status === 400)) return reply.code(e.status).send(embedPage(state));
        throw e;
      }
      if (input.helpful !== '1' && input.helpful !== '0') return reply.code(400).send(embedPage(state));
      const now = Date.now();
      const key = `${project!.id}:${req.ip}`;
      const hits = (recent.get(key) ?? []).filter((t) => now - t < 3_600_000);
      if (hits.length >= FEEDBACK_MAX) {
        state.feedback = 'limited';
        return reply.code(429).send(embedPage(state));
      }
      recent.set(key, [...hits, now]);
      if (recent.size > 10_000) for (const [k, v] of recent) if (!v.some((t) => now - t < 3_600_000)) recent.delete(k);
      // Feld „website“ ist für Menschen unsichtbar – ausgefüllt heißt Bot: freundlich bestätigen, nichts speichern
      if (!input.website) {
        const rel = await latestRelease(ctx);
        const versionId = rel?.chapters.find((c) => c.chapterId === state.help!.chapterId)?.chapterVersionId;
        await submitFeedback(ctx, state.help.chapterId, { helpful: input.helpful === '1', comment: String(input.comment ?? '').slice(0, 500), versionId }, feedbackUser, 'online-help');
      }
      state.feedback = 'sent';
      return reply.send(embedPage(state));
    });
  });
}
