import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { boxLabel, renderQuickRef, signalLabel } from '../src/domain/designs.js';
import { renderDesignDocx } from '../src/services/designDocx.js';

// einfache Markdown-Umsetzung für die Prüfung: Listen als <ul>, sonst Absatz
const md = (t: string) => (t.trim() ? (t.trim().startsWith('- ') ? `<ul>${t.trim().split('\n').map((l) => `<li>${l.slice(2)}</li>`).join('')}</ul>` : `<p>${t.trim()}</p>`) : '');

describe('Etappe 89', () => {
  it('[T-407] Beschriftung der Hinweisboxen: Signalwort nur, wenn es zur Art passt; Standardbeschriftung „Tipp“; Beschriftung auch vor Listen', () => {
    // Standardbeschriftung ohne Signalwort
    expect(boxLabel({ kind: 'tip', text: 'Mehrere Aufträge markieren.' })).toEqual({ label: 'Tipp', text: 'Mehrere Aufträge markieren.' });
    expect(boxLabel({ kind: 'note', text: 'Text' })?.label).toBe('Hinweis');
    // passendes Signalwort wird zur Beschriftung
    expect(boxLabel({ kind: 'tip', text: '**Wichtig:** Preis prüfen.' })).toEqual({ label: 'Wichtig', text: 'Preis prüfen.' });
    expect(boxLabel({ kind: 'warning', text: '**Achtung:** Daten gehen verloren.' })?.label).toBe('Achtung');
    // unpassendes Signalwort bleibt im Text: eine Hinweisbox wird nicht zur „Warnung“
    expect(boxLabel({ kind: 'note', text: '**Warnung:** Daten gehen verloren.' })).toEqual({ label: 'Hinweis', text: '**Warnung:** Daten gehen verloren.' });
    expect(boxLabel({ kind: 'warning', text: '**Tipp:** Erst speichern.' })?.label).toBe('Warnung');
    // außerhalb der Designvorlagen nur in deutschen Texten
    expect(signalLabel('tip', '**Wichtig:** Preis prüfen.', 'de')).toEqual({ label: 'Wichtig', text: 'Preis prüfen.' });
    expect(signalLabel('tip', '**Wichtig:** Check the price.', 'en')).toBeNull();
    expect(signalLabel('tip', 'Ohne Signalwort', 'de')).toBeNull();

    // Quick Reference: die Beschriftung bleibt, auch wenn der Text mit einer Liste beginnt
    const chapter = (text: string) => [{ title: '1. Test', sections: [{ code: 'steps', title: 'Schritte', blocks: [{ kind: 'tip', text }] }] }];
    const html = renderQuickRef(chapter('**Wichtig:**\n\n- Preis prüfen\n- Freigabe einholen'), { title: 'T', asOf: '27.10.2026', md });
    expect(html).toMatch(/<div class="qr-tip"><p><strong>Wichtig<\/strong><\/p><ul><li>Preis prüfen/);
    expect(renderQuickRef(chapter('Mehrere Aufträge markieren.'), { title: 'T', asOf: '27.10.2026', md })).toContain('<div class="qr-tip"><p><strong>Tipp</strong>: Mehrere Aufträge markieren.</p>');
  });

  it('[T-408] Word: Fortsetzung einer nummerierten Liste nach einer verschachtelten Liste zählt mit der äußeren Liste weiter', async () => {
    const chapters = [{ title: '1. Test', sections: [{ code: 'steps', title: 'Schritte', blocks: [{ kind: 'list', text: '1. Erster Schritt\n   1. Unterpunkt\n\nZwischentext\n\n2. Zweiter Schritt' }] }] }];
    const doc = await (await JSZip.loadAsync(await renderDesignDocx('fachdoku', chapters, { title: 'T', asOf: '27.10.2026', media: new Map() } as any))).file('word/document.xml')!.async('string');
    const numOf = (text: string) => {
      const p = [...doc.matchAll(/<w:p>[\s\S]*?<\/w:p>|<w:p [^>]*>[\s\S]*?<\/w:p>/g)].map((m) => m[0]).find((x) => x.includes(text));
      return { id: /<w:numId w:val="(\d+)"\/>/.exec(p ?? '')?.[1], level: /<w:ilvl w:val="(\d+)"\/>/.exec(p ?? '')?.[1] };
    };
    const first = numOf('Erster Schritt'), inner = numOf('Unterpunkt'), second = numOf('Zweiter Schritt');
    expect(first.id).toBeTruthy();
    expect(inner.id).not.toBe(first.id);
    expect(second).toEqual(first);
  });
});
