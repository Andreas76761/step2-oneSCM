// Lesestil „Handbuch-Kapitel“ (ADR-117): Farben und Schriften der Designvorlage (mit Anpassung, ADR-114) für Leseransicht
// und Druck. Einmal je Projekt geladen; nach Änderungen in den Einstellungen mit resetReadingStyle() neu laden.
import { useEffect, useState, type CSSProperties } from 'react';
import { currentProjectId, get } from './api';

export interface ReadingStyle { className: string; style: CSSProperties }
const FONTS = { serif: 'Georgia, "Times New Roman", serif', sans: '"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif' } as const;
const cache = new Map<string, Promise<ReadingStyle | null>>();

async function load(): Promise<ReadingStyle | null> {
  const layout = await get<any>('/layout');
  if (layout?.readingStyle !== 'fachdoku') return null;
  const t = (await get<any[]>('/design-templates')).find((x) => x.id === 'fachdoku')?.theme;
  if (!t) return null;
  return {
    className: 'reading-fachdoku',
    style: { '--rd-primary': t.primary, '--rd-accent': t.accent, '--rd-warn': t.warn, '--rd-hfont': FONTS[t.headingFont as 'serif' | 'sans'], '--rd-bfont': FONTS[t.bodyFont as 'serif' | 'sans'] } as CSSProperties,
  };
}

export function resetReadingStyle() {
  cache.clear();
}

export function useReadingStyle(): ReadingStyle | null {
  const key = currentProjectId();
  const [style, setStyle] = useState<ReadingStyle | null>(null);
  useEffect(() => {
    let alive = true;
    if (!cache.has(key)) cache.set(key, load().catch(() => null));
    void cache.get(key)!.then((s) => alive && setStyle(s));
    return () => {
      alive = false;
    };
  }, [key]);
  return style;
}
