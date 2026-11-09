// Leseransicht (ADR-054): gemeinsame Bausteine für Leseransicht, Druck und Listen – Kapitelinhalt mit Schritten zum Abhaken,
// hervorgehobenen Hinweisen, Glossar und Lesesprache.
import { InfoIcon, LightbulbIcon, TriangleAlertIcon, type LucideIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlossText, type GlossaryEntry } from '../components/Glossary';
import { Md, useLoad } from '../components/ui';
import { matches } from './FilteredView';
import { readerTexts, useReaderText } from '../readerText';
import { useReadingStyle } from '../readingStyle';

/**
 * Signalwort am Textanfang („**Wichtig:**“) als Beschriftung der Box, wie in Designvorlagen und Releases (Server: signalLabel);
 * nur in deutschen Texten und nur, wenn es zur Art passt – sonst stünde „Tipp: Wichtig:“ doppelt da.
 */

const SIGNAL = /^\*\*(Wichtig|Hinweis|Tipp|Warnung|Achtung)\s*:?\s*\*\*\s*:?\s*/i;

const SIGNAL_FOR: Record<string, string[]> = { note: ['Hinweis', 'Wichtig'], tip: ['Tipp', 'Hinweis', 'Wichtig'], warning: ['Warnung', 'Achtung', 'Wichtig'] };

const CALLOUT: Record<string, { icon: LucideIcon; label: 'tip' | 'warning' | 'note' }> = {
  tip: { icon: LightbulbIcon, label: 'tip' },
  warning: { icon: TriangleAlertIcon, label: 'warning' },
  note: { icon: InfoIcon, label: 'note' },
};

function signalLabel(kind: string, text: string, lang: string): { label: string; text: string } | null {
  const m = lang.startsWith('de') ? SIGNAL.exec(text) : null;
  if (!m) return null;
  const word = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
  return SIGNAL_FOR[kind]?.includes(word) ? { label: word, text: text.slice(m[0].length) } : null;
}

// Verwaltungsabschnitt und Lückenhinweise gehören nicht in die Leseransicht
const HIDDEN_SECTIONS = new Set(['status']);

/** **fett** und `Code` innerhalb einer Zeile; Glossarbegriffe (ADR-066) beim ersten Vorkommen in `seen` markiert */
function inline(t: string, seen: Set<string>): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}><GlossText text={part.slice(2, -2)} seen={seen} /></strong>
      : part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : <GlossText key={i} text={part} seen={seen} />);
}

const storeKey = (versionId: string) => `onescm.reader.done.${versionId}`;

const readDone = (versionId: string): number[] => {
  try {
    return JSON.parse(localStorage.getItem(storeKey(versionId)) ?? '[]');
  } catch {
    return [];
  }
};

/** Nummerierte Schritte zum Abhaken (Stand je Browser gemerkt) */
function StepList({ versionId, blockId, text }: { versionId: string; blockId: string; text: string }) {
  // Zeilen vor dem ersten Schritt = Einleitung; Folgezeilen gehören zum vorangehenden Schritt
  const intro: string[] = [];
  const items: string[] = [];
  for (const l of text.split('\n')) {
    const m = l.match(/^\s*\d+[.)]\s+/);
    if (m) items.push(l.slice(m[0].length));
    else if (!l.trim()) continue;
    else if (items.length) items[items.length - 1] += ` ${l.trim()}`;
    else intro.push(l.trim());
  }
  const { t, uiLang } = useReaderText();
  const [done, setDone] = useState<number[]>(() => readDone(`${versionId}.${blockId}`));
  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i];
    setDone(next);
    try {
      localStorage.setItem(storeKey(`${versionId}.${blockId}`), JSON.stringify(next));
    } catch {
      /* ohne Speicher nur für diese Sitzung */
    }
  };
  if (!items.length) return <Md text={text} />;
  const seen = new Set<string>();
  return (
    <>
      {intro.length > 0 && <p>{inline(intro.join(' '), seen)}</p>}
      <ol className="reader-steps">
        {items.map((t, i) => (
          <li key={i} className={done.includes(i) ? 'done' : ''}>
            <label><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /> <span>{inline(t, seen)}</span></label>
          </li>
        ))}
      </ol>
      <p className="small muted no-print" aria-live="polite" lang={uiLang}>{t('stepsDone', { done: done.length, total: items.length })}</p>
    </>
  );
}

/** Sichtbare Abschnitte: ohne Verwaltung und Lücken; mit Rolle nur allgemeine und passende Inhalte (wie Rollenansichten) */
export function readerSections(version: any, role?: string) {
  return version.sections.filter((s: any) => !HIDDEN_SECTIONS.has(s.code))
    .map((s: any) => ({ ...s, blocks: s.blocks.filter((b: any) => b.kind !== 'gap' && (!role || matches(b, [role], []))) }))
    .filter((s: any) => s.blocks.length);
}

/** Kapitelinhalt in Lesedarstellung (Leseransicht und Druckansicht) */
export function ChapterContent({ version, role }: { version: any; role?: string }) {
  // Hinweis-Beschriftungen in der Sprache des gezeigten Textes (bei deutschem Rückfall deutsch, wie die Abschnittstitel)
  const { t } = useMemo(() => readerTexts(version.language ?? 'de'), [version.language]);
  // Lesestil Handbuch-Kapitel (ADR-117): Farben, Schriften, Balken und Boxen der Designvorlage
  const reading = useReadingStyle();
  return (
    <div className={reading?.className} style={reading?.style}>
      {readerSections(version, role).map((s: any) => (
        <section key={s.code} className="reader-section">
          <h3>{s.title}</h3>
          {s.blocks.map((b: any) => {
            if (CALLOUT[b.kind]) {
              const sig = signalLabel(b.kind, b.text, version.language ?? 'de');
              return <div key={b.id} className={`callout ${b.kind}`}><strong><Ico icon={CALLOUT[b.kind].icon} />{sig?.label ?? t(CALLOUT[b.kind].label)}:</strong> <Md text={sig?.text ?? b.text} /></div>;
            }
            if (s.code === 'steps' && b.kind === 'list') return <StepList key={b.id} versionId={version.id} blockId={b.id} text={b.text} />;
            return <Md key={b.id} text={b.text} />;
          })}
        </section>
      ))}
    </div>
  );
}

/** Glossar für Leseransicht und Druck (Terminologie mit Definition und Abkürzungen) */
export const useReaderGlossary = (lang = 'de') => useLoad<GlossaryEntry[]>(`/reader/glossary${lang !== 'de' ? `?lang=${lang}` : ''}`, [lang]);

const LANG_KEY = 'onescm.reader.lang';

/** Lesesprache (ADR-071): aus ?lang=, sonst gemerkt je Browser; nur Sprachen des Projekts */
export function useReaderLanguage() {
  const [params] = useSearchParams();
  const languages = useLoad<{ code: string; name: string; chapters: number | null }[]>('/reader/languages');
  const [lang, setLangState] = useState<string>(() => {
    try {
      return params.get('lang') ?? localStorage.getItem(LANG_KEY) ?? 'de';
    } catch {
      return params.get('lang') ?? 'de';
    }
  });
  useEffect(() => {
    if (languages.data && !languages.data.some((l) => l.code === lang)) setLangState('de');
  }, [languages.data, lang]);
  const setLang = (code: string) => {
    setLangState(code);
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {
      /* nur für diese Sitzung */
    }
  };
  const name = languages.data?.find((l) => l.code === lang)?.name ?? lang;
  return { lang, setLang, languages: languages.data ?? [], name };
}

/** „3. Titel“ – Titel, die schon mit einer Nummer beginnen (z. B. „4. Vertragsbearbeitung“), bleiben unverändert */
export const numbered = (n: number, title: string) => (/^\d+(\.\d+)*\.?\s/.test(title) ? title : `${n}. ${title}`);
