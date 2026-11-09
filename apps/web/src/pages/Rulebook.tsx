import { useState } from 'react';
import { Link } from 'react-router-dom';
import { del, patch, post } from '../api';
import { Card, Empty, ErrorBox, Gated, Page, Severity, SEVERITY_NAME, errorText, useApp, useLoad } from '../components/ui';

const EMPTY = { chapterId: '', kind: 'forbidden', term: '', message: '', severity: 'medium' };
const HINT: Record<string, string> = {
  required: 'muss im Kapitel vorkommen (bei einer allgemeinen Regel: in jedem Kapitel)',
  forbidden: 'darf nicht vorkommen (ganzes Wort, Groß-/Kleinschreibung egal)',
  pattern: 'regulärer Ausdruck, z. B. \\d{2}\\.\\d{2}\\.\\d{4} für ein Datum',
};

/** Regelwerk (Etappe 100): Text-Regeln allgemein oder je Kapitel – geprüft in der Analyse, Blocker-Regeln auch vor Einreichen und Freigabe */
export function RulebookPage() {
  const { notify } = useApp();
  const data = useLoad<any>('/rulebook/rules');
  const chapters = useLoad<any[]>('/chapters');
  const [form, setForm] = useState(EMPTY);
  const [edit, setEdit] = useState<any | null>(null);
  const kinds: { code: string; label: string }[] = data.data?.kinds ?? [];
  const severities: string[] = data.data?.severities ?? ['blocker', 'high', 'medium', 'low'];
  const rules: any[] = data.data?.rules ?? [];

  const save = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      data.reload();
      return true;
    } catch (e) {
      notify(errorText(e), 'error');
      return false;
    }
  };
  const body = (f: typeof EMPTY) => ({ chapterId: f.chapterId || null, kind: f.kind, term: f.term, message: f.message || null, severity: f.severity });
  // im Formular benennt die sichtbare Beschriftung das Feld; in der Tabelle steht sie mit „Regel bearbeiten:“ davor (WCAG 2.5.3)
  const named = (prefix: string, text: string) => (prefix ? { 'aria-label': `${prefix}${text}` } : {});
  const fields = (f: typeof EMPTY, set: (f: typeof EMPTY) => void, prefix: string) => (
    <>
      <label className="block">Geltung
        <select value={f.chapterId} onChange={(e) => set({ ...f, chapterId: e.target.value })} {...named(prefix, 'Geltung')}>
          <option value="">Allgemein (alle Kapitel)</option>
          {(chapters.data ?? []).map((c) => <option key={c.id} value={c.id}>Kapitel {c.title}</option>)}
        </select>
      </label>
      <label className="block">Art
        <select value={f.kind} onChange={(e) => set({ ...f, kind: e.target.value })} {...named(prefix, 'Art')}>
          {kinds.map((k) => <option key={k.code} value={k.code}>{k.label}</option>)}
        </select>
      </label>
      <p className="small muted">{HINT[f.kind]}</p>
      <label className="block">{f.kind === 'pattern' ? 'Muster' : 'Begriff'} <input value={f.term} onChange={(e) => set({ ...f, term: e.target.value })} {...named(prefix, f.kind === 'pattern' ? 'Muster' : 'Begriff')} /></label>
      <label className="block">Erklärung für die Redaktion (optional) <input value={f.message} onChange={(e) => set({ ...f, message: e.target.value })} {...named(prefix, 'Erklärung für die Redaktion (optional)')} /></label>
      <label className="block">Schweregrad
        <select value={f.severity} onChange={(e) => set({ ...f, severity: e.target.value })} {...named(prefix, 'Schweregrad')}>
          {severities.map((s) => <option key={s} value={s}>{SEVERITY_NAME[s] ?? s}{s === 'blocker' ? ' – sperrt Einreichen und Freigabe' : ''}</option>)}
        </select>
      </label>
    </>
  );

  return (
    <Page title="Regelwerk" subtitle="Eigene Regeln allgemein oder je Kapitel – die Analyse meldet Verstöße als Befund, Blocker-Regeln sperren Einreichen und Freigabe">
      <div className="grid2">
        <Card title="Neue Regel">
          {fields(form, setForm, '')}
          <Gated
            className="btn primary"
            missing={[!form.term.trim() && (form.kind === 'pattern' ? 'Muster' : 'Begriff')]}
            onClick={async () => {
              if (await save(() => post('/rulebook/rules', body(form)), 'Regel angelegt.')) setForm(EMPTY);
            }}
          >
            Regel anlegen
          </Gated>
        </Card>
        <Card title="So wirken die Regeln">
          <ul className="small">
            <li>Die Qualitätsanalyse prüft alle aktiven Regeln gegen die Textabschnitte der Quellen und meldet Verstöße unter <Link to="/optimierungen">„Optimierungen“</Link> (Typ „Regelwerk“).</li>
            <li>Regeln mit Schweregrad „Blocker“ prüft die App außerdem im Kapiteltext vor dem Einreichen und vor der Freigabe.</li>
            <li>Allgemeine Regeln gelten für jedes Kapitel; ein Pflichtbegriff gilt nicht für „Ohne Kapitel“.</li>
            <li>Abschnitte in „Intern“ und „In Planung“ werden nicht geprüft.</li>
          </ul>
        </Card>
      </div>
      <Card title={`Regeln (${rules.length})`}>
        <ErrorBox error={data.error} />
        {!rules.length ? <Empty>Noch keine Regeln.</Empty> : (
          <table className="table">
            <thead><tr><th>Geltung</th><th>Art</th><th>Begriff / Muster</th><th>Erklärung</th><th>Schweregrad</th><th>Aktiv</th><th /></tr></thead>
            <tbody>
              {rules.map((r) => edit?.id === r.id ? (
                <tr key={r.id}>
                  <td colSpan={6}>{fields(edit, (f) => setEdit({ ...edit, ...f }), 'Regel bearbeiten: ')}</td>
                  <td className="row-actions">
                    <Gated className="btn primary small" missing={[!edit.term.trim() && 'Begriff']} onClick={async () => (await save(() => patch(`/rulebook/rules/${r.id}`, body(edit)), 'Regel gespeichert.')) && setEdit(null)}>Speichern</Gated>
                    <button className="btn small" onClick={() => setEdit(null)}>Abbrechen</button>
                  </td>
                </tr>
              ) : (
                <tr key={r.id}>
                  <td>{r.chapterTitle ? `Kapitel ${r.chapterTitle}` : 'Allgemein'}</td>
                  <td>{r.kindLabel}</td>
                  <td><code>{r.term}</code></td>
                  <td className="small">{r.message ?? '–'}</td>
                  <td><Severity s={r.severity} /></td>
                  <td>
                    <label className="small"><input type="checkbox" checked={r.active} onChange={(e) => save(() => patch(`/rulebook/rules/${r.id}`, { active: e.target.checked }), e.target.checked ? 'Regel aktiv.' : 'Regel ausgeschaltet.')} aria-label={`Regel „${r.term}“ aktiv`} /> aktiv</label>
                  </td>
                  <td className="row-actions">
                    <button className="btn small" aria-label={`Regel „${r.term}“ bearbeiten`} onClick={() => setEdit({ id: r.id, chapterId: r.chapterId ?? '', kind: r.kind, term: r.term, message: r.message ?? '', severity: r.severity })}>Bearbeiten</button>
                    <button className="btn small danger" aria-label={`Regel „${r.term}“ löschen`} onClick={() => save(() => del(`/rulebook/rules/${r.id}`), 'Regel gelöscht.')}>Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="small muted">Neue und geänderte Regeln wirken in der Analyse ab dem nächsten Lauf (Dashboard → Analyse starten); vor Einreichen und Freigabe sofort.</p>
      </Card>
    </Page>
  );
}
