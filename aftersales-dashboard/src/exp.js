(function () {
  const H = window.__hod, I = window.__imp; if (!H || !I) return;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N0 = NF(0), N1 = NF(1);
  const XM = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  // Register (Tab) → Booklet-Kapitel, Kürzel mit Kurzübersicht (falls kein eigenes Kapitel) und Rohdaten-Kapitel
  const BU = ['mo', 'pm', 'pr', 'lg', 'tr', 'wa', 'cu', 'co', 'mt'];
  const MAP = {
    head: { chap: ['sum', 'head'], raw: [] }, net: { chap: ['imp'], extra: ['net'], raw: ['Europa-Netz'] }, ws: { chap: ['ws'], raw: ['Workshop'] }, mk: { extra: ['mk'], raw: ['Markt'] }, iv: { extra: ['iv'], raw: ['Bestand'] }, dl: { extra: ['dl'], raw: ['Händler'] },
    dt: { chap: ['dt', 'dtx'], raw: ['Treiberbaum'] }, mg: { chap: ['mg', 'mgx'], raw: ['Marge'] }, fc: { chap: ['fcx'], raw: ['Jahresplanung und Forecast'] }, vp: { chap: ['vp', 'vpx'], raw: ['Vehicle Parc'] }, pf: { chap: ['pf'], raw: [] }, pl: { extra: ['pl'], raw: [] },
    an: { chap: ['pa', 'pax', 'anx', 'vio', 'hmx'], raw: [] }, hy: { chap: ['hy'], raw: [] }, vid: { chap: ['vid'], raw: [] }, ah: { chap: ['ah'], raw: [] }, st: { chap: ['st'], raw: [] }, al: { extra: ['al'], raw: [] }, ma: { chap: ['ma'], raw: ['Maßnahmen'] }, ide: { chap: ['ide'], raw: ['Ideenspeicher'] },
    gl: { chap: ['gl'], raw: ['Glossar'] }, da: { extra: ['da'], raw: ['Datenanbindung'] }, dc: { chap: ['dc'], raw: [] }
  };
  BU.forEach((k) => { MAP[k] = { chap: ['bu_' + k], raw: [I.CH.find((c) => ({ mo: 'Market Operation', pm: 'Productmanagement', pr: 'Pricing', lg: 'Logistik', tr: 'Training', wa: 'Warranty', cu: 'Customer', co: 'Competitor', mt: 'Marketing' })[k] === c[0])[0]] }; });
  Object.assign(MAP, { tv: { extra: ['tv'], raw: ['Teileverfügbarkeit'] }, er: { extra: ['er'], raw: ['Ertrag und Händler'] }, qg: { extra: ['qg'], raw: ['Qualität und Garantie'] }, lx: { extra: ['lx'], raw: ['Luxus und Kundenerlebnis'] }, el: { extra: ['el'], raw: ['Elektro, Nachhaltigkeit, Digital'] }, sim: { chap: ['v3sim', 'v3scn'], raw: ['Simulationen (Annahmen)'] } });
  const S = { sel: new Set(['head']), fmt: new Set(['xlsx']), raw: true, busy: false }; let built = false;
  const msg = (t, bad) => { const e = $('exp-msg'); if (e) { e.textContent = t || ''; e.className = 'bkmsg' + (bad ? ' bad' : ''); } };
  const regs = () => [...document.querySelectorAll('#dash-root .tabs .tab')].map((b) => [b.dataset.tab, b.textContent.replace(/\s*NEU\s*$/, '').trim()]).filter(([k]) => MAP[k]);
  const slug = (s) => String(s).replace(/[^A-Za-z0-9ÄÖÜäöüß]+/g, '_').replace(/^_|_$/g, '');
  const ctx = () => { const rg = H.REGSEL(), ms = H.periodMonths(), per = ms.length > 1 ? H.mlabel(ms[0]) + ' – ' + H.mlabel(ms[ms.length - 1]) : H.mlabel(ms[0]); return { rg, per, mk: rg === 'Alle' ? 'Alle Märkte (Europa)' : rg }; };
  const FILE = () => { const c = ctx(), a = [...S.sel]; return 'Export_' + (a.length === 1 ? slug(regs().find((r) => r[0] === a[0])[1]) : a.length === regs().length ? 'Alle_Register' : a.length + '_Register') + '_' + slug(c.rg === 'Alle' ? 'Europa' : c.rg) + '_' + slug(c.per); };
  function build() {
    const p = $('exp'); if (!p || built) return; built = true;
    const c1 = el('div', 'card'), hd = el('div', 'cardhead'); hd.append(el('h3', null, 'Register exportieren')); c1.append(hd, el('p', 'note', 'Wählen Sie ein einzelnes, mehrere oder alle Register und das Format. Markt und Zeitraum richten sich nach den Filtern oben; importierte Daten fließen mit ein.'));
    const bar = el('div', 'toprow regrow'); const a = el('button', 'bkbtn', 'Alle Register'), n = el('button', 'bkbtn', 'Keine'); a.type = n.type = 'button'; a.id = 'exp-all'; n.id = 'exp-none'; bar.append(a, n); c1.append(bar);
    const g = el('div', 'expgrid'); g.id = 'exp-list'; c1.append(g);
    const f = el('div', 'toprow regrow'); f.append(el('strong', null, 'Format: ')); [['xlsx', 'Excel (.xlsx)'], ['pptx', 'PowerPoint (.pptx)'], ['pdf', 'PDF']].forEach(([k, t]) => { const l = el('label', 'bkchk'), i = el('input'); i.type = 'checkbox'; i.checked = S.fmt.has(k); i.dataset.f = k; i.addEventListener('change', () => { i.checked ? S.fmt.add(k) : S.fmt.delete(k); }); l.append(i, ' ' + t); f.append(l); });
    const lr = el('label', 'bkchk'), ir = el('input'); ir.type = 'checkbox'; ir.checked = true; ir.id = 'exp-raw'; ir.addEventListener('change', () => { S.raw = ir.checked; }); lr.append(ir, ' Excel: Rohdaten als eigene Blätter'); f.append(lr); c1.append(f);
    const go = el('div', 'toprow regrow'), b = el('button', 'bkbtn pri', 'Exportieren'); b.id = 'exp-go'; b.type = 'button'; go.append(b, el('span', 'mut small')); go.lastChild.id = 'exp-ctx'; c1.append(go); const m = el('p', 'bkmsg'); m.id = 'exp-msg'; m.setAttribute('role', 'status'); c1.append(m);
    const c2 = el('div', 'card'), h2 = el('div', 'cardhead'); h2.append(el('h3', null, 'Was die Formate enthalten')); const ul = el('ul', 'dcl');
    ['Excel: Blatt „Info“ (Markt, Zeitraum, Stand), Blatt „Kennzahlen“ (Wert, Ziel, Zielerfüllung und Trend je Kennzahl) und je Register die zugehörigen Rohdaten als eigene Blätter. Es sind Werte, keine Formeln – die formelbasierte Vorlage ist das separate Excel-Template.', 'PowerPoint und PDF: die Booklet-Kapitel der gewählten Register (Kennzahlen, Diagramme, Tabellen, Zusammenfassungen); Register ohne eigenes Kapitel erscheinen als Kennzahlen-Übersicht.', 'Mehrere Formate werden nacheinander gespeichert. Je nach Browser fragt das Speichern jedes Mal nach.', 'Alle Zahlen sind Testdaten, sofern keine eigenen Daten importiert wurden.'].forEach((t) => ul.append(el('li', null, t))); c2.append(h2, ul); p.append(c1, c2);
    a.addEventListener('click', () => { regs().forEach(([k]) => S.sel.add(k)); list(); }); n.addEventListener('click', () => { S.sel.clear(); list(); }); b.addEventListener('click', run);
  }
  function list() {
    const g = $('exp-list'); if (!g) return; g.replaceChildren();
    regs().forEach(([k, name]) => { const l = el('label', 'bkchk'), i = el('input'); i.type = 'checkbox'; i.checked = S.sel.has(k); i.dataset.k = k; i.addEventListener('change', () => { i.checked ? S.sel.add(k) : S.sel.delete(k); ctxNote(); }); l.append(i, ' ' + name); g.append(l); });
    ctxNote();
  }
  function ctxNote() { const e = $('exp-ctx'); if (!e) return; const c = ctx(); e.textContent = S.sel.size + ' Register · ' + c.mk + ' · ' + c.per + (I.active() ? ' · mit ' + I.active() + ' importierten Datensätzen' : ''); }
  const UNIT = { eur_k: 'k€', pct: '%', pct2: '%', pct0: '%', days: 'Tage', eur: '€', eur0: '€', int: 'Anzahl', score: 'Punkte', idx: 'Index', n1: '', eur_m: 'Mio. €', pts: 'Pkt.', thr: '' }, un = (u) => (u == null ? '' : UNIT[u] !== undefined ? UNIT[u] : u);
  // ---------- Kennzahlen für Excel
  function kpiRows(k, name) {
    const O = window.__ov, O2 = window.__ov2, out = []; let c = null;
    try { if (k === 'head' && window.__anx) { (window.__anx.bulletRows(H.REGSEL(), 'core') || []).forEach((o) => out.push([name, o.r.bu_label + ' · ' + o.r.label, o.r.value, un(o.r.unit), o.r.target, o.pct, o.r.delta, o.r.ok == null ? '' : o.r.ok ? 'Ziel erreicht' : 'Unter Ziel'])); return out; }
      if (O && O.NAME[k]) c = O.calc(k); else if (O2 && O2.KSPEC[k]) c = O2.kcalc(O2.KSPEC[k]);
      if (c) { c.list.forEach((r) => out.push([name, r.label, r.value, un(r.unit), r.target == null ? null : r.target, r.i == null ? null : r.i, r.delta == null || !isFinite(r.delta) ? null : r.delta, r.i == null ? '' : r.i >= 100 ? 'Ziel erreicht' : 'Unter Ziel'])); return out; }
      const o = O2 && O2.DASH[k] ? O2.DASH[k]() : null; if (o) o.tiles.forEach((t) => out.push([name, t.l, t.v, '', null, null, null, t.s || ''])); } catch (e) { /* Register ohne Kennzahlen */ }
    return out;
  }
  function buildXlsx(keys) {
    const c = ctx(), R = regs(), nm = (k) => (R.find((r) => r[0] === k) || [k, k])[1], X = window.__xlsx, sheets = [];
    sheets.push({ name: 'Info', rows: [['Aftersales Parts – Export', ''], ['Markt', c.mk], ['Zeitraum', c.per], ['Erstellt am', new Date().toLocaleString('de-DE')], ['Register', keys.map(nm).join(', ')], ['Importierte Datensätze', I.list().map((x) => x.id).join(', ') || 'keine'], ['Hinweis', 'Alle Zahlen sind Testdaten, sofern keine eigenen Daten importiert wurden. Die Datei enthält Werte; formelbasiert ist das separate Excel-Template.'], ['Spalte Wert (Kennzahlen)', 'Zahlenwert in der Einheit des Registers; Zielerfüllung in % (100 = Ziel erreicht), Δ = Veränderung ggü. Vorperiode (% oder Prozentpunkte).']] });
    const kr = [['Register', 'Kennzahl', 'Wert', 'Einheit', 'Ziel', 'Zielerfüllung %', 'Δ ggü. Vorperiode', 'Status / Hinweis']]; keys.forEach((k) => kpiRows(k, nm(k)).forEach((r) => kr.push(r))); sheets.push({ name: 'Kennzahlen', rows: kr });
    if (S.raw) { const seen = new Set(); keys.forEach((k) => { (MAP[k].raw || []).forEach((chn) => { const ch = I.CH.find((q) => q[0] === chn); if (!ch) return; ch[1].forEach((id) => { if (seen.has(id)) return; seen.add(id); const r = I.current(id); if (!r || !r.length) return; const cols = Object.keys(r[0]); sheets.push({ name: id, rows: [cols].concat(r.map((o) => cols.map((q) => o[q]))) }); }); }); }); }
    return X.writeXLSX(sheets);
  }
  async function run() {
    if (S.busy) return; const keys = regs().map((r) => r[0]).filter((k) => S.sel.has(k)); if (!keys.length) { msg('Bitte mindestens ein Register wählen.', true); return; } if (!S.fmt.size) { msg('Bitte mindestens ein Format wählen.', true); return; }
    S.busy = true; $('exp-go').disabled = true; const BK = window.__bk, save = BK && BK.saveFile; let done = [];
    try {
      for (const fmt of ['xlsx', 'pptx', 'pdf']) {
        if (!S.fmt.has(fmt)) continue; msg((fmt === 'xlsx' ? 'Excel' : fmt === 'pptx' ? 'PowerPoint' : 'PDF') + ' wird erzeugt …'); await new Promise((r) => setTimeout(r, 30));
        let bytes, mime;
        if (fmt === 'xlsx') { bytes = buildXlsx(keys); mime = XM; }
        else {
          if (!BK || !window.__bkx) throw new Error('Das Booklet-Modul ist nicht geladen.'); const chap = [], extra = []; keys.forEach((k) => { (MAP[k].chap || []).forEach((q) => { if (!chap.includes(q)) chap.push(q); }); (MAP[k].extra || []).forEach((q) => { if (!extra.includes(q)) extra.push(q); }); });
          const r = BK.exportModel(chap, extra); if (r.error) throw new Error(r.error); const m = r.model; m.title = 'Aftersales Parts – Registerexport'; m.footer = 'Aftersales Parts – Export · ' + ctx().mk + ' · ' + ctx().per; bytes = fmt === 'pdf' ? window.__bkx.toPDF(m) : window.__bkx.toPPTX(m); mime = BK.MIME[fmt];
        }
        const name = FILE() + '.' + fmt, res = save ? await save(name, new Blob([bytes], { type: mime })) : 'saved';
        if (res === 'declined') { msg('Speichern abgebrochen.'); done = null; break; } done.push(name + ' (' + N0.format(bytes.length / 1024) + ' KB)');
      }
      if (done) msg('Erzeugt: ' + done.join(', ') + '.');
    } catch (e) { msg('Export fehlgeschlagen: ' + (e && e.message ? e.message : e), true); } finally { S.busy = false; $('exp-go').disabled = false; }
  }
  window.__exp = { MAP, buildXlsx, regs, S, run };
  window.__hodDraw.exp = () => { build(); list(); };
})();
