// Designvorlagen anpassen (ADR-114): Farben, Schriften und Logo-Position je Vorlage, mit Kontrastprüfung und Vorschau
import { RotateCcwIcon, SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, del, put } from '../api';
import { Ico, OkMark } from '../components/icons';
import { Gated, Card, ErrorBox, errorText, useApp, useLoad } from '../components/ui';
import { contrast } from '../contrast';
import { resetReadingStyle } from '../readingStyle';

type Theme = { primary: string; accent: string; warn: string; headingFont: 'serif' | 'sans'; bodyFont: 'serif' | 'sans'; logo: 'right' | 'left' | 'none' };
const COLORS: { key: 'primary' | 'accent' | 'warn'; label: string; use: string }[] = [
  { key: 'primary', label: 'Hauptfarbe', use: 'Links, Überschriften, Kopfzeile' },
  { key: 'accent', label: 'Akzentfarbe', use: 'Rahmen der Karten, Icons, Hinweisboxen' },
  { key: 'warn', label: 'Warnfarbe', use: 'Warnboxen und Warntext' },
];

export function DesignThemeCard() {
  const { notify } = useApp();
  const templates = useLoad<any[]>('/design-templates');
  const [id, setId] = useState('quickref');
  const tpl = templates.data?.find((t) => t.id === id);
  const [draft, setDraft] = useState<Theme | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  useEffect(() => setDraft(tpl ? { ...tpl.theme } : null), [tpl]);

  const ratio = (k: 'primary' | 'accent' | 'warn') => (draft ? contrast(draft[k]) : 0);
  const valid = !!draft && COLORS.every((c) => ratio(c.key) >= tpl.minContrast[c.key]);

  // Vorschau mit der ungespeicherten Anpassung, kurz verzögert beim Tippen
  useEffect(() => {
    if (!draft || !valid) return;
    const timer = setTimeout(() => {
      api<string>('POST', `/design-templates/${id}/preview`, { theme: draft })
        .then((html) => (setPreview(html), setPreviewError(null)))
        .catch((e) => setPreviewError(errorText(e)));
    }, 350);
    return () => clearTimeout(timer);
  }, [id, draft, valid]);

  if (!tpl || !draft) return <Card title="Designvorlagen anpassen"><ErrorBox error={templates.error} /></Card>;
  const set = (k: keyof Theme, v: string) => setDraft({ ...draft, [k]: v } as Theme);
  const save = async () => {
    try {
      await put(`/design-templates/${id}/theme`, draft);
      notify(`Anpassung „${tpl.name}“ gespeichert.`);
      resetReadingStyle();
      templates.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };
  const reset = async () => {
    try {
      await del(`/design-templates/${id}/theme`);
      notify(`„${tpl.name}“ auf den Standard zurückgesetzt.`);
      resetReadingStyle();
      templates.reload();
    } catch (e) {
      notify(errorText(e), 'error');
    }
  };

  return (
    <Card title="Designvorlagen anpassen">
      <p className="small muted">Gilt für Export, Muster und PDF im Design. Textfarben brauchen mindestens 4,5 : 1 Kontrast zu Weiß, Rahmen und Icons 3 : 1. Ändern dürfen nur Administratorinnen und Administratoren.</p>
      <label>Vorlage
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {templates.data!.map((t) => <option key={t.id} value={t.id}>{t.name}{t.customized ? ' (angepasst)' : ''}</option>)}
        </select>
      </label>
      <div className="theme-colors">
        {COLORS.map((c) => {
          const r = ratio(c.key);
          const ok = r >= tpl.minContrast[c.key];
          return (
            <div key={c.key} className="theme-color">
              <label>{c.label} <input type="color" value={/^#[0-9a-f]{6}$/i.test(draft[c.key]) ? draft[c.key] : '#000000'} onChange={(e) => set(c.key, e.target.value)} aria-label={`${c.label} (Farbwähler)`} /></label>
              <label>Farbwert <input value={draft[c.key]} onChange={(e) => set(c.key, e.target.value.trim())} size={8} aria-label={`${c.label} als Farbwert`} /></label>
              <span className={`small ${ok ? '' : 'error-text'}`} role="status"><OkMark ok={ok} /> {r.toFixed(1).replace('.', ',')} : 1 {ok ? '' : `– mind. ${String(tpl.minContrast[c.key]).replace('.', ',')} : 1`}</span>
              <span className="small muted">{c.use}</span>
            </div>
          );
        })}
      </div>
      <div className="form-row">
        <label>Schrift der Überschriften
          <select value={draft.headingFont} onChange={(e) => set('headingFont', e.target.value)}><option value="serif">Mit Serifen (Georgia)</option><option value="sans">Serifenlos (Segoe UI)</option></select>
        </label>
        <label>Schrift des Textes
          <select value={draft.bodyFont} onChange={(e) => set('bodyFont', e.target.value)}><option value="sans">Serifenlos (Segoe UI)</option><option value="serif">Mit Serifen (Georgia)</option></select>
        </label>
        <label>Logo
          <select value={draft.logo} onChange={(e) => set('logo', e.target.value)}><option value="right">rechts</option><option value="left">links</option><option value="none">ohne Logo</option></select>
        </label>
      </div>
      <div className="actions">
        <Gated className="btn primary" missing={[!valid && 'Farben mit ausreichendem Kontrast']} onClick={save}><Ico icon={SaveIcon} /> Anpassung speichern</Gated>
        <button className="btn" onClick={() => setDraft({ ...tpl.defaultTheme })}>Standardwerte einsetzen</button>
        {tpl.customized && <button className="btn" onClick={reset}><Ico icon={RotateCcwIcon} /> Auf Standard zurücksetzen</button>}
      </div>
      <ErrorBox error={previewError} />
      {preview && <iframe className="theme-preview" title={`Vorschau: ${tpl.name}`} sandbox="" srcDoc={preview} />}
    </Card>
  );
}
