import { describe, expect, it } from 'vitest';
import { classifySnippet } from '../src/domain/classify.js';
import { detectContradictions, type Statement } from '../src/domain/contradictions.js';
import { evaluateGate } from '../src/domain/gate.js';
import { generateChapter, type GenSnippet } from '../src/domain/generator.js';
import { NO_CHAPTER_TITLE, chapterOf, headingKey, parseMarkdown } from '../src/domain/markdown.js';
import { detectPrivacy } from '../src/domain/privacy.js';
import { CHAPTER_SECTIONS } from '../src/domain/reference.js';
import { TfidfEngine, clusterPairs, normalizedHash, stem } from '../src/domain/similarity.js';
import { blockMatches } from '../src/services/exports.js';

describe('Markdown-Struktur (US-002)', () => {
  it('[T-001] H1→Kapitel, H2→Unterkapitel, H3–H6 als Pfad, Reihenfolge, Ohne Kapitel', () => {
    const doc = parseMarkdown(['Einleitung ohne Überschrift.', '', '# 3. Benutzerverwaltung', 'Kapiteltext.', '', '## 3.2 Freigabe', '', 'Absatz A.', '', '### Details', '#### Tiefer', 'Absatz B', '', '## 3.3 Andere', '- Punkt 1', '- Punkt 2'].join('\n'));
    expect(doc.blocks.map((b) => [b.chapterTitle, b.subchapterTitle, b.headingPath.join('>'), b.kind, b.position])).toEqual([
      [null, null, '', 'paragraph', 0],
      ['3. Benutzerverwaltung', null, '', 'paragraph', 1],
      ['3. Benutzerverwaltung', '3.2 Freigabe', '', 'paragraph', 2],
      ['3. Benutzerverwaltung', '3.2 Freigabe', 'Details>Tiefer', 'paragraph', 3],
      ['3. Benutzerverwaltung', '3.3 Andere', '', 'list', 4],
    ]);
    expect(doc.blocks[2].lineStart).toBe(8);
    expect(chapterOf(doc.blocks[0]).title).toBe(NO_CHAPTER_TITLE);
    expect(headingKey('3. Benutzerverwaltung')).toBe(headingKey('Benutzerverwaltung'));
    expect(doc.headings.find((h) => h.title === '3.3 Andere')!.contentBlocks).toBe(1);
  });

  it('[T-002] Front-Matter, Codeblöcke und eingebettetes HTML bleiben reiner Text', () => {
    const doc = parseMarkdown(['---', 'roles: [dealer, mo]', '---', '# Kapitel', '```html', '<script>alert(1)</script>', '', '# kein Titel', '```', '<img src=x onerror=alert(1)>', '', 'Titel', '===', 'Text'].join('\n'));
    expect(doc.frontMatter).toEqual({ roles: ['dealer', 'mo'] });
    const code = doc.blocks.find((b) => b.kind === 'code')!;
    expect(code.text).toContain('<script>alert(1)</script>');
    expect(code.text).toContain('# kein Titel');
    expect(doc.blocks.find((b) => b.text.startsWith('<img'))!.kind).toBe('paragraph');
    expect(doc.headings.map((h) => h.title)).toEqual(['Kapitel', 'Titel']);
  });
});

describe('Klassifikation (US-003, US-004)', () => {
  it('[T-003] Mehrfachzuordnung, Front-Matter bestätigt, Pfadableitung bleibt unbestätigt', () => {
    const c = classifySnippet({ text: 'Das Autohaus sendet den Vertrag an MO. Gilt für PKW und Truck.', headings: ['Vertrag'], path: 'bus/datei.md', frontMatter: {} });
    expect(c.roles.map((r) => r.code).sort()).toEqual(['dealer', 'mo']);
    expect(c.divisions.map((d) => d.code).sort()).toEqual(['bus', 'car', 'truck']);
    expect(c.roles.every((r) => r.evidenceStatus === 'unconfirmed' && r.modelVersion === 'rules-1.0' && r.score > 0)).toBe(true);
    const bus = c.divisions.find((d) => d.code === 'bus')!;
    expect(bus.method).toBe('path-derivation');
    expect(bus.evidenceStatus).toBe('unconfirmed');

    const fm = classifySnippet({ text: 'Text', headings: [], path: 'x.md', frontMatter: { roles: ['hq'], sparten: 'PKW, lkw', evidence_status: 'source_confirmed', market: 'de', release: '2026.3' } });
    expect(fm.roles).toMatchObject([{ code: 'hq', evidenceStatus: 'source_confirmed', method: 'front-matter' }]);
    expect(fm.divisions.map((d) => d.code).sort()).toEqual(['car', 'truck']);
    expect(fm.evidenceStatus).toBe('source_confirmed');
    expect(fm.market).toEqual({ code: 'DE', status: 'confirmed' });

    const none = classifySnippet({ text: 'Allgemeiner Text.', headings: [], path: 'x.md', frontMatter: {} });
    expect(none.divisions).toMatchObject([{ code: 'unconfirmed', evidenceStatus: 'open_question' }]);
    expect(none.evidenceStatus).toBe('unconfirmed');
  });
});

describe('Ähnlichkeit (US-005, US-006)', () => {
  it('[T-004] normalisierter Hash und semantische Paare', () => {
    expect(normalizedHash('Die **Freigabe** erfolgt.')).toBe(normalizedHash('die Freigabe erfolgt'));
    expect(stem('Benutzers')).toBe(stem('Benutzer'));
    const engine = new TfidfEngine();
    const pairs = engine.pairs(
      [
        { id: 'a', text: 'Ein Administrator muss den Benutzer freigeben, bevor der Benutzer das System nutzen kann.' },
        { id: 'b', text: 'Die Freigabe des Benutzers durch einen Administrator ist optional und kann nach der Nutzung des Systems erfolgen.' },
        { id: 'c', text: 'Preislisten werden von HQ veröffentlicht.' },
      ],
      0.3,
    );
    expect(pairs).toHaveLength(1);
    expect(pairs[0]).toMatchObject({ a: 'a', b: 'b' });
    expect(pairs[0].sharedTerms).toContain('administrator');
    expect(clusterPairs(['a', 'b', 'c'], pairs)).toEqual([['a', 'b']]);
  });
});

describe('Widersprüche (US-007)', () => {
  const st = (id: string, text: string, extra: Partial<Statement> = {}): Statement => ({
    id, text, roles: [], divisions: [], market: null, release: null, documentId: id, revisionNo: 1, isCurrentRevision: true, path: `${id}.md`, ...extra,
  });
  it('[T-005] Pflicht/Optional, Negation, abweichende Zahlen und Fristen', () => {
    expect(detectContradictions(st('a', 'Die Freigabe ist Pflicht.'), st('b', 'Die Freigabe ist optional.'))[0].rule).toBe('obligation');
    expect(detectContradictions(st('a', 'Der Benutzer erhält eine E-Mail.'), st('b', 'Der Benutzer erhält keine E-Mail.'))[0].rule).toBe('negation');
    const deadline = detectContradictions(st('a', 'Die Freigabe erfolgt innerhalb von 2 Tagen.'), st('b', 'Die Freigabe erfolgt innerhalb von 5 Tagen.'));
    expect(deadline[0]).toMatchObject({ rule: 'deadline', details: { a: ['2'], b: ['5'] } });
    expect(detectContradictions(st('a', 'Maximal 3 Anfragen je Minute sind erlaubt.'), st('b', 'Maximal 5 Anfragen sind erlaubt.'))[0].rule).toBe('number');
    expect(detectContradictions(st('a', 'Die Freigabe erfolgt in Kapitel 3.2.'), st('b', 'Die Freigabe erfolgt in Kapitel 3.4.'))).toEqual([]);
    const withRoles = detectContradictions(st('a', 'Die Freigabe ist Pflicht.', { roles: ['dealer'] }), st('b', 'Die Freigabe ist optional.', { roles: ['hq'] }));
    expect(withRoles.map((h) => h.rule)).toEqual(['obligation', 'role_difference']);
    expect(detectContradictions(st('a', 'Die Freigabe ist Pflicht.'), st('b', 'Die Freigabe ist Pflicht.'))).toEqual([]);
  });
});

describe('Datenschutz (US-012)', () => {
  it('[T-006] erkennt E-Mail, Telefon und IBAN, ignoriert Beispiel-Domains', () => {
    expect(detectPrivacy('Kontakt: erika@firma-intern.de').map((h) => h.kind)).toEqual(['email']);
    expect(detectPrivacy('Kontakt: support@example.com')).toEqual([]);
    expect(detectPrivacy('Konto DE00 0000 0000 0000 0000 00').map((h) => h.kind)).toEqual(['iban']);
    expect(detectPrivacy('Telefon +49 30 0000000').map((h) => h.kind)).toEqual(['phone']);
    expect(detectPrivacy('Die Freigabe erfolgt innerhalb von 2 Tagen.')).toEqual([]);
  });
});

const gs = (id: string, text: string, extra: Partial<GenSnippet> = {}): GenSnippet => ({
  id, seq: Number(id.replace(/\D/g, '')) || 1, text, kind: 'paragraph', evidenceStatus: 'source_confirmed', subchapterTitle: null, headingPath: [], order: 0,
  normHash: normalizedHash(text), roles: [{ code: 'all', evidenceStatus: 'source_confirmed' }], divisions: [{ code: 'all', evidenceStatus: 'source_confirmed' }],
  market: null, release: null, scopeStatus: 'confirmed', sourceLabel: 'quelle.md (Rev. 1)', ...extra,
});

describe('Generator (US-008)', () => {
  it('[T-007] nur bestätigte Quellen, 10 Abschnitte, Quellen je Block, Dedupe, Lücken, Querverweis', () => {
    const r = generateChapter('Kapitel', [
      gs('s1', 'Die Benutzerverwaltung regelt den Zugriff.', { order: 1 }),
      gs('s2', '1. Öffnen\n2. Speichern', { kind: 'ordered_list', order: 2 }),
      gs('s3', 'Die Benutzerverwaltung regelt den Zugriff.', { order: 3 }),
      gs('s4', 'Nicht bestätigter Text.', { order: 4, evidenceStatus: 'unconfirmed' }),
      gs('s5', 'Hinweis: Bitte beachten.', { order: 5 }),
      gs('s6', 'Nur für Truck.', { order: 6, divisions: [{ code: 'truck', evidenceStatus: 'source_confirmed' }] }),
      gs('s7', 'Wird woanders erklärt.', { order: 7, canonicalRedirect: { topicId: 't1', topicTitle: 'Protokoll', leadChapterTitle: '5. MO-Check' } }),
    ]);
    const sec = (code: string) => r.blocks.filter((b) => b.section === code);
    expect(new Set(r.blocks.map((b) => b.section))).toEqual(new Set(CHAPTER_SECTIONS.map((s) => s.code)));
    expect(sec('purpose')[0]).toMatchObject({ text: 'Die Benutzerverwaltung regelt den Zugriff.', sourceIds: ['s1', 's3'], scopeStatus: 'general' });
    expect(sec('steps')[0]).toMatchObject({ kind: 'list', sourceIds: ['s2'] });
    expect(sec('hints').map((b) => b.kind)).toEqual(['note', 'xref']);
    expect(sec('hints')[1].text).toBe('Siehe Kapitel „5. MO-Check“ – Protokoll.');
    expect(sec('scope_differences')[0].sourceIds).toEqual(['s6']);
    expect(r.blocks.some((b) => b.sourceIds.includes('s4'))).toBe(false);
    expect(r.skippedUnconfirmed).toBe(1);
    expect(r.deduplicated).toBe(1);
    expect(r.gaps).toEqual(expect.arrayContaining(['prerequisites', 'result', 'troubleshooting']));
    for (const b of r.blocks) expect(b.kind === 'gap' || b.sourceIds.length > 0).toBe(true);
  });
});

describe('Qualitätsgate (US-012)', () => {
  it('[T-008] prüft Blocker, Datenschutz, Evidenz und Klassifikation', () => {
    const block = { id: 'b1', kind: 'paragraph', section: 'steps', sourceCount: 1, justification: null, scopeStatus: 'confirmed', mode: 'generated' };
    expect(evaluateGate([block], [], { purpose: 'approve' }).passed).toBe(true);
    const blocker = { id: 'f', seq: 1, type: 'contradiction', severity: 'blocker', status: 'open', reason: 'x' };
    expect(evaluateGate([], [blocker], { purpose: 'generate' }).passed).toBe(false);
    expect(evaluateGate([], [{ ...blocker, status: 'resolved' }], { purpose: 'generate' }).passed).toBe(true);
    const privacy = evaluateGate([], [{ ...blocker, type: 'privacy' }], { purpose: 'export' });
    expect(privacy.checks.find((c) => c.code === 'no_privacy_blockers')!.passed).toBe(false);
    const res = evaluateGate([{ ...block, sourceCount: 0 }, { ...block, id: 'b2', scopeStatus: 'unconfirmed' }], [], { purpose: 'approve' });
    expect(res.checks.filter((c) => !c.passed).map((c) => c.code)).toEqual(['evidence_per_block', 'scope_confirmed']);
    expect(evaluateGate([{ ...block, sourceCount: 0, justification: 'Redaktionell ergänzt laut Fachbereich' }], [], { purpose: 'approve' }).passed).toBe(true);
  });
});

describe('Gefilterte Ansicht (US-010)', () => {
  it('[T-009] enthält allgemeine plus passende spezifische Inhalte', () => {
    const b = (roles: string[], divisions: string[], market: string | null = null) => ({ roles, divisions, market, release: null, kind: 'paragraph' });
    const f = { roles: ['dealer'], divisions: ['truck'] };
    expect(blockMatches(b(['all'], ['all']), f)).toBe(true);
    expect(blockMatches(b(['dealer'], ['truck']), f)).toBe(true);
    expect(blockMatches(b(['dealer', 'mo'], ['all']), f)).toBe(true);
    expect(blockMatches(b(['hq'], ['all']), f)).toBe(false);
    expect(blockMatches(b(['dealer'], ['car']), f)).toBe(false);
    expect(blockMatches(b(['all'], ['all'], 'AT'), { market: 'DE' })).toBe(false);
    expect(blockMatches(b(['all'], ['all'], null), { market: 'DE' })).toBe(true);
  });
});
