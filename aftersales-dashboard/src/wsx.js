(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2), N3 = NF(3);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };
  const MUT = 'var(--color-fg-muted)', FG = 'var(--color-fg)', ACC = () => dash.colors[0], GOOD = () => dash.colors[2] || '#2b9a66', BAD = () => H.CRIT;
  const MET = { gpd: ['Werkstattumsatz je Hebebühnentag', '€', (g) => (g.lohn + g.teile) * 1000 / g.bay, (v) => N0.format(v) + ' €'], lpd: ['Lohnumsatz je Hebebühnentag', '€', (g) => g.lohn * 1000 / g.bay, (v) => N0.format(v) + ' €'], tpd: ['Teileumsatz je Hebebühnentag', '€', (g) => g.teile * 1000 / g.bay, (v) => N0.format(v) + ' €'], tl: ['Teile je Lohn-Euro', '€', (g) => g.teile / g.lohn, (v) => N2.format(v) + ' €'], opd: ['Aufträge je 10 Hebebühnentage', 'Aufträge', (g) => g.orders / g.bay * 10, (v) => N1.format(v)] };
  const st = { by: 'series', m: 'gpd' };
  function calc(by) {
    const d = rowsOf('ws_segments'); if (!d) return null; const ms = new Set(H.periodMonths()), g = new Map();
    d.forEach((r) => { if (!ms.has(r.month)) return; const k = by === 'series' ? r.series : by === 'age' ? r.age : r.segment, o = g.get(k) || { name: k, lohn: 0, teile: 0, bay: 0, orders: 0 }; o.lohn += r.lohn_k; o.teile += r.teile_k; o.bay += r.bay_days; o.orders += r.orders; g.set(k, o); });
    const rows = [...g.values()], T = rows.reduce((a, o) => ({ lohn: a.lohn + o.lohn, teile: a.teile + o.teile, bay: a.bay + o.bay, orders: a.orders + o.orders }), { lohn: 0, teile: 0, bay: 0, orders: 0 });
    rows.forEach((o) => Object.keys(MET).forEach((k) => { o[k] = MET[k][2](o); o[k + 'i'] = o[k] / MET[k][2](T) * 100; })); return { rows, T, avg: Object.fromEntries(Object.keys(MET).map((k) => [k, MET[k][2](T)])) };
  }
  function draw() {
    const box = $('ch-wsx'); if (!box || !H.ready(box, 'ws_segments')) return; $('wsx-by').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.b === st.by))); const sel = $('wsx-m'); if (sel.dataset.n !== '5') { sel.replaceChildren(); Object.keys(MET).forEach((k) => { const o = document.createElement('option'); o.value = k; o.textContent = MET[k][0]; sel.append(o); }); sel.dataset.n = '5'; } sel.value = st.m;
    const r = calc(st.by); if (!r) return; const M = MET[st.m], rows = r.rows.slice().sort((a, b) => b[st.m] - a[st.m]), c = mkSvg(box, 52 + rows.length * 26); if (!c) return; const { w, g } = c, L = 170, R = 150, x = d3.scaleLinear([0, d3.max(rows, (q) => q[st.m]) * 1.05], [L, w - R]);
    g.append('text').attr('x', 4).attr('y', 14).attr('fill', FG).style('font-weight', 600).text(M[0] + ' · Ø ' + M[3](r.avg[st.m]) + ' (Zeitraum oben)'); g.append('line').attr('x1', x(r.avg[st.m])).attr('x2', x(r.avg[st.m])).attr('y1', 24).attr('y2', 38 + rows.length * 26).attr('stroke', MUT).attr('stroke-dasharray', '5 4');
    rows.forEach((q, i) => { const y = 30 + i * 26, idx = q[st.m + 'i']; g.append('text').attr('x', L - 8).attr('y', y + 15).attr('text-anchor', 'end').attr('fill', FG).text(q.name); g.append('rect').attr('x', L).attr('y', y + 3).attr('width', Math.max(1, x(q[st.m]) - L)).attr('height', 18).attr('rx', 3).attr('fill', idx < 90 ? BAD() : idx > 110 ? GOOD() : ACC()).attr('fill-opacity', 0.85).on('mousemove', (ev) => H.showTip(ev, [H.line(q.name, 'tt'), H.line(M[0] + ': ' + M[3](q[st.m]) + ' · Index ' + N0.format(idx)), H.line('Lohn ' + N0.format(q.lohn) + ' k€ · Teile ' + N0.format(q.teile) + ' k€ · ' + N0.format(q.bay) + ' Hebebühnentage')])).on('mouseleave', () => H.hideTip()); g.append('text').attr('x', x(q[st.m]) + 6).attr('y', y + 16).attr('fill', MUT).text(M[3](q[st.m]) + ' · Idx ' + N0.format(idx)); });
    const tb = $('tb-wsx').querySelector('tbody'); tb.replaceChildren(); rows.forEach((q) => { const tr = document.createElement('tr'); [q.name, N0.format(q.gpd) + ' €', N0.format(q.lpd) + ' €', N0.format(q.tpd) + ' €', N2.format(q.tl) + ' €', N1.format(q.opd)].forEach((t, i) => { const td = document.createElement('td'); td.textContent = t; if (i) td.className = 'num'; tr.append(td); }); tb.append(tr); });
    const hi = rows[0], lo = rows[rows.length - 1]; $('wsx-sum').textContent = M[0] + ' je ' + (st.by === 'series' ? 'Baureihe' : st.by === 'age' ? 'Altersscheibe' : 'Segment') + ': höchster Wert ' + hi.name + ' (' + M[3](hi[st.m]) + '), niedrigster ' + lo.name + ' (' + M[3](lo[st.m]) + '), Faktor ' + N1.format(hi[st.m] / lo[st.m]) + '. Das Verhältnis Teile zu Lohn liegt im Schnitt bei ' + N2.format(r.avg.tl) + ' € Teile je Lohn-Euro – niedrige Werte zeigen Potenzial für Teile-Mitverkauf je Werkstattauftrag.';
  }
  const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
  on('wsx-by', 'click', (e) => { const b = e.target.closest('button'); if (b) { st.by = b.dataset.b; draw(); } }); on('wsx-m', 'change', () => { st.m = $('wsx-m').value; draw(); });
  window.__wsx = { calc, MET };
  window.__hodDraw.wsx = draw;
})();
