import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { REQUIRED_GROUPS } from '../src/domain/metadataLabels.js';
import { detectDetail, detectDivision, detectLanguage, detectMarkets, detectRoles, detectStatus, detectVersion, type TriageInput } from '../src/domain/triage.js';
import { seedMetadataLabels } from '../src/services/metadata.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const base: TriageInput = { text: '', kind: 'paragraph', headingPath: [], path: 'a.md', sourceFormat: 'markdown', evidenceStatus: 'source_confirmed', marketCode: null, releaseCode: null, roles: [], divisions: [] };
const t = (text: string, more: Partial<TriageInput> = {}) => ({ ...base, text, ...more });

// Gliederung (nummerierte Kapitel) und eine gemischte Eingangsdatei mit Inhalten verschiedener Kapitel, Allgemeinem und Ausnahmen
const OUTLINE = `${FM}# 3. Vertragsverwaltung\n\n## 3.1 Vertrag anlegen\n\nSie legen einen Vertrag über Contracts an.\n\n## 3.2 Vertrag kündigen\n\nEin Vertrag kann gekündigt werden.\n\n# 6. Abrechnung\n\n## 6.1 Rechnungen\n\nDas System erstellt Rechnungen.\n`;
// Eingangsdatei ohne Rollenangabe im Kopf: Rolle kommt aus dem Text oder „Sonstiges“
const FM_MIXED = '---\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';
const MIXED = `${FM_MIXED}# Schulungsunterlage Oktober\n\n## Vertrag anlegen Schritt für Schritt\n\n1. Öffnen Sie Contracts › New Contract.\n2. Wählen Sie den Kunden.\n3. Speichern Sie den Vertrag.\n\n## Vertrag kündigen: Ausnahmen\n\nWenn die Kündigungsfrist abgelaufen ist, ist eine Kündigung nicht möglich; es erscheint die Fehlermeldung E-4711.\n\n## Gutschriften in der Abrechnung\n\nGutschriften für Rechnungen gibt die Buchhaltung frei.\n\n## Wetterbericht\n\nMorgen regnet es im Norden.\n`;

describe('Etappe 47', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-309] TRIAGE-Regeln: Rolle, Sparte, Markt, Version, Status, Sprache und Detaillevel (Basis … inPrüfung) mit Sicherheit (Einheit)', () => {
    expect(detectRoles(t('Der Dealer legt den Antrag an; die MO prüft.')).codes).toEqual(['dealer', 'mo']);
    expect(detectRoles(t('Die Zentrale pflegt Preislisten.')).codes).toEqual(['hq']);
    expect(detectRoles(t('Text ohne Rolle.'))).toMatchObject({ codes: ['other'] });
    expect(detectRoles(t('Text', { roles: ['all'] })).codes).toEqual(['dealer', 'mo', 'market', 'hq']);
    expect(detectRoles(t('Der Markt Frankreich hat eigene Preise.')).codes).toEqual(['other']); // Ländermarkt, keine Rolle
    expect(detectDivision(t('Gilt für Pkw und Van.')).codes).toEqual(['all']);
    expect(detectDivision(t('Nur für Transporter.')).codes).toEqual(['van']);
    expect(detectDivision(t('x', { divisions: ['car'] })).codes).toEqual(['car']);
    expect(detectMarkets(t('Im Markt DE gilt eine andere Frist.')).codes).toEqual(['de']);
    expect(detectMarkets(t('Allgemein.')).codes).toEqual(['all']);
    expect(detectVersion(t('Neu ab PI 16.'))).toMatchObject({ codes: ['pi16'], names: { pi16: 'PI 16' } });
    expect(detectVersion(t('ohne'))).toMatchObject({ codes: ['open'] });
    expect(detectStatus(t('x')).codes).toEqual(['live']);
    expect(detectStatus(t('x', { evidenceStatus: 'unconfirmed' })).codes).toEqual(['draft']);
    expect(detectStatus(t('x', { sourceFormat: 'jira', jiraStatus: 'In Progress' })).codes).toEqual(['in-progress']);
    expect(detectLanguage('The contract is created and the dealer saves it for the customer.').codes).toEqual(['en']);
    expect(detectLanguage('Der Vertrag wird angelegt und vom Dealer für den Kunden gespeichert.').codes).toEqual(['de']);
    // Detaillevel
    expect(detectDetail(t('1. Öffnen Sie den Vertrag.\n2. Klicken Sie auf Speichern.', { kind: 'ordered_list' })).codes).toEqual(['happy-path']);
    expect(detectDetail(t('Wenn die Frist abgelaufen ist, ist eine Kündigung nicht möglich.')).codes).toEqual(['edge']);
    expect(detectDetail(t('Die Meldung E-4711 erscheint bei fehlender Bankverbindung.')).codes).toEqual(['edge']);
    expect(detectDetail(t('Testfälle und Testdaten für die Migration.')).codes).toEqual(['intern']);
    expect(detectDetail(t('Tipp: Sie können die Liste auch filtern.')).codes).toEqual(['zusatz']);
    expect(detectDetail(t('Ein Vertrag ist die Vereinbarung zwischen Kunde und Dealer.')).codes).toEqual(['basis']);
    expect(detectDetail(t('Kurz offen.', { evidenceStatus: 'unconfirmed' }))).toMatchObject({ codes: ['in-review'] });
  });

  it('[T-310] Nach dem Einlesen: Pflichtlabels für jeden Chunk, Kapitel- und Unterkapitelvorschläge, neues Unterkapitel „neu“, übernehmen, menschliche Labels bleiben, Labels löschen', async () => {
    const built = await build('t310');
    const call = client(built);
    try {
      await importFile(built, 'gliederung.md', OUTLINE);
      await importFile(built, 'schulung.md', MIXED);
      // jeder Chunk trägt alle neun Pflichtgruppen
      const chunks = (await call('GET', '/metadata/chunks?limit=100')).json.items;
      expect(chunks.length).toBeGreaterThan(5);
      for (const c of chunks) expect(REQUIRED_GROUPS.every((g) => c.labels.some((l: any) => l.group === g))).toBe(true);
      const byText = (s: string) => chunks.find((c: any) => c.text.includes(s));
      const codes = (c: any, g: string) => c.labels.filter((l: any) => l.group === g).map((l: any) => l.code);
      expect(codes(byText('Öffnen Sie Contracts'), 'detail')).toEqual(['detail.happy-path']);
      expect(codes(byText('E-4711'), 'detail')).toEqual(['detail.edge']);
      expect(codes(byText('Gutschriften'), 'role')).toEqual(['role.other']);
      expect(codes(byText('Gutschriften'), 'status')).toEqual(['status.live']);
      // Vorschläge für die Schulungsunterlage (kein Kapitel der Gliederung)
      const results = (await call('GET', '/triage/results?status=proposed')).json.items;
      const of = (s: string) => results.find((r: any) => r.text.includes(s));
      expect(of('Öffnen Sie Contracts')).toMatchObject({ placement: 'move', target: { chapterTitle: '3. Vertragsverwaltung', subchapterTitle: '3.1 Vertrag anlegen' } });
      expect(of('E-4711')).toMatchObject({ placement: 'move', target: { subchapterTitle: '3.2 Vertrag kündigen' } });
      expect(of('Gutschriften')).toMatchObject({ placement: 'new_subchapter', target: { chapterTitle: '6. Abrechnung', newSubchapter: 'Gutschriften in der Abrechnung' } });
      expect(of('Wetterbericht')).toBeUndefined(); // nichts passt → nicht zugeordnet, zu prüfen
      const weather = (await call('GET', '/triage/results?review=true')).json.items.find((r: any) => r.text.includes('regnet'));
      expect(weather).toMatchObject({ placement: 'unassigned', review: true, status: 'applied' });
      expect(codes(byText('regnet'), 'review')).toEqual(['review.yes']);
      // übernehmen: Chunks wechseln das Kapitel, neues Unterkapitel mit Kennung „neu“
      expect((await call('POST', '/triage/accept-all', {}, 'u-lesen')).status).toBe(403);
      expect((await call('POST', '/triage/accept-all', {}, 'u-redaktion')).json.accepted).toBe(3);
      const st = (await call('GET', '/structure')).json.chapters;
      const abrechnung = st.find((c: any) => c.title === '6. Abrechnung');
      expect(abrechnung.subchapters.find((s: any) => s.title === 'Gutschriften in der Abrechnung')).toMatchObject({ isNew: true });
      expect((await call('GET', '/metadata/chunks?limit=100')).json.items.find((c: any) => c.text.includes('Öffnen Sie Contracts'))).toMatchObject({ chapter: '3. Vertragsverwaltung', subchapter: '3.1 Vertrag anlegen' });
      const neu = (await call('GET', '/triage/new-subchapters')).json.items;
      expect(neu).toHaveLength(1);
      expect((await call('POST', `/triage/new-subchapters/${neu[0].id}/confirm`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('GET', '/triage/new-subchapters')).json.items).toHaveLength(0);
      // menschliche Zuordnung geht vor: Rolle von Hand → erneuter Lauf lässt sie stehen
      const labels = (await call('GET', '/metadata/labels?group=role')).json;
      const dealer = labels.find((l: any) => l.code === 'role.dealer');
      const gut = byText('Gutschriften');
      const triageRole = gut.labels.find((l: any) => l.group === 'role');
      await call('POST', '/metadata/chunks/labels', { snippetIds: [gut.id], add: [dealer.id], remove: [triageRole.id] }, 'u-redaktion');
      const run = (await call('POST', '/triage/runs', { scope: 'all' }, 'u-redaktion')).json;
      expect(run.stats.keptManual).toBeGreaterThan(0);
      expect(codes((await call('GET', '/metadata/chunks?limit=100')).json.items.find((c: any) => c.id === gut.id), 'role')).toEqual(['role.dealer']);
      expect((await call('POST', '/triage/runs', { scope: 'x' }, 'u-redaktion')).status).toBe(400);
      // Labels löschen: eigenes Label weg; Katalog-Label bleibt gelöscht, auch nach dem Katalogabgleich
      const own = (await call('POST', '/metadata/labels', { code: 'quality.e2e', group: 'quality', nameDe: 'Eigen', nameEn: 'Own' })).json;
      expect((await call('DELETE', `/metadata/labels/${own.id}`, undefined, 'u-redaktion')).status).toBe(403);
      expect((await call('DELETE', `/metadata/labels/${own.id}`)).json.code).toBe('quality.e2e');
      const basis = (await call('GET', '/metadata/labels?group=detail')).json.find((l: any) => l.code === 'detail.zusatz');
      expect((await call('DELETE', `/metadata/labels/${basis.id}`)).status).toBe(200);
      await seedMetadataLabels(built.ctx.db, 'p_default');
      const after = (await call('GET', '/metadata/labels?includeArchived=true')).json.map((l: any) => l.code);
      expect(after).not.toContain('detail.zusatz');
      expect(after).not.toContain('quality.e2e');
    } finally {
      await built.app.close();
    }
  });

  it('[T-311] Detaillevel steuern das Kapitel: Standardablauf (HappyPath) und Ausnahmen (Edge) getrennt, Detaillierung je Kapitel; Dashboard je Kapitel und Domäne', async () => {
    const built = await build('t311');
    const call = client(built);
    try {
      await importFile(built, 'kuendigen.md', `${FM}# 3. Vertragsverwaltung\n\n## 3.2 Vertrag kündigen\n\nEin Vertrag wird über die Funktion Beenden gekündigt.\n\n1. Öffnen Sie den Vertrag.\n2. Wählen Sie Beenden.\n\nWenn die Frist abgelaufen ist, ist eine Kündigung nicht möglich.\n`);
      const ch = (await call('GET', '/structure')).json.chapters.find((c: any) => c.title === '3. Vertragsverwaltung');
      expect(ch.detailLevels).toEqual(['basis', 'basis-plus', 'zusatz', 'happy-path', 'edge']);
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const blocks = v.sections.flatMap((s: any) => s.blocks.map((b: any) => ({ ...b, section: s.code })));
      expect(blocks.find((b: any) => b.text.includes('Frist abgelaufen')).section).toBe('troubleshooting');
      expect(blocks.find((b: any) => b.text.includes('Öffnen Sie den Vertrag')).section).toBe('steps');
      // nur Standardablauf: Ausnahmen entfallen
      expect((await call('PATCH', `/structure/chapters/${ch.id}`, { detailLevels: ['basis', 'happy-path'] }, 'u-redaktion')).json.detailLevels).toEqual(['basis', 'happy-path']);
      expect((await call('PATCH', `/structure/chapters/${ch.id}`, { detailLevels: ['xyz'] }, 'u-redaktion')).status).toBe(400);
      const v2 = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      expect(JSON.stringify(v2.sections)).not.toContain('Frist abgelaufen');
      expect(v2.generation.excludedByDetail).toBe(1);
      // Dashboard
      const d = (await call('GET', '/triage/dashboard', undefined, 'u-lesen')).json;
      expect(d.totals).toMatchObject({ chunks: 3, complete: 3 });
      expect(d.totals.words).toBeGreaterThan(20);
      const row = d.chapters.find((c: any) => c.title === '3. Vertragsverwaltung');
      expect(row).toMatchObject({ chunks: 3, detail: { basis: 1, 'happy-path': 1, edge: 1 } });
      expect(row.labels).toBeGreaterThanOrEqual(27);
      expect(d.requiredGroups.every((g: any) => g.share === 1)).toBe(true);
      expect(d.domains.reduce((s: number, x: any) => s + x.chunks, 0)).toBe(3);
    } finally {
      await built.app.close();
    }
  });

  it('[T-312] Agenten in der App: ORCHESTRATOR plant, legt Entscheidungen vor, führt sie aus und verfeinert; GOAL vergleicht mit dem Ziel; Aufgaben und Export', async () => {
    const built = await build('t312');
    const call = client(built);
    try {
      await importFile(built, 'gliederung.md', OUTLINE);
      await importFile(built, 'schulung.md', MIXED);
      const agents = (await call('GET', '/agents', undefined, 'u-lesen')).json.items;
      expect(agents.slice(0, 3).map((a: any) => a.code)).toEqual(['orchestrator', 'triage', 'goal']);
      // planen: Vorschläge der Triage → Aufgabe und Entscheidung
      expect((await call('POST', '/agents/orchestrator/plan', {}, 'u-lesen')).status).toBe(403);
      const plan = (await call('POST', '/agents/orchestrator/plan', {}, 'u-redaktion')).json;
      expect(plan.plan.find((p: any) => p.key === 'triage:proposals')).toMatchObject({ agent: 'triage', priority: 1, decision: true });
      expect(plan.plan.some((p: any) => p.key === 'quality:eval')).toBe(true);
      expect(plan.created).toBeGreaterThan(2);
      const dec = plan.decisions.find((x: any) => x.key === 'triage:proposals');
      expect(dec.options).toEqual(['alle übernehmen', 'einzeln prüfen', 'verwerfen']);
      // zweiter Lauf: keine Doppelungen
      expect((await call('POST', '/agents/orchestrator/plan', {}, 'u-redaktion')).json.created).toBe(0);
      // Entscheidung trifft ein Mensch mit „Entscheiden“; der Orchestrator führt sie aus und schließt die Aufgabe
      expect((await call('POST', `/agents/decisions/${dec.id}/decide`, { decision: 'alle übernehmen' }, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', `/agents/decisions/${dec.id}/decide`, { decision: 'irgendwas' }, 'u-fachpruefung')).status).toBe(400);
      expect((await call('POST', `/agents/decisions/${dec.id}/decide`, { decision: 'alle übernehmen' }, 'u-fachpruefung')).json.status).toBe('decided');
      const plan3 = (await call('POST', '/agents/orchestrator/plan', {}, 'u-redaktion')).json;
      expect(plan3.executed[0]).toMatchObject({ key: 'triage:proposals', result: '3 Vorschläge übernommen' });
      expect(plan3.closed).toBeGreaterThanOrEqual(1);
      expect(plan3.plan.some((p: any) => p.key === 'structure:new')).toBe(true); // neues Unterkapitel „neu“ jetzt zu bestätigen
      const tasks = (await call('GET', '/agents/tasks')).json.items;
      expect(tasks.find((x: any) => x.key === 'triage:proposals').status).toBe('done');
      // Aufgaben von Hand
      const own = (await call('POST', '/agents/tasks', { agent: 'kapitel-redakteur', title: 'Kapitel 6 Bilder ergänzen', priority: 1 }, 'u-redaktion')).json;
      expect((await call('PATCH', `/agents/tasks/${own.id}`, { status: 'in_progress' }, 'u-redaktion')).json.status).toBe('in_progress');
      expect((await call('POST', '/agents/tasks', { agent: 'xyz', title: 'Unsinn' }, 'u-redaktion')).status).toBe(400);
      const planned = tasks.find((x: any) => x.source === 'orchestrator' && x.status === 'open');
      expect((await call('DELETE', `/agents/tasks/${planned.id}`, undefined, 'u-redaktion')).status).toBe(409);
      expect((await call('DELETE', `/agents/tasks/${own.id}`, undefined, 'u-redaktion')).status).toBe(204);
      // GOAL: Ziel und Kriterien, Abgleich mit Empfehlungen
      const goal = (await call('GET', '/agents/goal')).json;
      expect(goal.criteria.map((c: any) => c.code)).toContain('required_labels');
      await call('PUT', '/agents/goal', { goal: 'Belegtes Handbuch mit Standardablauf und Ausnahmen je Kapitel.', criteria: [{ code: 'approved', enabled: false }, { code: 'placed', target: 0.5 }] }, 'u-redaktion');
      const run = (await call('POST', '/agents/goal/runs', {}, 'u-redaktion')).json;
      const r = (code: string) => run.results.find((x: any) => x.code === code);
      expect(r('approved')).toBeUndefined();
      expect(r('required_labels')).toMatchObject({ value: 1, ok: true });
      expect(r('answer_quality')).toMatchObject({ value: null, ok: false });
      expect(r('answer_quality').recommendation).toContain('Testfragensatz');
      expect(run.score).toBeGreaterThan(0);
      expect(run.score).toBeLessThan(1);
      // Export für den Arbeitsordner
      const exp = (await call('GET', '/agents/export')).json;
      expect(exp.format).toBe('onescm-agents');
      expect(exp.files.tasks).toContain('| triage |');
      expect(exp.files.decisions).toContain('alle übernehmen');
      expect(exp.files.goal).toContain('Belegtes Handbuch');
    } finally {
      await built.app.close();
    }
  });
});
