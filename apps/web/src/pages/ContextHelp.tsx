// Kontexthilfe für oneSCM (ADR-030): Kontext-IDs an Kapiteln verwalten, Einbettung freischalten, Deep-Link-Ansicht
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { currentProjectId, del, post, put, qs } from '../api';
import { Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';
import { LANG_NAMES } from './Assistant';
import { RefSelect } from './Sources';

export function ContextHelpAdminPage() {
  const { notify, ref } = useApp();
  const data = useLoad<any>('/help-contexts');
  const chapters = useLoad<any[]>('/chapters');
  const me = useLoad<any>('/me');
  const canEdit = !!me.data?.permissions.some((p: string) => p === 'edit' || p === 'admin');
  const isAdmin = !!me.data?.permissions.includes('admin');
  const [form, setForm] = useState({ key: '', chapterId: '', section: '', description: '' });
  const run = async (fn: () => Promise<any>, msg: string) => {
    try {
      await fn();
      notify(msg);
      data.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const origin = window.location.origin;
  const snippet = `<script src="${origin}/help/widget.js" data-project="${currentProjectId()}" data-language="de" defer></script>\n<button type="button" data-onescm-help="order.create">Hilfe</button>`;

  return (
    <Page title="Kontexthilfe" subtitle="Kontext-IDs aus oneSCM auf Kapitel abbilden – Aufruf per API, Deep-Link oder eingebettetem Hilfe-Widget">
      <Card title="Zuordnungen">
        <ErrorBox error={data.error} />
        {canEdit && (
          <form className="filters" onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await post('/help-contexts', { ...form, section: form.section || null });
              setForm({ key: '', chapterId: '', section: '', description: '' });
            }, 'Kontext-ID angelegt.');
          }}>
            <label className="inline">Kontext-ID <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="order.create" /></label>
            <label className="inline">Kapitel
              <select value={form.chapterId} onChange={(e) => setForm({ ...form, chapterId: e.target.value })}>
                <option value="">– wählen –</option>
                {chapters.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </label>
            <label className="inline">Abschnitt
              <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                <option value="">ganzes Kapitel</option>
                {ref?.sections.map((s) => <option key={s.code} value={s.code}>{s.title}</option>)}
              </select>
            </label>
            <label className="inline">Beschreibung <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Maske „Auftrag anlegen“" /></label>
            <button className="btn primary" type="submit" disabled={!form.key.trim() || !form.chapterId}>Zuordnen</button>
          </form>
        )}
        {data.data && !data.data.items.length ? <Empty>Noch keine Kontext-IDs. Tipp: Im Front-Matter einer Quelldatei setzt <code>help_context: order.create</code> die Zuordnung beim Import.</Empty> : (
          <div className="table-wrap" role="region" aria-label="Kontext-IDs" tabIndex={0}>
            <table>
              <thead><tr><th>Kontext-ID</th><th>Kapitel</th><th>Abschnitt</th><th>Beschreibung</th><th>Herkunft</th><th>Aktion</th></tr></thead>
              <tbody>
                {data.data?.items.map((c: any) => (
                  <tr key={c.id}>
                    <td><code>{c.key}</code></td>
                    <td>{c.chapterTitle}</td>
                    <td>{c.section ? ref?.sections.find((s) => s.code === c.section)?.title ?? c.section : 'ganzes Kapitel'}</td>
                    <td>{c.description ?? '–'}</td>
                    <td>{c.origin === 'front_matter' ? 'Front-Matter' : 'manuell'}</td>
                    <td className="row-actions">
                      <Link className="btn small" to={c.deepLink}>Ansehen</Link>
                      {canEdit && <button className="btn small" aria-label={`Kontext-ID ${c.key} entfernen`} onClick={() => confirm(`Kontext-ID „${c.key}“ entfernen?`) && void run(() => del(`/help-contexts/${c.id}`), 'Kontext-ID entfernt.')}>Entfernen</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Einbindung in oneSCM">
        <ul className="small">
          <li><strong>API</strong> (mit API-Token): <code>GET /api/v1/context-help/&lt;Kontext-ID&gt;?role=…&amp;division=…&amp;language=…</code> – aktuell freigegebener Stand, fertiges HTML inklusive.</li>
          <li><strong>Deep-Link</strong> für angemeldete Nutzer: <code>{origin}/hilfe/&lt;Kontext-ID&gt;?role=…&amp;language=…</code></li>
          <li><strong>Hilfe-Widget</strong> (öffentlich, Stand des neuesten Releases, mit Assistent): Skript einbinden, Elemente mit <code>data-onescm-help</code> öffnen die Hilfe (Klick bzw. F1).</li>
        </ul>
        <p>
          Öffentliche Einbettung: <strong>{data.data?.public ? 'freigeschaltet' : 'aus'}</strong>
          {isAdmin && (
            <button className="btn small" style={{ marginLeft: 8 }} onClick={() => void run(() => put('/help-settings', { public: !data.data?.public }), data.data?.public ? 'Öffentliche Einbettung ausgeschaltet.' : 'Öffentliche Einbettung freigeschaltet.')}>
              {data.data?.public ? 'Ausschalten' : 'Freischalten'}
            </button>
          )}
        </p>
        <p className="small muted">Nur veröffentlichte Releases sind öffentlich sichtbar. Welche Seiten das Widget einbetten dürfen, legt der Betrieb über <code>HELP_EMBED_ORIGINS</code> fest.</p>
        <pre className="source" tabIndex={0} aria-label="Einbettungscode">{snippet}</pre>
      </Card>
    </Page>
  );
}

/** Deep-Link /hilfe/:contextKey – Hilfe zu einer Stelle in oneSCM nach Rolle, Sparte und Sprache */
export function ContextHelpPage() {
  const { contextKey = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const role = params.get('role') ?? '';
  const division = params.get('division') ?? '';
  const language = params.get('language') ?? 'de';
  const project = useLoad<any[]>('/projects');
  const current = project.data?.find((p) => p.id === currentProjectId()) ?? project.data?.[0];
  const languages = ['de', ...(current?.languages ?? [])];
  const help = useLoad<any>(`/context-help/${encodeURIComponent(contextKey)}${qs({ role: role || undefined, division: division || undefined, language: language === 'de' ? undefined : language })}`, [contextKey, role, division, language]);
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v && !(k === 'language' && v === 'de')) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const h = help.data;
  return (
    <Page title={h?.title ?? 'Kontexthilfe'} subtitle={`Hilfe zur Stelle „${contextKey}“ in oneSCM`}>
      <div className="filters">
        <RefSelect kind="roles" value={role} onChange={(v) => set('role', v)} />
        <RefSelect kind="divisions" value={division} onChange={(v) => set('division', v)} />
        <select aria-label="Sprache" value={language} onChange={(e) => set('language', e.target.value)}>
          {languages.map((l) => <option key={l} value={l}>{LANG_NAMES[l] ?? l}</option>)}
        </select>
      </div>
      <ErrorBox error={help.error} />
      {h && (
        <Card title={`Freigegebene Version ${h.versionNo}${h.approvedAt ? ` vom ${h.approvedAt.slice(0, 10)}` : ''}`}>
          {h.fallback && <p className="alert" role="note">In dieser Sprache noch nicht freigegeben – deutsche Fassung.</p>}
          <div lang={h.language}>
            {h.sections.length ? h.sections.map((s: any) => (
              <section key={s.code}>
                <h2>{s.title}</h2>
                {s.blocks.map((b: any) => <div key={b.id} className={`block kind-${b.kind}`}><Md text={b.text} /></div>)}
              </section>
            )) : <Empty>Für diese Rolle/Sparte enthält das Kapitel keine Inhalte.</Empty>}
          </div>
          <p className="row-actions">
            <Link className="btn small" to={`/assistent${qs({ language: language === 'de' ? undefined : language })}`}>Frage an den Assistenten</Link>
            <Link className="btn small" to={`/werkstatt/${h.chapterId}`}>In der Werkstatt öffnen</Link>
          </p>
        </Card>
      )}
    </Page>
  );
}
