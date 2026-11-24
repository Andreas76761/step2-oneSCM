(function () {
  const H = window.__hod; if (!H) return;
  const FMT = H.FMT, $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2), sg = (v) => (v >= 0 ? '+' : '−');
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const SHR = { DACH: 0.34, Westeuropa: 0.27, Südeuropa: 0.16, Nordeuropa: 0.08, Osteuropa: 0.15 };
  const AGES = ['0-2 J', '3-5 J', '6-8 J', '9-12 J', '13+ J'];
  const fillSel = (sel, items, v) => { if (sel.dataset.n !== String(items.length)) { sel.replaceChildren(); items.forEach(([val, lab]) => { const o = el('option', null, lab); o.value = val; sel.append(o); }); sel.dataset.n = String(items.length); } sel.value = v; };
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, svg, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };
  const pearson = (a, b) => { const n = a.length, ma = d3.mean(a), mb = d3.mean(b); let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return saa && sbb ? sab / Math.sqrt(saa * sbb) : 0; };

  // ======================= Sankey =======================
  const sk = { m: 'rev', y: 2026 };
  $('an-sk-m').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { sk.m = b.dataset.m; drawAn(); } });
  $('an-sk-y').addEventListener('change', () => { sk.y = +$('an-sk-y').value; drawAn(); });
  function sankey(box, layers, links, o) {
    const c = mkSvg(box, o.h || 380); if (!c) return; const { w, g } = c, Hh = o.h || 380, padY = 9, nw = 14, ml = o.ml || 110, mr = o.mr || 150;
    const nodes = layers.flat(), val = new Map(), outS = new Map(), inS = new Map(); nodes.forEach((n) => { outS.set(n.id, 0); inS.set(n.id, 0); });
    links.forEach((l) => { outS.set(l.s, outS.get(l.s) + l.v); inS.set(l.t, inS.get(l.t) + l.v); });
    nodes.forEach((n) => val.set(n.id, n.value != null ? n.value : Math.max(outS.get(n.id), inS.get(n.id))));
    const top0 = o.heads ? 18 : 0, sc = Math.min(...layers.map((L) => (Hh - 20 - top0 - (L.length - 1) * padY) / (d3.sum(L, (n) => val.get(n.id)) || 1)));
    const xs = d3.scalePoint(layers.map((_, i) => i), [ml, w - mr - nw]), pos = new Map();
    layers.forEach((L, i) => { const tot = d3.sum(L, (n) => val.get(n.id)) * sc + (L.length - 1) * padY; let y = top0 + (Hh - top0 - tot) / 2; L.forEach((n) => { pos.set(n.id, { x: xs(i), y, h: Math.max(1, val.get(n.id) * sc) }); y += Math.max(1, val.get(n.id) * sc) + padY; }); });
    const oy = new Map(), iy = new Map(); nodes.forEach((n) => { oy.set(n.id, pos.get(n.id).y); iy.set(n.id, pos.get(n.id).y); });
    const ordered = links.slice().sort((a, b) => pos.get(a.t).y - pos.get(b.t).y || pos.get(a.s).y - pos.get(b.s).y);
    ordered.forEach((l) => { l.y0 = oy.get(l.s) + l.v * sc / 2; oy.set(l.s, oy.get(l.s) + l.v * sc); });
    links.slice().sort((a, b) => pos.get(a.s).y - pos.get(b.s).y).forEach((l) => { l.y1 = iy.get(l.t) + l.v * sc / 2; iy.set(l.t, iy.get(l.t) + l.v * sc); });
    const tot0 = d3.sum(layers[0], (n) => val.get(n.id));
    if (o.heads) o.heads.forEach((t, i) => g.append('text').attr('x', xs(i) + nw / 2).attr('y', 11).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').style('font-weight', 600).text(t));
    g.selectAll('path.lk').data(links).join('path').attr('class', 'lk').attr('fill', 'none').attr('stroke', (l) => l.color).attr('stroke-opacity', 0.38).attr('stroke-width', (l) => Math.max(1, l.v * sc))
      .attr('d', (l) => d3.linkHorizontal()({ source: [pos.get(l.s).x + nw, l.y0], target: [pos.get(l.t).x, l.y1] }))
      .on('mousemove', function (ev, l) { d3.select(this).attr('stroke-opacity', 0.65); H.showTip(ev, [H.line(o.name(l.s) + ' → ' + o.name(l.t), 'tt'), H.line(o.fmt(l.v)), H.line(N1.format(l.v / tot0 * 100) + ' % des Ausgangswerts', 'tt')]); })
      .on('mouseleave', function () { d3.select(this).attr('stroke-opacity', 0.38); H.hideTip(); });
    nodes.forEach((n, i) => { const p = pos.get(n.id), li = layers.findIndex((L) => L.includes(n)), left = li === 0;
      g.append('rect').attr('x', p.x).attr('y', p.y).attr('width', nw).attr('height', p.h).attr('rx', 2).attr('fill', n.color || 'var(--color-fg-muted)')
        .on('mousemove', (ev) => H.showTip(ev, [H.line(n.label, 'tt'), H.line(o.fmt(val.get(n.id))), H.line(N1.format(val.get(n.id) / tot0 * 100) + ' % des Ausgangswerts', 'tt')])).on('mouseleave', () => H.hideTip());
      g.append('text').attr('x', left ? p.x - 6 : p.x + nw + 6).attr('y', p.y + p.h / 2).attr('dy', '0.32em').attr('text-anchor', left ? 'end' : 'start').attr('fill', 'var(--color-fg)').style('paint-order', 'stroke').attr('stroke', 'var(--color-panel)').attr('stroke-width', 3).text(n.label + (p.h > 12 ? ' · ' + o.fmt(val.get(n.id)) : '')); });
  }
  function drawSankey() {
    const rg = H.REGSEL(), box = $('ch-an-sk'); $('an-sk-y-wrap').hidden = sk.m !== 'parc';
    $('an-sk-m').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === sk.m)));
    if (sk.m === 'rev') {
      const ws = H.ready(box, 'ws_segments', (r) => !H.M() || r.month <= H.M()); if (!ws) return;
      const ser = new Map(); ws.forEach((r) => { const s = ser.get(r.series) || { lohn: 0, teile: 0 }; s.lohn += r.lohn_k; s.teile += r.teile_k; ser.set(r.series, s); });
      const regs = Object.keys(SHR).filter((r) => rg === 'Alle' || r === rg), col = (i) => dash.colors[i % dash.colors.length];
      const sList = [...ser].sort((a, b) => (b[1].lohn + b[1].teile) - (a[1].lohn + a[1].teile)).map((x) => x[0]);
      const layers = [regs.map((r, i) => ({ id: 'R' + r, label: r, color: col(i) })), sList.map((s) => ({ id: 'S' + s, label: s, color: 'var(--cds-chart-muted, #9aa0a8)' })), [{ id: 'Alohn', label: 'Lohn', color: dash.colors[0] }, { id: 'Ateile', label: 'Teile', color: dash.colors[1] }]];
      const links = []; regs.forEach((r, i) => sList.forEach((s) => { const t = ser.get(s); links.push({ s: 'R' + r, t: 'S' + s, v: (t.lohn + t.teile) * SHR[r], color: col(i) }); }));
      const sh = d3.sum(regs, (r) => SHR[r]); sList.forEach((s) => { const t = ser.get(s); links.push({ s: 'S' + s, t: 'Alohn', v: t.lohn * sh, color: dash.colors[0] }, { s: 'S' + s, t: 'Ateile', v: t.teile * sh, color: dash.colors[1] }); });
      const nm = (id) => (layers.flat().find((n) => n.id === id) || {}).label; sankey(box, layers, links, { fmt: FMT.eur_k, name: nm, ml: 190, mr: 200 });
      const tot = d3.sum(links.filter((l) => l.t === 'Alohn' || l.t === 'Ateile'), (l) => l.v), lohn = d3.sum(links.filter((l) => l.t === 'Alohn'), (l) => l.v), top = sList[0];
      $('an-sk-sum').textContent = 'Werkstattumsatz ' + (rg === 'Alle' ? 'aller Regionen' : rg) + ' bis ' + H.mlabel(H.M() || ws[ws.length - 1].month) + ': ' + FMT.eur_k(tot) + ' – davon Lohn ' + N0.format(lohn / tot * 100) + ' % und Teile ' + N0.format((tot - lohn) / tot * 100) + ' %. Größte Baureihe: ' + top + ' (' + N0.format((ser.get(top).lohn + ser.get(top).teile) * sh / tot * 100) + ' %). Regionsanteile sind Modellannahmen.';
      $('an-sk-rec').textContent = 'Teile-Anteil je Baureihe prüfen: Baureihen mit niedrigem Teileanteil bieten Potenzial für Teile-Mitverkauf (Cross-Selling im Werkstattauftrag).';
    } else {
      const d = H.ready(box, 'vp_parc'); if (!d) return; fillSel($('an-sk-y'), [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map((y) => [y, y + '']), sk.y);
      const a = (y) => { const o = { parc: 0, new_k: 0, scrap: 0, acc: 0, served: 0, un: 0 }; d.forEach((r) => { if (r.region === rg && r.year === y) { o.parc += r.parc_k; o.new_k += r.new_k; o.scrap += r.scrap_k; o.acc += r.accident_k; o.served += r.served_k; o.un += r.unserved_k; } }); return o; };
      const c = a(sk.y), p = a(sk.y - 1), k = (v) => v, fm = (v) => N1.format(v) + ' Tsd.';
      const layers = [[{ id: 'p', label: 'Bestand ' + (sk.y - 1), color: dash.colors[0] }, { id: 'n', label: 'Neufahrzeuge', color: dash.colors[2] || '#2b9a66' }], [{ id: 'e', label: 'Bestand ' + sk.y, color: dash.colors[0] }, { id: 'sc', label: 'Verschrottung', color: H.CRIT }, { id: 'ac', label: 'Unfall', color: '#e08a3c' }], [{ id: 'b', label: 'Betreut', color: dash.colors[1] }, { id: 'u', label: 'Unbetreut', color: 'var(--cds-chart-muted, #9aa0a8)' }]];
      const links = [{ s: 'p', t: 'e', v: p.parc - c.scrap - c.acc, color: dash.colors[0] }, { s: 'n', t: 'e', v: c.new_k, color: dash.colors[2] || '#2b9a66' }, { s: 'p', t: 'sc', v: c.scrap, color: H.CRIT }, { s: 'p', t: 'ac', v: c.acc, color: '#e08a3c' }, { s: 'e', t: 'b', v: c.served, color: dash.colors[1] }, { s: 'e', t: 'u', v: c.un, color: '#9aa0a8' }];
      const nm = (id) => (layers.flat().find((n) => n.id === id) || {}).label; sankey(box, layers, links, { fmt: fm, name: nm, ml: 170, mr: 170 });
      $('an-sk-sum').textContent = 'Bestandsfluss ' + sk.y + ' (' + (rg === 'Alle' ? 'alle Regionen' : rg) + '): von ' + fm(p.parc) + ' Fahrzeugen bleiben nach ' + fm(c.scrap) + ' Verschrottung und ' + fm(c.acc) + ' Unfall-Abgang ' + fm(p.parc - c.scrap - c.acc) + ' im Bestand; ' + fm(c.new_k) + ' Neufahrzeuge kommen hinzu → ' + fm(c.parc) + ', davon betreut ' + fm(c.served) + ' (' + N1.format(c.served / c.parc * 100) + ' %).';
      $('an-sk-rec').textContent = c.un / c.parc > 0.3 ? 'Knapp ein Drittel des Bestands bleibt unbetreut – Rückgewinnung (Halterwechsel-Ansprache, Flotten, Serviceaktionen) hat den größten Hebel.' : 'Betreuungsquote solide – Fokus auf Neufahrzeug-Bindung ab dem ersten Service.';
    }
  }

  // ======================= Multichart =======================
  const KP = { rev: ['Umsatz', 'mo_monthly', 'revenue_k', 'eur_k'], ord: ['Aufträge', 'mo_monthly', 'orders', 'int'], gm: ['Rohertragsmarge', 'pm_monthly', 'gross_margin_pct', 'pct'], disc: ['Rabattquote', 'pr_monthly', 'discount_pct', 'pct'],
    otif: ['OTIF', 'lg_monthly', 'otif_pct', 'pct'], claims: ['Reklamationen', 'wa_monthly', 'claims', 'int'], part: ['Schulungsteilnehmer', 'tr_monthly', 'participants', 'int'], clv: ['CLV', 'cu_monthly', 'clv_eur', 'eur0'], csi: ['CSI', 'cu_monthly', 'csi_score', 'idx'],
    nps: ['NPS', 'cu_monthly', 'nps_score', 'idx'], roi: ['Marketing-ROI', 'mt_monthly', 'marketing_roi', 'pct'], leads: ['Leads', 'mt_monthly', 'leads', 'int'], gap: ['Preisabstand Wettbewerb', 'co_monthly', 'price_gap_pct', 'pct'], win: ['Win-Rate', 'co_monthly', 'win_rate_pct', 'pct'], stock: ['Bestandswert', 'iv_monthly', 'stock_value_k', 'eur_k'] };
  const mc = { b: 'rev', l1: 'gm', l2: 'roi' }, dummy = document.createElement('div');
  ['b', 'l1', 'l2'].forEach((k) => $('an-mc-' + k).addEventListener('change', () => { mc[k] = $('an-mc-' + k).value; drawAn(); }));
  function series(key) {
    if (key === 'none') return null; const [lab, ds, f, unit] = KP[key], rg = H.REGSEL(), dS = H.DS(), M = H.M();
    const rows = H.ready(dummy, ds, (r) => r.region === rg && (r.dim == null || (r.dim === dS.dim && r.member === dS.member)) && (!M || r.month <= M)); if (!rows) return undefined;
    return { key, lab, unit, f, rows };
  }
  function drawMulti() {
    const box = $('ch-an-mc'); const opts = Object.keys(KP).map((k) => [k, KP[k][0]]);
    fillSel($('an-mc-b'), opts, mc.b); fillSel($('an-mc-l1'), opts, mc.l1); fillSel($('an-mc-l2'), [['none', '– keine –'], ...opts], mc.l2);
    const base = H.ready(box, KP[mc.b][1]); if (!base) return;
    const B = series(mc.b), L1 = series(mc.l1), L2 = series(mc.l2); if (!B || L1 === undefined || L2 === undefined || !L1) return;
    const months = B.rows.map((r) => r.month), val = (S) => (S ? months.map((m) => { const r = S.rows.find((q) => q.month === m); return r ? r[S.f] : null; }) : null);
    const vb = val(B), v1 = val(L1), v2 = val(L2); const c = mkSvg(box, 320); if (!c) return; const { w, g } = c, Hh = 320, MG = { t: 36, r: 56 + (L2 ? 54 : 0), b: 30, l: 62 };
    const x = d3.scaleBand(months, [MG.l, w - MG.r]).padding(0.25), yb = d3.scaleLinear([0, d3.max(vb) * 1.12], [Hh - MG.b, MG.t]);
    const ext = (v) => { const lo = d3.min(v), hi = d3.max(v), p = (hi - lo) * 0.2 || 1; return [lo - p, hi + p]; };
    const y1 = d3.scaleLinear(ext(v1), [Hh - MG.b, MG.t]), y2 = v2 ? d3.scaleLinear(ext(v2), [Hh - MG.b, MG.t]) : null, c1 = dash.colors[1], c2 = dash.colors[2] || '#2b9a66';
    yb.ticks(4).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', yb(t)).attr('y2', yb(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', MG.l - 6).attr('y', yb(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', dash.colors[0]).text(FMT[B.unit](t)); });
    y1.ticks(4).forEach((t) => g.append('text').attr('x', w - MG.r + 6).attr('y', y1(t)).attr('dy', '0.32em').attr('fill', c1).text(FMT[L1.unit](t)));
    if (y2) y2.ticks(4).forEach((t) => g.append('text').attr('x', w - MG.r + 60).attr('y', y2(t)).attr('dy', '0.32em').attr('fill', c2).text(FMT[L2.unit](t)));
    const step = Math.ceil(months.length / Math.max(2, Math.floor((w - MG.l - MG.r) / 56)));
    months.forEach((m, i) => { if (i % step === 0) g.append('text').attr('x', x(m) + x.bandwidth() / 2).attr('y', Hh - 10).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(H.mlabel(m)); });
    months.forEach((m, i) => g.append('rect').attr('x', x(m)).attr('width', x.bandwidth()).attr('y', yb(vb[i])).attr('height', yb(0) - yb(vb[i])).attr('rx', 3).attr('fill', dash.colors[0]).attr('fill-opacity', 0.72));
    const xp = (m) => x(m) + x.bandwidth() / 2, line = (v, y, col, dsh) => { g.append('path').datum(months.map((m, i) => [xp(m), y(v[i])])).attr('fill', 'none').attr('stroke', col).attr('stroke-width', 2.4).attr('stroke-dasharray', dsh).attr('stroke-linejoin', 'round').attr('d', d3.line()); months.forEach((m, i) => g.append('circle').attr('cx', xp(m)).attr('cy', y(v[i])).attr('r', 3).attr('fill', col)); };
    line(v1, y1, c1, null); if (y2) line(v2, y2, c2, '6 3');
    [[dash.colors[0], B.lab + ' (Balken, links)', 0], [c1, L1.lab + ' (Linie, rechts)', 1], ...(L2 ? [[c2, L2.lab + ' (gestrichelt, 2. Achse)', 2]] : [])].forEach(([col, t, i]) => { const px = MG.l + i * 210; g.append('rect').attr('class', 'lgd').attr('x', px).attr('y', 6).attr('width', 12).attr('height', 12).attr('rx', 2).attr('fill', col); g.append('text').attr('class', 'lgd').attr('x', px + 17).attr('y', 16).attr('fill', 'var(--color-fg)').text(t); });
    g.append('rect').attr('x', MG.l).attr('y', MG.t).attr('width', w - MG.l - MG.r).attr('height', Hh - MG.t - MG.b).attr('fill', 'transparent').on('mousemove', (ev) => {
      const px = d3.pointer(ev)[0], i = Math.max(0, Math.min(months.length - 1, Math.floor((px - MG.l) / (x.step() || 1)))), it = [H.line(H.mlabel(months[i]), 'tt'), H.line(B.lab + ': ' + FMT[B.unit](vb[i])), H.line(L1.lab + ': ' + FMT[L1.unit](v1[i]))]; if (L2) it.push(H.line(L2.lab + ': ' + FMT[L2.unit](v2[i]))); H.showTip(ev, it);
    }).on('mouseleave', () => H.hideTip());
    const r1 = pearson(vb, v1), r2 = v2 ? pearson(vb, v2) : null, w_ = (r) => (Math.abs(r) > 0.7 ? 'starker' : Math.abs(r) > 0.4 ? 'mäßiger' : 'schwacher') + ' ' + (r >= 0 ? 'gleichlaufender' : 'gegenläufiger') + ' Zusammenhang';
    $('an-mc-sum').textContent = B.lab + ' und ' + L1.lab + ': ' + w_(r1) + ' (Korrelation ' + N2.format(r1) + ')' + (L2 ? '; ' + B.lab + ' und ' + L2.lab + ': ' + w_(r2) + ' (' + N2.format(r2) + ')' : '') + '. Hinweis: Korrelation über 12 Monate zeigt Gleichlauf, keinen Beleg für Ursache und Wirkung.';
    $('an-mc-rec').textContent = Math.abs(r1) > 0.7 ? 'Enger Zusammenhang: ' + L1.lab + ' als Frühindikator für ' + B.lab + ' im Monatsreview mitführen.' : 'Kein enger Zusammenhang – Treiber getrennt steuern und weitere KPI-Kombinationen prüfen.';
  }

  // ======================= LCC: Altersscheibe auf der Y-Achse =======================
  const LK = { veh: ['Fahrzeugbestand', 'Tsd.', (v) => N1.format(v) + ' Tsd.'], ret: ['Retention', '%', (v) => N1.format(v) + ' %'], opv: ['Aufträge je 100 Fahrzeuge', '', (v) => N1.format(v)], rpv: ['Umsatz je Fahrzeug (Monat)', '€', (v) => N1.format(v) + ' €'],
    lohn: ['Lohnumsatz', 'k€', FMT.eur_k], teile: ['Teileumsatz', 'k€', FMT.eur_k], ts: ['Teileanteil am Werkstattumsatz', '%', (v) => N1.format(v) + ' %'], bay: ['Hebebühnentage', 'Tage', (v) => N0.format(v) + ' Tage'] };
  const lc = { t: 'bar', k: 'ret', s: 'Alle' };
  $('an-lc-t').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { lc.t = b.dataset.t; drawAn(); } });
  $('an-lc-k').addEventListener('change', () => { lc.k = $('an-lc-k').value; drawAn(); }); $('an-lc-s').addEventListener('change', () => { lc.s = $('an-lc-s').value; drawAn(); });
  function agg(rows, k, sh) {
    const veh = d3.sum(rows, (r) => r.vehicles_k), lohn = d3.sum(rows, (r) => r.lohn_k), teile = d3.sum(rows, (r) => r.teile_k), ord = d3.sum(rows, (r) => r.orders);
    return { veh: veh * sh, ret: d3.sum(rows, (r) => r.retention_pct * r.vehicles_k) / (veh || 1), opv: ord / ((veh * 10) || 1), rpv: (lohn + teile) / (veh || 1), lohn: lohn * sh, teile: teile * sh, ts: teile / ((lohn + teile) || 1) * 100, bay: d3.sum(rows, (r) => r.bay_days) * sh }[k];
  }
  function drawLcc() {
    const box = $('ch-an-lc'), ws = H.ready(box, 'ws_segments'); if (!ws) return;
    const months = [...new Set(ws.map((r) => r.month))].sort(), m = H.M() && months.includes(H.M()) ? H.M() : months[months.length - 1], sers = [...new Set(ws.map((r) => r.series))];
    fillSel($('an-lc-k'), Object.keys(LK).map((k) => [k, LK[k][0]]), lc.k); fillSel($('an-lc-s'), [['Alle', 'Alle Baureihen'], ...sers.map((s) => [s, s])], lc.s);
    $('an-lc-t').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.t === lc.t)));
    const rg = H.REGSEL(), sh = rg === 'Alle' ? 1 : SHR[rg] || 1, fm = LK[lc.k][2], cur = ws.filter((r) => r.month === m);
    const total = AGES.map((a) => agg(cur.filter((r) => r.age === a && (lc.s === 'Alle' || r.series === lc.s)), lc.k, sh));
    const per = lc.s === 'Alle' ? sers.map((s) => ({ s, v: AGES.map((a) => agg(cur.filter((r) => r.age === a && r.series === s), lc.k, sh)) })) : [];
    const c = mkSvg(box, 330); if (!c) return; const { w, g } = c, Hh = 330, MG = { t: 26, r: 70, b: 30, l: 74 }, y = d3.scaleBand(AGES, [MG.t, Hh - MG.b]).padding(0.28);
    const all = lc.t === 'bar' ? total : total.concat(per.flatMap((p) => p.v)), lo = lc.t === 'bar' ? 0 : Math.min(0, d3.min(all)), x = d3.scaleLinear([lo, d3.max(all) * 1.1], [MG.l, w - MG.r]);
    x.ticks(5).forEach((t) => { g.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', MG.t).attr('y2', Hh - MG.b).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', x(t)).attr('y', Hh - 12).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(N1.format(t).replace(',0', '')); });
    AGES.forEach((a) => g.append('text').attr('x', MG.l - 8).attr('y', y(a) + y.bandwidth() / 2).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(a));
    g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 12).attr('fill', 'var(--color-fg-muted)').text('Altersscheibe (Y) · ' + LK[lc.k][0] + (LK[lc.k][1] ? ' in ' + LK[lc.k][1] : '') + ' (X)');
    const cy = (a) => y(a) + y.bandwidth() / 2, tip = (ev, s, a, v) => H.showTip(ev, [H.line((s || 'Alle Baureihen') + ' · ' + a, 'tt'), H.line(LK[lc.k][0] + ': ' + fm(v))]);
    if (lc.t === 'bar') AGES.forEach((a, i) => { g.append('rect').attr('x', x(lo)).attr('y', y(a)).attr('width', Math.max(1, x(total[i]) - x(lo))).attr('height', y.bandwidth()).attr('rx', 4).attr('fill', dash.colors[0]).on('mousemove', (ev) => tip(ev, lc.s === 'Alle' ? null : lc.s, a, total[i])).on('mouseleave', () => H.hideTip()); g.append('text').attr('x', x(total[i]) + 6).attr('y', cy(a)).attr('dy', '0.32em').attr('fill', 'var(--color-fg-muted)').text(fm(total[i])); });
    else {
      per.forEach((p, k) => { if (lc.t === 'line') g.append('path').datum(AGES.map((a, i) => [x(p.v[i]), cy(a)])).attr('fill', 'none').attr('stroke', dash.colors[k % dash.colors.length]).attr('stroke-opacity', 0.45).attr('stroke-width', 1.4).attr('d', d3.line());
        AGES.forEach((a, i) => g.append('circle').attr('cx', x(p.v[i])).attr('cy', cy(a)).attr('r', 3).attr('fill', dash.colors[k % dash.colors.length]).attr('fill-opacity', 0.65).on('mousemove', (ev) => tip(ev, p.s, a, p.v[i])).on('mouseleave', () => H.hideTip())); });
      if (lc.t === 'line') g.append('path').datum(AGES.map((a, i) => [x(total[i]), cy(a)])).attr('fill', 'none').attr('stroke', 'var(--color-fg)').attr('stroke-width', 2.8).attr('stroke-linejoin', 'round').attr('d', d3.line());
      AGES.forEach((a, i) => { g.append('circle').attr('cx', x(total[i])).attr('cy', cy(a)).attr('r', lc.t === 'dot' ? 7 : 5).attr('fill', 'var(--color-fg)').attr('stroke', 'var(--color-panel)').attr('stroke-width', 2).on('mousemove', (ev) => tip(ev, lc.s === 'Alle' ? null : lc.s, a, total[i])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', x(total[i]) + 10).attr('y', cy(a) - 9).attr('fill', 'var(--color-fg)').text(fm(total[i])); });
    }
    let drop = 0, di = 1; for (let i = 1; i < total.length; i++) { const d = total[i - 1] - total[i]; if (d > drop) { drop = d; di = i; } }
    $('an-lc-sum').textContent = LK[lc.k][0] + ' (' + (lc.s === 'Alle' ? 'alle Baureihen' : lc.s) + ', ' + H.mlabel(m) + (rg === 'Alle' ? '' : ', Region anteilig ' + rg) + '): ' + fm(total[0]) + ' in Altersscheibe ' + AGES[0] + ' → ' + fm(total[4]) + ' bei ' + AGES[4] + '. Größter Sprung zwischen ' + AGES[di - 1] + ' und ' + AGES[di] + ' (' + sg(total[di] - total[di - 1]) + fm(Math.abs(total[di] - total[di - 1])) + ').';
    $('an-lc-rec').textContent = 'Altersscheiben mit stärkstem Rückgang gezielt ansprechen (Bindungsprogramme, Aktionspreise für Verschleißteile); Maus über Altersscheibe oder Baureihe zeigt das passende Fahrzeugbild.';
  }
  // ======================= Sankey über 4 Jahre =======================
  const S4K = { parc_k: 'Fahrzeugbestand', served_k: 'Betreuter Bestand', unserved_k: 'Unbetreuter Bestand', new_k: 'Neufahrzeuge', scrap_k: 'Verschrottung', accident_k: 'Unfall (Totalschaden)', owner_change_k: 'Halterwechsel', fleet_k: 'Flottenfahrzeuge' };
  const s4 = { k: 'parc_k', g: 'ser', y: 2026 };
  $('an-s4-k').addEventListener('change', () => { s4.k = $('an-s4-k').value; drawAn(); }); $('an-s4-y').addEventListener('change', () => { s4.y = +$('an-s4-y').value; drawAn(); });
  $('an-s4-g').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { s4.g = b.dataset.g; drawAn(); } });
  function drawS4() {
    const box = $('ch-an-s4'), d = H.ready(box, 'vp_parc'); if (!d) return; const rg = H.REGSEL();
    fillSel($('an-s4-k'), Object.keys(S4K).map((k) => [k, S4K[k]]), s4.k); fillSel($('an-s4-y'), [2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => [y, y + ' – ' + (y + 3)]), s4.y);
    $('an-s4-g').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.g === s4.g)));
    const years = [0, 1, 2, 3].map((i) => s4.y + i), byS = s4.g === 'ser', rows = d.filter((r) => (byS ? r.region === rg : r.region !== 'Alle') && years.includes(r.year));
    const groups = [...new Set(rows.map((r) => (byS ? r.series : r.region)))], val = (gk, y) => d3.sum(rows.filter((r) => (byS ? r.series : r.region) === gk && r.year === y), (r) => r[s4.k]);
    groups.sort((a, b) => val(b, s4.y) - val(a, s4.y)); const col = (i) => dash.colors[i % dash.colors.length], fm = (v) => N1.format(v) + ' Tsd.';
    const layers = years.map((y) => groups.map((gk, i) => ({ id: y + '|' + gk, label: gk, value: val(gk, y), color: col(i) })));
    const links = []; years.slice(0, 3).forEach((y, yi) => groups.forEach((gk, i) => links.push({ s: y + '|' + gk, t: years[yi + 1] + '|' + gk, v: Math.min(val(gk, y), val(gk, years[yi + 1])), color: col(i) })));
    const nm = (id) => { const [y, gk] = id.split('|'); return gk + ' ' + y; };
    sankey(box, layers, links, { fmt: fm, name: nm, ml: 150, mr: 190, h: 400, heads: years.map(String) });
    const t0 = d3.sum(groups, (gk) => val(gk, years[0])), t3 = d3.sum(groups, (gk) => val(gk, years[3])), ch = groups.map((gk) => ({ gk, d: val(gk, years[3]) - val(gk, years[0]) })).sort((a, b) => b.d - a.d);
    $('an-s4-sum').textContent = S4K[s4.k] + ' ' + (rg === 'Alle' || !byS ? 'alle Regionen' : rg) + ': ' + fm(t0) + ' (' + years[0] + ') → ' + fm(t3) + ' (' + years[3] + '), ' + (t3 >= t0 ? '+' : '−') + N1.format(Math.abs(t3 / t0 * 100 - 100)) + ' %. Beste Entwicklung: ' + ch[0].gk + ' (' + (ch[0].d >= 0 ? '+' : '−') + N1.format(Math.abs(ch[0].d)) + ' Tsd.), schwächste: ' + ch[ch.length - 1].gk + ' (' + (ch[ch.length - 1].d >= 0 ? '+' : '−') + N1.format(Math.abs(ch[ch.length - 1].d)) + ' Tsd.). Bandbreite = kleinerer Wert zweier Folgejahre, Knotenhöhe = Wert des Jahres.';
    $('an-s4-rec').textContent = t3 < t0 ? 'Rückläufige Entwicklung: Baureihen mit starkem Rückgang gezielt mit Bindungsprogrammen absichern und Kapazitäten anpassen.' : 'Wachsende Entwicklung: Kapazitäten und Teileverfügbarkeit der wachsenden Baureihen und Regionen rechtzeitig aufbauen.';
  }
  const MUT = 'var(--color-fg-muted)', GOOD = () => dash.colors[2] || '#2b9a66', BAD = () => H.CRIT, ACC = () => dash.colors[0], GRID = 'var(--cds-chart-grid)';
  // ======================= Korrelationsmatrix =======================
  const cmS = { m: 'all' };
  $('an-cm-m').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { cmS.m = b.dataset.m; drawAn(); } });
  const CORE = ['rev', 'gm', 'disc', 'otif', 'clv', 'csi', 'roi', 'gap', 'win'];
  function corrCalc() {
    const keys = cmS.m === 'core' ? CORE : Object.keys(KP), ss = keys.map((k) => series(k)); if (ss.some((x) => !x)) return null; const months = [...new Set(ss[0].rows.map((r) => r.month))].sort(), vals = ss.map((S) => months.map((m) => { const r = S.rows.find((q) => q.month === m); return r ? r[S.f] : null; }));
    if (vals.some((v) => v.some((x) => x == null)) || months.length < 4) return null; return { keys, labels: keys.map((k) => KP[k][0]), months, m: keys.map((_, i) => keys.map((__, j) => (i === j ? 1 : pearson(vals[i], vals[j])))) };
  }
  function drawCorr() {
    const box = $('ch-an-cm'); if (!H.ready(box, 'mo_monthly')) return; $('an-cm-m').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === cmS.m))); const r = corrCalc(); if (!r) { box.replaceChildren(el('p', 'mut', 'Zu wenige Monate für eine Korrelation (mindestens 4 Monate bis Periodenende).')); return; }
    const n = r.keys.length, w = box.clientWidth; if (!w) return; const L = 170, T = 110, cs = Math.max(26, Math.min(46, (w - L - 10) / n)), Hh = T + n * cs + 6, c = mkSvg(box, Hh), { g } = c;
    const col = (v) => (v >= 0 ? d3.interpolateRgb('#ffffff', '#2a6fdb')(Math.min(1, v)) : d3.interpolateRgb('#ffffff', '#d64545')(Math.min(1, -v)));
    r.labels.forEach((l, j) => g.append('text').attr('transform', `translate(${L + j * cs + cs / 2},${T - 6}) rotate(-50)`).attr('fill', 'var(--color-fg)').text(l)); r.labels.forEach((l, i) => g.append('text').attr('x', L - 6).attr('y', T + i * cs + cs / 2).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(l));
    r.m.forEach((row, i) => row.forEach((v, j) => { g.append('rect').attr('x', L + j * cs + 1).attr('y', T + i * cs + 1).attr('width', cs - 2).attr('height', cs - 2).attr('rx', 3).attr('fill', col(v)).style('cursor', 'pointer').on('mousemove', (ev) => H.showTip(ev, [H.line(r.labels[i] + ' × ' + r.labels[j], 'tt'), H.line('Korrelation ' + N2.format(v)), H.line('Klick: im Multichart darstellen', 'tt')])).on('mouseleave', () => H.hideTip()).on('click', () => { mc.b = r.keys[i]; mc.l1 = r.keys[j === i ? (i + 1) % n : j]; drawAn(); $('ch-an-mc').scrollIntoView({ block: 'center' }); });
      if (cs >= 30) g.append('text').attr('x', L + j * cs + cs / 2).attr('y', T + i * cs + cs / 2).attr('dy', '0.32em').attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').style('font-size', '10px').style('pointer-events', 'none').text(N2.format(v)); }));
    const pairs = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push({ a: r.labels[i], b: r.labels[j], v: r.m[i][j] }); pairs.sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
    $('an-cm-sum').textContent = 'Stärkste Zusammenhänge (' + r.months.length + ' Monate): ' + pairs.slice(0, 3).map((p) => p.a + ' × ' + p.b + ' (' + N2.format(p.v) + ')').join('; ') + '. Blau = gleichläufig, rot = gegenläufig; Korrelation ist kein Beleg für Ursache und Wirkung.'; $('an-cm-rec').textContent = 'Klick auf eine Zelle zeigt das Paar im Multichart; sehr starke Paare (|r| > 0,8) als Frühindikatoren im Monatsreview mitführen.';
    window.__anPairs = pairs;
  }
  // ======================= Bullet-Charts je KPI =======================
  const blS = { b: 'core' }; $('an-bl-b').addEventListener('change', () => { blS.b = $('an-bl-b').value; drawAn(); });
  const BUN = [['mo', 'Market Operation'], ['pm', 'Productmanagement'], ['pr', 'Pricing'], ['lg', 'Logistik'], ['tr', 'Training'], ['wa', 'Warranty'], ['cu', 'Customer'], ['co', 'Competitor'], ['mt', 'Marketing']];
  function bulletRows(rg, which) {
    const src = which === 'core' ? 'head_kpis' : 'kpi_' + which, d = rowsOf(src); if (!d) return null; const ms = H.periodMonths(), pms = H.prevPeriodMonths(ms), need = new Set([...ms, ...pms]), g = new Map();
    d.forEach((r) => { if (r.region === rg && r.dim === 'Alle' && r.member === 'Alle' && need.has(r.month)) { const k = (r.bu || '') + '|' + r.kpi; if (!g.has(k)) g.set(k, []); g.get(k).push(r); } });
    return [...g.values()].map((x) => H.aggRow(x, ms, pms)).filter((r) => r && r.target != null && r.hib != null).map((r) => ({ r, pct: Math.min(160, r.hib ? r.value / r.target * 100 : r.target / r.value * 100) }));
  }
  function drawBullet() {
    const box = $('ch-an-bl'); if (!H.ready(box, 'mo_monthly')) return; fillSel($('an-bl-b'), [['core', 'Kern-KPIs aller Bereiche'], ...BUN.map(([i, n]) => [i, n])], blS.b); const rg = H.REGSEL(), rows = bulletRows(rg, blS.b); if (!rows) return;
    if (blS.b === 'core') rows.sort((a, b) => ((a.r.bu_label || '') < (b.r.bu_label || '') ? -1 : 1)); const RH = 30, c = mkSvg(box, 40 + rows.length * RH); if (!c) return; const { w, g } = c, L = 250, R = 190, x = d3.scaleLinear([0, 150], [L, w - R]);
    [[0, 90, '#f3d4d4'], [90, 100, '#f6ebcc'], [100, 150, '#d6ecdc']].forEach(([a, b, f]) => g.append('rect').attr('x', x(a)).attr('y', 4).attr('width', x(b) - x(a)).attr('height', 12).attr('rx', 2).attr('fill', f).attr('opacity', 0.7).attr('class', 'lgd'));
    g.append('text').attr('class', 'lgd').attr('x', x(0)).attr('y', 14).attr('dy', 0).attr('fill', 'transparent').text(''); [0, 50, 100, 150].forEach((t) => g.append('text').attr('x', x(t)).attr('y', 30).attr('text-anchor', 'middle').attr('fill', MUT).text(t + ' %')); g.append('text').attr('x', 4).attr('y', 14).attr('fill', MUT).text('Zielerfüllung in % (100 % = Ziel)');
    rows.forEach((o, i) => { const y = 38 + i * RH, r = o.r; g.append('text').attr('x', L - 8).attr('y', y + 17).attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text((blS.b === 'core' ? (r.bu_label || '') + ' · ' : '') + r.label);
      [[0, 90, '#f3d4d4'], [90, 100, '#f6ebcc'], [100, 150, '#d6ecdc']].forEach(([a, b, f]) => g.append('rect').attr('x', x(a)).attr('y', y + 3).attr('width', x(b) - x(a)).attr('height', 22).attr('fill', f).attr('opacity', 0.75));
      g.append('rect').attr('x', x(0)).attr('y', y + 10).attr('width', Math.max(2, x(Math.min(150, o.pct)) - x(0))).attr('height', 8).attr('rx', 2).attr('fill', o.pct >= 100 ? GOOD() : BAD()).on('mousemove', (ev) => H.showTip(ev, [H.line(r.label, 'tt'), H.line('Wert ' + (H.FMT[r.unit] ? H.FMT[r.unit](r.value) : N1.format(r.value)) + ' · Ziel ' + (H.FMT[r.unit] ? H.FMT[r.unit](r.target) : N1.format(r.target))), H.line('Zielerfüllung ' + N0.format(o.pct) + ' %', 'tt')])).on('mouseleave', () => H.hideTip());
      g.append('line').attr('x1', x(100)).attr('x2', x(100)).attr('y1', y + 4).attr('y2', y + 24).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2.5); g.append('text').attr('x', w - R + 10).attr('y', y + 17).attr('fill', MUT).text((H.FMT[r.unit] ? H.FMT[r.unit](r.value) : N1.format(r.value)) + ' / ' + (H.FMT[r.unit] ? H.FMT[r.unit](r.target) : N1.format(r.target))); });
    const ok = rows.filter((o) => o.pct >= 100).length, worst = rows.slice().sort((a, b) => a.pct - b.pct)[0]; $('an-bl-sum').textContent = ok + ' von ' + rows.length + ' Kennzahlen erreichen das Ziel (' + (rg === 'Alle' ? 'alle Regionen' : rg) + ', Zeitraum oben). Größte Lücke: ' + (worst ? worst.r.label + ' mit ' + N0.format(worst.pct) + ' % Zielerfüllung' : '–') + '. Balken = Ist (grün ab 100 %), Strich = Ziel, Hintergrund: rot < 90 %, gelb 90–100 %, grün ab 100 %; bei „niedriger ist besser“ ist die Zielerfüllung Ziel ÷ Ist.';
  }
  // ======================= Boxplot der Händlerstreuung =======================
  const bxS = { k: 'revenue_k', g: 'reg' }; const BXK = { revenue_k: ['Umsatz', 'sum', (v) => N1.format(v) + ' k€'], orders: ['Aufträge', 'sum', (v) => N0.format(v)], margin_pct: ['Marge', 'mean', (v) => N1.format(v) + ' %'], days_to_pay: ['Zahlungsdauer', 'mean', (v) => N1.format(v) + ' Tage'], overdue_pct: ['Überfällige Forderungen', 'mean', (v) => N1.format(v) + ' %'] };
  $('an-bx-k').addEventListener('change', () => { bxS.k = $('an-bx-k').value; drawAn(); }); $('an-bx-g').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { bxS.g = b.dataset.g; drawAn(); } });
  function boxCalc(k, grp, rg) {
    const dm = rowsOf('dealer_monthly'), dl = rowsOf('dealers'); if (!dm || !dl) return null; const info = new Map(dl.map((x) => [x.id, x])), ms = new Set(H.periodMonths()), by = new Map();
    dm.forEach((r) => { if (!ms.has(r.month)) return; const i = info.get(r.id); if (!i) return; if (grp === 'seg' && rg !== 'Alle' && i.region !== rg) return; const e = by.get(r.id) || { g: grp === 'reg' ? i.region : 'Segment ' + i.segment, v: [] }; e.v.push(r[k]); by.set(r.id, e); });
    const groups = new Map(); by.forEach((e) => { const v = BXK[k][1] === 'sum' ? d3.sum(e.v) : mean(e.v); if (!groups.has(e.g)) groups.set(e.g, []); groups.get(e.g).push(v); });
    return [...groups].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([gname, v]) => { v.sort((a, b) => a - b); const q1 = d3.quantile(v, 0.25), md = d3.quantile(v, 0.5), q3 = d3.quantile(v, 0.75), iqr = q3 - q1, lo = v.find((x) => x >= q1 - 1.5 * iqr), hi = [...v].reverse().find((x) => x <= q3 + 1.5 * iqr); return { g: gname, n: v.length, min: v[0], max: v[v.length - 1], q1, md, q3, lo, hi, out: v.filter((x) => x < lo || x > hi) }; });
  }
  function drawBox() {
    const box = $('ch-an-bx'); if (!H.ready(box, 'dealer_monthly')) return; fillSel($('an-bx-k'), Object.keys(BXK).map((k) => [k, BXK[k][0]]), bxS.k); $('an-bx-g').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.g === bxS.g)));
    const rg = H.REGSEL(), st = boxCalc(bxS.k, bxS.g, rg); if (!st || !st.length) return; const c = mkSvg(box, 340); if (!c) return; const { w, g } = c, MG = { t: 24, r: 20, b: 40, l: 70 }, fm = BXK[bxS.k][2], all = st.flatMap((s) => [s.min, s.max]), y = d3.scaleLinear([Math.min(...all) * 0.97, Math.max(...all) * 1.03], [340 - MG.b, MG.t]).nice(), x = d3.scaleBand(st.map((s) => s.g), [MG.l, w - MG.r]).padding(0.35);
    y.ticks(6).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', GRID); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', MUT).text(N1.format(t).replace(/,0$/, '')); });
    st.forEach((s, i) => { const cx = x(s.g) + x.bandwidth() / 2, tip = (ev) => H.showTip(ev, [H.line(s.g + ' (' + s.n + ' Händler)', 'tt'), H.line('Median ' + fm(s.md)), H.line('Q1 ' + fm(s.q1) + ' · Q3 ' + fm(s.q3), 'tt'), H.line('Whisker ' + fm(s.lo) + ' bis ' + fm(s.hi), 'tt'), H.line(s.out.length + ' Ausreißer', 'tt')]), col = dash.colors[i % dash.colors.length];
      g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', y(s.lo)).attr('y2', y(s.q1)).attr('stroke', 'var(--color-fg)'); g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', y(s.q3)).attr('y2', y(s.hi)).attr('stroke', 'var(--color-fg)'); [s.lo, s.hi].forEach((v) => g.append('line').attr('x1', cx - x.bandwidth() / 5).attr('x2', cx + x.bandwidth() / 5).attr('y1', y(v)).attr('y2', y(v)).attr('stroke', 'var(--color-fg)'));
      g.append('rect').attr('x', x(s.g)).attr('width', x.bandwidth()).attr('y', y(s.q3)).attr('height', Math.max(1, y(s.q1) - y(s.q3))).attr('rx', 3).attr('fill', col).attr('fill-opacity', 0.5).attr('stroke', col).on('mousemove', tip).on('mouseleave', () => H.hideTip()); g.append('line').attr('x1', x(s.g)).attr('x2', x(s.g) + x.bandwidth()).attr('y1', y(s.md)).attr('y2', y(s.md)).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2.5);
      s.out.forEach((v) => g.append('circle').attr('cx', cx).attr('cy', y(v)).attr('r', 3.2).attr('fill', 'none').attr('stroke', BAD()).on('mousemove', (ev) => H.showTip(ev, [H.line('Ausreißer in ' + s.g, 'tt'), H.line(fm(v))])).on('mouseleave', () => H.hideTip())); g.append('text').attr('x', cx).attr('y', 340 - 20).attr('text-anchor', 'middle').attr('fill', MUT).text(s.g + ' (n=' + s.n + ')'); });
    g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 12).attr('fill', MUT).text(BXK[bxS.k][0] + ' je Händler · Box = Q1 bis Q3, Strich = Median, Whisker = 1,5 × IQR, Kreis = Ausreißer');
    const widest = st.slice().sort((a, b) => (b.q3 - b.q1) / (b.md || 1) - (a.q3 - a.q1) / (a.md || 1))[0]; $('an-bx-sum').textContent = BXK[bxS.k][0] + ' je Händler im Zeitraum oben: Mediane liegen zwischen ' + fm(Math.min(...st.map((s) => s.md))) + ' und ' + fm(Math.max(...st.map((s) => s.md))) + '; die größte relative Streuung (IQR ÷ Median) zeigt ' + widest.g + '; insgesamt ' + d3.sum(st, (s) => s.out.length) + ' Ausreißer.';
  }
  window.__anx = { corrCalc, bulletRows, boxCalc, BXK, KP };
  function drawAn() { drawSankey(); drawS4(); drawMulti(); drawLcc(); drawCorr(); drawBullet(); drawBox(); }
  window.__hodDraw.an = drawAn;
})();
