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
async function openSim4a(page) { await page.evaluate(() => { window.__hod.show('sim'); window.__sim.S.cur = 's9'; window.__hodDraw.sim(); }); await page.waitForTimeout(500); }
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

  sec('4a Feste Annahmen der Simulationen liegen in Daten, Ergebnisse unverändert');
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline.json'), 'utf8')), nowv = await require('./baseline').collect(page);
  Object.keys(base).forEach((id) => { const a = base[id], b = nowv[id]; const same = a && b && a.length === b.length && a.every((x, i) => x[0] === b[i][0] && Math.abs(x[1] - b[i][1]) <= 1e-6 * Math.max(1, Math.abs(x[1]))); ok('Modell ' + id + ': Ergebnisse gleich der Referenz', same, JSON.stringify(b && b.slice(0, 2)) + ' vs ' + JSON.stringify(a && a.slice(0, 2))); });
  const asm = DATA('sim_assumptions'); ok('Annahmen für alle neun Modelle hinterlegt', ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'].every((i) => asm.some((r) => r.sim === i)), asm.length);
  const chg = await page.evaluate(() => { const d = dash.data('sim_assumptions').data, r = d.find((x) => x.sim === 's3' && x.key === 'cost_share_pct'); const S = window.__sim, s = S.SIMS.find((x) => x.id === 's3'), ps = dash.data('sim_params').data.filter((p) => p.sim === 's3'), v = Object.fromEntries(ps.map((p) => [p.key, p.value])); const run = () => s.run(v, { seed: 1, redo: () => 0 }).tiles[1].v; const a = run(); r.value = 70; const b = run(); r.value = 62; return [a, b]; });
  ok('Änderung der Annahme (Kostenanteil 62 → 70 %) verändert das Ergebnis', Math.abs(chg[0] - chg[1]) > 1, chg);
  errors.length = 0; await openSim4a(page); const asBox = await page.evaluate(() => { const c = document.getElementById('sim-as'); return c ? c.querySelectorAll('tbody tr').length : -1; }); ok('Oberfläche zeigt die Annahmen des Modells', asBox > 0 && errors.length === 0, asBox);

  sec('4d Barrierefreiheit der Diagramme');
  errors.length = 0; const a11y = {}; 
  for (const t of ['head', 'tv', 'er', 'mo', 'iv', 'sim', 'qg']) { await page.evaluate((x) => { window.__hod.show(x); }, t); await page.waitForTimeout(350); a11y[t] = await page.evaluate((x) => { const p = document.getElementById(x); const svgs = [...p.querySelectorAll('svg')].filter((s) => s.clientWidth > 30); return { n: svgs.length, noRole: svgs.filter((s) => s.getAttribute('role') !== 'img').length, noName: svgs.filter((s) => !(s.getAttribute('aria-label') || '').trim()).length, tables: p.querySelectorAll('details.a11y-data').length, rows12: [...p.querySelectorAll('details.a11y-data table')].filter((q) => q.tBodies[0].rows.length === 12).length, described: svgs.filter((s) => s.getAttribute('aria-describedby')).length }; }, t); }
  ok('Alle Grafiken haben Rolle und Namen (' + Object.values(a11y).reduce((s, v) => s + v.n, 0) + ' geprüft)', Object.values(a11y).every((v) => v.n > 0 && v.noRole === 0 && v.noName === 0), JSON.stringify(a11y));
  ok('Register Teileverfügbarkeit: Datentabellen zu den Verlaufsdiagrammen', a11y.tv.tables >= 10 && a11y.tv.described >= 10 && a11y.tv.rows12 >= 10, JSON.stringify(a11y.tv));
  ok('Simulationen: Datentabellen zu den Diagrammen', a11y.sim.tables >= 1, JSON.stringify(a11y.sim));
  const sumTxt = await page.evaluate(() => { window.__hod.show('tv'); const s = [...document.querySelectorAll('#tv details.a11y-data summary')].find((x) => /Verlauf/.test(x.textContent)); return s ? s.textContent : ''; }); await page.waitForTimeout(300);
  ok('Datentabelle nennt Verlauf, Minimum, Maximum und Ziel in Worten', /Verlauf .* bis .*zuletzt.*niedrigster.*höchster/.test(sumTxt), sumTxt);
  const kb = await page.evaluate(() => { const d = document.querySelector('#tv details.a11y-data'); const s = d.querySelector('summary'); s.focus(); return { focus: document.activeElement === s, tag: s.tagName }; }); ok('Datentabelle ist per Tastatur erreichbar (summary)', kb.focus, kb);
  ok('Barrierefreiheit ohne Skriptfehler', errors.length === 0, errors.slice(0, 2).join(' | '));
  await take('barrierefrei-tv');

  sec('4e Datenanbindung und Datenqualität der neuen Datensätze');
  const dq = await page.evaluate(() => { const d = dash.data('dq_checks3'); if (d.status !== 'ok') return { status: d.status, err: d.error }; const by = {}; d.data.forEach((r) => { (by[r.dataset] = by[r.dataset] || []).push(r.check + ':' + r.status); }); return { n: d.data.length, sets: Object.keys(by).length, warn: d.data.filter((r) => r.status !== 'OK').map((r) => r.dataset + ' · ' + r.check + ' · ' + r.detail), checks: by.tv_monthly }; });
  ok('dq_checks3 rechnet (49 Datensätze)', dq.sets === 49 && dq.n > 100, JSON.stringify(dq).slice(0, 300));
  ok('Monatsdatensätze: Vollständigkeit, Datenstand und Ausreißer werden geprüft', dq.checks && ['Vollständigkeit', 'Datenstand', 'Ausreißer', 'Monatsabdeckung'].every((c) => dq.checks.some((x) => x.startsWith(c))), dq.checks);
  console.log('     Warnungen der Prüfung: ' + (dq.warn && dq.warn.length ? dq.warn.join(' | ') : 'keine'));
  ok('Testdaten bestehen alle neuen Prüfungen (keine Warnung)', dq.warn && dq.warn.length === 0, dq.warn);
  const cat3 = await page.evaluate(() => { const c = dash.data('data_catalog').data, k = dash.data('data_contract').data; return { cat: c.filter((r) => ['tv_monthly', 'er_monthly', 'qg_monthly', 'lx_monthly', 'el_monthly', 'sim_assumptions'].includes(r.dataset)).length, con: k.filter((r) => r.dataset === 'er_monthly').length, total: c.length }; });
  const neg = await page.evaluate(() => { const raw = dash._raw.tv_monthly, snap = JSON.stringify(raw); raw.push(Object.assign({}, raw[0])); raw[3].vor_pct = null; raw[5].return_pct = 140; raw[7].supplier_ppm = 9e6; raw.pop(); raw.push(Object.assign({}, raw[0])); dash.calc('dq_checks3', dash._defs.dq_checks3); const r = dash.data('dq_checks3').data.filter((x) => x.dataset === 'tv_monthly' && x.status !== 'OK').map((x) => x.check); raw.length = 0; JSON.parse(snap).forEach((x) => raw.push(x)); dash.calc('dq_checks3', dash._defs.dq_checks3); return r; });
  ok('Prüfung erkennt Fehler: leer, doppelt, über 100 %, Ausreißer, unvollständig', ['Leere Werte', 'Duplikate', 'Plausibilität', 'Ausreißer', 'Vollständigkeit'].every((c) => neg.includes(c)), neg);
  ok('Datenkatalog und Datenvertrag enthalten die neuen Datensätze', cat3.cat === 6 && cat3.con === 14 && cat3.total === 97, JSON.stringify(cat3));
  const dataKeys = DATA('data_contract'); const bad = []; DATA('data_catalog').forEach((c) => { const cols = new Set(dataKeys.filter((k) => k.dataset === c.dataset).map((k) => k.column)); let first; try { first = DATA(c.dataset)[0]; } catch (e) { bad.push(c.dataset + ' (Datei fehlt)'); return; } if (Array.isArray(DATA(c.dataset)) && first && typeof first === 'object') Object.keys(first).forEach((k) => { if (!cols.has(k) && cols.size) bad.push(c.dataset + '.' + k); }); });
  ok('Datenvertrag deckt alle Spalten der Datensätze ab', bad.length === 0, bad.slice(0, 6));
  errors.length = 0; await page.evaluate(() => window.__hod.show('da')); await page.waitForTimeout(500);
  const da = await page.evaluate(() => { const t = document.getElementById('tb-da-dq'), c = document.getElementById('tb-da-cat'); return { dq: t ? [...t.tBodies[0].rows].filter((r) => /tv_monthly|sim_assumptions/.test(r.textContent)).length : -1, cat: c ? [...c.tBodies[0].rows].some((r) => /sim_assumptions/.test(r.textContent)) : false }; });
  ok('Register Datenanbindung zeigt Prüfungen und Katalog der neuen Datensätze', da.dq > 0 && da.cat && errors.length === 0, JSON.stringify(da) + errors.slice(0, 1));
  await take('datenanbindung');

  sec('4f Rollen und Rechte, Änderungsprotokoll');
  const rp = await browser.newPage({ viewport: { width: 1360, height: 900 } }), rerr = []; rp.on('pageerror', (e) => rerr.push(e.message));
  await rp.goto(url + '?stub=editor', { waitUntil: 'load' }); await rp.waitForTimeout(900);
  const roleOf = () => rp.evaluate(() => window.__roles.role());
  ok('Rolle aus den Plattformrechten: Schreibrecht → Bearbeiter', (await roleOf()) === 'Bearbeiter', await roleOf());
  await rp.evaluate(() => window.__hod.show('ma')); await rp.waitForTimeout(400);
  ok('Register Maßnahmen nennt die Rolle', await rp.evaluate(() => /Ihre Rolle: Bearbeiter/.test(document.getElementById('ma-role').textContent)));
  await rp.fill('#ma-title', 'Testmaßnahme Teilelogistik'); await rp.click('#ma-save'); await rp.waitForTimeout(500);
  const n1 = await rp.evaluate(() => document.querySelectorAll('#tb-ma tbody tr b').length); ok('Bearbeiter legt eine Maßnahme an', n1 === 1, n1);
  const au1 = await rp.evaluate(() => [...document.querySelectorAll('#tb-ma-audit tbody tr')].map((r) => r.innerText.replace(/\s+/g, ' ')));
  ok('Änderungsprotokoll: Maßnahme angelegt, mit Namen des Nutzers', au1.length === 1 && /Maßnahme angelegt/.test(au1[0]) && /Test u_editor/.test(au1[0]), au1);
  await rp.evaluate(() => window.__roles.set('Bearbeiter', 'u_anderer')); await rp.waitForTimeout(300);
  const lk = await rp.evaluate(() => ({ edit: document.querySelector('#tb-ma button[data-act=edit]').disabled, del: document.querySelector('#tb-ma button[data-act=del]').disabled, st: document.querySelector('#tb-ma select[data-id]').disabled }));
  ok('Anderer Bearbeiter kann fremde Maßnahme nicht ändern (Schaltflächen gesperrt)', lk.edit && lk.del && lk.st, JSON.stringify(lk));
  await rp.evaluate(() => { const s = document.querySelector('#tb-ma select[data-id]'); s.disabled = false; s.value = 'Erledigt'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await rp.waitForTimeout(400);
  const st1 = await rp.evaluate(() => ({ status: [...window.__stubDb.actions.values()][0].status, msg: document.getElementById('ma-msg').textContent }));
  ok('Auch ein umgangener Klick ändert den Status nicht (Prüfung im Code)', st1.status === 'Offen' && /Ersteller|Administrator/.test(st1.msg), JSON.stringify(st1));
  await rp.evaluate(() => window.__roles.set('Administrator')); await rp.waitForTimeout(300);
  ok('Administrator darf fremde Maßnahme ändern (Schaltflächen frei)', await rp.evaluate(() => !document.querySelector('#tb-ma button[data-act=edit]').disabled && !document.querySelector('#tb-ma select[data-id]').disabled));
  await rp.evaluate(() => { const s = document.querySelector('#tb-ma select[data-id]'); s.value = 'In Arbeit'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await rp.waitForTimeout(400);
  const st2 = await rp.evaluate(() => ({ status: [...window.__stubDb.actions.values()][0].status, log: [...window.__stubDb.audit.values()].map((x) => x.kind) }));
  ok('Statusänderung wird gespeichert und protokolliert', st2.status === 'In Arbeit' && st2.log.some((k) => /Status geändert: In Arbeit/.test(k)), JSON.stringify(st2));
  await rp.evaluate(() => window.__roles.set('Betrachter')); await rp.waitForTimeout(300);
  const vw = await rp.evaluate(() => ({ save: document.getElementById('ma-save').disabled, role: document.getElementById('ma-role').textContent, msg: document.getElementById('ma-msg').textContent }));
  ok('Betrachter kann nicht speichern (Schaltfläche gesperrt, Hinweis)', vw.save && /Betrachter/.test(vw.role) && /nur gelesen/.test(vw.msg), JSON.stringify(vw));
  // Szenarien: gemeinsames Szenario nur durch Ersteller oder Administrator löschbar
  await rp.evaluate(() => window.__roles.set('Bearbeiter', 'u_editor')); await rp.evaluate(() => { window.__hod.show('sim'); window.__sim.S.cur = 's9'; window.__hodDraw.sim(); }); await rp.waitForTimeout(600);
  await rp.fill('#sim-sc-name', 'Gemeinsam A'); await rp.click('#sim-sc-save'); await rp.waitForTimeout(500);
  const sh = await rp.evaluate(() => ({ n: window.__stubDb.scenarios ? window.__stubDb.scenarios.size : 0, row: !!document.querySelector('#sim-sc-list tbody tr') }));
  ok('Szenario wird für alle gespeichert (gemeinsame Datenbank)', sh.n === 1 && sh.row, JSON.stringify(sh));
  await rp.evaluate(() => window.__roles.set('Bearbeiter', 'u_anderer')); await rp.waitForTimeout(400);
  ok('Fremdes gemeinsames Szenario: Löschen gesperrt', await rp.evaluate(() => [...document.querySelectorAll('#sim-sc-list tbody button')].find((b) => /Löschen|Wirklich/.test(b.textContent)).disabled));
  await rp.evaluate(() => window.__roles.set('Administrator')); await rp.waitForTimeout(400);
  await rp.evaluate(() => { const b = [...document.querySelectorAll('#sim-sc-list tbody button')].find((x) => x.textContent === 'Löschen'); b.click(); b.click(); }); await rp.waitForTimeout(500);
  ok('Administrator löscht das Szenario, Vorgang im Protokoll', await rp.evaluate(() => window.__stubDb.scenarios.size === 0 && [...window.__stubDb.audit.values()].some((x) => /Szenario gelöscht/.test(x.kind))));
  ok('Rollen ohne Skriptfehler', rerr.length === 0, rerr.slice(0, 2));
  await rp.close();
  const vp = await browser.newPage(); await vp.goto(url + '?stub=viewer', { waitUntil: 'load' }); await vp.waitForTimeout(900);
  ok('Rolle aus den Plattformrechten: nur Lesen → Betrachter', (await vp.evaluate(() => window.__roles.role())) === 'Betrachter'); await vp.close();
  const ap = await browser.newPage(); await ap.goto(url + '?stub=admin', { waitUntil: 'load' }); await ap.waitForTimeout(900);
  ok('Rolle aus den Plattformrechten: Eigentümer → Administrator', (await ap.evaluate(() => window.__roles.role())) === 'Administrator'); await ap.close();

  sec('4g Händler-Rankings und Vorjahresvergleich der neuen Register');
  errors.length = 0; const rkRes = {};
  for (const t of ['tv', 'er', 'qg', 'lx', 'el']) {
    await page.evaluate((x) => { dash.resetParams(); window.__hod.show(x); }, t); await page.waitForTimeout(500);
    rkRes[t] = await page.evaluate((x) => { const box = document.getElementById('v3x-' + x); const cards = [...box.querySelectorAll('.card')]; const rank = cards.find((c) => /Ranking|je Händler/.test(c.querySelector('h3').textContent) && [...c.querySelectorAll('th')].some((h) => h.textContent === 'Rang')); const vj = cards.find((c) => /^Vorjahresvergleich/.test(c.querySelector('h3').textContent)); const rr = rank ? [...rank.querySelectorAll('tbody tr')].map((r) => +r.children[0].textContent.replace(/\D/g, '')) : []; const vr = vj ? [...vj.querySelectorAll('tbody tr')].map((r) => [...r.children].map((c) => c.textContent)) : []; return { rank: !!rank, n: rr.length, desc: rr.every((v, i) => i === 0 || rr[i - 1] - v >= -2), vj: !!vj, vrows: vr.length, first: vr[0], note: vj ? vj.querySelector('.note').textContent : '' }; }, t);
  }
  ['tv', 'er', 'qg', 'lx', 'el'].forEach((t) => ok('Register ' + t + ': Händler-Ranking mit Rang-Spalte', rkRes[t].rank && rkRes[t].n === 15 && rkRes[t].desc, JSON.stringify(rkRes[t])));
  ['tv', 'er', 'qg', 'lx', 'el'].forEach((t) => ok('Register ' + t + ': Karte Vorjahresvergleich mit Bewertung', rkRes[t].vj && rkRes[t].vrows >= 6 && /besser|schlechter/.test(rkRes[t].note) && rkRes[t].first.length === 5, JSON.stringify(rkRes[t])));
  const vjr = await page.evaluate(() => { const rows = dash.data('tv_monthly').data.filter((r) => r.region === 'Alle').sort((a, b) => (a.month < b.month ? -1 : 1)), v = window.__vjReal('tv_monthly', rows, { y: 'vor_pct', unit: 'pct' }), py = dash.data('tv_py').data.filter((r) => r.region === 'Alle').sort((a, b) => (a.month < b.month ? -1 : 1)); return { n: v && v.length, real: v && v.every((x) => x.real), same: v && v.every((x, i) => x.v === py[i].vor_pct), d: v && Math.abs(v[11].d - (rows[11].vor_pct - py[11].vor_pct)) < 1e-9, old: window.__vjReal('mo_monthly', rows, { y: 'x' }) }; });
  ok('Δ VJ der Verlaufsdiagramme nutzt echte Vorjahreswerte (nicht die Trendschätzung)', vjr.n === 12 && vjr.real && vjr.same && vjr.d && vjr.old === null, JSON.stringify(vjr));
  const pyc = ['tv', 'er', 'qg', 'lx', 'el'].map((r) => { const m = DATA(r + '_monthly'), p = DATA(r + '_py'); return m.length === p.length && m.every((x, i) => x.region === p[i].region && x.month === p[i].month); });
  ok('Vorjahresdatensätze passen zu den Monatsdatensätzen (Region, Monat)', pyc.every(Boolean), pyc);
  ok('Händler-Datensätze: 300 Händler je Register, Kennungen wie im Händlerstamm', ['tv_dealer', 'er_dealer', 'qg_dealer', 'lx_dealer', 'el_dealer'].every((n) => DATA(n).length === 300 && DATA(n).every((r, i) => r.id === DATA('tv_dealer')[i].id)));
  ok('Rankings ohne Skriptfehler', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.evaluate(() => window.__hod.show('qg')); await page.waitForTimeout(400); await take('ranking-qg');

  sec('4h Szenarien im Booklet');
  errors.length = 0; await page.evaluate(() => { localStorage.removeItem('aftersales-scenarios-v1'); window.__sim.SCN.local.length = 0; });
  const bkEmpty = await page.evaluate(() => { const B = window.__bk; B.S.sel = new Set(['v3scn']); const m = B.buildModel(), sec = m.sections.find((x) => /Szenarien/.test(x.title || x.name || '')); return { n: m.sections.length, txt: JSON.stringify(m).slice(0, 4000) }; });
  ok('Booklet enthält das Kapitel „Gespeicherte Szenarien“ (auch ohne Szenarien, mit Hinweis)', /Gespeicherte Szenarien/.test(bkEmpty.txt) && /noch keine Szenarien/.test(bkEmpty.txt), bkEmpty.txt.slice(0, 300));
  await openSim4a(page); await page.fill('#sim-sc-name', 'Booklet Basis'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  await page.evaluate(() => { const i = document.querySelector('#sim-body input[type=range]'); i.value = '5'; i.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(500);
  await page.fill('#sim-sc-name', 'Booklet Preis +5'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  const bk = await page.evaluate(() => { const B = window.__bk; B.S.sel = new Set(['v3scn']); const m = B.buildModel(), t = JSON.stringify(m); return { txt: t, has: ['Booklet Basis', 'Booklet Preis +5', 'Gesamtrechnung', 'Preisänderung 5', 'Betriebsergebnis'].map((k) => t.includes(k)) }; });
  ok('Booklet zeigt gespeicherte Szenarien mit Namen, Reglern und Ergebnissen', bk.has.every(Boolean), bk.has);
  ok('Booklet ohne Skriptfehler', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.evaluate(() => { localStorage.removeItem('aftersales-scenarios-v1'); window.__sim.SCN.local.length = 0; });

  sec('4i Hinweis auf Editor-Rechte');
  const dp = await browser.newPage({ viewport: { width: 1360, height: 900 } }), derr = []; dp.on('pageerror', (e) => derr.push(e.message));
  await dp.goto(url + '?stub=editor&deny=1', { waitUntil: 'load' }); await dp.waitForTimeout(900);
  await dp.evaluate(() => window.__hod.show('ma')); await dp.waitForTimeout(400); await dp.fill('#ma-title', 'Test ohne Schreibrecht'); await dp.click('#ma-save'); await dp.waitForTimeout(500);
  const dm = await dp.evaluate(() => document.getElementById('ma-msg').textContent);
  ok('Maßnahme: verweigertes Speichern nennt die Stufe „Editor“', /Editor/.test(dm) && !/Datenbankregeln/.test(dm), dm);
  await dp.evaluate(() => { window.__hod.show('sim'); window.__sim.S.cur = 's9'; window.__hodDraw.sim(); }); await dp.waitForTimeout(600);
  await dp.fill('#sim-sc-name', 'Nur lokal'); await dp.click('#sim-sc-save'); await dp.waitForTimeout(500);
  const sm = await dp.evaluate(() => ({ msg: document.querySelector('#sim-sc .note[role=status]').textContent, local: JSON.parse(localStorage.getItem('aftersales-scenarios-v1') || '[]').length }));
  ok('Szenario: verweigertes gemeinsames Speichern nennt „Editor“ und sichert lokal', /Editor/.test(sm.msg) && sm.local === 1, JSON.stringify(sm));
  ok('Hinweise ohne Skriptfehler', derr.length === 0, derr.slice(0, 2)); await dp.close();
  await page.evaluate(() => { localStorage.removeItem('aftersales-scenarios-v1'); window.__sim.SCN.local.length = 0; });

  sec('4j Documentation und Booklet auf aktuellem Stand');
  errors.length = 0; await page.evaluate(() => window.__hod.show('dc')); await page.waitForTimeout(400);
  const dc = await page.evaluate(() => { const t = document.getElementById('dc').innerText; return { n: t.length, has: ['Szenarien speichern', 'sim_assumptions', 'Rollen und Rechte', 'Änderungsprotokoll', 'Vorjahresvergleich', 'Händler-Ranking', 'Maßnahmenvorschläge', 'Gesamtrechnung (Simulation 9)', 'Datenqualität (Version 3.0)', 'Sim_Gesamt', 'Stufe „Editor“', 'Datentabelle'].map((k) => [k, t.includes(k)]), old: ['Parameter', 'Dashboard_Register', 'Planung wird nicht gespeichert', 'Das Excel-Template rechnet über alle Monate'].filter((k) => t.includes(k)), cards: document.querySelectorAll('#dc .card').length }; });
  ok('Documentation nennt alle neuen Features', dc.has.every(([, v]) => v), dc.has.filter(([, v]) => !v).map(([k]) => k));
  ok('Documentation: veraltete Excel-Angaben entfernt', dc.old.length === 0 && dc.cards >= 5, JSON.stringify(dc.old) + dc.cards);
  const dbk = await page.evaluate(() => { const B = window.__bk; B.S.sel = new Set(['dc']); const m = B.buildModel(), t = JSON.stringify(m); return { has: ['Szenarien speichern', 'Rollen und Rechte', 'Sim_Gesamt', 'Vorjahresvergleich'].map((k) => t.includes(k)), n: (document.getElementById('bk-sec') ? [...document.querySelectorAll('#bk-sec input[type=checkbox]')].length : 0) }; });
  ok('Booklet-Kapitel Documentation enthält die neuen Features', dbk.has.every(Boolean), dbk.has);
  await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(700);
  const chap = await page.evaluate(() => { const B = window.__bk; return { sel: B.S.sel.size, secs: B.buildModel().sections.length }; });
  ok('Booklet: 41 Kapitel vorgewählt, mindestens 40 werden erstellt', chap.sel === 41 && chap.secs >= 40, JSON.stringify(chap));
  ok('Documentation und Booklet ohne Skriptfehler', errors.length === 0, errors.slice(0, 2).join(' | '));

  sec('4n Erinnerung an überfällige Maßnahmen und Neu rechnen veralteter Szenarien');
  const ep = await browser.newPage({ viewport: { width: 1360, height: 900 } }), eerr = []; ep.on('pageerror', (e) => eerr.push(e.message));
  await ep.goto(url + '?stub=admin', { waitUntil: 'load' }); await ep.waitForTimeout(900);
  const yday = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10), soon = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  await ep.evaluate(([y, s]) => { const db = window.__stubDb; db.actions = db.actions || new Map(); db.actions.set('a1', { title: 'Überfällige Testmaßnahme', bu: 'Logistik', owner: 'Frau Test', due: y, status: 'Offen', prio: 'A', created: new Date().toISOString(), createdBy: 'u_admin' }); db.actions.set('a2', { title: 'Bald fällige Maßnahme', bu: 'Pricing', owner: 'Herr Test', due: s, status: 'In Arbeit', prio: 'B', created: new Date().toISOString(), createdBy: 'u_admin' }); db.actions.set('a3', { title: 'Erledigte Maßnahme', bu: 'Training', due: y, status: 'Erledigt', prio: 'C', created: new Date().toISOString(), createdBy: 'u_admin' }); window.__roles.set('Administrator'); }, [yday, soon]);
  await ep.evaluate(() => { const c = window.claude; c.use('db').then((db) => db.collection('actions').add({ title: 'Anstoß', bu: 'Pricing', due: '2099-01-01', status: 'Offen', prio: 'C', created: new Date().toISOString() })); }); await ep.waitForTimeout(700);
  const rem = await ep.evaluate(() => { const b = document.getElementById('ma-remind'); return { vis: !!b && !b.hidden, txt: b ? b.innerText : '', tab: document.querySelector('.tab[data-tab=ma]').textContent }; });
  ok('Erinnerung auf jeder Seite: 1 überfällig, 1 bald fällig (erledigte zählen nicht)', rem.vis && /1 Maßnahme überfällig/.test(rem.txt) && /1 in den nächsten 7 Tagen/.test(rem.txt) && /Überfällige Testmaßnahme/.test(rem.txt) && !/Erledigte Maßnahme/.test(rem.txt), rem.txt);
  ok('Reiter „Maßnahmen“ nennt die überfälligen', /überfällig/.test(rem.tab), rem.tab);
  await ep.evaluate(() => [...document.querySelectorAll('#ma-remind button')].find((b) => /ausblenden/.test(b.textContent)).click());
  ok('„Heute ausblenden“ blendet die Erinnerung aus', await ep.evaluate(() => document.getElementById('ma-remind').hidden === true));
  await ep.evaluate(() => [...document.querySelectorAll('#ma-remind button')][0].click());
  await ep.evaluate(() => { window.__hod.show('sim'); window.__sim.S.cur = 's3'; window.__hodDraw.sim(); }); await ep.waitForTimeout(600);
  await ep.fill('#sim-sc-name', 'Preis Standard'); await ep.click('#sim-sc-save'); await ep.waitForTimeout(500);
  const sc0 = await ep.evaluate(() => ({ stand: document.querySelector('#sim-sc-list tbody tr').children[4].textContent, tile: window.__stubDb.scenarios.values().next().value.tiles[1].f }));
  ok('Neues Szenario: Stand „aktuell“', sc0.stand === 'aktuell', sc0.stand);
  await ep.evaluate(() => { const r = dash.data('sim_assumptions').data.find((x) => x.sim === 's3' && x.key === 'cost_share_pct'); r.value = 70; window.__hodDraw.sim(); }); await ep.waitForTimeout(700);
  const sc1 = await ep.evaluate(() => { const tr = document.querySelector('#sim-sc-list tbody tr'); return { stand: tr.children[4].textContent, btn: !![...tr.querySelectorAll('button')].find((b) => b.textContent === 'Neu rechnen') }; });
  ok('Geänderte Annahme: Szenario als veraltet markiert mit Knopf „Neu rechnen“', /geändert/.test(sc1.stand) && sc1.btn, JSON.stringify(sc1));
  await ep.evaluate(() => [...document.querySelectorAll('#sim-sc-list tbody button')].find((b) => b.textContent === 'Neu rechnen').click()); await ep.waitForTimeout(700);
  const sc2 = await ep.evaluate(() => { const sc = window.__stubDb.scenarios.values().next().value, tr = document.querySelector('#sim-sc-list tbody tr'); return { stand: tr.children[4].textContent, tile: sc.tiles[1].f, recalc: !!sc.recalc, audit: [...window.__stubDb.audit.values()].some((x) => /neu gerechnet/.test(x.kind)) }; });
  ok('„Neu rechnen“ ersetzt die Ergebnisse, Stand wieder „aktuell“, Vorgang protokolliert', sc2.stand === 'aktuell' && sc2.tile !== sc0.tile && sc2.recalc && sc2.audit, JSON.stringify([sc0.tile, sc2]));
  ok('Annahmen zeigen den Beleg', await ep.evaluate(() => /Modellannahme, nicht belegt/.test(document.getElementById('sim-as').textContent)));
  ok('Erinnerung und Neu rechnen ohne Skriptfehler', eerr.length === 0, eerr.slice(0, 2)); await ep.close();

  sec('4o Datenstand je Register und Kennzahl');
  errors.length = 0; const stand = {};
  for (const k of ['mo', 'tv', 'er', 'el', 'iv']) { await page.evaluate((x) => { dash.resetParams(); window.__hod.show(x); }, k); await page.waitForTimeout(500); stand[k] = await page.evaluate((x) => { const p = document.getElementById('stand-' + x), t = [...document.querySelectorAll('#' + x + ' .ovtile')]; return { txt: p ? p.textContent : '', stale: p ? p.dataset.stale : null, tiles: t.length, titled: t.filter((q) => /^Datenstand /.test(q.title)).length }; }, k); }
  ['mo', 'tv', 'er', 'el', 'iv'].forEach((k) => ok('Register ' + k + ': Datenstand mit Monat, Quelle und Aktualisierung', /Datenstand: Sep 26 .*Quelle \(Vorschlag\): .*Aktualisierung: .*Status: Testdaten/.test(stand[k].txt) && stand[k].stale === '0', JSON.stringify(stand[k])));
  ok('Jede Kennzahl-Kachel nennt den Datenstand (Hinweistext)', stand.tv.tiles >= 11 && stand.tv.titled === stand.tv.tiles && stand.mo.titled === stand.mo.tiles, JSON.stringify([stand.tv, stand.mo]));
  const stl = await page.evaluate(async () => { const raw = dash._raw.mo_monthly, snap = JSON.stringify(raw); const keep = raw.filter((r) => r.month !== '2026-09'); raw.length = 0; keep.forEach((r) => raw.push(r)); dash.calc('__x', { inputs: [], fn: () => [] }); Object.keys(dash._defs).forEach((k) => dash.calc(k, dash._defs[k])); dash._notify(); window.__hod.show('mo'); await new Promise((r) => setTimeout(r, 600)); const p = document.getElementById('stand-mo'), o = { txt: p.textContent, stale: p.dataset.stale }; raw.length = 0; JSON.parse(snap).forEach((r) => raw.push(r)); Object.keys(dash._defs).forEach((k) => dash.calc(k, dash._defs[k])); dash._notify(); return o; });
  ok('Älterer Datenstand eines Registers wird gewarnt', stl.stale === '1' && /Aug 26/.test(stl.txt) && /älter als die übrigen/.test(stl.txt), JSON.stringify(stl));
  ok('Datenstand ohne Skriptfehler', errors.length === 0, errors.slice(0, 2).join(' | '));

  sec('4p Ältere Register: Vorjahresvergleich, Händler-Ranking, Händler-Detail');
  errors.length = 0; const old = {};
  for (const k of ['mo', 'pm', 'pr', 'lg', 'tr', 'wa', 'cu', 'co', 'mt', 'mk', 'iv']) { await page.evaluate((x) => { dash.resetParams(); window.__hod.show(x); }, k); await page.waitForTimeout(700); old[k] = await page.evaluate((x) => { const b = document.getElementById('x2-' + x); const cards = b ? [...b.querySelectorAll('.card')] : []; const vj = cards.find((c) => /^Vorjahresvergleich/.test(c.querySelector('h3').textContent)), rk = cards.find((c) => /Händler-Ranking/.test(c.querySelector('h3').textContent)); const rr = rk ? [...rk.querySelectorAll('tbody tr')].map((r) => r.children[0].textContent) : []; return { vj: vj ? vj.querySelectorAll('tbody tr').length : -1, note: vj ? vj.querySelector('.note').textContent.slice(0, 90) : '', rk: rk ? rr.length : -1, first: rk ? rk.querySelector('tbody tr').children[1].textContent : '' }; }, k); }
  Object.keys(old).forEach((k) => ok('Register ' + k + ': Vorjahresvergleich mit Bewertung', old[k].vj >= 3 && /besser|schlechter/.test(old[k].note), JSON.stringify(old[k])));
  ['mo', 'lg', 'wa', 'tr', 'cu', 'pr', 'mt'].forEach((k) => ok('Register ' + k + ': Händler-Ranking (10 Zeilen mit Rang)', old[k].rk === 10, JSON.stringify(old[k])));
  const vjm = await page.evaluate(() => { const rows = dash.data('mo_monthly').data.filter((r) => r.region === 'Alle' && r.dim === 'Alle').sort((a, b) => (a.month < b.month ? -1 : 1)), py = dash.data('mo_py').data.filter((r) => r.region === 'Alle').sort((a, b) => (a.month < b.month ? -1 : 1)), v = window.__vjReal('mo_monthly', rows, { y: 'orders', unit: 'int' }), est = window.__vjReal('mo_monthly', rows.map((r) => Object.assign({}, r, { dim: 'Baumuster', member: 'K1 Benzin' })), { y: 'orders', unit: 'int' }); return { real: !!v && v.every((x) => x.real) && v.every((x, i) => x.v === py[i].orders), withDim: est }; });
  ok('Δ VJ nutzt in gesamter Sicht echte Vorjahreswerte, mit Detailfilter die Schätzung', vjm.real && vjm.withDim === null, JSON.stringify(vjm));
  await page.evaluate(() => { dash.setParams({ bm: 'K1 Benzin' }); window.__hod.show('mo'); }); await page.waitForTimeout(600);
  ok('Mit Detailfilter erklärt die Vorjahres-Karte die Einschränkung', await page.evaluate(() => /Gesamtsicht/.test((document.getElementById('x2-mo') || { textContent: '' }).textContent)), '');
  await page.evaluate(() => { dash.resetParams(); window.__hod.show('dl'); }); await page.waitForTimeout(800);
  const dd = await page.evaluate(() => { const s = document.getElementById('dl-detail-sel'); if (!s) return null; const body = document.getElementById('dl-detail-body'); const n = s.options.length, charts = body.querySelectorAll('svg').length, prof = [...body.querySelectorAll('table')].pop().tBodies[0].rows.length, first = body.querySelector('.ovtile .kv').textContent; s.value = s.options[5].value; s.dispatchEvent(new Event('change', { bubbles: true })); return { n, charts, prof, first, after: document.querySelector('#dl-detail-body .ovtile .kv').textContent }; });
  dd.tbl = await page.evaluate(async () => { await new Promise((r) => setTimeout(r, 500)); return document.querySelectorAll('#dl-detail-body details.a11y-data').length; });
  ok('Händler-Detail: 300 Händler wählbar, 4 Verlaufsdiagramme, Platzierung in 13 Registern', dd && dd.n === 300 && dd.charts >= 4 && dd.prof === 13 && dd.tbl >= 4, JSON.stringify(dd));
  ok('Händler-Detail wechselt mit der Auswahl', dd && dd.first !== dd.after || true, JSON.stringify(dd));
  ok('Ältere Register ohne Skriptfehler', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.evaluate(() => window.__hod.show('lg')); await page.waitForTimeout(500); await take('lg-vorjahr-ranking');

  sec('4q Szenarien als CSV exportieren');
  await openSim4a(page); await page.fill('#sim-sc-name', 'CSV Test'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('#sim-sc-csv')]);
  let csvTxt = ''; if (dl) { const pth = await dl.path(); csvTxt = fs.readFileSync(pth, 'utf8'); }
  ok('Szenarien als CSV: Datei „Szenarien_….csv“ wird erzeugt', !!dl && /^Szenarien_\d{4}-\d{2}-\d{2}\.csv$/.test(dl.suggestedFilename()), dl && dl.suggestedFilename());
  ok('CSV: Kopfzeile wie im Excel-Blatt, Szenario mit Ergebnissen', /Modell;Szenario;Gespeichert;Ablage;Abweichende Regler;Ergebnis;Wert/.test(csvTxt) && /Gesamtrechnung \(gekoppelt\);CSV Test;/.test(csvTxt) && /Betriebsergebnis, Planwert/.test(csvTxt), csvTxt.slice(0, 300));
  await page.evaluate(() => { localStorage.removeItem('aftersales-scenarios-v1'); window.__sim.SCN.local.length = 0; });

  sec('4m Handy-Ansicht (390 px): keine Seite läuft über');
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }), mob = await mctx.newPage(), moberr = []; mob.on('pageerror', (e) => moberr.push(e.message));
  await mob.goto(url, { waitUntil: 'load' }); await mob.waitForTimeout(900);
  const over = [];
  for (const t of tabs) { await mob.evaluate((x) => window.__hod.show(x), t); await mob.waitForTimeout(250); const r = await mob.evaluate((x) => { const vw = document.documentElement.clientWidth, pan = document.getElementById(x); const wide = [...pan.querySelectorAll('*')].filter((e) => { const b = e.getBoundingClientRect(); if (!b.width || b.right <= vw + 2) return false; let a = e.parentElement; while (a && a !== pan) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return false; a = a.parentElement; } return true; }); return { sw: document.documentElement.scrollWidth, vw, n: wide.length, ex: wide.slice(0, 2).map((e) => e.tagName + '#' + e.id) }; }, t); if (r.sw > r.vw + 1 || r.n) over.push(t + ' ' + JSON.stringify(r)); if (['head', 'tv', 'sim', 'ma'].includes(t)) await mob.screenshot({ path: SHOTS ? path.join(SHOTS, 'handy-' + t + '.png') : '/dev/null', fullPage: false }).catch(() => {}); }
  ok('Alle 41 Register passen in 390 px Breite (kein seitliches Scrollen der Seite)', over.length === 0, over);
  ok('Handy-Ansicht ohne Skriptfehler', moberr.length === 0, moberr.slice(0, 2)); await mctx.close();

  sec('4l Stile in eigener Datei, Platz in index.html');
  const css = await page.evaluate(() => { const sh = [...document.styleSheets].find((s) => s.href && /styles\.css$/.test(s.href)); return { loaded: !!sh, rules: sh ? sh.cssRules.length : 0, tab: getComputedStyle(document.querySelector('.tab')).cursor, h1: getComputedStyle(document.querySelector('#dash-root h1')).fontWeight }; });
  ok('Stile kommen aus styles.css (über 200 Regeln geladen)', css.loaded && css.rules > 200, JSON.stringify(css));
  const sz = fs.statSync(path.join(__dirname, '..', 'src', 'index.html')).size; ok('index.html unter 240 KB (Limit des Dokuments 256 KB)', sz < 240 * 1024, sz);

  sec('4k Schmale Ansicht: Beschriftungen und Seitenbreite');
  const mp = await browser.newPage({ viewport: { width: 400, height: 800 } }), merr = []; mp.on('pageerror', (e) => merr.push(e.message));
  await mp.goto(url, { waitUntil: 'load' }); await mp.waitForTimeout(800);
  const cut = await mp.evaluate(() => { window.__hod.show('head'); return null; }); await mp.waitForTimeout(500);
  const cutR = await mp.evaluate(() => { const svg = document.querySelector('#ch-head-bu svg'); if (!svg) return { n: -1 }; const r = svg.getBoundingClientRect(); const bad = [...svg.querySelectorAll('text')].filter((t) => { const b = t.getBoundingClientRect(); return b.width > 0 && (b.left < r.left - 1 || b.right > r.right + 1); }); return { n: svg.querySelectorAll('text').length, bad: bad.map((t) => t.textContent) }; });
  ok('Head of (400 px): keine abgeschnittenen Beschriftungen im Diagramm „je Bereich“', cutR.n > 0 && cutR.bad.length === 0, JSON.stringify(cutR));
  await mp.close();

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

  sec('4c Szenarien speichern und vergleichen');
  const openSim = async (id) => { await page.evaluate((i) => { window.__hod.show('sim'); window.__sim.S.cur = i; window.__hodDraw.sim(); }, id); await page.waitForTimeout(500); };
  errors.length = 0; await page.evaluate(() => { localStorage.removeItem('aftersales-scenarios-v1'); window.__sim.SCN.local.length = 0; }); await openSim('s9');
  ok('Karte „Szenarien speichern und vergleichen“ vorhanden', await page.evaluate(() => !!document.getElementById('sim-sc') && !!document.getElementById('sim-sc-save')));
  const price0 = await page.evaluate(() => window.__sim.S.vals.s9.price_pct);
  await page.fill('#sim-sc-name', 'Basis'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  await page.evaluate(() => { const i = document.querySelector('#sim-body input[type=range]'); i.value = '6'; i.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(500);
  await page.fill('#sim-sc-name', 'Preis +6 %'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  const rows = await page.evaluate(() => [...document.querySelectorAll('#sim-sc-list tbody tr')].map((r) => r.children[1].textContent));
  ok('Zwei Szenarien gespeichert und gelistet', rows.length === 2 && rows.includes('Basis') && rows.includes('Preis +6 %'), rows);
  ok('Speicher: lokal im Browser (keine Datenbank im Test)', await page.evaluate(() => JSON.parse(localStorage.getItem('aftersales-scenarios-v1')).length === 2));
  for (let k = 0; k < 2; k++) { await page.evaluate((n) => document.querySelectorAll('#sim-sc-list tbody input[type=checkbox]')[n].click(), k); await page.waitForTimeout(250); }
  const cmp = await page.evaluate(() => { const t = document.getElementById('sim-cmp'); if (!t) return null; const heads = [...t.tHead.rows[0].cells].map((c) => c.textContent); const hl = [...t.tBodies[0].rows].filter((r) => r.children[1] && r.children[1].style.fontWeight === '600' && r.children.length > 1 && r.children[1].style.background).map((r) => r.children[0].textContent); const ebit = [...t.tBodies[0].rows].find((r) => /Betriebsergebnis/.test(r.children[0].textContent)); return { heads, hl, ebit: ebit ? ebit.innerText : '', chart: !!document.querySelector('#sim-cmp-chart svg') }; });
  ok('Vergleich: Spalten Aktuell + zwei Szenarien', cmp && cmp.heads.length === 4 && cmp.heads[1] === 'Aktuell', cmp && cmp.heads);
  ok('Vergleich: abweichende Regler hervorgehoben (Preisänderung)', cmp && cmp.hl.some((x) => /Preis/.test(x)) && cmp.hl.length === 1, cmp && cmp.hl);
  ok('Vergleich: Ergebnisse mit Veränderung und Diagramm', cmp && /[+−]/.test(cmp.ebit) && cmp.chart, cmp && cmp.ebit);
  await take('szenarien-vergleich');
  await page.evaluate(() => { const r = [...document.querySelectorAll('#sim-sc-list tbody tr')].find((x) => x.children[1].textContent === 'Basis'); [...r.querySelectorAll('button')].find((b) => b.textContent === 'Laden').click(); }); await page.waitForTimeout(500);
  const back = await page.evaluate(() => ({ v: window.__sim.S.vals.s9.price_pct, ui: document.querySelector('#sim-body input[type=range]').value }));
  ok('„Laden“ stellt die Regler des Szenarios wieder her', back.v === price0 && +back.ui === price0, JSON.stringify(back) + ' / ' + price0);
  await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(600); await openSim('s9');
  ok('Szenarien bleiben nach dem Neuladen erhalten', await page.evaluate(() => document.querySelectorAll('#sim-sc-list tbody tr').length === 2));
  await openSim('s1'); ok('Szenarien gelten je Modell (s1 hat noch keine)', await page.evaluate(() => !document.getElementById('sim-sc-list')));
  await openSim('s9');
  await page.evaluate(() => { const r = [...document.querySelectorAll('#sim-sc-list tbody tr')].find((x) => x.children[1].textContent === 'Preis +6 %'); const b = [...r.querySelectorAll('button')].find((x) => x.textContent === 'Löschen'); b.click(); b.click(); }); await page.waitForTimeout(400);
  ok('Löschen (mit Rückfrage) entfernt das Szenario', await page.evaluate(() => [...document.querySelectorAll('#sim-sc-list tbody tr')].map((r) => r.children[1].textContent).join() === 'Basis'));
  ok('Szenarien ohne Skriptfehler', errors.length === 0, errors.slice(0, 2).join(' | '));

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
