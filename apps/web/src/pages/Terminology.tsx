import { Fragment, useState } from 'react';
import { patch, post } from '../api';
import { Card, Empty, ErrorBox, Page, Status, errorText, useApp, useLoad } from '../components/ui';

/** Terminologieverwaltung (US-015): bevorzugte Begriffe, zu vermeidende Varianten, Definition */
export function TerminologyPage() {
  const { notify } = useApp();
  const [showRetired, setShowRetired] = useState(false);
  const terms = useLoad<any[]>(`/terminology${showRetired ? '?includeRetired=true' : ''}`, [showRetired]);
  const [form, setForm] = useState({ preferred: '', avoid: '', definition: '' });
  const [edit, setEdit] = useState<any | null>(null);
  // Projektsprachen: Begriff und Definition je Sprache für das Glossar der Leseransicht (ADR-071)
  const languages = (useLoad<any[]>('/reader/languages').data ?? []).filter((l) => l.code !== 'de');
  const list = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

  const save = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      terms.reload();
      return true;
    } catch (e) {
      notify(errorText(e), 'error');
      return false;
    }
  };

  return (
    <Page title="Terminologie" subtitle="Einheitliche Begriffe im Handbuch – die Qualitätsanalyse meldet zu vermeidende Varianten als Befund">
      <div className="grid2">
        <Card title="Neuer Begriff">
          <label className="block">Bevorzugter Begriff <input value={form.preferred} onChange={(e) => setForm({ ...form, preferred: e.target.value })} aria-label="Bevorzugter Begriff" /></label>
          <label className="block">Zu vermeiden (kommagetrennt) <input value={form.avoid} onChange={(e) => setForm({ ...form, avoid: e.target.value })} aria-label="Zu vermeidende Begriffe" /></label>
          <label className="block">Definition (optional) <textarea rows={2} value={form.definition} onChange={(e) => setForm({ ...form, definition: e.target.value })} aria-label="Definition" /></label>
          <button
            className="btn primary"
            disabled={!form.preferred.trim()}
            onClick={async () => {
              if (await save(() => post('/terminology', { preferred: form.preferred, avoid: list(form.avoid), definition: form.definition || null }), `Begriff „${form.preferred}“ angelegt.`)) setForm({ preferred: '', avoid: '', definition: '' });
            }}
          >
            Anlegen
          </button>
          <p className="small muted">Neue Regeln wirken ab der nächsten Analyse (Dashboard → Analyse starten).</p>
        </Card>
        <Card title="Hinweise">
          <ul className="small">
            <li>Ein Begriff kann nur einmal bevorzugt sein.</li>
            <li>Ein zu vermeidender Begriff darf nirgends bevorzugt sein – sonst widersprüchliche Befunde.</li>
            <li>Ausgemusterte Begriffe bleiben mit Historie erhalten (Audit) und werden nicht mehr geprüft.</li>
          </ul>
        </Card>
      </div>
      <Card title={`Begriffe (${terms.data?.length ?? 0})`} actions={<label className="small"><input type="checkbox" checked={showRetired} onChange={(e) => setShowRetired(e.target.checked)} /> ausgemusterte anzeigen</label>}>
        <ErrorBox error={terms.error} />
        {!terms.data?.length ? <Empty>Keine Begriffe.</Empty> : (
          <table className="table">
            <thead><tr><th>Bevorzugt</th><th>Zu vermeiden</th><th>Definition</th><th>Status</th><th>Zuletzt geändert</th><th /></tr></thead>
            <tbody>
              {terms.data.map((t) =>
                edit?.id === t.id ? (
                  <Fragment key={t.id}>
                  <tr>
                    <td><input value={edit.preferred} onChange={(e) => setEdit({ ...edit, preferred: e.target.value })} aria-label="Bevorzugt bearbeiten" /></td>
                    <td><input value={edit.avoid} onChange={(e) => setEdit({ ...edit, avoid: e.target.value })} aria-label="Zu vermeiden bearbeiten" /></td>
                    <td><input value={edit.definition} onChange={(e) => setEdit({ ...edit, definition: e.target.value })} aria-label="Definition bearbeiten" /></td>
                    <td colSpan={2} />
                    <td className="row-actions">
                      <button className="btn primary small" onClick={async () => (await save(() => patch(`/terminology/${t.id}`, { preferred: edit.preferred, avoid: list(edit.avoid), definition: edit.definition || null, translations: edit.translations }), 'Begriff gespeichert.')) && setEdit(null)}>Speichern</button>
                      <button className="btn small" onClick={() => setEdit(null)}>Abbrechen</button>
                    </td>
                  </tr>
                  {languages.length > 0 && (
                    <tr className="term-translations">
                      <td colSpan={6}>
                        <fieldset>
                          <legend className="small">Übersetzungen für das Glossar beim Lesen</legend>
                          {languages.map((l) => (
                            <div key={l.code} className="term-lang">
                              <label className="inline">{l.name}: Begriff
                                <input value={edit.translations[l.code]?.term ?? ''} onChange={(e) => setEdit({ ...edit, translations: { ...edit.translations, [l.code]: { ...edit.translations[l.code], term: e.target.value } } })} />
                              </label>
                              <label className="inline">Definition
                                <input value={edit.translations[l.code]?.definition ?? ''} onChange={(e) => setEdit({ ...edit, translations: { ...edit.translations, [l.code]: { ...edit.translations[l.code], definition: e.target.value } } })} />
                              </label>
                            </div>
                          ))}
                        </fieldset>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                ) : (
                  <tr key={t.id}>
                    <td><strong>{t.preferred}</strong></td>
                    <td>{t.avoid.map((a: string) => <span key={a} className="tag">{a}</span>)}</td>
                    <td className="small">{t.definition ?? '–'}{Object.keys(t.translations ?? {}).map((c) => <span key={c} className="tag small" title={`${t.translations[c].term}: ${t.translations[c].definition ?? ''}`}>{c.toUpperCase()}</span>)}</td>
                    <td><Status s={t.status === 'active' ? 'confirmed' : 'superseded'} /></td>
                    <td className="small">{t.updatedBy}, {new Date(t.updatedAt).toLocaleString('de-DE')}</td>
                    <td className="row-actions">
                      {t.status === 'active' && <button className="btn small" onClick={() => setEdit({ id: t.id, preferred: t.preferred, avoid: t.avoid.join(', '), definition: t.definition ?? '', translations: { ...(t.translations ?? {}) } })}>Bearbeiten</button>}
                      <button className="btn small" onClick={() => save(() => patch(`/terminology/${t.id}`, { status: t.status === 'active' ? 'retired' : 'active' }), t.status === 'active' ? 'Begriff ausgemustert.' : 'Begriff reaktiviert.')}>
                        {t.status === 'active' ? 'Ausmustern' : 'Reaktivieren'}
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </Card>
    </Page>
  );
}
