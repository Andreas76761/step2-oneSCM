(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const fillSel = (sel, items, v) => { if (sel.dataset.n !== String(items.length) + items[0][0]) { sel.replaceChildren(); items.forEach(([val, lab]) => { const o = document.createElement('option'); o.value = val; o.textContent = lab; sel.append(o); }); sel.dataset.n = String(items.length) + items[0][0]; } sel.value = v; };
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, svg, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };
  const MUT = 'var(--color-fg-muted)', GRID = 'var(--cds-chart-grid)', ACC = () => dash.colors[0];
  const mean = (a) => d3.mean(a) || 0;
  // ---------- Kennzahlen je Altersscheibe (Beobachtung = Baureihe × Monat) ----------
  const AGES = ['0-2 J', '3-5 J', '6-8 J', '9-12 J', '13+ J'];
  const KAGE = {
    retention_pct: ['Retention', (r) => r.retention_pct, (v) => N1.format(v) + ' %'],
    rev_per_veh: ['Umsatz je Fahrzeug und Monat', (r) => (r.lohn_k + r.teile_k) / r.vehicles_k, (v) => N2.format(v) + ' €'],
    orders_per_k: ['Aufträge je 1.000 Fz.', (r) => r.orders / r.vehicles_k, (v) => N1.format(v)],
    bay_per_k: ['Boxentage je 1.000 Fz.', (r) => r.bay_days / r.vehicles_k, (v) => N1.format(v)],
    ziel_pct: ['Zielerfüllung Umsatz', (r) => (r.lohn_k + r.teile_k) / (r.lohn_target_k + r.teile_target_k) * 100, (v) => N1.format(v) + ' %']
  };
  const vs = { age: 'retention_pct', land: 'revenue_k' };
  // ---------- Dichte (Gauß-Kern, an Datenbereich beschnitten) ----------
  function kde(v, pts) {
    const n = v.length, sd = Math.sqrt(d3.sum(v, (x) => (x - mean(v)) ** 2) / Math.max(1, n - 1)), iqr = d3.quantile(v, 0.75) - d3.quantile(v, 0.25), s = Math.min(sd, iqr / 1.34) || sd || 1, bw = 0.9 * s * Math.pow(n, -0.2) || 1, lo = v[0], hi = v[n - 1];
    const out = []; for (let i = 0; i <= pts; i++) { const x = lo + (hi - lo) * i / pts; let d = 0; for (const xi of v) d += Math.exp(-0.5 * ((x - xi) / bw) ** 2); out.push([x, d / (n * bw * Math.sqrt(2 * Math.PI))]); } return { pts: out, bw };
  }
  function stat(name, arr) { const v = arr.slice().sort((a, b) => a - b); return { g: name, n: v.length, v, min: v[0], max: v[v.length - 1], q1: d3.quantile(v, 0.25), md: d3.quantile(v, 0.5), q3: d3.quantile(v, 0.75), mean: mean(v), k: kde(v, 40) }; }
  function ageCalc(k) {
    const d = rowsOf('ws_segments'); if (!d) return null; const f = KAGE[k][1], by = new Map(AGES.map((a) => [a, []])); d.forEach((r) => { if (by.has(r.age)) by.get(r.age).push(f(r)); });
    return AGES.map((a) => stat(a, by.get(a))).filter((s) => s.n > 2);
  }
  function landCalc(k, rg) {
    const dm = rowsOf('dealer_monthly'), dl = rowsOf('dealers'), B = window.__anx && window.__anx.BXK; if (!dm || !dl || !B) return null; const info = new Map(dl.map((x) => [x.id, x])), ms = new Set(H.periodMonths()), by = new Map();
    dm.forEach((r) => { if (!ms.has(r.month)) return; const i = info.get(r.id); if (!i || (rg !== 'Alle' && i.region !== rg)) return; const e = by.get(r.id) || { c: i.country, v: [] }; e.v.push(r[k]); by.set(r.id, e); });
    const gr = new Map(); by.forEach((e) => { const v = B[k][1] === 'sum' ? d3.sum(e.v) : mean(e.v); if (!gr.has(e.c)) gr.set(e.c, []); gr.get(e.c).push(v); });
    return [...gr].filter(([, v]) => v.length >= 5).map(([c, v]) => stat(c, v)).sort((a, b) => b.md - a.md);
  }
  function violin(box, st, fm, ytitle, hh) {
    const c = mkSvg(box, hh); if (!c) return; const { w, g } = c, MG = { t: 26, r: 16, b: 48, l: 64 }, all = st.flatMap((s) => [s.min, s.max]), y = d3.scaleLinear([Math.min(...all), Math.max(...all)], [hh - MG.b, MG.t]).nice(), x = d3.scaleBand(st.map((s) => s.g), [MG.l, w - MG.r]).padding(0.12), mxd = d3.max(st, (s) => d3.max(s.k.pts, (p) => p[1])) || 1, half = x.bandwidth() / 2;
    y.ticks(5).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', GRID); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', MUT).text(N0.format(t)); });
    g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 12).attr('fill', MUT).text(ytitle + ' · Breite = Dichte (je Violine normiert) · Balken = Q1 bis Q3 · Punkt = Median · Raute = Mittelwert');
    st.forEach((s, i) => { const cx = x(s.g) + half, col = dash.colors[i % Math.min(dash.colors.length, 5)], mxg = d3.max(s.k.pts, (p) => p[1]) || 1, wd = (d) => d / mxg * half * 0.92;
      const area = d3.area().x0((p) => cx - wd(p[1])).x1((p) => cx + wd(p[1])).y((p) => y(p[0])).curve(d3.curveCatmullRom);
      g.append('path').attr('d', area(s.k.pts)).attr('fill', col).attr('fill-opacity', 0.35).attr('stroke', col).attr('stroke-width', 1.4).on('mousemove', (ev) => H.showTip(ev, [H.line(s.g + ' (n = ' + s.n + ')', 'tt'), H.line('Median ' + fm(s.md) + ' · Mittel ' + fm(s.mean)), H.line('Q1 ' + fm(s.q1) + ' · Q3 ' + fm(s.q3)), H.line('Spanne ' + fm(s.min) + ' bis ' + fm(s.max))])).on('mouseleave', () => H.hideTip());
      g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', y(s.q3)).attr('y2', y(s.q1)).attr('stroke', 'var(--color-fg)').attr('stroke-width', 4).attr('stroke-linecap', 'round'); g.append('circle').attr('cx', cx).attr('cy', y(s.md)).attr('r', 3.6).attr('fill', '#fff').attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.4);
      g.append('path').attr('d', d3.symbol().type(d3.symbolDiamond).size(40)()).attr('transform', `translate(${cx + 7},${y(s.mean)})`).attr('fill', 'var(--color-fg-muted)');
      g.append('text').attr('x', cx).attr('y', hh - MG.b + 15).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(s.g.length > 10 && st.length > 8 ? s.g.slice(0, 9) + '…' : s.g); g.append('text').attr('x', cx).attr('y', hh - MG.b + 29).attr('text-anchor', 'middle').attr('fill', MUT).style('font-size', '10px').text('n = ' + s.n); });
  }
  function drawVAge() {
    const box = $('ch-an-va'); if (!H.ready(box, 'ws_segments')) return; fillSel($('an-va-k'), Object.keys(KAGE).map((k) => [k, KAGE[k][0]]), vs.age);
    const st = ageCalc(vs.age); if (!st) return; violin(box, st, KAGE[vs.age][2], KAGE[vs.age][0], 340);
    const hi = st.slice().sort((a, b) => b.md - a.md)[0], lo = st.slice().sort((a, b) => a.md - b.md)[0], sp = st.slice().sort((a, b) => (b.q3 - b.q1) / (b.md || 1) - (a.q3 - a.q1) / (a.md || 1))[0], fm = KAGE[vs.age][2];
    $('an-va-sum').textContent = KAGE[vs.age][0] + ' je Altersscheibe (alle Baureihen × alle Monate, n = ' + st[0].n + ' je Scheibe): höchster Median in ' + hi.g + ' (' + fm(hi.md) + '), niedrigster in ' + lo.g + ' (' + fm(lo.md) + '); die breiteste Streuung hat ' + sp.g + ' (Q1 bis Q3: ' + fm(sp.q1) + ' bis ' + fm(sp.q3) + '). Breite Violinen mit zwei Buckeln deuten auf unterschiedliche Baureihen-Gruppen innerhalb einer Altersscheibe hin.';
  }
  function drawVLand() {
    const box = $('ch-an-vl'); if (!H.ready(box, 'dealer_monthly')) return; const B = window.__anx && window.__anx.BXK; if (!B) return; fillSel($('an-vl-k'), Object.keys(B).map((k) => [k, B[k][0]]), vs.land);
    const rg = H.REGSEL(), st = landCalc(vs.land, rg); if (!st || !st.length) return; violin(box, st, B[vs.land][2], B[vs.land][0] + ' je Händler', 360);
    const hi = st[0], lo = st[st.length - 1]; $('an-vl-sum').textContent = B[vs.land][0] + ' je Händler und Land (' + (rg === 'Alle' ? 'alle Regionen' : rg) + ', Zeitraum oben; Länder ab 5 Händlern): höchster Median in ' + hi.g + ' (' + B[vs.land][2](hi.md) + '), niedrigster in ' + lo.g + ' (' + B[vs.land][2](lo.md) + '). ' + st.length + ' Länder dargestellt; sortiert nach Median.';
  }
  $('an-va-k').addEventListener('change', () => { vs.age = $('an-va-k').value; drawVAge(); }); $('an-vl-k').addEventListener('change', () => { vs.land = $('an-vl-k').value; drawVLand(); });
  window.__vio = { ageCalc, landCalc, KAGE, AGES };
  const prevAn = window.__hodDraw.an;
  window.__hodDraw.an = () => { if (prevAn) prevAn(); drawVAge(); drawVLand(); if (window.__hodDraw.pa) window.__hodDraw.pa(); };
})();
