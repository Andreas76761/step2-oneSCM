import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { createEmbeddingProvider } from '../src/embeddings.js';
import { matches } from '../src/domain/evaluation.js';
import { analyzeQuery, buildIndex, coverage, decompound, forms, rank } from '../src/domain/retrieval.js';
import { createProvider as createLlmProvider, isLocalUrl } from '../src/llm.js';
import { createImport } from '../src/services/imports.js';
import { askSources } from '../src/services/metadataAsk.js';
import { BENCH_ABBREVIATIONS, BENCH_DOCS, BENCH_HOLDOUT, BENCH_QUESTIONS, BENCH_TERMS, type BenchQuestion } from '../scripts/fixtures/rag-benchmark.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 46', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  async function seed(built: Awaited<ReturnType<typeof build>>) {
    const call = client(built);
    await call('PATCH', '/projects/p_default', { languages: ['en'] });
    for (const t of BENCH_TERMS) {
      expect((await call('POST', '/terminology', { preferred: t.preferred, avoid: t.avoid, translations: Object.fromEntries(Object.entries(t.translations ?? {}).map(([l, term]) => [l, { term }])) })).status).toBe(201);
    }
    for (const a of BENCH_ABBREVIATIONS) expect((await call('POST', '/abbreviations', a)).status).toBe(201);
    const zip = new JSZip();
    for (const d of BENCH_DOCS) zip.file(d.name, d.text);
    await createImport(built.ctx, 'rag-bench.zip', await zip.generateAsync({ type: 'nodebuffer' }), 'u-admin');
    await built.ctx.jobs.idle();
    return call;
  }

  /** Messung wie scripts/rag-bench.ts: bestanden = Lückenfrage ohne Antwort bzw. Antwort mit passendem Beleg und Stichworten */
  async function measure(built: Awaited<ReturnType<typeof build>>, questions: BenchQuestion[], method: 'v1' | 'v2') {
    const user = { id: 'u-admin', name: 'Admin', permissions: ['read', 'edit', 'admin'] } as any;
    // ohne KI: die extraktive Antwort ist reproduzierbar
    const llm = built.ctx.llm;
    (built.ctx as any).llm = null;
    let passed = 0;
    let hit1 = 0;
    let pos = 0;
    let gaps = 0;
    let abstained = 0;
    let duplicates = 0;
    try {
      for (const b of questions) {
        const res: any = await askSources(built.ctx, { question: b.q, language: b.language ?? 'de' }, user, { log: false, method });
        const rel = (f: any) => matches(f, { path: b.path, heading: b.heading });
        const answered = res.answer.length > 0;
        duplicates += res.sources.length - new Set(res.sources.map((s: any) => s.text)).size;
        if (b.kind === 'luecke') {
          gaps++;
          if (!answered) (abstained++, passed++);
          continue;
        }
        pos++;
        if (res.retrieved[0] && rel(res.retrieved[0])) hit1++;
        const kw = b.keywords ?? [];
        const kwHits = kw.filter((k) => res.answerText.toLowerCase().includes(k.toLowerCase())).length;
        if (answered && res.sources.some(rel) && (!kw.length || kwHits / kw.length >= 0.5)) passed++;
      }
    } finally {
      (built.ctx as any).llm = llm;
    }
    return { passRate: passed / questions.length, hitAt1: hit1 / pos, abstention: abstained / gaps, duplicates };
  }

  it('[T-305] Morphologie, Komposita, Kennungen, Abfrageerweiterung, Relevanzschwelle, RRF und MMR (Einheit)', () => {
    // Varianten: Partizip, Umlaut
    expect(forms('gekündigt')).toEqual(expect.arrayContaining(['kuendig']));
    expect(forms('Gründe')).toEqual(expect.arrayContaining(['grund']));
    // Komposita gegen das Vokabular
    const vocab = new Set(['kuendig', 'frist', 'vertrag', 'verlaeng', 'zahlung', 'ziel']);
    expect(decompound('Kündigungsfrist', vocab)).toEqual(['kuendig', 'frist']);
    expect(decompound('Vertragsverlängerung', vocab)).toEqual(['vertrag', 'verlaeng']);
    expect(decompound('Fahrzeug', vocab)).toBeNull();
    const units = [
      { header: 'vertraege 3. Vertragsverwaltung 3.2 Vertrag kündigen', text: 'Ein aktiver Vertrag kann mit einer Frist von 30 Tagen gekündigt werden.' },
      { header: 'vertraege alt 3.2 Vertrag kündigen', text: 'Ein aktiver Vertrag kann mit einer Frist von 30 Tagen gekündigt werden.' },
      { header: 'abrechnung 6.3 Fehlermeldungen', text: 'Die Meldung E-4711 bedeutet, dass keine Bankverbindung hinterlegt ist.' },
      { header: 'rollen 2.2 MO', text: 'Die Market Operation prüft Anträge.' },
      { header: 'rollen 2.1 Dealer', text: 'Der Dealer legt Verträge an.' },
    ];
    const index = buildIndex(units);
    const lexicon = { groups: [['Dealer', 'Händler'], ['MO', 'Market Operation'], ['Vertrag', 'contract'], ['kündigen', 'terminate']] };
    // Kennung als ein Begriff
    const q1 = analyzeQuery('Was bedeutet E-4711?', index, lexicon);
    expect(q1.concepts.some((c) => c.ident && c.terms.has('e-4711'))).toBe(true);
    expect(rank(index, q1, units.map(() => null), { candidates: 20, passages: 6 }).ranked[0].i).toBe(2);
    // Kompositum der Frage findet Kündigung und Frist
    const q2 = analyzeQuery('Wie lang ist die Kündigungsfrist?', index, lexicon);
    const r2 = rank(index, q2, units.map(() => null), { candidates: 20, passages: 6 });
    expect([0, 1]).toContain(r2.ranked[0].i);
    // MMR: die gleichlautende zweite Fassung wird nicht zusätzlich als Beleg genommen
    expect(r2.ranked.filter((x) => x.i <= 1)).toHaveLength(1);
    // Synonym, Abkürzung und Übersetzung erweitern die Frage
    const q3 = analyzeQuery('Was darf ein Händler?', index, lexicon);
    expect(q3.expansions).toContain('Dealer');
    expect(rank(index, q3, units.map(() => null), { candidates: 20, passages: 6 }).ranked[0].i).toBe(4);
    expect(analyzeQuery('Was macht die MO?', index, lexicon).expansions).toContain('Market Operation');
    const q4 = analyzeQuery('How do I terminate a contract?', index, lexicon, { language: 'en' });
    expect([0, 1]).toContain(rank(index, q4, units.map(() => null), { candidates: 20, passages: 6 }).ranked[0].i);
    // Relevanzschwelle: unbekannter Fachbegriff (Substantiv) → keine Belege
    const q5 = analyzeQuery('Wie exportiere ich Verträge nach SAP?', index, lexicon);
    expect(q5.concepts.find((c) => c.word === 'SAP')?.known).toBe(false);
    expect(rank(index, q5, units.map(() => null), { candidates: 20, passages: 6 }).ranked).toEqual([]);
    // Abdeckung: unbekannte Verben zählen weniger als unbekannte Substantive
    const verb = coverage(analyzeQuery('Was zeigt die Kündigung?', index, lexicon), index.docs[0].body);
    const noun = coverage(analyzeQuery('Welche Provision hat die Kündigung?', index, lexicon), index.docs[0].body);
    expect(verb).toBeGreaterThan(noun);
    expect(verb).toBeGreaterThan(0.55);
    expect(noun).toBeLessThan(0.5);
    // Vektorliste fließt per RRF ein: eine Stelle nur aus der Vektorliste rückt nach vorn, wenn sie die Frage abdeckt
    const sims = units.map((_, i) => (i === 4 ? 0.9 : 0.1));
    expect(rank(index, analyzeQuery('Was macht der Dealer mit Verträgen?', index, lexicon), sims, { candidates: 20, passages: 6 }).ranked[0].i).toBe(4);
  });

  it('[T-306] Messbestand: v2 übertrifft v1 im Abstimmungs- und im Prüfsatz, enthält sich bei Lückenfragen, keine Dubletten unter den Belegen', async () => {
    const built = await build('t306');
    try {
      await seed(built);
      const tuneV1 = await measure(built, BENCH_QUESTIONS, 'v1');
      const tuneV2 = await measure(built, BENCH_QUESTIONS, 'v2');
      const holdV1 = await measure(built, BENCH_HOLDOUT, 'v1');
      const holdV2 = await measure(built, BENCH_HOLDOUT, 'v2');
      // Mindestwerte (Stand Etappe 46, docs/rag-messung.md): v2 89 %/82 % bestanden, v1 53 %/77 %
      expect(tuneV2.passRate).toBeGreaterThanOrEqual(0.85);
      expect(holdV2.passRate).toBeGreaterThanOrEqual(0.8);
      expect(tuneV2.passRate).toBeGreaterThan(tuneV1.passRate);
      expect(holdV2.passRate).toBeGreaterThanOrEqual(holdV1.passRate);
      expect(tuneV2.hitAt1).toBeGreaterThan(tuneV1.hitAt1);
      expect(tuneV2.abstention).toBeGreaterThanOrEqual(0.8);
      expect(holdV2.abstention).toBeGreaterThanOrEqual(0.75);
      expect(tuneV2.duplicates + holdV2.duplicates).toBe(0);
    } finally {
      await built.app.close();
    }
  }, 120_000);

  it('[T-307] Frage an alle Quellen mit Erweiterung und Enthaltung, Prüflauf je Verfahren mit nDCG@6, lokaler KI- und Embedding-Dienst', async () => {
    const built = await build('t307');
    try {
      const call = await seed(built);
      const r = (await call('POST', '/metadata/ask', { question: 'Was darf ein Händler?' }, 'u-lesen')).json;
      expect(r.retrieval).toMatchObject({ method: 'v2', expansions: ['Dealer'] });
      expect(r.sources[0].headingPath).toContain('2.1 Dealer');
      const gap = (await call('POST', '/metadata/ask', { question: 'Wie exportiere ich Verträge nach SAP?' }, 'u-lesen')).json;
      expect(gap.answer).toEqual([]);
      expect(gap.retrieval.unknownTerms).toEqual(['SAP']);
      expect((await call('POST', '/metadata/ask', { question: 'Was darf ein Händler?', method: 'v1' }, 'u-lesen')).json.retrieval.method).toBe('v1');
      // Prüflauf mit Verfahren und nDCG@6 – ohne KI, damit die Antwort aus v2 (extraktiv) gemessen wird
      (built.ctx as any).llm = null;
      const set = (await call('POST', '/metadata/eval-sets', { name: 'RAG', items: [
        { question: 'Wie lang ist die Kündigungsfrist?', expected: [{ path: 'vertraege', heading: 'Vertrag kündigen' }], keywords: ['30 Tagen'] },
        { question: 'Wie hoch ist die Provision des Dealers?', expectNoAnswer: true },
      ] }, 'u-redaktion')).json;
      expect(set.id).toBeTruthy();
      const v1 = (await call('POST', `/metadata/eval-sets/${set.id}/runs`, { method: 'v1' }, 'u-redaktion')).json;
      const v2 = (await call('POST', `/metadata/eval-sets/${set.id}/runs`, {}, 'u-redaktion')).json;
      expect(v1.config.method).toBe('v1');
      expect(v2.config).toMatchObject({ method: 'v2', rrfK: 60 });
      expect(v2.metrics.ndcg6).toBeGreaterThan(0);
      expect(v2.metrics.passRate).toBe(1);
      expect(v2.compare.delta).toHaveProperty('ndcg6');
      expect((await call('POST', `/metadata/eval-sets/${set.id}/runs`, { method: 'v3' }, 'u-redaktion')).status).toBe(400);
    } finally {
      await built.app.close();
    }
    // lokaler Dienst: nur mit LLM_LOCAL bzw. EMBEDDINGS_LOCAL und lokaler Adresse intern
    expect(isLocalUrl('http://localhost:11434/v1')).toBe(true);
    expect(isLocalUrl('http://192.168.1.20:11434')).toBe(true);
    expect(isLocalUrl('https://api.openai.com/v1')).toBe(false);
    expect(createLlmProvider({ provider: 'openai', model: 'llama3', baseUrl: 'http://localhost:11434/v1', local: true })!.external).toBe(false);
    expect(createLlmProvider({ provider: 'openai', model: 'gpt', baseUrl: 'https://api.openai.com/v1', local: true })!.external).toBe(true);
    expect(createLlmProvider({ provider: 'openai', model: 'llama3', baseUrl: 'http://localhost:11434/v1' })!.external).toBe(true);
    expect(createEmbeddingProvider({ provider: 'openai', model: 'bge-m3', baseUrl: 'http://127.0.0.1:11434/v1', local: true }).external).toBe(false);
  });
});
