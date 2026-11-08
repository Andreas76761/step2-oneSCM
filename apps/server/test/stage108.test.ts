// Etappe 108: Code-Review der Korrekturen aus den Etappen 101–107
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { renderDesignDocx } from '../src/services/designDocx.js';
import { safeFetch } from '../src/services/webhooks.js';

describe('Etappe 108', () => {
  it('[T-448] Webhook/Confluence: wirft die Anfrage sofort (ungültiges Zeichen im Header), bleibt kein Zeitlimit zurück, das später den Server beendet', async () => {
    const uncaught: unknown[] = [];
    const onError = (e: unknown) => uncaught.push(e);
    process.on('uncaughtException', onError);
    try {
      // öffentliche IP-Adresse: keine Namensauflösung nötig; der Header scheitert vor jedem Verbindungsaufbau
      await expect(safeFetch('https://93.184.216.34/', { headers: { authorization: 'Bearer abc\r' }, timeoutMs: 30 }, false)).rejects.toThrow();
      await new Promise((r) => setTimeout(r, 120));
      expect(uncaught).toEqual([]);
    } finally {
      process.off('uncaughtException', onError);
    }
  });

  it('[T-449] Word: Unterliste einer neuen Liste setzt die Unterliste einer früheren Liste nicht fort', async () => {
    const text = '1. Erster Schritt\n   1. Unterpunkt A\n   2. Unterpunkt B\n\nZwischentext\n\n1. Neuer Ablauf\n   3. Unterpunkt C';
    const chapters = [{ title: '1. Test', sections: [{ code: 'steps', title: 'Schritte', blocks: [{ kind: 'list', text }] }] }];
    const doc = await (await JSZip.loadAsync(await renderDesignDocx('fachdoku', chapters, { title: 'T', asOf: '08.11.2026', media: new Map() } as any))).file('word/document.xml')!.async('string');
    const numOf = (t: string) => {
      const p = [...doc.matchAll(/<w:p>[\s\S]*?<\/w:p>|<w:p [^>]*>[\s\S]*?<\/w:p>/g)].map((m) => m[0]).find((x) => x.includes(t));
      return /<w:numId w:val="(\d+)"\/>/.exec(p ?? '')?.[1];
    };
    expect(numOf('Unterpunkt A')).toBeTruthy();
    expect(numOf('Unterpunkt B')).toBe(numOf('Unterpunkt A'));
    expect(numOf('Neuer Ablauf')).not.toBe(numOf('Erster Schritt'));
    expect(numOf('Unterpunkt C')).toBeTruthy();
    expect(numOf('Unterpunkt C')).not.toBe(numOf('Unterpunkt A'));
  });

  it('[T-450] Leseransicht: Sprachen ohne eigene Beschriftungen zeigen das Datum in ihrer Sprache, nicht deutsch', async () => {
    // Datei der Web-App (außerhalb des Server-Projekts für die Typprüfung, daher dynamisch)
    const webFile = '../../web/src/readerText.ts';
    const { readerTexts } = (await import(webFile)) as { readerTexts: (lang: string) => { uiLang: string; locale: string; date: (d: Date) => string } };
    const d = new Date('2026-11-08T12:00:00Z');
    const sv = readerTexts('sv');
    expect(sv.uiLang).toBe('en');
    expect(sv.locale).toBe('sv');
    expect(sv.date(d)).toBe(d.toLocaleDateString('sv'));
    expect(sv.date(d)).not.toBe(d.toLocaleDateString('de-DE'));
    // bekannte Sprachen und Regionen unverändert; ungültiges Kürzel fällt auf Englisch zurück
    expect(readerTexts('de').locale).toBe('de-DE');
    expect(readerTexts('fr-ch').locale).toBe('fr-CH');
    expect(readerTexts('x!').locale).toBe('en-GB');
  });
});
