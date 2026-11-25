// Referenzwerte der neun Simulationen (Standardwerte): erzeugen mit `node test/baseline.js --write`, prüfen im Testlauf.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright'), { start } = require('./server');
const FILE = path.join(__dirname, 'baseline.json');
async function collect(page) {
  return page.evaluate(() => {
    const S = window.__sim, out = {};
    S.SIMS.forEach((s) => { const ps = dash.data('sim_params').data.filter((r) => r.sim === s.id), v = Object.fromEntries(ps.map((p) => [p.key, p.value])), st = { seed: S.S.seed, redo: () => 0 }; if (s.extra) s.extra(st); const r = s.run(v, st); out[s.id] = r ? r.tiles.map((t) => [t.l, Math.round(t.v * 1e6) / 1e6]) : null; });
    return out;
  });
}
module.exports = { collect, FILE };
if (require.main === module) (async () => {
  const srv = await start(0), browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {}), page = await browser.newPage();
  await page.goto('http://127.0.0.1:' + srv.address().port + '/', { waitUntil: 'load' }); await page.waitForTimeout(600);
  const res = await collect(page); await browser.close(); srv.close();
  if (process.argv.includes('--write')) { fs.writeFileSync(FILE, JSON.stringify(res, null, 1)); console.log('Referenz geschrieben:', Object.keys(res).length, 'Modelle'); } else console.log(JSON.stringify(res).slice(0, 400));
})();
