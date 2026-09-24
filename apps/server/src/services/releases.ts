// Handbuch-Releases (ADR-018): unveränderlicher Stand aller freigegebenen Kapitel eines Projekts mit
// automatisch ermittelten Änderungen gegenüber dem Vorgänger-Release und einer statischen Online-Hilfe.
import JSZip from 'jszip';
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';
import { gateForChapter, getChapterVersion } from './chapters.js';
import { compareVersions } from './compare.js';
import { badgeLine, KIND_LABEL, renderMarkdown, visible, type ExportChapter } from './exports.js';
import { escapeHtml, markdownToHtml } from './render.js';
import { projectLanguages, translatedChapter } from './translations.js';
import { LANGUAGES } from '../domain/translate.js';

interface ReleaseChapter {
  chapterId: string;
  chapterVersionId: string;
  title: string;
  versionNo: number;
}

type ChangeKind = 'new' | 'updated' | 'removed' | 'unchanged';
interface ChapterChange {
  chapterId: string;
  title: string;
  change: ChangeKind;
  fromVersionNo: number | null;
  toVersionNo: number | null;
  summary: { added: number; removed: number; changed: number; moved: number } | null;
}

function releaseDto(r: Row) {
  return {
    id: r.id, version: r.version, title: r.title, notes: r.notes ?? null, createdBy: r.created_by, createdAt: r.created_at,
    previousReleaseId: r.previous_release_id ?? null,
    chapters: parseJson<ReleaseChapter[]>(r.chapters, []), changes: parseJson<ChapterChange[]>(r.changes, []),
    siteUrl: `/api/v1/releases/${r.id}/download?format=site`, markdownUrl: `/api/v1/releases/${r.id}/download?format=md`,
    languages: parseJson<{ language: string; translated: number; total: number }[]>(r.languages, []).map(({ language, translated, total }) => ({ language, translated, total })),
  };
}

export async function listReleases(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM handbook_releases WHERE project_id = ? ORDER BY created_at DESC', ctx.projectId)).map(releaseDto);
}

export async function getRelease(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM handbook_releases WHERE id = ?', id);
  if (!r) throw notFound(`Release ${id}`);
  return releaseDto(r);
}

const PAGE_CSS = `body{font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;margin:0}
header{background:#0f1f3d;color:#fff;padding:14px 20px}header a{color:#fff}main{max-width:860px;margin:0 auto;padding:20px}
nav.toc ol{padding-left:1.2rem}h2{border-bottom:2px solid #1d63d8;padding-bottom:4px}.meta{color:#5b6474;font-size:13px}
.badges{font-size:12px;color:#334155;margin:0 0 4px}.block{margin:6px 0 10px}.kind-note,.kind-tip{background:#eaf1fd;border-left:4px solid #1d63d8;padding:6px 10px}
.kind-warning{background:#fdecec;border-left:4px solid #b91c1c;padding:6px 10px}.label{font-weight:600;margin:0 0 2px}
table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:4px 8px}pre{background:#f3f4f6;padding:8px;white-space:pre-wrap}
a{color:#1d63d8}.pager{display:flex;justify-content:space-between;margin-top:30px}`;

/** Oberflächentexte der Online-Hilfe je Sprache (sonst Englisch) */
const UI: Record<string, Record<string, string>> = {
  de: { ask: 'Frage an den Handbuch-Assistenten', home: 'oneSCM Benutzerhandbuch', skip: 'Zum Inhalt springen', toc: 'Inhalt', changes: 'Änderungen in dieser Version', published: 'veröffentlicht am', version: 'Version', approved: 'Freigegebene Version', fallback: '', languages: 'Sprache', pager: 'Kapitel blättern' },
  en: { ask: 'Ask the manual assistant', home: 'oneSCM user manual', skip: 'Skip to content', toc: 'Contents', changes: 'Changes in this version', published: 'published on', version: 'Version', approved: 'Approved version', fallback: 'Not yet translated – German version shown.', languages: 'Language', pager: 'Browse chapters' },
  fr: { ask: 'Poser une question à l’assistant', home: 'Manuel utilisateur oneSCM', skip: 'Aller au contenu', toc: 'Sommaire', changes: 'Modifications de cette version', published: 'publié le', version: 'Version', approved: 'Version approuvée', fallback: 'Pas encore traduit – version allemande affichée.', languages: 'Langue', pager: 'Parcourir les chapitres' },
  es: { ask: 'Preguntar al asistente', home: 'Manual de usuario oneSCM', skip: 'Ir al contenido', toc: 'Índice', changes: 'Cambios en esta versión', published: 'publicado el', version: 'Versión', approved: 'Versión aprobada', fallback: 'Aún no traducido: se muestra la versión alemana.', languages: 'Idioma', pager: 'Recorrer capítulos' },
  it: { ask: 'Chiedi all’assistente', home: 'Manuale utente oneSCM', skip: 'Vai al contenuto', toc: 'Indice', changes: 'Modifiche in questa versione', published: 'pubblicato il', version: 'Versione', approved: 'Versione approvata', fallback: 'Non ancora tradotto: viene mostrata la versione tedesca.', languages: 'Lingua', pager: 'Sfoglia i capitoli' },
};
const ui = (lang: string) => UI[lang] ?? UI.en;

interface SiteLang {
  code: string;
  /** Pfadpräfix zum Wurzelverzeichnis der Site, von dieser Sprache aus */
  prefix: string;
}

function page(title: string, releaseLabel: string, body: string, lang = 'de', switcher = '') {
  // Eigenständig und ohne Skripte (ADR-012): eigene CSP, keine externen Ressourcen
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} – ${escapeHtml(releaseLabel)}</title><style>${PAGE_CSS}</style></head>
<body><a href="#inhalt" style="position:absolute;left:-999px">${escapeHtml(ui(lang).skip)}</a>
<header><a href="index.html">${escapeHtml(ui(lang).home)}</a> · ${escapeHtml(releaseLabel)}${switcher}</header>
<main id="inhalt">${body}</main></body></html>`;
}

function chapterHtml(ch: ExportChapter, lang = 'de', fallback = false) {
  const out: string[] = [`<h1>${escapeHtml(ch.title)}</h1>`, `<p class="meta">${escapeHtml(ui(lang).approved)} ${ch.versionNo}${ch.approvedAt ? ` · ${ch.approvedAt.slice(0, 10)}` : ''}</p>`];
  if (fallback) out.push(`<p class="meta" lang="${lang}"><strong>${escapeHtml(ui(lang).fallback)}</strong></p>`);
  for (const s of ch.sections) {
    out.push(`<h2>${escapeHtml(s.title)}</h2>`);
    for (const b of s.blocks) {
      const badges = badgeLine(b);
      out.push(`<div class="block kind-${escapeHtml(b.kind)}">`);
      if (badges) out.push(`<p class="badges">${escapeHtml(badges)}</p>`);
      if (KIND_LABEL[b.kind] && b.kind !== 'xref') out.push(`<p class="label">${KIND_LABEL[b.kind]}</p>`);
      out.push(markdownToHtml(b.text), '</div>');
    }
  }
  return out.join('\n');
}

const CHANGE_LABEL: Record<ChangeKind, string> = { new: 'Neu', updated: 'Geändert', removed: 'Entfernt', unchanged: 'Unverändert' };

export function changesText(changes: ChapterChange[]) {
  return changes.filter((c) => c.change !== 'unchanged').map((c) => {
    const s = c.summary ? ` (${[c.summary.changed && `${c.summary.changed} geändert`, c.summary.added && `${c.summary.added} neu`, c.summary.removed && `${c.summary.removed} entfernt`, c.summary.moved && `${c.summary.moved} verschoben`].filter(Boolean).join(', ') || 'nur Metadaten'})` : '';
    const v = c.change === 'updated' ? ` – Version ${c.fromVersionNo} → ${c.toVersionNo}` : '';
    return `${CHANGE_LABEL[c.change]}: ${c.title}${v}${s}`;
  });
}

/**
 * Statische Online-Hilfe: Deutsch im Wurzelverzeichnis, jede weitere Sprache in einem Unterordner (en/, fr/ …)
 * mit denselben Dateinamen und einem Sprachumschalter. Kapitel ohne freigegebene Übersetzung erscheinen auf Deutsch.
 */
async function buildSite(
  version: string, title: string, notes: string | null, chapters: ExportChapter[], changes: ChapterChange[], createdAt: string,
  translations: Map<string, (ExportChapter | null)[]>, appUrl: string | null = null,
) {
  const zip = new JSZip();
  // Handbuch-Assistent (ADR-026): Online-Hilfe bleibt ohne Skripte, verlinkt aber auf den Assistenten der Anwendung
  const assistant = (lang: string) => (appUrl ? ` · <a href="${escapeHtml(`${appUrl.replace(/\/+$/, '')}/assistent?language=${lang}`)}">${escapeHtml(ui(lang).ask)}</a>` : '');
  const langs: SiteLang[] = [{ code: 'de', prefix: '' }, ...[...translations.keys()].map((code) => ({ code, prefix: `${code}/` }))];
  const lines = changesText(changes);
  const vis = visible(chapters, {});
  const files = vis.map((_, i) => `kapitel-${String(i + 1).padStart(2, '0')}.html`);
  const switcher = (current: string, file: string) => assistant(current) + (langs.length < 2 ? '' :
    ` · <nav aria-label="${escapeHtml(ui(current).languages)}" style="display:inline">${langs.map((l) => {
      const up = current === 'de' ? '' : '../';
      const href = `${up}${l.prefix}${file}`;
      return l.code === current ? `<strong lang="${l.code}">${l.code.toUpperCase()}</strong>` : `<a href="${href}" lang="${l.code}" hreflang="${l.code}">${l.code.toUpperCase()}</a>`;
    }).join(' ')}</nav>`);
  for (const l of langs) {
    const u = ui(l.code);
    const label = `${u.version} ${version}`;
    const translated = l.code === 'de' ? null : translations.get(l.code)!;
    const pages = vis.map((ch, i) => ({ ch: translated?.[i] ? visible([translated[i]!], {})[0] : ch, fallback: !!translated && !translated[i] }));
    zip.file(`${l.prefix}index.html`, page(title, label, `<h1>${escapeHtml(title)}</h1>
<p class="meta">${escapeHtml(label)} · ${escapeHtml(u.published)} ${createdAt.slice(0, 10)}</p>
${notes && l.code === 'de' ? markdownToHtml(notes) : ''}
<nav class="toc" aria-label="${escapeHtml(u.toc)}"><h2>${escapeHtml(u.toc)}</h2><ol>${pages.map((p, i) => `<li><a href="${files[i]}">${escapeHtml(p.ch.title)}</a>${p.fallback ? ' <span class="meta">(DE)</span>' : ''}</li>`).join('')}</ol></nav>
<p><a href="aenderungen.html">${escapeHtml(u.changes)}</a></p>`, l.code, switcher(l.code, 'index.html')));
    zip.file(`${l.prefix}aenderungen.html`, page(u.changes, label, `<h1>${escapeHtml(u.changes)}</h1>
${lines.length ? `<ul lang="de">${lines.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>` : '<p>–</p>'}`, l.code, switcher(l.code, 'aenderungen.html')));
    pages.forEach((p, i) => {
      const prev = i > 0 ? `<a href="${files[i - 1]}">← ${escapeHtml(pages[i - 1].ch.title)}</a>` : '<span></span>';
      const next = i < pages.length - 1 ? `<a href="${files[i + 1]}">${escapeHtml(pages[i + 1].ch.title)} →</a>` : '<span></span>';
      zip.file(`${l.prefix}${files[i]}`, page(p.ch.title, label, `<div${p.fallback ? ' lang="de"' : ''}>${chapterHtml(p.ch, l.code, p.fallback)}</div><nav class="pager" aria-label="${escapeHtml(u.pager)}">${prev}${next}</nav>`, l.code, switcher(l.code, files[i])));
    });
  }
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

/** Release veröffentlichen: alle Kapitel mit freigegebener Version, Qualitätsgate für den Export muss bestehen. */
export async function createRelease(ctx: Ctx, input: { version?: string; title?: string; notes?: string }, actor: string) {
  const version = input.version?.trim();
  if (!version || !/^[\w.-]{1,40}$/.test(version)) throw badRequest('version ist Pflicht (Buchstaben, Ziffern, Punkt, Bindestrich; max. 40 Zeichen).');
  const { db } = ctx;
  if (await db.get('SELECT id FROM handbook_releases WHERE project_id = ? AND version = ?', ctx.projectId, version)) throw conflict(`Release ${version} existiert bereits.`);
  const rows = await db.all(
    `SELECT c.id AS chapter_id, c.title, c.position, v.id AS version_id FROM chapters c JOIN generated_chapter_versions v ON v.chapter_id = c.id
     WHERE c.project_id = ? AND v.status = 'approved' ORDER BY c.position, c.title`,
    ctx.projectId,
  );
  if (!rows.length) throw unprocessable('Keine freigegebenen Kapitel – es gibt nichts zu veröffentlichen.');
  const blockers: { chapterId: string; checks: unknown }[] = [];
  for (const r of rows) {
    const gate = await gateForChapter(ctx, r.chapter_id, 'export');
    if (!gate.passed) blockers.push({ chapterId: r.chapter_id, checks: gate.checks.filter((c) => !c.passed) });
  }
  if (blockers.length) throw conflict('Veröffentlichung blockiert: offene Blocker- oder Datenschutzbefunde.', { blockers });

  const chapters: ExportChapter[] = [];
  const releaseChapters: ReleaseChapter[] = [];
  for (const r of rows) {
    const v = await getChapterVersion(ctx, r.version_id);
    chapters.push(v);
    releaseChapters.push({ chapterId: r.chapter_id, chapterVersionId: r.version_id, title: r.title, versionNo: v.versionNo });
  }

  // Änderungen gegenüber dem Vorgänger-Release (Vergleich ganzer Kapitelversionen, US-019)
  const prevRow = await db.get('SELECT * FROM handbook_releases WHERE project_id = ? ORDER BY created_at DESC LIMIT 1', ctx.projectId);
  const prev = prevRow ? parseJson<ReleaseChapter[]>(prevRow.chapters, []) : [];
  const changes: ChapterChange[] = [];
  for (const c of releaseChapters) {
    const before = prev.find((p) => p.chapterId === c.chapterId);
    if (!before) changes.push({ chapterId: c.chapterId, title: c.title, change: 'new', fromVersionNo: null, toVersionNo: c.versionNo, summary: null });
    else if (before.chapterVersionId === c.chapterVersionId) changes.push({ chapterId: c.chapterId, title: c.title, change: 'unchanged', fromVersionNo: before.versionNo, toVersionNo: c.versionNo, summary: null });
    else {
      const cmp = await compareVersions(ctx, c.chapterId, before.chapterVersionId, c.chapterVersionId);
      const { added, removed, changed, moved } = cmp.summary;
      changes.push({ chapterId: c.chapterId, title: c.title, change: 'updated', fromVersionNo: before.versionNo, toVersionNo: c.versionNo, summary: { added, removed, changed, moved } });
    }
  }
  for (const p of prev) if (!releaseChapters.some((c) => c.chapterId === p.chapterId)) changes.push({ chapterId: p.chapterId, title: p.title, change: 'removed', fromVersionNo: p.versionNo, toVersionNo: null, summary: null });

  const id = newId('rel');
  const createdAt = now();
  const title = input.title?.trim() || 'oneSCM Benutzerhandbuch';
  const notes = input.notes?.trim() || null;
  // Freigegebene Übersetzungen genau der veröffentlichten Kapitelversionen (ADR-021)
  const translations = new Map<string, (ExportChapter | null)[]>();
  const languages: { language: string; translated: number; total: number; markdownKey: string }[] = [];
  for (const lang of await projectLanguages(ctx)) {
    const list: (ExportChapter | null)[] = [];
    for (const c of releaseChapters) {
      const tr = await db.get("SELECT id FROM translations WHERE chapter_version_id = ? AND language = ? AND status = 'approved'", c.chapterVersionId, lang);
      list.push(tr ? await translatedChapter(ctx, tr.id) : null);
    }
    const translated = list.filter(Boolean).length;
    if (!translated) continue;
    translations.set(lang, list);
    languages.push({ language: lang, translated, total: list.length, markdownKey: `releases/${id}/handbuch-${lang}.md` });
  }
  const site = await buildSite(version, title, notes, chapters, changes, createdAt, translations, ctx.config.notify.appUrl);
  const md = renderMarkdown(chapters, {}).replace(/^# oneSCM Benutzerhandbuch/, `# ${title} – Version ${version}`);
  const siteKey = `releases/${id}/site.zip`;
  const mdKey = `releases/${id}/handbuch.md`;
  await ctx.store.put(siteKey, site);
  await ctx.store.put(mdKey, Buffer.from(md, 'utf8'));
  for (const l of languages) {
    // Kapitel ohne freigegebene Übersetzung auf Deutsch (im Markdown gekennzeichnet)
    const chs = translations.get(l.language)!.map((t, i) => t ?? { ...chapters[i], title: `${chapters[i].title} (DE)` });
    const lmd = renderMarkdown(chs, {}).replace(/^# oneSCM Benutzerhandbuch/, `# ${title} – ${LANGUAGES[l.language] ?? l.language} – Version ${version}`);
    await ctx.store.put(l.markdownKey, Buffer.from(lmd, 'utf8'));
  }
  await db.tx(async () => {
    await db.run(
      `INSERT INTO handbook_releases (id, project_id, version, title, notes, chapters, changes, previous_release_id, site_key, markdown_key, created_by, created_at, languages)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, ctx.projectId, version, title, notes, json(releaseChapters), json(changes), prevRow?.id ?? null, siteKey, mdKey, actor, createdAt, json(languages),
    );
    await audit(ctx, actor, 'release.published', 'release', id, { version, chapters: releaseChapters.length, changes: changesText(changes), languages: languages.map((l) => l.language) });
  });
  return getRelease(ctx, id);
}

export async function downloadRelease(ctx: Ctx, id: string, format: string, language?: string) {
  const r = await ctx.db.get('SELECT * FROM handbook_releases WHERE id = ?', id);
  if (!r) throw notFound(`Release ${id}`);
  if (format === 'site') return { data: await ctx.store.get(r.site_key), fileName: `onescm-handbuch-${r.version}-online-hilfe.zip`, type: 'application/zip' };
  if (format === 'md') {
    if (language && language !== 'de') {
      const l = parseJson<{ language: string; markdownKey: string }[]>(r.languages, []).find((x) => x.language === language);
      if (!l) throw notFound(`Sprache ${language} in Release ${r.version}`);
      return { data: await ctx.store.get(l.markdownKey), fileName: `onescm-handbuch-${r.version}-${language}.md`, type: 'text/markdown; charset=utf-8' };
    }
    return { data: await ctx.store.get(r.markdown_key), fileName: `onescm-handbuch-${r.version}.md`, type: 'text/markdown; charset=utf-8' };
  }
  throw badRequest('format muss site oder md sein.');
}
