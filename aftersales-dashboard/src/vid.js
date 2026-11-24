(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const MUT = 'var(--color-fg-muted)', GRID = 'var(--cds-chart-grid)', FG = 'var(--color-fg)';
  const REG5 = ['DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'];
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const fillSel = (sel, items, v) => { if (!sel) return; const key = items.map((i) => i[0]).join('|'); if (sel.dataset.n !== key) { sel.replaceChildren(); items.forEach(([val, lab]) => { const o = document.createElement('option'); o.value = val; o.textContent = lab; sel.append(o); }); sel.dataset.n = key; } if (v != null) sel.value = v; };
  // Kennzahl: [Bezeichnung, Einheit, Nachkommastellen]
  const DEFS = {
    dl: {
      label: 'Händler', ds: ['dealer_monthly', 'dealers'], seg: true,
      m: { revenue_k: ['Umsatz', 'k€', 1], orders: ['Aufträge', '', 0], aov: ['Auftragswert', '€', 0], margin_pct: ['Marge', '%', 1], days_to_pay: ['Zahlungsdauer', 'Tage', 1], overdue_pct: ['Überfällige Forderungen', '%', 1], last_order_days: ['Tage seit letztem Auftrag', 'Tage', 0] },
      dflt: { x: 'orders', y: 'margin_pct', s: 'revenue_k' }
    },
    br: {
      label: 'Niederlassungen', ds: ['branch_monthly', 'branches'], seg: false,
      m: { revenue_k: ['Umsatz', 'k€', 0], ziel: ['Zielerfüllung Umsatz', '%', 1], orders: ['Aufträge', '', 0], otif_pct: ['OTIF', '%', 1], fill_rate_pct: ['Lieferbereitschaft', '%', 1], margin_pct: ['Marge', '%', 1], claim_rate_pct: ['Reklamationsquote', '%', 2], certified_pct: ['Zertifizierte Mitarbeitende', '%', 1], staff: ['Mitarbeitende', '', 0], dealers: ['Betreute Händler', '', 0], warehouse_m2: ['Lagerfläche', 'm²', 0] },
      dflt: { x: 'otif_pct', y: 'margin_pct', s: 'revenue_k' }
    },
    vp: {
      label: 'Jahrgänge', ds: ['vp_parc', 'ws_segments', 'vp_mileage'], seg: true, yearly: true,
      m: { age: ['Alter', 'Jahre', 0], ser: ['Baureihe', '', 0], land: ['Land', '', 0], veh: ['Bestand', 'Tsd.', 1], rev: ['Umsatz (Teile)', 'Mio. €', 2], uio: ['UIO je 1.000 Fahrzeuge', '', 1], pen: ['Penetration (Werkstattumsatz)', 'Mio. €', 1], ret: ['Retention', '%', 1] },
      xo: ['age', 'ser', 'land'], yo: ['veh', 'rev', 'uio', 'pen', 'ret'],
      dflt: { x: 'age', y: 'veh', s: 'rev' }
    }
  };
  const SPEED = { slow: 1800, normal: 1000, fast: 450 };
  const st = { ent: 'dl', x: null, y: null, s: null, c: 'region', fr: 'Alle', fc: 'Alle', fs: 'Alle', sp: 'normal', idx: 0, pin: null, playing: false };
  let timer = null, cache = {}, scene = null;
  const fmtOf = (ent, k) => { const d = DEFS[ent].m[k]; return (v) => (v == null || !isFinite(v) ? '–' : NF(d[2]).format(v) + (d[1] ? ' ' + d[1] : '')); };
  // Fahrzeugbestand nach Einzeljahr-Alter: Jahrgänge altern jedes Jahr um 1, Neufahrzeuge kommen hinzu, Altfahrzeuge scheiden aus
  const AGE_MAX = 19, bandOf = (a) => (a <= 2 ? 0 : a <= 5 ? 1 : a <= 8 ? 2 : a <= 12 ? 3 : 4);
  const modelCache = {};
  function vpModel(region) {
    if (modelCache[region]) return modelCache[region];
    const vp = rowsOf('vp_parc'), ws = rowsOf('ws_segments'), mi = rowsOf('vp_mileage'), X = window.__vpx;
    const AG = (X && X.AGES) || ['0-2 J', '3-5 J', '6-8 J', '9-12 J', '13+ J'], series = [...new Set(vp.map((r) => r.series))], years = [...new Set(vp.map((r) => r.year))].sort(), byId = new Map(), phase = {};
    vp.forEach((r) => { phase[r.year] = r.phase; });
    const inBand = [3, 3, 3, 4, 7], within = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1, 1], [1, 0.85, 0.7, 0.55, 0.4, 0.3, 0.2]];
    series.forEach((s) => {
      const rows = vp.filter((r) => r.series === s && r.region === region).sort((a, b) => a.year - b.year); if (!rows.length) return;
      const w = AG.map((a) => d3.sum(ws.filter((q) => q.month === '2026-09' && q.age === a && q.series === s), (q) => q.vehicles_k)), tw = d3.sum(w) || 1;
      let rpv = null; try { rpv = X && X.ageFc ? X.ageFc('Alle', s).rpv : null; } catch (e) { rpv = null; }
      const km = AG.map((a) => { const m = mi.find((q) => q.series === s && q.age === a); return m ? m.km_year_k : null; });
      const wsb = AG.map((a) => ws.filter((q) => q.series === s && q.age === a)), vsum = wsb.map((rs) => d3.sum(rs, (q) => q.vehicles_k)), penR = wsb.map((rs, b) => (vsum[b] ? d3.sum(rs, (q) => q.lohn_k + q.teile_k) / vsum[b] : null)), retB = wsb.map((rs, b) => (vsum[b] ? d3.sum(rs, (q) => q.retention_pct * q.vehicles_k) / vsum[b] : null));
      const r26 = (rows.find((r) => r.year === 2026) || rows[rows.length - 1]).retention_pct, retF = (y) => { const r = rows.find((q) => q.year === y); return r && r26 ? r.retention_pct / r26 : 1; };
      // Startjahr: Bestand nach Altersband verteilt, innerhalb des Bandes nach Gewichten
      let cur = []; const y0 = rows[0], wsum = []; let k = 0;
      within.forEach((ww, b) => { const ts = d3.sum(ww); ww.forEach((x) => { cur[k] = w[b] / tw * x / ts; k++; }); });
      const t1 = d3.sum(cur.slice(1)); cur = cur.map((v, i) => (i ? v / t1 * (y0.parc_k - y0.new_k) : y0.new_k));
      const emit = (y, a, ci) => { for (let ag = 0; ag <= AGE_MAX; ag++) { const v = a[ag]; if (!(v > 0.02)) continue; const id = s + '|' + (y - ag), o = { id, name: s + ' · Jg. ' + (y - ag), region: region, country: s, segment: AG[bandOf(ag)], age: ag, veh: v, rev: rpv ? v * rpv[bandOf(ag)] * 12 / 1000 : null, pen: penR[bandOf(ag)] == null ? null : v * penR[bandOf(ag)] * 12 / 1000, ret: retB[bandOf(ag)] == null ? null : Math.min(100, retB[bandOf(ag)] * retF(y)), km: km[bandOf(ag)], cohort: y - ag, ser: series.indexOf(s), sx: series.indexOf(s) + (ag - 9.5) / 20 * 0.76, year: y, mi: ci }; if (!byId.has(id)) byId.set(id, []); byId.get(id)[ci] = o; } };
      emit(y0.year, cur, years.indexOf(y0.year));
      rows.slice(1).forEach((r) => {
        const aged = cur[AGE_MAX], b = [r.new_k].concat(cur.slice(0, AGE_MAX)), loss = Math.max(0, r.scrap_k + r.accident_k - aged), wt = b.map((v, i) => v * (i + 1) ** 2), tws = d3.sum(wt) || 1;
        b.forEach((v, i) => { b[i] = Math.max(0, v - loss * wt[i] / tws); }); const f = r.parc_k / (d3.sum(b) || 1); cur = b.map((v) => v * f); emit(r.year, cur, years.indexOf(r.year));
      });
    });
    return (modelCache[region] = { byId, series, years, phase, AG });
  }
  function buildVp(landMode) {
    const vp = rowsOf('vp_parc'), ws = rowsOf('ws_segments'), mi = rowsOf('vp_mileage'), uc = rowsOf('uio_country');
    if (!vp || !ws || !mi || (landMode && !uc)) { H.ready($('ch-vid'), 'vp_parc'); H.ready(document.createElement('div'), 'ws_segments'); H.ready(document.createElement('div'), 'vp_mileage'); H.ready(document.createElement('div'), 'uio_country'); return null; }
    if (!landMode) {
      const key = 'vp|' + st.fr; if (cache[key]) return cache[key];
      const M = vpModel(st.fr), byId = M.byId, tot = {}; byId.forEach((arr) => arr.forEach((o) => { tot[o.year] = (tot[o.year] || 0) + o.veh; })); byId.forEach((arr) => arr.forEach((o) => { o.uio = tot[o.year] ? o.veh / tot[o.year] * 1000 : null; }));
      return (cache[key] = { steps: M.years, series: M.series, xnames: M.series, lab: (i) => M.years[i] + ' (' + (M.phase[M.years[i]] || '') + ')', wm: (i) => String(M.years[i]), unit: 'Jahr', byId, countries: M.series.slice().sort((a, b) => a.localeCompare(b, 'de')), bands: M.AG });
    }
    // Land: Baureihen-Modell je Region, Bestand der Länder nach UIO-Anteil innerhalb der Region
    const key = 'vpl|' + st.fr + '|' + st.fc; if (cache[key]) return cache[key];
    const regs = st.fr === 'Alle' ? REG5 : [st.fr], byId = new Map(), xnames = []; let base = null;
    regs.forEach((R) => {
      const M = vpModel(R); base = base || M; const cs = uc.filter((r) => r.region === R).sort((a, b) => a.country.localeCompare(b.country, 'de')), sumU = d3.sum(cs, (r) => r.uio_k) || 1, agg = new Map();
      M.byId.forEach((arr) => arr.forEach((o) => { if (st.fc !== 'Alle' && o.country !== st.fc) return; const k = o.year + '|' + o.age; let q = agg.get(k); if (!q) { q = { year: o.year, age: o.age, veh: 0, rev: 0, pen: 0, rn: 0, rv: 0, mi: o.mi, segment: o.segment }; agg.set(k, q); } q.veh += o.veh; q.rev += o.rev || 0; q.pen += o.pen || 0; if (o.ret != null) { q.rn += o.ret * o.veh; q.rv += o.veh; } }));
      cs.forEach((c) => { const ci = xnames.length, f = c.uio_k / sumU; xnames.push(c.country); agg.forEach((q) => { const id = c.country + '|' + (q.year - q.age), o = { id, name: c.country + ' · Jg. ' + (q.year - q.age), region: R, country: c.country, segment: q.segment, age: q.age, veh: q.veh * f, rev: q.rev * f, pen: q.pen * f, ret: q.rv ? q.rn / q.rv : null, cohort: q.year - q.age, ser: ci, sx: ci + (q.age - 9.5) / 20 * 0.76, year: q.year, mi: q.mi }; if (!byId.has(id)) byId.set(id, []); byId.get(id)[q.mi] = o; }); });
    });
    const tot = {}; byId.forEach((arr) => arr.forEach((o) => { tot[o.year] = (tot[o.year] || 0) + o.veh; })); byId.forEach((arr) => arr.forEach((o) => { o.uio = tot[o.year] ? o.veh / tot[o.year] * 1000 : null; }));
    return (cache[key] = { steps: base.years, series: base.series, xnames, pre: true, lab: (i) => base.years[i] + ' (' + (base.phase[base.years[i]] || '') + ')', wm: (i) => String(base.years[i]), unit: 'Jahr', byId, countries: base.series.slice().sort((a, b) => a.localeCompare(b, 'de')), bands: base.AG });
  }
  function build(ent) {
    if (ent === 'vp') return buildVp(st.x === 'land');
    if (cache[ent]) return cache[ent];
    const D = DEFS[ent], mon = rowsOf(D.ds[0]), mast = rowsOf(D.ds[1]);
    if (!mon || !mast) { H.ready($('ch-vid'), D.ds[0]); H.ready(document.createElement('div'), D.ds[1]); return null; }
    const M = new Map(mast.map((r) => [r.id, r])), months = [...new Set(mon.map((r) => r.month))].sort(), byId = new Map();
    mon.forEach((r) => {
      const m = M.get(r.id); if (!m) return; const o = Object.assign({}, r);
      if (ent === 'dl') { o.aov = r.orders ? r.revenue_k * 1000 / r.orders : null; o.name = m.name; o.segment = m.segment; } else { o.ziel = r.target_k ? r.revenue_k / r.target_k * 100 : null; o.staff = m.staff; o.dealers = m.dealers; o.warehouse_m2 = m.warehouse_m2; o.name = m.city + ' (' + m.country + ')'; o.segment = ''; }
      o.region = m.region; o.country = m.country; o.mi = months.indexOf(r.month);
      if (!byId.has(r.id)) byId.set(r.id, []); byId.get(r.id)[o.mi] = o;
    });
    return (cache[ent] = { steps: months, lab: (i) => H.mlabel(months[i]), wm: (i) => H.mlabel(months[i]), unit: 'Monat', byId, countries: [...new Set(mast.map((r) => r.country))].sort((a, b) => a.localeCompare(b, 'de')) });
  }
  function frames(B) {
    const ok = (o) => (st.fr === 'Alle' || o.region === st.fr) && (B.pre || st.fc === 'Alle' || o.country === st.fc) && (st.fs === 'Alle' || !DEFS[st.ent].seg || o.segment === st.fs);
    const fr = B.steps.map(() => []);
    B.byId.forEach((arr, id) => { arr.forEach((o, i) => { if (!o || !ok(o)) return; const x = st.x === 'ser' || st.x === 'land' ? o.sx : o[st.x], y = o[st.y]; if (x == null || y == null || !isFinite(x) || !isFinite(y)) return; const s = st.s === 'none' ? null : o[st.s]; fr[i].push({ o, id, name: o.name, region: o.region, country: o.country, segment: o.segment, x, y, s, c: st.c === 'none' ? 'Alle' : st.c === 'segment' ? o.segment : st.c === 'country' ? o.country : o.region }); }); });
    return fr;
  }
  const pearson = (p) => { const n = p.length; if (n < 3) return null; const mx = d3.mean(p, (d) => d.x), my = d3.mean(p, (d) => d.y); let a = 0, b = 0, c = 0; p.forEach((d) => { a += (d.x - mx) * (d.y - my); b += (d.x - mx) ** 2; c += (d.y - my) ** 2; }); return b && c ? a / Math.sqrt(b * c) : null; };
  function tile(box, items) { box.replaceChildren(...items.map(([l, v, s]) => { const t = document.createElement('div'); t.className = 'kt'; [['kl', l], ['kv', v], ['ks', s]].forEach(([cl, tx]) => { const e = document.createElement('div'); e.className = cl; e.textContent = tx; t.append(e); }); return t; })); }
  function opts(ent, kind) { const D = DEFS[ent], ks = kind && D[kind] ? D[kind] : Object.keys(D.m); return ks.map((k) => [k, D.m[k][0]]); }
  function controls(B) {
    const D = DEFS[st.ent]; if (!D.m[st.x] || !D.m[st.y] || (D.xo && !D.xo.includes(st.x)) || (D.yo && !D.yo.includes(st.y))) Object.assign(st, D.dflt);
    if (st.s !== 'none' && (!D.m[st.s] || (D.yo && !D.yo.includes(st.s)))) st.s = D.dflt.s;
    fillSel($('vid-x'), opts(st.ent, 'xo'), st.x); fillSel($('vid-y'), opts(st.ent, 'yo'), st.y); fillSel($('vid-s'), [['none', 'Gleich groß']].concat(opts(st.ent, 'yo')), st.s);
    const copts = st.ent === 'vp' ? (st.x === 'land' ? [['region', 'Region'], ['segment', 'Altersband'], ['none', 'Eine Farbe']] : [['country', 'Baureihe'], ['segment', 'Altersband'], ['none', 'Eine Farbe']]) : D.seg ? [['region', 'Region'], ['segment', 'Segment'], ['none', 'Eine Farbe']] : [['region', 'Region'], ['none', 'Eine Farbe']]; if (!copts.some((q) => q[0] === st.c)) st.c = copts[0][0];
    fillSel($('vid-c'), copts, st.c); st.c = $('vid-c').value;
    fillSel($('vid-fr'), [['Alle', 'Alle Regionen']].concat(REG5.map((r) => [r, r])), st.fr);
    const cs = st.ent === 'vp' ? B.countries : B.countries.filter((c) => { for (const arr of B.byId.values()) { const o = arr.find(Boolean); if (o && o.country === c && (st.fr === 'Alle' || o.region === st.fr)) return true; } return false; });
    if (st.fc !== 'Alle' && !cs.includes(st.fc)) st.fc = 'Alle'; $('vid-fc-l').textContent = st.ent === 'vp' ? 'Baureihe' : 'Land'; fillSel($('vid-fc'), [['Alle', st.ent === 'vp' ? 'Alle Baureihen' : 'Alle Länder']].concat(cs.map((c) => [c, c])), st.fc);
    $('vid-fs-l').textContent = st.ent === 'vp' ? 'Altersband' : 'Segment'; fillSel($('vid-fs'), st.ent === 'vp' ? [['Alle', 'Alle Altersbänder']].concat(B.bands.map((a) => [a, a])) : [['Alle', 'Alle Segmente'], ['A', 'Segment A'], ['B', 'Segment B'], ['C', 'Segment C']], st.fs); $('vid-fs').parentNode.hidden = !D.seg;
    $('vid-sp').value = st.sp;
    $('vid-ent').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.e === st.ent)));
    const sl = $('vid-sl'); sl.max = String(B.steps.length - 1); sl.value = String(st.idx); $('vid-tl').textContent = B.unit;
  }
  function status() {
    $('vid-play').setAttribute('aria-pressed', String(st.playing)); $('vid-stop').setAttribute('aria-pressed', String(!st.playing));
    $('vid-play').disabled = st.playing; $('vid-stop').disabled = !st.playing;
  }
  function draw() {
    const box = $('ch-vid'); if (!box) return; const B = build(st.ent); if (!B) return; box.classList.remove('dash-skeleton');
    controls(B); const w = box.clientWidth; if (!w) return;
    if (st.idx > B.steps.length - 1) st.idx = 0; const fr = frames(B), all = fr.flat(); const h = Math.max(360, Math.min(540, Math.round(w * 0.58)));
    box.replaceChildren(); if (!all.length) { box.textContent = 'Keine Daten für diese Filter.'; scene = null; $('vid-sum').textContent = 'Für diese Filterauswahl liegen keine Punkte vor.'; return; }
    const MG = { t: 40, r: 22, b: (st.ent === 'vp' && st.x === 'land') ? 96 : 52, l: 66 }, ext = (f) => { const e = d3.extent(all, f), p = (e[1] - e[0]) * 0.05 || 1; return [e[0] >= 0 ? Math.max(0, e[0] - p) : e[0] - p, e[1] + p]; };
    const serX = st.ent === 'vp' && (st.x === 'ser' || st.x === 'land'), nCat = serX ? B.xnames.length : 0, xs = (serX ? d3.scaleLinear([-0.6, nCat - 0.4], [MG.l, w - MG.r]) : d3.scaleLinear(ext((d) => d.x), [MG.l, w - MG.r]).nice()), ys = d3.scaleLinear(ext((d) => d.y), [h - MG.b, MG.t]).nice();
    const sv = all.map((d) => d.s).filter((v) => v != null && isFinite(v)), rs = st.s === 'none' || !sv.length ? () => 5.5 : d3.scaleSqrt([0, d3.max(sv)], [2.5, st.ent === 'vp' && st.x === 'land' ? 9 : w < 560 ? 15 : 22]);
    const cats = [...new Set(all.map((d) => d.c))].sort((a, b) => (REG5.indexOf(a) - REG5.indexOf(b)) || ((B.bands || []).indexOf(a) - (B.bands || []).indexOf(b)) || String(a).localeCompare(String(b), 'de', { numeric: true })), col = (c) => { const i = Math.max(0, cats.indexOf(c)); return cats.length > dash.colors.length ? d3.schemeTableau10[i % 10] : dash.colors[i % dash.colors.length]; };
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${h}`).attr('role', 'img').attr('aria-label', 'Animiertes Punktdiagramm im Zeitverlauf');
    const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)'), fx = serX ? (v) => B.xnames[Math.max(0, Math.min(nCat - 1, Math.round(v)))] : fmtOf(st.ent, st.x), fy = fmtOf(st.ent, st.y), fs = st.s === 'none' ? () => '' : fmtOf(st.ent, st.s), D = DEFS[st.ent];
    if (serX) B.xnames.forEach((nm, i) => { g.append('line').attr('x1', xs(i)).attr('x2', xs(i)).attr('y1', MG.t).attr('y2', h - MG.b).attr('stroke', GRID); const rot = nCat > 12, tx = g.append('text').attr('x', xs(i)).attr('y', h - MG.b + 14).attr('fill', MUT).style('font-size', w < 700 || nCat > 12 ? '10px' : '11px').text(nm.length > 13 && w < 700 ? nm.slice(0, 12) + '…' : nm); if (rot) tx.attr('text-anchor', 'end').attr('transform', `rotate(-50 ${xs(i)} ${h - MG.b + 14})`); else tx.attr('text-anchor', 'middle'); }); else xs.ticks(6).forEach((t) => { g.append('line').attr('x1', xs(t)).attr('x2', xs(t)).attr('y1', MG.t).attr('y2', h - MG.b).attr('stroke', GRID); g.append('text').attr('x', xs(t)).attr('y', h - MG.b + 16).attr('text-anchor', 'middle').attr('fill', MUT).text(NF(Math.abs(t) < 10 && t % 1 ? 1 : 0).format(t)); });
    ys.ticks(6).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', ys(t)).attr('y2', ys(t)).attr('stroke', GRID); g.append('text').attr('x', MG.l - 8).attr('y', ys(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', MUT).text(NF(Math.abs(t) < 10 && t % 1 ? 1 : 0).format(t)); });
    g.append('text').attr('x', (MG.l + w - MG.r) / 2).attr('y', h - 10).attr('text-anchor', 'middle').attr('fill', FG).text(D.m[st.x][0] + (D.m[st.x][1] ? ' (' + D.m[st.x][1] + ')' : ''));
    g.append('text').attr('transform', `translate(14 ${(MG.t + h - MG.b) / 2}) rotate(-90)`).attr('text-anchor', 'middle').attr('fill', FG).text(D.m[st.y][0] + (D.m[st.y][1] ? ' (' + D.m[st.y][1] + ')' : ''));
    const wm = g.append('text').attr('x', w - MG.r - 8).attr('y', h - MG.b - 14).attr('text-anchor', 'end').attr('fill', MUT).attr('opacity', 0.35).style('font-size', Math.round(Math.min(64, w / 9)) + 'px').style('font-weight', 600).style('pointer-events', 'none');
    let lx = MG.l; if (cats.length > 1) cats.forEach((c) => { g.append('circle').attr('cx', lx + 5).attr('cy', 16).attr('r', 5).attr('fill', col(c)); const t = g.append('text').attr('x', lx + 14).attr('y', 16).attr('dy', '0.32em').attr('fill', FG).text(c); lx += 14 + t.node().getComputedTextLength() + 16; });
    const trail = g.append('path').attr('fill', 'none').attr('stroke', FG).attr('stroke-width', 1.4).attr('stroke-dasharray', '4 3').attr('opacity', 0.7).style('pointer-events', 'none'), dots = g.append('g'), lab = g.append('text').attr('fill', FG).style('font-weight', 600).style('pointer-events', 'none');
    scene = { fr, B, xs, ys, rs, col, dots, trail, lab, wm, fx, fy, fs, D, all };
    update(false);
  }
  function update(anim) {
    if (!scene) return; const { fr, B, xs, ys, rs, col, dots, trail, lab, wm, fx, fy, fs } = scene, pts = fr[st.idx] || [], dur = anim && !reduce ? SPEED[st.sp] * 0.92 : 0, kk = (d) => d.id;
    wm.text(B.wm(st.idx));
    const sel = dots.selectAll('circle').data(pts, kk);
    sel.exit().transition().duration(dur ? dur / 2 : 0).attr('r', 0).remove();
    const en = sel.enter().append('circle').attr('cx', (d) => xs(d.x)).attr('cy', (d) => ys(d.y)).attr('r', 0).attr('fill', (d) => col(d.c)).attr('fill-opacity', 0.72).attr('stroke', (d) => col(d.c)).attr('stroke-width', 1).style('cursor', 'pointer')
      .on('mousemove', (ev, d) => H.showTip(ev, [H.line(d.name, 'tt'), H.line(st.ent === 'vp' ? 'Altersband ' + d.segment + (d.region !== 'Alle' ? ' · ' + d.region : '') : d.country + ' · ' + d.region + (d.segment ? ' · Segment ' + d.segment : '')), H.line(scene.D.m[st.x][0] + ': ' + fx(d.x)), H.line(scene.D.m[st.y][0] + ': ' + fy(d.y)), ...(st.s !== 'none' ? [H.line(scene.D.m[st.s][0] + ': ' + fs(d.s))] : []), H.line('Klicken: Spur ein/aus')])).on('mouseleave', () => H.hideTip())
      .on('click', (ev, d) => { st.pin = st.pin === d.id ? null : d.id; update(false); });
    const all = en.merge(sel); all.interrupt().transition().duration(dur).ease(d3.easeLinear).attr('cx', (d) => xs(d.x)).attr('cy', (d) => ys(d.y)).attr('r', (d) => (d.s == null ? 5.5 : rs(d.s))).attr('fill', (d) => col(d.c)).attr('stroke', (d) => (d.id === st.pin ? FG : col(d.c))).attr('stroke-width', (d) => (d.id === st.pin ? 2.4 : 1));
    // Spur und Name der markierten Einheit
    const path = []; if (st.pin) fr.forEach((f, i) => { if (i <= st.idx) { const d = f.find((q) => q.id === st.pin); if (d) path.push([xs(d.x), ys(d.y)]); } });
    trail.attr('d', path.length > 1 ? d3.line()(path) : null);
    const cur = pts.find((d) => d.id === st.pin); lab.interrupt().text(cur ? cur.name : '').transition().duration(dur).ease(d3.easeLinear).attr('x', cur ? xs(cur.x) + (cur.s == null ? 8 : rs(cur.s)) + 4 : 0).attr('y', cur ? ys(cur.y) : 0).attr('dy', '0.32em');
    $('vid-sl').value = String(st.idx); $('vid-ml').textContent = B.lab(st.idx) + ' · ' + (st.idx + 1) + ' von ' + B.steps.length;
    // Kennzahlen, Rangliste, Text
    const r = pearson(pts), mx = d3.mean(pts, (d) => d.x), my = d3.mean(pts, (d) => d.y), vp = st.ent === 'vp';
    if (vp) { const A = (f) => { const t = d3.sum(f, (d) => d.o.veh); return t ? d3.sum(f, (d) => d.o.age * d.o.veh) / t : 0; }, tot = (f) => d3.sum(f, (d) => d.o.veh), prev = st.idx ? fr[st.idx - 1] : null, nw = d3.sum(pts.filter((d) => d.o.age === 0), (d) => d.o.veh), old = d3.sum(pts.filter((d) => d.o.age >= 15), (d) => d.o.veh), T = tot(pts), pn = prev ? d3.sum(prev.filter((d) => d.o.age === 0), (d) => d.o.veh) : null;
      const ex = prev ? d3.sum(prev.filter((d) => d.o.age === AGE_MAX), (d) => d.o.veh) : null;
      tile($('vid-kpi'), [['Fahrzeuge im Bestand', N1.format(T) + ' Tsd.', pts.length + ' Jahrgänge'], ['Ø Alter (Fz.-gewichtet)', N1.format(T ? d3.sum(pts, (d) => d.o.age * d.o.veh) / T : 0) + ' Jahre', prev ? (A(pts) >= A(prev) ? '+' : '−') + N2.format(Math.abs(A(pts) - A(prev))) + ' Jahre gegenüber Vorjahr' : 'Startjahr'], ['Neufahrzeuge (Alter 0)', N1.format(nw) + ' Tsd.', pn == null ? 'Startjahr' : (nw >= pn ? '+' : '−') + N1.format(Math.abs(nw - pn)) + ' Tsd. gegenüber Vorjahr'], ['Alter 15 bis 19 Jahre', T ? N1.format(old / T * 100) + ' %' : '–', ex == null ? 'älteste Jahrgänge' : N1.format(ex) + ' Tsd. mit Alter 19 im Vorjahr scheiden aus']]); }
    else tile($('vid-kpi'), [['Punkte im Monat', N0.format(pts.length), scene.D.label], ['Ø ' + scene.D.m[st.x][0], fx(mx), 'x-Achse'], ['Ø ' + scene.D.m[st.y][0], fy(my), 'y-Achse'], ['Korrelation x und y', r == null ? '–' : N2.format(r), 'Pearson r im Monat']]);
    const tb = $('tb-vid').tBodies[0]; tb.replaceChildren(); pts.slice().sort((a, b) => b.y - a.y).slice(0, 5).forEach((d) => { const tr = document.createElement('tr'); [d.name, st.ent === 'vp' ? d.segment : d.region, fx(d.x), fy(d.y), st.s === 'none' ? '–' : fs(d.s)].forEach((t, i) => { const td = document.createElement('td'); td.textContent = t; if (i > 1) td.className = 'num'; tr.append(td); }); tb.append(tr); });
    const first = (fr[0] || []).length ? d3.mean(fr[0], (d) => d.y) : null; $('vid-th').textContent = vp ? 'Altersband' : 'Region';
    $('vid-sum').textContent = vp ? (() => { const T = d3.sum(pts, (d) => d.o.veh), A = (f) => { const t = d3.sum(f, (d) => d.o.veh); return t ? d3.sum(f, (d) => d.o.age * d.o.veh) / t : 0; }, a0 = A(fr[0] || []), a1 = A(pts); return 'Bestandsmodell ' + B.lab(st.idx) + ': ' + N1.format(T) + ' Tsd. Fahrzeuge in ' + pts.length + ' Jahrgängen, Durchschnittsalter ' + N1.format(a1) + ' Jahre' + (st.idx ? ' (' + (a1 >= a0 ? '+' : '−') + N1.format(Math.abs(a1 - a0)) + ' Jahre seit ' + B.lab(0) + ')' : '') + '. Jedes Jahr altern alle Jahrgänge um ein Jahr (Punkte wandern nach rechts), Neufahrzeuge erscheinen bei Alter 0, Verschrottung und Unfälle sowie das Erreichen von 20 Jahren lassen Fahrzeuge verschwinden; der Bestand je Jahr entspricht dem veröffentlichten Bestand. Startverteilung nach Altersband aus den Werkstattdaten, Einzeljahr-Alter ist modelliert (Testdaten, Annahme). Achsen sind über alle Jahre fest.'; })() : ((vp ? 'Bestandsmodell ' : '') + B.lab(st.idx) + ': ' + pts.length + ' ' + scene.D.label + ' mit durchschnittlich ' + fx(mx) + ' (' + scene.D.m[st.x][0] + ') und ' + fy(my) + ' (' + scene.D.m[st.y][0] + ')' + (first != null && st.idx ? '; seit ' + B.lab(0) + ' ' + (my >= first ? 'um ' : 'um −') + fy(Math.abs(my - first)).replace(/^-/, '') + ' ' + (my >= first ? 'gestiegen' : 'gesunken') : '') + (r != null ? '. Zusammenhang der beiden Achsen im Monat: r = ' + N2.format(r) + ' (Korrelation ist kein Beleg für Ursache und Wirkung).' : '.') + ' Achsen sind über alle ' + (vp ? 'Jahre' : 'Monate') + ' fest, damit Bewegung sichtbar wird.' + (vp ? ' Modell: Jahrgänge altern jedes Jahr um 1, Neufahrzeuge kommen hinzu, Verschrottung und Unfälle sowie das Erreichen von 20 Jahren lassen Fahrzeuge ausscheiden; Startverteilung nach Altersband aus den Werkstattdaten (Testdaten, Annahme).' : ''));
  }
  function stop() { if (timer) clearInterval(timer); timer = null; st.playing = false; status(); }
  function step() {
    const box = $('ch-vid'); if (!scene || !box || !box.isConnected || H.cur() !== 'vid') { stop(); return; }
    if (st.idx >= scene.B.steps.length - 1) { stop(); return; }
    st.idx++; update(true);
  }
  function play() {
    if (!scene) { draw(); if (!scene) return; }
    if (st.idx >= scene.B.steps.length - 1) { st.idx = 0; update(false); }
    if (timer) clearInterval(timer); st.playing = true; status(); timer = setInterval(step, SPEED[st.sp]); step();
  }
  const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
  const redraw = () => { stop(); draw(); };
  on('vid-ent', 'click', (e) => { const b = e.target.closest('button'); if (!b) return; st.ent = b.dataset.e; st.idx = 0; st.pin = null; st.fr = 'Alle'; st.fc = 'Alle'; st.fs = 'Alle'; Object.assign(st, DEFS[st.ent].dflt); st.c = st.ent === 'vp' ? 'country' : 'region'; redraw(); });
  [['vid-x', 'x'], ['vid-y', 'y'], ['vid-s', 's'], ['vid-c', 'c'], ['vid-fr', 'fr'], ['vid-fc', 'fc'], ['vid-fs', 'fs']].forEach(([id, k]) => on(id, 'change', () => { st[k] = $(id).value; if (k === 'fr') st.fc = 'Alle'; if (k === 'x' && st.ent === 'vp') st.c = st.x === 'ser' || st.x === 'land' ? 'segment' : 'country'; st.pin = null; redraw(); }));
  on('vid-play', 'click', play); on('vid-stop', 'click', stop);
  on('vid-reset', 'click', () => { stop(); st.idx = 0; update(false); });
  on('vid-clear', 'click', () => { st.pin = null; update(false); });
  on('vid-sp', 'change', () => { st.sp = $('vid-sp').value; if (st.playing) { clearInterval(timer); timer = setInterval(step, SPEED[st.sp]); } });
  on('vid-sl', 'input', () => { stop(); st.idx = +$('vid-sl').value; update(false); });
  window.addEventListener('resize', () => { if (H.cur() === 'vid') { const was = st.playing; stop(); draw(); if (was) play(); } });
  // Standbild (ohne Oberfläche): berechnet einen Zeitpunkt des Videos mit der gegebenen Auswahl, z. B. für das Booklet
  function snapshot(spec) {
    const keep = Object.assign({}, st);
    try {
      Object.assign(st, spec || {}); const D = DEFS[st.ent];
      if (!D.m[st.x] || !D.m[st.y] || (D.xo && !D.xo.includes(st.x)) || (D.yo && !D.yo.includes(st.y))) Object.assign(st, D.dflt);
      if (st.s !== 'none' && (!D.m[st.s] || (D.yo && !D.yo.includes(st.s)))) st.s = D.dflt.s;
      const B = build(st.ent); if (!B) return null; const fr = frames(B), all = fr.flat(); if (!all.length) return null;
      const idx = Math.max(0, Math.min(fr.length - 1, st.idx)), cats = [...new Set(all.map((d) => d.c))].sort((a, b) => (REG5.indexOf(a) - REG5.indexOf(b)) || ((B.bands || []).indexOf(a) - (B.bands || []).indexOf(b)) || String(a).localeCompare(String(b), 'de', { numeric: true }));
      const cat = st.ent === 'vp' && (st.x === 'ser' || st.x === 'land');
      return { st: Object.assign({}, st), D, B, fr, all, idx, cats, cat, xnames: cat ? B.xnames : null, label: B.lab(idx), fx: cat ? (v) => B.xnames[Math.max(0, Math.min(B.xnames.length - 1, Math.round(v)))] : fmtOf(st.ent, st.x), fy: fmtOf(st.ent, st.y), fs: st.s === 'none' ? () => '' : fmtOf(st.ent, st.s) };
    } finally { Object.keys(st).forEach((k) => { st[k] = keep[k]; }); }
  }
  window.__vid = { st, frames: () => (scene ? scene.fr : null), play, stop, DEFS, snapshot };
  window.__hodDraw.vid = () => { stop(); status(); draw(); };
})();
