(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const fillSel = (sel, items, v) => { if (sel.dataset.n !== String(items.length) + items[0][0]) { sel.replaceChildren(); items.forEach(([val, lab]) => { const o = document.createElement('option'); o.value = val; o.textContent = lab; sel.append(o); }); sel.dataset.n = String(items.length) + items[0][0]; } sel.value = v; };
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, svg, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };
  const MUT = 'var(--color-fg-muted)', REG5 = ['DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'], AGES = ['0-2 J', '3-5 J', '6-8 J', '9-12 J', '13+ J'];
  const hs = { m: 'rm', k: 'revenue_k', norm: 'abs' }, ts = { m: 'seg' };
  // ---------- Heatmap ----------
  const KRM = { revenue_k: ['Umsatz', (v) => N0.format(v) + ' k€'], orders: ['Aufträge', (v) => N0.format(v)], active_dealers: ['Aktive Händler', (v) => N0.format(v)], yoy_pct: ['YoY', (v) => N1.format(v) + ' %'], ziel: ['Zielerfüllung Umsatz', (v) => N1.format(v) + ' %'] };
  const KBA = { umsatz: ['Umsatz Lohn + Teile', 'sum', (v) => N0.format(v) + ' k€'], retention: ['Retention', 'mean', (v) => N1.format(v) + ' %'], ziel: ['Zielerfüllung Umsatz', 'ratio', (v) => N1.format(v) + ' %'], orders: ['Aufträge', 'sum', (v) => N0.format(v)] };
  function heatCalc() {
    if (hs.m === 'rm') {
      const d = rowsOf('mo_monthly'); if (!d) return null; const ms = [...new Set(d.map((r) => r.month))].sort(), cells = [];
      REG5.forEach((rg) => ms.forEach((m) => { const r = d.find((x) => x.region === rg && x.month === m && x.dim === 'Alle' && x.member === 'Alle'); if (r) cells.push({ r: rg, c: m, v: hs.k === 'ziel' ? r.revenue_k / r.target_k * 100 : r[hs.k] }); }));
      return { rows: REG5, cols: ms, cells, fm: KRM[hs.k][1], title: KRM[hs.k][0] + ' je Region und Monat', cl: (c) => H.mlabel(c) };
    }
    const d = rowsOf('ws_segments'); if (!d) return null; const ms = new Set(H.periodMonths()), ser = []; d.forEach((r) => { if (!ser.includes(r.series)) ser.push(r.series); });
    const K = KBA[hs.k] || KBA.umsatz, cells = []; ser.forEach((s) => AGES.forEach((a) => { const rs = d.filter((r) => r.series === s && r.age === a && ms.has(r.month)); if (!rs.length) return; const sum = (f) => d3.sum(rs, f); let v; if (hs.k === 'umsatz') v = sum((r) => r.lohn_k + r.teile_k); else if (hs.k === 'retention') v = d3.mean(rs, (r) => r.retention_pct); else if (hs.k === 'ziel') v = sum((r) => r.lohn_k + r.teile_k) / sum((r) => r.lohn_target_k + r.teile_target_k) * 100; else v = sum((r) => r.orders); cells.push({ r: s, c: a, v }); }));
    return { rows: ser, cols: AGES, cells, fm: K[2], title: K[0] + ' je Baureihe und Altersscheibe (Zeitraum oben)', cl: (c) => c };
  }
  function drawHeat() {
    const box = $('ch-an-hm'); if (!H.ready(box, hs.m === 'rm' ? 'mo_monthly' : 'ws_segments')) return;
    $('an-hm-m').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === hs.m))); $('an-hm-n').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.n === hs.norm)));
    const opts = hs.m === 'rm' ? Object.keys(KRM).map((k) => [k, KRM[k][0]]) : Object.keys(KBA).map((k) => [k, KBA[k][0]]); if (!opts.some((o) => o[0] === hs.k)) hs.k = opts[0][0]; fillSel($('an-hm-k'), opts, hs.k);
    const r = heatCalc(); if (!r || !r.cells.length) return; const RH = 30, LM = 130, TM = 44, c = mkSvg(box, TM + r.rows.length * RH + 16); if (!c) return; const { w, g } = c, cw = (w - LM - 10) / r.cols.length;
    const rowStat = new Map(r.rows.map((rw) => { const v = r.cells.filter((x) => x.r === rw).map((x) => x.v); return [rw, { mean: d3.mean(v), min: d3.min(v), max: d3.max(v) }]; })), all = r.cells.map((x) => x.v), gmin = d3.min(all), gmax = d3.max(all);
    const val = (x) => (hs.norm === 'row' ? x.v / rowStat.get(x.r).mean * 100 : x.v), vals = r.cells.map(val), lo = d3.min(vals), hi = d3.max(vals), col = d3.scaleSequential(d3.interpolateBlues).domain([lo - (hi - lo) * 0.15, hi]);
    g.append('text').attr('x', 4).attr('y', 14).attr('fill', 'var(--color-fg)').style('font-weight', 600).text(r.title + (hs.norm === 'row' ? ' · Index (Zeilenmittel = 100)' : ''));
    r.cols.forEach((cl, j) => g.append('text').attr('x', LM + cw * (j + 0.5)).attr('y', TM - 8).attr('text-anchor', 'middle').attr('fill', MUT).text(r.cl(cl)));
    r.rows.forEach((rw, i) => { g.append('text').attr('x', LM - 8).attr('y', TM + RH * (i + 0.5)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(rw); });
    r.cells.forEach((x) => { const i = r.rows.indexOf(x.r), j = r.cols.indexOf(x.c), vv = val(x), f = col(vv), dark = (vv - lo) / ((hi - lo) || 1) > 0.55;
      g.append('rect').attr('x', LM + cw * j + 1).attr('y', TM + RH * i + 1).attr('width', cw - 2).attr('height', RH - 2).attr('rx', 3).attr('fill', f).on('mousemove', (ev) => H.showTip(ev, [H.line(x.r + ' · ' + r.cl(x.c), 'tt'), H.line(r.fm(x.v)), H.line('Zeilenmittel ' + r.fm(rowStat.get(x.r).mean) + ' · Index ' + N0.format(x.v / rowStat.get(x.r).mean * 100), 'tt')])).on('mouseleave', () => H.hideTip());
      if (cw > 46) g.append('text').attr('x', LM + cw * (j + 0.5)).attr('y', TM + RH * (i + 0.5)).attr('dy', '0.32em').attr('text-anchor', 'middle').attr('fill', dark ? '#fff' : 'var(--color-fg)').style('font-size', '10px').style('pointer-events', 'none').text(hs.norm === 'row' ? N0.format(vv) : r.fm(x.v).replace(/ (k€|%)$/, '')); });
    const top = r.cells.slice().sort((a, b) => b.v - a.v)[0], low = r.cells.slice().sort((a, b) => a.v - b.v)[0];
    $('an-hm-sum').textContent = r.title + ': höchster Wert ' + r.fm(top.v) + ' (' + top.r + ', ' + r.cl(top.c) + '), niedrigster ' + r.fm(low.v) + ' (' + low.r + ', ' + r.cl(low.c) + '). Dunklere Felder = höhere Werte' + (hs.norm === 'row' ? '; Index macht Saison- und Strukturmuster je Zeile vergleichbar, unabhängig von der Größe.' : '; „Index je Zeile“ zeigt Muster unabhängig von der Größe.');
  }
  // ---------- Treemap ----------
  function treeData() {
    if (ts.m === 'seg') {
      const d = rowsOf('ws_segments'); if (!d) return null; const ms = new Set(H.periodMonths()), by = new Map();
      d.forEach((r) => { if (!ms.has(r.month)) return; const k = r.segment + '|' + r.series, o = by.get(k) || { seg: r.segment, name: r.series, v: 0, t: 0, lohn: 0 }; o.v += r.lohn_k + r.teile_k; o.t += r.lohn_target_k + r.teile_target_k; o.lohn += r.lohn_k; by.set(k, o); });
      const segs = d3.group([...by.values()], (o) => o.seg); return { root: { name: 'Werkstatt', children: [...segs].map(([s, a]) => ({ name: s, children: a.map((o) => ({ name: o.name, value: o.v, ziel: o.v / o.t * 100, extra: 'Lohnanteil ' + N0.format(o.lohn / o.v * 100) + ' %' })) })) }, title: 'Werkstattumsatz nach Segment und Baureihe (Zeitraum oben)', fm: (v) => N0.format(v) + ' k€' };
    }
    const d = rowsOf('mo_country'); if (!d) return null; const gr = d3.group(d, (r) => r.region);
    return { root: { name: 'Europa', children: [...gr].map(([rg, a]) => ({ name: rg, children: a.map((r) => ({ name: r.country, value: r.revenue_k, ziel: r.revenue_k / r.target_k * 100, extra: 'YoY ' + N1.format(r.yoy_pct) + ' % · ' + N0.format(r.dealers) + ' Händler' })) })) }, title: 'Umsatz nach Region und Land (12 Monate)', fm: (v) => N0.format(v) + ' k€' };
  }
  function drawTree() {
    const box = $('ch-an-tm'); if (!H.ready(box, ts.m === 'seg' ? 'ws_segments' : 'mo_country')) return; $('an-tm-m').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === ts.m)));
    const t = treeData(); if (!t) return; const Hh = 420, c = mkSvg(box, Hh); if (!c) return; const { w, g } = c;
    const root = d3.hierarchy(t.root).sum((d) => d.value || 0).sort((a, b) => b.value - a.value); d3.treemap().size([w, Hh - 26]).paddingOuter(3).paddingTop((d) => (d.depth === 1 ? 18 : 0)).paddingInner(2).round(true)(root);
    const col = d3.scaleLinear().domain([94, 100, 106]).range(['#e8a09a', '#f4f1e6', '#8cc7a1']).clamp(true), gy = g.append('g').attr('transform', 'translate(0,0)');
    root.children.forEach((s) => { gy.append('rect').attr('x', s.x0).attr('y', s.y0).attr('width', s.x1 - s.x0).attr('height', s.y1 - s.y0).attr('fill', 'none').attr('stroke', MUT).attr('stroke-opacity', 0.5); gy.append('text').attr('x', s.x0 + 5).attr('y', s.y0 + 13).attr('fill', 'var(--color-fg)').style('font-weight', 600).text(s.data.name + ' · ' + t.fm(s.value)); });
    root.leaves().forEach((l) => { const wd = l.x1 - l.x0, ht = l.y1 - l.y0;
      gy.append('rect').attr('x', l.x0).attr('y', l.y0).attr('width', wd).attr('height', ht).attr('rx', 2).attr('fill', col(l.data.ziel)).on('mousemove', (ev) => H.showTip(ev, [H.line(l.parent.data.name + ' › ' + l.data.name, 'tt'), H.line(t.fm(l.value) + ' (' + N1.format(l.value / root.value * 100) + ' % gesamt)'), H.line('Zielerfüllung ' + N1.format(l.data.ziel) + ' %', 'tt'), H.line(l.data.extra)])).on('mouseleave', () => H.hideTip());
      if (wd > 60 && ht > 30) { gy.append('text').attr('x', l.x0 + 5).attr('y', l.y0 + 14).attr('fill', '#1a1a1a').style('font-size', '11px').style('pointer-events', 'none').text(l.data.name.length * 6.2 > wd - 8 ? l.data.name.slice(0, Math.floor((wd - 8) / 6.2)) + '…' : l.data.name); gy.append('text').attr('x', l.x0 + 5).attr('y', l.y0 + 27).attr('fill', '#444').style('font-size', '10px').style('pointer-events', 'none').text(N0.format(l.data.ziel) + ' % Ziel'); } });
    [['#e8a09a', '≤ 94 % Ziel'], ['#f4f1e6', '100 %'], ['#8cc7a1', '≥ 106 %']].forEach(([f, l], i) => { g.append('rect').attr('class', 'lgd').attr('x', 4 + i * 110).attr('y', Hh - 16).attr('width', 12).attr('height', 12).attr('rx', 2).attr('fill', f).attr('stroke', MUT); g.append('text').attr('class', 'lgd').attr('x', 20 + i * 110).attr('y', Hh - 6).attr('fill', 'var(--color-fg)').text(l); });
    const lv = root.leaves(), big = lv.slice().sort((a, b) => b.value - a.value)[0], weak = lv.slice().sort((a, b) => a.data.ziel - b.data.ziel)[0], top3 = d3.sum(lv.slice().sort((a, b) => b.value - a.value).slice(0, 3), (x) => x.value) / root.value * 100;
    $('an-tm-sum').textContent = t.title + ': gesamt ' + t.fm(root.value) + '. Größtes Feld ' + big.data.name + ' (' + N0.format(big.value / root.value * 100) + ' %), die drei größten Felder tragen ' + N0.format(top3) + ' %. Größte Zielverfehlung: ' + weak.data.name + ' mit ' + N0.format(weak.data.ziel) + ' % Zielerfüllung. Fläche = Umsatz, Farbe = Zielerfüllung.';
  }
  $('an-hm-m').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { hs.m = b.dataset.m; hs.k = hs.m === 'rm' ? 'revenue_k' : 'umsatz'; drawHeat(); } });
  $('an-hm-n').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { hs.norm = b.dataset.n; drawHeat(); } }); $('an-hm-k').addEventListener('change', () => { hs.k = $('an-hm-k').value; drawHeat(); });
  $('an-tm-m').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { ts.m = b.dataset.m; drawTree(); } });
  window.__hm = { heatCalc, treeData, calc: (m, k) => { const s = Object.assign({}, hs); hs.m = m; hs.k = k; hs.norm = 'abs'; try { return heatCalc(); } finally { Object.assign(hs, s); } }, tree: (m) => { const s = ts.m; ts.m = m; try { return treeData(); } finally { ts.m = s; } } };
  const prevAn = window.__hodDraw.an; window.__hodDraw.an = () => { if (prevAn) prevAn(); drawHeat(); drawTree(); };
})();
