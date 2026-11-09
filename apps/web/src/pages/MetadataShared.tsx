// oneSCM_Metadaten (ADR-079): gemeinsame Bausteine – Labels, Sprache der Labelnamen, eigene Rechte.
import { useState } from 'react';
import { useLoad } from '../components/ui';

export interface Label { id: string; code: string; group: string; nameDe: string; nameEn: string; archived: boolean; description?: string | null; position?: number; origin?: string; chunkCount?: number; qaCount?: number }

export interface Group { code: string; nameDe: string; nameEn: string; icon: string; color: string }

export type Lang = 'de' | 'en';

const LANG_KEY = 'onescm.metadata.lang';

const readLang = (): Lang => {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'de';
  } catch {
    return 'de';
  }
};

/** Sprache der Labelnamen (Deutsch/Englisch), je Browser gemerkt */
export function useLabelLang() {
  const [lang, setLang] = useState<Lang>(readLang);
  const change = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* nur für diese Sitzung */
    }
  };
  return [lang, change] as const;
}

export const nameOf = (l: Pick<Label, 'nameDe' | 'nameEn'>, lang: Lang) => (lang === 'en' ? l.nameEn : l.nameDe);

export function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <label className="small">Sprache der Labels{' '}
      <select value={lang} onChange={(e) => onChange(e.target.value as Lang)}>
        <option value="de">Deutsch</option>
        <option value="en">Englisch</option>
      </select>
    </label>
  );
}

export function useMe() {
  const me = useLoad<{ permissions: string[] }>('/me');
  const perms = me.data?.permissions ?? [];
  return { canEdit: perms.includes('edit') || perms.includes('admin'), isAdmin: perms.includes('admin') };
}

export function useLabels(includeArchived = false) {
  const labels = useLoad<Label[]>(`/metadata/labels${includeArchived ? '?includeArchived=true' : ''}`, [includeArchived]);
  const groups = useLoad<Group[]>('/metadata/label-groups');
  return { labels, groups: groups.data ?? [] };
}
