(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };
  const MUT = 'var(--color-fg-muted)', FG = 'var(--color-fg)', ACC = () => dash.colors[0], GOOD = () => dash.colors[2] || '#2b9a66', BAD = () => H.CRIT;
  const MET = { rm2: ['Umsatz je m² Lagerfläche und Monat', '€', (g) => g.rev * 1000 / g.m2 / g.n, (v) => N1.format(v) + ' €'], rps: ['Umsatz je Mitarbeiter und Monat', 'k€', (g) => g.rev / g.staff / g.n, (v) => N1.format(v) + ' k€'], ops: ['Aufträge je Mitarbeiter und Monat', 'Aufträge', (g) => g.orders / g.staff / g.n, (v) => N1.format(v)], m2d: ['Lagerfläche je Händler', 'm²', (g) => g.m2 / g.dealers, (v) => N1.format(v) + ' m²'], dps: ['Händler je Mitarbeiter', 'Anzahl', (g) => g.dealers / g.staff, (v) => N2.format(v)] };
  const st = { lv: 'country', m: 'rm2' };
  function calc(lv, rg, cs) {
    const br = rowsOf('branches'), bm = rowsOf('branch_monthly'); if (!br || !bm) return null; const ms = new Set(H.periodMonths()), info = new Map(br.map((b) => [b.id, b])), g = new Map();
    br.forEach((b) => { if ((rg !== 'Alle' && b.region !== rg) || (cs && b.country !== cs)) return; const k = lv === 'country' ? b.country : lv === 'region' ? b.region : b.city + ' (' + b.country + ')', o = g.get(k) || { name: k, rev: 0, orders: 0, m2: 0, staff: 0, dealers: 0, n: 0, sites: 0 }; o.m2 += b.warehouse_m2; o.staff += b.staff; o.dealers += b.dealers; o.sites += 1; g.set(k, o); });
    bm.forEach((r) => { if (!ms.has(r.month)) return; const b = info.get(r.id); if (!b || (rg !== 'Alle' && b.region !== rg) || (cs && b.country !== cs)) return; const k = lv === 'country' ? b.country : lv === 'region' ? b.region : b.city + ' (' + b.country + ')', o = g.get(k); if (o) { o.rev += r.revenue_k; o.orders += r.orders; } });
    const n = ms.size; let rows = [...g.values()].filter((o) => o.rev > 0); rows.forEach((o) => { o.n = n; }); const T = rows.reduce((a, o) => ({ rev: a.rev + o.rev, orders: a.orders + o.orders, m2: a.m2 + o.m2, staff: a.staff + o.staff, dealers: a.dealers + o.dealers, n }), { rev: 0, orders: 0, m2: 0, staff: 0, dealers: 0, n });
    rows.forEach((o) => Object.keys(MET).forEach((k) => { o[k] = MET[k][2](o); o[k + 'i'] = o[k] / MET[k][2](T) * 100; })); return { rows, T, avg: Object.fromEntries(Object.keys(MET).map((k) => [k, MET[k][2](T)])) };
  }
  function draw() {
    const box = $('ch-netx'); if (!box || !H.ready(box, 'branches')) return; $('netx-lv').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === st.lv))); const sel = $('netx-m'); if (sel.dataset.n !== '5') { sel.replaceChildren(); Object.keys(MET).forEach((k) => { const o = document.createElement('option'); o.value = k; o.textContent = MET[k][0]; sel.append(o); }); sel.dataset.n = '5'; } sel.value = st.m;
    const rg = H.REGSEL(), cs = dash.params().country || '', r = calc(st.lv, rg, cs); if (!r || !r.rows.length) { box.replaceChildren(); return; } const M = MET[st.m]; let rows = r.rows.slice().sort((a, b) => b[st.m] - a[st.m]); const all = rows; if (st.lv === 'site' && rows.length > 20) rows = rows.slice(0, 10).concat(rows.slice(-10));
    const c = mkSvg(box, 52 + rows.length * 24); if (!c) return; const { w, g } = c, L = 200, R = 150, x = d3.scaleLinear([0, d3.max(rows, (q) => q[st.m]) * 1.05], [L, w - R]);
    g.append('text').attr('x', 4).attr('y', 14).attr('fill', FG).style('font-weight', 600).text(M[0] + ' · Ø ' + M[3](r.avg[st.m]) + (st.lv === 'site' && all.length > 20 ? ' · obere und untere 10 von ' + all.length + ' Standorten' : ''));
    g.append('line').attr('x1', x(r.avg[st.m])).attr('x2', x(r.avg[st.m])).attr('y1', 24).attr('y2', 38 + rows.length * 24).attr('stroke', MUT).attr('stroke-dasharray', '5 4');
    rows.forEach((q, i) => { const y = 30 + i * 24, idx = q[st.m + 'i']; g.append('text').attr('x', L - 8).attr('y', y + 14).attr('text-anchor', 'end').attr('fill', FG).text(q.name.length > 28 ? q.name.slice(0, 27) + '…' : q.name); g.append('rect').attr('x', L).attr('y', y + 2).attr('width', Math.max(1, x(q[st.m]) - L)).attr('height', 17).attr('rx', 3).attr('fill', st.m === 'm2d' ? ACC() : idx < 90 ? BAD() : idx > 110 ? GOOD() : ACC()).attr('fill-opacity', 0.85).on('mousemove', (ev) => H.showTip(ev, [H.line(q.name, 'tt'), H.line(M[0] + ': ' + M[3](q[st.m]) + ' · Index ' + N0.format(idx)), H.line(q.sites + ' Standort(e) · ' + N0.format(q.staff) + ' Mitarbeiter · ' + N0.format(q.m2) + ' m²')])).on('mouseleave', () => H.hideTip()); g.append('text').attr('x', x(q[st.m]) + 6).attr('y', y + 15).attr('fill', MUT).text(M[3](q[st.m]) + ' · Idx ' + N0.format(idx)); });
    const tb = $('tb-netx').querySelector('tbody'); tb.replaceChildren(); all.slice(0, 12).forEach((q) => { const tr = document.createElement('tr'); [q.name, String(q.sites), N0.format(q.staff), N0.format(q.m2) + ' m²', N1.format(q.rm2) + ' €', N1.format(q.rps) + ' k€', N1.format(q.m2d) + ' m²'].forEach((t, i) => { const td = document.createElement('td'); td.textContent = t; if (i) td.className = 'num'; tr.append(td); }); tb.append(tr); });
    const hi = all[0], lo = all[all.length - 1]; $('netx-sum').textContent = M[0] + (cs ? ' (Land ' + cs + ')' : rg !== 'Alle' ? ' (' + rg + ')' : '') + ': höchster Wert ' + hi.name + ' (' + M[3](hi[st.m]) + '), niedrigster ' + lo.name + ' (' + M[3](lo[st.m]) + '). Niedrige Umsatzwerte je m² bei hoher Lagerfläche je Händler weisen auf Flächenpotenzial hin; die Auswertung ersetzt keine Wege- und Layoutanalyse vor Ort.';
  }
  const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
  on('netx-lv', 'click', (e) => { const b = e.target.closest('button'); if (b) { st.lv = b.dataset.l; draw(); } }); on('netx-m', 'change', () => { st.m = $('netx-m').value; draw(); });
  window.__netx = { calc, MET };
  window.__hodDraw.netx = draw;
})();
