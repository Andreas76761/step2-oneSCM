import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { alignBlocks, normalizeText, parseReviewDocument, similarity, unwrapBox, wordDiff } from '../src/domain/revision.js';
import { client, FM, importFile, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Absatz (<w:p>) der Word-Datei, der den Text enthält */
const paragraphWith = (xml: string, text: string) => {
  const m = new RegExp(`<w:p>(?:(?!<w:p>)[\\s\\S])*?${escapeRe(text)}[\\s\\S]*?</w:p>`).exec(xml);
  if (!m) throw new Error(`Absatz „${text}“ nicht gefunden`);
  return m[0];
};

describe('Etappe 51', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  /** Kapitel erzeugen, Lücken entfernen, einem Absatz einen internen Kommentar geben, freigeben */
  async function approved(built: Awaited<ReturnType<typeof build>>, file: string, md: string, title: string) {
    const call = client(built);
    await importFile(built, file, md);
    const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === title).id;
    const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
    const blocks = v.sections.flatMap((s: any) => s.blocks);
    for (const b of blocks) {
      if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
    }
    const commented = blocks.find((b: any) => b.kind === 'paragraph');
    expect((await call('PATCH', `/content-blocks/${commented.id}`, { comment: 'INTERN-7731 nur für die Redaktion', reason: 'Notiz' }, 'u-redaktion')).status).toBe(200);
    expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
    expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    return { chapterId, version: (await call('GET', `/chapter-versions/${v.id}`)).json };
  }

  it('[T-328] Prüffassung zerlegen, Absätze zuordnen, Wortvergleich (Einheit)', () => {
    const md = '# Handbuch\n\n**Inhalt**\n\n# Vertrag anlegen\n\n_Stand 1_\n\n**Fertig, wenn: der Ablauf stimmt.**\n\n## Zweck\n\nMit dieser Anleitung legen Sie einen Vertrag an.\n\n## Schrittweise Durchführung\n\n1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.\n\n| **Warnung** Speichern Sie vor dem Schließen. |\n| --- |\n';
    const doc = parseReviewDocument(md);
    expect(doc).toHaveLength(2);
    expect(doc[0]).toMatchObject({ title: 'Handbuch', sections: [] });
    expect(doc[1]).toMatchObject({ title: 'Vertrag anlegen', criterion: 'der Ablauf stimmt.' });
    expect(doc[1].sections.map((s) => s.title)).toEqual(['Zweck', 'Schrittweise Durchführung']);
    // Liste bleibt ein Absatz, Warnkasten (Tabelle mit einer Zelle) wird wieder Absatztext
    expect(doc[1].sections[1].paragraphs).toEqual(['1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.', 'Speichern Sie vor dem Schließen.']);
    expect(unwrapBox('| **Hinweis** Text mit **fett**. |\n| --- |')).toBe('Text mit **fett**.');
    expect(normalizeText('| **A** | B |\n| --- | --- |\n| 1 | 2 |')).toBe(normalizeText('| A | B |\n| - | - |\n| 1 | 2 |'));
    expect(similarity('Öffnen Sie das Menü Verträge.', 'Öffnen Sie bitte das Menü Verträge.')).toBeGreaterThan(0.8);
    const blocks = [{ id: 'a', text: 'Öffnen Sie das Menü Verträge.' }, { id: 'b', text: 'Die Liste zeigt alle Verträge des Händlers.' }, { id: 'c', text: 'Klicken Sie auf Neu.' }];
    const ops = alignBlocks(blocks, ['Öffnen Sie das Menü **Verträge**.', 'Klicken Sie auf Neu, um einen Vertrag anzulegen.', 'Speichern Sie den Vertrag.']);
    expect(ops.map((o) => o.type)).toEqual(['same', 'removed', 'changed', 'added']);
    // Absatz mit Leerzeile (Einleitung und Liste) steht in Word als zwei Absätze
    const multi = [{ id: 'r', text: 'Dieses Kapitel betrifft folgende Rollen:\n\n- Alle' }];
    expect(alignBlocks(multi, ['Dieses Kapitel betrifft folgende Rollen:', '- Alle'])).toEqual([{ type: 'same', blockId: 'r' }]);
    expect(alignBlocks(multi, ['Dieses Kapitel betrifft folgende Rollen:', '- Alle Rollen'])[0]).toMatchObject({ type: 'changed', proposed: 'Dieses Kapitel betrifft folgende Rollen:\n\n- Alle Rollen' });
    expect(ops[3]).toMatchObject({ type: 'added', afterBlockId: 'c', proposed: 'Speichern Sie den Vertrag.' });
    expect(wordDiff('Das Passwort wurde gespeichert.', 'Das Kennwort wird gespeichert.')).toEqual([
      { op: '=', text: 'Das' }, { op: '-', text: ' Passwort wurde' }, { op: '+', text: ' Kennwort wird' }, { op: '=', text: ' gespeichert.' },
    ]);
  });

  it('[T-329] Word-Prüffassung exportieren, geändert zurücklesen, Vorschläge übernehmen; interne Kommentare in keinem Export', async () => {
    const built = await build('word');
    const call = client(built);
    try {
      const md = `${FM}# Kündigung\n\n## Vertrag kündigen\n\nVerträge kündigen Sie im Menü Verträge mit der Schaltfläche Kündigen. Die Kündigungsfrist beträgt 30 Tage.\n\nNach der Kündigung erhält der Händler eine Bestätigung per E-Mail.\n\nDie Kündigung erscheint danach in der Übersicht der beendeten Verträge.\n`;
      const { chapterId, version } = await approved(built, 'kuendigung.md', md, 'Kündigung');
      // W-08: interner Kommentar steht in keinem Export
      for (const format of ['md', 'html', 'json', 'docx']) {
        const e = (await call('POST', '/exports', { format, chapterIds: [chapterId] }, 'u-leser')).json;
        const f = await call('GET', e.downloadUrl.replace('/api/v1', ''), undefined, 'u-leser');
        const text = format === 'docx' ? await (await JSZip.loadAsync(f.raw as Buffer)).file('word/document.xml')!.async('string') : f.body;
        expect(text).not.toContain('INTERN-7731');
      }
      expect((await call('POST', '/exports', { format: 'pdf', reviewCopy: true }, 'u-leser')).status).toBe(400);
      const exp = (await call('POST', '/exports', { format: 'docx', chapterIds: [chapterId], reviewCopy: { criterion: 'die Frist und der Ablauf mit der Oberfläche übereinstimmen.' } }, 'u-leser')).json;
      expect(exp.fileName).toMatch(/pruefassung/);
      const file = await call('GET', exp.downloadUrl.replace('/api/v1', ''), undefined, 'u-leser');
      const zip = await JSZip.loadAsync(file.raw as Buffer);
      expect(await zip.file('docProps/custom.xml')!.async('string')).toContain(exp.id);
      let xml = await zip.file('word/document.xml')!.async('string');
      expect(xml).toContain('Fertig, wenn: die Frist und der Ablauf');

      // in Word: einen Absatz ändern, einen löschen, einen neuen einfügen
      const paragraphs = version.sections.flatMap((s: any) => s.blocks.map((b: any) => ({ ...b, section: s.code }))).filter((b: any) => b.kind === 'paragraph' && !/[*_]/.test(b.text) && !/betrifft folgende Rollen/.test(b.text));
      const [toChange, toRemove] = [paragraphs.find((b: any) => /Bestätigung/.test(b.text)), paragraphs.find((b: any) => /Übersicht der beendeten/.test(b.text))];
      expect(toChange && toRemove).toBeTruthy();
      const changedText = toChange.text.replace('per E-Mail', 'per E-Mail und im Postfach der App');
      const pChange = paragraphWith(xml, toChange.text);
      xml = xml.replace(pChange, pChange.replace(toChange.text, changedText) + pChange.replace(toChange.text, 'Prüfen Sie anschließend den Status im Vertragsverlauf.'));
      xml = xml.replace(paragraphWith(xml, toRemove.text), '');
      zip.file('word/document.xml', xml);
      const edited = await zip.generateAsync({ type: 'nodebuffer' });

      expect((await uploadFile(built, '/revisions/word', 'pruefung.docx', edited, 'u-leser')).status).toBe(403);
      expect((await uploadFile(built, '/revisions/word', 'pruefung.txt', edited, 'u-redaktion')).status).toBe(400);
      const res = await uploadFile(built, '/revisions/word', 'pruefung.docx', edited, 'u-redaktion');
      expect(res.status).toBe(201);
      const batch = res.json;
      expect(batch).toMatchObject({ origin: 'word', exportId: exp.id, stats: { chapters: 1, changed: 1, added: 1, removed: 1, proposals: 3 } });
      expect(batch.stats.criteria[0].criterion).toBe('die Frist und der Ablauf mit der Oberfläche übereinstimmen.');
      const props = batch.chapters[0].proposals;
      const changed = props.find((p: any) => p.change === 'changed');
      expect(changed).toMatchObject({ original: toChange.text, proposed: changedText, current: toChange.text, outdated: false, statusLabel: 'offen' });
      expect(changed.diff.filter((d: any) => d.op === '+').map((d: any) => d.text.trim())).toEqual(['E-Mail und im Postfach der App.']);
      expect(changed.diff.filter((d: any) => d.op === '-').map((d: any) => d.text.trim())).toEqual(['E-Mail.']);
      expect(props.find((p: any) => p.change === 'added').proposed).toBe('Prüfen Sie anschließend den Status im Vertragsverlauf.');

      // interner Kommentar, Übernehmen mit eigener Fassung; die freigegebene Version bleibt, es entsteht ein Entwurf
      expect((await call('PATCH', `/revision-proposals/${changed.id}`, { comment: 'Mit Fachbereich abgestimmt' }, 'u-leser')).status).toBe(403);
      expect((await call('PATCH', `/revision-proposals/${changed.id}`, { comment: 'Mit Fachbereich abgestimmt' }, 'u-redaktion')).json.comment).toBe('Mit Fachbereich abgestimmt');
      const own = `${changedText} Sie können sie dort erneut öffnen.`;
      const acc = (await call('POST', `/revision-proposals/${changed.id}/decision`, { decision: 'accept', text: own }, 'u-redaktion')).json;
      expect(acc).toMatchObject({ status: 'accepted', statusLabel: 'übernommen', comment: 'Mit Fachbereich abgestimmt' });
      expect(acc.appliedVersionId).not.toBe(version.id);
      expect((await call('POST', `/revision-proposals/${changed.id}/decision`, { decision: 'reject' }, 'u-redaktion')).status).toBe(409);
      const draft = (await call('GET', `/chapter-versions/${acc.appliedVersionId}`)).json;
      expect(draft).toMatchObject({ status: 'draft', versionNo: version.versionNo + 1 });
      const draftTexts = draft.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text));
      expect(draftTexts).toContain(own);
      expect((await call('GET', `/chapter-versions/${version.id}`)).json.status).toBe('approved');
      // Rest der Liste für das Kapitel übernehmen: Absatz entfällt, neuer Absatz nach dem geänderten
      const all = (await call('POST', `/revision-batches/${batch.id}/accept-all`, { chapterId }, 'u-redaktion')).json;
      expect(all).toMatchObject({ accepted: 2, stale: 0 });
      const after = (await call('GET', `/chapter-versions/${acc.appliedVersionId}`)).json;
      const texts = after.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text));
      expect(texts).not.toContain(toRemove.text);
      expect(texts.indexOf('Prüfen Sie anschließend den Status im Vertragsverlauf.')).toBe(texts.indexOf(own) + 1);
      // Kommentar des Absatzes bleibt im Entwurf erhalten
      expect(after.sections.flatMap((s: any) => s.blocks).some((b: any) => b.comment === 'INTERN-7731 nur für die Redaktion')).toBe(true);

      // dieselbe Datei erneut: Stand hat sich geändert → veraltet statt überschreiben
      const again = (await uploadFile(built, '/revisions/word', 'pruefung.docx', edited, 'u-redaktion')).json;
      const old = again.chapters[0].proposals.find((p: any) => p.change === 'changed');
      expect(old.outdated).toBe(true);
      const stale = await call('POST', `/revision-proposals/${old.id}/decision`, { decision: 'accept' }, 'u-redaktion');
      expect(stale.status).toBe(409);
      expect(stale.json.proposal.status).toBe('stale');
      const list = (await call('GET', '/revision-batches', undefined, 'u-leser')).json;
      expect(list.map((b: any) => b.id)).toEqual([again.id, batch.id]);
      expect(list[1].counts).toEqual({ accepted: 3 });
    } finally {
      await built.app.close();
    }
  });

  it('[T-330] KI-Lektorat je Kapitel mit Wortvergleich, eingereichte Version ist gesperrt, alle übernehmen', async () => {
    const built = await build('lektorat');
    const call = client(built);
    try {
      const md = `${FM}# Kennwort\n\n## Kennwort ändern\n\nDas Passwort wurde gespeichert. Die Frist beträgt 14 Tage.\n\nÖffnen Sie das Profil und wählen Sie **Sicherheit**.\n`;
      const { chapterId, version } = await approved(built, 'kennwort.md', md, 'Kennwort');
      expect((await call('POST', `/chapter-versions/${version.id}/lektorat`, {}, 'u-leser')).status).toBe(403);
      const res = await call('POST', `/chapter-versions/${version.id}/lektorat`, {}, 'u-redaktion');
      expect(res.status).toBe(201);
      const batch = res.json;
      expect(batch.origin).toBe('ai');
      expect(batch.stats.method).toBe('ai');
      const props = batch.chapters[0].proposals;
      expect(props.length).toBeGreaterThan(0);
      const p = props.find((x: any) => /Passwort/.test(x.original));
      expect(p.proposed).toContain('wird gespeichert');
      expect(p.diff.some((d: any) => d.op === '-' && /wurde/.test(d.text))).toBe(true);
      // Prüfen in Word: unveränderte Absätze ergeben keinen Vorschlag
      expect(props.every((x: any) => normalizeText(x.original) !== normalizeText(x.proposed))).toBe(true);
      // Verwerfen eines Vorschlags, Rest übernehmen
      const others = props.filter((x: any) => x.id !== p.id);
      for (const o of others) expect((await call('POST', `/revision-proposals/${o.id}/decision`, { decision: 'reject', comment: 'bleibt' }, 'u-redaktion')).json.status).toBe('rejected');
      const all = (await call('POST', `/revision-batches/${batch.id}/accept-all`, {}, 'u-redaktion')).json;
      expect(all).toMatchObject({ accepted: 1, stale: 0 });
      const draftId = all.batch.chapters[0].proposals.find((x: any) => x.id === p.id).appliedVersionId;
      const draft = (await call('GET', `/chapter-versions/${draftId}`)).json;
      expect(draft.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text))).toContain(p.proposed);
      // eingereichter Entwurf: Übernehmen gesperrt
      for (const b of draft.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${draftId}/submit`, {}, 'u-redaktion')).status).toBe(200);
      const second = (await call('POST', `/chapter-versions/${version.id}/lektorat`, {}, 'u-redaktion')).json;
      const open = second.chapters[0].proposals.find((x: any) => /wurde/.test(x.original));
      const locked = await call('POST', `/revision-proposals/${open.id}/decision`, { decision: 'accept' }, 'u-redaktion');
      expect(locked.status).toBe(409);
      expect(locked.json.detail).toMatch(/zur Freigabe eingereicht/);
      expect((await call('GET', `/revision-batches/${second.id}`, undefined, 'u-leser')).json.chapters[0].chapterId).toBe(chapterId);
    } finally {
      await built.app.close();
    }
  });
});
