// Testlauf im Browser: lädt die Seite mit dem Laufzeit-Ersatz, öffnet jedes Register, prüft Simulationen, Summen-Kennzahlen und Daten.
// Aufruf: node test/run.js [--shots <Ordner>]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright'), { start } = require('./server');
const DATA = (n) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', n + '.json'), 'utf8'));
const si = process.argv.indexOf('--shots'), SHOTS = si > 0 ? process.argv[si + 1] : null;
const results = []; let section = '';
const ok = (name, cond, info) => { results.push({ section, name, ok: !!cond, info }); console.log((cond ? '  ok   ' : '  FEHLER ') + name + (info !== undefined && !cond ? '  → ' + info : '')); };
const near = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 0.5 : tol);
const sec = (s) => { section = s; console.log('\n' + s); };
(async () => {
  const srv = await start(0), url = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {}), page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', (e) => errors.push('pageerror: ' + e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); }); page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errors.push(r.status() + ' ' + r.url()); }); page.on('requestfailed', (r) => errors.push('Anfrage fehlgeschlagen: ' + r.url()));
  const take = async (n) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, n + '.png'), fullPage: true }); } };

  sec('1 Start');
  await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(800);
  ok('Seite lädt ohne Fehler', errors.length === 0, errors.slice(0, 3).join(' | '));
  ok('Hilfsobjekt window.__hod vorhanden', await page.evaluate(() => !!window.__hod));
  const tabs = await page.evaluate(() => [...document.querySelectorAll('.tab[data-tab]')].map((b) => b.dataset.tab));
  ok('41 Register in der Navigation', tabs.length === 41, tabs.length);
  await take('start');

  sec('2 Alle Register öffnen');
  for (const t of tabs) {
    errors.length = 0; await page.evaluate((x) => window.__hod.show(x), t); await page.waitForTimeout(250);
    const r = await page.evaluate((x) => { const p = document.getElementById(x); return { vis: !!p && !p.hidden, len: p ? p.innerText.trim().length : 0, banner: !!document.querySelector('#diag-banner:not([hidden])'), cur: window.__hod.cur() }; }, t);
    ok('Register „' + t + '“ zeigt Inhalt', r.vis && r.len > 40 && !r.banner && errors.length === 0, JSON.stringify(r) + ' ' + errors.slice(0, 2).join(' | '));
    if (['head', 'tv', 'er', 'qg', 'lx', 'el', 'sim', 'mo', 'imp', 'exp', 'bk'].includes(t)) await take('tab-' + t);
  }

  sec('3 Summen-Kennzahlen (Quartal/Jahr summieren, nicht mitteln)');
  const sums = ['revenue_k', 'orders', 'contribution_k', 'ebit_k', 'tariff_cost_k', 'accessories_rev_k', 'manufaktur_rev_k', 'lifestyle_rev_k', 'hv_repair_rev_k', 'software_rev_k', 'charging_rev_k', 'online_parts_rev_k'];
  const has = await page.evaluate((ks) => ks.map((k) => [k, window.__hod.SUMKPI.has(k)]), sums);
  has.forEach(([k, v]) => ok('SUMKPI enthält ' + k, v));

  sec('4 Simulationen');
  const sim = await page.evaluate(() => { const S = window.__sim; return { n: S.SIMS.length, ids: S.SIMS.map((s) => s.id), sum: S.summary().map((x) => x.id) }; });
  ok('9 Simulationen definiert', sim.n === 9, sim.ids);
  ok('Booklet-Zusammenfassung enthält alle 9 Modelle (auch s5)', sim.sum.length === 9, sim.sum);
  const run = (id, over) => page.evaluate(([i, o]) => { const S = window.__sim, s = S.SIMS.find((x) => x.id === i), ps = window.dash.data('sim_params').data.filter((r) => r.sim === i), v = Object.assign(Object.fromEntries(ps.map((p) => [p.key, p.value])), o || {}); const st = { seed: S.S.seed, redo: () => 0 }; if (s.extra) s.extra(st); const r = s.run(v, st); return r && { tiles: r.tiles.map((t) => ({ l: t.l, v: t.v, cmp: t.cmp })), text: r.text, table: r.table }; }, [id, over]);
  const er = DATA('er_monthly').filter((r) => r.region === 'Alle'), refEbit = er.reduce((s, r) => s + r.ebit_k, 0);
  const s9 = await run('s9');
  ok('s9: Ausgangslage entspricht dem Betriebsergebnis im Register Ertrag (' + Math.round(refEbit) + ' k€)', s9 && near(s9.tiles[0].cmp, refEbit, 1), s9 && s9.tiles[0]);
  const s9z = await run('s9', { price_pct: 0, volume_pct: 0, otd_pp: 0, stock_pct: 0, warranty_pct: 0, fx_pct: 0 });
  ok('s9: ohne Hebel ist Planwert = Ausgangslage', s9z && near(s9z.tiles[0].v, s9z.tiles[0].cmp, 0.01), s9z && s9z.tiles[0]);
  const s3z = await run('s3', { price_pct: 0, tariff_pct: 0, fx_pct: 0 });
  ok('s3: ohne Änderung keine Veränderung (Basis-Parallelimport herausgerechnet)', s3z && s3z.tiles.slice(0, 3).every((t) => Math.abs(t.v) < 1e-6), s3z && s3z.tiles);
  const s3 = await run('s3');
  ok('s3: Kachel zählt nur neue Risiko-Regionen', s3 && /Neue Regionen/.test(s3.tiles[4].l), s3 && s3.tiles[4].l);
  const s1 = await run('s1');
  ok('s1: Umsatz im Risiko > 0, Lieferant gesetzt', s1 && s1.tiles[0].v > 0 && /Nordfilter|Fällt/.test(s1.text[0]), s1 && s1.text[0]);
  const s5 = await run('s5'); ok('s5: Netz-Simulation rechnet ohne Oberfläche (Standardwerte)', !!s5 && s5.tiles.length >= 3);
  for (const id of ['s2', 's4', 's6', 's7', 's8']) { const r = await run(id); ok(id + ': liefert Kacheln', !!r && r.tiles.length >= 3); }
  errors.length = 0; await page.evaluate(() => window.__hod.show('sim')); await page.waitForTimeout(500);
  for (const id of sim.ids) { await page.evaluate((i) => { window.__sim.S.cur = i; window.__hodDraw.sim(); }, id); await page.waitForTimeout(400); const txt = await page.evaluate(() => (document.getElementById('sim-res') || {}).innerText || ''); ok('Oberfläche ' + id + ' zeigt Ergebnis', txt.length > 60 && errors.length === 0, txt.slice(0, 80) + ' ' + errors.slice(0, 1)); if (id === 's9' || id === 's3') await take('sim-' + id); }

  sec('4b Maßnahmen aus Kennzahlen (neue Register)');
  const pb = DATA('ma_playbook'), v3keys = { tv: 'vor_pct', er: 'absorption_pct', qg: 'claims_per_1000', lx: 'classic_fill_pct', el: 'hv_repair_rev_k' };
  ok('Playbook enthält Vorschläge für alle fünf neuen Register', Object.entries(v3keys).every(([b, k]) => pb.some((r) => r.kpi_id === b + '_' + k)), pb.length);
  ok('Playbook: 72 Einträge (27 + 45 für Kennzahlen mit Ziel)', pb.length === 72, pb.length);
  const sg = await page.evaluate(() => { const d = dash.data('ma_suggest3'); if (d.status !== 'ok') return { status: d.status, err: d.error }; const kp = ['tv', 'er', 'qg', 'lx', 'el'].map((b) => dash.data('kpi_' + b).data.filter((r) => r.region === 'Alle' && r.month === '2026-09' && r.ok === false).length); return { n: d.data.filter((r) => r.region === 'Alle' && r.month === '2026-09').length, red: kp.reduce((a, b) => a + b, 0), bad: d.data.filter((r) => !r.action || !r.owner_role || !['A', 'B', 'C'].includes(r.prio)).length }; });
  ok('ma_suggest3: jede rote Kennzahl hat einen Vorschlag (' + (sg.red) + ')', sg.n === sg.red && sg.n > 0 && sg.bad === 0, JSON.stringify(sg));
  errors.length = 0; await page.evaluate(() => { dash.resetParams(); window.__hod.show('tv'); }); await page.waitForTimeout(500);
  const tvc = await page.evaluate(() => { const c = [...document.querySelectorAll('#v3x-tv .card')].find((x) => /Maßnahmenvorschläge/.test(x.innerText)); const rec = document.querySelector('#ov-tv .ovbot') ? document.querySelector('#ov-tv .ovbot').innerText : ''; return { card: !!c, rows: c ? c.querySelectorAll('tbody tr').length : 0, generic: /Ursachen im Register analysieren/.test(rec), rec: rec.slice(0, 300) }; });
  ok('Register Teileverfügbarkeit zeigt Karte „Maßnahmenvorschläge“', tvc.card && tvc.rows > 0, JSON.stringify(tvc));
  ok('Empfohlene nächste Schritte nennen Playbook-Maßnahmen statt Standardtext', !tvc.generic, tvc.rec);
  await page.evaluate(() => { const b = [...document.querySelectorAll('#v3x-tv .card button')].find((x) => x.textContent === 'Übernehmen'); b && b.click(); }); await page.waitForTimeout(400);
  const fm = await page.evaluate(() => ({ cur: window.__hod.cur(), title: document.getElementById('ma-title').value, bu: document.getElementById('ma-bu').value, owner: document.getElementById('ma-owner').value }));
  ok('„Übernehmen“ öffnet das Maßnahmen-Formular mit Vorschlag', fm.cur === 'ma' && fm.title.length > 20 && fm.bu === 'Teileverfügbarkeit' && /Leitung/.test(fm.owner), JSON.stringify(fm));
  const mt = await page.evaluate(() => { const t = document.getElementById('tb-ma-sug'); return t ? t.tBodies[0].querySelectorAll('tr').length : -1; });
  ok('Register Maßnahmen listet Vorschläge der neuen Register (' + mt + ')', mt > 0 && errors.length === 0, errors.slice(0, 2).join(' | '));
  const sugBu = await page.evaluate(() => [...new Set([...document.querySelectorAll('#tb-ma-sug tbody tr')].map((r) => r.children[0].textContent))]);
  ok('Vorschlagsliste enthält Bereiche der neuen Register', sugBu.some((b) => ['Teileverfügbarkeit', 'Ertrag und Händler', 'Qualität und Garantie', 'Luxus und Kundenerlebnis', 'Elektro, Nachhaltigkeit, Digital'].includes(b)), sugBu);
  await take('massnahmen-tv');

  sec('5 Daten');
  const abs = DATA('er_monthly').map((r) => r.absorption_pct);
  ok('Absorptionsquote: Ziel 100 % erreichbar (Werte über 99,6 %)', Math.max(...abs) >= 100, Math.max(...abs));
  ok('Absorptionsquote: kein Wert bei 99,6 % gedeckelt', !abs.some((v) => v === 99.6));
  ok('Glossar: 255 Einträge', DATA('glossary').length === 255, DATA('glossary').length);
  const mo = DATA('mo_monthly'); ok('Market Operation: 6 Regionen × 12 Monate × 38 Merkmale', mo.length === 2736, mo.length);
  const man = DATA('_manifest'); ok('Alle Datensätze in der Übersicht vorhanden', man.every((m) => fs.existsSync(path.join(__dirname, '..', 'data', m.file))), man.length);

  await browser.close(); srv.close();
  const fail = results.filter((r) => !r.ok);
  console.log('\n' + (results.length - fail.length) + ' von ' + results.length + ' Prüfungen bestanden' + (fail.length ? ', ' + fail.length + ' Fehler' : ''));
  fs.writeFileSync(path.join(__dirname, 'ergebnis.json'), JSON.stringify(results, null, 1));
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
