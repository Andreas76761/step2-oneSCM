// Erzeugt das Booklet als PDF, Word und PowerPoint im Browser und schreibt die Dateien in einen Ordner (zum Ansehen und Prüfen).
// Aufruf: node test/export-check.js <Ordner> [Kapitel,...]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright'), { start } = require('./server');
(async () => {
  const out = process.argv[2] || path.join(__dirname, 'export'); fs.mkdirSync(out, { recursive: true });
  const only = process.argv[3] ? process.argv[3].split(',') : null;
  const srv = await start(0), browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {}), page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('http://127.0.0.1:' + srv.address().port + '/', { waitUntil: 'load' }); await page.waitForTimeout(900);
  // ein Szenario anlegen, damit das Kapitel gefüllt ist
  await page.evaluate(() => { window.__hod.show('sim'); window.__sim.S.cur = 's9'; window.__hodDraw.sim(); }); await page.waitForTimeout(600);
  await page.fill('#sim-sc-name', 'Basis'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  await page.evaluate(() => { const i = document.querySelector('#sim-body input[type=range]'); i.value = '5'; i.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(500);
  await page.fill('#sim-sc-name', 'Preis +5 %'); await page.click('#sim-sc-save'); await page.waitForTimeout(300);
  await page.evaluate(() => window.__hod.show('bk')); await page.waitForTimeout(500);
  for (const fmt of ['pdf', 'docx', 'pptx']) {
    const t0 = Date.now(), r = await page.evaluate(([f, ch]) => { const B = window.__bk, X = window.__bkx; const all = [...document.querySelectorAll('#bk-sec input[type=checkbox]')].length; B.S.sel = ch ? new Set(ch) : B.S.sel; const m = B.buildModel(); const bytes = f === 'pdf' ? X.toPDF(m) : f === 'docx' ? X.toDOCX(m) : X.toPPTX(m); let s = ''; const CH = 0x8000; for (let i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH)); return { b64: btoa(s), n: bytes.length, ch: m.sections.length }; }, [fmt, only]);
    fs.writeFileSync(path.join(out, 'booklet.' + fmt), Buffer.from(r.b64, 'base64')); console.log(fmt, r.n + ' Bytes', r.ch + ' Kapitel', (Date.now() - t0) + ' ms');
  }
  await browser.close(); srv.close(); if (errs.length) { console.error('Skriptfehler:', errs.slice(0, 3)); process.exit(1); }
})();
