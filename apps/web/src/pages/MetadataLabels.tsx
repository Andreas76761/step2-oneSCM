// oneSCM_Metadaten (ADR-079): Labelkatalog.
import { RefIcon } from '../components/icons';
import { useState } from 'react';
import { del, patch, post } from '../api';
import { Gated, Card, ErrorBox, Page, errorText, useApp } from '../components/ui';
import { LangSwitch, nameOf, useLabelLang, useLabels, useMe } from './MetadataShared';

export function MetadataLabelsPage() {
  const { notify } = useApp();
  const { isAdmin } = useMe();
  const [lang, setLang] = useLabelLang();
  const [showArchived, setShowArchived] = useState(false);
  const { labels, groups } = useLabels(showArchived);
  const [edit, setEdit] = useState<{ id: string; nameDe: string; nameEn: string; description: string } | null>(null);
  const [form, setForm] = useState({ group: 'navigation', code: '', nameDe: '', nameEn: '' });
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      notify(msg);
      labels.reload();
      return true;
    } catch (e) {
      notify(errorText(e), 'error');
      return false;
    }
  };

  return (
    <Page title="Labels" subtitle="100 vordefinierte Labels in sechs Gruppen, Deutsch und Englisch – Pflege durch die Administration" actions={<LangSwitch lang={lang} onChange={setLang} />}>
      <ErrorBox error={labels.error} />
      {isAdmin && (
        <Card title="Label ergänzen">
          <div className="filters">
            <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} aria-label="Gruppe">
              {groups.map((g) => <option key={g.code} value={g.code}>{g.nameDe}</option>)}
            </select>
            <input placeholder="Code, z. B. nav.orders" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} aria-label="Code" />
            <input placeholder="Name (Deutsch)" value={form.nameDe} onChange={(e) => setForm({ ...form, nameDe: e.target.value })} aria-label="Name Deutsch" />
            <input placeholder="Name (Englisch)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} aria-label="Name Englisch" />
            <Gated className="btn primary" missing={[!form.code.trim() && 'Code', !form.nameDe.trim() && 'Name (Deutsch)', !form.nameEn.trim() && 'Name (Englisch)']}
              onClick={async () => (await run(() => post('/metadata/labels', form), `Label „${form.nameDe}“ angelegt.`)) && setForm({ ...form, code: '', nameDe: '', nameEn: '' })}>
              Anlegen
            </Gated>
          </div>
        </Card>
      )}
      <label className="small md-archived-toggle"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> ausgeblendete anzeigen</label>
      {groups.map((g) => {
        const rows = (labels.data ?? []).filter((l) => l.group === g.code);
        return (
          <Card key={g.code} title={<><RefIcon name={g.icon} /> {nameOf(g, lang)} <span className="muted small">({rows.length})</span></>}>
            <table className="table">
              <thead><tr><th>Deutsch</th><th>Englisch</th><th>Code</th><th>Chunks</th><th>Antworten</th>{isAdmin && <th />}</tr></thead>
              <tbody>
                {rows.map((l) => edit?.id === l.id ? (
                  <tr key={l.id}>
                    <td><input value={edit.nameDe} onChange={(e) => setEdit({ ...edit, nameDe: e.target.value })} aria-label="Name Deutsch bearbeiten" /></td>
                    <td><input value={edit.nameEn} onChange={(e) => setEdit({ ...edit, nameEn: e.target.value })} aria-label="Name Englisch bearbeiten" /></td>
                    <td colSpan={3}><input value={edit.description} placeholder="Beschreibung (optional)" onChange={(e) => setEdit({ ...edit, description: e.target.value })} aria-label="Beschreibung bearbeiten" /></td>
                    <td className="row-actions">
                      <button className="btn small primary" onClick={async () => (await run(() => patch(`/metadata/labels/${l.id}`, { nameDe: edit.nameDe, nameEn: edit.nameEn, description: edit.description || null }), 'Label gespeichert.')) && setEdit(null)}>Speichern</button>
                      <button className="btn small" onClick={() => setEdit(null)}>Abbrechen</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={l.id} className={l.archived ? 'muted' : ''}>
                    <td style={{ borderLeft: `4px solid ${g.color}` }}>{l.nameDe}{l.archived && <span className="tag small">ausgeblendet</span>}{l.origin === 'custom' && <span className="tag small">eigenes</span>}{l.description && <div className="small muted">{l.description}</div>}</td>
                    <td>{l.nameEn}</td>
                    <td><code className="small">{l.code}</code></td>
                    <td>{l.chunkCount}</td>
                    <td>{l.qaCount}</td>
                    {isAdmin && (
                      <td className="row-actions">
                        <button className="btn small" onClick={() => setEdit({ id: l.id, nameDe: l.nameDe, nameEn: l.nameEn, description: l.description ?? '' })}>Bearbeiten</button>
                        <button className="btn small" onClick={() => run(() => patch(`/metadata/labels/${l.id}`, { archived: !l.archived }), l.archived ? 'Label eingeblendet.' : 'Label ausgeblendet.')}>{l.archived ? 'Einblenden' : 'Ausblenden'}</button>
                        <button className="btn small danger" aria-label={`Label „${l.nameDe}“ löschen`} onClick={() => {
                          if (window.confirm(`Label „${l.nameDe}“ löschen? Es wird von ${l.chunkCount ?? 0} Chunks und ${l.qaCount ?? 0} Fragen entfernt.`)) void run(() => del(`/metadata/labels/${l.id}`), `Label „${l.nameDe}“ gelöscht.`);
                        }}>Löschen</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );
      })}
    </Page>
  );
}
