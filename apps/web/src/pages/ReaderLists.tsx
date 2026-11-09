// Leseransicht (ADR-054): Lesezeichen und zuletzt gelesene Kapitel sowie häufige Fragen.
import { DownloadIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { GlossaryProvider } from '../components/Glossary';
import { Card, Empty, ErrorBox, Md, Page, errorText, useApp, useLoad } from '../components/ui';
import { readerTexts } from '../readerText';
import { formatDate } from '../format';
import { useReaderGlossary, useReaderLanguage } from './ReaderShared';

/** Lesezeichen mit eigenen Notizen (ADR-073): filtern, Notiz bearbeiten, entfernen, als CSV speichern */
export function ReaderBookmarksPage() {
  const { notify } = useApp();
  const mine = useLoad<any>('/reader/me');
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const q = filter.trim().toLocaleLowerCase('de');
  const all: any[] = mine.data?.bookmarks ?? [];
  const items = all.filter((b) => !q || `${b.title} ${b.note ?? ''}`.toLocaleLowerCase('de').includes(q));
  const saveNote = async (b: any) => {
    try {
      await api('PUT', `/reader/bookmarks/${b.chapterId}`, { note: notes[b.chapterId] ?? '' });
      notify('Notiz gespeichert.');
      setNotes(({ [b.chapterId]: _drop, ...rest }) => rest);
      mine.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const remove = async (b: any) => {
    try {
      await api('DELETE', `/reader/bookmarks/${b.chapterId}`);
      notify(`Lesezeichen „${b.title}“ entfernt.`);
      mine.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const exportCsv = () => {
    // Formel-Einschleusung verhindern: beginnt ein Wert wie eine Formel, wird er mit ' als Text markiert
    const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    const rows = [['Kapitel', 'Notiz', 'Gemerkt am', 'Link'], ...items.map((b) => [b.title, b.note ?? '', formatDate(b.createdAt), `${window.location.origin}/lesen/${b.chapterId}`])];
    const url = URL.createObjectURL(new Blob([`\ufeff${rows.map((r) => r.map(cell).join(';')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lesezeichen.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Page title="Lesezeichen" subtitle="Ihre gemerkten Kapitel mit eigenen Notizen – nur für Sie sichtbar"
      actions={<span className="row-actions"><Link className="btn" to="/lesen">← Leseransicht</Link><button className="btn" disabled={!items.length} onClick={exportCsv}><DownloadIcon className="btn-icon" aria-hidden="true" size={16} />Als CSV speichern</button></span>}>
      <ErrorBox error={mine.error} />
      <div className="filters">
        <label className="inline">Lesezeichen filtern <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Titel oder Notiz" /></label>
        <span className="small muted" aria-live="polite">{mine.data ? `${items.length} von ${all.length}` : ''}</span>
      </div>
      {mine.data && !all.length ? <Empty>Noch keine Lesezeichen. In der <Link to="/lesen">Leseransicht</Link> merken Sie Kapitel mit „Merken“.</Empty> : (
        <Card title="Gemerkte Kapitel">
          <ul className="plain bookmark-list">
            {items.map((b) => {
              const draft = notes[b.chapterId];
              return (
                <li key={b.chapterId}>
                  <span><Link to={`/lesen/${b.chapterId}`}><strong>{b.title}</strong></Link> <span className="small muted">· gemerkt am {formatDate(b.createdAt)}</span></span>
                  <label className="block">Notiz
                    <textarea rows={2} maxLength={500} aria-label={`Notiz zu „${b.title}“`} value={draft ?? b.note ?? ''} placeholder="z. B. für die Inventur im Dezember"
                      onChange={(e) => setNotes({ ...notes, [b.chapterId]: e.target.value })} />
                  </label>
                  <span className="row-actions">
                    <button className="btn small primary" disabled={draft === undefined || draft === (b.note ?? '')} onClick={() => saveNote(b)} aria-label={`Notiz speichern: „${b.title}“`}>Notiz speichern</button>
                    <button className="btn small danger" onClick={() => remove(b)} aria-label={`Lesezeichen „${b.title}“ entfernen`}>Entfernen</button>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </Page>
  );
}

/** Häufige Fragen für Leser (ADR-069, ADR-077): veröffentlichte FAQ in der Lesesprache – übersetzt, sonst deutsch – mit Filter */
export function ReaderFaqPage() {
  const { lang } = useReaderLanguage();
  const { t, uiLang } = useMemo(() => readerTexts(lang), [lang]);
  const faq = useLoad<{ id: string; question: string; answer: string; language: string; translated: boolean }[]>(`/reader/faq${lang !== 'de' ? `?lang=${lang}` : ''}`, [lang]);
  const glossary = useReaderGlossary(lang);
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLocaleLowerCase(uiLang);
  const items = (faq.data ?? []).filter((f) => !q || `${f.question} ${f.answer}`.toLocaleLowerCase(uiLang).includes(q));
  const partly = lang !== 'de' && (faq.data ?? []).some((f) => !f.translated);
  return (
    <GlossaryProvider entries={glossary.data}>
      <Page title={t('faqTitle')} subtitle="Kurze Antworten auf das, was Leserinnen und Leser oft wissen möchten"
        actions={<Link className="btn no-print" to="/lesen">← Leseransicht</Link>}>
        <div lang={uiLang}>
          <ErrorBox error={faq.error} />
          {partly && <p className="reader-lang-note" role="note">{t('faqPartly')}</p>}
          <div className="filters">
            <label className="inline">{t('faqFilter')} <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t('faqPlaceholder')} /></label>
            <span className="small muted" aria-live="polite">{faq.data ? `${items.length} / ${faq.data.length}` : ''}</span>
          </div>
          {faq.data && !faq.data.length ? <Empty>{t('faqEmpty')}</Empty> : (
            <div className="card faq-list">
              {items.map((f) => (
                <details key={f.id} className="faq-item" lang={f.language}>
                  <summary>{f.question}{!f.translated && <> <span className="tag small" lang={uiLang} title={t('untranslatedTag')}>DE</span></>}</summary>
                  <Md text={f.answer} />
                </details>
              ))}
            </div>
          )}
        </div>
      </Page>
    </GlossaryProvider>
  );
}
