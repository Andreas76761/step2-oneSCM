import { useSearchParams } from 'react-router-dom';
import { del } from '../api';
import { Card, Empty, ErrorBox, Page, errorText, useApp, useLoad } from '../components/ui';

const TARGETS = [
  { code: 'intern', title: 'Intern', hint: 'interne Themen, die nicht ins Benutzerhandbuch gehören' },
  { code: 'planning', title: 'In Planung', hint: 'Inhalte zu Funktionen, die noch nicht produktiv sind' },
];

/** Kapitel „Intern“ und „In Planung“ (Etappe 100): vorgemerkte Textabschnitte – nie im Handbuch, Export, Release oder in der Übersetzung */
export function ParkedPage() {
  const { notify } = useApp();
  const [params, setParams] = useSearchParams();
  const target = params.get('ziel') === 'planning' ? 'planning' : params.get('ziel') === 'intern' ? 'intern' : '';
  const data = useLoad<any[]>('/parked');
  const items = (data.data ?? []).filter((p) => !target || p.target === target);

  const back = async (p: any) => {
    try {
      await del(`/snippets/${p.id}/park`);
      notify(`Zurück im Kapitel „${p.fromChapter ?? 'Ohne Kapitel'}“ – ab dem nächsten Entwurf wieder im Text.`);
      data.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Page title="Intern und In Planung" subtitle="Vorgemerkte Textabschnitte – im Benutzerhandbuch ab der nächsten Version nicht mehr enthalten">
      <div className="toolbar" role="group" aria-label="Kapitel wählen">
        <button className={`btn small${!target ? ' primary' : ''}`} aria-pressed={!target} onClick={() => setParams({})}>Beide ({data.data?.length ?? 0})</button>
        {TARGETS.map((t) => (
          <button key={t.code} className={`btn small${target === t.code ? ' primary' : ''}`} aria-pressed={target === t.code} onClick={() => setParams({ ziel: t.code })}>
            {t.title} ({(data.data ?? []).filter((p) => p.target === t.code).length})
          </button>
        ))}
      </div>
      <ErrorBox error={data.error} />
      {TARGETS.filter((t) => !target || t.code === target).map((t) => {
        const list = items.filter((p) => p.target === t.code);
        return (
          <Card key={t.code} title={`${t.title} (${list.length})`}>
            <p className="small muted">{t.hint}. Vormerken können Sie einen Absatz in der Kapitelwerkstatt („Vormerken für …“). Freigegebene Kapitel bleiben unverändert, bis die nächste Version freigegeben ist; in Entwürfen entfällt der Absatz sofort.</p>
            {!list.length ? <Empty>Nichts vorgemerkt.</Empty> : (
              <table className="table">
                <thead><tr><th>Text</th><th>Herkunft</th><th>Notiz</th><th>Vorgemerkt</th><th /></tr></thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id}>
                      <td>{p.text}</td>
                      <td className="small">{p.fromChapter ?? '–'}<br /><span className="muted">{p.path}</span></td>
                      <td className="small">{p.note ?? '–'}</td>
                      <td className="small">{p.parkedBy ?? '–'}{p.parkedAt ? `, ${new Date(p.parkedAt).toLocaleDateString('de-DE')}` : ''}</td>
                      <td className="row-actions"><button className="btn small" aria-label={`„${p.text.slice(0, 40)}“ zurück ins Handbuch`} onClick={() => back(p)}>Zurück ins Handbuch</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        );
      })}
    </Page>
  );
}
