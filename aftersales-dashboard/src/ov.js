(function () {
  const H = window.__hod; if (!H || !H.aggRow) return;
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N0 = NF(0), N1 = NF(1);
  const REG5 = ['DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'];
  const NAME = { mo: 'Market Operation', pm: 'Productmanagement', pr: 'Pricing', lg: 'Logistik', tr: 'Training', wa: 'Warranty', cu: 'Customer', co: 'Competitor', mt: 'Marketing', iv: 'Bestand', mk: 'Markt', dl: 'Händler' };
  const MUT = 'var(--color-fg-muted)', GOOD = 'var(--color-ok)', WARN = 'var(--color-warn)', BAD = 'var(--color-bad)';
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const sg = (v) => (v >= 0 ? '+' : '−'), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (r) => { const f = H.FMT[r.unit] || ((v) => N1.format(v)); return f(r.value); };
  const fmtV = (r, v) => { const f = H.FMT[r.unit] || ((v2) => N1.format(v2)); return f(v); };
  // Zielerfüllung in % (100 = Ziel erreicht), unabhängig von der Richtung der Kennzahl
  const short = (l) => { const m = /\(([^)]{2,10})\)\s*$/.exec(l); return m ? m[1] : l.length > 16 ? l.slice(0, 15) + '…' : l; }, pc = (v) => (Math.abs(v - 100) < 1.5 ? N1.format(v) : N0.format(v)) + ' %';
  const idx = (r) => (r.target == null || !r.target || !r.value ? null : r.hib ? r.value / r.target * 100 : r.target / r.value * 100);
  const stat = (i) => (i == null ? 'none' : i >= 100 ? 'good' : i >= 95 ? 'warn' : 'bad'), COL = { good: GOOD, warn: WARN, bad: BAD, none: MUT };
  const better = (r) => { if (r.hib == null) return null; if (r.delta == null || !isFinite(r.delta) || Math.abs(r.delta) < 0.05) return null; return r.hib ? r.delta > 0 : r.delta < 0; };
  function calc(bu) {
    const d = dash.data('kpi_' + bu); if (d.status !== 'ok') return null; const rg = H.REGSEL(), ds = H.DS(), ms = H.periodMonths(), pms = H.prevPeriodMonths(ms), need = new Set(ms.concat(pms));
    const base = d.data.filter((r) => r.dim === undefined || (r.dim === ds.dim && r.member === ds.member)), pick = (region) => base.filter((r) => r.region === region), rows = pick(rg); if (!rows.length) return null;
    const kp = []; rows.forEach((r) => { if (!kp.some((k) => k.kpi === r.kpi)) kp.push({ kpi: r.kpi, label: r.label }); });
    const aggFor = (rs, k) => H.aggRow(rs.filter((r) => r.kpi === k && need.has(r.month)), ms, pms);
    const list = kp.map((k) => { const a = aggFor(rows, k.kpi); if (!a) return null; const ser = rows.filter((r) => r.kpi === k.kpi).sort((x, y) => (x.month < y.month ? -1 : 1)); return Object.assign({}, a, { ser, i: idx(a), reg: REG5.map((q) => { const b = aggFor(pick(q), k.kpi); return b ? Object.assign({}, b, { i: idx(b) }) : null; }) }); }).filter(Boolean);
    return list.length ? { list, rg, ms } : null;
  }
  const spark = (host, ser, a) => {
    const w = 110, h = 34, x = d3.scalePoint(ser.map((r) => r.month), [3, w - 4]), vals = ser.map((r) => r.value).concat(ser.map((r) => r.target).filter((v) => v != null)), y = d3.scaleLinear([d3.min(vals), d3.max(vals)], [h - 4, 4]);
    const svg = d3.select(host).append('svg').attr('width', w).attr('height', h).attr('viewBox', `0 0 ${w} ${h}`).attr('aria-hidden', 'true'); const hasT = ser.some((r) => r.target != null);
    if (hasT) svg.append('path').attr('d', d3.line().x((r) => x(r.month)).y((r) => y(r.target))(ser)).attr('fill', 'none').attr('stroke', MUT).attr('stroke-dasharray', '3 3').attr('stroke-width', 1);
    svg.append('path').attr('d', d3.line().x((r) => x(r.month)).y((r) => y(r.value))(ser)).attr('fill', 'none').attr('stroke', COL[stat(a.i)] === MUT ? 'var(--color-fg)' : COL[stat(a.i)]).attr('stroke-width', 1.8);
    const last = ser[ser.length - 1]; svg.append('circle').attr('cx', x(last.month)).attr('cy', y(last.value)).attr('r', 2.8).attr('fill', COL[stat(a.i)] === MUT ? 'var(--color-fg)' : COL[stat(a.i)]);
  };
  function ring(host, share, total, ok) {
    const s = 86, r = 34, svg = d3.select(host).append('svg').attr('width', s).attr('height', s).attr('viewBox', `0 0 ${s} ${s}`).attr('role', 'img').attr('aria-label', total ? ok + ' von ' + total + ' Kennzahlen im Ziel' : 'Keine Zielwerte hinterlegt'), g = svg.append('g').attr('transform', `translate(${s / 2} ${s / 2})`), arc = d3.arc().innerRadius(r - 9).outerRadius(r).startAngle(0);
    g.append('path').attr('d', arc({ endAngle: Math.PI * 2 })).attr('fill', 'var(--cds-chart-grid)'); if (!total) { g.append('text').attr('text-anchor', 'middle').attr('dy', '0.1em').attr('fill', MUT).style('font-size', '15px').text('–'); g.append('text').attr('text-anchor', 'middle').attr('dy', '1.7em').attr('fill', MUT).style('font-size', '10px').text('ohne Ziel'); return; } g.append('path').attr('d', arc({ endAngle: Math.PI * 2 * share })).attr('fill', share >= 0.99 ? GOOD : share >= 0.5 ? WARN : BAD);
    g.append('text').attr('text-anchor', 'middle').attr('dy', '0.1em').attr('fill', 'var(--color-fg)').style('font-size', '18px').style('font-weight', 600).text(ok + '/' + total); g.append('text').attr('text-anchor', 'middle').attr('dy', '1.7em').attr('fill', MUT).style('font-size', '10px').text('im Ziel');
  }
  function bars(host, rows) {
    const w = Math.max(260, host.clientWidth || 360), L = 150, R = 54, rh = 26, h = 26 + rows.length * rh, x = d3.scaleLinear([0, 140], [L, w - R]), svg = d3.select(host).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${h}`).attr('role', 'img').attr('aria-label', 'Zielerfüllung je Kennzahl');
    const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)'); [[0, 95, BAD], [95, 100, WARN], [100, 140, GOOD]].forEach(([a, b, c]) => g.append('rect').attr('x', x(a)).attr('y', 14).attr('width', x(b) - x(a)).attr('height', rows.length * rh).attr('fill', c).attr('opacity', 0.07));
    g.append('line').attr('x1', x(100)).attr('x2', x(100)).attr('y1', 10).attr('y2', 16 + rows.length * rh).attr('stroke', MUT).attr('stroke-dasharray', '4 3'); g.append('text').attr('x', x(100)).attr('y', 9).attr('text-anchor', 'middle').attr('fill', MUT).text('Ziel 100 %');
    rows.forEach((r, k) => { const y = 18 + k * rh, c = COL[stat(r.i)], v = clamp(r.i, 0, 140); g.append('text').attr('x', L - 8).attr('y', y + 13).attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(short(r.label));
      g.append('rect').attr('x', L).attr('y', y + 3).attr('width', Math.max(2, x(v) - L)).attr('height', 15).attr('rx', 3).attr('fill', c).attr('opacity', 0.85).on('mousemove', (ev) => H.showTip(ev, [H.line(r.label, 'tt'), H.line('Ist ' + fmt(r) + ' · Ziel ' + fmtV(r, r.target)), H.line('Zielerfüllung ' + N1.format(r.i) + ' %')])).on('mouseleave', () => H.hideTip());
      g.append('text').attr('x', Math.min(x(v) + 5, w - R + 4)).attr('y', y + 15).attr('fill', 'var(--color-fg)').text(pc(r.i)); });    try { if (window.__a11y) window.__a11y.table(host, { summary: rows.length + ' Kennzahlen, Zielerfüllung von ' + pc(d3.min(rows, (r) => r.i)) + ' bis ' + pc(d3.max(rows, (r) => r.i)), head: ['Kennzahl', 'Ist', 'Ziel', 'Zielerfüllung'], rows: rows.map((r) => [r.label, fmt(r), fmtV(r, r.target), pc(r.i)]) }); } catch (e) { /* optional */ }
  }
  function matrix(host, list, rg, cats) {
    cats = cats || REG5;
    const rows = list.filter((r) => r.i != null).slice(0, 6), t = el('table', 'tbl ovm'), hd = el('tr'); hd.append(el('th', null, cats === REG5 ? 'Region' : 'Gruppe')); rows.forEach((r) => { const th = el('th', 'num', short(r.label)); th.title = r.label; hd.append(th); }); const thead = el('thead'); thead.append(hd); t.append(thead);
    const tb = el('tbody'); cats.forEach((q, qi) => { const tr = el('tr', q === rg ? 'sel' : ''); tr.append(el('td', null, q)); rows.forEach((r) => { const c = r.reg[qi], td = el('td', 'num ovcell', c && c.i != null ? pc(c.i) : '–'); if (c && c.i != null) { const s = stat(c.i), tint = { good: 'rgba(43,154,102,0.22)', warn: 'rgba(224,160,48,0.28)', bad: 'rgba(214,69,69,0.26)' }[s]; td.style.background = tint; td.title = q + ' · ' + r.label + ': ' + fmt(c) + ' (Ziel ' + fmtV(c, c.target) + ')'; } tr.append(td); }); tb.append(tr); }); t.append(tb); host.append(t);
  }
  function notes(adv, c) {
    const list = c.list, tg = list.filter((r) => r.i != null), below = tg.filter((r) => r.i < 100).sort((a, b) => a.i - b.i), out = [], rec = [], ch = (k) => (adv ? adv.find((q) => q.y === k) : null);
    out.push(tg.length ? (tg.length - below.length) + ' von ' + tg.length + ' Kennzahlen mit Ziel sind erreicht' + (below.length ? '; am weitesten entfernt: ' + below.slice(0, 2).map((r) => r.label + ' (' + N0.format(r.i) + ' % des Ziels)').join(', ') + '.' : '.') : 'Für diesen Bereich sind keine Zielwerte hinterlegt; der Trend steht im Vordergrund.');
    const dv = list.filter((r) => better(r) !== null && r.delta != null).map((r) => ({ r, s: (better(r) ? 1 : -1) * Math.abs(r.delta) })).sort((a, b) => b.s - a.s); if (dv.length) { const b = dv[0], w = dv[dv.length - 1]; out.push('Gegenüber der Vorperiode verbessert sich am stärksten ' + b.r.label + (b.s > 0 ? ' (' + sg(b.r.delta) + N1.format(Math.abs(b.r.delta)) + (b.r.dk === 'pp' ? ' pp' : ' %') + ')' : '') + (w.s < 0 ? '; am stärksten verschlechtert sich ' + w.r.label + ' (' + sg(w.r.delta) + N1.format(Math.abs(w.r.delta)) + (w.r.dk === 'pp' ? ' pp' : ' %') + ').' : '.')); }
    const m = tg[0]; if (m) { const rr = m.reg.map((q, qi) => (q && q.i != null ? { n: (c.cats || REG5)[qi], i: q.i } : null)).filter(Boolean).sort((a, b) => a.i - b.i); if (rr.length > 1) out.push('Bei ' + m.label + ' liegt ' + rr[0].n + ' mit ' + N0.format(rr[0].i) + ' % am weitesten unter dem Ziel, ' + rr[rr.length - 1].n + ' mit ' + N0.format(rr[rr.length - 1].i) + ' % am besten (Spanne ' + N0.format(rr[rr.length - 1].i - rr[0].i) + ' Prozentpunkte).'); }
    below.slice(0, 3).forEach((r) => { const q = ch(r.kpi); rec.push(r.label + ': ' + (q && q.miss ? q.miss : 'Ursachen im Register analysieren und eine Maßnahme im Register Maßnahmen anlegen.')); });
    if (!below.length && tg.length) { const q = ch(tg[0].kpi); rec.push(q && q.ok ? q.ok : 'Niveau halten und die schwächste Region gezielt weiterentwickeln.'); }
    return { out, rec };
  }
  function slot(key) { const panel = document.getElementById(key); if (!panel || panel.hidden) return null; let card = document.getElementById('ov-' + key); if (!card) { card = el('div', 'card ovc'); card.id = 'ov-' + key; const intro = panel.querySelector('.intro'); if (intro && intro.nextSibling) panel.insertBefore(card, intro.nextSibling); else panel.prepend(card); } if (!card.clientWidth && !panel.clientWidth) return null; card.replaceChildren(); return card; }
  function fillKpi(card, title, c, adv, sub) {
    const hd = el('div', 'cardhead'); hd.append(el('h3', null, 'Management-Übersicht · ' + title)); card.append(hd);
    if (!c) { card.append(el('p', 'note', 'Übersicht wird geladen …')); return; }
    const tg = c.list.filter((r) => r.i != null), ok = tg.filter((r) => r.i >= 100).length, per = c.ms.length > 1 ? H.mlabel(c.ms[0]) + ' – ' + H.mlabel(c.ms[c.ms.length - 1]) : H.mlabel(c.ms[0]);
    card.append(el('p', 'note', (c.rg ? 'Auswahl ' + c.rg + ' · ' : '') + per + ' · Kennzahlen mit Ziel und Trend gegenüber der Vorperiode' + (sub || ' · Filter oben gelten (Region, Zeitraum, Baumuster, Alter, Produktgruppe).')));
    const top = el('div', 'ovtop'), rg = el('div', 'ovring'); ring(rg, tg.length ? ok / tg.length : 0, tg.length, ok); top.append(rg);
    const tiles = el('div', 'ovtiles'); c.list.forEach((r) => {
      const t = el('div', 'ovtile ov-' + stat(r.i)), b = better(r); t.append(el('div', 'kl', r.label)); t.append(el('div', 'kv', fmt(r)));
      const dl = el('div', 'ovd ' + (b === null ? '' : b ? 'up' : 'down'), (r.delta == null || !isFinite(r.delta) ? '–' : (r.delta > 0.05 ? '▲ ' : r.delta < -0.05 ? '▼ ' : '→ ') + sg(r.delta) + N1.format(Math.abs(r.delta)) + (r.dk === 'pp' ? ' pp' : ' %') + ' ggü. Vorperiode')); t.append(dl);
      t.append(el('div', 'ks', r.target != null ? 'Ziel ' + fmtV(r, r.target) + ' · ' + (r.i >= 100 ? 'erreicht' : pc(r.i) + ' des Ziels') : 'ohne Zielwert')); const sp = el('div', 'ovsp'); t.append(sp); spark(sp, r.ser, r); tiles.append(t); });
    top.append(tiles); card.append(top);
    const mid = el('div', 'ovmid'), l = el('div', 'ovcol'), rr = el('div', 'ovcol'); l.append(el('h4', null, 'Zielerfüllung je Kennzahl')); const bh = el('div', 'ovbars'); l.append(bh); rr.append(el('h4', null, (c.catTitle || 'Regionen') + ' im Vergleich (Zielerfüllung)')); const mh = el('div', 'ovmx'); rr.append(mh); mid.append(l, rr); card.append(mid);
    if (tg.length) bars(bh, tg.slice().sort((a, b) => a.i - b.i)); else bh.textContent = 'Keine Zielwerte vorhanden.'; matrix(mh, c.list, c.rg, c.cats);
    const n = notes(adv, c), bot = el('div', 'ovbot'), a = el('div', 'ovcol'), b2 = el('div', 'ovcol'); a.append(el('h4', null, 'Was fällt auf')); const ul = el('ul', 'dcl'); n.out.forEach((t) => ul.append(el('li', null, t))); a.append(ul); b2.append(el('h4', null, 'Empfohlene nächste Schritte')); const ul2 = el('ul', 'dcl'); n.rec.forEach((t) => ul2.append(el('li', null, t))); b2.append(ul2); bot.append(a, b2); card.append(bot);
  }
  function build(bu) { const card = slot(bu); if (!card) return; const cfg = (H.CFG && H.CFG.bus && H.CFG.bus[bu]) || null; fillKpi(card, NAME[bu], calc(bu), cfg ? cfg.charts : null); }
  const chain = (k, fn) => { const p = window.__hodDraw[k]; window.__hodDraw[k] = () => { if (p) p(); try { fn(); } catch (e) { /* Übersicht ist optional */ } }; };
  setTimeout(() => { Object.keys(NAME).forEach((bu) => chain(bu === 'dl' ? 'dl' : bu + 'x', () => build(bu))); }, 0);
  window.__ovx = { el, spark, ring, bars, matrix, stat, COL, pc, short, N0, N1, sg, slot, fillKpi, better, idx, fmt, fmtV, REG5, chain };
  window.__ov = { calc, NAME };
})();
